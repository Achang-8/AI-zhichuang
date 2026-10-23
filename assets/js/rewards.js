/*!
 * 知闯岛 · 级别、星星、经验与奖励规则
 * 所有数值均为固定程序规则，不依赖任何外部 AI 或接口。
 */
(function (root) {
  'use strict';
  root.ZCD = root.ZCD || {};
  var ZCD = root.ZCD;
  var util = ZCD.util;

  /** 关卡星级门槛 */
  var RULES = {
    THREE_STAR: 90,   // 正确率 >= 90% → 3 星
    TWO_STAR: 70,     // 正确率 >= 70% → 2 星
    ONE_STAR: 0,      // 正确率 < 70%  → 1 星
    PASS: 60,         // 正确率 >= 60% 才通关
    FIRST_BONUS: 20,  // 首次通关基础经验
    XP_PER_QUESTION: 4,
    XP_PER_STAR: 10,
    XP_REPLAY_PER_QUESTION: 1,
    STAR_UPGRADE_XP: 10
  };

  /** 等级表：经验 → 等级称号 */
  var LEVELS = [
    { xp: 0, title: '初登小岛' },
    { xp: 100, title: '沙滩新手' },
    { xp: 260, title: '丛林探险家' },
    { xp: 480, title: '山谷旅人' },
    { xp: 760, title: '湖泊向导' },
    { xp: 1100, title: '高原骑士' },
    { xp: 1500, title: '沙漠商人' },
    { xp: 1960, title: '雪山学者' },
    { xp: 2500, title: '火山勇者' },
    { xp: 3120, title: '知闯岛主' }
  ];

  /** 根据经验值计算等级信息 */
  function levelFromXp(xp) {
    xp = Math.max(0, Number(xp) || 0);
    var idx = 0;
    for (var i = 0; i < LEVELS.length; i++) {
      if (xp >= LEVELS[i].xp) idx = i;
    }
    var cur = LEVELS[idx];
    var next = LEVELS[idx + 1] || null;
    var span = next ? next.xp - cur.xp : 0;
    var done = next ? xp - cur.xp : 0;
    return {
      level: idx + 1,
      title: cur.title,
      xp: xp,
      nextXp: next ? next.xp : null,
      toNext: next ? Math.max(0, next.xp - xp) : 0,
      progress: next ? util.pct(done, span) : 100,
      isMax: !next
    };
  }

  /** 正确率 → 星级 */
  function starsFor(accuracy) {
    if (accuracy >= RULES.THREE_STAR) return 3;
    if (accuracy >= RULES.TWO_STAR) return 2;
    return 1;
  }

  function isPass(accuracy) {
    return accuracy >= RULES.PASS;
  }

  /**
   * 结算一关。严格防止重复累计：
   *  - 星级只记录「历史最好成绩」，累计星星 = 每关最好星级之和，重复挑战不会叠加。
   *  - 首次通关奖励（基础经验 + 星级加成）在 cleared 之后永远不会再次发放。
   *  - 重复挑战只按本次答对题数给少量经验。
   *  - 刷新最好星级时，只补发「星级提升差额 × STAR_UPGRADE_XP」。
   */
  function settleLevel(opts) {
    var correct = Math.max(0, Number(opts.correct) || 0);
    var total = Math.max(1, Number(opts.total) || 0);
    var prev = opts.prev || null;
    var prevCleared = !!(prev && prev.cleared);
    var prevBestStars = prevCleared ? (prev.bestStars || 0) : 0;

    var accuracy = util.pct(correct, total);
    var stars = starsFor(accuracy);
    var passed = isPass(accuracy);

    var firstClear = passed && !prevCleared;
    var upgrade = (passed && prevCleared && stars > prevBestStars) ? (stars - prevBestStars) : 0;

    var xpPerQuestion = firstClear ? RULES.XP_PER_QUESTION : RULES.XP_REPLAY_PER_QUESTION;
    var xpQuestions = correct * xpPerQuestion;
    var xpFirstBonus = 0;
    var xpStarBonus = 0;

    if (firstClear) {
      xpFirstBonus = RULES.FIRST_BONUS;
      xpStarBonus = stars * RULES.XP_PER_STAR;
    } else if (upgrade > 0) {
      xpStarBonus = upgrade * RULES.STAR_UPGRADE_XP;
    }

    // 未通关时不计星星，也不给任何通关奖励
    var awardedStars = passed ? stars : 0;
    var newBestStars = passed ? Math.max(prevBestStars, stars) : prevBestStars;
    var deltaStars = passed ? Math.max(0, stars - prevBestStars) : 0;

    var xpTotal = xpQuestions + xpFirstBonus + xpStarBonus;

    return {
      correct: correct,
      total: total,
      accuracy: accuracy,
      stars: stars,
      awardedStars: awardedStars,
      passed: passed,
      firstClear: firstClear,
      upgrade: upgrade,
      xpQuestions: xpQuestions,
      xpFirstBonus: xpFirstBonus,
      xpStarBonus: xpStarBonus,
      xpTotal: xpTotal,
      deltaStars: deltaStars,
      newBestStars: newBestStars,
      prevBestStars: prevBestStars,
      isReplay: prevCleared
    };
  }

  /**
   * 徽章：全部由真实学习数据计算，不做任何虚假统计。
   * @param {Object} m 指标对象（见 store.achievementMetrics）
   */
  function badgeList(m) {
    m = m || {};
    var list = [
      { id: 'first-clear', name: '初次登岛', emoji: '🏝️', desc: '完成第 1 个关卡', earned: (m.clearedLevels || 0) >= 1 },
      { id: 'perfect-5', name: '满星收集者', emoji: '🌟', desc: '有 5 个关卡拿到 3 星', earned: (m.perfectLevels || 0) >= 5 },
      { id: 'answer-100', name: '百题勇士', emoji: '💯', desc: '累计答对 100 道题', earned: (m.correct || 0) >= 100 },
      { id: 'sharp', name: '稳准小神探', emoji: '🎯', desc: '答题满 50 道且正确率 ≥ 85%', earned: (m.answered || 0) >= 50 && (m.accuracy || 0) >= 85 },
      { id: 'pack-master', name: '岛屿征服者', emoji: '🏆', desc: '完整通关 1 个知识包', earned: (m.finishedPacks || 0) >= 1 },
      { id: 'wrong-clear', name: '错题清零', emoji: '🧹', desc: '错题本里没有待复习的错题', earned: (m.wrongTotal || 0) > 0 && (m.wrongPending || 0) === 0 },
      { id: 'keep-going', name: '坚持三天', emoji: '📅', desc: '有 3 天留下学习记录', earned: (m.days || 0) >= 3 },
      { id: 'all-round', name: '全能探险家', emoji: '🧭', desc: '四个学科都至少通关 1 关', earned: (m.subjectsCleared || 0) >= 4 }
    ];
    return list;
  }

  /* ---------------- 答题反馈文案（本地预设，随机且不连续重复） ---------------- */

  var FEEDBACK = {
    /** 答对时的鼓励语 */
    correct: [
      '太棒了，就是这个思路！',
      '答对啦，你的判断很准！',
      '漂亮！这一步想得很清楚。',
      '对了！继续保持这个节奏。',
      '厉害，这道题难不倒你。',
      '完全正确，给你点个赞！',
      '很好，你把知识点用上了。',
      '答对了，稳稳的！',
      '不错，思路找得很准。',
      '正确！再往下闯一关吧。'
    ],
    /** 答错时的温和反馈 */
    wrong: [
      '没关系，我们一起弄懂它。',
      '差一点点，看看提示再想一想。',
      '这道题有点绕，我们来理一理。',
      '不要紧，错一次就多懂一点。',
      '先别着急，我们一起找线索。',
      '这一题先记下来，弄懂就是收获。'
    ],
    /** 没有配置提示时的通用引导语（不针对具体题目，不编造题目内容） */
    genericHint: [
      '把题目再读一遍，想想它考的是哪个知识点。',
      '先看看题目在问什么，再回忆课本上的说法。',
      '慢慢来，可以用排除法一个一个试试。'
    ],
    /** 答错但已看过解析后的收尾语 */
    afterAnalysis: [
      '看懂了吗？下一题继续加油。',
      '记住这个思路，下一次就会啦。',
      '把它收进错题本，过几天再练一次。'
    ]
  };

  var lastPick = {};

  /** 随机取一条文案，保证不与上一次相同 */
  function pick(kind) {
    var list = FEEDBACK[kind] || FEEDBACK.correct;
    var i = Math.floor(Math.random() * list.length);
    if (list.length > 1 && i === lastPick[kind]) i = (i + 1) % list.length;
    lastPick[kind] = i;
    return list[i];
  }

  /**
   * 提示是否安全（不能直接泄露答案）
   * 命中任一情况即视为泄露：包含正确选项的文字、出现「选A / 答案是B」、就是答案字母本身
   */
  function hintLeaksAnswer(hint, question) {
    var lib = root.ZCD && root.ZCD.validateLib;
    if (lib && lib.hintLeaksAnswer) return lib.hintLeaksAnswer(hint, question);

    // 兜底实现（与 validate.js 中的规则保持一致）
    if (!hint) return false;
    var h = String(hint);
    var q = question || {};
    var answer = String(q.answer || '').toUpperCase();
    if (/选\s*[A-DＡ-Ｄ](?![A-Za-z0-9])|答案\s*(是|为|应(该)?(选|是)?)\s*[A-DＡ-Ｄ]|选项\s*[A-DＡ-Ｄ]|第\s*[一二三四1-4]\s*个?\s*(选项|答案)/.test(h)) return true;
    var opts = q.options || [];
    for (var i = 0; i < opts.length; i++) {
      if (String(opts[i].key).toUpperCase() !== answer) continue;
      var text = String(opts[i].text || '');
      if (!text) continue;
      var wordLike = /^[A-Za-z0-9]/.test(text) && /[A-Za-z0-9]$/.test(text);
      if (wordLike && text.length <= 3) {
        var re = new RegExp('(^|[^A-Za-z0-9])' + text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^A-Za-z0-9]|$)', 'i');
        if (re.test(h)) return true;
      } else if (h.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
        return true;
      }
    }
    return false;
  }

  /** 取出可以安全展示的提示；不安全或缺失时返回空字符串 */
  function safeHint(question) {
    if (!question) return '';
    var h = question.hint ? String(question.hint).trim() : '';
    if (!h) return '';
    if (hintLeaksAnswer(h, question)) return '';
    return h;
  }

  ZCD.rewards = {
    RULES: RULES,
    LEVELS: LEVELS,
    FEEDBACK: FEEDBACK,
    pick: pick,
    hintLeaksAnswer: hintLeaksAnswer,
    safeHint: safeHint,
    starsFor: starsFor,
    isPass: isPass,
    levelFromXp: levelFromXp,
    settleLevel: settleLevel,
    badgeList: badgeList,
    /** 每关最多 3 星 */
    MAX_STARS_PER_LEVEL: 3
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);