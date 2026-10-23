/*!
 * 知闯岛 · 本地存储
 * 使用浏览器 localStorage 保存：答题记录、错题本、关卡解锁状态、星星与经验、自定义题库。
 * 数据只保存在当前设备与当前浏览器，不会自动跨设备同步。
 */
(function (root) {
  'use strict';
  root.ZCD = root.ZCD || {};
  var ZCD = root.ZCD;
  var util = ZCD.util;

  var KEY = 'zhichuangdao.progress.v1';
  var MAX_ANSWERS = 600;     // 近期答题记录上限，避免无限增长
  var MAX_ACTIVITY_DAYS = 60;

  var listeners = [];
  var mem = null;            // localStorage 不可用时的内存兜底
  var availability = null;

  function now() { return Date.now(); }

  function defaultState() {
    return {
      version: 1,
      createdAt: now(),
      updatedAt: now(),
      profile: {
        nickname: '小闯关者',
        grade: null,        // 只有用户主动选择过才有值，系统不填默认值
        subject: null,
        packId: null,       // 用户最近主动进入的知识包
        chosenAt: null      // 用户主动选择的时间戳：用来区分「系统默认」和「用户选择」
      },
      xp: 0,
      totals: { answered: 0, correct: 0, reviewAnswered: 0, reviewCorrect: 0 },
      levelStats: {},       // levelId -> {attempts, cleared, bestStars, bestAccuracy, bestCorrect, total, firstClearedAt, lastAt}
      stats: { bySubject: {}, byPack: {} },
      wrong: [],            // 错题本
      answers: [],          // 近期答题记录（最新在前）
      activity: {},         // 'YYYY-MM-DD' -> {answered, correct, cleared, reviews}
      pointStats: null,     // '年级|学科|知识点' -> 知识点聚合（null 表示需要按答题记录重建）
      custom: { packs: [], questions: [] },
      lastPlayed: null,     // {packId, level, grade, subject, at}
      settings: { reduceMotion: false }
    };
  }

  /** 知识点聚合键：同一年级同一学科下同名知识点合并统计 */
  function pointKey(grade, subject, point) {
    return Number(grade) + '|' + String(subject) + '|' + String(point || '综合练习');
  }

  var lastOk = 0, lastBad = 0;

  /** 把一次作答累加到知识点聚合里 */
  function accumulatePoint(stats, grade, subject, point, correct, ts, mode) {
    var key = pointKey(grade, subject, point);
    var st = stats[key];
    if (!st) {
      st = stats[key] = {
        grade: Number(grade),
        subject: String(subject),
        point: String(point || '综合练习'),
        answered: 0,
        correct: 0,
        recent: [],        // 最近 5 次结果，1=对 0=错（旧 → 新）
        lastAt: 0,
        wrongEvents: 0,    // 历史答错次数
        reviewCount: 0,    // 复习作答次数
        reviewCorrect: 0
      };
    }
    st.answered++;
    if (correct) { st.correct++; lastOk++; } else { st.wrongEvents++; lastBad++; }
    st.recent.push(correct ? 1 : 0);
    if (st.recent.length > 5) st.recent = st.recent.slice(-5);
    if (Number(ts) > st.lastAt) st.lastAt = Number(ts) || 0;
    if (mode === 'review') {
      st.reviewCount++;
      if (correct) st.reviewCorrect++;
    }
    return st;
  }

  /** 用已有的答题记录重建知识点聚合（旧数据升级时使用，只做一次） */
  function rebuildPointStats(s) {
    var stats = {};
    var list = (s.answers || []).slice().reverse();   // 记录是「新在前」，倒过来按时间累加
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      accumulatePoint(stats, a.grade, a.subject, a.point, !!a.correct, a.ts, a.mode);
    }
    s.pointStats = stats;
    return stats;
  }

  function canUseStorage() {
    if (availability !== null) return availability;
    try {
      var k = '__zcd_probe__';
      root.localStorage.setItem(k, '1');
      root.localStorage.removeItem(k);
      availability = true;
    } catch (e) {
      availability = false;
    }
    return availability;
  }

  /** 错题记录升级：补全新增字段，保留原有内容 */
  function migrateWrong(e) {
    if (!e || typeof e !== 'object') return e;
    var ts = Number(e.ts) || now();
    var w = Object.assign({}, e);
    w.grade = Number(e.grade);
    w.subject = e.subject;
    w.packId = e.packId || '';
    w.level = Number(e.level) || 1;
    w.point = e.point || '综合练习';
    w.type = e.type || 'single';
    w.options = Array.isArray(e.options) ? e.options : [];
    w.answer = String(e.answer || '').toUpperCase();
    w.userAnswer = String(e.userAnswer || '').toUpperCase();
    w.analysis = e.analysis || '';
    w.wrongTimes = Number(e.wrongTimes) || 1;
    w.rightTimes = Number(e.rightTimes) || 0;
    w.attempts = Number(e.attempts) || (w.wrongTimes + w.rightTimes) || 1;
    w.history = Array.isArray(e.history) ? e.history : [];
    w.status = e.status === 'mastered' ? 'mastered' : 'pending';
    w.ts = ts;
    // 新增字段：旧数据按历史记录推断，推断不出就退回已有时间
    var lastWrong = null, lastReview = null;
    for (var i = 0; i < w.history.length; i++) {
      var h = w.history[i] || {};
      if (!h.correct) lastWrong = Number(h.ts) || lastWrong;
      if (h.mode === 'review') lastReview = Number(h.ts) || lastReview;
    }
    w.lastWrongAt = Number(e.lastWrongAt) || lastWrong || (w.status === 'pending' ? ts : ts);
    w.lastReviewAt = Number(e.lastReviewAt) || lastReview || null;
    w.updatedAt = Number(e.updatedAt) || w.lastReviewAt || w.lastWrongAt || ts;
    w.masteredAt = e.masteredAt || null;
    return w;
  }

  function migrate(s) {
    var d = defaultState();
    if (!s || typeof s !== 'object') return d;
    // 先原样保留所有顶层字段（兼容旧数据与将来新增字段），再补全/校正已知字段
    for (var k in s) {
      if (Object.prototype.hasOwnProperty.call(s, k)) d[k] = s[k];
    }
    d.version = 1;
    d.createdAt = Number(s.createdAt) || d.createdAt;
    d.updatedAt = Number(s.updatedAt) || d.updatedAt;
    d.profile = Object.assign({ nickname: '小闯关者', grade: null, subject: null, packId: null, chosenAt: null }, s.profile || {});
    d.xp = Number(s.xp) || 0;
    d.totals = Object.assign({ answered: 0, correct: 0, reviewAnswered: 0, reviewCorrect: 0 }, s.totals || {});
    d.levelStats = (s.levelStats && typeof s.levelStats === 'object') ? s.levelStats : {};
    d.stats = {
      bySubject: (s.stats && s.stats.bySubject) || {},
      byPack: (s.stats && s.stats.byPack) || {}
    };
    d.wrong = Array.isArray(s.wrong) ? s.wrong.map(migrateWrong) : [];
    d.answers = Array.isArray(s.answers) ? s.answers : [];
    d.activity = (s.activity && typeof s.activity === 'object') ? s.activity : {};
    d.pointStats = (s.pointStats && typeof s.pointStats === 'object') ? s.pointStats : null;
    d.custom = {
      packs: (s.custom && Array.isArray(s.custom.packs)) ? s.custom.packs : [],
      questions: (s.custom && Array.isArray(s.custom.questions)) ? s.custom.questions : []
    };
    d.lastPlayed = s.lastPlayed || null;
    d.settings = Object.assign({ reduceMotion: false }, s.settings || {});
    normalizeChoice(d);
    return d;
  }

  /**
   * 区分「系统默认值」和「用户主动选择」
   *
   * 老版本曾经把「三年级 / 数学」直接写成 profile 的默认值，因此旧数据里出现
   * 三年级数学并不代表用户选过它。规则：
   *   1. 已经有 chosenAt（本版本用户主动选过）→ 原样保留
   *   2. 有真实学习记录 → 按记录恢复选择（这是真实用过的内容）
   *   3. 没有记录、且正好是老的默认组合（3 + math）→ 清空，不算选择
   *   4. 没有记录、但不是默认组合（说明用户当年确实改过）→ 视为选择，补上时间戳
   */
  function normalizeChoice(d) {
    var p = d.profile;
    if (!p) return d;
    if (p.chosenAt) {
      p.grade = p.grade ? Number(p.grade) : null;
      return d;
    }
    var hasRecord = !!d.lastPlayed ||
      Number(d.totals && d.totals.answered) > 0 ||
      (d.answers && d.answers.length > 0) ||
      (d.wrong && d.wrong.length > 0) ||
      Object.keys(d.levelStats || {}).length > 0;
    var legacyDefault = Number(p.grade) === 3 && p.subject === 'math';

    if (hasRecord) {
      var lp = d.lastPlayed || {};
      if (lp.grade) p.grade = Number(lp.grade);
      if (lp.subject) p.subject = lp.subject;
      if (lp.packId) p.packId = lp.packId;
      p.chosenAt = Number(lp.at) || Number(d.updatedAt) || now();
    } else if (!legacyDefault && p.grade && p.subject) {
      p.chosenAt = Number(d.updatedAt) || now();
    } else {
      p.grade = null;
      p.subject = null;
      p.packId = null;
    }
    return d;
  }

  var state = null;
  var loadError = null;

  function load() {
    if (state) return state;
    if (!canUseStorage()) {
      state = mem || defaultState();
      return state;
    }
    var raw = null;
    try { raw = root.localStorage.getItem(KEY); } catch (e) { raw = null; }
    if (!raw) {
      state = defaultState();
      return state;
    }
    var parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      // 解析失败：绝不删除原始数据，先备份，再以空白进度启动，并把错误交给界面提示
      var backupKey = KEY + '.broken.' + now();
      var backed = false;
      try { root.localStorage.setItem(backupKey, raw); backed = true; } catch (e2) { backed = false; }
      loadError = {
        kind: 'parse',
        backupKey: backed ? backupKey : null,
        message: '本地学习数据读取失败（数据格式异常）。原始数据已' +
          (backed ? '完整备份到备份键 ' + backupKey : '保留在原位置，未被覆盖') +
          '，本次以空白进度继续，不会清空原始数据。'
      };
      if (root.console) console.warn('[知闯岛] 本地数据解析失败，已备份原始数据。', e);
      state = defaultState();
      return state;
    }
    try {
      state = migrate(parsed);
    } catch (e) {
      loadError = {
        kind: 'migrate',
        backupKey: null,
        message: '本地学习数据升级失败：' + (e && e.message ? e.message : String(e)) +
          '。原始数据保留在原位置，本次以空白进度继续。'
      };
      if (root.console) console.warn('[知闯岛] 本地数据升级失败。', e);
      state = defaultState();
      return state;
    }
    if (!state.pointStats) rebuildPointStats(state);
    return state;
  }

  function persist() {
    var s = load();
    s.updatedAt = now();
    if (!canUseStorage()) {
      mem = s;
      return false;
    }
    try {
      root.localStorage.setItem(KEY, JSON.stringify(s));
      return true;
    } catch (e) {
      if (root.console) console.warn('[知闯岛] 保存失败（可能是存储空间已满或被隐私模式限制）', e);
      return false;
    }
  }

  function commit() {
    persist();
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](state); } catch (e) { /* 单个订阅者出错不影响其它 */ }
    }
  }

  function subscribe(fn) {
    listeners.push(fn);
    return function () {
      var i = listeners.indexOf(fn);
      if (i >= 0) listeners.splice(i, 1);
    };
  }

  /* ---------------- 关卡与解锁 ---------------- */

  function lid(packId, level) {
    return packId + '-l' + level;
  }

  function levelStat(packId, level) {
    return load().levelStats[lid(packId, level)] || null;
  }

  function isLevelCleared(packId, level) {
    var st = levelStat(packId, level);
    return !!(st && st.cleared);
  }

  /** 规则：第 1 关默认开放；完成第 n 关后才解锁第 n+1 关。已通关的关卡可重复挑战。 */
  function isLevelUnlocked(packId, level) {
    if (Number(level) <= 1) return true;
    return isLevelCleared(packId, Number(level) - 1);
  }

  function maxUnlockedLevel(packId) {
    var lv = 1;
    while (isLevelCleared(packId, lv)) lv++;
    return lv; // 第一个未通关的关卡；若全部通关则等于 关卡数+1
  }

  /** 知识包进度：已完成关卡 / 总关卡 / 星星 / 完成度 */
  function packProgress(packId) {
    var count = 5;
    if (ZCD.data && ZCD.data.levelList) count = ZCD.data.levelList(packId).length || 5;
    var cleared = 0, stars = 0, attempts = 0, lastAt = 0, best = 0;
    for (var i = 1; i <= count; i++) {
      var st = levelStat(packId, i);
      if (st) {
        attempts += st.attempts || 0;
        if (st.cleared) cleared++;
        stars += st.bestStars || 0;
        if ((st.lastAt || 0) > lastAt) lastAt = st.lastAt;
        if ((st.bestAccuracy || 0) > best) best = st.bestAccuracy;
      }
    }
    return {
      packId: packId,
      levels: count,
      cleared: cleared,
      stars: stars,
      maxStars: count * 3,
      percent: util.pct(cleared, count),
      attempts: attempts,
      lastAt: lastAt,
      bestAccuracy: best,
      finished: cleared >= count && count > 0
    };
  }

  /* ---------------- 答题记录 ---------------- */

  function bumpActivity(field, n) {
    var s = load();
    var k = util.dayKey();
    var d = s.activity[k] || { answered: 0, correct: 0, cleared: 0, reviews: 0 };
    d[field] = (d[field] || 0) + (n === undefined ? 1 : n);
    s.activity[k] = d;
    // 只保留最近 60 天
    var keys = Object.keys(s.activity).sort();
    if (keys.length > MAX_ACTIVITY_DAYS) {
      for (var i = 0; i < keys.length - MAX_ACTIVITY_DAYS; i++) delete s.activity[keys[i]];
    }
  }

  function bump(s, path, correct) {
    var key = path;
    if (!s.stats.bySubject[key]) s.stats.bySubject[key] = { answered: 0, correct: 0 };
    s.stats.bySubject[key].answered++;
    if (correct) s.stats.bySubject[key].correct++;
  }

  function bumpPack(s, packId, correct) {
    if (!s.stats.byPack[packId]) s.stats.byPack[packId] = { answered: 0, correct: 0 };
    s.stats.byPack[packId].answered++;
    if (correct) s.stats.byPack[packId].correct++;
  }

  /**
   * 记录一次作答（关卡答题或错题复习）
   * @returns {{correct:boolean, entry:Object|null}}
   */
  function recordAnswer(opts) {
    var s = load();
    var q = opts.question;
    var chosen = String(opts.chosen || '').toUpperCase();
    var answer = String(q.answer || '').toUpperCase();
    var correct = chosen === answer;
    var mode = opts.mode === 'review' ? 'review' : 'level';
    var ts = now();

    s.totals.answered++;
    if (correct) s.totals.correct++;
    if (mode === 'review') {
      s.totals.reviewAnswered++;
      if (correct) s.totals.reviewCorrect++;
    }
    bump(s, Number(q.grade) + '|' + q.subject, correct);
    if (q.packId) bumpPack(s, q.packId, correct);
    if (!s.pointStats) rebuildPointStats(s);
    accumulatePoint(s.pointStats, q.grade, q.subject, q.point, correct, ts, mode);
    bumpActivity('answered');
    if (correct) bumpActivity('correct');
    if (mode === 'review') bumpActivity('reviews');

    s.answers.unshift({
      qid: q.id,
      packId: q.packId,
      levelId: q.packId ? lid(q.packId, q.level) : null,
      level: q.level,
      grade: Number(q.grade),
      subject: q.subject,
      point: q.point,
      stem: q.stem.length > 60 ? q.stem.slice(0, 60) + '…' : q.stem,
      chosen: chosen,
      answer: answer,
      correct: correct,
      mode: mode,
      ts: ts
    });
    if (s.answers.length > MAX_ANSWERS) s.answers.length = MAX_ANSWERS;

    var entry = updateWrongBook(s, q, chosen, correct, mode, ts);
    commit();
    return { correct: correct, entry: entry };
  }

  /** 错题本：答错记入并保留历史；重新答对后标记为已掌握，但历史错误记录不删除 */
  function updateWrongBook(s, q, chosen, correct, mode, ts) {
    var idx = -1;
    for (var i = 0; i < s.wrong.length; i++) {
      if (s.wrong[i].qid === q.id) { idx = i; break; }
    }
    if (idx === -1) {
      if (correct) return null;   // 第一次就答对，不进错题本
      var entry = {
        qid: q.id,
        grade: Number(q.grade),
        subject: q.subject,
        packId: q.packId,
        levelId: q.packId ? lid(q.packId, q.level) : null,
        level: q.level,
        point: q.point,
        type: q.type,
        stem: q.stem,
        options: q.options || [],
        answer: String(q.answer).toUpperCase(),
        analysis: q.analysis,
        hint: q.hint || '',
        userAnswer: chosen,
        ts: ts,
        updatedAt: ts,
        lastWrongAt: ts,       // 最近一次答错时间
        lastReviewAt: mode === 'review' ? ts : null,   // 最近一次复习时间（在复习里答错也算复习过）
        status: 'pending',
        attempts: 1,
        wrongTimes: 1,
        rightTimes: 0,
        history: [{ ts: ts, chosen: chosen, correct: false, mode: mode }],
        masteredAt: null
      };
      s.wrong.unshift(entry);
      return entry;
    }

    var e = s.wrong[idx];
    e.updatedAt = ts;
    e.attempts = (e.attempts || 0) + 1;
    e.history.push({ ts: ts, chosen: chosen, correct: correct, mode: mode });
    if (e.history.length > 30) e.history = e.history.slice(-30);
    if (!correct) e.lastWrongAt = ts;              // 再次答错：更新错误次数与最近答错时间
    if (mode === 'review') e.lastReviewAt = ts;    // 复习作答：更新最近复习时间
    if (correct) {
      e.rightTimes = (e.rightTimes || 0) + 1;
      e.status = 'mastered';
      e.masteredAt = ts;
      e.userAnswer = chosen;
    } else {
      e.wrongTimes = (e.wrongTimes || 0) + 1;
      e.status = 'pending';
      e.masteredAt = null;
      e.userAnswer = chosen;
    }
    return e;
  }

  /* ---------------- 结算 ---------------- */

  /**
   * 结算一个关卡。奖励不会重复累计：星级取历史最好成绩，
   * 首次通关奖励只发一次，重复挑战只按本次答对题数给经验。
   */
  function finishLevel(opts) {
    var s = load();
    var packId = opts.packId;
    var level = Number(opts.level);
    var id = lid(packId, level);
    var prev = s.levelStats[id] || null;
    var r = ZCD.rewards.settleLevel({
      correct: opts.correct,
      total: opts.total,
      prev: prev
    });

    var st = prev || {
      packId: packId, level: level, attempts: 0, cleared: false,
      bestStars: 0, bestAccuracy: 0, bestCorrect: 0, total: opts.total,
      firstClearedAt: null, lastAt: 0
    };
    st.attempts++;
    st.total = opts.total;
    st.lastAt = now();
    st.bestAccuracy = Math.max(st.bestAccuracy || 0, r.accuracy);
    st.bestCorrect = Math.max(st.bestCorrect || 0, r.correct);
    if (r.passed) {
      if (!st.cleared) {
        st.cleared = true;
        st.firstClearedAt = st.lastAt;
        bumpActivity('cleared');
      }
      st.bestStars = Math.max(st.bestStars || 0, r.stars);
    }
    s.levelStats[id] = st;
    s.xp += r.xpTotal;
    commit();

    r.levelId = id;
    r.packId = packId;
    r.level = level;
    r.totalXp = s.xp;
    r.levelInfo = ZCD.rewards.levelFromXp(s.xp);
    r.unlockedNext = ZCD.store.isLevelUnlocked(packId, level + 1);
    return r;
  }

  /** 结算一次错题复习：不发星星，只按答对题数给少量复习经验 */
  function finishReview(opts) {
    var s = load();
    var correct = Number(opts.correct) || 0;
    var total = Number(opts.total) || 0;
    var xp = correct * 1;
    s.xp += xp;
    commit();
    return {
      mode: 'review',
      correct: correct,
      total: total,
      accuracy: util.pct(correct, total),
      xpTotal: xp,
      totalXp: s.xp,
      levelInfo: ZCD.rewards.levelFromXp(s.xp)
    };
  }

  /* ---------------- 统计 ---------------- */

  function totalStars() {
    var s = load(), sum = 0;
    for (var k in s.levelStats) {
      if (Object.prototype.hasOwnProperty.call(s.levelStats, k)) sum += s.levelStats[k].bestStars || 0;
    }
    return sum;
  }

  function clearedLevelCount() {
    var s = load(), n = 0;
    for (var k in s.levelStats) {
      if (Object.prototype.hasOwnProperty.call(s.levelStats, k) && s.levelStats[k].cleared) n++;
    }
    return n;
  }

  function finishedPackCount() {
    var packs = ZCD.data.allPacks(), n = 0;
    for (var i = 0; i < packs.length; i++) {
      if (packProgress(packs[i].id).finished) n++;
    }
    return n;
  }

  function activityToday() {
    var s = load();
    return s.activity[util.dayKey()] || { answered: 0, correct: 0, cleared: 0, reviews: 0 };
  }

  /** 徽章与成就所需的真实指标 */
  function achievementMetrics() {
    var s = load();
    var perfect = 0, clearedLevels = 0;
    var subjects = {};
    for (var k in s.levelStats) {
      if (!Object.prototype.hasOwnProperty.call(s.levelStats, k)) continue;
      var st = s.levelStats[k];
      if (st.bestStars >= 3) perfect++;
      if (st.cleared) {
        clearedLevels++;
        var pid = st.packId || k.replace(/-l\d+$/, '');
        var pack = ZCD.data ? ZCD.data.getPack(pid) : null;
        if (pack) subjects[pack.subject] = true;
      }
    }
    var w = wrongStats();
    return {
      answered: s.totals.answered,
      correct: s.totals.correct,
      accuracy: util.pct(s.totals.correct, s.totals.answered),
      reviewCorrect: s.totals.reviewCorrect,
      clearedLevels: clearedLevels,
      perfectLevels: perfect,
      stars: totalStars(),
      xp: s.xp,
      finishedPacks: ZCD.data ? finishedPackCount() : 0,
      days: Object.keys(s.activity).length,
      wrongTotal: w.total,
      wrongPending: w.pending,
      subjectsCleared: Object.keys(subjects).length
    };
  }

  function badges() {
    return ZCD.rewards.badgeList(achievementMetrics());
  }

  function earnedBadgeIds() {
    return badges().filter(function (b) { return b.earned; }).map(function (b) { return b.id; });
  }

  /** 最近一次学习动作（用于「继续闯关」） */
  function recentLevelRecords(n) {
    var s = load();
    var list = [];
    for (var k in s.levelStats) {
      if (Object.prototype.hasOwnProperty.call(s.levelStats, k)) {
        var st = s.levelStats[k];
        list.push(st);
      }
    }
    list.sort(function (a, b) { return (b.lastAt || 0) - (a.lastAt || 0); });
    return list.slice(0, n || 5);
  }

  function recentAnswers(n) {
    return load().answers.slice(0, n || 10);
  }

  /* ---------------- 自定义题库 ---------------- */

  function addCustomPack(pack, questions) {
    var s = load();
    s.custom.packs.push(pack);
    for (var i = 0; i < questions.length; i++) s.custom.questions.push(questions[i]);
    commit();
    return pack;
  }

  function removeCustomPack(packId) {
    var s = load();
    s.custom.packs = s.custom.packs.filter(function (p) { return p.id !== packId; });
    s.custom.questions = s.custom.questions.filter(function (q) { return q.packId !== packId; });
    // 同步清理该知识包的关卡统计（错题本保留历史记录）
    for (var k in s.levelStats) {
      if (Object.prototype.hasOwnProperty.call(s.levelStats, k) && k.indexOf(packId + '-l') === 0) {
        delete s.levelStats[k];
      }
    }
    delete s.stats.byPack[packId];
    commit();
  }

  /* ---------------- 错题本 ---------------- */

  function wrongList(filter) {
    var s = load();
    filter = filter || {};
    return s.wrong.filter(function (e) {
      if (filter.subject && e.subject !== filter.subject) return false;
      if (filter.grade && Number(e.grade) !== Number(filter.grade)) return false;
      if (filter.status && e.status !== filter.status) return false;
      if (filter.packId && e.packId !== filter.packId) return false;
      return true;
    }).sort(function (a, b) { return (b.updatedAt || b.ts) - (a.updatedAt || a.ts); });
  }

  function wrongStats() {
    var list = wrongList();
    var pending = 0, mastered = 0, subjects = {};
    for (var i = 0; i < list.length; i++) {
      if (list[i].status === 'mastered') mastered++; else pending++;
      subjects[list[i].subject] = (subjects[list[i].subject] || 0) + 1;
    }
    return { total: list.length, pending: pending, mastered: mastered, subjects: subjects };
  }

  /** 错题本里出现过的知识包，用于「按知识包筛选」 */
  function wrongPackOptions() {
    var map = {};
    var list = load().wrong;
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (!e.packId) continue;
      if (!map[e.packId]) {
        var pack = ZCD.data ? ZCD.data.getPack(e.packId) : null;
        map[e.packId] = { packId: e.packId, name: pack ? pack.name : e.packId, count: 0 };
      }
      map[e.packId].count++;
    }
    var out = [];
    for (var k in map) if (Object.prototype.hasOwnProperty.call(map, k)) out.push(map[k]);
    out.sort(function (a, b) { return b.count - a.count; });
    return out;
  }

  /* ---------------- 知识点聚合 ---------------- */

  function pointStats() {
    var s = load();
    if (!s.pointStats) rebuildPointStats(s);
    return s.pointStats;
  }

  function pointStatOf(grade, subject, point) {
    return pointStats()[pointKey(grade, subject, point)] || null;
  }

  /** 读取本地数据时是否发生过异常（用于界面提示，不会清空数据） */
  function loadErrorInfo() {
    load();
    return loadError;
  }

  function markMastered(qid) {
    var s = load();
    for (var i = 0; i < s.wrong.length; i++) {
      if (s.wrong[i].qid === qid) {
        s.wrong[i].status = 'mastered';
        s.wrong[i].masteredAt = now();
        s.wrong[i].updatedAt = now();
      }
    }
    commit();
  }

  function resetWrongStatus(qid) {
    var s = load();
    for (var i = 0; i < s.wrong.length; i++) {
      if (s.wrong[i].qid === qid) {
        s.wrong[i].status = 'pending';
        s.wrong[i].masteredAt = null;
        s.wrong[i].updatedAt = now();
      }
    }
    commit();
  }

  function removeWrong(qid) {
    var s = load();
    s.wrong = s.wrong.filter(function (e) { return e.qid !== qid; });
    commit();
  }

  function clearWrong() {
    var s = load();
    s.wrong = [];
    commit();
  }

  /* ---------------- 其它 ---------------- */

  function setLastPlayed(info) {
    var s = load();
    s.lastPlayed = Object.assign({ at: now() }, info);
    commit();
  }

  function setProfile(patch) {
    var s = load();
    s.profile = Object.assign(s.profile, patch);
    commit();
  }

  /**
   * 记录用户「主动选择」的年级 / 学科 / 知识包。
   * 只写选择本身，不动任何答题记录、错题与进度。
   */
  function setChoice(patch) {
    var s = load();
    var p = s.profile;
    if (patch && patch.grade != null) p.grade = Number(patch.grade);
    if (patch && patch.subject != null) p.subject = String(patch.subject);
    if (patch && patch.packId != null) p.packId = String(patch.packId);
    p.chosenAt = now();
    commit();
    return { grade: p.grade, subject: p.subject, packId: p.packId, at: p.chosenAt };
  }

  /** 用户主动选择的学习内容；从没选过则返回 null */
  function chosenContent() {
    var s = load();
    var p = s.profile || {};
    if (!p.grade || !p.subject || !p.chosenAt) return null;
    return {
      grade: Number(p.grade),
      subject: String(p.subject),
      packId: p.packId || null,
      at: Number(p.chosenAt) || null
    };
  }

  function hasChosenContent() {
    return !!chosenContent();
  }

  /** 是否有真实的学习痕迹（答题、错题、通关、经验、上次挑战） */
  function hasLearningHistory() {
    var s = load();
    return !!s.lastPlayed ||
      Number(s.totals && s.totals.answered) > 0 ||
      (s.answers || []).length > 0 ||
      (s.wrong || []).length > 0 ||
      Object.keys(s.levelStats || {}).length > 0 ||
      Number(s.xp) > 0;
  }

  /** 首次进入：既没主动选过、也没有任何学习记录 */
  function isFirstVisit() {
    return !hasChosenContent() && !hasLearningHistory();
  }

  function resetAll() {
    state = defaultState();
    if (canUseStorage()) {
      try { root.localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    }
    mem = state;
    commit();
    return state;
  }

  function exportJSON() {
    return JSON.stringify(load(), null, 2);
  }

  function importJSON(text) {
    var data = JSON.parse(text);
    state = migrate(data);
    commit();
    return state;
  }

  function storageInfo() {
    var bytes = 0;
    try {
      var raw = root.localStorage.getItem(KEY) || '';
      bytes = raw.length;
    } catch (e) { bytes = 0; }
    return {
      available: canUseStorage(),
      key: KEY,
      bytes: bytes,
      customPacks: load().custom.packs.length,
      customQuestions: load().custom.questions.length
    };
  }

  ZCD.store = {
    KEY: KEY,
    state: load,
    save: commit,
    subscribe: subscribe,
    persistenceAvailable: canUseStorage,
    // 关卡
    levelId: lid,
    levelStat: levelStat,
    isLevelCleared: isLevelCleared,
    isLevelUnlocked: isLevelUnlocked,
    maxUnlockedLevel: maxUnlockedLevel,
    packProgress: packProgress,
    // 答题与结算
    recordAnswer: recordAnswer,
    finishLevel: finishLevel,
    finishReview: finishReview,
    // 学习内容的选择（区分系统默认与用户主动选择）
    setChoice: setChoice,
    chosenContent: chosenContent,
    hasChosenContent: hasChosenContent,
    hasLearningHistory: hasLearningHistory,
    isFirstVisit: isFirstVisit,
    // 统计
    totalStars: totalStars,
    clearedLevelCount: clearedLevelCount,
    finishedPackCount: finishedPackCount,
    activityToday: activityToday,
    achievementMetrics: achievementMetrics,
    badges: badges,
    earnedBadgeIds: earnedBadgeIds,
    recentLevelRecords: recentLevelRecords,
    recentAnswers: recentAnswers,
    // 自定义题库
    addCustomPack: addCustomPack,
    removeCustomPack: removeCustomPack,
    // 错题本
    wrongList: wrongList,
    wrongStats: wrongStats,
    wrongPackOptions: wrongPackOptions,
    // 知识点聚合
    pointKey: pointKey,
    pointStats: pointStats,
    pointStatOf: pointStatOf,
    rebuildPointStats: function () { return rebuildPointStats(load()); },
    loadErrorInfo: loadErrorInfo,
    markMastered: markMastered,
    resetWrongStatus: resetWrongStatus,
    removeWrong: removeWrong,
    clearWrong: clearWrong,
    // 其它
    setLastPlayed: setLastPlayed,
    setProfile: setProfile,
    resetAll: resetAll,
    exportJSON: exportJSON,
    importJSON: importJSON,
    storageInfo: storageInfo
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);