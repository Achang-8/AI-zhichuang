/*!
 * 知闯岛 · 基础工具
 * 浏览器与 Node 双用（Node 中挂到 globalThis.ZCD，供校验脚本复用）
 */
(function (root) {
  'use strict';
  root.ZCD = root.ZCD || {};
  var ZCD = root.ZCD;

  var util = {};

  util.esc = function (s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  util.clamp = function (n, min, max) {
    n = Number(n);
    if (isNaN(n)) n = min;
    return Math.min(max, Math.max(min, n));
  };

  util.pct = function (part, total) {
    if (!total) return 0;
    return Math.round((part / total) * 100);
  };

  util.sum = function (arr) {
    var t = 0;
    for (var i = 0; i < arr.length; i++) t += Number(arr[i]) || 0;
    return t;
  };

  util.pad2 = function (n) {
    return (n < 10 ? '0' : '') + n;
  };

  util.uid = function (prefix) {
    return (prefix || 'id') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  };

  /** 本地时区的 YYYY-MM-DD */
  util.dayKey = function (d) {
    d = d ? new Date(d) : new Date();
    return d.getFullYear() + '-' + util.pad2(d.getMonth() + 1) + '-' + util.pad2(d.getDate());
  };

  util.fmtDate = function (ts) {
    if (!ts) return '—';
    var d = new Date(ts);
    return d.getFullYear() + '-' + util.pad2(d.getMonth() + 1) + '-' + util.pad2(d.getDate());
  };

  util.fmtDateTime = function (ts) {
    if (!ts) return '—';
    var d = new Date(ts);
    return util.fmtDate(d) + ' ' + util.pad2(d.getHours()) + ':' + util.pad2(d.getMinutes());
  };

  /** 相对时间，用于「最近学习进度」 */
  util.fmtRelative = function (ts) {
    if (!ts) return '还没有记录';
    var diff = Date.now() - ts;
    if (diff < 0) diff = 0;
    var min = Math.floor(diff / 60000);
    if (min < 1) return '刚刚';
    if (min < 60) return min + ' 分钟前';
    var hour = Math.floor(min / 60);
    if (hour < 24) return hour + ' 小时前';
    var day = Math.floor(hour / 24);
    if (day === 1) return '昨天';
    if (day < 30) return day + ' 天前';
    return util.fmtDate(ts);
  };

  /** 星星显示：★★☆ */
  util.starsText = function (n, max) {
    max = max || 3;
    n = util.clamp(n, 0, max);
    var s = '';
    for (var i = 0; i < max; i++) s += i < n ? '★' : '☆';
    return s;
  };

  util.byId = function (id) {
    return typeof document === 'undefined' ? null : document.getElementById(id);
  };

  /** 事件委托：util.on(root, '.btn', 'click', fn) */
  util.on = function (rootEl, selector, type, handler) {
    if (!rootEl) return;
    rootEl.addEventListener(type, function (ev) {
      var target = ev.target;
      while (target && target !== rootEl) {
        if (target.matches && target.matches(selector)) {
          handler.call(target, ev, target);
          return;
        }
        target = target.parentNode;
      }
    });
  };

  util.debounce = function (fn, ms) {
    var t = null;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms || 200);
    };
  };

  /** 触发浏览器下载（离线可用，不依赖任何外部服务） */
  util.download = function (filename, text, mime) {
    try {
      var blob = new Blob([text], { type: (mime || 'text/plain') + ';charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      return true;
    } catch (e) {
      return false;
    }
  };

  util.nl2br = function (s) {
    return util.esc(s).replace(/\n/g, '<br>');
  };

  util.bytesText = function (n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1024 / 1024).toFixed(2) + ' MB';
  };

  util.uniq = function (arr) {
    var seen = {}, out = [];
    for (var i = 0; i < arr.length; i++) {
      var k = String(arr[i]);
      if (!seen[k]) { seen[k] = 1; out.push(arr[i]); }
    }
    return out;
  };

  util.groupBy = function (arr, fn) {
    var out = {};
    for (var i = 0; i < arr.length; i++) {
      var k = fn(arr[i], i);
      (out[k] = out[k] || []).push(arr[i]);
    }
    return out;
  };

  util.sortBy = function (arr, fn) {
    return arr.slice().sort(function (a, b) {
      var ka = fn(a), kb = fn(b);
      if (ka === kb) return 0;
      return ka < kb ? -1 : 1;
    });
  };

  ZCD.util = util;
})(typeof globalThis !== 'undefined' ? globalThis : this);