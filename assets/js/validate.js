/*!
 * 知闯岛 · 题库校验与导入解析
 * 纯本地规则实现（无任何外部接口），同时供浏览器页面与 Node 测试脚本使用。
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.ZCD = root.ZCD || {};
    root.ZCD.validateLib = factory(root);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  var GRADES = [3, 4, 5, 6];
  var SUBJECTS = ['math', 'chinese', 'english', 'science'];
  var TYPES = ['single', 'judge'];

  var SUBJECT_ALIAS = {
    '数学': 'math', 'math': 'math', 'maths': 'math', 'mathematics': 'math',
    '语文': 'chinese', 'chinese': 'chinese', '语文（中文）': 'chinese',
    '英语': 'english', 'english': 'english',
    '科学': 'science', 'science': 'science'
  };

  var TYPE_ALIAS = {
    '单选': 'single', '单选题': 'single', '选择': 'single', '选择题': 'single', 'single': 'single', 'choice': 'single',
    '判断': 'judge', '判断题': 'judge', '对错': 'judge', 'judge': 'judge', 'truefalse': 'judge', 'true/false': 'judge'
  };

  var HEADER_ALIAS = {
    '年级': 'grade', 'grade': 'grade',
    '学科': 'subject', '科目': 'subject', 'subject': 'subject',
    '知识包': 'packName', '知识包名称': 'packName', 'pack': 'packName', 'packname': 'packName',
    '关卡': 'level', '关卡号': 'level', 'level': 'level',
    '知识点': 'point', 'point': 'point', '考点': 'point',
    '题型': 'type', 'type': 'type',
    '题目': 'stem', '题干': 'stem', '题目内容': 'stem', 'stem': 'stem', 'question': 'stem',
    '选项a': 'optionA', 'a': 'optionA', 'optiona': 'optionA',
    '选项b': 'optionB', 'b': 'optionB', 'optionb': 'optionB',
    '选项c': 'optionC', 'c': 'optionC', 'optionc': 'optionC',
    '选项d': 'optionD', 'd': 'optionD', 'optiond': 'optionD',
    '正确答案': 'answer', '答案': 'answer', 'answer': 'answer',
    '解析': 'analysis', '答案解析': 'analysis', 'analysis': 'analysis', 'explanation': 'analysis',
    '提示': 'hint', '小提示': 'hint', '引导提示': 'hint', 'hint': 'hint', 'tip': 'hint',
    '难度': 'difficulty', '难度等级': 'difficulty', 'difficulty': 'difficulty',
    'id': 'id', '编号': 'id'
  };

  function str(v) {
    if (v === null || v === undefined) return '';
    return String(v).trim();
  }

  function normalizeHeader(h) {
    var k = str(h).toLowerCase().replace(/\s+/g, '');
    return HEADER_ALIAS[k] || HEADER_ALIAS[str(h)] || k;
  }

  /* ---------------- CSV 解析（支持引号、逗号、换行、BOM） ---------------- */

  function parseCsv(text) {
    text = String(text || '').replace(/^\uFEFF/, '');
    var rows = [];
    var row = [];
    var field = '';
    var inQuotes = false;
    var i = 0;

    function pushField() { row.push(field); field = ''; }
    function pushRow() {
      // 跳过完全空行
      var hasContent = row.some(function (c) { return str(c) !== ''; });
      if (hasContent) rows.push(row);
      row = [];
    }

    while (i < text.length) {
      var ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        field += ch; i++; continue;
      }
      if (ch === '"') { inQuotes = true; i++; continue; }
      if (ch === ',') { pushField(); i++; continue; }
      if (ch === '\r') { i++; continue; }
      if (ch === '\n') { pushField(); pushRow(); i++; continue; }
      field += ch; i++;
    }
    pushField();
    pushRow();

    if (!rows.length) return { headers: [], records: [], errors: ['文件内容为空。'] };

    var headerRow = rows[0];
    var keys = headerRow.map(normalizeHeader);
    var unknown = [];
    keys.forEach(function (k, idx) {
      if (!HEADER_ALIAS[str(headerRow[idx])] && !/^[a-z]+$/.test(k)) unknown.push(headerRow[idx]);
    });

    var records = [];
    var errors = [];
    for (var r = 1; r < rows.length; r++) {
      var obj = { __row: r + 1 };
      for (var c = 0; c < keys.length; c++) {
        obj[keys[c]] = str(rows[r][c]);
      }
      records.push(obj);
    }
    return { headers: keys, headerRow: headerRow, records: records, errors: errors, unknownHeaders: unknown };
  }

  /* ---------------- 单条记录 → 标准题目 ---------------- */

  function normalizeAnswerInfo(raw, type, options) {
    var a = str(raw).toUpperCase();
    options = options || [];
    if (type === 'judge') {
      if (a === 'A' || a === '正确' || a === '对' || a === '是' || a === 'T' || a === 'TRUE' || a === '√') return { answer: 'A', byPosition: false };
      if (a === 'B' || a === '错误' || a === '错' || a === '否' || a === 'F' || a === 'FALSE' || a === '×' || a === 'X') return { answer: 'B', byPosition: false };
      return { answer: a, byPosition: false };
    }
    // 1. 首选：答案本身就是选项字母
    var keyMatch = options.filter(function (o) { return o.key === a; })[0];
    if (keyMatch) return { answer: keyMatch.key, byPosition: false };
    // 2. 其次：答案写的是选项内容
    for (var i = 0; i < options.length; i++) {
      if (str(options[i].text).toUpperCase() === a) return { answer: options[i].key, byPosition: false };
    }
    // 3. 最后：当作选项序号 1/2/3/4 处理
    if (/^[1-4]$/.test(a)) {
      var byPosition = 'ABCD'.charAt(Number(a) - 1);
      var exists = options.filter(function (o) { return o.key === byPosition; })[0];
      if (exists) return { answer: byPosition, byPosition: true };
    }
    return { answer: a, byPosition: false };
  }

  function normalizeAnswer(raw, type, options) {
    return normalizeAnswerInfo(raw, type, options).answer;
  }

  /** 把 JSON/CSV 中的一条原始记录转成标准题目对象（不做合法性判断，判断交给 validateQuestions） */
  function normalizeRecord(rec, index) {
    var type = TYPE_ALIAS[str(rec.type).toLowerCase()] || TYPE_ALIAS[str(rec.type)] || str(rec.type).toLowerCase();
    var subject = SUBJECT_ALIAS[str(rec.subject).toLowerCase()] || SUBJECT_ALIAS[str(rec.subject)] || str(rec.subject).toLowerCase();

    var rawOptions = rec.options;
    var options = [];
    if (Array.isArray(rawOptions) && rawOptions.length) {
      options = rawOptions.map(function (o, i) {
        if (typeof o === 'string') return { key: String.fromCharCode(65 + i), text: str(o) };
        return { key: str(o.key || String.fromCharCode(65 + i)).toUpperCase(), text: str(o.text) };
      });
    } else {
      ['optionA', 'optionB', 'optionC', 'optionD'].forEach(function (k, i) {
        if (str(rec[k]) !== '') options.push({ key: String.fromCharCode(65 + i), text: str(rec[k]) });
      });
    }
    if (type === 'judge' && !options.length) {
      options = [{ key: 'A', text: '正确' }, { key: 'B', text: '错误' }];
    }
    if (type === 'judge' && options.length === 2) {
      // 统一判断题的选项文案
      options = [
        { key: options[0].key || 'A', text: '正确' },
        { key: options[1].key || 'B', text: '错误' }
      ];
    }

    var answerInfo = normalizeAnswerInfo(rec.answer, type, options);
    var question = {
      id: str(rec.id),
      grade: str(rec.grade) === '' ? NaN : Number(str(rec.grade).replace(/[^0-9]/g, '')),
      subject: subject,
      packId: str(rec.packId) || '',
      level: str(rec.level) === '' ? 1 : Number(str(rec.level).replace(/[^0-9]/g, '')),
      point: str(rec.point) || '',
      type: type,
      stem: str(rec.stem),
      options: options,
      answer: answerInfo.answer,
      rawAnswer: str(rec.answer),
      _answerByPosition: answerInfo.byPosition,
      analysis: str(rec.analysis),
      hint: str(rec.hint),
      difficulty: str(rec.difficulty) === '' ? 2 : Number(str(rec.difficulty).replace(/[^0-9]/g, '')),
      _row: rec.__row || index + 1,
      _packName: str(rec.packName || rec.pack || '')
    };
    return question;
  }

  /* ---------------- 提示（hint）安全校验 ---------------- */

  function escapeRe(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * 选项文字是否在提示里出现。
   * 短的英文/数字选项（如 is、do、6、69）按「独立词」匹配，避免 this 里的 is 被误判；
   * 中文或较长的选项按普通包含匹配。
   */
  function textAppearsInHint(hint, text) {
    if (!text) return false;
    var wordLike = /^[A-Za-z0-9]/.test(text) && /[A-Za-z0-9]$/.test(text);
    if (wordLike && text.length <= 3) {
      return new RegExp('(^|[^A-Za-z0-9])' + escapeRe(text) + '([^A-Za-z0-9]|$)', 'i').test(hint);
    }
    return hint.toLowerCase().indexOf(String(text).toLowerCase()) >= 0;
  }

  /**
   * 提示是否直接泄露答案。
   * 命中任一情况即视为泄露：包含正确选项的文字、出现「选A / 答案是B / 第2个」、提示本身就是答案字母。
   */
  function hintLeaksAnswer(hint, question) {
    var h = str(hint);
    if (!h) return false;
    var q = question || {};
    var options = Array.isArray(q.options) ? q.options : [];
    var answer = str(q.answer).toUpperCase();
    var ANSWER_POINTER_RE = /选\s*[A-DＡ-Ｄ](?![A-Za-z0-9])|答案\s*(是|为|应(该)?(选|是)?)\s*[A-DＡ-Ｄ]|选项\s*[A-DＡ-Ｄ]|第\s*[一二三四1-4]\s*个?\s*(选项|答案)/;
    if (ANSWER_POINTER_RE.test(h)) return true;
    for (var i = 0; i < options.length; i++) {
      if (str(options[i].key).toUpperCase() !== answer) continue;
      if (textAppearsInHint(h, str(options[i].text))) return true;
    }
    return false;
  }

  /* ---------------- 题库校验 ---------------- */

  function validateQuestions(questions, opts) {
    opts = opts || {};
    var errors = [];
    var warnings = [];
    var seenIds = {};
    var answerCounter = { A: 0, B: 0, C: 0, D: 0 };
    var levelCounter = {};
    var hintCount = 0;
    var hintLeakCount = 0;
    var list = Array.isArray(questions) ? questions : [];

    function err(q, field, message) {
      errors.push({ level: 'error', row: q._row, qid: q.id, field: field, message: message });
    }
    function warn(q, field, message) {
      warnings.push({ level: 'warning', row: q._row, qid: q.id, field: field, message: message });
    }

    if (!list.length) {
      errors.push({ level: 'error', field: 'questions', message: '没有解析到任何题目。' });
      return summary();
    }

    list.forEach(function (q, i) {
      var rowInfo = q._row ? '第 ' + q._row + ' 行' : '第 ' + (i + 1) + ' 题';

      // 1. 唯一 ID
      if (!str(q.id)) {
        if (opts.strictIds) err(q, 'id', rowInfo + '：缺少唯一 ID。');
        else warn(q, 'id', rowInfo + '：缺少 ID，导入时将自动生成。');
      } else if (seenIds[q.id]) {
        err(q, 'id', rowInfo + '：ID「' + q.id + '」重复（首次出现在' + seenIds[q.id] + '）。');
      } else {
        seenIds[q.id] = rowInfo;
      }

      // 2. 年级
      if (GRADES.indexOf(Number(q.grade)) === -1) {
        err(q, 'grade', rowInfo + '：年级「' + (isNaN(q.grade) ? str(q.grade) : q.grade) + '」不合法，必须是 3、4、5、6 之一。');
      }

      // 3. 学科
      if (SUBJECTS.indexOf(q.subject) === -1) {
        err(q, 'subject', rowInfo + '：学科「' + str(q.subject) + '」不合法，必须是 数学/语文/英语/科学（或 math/chinese/english/science）。');
      }

      // 4. 题型
      if (TYPES.indexOf(q.type) === -1) {
        err(q, 'type', rowInfo + '：题型「' + str(q.type) + '」不合法，只能填 单选 或 判断。');
      }

      // 5. 题目内容
      if (str(q.stem).length < 2) {
        err(q, 'stem', rowInfo + '：题目内容不能为空。');
      }

      // 6. 选项
      var needOptions = q.type === 'single' ? 4 : (q.type === 'judge' ? 2 : null);
      if (needOptions !== null) {
        if (!Array.isArray(q.options) || q.options.length !== needOptions) {
          err(q, 'options', rowInfo + '：' + (q.type === 'single' ? '单选题必须有 4 个选项' : '判断题必须有 2 个选项') +
            '，当前有 ' + ((q.options && q.options.length) || 0) + ' 个。');
        } else {
          var keys = {}, texts = {};
          q.options.forEach(function (o, oi) {
            if (!str(o.key)) err(q, 'options', rowInfo + '：第 ' + (oi + 1) + ' 个选项缺少选项字母。');
            else if (keys[o.key]) err(q, 'options', rowInfo + '：选项字母「' + o.key + '」重复。');
            keys[o.key] = true;
            if (!str(o.text)) err(q, 'options', rowInfo + '：选项 ' + o.key + ' 的内容为空。');
            else if (texts[str(o.text)]) err(q, 'options', rowInfo + '：选项 ' + o.key + ' 与选项 ' + texts[str(o.text)] + ' 的内容重复（「' + str(o.text) + '」）。');
            else texts[str(o.text)] = o.key;
          });
        }
      }

      // 7. 标准答案
      var optionKeys = (q.options || []).map(function (o) { return o.key; });
      if (!str(q.answer)) {
        err(q, 'answer', rowInfo + '：缺少标准答案。');
      } else if (optionKeys.length && optionKeys.indexOf(q.answer) === -1) {
        err(q, 'answer', rowInfo + '：标准答案「' + str(q.answer) + '」不在选项（' + optionKeys.join('/') + '）中。');
      } else if (TYPES.indexOf(q.type) !== -1 && /^[A-D]$/.test(q.answer)) {
        if (q._answerByPosition) {
          warn(q, 'answer', rowInfo + '：标准答案「' + str(q.rawAnswer) + '」不在选项内容里，已按选项序号理解为「' + q.answer + '」，建议直接填写选项字母。');
        }
        answerCounter[q.answer]++;
      }

      // 8. 解析
      if (str(q.analysis).length < 4) {
        err(q, 'analysis', rowInfo + '：缺少知识解析，请补充一句通俗易懂的说明。');
      } else if (str(q.analysis).length < 10) {
        warn(q, 'analysis', rowInfo + '：解析太短（' + str(q.analysis).length + ' 字），建议写清原因。');
      }

      // 9. 引导提示（可选字段）
      if (str(q.hint)) {
        var hintText = str(q.hint);
        hintCount++;
        if (hintText.length < 6) {
          warn(q, 'hint', rowInfo + '：引导提示太短（' + hintText.length + ' 字），建议写清从哪个角度思考。');
        } else if (hintText.length > 60) {
          warn(q, 'hint', rowInfo + '：引导提示较长（' + hintText.length + ' 字），建议控制在 45 字以内。');
        }
        if (hintLeaksAnswer(hintText, q)) {
          hintLeakCount++;
          err(q, 'hint', rowInfo + '：引导提示里出现了正确答案的内容（会直接泄露答案），请改写提示，只引导思路。');
        }
      }

      // 10. 难度
      if ([1, 2, 3].indexOf(Number(q.difficulty)) === -1) {
        warn(q, 'difficulty', rowInfo + '：难度「' + str(q.difficulty) + '」不是 1/2/3，导入时按 2 处理。');
      }

      // 11. 关卡
      var lv = Number(q.level);
      if (!(lv >= 1 && lv <= 5)) {
        warn(q, 'level', rowInfo + '：关卡号「' + str(q.level) + '」不是 1—5，导入时按 1 处理。');
      } else {
        levelCounter[lv] = (levelCounter[lv] || 0) + 1;
      }

      // 12. 知识点
      if (!str(q.point)) warn(q, 'point', rowInfo + '：缺少知识点，导入时按「综合练习」处理。');
    });

    // 跨题统计
    if (list.length >= 8) {
      var total = answerCounter.A + answerCounter.B + answerCounter.C + answerCounter.D;
      if (total >= 8) {
        ['A', 'B', 'C', 'D'].forEach(function (k) {
          if (answerCounter[k] / total > 0.7) {
            warnings.push({
              level: 'warning', field: 'answer',
              message: '标准答案分布不均：' + k + ' 占了 ' + Math.round(answerCounter[k] / total * 100) + '%，建议打乱选项顺序。'
            });
          }
        });
      }
    }
    [1, 2, 3, 4, 5].forEach(function (lv) {
      if (levelCounter[lv] && levelCounter[lv] < 5) {
        warnings.push({ level: 'warning', field: 'level', message: '第 ' + lv + ' 关只有 ' + levelCounter[lv] + ' 道题，建议每关至少 5 道。' });
      }
    });
    if (list.length < 5) {
      warnings.push({ level: 'warning', field: 'questions', message: '本知识包只有 ' + list.length + ' 道题，建议至少 5 道才有闯关体验。' });
    }

    function summary() {
      return {
        ok: errors.length === 0,
        errors: errors,
        warnings: warnings,
        total: list.length,
        hints: hintCount,
        answerDistribution: answerCounter,
        levels: levelCounter
      };
    }
    return summary();
  }

  function validatePack(pack, questions) {
    var errors = [], warnings = [];
    pack = pack || {};
    if (!str(pack.name)) errors.push({ level: 'error', field: 'name', message: '知识包名称不能为空。' });
    if (GRADES.indexOf(Number(pack.grade)) === -1) errors.push({ level: 'error', field: 'grade', message: '适用年级必须是 3、4、5、6 之一。' });
    if (SUBJECTS.indexOf(pack.subject) === -1) errors.push({ level: 'error', field: 'subject', message: '学科必须是 数学/语文/英语/科学 之一。' });
    if ([1, 2, 3].indexOf(Number(pack.difficulty)) === -1) warnings.push({ level: 'warning', field: 'difficulty', message: '难度按 2 处理（只能填 1/2/3）。' });
    if (!str(pack.intro)) warnings.push({ level: 'warning', field: 'intro', message: '建议填写知识简介，孩子会在地图上看到它。' });
    return { ok: errors.length === 0, errors: errors, warnings: warnings };
  }

  /* ---------------- JSON / CSV 解析入口 ---------------- */

  function dedupeIds(questions) {
    var seen = {};
    questions.forEach(function (q, i) {
      if (!str(q.id)) {
        q.id = 'custom-' + i + '-' + Math.random().toString(36).slice(2, 6);
        q._autoId = true;
      }
      while (seen[q.id]) {
        q.id = q.id + '-' + Math.random().toString(36).slice(2, 4);
      }
      seen[q.id] = true;
    });
    return questions;
  }

  /**
   * 解析 JSON 文本
   * 支持三种写法：题目数组 / {questions:[...]} / {pack:{...}, questions:[...]}
   */
  function fromJSON(text) {
    var data;
    try {
      data = JSON.parse(String(text || '').replace(/^\uFEFF/, ''));
    } catch (e) {
      return { fatal: 'JSON 格式错误：' + e.message + '（请检查是否有多余逗号、缺少引号或中英文标点混用。）' };
    }
    var arr = null, packMeta = null;
    if (Array.isArray(data)) {
      arr = data;
    } else if (data && typeof data === 'object') {
      arr = Array.isArray(data.questions) ? data.questions : (Array.isArray(data.items) ? data.items : null);
      packMeta = data.pack || data.packInfo || null;
      if (!packMeta) {
        packMeta = {
          name: data.packName || data.name,
          grade: data.grade,
          subject: data.subject,
          intro: data.intro || data.description,
          difficulty: data.difficulty,
          levelNames: data.levelNames
        };
      }
    }
    if (!arr) return { fatal: '没有找到题目数组。JSON 顶层应是题目数组，或包含 questions 字段的对象。' };

    var raw = arr.map(function (r, i) {
      var rec = Object.assign({}, r);
      if (Array.isArray(r.options)) {
        rec.options = r.options.map(function (o, oi) {
          if (typeof o === 'string') return { key: String.fromCharCode(65 + oi), text: o };
          return { key: o.key !== undefined ? o.key : (o.option !== undefined ? o.option : String.fromCharCode(65 + oi)), text: o.text !== undefined ? o.text : o.value };
        });
      }
      rec.__row = i + 1;
      return rec;
    });
    var questions = raw.map(function (r, i) { return normalizeRecord(r, i); });
    return { questions: questions, packMeta: packMeta, source: 'json' };
  }

  /** 解析 CSV 文本 */
  function fromCSV(text) {
    var parsed = parseCsv(text);
    if (parsed.errors && parsed.errors.length && !parsed.records.length) {
      return { fatal: parsed.errors.join(' ') };
    }
    if (!parsed.records.length) {
      return { fatal: 'CSV 中没有数据行（第一行必须是表头）。' };
    }
    var questions = parsed.records.map(function (r, i) { return normalizeRecord(r, i); });
    var firstName = questions[0] && questions[0]._packName;
    return {
      questions: questions,
      packMeta: { name: firstName || '', grade: questions[0] && questions[0].grade, subject: questions[0] && questions[0].subject },
      source: 'csv',
      headerRow: parsed.headerRow,
      unknownHeaders: parsed.unknownHeaders
    };
  }

  /** 自动识别格式 */
  function parseAny(text, filename) {
    var t = String(text || '').trim();
    var isJson = /\.json$/i.test(filename || '') || t.charAt(0) === '{' || t.charAt(0) === '[';
    var res = isJson ? fromJSON(t) : fromCSV(t);
    if (res && res.fatal && isJson) {
      // 再尝试 CSV，反之亦然
      var alt = fromCSV(t);
      if (alt && !alt.fatal && alt.questions.length) return alt;
    }
    return res;
  }

  /* ---------------- 生成示例文件 ---------------- */

  function toCsv(questions) {
    var head = ['年级', '学科', '知识包', '关卡', '知识点', '题型', '题目', '选项A', '选项B', '选项C', '选项D', '正确答案', '解析', '提示', '难度'];
    function cell(v) {
      var s = str(v);
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    }
    var lines = [head.join(',')];
    questions.forEach(function (q) {
      var opts = q.options || [];
      function opt(i) { return opts[i] ? opts[i].text : ''; }
      lines.push([
        q.grade,
        { math: '数学', chinese: '语文', english: '英语', science: '科学' }[q.subject] || q.subject,
        q._packName || '',
        q.level,
        q.point || '',
        q.type === 'judge' ? '判断' : '单选',
        q.stem,
        opt(0), opt(1), opt(2), opt(3),
        q.answer,
        q.analysis,
        q.hint || '',
        q.difficulty || 2
      ].map(cell).join(','));
    });
    return lines.join('\r\n');
  }

  function toPackJson(pack, questions) {
    return JSON.stringify({
      pack: {
        name: pack.name,
        grade: pack.grade,
        subject: pack.subject,
        intro: pack.intro,
        difficulty: pack.difficulty,
        levelNames: pack.levelNames
      },
      questions: questions.map(function (q) {
        return {
          id: q.id,
          grade: q.grade,
          subject: q.subject,
          level: q.level,
          point: q.point,
          type: q.type,
          stem: q.stem,
          options: q.options.map(function (o) { return { key: o.key, text: o.text }; }),
          answer: q.answer,
          analysis: q.analysis,
          hint: q.hint || '',
          difficulty: q.difficulty
        };
      })
    }, null, 2);
  }

  return {
    GRADES: GRADES,
    SUBJECTS: SUBJECTS,
    SUBJECT_ALIAS: SUBJECT_ALIAS,
    TYPE_ALIAS: TYPE_ALIAS,
    parseCsv: parseCsv,
    normalizeRecord: normalizeRecord,
    normalizeAnswer: normalizeAnswer,
    normalizeAnswerInfo: normalizeAnswerInfo,
    validateQuestions: validateQuestions,
    hintLeaksAnswer: hintLeaksAnswer,
    textAppearsInHint: textAppearsInHint,
    validatePack: validatePack,
    fromJSON: fromJSON,
    fromCSV: fromCSV,
    parseAny: parseAny,
    dedupeIds: dedupeIds,
    toCsv: toCsv,
    toPackJson: toPackJson
  };
});