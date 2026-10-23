/*!
 * 知闯岛 · 通用 UI 组件（提示条、弹窗、进度条、地图路径、庆祝动画）
 */
(function (root) {
  'use strict';
  root.ZCD = root.ZCD || {};
  var ZCD = root.ZCD;
  var util = ZCD.util;

  var ui = {};

  /* ---------------- 轻提示 ---------------- */
  ui.toast = function (message, type, ms) {
    var layer = util.byId('toast-layer');
    if (!layer) return;
    var el = document.createElement('div');
    el.className = 'toast' + (type ? ' ' + type : '');
    el.textContent = message;
    layer.appendChild(el);
    setTimeout(function () {
      el.style.transition = 'opacity .25s, transform .25s';
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 260);
    }, ms || 2200);
  };

  /* ---------------- 弹窗 ---------------- */
  var modalCleanup = null;
  var modalKeyHandler = null;

  ui.closeModal = function () {
    var layer = util.byId('modal-layer');
    if (!layer) return;
    layer.hidden = true;
    layer.innerHTML = '';
    if (modalKeyHandler) {
      document.removeEventListener('keydown', modalKeyHandler);
      modalKeyHandler = null;
    }
    if (modalCleanup) { try { modalCleanup(); } catch (e) {} modalCleanup = null; }
  };

  /**
   * 打开弹窗
   * @param {{title:string, body:string, footer:string, onMount:Function, onClose:Function}} opts
   */
  ui.openModal = function (opts) {
    var layer = util.byId('modal-layer');
    if (!layer) return;
    layer.hidden = false;
    layer.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true">' +
        '<div class="modal-head">' + (opts.title || '') + '</div>' +
        '<div class="modal-body">' + (opts.body || '') + '</div>' +
        '<div class="modal-foot">' + (opts.footer || '<button class="btn btn-soft" data-modal-close>关闭</button>') + '</div>' +
      '</div>';
    util.on(layer, '[data-modal-close]', 'click', function () { ui.closeModal(); });
    layer.onclick = function (ev) { if (ev.target === layer && opts.dismissable !== false) ui.closeModal(); };
    modalCleanup = opts.onClose || null;
    if (opts.onMount) opts.onMount(layer.querySelector('.modal'));

    // Esc 关闭 + 焦点落到第一个按钮，方便键盘与无障碍使用
    if (modalKeyHandler) document.removeEventListener('keydown', modalKeyHandler);
    modalKeyHandler = function (ev) {
      if (ev.key === 'Escape') { ev.preventDefault(); ui.closeModal(); }
    };
    document.addEventListener('keydown', modalKeyHandler);
    var firstBtn = layer.querySelector('.modal-foot .btn');
    if (firstBtn) setTimeout(function () { try { firstBtn.focus(); } catch (e) {} }, 40);
  };

  /** 确认框，返回 Promise<boolean> */
  ui.confirm = function (opts) {
    return new Promise(function (resolve) {
      var done = false;
      function finish(v) {
        if (done) return;
        done = true;
        ui.closeModal();
        resolve(v);
      }
      ui.openModal({
        title: opts.title || '请确认',
        body: opts.body || '',
        footer:
          '<button class="btn btn-soft" data-act="cancel">' + (opts.cancelText || '取消') + '</button>' +
          '<button class="btn ' + (opts.danger ? 'btn-danger' : 'btn-primary') + '" data-act="ok">' + (opts.okText || '确定') + '</button>',
        onMount: function (modal) {
          util.on(modal, '[data-act="ok"]', 'click', function () { finish(true); });
          util.on(modal, '[data-act="cancel"]', 'click', function () { finish(false); });
        },
        onClose: function () { finish(false); }
      });
    });
  };

  /** 输入框弹窗，返回 Promise<string|null> */
  ui.prompt = function (opts) {
    return new Promise(function (resolve) {
      var done = false;
      function finish(v) {
        if (done) return;
        done = true;
        ui.closeModal();
        resolve(v);
      }
      ui.openModal({
        title: opts.title || '请输入',
        body:
          '<label class="field-label">' + util.esc(opts.label || '') + '</label>' +
          '<input class="field" id="prompt-input" maxlength="' + (opts.maxlength || 20) + '" value="' + util.esc(opts.value || '') + '" placeholder="' + util.esc(opts.placeholder || '') + '">' +
          (opts.hint ? '<p class="text-xs text-muted mt-8">' + util.esc(opts.hint) + '</p>' : ''),
        footer: '<button class="btn btn-soft" data-act="cancel">取消</button><button class="btn btn-primary" data-act="ok">保存</button>',
        onMount: function (modal) {
          var input = modal.querySelector('#prompt-input');
          setTimeout(function () { input.focus(); input.select(); }, 30);
          input.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') finish(input.value.trim() || null); });
          util.on(modal, '[data-act="ok"]', 'click', function () { finish(input.value.trim() || null); });
          util.on(modal, '[data-act="cancel"]', 'click', function () { finish(null); });
        },
        onClose: function () { finish(null); }
      });
    });
  };

  /* ---------------- 小组件 ---------------- */
  ui.bar = function (percent, cls) {
    return '<div class="bar ' + (cls || '') + '"><i style="width:' + util.clamp(percent, 0, 100) + '%"></i></div>';
  };

  ui.stars = function (n, max) {
    return '<span class="node-stars">' + util.starsText(n, max || 3) + '</span>';
  };

  ui.difficulty = function (d) {
    d = util.clamp(d, 1, 3);
    return '<span class="difficulty" title="难度 ' + d + '/3">' + util.starsText(d, 3) + '</span>';
  };

  ui.subjectChip = function (key) {
    var s = ZCD.subjectMeta(key);
    return '<span class="chip" style="background:' + s.soft + ';color:' + s.color + ';border-color:' + s.soft + '">' + s.emoji + ' ' + util.esc(s.name) + '</span>';
  };

  ui.gradeChip = function (g) {
    return '<span class="chip chip-gray">' + util.esc(ZCD.gradeLabel(g)) + '</span>';
  };

  ui.empty = function (emoji, text, extraHtml) {
    return '<div class="empty-state"><div class="empty-emoji">' + emoji + '</div><div class="empty-text">' +
      util.esc(text) + '</div>' + (extraHtml ? '<div class="mt-12">' + extraHtml + '</div>' : '') + '</div>';
  };

  /** 徽章卡片 */
  ui.badge = function (b) {
    return '<div class="badge-tile' + (b.earned ? ' is-earned' : '') + '">' +
      '<div class="badge-emoji">' + (b.earned ? b.emoji : '🔒') + '</div>' +
      '<div class="badge-name">' + util.esc(b.name) + '</div>' +
      '<div class="badge-desc">' + util.esc(b.desc) + '</div>' +
    '</div>';
  };

  /* ---------------- 地图路径 ---------------- */

  /** 用 Catmull-Rom 转三次贝塞尔，画出蜿蜒小路 */
  ui.smoothPath = function (pts) {
    if (!pts || pts.length < 2) return '';
    var d = 'M ' + pts[0][0].toFixed(1) + ',' + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[i + 2] || p2;
      var c1x = p1[0] + (p2[0] - p0[0]) / 6;
      var c1y = p1[1] + (p2[1] - p0[1]) / 6;
      var c2x = p2[0] - (p3[0] - p1[0]) / 6;
      var c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ' C ' + c1x.toFixed(1) + ',' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ',' + c2y.toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
    }
    return d;
  };

  /** 关卡在岛上的位置（百分比） */
  ui.nodePositions = [
    { x: 22, y: 90 },
    { x: 74, y: 77 },
    { x: 26, y: 62 },
    { x: 72, y: 47 },
    { x: 30, y: 32 },
    { x: 70, y: 17 },
    { x: 34, y: 8 }
  ];

  /* ---------------- 庆祝彩带（数量可控，尊重减少动画偏好） ---------------- */
  ui.confetti = function (host, count) {
    if (!host) return;
    var reduce = document.body.classList.contains('reduce-motion') ||
      (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduce) return;
    var colors = ['#ffd98a', '#ff7a45', '#12a37a', '#6fc3ec', '#f5a524', '#8b5cf6'];
    var n = count || 34;
    var box = document.createElement('div');
    box.className = 'confetti';
    for (var i = 0; i < n; i++) {
      var s = document.createElement('i');
      s.style.left = (Math.random() * 100).toFixed(1) + '%';
      s.style.background = colors[i % colors.length];
      s.style.animationDuration = (1.5 + Math.random() * 1.4).toFixed(2) + 's';
      s.style.animationDelay = (Math.random() * 0.5).toFixed(2) + 's';
      s.style.width = (5 + Math.random() * 6).toFixed(1) + 'px';
      box.appendChild(s);
    }
    host.appendChild(box);
    setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 3600);
  };

  ZCD.ui = ui;
})(typeof globalThis !== 'undefined' ? globalThis : this);