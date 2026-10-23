/*!
 * 知闯岛 · 路由与页面外壳
 */
(function (root) {
  'use strict';
  root.ZCD = root.ZCD || {};
  var ZCD = root.ZCD;
  var util = ZCD.util;
  var ui = ZCD.ui;

  var ROUTES = {
    '/': 'lobby',
    '/select': 'select',
    '/packs': 'packs',
    '/map': 'map',
    '/quiz': 'quiz',
    '/result': 'result',
    '/wrong': 'wrong',
    '/report': 'report',
    '/manage': 'manage',
    '/settings': 'settings',
    '/about': 'about'
  };

  var TABS = [
    { name: 'lobby', label: '大厅', emoji: '🏠', path: '/' },
    { name: 'select', label: '闯关', emoji: '🗺️', path: '/select' },
    { name: 'wrong', label: '错题本', emoji: '📕', path: '/wrong' },
    { name: 'report', label: '报告', emoji: '📊', path: '/report' },
    { name: 'manage', label: '题库', emoji: '📥', path: '/manage' }
  ];

  var cleanups = [];
  var current = null;

  /* ---------------- 布局模式：电脑版 / 手机版 ----------------
   * 同一套代码有两种呈现方式：
   *   - 默认（不指定）：跟随窗口宽度自适应，手机和电脑都能用
   *   - 电脑版：index.html?layout=desktop 或 desktop.html，强制桌面排版
   *   - 手机版：index.html?layout=mobile 或 mobile.html，强制手机排版（电脑上会显示手机外框）
   * 打包时由 assets/js/layout-default.js 指定该包的默认版本。
   */
  function forcedLayout() {
    var m = /[?&]layout=(desktop|mobile)(?:&|$)/.exec(root.location.search || '');
    if (m) return m[1];
    if (root.ZCD_FORCE_LAYOUT === 'desktop' || root.ZCD_FORCE_LAYOUT === 'mobile') return root.ZCD_FORCE_LAYOUT;
    return null;
  }

  var forced = forcedLayout();

  function applyLayoutClass() {
    if (!forced || !root.document || !root.document.body) return;
    root.document.body.classList.add('layout-' + forced);
  }
  applyLayoutClass();

  function layoutSwitchHTML() {
    if (!forced) return '';
    var toMobile = forced !== 'mobile';
    return '<a class="layout-switch" href="' + (toMobile ? 'mobile.html' : 'desktop.html') + '" title="切换到' +
      (toMobile ? '手机版' : '电脑版') + '">' + (toMobile ? '📱 手机版' : '📺 电脑版') + '</a>';
  }

  function parseHash() {
    var h = root.location.hash.replace(/^#/, '');
    if (!h) h = '/';
    var qi = h.indexOf('?');
    var path = qi >= 0 ? h.slice(0, qi) : h;
    var qs = qi >= 0 ? h.slice(qi + 1) : '';
    var params = {};
    if (qs) {
      qs.split('&').forEach(function (kv) {
        if (!kv) return;
        var i = kv.indexOf('=');
        var k = i < 0 ? kv : kv.slice(0, i);
        var v = i < 0 ? '' : kv.slice(i + 1).replace(/\+/g, ' ');
        try { params[decodeURIComponent(k)] = decodeURIComponent(v); } catch (e) { params[k] = v; }
      });
    }
    if (path.length > 1 && path.charAt(path.length - 1) === '/') path = path.slice(0, -1);
    return { path: path, params: params, name: ROUTES[path] || 'notfound' };
  }

  function buildHash(path, params) {
    var qs = [];
    if (params) {
      for (var k in params) {
        if (Object.prototype.hasOwnProperty.call(params, k) && params[k] !== undefined && params[k] !== null && params[k] !== '') {
          qs.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
        }
      }
    }
    return '#' + path + (qs.length ? '?' + qs.join('&') : '');
  }

  var router = {
    current: function () { return current || parseHash(); },
    /** 跳转 */
    go: function (path, params, replace) {
      var hash = buildHash(path, params);
      if (replace) {
        var url = root.location.href.split('#')[0] + hash;
        root.history.replaceState(null, '', url);
        render();
      } else if (root.location.hash === hash) {
        render();
      } else {
        root.location.hash = hash;
      }
    },
    start: function () {
      root.addEventListener('hashchange', render);
      render();
    }
  };

  function runCleanups() {
    for (var i = 0; i < cleanups.length; i++) {
      try { cleanups[i](); } catch (e) {}
    }
    cleanups = [];
  }

  function onCleanup(fn) { cleanups.push(fn); }

  /* ---------------- 顶部状态栏（紧凑游戏 HUD） ---------------- */
  function topbarHTML() {
    var s = ZCD.store.state();
    var lv = ZCD.rewards.levelFromXp(s.xp);
    return '' +
      '<div class="topbar-inner">' +
        '<a class="brand" href="#/" title="回到冒险主界面">' +
          '<span class="brand-emoji">🏝️</span>' +
          '<span>知闯岛</span>' +
        '</a>' +
        '<div class="topbar-stats hud-group" id="topbar-stats">' + topbarStatsHTML() + '</div>' +
      '</div>';
  }

  function topbarStatsHTML() {
    var s = ZCD.store.state();
    var lv = ZCD.rewards.levelFromXp(s.xp);
    return '' +
      '<span class="hud-chip is-level" title="当前等级（经验值决定）">Lv.' + lv.level + ' ' + util.esc(lv.title) + '</span>' +
      '<span class="hud-chip is-star" title="累计星星（每关取历史最好成绩）">⭐ ' + ZCD.store.totalStars() + '</span>' +
      '<span class="hud-chip is-xp" title="经验值">⚡ ' + s.xp + '</span>';
  }

  function tabbarHTML(activeName) {
    var html = '<nav class="tabbar"><div class="tabbar-inner">';
    TABS.forEach(function (t) {
      var active = t.name === activeName ||
        (t.name === 'select' && ['select', 'packs', 'map', 'quiz', 'result'].indexOf(activeName) >= 0) ||
        (t.name === 'manage' && ['manage', 'settings', 'about'].indexOf(activeName) >= 0);
      html += '<button class="tab' + (active ? ' is-active' : '') + '" data-go="' + t.path + '">' +
        '<span class="tab-emoji">' + t.emoji + '</span><span>' + t.label + '</span></button>';
    });
    return html + '</div></nav>';
  }

  /**
   * 本地数据异常提示条：数据读取/升级失败时明确告知用户，
   * 强调「原始数据没有被清空」，并提供去「数据与设置」的入口。
   */
  function loadErrorBannerHTML() {
    var err = ZCD.store.loadErrorInfo && ZCD.store.loadErrorInfo();
    if (!err) return '';
    return '<div class="notice notice-danger mb-12" id="load-error-banner">' +
      '<b>⚠️ 本地学习数据异常</b><br>' + util.esc(err.message) +
      (err.backupKey ? '<br>备份键名：<code>' + util.esc(err.backupKey) + '</code>' : '') +
      '<div class="row mt-8">' +
        '<button class="btn btn-soft btn-sm" data-go="/settings">去「数据与设置」查看与恢复</button>' +
        '<button class="btn btn-soft btn-sm" id="btn-dismiss-load-error">我知道了</button>' +
      '</div>' +
    '</div>';
  }

  function render() {
    var ctx = parseHash();
    var appRoot = util.byId('app');
    if (!appRoot) return;

    // 有未保存的答题进度时，离开答题页需要确认（由答题页自己处理）
    runCleanups();
    current = ctx;
    document.body.classList.remove('is-focus');

    var view = ZCD.views[ctx.name] || ZCD.views.notfound;
    var body = '';
    try {
      body = view.render(ctx) || '';
    } catch (e) {
      if (root.console) console.error('[知闯岛] 页面渲染出错', e);
      body = '<div class="card"><h3 class="card-title">😵 页面出错了</h3><p class="text-sm text-muted">' +
        util.esc(e && e.message ? e.message : String(e)) + '</p><div class="mt-12"><button class="btn btn-primary" data-go="/">回到学习大厅</button></div></div>';
    }

    appRoot.innerHTML =
      '<header class="topbar">' + topbarHTML() + '</header>' +
      '<main class="view" id="view">' + loadErrorBannerHTML() + body + '</main>' +
      tabbarHTML(ctx.name) +
      layoutSwitchHTML();
    applyLayoutClass();

    var main = util.byId('view');
    var dismiss = util.byId('btn-dismiss-load-error');
    if (dismiss) {
      dismiss.addEventListener('click', function () {
        var banner = util.byId('load-error-banner');
        if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
      });
    }

    // 全局跳转按钮
    util.on(appRoot, '[data-go]', 'click', function (ev, el) {
      var path = el.getAttribute('data-go');
      var pack = el.getAttribute('data-pack');
      var level = el.getAttribute('data-level');
      var grade = el.getAttribute('data-grade');
      var subject = el.getAttribute('data-subject');
      var params = {};
      if (pack) params.pack = pack;
      if (level) params.level = level;
      if (grade) params.grade = grade;
      if (subject) params.subject = subject;
      if (el.getAttribute('data-confirm') === 'leave-quiz' && current && current.name === 'quiz' && ZCD.session && !ZCD.session.finished) {
        ui.confirm({
          title: '要离开本关吗？',
          body: '本关还没答完，离开后本关进度不会保存（已经提交的题目记录会保留）。',
          okText: '离开',
          cancelText: '继续答题',
          danger: true
        }).then(function (ok) { if (ok) { ZCD.session = null; router.go(path, params); } });
        return;
      }
      router.go(path, params);
    });

    if (view.mount) view.mount(ctx, main);
    root.scrollTo(0, 0);
  }

  /** 数据变化后刷新顶部数字（不重绘页面） */
  function refreshChrome() {
    var el = util.byId('topbar-stats');
    if (el) el.innerHTML = topbarStatsHTML();
  }

  ZCD.router = router;
  ZCD.app = {
    render: render,
    refreshChrome: refreshChrome,
    onCleanup: onCleanup,
    TABS: TABS,
    notFound: function () { return ROUTES; }
  };

  /* 404 */
  ZCD.views = ZCD.views || {};
  ZCD.views.notfound = {
    render: function () {
      return '<div class="card">' + ui.empty('🧭', '没有找到这个页面，可能链接不对。',
        '<button class="btn btn-primary" data-go="/">回到学习大厅</button>') + '</div>';
    }
  };

  function boot() {
    // 减少动画偏好
    if (ZCD.store.state().settings.reduceMotion) document.body.classList.add('reduce-motion');
    if (!ZCD.store.persistenceAvailable()) {
      setTimeout(function () {
        ui.toast('当前浏览器无法使用本地存储，进度只保留在本次会话中', 'warn', 5200);
      }, 600);
    }
    ZCD.store.subscribe(refreshChrome);

    // 首次进入：没有任何有效的历史选择，也没有学习记录时，
    // 先让用户自己选择年级与学科，绝不默认进入某个年级（例如三年级数学）。
    // 用 location.replace 换掉初始地址：不产生后退历史，也不会触发整页刷新。
    var initial = (root.location.hash || '').replace(/^#/, '');
    if (ZCD.store.isFirstVisit() && (initial === '' || initial === '/')) {
      try {
        root.location.replace(root.location.href.split('#')[0] + '#/select');
      } catch (e) {
        root.location.hash = '/select';
      }
    }

    router.start();

    var st = ZCD.data.stats();
    if (root.console) {
      console.log('%c🏝️ 知闯岛', 'font-size:16px;font-weight:bold;color:#0f4c81');
      console.log('已加载 ' + st.builtinPacks + ' 个内置知识包 / ' + st.builtinQuestions + ' 道内置题目。');
      console.log('数据保存在本机浏览器（localStorage），不会自动跨设备同步。');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);