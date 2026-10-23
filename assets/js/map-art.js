/*!
 * 知闯岛 · 插画式冒险地图（纯 SVG 绘制，离线可用，不依赖任何图片）
 *
 * 设计：
 *   - 地形分层：天空 → 远山 → 海面与岛屿 → 主陆地 → 山丘/森林/岩石 → 小路 → 关卡节点
 *   - 小路是一条真正的“路”：白色路基 + 沙色路面 + 虚线缝线 + 已走通路段变绿
 *   - 节点按真实数据分三类：已完成（✅ 标记 + 真实星星）/ 可挑战（更大 + 高亮光环 + 旗帜）/ 未解锁（低饱和 + 锁 + 解锁条件）
 *   - 全部坐标由路径推导，宽屏与竖屏两套版式共用同一套美术元素
 *
 * 这里只负责“画”，不碰任何业务逻辑：关卡数据、解锁规则、点击事件都由调用方提供。
 */
(function (root) {
  'use strict';
  root.ZCD = root.ZCD || {};
  var ZCD = root.ZCD;
  var util = ZCD.util;

  var uid = 0;

  /* ---------------- 两套版式 ---------------- */
  var LAYOUTS = {
    wide: {
      vb: [0, 0, 1000, 620],
      nodes: [[168, 470], [368, 402], [556, 470], [742, 350], [884, 196]],
      unit: 1,
      badge: 32,
      available: 42,
      labelScale: 1
    },
    tall: {
      vb: [0, 0, 640, 1040],
      nodes: [[168, 916], [456, 800], [180, 636], [458, 484], [438, 288]],
      unit: 1.28,
      badge: 42,
      available: 50,
      labelScale: 1.08
    }
  };

  function layoutFor(width) {
    return (width && width < 760) ? 'tall' : 'wide';
  }

  /* ---------------- 小工具 ---------------- */
  function esc(s) { return util.esc(s); }

  /** 沿两点方向做垂直偏移，用来把装饰物摆在路旁 */
  function beside(p1, p2, dist) {
    var dx = p2[0] - p1[0], dy = p2[1] - p1[1];
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    return [-dy / len * dist, dx / len * dist];
  }

  function lerp(p1, p2, t) {
    return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
  }

  function bounds(points, pad) {
    var xs = points.map(function (p) { return p[0]; });
    var ys = points.map(function (p) { return p[1]; });
    return {
      left: Math.min.apply(null, xs) - pad,
      right: Math.max.apply(null, xs) + pad,
      top: Math.min.apply(null, ys) - pad,
      bottom: Math.max.apply(null, ys) + pad
    };
  }

  /* ---------------- 美术元素（defs） ---------------- */
  function defs(id) {
    return '<defs>' +
      '<linearGradient id="' + id + '-sky" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#bfe6ff"/><stop offset="0.55" stop-color="#e6f6ff"/><stop offset="1" stop-color="#fdf6e6"/>' +
      '</linearGradient>' +
      '<linearGradient id="' + id + '-sea" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#79c6ea"/><stop offset="1" stop-color="#a8ddf2"/>' +
      '</linearGradient>' +
      '<linearGradient id="' + id + '-land" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#b7e58a"/><stop offset="0.5" stop-color="#a3dc7c"/><stop offset="1" stop-color="#8ecf6b"/>' +
      '</linearGradient>' +
      '<linearGradient id="' + id + '-hill" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#9fd97c"/><stop offset="1" stop-color="#7cc25f"/>' +
      '</linearGradient>' +
      '<linearGradient id="' + id + '-sand" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#ffe9b8"/><stop offset="1" stop-color="#f6d79a"/>' +
      '</linearGradient>' +
      '<radialGradient id="' + id + '-glow" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#ffd98a" stop-opacity="0.95"/>' +
        '<stop offset="1" stop-color="#ffd98a" stop-opacity="0"/>' +
      '</radialGradient>' +
      /* 松树 */
      '<g id="' + id + '-pine">' +
        '<rect x="-3" y="6" width="6" height="14" rx="2" fill="#8a5a32"/>' +
        '<path d="M0,-22 L15,4 L-15,4 Z" fill="#4f9f52"/>' +
        '<path d="M0,-12 L18,12 L-18,12 Z" fill="#3f8b46"/>' +
        '<path d="M0,-2 L21,20 L-21,20 Z" fill="#357c3d"/>' +
      '</g>' +
      /* 阔叶树 */
      '<g id="' + id + '-tree">' +
        '<rect x="-3.5" y="4" width="7" height="16" rx="2.5" fill="#8a5a32"/>' +
        '<circle cx="-9" cy="-2" r="11" fill="#5aa85c"/>' +
        '<circle cx="9" cy="-2" r="11" fill="#4e9e52"/>' +
        '<circle cx="0" cy="-12" r="13" fill="#63b465"/>' +
      '</g>' +
      /* 灌木 */
      '<g id="' + id + '-bush">' +
        '<circle cx="-8" cy="0" r="9" fill="#63b465"/>' +
        '<circle cx="8" cy="1" r="8" fill="#57a95c"/>' +
        '<circle cx="0" cy="-5" r="9.5" fill="#6fbf70"/>' +
      '</g>' +
      /* 岩石 */
      '<g id="' + id + '-rock">' +
        '<path d="M-16,10 L-9,-8 L3,-13 L15,-3 L16,10 Z" fill="#b9c3cc"/>' +
        '<path d="M-9,-8 L3,-13 L6,0 L-6,2 Z" fill="#cdd6de"/>' +
      '</g>' +
      /* 云 */
      '<g id="' + id + '-cloud">' +
        '<ellipse cx="0" cy="0" rx="34" ry="18" fill="#ffffff" opacity="0.92"/>' +
        '<ellipse cx="-22" cy="6" rx="20" ry="12" fill="#ffffff" opacity="0.92"/>' +
        '<ellipse cx="24" cy="6" rx="22" ry="13" fill="#ffffff" opacity="0.92"/>' +
      '</g>' +
      /* 海浪 */
      '<g id="' + id + '-wave">' +
        '<path d="M-22,0 q11,-9 22,0 q11,9 22,0" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.75"/>' +
      '</g>' +
      /* 帐篷 */
      '<g id="' + id + '-tent">' +
        '<path d="M0,-20 L22,18 L-22,18 Z" fill="#f2a65a"/>' +
        '<path d="M0,-20 L9,18 L-9,18 Z" fill="#e08b3e"/>' +
        '<path d="M0,-6 L7,18 L-7,18 Z" fill="#8a5a32" opacity="0.85"/>' +
      '</g>' +
      /* 塔楼 */
      '<g id="' + id + '-tower">' +
        '<rect x="-14" y="-6" width="28" height="28" rx="4" fill="#e6d3b3"/>' +
        '<rect x="-14" y="-6" width="28" height="8" rx="3" fill="#d3bd98"/>' +
        '<path d="M0,-30 L18,-6 L-18,-6 Z" fill="#d96a5a"/>' +
        '<rect x="-4" y="8" width="8" height="14" rx="3" fill="#7d5a3a"/>' +
        '<rect x="12" y="-30" width="2.5" height="14" fill="#8a5a32"/>' +
        '<path d="M14.5,-30 L26,-26 L14.5,-21 Z" fill="#f5c451"/>' +
      '</g>' +
      /* 桥 */
      '<g id="' + id + '-bridge">' +
        '<rect x="-34" y="-7" width="68" height="14" rx="6" fill="#c08a52"/>' +
        '<rect x="-34" y="-7" width="68" height="5" rx="2.5" fill="#d9a468"/>' +
        '<rect x="-30" y="-16" width="4" height="10" rx="2" fill="#a9763f"/>' +
        '<rect x="26" y="-16" width="4" height="10" rx="2" fill="#a9763f"/>' +
      '</g>' +
      /* 宝箱 */
      '<g id="' + id + '-chest">' +
        '<rect x="-20" y="-4" width="40" height="22" rx="5" fill="#c08a52"/>' +
        '<path d="M-20,-4 a20,14 0 0 1 40,0 z" fill="#e0a866"/>' +
        '<rect x="-4" y="-2" width="8" height="12" rx="3" fill="#f5c451"/>' +
        '<rect x="-20" y="7" width="40" height="4" fill="#a9763f" opacity="0.6"/>' +
      '</g>' +
      /* 旗帜 */
      '<g id="' + id + '-flag">' +
        '<rect x="-1.6" y="-26" width="3.2" height="34" rx="1.6" fill="#8a5a32"/>' +
        '<path d="M1.6,-26 L24,-19 L1.6,-11 Z" fill="#ef6b47"/>' +
      '</g>' +
      /* 星星 */
      '<path id="' + id + '-star" d="M0,-10 L3.1,-3.3 L10.4,-2.4 L5,-2.6 L3.1,4.2 L1.2,-2.6 L-4.2,-2.4 Z" ' +
        'transform="scale(1.5)" fill="#f5c451" stroke="#e0a32f" stroke-width="0.6"/>' +
      /* 锁 */
      '<g id="' + id + '-lock">' +
        '<path d="M-8,-6 a8,8 0 0 1 16,0" fill="none" stroke="#8fa3b4" stroke-width="4.4" stroke-linecap="round"/>' +
        '<rect x="-11" y="-6" width="22" height="18" rx="5" fill="#aebecd"/>' +
        '<circle cx="0" cy="2" r="2.6" fill="#7b8fa1"/>' +
      '</g>' +
      /* 完成勾 */
      '<g id="' + id + '-check">' +
        '<circle cx="0" cy="0" r="12" fill="#12a37a" stroke="#ffffff" stroke-width="3"/>' +
        '<path d="M-5.5,0.5 L-1.5,5 L6,-4" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</g>' +
      /* 关卡图标：营地 / 森林 / 山丘 / 河谷 / 城堡 */
      '<g id="' + id + '-ico-0"><use href="#' + id + '-tent" transform="scale(0.9)"/></g>' +
      '<g id="' + id + '-ico-1"><use href="#' + id + '-tree" transform="scale(0.85)"/></g>' +
      '<g id="' + id + '-ico-2">' +
        '<path d="M-24,12 L-4,-16 L10,4 L18,-6 L26,12 Z" fill="#8fc47a"/>' +
        '<path d="M-4,-16 L10,4 L-14,6 Z" fill="#a9d894"/>' +
      '</g>' +
      '<g id="' + id + '-ico-3"><use href="#' + id + '-bridge" transform="scale(0.72)"/></g>' +
      '<g id="' + id + '-ico-4"><use href="#' + id + '-tower" transform="scale(0.95)"/></g>' +
      '<g id="' + id + '-ico-5"><use href="#' + id + '-chest" transform="scale(1.05)"/></g>' +
      '</defs>';
  }

  function iconFor(index) {
    return 'ico-' + (index % 6);
  }

  /* ---------------- 地形 ---------------- */
  function terrainHTML(id, cfg, nodePts) {
    var vb = cfg.vb;
    var W = vb[2], H = vb[3];
    var b = bounds(nodePts, 90);
    var coast = Math.max(60, b.top - 150);          // 海岸线高度
    var out = [];

    // 天空
    out.push('<rect x="' + vb[0] + '" y="' + vb[1] + '" width="' + W + '" height="' + H + '" fill="url(#' + id + '-sky)"/>');
    // 太阳光晕
    var sunX = W * 0.1, sunY = H * 0.09;
    out.push('<circle cx="' + sunX + '" cy="' + sunY + '" r="' + (W * 0.12) + '" fill="url(#' + id + '-glow)" opacity="0.55"/>');
    out.push('<circle cx="' + sunX + '" cy="' + sunY + '" r="22" fill="#ffe9a8"/>');
    // 云
    [[W * 0.34, H * 0.07, 1], [W * 0.62, H * 0.045, 0.85], [W * 0.86, H * 0.1, 0.7]].forEach(function (c) {
      out.push('<use href="#' + id + '-cloud" x="' + c[0] + '" y="' + c[1] + '" transform="translate(' + c[0] + ',' + c[1] + ') scale(' + c[2] + ')"/>');
    });
    // 远山
    out.push('<path d="M0,' + coast + ' L' + (W * 0.18) + ',' + (coast - 76) + ' L' + (W * 0.34) + ',' + coast +
      ' L' + (W * 0.52) + ',' + (coast - 54) + ' L' + (W * 0.7) + ',' + coast + ' L' + W + ',' + (coast - 62) +
      ' L' + W + ',' + coast + ' Z" fill="#9dc7d8" opacity="0.75"/>');
    out.push('<path d="M0,' + coast + ' L' + (W * 0.24) + ',' + (coast - 44) + ' L' + (W * 0.46) + ',' + coast +
      ' L' + (W * 0.66) + ',' + (coast - 34) + ' L' + W + ',' + coast + ' Z" fill="#8bb8cc" opacity="0.85"/>');
    // 海面
    out.push('<rect x="0" y="' + coast + '" width="' + W + '" height="' + Math.max(40, H - coast) + '" fill="url(#' + id + '-sea)" opacity="0.55"/>');
    // 海浪
    [[W * 0.12, coast + 26], [W * 0.44, coast + 16], [W * 0.78, coast + 32]].forEach(function (p) {
      out.push('<use href="#' + id + '-wave" transform="translate(' + p[0] + ',' + p[1] + ')"/>');
    });
    // 主陆地：带波浪海岸线的圆润大地块
    var landTop = coast + 26;
    var landBottom = H + 40;
    var seg = 6, step = W / seg, d = 'M-40,' + landBottom + ' L-40,' + (landTop + 24);
    for (var i = 0; i < seg; i++) {
      var x1 = i * step + step * 0.5, y1 = landTop + (i % 2 === 0 ? -22 : 18);
      var x2 = (i + 1) * step;
      d += ' Q ' + x1 + ',' + y1 + ' ' + x2 + ',' + (landTop + (i % 2 === 0 ? 6 : -8));
    }
    d += ' L' + (W + 40) + ',' + landBottom + ' Z';
    out.push('<path d="' + d + '" fill="url(#' + id + '-land)"/>');
    // 内陆草地色块
    out.push('<path d="M-40,' + (landTop + 120) + ' Q ' + (W * 0.3) + ',' + (landTop + 70) + ' ' + (W * 0.58) + ',' + (landTop + 130) +
      ' T ' + (W + 40) + ',' + (landTop + 90) + ' L' + (W + 40) + ',' + landBottom + ' L-40,' + landBottom + ' Z" fill="#93d271" opacity="0.55"/>');

    // 山丘（两块，摆在路两侧空处）
    var hillA = beside(nodePts[0], nodePts[1], 150);
    out.push('<ellipse cx="' + (nodePts[0][0] + hillA[0] * 1.6) + '" cy="' + (nodePts[0][1] + hillA[1] * 1.6) + '" rx="78" ry="40" fill="url(#' + id + '-hill)" opacity="0.95"/>');
    var hillB = beside(nodePts[2], nodePts[3], -160);
    out.push('<ellipse cx="' + (nodePts[2][0] + hillB[0] * 1.4) + '" cy="' + (nodePts[2][1] + hillB[1] * 1.4) + '" rx="70" ry="36" fill="url(#' + id + '-hill)" opacity="0.9"/>');

    // 小河：从内陆流到海里，穿过第 2→3 关之间的路
    var cross = lerp(nodePts[1], nodePts[2], 0.52);
    var riverTop = cross[1] - 150, riverBottom = cross[1] + 170;
    out.push('<path d="M' + (cross[0] - 40) + ',' + riverTop +
      ' C ' + (cross[0] + 24) + ',' + (cross[1] - 90) + ' ' + (cross[0] - 26) + ',' + (cross[1] - 30) + ' ' + cross[0] + ',' + cross[1] +
      ' C ' + (cross[0] + 26) + ',' + (cross[1] + 60) + ' ' + (cross[0] - 18) + ',' + (cross[1] + 110) + ' ' + (cross[0] - 6) + ',' + riverBottom +
      '" fill="none" stroke="#8fd8ef" stroke-width="26" stroke-linecap="round"/>');
    out.push('<path d="M' + (cross[0] - 40) + ',' + riverTop +
      ' C ' + (cross[0] + 24) + ',' + (cross[1] - 90) + ' ' + (cross[0] - 26) + ',' + (cross[1] - 30) + ' ' + cross[0] + ',' + cross[1] +
      ' C ' + (cross[0] + 26) + ',' + (cross[1] + 60) + ' ' + (cross[0] - 18) + ',' + (cross[1] + 110) + ' ' + (cross[0] - 6) + ',' + riverBottom +
      '" fill="none" stroke="#c9effb" stroke-width="16" stroke-linecap="round" stroke-dasharray="18 22" opacity="0.8"/>');
    // 桥：架在小路与河的交点
    out.push('<g transform="translate(' + cross[0] + ',' + (cross[1] + 2) + ') rotate(' +
      (Math.atan2(nodePts[2][1] - nodePts[1][1], nodePts[2][0] - nodePts[1][0]) * 180 / Math.PI) + ')" class="map-bridge">' +
      '<use href="#' + id + '-bridge"/></g>');

    // 森林与点缀：沿路两旁布置，宽窄两种版式都自然贴合
    var decos = [];
    var forestSpots = [0.35, 0.75, 1.55, 2.35];
    forestSpots.forEach(function (t, i) {
      var idx = Math.min(Math.floor(t), nodePts.length - 2);
      var p = lerp(nodePts[idx], nodePts[idx + 1] || nodePts[idx], t - idx);
      var off = beside(nodePts[idx], nodePts[idx + 1] || nodePts[idx], (i % 2 === 0 ? 1 : -1) * (86 + i * 12));
      decos.push('<g transform="translate(' + (p[0] + off[0]) + ',' + (p[1] + off[1]) + ') scale(' + (0.95 + (i % 3) * 0.18) + ')">' +
        '<use href="#' + id + '-pine" x="-14" y="-14"/><use href="#' + id + '-tree" x="16" y="-8"/><use href="#' + id + '-bush" x="2" y="14"/></g>');
    });
    var rockSpots = [0.6, 1.3, 2.6];
    rockSpots.forEach(function (t, i) {
      var idx = Math.min(Math.floor(t), nodePts.length - 2);
      var p = lerp(nodePts[idx], nodePts[idx + 1] || nodePts[idx], t - idx);
      var off = beside(nodePts[idx], nodePts[idx + 1] || nodePts[idx], (i % 2 === 0 ? -1 : 1) * 70);
      decos.push('<use href="#' + id + '-rock" transform="translate(' + (p[0] + off[0]) + ',' + (p[1] + off[1]) + ') scale(' + (0.9 + i * 0.12) + ')"/>');
    });
    out.push(decos.join(''));
    return out.join('');
  }

  /* ---------------- 小路 ---------------- */
  function trailHTML(cfg, nodePts, clearedCount) {
    var d = ZCD.ui.smoothPath(nodePts);
    var out = [];
    out.push('<path class="trail-shadow" d="' + d + '" fill="none" stroke="#6aa85a" stroke-width="' + (26 * cfg.unit) +
      '" stroke-linecap="round" opacity="0.28" transform="translate(0,' + (5 * cfg.unit) + ')"/>');
    out.push('<path class="trail-base" d="' + d + '" fill="none" stroke="#ffffff" stroke-width="' + (24 * cfg.unit) + '" stroke-linecap="round" opacity="0.9"/>');
    out.push('<path class="trail" d="' + d + '" fill="none" stroke="url(#' + cfg.id + '-sand)" stroke-width="' + (19 * cfg.unit) + '" stroke-linecap="round"/>');
    out.push('<path class="trail-stitch" d="' + d + '" fill="none" stroke="#c9a468" stroke-width="' + (3 * cfg.unit) +
      '" stroke-dasharray="' + (10 * cfg.unit) + ' ' + (12 * cfg.unit) + '" stroke-linecap="round" opacity="0.85"/>');
    if (clearedCount > 0) {
      var donePts = nodePts.slice(0, Math.min(clearedCount + 1, nodePts.length));
      if (donePts.length >= 2) {
        out.push('<path class="trail-done" d="' + ZCD.ui.smoothPath(donePts) + '" fill="none" stroke="#7fd0a6" stroke-width="' + (19 * cfg.unit) +
          '" stroke-linecap="round" opacity="0.92"/>');
      }
    }
    return out.join('');
  }

  /* ---------------- 关卡节点 ---------------- */
  function nodeHTML(id, cfg, item, pt, index) {
    var r = item.cleared || !item.unlocked ? cfg.badge : cfg.available;
    var state = item.cleared ? 'is-cleared' : (item.unlocked ? 'is-available' : 'is-locked');
    var g = [];
    var label = item.name + '：' + (item.cleared ? '已完成' : (item.unlocked ? '可以挑战' : '未解锁'));

    // 脚下的岛屿 / 平台
    g.push('<ellipse class="node-platform" cx="' + pt[0] + '" cy="' + (pt[1] + r + 14) + '" rx="' + (r + 22) + '" ry="' + (r * 0.42 + 8) + '"/>');
    // 高亮光环（可挑战）
    if (state === 'is-available') {
      g.push('<circle class="node-halo" cx="' + pt[0] + '" cy="' + pt[1] + '" r="' + (r + 14) + '"/>');
      g.push('<circle class="node-halo-inner" cx="' + pt[0] + '" cy="' + pt[1] + '" r="' + (r + 7) + '"/>');
      g.push('<g class="node-banner" transform="translate(' + pt[0] + ',' + (pt[1] - r - 34) + ') scale(1.35)"><use href="#' + id + '-flag"/></g>');
    }
    // 徽章
    g.push('<circle class="node-badge" cx="' + pt[0] + '" cy="' + pt[1] + '" r="' + r + '"/>');
    g.push('<circle class="node-badge-inner" cx="' + pt[0] + '" cy="' + (pt[1] - r * 0.16) + '" r="' + (r * 0.8) + '"/>');
    // 图标
    if (state === 'is-locked') {
      g.push('<use class="node-icon" href="#' + id + '-lock" transform="translate(' + pt[0] + ',' + pt[1] + ') scale(' + (r / 30) + ')"/>');
    } else {
      g.push('<use class="node-icon" href="#' + id + '-' + iconFor(index) + '" transform="translate(' + pt[0] + ',' + (pt[1] + r * 0.12) + ') scale(' + (r / 30) + ')"/>');
    }
    // 完成标记
    if (state === 'is-cleared') {
      g.push('<use class="node-check" href="#' + id + '-check" transform="translate(' + (pt[0] + r * 0.72) + ',' + (pt[1] - r * 0.72) + ') scale(' + (r / 34) + ')"/>');
    }
    // 星星：直接来自真实最好成绩
    var stars = util.starsText(item.stars || 0, 3);
    var starY = pt[1] + r + 38 * cfg.unit;
    g.push('<text class="node-stars" x="' + pt[0] + '" y="' + starY + '" style="font-size:' + (22 * cfg.unit) + 'px">' + stars + '</text>');
    // 关卡名称（地图上一眼能认出来；完整信息在点击后的面板里）
    var labelSize = (cfg.labelScale || 1) * 14 * cfg.unit;
    var label = item.name.length > 9 ? item.name.slice(0, 9) + '…' : item.name;
    g.push('<text class="node-label" x="' + pt[0] + '" y="' + (starY + labelSize + 6 * cfg.unit) + '" style="font-size:' + labelSize + 'px">' + esc(label) + '</text>');
    // 未解锁：写明解锁条件
    if (state === 'is-locked') {
      var hint = '通过关卡 ' + (item.level - 1) + ' 后解锁';
      var bw = 132 * cfg.unit, bh = 24 * cfg.unit, by = starY + labelSize + 16 * cfg.unit;
      g.push('<rect class="node-lock-bg" x="' + (pt[0] - bw / 2) + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="' + (bh / 2) + '"/>');
      g.push('<text class="node-lock-hint" x="' + pt[0] + '" y="' + (by + bh * 0.72) + '" style="font-size:' + (14 * cfg.unit) + 'px">' + esc(hint) + '</text>');
      label += '，' + hint;
    }
    // 点击热区：透明但可点，保证触控尺寸
    g.push('<circle class="node-hit" cx="' + pt[0] + '" cy="' + pt[1] + '" r="' + (r + 20) + '" fill="transparent"/>');

    return '<g class="map-node ' + state + '" data-level="' + item.level + '" role="button" tabindex="0"' +
      (item.unlocked ? '' : ' aria-disabled="true"') +
      ' aria-label="' + esc(label) + '">' + g.join('') + '</g>';
  }

  /* ---------------- 场景装饰：营地与宝箱 ---------------- */
  function campAndChest(id, cfg, nodePts, levels) {
    var first = nodePts[0];
    var last = nodePts[nodePts.length - 1];
    var out = [];
    // 营地（起点）
    out.push('<g class="map-camp" transform="translate(' + (first[0] - cfg.badge - 52) + ',' + (first[1] + 26) + ')">' +
      '<use href="#' + id + '-tent" transform="scale(1.15)"/>' +
      '<ellipse cx="26" cy="16" rx="16" ry="6" fill="#8a5a32" opacity="0.35"/>' +
      '<use href="#' + id + '-bush" transform="translate(30,6) scale(0.7)"/>' +
      '</g>');
    // 宝箱（终点）
    var allCleared = levels.every(function (l) { return l.cleared; });
    out.push('<g class="map-chest' + (allCleared ? ' is-open' : '') + '" transform="translate(' + (last[0] + 46) + ',' + (last[1] - 52) + ') scale(1.15)">' +
      '<use href="#' + id + '-chest"/>' +
      (allCleared ? '<circle cx="0" cy="6" r="34" fill="url(#' + id + '-glow)" opacity="0.9"/>' : '') +
      '</g>');
    // 终点标志
    out.push('<g class="map-finish" transform="translate(' + (last[0] + 46) + ',' + (last[1] - 92) + ') scale(0.9)">' +
      '<use href="#' + id + '-flag"/></g>');
    return out.join('');
  }

  /**
   * 生成地图 SVG
   * @param {Object} opts
   *   opts.levels  [{level, name, count, cleared, unlocked, stars}]  真实关卡数据
   *   opts.layout  'wide' | 'tall'（不传则按窗口宽度自动选择）
   *   opts.packName / opts.subject 用于无障碍描述
   * @returns {{svg:string, layout:string, nodeCount:number}}
   */
  function build(opts) {
    opts = opts || {};
    var levels = opts.levels || [];
    var layoutKey = opts.layout === 'tall' || opts.layout === 'wide' ? opts.layout : layoutFor(opts.width);
    var cfg = LAYOUTS[layoutKey];
    var id = 'zcdm' + (++uid);
    var nodePts = levels.map(function (l, i) {
      var base = cfg.nodes[i % cfg.nodes.length];
      // 超过 5 关时，额外的关卡沿路径继续延伸，避免重叠
      var overflow = Math.floor(i / cfg.nodes.length);
      return [base[0] + overflow * 34, base[1] + overflow * 46];
    });
    cfg = Object.assign({}, cfg, { id: id });

    var clearedCount = 0;
    for (var i = 0; i < levels.length; i++) {
      if (levels[i].cleared) clearedCount = i + 1;
    }

    var vb = cfg.vb;
    var svg = '<svg class="adventure-map" viewBox="' + vb.join(' ') + '" preserveAspectRatio="xMidYMid meet" ' +
      'role="img" aria-label="' + esc((opts.packName || '知识包') + '的闯关地图，共 ' + levels.length + ' 个关卡') + '">' +
      defs(id) +
      terrainHTML(id, cfg, nodePts) +
      trailHTML(cfg, nodePts, clearedCount) +
      campAndChest(id, cfg, nodePts, levels) +
      levels.map(function (l, i) { return nodeHTML(id, cfg, l, nodePts[i], i); }).join('') +
      '</svg>';

    return { svg: svg, layout: layoutKey, nodeCount: levels.length };
  }

  ZCD.mapArt = {
    build: build,
    layoutFor: layoutFor,
    LAYOUTS: LAYOUTS
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);