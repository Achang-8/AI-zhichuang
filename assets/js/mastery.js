/*!
 * 知闯岛 · 轻量知识掌握评估（固定规则，不使用任何 AI 推断）
 *
 * 判定完全来自真实答题记录与错题复习情况：
 *   - 尚未学习：这一知识点的有效作答少于 3 次（没有记录的知识点也算这一类）
 *   - 已掌握  ：作答 ≥ 3 次 + 最近 3 次全对 + 该知识点没有待复习的错题
 *   - 还需练习：其余情况（近期不稳定，或还有错题没复习）
 * 这是给孩子看的学习提示，不是科学测验，也不代表绝对准确的能力评估。
 */
(function (root) {
  'use strict';
  root.ZCD = root.ZCD || {};
  var ZCD = root.ZCD;
  var util = ZCD.util;

  var RULES = {
    MIN_ATTEMPTS: 3,    // 至少完成 3 次有效作答
    RECENT_WINDOW: 3,   // 最近 3 次
    RECENT_SIZE: 5      // 保留最近 5 次结果
  };

  var STATUS = {
    new: { key: 'new', label: '尚未学习', emoji: '🌱', color: '#64798f', soft: '#eef2f7', order: 1 },
    practice: { key: 'practice', label: '还需练习', emoji: '💪', color: '#c8492f', soft: '#ffeeea', order: 0 },
    mastered: { key: 'mastered', label: '已掌握', emoji: '✅', color: '#0b7a5b', soft: '#e5f8f2', order: 2 }
  };

  var DISCLAIMER = '这是根据你的答题记录做出的轻量学习提示，方便安排下一步练习，不是考试成绩，也不代表绝对的能力水平。';

  /** 每个知识点下仍然「待复习」的错题数量 */
  function openWrongByPoint() {
    var map = {};
    var list = ZCD.store.wrongList();
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e.status === 'mastered') continue;
      var k = ZCD.store.pointKey(e.grade, e.subject, e.point);
      map[k] = (map[k] || 0) + 1;
    }
    return map;
  }

  /** 单点判定 */
  function judge(stat, openWrong) {
    var answered = stat ? (stat.answered || 0) : 0;
    var recent = (stat && stat.recent) ? stat.recent : [];
    var last3 = recent.slice(-RULES.RECENT_WINDOW);
    var recentWrong = 0;
    for (var i = 0; i < last3.length; i++) if (!last3[i]) recentWrong++;

    if (answered < RULES.MIN_ATTEMPTS) {
      return {
        status: 'new',
        reason: answered === 0
          ? '还没有做过这个知识点的题'
          : '只作答了 ' + answered + ' 次（判断掌握需要至少 ' + RULES.MIN_ATTEMPTS + ' 次练习）'
      };
    }
    if (openWrong > 0) {
      return { status: 'practice', reason: '还有 ' + openWrong + ' 道这个知识点的错题没有复习' };
    }
    if (last3.length >= RULES.RECENT_WINDOW && recentWrong === 0) {
      return { status: 'mastered', reason: '最近 ' + last3.length + ' 次都答对了，也没有待复习的错题' };
    }
    if (recentWrong > 0) {
      return { status: 'practice', reason: '最近 ' + last3.length + ' 次里有 ' + recentWrong + ' 次答错' };
    }
    return { status: 'practice', reason: '练习次数还不够稳定，再多做几次看看' };
  }

  /** 汇总所有知识点（包括题库里存在但从未作答的知识点） */
  function buildAll() {
    var stats = ZCD.store.pointStats();
    var openWrong = openWrongByPoint();
    var rows = {};

    // 1. 题库里的全部知识点
    var qs = ZCD.data.allQuestions();
    for (var i = 0; i < qs.length; i++) {
      var q = qs[i];
      if (!q.point) continue;
      var key = ZCD.store.pointKey(q.grade, q.subject, q.point);
      if (!rows[key]) {
        rows[key] = { key: key, grade: Number(q.grade), subject: q.subject, point: q.point, packIds: {}, questionCount: 0 };
      }
      rows[key].questionCount++;
      if (q.packId) rows[key].packIds[q.packId] = true;
    }
    // 2. 有记录但题库已删除的知识点（例如自定义题库被删掉之后）
    for (var k in stats) {
      if (!Object.prototype.hasOwnProperty.call(stats, k)) continue;
      var st = stats[k];
      if (!rows[k]) {
        rows[k] = { key: k, grade: st.grade, subject: st.subject, point: st.point, packIds: {}, questionCount: 0 };
      }
    }

    var out = [];
    for (var kk in rows) {
      if (!Object.prototype.hasOwnProperty.call(rows, kk)) continue;
      var r = rows[kk];
      var stat = stats[kk] || null;
      var j = judge(stat, openWrong[kk] || 0);
      var recentErr = 0;
      var recent = stat ? (stat.recent || []) : [];
      var last3 = recent.slice(-RULES.RECENT_WINDOW);
      for (var n = 0; n < last3.length; n++) if (!last3[n]) recentErr++;
      out.push({
        key: kk,
        grade: r.grade,
        subject: r.subject,
        point: r.point,
        packIds: Object.keys(r.packIds),
        questionCount: r.questionCount,
        answered: stat ? stat.answered : 0,
        correct: stat ? stat.correct : 0,
        accuracy: util.pct(stat ? stat.correct : 0, stat ? stat.answered : 0),
        recent: recent.slice(),
        recentWrong: recentErr,
        lastAt: stat ? (stat.lastAt || 0) : 0,
        wrongEvents: stat ? (stat.wrongEvents || 0) : 0,
        reviewCount: stat ? (stat.reviewCount || 0) : 0,
        reviewCorrect: stat ? (stat.reviewCorrect || 0) : 0,
        wrongOpen: openWrong[kk] || 0,
        status: j.status,
        reason: j.reason
      });
    }

    out.sort(function (a, b) {
      if (STATUS[a.status].order !== STATUS[b.status].order) return STATUS[a.status].order - STATUS[b.status].order;
      if (b.wrongOpen !== a.wrongOpen) return b.wrongOpen - a.wrongOpen;
      return (b.lastAt || 0) - (a.lastAt || 0);
    });
    return out;
  }

  /** 总览：状态计数 + 各学科分布 */
  function overview() {
    var all = buildAll();
    var counts = { new: 0, practice: 0, mastered: 0 };
    var bySubject = {};
    for (var i = 0; i < all.length; i++) {
      var r = all[i];
      counts[r.status]++;
      var s = bySubject[r.subject];
      if (!s) {
        s = bySubject[r.subject] = { subject: r.subject, total: 0, new: 0, practice: 0, mastered: 0, studied: 0, answered: 0, correct: 0, wrongOpen: 0 };
      }
      s.total++;
      s[r.status]++;
      s.wrongOpen += r.wrongOpen;
      if (r.answered > 0) {
        s.studied++;
        s.answered += r.answered;
        s.correct += r.correct;
      }
    }
    var order = ['math', 'chinese', 'english', 'science'];
    var subjects = [];
    for (var j = 0; j < order.length; j++) if (bySubject[order[j]]) subjects.push(bySubject[order[j]]);
    for (var k in bySubject) {
      if (Object.prototype.hasOwnProperty.call(bySubject, k) && order.indexOf(k) < 0) subjects.push(bySubject[k]);
    }
    return {
      all: all,
      counts: counts,
      total: all.length,
      studied: all.filter(function (r) { return r.answered > 0; }),
      bySubject: subjects,
      masteredPercent: util.pct(counts.mastered, all.length)
    };
  }

  /** 需要优先复习的知识点：有未复习错题、或最近出错 */
  function priorityList(limit) {
    var all = buildAll();
    var list = all.filter(function (r) { return r.wrongOpen > 0 || r.recentWrong > 0; });
    list.sort(function (a, b) {
      if (b.wrongOpen !== a.wrongOpen) return b.wrongOpen - a.wrongOpen;
      if (b.recentWrong !== a.recentWrong) return b.recentWrong - a.recentWrong;
      return (b.lastAt || 0) - (a.lastAt || 0);
    });
    return typeof limit === 'number' ? list.slice(0, limit) : list;
  }

  /** 最近掌握得最好的知识点 */
  function masteredList(limit) {
    var list = buildAll().filter(function (r) { return r.status === 'mastered'; });
    list.sort(function (a, b) { return (b.lastAt || 0) - (a.lastAt || 0); });
    return typeof limit === 'number' ? list.slice(0, limit) : list;
  }

  /** 为一个知识点找一处可练的关卡（优先还没通关、且已解锁的关卡） */
  function targetFor(row) {
    if (!row) return null;
    var qs = ZCD.data.allQuestions().filter(function (q) {
      return Number(q.grade) === Number(row.grade) && q.subject === row.subject && q.point === row.point && q.packId;
    });
    if (!qs.length) return null;
    var fallback = null;
    for (var i = 0; i < qs.length; i++) {
      var q = qs[i];
      var unlocked = ZCD.store.isLevelUnlocked(q.packId, q.level);
      var cleared = ZCD.store.isLevelCleared(q.packId, q.level);
      if (unlocked && !cleared) return { packId: q.packId, level: q.level, unlocked: true };
      if (!fallback && unlocked) fallback = { packId: q.packId, level: q.level, unlocked: true };
    }
    return fallback || { packId: qs[0].packId, level: qs[0].level, unlocked: ZCD.store.isLevelUnlocked(qs[0].packId, qs[0].level) };
  }

  /** 复习队列：优先「还需练习」知识点下的错题，其余按最近答错时间倒序 */
  function reviewQueue(limit) {
    var pending = ZCD.store.wrongList({ status: 'pending' });
    var cap = typeof limit === 'number' ? limit : 30;
    var practiceKeys = {};
    var all = buildAll();
    for (var i = 0; i < all.length; i++) {
      if (all[i].status === 'practice') practiceKeys[all[i].key] = true;
    }
    var sorted = pending.slice().sort(function (a, b) {
      var pa = practiceKeys[ZCD.store.pointKey(a.grade, a.subject, a.point)] ? 1 : 0;
      var pb = practiceKeys[ZCD.store.pointKey(b.grade, b.subject, b.point)] ? 1 : 0;
      if (pa !== pb) return pb - pa;
      return (b.lastWrongAt || b.ts || 0) - (a.lastWrongAt || a.ts || 0);
    });
    return {
      list: sorted.slice(0, cap),
      total: pending.length,
      truncated: pending.length > cap
    };
  }

  /** 最近一次学习表现 */
  function lastPerformance() {
    var records = ZCD.store.recentLevelRecords(1);
    var last = records[0] || null;
    var pack = last && last.packId && ZCD.data ? ZCD.data.getPack(last.packId) : null;
    var answers = ZCD.store.recentAnswers(5);
    return {
      level: last,
      pack: pack,
      packName: pack ? pack.name : (last ? last.packId : ''),
      levelName: last ? (pack ? ZCD.data.levelName(pack, last.level) : '第 ' + last.level + ' 关') : '',
      accuracy: last ? (last.bestAccuracy || 0) : 0,
      stars: last ? (last.bestStars || 0) : 0,
      cleared: last ? !!last.cleared : false,
      at: last ? last.lastAt : 0,
      recentAnswers: answers,
      recentCorrect: answers.filter(function (a) { return a.correct; }).length,
      recentTotal: answers.length
    };
  }

  /** 下一步学习建议：固定规则生成，最多 4 条 */
  function suggestions(limit) {
    var out = [];
    var wrong = ZCD.store.wrongStats();
    var all = buildAll();
    var priority = priorityList();
    var mastered = masteredList();

    if (wrong.pending > 0) {
      out.push({
        icon: '📕',
        text: '错题本里还有 ' + wrong.pending + ' 道待巩固的错题，先把它们复习一遍，效果最明显。',
        action: { label: '复习全部待巩固错题', go: '/wrong', params: { status: 'pending' } }
      });
    }

    for (var i = 0; i < priority.length && out.length < 3; i++) {
      var p = priority[i];
      if (p.wrongOpen === 0 && p.recentWrong === 0) continue;
      var target = targetFor(p);
      var reason = p.wrongOpen > 0
        ? '还有 ' + p.wrongOpen + ' 道错题没复习'
        : '最近 ' + Math.min(p.recent.length, RULES.RECENT_WINDOW) + ' 次里有 ' + p.recentWrong + ' 次答错';
      out.push({
        icon: '💪',
        text: '「' + ZCD.gradeLabel(p.grade) + '·' + ZCD.subjectMeta(p.subject).name + '·' + p.point + '」' + reason + '，建议回这一关重新练一遍。',
        action: target && target.unlocked
          ? { label: '去重练这一关', go: '/quiz', params: { pack: target.packId, level: target.level } }
          : { label: '去闯关地图', go: '/map', params: { pack: target ? target.packId : '' } }
      });
    }

    if (out.length < 3) {
      for (var j = 0; j < mastered.length && out.length < 3; j++) {
        var m = mastered[j];
        var t = targetFor(m);
        if (!t || !t.unlocked) continue;
        if (ZCD.store.isLevelCleared(t.packId, t.level)) continue;
        var pack = ZCD.data.getPack(m.packId || t.packId);
        out.push({
          icon: '🚀',
          text: '「' + m.point + '」已经掌握得不错了，可以继续挑战新的关卡。',
          action: { label: '挑战下一关', go: '/quiz', params: { pack: t.packId, level: t.level } }
        });
        break;
      }
    }

    if (out.length < 3) {
      var notStarted = all.filter(function (r) { return r.answered === 0; }).length;
      if (ZCD.store.state().totals.answered === 0) {
        out.push({
          icon: '🌱',
          text: '还没有开始练习。先选一个年级和学科，第一关已经为你打开了。',
          action: { label: '去选知识包', go: '/select', params: {} }
        });
      } else if (notStarted > 0) {
        out.push({
          icon: '📚',
          text: '还有 ' + notStarted + ' 个知识点没有开始学习，可以挑一个继续闯关。',
          action: { label: '去选知识包', go: '/select', params: {} }
        });
      } else {
        out.push({
          icon: '🔁',
          text: '所有知识点都练过了，可以回头重挑战关卡，把星级刷到 3 星。',
          action: { label: '去闯关地图', go: '/select', params: {} }
        });
      }
    }

    return typeof limit === 'number' ? out.slice(0, limit) : out;
  }

  ZCD.mastery = {
    RULES: RULES,
    STATUS: STATUS,
    DISCLAIMER: DISCLAIMER,
    judge: judge,
    openWrongByPoint: openWrongByPoint,
    buildAll: buildAll,
    overview: overview,
    priorityList: priorityList,
    masteredList: masteredList,
    reviewQueue: reviewQueue,
    targetFor: targetFor,
    lastPerformance: lastPerformance,
    suggestions: suggestions
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);