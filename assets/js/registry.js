/*!
 * 知闯岛 · 题库注册表
 * 内置题库文件通过 ZCD.registerPack({pack, questions}) 注册；
 * 自定义（导入）题库保存在本地存储中，由 ZCD.data 统一合并供页面读取。
 */
(function (root) {
  'use strict';
  root.ZCD = root.ZCD || {};
  var ZCD = root.ZCD;
  var util = ZCD.util;

  /** 支持的年级与学科 */
  var GRADES = [
    { grade: 3, label: '三年级', desc: '打好基础，认识更大的数字与短篇阅读', emoji: '🌱' },
    { grade: 4, label: '四年级', desc: '乘除升级，学会观察与推理', emoji: '🌿' },
    { grade: 5, label: '五年级', desc: '小数方程与图形面积，逻辑进阶', emoji: '🌳' },
    { grade: 6, label: '六年级', desc: '分数比例与综合应用，冲刺毕业', emoji: '🏔️' }
  ];

  var SUBJECTS = [
    { key: 'math', name: '数学', emoji: '🧮', color: '#2f6df6', soft: '#e8f0ff' },
    { key: 'chinese', name: '语文', emoji: '📖', color: '#e0553f', soft: '#ffeeea' },
    { key: 'english', name: '英语', emoji: '🔤', color: '#12a37a', soft: '#e5f8f2' },
    { key: 'science', name: '科学', emoji: '🔬', color: '#8b5cf6', soft: '#f2ecff' }
  ];

  var registry = { packs: [], questions: [], questionIndex: {}, raw: [] };
  var order = 0;

  function subjectMeta(key) {
    for (var i = 0; i < SUBJECTS.length; i++) if (SUBJECTS[i].key === key) return SUBJECTS[i];
    return { key: key || 'other', name: key || '其他', emoji: '📦', color: '#64748b', soft: '#eef2f7' };
  }

  function gradeLabel(g) {
    for (var i = 0; i < GRADES.length; i++) if (GRADES[i].grade === Number(g)) return GRADES[i].label;
    return (g || '?') + ' 年级';
  }

  /** 由 pack 与关卡序号生成稳定的关卡 ID */
  function levelId(packId, level) {
    return packId + '-l' + level;
  }

  /* ---------------- 选项位置平衡（固定规则，非随机） ----------------
   * 内置题库里正确选项容易集中在 C/D 位。这里对每个知识包做一次「固定」的选项循环移位，
   * 让 A/B/C/D 四个位置上的正确答案数量尽量均衡，避免孩子靠猜位置得分。
   * 选项对象整体移动（选项字母跟着内容走），题目含义与判分结果完全不变；
   * 只要题干或选项里出现「以上/都不/其余/选项A」这类依赖位置的说法就跳过。
   * 用户自己导入的题库不做任何改动，保持与文件完全一致。
   */
  function hasOrderRef(text) {
    return /以上|上述|都不|都对|其余|其他选项|选项\s*[A-D]|[A-D]\s*[、和与]/.test(text);
  }

  function balanceSingleOptions(q) {
    if (q.type !== 'single' || q.options.length !== 4) return false;
    if (q.options.map(function (o) { return o.key; }).join('') !== 'ABCD') return false;
    var allText = q.stem + ' ' + q.options.map(function (o) { return o.text; }).join(' ');
    if (hasOrderRef(allText)) return false;
    return true;
  }

  /** 按字母顺序贪婪分配正确选项位置，保证一个知识包内 A/B/C/D 数量基本相等 */
  function balancePackQuestions(list) {
    var LETTERS = 'ABCD';
    var counts = { A: 0, B: 0, C: 0, D: 0 };
    for (var n = 0; n < list.length; n++) {
      var q = list[n];
      if (!balanceSingleOptions(q)) continue;
      var ai = -1;
      for (var i = 0; i < 4; i++) if (q.options[i].key === q.answer) ai = i;
      if (ai < 0) continue;
      var target = 0;
      for (var j = 1; j < 4; j++) {
        if (counts[LETTERS.charAt(j)] < counts[LETTERS.charAt(target)]) target = j;
      }
      var k = (ai - target + 4) % 4;
      if (k !== 0) {
        var moved = q.options.slice(k).concat(q.options.slice(0, k));
        q.options = moved.map(function (o, idx) { return { key: LETTERS.charAt(idx), text: o.text }; });
        q.answer = LETTERS.charAt(target);
      }
      counts[LETTERS.charAt(target)]++;
    }
  }

  function normQuestion(q, pack) {
    var out = {
      id: String(q.id || '').trim(),
      grade: Number(q.grade || (pack && pack.grade)),
      subject: q.subject || (pack && pack.subject),
      packId: q.packId || (pack && pack.id),
      level: Number(q.level) || 1,
      point: q.point || '综合练习',
      type: q.type || 'single',
      stem: q.stem || '',
      options: Array.isArray(q.options) ? q.options.map(function (o) {
        return { key: String(o.key || '').toUpperCase(), text: String(o.text === undefined ? '' : o.text) };
      }) : [],
      answer: String(q.answer || '').toUpperCase(),
      analysis: q.analysis || '',
      hint: q.hint ? String(q.hint).trim() : '',
      difficulty: Number(q.difficulty) || 1,
      _order: order++,
      custom: !!(pack && pack.custom)
    };
    return out;
  }

  /** 内置题库注册入口 */
  function registerPack(entry) {
    if (!entry || !entry.pack || !Array.isArray(entry.questions)) {
      if (root.console) console.warn('[知闯岛] registerPack 参数不合法，已忽略：', entry);
      return;
    }
    var pack = entry.pack;
    pack.custom = false;
    pack.levelNames = Array.isArray(pack.levelNames) ? pack.levelNames.slice() : [];
    pack.difficulty = Number(pack.difficulty) || 1;
    pack.grade = Number(pack.grade);
    registry.packs.push(pack);
    registry.raw.push({ pack: pack, questions: entry.questions });
    var list = [];
    for (var i = 0; i < entry.questions.length; i++) {
      var q = normQuestion(entry.questions[i], pack);
      list.push(q);
      registry.questions.push(q);
      if (q.id) registry.questionIndex[q.id] = q;
    }
    balancePackQuestions(list);
  }

  /* ---------------- 合并内置 + 自定义题库 ---------------- */

  function customPacks() {
    return (ZCD.store && ZCD.store.state().custom.packs) || [];
  }
  function customQuestions() {
    return (ZCD.store && ZCD.store.state().custom.questions) || [];
  }

  /** 全部知识包（内置 + 导入） */
  function allPacks() {
    return registry.packs.concat(customPacks());
  }

  function getPack(packId) {
    var all = allPacks();
    for (var i = 0; i < all.length; i++) if (all[i].id === packId) return all[i];
    return null;
  }

  /** 某年级 + 学科下的知识包 */
  function packsFor(grade, subject) {
    return allPacks().filter(function (p) {
      return Number(p.grade) === Number(grade) && p.subject === subject;
    });
  }

  function allQuestions() {
    return registry.questions.concat(customQuestions());
  }

  function questionsOf(packId) {
    return allQuestions().filter(function (q) { return q.packId === packId; });
  }

  function levelsOf(pack) {
    if (!pack) return 0;
    var list = questionsOf(pack.id);
    var max = 0;
    for (var i = 0; i < list.length; i++) if (list[i].level > max) max = list[i].level;
    if (pack.levelCount) max = Math.max(max, Number(pack.levelCount) || 0);
    return max || 5;
  }

  function levelQuestions(packId, level) {
    return questionsOf(packId).filter(function (q) { return Number(q.level) === Number(level); });
  }

  function levelName(pack, level) {
    if (pack && pack.levelNames && pack.levelNames[level - 1]) return pack.levelNames[level - 1];
    return '第 ' + level + ' 关';
  }

  function questionById(id) {
    if (!id) return null;
    if (registry.questionIndex[id]) return registry.questionIndex[id];
    var cq = customQuestions();
    for (var i = 0; i < cq.length; i++) if (cq[i].id === id) return cq[i];
    return null;
  }

  /** 该知识包的知识点清单 */
  function pointsOf(packId, level) {
    var list = level ? levelQuestions(packId, level) : questionsOf(packId);
    return util.uniq(list.map(function (q) { return q.point; }));
  }

  /** 一个知识包全部关卡的清单（含解锁状态判断所需的最小信息） */
  function levelList(packId) {
    var pack = getPack(packId);
    var n = levelsOf(pack);
    var out = [];
    for (var i = 1; i <= n; i++) {
      out.push({
        packId: packId,
        level: i,
        id: levelId(packId, i),
        name: levelName(pack, i),
        count: levelQuestions(packId, i).length
      });
    }
    return out;
  }

  /** 统计用：所有「年级 × 学科」组合 */
  function gradeSubjectMatrix() {
    var out = [];
    for (var g = 0; g < GRADES.length; g++) {
      for (var s = 0; s < SUBJECTS.length; s++) {
        var packs = packsFor(GRADES[g].grade, SUBJECTS[s].key);
        if (packs.length) {
          out.push({ grade: GRADES[g].grade, gradeLabel: GRADES[g].label, subject: SUBJECTS[s], packs: packs });
        }
      }
    }
    return out;
  }

  ZCD.GRADES = GRADES;
  ZCD.SUBJECTS = SUBJECTS;
  ZCD.subjectMeta = subjectMeta;
  ZCD.gradeLabel = gradeLabel;
  ZCD.registerPack = registerPack;

  ZCD.data = {
    levelId: levelId,
    allPacks: allPacks,
    builtinPacks: function () { return registry.packs.slice(); },
    builtinQuestions: function () { return registry.questions.slice(); },
    getPack: getPack,
    packsFor: packsFor,
    allQuestions: allQuestions,
    questionsOf: questionsOf,
    levelsOf: levelsOf,
    levelQuestions: levelQuestions,
    levelName: levelName,
    levelList: levelList,
    questionById: questionById,
    pointsOf: pointsOf,
    gradeSubjectMatrix: gradeSubjectMatrix,
    stats: function () {
      return {
        packs: allPacks().length,
        builtinPacks: registry.packs.length,
        questions: allQuestions().length,
        builtinQuestions: registry.questions.length
      };
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);