/*!
 * 知闯岛 · 题库管理（导入 / 校验 / 预览）、数据与设置、关于
 */
(function (root) {
  'use strict';
  var ZCD = root.ZCD;
  var util = ZCD.util;
  var ui = ZCD.ui;
  var V = ZCD.validateLib || (root.ZCD && root.ZCD.validateLib);
  ZCD.views = ZCD.views || {};

  /* ==================== 示例题库（用于生成可下载的示例文件） ==================== */

  var SAMPLE_PACK = {
    name: '三年级数学 · 我的练习包',
    grade: 3,
    subject: 'math',
    intro: '示例文件：5 道题，覆盖 2 个关卡，演示导入所需的全部字段。',
    difficulty: 1,
    levelNames: ['第 1 关 · 乘法热身', '第 2 关 · 综合练习']
  };

  var SAMPLE_QUESTIONS = [
    {
      id: 'sample-01', grade: 3, subject: 'math', level: 1, point: '两位数乘一位数', type: 'single',
      stem: '23 × 3 = ？',
      options: [{ key: 'A', text: '69' }, { key: 'B', text: '66' }, { key: 'C', text: '63' }, { key: 'D', text: '96' }],
      answer: 'A', analysis: '23 × 3 = 20 × 3 + 3 × 3 = 60 + 9 = 69。',
      hint: '把 23 拆成 20 和 3，分别乘 3，再把两个结果加起来。', difficulty: 1
    },
    {
      id: 'sample-02', grade: 3, subject: 'math', level: 1, point: '混合运算', type: 'single',
      stem: '25 + 5 × 7 = ？',
      options: [{ key: 'A', text: '210' }, { key: 'B', text: '60' }, { key: 'C', text: '70' }, { key: 'D', text: '32' }],
      answer: 'B', analysis: '先算乘法再算加法：5 × 7 = 35，25 + 35 = 60。',
      hint: '没有括号时，先算乘法，再算加法。', difficulty: 1
    },
    {
      id: 'sample-03', grade: 3, subject: 'math', level: 1, point: '有余数除法', type: 'single',
      stem: '47 ÷ 5 的商和余数分别是多少？',
      options: [{ key: 'A', text: '商 9 余 2' }, { key: 'B', text: '商 8 余 7' }, { key: 'C', text: '商 9 余 5' }, { key: 'D', text: '商 10 余 3' }],
      answer: 'A', analysis: '5 × 9 = 45，47 − 45 = 2，所以商 9 余 2；余数必须比除数 5 小。',
      hint: '先想 5 乘几最接近 47 又不超过 47，再看还差多少。', difficulty: 2
    },
    {
      id: 'sample-04', grade: 3, subject: 'math', level: 2, point: '长方形周长', type: 'judge',
      stem: '长 8 厘米、宽 5 厘米的长方形，周长是 26 厘米。',
      options: [{ key: 'A', text: '正确' }, { key: 'B', text: '错误' }],
      answer: 'A', analysis: '长方形周长 =（长 + 宽）× 2 =（8 + 5）× 2 = 26 厘米。',
      hint: '回忆长方形周长的公式，再代入长和宽算一遍。', difficulty: 2
    },
    {
      id: 'sample-05', grade: 3, subject: 'math', level: 2, point: '同分母分数加法', type: 'single',
      stem: '2/7 + 3/7 = ？',
      options: [{ key: 'A', text: '5/14' }, { key: 'B', text: '5/7' }, { key: 'C', text: '6/7' }, { key: 'D', text: '1/7' }],
      answer: 'B', analysis: '同分母分数相加，分母不变，分子相加：2 + 3 = 5，结果是 5/7。',
      hint: '同分母分数相加时，分母保持不变，只把分子相加。', difficulty: 2
    }
  ];

  function sampleCsv() {
    var withPack = SAMPLE_QUESTIONS.map(function (q) {
      return Object.assign({}, q, { _packName: SAMPLE_PACK.name });
    });
    return V.toCsv(withPack);
  }

  function sampleJson() {
    return V.toPackJson(SAMPLE_PACK, SAMPLE_QUESTIONS);
  }

  /* 示例文件生成器对外暴露，便于「下载 → 再导入」的往返自测 */
  ZCD.samples = {
    pack: SAMPLE_PACK,
    questions: SAMPLE_QUESTIONS,
    json: sampleJson,
    csv: sampleCsv
  };

  /* ==================== 导入状态（模块内保存，刷新后清空） ==================== */

  var importState = null;   // {fatal, parsed, validation, packCheck, filename, text}

  function runParse(text, filename) {
    var parsed = V.parseAny(text, filename);
    if (!parsed || parsed.fatal) {
      importState = { fatal: (parsed && parsed.fatal) || '无法解析文件内容。', filename: filename, text: text };
      return;
    }
    var questions = V.dedupeIds(parsed.questions.slice());
    // 用来源文件里的年级/学科/知识包名为默认值
    var meta = parsed.packMeta || {};
    var first = questions[0] || {};
    var packMeta = {
      name: meta.name || (first._packName || '') || '我的知识包',
      grade: Number(meta.grade) || Number(first.grade) || 3,
      subject: (meta.subject && V.SUBJECTS.indexOf(meta.subject) >= 0) ? meta.subject : (V.SUBJECTS.indexOf(first.subject) >= 0 ? first.subject : 'math'),
      intro: meta.intro || '由我导入的自定义题库。',
      difficulty: [1, 2, 3].indexOf(Number(meta.difficulty)) >= 0 ? Number(meta.difficulty) : 2
    };
    var validation = V.validateQuestions(questions, { strictIds: false });
    var packCheck = V.validatePack(packMeta, questions);
    importState = {
      fatal: null,
      parsed: parsed,
      questions: questions,
      packMeta: packMeta,
      validation: validation,
      packCheck: packCheck,
      filename: filename,
      text: text
    };
  }

  function issuesHTML(validation, packCheck) {
    var issues = [];
    (packCheck ? packCheck.errors : []).forEach(function (e) { issues.push({ level: 'error', message: '【知识包】' + e.message }); });
    (packCheck ? packCheck.warnings : []).forEach(function (e) { issues.push({ level: 'warning', message: '【知识包】' + e.message }); });
    validation.errors.forEach(function (e) { issues.push({ level: 'error', message: e.message }); });
    validation.warnings.forEach(function (e) { issues.push({ level: 'warning', message: e.message }); });
    if (!issues.length) return '<div class="notice notice-ok" style="background:var(--green-soft);border-color:#c7efe1;color:#0b7a5b">✅ 校验通过：题目、选项、标准答案、年级、学科、解析、难度都符合格式要求，可以导入。</div>';
    var shown = issues.slice(0, 120);
    return '<div class="issues">' + shown.map(function (it) {
      return '<div class="issue ' + (it.level === 'error' ? 'is-error' : 'is-warning') + '">' +
        '<span class="issue-icon">' + (it.level === 'error' ? '❌' : '⚠️') + '</span>' +
        '<span>' + util.esc(it.message) + '</span></div>';
    }).join('') +
    (issues.length > shown.length ? '<div class="issue is-warning"><span class="issue-icon">…</span><span>还有 ' + (issues.length - shown.length) + ' 条提示未显示</span></div>' : '') +
    '</div>';
  }

  function previewTable(questions) {
    var rows = questions.slice(0, 20);
    return '<div class="table-wrap" id="import-preview"><table class="data">' +
      '<thead><tr><th>行</th><th>年级</th><th>学科</th><th>关卡</th><th>题型</th><th class="wrap">题目</th><th>选项</th><th>答案</th><th>提示</th></tr></thead><tbody>' +
      rows.map(function (q) {
        var subj = ZCD.subjectMeta(q.subject);
        return '<tr>' +
          '<td>' + (q._row || '-') + '</td>' +
          '<td>' + (isNaN(q.grade) ? '<span style="color:var(--red)">' + util.esc(q.grade) + '</span>' : q.grade) + '</td>' +
          '<td>' + util.esc(subj.name) + '</td>' +
          '<td>' + (q.level || '-') + '</td>' +
          '<td>' + (q.type === 'judge' ? '判断' : (q.type === 'single' ? '单选' : util.esc(q.type))) + '</td>' +
          '<td class="wrap">' + util.esc(String(q.stem).slice(0, 60)) + '</td>' +
          '<td>' + (q.options || []).length + ' 个</td>' +
          '<td><b>' + util.esc(q.answer) + '</b></td>' +
          '<td>' + (q.hint ? '✅ 有' : '—') + '</td>' +
        '</tr>';
      }).join('') +
      '</tbody></table></div>' +
      (questions.length > 20 ? '<div class="text-xs text-muted mt-8">只预览前 20 行，共 ' + questions.length + ' 道题。</div>' : '');
  }

  function importPreviewHTML() {
    if (!importState) return '';
    if (importState.fatal) {
      return '<div class="card mt-16"><h2 class="card-title">🧪 校验与预览</h2>' +
        '<div class="notice notice-danger">❌ ' + util.esc(importState.fatal) + '</div>' +
        '<div class="row mt-12"><button class="btn btn-soft" id="btn-import-reset">重新选择文件</button></div></div>';
    }
    var meta = importState.packMeta;
    var val = importState.validation;
    var canImport = val.errors.length === 0 && importState.packCheck.errors.length === 0;

    return '<div class="card mt-16">' +
      '<h2 class="card-title">🧪 校验与预览 <span class="hint">' + util.esc(importState.filename || '粘贴内容') + ' · 共 ' + importState.questions.length + ' 道题</span></h2>' +
      issuesHTML(val, importState.packCheck) +

      '<div class="grid grid-2 mt-16">' +
        '<div><label class="field-label">知识包名称</label><input class="field" id="meta-name" value="' + util.esc(meta.name) + '" maxlength="30"></div>' +
        '<div><label class="field-label">知识简介</label><input class="field" id="meta-intro" value="' + util.esc(meta.intro) + '" maxlength="80"></div>' +
        '<div><label class="field-label">适用年级</label><select class="field" id="meta-grade">' +
          ZCD.GRADES.map(function (g) { return '<option value="' + g.grade + '"' + (g.grade === Number(meta.grade) ? ' selected' : '') + '>' + g.label + '</option>'; }).join('') +
        '</select></div>' +
        '<div><label class="field-label">学科</label><select class="field" id="meta-subject">' +
          ZCD.SUBJECTS.map(function (s) { return '<option value="' + s.key + '"' + (s.key === meta.subject ? ' selected' : '') + '>' + s.emoji + ' ' + s.name + '</option>'; }).join('') +
        '</select></div>' +
        '<div><label class="field-label">难度等级</label><select class="field" id="meta-difficulty">' +
          [1, 2, 3].map(function (d) { return '<option value="' + d + '"' + (d === Number(meta.difficulty) ? ' selected' : '') + '>' + util.starsText(d, 3) + '（' + d + ' 级）</option>'; }).join('') +
        '</select></div>' +
        '<div><label class="field-label">题目与关卡分布</label><div class="text-sm text-muted" style="padding-top:8px">' +
          [1, 2, 3, 4, 5].map(function (lv) { return '第 ' + lv + ' 关 ' + (val.levels[lv] || 0) + ' 题'; }).join('　') + '</div></div>' +
      '</div>' +

      '<h3 class="card-title mt-16">👀 导入预览</h3>' + previewTable(importState.questions) +

      '<div class="row mt-16">' +
        '<button class="btn btn-primary btn-lg" id="btn-import-confirm"' + (canImport ? '' : ' disabled') + '>✅ 确认导入（' + importState.questions.length + ' 道题）</button>' +
        '<button class="btn btn-soft" id="btn-import-reset">清空重来</button>' +
        (canImport ? '' : '<span class="text-xs" style="color:var(--red)">先修正上面的错误才能导入</span>') +
      '</div>' +
    '</div>';
  }

  /* ==================== 题库管理 ==================== */

  ZCD.views.manage = {
    render: function () {
      var custom = ZCD.store.state().custom;
      var stats = ZCD.data.stats();

      var customHTML = custom.packs.length ? custom.packs.map(function (p) {
        var qCount = custom.questions.filter(function (q) { return q.packId === p.id; }).length;
        var prog = ZCD.store.packProgress(p.id);
        return '<div class="recent-item">' +
          '<span class="recent-dot ok"></span>' +
          '<div style="flex:1;min-width:0">' +
            '<div class="text-sm"><b>' + util.esc(p.name) + '</b> ' + ui.gradeChip(p.grade) + ' ' + ui.subjectChip(p.subject) + '</div>' +
            '<div class="text-xs text-muted">' + qCount + ' 道题 · ' + prog.levels + ' 个关卡 · 已完成 ' + prog.cleared + ' 关 · 导入于 ' + util.fmtDate(p.createdAt) + ' · 来源 ' + util.esc((p.source || 'json').toUpperCase()) + '</div>' +
          '</div>' +
          '<button class="btn btn-soft btn-sm" data-map="' + util.esc(p.id) + '">查看</button>' +
          '<button class="btn btn-soft btn-sm" data-export="' + util.esc(p.id) + '">导出</button>' +
          '<button class="btn btn-danger btn-sm" data-del="' + util.esc(p.id) + '">删除</button>' +
        '</div>';
      }).join('') : ui.empty('📦', '还没有导入自定义题库。可以用下面的示例文件先试试。');

      return '' +
        '<div class="view-title-row">' +
          '<div><h1 class="view-title">📥 题库管理</h1>' +
          '<p class="view-desc">导入符合格式的 JSON 或 CSV 题库，校验通过后就能生成自己的知识包参与闯关。整个过程不联网、不调用任何 AI。</p></div>' +
        '</div>' +

        '<div class="grid grid-2">' +
          '<div class="card">' +
            '<h2 class="card-title">1️⃣ 先看看格式</h2>' +
            '<p class="text-sm text-muted mb-12">每道题必须包含：唯一 ID、年级、学科、知识点、题目、题型、选项、标准答案、解析、难度。' +
              '<b>单选题</b>填 4 个选项（A—D），<b>判断题</b>只需 2 个选项（正确 / 错误）。</p>' +
            '<div class="table-wrap"><table class="data sample-table">' +
              '<thead><tr><th>字段</th><th>是否必填</th><th>说明</th></tr></thead><tbody>' +
              '<tr><td><code>id</code></td><td>建议</td><td>题目唯一编号，缺失会自动生成</td></tr>' +
              '<tr><td><code>grade</code> / 年级</td><td>必填</td><td>3、4、5、6</td></tr>' +
              '<tr><td><code>subject</code> / 学科</td><td>必填</td><td>数学 / 语文 / 英语 / 科学（或 math / chinese / english / science）</td></tr>' +
              '<tr><td><code>level</code> / 关卡</td><td>必填</td><td>1—5，决定题目属于第几关</td></tr>' +
              '<tr><td><code>point</code> / 知识点</td><td>建议</td><td>如「两位数乘一位数」</td></tr>' +
              '<tr><td><code>type</code> / 题型</td><td>必填</td><td>单选 / 判断</td></tr>' +
              '<tr><td><code>stem</code> / 题目</td><td>必填</td><td>题目内容，纯文本</td></tr>' +
              '<tr><td><code>options</code> / 选项A—D</td><td>必填</td><td>单选 4 个，判断 2 个</td></tr>' +
              '<tr><td><code>answer</code> / 正确答案</td><td>必填</td><td>A / B / C / D（判断题可用 正确 / 错误）</td></tr>' +
              '<tr><td><code>analysis</code> / 解析</td><td>必填</td><td>一句孩子能看懂的说明，帮助理解原因</td></tr>' +
              '<tr><td><code>hint</code> / 提示</td><td>选填</td><td>答错后展示的引导提示，只指思路不泄露答案；不填也能用</td></tr>' +
              '<tr><td><code>difficulty</code> / 难度</td><td>建议</td><td>1、2、3</td></tr>' +
            '</tbody></table></div>' +
            '<div class="row mt-12">' +
              '<button class="btn btn-soft" id="dl-json">⬇️ 下载 JSON 示例</button>' +
              '<button class="btn btn-soft" id="dl-csv">⬇️ 下载 CSV 示例</button>' +
            '</div>' +
          '</div>' +

          '<div class="card">' +
            '<h2 class="card-title">2️⃣ 上传或粘贴题库</h2>' +
            '<div class="dropzone" id="dropzone">' +
              '<div class="dropzone-emoji">📄</div>' +
              '<div><b>点击选择文件</b>，或把 .json / .csv 文件拖到这里</div>' +
              '<div class="text-xs text-muted mt-8">文件只在本机浏览器中解析，不会上传到任何服务器</div>' +
              '<input type="file" id="io-file" accept=".json,.csv,.txt,application/json,text/csv,text/plain" style="display:none">' +
            '</div>' +
            '<div class="mt-12">' +
              '<label class="field-label">或者直接粘贴内容</label>' +
              '<textarea class="io" id="io-text" placeholder="把 JSON 或 CSV 内容粘贴到这里……"></textarea>' +
            '</div>' +
            '<div class="row mt-12">' +
              '<button class="btn btn-primary" id="btn-parse">🧪 校验并预览</button>' +
              '<button class="btn btn-soft" id="btn-sample-fill">填入 JSON 示例</button>' +
              '<button class="btn btn-soft" id="btn-sample-csv">填入 CSV 示例</button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        importPreviewHTML() +

        '<div class="card mt-16">' +
          '<h2 class="card-title">3️⃣ 我导入的知识包 <span class="hint">共 ' + custom.packs.length + ' 个</span></h2>' +
          customHTML +
        '</div>' +

        '<div class="card mt-16" id="selfcheck-card">' +
          '<h2 class="card-title">🔍 内置题库自检 <span class="hint">用同一套校验规则检查内置 ' + stats.builtinQuestions + ' 道题</span></h2>' +
          '<div id="selfcheck-result"><p class="text-sm text-muted">点击下面的按钮，检查内置题库是否有缺字段、答案不在选项中、解析缺失等问题。</p></div>' +
          '<div class="row mt-12"><button class="btn btn-soft" id="btn-selfcheck">开始自检</button></div>' +
        '</div>' +

        '<div class="notice mt-16">📵 导入过程完全在本地完成：不联网、不调用外部 AI 模型、不需要任何密钥。</div>';
    },

    mount: function (ctx, main) {
      /* --- 示例下载 --- */
      var dlJson = main.querySelector('#dl-json');
      if (dlJson) dlJson.addEventListener('click', function () {
        util.download('知闯岛-示例题库.json', sampleJson(), 'application/json');
        ui.toast('示例 JSON 已开始下载', 'ok');
      });
      var dlCsv = main.querySelector('#dl-csv');
      if (dlCsv) dlCsv.addEventListener('click', function () {
        util.download('知闯岛-示例题库.csv', '\uFEFF' + sampleCsv(), 'text/csv');
        ui.toast('示例 CSV 已开始下载', 'ok');
      });

      /* --- 文件选择 / 拖放 / 粘贴 --- */
      var fileInput = main.querySelector('#io-file');
      var textarea = main.querySelector('#io-text');
      var dropzone = main.querySelector('#dropzone');

      function readFile(file) {
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          var text = String(reader.result || '');
          if (textarea) textarea.value = text;
          runParse(text, file.name);
          ZCD.app.render();
        };
        reader.onerror = function () { ui.toast('文件读取失败，请重试', 'bad'); };
        reader.readAsText(file, 'utf-8');
      }

      if (dropzone) {
        dropzone.addEventListener('click', function () { if (fileInput) fileInput.click(); });
        ['dragenter', 'dragover'].forEach(function (t) {
          dropzone.addEventListener(t, function (ev) { ev.preventDefault(); dropzone.classList.add('is-over'); });
        });
        ['dragleave', 'drop'].forEach(function (t) {
          dropzone.addEventListener(t, function (ev) { ev.preventDefault(); dropzone.classList.remove('is-over'); });
        });
        dropzone.addEventListener('drop', function (ev) {
          var files = ev.dataTransfer && ev.dataTransfer.files;
          if (files && files.length) readFile(files[0]);
        });
      }
      if (fileInput) {
        fileInput.addEventListener('change', function () {
          if (fileInput.files && fileInput.files.length) readFile(fileInput.files[0]);
        });
      }

      var btnParse = main.querySelector('#btn-parse');
      if (btnParse) btnParse.addEventListener('click', function () {
        var text = textarea ? textarea.value : '';
        if (!text.trim()) { ui.toast('请先选择文件或粘贴题库内容', 'warn'); return; }
        runParse(text, '粘贴的内容');
        ZCD.app.render();
      });

      var fillJson = main.querySelector('#btn-sample-fill');
      if (fillJson) fillJson.addEventListener('click', function () {
        if (textarea) textarea.value = sampleJson();
        ui.toast('已填入 JSON 示例，点「校验并预览」试试', 'ok');
      });
      var fillCsv = main.querySelector('#btn-sample-csv');
      if (fillCsv) fillCsv.addEventListener('click', function () {
        if (textarea) textarea.value = sampleCsv();
        ui.toast('已填入 CSV 示例，点「校验并预览」试试', 'ok');
      });

      /* --- 预览区的按钮 --- */
      var resetBtn = main.querySelector('#btn-import-reset');
      if (resetBtn) resetBtn.addEventListener('click', function () {
        importState = null;
        ZCD.app.render();
      });

      var confirmBtn = main.querySelector('#btn-import-confirm');
      if (confirmBtn) confirmBtn.addEventListener('click', function () {
        if (!importState || importState.fatal) return;
        var name = (main.querySelector('#meta-name') || {}).value || '我的知识包';
        var intro = (main.querySelector('#meta-intro') || {}).value || '由我导入的自定义题库。';
        var grade = Number((main.querySelector('#meta-grade') || {}).value) || 3;
        var subject = (main.querySelector('#meta-subject') || {}).value || 'math';
        var difficulty = Number((main.querySelector('#meta-difficulty') || {}).value) || 2;

        var packId = 'custom-' + Date.now().toString(36);
        var maxLevel = 1;
        var questions = importState.questions.map(function (q, i) {
          var level = util.clamp(Number(q.level) || 1, 1, 5);
          if (level > maxLevel) maxLevel = level;
          var text = String(q.stem || '').slice(0, 24);
          return {
            id: packId + '-q' + (i + 1),
            grade: [3, 4, 5, 6].indexOf(Number(q.grade)) >= 0 ? Number(q.grade) : grade,
            subject: V.SUBJECTS.indexOf(q.subject) >= 0 ? q.subject : subject,
            packId: packId,
            level: level,
            point: q.point || '综合练习',
            type: q.type === 'judge' ? 'judge' : 'single',
            stem: q.stem,
            options: (q.options || []).map(function (o) { return { key: o.key, text: o.text }; }),
            answer: q.answer,
            analysis: q.analysis,
            hint: q.hint || '',
            difficulty: util.clamp(Number(q.difficulty) || 2, 1, 3),
            custom: true
          };
        });

        var levelNames = [];
        for (var lv = 1; lv <= maxLevel; lv++) levelNames.push('第 ' + lv + ' 关');

        var pack = {
          id: packId,
          name: name,
          grade: grade,
          subject: subject,
          intro: intro,
          difficulty: difficulty,
          levelNames: levelNames,
          levelCount: maxLevel,
          custom: true,
          source: importState.parsed.source || 'json',
          createdAt: Date.now()
        };

        ZCD.store.addCustomPack(pack, questions);
        importState = null;
        ui.toast('导入成功：' + name + '（' + questions.length + ' 道题）', 'ok', 2800);
        ZCD.router.go('/packs', { grade: grade, subject: subject });
      });

      /* --- 自定义知识包操作 --- */
      util.on(main, '[data-map]', 'click', function (ev, el) {
        ZCD.router.go('/map', { pack: el.getAttribute('data-map') });
      });
      util.on(main, '[data-export]', 'click', function (ev, el) {
        var packId = el.getAttribute('data-export');
        var pack = ZCD.data.getPack(packId);
        if (!pack) return;
        var qs = ZCD.data.questionsOf(packId);
        var payload = {
          pack: { name: pack.name, grade: pack.grade, subject: pack.subject, intro: pack.intro, difficulty: pack.difficulty, levelNames: pack.levelNames },
          questions: qs.map(function (q) {
            return {
              id: q.id, grade: q.grade, subject: q.subject, level: q.level, point: q.point,
              type: q.type, stem: q.stem,
              options: q.options.map(function (o) { return { key: o.key, text: o.text }; }),
              answer: q.answer, analysis: q.analysis, hint: q.hint || '', difficulty: q.difficulty
            };
          })
        };
        util.download(pack.name + '.json', JSON.stringify(payload, null, 2), 'application/json');
        ui.toast('已导出 ' + pack.name, 'ok');
      });
      util.on(main, '[data-del]', 'click', function (ev, el) {
        var packId = el.getAttribute('data-del');
        var pack = ZCD.data.getPack(packId);
        if (!pack) return;
        var qCount = ZCD.data.questionsOf(packId).length;
        ui.confirm({
          title: '删除这个知识包？',
          body: '「' + util.esc(pack.name) + '」的 ' + qCount + ' 道题和它的关卡记录会被删除（错题本里的历史记录会保留）。此操作不能撤销。',
          okText: '删除',
          danger: true
        }).then(function (ok) {
          if (!ok) return;
          ZCD.store.removeCustomPack(packId);
          ui.toast('已删除', 'ok');
          ZCD.app.render();
        });
      });

      /* --- 内置题库自检 --- */
      var selfBtn = main.querySelector('#btn-selfcheck');
      if (selfBtn) selfBtn.addEventListener('click', function () {
        var box = main.querySelector('#selfcheck-result');
        var builtin = ZCD.data.builtinQuestions();
        var customQs = ZCD.store.state().custom.questions;
        var r1 = V.validateQuestions(builtin, { strictIds: true });
        var r2 = customQs.length ? V.validateQuestions(customQs, { strictIds: false }) : null;
        var html = '<div class="row">' +
          '<span class="chip ' + (r1.errors.length ? 'chip-red' : 'chip-green') + '">内置题库：' + builtin.length + ' 题，错误 ' + r1.errors.length + ' 条，提示 ' + r1.warnings.length + ' 条</span>' +
          (r2 ? '<span class="chip ' + (r2.errors.length ? 'chip-red' : 'chip-green') + '">自定义题库：' + customQs.length + ' 题，错误 ' + r2.errors.length + ' 条</span>' : '') +
        '</div>';
        var problems = r1.errors.concat(r1.warnings).slice(0, 30);
        if (r2) problems = problems.concat(r2.errors);
        html += problems.length
          ? '<div class="issues mt-12">' + problems.map(function (p) {
              return '<div class="issue ' + (p.level === 'error' ? 'is-error' : 'is-warning') + '"><span class="issue-icon">' + (p.level === 'error' ? '❌' : '⚠️') + '</span><span>' + util.esc(p.message) + '</span></div>';
            }).join('') + '</div>'
          : '<div class="notice mt-12" style="background:var(--green-soft);border-color:#c7efe1;color:#0b7a5b">✅ 全部通过：内置题库字段完整、答案都在选项中、每题都有解析。</div>';
        box.innerHTML = html;
        ui.toast('自检完成', 'ok');
      });
    }
  };

  /* ==================== 数据与设置 ==================== */

  ZCD.views.settings = {
    render: function () {
      var s = ZCD.store.state();
      var info = ZCD.store.storageInfo();
      var stats = ZCD.data.stats();

      return '' +
        '<div class="view-title-row">' +
          '<div><h1 class="view-title">⚙️ 数据与设置</h1>' +
          '<p class="view-desc">学习数据保存在当前设备与当前浏览器里，不会自动同步到别的设备。</p></div>' +
          '<div class="spacer"></div>' +
          '<button class="btn btn-soft btn-sm" data-go="/report">查看学习报告</button>' +
        '</div>' +

        '<div class="card">' +
          '<h2 class="card-title">🙋 我的信息</h2>' +
          '<div class="row">' +
            '<span class="text-sm">昵称：<b>' + util.esc(s.profile.nickname) + '</b></span>' +
            '<button class="btn btn-soft btn-sm" id="btn-rename">修改昵称</button>' +
            '<span class="spacer"></span>' +
            '<label class="row row-tight text-sm" style="cursor:pointer">' +
              '<input type="checkbox" id="chk-motion"' + (s.settings.reduceMotion ? ' checked' : '') + '> 减少动画效果' +
            '</label>' +
          '</div>' +
          '<p class="text-xs text-muted mt-8">当前等级：Lv.' + ZCD.rewards.levelFromXp(s.xp).level + ' · ' + util.esc(ZCD.rewards.levelFromXp(s.xp).title) + ' · 累计经验 ' + s.xp + ' XP</p>' +
        '</div>' +

        '<div class="card">' +
          '<h2 class="card-title">💾 数据存储状态</h2>' +
          '<div class="grid grid-3">' +
            '<div class="stat-tile"><div class="stat-value" style="font-size:17px">' + (info.available ? '✅ 可用' : '⚠️ 受限') + '</div><div class="stat-label">浏览器本地存储</div></div>' +
            '<div class="stat-tile"><div class="stat-value" style="font-size:17px">' + util.bytesText(info.bytes) + '</div><div class="stat-label">当前占用空间</div></div>' +
            '<div class="stat-tile"><div class="stat-value" style="font-size:17px">' + s.custom.packs.length + ' / ' + stats.builtinPacks + '</div><div class="stat-label">自定义 / 内置知识包</div></div>' +
          '</div>' +
          '<p class="text-xs text-muted mt-12">存储键名：<code>' + util.esc(info.key) + '</code>　已记录答题 ' + s.totals.answered + ' 次 · 错题 ' + s.wrong.length + ' 条 · 知识点统计 ' + Object.keys(ZCD.store.pointStats()).length + ' 个 · 自定义题目 ' + s.custom.questions.length + ' 道</p>' +
          (info.available ? '' : '<div class="notice notice-danger mt-12">当前浏览器无法使用本地存储（可能处于隐私模式），进度只会在本次会话中保留。</div>') +
          (ZCD.store.loadErrorInfo() ? '<div class="notice notice-danger mt-12">' + util.esc(ZCD.store.loadErrorInfo().message) + '</div>' : '') +
        '</div>' +

        '<div class="card">' +
          '<h2 class="card-title">🔒 隐私说明</h2>' +
          '<ul class="text-sm text-muted">' +
            '<li>· 所有答题记录、错题、知识点统计与学习进度都只保存在这台设备的浏览器里</li>' +
            '<li>· 不上传学生答题记录，不接入任何外部服务，也不调用在线 AI 模型</li>' +
            '<li>· 知识掌握程度由本地固定规则根据答题与复习表现计算，不使用 AI 推断</li>' +
            '<li>· 清理浏览器数据会清空进度，建议定期用下面的「导出学习数据」做备份</li>' +
          '</ul>' +
        '</div>' +

        '<div class="card">' +
          '<h2 class="card-title">⬇️ 备份与恢复</h2>' +
          '<p class="text-sm text-muted mb-12">把学习数据导出成一个 JSON 文件保存下来；换设备时可以再导入，实现手动迁移。</p>' +
          '<div class="row">' +
            '<button class="btn btn-soft" id="btn-export">导出学习数据（JSON）</button>' +
            '<button class="btn btn-soft" id="btn-import-data">导入学习数据</button>' +
            '<button class="btn btn-soft" data-go="/about">关于知闯岛</button>' +
          '</div>' +
        '</div>' +

        '<div class="card">' +
          '<h2 class="card-title">♻️ 重置学习数据</h2>' +
          '<p class="text-sm text-muted mb-12">会清空答题记录、错题本、关卡解锁、星星与经验，以及导入的自定义题库，恢复到刚打开时的状态。内置题库不受影响。</p>' +
          '<button class="btn btn-danger" id="btn-reset">重置所有学习数据</button>' +
        '</div>' +

        '<div class="notice notice-warn mt-16">' +
          '💡 请注意：数据保存在本机浏览器（' + util.esc(info.key) + '）。<b>清理浏览器数据、更换设备或更换浏览器都会导致进度丢失</b>，建议定期用上面的「导出学习数据」做备份。' +
        '</div>';
    },

    mount: function (ctx, main) {
      var rename = main.querySelector('#btn-rename');
      if (rename) rename.addEventListener('click', function () {
        ui.prompt({ title: '修改昵称', label: '昵称', value: ZCD.store.state().profile.nickname, maxlength: 12, placeholder: '例如：小闯关者' })
          .then(function (v) {
            if (v === null) return;
            ZCD.store.setProfile({ nickname: v || '小闯关者' });
            ui.toast('昵称已更新', 'ok');
            ZCD.app.render();
          });
      });

      var chk = main.querySelector('#chk-motion');
      if (chk) chk.addEventListener('change', function () {
        ZCD.store.state().settings.reduceMotion = chk.checked;
        ZCD.store.save();
        document.body.classList.toggle('reduce-motion', chk.checked);
        ui.toast(chk.checked ? '已开启减少动画' : '已关闭减少动画', 'ok');
      });

      var exportBtn = main.querySelector('#btn-export');
      if (exportBtn) exportBtn.addEventListener('click', function () {
        util.download('知闯岛-学习数据-' + util.dayKey() + '.json', ZCD.store.exportJSON(), 'application/json');
        ui.toast('学习数据已导出', 'ok');
      });

      var importBtn = main.querySelector('#btn-import-data');
      if (importBtn) importBtn.addEventListener('click', function () {
        ui.openModal({
          title: '导入学习数据',
          body: '<p class="text-sm text-muted mb-8">把之前导出的 JSON 内容粘贴进来，会覆盖当前的答题记录、错题、进度与自定义题库。</p>' +
            '<textarea class="io" id="io-data" placeholder="粘贴学习数据 JSON……"></textarea>',
          footer: '<button class="btn btn-soft" data-modal-close>取消</button><button class="btn btn-primary" id="btn-do-import">确认导入</button>',
          onMount: function (modal) {
            var btn = modal.querySelector('#btn-do-import');
            btn.addEventListener('click', function () {
              var text = modal.querySelector('#io-data').value;
              if (!text.trim()) { ui.toast('请先粘贴内容', 'warn'); return; }
              try {
                ZCD.store.importJSON(text);
                ui.closeModal();
                ui.toast('学习数据已恢复', 'ok');
                ZCD.app.render();
              } catch (e) {
                ui.toast('导入失败：不是有效的 JSON 数据', 'bad', 3000);
              }
            });
          }
        });
      });

      var reset = main.querySelector('#btn-reset');
      if (reset) reset.addEventListener('click', function () {
        ui.confirm({
          title: '重置所有学习数据？（第 1 步 / 共 2 步）',
          body: '这会清空答题记录、错题本、关卡解锁状态、星星与经验、自定义题库。此操作无法撤销。',
          okText: '继续',
          danger: true
        }).then(function (ok1) {
          if (!ok1) return;
          return ui.confirm({
            title: '再次确认：真的要全部清除吗？（第 2 步 / 共 2 步）',
            body: '清除后无法找回，建议先「导出学习数据」做备份。确定要重置吗？',
            okText: '确认重置',
            cancelText: '我再想想',
            danger: true
          }).then(function (ok2) {
            if (!ok2) return;
            ZCD.store.resetAll();
            ZCD.session = null;
            ZCD.lastResult = null;
            importState = null;
            ui.toast('学习数据已重置', 'ok', 2600);
            ZCD.router.go('/');
          });
        });
      });
    }
  };

  /* ==================== 关于 ==================== */

  ZCD.views.about = {
    render: function () {
      var stats = ZCD.data.stats();
      return '<div class="card">' +
        '<h1 class="view-title">🏝️ 关于知闯岛</h1>' +
        '<p class="text-sm text-muted mt-8">知闯岛是一个面向小学 3—6 年级的知识闯关工作台：把知识练习变成闯关，边玩边查漏补缺。</p>' +
        '<ul class="text-sm mt-12">' +
          '<li>· 内置 ' + stats.builtinPacks + ' 个知识包 / ' + stats.builtinQuestions + ' 道题，覆盖三至六年级的数学、语文、英语、科学</li>' +
          '<li>· 每个知识包 5 个关卡，每关 5 道题，支持单选与判断</li>' +
          '<li>· 每道题都带引导提示（hint）：答错时先给思路，不直接告诉答案，需要时再点开解析</li>' +
          '<li>· 错题本自动记录题干、答案、解析、错误次数与最近答错/复习时间，可以筛选、查看和重新作答</li>' +
          '<li>· 知识点掌握程度由本地固定规则判定（≥3 次作答 + 最近 3 次都答对 + 错题都已复习），不使用 AI 推断</li>' +
          '<li>· 不联网、不调用任何外部 AI 模型、不需要 API Key、不需要服务端</li>' +
          '<li>· 学习数据保存在浏览器本地（localStorage），刷新后自动恢复，不上传答题记录</li>' +
        '</ul>' +
        '<div class="row mt-16">' +
          '<button class="btn btn-soft" data-go="/">回到学习大厅</button>' +
          '<button class="btn btn-soft" data-go="/settings">数据与设置</button>' +
        '</div>' +
      '</div>';
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);