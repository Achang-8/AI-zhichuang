/*!
 * 知闯岛 · 答题页与闯关结算
 */
(function (root) {
  'use strict';
  var ZCD = root.ZCD;
  var util = ZCD.util;
  var ui = ZCD.ui;
  ZCD.views = ZCD.views || {};

  var LETTERS = 'ABCD';

  /* ==================== 会话管理 ==================== */

  function startLevelSession(packId, level) {
    var pack = ZCD.data.getPack(packId);
    if (!pack) return null;
    var questions = ZCD.data.levelQuestions(packId, level);
    if (!questions.length) return null;
    ZCD.session = {
      mode: 'level',
      packId: packId,
      level: Number(level),
      pack: pack,
      questions: questions,
      index: 0,
      chosen: null,
      submitted: false,
      records: [],
      correct: 0,
      startedAt: Date.now(),
      finished: false,
      analysisRevealed: false,
      encourage: '',
      gentle: ''
    };
    return ZCD.session;
  }

  /** 把错题本里的记录还原成可作答的题目（自定义题库被删除时仍可复习） */
  function entryToQuestion(e) {
    var found = ZCD.data.questionById(e.qid);
    if (found) return found;
    return {
      id: e.qid,
      grade: e.grade,
      subject: e.subject,
      packId: e.packId,
      level: e.level,
      point: e.point || '错题复习',
      type: e.type || 'single',
      stem: e.stem,
      options: e.options || [],
      answer: e.answer,
      analysis: e.analysis,
      hint: e.hint || '',
      difficulty: 1,
      custom: true
    };
  }

  function startReviewSession(entries, label) {
    var questions = entries.map(entryToQuestion).filter(function (q) { return q && q.options && q.options.length; });
    if (!questions.length) return null;
    ZCD.session = {
      mode: 'review',
      packId: null,
      level: null,
      pack: null,
      label: label || '错题复习',
      questions: questions,
      index: 0,
      chosen: null,
      submitted: false,
      records: [],
      correct: 0,
      startedAt: Date.now(),
      finished: false,
      analysisRevealed: false,
      encourage: '',
      gentle: ''
    };
    return ZCD.session;
  }

  /* ==================== 答题页 HTML ==================== */

  function dotsHTML(session) {
    return session.questions.map(function (q, i) {
      var cls = 'dot';
      var rec = session.records[i];
      if (rec) cls += rec.correct ? ' ok' : ' bad';
      else if (i === session.index) cls += ' now';
      return '<span class="' + cls + '"></span>';
    }).join('');
  }

  function optionHTML(q, session) {
    var submitted = session.submitted;
    return q.options.map(function (o) {
      var cls = 'option';
      if (submitted) {
        if (o.key === q.answer) cls += ' is-correct';
        else if (o.key === session.chosen) cls += ' is-wrong';
      } else if (o.key === session.chosen) {
        cls += ' is-picked';
      }
      var mark = '';
      if (submitted) {
        if (o.key === q.answer) mark = '<span class="option-mark" style="color:var(--green)">✓ 正确答案</span>';
        else if (o.key === session.chosen) mark = '<span class="option-mark" style="color:var(--red)">✗ 你的选择</span>';
      }
      return '<button class="' + cls + '" data-option="' + o.key + '"' + (submitted ? ' disabled' : '') + '>' +
        '<span class="option-key">' + o.key + '</span>' +
        '<span style="flex:1">' + util.esc(o.text) + '</span>' + mark +
      '</button>';
    }).join('');
  }

  function optionTextOf(q, key) {
    var opts = q.options || [];
    for (var i = 0; i < opts.length; i++) {
      if (String(opts[i].key).toUpperCase() === String(key).toUpperCase()) return opts[i].text;
    }
    return '';
  }

  /**
   * 答题后的反馈区
   * 答对：鼓励语 + 正确答案 + 一句巩固解释 + 下一题
   * 答错：温和反馈 + 引导提示（题库未配置提示时用通用文案，不编造题目内容）
   *       + 正确答案 + 解析（先让孩子想一想，点「查看解析」后再展示）
   */
  function feedbackHTML(q, session) {
    if (!session.submitted) return '';
    var rec = session.records[session.index] || {};
    var correct = !!rec.correct;
    var answerBox = '<span class="answer-box">' + util.esc(q.answer) +
      (optionTextOf(q, q.answer) ? ' · ' + util.esc(optionTextOf(q, q.answer)) : '') + '</span>';

    if (correct) {
      return '<div class="feedback is-ok">' +
        '<div class="feedback-title">🎉 ' + util.esc(session.encourage || ZCD.rewards.pick('correct')) +
          '<span class="star-burst" aria-hidden="true">' +
            '<span style="--bx:26px;--by:-22px">✨</span>' +
            '<span style="--bx:44px;--by:-4px">⭐</span>' +
            '<span style="--bx:18px;--by:-38px">✨</span>' +
          '</span>' +
        '</div>' +
        '<div class="feedback-line">正确答案：' + answerBox + '</div>' +
        '<div class="analysis"><b>💡 巩固一下：</b>' + util.nl2br(q.analysis) + '</div>' +
      '</div>';
    }

    var hint = ZCD.rewards.safeHint(q);
    var hasHint = !!hint;
    var revealed = session.analysisRevealed || !hasHint;   // 没有提示时直接展示解析
    var chosenBox = session.chosen
      ? '<span class="answer-box">' + util.esc(session.chosen) +
        (optionTextOf(q, session.chosen) ? ' · ' + util.esc(optionTextOf(q, session.chosen)) : '') + '</span>'
      : '<span class="answer-box">未作答</span>';

    return '<div class="feedback is-bad">' +
      '<div class="feedback-title">🌱 ' + util.esc(session.gentle || ZCD.rewards.pick('wrong')) + '</div>' +
      '<div class="feedback-line">正确答案：' + answerBox + '　你的选择：' + chosenBox + '</div>' +
      '<div class="hint-box">' +
        '<b>' + (hasHint ? '🧭 小提示：' : '🧭 想一想：') + '</b>' +
        util.esc(hasHint ? hint : ZCD.rewards.pick('genericHint')) +
      '</div>' +
      (revealed
        ? '<div class="analysis"><b>💡 知识解析：</b>' + util.nl2br(q.analysis) + '</div>' +
          '<div class="text-xs text-muted mt-8">' + util.esc(ZCD.rewards.pick('afterAnalysis')) + '</div>'
        : '<div class="row mt-12">' +
            '<button class="btn btn-soft btn-sm" id="btn-reveal">👀 查看解析</button>' +
            '<span class="text-xs text-muted">先按提示想一想，再看解析会记得更牢</span>' +
          '</div>') +
    '</div>';
  }

  function quizHTML() {
    var session = ZCD.session;
    var q = session.questions[session.index];
    var total = session.questions.length;
    var isLast = session.index === total - 1;
    var modeLabel = session.mode === 'review' ? '错题复习' : '闯关答题';
    var levelName = session.mode === 'review'
      ? (session.label || '错题复习')
      : (session.pack ? ZCD.data.levelName(session.pack, session.level) : '第 ' + session.level + ' 关');
    var packName = session.mode === 'review' ? '来自错题本' : (session.pack ? session.pack.name : '');

    var footBtns;
    if (session.submitted) {
      footBtns = '<button class="btn btn-primary btn-lg" id="btn-next">' +
        (isLast ? '完成本关，查看结算 🏁' : '下一题 →') + '</button>';
    } else {
      footBtns = '<button class="btn btn-primary btn-lg" id="btn-submit"' + (session.chosen ? '' : ' disabled') + '>提交答案</button>' +
        '<span class="text-xs text-muted">提交后本题不能再修改答案</span>';
    }

    return '' +
      '<div class="quiz-scene">' +
        '<div class="quiz-scene-head">' +
          '<span class="hero-pack-icon">' + ZCD.subjectMeta(q.subject).emoji + '</span>' +
          '<div>' +
            '<div class="qs-title">' + util.esc(levelName) + '</div>' +
            '<div class="qs-sub">' + util.esc(packName) + ' · ' + modeLabel + '</div>' +
          '</div>' +
          '<span class="spacer"></span>' +
          '<span class="quiz-progress-text">第 ' + (session.index + 1) + ' / ' + total + ' 题</span>' +
          '<button class="btn btn-soft btn-sm" id="btn-quit" data-confirm="leave-quiz">退出本关</button>' +
        '</div>' +
        '<div class="quiz-progress-track">' +
          ui.bar(util.pct(session.index + (session.submitted ? 1 : 0), total), 'bar-accent') +
          '<span class="dots">' + dotsHTML(session) + '</span>' +
          '<span class="text-xs text-muted">已答对 ' + session.correct + ' 题</span>' +
        '</div>' +

        '<div class="q-card">' +
          '<div class="row">' +
            '<span class="chip ' + (q.type === 'judge' ? 'chip-violet' : 'chip') + ' q-type">' + (q.type === 'judge' ? '判断题' : '单选题') + '</span>' +
            '<span class="chip chip-gray">' + util.esc(ZCD.subjectMeta(q.subject).name) + '</span>' +
            '<span class="chip chip-gray">' + util.esc(ZCD.gradeLabel(q.grade)) + '</span>' +
            '<span class="chip chip-gold" title="难度">' + util.starsText(q.difficulty, 3) + '</span>' +
            '<span class="spacer"></span>' +
            '<span class="q-point">知识点：' + util.esc(q.point) + '</span>' +
          '</div>' +
          '<h2 class="q-stem">' + util.nl2br(q.stem) + '</h2>' +
          '<div class="options">' + optionHTML(q, session) + '</div>' +
          feedbackHTML(q, session) +
          '<div class="quiz-foot">' + footBtns + '</div>' +
        '</div>' +
      '</div>';
  }

  /* ==================== 答题页视图 ==================== */

  ZCD.views.quiz = {
    render: function (ctx) {
      var packId = ctx.params.pack;
      var level = Number(ctx.params.level);

      // 需要新开一关（直接通过 URL 进入）
      if (packId && level) {
        var same = ZCD.session && ZCD.session.mode === 'level' &&
          ZCD.session.packId === packId && ZCD.session.level === level;
        if (!same || ZCD.session.finished) {
          var pack = ZCD.data.getPack(packId);
          if (!pack) {
            return '<div class="card">' + ui.empty('🧭', '没有找到这个知识包。',
              '<button class="btn btn-primary" data-go="/select">重新选择</button>') + '</div>';
          }
          if (!ZCD.store.isLevelUnlocked(packId, level)) {
            return '<div class="card">' + ui.empty('🔒', '第 ' + level + ' 关还没有解锁，先通过上一关吧。',
              '<button class="btn btn-primary" data-go="/map" data-pack="' + util.esc(packId) + '">回到闯关地图</button>') + '</div>';
          }
          startLevelSession(packId, level);
        }
      }

      if (!ZCD.session) {
        return '<div class="card">' + ui.empty('📝', '现在没有正在进行的答题。',
          '<button class="btn btn-primary" data-go="/select">选择知识包开始闯关</button>') + '</div>';
      }

      if (!ZCD.session.questions.length) {
        return '<div class="card">' + ui.empty('📭', '这一关暂时没有题目，可能是题库被删除了。',
          '<button class="btn btn-primary" data-go="/select">重新选择</button>') + '</div>';
      }

      var session = ZCD.session;
      var pack = session.pack;
      return '<div id="quiz-body"></div>' +
        (session.mode === 'level' && pack ?
          '<div class="notice mt-16">🔒 解锁规则：本关正确率达到 <b>60%</b> 即可通关并解锁下一关；已通关的关卡可以重复挑战，但首次通关奖励不会重复发放。</div>' : '');
    },

    mount: function (ctx, main) {
      var session = ZCD.session;
      if (!session) return;
      var body = main.querySelector('#quiz-body');
      if (!body) return;
      // 答题时进入专注模式：隐藏底部导航，避免误触离开
      document.body.classList.add('is-focus');

      function paint() { body.innerHTML = quizHTML(); }
      paint();

      // 记录「上次挑战」，供大厅的继续闯关使用
      if (session.mode === 'level' && !session._lastPlayedSet) {
        session._lastPlayedSet = true;
        ZCD.store.setLastPlayed({
          packId: session.packId,
          level: session.level,
          grade: session.pack ? session.pack.grade : null,
          subject: session.pack ? session.pack.subject : null
        });
      }

      util.on(body, '.option', 'click', function (ev, el) {
        if (session.submitted) return;
        session.chosen = el.getAttribute('data-option');
        paint();
      });

      util.on(body, '#btn-submit', 'click', function () {
        if (session.submitted) return;
        if (!session.chosen) { ui.toast('先选一个答案再提交', 'warn'); return; }
        var q = session.questions[session.index];
        var res = ZCD.store.recordAnswer({
          question: q,
          chosen: session.chosen,
          mode: session.mode === 'review' ? 'review' : 'level'
        });
        session.submitted = true;
        session.records[session.index] = { qid: q.id, chosen: session.chosen, correct: res.correct };
        if (res.correct) session.correct++;
        // 反馈文案在提交时选定：同一次作答反复渲染时不会变来变去
        session.encourage = ZCD.rewards.pick('correct');
        session.gentle = ZCD.rewards.pick('wrong');
        session.analysisRevealed = false;
        paint();
        var fb = body.querySelector('.feedback');
        if (fb && fb.scrollIntoView) fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });

      util.on(body, '#btn-next', 'click', function () {
        if (!session.submitted) return;
        if (session.index >= session.questions.length - 1) { finish(); return; }
        session.index++;
        session.chosen = null;
        session.submitted = false;
        session.analysisRevealed = false;
        session.encourage = '';
        session.gentle = '';
        paint();
        root.scrollTo(0, 0);
      });

      // 答错后先看提示想一想，再点开解析
      util.on(body, '#btn-reveal', 'click', function () {
        if (!session.submitted) return;
        session.analysisRevealed = true;
        paint();
      });

      util.on(body, '#btn-quit', 'click', function (ev) {
        ev.stopPropagation();
        ui.confirm({
          title: '要离开本关吗？',
          body: '本关还没有答完。已经提交的题目记录会保留，但本关不会结算。',
          okText: '离开本关',
          cancelText: '继续答题',
          danger: true
        }).then(function (ok) {
          if (!ok) return;
          ZCD.session = null;
          if (session.mode === 'review') ZCD.router.go('/wrong');
          else ZCD.router.go('/map', { pack: session.packId });
        });
      });

      function finish() {
        var total = session.questions.length;
        var badgesBefore = ZCD.store.earnedBadgeIds();
        var payload;
        if (session.mode === 'level') {
          var r = ZCD.store.finishLevel({
            packId: session.packId,
            level: session.level,
            correct: session.correct,
            total: total
          });
          payload = Object.assign({}, r, {
            mode: 'level',
            pack: session.pack,
            levelName: session.pack ? ZCD.data.levelName(session.pack, session.level) : '第 ' + session.level + ' 关',
            questions: session.questions,
            records: session.records
          });
        } else {
          var rr = ZCD.store.finishReview({ correct: session.correct, total: total });
          payload = Object.assign({}, rr, {
            mode: 'review',
            label: session.label,
            questions: session.questions,
            records: session.records
          });
        }
        ZCD.lastResult = payload;
        payload.newBadges = ZCD.store.badges().filter(function (b) {
          return b.earned && badgesBefore.indexOf(b.id) < 0;
        });
        session.finished = true;
        ZCD.router.go('/result');
      }
    }
  };

  /* ==================== 结算页 ==================== */

  ZCD.views.result = {
    render: function () {
      var r = ZCD.lastResult;
      if (!r) {
        return '<div class="card">' + ui.empty('🏁', '还没有可以展示的结算结果。',
          '<button class="btn btn-primary" data-go="/select">去闯关</button>') + '</div>';
      }

      var total = r.total || 1;
      var records = r.records || [];
      var questions = r.questions || [];
      var wrongIdx = [];
      for (var i = 0; i < records.length; i++) if (records[i] && !records[i].correct) wrongIdx.push(i);
      var rightIdx = [];
      for (var j = 0; j < records.length; j++) if (records[j] && records[j].correct) rightIdx.push(j);

      /* ---- 掌握的知识点 ---- */
      var masteredPoints = util.uniq(rightIdx.map(function (i) { return questions[i] ? questions[i].point : null; }).filter(Boolean));
      /* ---- 需要复习的错题 ---- */
      var needReview = util.uniq(wrongIdx.map(function (i) { return questions[i] ? questions[i].point : null; }).filter(Boolean));

      /* ---- 明星片 ---- */
      var starsHTML;
      if (r.mode === 'review') {
        starsHTML = '<div class="big-stars">📘</div>';
      } else {
        starsHTML = '<div class="big-stars">' + [0, 1, 2].map(function (i) {
          var filled = i < (r.awardedStars || 0);
          return '<span class="' + (filled ? 'star-pop' : 'dim') + '" style="animation-delay:' + (i * 0.16).toFixed(2) + 's">' + (filled ? '★' : '☆') + '</span>';
        }).join('') + '</div>';
      }

      var title, sub, heroCls = '', badgeText = '', chestHTML = '';
      if (r.mode === 'review') {
        title = '错题复习完成';
        sub = '答对 ' + r.correct + ' / ' + total + ' 题，正确率 ' + r.accuracy + '%';
        badgeText = '📘 错题复习';
        chestHTML = '<div class="result-chest" aria-hidden="true">📘</div>';
      } else if (r.passed) {
        title = r.firstClear ? '通关成功，新岛屿已解锁！' : (r.upgrade > 0 ? '成绩刷新，星级提升！' : '再次通关');
        sub = '正确率 ' + r.accuracy + '%　·　答对 ' + r.correct + ' / ' + total + ' 题';
        badgeText = r.firstClear ? '🎊 首次通关' : (r.upgrade > 0 ? '🌟 星级提升' : '✅ 再次通关');
        chestHTML = '<div class="result-chest is-open" id="result-chest" aria-hidden="true">' +
          '<span class="chest-rays"></span>🎁</div>';
      } else {
        title = '还差一点点';
        sub = '正确率 ' + r.accuracy + '% ，达到 60% 才能通关。看看解析，再来一次一定行！';
        heroCls = ' is-fail';
        badgeText = '💪 继续加油';
        chestHTML = '<div class="result-chest" aria-hidden="true">🧰</div>';
      }

      /* ---- 新获得的徽章 ---- */
      var newBadges = r.newBadges || [];
      var badgeHTML = newBadges.length
        ? '<div class="card mt-16"><h2 class="card-title">🎖️ 解锁新徽章 <span class="hint">共 ' + newBadges.length + ' 枚</span></h2>' +
            '<div class="grid grid-4">' + newBadges.map(function (b) {
              return '<div class="badge-tile is-earned is-new"><div class="badge-emoji">' + b.emoji + '</div>' +
                '<div class="badge-name">' + util.esc(b.name) + '</div>' +
                '<div class="badge-desc">' + util.esc(b.desc) + '</div></div>';
            }).join('') + '</div></div>'
        : '';

      /* ---- 错题清单 ---- */
      var wrongHTML = wrongIdx.length ? wrongIdx.map(function (i) {
        var q = questions[i];
        var rec = records[i];
        var answerText = '';
        for (var k = 0; k < (q.options || []).length; k++) if (q.options[k].key === q.answer) answerText = q.options[k].text;
        var chosenText = '';
        for (var m = 0; m < (q.options || []).length; m++) if (q.options[m].key === rec.chosen) chosenText = q.options[m].text;
        return '<div class="wrong-mini">' +
          '<div class="stem">' + util.esc(q.stem) + '</div>' +
          '<div class="row mt-8 row-tight">' +
            '<span class="chip chip-red">你的答案：' + util.esc(rec.chosen) + (chosenText ? ' · ' + util.esc(chosenText) : '') + '</span>' +
            '<span class="chip chip-green">正确答案：' + util.esc(q.answer) + (answerText ? ' · ' + util.esc(answerText) : '') + '</span>' +
            '<span class="chip chip-gray">' + util.esc(q.point) + '</span>' +
          '</div>' +
          '<div class="exp">💡 ' + util.esc(q.analysis) + '</div>' +
        '</div>';
      }).join('') : '<div class="notice notice-warn">本关没有错题，全部答对啦！👏</div>';

      /* ---- 经验明细 ---- */
      var xpHTML;
      if (r.mode === 'review') {
        xpHTML = '<div class="xp-breakdown">' +
          '<div class="xp-line"><span class="k">复习答对 ' + r.correct + ' 题 × 1 经验</span><span class="v">+' + r.xpTotal + '</span></div>' +
          '<div class="xp-line"><span class="k">当前累计经验</span><span class="v">' + r.totalXp + ' XP</span></div>' +
        '</div>';
      } else {
        xpHTML = '<div class="xp-breakdown">' +
          '<div class="xp-line' + (r.xpQuestions ? '' : ' is-zero') + '"><span class="k">答对 ' + r.correct + ' 题 × ' + (r.firstClear ? ZCD.rewards.RULES.XP_PER_QUESTION : ZCD.rewards.RULES.XP_REPLAY_PER_QUESTION) + ' 经验</span><span class="v">+' + r.xpQuestions + '</span></div>' +
          '<div class="xp-line' + (r.xpFirstBonus ? '' : ' is-zero') + '"><span class="k">首次通关奖励' + (r.firstClear ? '' : '（已在之前领取）') + '</span><span class="v">+' + r.xpFirstBonus + '</span></div>' +
          '<div class="xp-line' + (r.xpStarBonus ? '' : ' is-zero') + '"><span class="k">' + (r.firstClear ? '星级加成（' + r.stars + ' 星）' : '星级提升奖励') + '</span><span class="v">+' + r.xpStarBonus + '</span></div>' +
          '<div class="xp-line" style="border-top:1px dashed var(--line);padding-top:7px"><span class="k"><b>本次共获得</b></span><span class="v">+' + r.xpTotal + ' XP</span></div>' +
        '</div>';
      }

      /* ---- 底部按钮：两个清晰的主入口（继续冒险 / 复习错题）+ 次要操作 ---- */
      var primaryActions = [];
      var secondaryActions = [];
      if (r.mode === 'level') {
        var levels = r.pack ? ZCD.data.levelList(r.pack.id) : [];
        var nextLevel = r.level + 1;
        var hasNext = levels.some(function (l) { return l.level === nextLevel; });

        if (r.passed && hasNext) {
          primaryActions.push('<button class="btn btn-accent btn-lg" data-go="/quiz" data-pack="' + util.esc(r.packId) + '" data-level="' + nextLevel + '">▶ 继续冒险（第 ' + nextLevel + ' 关）</button>');
        } else if (r.passed && !hasNext) {
          primaryActions.push('<button class="btn btn-accent btn-lg" data-go="/select">🧭 继续冒险（换一个知识包）</button>');
        } else {
          primaryActions.push('<button class="btn btn-accent btn-lg" data-go="/quiz" data-pack="' + util.esc(r.packId) + '" data-level="' + r.level + '">▶ 继续冒险（重新挑战本关）</button>');
        }

        primaryActions.push('<button class="btn btn-primary btn-lg" data-go="/wrong">📕 复习错题' + (wrongIdx.length ? '（本关 ' + wrongIdx.length + ' 题）' : '') + '</button>');

        secondaryActions.push('<button class="btn btn-soft" data-go="/map" data-pack="' + util.esc(r.packId) + '">🗺️ 返回闯关地图</button>');
        if (r.passed) secondaryActions.push('<button class="btn btn-soft" data-go="/quiz" data-pack="' + util.esc(r.packId) + '" data-level="' + r.level + '">🔁 再挑战一次本关</button>');
        secondaryActions.push('<button class="btn btn-soft" data-go="/report">📊 学习报告</button>');
      } else {
        primaryActions.push('<button class="btn btn-primary btn-lg" data-go="/wrong">📕 返回错题本</button>');
        primaryActions.push('<button class="btn btn-soft btn-lg" data-go="/report">📊 查看学习报告</button>');
      }

      var nextHint = '';
      if (r.mode === 'level') {
        var packLevels = r.pack ? ZCD.data.levelList(r.pack.id) : [];
        var nl = r.level + 1;
        if (r.passed && packLevels.some(function (l) { return l.level === nl; })) {
          nextHint = '<div class="mt-16"><span class="unlock-chip">🔓 第 ' + nl + ' 关已解锁 · 可以继续冒险</span></div>';
        } else if (r.passed) {
          nextHint = '<div class="mt-16"><span class="unlock-chip">🏆 这个知识包全部通关了</span></div>';
        } else {
          nextHint = '<div class="mt-16"><span class="unlock-chip is-locked">🔒 第 ' + nl + ' 关需要先通关本关</span></div>';
        }
      }

      return '' +
        '<div class="result-hero result-scene' + heroCls + (r.mode === 'level' && r.passed ? ' is-pass' : '') + '" id="result-hero">' +
          '<div class="scene-hills" aria-hidden="true">' +
            '<svg viewBox="0 0 600 96" preserveAspectRatio="none">' +
              '<path d="M0,96 L0,56 Q62,24 132,50 Q192,72 252,44 Q322,10 392,46 Q452,74 522,40 Q562,22 600,40 L600,96 Z" fill="rgba(255,255,255,.16)"/>' +
              '<path d="M0,96 L0,74 Q80,48 160,70 Q240,92 320,66 Q400,40 480,68 Q540,86 600,64 L600,96 Z" fill="rgba(255,255,255,.10)"/>' +
            '</svg>' +
          '</div>' +
          '<div class="result-badge">' + badgeText + '</div>' +
          '<div class="result-title">' + title + '</div>' +
          '<div class="result-sub">' + sub + '</div>' +
          starsHTML +
          chestHTML +
          '<div class="result-metrics">' +
            '<div class="result-tile"><div class="v">' + r.correct + '/' + total + '</div><div class="l">答对题数</div></div>' +
            '<div class="result-tile"><div class="v">' + r.accuracy + '%</div><div class="l">正确率</div></div>' +
            '<div class="result-tile"><div class="v">' + (r.mode === 'review' ? '—' : '★ ' + (r.awardedStars || 0)) + '</div><div class="l">本次星星</div></div>' +
            '<div class="result-tile"><div class="v">+' + r.xpTotal + '</div><div class="l">获得经验</div></div>' +
          '</div>' +
          nextHint +
        '</div>' +

        '<div class="result-actions">' + primaryActions.join('') + '</div>' +
        (secondaryActions.length ? '<div class="result-secondary">' + secondaryActions.join('') + '</div>' : '') +

        '<div class="grid grid-2 mt-16">' +
          '<div class="card">' +
            '<h2 class="card-title"><span class="t-icon">⚡</span>经验结算明细</h2>' + xpHTML +
            '<div class="notice mt-12 text-xs">奖励规则固定：星级只记录每关历史最好成绩，重复挑战不会重复领取首次通关奖励。</div>' +
          '</div>' +
          '<div class="card">' +
            '<h2 class="card-title"><span class="t-icon">📚</span>本关知识点</h2>' +
            (masteredPoints.length ? '<div><b class="text-sm">已掌握：</b><div class="row row-tight mt-8">' +
              masteredPoints.map(function (p) { return '<span class="chip chip-green">✅ ' + util.esc(p) + '</span>'; }).join('') + '</div></div>' : '') +
            (needReview.length ? '<div class="mt-12"><b class="text-sm">需要复习：</b><div class="row row-tight mt-8">' +
              needReview.map(function (p) { return '<span class="chip chip-red">📕 ' + util.esc(p) + '</span>'; }).join('') + '</div></div>' : '') +
            (!masteredPoints.length && !needReview.length ? '<p class="text-sm text-muted">本关没有记录到知识点。</p>' : '') +
          '</div>' +
        '</div>' +

        '<div class="card mt-16">' +
          '<h2 class="card-title"><span class="t-icon">📝</span>需要复习的错题 <span class="hint">已自动收进错题本</span></h2>' +
          wrongHTML +
        '</div>' +

        badgeHTML;
    },

    mount: function (ctx, main) {
      var r = ZCD.lastResult;
      if (!r) return;
      var hero = main.querySelector('#result-hero');
      if (r.mode === 'review') return;
      if (r.passed) ui.confetti(hero, r.awardedStars >= 3 ? 46 : 30);
    }
  };

  ZCD.quizSession = {
    startLevel: startLevelSession,
    startReview: startReviewSession
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);