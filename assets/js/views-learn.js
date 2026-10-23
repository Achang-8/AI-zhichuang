/*!
 * 知闯岛 · 年级学科选择、知识包列表、闯关地图
 */
(function (root) {
  'use strict';
  var ZCD = root.ZCD;
  var util = ZCD.util;
  var ui = ZCD.ui;
  ZCD.views = ZCD.views || {};

  /* ==================== 1. 年级与学科选择 ==================== */
  var SUBJECT_KEYS = ['math', 'chinese', 'english', 'science'];

  /** 只认 URL 参数和「用户主动选择」，绝不用系统默认值兜底 */
  function resolvePick(ctx) {
    var chosen = ZCD.store.chosenContent();
    var grade = Number(ctx.params.grade);
    if ([3, 4, 5, 6].indexOf(grade) === -1) grade = null;
    if (!grade && chosen) grade = chosen.grade;

    var subject = ctx.params.subject;
    if (SUBJECT_KEYS.indexOf(subject) === -1) subject = null;
    // 学科要和当前年级配套：换了年级就重新选学科
    if (!subject && chosen && chosen.grade === grade) subject = chosen.subject;

    return { grade: grade, subject: subject, chosen: chosen };
  }

  ZCD.views.select = {
    render: function (ctx) {
      var pick = resolvePick(ctx);
      var grade = pick.grade, subject = pick.subject;
      var chosen = pick.chosen;

      var gradesHTML = ZCD.GRADES.map(function (g) {
        var packs = ZCD.data.allPacks().filter(function (p) { return Number(p.grade) === g.grade; });
        return '<button class="pick-card' + (g.grade === grade ? ' is-active' : '') + '" data-grade="' + g.grade + '">' +
          '<span class="pick-emoji">' + g.emoji + '</span>' +
          '<span>' +
            '<span class="pick-name">' + g.label + '</span>' +
            '<span class="pick-desc">' + util.esc(g.desc) + '</span>' +
            '<span class="pick-meta">' + packs.length + ' 个知识包 · ' + packs.reduce(function (n, p) { return n + ZCD.data.questionsOf(p.id).length; }, 0) + ' 道题</span>' +
          '</span>' +
          (g.grade === grade ? '<span class="pick-check">✅</span>' : '') +
        '</button>';
      }).join('');

      var subjectsHTML = ZCD.SUBJECTS.map(function (sub) {
        var packs = grade ? ZCD.data.packsFor(grade, sub.key) : [];
        var qCount = packs.reduce(function (n, p) { return n + ZCD.data.questionsOf(p.id).length; }, 0);
        var empty = grade ? packs.length === 0 : false;
        return '<button class="pick-card' + (sub.key === subject && !empty ? ' is-active' : '') + '" data-subject="' + sub.key + '"' +
          (grade ? '' : ' disabled') + (empty ? ' disabled style="opacity:.5"' : '') + '>' +
          '<span class="pick-emoji">' + sub.emoji + '</span>' +
          '<span>' +
            '<span class="pick-name">' + sub.name + '</span>' +
            '<span class="pick-desc">' + (!grade ? '先选择年级' : (empty ? '该年级暂无题库' : '适合' + ZCD.gradeLabel(grade) + '的知识包')) + '</span>' +
            '<span class="pick-meta">' + (grade ? packs.length + ' 个知识包 · ' + qCount + ' 道题' : '—') + '</span>' +
          '</span>' +
          (sub.key === subject && !empty ? '<span class="pick-check">✅</span>' : '') +
        '</button>';
      }).join('');

      var packs = (grade && subject) ? ZCD.data.packsFor(grade, subject) : [];
      var packsHTML;
      if (!grade || !subject) {
        packsHTML = '<div class="notice">👆 先在上面的第 1 步选择年级' + (grade ? '，再在第 2 步选择学科' : '和第 2 步选择学科') +
          '，这里就会显示对应的知识包。系统不会替你默认选择。</div>';
      } else if (!packs.length) {
        packsHTML = '<div class="notice notice-warn">🧳 <b>' + ZCD.gradeLabel(grade) + ' · ' + ZCD.subjectMeta(subject).name +
          ' 目前没有知识包。</b><br>这一组合确实还没有内容，请换一个学科或年级看看，' +
          '也可以去「题库管理」导入自己的题库。</div>' +
          '<div class="row mt-12"><button class="btn btn-soft" data-reset-subject>换一个学科</button>' +
          '<button class="btn btn-soft" data-go="/manage">去题库管理导入</button></div>';
      } else {
        packsHTML = packs.map(function (p) {
          var prog = ZCD.store.packProgress(p.id);
          return '<div class="pack-card" style="border-top-color:' + ZCD.subjectMeta(p.subject).color + '">' +
            '<div class="pack-head">' +
              '<div style="flex:1">' +
                '<div class="pack-name">' + util.esc(p.name) + '</div>' +
                '<div class="pack-intro">' + util.esc(p.intro || '') + '</div>' +
              '</div>' +
              ui.difficulty(p.difficulty) +
            '</div>' +
            '<div class="pack-meta-row">' + ui.gradeChip(p.grade) + ui.subjectChip(p.subject) +
              '<span class="chip chip-gray">' + prog.levels + ' 个关卡</span>' +
              '<span class="chip chip-gray">' + ZCD.data.questionsOf(p.id).length + ' 道题</span>' +
              (p.custom ? '<span class="chip chip-violet">我的题库</span>' : '') +
            '</div>' +
            '<div>' +
              '<div class="row text-xs text-muted" style="justify-content:space-between">' +
                '<span>完成进度 ' + prog.cleared + '/' + prog.levels + ' 关</span>' +
                '<span>⭐ ' + prog.stars + '/' + prog.maxStars + '</span>' +
              '</div>' +
              '<div class="mt-8">' + ui.bar(prog.percent, prog.finished ? 'bar-green' : '') + '</div>' +
            '</div>' +
            '<div class="pack-foot">' +
              '<button class="btn btn-primary" data-map="' + util.esc(p.id) + '">选它 · 进入闯关地图</button>' +
              (prog.cleared > 0 ? '<span class="text-xs text-muted">已通关 ' + prog.cleared + ' 关</span>' : '<span class="text-xs text-muted">第 1 关已开放</span>') +
            '</div>' +
          '</div>';
        }).join('');
      }

      var choiceLine = chosen
        ? '当前学习内容：<b>' + ZCD.gradeLabel(chosen.grade) + ' · ' + ZCD.subjectMeta(chosen.subject).name + '</b>' +
          (chosen.packId && ZCD.data.getPack(chosen.packId) ? ' · ' + util.esc(ZCD.data.getPack(chosen.packId).name) : '') +
          '　（切换不会删除任何答题记录、错题与星星）'
        : '还没有选择学习内容。选定年级和学科后，只会显示对应的知识包与关卡。';

      return '' +
        '<div class="view-title-row">' +
          '<div><h1 class="view-title">🗺️ 选择年级与学科</h1>' +
          '<p class="view-desc">' + choiceLine + '</p></div>' +
          '<div class="spacer"></div>' +
          '<button class="btn btn-soft btn-sm" data-go="/">返回大厅</button>' +
        '</div>' +

        '<div class="card">' +
          '<h2 class="card-title"><span class="t-icon">1️⃣</span>选择年级' +
            '<span class="hint">' + (grade ? ZCD.gradeLabel(grade) + ' 已选中' : '请选择三、四、五、六年级') + '</span></h2>' +
          '<div class="grid grid-2">' + gradesHTML + '</div>' +
        '</div>' +

        '<div class="card">' +
          '<h2 class="card-title"><span class="t-icon">2️⃣</span>选择学科' +
            '<span class="hint">' + (!grade ? '先选年级' : (subject ? ZCD.subjectMeta(subject).name + ' 已选中' : '数学 / 语文 / 英语 / 科学')) + '</span></h2>' +
          '<div class="grid grid-4">' + subjectsHTML + '</div>' +
        '</div>' +

        '<div class="card">' +
          '<h2 class="card-title"><span class="t-icon">3️⃣</span>选择知识包' +
            '<span class="hint">' + (grade && subject ? ZCD.gradeLabel(grade) + ' · ' + ZCD.subjectMeta(subject).name : '选择年级和学科后显示') + '</span></h2>' +
          '<div class="grid grid-2">' + packsHTML + '</div>' +
        '</div>' +

        '<div class="notice notice-warn mt-16">' +
          '💾 学习数据保存在<b>当前设备与当前浏览器</b>里，不会自动跨设备同步；' +
          '切换年级或学科只会换学习内容，不会删除已有的答题记录、错题和星星。' +
        '</div>';
    },

    mount: function (ctx, main) {
      util.on(main, '[data-grade]', 'click', function (ev, el) {
        var g = Number(el.getAttribute('data-grade'));
        // 换了年级就重新走一遍学科选择，不再沿用上一个学科
        ZCD.router.go('/select', { grade: g });
      });
      util.on(main, '[data-subject]', 'click', function (ev, el) {
        var pick = resolvePick(ctx);
        var sub = el.getAttribute('data-subject');
        if (!pick.grade) { ZCD.ui.toast('先选择年级，再选择学科', 'warn'); return; }
        // 这里是用户主动选择：记下来（不动任何学习记录）
        ZCD.store.setChoice({ grade: pick.grade, subject: sub, packId: null });
        ZCD.router.go('/select', { grade: pick.grade, subject: sub });
      });
      util.on(main, '[data-reset-subject]', 'click', function () {
        var pick = resolvePick(ctx);
        ZCD.router.go('/select', { grade: pick.grade });
      });
      util.on(main, '[data-map]', 'click', function (ev, el) {
        var pick = resolvePick(ctx);
        var packId = el.getAttribute('data-map');
        var pack = ZCD.data.getPack(packId);
        // 选中知识包 = 完整的学习内容选择
        ZCD.store.setChoice({ grade: pack ? Number(pack.grade) : pick.grade, subject: pack ? pack.subject : pick.subject, packId: packId });
        ZCD.router.go('/map', { pack: packId });
      });
    }
  };

  /* ==================== 2. 知识包列表 ==================== */
  ZCD.views.packs = {
    render: function (ctx) {
      // 同样不做默认兜底：没有年级或学科时先让用户去选择
      var pick = resolvePick(ctx);
      var grade = pick.grade, subject = pick.subject;
      if (!grade || !subject) {
        return '<div class="view-title-row">' +
            '<div><h1 class="view-title">🧳 知识包</h1>' +
            '<p class="view-desc">还没有确定年级和学科，所以没有可展示的知识包。</p></div>' +
          '</div>' +
          '<div class="card">' + ui.empty('🧭', '请先选择年级和学科，再查看对应的知识包。',
            '<button class="btn btn-primary" data-go="/select">去选择年级与学科</button>') + '</div>';
      }
      var packs = ZCD.data.packsFor(grade, subject);
      var meta = ZCD.subjectMeta(subject);

      var listHTML = packs.map(function (p) {
        var prog = ZCD.store.packProgress(p.id);
        var dots = ZCD.data.levelList(p.id).map(function (l) {
          var st = ZCD.store.levelStat(p.id, l.level);
          var cleared = !!(st && st.cleared);
          var unlocked = ZCD.store.isLevelUnlocked(p.id, l.level);
          return '<i class="' + (cleared ? 'is-cleared' : (unlocked ? 'is-available' : 'is-locked')) + '" title="' +
            util.esc(l.name + '：' + (cleared ? '已完成' : (unlocked ? '可以挑战' : '未解锁'))) + '"></i>';
        }).join('');
        return '<div class="pack-card" style="border-top-color:' + meta.color + '">' +
          '<div class="pack-head"><div style="flex:1">' +
            '<div class="pack-name">' + util.esc(p.name) + '</div>' +
            '<div class="pack-intro">' + util.esc(p.intro || '') + '</div>' +
          '</div>' + ui.difficulty(p.difficulty) + '</div>' +
          '<div class="pack-meta-row">' + ui.gradeChip(p.grade) + ui.subjectChip(p.subject) +
            '<span class="chip chip-gray">' + prog.levels + ' 关</span>' +
            '<span class="chip chip-gray">共 ' + ZCD.data.questionsOf(p.id).length + ' 题</span></div>' +
          '<div>' + ui.bar(prog.percent, prog.finished ? 'bar-green' : '') +
            '<div class="row mt-8" style="justify-content:space-between">' +
              '<span class="text-xs text-muted">已完成 ' + prog.cleared + '/' + prog.levels + ' 关 · ⭐ ' + prog.stars + '</span>' +
              '<span class="level-dots">' + dots + '</span>' +
            '</div></div>' +
          '<div class="pack-foot"><button class="btn btn-primary" data-map="' + util.esc(p.id) + '">开始闯关</button></div>' +
        '</div>';
      }).join('') || ui.empty('🧳', '暂时没有知识包。');

      return '<div class="view-title-row">' +
          '<div><h1 class="view-title">' + meta.emoji + ' ' + ZCD.gradeLabel(grade) + ' · ' + meta.name + '</h1>' +
          '<p class="view-desc">共 ' + packs.length + ' 个知识包，每个知识包 5 个关卡、每关 5 道题。</p></div>' +
          '<div class="spacer"></div>' +
          '<button class="btn btn-soft btn-sm" data-go="/select">重新选择</button>' +
        '</div>' +
        '<div class="grid grid-2">' + listHTML + '</div>';
    },
    mount: function (ctx, main) {
      util.on(main, '[data-map]', 'click', function (ev, el) {
        ZCD.router.go('/map', { pack: el.getAttribute('data-map') });
      });
    }
  };

  /* ==================== 3. 闯关地图 ==================== */
  ZCD.views.map = {
    render: function (ctx) {
      var pack = ZCD.data.getPack(ctx.params.pack);
      if (!pack) {
        return '<div class="card">' + ui.empty('🧭', '没有找到这个知识包，它可能已被删除。',
          '<button class="btn btn-primary" data-go="/select">重新选择知识包</button>') + '</div>';
      }
      var levels = ZCD.data.levelList(pack.id);
      var prog = ZCD.store.packProgress(pack.id);
      var meta = ZCD.subjectMeta(pack.subject);

      // 真实关卡状态 → 地图数据（解锁规则完全沿用 store）
      var levelData = levels.map(function (l) {
        var st = ZCD.store.levelStat(pack.id, l.level);
        return {
          level: l.level,
          name: l.name,
          count: l.count,
          cleared: !!(st && st.cleared),
          unlocked: ZCD.store.isLevelUnlocked(pack.id, l.level),
          stars: st ? (st.bestStars || 0) : 0,
          accuracy: st ? (st.bestAccuracy || 0) : 0
        };
      });
      var map = ZCD.mapArt.build({ levels: levelData, packName: pack.name, width: root.innerWidth });
      var next = ZCD.lobbyHelpers.nextStop(pack.id, levelData);

      // 关卡状态一览（手机上也能一眼看清每一关的状态）
      var stripHTML = levels.map(function (l) {
        var st = ZCD.store.levelStat(pack.id, l.level);
        var cleared = !!(st && st.cleared);
        var unlocked = ZCD.store.isLevelUnlocked(pack.id, l.level);
        var cls = cleared ? 'is-cleared' : (unlocked ? 'is-available' : 'is-locked');
        var state = cleared
          ? ('✅ 已完成 ' + util.starsText(st.bestStars || 0, 3))
          : (unlocked ? '📍 可以挑战' : ('🔒 通过关卡 ' + (l.level - 1) + ' 后解锁'));
        return '<button class="level-strip-item ' + cls + '" data-strip-level="' + l.level + '" aria-label="' +
          util.esc(l.name + '：' + state) + '">' +
          '<span class="ls-idx">' + l.level + '</span>' +
          '<span><span class="ls-name">' + util.esc(l.name) + '</span><br><span class="ls-state">' + state + '</span></span>' +
        '</button>';
      }).join('');

      return '' +
        '<div class="view-title-row">' +
          '<div>' +
            '<h1 class="view-title">' + meta.emoji + ' ' + util.esc(pack.name) + '</h1>' +
            '<p class="view-desc">' + util.esc(pack.intro || '') + '</p>' +
          '</div>' +
          '<div class="spacer"></div>' +
          '<button class="btn btn-soft btn-sm" data-go="/select" data-confirm="leave-quiz">切换知识包</button>' +
        '</div>' +

        '<div class="card mb-12">' +
          '<div class="row">' + ui.gradeChip(pack.grade) + ui.subjectChip(pack.subject) +
            '<span class="chip chip-gray">' + levels.length + ' 个关卡</span>' +
            '<span class="chip chip-gray">每关 ' + (levels[0] ? levels[0].count : 5) + ' 道题</span>' +
            ui.difficulty(pack.difficulty) +
            (pack.custom ? '<span class="chip chip-violet">我的题库</span>' : '') +
            '<span class="spacer"></span>' +
            '<span class="text-sm"><b>⭐ ' + prog.stars + '</b> / ' + prog.maxStars + ' · 已完成 ' + prog.cleared + '/' + levels.length + ' 关</span>' +
          '</div>' +
          '<div class="mt-12">' + ui.bar(prog.percent, prog.finished ? 'bar-green' : '') + '</div>' +
        '</div>' +

        '<div class="map-wrap">' +
          '<div class="map-canvas">' + map.svg + '</div>' +
          '<div class="map-legend">' +
            '<span class="legend-item"><i class="legend-dot available"></i>可以挑战</span>' +
            '<span class="legend-item"><i class="legend-dot cleared"></i>已完成（可重复挑战）</span>' +
            '<span class="legend-item"><i class="legend-dot locked"></i>未解锁（节点上写明解锁条件）</span>' +
            '<span class="legend-item">🔓 规则：通过当前关卡后自动解锁下一关</span>' +
          '</div>' +
        '</div>' +

        '<div class="hero-bar mt-12">' +
          '<div class="hero-goal">' +
            '<span class="hero-goal-ico">🚩</span>' +
            '<div><div class="hero-goal-title">下一站：' + util.esc(next.name) + '</div>' +
            '<div class="hero-goal-sub">' + next.count + ' 道题 · ' + (next.cleared ? '已通关，可再挑战' : '还没通关') + '</div></div>' +
          '</div>' +
          '<div class="hero-cta-wrap">' +
            '<button class="btn btn-gold hero-cta" data-go="/quiz" data-pack="' + util.esc(pack.id) +
              '" data-level="' + next.level + '">▶ ' + (prog.cleared === 0 ? '开始冒险 · ' : '继续冒险 · ') + util.esc(next.name) + '</button>' +
          '</div>' +
        '</div>' +

        '<div class="card mt-12">' +
          '<h2 class="card-title"><span class="t-icon">🧭</span>关卡一览 <span class="hint">点击任意可挑战的关卡直接进入</span></h2>' +
          '<div class="level-strip">' + stripHTML + '</div>' +
        '</div>' +

        '<div class="grid grid-2 mt-16">' +
          '<div class="card"><h2 class="card-title">📌 本知识包的知识点</h2>' +
            '<div class="row row-tight">' + ZCD.data.pointsOf(pack.id).map(function (pt) {
              return '<span class="chip chip-gray">' + util.esc(pt) + '</span>';
            }).join('') + '</div>' +
          '</div>' +
          '<div class="card"><h2 class="card-title">🎁 奖励规则</h2>' +
            '<ul class="text-sm text-muted">' +
              '<li>· 正确率 ≥ 90%：3 星；≥ 70%：2 星；&lt; 70%：1 星</li>' +
              '<li>· 正确率 ≥ 60% 才能通关并解锁下一关</li>' +
              '<li>· 首次通关有额外经验，重复挑战不会重复领取</li>' +
              '<li>· 累计星星按每关历史最好成绩计算</li>' +
            '</ul>' +
          '</div>' +
        '</div>';
    },

    mount: function (ctx, main) {
      var pack = ZCD.data.getPack(ctx.params.pack);
      if (!pack) return;

      // 进入某个知识包的闯关地图 = 用户主动选择了这个知识包（只记选择，不动学习记录）
      ZCD.store.setChoice({ grade: Number(pack.grade), subject: pack.subject, packId: pack.id });

      // 点击地图节点（SVG）→ 关卡信息面板
      util.on(main, '.map-node', 'click', function (ev, el) {
        openLevelDialog(pack.id, Number(el.getAttribute('data-level')));
      });
      util.on(main, '.map-node', 'keydown', function (ev, el) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          openLevelDialog(pack.id, Number(el.getAttribute('data-level')));
        }
      });

      // 关卡一览里的条目与地图节点行为一致
      util.on(main, '[data-strip-level]', 'click', function (ev, el) {
        openLevelDialog(pack.id, Number(el.getAttribute('data-strip-level')));
      });

      // 尺寸跨断点时切换横版 / 竖版地图
      var wide = root.matchMedia ? root.matchMedia('(min-width: 760px)') : null;
      if (wide && wide.addEventListener) {
        var onChange = function () { ZCD.app.render(); };
        wide.addEventListener('change', onChange);
        ZCD.app.onCleanup(function () { wide.removeEventListener('change', onChange); });
      }
    },
    /** 关卡信息面板（首页与地图页共用） */
    openLevelDialog: openLevelDialog
  };

  /**
   * 关卡信息面板：名称、知识主题、题目数量、难度、当前状态与历史成绩
   * 解锁规则完全沿用 store，这里只负责展示。
   */
  function openLevelDialog(packId, lv) {
    var pack = ZCD.data.getPack(packId);
    if (!pack) return;
    var item = ZCD.data.levelList(pack.id).filter(function (l) { return l.level === lv; })[0];
    if (!item) return;
    var st = ZCD.store.levelStat(pack.id, lv);
    var cleared = !!(st && st.cleared);
    var unlocked = ZCD.store.isLevelUnlocked(pack.id, lv);
    var points = ZCD.data.pointsOf(pack.id, lv);
    var statusChip = cleared
      ? '<span class="chip chip-green">✅ 已完成</span>'
      : (unlocked ? '<span class="chip chip-red">📍 可以挑战</span>' : '<span class="chip chip-gray">🔒 未解锁</span>');
    var stateLine = cleared
      ? '这一关已经通过，可以重复挑战刷新成绩。'
      : (unlocked ? '这一关已经解锁，随时可以开始挑战。' : '需要先通过关卡 ' + (lv - 1) + ' 才能解锁这一关。');
    ui.openModal({
      title: '🚩 ' + util.esc(item.name),
      body:
        '<div class="row mb-12">' + ui.gradeChip(pack.grade) + ui.subjectChip(pack.subject) + statusChip + '</div>' +
        '<div class="grid grid-3 mb-12">' +
          '<div class="stat-tile"><div class="stat-value" style="font-size:18px">' + item.count + '</div><div class="stat-label">本关题数</div></div>' +
          '<div class="stat-tile"><div class="stat-value" style="font-size:18px">' + util.starsText(item.level <= 3 ? pack.difficulty : Math.min(3, pack.difficulty + 1), 3) + '</div><div class="stat-label">难度</div></div>' +
          '<div class="stat-tile"><div class="stat-value" style="font-size:18px">' + (st ? (st.attempts || 0) : 0) + '</div><div class="stat-label">挑战次数</div></div>' +
        '</div>' +
        '<p class="text-sm mb-8"><b>知识主题：</b>' + (points.length ? points.map(util.esc).join('、') : '综合练习') + '</p>' +
        '<p class="text-sm mb-8"><b>当前状态：</b>' + util.esc(stateLine) + '</p>' +
        '<p class="text-sm"><b>历史成绩：</b>' +
          (st ? util.starsText(st.bestStars || 0, 3) + ' · 最好正确率 ' + (st.bestAccuracy || 0) + '%' : '还没有挑战过') + '</p>' +
        '<p class="text-xs text-muted mt-8">每道题提交后立即判分并显示解析；正确率 ≥ 60% 即可通关并解锁下一关。</p>',
      footer:
        '<button class="btn btn-soft" data-modal-close>取消</button>' +
        (unlocked
          ? '<button class="btn btn-primary" data-start="' + lv + '">' + (cleared ? '重新挑战' : '开始挑战') + '</button>'
          : '<button class="btn btn-soft" data-map-to="' + (lv - 1) + '">先去过关卡 ' + (lv - 1) + '</button>'),
      onMount: function (modal) {
        util.on(modal, '[data-start]', 'click', function () {
          ui.closeModal();
          ZCD.router.go('/quiz', { pack: pack.id, level: lv });
        });
        util.on(modal, '[data-map-to]', 'click', function () {
          ui.closeModal();
          openLevelDialog(pack.id, lv - 1);
        });
      }
    });
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);