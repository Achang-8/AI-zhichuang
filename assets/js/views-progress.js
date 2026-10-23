/*!
 * 知闯岛 · 错题本 与 学习报告
 */
(function (root) {
  'use strict';
  var ZCD = root.ZCD;
  var util = ZCD.util;
  var ui = ZCD.ui;
  ZCD.views = ZCD.views || {};

  /* ==================== 错题本 ==================== */

  var openRetry = null;      // 当前展开「重新答题」的错题 qid
  var openDetail = null;     // 当前展开「完整题目与解析」的错题 qid

  function optionText(q, key) {
    for (var i = 0; i < (q.options || []).length; i++) {
      if (q.options[i].key === key) return q.options[i].text;
    }
    return '';
  }

  function wrongCardHTML(e) {
    var mastered = e.status === 'mastered';
    var retrying = openRetry === e.qid;
    var detail = openDetail === e.qid || retrying;   // 重新答题时自动展开完整题目
    var pack = e.packId ? ZCD.data.getPack(e.packId) : null;

    var optionsHTML = (e.options || []).map(function (o) {
      var cls = 'opt-line';
      if (o.key === e.answer) cls += ' is-answer';
      else if (o.key === e.userAnswer) cls += ' is-chosen';
      return '<div class="' + cls + '"><b>' + o.key + '</b><span>' + util.esc(o.text) + '</span>' +
        (o.key === e.answer ? '<span class="spacer"></span><span class="text-xs">正确答案</span>' : '') +
        (o.key === e.userAnswer && o.key !== e.answer ? '<span class="spacer"></span><span class="text-xs">你选的</span>' : '') +
      '</div>';
    }).join('');

    var retryHTML = '';
    if (retrying) {
      retryHTML = '<div class="mt-12">' +
        '<div class="text-xs text-muted mb-8">重新答一遍，答对就会更新掌握状态（历史错误记录会保留）：</div>' +
        '<div class="options">' + (e.options || []).map(function (o) {
          return '<button class="option" data-answer-qid="' + util.esc(e.qid) + '" data-answer-key="' + o.key + '">' +
            '<span class="option-key">' + o.key + '</span><span style="flex:1">' + util.esc(o.text) + '</span></button>';
        }).join('') + '</div>' +
        '<div class="row mt-8"><button class="btn btn-soft btn-sm" data-cancel-retry="1">收起</button></div>' +
      '</div>';
    }

    var historyHTML = (e.history || []).slice(-5).reverse().map(function (h) {
      return '<div class="history-line">· ' + util.fmtDateTime(h.ts) + '　选择 ' + util.esc(h.chosen) + '　' + (h.correct ? '✅ 答对' : '❌ 答错') + (h.mode === 'review' ? '（复习）' : '') + '</div>';
    }).join('');

    // 未展开时显示简洁摘要 + 我的答案/正确答案，点击后展开完整题目与解析
    var summaryHTML = '<div class="row row-tight mt-8">' +
        '<span class="chip chip-red">我的答案：' + util.esc(e.userAnswer || '—') +
          (optionText(e, e.userAnswer) ? ' · ' + util.esc(optionText(e, e.userAnswer)) : '') + '</span>' +
        '<span class="chip chip-green">正确答案：' + util.esc(e.answer) +
          (optionText(e, e.answer) ? ' · ' + util.esc(optionText(e, e.answer)) : '') + '</span>' +
      '</div>';

    var detailHTML = detail
      ? '<div class="opt-list">' + optionsHTML + '</div>' +
        '<div class="analysis mt-8"><b>💡 知识解析：</b>' + util.nl2br(e.analysis) + '</div>' +
        retryHTML +
        '<details class="more"><summary>历史答题记录（' + (e.history || []).length + ' 条，显示最近 5 条）</summary>' + (historyHTML || '<div class="history-line">暂无</div>') + '</details>'
      : summaryHTML;

    return '<div class="wrong-card ' + (mastered ? 'is-mastered' : 'is-pending') + '">' +
      '<div class="wrong-head">' +
        ui.subjectChip(e.subject) + ui.gradeChip(e.grade) +
        '<span class="chip chip-gray">' + util.esc(e.point || '综合练习') + '</span>' +
        '<span class="chip chip-gray">' + util.esc(pack ? pack.name + ' · ' + ZCD.data.levelName(pack, e.level) : (e.packId || '') + ' 第 ' + e.level + ' 关') + '</span>' +
        '<span class="chip ' + (mastered ? 'chip-green' : 'chip-red') + '">' + (mastered ? '✅ 已掌握' : '📌 待复习') + '</span>' +
        '<span class="chip chip-gray">答错 ' + (e.wrongTimes || 1) + ' 次</span>' +
        (e.rightTimes ? '<span class="chip chip-gray">答对 ' + e.rightTimes + ' 次</span>' : '') +
        '<span class="spacer"></span>' +
        '<span class="text-xs text-muted">' +
          '最近答错 ' + util.fmtRelative(e.lastWrongAt || e.ts) +
          ' · 最近复习 ' + (e.lastReviewAt ? util.fmtRelative(e.lastReviewAt) : '还没有复习') +
        '</span>' +
      '</div>' +
      '<div class="wrong-stem">' + util.nl2br(e.stem) + '</div>' +
      detailHTML +
      '<div class="wrong-actions">' +
        (retrying
          ? ''
          : '<button class="btn btn-primary btn-sm" data-retry="' + util.esc(e.qid) + '">✍️ 重新答这题</button>') +
        (detail
          ? '<button class="btn btn-soft btn-sm" data-collapse="1">收起题目</button>'
          : '<button class="btn btn-soft btn-sm" data-detail="' + util.esc(e.qid) + '">🔍 查看完整题目与解析</button>') +
        (mastered
          ? '<button class="btn btn-soft btn-sm" data-unmaster="' + util.esc(e.qid) + '">↩️ 标回待复习</button>'
          : '<button class="btn btn-soft btn-sm" data-master="' + util.esc(e.qid) + '">✅ 标记为已掌握</button>') +
        '<button class="btn btn-danger btn-sm" data-remove="' + util.esc(e.qid) + '">🗑️ 删除这条记录</button>' +
      '</div>' +
    '</div>';
  }

  ZCD.views.wrong = {
    render: function (ctx) {
      var filter = {
        subject: ctx.params.subject || '',
        grade: ctx.params.grade || '',
        status: ctx.params.status || ''
      };
      var list = ZCD.store.wrongList(filter);
      var stats = ZCD.store.wrongStats();
      var pending = ZCD.store.wrongList({ status: 'pending' });

      var subjectCounts = {};
      ZCD.store.wrongList().forEach(function (e) { subjectCounts[e.subject] = (subjectCounts[e.subject] || 0) + 1; });

      var subjectFilters = '<button class="filter-btn' + (!filter.subject ? ' is-active' : '') + '" data-f-subject="">全部学科（' + stats.total + '）</button>' +
        ZCD.SUBJECTS.map(function (s) {
          var n = subjectCounts[s.key] || 0;
          return '<button class="filter-btn' + (filter.subject === s.key ? ' is-active' : '') + '" data-f-subject="' + s.key + '">' +
            s.emoji + ' ' + s.name + '（' + n + '）</button>';
        }).join('');

      var statusFilters = '<button class="filter-btn' + (!filter.status ? ' is-active' : '') + '" data-f-status="">全部状态</button>' +
        '<button class="filter-btn' + (filter.status === 'pending' ? ' is-active' : '') + '" data-f-status="pending">📌 待复习（' + stats.pending + '）</button>' +
        '<button class="filter-btn' + (filter.status === 'mastered' ? ' is-active' : '') + '" data-f-status="mastered">✅ 已掌握（' + stats.mastered + '）</button>';

      var gradeFilters = '<button class="filter-btn' + (!filter.grade ? ' is-active' : '') + '" data-f-grade="">全部年级</button>' +
        ZCD.GRADES.map(function (g) {
          return '<button class="filter-btn' + (String(filter.grade) === String(g.grade) ? ' is-active' : '') + '" data-f-grade="' + g.grade + '">' + g.label + '</button>';
        }).join('');

      // 按知识包筛选（只列出错题本里真正出现过的知识包）
      var packOptions = ZCD.store.wrongPackOptions();
      var packFilters = packOptions.length
        ? '<button class="filter-btn' + (!filter.pack ? ' is-active' : '') + '" data-f-pack="">全部知识包</button>' +
          packOptions.map(function (p) {
            return '<button class="filter-btn' + (filter.pack === p.packId ? ' is-active' : '') + '" data-f-pack="' + util.esc(p.packId) + '">' +
              util.esc(p.name) + '（' + p.count + '）</button>';
          }).join('')
        : '';

      var listHTML = list.length ? list.map(wrongCardHTML).join('<div style="height:12px"></div>')
        : ui.empty('🎉', stats.total === 0 ? '错题本还是空的。答错的题目会自动收进这里。' : '当前筛选条件下没有错题。',
            '<button class="btn btn-soft" data-go="/select">去闯关</button>');

      // 「复习全部待巩固错题」优先复习「还需练习」的知识点对应的错题
      var reviewQueue = ZCD.mastery
        ? ZCD.mastery.reviewQueue()
        : { list: pending, truncated: false, total: pending.length };

      return '' +
        '<div class="view-title-row">' +
          '<div><h1 class="view-title">📕 错题本</h1>' +
          '<p class="view-desc">答错的题自动记录在这里；重新答对后会更新掌握状态，历史错误记录会保留。</p></div>' +
          '<div class="spacer"></div>' +
          (reviewQueue.list.length
            ? '<button class="btn btn-accent" id="btn-review-all">🔁 复习全部待巩固错题（' + reviewQueue.list.length + '）</button>'
            : '') +
        '</div>' +

        '<div class="grid grid-4 mb-12">' +
          '<div class="stat-tile"><div class="stat-value">' + stats.total + '</div><div class="stat-label">错题总数</div></div>' +
          '<div class="stat-tile"><div class="stat-value" style="color:#b03a26">' + stats.pending + '</div><div class="stat-label">待复习</div></div>' +
          '<div class="stat-tile stat-green"><div class="stat-value">' + stats.mastered + '</div><div class="stat-label">已掌握</div></div>' +
          '<div class="stat-tile"><div class="stat-value">' + util.pct(stats.mastered, stats.total) + '%</div><div class="stat-label">掌握率</div></div>' +
        '</div>' +

        '<div class="card mb-12">' +
          '<div class="stack">' +
            '<div class="filter-row">' + subjectFilters + '</div>' +
            '<div class="filter-row">' + gradeFilters + '</div>' +
            (packFilters ? '<div class="filter-row">' + packFilters + '</div>' : '') +
            '<div class="filter-row">' + statusFilters +
              '<span class="spacer"></span>' +
              (stats.total ? '<button class="btn btn-danger btn-sm" id="btn-clear-wrong">清空错题本</button>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +

        (reviewQueue.truncated
          ? '<div class="notice notice-warn mb-12">待巩固错题共 ' + reviewQueue.total + ' 道，一次最多复习 ' + reviewQueue.list.length + ' 道，剩下的下次继续。</div>'
          : '') +

        listHTML +
        '<div class="notice mt-16">💡 提示：错题来自真实答题记录。重新挑战整组错题时，答对的题会更新掌握状态，但不会删除历史记录，方便你回看自己的进步。</div>';
    },

    mount: function (ctx, main) {
      var filter = {
        subject: ctx.params.subject || '',
        grade: ctx.params.grade || '',
        status: ctx.params.status || '',
        pack: ctx.params.pack || ''
      };
      function apply(patch) {
        var next = Object.assign({}, filter, patch);
        openRetry = null;
        openDetail = null;
        ZCD.router.go('/wrong', next);
      }

      util.on(main, '[data-f-subject]', 'click', function (ev, el) { apply({ subject: el.getAttribute('data-f-subject') }); });
      util.on(main, '[data-f-status]', 'click', function (ev, el) { apply({ status: el.getAttribute('data-f-status') }); });
      util.on(main, '[data-f-grade]', 'click', function (ev, el) { apply({ grade: el.getAttribute('data-f-grade') }); });
      util.on(main, '[data-f-pack]', 'click', function (ev, el) { apply({ pack: el.getAttribute('data-f-pack') }); });

      // 点击错题查看完整题目与解析
      util.on(main, '[data-detail]', 'click', function (ev, el) {
        openDetail = el.getAttribute('data-detail');
        openRetry = null;
        ZCD.router.go('/wrong', filter);
      });
      util.on(main, '[data-collapse]', 'click', function () {
        openDetail = null;
        openRetry = null;
        ZCD.router.go('/wrong', filter);
      });

      util.on(main, '[data-retry]', 'click', function (ev, el) {
        openRetry = el.getAttribute('data-retry');
        openDetail = null;
        ZCD.router.go('/wrong', filter);
      });
      util.on(main, '[data-cancel-retry]', 'click', function () {
        openRetry = null;
        ZCD.router.go('/wrong', filter);
      });

      util.on(main, '[data-answer-qid]', 'click', function (ev, el) {
        var qid = el.getAttribute('data-answer-qid');
        var key = el.getAttribute('data-answer-key');
        var entry = ZCD.store.wrongList().filter(function (e) { return e.qid === qid; })[0];
        if (!entry) { ui.toast('这条错题记录已经不存在了', 'warn'); return; }
        var q = {
          id: entry.qid, grade: entry.grade, subject: entry.subject, packId: entry.packId,
          level: entry.level, point: entry.point, type: entry.type, stem: entry.stem,
          options: entry.options, answer: entry.answer, analysis: entry.analysis
        };
        var res = ZCD.store.recordAnswer({ question: q, chosen: key, mode: 'review' });
        openRetry = null;
        openDetail = null;
        ui.toast(res.correct
          ? '答对了！这个知识点的掌握状态已更新 ✅'
          : '还是不对，看看解析，过一会儿可以再试 💪', res.correct ? 'ok' : 'bad', 2600);
        ZCD.router.go('/wrong', filter);
      });

      util.on(main, '[data-master]', 'click', function (ev, el) {
        ZCD.store.markMastered(el.getAttribute('data-master'));
        ui.toast('已标记为掌握', 'ok');
        ZCD.router.go('/wrong', filter);
      });
      util.on(main, '[data-unmaster]', 'click', function (ev, el) {
        ZCD.store.resetWrongStatus(el.getAttribute('data-unmaster'));
        ZCD.router.go('/wrong', filter);
      });
      util.on(main, '[data-remove]', 'click', function (ev, el) {
        var qid = el.getAttribute('data-remove');
        ui.confirm({ title: '删除这条错题记录？', body: '删除后这条错题和它的复习历史都会消失。', okText: '删除', danger: true })
          .then(function (ok) {
            if (!ok) return;
            ZCD.store.removeWrong(qid);
            ui.toast('已删除', 'ok');
            ZCD.router.go('/wrong', filter);
          });
      });

      var clearBtn = main.querySelector('#btn-clear-wrong');
      if (clearBtn) {
        clearBtn.addEventListener('click', function () {
          ui.confirm({
            title: '清空整个错题本？',
            body: '所有错题记录和复习历史都会被删除，且不能恢复。学习进度（关卡、星星、经验）不受影响。',
            okText: '确认清空',
            danger: true
          }).then(function (ok) {
            if (!ok) return;
            ZCD.store.clearWrong();
            ui.toast('错题本已清空', 'ok');
            ZCD.router.go('/wrong', {});
          });
        });
      }

      var reviewAll = main.querySelector('#btn-review-all');
      if (reviewAll) {
        reviewAll.addEventListener('click', function () {
          var queue = ZCD.mastery ? ZCD.mastery.reviewQueue() : { list: ZCD.store.wrongList({ status: 'pending' }) };
          var pending = queue.list || [];
          if (!pending.length) { ui.toast('没有待复习的错题', 'warn'); return; }
          var s = ZCD.quizSession.startReview(pending, '待巩固错题复习 · ' + pending.length + ' 题');
          if (!s) { ui.toast('这些错题缺少可作答的选项信息', 'bad'); return; }
          ZCD.router.go('/quiz');
        });
      }
    }
  };

  /* ==================== 学习报告 ==================== */

  ZCD.views.report = {
    render: function () {
      var s = ZCD.store.state();
      var lv = ZCD.rewards.levelFromXp(s.xp);
      var stars = ZCD.store.totalStars();
      var allPacks = ZCD.data.allPacks();
      var totalLevels = allPacks.reduce(function (n, p) { return n + ZCD.data.levelList(p.id).length; }, 0);
      var clearedLevels = ZCD.store.clearedLevelCount();
      var accuracy = util.pct(s.totals.correct, s.totals.answered);
      var ws = ZCD.store.wrongStats();
      var today = ZCD.store.activityToday();
      var days = Object.keys(s.activity).length;

      /* ---- 知识掌握（固定规则，来自真实答题记录） ---- */
      var mastery = ZCD.mastery.overview();
      var counts = mastery.counts;
      var pctOf = function (n) { return mastery.total ? (n / mastery.total * 100) : 0; };
      var masteredLabel = '已掌握 ' + counts.mastered + ' / ' + mastery.total + ' 个知识点（' + mastery.masteredPercent + '%）';
      var notStartedCount = mastery.all.filter(function (r) { return r.answered === 0; }).length;

      var masteryBarHTML = '<div class="stack-bar mt-12">' +
        '<i class="s-mastered" style="width:' + pctOf(counts.mastered) + '%" title="已掌握 ' + counts.mastered + '"></i>' +
        '<i class="s-practice" style="width:' + pctOf(counts.practice) + '%" title="还需练习 ' + counts.practice + '"></i>' +
        '<i class="s-new" style="width:' + pctOf(counts.new) + '%" title="尚未学习 ' + counts.new + '"></i>' +
      '</div>';

      /* ---- 各学科知识点状态分布 ---- */
      var subjectMasteryHTML = mastery.bySubject.map(function (row) {
        var meta = ZCD.subjectMeta(row.subject);
        return '<div class="subject-row">' +
          '<span class="subject-icon">' + meta.emoji + '</span>' +
          '<div class="subject-body">' +
            '<div class="subject-name">' + meta.name +
              '<span class="subject-num">已掌握 ' + row.mastered + ' / ' + row.total + ' 个知识点 · 练过 ' + row.studied + ' 个</span>' +
            '</div>' +
            '<div class="stack-bar mt-8">' +
              '<i class="s-mastered" style="width:' + util.pct(row.mastered, row.total) + '%"></i>' +
              '<i class="s-practice" style="width:' + util.pct(row.practice, row.total) + '%"></i>' +
              '<i class="s-new" style="width:' + util.pct(row.new, row.total) + '%"></i>' +
            '</div>' +
            '<div class="subject-num mt-8">答题 ' + row.answered + ' 道 · 正确率 ' + util.pct(row.correct, row.answered) + '%' +
              (row.wrongOpen ? ' · 待复习错题 ' + row.wrongOpen + ' 道' : '') + '</div>' +
          '</div>' +
        '</div>';
      }).join('') || ui.empty('📚', '还没有知识点数据。');

      /* ---- 需要优先复习的知识点 ---- */
      var priority = ZCD.mastery.priorityList(6);
      var priorityHTML = priority.length ? priority.map(function (p) {
        var target = ZCD.mastery.targetFor(p);
        return '<div class="point-row">' +
          '<span class="recent-dots">' + p.recent.slice(-5).map(function (v) {
            return '<i class="' + (v ? 'ok' : 'bad') + '"></i>';
          }).join('') + '</span>' +
          '<div style="flex:1;min-width:0">' +
            '<div class="point-name">' + util.esc(p.point) + '</div>' +
            '<div class="point-meta">' + ZCD.gradeLabel(p.grade) + ' · ' + ZCD.subjectMeta(p.subject).name +
              ' · 作答 ' + p.answered + ' 次 · 正确率 ' + p.accuracy + '%' +
              (p.wrongOpen ? ' · 待复习 ' + p.wrongOpen + ' 道' : '') + ' · ' + util.esc(p.reason) + '</div>' +
          '</div>' +
          (target && target.unlocked
            ? '<button class="btn btn-soft btn-sm" data-go="/quiz" data-pack="' + util.esc(target.packId) + '" data-level="' + target.level + '">去重练</button>'
            : '') +
        '</div>';
      }).join('') : '<div class="notice" style="background:var(--green-soft);border-color:#c7efe1;color:#0b7a5b">🎉 目前没有需要优先复习的知识点，表现得不错！</div>';

      /* ---- 最近一次学习表现 ---- */
      var perf = ZCD.mastery.lastPerformance();
      var perfHTML = perf.level
        ? '<div class="row mb-8">' +
            '<span class="chip chip-gray">' + util.fmtRelative(perf.at) + '</span>' +
            '<span class="chip ' + (perf.cleared ? 'chip-green' : 'chip-red') + '">' + (perf.cleared ? '已通关' : '未通关') + '</span>' +
            '<span class="chip chip-gold">' + util.starsText(perf.stars, 3) + '</span>' +
          '</div>' +
          '<div class="text-sm mb-8"><b>' + util.esc(perf.packName) + '</b> · ' + util.esc(perf.levelName) + ' · 最好正确率 ' + perf.accuracy + '%</div>' +
          (perf.recentTotal
            ? '<div class="point-meta mb-8">最近 ' + perf.recentTotal + ' 道题答对 ' + perf.recentCorrect + ' 道</div>' +
              '<div class="recent-dots">' + perf.recentAnswers.slice().reverse().map(function (a) {
                return '<i class="' + (a.correct ? 'ok' : 'bad') + '"></i>';
              }).join('') + '</div>'
            : '')
        : ui.empty('🌤️', '还没有完成过整关练习。', '<button class="btn btn-primary btn-sm" data-go="/select">去闯一关</button>');

      /* ---- 下一步学习建议（固定规则） ---- */
      var suggestions = ZCD.mastery.suggestions(4);
      var suggestHTML = suggestions.map(function (g) {
        return '<div class="suggest-item">' +
          '<span class="suggest-icon">' + g.icon + '</span>' +
          '<div class="suggest-text">' + util.esc(g.text) +
            (g.action
              ? '<div class="suggest-action"><button class="btn btn-primary btn-sm" data-go="' + g.action.go + '"' +
                (g.action.params && g.action.params.pack ? ' data-pack="' + util.esc(g.action.params.pack) + '"' : '') +
                (g.action.params && g.action.params.level ? ' data-level="' + g.action.params.level + '"' : '') +
                '>' + util.esc(g.action.label) + '</button></div>'
              : '') +
          '</div>' +
        '</div>';
      }).join('');

      /* ---- 已练过的知识点明细（未作答的只给数量，避免堆砌） ---- */
      var studiedPoints = mastery.studied;
      var pointDetailHTML = studiedPoints.length
        ? studiedPoints.map(function (p) {
            var meta = ZCD.mastery.STATUS[p.status];
            return '<div class="point-row">' +
              '<span class="status-chip" style="background:' + meta.soft + ';color:' + meta.color + '">' + meta.emoji + ' ' + meta.label + '</span>' +
              '<div style="flex:1;min-width:0">' +
                '<div class="point-name">' + util.esc(p.point) + '</div>' +
                '<div class="point-meta">' + ZCD.gradeLabel(p.grade) + ' · ' + ZCD.subjectMeta(p.subject).name +
                  ' · 作答 ' + p.answered + ' 次 · 正确 ' + p.correct + ' 次 · 正确率 ' + p.accuracy + '%' +
                  (p.reviewCount ? ' · 复习 ' + p.reviewCount + ' 次' : '') +
                  ' · 最近 ' + util.fmtRelative(p.lastAt) + '</div>' +
                '<div class="point-meta">' + util.esc(p.reason) + '</div>' +
              '</div>' +
              '<span class="recent-dots">' + p.recent.slice(-5).map(function (v) {
                return '<i class="' + (v ? 'ok' : 'bad') + '"></i>';
              }).join('') + '</span>' +
            '</div>';
          }).join('')
        : '<div class="text-sm text-muted">还没有练过任何知识点。</div>';

      /* ---- 学科进度 ---- */
      var subjectRows = ZCD.SUBJECTS.map(function (sub) {
        var levels = 0, cleared = 0, starsSum = 0, answered = 0, correct = 0;
        allPacks.filter(function (p) { return p.subject === sub.key; }).forEach(function (p) {
          var prog = ZCD.store.packProgress(p.id);
          levels += prog.levels;
          cleared += prog.cleared;
          starsSum += prog.stars;
        });
        ZCD.GRADES.forEach(function (g) {
          var key = g.grade + '|' + sub.key;
          var st = s.stats.bySubject[key];
          if (st) { answered += st.answered; correct += st.correct; }
        });
        return { sub: sub, levels: levels, cleared: cleared, stars: starsSum, answered: answered, correct: correct, percent: util.pct(cleared, levels) };
      });

      var subjectHTML = subjectRows.map(function (r) {
        return '<div class="subject-row">' +
          '<span class="subject-icon">' + r.sub.emoji + '</span>' +
          '<div class="subject-body">' +
            '<div class="subject-name">' + r.sub.name +
              '<span class="subject-num">已完成 ' + r.cleared + '/' + r.levels + ' 关 · ⭐ ' + r.stars + '</span>' +
            '</div>' +
            '<div class="mt-8">' + ui.bar(r.percent, r.sub.key === 'math' ? '' : 'bar-green') + '</div>' +
            '<div class="subject-num mt-8">答题 ' + r.answered + ' 道 · 正确率 ' + util.pct(r.correct, r.answered) + '%</div>' +
          '</div>' +
          '<span class="text-sm" style="font-weight:900;color:' + r.sub.color + '">' + r.percent + '%</span>' +
        '</div>';
      }).join('');

      /* ---- 年级 × 学科 明细 ---- */
      var matrix = ZCD.data.gradeSubjectMatrix().map(function (row) {
        var levels = 0, cleared = 0, starsSum = 0;
        row.packs.forEach(function (p) {
          var prog = ZCD.store.packProgress(p.id);
          levels += prog.levels; cleared += prog.cleared; starsSum += prog.stars;
        });
        var st = s.stats.bySubject[row.grade + '|' + row.subject.key] || { answered: 0, correct: 0 };
        return '<tr>' +
          '<td>' + row.gradeLabel + '</td>' +
          '<td>' + row.subject.emoji + ' ' + row.subject.name + '</td>' +
          '<td>' + row.packs.length + ' 个</td>' +
          '<td>' + cleared + ' / ' + levels + '</td>' +
          '<td>⭐ ' + starsSum + '</td>' +
          '<td>' + st.answered + '</td>' +
          '<td>' + util.pct(st.correct, st.answered) + '%</td>' +
        '</tr>';
      }).join('');

      /* ---- 近期学习记录 ---- */
      var recent = ZCD.store.recentAnswers(15);
      var recentHTML = recent.length ? '<div class="table-wrap"><table class="data">' +
        '<thead><tr><th>时间</th><th>年级 / 学科</th><th>知识点</th><th class="wrap">题目</th><th>结果</th></tr></thead><tbody>' +
        recent.map(function (a) {
          return '<tr>' +
            '<td>' + util.fmtDateTime(a.ts) + '</td>' +
            '<td>' + ZCD.gradeLabel(a.grade) + ' · ' + ZCD.subjectMeta(a.subject).name + '</td>' +
            '<td>' + util.esc(a.point || '—') + '</td>' +
            '<td class="wrap">' + util.esc(a.stem) + '</td>' +
            '<td>' + (a.correct ? '<span class="chip chip-green">答对</span>' : '<span class="chip chip-red">答错</span>') +
              (a.mode === 'review' ? ' <span class="chip chip-gray">复习</span>' : '') + '</td>' +
          '</tr>';
        }).join('') + '</tbody></table></div>'
        : ui.empty('📄', '还没有答题记录，去闯一关吧。', '<button class="btn btn-primary" data-go="/select">开始闯关</button>');

      /* ---- 待复习错题预览 ---- */
      var pending = ZCD.store.wrongList({ status: 'pending' }).slice(0, 5);
      var pendingHTML = pending.length ? pending.map(function (e) {
        return '<div class="recent-item">' +
          '<span class="recent-dot bad"></span>' +
          '<div style="flex:1;min-width:0">' +
            '<div class="text-sm"><b>' + util.esc(e.stem) + '</b></div>' +
            '<div class="text-xs text-muted">' + ZCD.gradeLabel(e.grade) + ' · ' + ZCD.subjectMeta(e.subject).name + ' · ' + util.esc(e.point || '') + ' · ' + util.fmtRelative(e.updatedAt || e.ts) + '</div>' +
          '</div>' +
          '<span class="chip chip-red">待复习</span>' +
        '</div>';
      }).join('') + '<div class="row mt-12"><button class="btn btn-primary btn-sm" data-go="/wrong">去错题本复习</button></div>'
        : '<div class="notice notice-warn">没有待复习的错题，保持住！</div>';

      /* ---- 徽章墙 ---- */
      var badgeList = ZCD.store.badges();
      var earnedCount = badgeList.filter(function (b) { return b.earned; }).length;
      var badgeHTML = '<div class="card mt-16">' +
        '<h2 class="card-title">🎖️ 徽章墙 <span class="hint">已获得 ' + earnedCount + ' / ' + badgeList.length + ' 枚（全部由真实学习数据判定）</span></h2>' +
        '<div class="grid grid-4">' + badgeList.map(ui.badge).join('') + '</div>' +
      '</div>';

      return '' +
        '<div class="view-title-row">' +
          '<div><h1 class="view-title">📊 学习报告</h1>' +
          '<p class="view-desc">下面的数字全部来自你在本机的真实答题记录，刷新后依然保留。</p></div>' +
          '<div class="spacer"></div>' +
          '<button class="btn btn-soft btn-sm" data-go="/settings">数据与设置</button>' +
        '</div>' +

        /* 知识掌握放在最前：先看“学到什么程度”，再看数字 */
        '<div class="report-lead mt-16">' +
          '<div class="mastery-hero">' +
            '<h2 class="card-title" style="border-bottom:0;padding-bottom:0;margin-bottom:6px">' +
              '<span class="t-icon">🧠</span>我的知识掌握情况 <span class="hint">' + masteredLabel + '</span></h2>' +
            '<div class="row" style="align-items:baseline;gap:10px">' +
              '<span class="mh-num">' + counts.mastered + '</span>' +
              '<span class="mh-label">/ ' + mastery.total + ' 个知识点已掌握（' + mastery.masteredPercent + '%）</span>' +
            '</div>' +
            masteryBarHTML +
            '<div class="mastery-legend mt-12">' +
              '<span>✅ 已掌握 ' + counts.mastered + '</span>' +
              '<span>💪 还需练习 ' + counts.practice + '</span>' +
              '<span>🌱 尚未学习 ' + counts.new + '</span>' +
            '</div>' +
            '<div class="notice mt-12 text-xs">判定规则：同一知识点至少作答 3 次、最近 3 次都答对，并且这个知识点的错题都已经复习过，才会算「已掌握」。</div>' +
            '<div class="notice notice-warn mt-8 text-xs">' + util.esc(ZCD.mastery.DISCLAIMER) + '</div>' +
          '</div>' +
          '<div class="card">' +
            '<h2 class="card-title"><span class="t-icon">🎯</span>下一步学习建议 <span class="hint">按固定规则生成</span></h2>' +
            suggestHTML +
          '</div>' +
        '</div>' +

        '<div class="grid grid-4 mt-16">' +
          '<div class="stat-tile"><div class="stat-value">' + s.totals.answered + '</div><div class="stat-label">累计答题数</div></div>' +
          '<div class="stat-tile stat-green"><div class="stat-value">' + accuracy + '%</div><div class="stat-label">总体正确率</div></div>' +
          '<div class="stat-tile"><div class="stat-value">' + clearedLevels + '<small> / ' + totalLevels + '</small></div><div class="stat-label">已完成关卡</div></div>' +
          '<div class="stat-tile stat-gold"><div class="stat-value">⭐ ' + stars + '</div><div class="stat-label">累计星星</div></div>' +
        '</div>' +

        '<div class="grid grid-4 mt-12">' +
          '<div class="stat-tile"><div class="stat-value">⚡ ' + s.xp + '</div><div class="stat-label">累计经验值</div></div>' +
          '<div class="stat-tile"><div class="stat-value">Lv.' + lv.level + '</div><div class="stat-label">当前等级 · ' + util.esc(lv.title) + '</div></div>' +
          '<div class="stat-tile"><div class="stat-value">' + days + '</div><div class="stat-label">有学习记录的天数</div></div>' +
          '<div class="stat-tile"><div class="stat-value">' + ws.pending + '</div><div class="stat-label">待复习错题（共 ' + ws.total + '）</div></div>' +
        '</div>' +

        '<div class="grid grid-2 mt-16">' +
          '<div class="card">' +
            '<h2 class="card-title"><span class="t-icon">📚</span>各学科知识点状态分布</h2>' + subjectMasteryHTML +
          '</div>' +
          '<div class="card">' +
            '<h2 class="card-title"><span class="t-icon">🔥</span>需要优先复习的知识点 <span class="hint">按错题与近期错误排序</span></h2>' +
            priorityHTML +
            '<h2 class="card-title mt-16"><span class="t-icon">🕒</span>最近一次学习表现</h2>' + perfHTML +
          '</div>' +
        '</div>' +

        '<div class="grid grid-2 mt-16">' +
          '<div class="card">' +
            '<h2 class="card-title"><span class="t-icon">🗂️</span>各学科完成进度</h2>' + subjectHTML +
            '<div class="notice mt-12 text-xs">进度 = 已通关关卡 ÷ 该学科全部关卡；正确率 = 该学科答对题数 ÷ 答题数。</div>' +
          '</div>' +
          '<div class="card">' +
            '<h2 class="card-title">📌 今天的学习</h2>' +
            '<div class="grid grid-2">' +
              '<div class="stat-tile"><div class="stat-value">' + today.answered + '</div><div class="stat-label">今日答题</div></div>' +
              '<div class="stat-tile stat-green"><div class="stat-value">' + today.correct + '</div><div class="stat-label">今日答对</div></div>' +
              '<div class="stat-tile"><div class="stat-value">' + today.cleared + '</div><div class="stat-label">今日通关</div></div>' +
              '<div class="stat-tile"><div class="stat-value">' + today.reviews + '</div><div class="stat-label">今日复习错题</div></div>' +
            '</div>' +
            '<h2 class="card-title mt-16">🔥 待复习错题（' + ws.pending + ' 道）</h2>' + pendingHTML +
          '</div>' +
        '</div>' +

        '<div class="card mt-16">' +
          '<h2 class="card-title">🔍 练过的知识点明细 <span class="hint">' + studiedPoints.length + ' 个知识点有练习记录，另有 ' + notStartedCount + ' 个还没有开始学习</span></h2>' +
          (studiedPoints.length ? '<details class="more" open><summary>展开/收起明细</summary>' + pointDetailHTML + '</details>' : pointDetailHTML) +
        '</div>' +

        '<div class="card mt-16">' +
          '<h2 class="card-title">🏫 各年级学科明细</h2>' +
          '<div class="table-wrap"><table class="data">' +
            '<thead><tr><th>年级</th><th>学科</th><th>知识包</th><th>已通关</th><th>星星</th><th>答题数</th><th>正确率</th></tr></thead>' +
            '<tbody>' + matrix + '</tbody>' +
          '</table></div>' +
        '</div>' +

        badgeHTML +

        '<div class="card mt-16">' +
          '<h2 class="card-title">🕒 近期学习记录 <span class="hint">最近 15 条</span></h2>' +
          recentHTML +
        '</div>' +

        '<div class="notice mt-16">📵 本报告完全由浏览器本地数据计算，没有调用任何外部接口或 AI 模型。</div>';
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);