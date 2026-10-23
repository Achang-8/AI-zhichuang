/*!
 * 知闯岛 · 学习大厅（游戏主界面）
 *
 * 布局：紧凑 HUD + 插画式冒险地图（视觉主体）+ 唯一主按钮「继续冒险」
 *       + 地图下方的辅助信息（今日任务 / 最近进度 / 知识掌握）+ 次级入口图标栏
 * 所有内容都由真实学习数据驱动，不使用任何假数据。
 */
(function (root) {
  'use strict';
  var ZCD = root.ZCD;
  var util = ZCD.util;
  var ui = ZCD.ui;
  ZCD.views = ZCD.views || {};

  function greeting() {
    var h = new Date().getHours();
    if (h < 6) return '夜深了，注意休息';
    if (h < 11) return '早上好';
    if (h < 14) return '中午好';
    if (h < 18) return '下午好';
    return '晚上好';
  }

  /** 今日任务：全部由真实数据计算 */
  function dailyTasks(today) {
    return [
      { icon: '🎯', name: '完成 1 个关卡', cur: today.cleared, target: 1 },
      { icon: '✅', name: '答对 15 道题', cur: today.correct, target: 15 },
      { icon: '📕', name: '复习 3 道错题', cur: today.reviews, target: 3 }
    ];
  }

  function totalLevelCount() {
    var packs = ZCD.data.allPacks(), n = 0;
    for (var i = 0; i < packs.length; i++) n += ZCD.data.levelList(packs[i].id).length;
    return n;
  }

  /**
   * 首页要展示哪个知识包的地图？
   *
   * 只认「真实发生过的事情」，绝不猜测：
   *   1. 上次挑战的知识包（真实记录）
   *   2. 有进度但没通关的知识包（真实记录）
   *   3. 用户主动选择过的知识包（选了年级学科还没选包时，用该组合下的包）
   *   4. 都没有 → 返回 null，首页显示引导态，不显示任何默认年级的地图
   * 多个来源时取时间最新的一个，保证「刚选完就能看到自己选的」。
   */
  function heroPack(s) {
    var candidates = [];

    var lp = s.lastPlayed;
    if (lp && lp.packId && ZCD.data.getPack(lp.packId)) {
      candidates.push({ pack: ZCD.data.getPack(lp.packId), at: Number(lp.at) || 0, reason: '继续上次的知识包' });
    }

    var inProgress = null, started = null;
    ZCD.data.allPacks().forEach(function (p) {
      var prog = ZCD.store.packProgress(p.id);
      if (prog.cleared > 0 && !prog.finished && !inProgress) inProgress = p;
      if (prog.cleared > 0 && !started) started = p;
    });
    var progressPack = inProgress || started;
    if (progressPack) {
      candidates.push({ pack: progressPack, at: Number(s.updatedAt) || 0, reason: '继续挑战中' });
    }

    var chosen = ZCD.store.chosenContent();
    if (chosen) {
      var picked = chosen.packId ? ZCD.data.getPack(chosen.packId) : null;
      if (!picked) {
        var list = ZCD.data.packsFor(chosen.grade, chosen.subject);
        picked = list[0] || null;
      }
      if (picked) {
        candidates.push({
          pack: picked,
          at: chosen.at || 0,
          reason: '你选择的' + ZCD.gradeLabel(picked.grade) + ' · ' + ZCD.subjectMeta(picked.subject).name
        });
      }
    }

    if (!candidates.length) return null;
    candidates.sort(function (a, b) { return b.at - a.at; });
    return candidates[0];
  }

  /** 组装某个知识包在地图上的关卡数据（真实状态） */
  function levelDataFor(packId) {
    return ZCD.data.levelList(packId).map(function (l) {
      var st = ZCD.store.levelStat(packId, l.level);
      return {
        level: l.level,
        name: l.name,
        count: l.count,
        cleared: !!(st && st.cleared),
        unlocked: ZCD.store.isLevelUnlocked(packId, l.level),
        stars: st ? (st.bestStars || 0) : 0,
        accuracy: st ? (st.bestAccuracy || 0) : 0
      };
    });
  }

  /** 下一站：第一个还没通关、且已解锁的关卡 */
  function nextStop(packId, levels) {
    var n = ZCD.store.maxUnlockedLevel(packId);
    var target = levels.filter(function (l) { return l.level === n && !l.cleared; })[0];
    if (!target) target = levels.filter(function (l) { return !l.cleared; })[0] || levels[levels.length - 1];
    return target;
  }

  ZCD.views.lobby = {
    render: function () {
      var s = ZCD.store.state();
      var lv = ZCD.rewards.levelFromXp(s.xp);
      var stars = ZCD.store.totalStars();
      var today = ZCD.store.activityToday();
      var tasks = dailyTasks(today);
      var recent = ZCD.store.recentLevelRecords(3);
      var ws = ZCD.store.wrongStats();
      var clearedLevels = ZCD.store.clearedLevelCount();
      var allLevels = totalLevelCount();
      var hero = heroPack(s);
      var mastery = ZCD.mastery.overview();
      var counts = mastery.counts;

      /* ---------- 主视觉：冒险地图 ---------- */
      var heroHTML;
      if (hero) {
        var pack = hero.pack;
        var meta = ZCD.subjectMeta(pack.subject);
        var levels = levelDataFor(pack.id);
        var prog = ZCD.store.packProgress(pack.id);
        var stop = nextStop(pack.id, levels);
        var map = ZCD.mapArt.build({ levels: levels, packName: pack.name, width: root.innerWidth });
        var ctaLabel = prog.cleared === 0
          ? '▶ 开始冒险 · 关卡 1'
          : (prog.finished ? '▶ 再挑战 · ' + stop.name : '▶ 继续冒险 · ' + stop.name);

        heroHTML =
          '<section class="adventure-hero" id="adventure-hero">' +
            '<div class="hero-top">' +
              '<div class="hero-pack">' +
                '<span class="hero-pack-icon">' + meta.emoji + '</span>' +
                '<div>' +
                  '<div class="hero-title">' + util.esc(pack.name) + '</div>' +
                  '<div class="hero-sub">' + ZCD.gradeLabel(pack.grade) + ' · ' + meta.name + ' · ' + util.esc(hero.reason) + '</div>' +
                '</div>' +
              '</div>' +
              '<div class="hero-top-right">' +
                '<span class="hero-stat">⭐ ' + prog.stars + ' / ' + prog.maxStars + '</span>' +
                '<span class="hero-stat">🚩 已通关 ' + prog.cleared + ' / ' + levels.length + ' 关</span>' +
                '<button class="btn btn-soft btn-sm" data-go="/select" data-switch>切换年级/学科</button>' +
              '</div>' +
            '</div>' +
            '<div class="hero-map" id="hero-map" data-pack="' + util.esc(pack.id) + '">' + map.svg + '</div>' +
            '<div class="hero-bar">' +
              '<div class="hero-goal">' +
                '<span class="hero-goal-ico">🚩</span>' +
                '<div>' +
                  '<div class="hero-goal-title">下一站：' + util.esc(stop.name) + '</div>' +
                  '<div class="hero-goal-sub">' + stop.count + ' 道题 · 难度 ' + util.starsText(pack.difficulty, 3) +
                    (stop.accuracy ? ' · 最好成绩 ' + stop.accuracy + '%' : ' · 还没有挑战过') + '</div>' +
                '</div>' +
              '</div>' +
              '<div class="hero-cta-wrap">' +
                '<button class="btn btn-gold hero-cta" id="btn-continue-adventure" data-go="/quiz" ' +
                  'data-pack="' + util.esc(pack.id) + '" data-level="' + stop.level + '">' + util.esc(ctaLabel) + '</button>' +
                '<button class="btn btn-soft btn-sm" data-go="/map" data-pack="' + util.esc(pack.id) + '">全屏地图</button>' +
              '</div>' +
            '</div>' +
          '</section>';
      } else {
        // 没有有效来源（没选过、也没有任何记录）：显示引导，不默认进入任何年级
        var gradeCards = ZCD.GRADES.map(function (g) {
          return '<button class="entry rail-item" data-go="/select" data-grade="' + g.grade + '">' +
            '<span class="entry-emoji">' + g.emoji + '</span>' +
            '<span class="entry-name">' + g.label + '</span>' +
            '<span class="entry-badge">' + ZCD.data.allPacks().filter(function (p) { return Number(p.grade) === g.grade; }).length + ' 个包</span>' +
          '</button>';
        }).join('');
        heroHTML =
          '<section class="adventure-hero" id="adventure-hero">' +
            '<div class="hero-top"><div class="hero-pack">' +
              '<span class="hero-pack-icon">🧭</span>' +
              '<div><div class="hero-title">先选择年级和学科</div>' +
              '<div class="hero-sub">选定之后这里会出现你的冒险地图，并一直记住你的选择</div></div>' +
            '</div></div>' +
            '<div class="hero-bar"><div class="hero-goal"><span class="hero-goal-ico">🚀</span>' +
              '<div><div class="hero-goal-title">还没有选择学习内容</div>' +
              '<div class="hero-goal-sub">三年级 ～ 六年级 · 数学 / 语文 / 英语 / 科学</div></div></div>' +
              '<div class="hero-cta-wrap">' +
                '<button class="btn btn-gold hero-cta" id="btn-pick-content" data-go="/select">▶ 选择年级与学科</button>' +
                '<button class="btn btn-soft btn-sm" data-go="/manage">导入自己的题库</button>' +
              '</div></div>' +
            '<div class="home-rail mt-16">' + gradeCards + '</div>' +
          '</section>';
      }

      /* ---------- 辅助区 1：今日任务 ---------- */
      var tasksHTML = tasks.map(function (t) {
        var done = t.cur >= t.target;
        return '<div class="mini-task' + (done ? ' is-done' : '') + '">' +
          '<span class="mt-ico">' + (done ? '✅' : t.icon) + '</span>' +
          '<span class="mt-name">' + util.esc(t.name) + '</span>' +
          '<span class="mt-num">' + Math.min(t.cur, t.target) + ' / ' + t.target + '</span>' +
        '</div>' +
        '<div class="bar ' + (done ? 'bar-green' : 'bar-accent') + '"><i style="width:' +
          util.clamp(done ? 100 : util.pct(t.cur, t.target), 0, 100) + '%"></i></div>';
      }).join('');

      /* ---------- 辅助区 2：最近学习进度 ---------- */
      var recentHTML = recent.length ? recent.map(function (st) {
        var pack = ZCD.data.getPack(st.packId);
        return '<div class="mini-task">' +
          '<span class="mt-ico">' + (st.cleared ? '✅' : '💪') + '</span>' +
          '<span class="mt-name">' + util.esc(pack ? pack.name : st.packId) + ' · ' +
            util.esc(pack ? ZCD.data.levelName(pack, st.level) : '第 ' + st.level + ' 关') + '</span>' +
          '<span class="mt-num">' + util.starsText(st.bestStars || 0, 3) + '</span>' +
        '</div>';
      }).join('') : '<div class="text-sm text-muted">还没有学习记录，从地图上的第一关开始吧。</div>';

      /* ---------- 辅助区 3：知识掌握 ---------- */
      var masteryHTML =
        '<div class="mastery-mini-num"><b>' + counts.mastered + '</b>' +
          '<span class="text-xs text-muted">/ ' + mastery.total + ' 个知识点已掌握</span></div>' +
        '<div class="stack-bar mt-12">' +
          '<i class="s-mastered" style="width:' + util.pct(counts.mastered, mastery.total) + '%"></i>' +
          '<i class="s-practice" style="width:' + util.pct(counts.practice, mastery.total) + '%"></i>' +
          '<i class="s-new" style="width:' + util.pct(counts.new, mastery.total) + '%"></i>' +
        '</div>' +
        '<div class="mastery-legend mt-12">' +
          '<span>✅ 已掌握 ' + counts.mastered + '</span>' +
          '<span>💪 还需练习 ' + counts.practice + '</span>' +
          '<span>🌱 尚未学习 ' + counts.new + '</span>' +
        '</div>' +
        '<div class="text-xs text-muted mt-8">' + util.esc(ZCD.mastery.DISCLAIMER) + '</div>';

      return '' +
        heroHTML +

        '<div class="home-panels">' +
          '<section class="panel is-task">' +
            '<div class="panel-head"><span class="p-ico">📅</span><span class="p-title">今日任务</span>' +
              '<span class="p-hint">每天 0 点重置</span></div>' +
            tasksHTML +
          '</section>' +
          '<section class="panel is-recent">' +
            '<div class="panel-head"><span class="p-ico">🕒</span><span class="p-title">最近学习</span>' +
              '<span class="p-hint">' + greeting() + '，' + util.esc(s.profile.nickname) + '</span></div>' +
            recentHTML +
          '</section>' +
          '<section class="panel is-mastery">' +
            '<div class="panel-head"><span class="p-ico">🧠</span><span class="p-title">知识掌握</span>' +
              '<span class="p-hint"><a href="#/report">查看报告</a></span></div>' +
            masteryHTML +
          '</section>' +
        '</div>' +

        '<div class="home-rail">' +
          '<button class="entry rail-item" data-go="/select">' +
            '<span class="entry-emoji">🗺️</span><span class="entry-name">知识包</span>' +
            '<span class="entry-badge">' + ZCD.data.stats().packs + ' 个</span></button>' +
          '<button class="entry rail-item" data-go="/wrong">' +
            '<span class="entry-emoji">📕</span><span class="entry-name">错题本</span>' +
            '<span class="entry-badge">' + (ws.pending ? ws.pending + ' 待复习' : '暂无错题') + '</span></button>' +
          '<button class="entry rail-item" data-go="/report">' +
            '<span class="entry-emoji">📊</span><span class="entry-name">学习报告</span>' +
            '<span class="entry-badge">' + clearedLevels + '/' + allLevels + ' 关</span></button>' +
          '<button class="entry rail-item" data-go="/manage">' +
            '<span class="entry-emoji">📥</span><span class="entry-name">题库管理</span>' +
            '<span class="entry-badge">内置 ' + ZCD.data.stats().builtinQuestions + ' 题</span></button>' +
          '<button class="entry rail-item" data-go="/settings">' +
            '<span class="entry-emoji">⚙️</span><span class="entry-name">数据设置</span>' +
            '<span class="entry-badge">保存在本机</span></button>' +
        '</div>' +

        '<div class="notice notice-warn mt-16">' +
          '💾 学习数据保存在<b>当前设备与当前浏览器</b>里，不会自动跨设备同步；清理浏览器数据会一并清除学习进度。' +
        '</div>';
    },

    mount: function (ctx, main) {
      var mapHost = main.querySelector('#hero-map');
      if (!mapHost) return;
      var packId = mapHost.getAttribute('data-pack');
      if (!packId) return;

      // 点击地图节点 → 与闯关地图页一致的关卡面板
      function openLevel(level) {
        if (ZCD.views.map && ZCD.views.map.openLevelDialog) {
          ZCD.views.map.openLevelDialog(packId, level);
        } else {
          ZCD.router.go('/map', { pack: packId });
        }
      }
      util.on(mapHost, '[data-level]', 'click', function (ev, el) {
        var lv = Number(el.getAttribute('data-level'));
        if (el.getAttribute('aria-disabled') === 'true') { openLevel(lv); return; }
        openLevel(lv);
      });
      util.on(mapHost, '[data-level]', 'keydown', function (ev, el) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          openLevel(Number(el.getAttribute('data-level')));
        }
      });

      // 窗口尺寸跨过手机/桌面断点时，重新生成横版或竖版地图
      var wide = root.matchMedia ? root.matchMedia('(min-width: 760px)') : null;
      if (wide && wide.addEventListener) {
        var onChange = function () { ZCD.app.render(); };
        wide.addEventListener('change', onChange);
        ZCD.app.onCleanup(function () { wide.removeEventListener('change', onChange); });
      }
    }
  };

  ZCD.lobbyHelpers = { levelDataFor: levelDataFor, nextStop: nextStop, heroPack: heroPack };
})(typeof globalThis !== 'undefined' ? globalThis : this);