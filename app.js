/**
 * SAMEN GROEIEN — Nederlandse Applicatie-Logica (0 t/m 12 Jaar)
 * Minimalistisch, snel en geoptimaliseerd voor telefoon en desktop.
 * Inclusief:
 *  1. Meerdere Kinderen Profielen (1-tik wisselaar + gezinstip)
 *  2. Visuele SVG Snij- & Serveergids per fase
 *  3. 5-Minuten Fase-Recepten + 1-tik WhatsApp Boodschappenlijst
 *  4. SOS "Eerste Hulp bij Lastige Momenten" + Consultatiebureau/RVP/Tandjes
 *  5. Oppas- & Oma-Kaartje (WhatsApp & Kopieer functie)
 *  6. Offline Service Worker (PWA)
 */

(function () {
  "use strict";

  const DATA = window.GROWING_DATA;
  const STORAGE_KEY = "samen_groeien_nl_v1";
  const ZOOM_ORDER = ["week", "month", "stage", "year"];

  let timelineManualExpanded = false;
  let lastAllergensAutoStageId = null;

  const state = {
    currentWeek: 24,
    zoomMode: "stage",
    epochFilter: "y1",
    unit: "metric",
    theme: "light",
    activeView: "food",
    foodCategoryFilter: "all",
    foodStatusFilter: "all",
    previewSolidsUnder4m: false,
    gameCategoryFilter: "all",
    recipeMealFilter: "all",
    recipesExpanded: false,
    gamesExpanded: false,
    foodsExpanded: false,
    allergensExpanded: false,
    showAllStagesRecipes: false,
    showAllStagesGames: false,
    searchQuery: "",
    activeSosCardId: "sos-fever",
    // Multi-kind ondersteuning
    children: [],
    activeChildId: null,
    // Fallback voor gebruik zonder ingevuld kindprofiel
    profile: {
      name: "",
      dob: "",
      dueDate: "",
      useAdjusted: true,
      weightKg: "",
      feedingType: "",
      customOppasNote: ""
    },
    activeFamilyDish: "pasta",
    onboardingDismissed: false,
    triedFoods: {},
    favoriteGames: {},
    favoriteRecipes: {},
    weeklyGroceryRecipes: {},
    checkedMilestones: {},
    milestoneMemories: {},
    checkedReadiness: {},
    growthLogs: [],
    cbQuestions: [],
    checkedTeeth: {},
    checkedHabits: {},
    allergenExposures: {},
    allergenWeeklyGiven: {},
    foodPracticeCounts: {}
  };

  function getCurrentIsoWeekKey() {
    const now = new Date();
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  }

  // =========================================================================
  // 1. OPSLAG, MIGRATIE & ACTIEF KINDPROFIEL
  // =========================================================================
  function sanitizeTriedFoodsAndHabits(target) {
    if (!target) return;
    if (!target.triedFoods) target.triedFoods = {};
    if (!target.checkedHabits) target.checkedHabits = {};
    Object.keys(target.triedFoods).forEach((k) => {
      if (k.startsWith("stage-")) {
        target.checkedHabits[k] = true;
        delete target.triedFoods[k];
      }
    });
    if (target.allergenExposures && typeof target.allergenExposures === "object") {
      Object.keys(target.allergenExposures).forEach((aid) => {
        const arr = target.allergenExposures[aid];
        if (Array.isArray(arr)) {
          const c = Math.min(3, arr.filter(Boolean).length);
          target.allergenExposures[aid] = [c >= 1, c >= 2, c >= 3];
        }
      });
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.currentWeek) state.currentWeek = clampWeek(saved.currentWeek);
      if (saved.zoomMode && ZOOM_ORDER.includes(saved.zoomMode)) state.zoomMode = saved.zoomMode;
      state.unit = "metric";
      if (saved.theme) state.theme = saved.theme;
      if (saved.activeView) state.activeView = saved.activeView;
      if (saved.activeFamilyDish) state.activeFamilyDish = saved.activeFamilyDish;
      if (saved.profile) state.profile = { ...state.profile, ...saved.profile };
      if (typeof saved.onboardingDismissed === "boolean") state.onboardingDismissed = saved.onboardingDismissed;
      if (saved.triedFoods) state.triedFoods = saved.triedFoods;
      if (saved.favoriteGames) state.favoriteGames = saved.favoriteGames;
      if (saved.favoriteRecipes) state.favoriteRecipes = saved.favoriteRecipes;
      if (saved.weeklyGroceryRecipes) state.weeklyGroceryRecipes = saved.weeklyGroceryRecipes;
      if (saved.checkedMilestones) state.checkedMilestones = saved.checkedMilestones;
      if (saved.milestoneMemories) state.milestoneMemories = saved.milestoneMemories;
      if (saved.checkedReadiness) state.checkedReadiness = saved.checkedReadiness;
      if (Array.isArray(saved.growthLogs)) state.growthLogs = saved.growthLogs;
      if (Array.isArray(saved.cbQuestions)) state.cbQuestions = saved.cbQuestions;
      if (saved.checkedTeeth) state.checkedTeeth = saved.checkedTeeth;
      if (saved.checkedHabits) state.checkedHabits = saved.checkedHabits;
      if (saved.allergenExposures) state.allergenExposures = saved.allergenExposures;
      if (saved.allergenWeeklyGiven) state.allergenWeeklyGiven = saved.allergenWeeklyGiven;
      if (saved.foodPracticeCounts) state.foodPracticeCounts = saved.foodPracticeCounts;
      if (Array.isArray(saved.children)) state.children = saved.children;
      if (saved.activeChildId) state.activeChildId = saved.activeChildId;

      sanitizeTriedFoodsAndHabits(state);

      // Migratie van enkelvoudig profiel naar multi-kind lijst
      if (state.children.length === 0 && (state.profile.name || state.profile.dob)) {
        const firstId = "child-" + Date.now();
        state.children.push({
          id: firstId,
          name: state.profile.name || "Kind 1",
          dob: state.profile.dob || "",
          dueDate: state.profile.dueDate || "",
          useAdjusted: state.profile.useAdjusted !== false,
          weightKg: state.profile.weightKg || "",
          feedingType: state.profile.feedingType || "",
          customOppasNote: state.profile.customOppasNote || "",
          triedFoods: { ...state.triedFoods },
          favoriteGames: { ...state.favoriteGames },
          favoriteRecipes: { ...state.favoriteRecipes },
          weeklyGroceryRecipes: { ...state.weeklyGroceryRecipes },
          checkedMilestones: { ...state.checkedMilestones },
          milestoneMemories: { ...state.milestoneMemories },
          checkedReadiness: { ...state.checkedReadiness },
          growthLogs: [...state.growthLogs],
          cbQuestions: [...state.cbQuestions],
          checkedTeeth: { ...state.checkedTeeth },
          checkedHabits: { ...state.checkedHabits },
          allergenExposures: { ...state.allergenExposures },
          allergenWeeklyGiven: { ...state.allergenWeeklyGiven },
          foodPracticeCounts: { ...state.foodPracticeCounts }
        });
        state.activeChildId = firstId;
      }

      state.children.forEach((ch) => sanitizeTriedFoodsAndHabits(ch));

      if (state.children.length > 0 && !state.children.some((c) => c.id === state.activeChildId)) {
        state.activeChildId = state.children[0].id;
      }

      syncEpochToWeek(state.currentWeek);
    } catch (err) {
      console.warn("Kon status niet laden:", err);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("Kon status niet opslaan:", err);
    }
  }

  function getActiveChild() {
    if (!state.children || state.children.length === 0) return null;
    return state.children.find((c) => c.id === state.activeChildId) || state.children[0];
  }

  function getActiveStore() {
    const child = getActiveChild();
    const target = child || state;
    if (!target.triedFoods) target.triedFoods = {};
    if (!target.favoriteGames) target.favoriteGames = {};
    if (!target.favoriteRecipes) target.favoriteRecipes = {};
    if (!target.weeklyGroceryRecipes) target.weeklyGroceryRecipes = {};
    if (!target.checkedMilestones) target.checkedMilestones = {};
    if (!target.milestoneMemories) target.milestoneMemories = {};
    if (!target.checkedReadiness) target.checkedReadiness = {};
    if (!Array.isArray(target.growthLogs)) target.growthLogs = [];
    if (!Array.isArray(target.cbQuestions)) target.cbQuestions = [];
    if (!target.checkedTeeth) target.checkedTeeth = {};
    if (!target.checkedHabits) target.checkedHabits = {};
    if (!target.allergenExposures) target.allergenExposures = {};
    if (!target.allergenWeeklyGiven) target.allergenWeeklyGiven = {};
    if (!target.foodPracticeCounts) target.foodPracticeCounts = {};
    sanitizeTriedFoodsAndHabits(target);
    return target;
  }

  function clampWeek(w) {
    const num = parseInt(w, 10);
    if (isNaN(num) || num < 1) return 1;
    if (num > 624) return 624;
    return num;
  }

  function syncEpochToWeek(week) {
    if (state.zoomMode === "week") {
      state.epochFilter = week <= 52 ? "y1" : "y2";
      return;
    }
    if (week <= 52) state.epochFilter = "y1";
    else if (week <= 104) state.epochFilter = "y2";
    else state.epochFilter = "preschool";
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * Maakt getallen, maten, volumes en kloktijden dikgedrukt (strong.num-bold)
   * zonder highlight-achtergrond of afwijkende kleur.
   */
  function boldNumbersInEscapedHtml(escapedText) {
    if (!escapedText) return "";
    // 1. Kloktijden (bijv. 07:00 of 18:00–22:00)
    let out = escapedText.replace(
      /\b(\d{2}:\d{2}(?:\s*[–-]\s*\d{2}:\d{2})?)\b/g,
      '<strong class="num-bold">$1</strong>'
    );
    // 2. Hoeveelheden, maten, gewichten, temperaturen, frequenties en leeftijds-eenheden
    out = out.replace(
      /((?:≥\s*|±\s*|ca\.\s*|max\.?\s*|min\.?\s*~?)?\b\d+(?:[.,×x/]\d+)?(?:\s*(?:[–-]|tot|t\/m|naar)\s*\d+(?:[.,×x/]\d+)?)?\s*(?:ml\/dag|ml|liter|L\/dag|L|kcal\/dag|kcal|mcg|mg|gram|g|kg|cm|mm|°C|°|%|24u|uur|u|minuten|min|seconden|sec|dagen|weken|week|maanden|mnd|jaar|jr|e\s+verjaardag|theelepeltjes|theelepels|tl|eetlepels|el|opscheplepels|melkvoedingen|voedingen|flesjes|fles|oefenhapjes|hapjes|hoofdmaaltijden|maaltijden|tussendoortjes|fruitmoment|warme\s+maaltijd|eetmomenten|melkmomenten|sneetjes|boterhammen|porties|dutjes|slaapjes|slaapje)\b)/gi,
      '<strong class="num-bold">$1</strong>'
    );
    return out;
  }

  /**
   * Voorbeeld dagritme: maakt kloktijd en hoeveelheden dikgedrukt zonder highlight
   */
  function formatSampleMenuItemHtml(rawSentence) {
    const raw = String(rawSentence || "").trim();
    if (!raw) return "";

    const timeStartMatch = raw.match(/^(\d{2}:\d{2}(?:\s*[–-]\s*\d{2}:\d{2})?)\s*[:—-]?\s+(.*)$/);
    if (timeStartMatch) {
      const timeBold = `<strong class="num-bold">${escapeHtml(timeStartMatch[1])}</strong>`;
      const restEscaped = boldNumbersInEscapedHtml(escapeHtml(timeStartMatch[2]));
      return `${timeBold} ${restEscaped}`;
    }

    return boldNumbersInEscapedHtml(escapeHtml(raw));
  }

  /**
   * Maakt alleen de aanhef (kernbegrip) vetgedrukt, getallen in de rest van de tekst blijven normaal
   */
  function formatLeadOnlyHtml(rawSentence) {
    const raw = String(rawSentence || "").trim();
    if (!raw) return "";

    const colonIdx = raw.indexOf(":");
    if (colonIdx > 0 && colonIdx <= 48) {
      const lead = escapeHtml(raw.slice(0, colonIdx + 1));
      const rest = escapeHtml(raw.slice(colonIdx + 1));
      return `<strong>${lead}</strong>${rest}`;
    }

    const dashIdx = raw.indexOf("—");
    if (dashIdx > 0 && dashIdx <= 48) {
      const lead = escapeHtml(raw.slice(0, dashIdx).trim());
      const rest = escapeHtml(raw.slice(dashIdx + 1).trim());
      return `<strong>${lead}</strong> — ${rest}`;
    }

    const parenIdx = raw.indexOf("(");
    if (parenIdx > 0 && parenIdx <= 72) {
      const lead = escapeHtml(raw.slice(0, parenIdx).trim());
      const rest = escapeHtml(raw.slice(parenIdx).trim());
      return `<strong>${lead}</strong> ${rest}`;
    }

    const words = raw.split(/\s+/);
    if (words.length >= 5) {
      let leadLen = words[0].length <= 3 ? 4 : 3;
      const stopWords = new Set(["onder", "voor", "vóór", "van", "tot", "bij", "met", "in", "op", "naar", "de", "het", "een", "en", "of", "als", "dan"]);
      while (leadLen > 2 && stopWords.has(words[leadLen - 1].toLowerCase().replace(/[(),.:;]/g, ""))) {
        leadLen--;
      }
      const leadPart = escapeHtml(words.slice(0, leadLen).join(" "));
      const restPart = escapeHtml(words.slice(leadLen).join(" "));
      return `<strong>${leadPart}</strong> ${restPart}`;
    }

    return escapeHtml(raw);
  }

  const formatLeadAndNumbersHtml = formatLeadOnlyHtml;

  function formatAvoidFoodItemHtml(rawAvoid) {
    const raw = String(rawAvoid || "").trim();
    if (!raw) return "";

    const parenMatch = raw.match(/^([^(]+?)\s*\(([^)]+)\)\s*[.!]*$/);
    if (parenMatch) {
      const whatToAvoid = parenMatch[1].trim();
      const rawReason = parenMatch[2].trim();
      const cleanReason = rawReason.charAt(0).toUpperCase() + rawReason.slice(1);
      return `
        <li class="avoid-item-card">
          <span class="avoid-item-icon" aria-hidden="true">✕</span>
          <div class="avoid-item-content">
            <strong class="avoid-item-title">${escapeHtml(whatToAvoid)}</strong>
            <span class="avoid-item-reason">${escapeHtml(cleanReason)}</span>
          </div>
        </li>
      `;
    }

    return `
      <li class="avoid-item-card">
        <span class="avoid-item-icon" aria-hidden="true">✕</span>
        <div class="avoid-item-content">
          <strong class="avoid-item-title">${escapeHtml(raw)}</strong>
        </div>
      </li>
    `;
  }

  /**
   * Verwijdert de dubbele leeftijd/week-haakjes aan het einde van de Hero-titel
   * omdat die al in de twee overzichtelijke fase-pills erboven staan.
   */
  function formatCleanHeroTitle(rawTitle) {
    return String(rawTitle || "")
      .replace(/\s*\([^)]*\)\s*$/, "")
      .trim();
  }

  /**
   * Deelt langere kaart-teksten (zoals Puree-pad en Zelf-Eten-pad) op in overzichtelijke
   * scanbare bullets met gemarkeerde cijfers.
   */
  function renderStructuredBulletsOrText(rawText) {
    const sentences = String(rawText || "")
      .replace(/([.!?])\s+/g, "$1\n")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (sentences.length === 0) return "";
    if (sentences.length === 1) {
      return `<p>${formatLeadOnlyHtml(sentences[0])}</p>`;
    }
    return `<ul class="clean-bullets">${sentences
      .map((s) => `<li>${formatLeadOnlyHtml(s)}</li>`)
      .join("")}</ul>`;
  }

  function applyTheme(theme) {
    const t = theme === "dark" ? "dark" : "light";
    state.theme = t;
    document.documentElement.setAttribute("data-theme", t);
    const iconEl = document.getElementById("themeIcon");
    if (iconEl) iconEl.textContent = t === "dark" ? "☀️" : "🌙";
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", t === "dark" ? "#14191e" : "#2b7a69");
  }

  // =========================================================================
  // 2. LEEFTIJD, FASE & WEEK-SPOTLIGHT BEREKENING
  // =========================================================================
  function getStageForWeek(week) {
    return (
      DATA.stages.find((s) => week >= s.minWeek && week <= s.maxWeek) ||
      DATA.stages[DATA.stages.length - 1]
    );
  }

  function formatExactAgeFromWeek(week) {
    if (week <= 4) {
      return `Week ${week} • Pasgeboren (0–1 mnd)`;
    }
    if (week <= 8) {
      return `Week ${week} • ~1–2 maanden`;
    }
    if (week <= 12) {
      return `Week ${week} • ~2 maanden`;
    }
    if (week <= 16) {
      return `Week ${week} • ~3 maanden`;
    }
    if (week <= 51) {
      const mnd = getMonthForWeek(week);
      return `Week ${week} • ~${mnd} maanden`;
    }
    if (week === 52) {
      return `Week 52 • Bijna 1 jaar (12 mnd)`;
    }
    if (week === 53) {
      return `Week 53 • 1 jaar (12 mnd)`;
    }
    if (week <= 104) {
      const mnd = Math.min(24, Math.max(12, Math.round(week / 4.333)));
      return `Week ${week} • ~${mnd} maanden`;
    }
    if (week === 624) {
      return `Week 624 • 12 jaar`;
    }
    const years = Math.floor((week - 1) / 52);
    const remWeeks = week - 1 - years * 52;
    const remMonths = Math.min(11, Math.floor(remWeeks / 4.333));
    return `Week ${week} • ${years} jr${remMonths > 0 ? ` ${remMonths} mnd` : ""}`;
  }

  // Nauwkeurige maand <-> week koppeling zodat bijv. Maand 4 direct op Week 17 (oefenhapjes) landt
  const YEAR_ONE_MONTH_WEEKS = [2, 6, 12, 17, 21, 25, 29, 33, 37, 42, 47, 52];

  function getRepresentativeWeekForMonth(m) {
    if (m >= 1 && m <= 12) return YEAR_ONE_MONTH_WEEKS[m - 1];
    if (m === 144) return 624;
    return clampWeek(Math.round((m - 0.5) * 4.3333));
  }

  function getMonthForWeek(w) {
    if (w <= 4) return 1;
    if (w <= 8) return 2;
    if (w <= 16) return 3;
    if (w <= 19) return 4;
    if (w <= 23) return 5;
    if (w <= 27) return 6;
    if (w <= 30) return 7;
    if (w <= 35) return 8;
    if (w <= 39) return 9;
    if (w <= 44) return 10;
    if (w <= 48) return 11;
    if (w <= 52) return 12;
    return Math.min(144, Math.max(13, Math.ceil(w / 4.3333)));
  }

  function formatMonthNodeLabel(m) {
    if (m <= 24) return `Mnd ${m}`;
    const yrs = Math.floor(m / 12);
    const remM = m % 12;
    return remM === 0 ? `${yrs} jaar` : `${yrs}j ${remM}m`;
  }

  function getDynamicWeekSpotlight(week, stage) {
    if (DATA.weeklySpecials[week]) {
      return DATA.weeklySpecials[week];
    }

    const specialWeeks = Object.keys(DATA.weeklySpecials)
      .map(Number)
      .sort((a, b) => a - b);
    const nextSpecialWeek = specialWeeks.find((sw) => sw > week);

    const progress = (week - stage.minWeek) / Math.max(1, stage.maxWeek - stage.minWeek);
    let note = "";
    if (progress < 0.35) {
      note = `Start van fase ${stage.shortLabel}: bied nieuwe smaken en spelletjes rustig en zonder druk aan.`;
    } else if (progress < 0.75) {
      note = `Midden in fase ${stage.shortLabel}: je kind oefent volop met de nieuwe vaardigheden van deze leeftijd.`;
    } else {
      note = `Einde van fase ${stage.shortLabel}: je kind maakt zich klaar voor de volgende ontwikkelingsstap.`;
    }

    if (nextSpecialWeek && nextSpecialWeek - week <= 6) {
      const diff = nextSpecialWeek - week;
      const nextObj = DATA.weeklySpecials[nextSpecialWeek];
      note += ` Binnenkort over ${diff} ${diff === 1 ? "week" : "weken"} (week ${nextSpecialWeek}): ${nextObj.badge}.`;
    }

    const stageGames = stage.games || [];
    const pickedGame = stageGames.length > 0 ? stageGames[(week - stage.minWeek) % stageGames.length] : null;
    const defaultFoodFocus = (() => {
      if (week <= 16) {
        return "Drinktempo & hongersignalen: rustig drinken in 15–20 min; herken vroege signalen zoals smakken en handjes naar de mond.";
      }
      if (week <= 23) {
        return "Eerste gladde oefenhapjes: 1–2 lepeltjes enkelvoudige zachte groente tussen melkvoedingen door om smaken te leren kennen.";
      }
      if (week <= 36) {
        return "Ontdekken van zachte structuren: geef zachte groentestengels (zoals gestoomde wortel) in de knuist naast zachte puree.";
      }
      if (week <= 52) {
        return "Pincetgreep & hapklare stukjes: stimuleer duim en wijsvinger met zachte blokjes avocado, broodkorst en fijne bloemkoolroosjes.";
      }
      if (week <= 156) {
        return "Gezellig samen aan tafel: kook zoutloos mee met het gezin; laat je peuter zelf met een vorkje prikken en uit een open beker drinken.";
      }
      if (week <= 364) {
        return "Kleurrijk bord & broodtrommel: varieer met knapperige snackgroente (zoals komkommerlinten en snoeptomaatjes) voor school.";
      }
      return "Zelfstandigheid & voedzame energie: betrek je kind bij het klaarmaken van een voedzaam ontbijt en een gezonde schoolfles water.";
    })();

    return {
      badge: `📅 Week ${week}`,
      type: "normal",
      headline: `${stage.title.split("(")[0].trim()}`,
      summary: note,
      foodFocus: defaultFoodFocus,
      highlightGame: pickedGame ? pickedGame.title : ""
    };
  }

  function resolveSpotlightGameForWeek(stage, week, spotlightObj) {
    const stageGames = (stage && stage.games) || [];
    if (stageGames.length === 0) return null;
    const spot = spotlightObj || getDynamicWeekSpotlight(week, stage);
    const rawTitle = String((spot && spot.highlightGame) || "").trim().toLowerCase();

    if (rawTitle) {
      const exactMatch = stageGames.find((g) => String(g.title || "").trim().toLowerCase() === rawTitle);
      if (exactMatch) return exactMatch;

      const stopWords = new Set(["samen", "met", "een", "voor", "naar", "van", "onder", "over", "door", "eigen", "zelf"]);
      const keywords = rawTitle
        .replace(/[^a-z0-9à-ÿ\s]/gi, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 4 && !stopWords.has(w));

      if (keywords.length > 0) {
        let bestGame = null;
        let bestScore = 0;
        stageGames.forEach((g) => {
          const hay = `${g.title || ""} ${g.howToPlay || ""} ${g.materials || ""}`.toLowerCase();
          const score = keywords.reduce((acc, kw) => (hay.includes(kw) ? acc + ( String(g.title || "").toLowerCase().includes(kw) ? 3 : 1 ) : acc), 0);
          if (score > bestScore) {
            bestScore = score;
            bestGame = g;
          }
        });
        if (bestGame && bestScore > 0) return bestGame;
      }
    }

    return stageGames[Math.max(0, week - stage.minWeek) % stageGames.length] || stageGames[0];
  }

  function calculateAgeForProfile(prof) {
    if (!prof || !prof.dob) return null;
    const dobDate = new Date(prof.dob + "T00:00:00");
    const now = new Date();
    const diffMs = now - dobDate;
    if (isNaN(diffMs)) return null;

    // Ondersteun toekomstige (uitgerekende) datum voor aanstaande ouders
    if (diffMs < 0) {
      const daysUntilDue = Math.max(1, Math.ceil(-diffMs / (1000 * 60 * 60 * 24)));
      return {
        chronoWeek: 1,
        adjustedWeek: 1,
        activeTargetWeek: 1,
        isPreemie: false,
        isExpecting: true,
        daysUntilDue,
        shortAge: "Verwacht 🤰",
        readableAge: "Verwacht 🤰 • W1"
      };
    }

    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const chronoWeek = clampWeek(Math.floor(totalDays / 7) + 1);

    let adjustedWeek = chronoWeek;
    let isPreemie = false;

    if (prof.dueDate) {
      const due = new Date(prof.dueDate + "T00:00:00");
      const earlyDays = Math.floor((due - dobDate) / (1000 * 60 * 60 * 24));
      if (earlyDays >= 14) {
        isPreemie = true;
        const adjDays = Math.max(0, totalDays - earlyDays);
        adjustedWeek = clampWeek(Math.floor(adjDays / 7) + 1);
      }
    }

    const activeTargetWeek =
      isPreemie && prof.useAdjusted !== false && chronoWeek <= 104
        ? adjustedWeek
        : chronoWeek;

    const months = Math.floor(totalDays / 30.4375);
    const years = Math.floor(totalDays / 365.25);

    let shortAge = "";
    let readableAge = "";
    if (totalDays < 90) {
      shortAge = `${Math.floor(totalDays / 7)}w ${totalDays % 7}d`;
      readableAge = `${shortAge} • W${activeTargetWeek}`;
    } else if (years < 2) {
      shortAge = `${months} mnd`;
      readableAge = `${shortAge} • W${activeTargetWeek}`;
    } else {
      const remM = Math.max(0, months - years * 12);
      shortAge = `${years} jr${remM > 0 ? ` ${remM} mnd` : ""}`;
      readableAge = shortAge;
    }

    return {
      chronoWeek,
      adjustedWeek,
      activeTargetWeek,
      isPreemie,
      isExpecting: false,
      shortAge,
      readableAge
    };
  }

  function getChildCalculatedAge() {
    const active = getActiveChild() || state.profile;
    return calculateAgeForProfile(active);
  }

  // =========================================================================
  // 3. TIJDLIJN BALK RENDEREN (WEEK / MAAND / FASE / JAAR)
  // =========================================================================
  const YEARS_TIMELINE_LIST = [
    { yr: 1, label: "Jaar 1 (0–1j)", sub: "Melk → Hapjes → Kruipen", emoji: "🍼", week: 24 },
    { yr: 2, label: "Jaar 2 (1–2j)", sub: "Lopen, Woordjes & Tafelpot", emoji: "👟", week: 65 },
    { yr: 3, label: "Jaar 3 (2–3j)", sub: "Zinnen & Peuter-fantasie", emoji: "🎨", week: 120 },
    { yr: 4, label: "Jaar 4 (3–4j)", sub: "Waarom?-fase & Vriendjes", emoji: "🦋", week: 175 },
    { yr: 5, label: "Jaar 5 (4–5j)", sub: "Basisschool Groep 1", emoji: "🎒", week: 230 },
    { yr: 6, label: "Jaar 6 (5–6j)", sub: "Groep 2, Letters & Spelregels", emoji: "🎲", week: 280 },
    { yr: 7, label: "Jaar 7 (6–7j)", sub: "Leren Lezen & Zwemles", emoji: "📚", week: 335 },
    { yr: 8, label: "Jaar 8 (7–8j)", sub: "Rekenen, Sport & Bouwen", emoji: "⚽", week: 390 },
    { yr: 9, label: "Jaar 9 (8–9j)", sub: "Eigen Hobby's & Koken", emoji: "🔭", week: 440 },
    { yr: 10, label: "Jaar 10 (9–10j)", sub: "Zelfstandig & Kritisch", emoji: "🌍", week: 495 },
    { yr: 11, label: "Jaar 11 (10–11j)", sub: "Groeispurt & Botopbouw", emoji: "⚡", week: 545 },
    { yr: 12, label: "Jaar 12 (11–12j)", sub: "Richting Middelbare School", emoji: "🌟", week: 600 }
  ];

  const STAGE_NODE_SUBTITLES = {
    "stage-w1-4": "Pasgeboren & Kraamtijd",
    "stage-m1-2": "Eerste Lach & Geluidjes",
    "stage-m3-4": "Schaterlach, Grijpen & Rollen",
    "stage-m5": "Start Oefenhapjes & Rollen",
    "stage-m6-7": "Start Vaste Maaltijden & Rapley",
    "stage-m8-9": "Pincetgreep, Brood & Kruipen",
    "stage-m10-12": "Langslopen & Eerste Woordjes",
    "stage-m12-15": "Los Lopen & Eigen Lepel",
    "stage-m16-24": "Woordexplosie & 'Zelf Doen!'",
    "stage-y2": "Fantasie, Zinnen & Gevoelens",
    "stage-y3": "'Waarom?'-Fase & Vriendjes",
    "stage-y4-5": "Basisschool, Letters & Spel",
    "stage-y6-7": "Leren Lezen, Rekenen & Tanden",
    "stage-y8-9": "Eigen Passies, Koken & Logica",
    "stage-y10-12": "Groeispurt & Richting Brugklas"
  };

  function formatStageNodeSub(stg) {
    if (!stg) return "";
    if (STAGE_NODE_SUBTITLES[stg.id]) return STAGE_NODE_SUBTITLES[stg.id];
    return stg.title.split("(")[0].replace(/^[^:]+:\s*/, "").trim();
  }

  // Stuksgewijs lineaire koppeling zodat de schuifbalk exact uitlijnt met de 8 mijlpaal-labels
  const SLIDER_ANCHORS = [1, 17, 24, 53, 105, 209, 417, 624];

  function weekToSliderPos(week) {
    const w = clampWeek(week);
    for (let i = 0; i < SLIDER_ANCHORS.length - 1; i++) {
      const a = SLIDER_ANCHORS[i];
      const b = SLIDER_ANCHORS[i + 1];
      if (w >= a && w <= b) {
        const frac = (w - a) / (b - a);
        return Math.round((i + frac) * 100);
      }
    }
    return 700;
  }

  function sliderPosToWeek(pos) {
    const p = Math.max(0, Math.min(700, Number(pos) || 0));
    const seg = Math.min(SLIDER_ANCHORS.length - 2, Math.floor(p / 100));
    const frac = (p - seg * 100) / 100;
    const a = SLIDER_ANCHORS[seg];
    const b = SLIDER_ANCHORS[seg + 1];
    return clampWeek(Math.round(a + frac * (b - a)));
  }

  function buildTimelineItems() {
    const items = [];
    const childAge = getChildCalculatedAge();
    const childWeek = childAge ? childAge.activeTargetWeek : null;

    if (state.zoomMode === "week") {
      const startW = state.epochFilter === "y2" ? 53 : 1;
      const endW = state.epochFilter === "y2" ? 104 : 52;

      for (let w = startW; w <= endW; w++) {
        const sp = DATA.weeklySpecials[w];
        const stg = getStageForWeek(w);
        let badge = "";
        if (sp) {
          badge = sp.type === "leap" ? "⚡" : sp.type === "spurt" ? "📈" : "🥑";
        } else if (w % 52 === 0) {
          badge = "🎂";
        }
        items.push({
          label: `W${w}`,
          sub: sp ? sp.badge.replace(/^[^\s]+\s/, "") : stg.shortLabel,
          badge,
          targetWeek: w,
          isActive: state.currentWeek === w,
          isChildCurrent: childWeek === w
        });
      }
    } else if (state.zoomMode === "month") {
      let startM = 1,
        endM = 12;
      if (state.epochFilter === "y2") {
        startM = 13;
        endM = 24;
      } else if (state.epochFilter === "preschool") {
        startM = 25;
        endM = 36;
      }

      const activeMonth = getMonthForWeek(state.currentWeek);
      const childMonth = childWeek ? getMonthForWeek(childWeek) : null;
      for (let m = startM; m <= endM; m++) {
        const repWeek = getRepresentativeWeekForMonth(m);
        const stg = getStageForWeek(repWeek);
        items.push({
          label: formatMonthNodeLabel(m),
          sub: formatStageNodeSub(stg),
          badge: m === 4 || m === 6 ? "🥑" : m % 12 === 0 ? "🎂" : stg.heroEmoji,
          targetWeek: repWeek,
          isActive: activeMonth === m,
          isChildCurrent: childMonth === m
        });
      }
    } else if (state.zoomMode === "stage") {
      DATA.stages.forEach((stg) => {
        const isAct = state.currentWeek >= stg.minWeek && state.currentWeek <= stg.maxWeek;
        const isChild = childWeek && childWeek >= stg.minWeek && childWeek <= stg.maxWeek;
        items.push({
          label: stg.shortLabel,
          sub: formatStageNodeSub(stg),
          badge: stg.heroEmoji,
          targetWeek: stg.minWeek,
          isActive: isAct,
          isChildCurrent: Boolean(isChild)
        });
      });
    } else if (state.zoomMode === "year") {
      const activeYear = Math.min(12, Math.max(1, Math.ceil(state.currentWeek / 52)));
      YEARS_TIMELINE_LIST.forEach((yObj) => {
        const minW = (yObj.yr - 1) * 52 + 1;
        const maxW = yObj.yr * 52;
        items.push({
          label: yObj.label.split("(")[0].trim(),
          sub: yObj.sub,
          badge: yObj.emoji,
          targetWeek: yObj.week,
          isActive: activeYear === yObj.yr,
          isChildCurrent: Boolean(childWeek && childWeek >= minW && childWeek <= maxW)
        });
      });
    }

    return items;
  }

  function renderTimeline(scrollToActive = true) {
    const ribbon = document.getElementById("timelineRibbon");
    if (!ribbon) return;

    document.querySelectorAll(".zoom-tab").forEach((btn) => {
      const act = btn.dataset.zoom === state.zoomMode;
      btn.classList.toggle("active", act);
      btn.setAttribute("aria-selected", act ? "true" : "false");
    });

    const epochBar = document.getElementById("epochBar");
    epochBar.classList.toggle("hidden", state.zoomMode === "stage" || state.zoomMode === "year");

    const preschoolEpochBtn = document.getElementById("epochPreschoolBtn");
    if (preschoolEpochBtn) {
      preschoolEpochBtn.classList.toggle("hidden", state.zoomMode === "week");
    }

    document.querySelectorAll(".epoch-pill").forEach((p) => {
      p.classList.toggle("active", p.dataset.epoch === state.epochFilter);
    });

    const items = buildTimelineItems();
    ribbon.innerHTML = items
      .map(
        (it) => `
      <button
        type="button"
        role="option"
        aria-selected="${it.isActive}"
        title="${escapeHtml(it.label + " — " + it.sub)}"
        class="t-node ${it.isActive ? "active" : ""} ${it.isChildCurrent ? "is-child-current" : ""}"
        data-target-week="${it.targetWeek}"
      >
        <div class="t-node-top">
          <span>${it.label}</span>
          <span>${it.isChildCurrent ? "📍" : it.badge}</span>
        </div>
        <div class="t-node-sub">${it.sub}</div>
      </button>
    `
      )
      .join("");

    ribbon.querySelectorAll(".t-node").forEach((node) => {
      node.addEventListener("click", () => {
        setWeek(Number(node.dataset.targetWeek), true);
      });
    });

    if (scrollToActive) {
      requestCenterActiveTimelineNode(true);
    }
  }

  function scrollActiveNodeToCenter(smooth = true) {
    const ribbon = document.getElementById("timelineRibbon");
    if (!ribbon) return;
    const activeNode = ribbon.querySelector(".t-node.active");
    if (!activeNode) return;

    const ribbonRect = ribbon.getBoundingClientRect();
    if (!ribbonRect.width) return;
    const activeRect = activeNode.getBoundingClientRect();

    const currentOffset = activeRect.left - ribbonRect.left;
    const desiredOffset = (ribbon.clientWidth / 2) - (activeNode.offsetWidth / 2);
    const delta = currentOffset - desiredOffset;

    if (Math.abs(delta) > 1) {
      const targetScrollLeft = ribbon.scrollLeft + delta;
      ribbon.scrollTo({
        left: Math.max(0, Math.round(targetScrollLeft)),
        behavior: smooth ? "smooth" : "auto"
      });
    }
  }

  function requestCenterActiveTimelineNode(smooth = true) {
    requestAnimationFrame(() => {
      scrollActiveNodeToCenter(smooth);
      setTimeout(() => scrollActiveNodeToCenter(smooth), 60);
      setTimeout(() => scrollActiveNodeToCenter(false), 220);
    });
  }

  // =========================================================================
  // 4. VISUELE SVG SNIJ- & SERVEERGIDS PER FASE
  // =========================================================================
  function getCutVisualData(cutType, stage) {
    switch (cutType) {
      case "milk":
        return {
          badge: "🍼 0–3 maanden • 100% Melk",
          title: "Uitsluitend borst- of flesvoeding",
          desc: "De darmpjes zijn nog volop in ontwikkeling. Vaste voeding of water is tot 4 maanden nog niet nodig; voed op verzoek en geef dagelijks 10 mcg vitamine D.",
          svg: `<svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="44" y="22" width="32" height="48" rx="8" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="2.5"/>
            <path d="M50 22V16C50 13 54 10 60 10C66 10 70 13 70 16V22" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2.5"/>
            <line x1="50" y1="36" x2="62" y2="36" stroke="var(--primary)" stroke-width="2" stroke-linecap="round"/>
            <line x1="50" y1="46" x2="66" y2="46" stroke="var(--primary)" stroke-width="2" stroke-linecap="round"/>
            <line x1="50" y1="56" x2="62" y2="56" stroke="var(--primary)" stroke-width="2" stroke-linecap="round"/>
          </svg>`
        };
      case "puree":
        return {
          badge: "🥄 4–5 maanden • Gladde Oefenhapjes",
          title: "Zijdezachte puree van een plat lepeltje",
          desc: "Meng gestoomde groente of fruit met een beetje borst-, flesmelk of kookvocht tot yoghurtdikte. Geef 1–2 theelepeltjes per dag om het slikken te oefenen.",
          svg: `<svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 46C22 60 38 68 60 68C82 68 98 60 98 46H22Z" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="2.5"/>
            <path d="M30 45C42 36 55 38 65 43C75 38 84 40 90 45" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
            <path d="M68 24L98 14" stroke="var(--primary)" stroke-width="3.5" stroke-linecap="round"/>
            <ellipse cx="62" cy="26" rx="10" ry="5" transform="rotate(-18 62 26)" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
          </svg>`
        };
      case "spear":
        return {
          badge: "🥑 6–7 maanden • Vuistgrote Reepjes (Rapley)",
          title: "Zachte reepjes zo groot als twee vingers (6–7 cm)",
          desc: "Snijd zachte groente, avocado of banaan in lange repen zodat er een stukje boven het gesloten babyvuistje uitsteekt om zelf van af te happen.",
          svg: `<svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="24" y="14" width="18" height="54" rx="9" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="2.5"/>
            <rect x="52" y="14" width="18" height="54" rx="9" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2.5"/>
            <line x1="88" y1="14" x2="88" y2="68" stroke="var(--text-muted)" stroke-width="1.8" stroke-dasharray="3 3"/>
            <text x="93" y="44" fill="var(--text-muted)" font-size="10" font-weight="bold">6cm</text>
          </svg>`
        };
      case "pincer":
        return {
          badge: "🍞 8–12 maanden • Pincetgreep Blokjes",
          title: "Zachte blokjes (1×1 cm) & geplette bessen",
          desc: "Je baby pakt nu met duim en wijsvinger! Snijd zacht voedsel op hapklare blokjes van 1×1 cm en plet ronde vormen zoals blauwe bessen of kikkererwten.",
          svg: `<svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="24" width="18" height="18" rx="4" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="2.2"/>
            <rect x="48" y="24" width="18" height="18" rx="4" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2.2"/>
            <rect x="35" y="46" width="18" height="18" rx="4" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="2.2"/>
            <circle cx="86" cy="40" r="14" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2.2"/>
            <line x1="86" y1="26" x2="86" y2="54" stroke="var(--accent)" stroke-width="2"/>
            <line x1="72" y1="40" x2="100" y2="40" stroke="var(--accent)" stroke-width="2"/>
          </svg>`
        };
      case "quarters":
        return {
          badge: "🍇 1–4 jaar • In de lengte in kwarten",
          title: "Druiven, cherrytomaatjes & worstjes in de lengte in 4en",
          desc: "Ronde, gladde vormen zijn hét verstikkingsgevaar bij dreumesen en peuters. Snijd druiven en snoeptomaatjes altijd in de lengte in vieren en geef noten als 100% pasta.",
          svg: `<svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="36" cy="40" rx="14" ry="18" fill="var(--warn-soft)" stroke="var(--warn)" stroke-width="2"/>
            <line x1="24" y1="26" x2="48" y2="54" stroke="var(--warn)" stroke-width="2.5"/>
            <ellipse cx="82" cy="40" rx="15" ry="19" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="2.2"/>
            <line x1="82" y1="21" x2="82" y2="59" stroke="var(--primary)" stroke-width="2"/>
            <line x1="67" y1="40" x2="97" y2="40" stroke="var(--primary)" stroke-width="2"/>
          </svg>`
        };
      default:
        return {
          badge: `🍽️ ${stage.shortLabel} • Gezinsbord-verdeling`,
          title: "50% groente/fruit • 25% volkoren • 25% eiwit",
          desc: "Vanaf de basisschoolleeftijd werkt een visueel verdeeld bord fantastisch voor stabiele energie, concentratie op school en gezonde groei.",
          svg: `<svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="40" r="28" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="2.5"/>
            <path d="M60 12V68" stroke="var(--primary)" stroke-width="2.2"/>
            <path d="M60 40H88" stroke="var(--accent)" stroke-width="2.2"/>
            <text x="36" y="44" fill="var(--primary)" font-size="9" font-weight="bold">50%</text>
            <text x="64" y="33" fill="var(--accent)" font-size="8" font-weight="bold">25%</text>
            <text x="64" y="53" fill="var(--primary)" font-size="8" font-weight="bold">25%</text>
          </svg>`
        };
    }
  }

  function renderVisualCutGuide(stage) {
    const info = getCutVisualData(stage.cutType, stage);
    document.getElementById("cutGuideSvgContainer").innerHTML = info.svg;
    document.getElementById("cutGuideBadge").textContent = info.badge;
    document.getElementById("cutGuideTitle").textContent = info.title;
    document.getElementById("cutGuideDesc").textContent = info.desc;
  }

  // =========================================================================
  // 5. 5-MINUTEN FASE-RECEPTEN + DIRECTE WHATSAPP DELING (ZONDER TUSSENSCHERM)
  // =========================================================================
  function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent || "");
  }

  /**
   * Deelt een bericht via WhatsApp zonder het storende wa.me / api.whatsapp.com
   * tussenscherm en zonder dat Meta's redirect-server 4-byte UTF-8 emoji's verminkt
   * tot '' (%EF%BF%BD).
   * - Op laptop/desktop ('auto' of 'web'): opent direct web.whatsapp.com/send in een
   *   herbruikbaar tabblad ("whatsapp_web") én kopieert de tekst met emoji's naar het klembord.
   * - Op telefoon of via 'app'-knop: opent direct de native whatsapp://send URI.
   */
  function openWhatsAppShare(rawText, mode = "auto") {
    const cleanText = String(rawText || "").normalize("NFC");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cleanText).catch(() => {});
    }
    const encoded = encodeURIComponent(cleanText);
    if (mode === "app" || (mode === "auto" && isMobileDevice())) {
      window.location.href = `whatsapp://send?text=${encoded}`;
      return "app";
    }
    window.open(`https://web.whatsapp.com/send/?text=${encoded}`, "whatsapp_web", "noopener");
    return "web";
  }

  const MEAL_TYPE_LABELS = {
    ontbijt: "🌅 Ontbijt",
    lunch: "🥪 Lunch",
    "warme-hap": "🍲 Warme hap",
    tussendoor: "🍎 Tussendoor"
  };

  function getAllRecipesCatalog() {
    return DATA.stages.flatMap((s) =>
      ((s.nutrition && s.nutrition.recipes) || s.recipes || []).map((r, rIdx) => ({
        ...r,
        id: `rec-${s.id}-${rIdx}`,
        stageLabel: s.shortLabel,
        heroEmoji: s.heroEmoji,
        minWeek: s.minWeek
      }))
    );
  }

  function buildWeeklyGroceryText(selectedRecipes) {
    if (!selectedRecipes || selectedRecipes.length === 0) return "";
    const allIngs = [];
    const seen = new Set();
    selectedRecipes.forEach((r) => {
      (r.ingredients || []).forEach((ing) => {
        const key = String(ing).trim().toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          allIngs.push(String(ing).trim());
        }
      });
    });

    const lines = [
      `🛒 *Samen Groeien Week-Boodschappenlijst (${selectedRecipes.length} ${selectedRecipes.length === 1 ? "gerecht" : "gerechten"})*`,
      ``,
      `📋 *Alle benodigde ingrediënten:*`,
      ...allIngs.map((i) => `• ${i}`),
      ``,
      `🍳 *Gekozen 5-minuten gerechten:*`,
      ...selectedRecipes.map((r) => `• *${r.title}* (${r.stageLabel}, ${r.prepTime}): ${r.steps}`)
    ];
    return lines.join("\n");
  }

  function renderStageRecipes(stage) {
    const grid = document.getElementById("stageRecipesGrid");
    if (!grid) return;

    const store = getActiveStore();
    const week = state.currentWeek;
    const titleEl = document.getElementById("stageRecipesTitle");
    const subtitleEl = document.getElementById("stageRecipesSubtitle");
    const countBadge = document.getElementById("recipeCountBadge");
    const filterRow = document.getElementById("recipeMealFilterRow");
    const cardEl = document.getElementById("stageRecipesCard");
    const toggleWrap = document.getElementById("recipesToggleWrap");
    const expandBtn = document.getElementById("toggleRecipesExpandBtn");
    const weeklyBarEl = document.getElementById("weeklyGroceryBar");
    const weeklyTitleEl = document.getElementById("weeklyGroceryTitle");
    const weeklySubEl = document.getElementById("weeklyGrocerySub");

    // In fase 0–3 maanden (Week 1–16) drinkt een baby 100% melkvoeding: verberg de lege receptenkaart om mobiele ruimte te besparen
    if (week <= 16) {
      if (cardEl) cardEl.classList.add("hidden");
      grid.innerHTML = "";
      if (toggleWrap) toggleWrap.classList.add("hidden");
      return;
    }
    if (cardEl) cardEl.classList.remove("hidden");

    if (filterRow) {
      filterRow.classList.remove("hidden");
    }

    // Vanaf 4 maanden (Week 17+): toon uitsluitend de recepten die horen bij déze ontwikkelingsfase
    const stageRecipes = ((stage.nutrition && stage.nutrition.recipes) || stage.recipes || []).map((r, rIdx) => ({
      ...r,
      id: `rec-${stage.id}-${rIdx}`,
      stageLabel: stage.shortLabel,
      heroEmoji: stage.heroEmoji
    }));

    // Update Gecombineerde Week-Boodschappenlijst Balk
    const allCatalog = getAllRecipesCatalog();
    const selectedForWeek = allCatalog.filter((r) => Boolean(store.weeklyGroceryRecipes && store.weeklyGroceryRecipes[r.id]));
    if (weeklyBarEl) {
      if (selectedForWeek.length > 0) {
        weeklyBarEl.classList.remove("hidden");
        if (weeklyTitleEl) {
          weeklyTitleEl.textContent = `Week-Boodschappenlijst (${selectedForWeek.length} ${selectedForWeek.length === 1 ? "gerecht" : "gerechten"})`;
        }
        if (weeklySubEl) {
          weeklySubEl.textContent = selectedForWeek.map((r) => r.title).join(" • ");
        }
      } else {
        weeklyBarEl.classList.add("hidden");
      }
    }

    if (titleEl) {
      titleEl.textContent =
        week <= 23
          ? `🥄 5-Minuten Oefenhapjes (${stage.shortLabel})`
          : `🍳 5-Minuten Fase-Recepten (${stage.shortLabel})`;
    }
    if (subtitleEl) {
      subtitleEl.textContent =
        week <= 23
          ? "Alleen gladde eerste oefenhapjes die veilig zijn voor 4–5 maanden, met 1 tik op WhatsApp of je weeklijst te zetten."
          : `Alleen gerechten die veilig en geschikt zijn voor ${stage.shortLabel} — zet losse recepten of een gecombineerde weeklijst met 1 tik op WhatsApp.`;
    }

    const favStageRecipes = stageRecipes.filter((r) => Boolean(store.favoriteRecipes[r.id]));

    let filtered = stageRecipes;
    if (state.recipeMealFilter === "fav") {
      filtered = favStageRecipes;
    } else if (state.recipeMealFilter !== "all") {
      filtered = stageRecipes.filter((r) => (r.mealType || "tussendoor") === state.recipeMealFilter);
    }

    // Update aantallen op de filter-chips (uitsluitend voor de huidige fase)
    if (filterRow) {
      const mealCounts = {
        all: stageRecipes.length,
        fav: favStageRecipes.length,
        ontbijt: stageRecipes.filter((r) => r.mealType === "ontbijt").length,
        lunch: stageRecipes.filter((r) => r.mealType === "lunch").length,
        "warme-hap": stageRecipes.filter((r) => r.mealType === "warme-hap").length,
        tussendoor: stageRecipes.filter((r) => (r.mealType || "tussendoor") === "tussendoor").length
      };
      const baseNames = {
        all: "🍽️ Alle momenten",
        fav: "⭐ Bewaard",
        ontbijt: "🌅 Ontbijt",
        lunch: "🥪 Lunch",
        "warme-hap": "🍲 Warme hap",
        tussendoor: "🍎 Tussendoor"
      };
      filterRow.querySelectorAll("[data-meal-filter]").forEach((chip) => {
        const key = chip.dataset.mealFilter;
        const cnt = mealCounts[key] || 0;
        chip.classList.toggle("active", key === state.recipeMealFilter);
        chip.classList.toggle("chip-zero", key !== "all" && key !== "fav" && cnt === 0);
        chip.textContent = `${baseNames[key] || key} (${cnt})`;
      });
    }

    if (filtered.length === 0) {
      const emptyMsg =
        state.recipeMealFilter === "fav"
          ? `Nog geen favoriete recepten bewaard voor ${stage.shortLabel}. Tik rechtsboven bij een recept op '☆ Bewaren' om je favorieten voor deze fase hier terug te vinden.`
          : `Geen recepten voor dit eetmoment in fase ${stage.shortLabel}.`;
      grid.innerHTML = `<p class="subtle-hint">${emptyMsg}</p>`;
      if (countBadge) countBadge.textContent = "0";
      if (toggleWrap) toggleWrap.classList.add("hidden");
      return;
    }

    // Progressive disclosure op mobiele schermen (<= 720px): toon standaard de eerste 2 gerechten
    const isMobile = window.innerWidth <= 720;
    const canExpand = isMobile && filtered.length > 2;

    let visibleRecipes = filtered;
    if (canExpand && !state.recipesExpanded) {
      visibleRecipes = filtered.slice(0, 2);
    }

    if (countBadge) {
      countBadge.textContent =
        canExpand && !state.recipesExpanded
          ? `2 van ${filtered.length}`
          : String(filtered.length);
    }

    if (toggleWrap && expandBtn) {
      if (canExpand) {
        toggleWrap.classList.remove("hidden");
        expandBtn.setAttribute("aria-expanded", state.recipesExpanded ? "true" : "false");
        expandBtn.innerHTML = state.recipesExpanded
          ? `▲ Minder gerechten tonen (toon top 2)`
          : `▼ Bekijk alle ${filtered.length} gerechten (${stage.shortLabel})`;
      } else {
        toggleWrap.classList.add("hidden");
      }
    }

    grid.innerHTML = visibleRecipes
      .map((r) => {
        const mealBadge = MEAL_TYPE_LABELS[r.mealType] || "🍴 Eetmoment";
        const isFav = Boolean(store.favoriteRecipes[r.id]);
        const isOnWeekList = Boolean(store.weeklyGroceryRecipes && store.weeklyGroceryRecipes[r.id]);
        return `
      <article class="recipe-box" data-recipe-card-id="${r.id}">
        <div class="item-card-top">
          <h3 class="item-title">${r.title}</h3>
          <button type="button" class="log-btn ${isFav ? "is-logged" : ""}" data-fav-recipe="${r.id}">
            ${isFav ? "⭐ Bewaard" : "☆ Bewaren"}
          </button>
        </div>
        <div class="item-card-badges">
          <span class="pill-small">${r.heroEmoji} ${r.stageLabel}</span>
          <span class="pill-small">${mealBadge}</span>
          <span class="pill-small pill-ok">⏱️ ${r.prepTime}</span>
        </div>
        <div class="recipe-ings">
          ${r.ingredients.map((ing) => `<span class="ing-tag">🛒 ${ing}</span>`).join("")}
        </div>
        <p class="recipe-steps">${r.steps}</p>
        <div class="recipe-actions">
          <button type="button" class="btn-primary btn-small" data-wa-recipe="${r.id}">
            💬 WhatsApp lijstje
          </button>
          <button type="button" class="btn-secondary btn-small recipe-weeklist-btn ${isOnWeekList ? "active" : ""}" data-weeklist-recipe="${r.id}" title="Voeg toe aan je gecombineerde week-boodschappenlijst">
            ${isOnWeekList ? "✓ Op weeklijst" : "➕ Weeklijst"}
          </button>
          <button type="button" class="btn-secondary btn-small" data-copy-recipe="${r.id}">
            📋 Kopieer
          </button>
        </div>
      </article>
    `;
      })
      .join("");

    const formatGroceryText = (r) => {
      const lines = [
        `🛒 *Boodschappenlijstje: ${r.title}* (${r.stageLabel || stage.shortLabel})`,
        ...r.ingredients.map((i) => `• ${i}`),
        ``,
        `🍳 *Bereiding (${r.prepTime}):* ${r.steps}`
      ];
      return lines.join("\n");
    };

    grid.querySelectorAll("[data-wa-recipe]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const rId = btn.dataset.waRecipe;
        const r = stageRecipes.find((x) => x.id === rId) || filtered[Number(rId)];
        if (!r) return;
        const text = formatGroceryText(r);
        openWhatsAppShare(text, "auto");
      });
    });

    grid.querySelectorAll("[data-weeklist-recipe]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const rId = btn.dataset.weeklistRecipe;
        if (!store.weeklyGroceryRecipes) store.weeklyGroceryRecipes = {};
        if (store.weeklyGroceryRecipes[rId]) delete store.weeklyGroceryRecipes[rId];
        else store.weeklyGroceryRecipes[rId] = true;
        saveState();
        renderStageRecipes(stage);
      });
    });

    grid.querySelectorAll("[data-copy-recipe]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const rId = btn.dataset.copyRecipe;
        const r = stageRecipes.find((x) => x.id === rId) || filtered[Number(rId)];
        if (!r) return;
        const text = formatGroceryText(r);
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
        }
        const orig = btn.textContent;
        btn.textContent = "✓ Gekopieerd!";
        setTimeout(() => {
          btn.textContent = orig;
        }, 1800);
      });
    });

    grid.querySelectorAll("[data-fav-recipe]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const rid = btn.dataset.favRecipe;
        if (store.favoriteRecipes[rid]) delete store.favoriteRecipes[rid];
        else store.favoriteRecipes[rid] = true;
        saveState();
        renderStageRecipes(stage);
      });
    });
  }

  function resolveBestFoodLink(bf) {
    if (!bf) return null;
    if (bf.foodId) return bf.foodId;
    const n = (bf.name || "").toLowerCase();
    if (
      n.startsWith("vitamine") ||
      n.includes("borstvoeding") ||
      n.includes("zuigelingenvoeding") ||
      n.includes("kunstvoeding") ||
      n.includes("hongersignalen") ||
      n.includes("boertje") ||
      n.includes("sabbelen")
    ) {
      return null;
    }
    if (n.includes("wortel") || n.includes("pompoen") || n.includes("zoete aardappel")) return "fd-carrot";
    if (n.includes("broccoli") || n.includes("bloemkool")) return "fd-broccoli";
    if (n.includes("avocado")) return "fd-avocado";
    if (n.includes("banaan")) return "fd-banana";
    if (n.includes("pinda") || n.includes("noten") || n.includes("ei ") || n.includes("omelet")) return "fd-peanutbutter";
    if (
      n.includes("rund") ||
      n.includes("kip") ||
      n.includes("zalm") ||
      n.includes("vis") ||
      n.includes("linzen") ||
      n.includes("kikkererwt") ||
      n.includes("hummus") ||
      n.includes("ijzer")
    ) {
      return "fd-meat-fish";
    }
    if (n.includes("brood") || n.includes("volkoren") || n.includes("havermout") || n.includes("wraps")) {
      return "fd-bread-oats";
    }
    if (n.includes("pasta") || n.includes("rijst") || n.includes("couscous")) return "fd-pasta-rice";
    if (n.includes("bessen") || n.includes("aardbei") || n.includes("framboos")) return "fd-blueberry";
    if (n.includes("yoghurt") || n.includes("melk") || n.includes("zuivel") || n.includes("calcium")) return "fd-dairy";
    if (n.includes("komkommer") || n.includes("dip-groente") || n.includes("snackgroente") || n.includes("snoeptomaat")) {
      return "fd-cucumber";
    }
    if (n.includes("appel") || n.includes("peer")) return "fd-apple";
    if (n.includes("mango") || n.includes("kiwi") || n.includes("meloen")) return "fd-mango-kiwi";
    if (n.includes("rozijn")) return "fd-raisins";
    if (n.includes("leverworst") || n.includes("paté")) return "fd-liver-raw";
    if (n.includes("knakworst") || n.includes("popcorn")) return "fd-sausage-popcorn";
    if (n.includes("druiven")) return "fd-grapes";
    return null;
  }

  function renderOnboardingWelcomeCard() {
    const cardEl = document.getElementById("onboardingWelcomeCard");
    if (!cardEl) return;
    const hasChild =
      (Array.isArray(state.children) && state.children.length > 0) ||
      Boolean(state.profile && (state.profile.name || state.profile.dob));
    cardEl.classList.toggle("hidden", hasChild || Boolean(state.onboardingDismissed));
  }

  // =========================================================================
  // 6. HOOFDSCHERM RENDEREN
  // =========================================================================
  function renderAll(scrollToTimeline = false) {
    renderOnboardingWelcomeCard();
    const week = state.currentWeek;
    const stage = getStageForWeek(week);
    const exactAge = formatExactAgeFromWeek(week);
    const spotlight = getDynamicWeekSpotlight(week, stage);
    const store = getActiveStore();

    // Schuifbalk bijwerken (stuksgewijs gekoppeld aan de 8 mijlpaal-labels)
    const slider = document.getElementById("masterWeekSlider");
    if (slider) {
      const targetPos = weekToSliderPos(week);
      if (Number(slider.value) !== targetPos) {
        slider.value = targetPos;
      }
    }
    let closestAnchor = SLIDER_ANCHORS[0];
    let minDiff = Infinity;
    SLIDER_ANCHORS.forEach((a) => {
      const d = Math.abs(week - a);
      if (d < minDiff) {
        minDiff = d;
        closestAnchor = a;
      }
    });
    document.querySelectorAll("[data-jump-week]").forEach((mark) => {
      mark.classList.toggle("active", Number(mark.dataset.jumpWeek) === closestAnchor);
    });

    // Hero kaart (zonder dubbele haakjes-herhaling van de fase-badges erboven)
    document.getElementById("heroEmoji").textContent = stage.heroEmoji;
    document.getElementById("heroPhasePill").textContent = `🌱 Fase ${stage.phaseIndex} van 15 • ${stage.shortLabel}`;
    document.getElementById("heroExactAgePill").textContent =
      state.zoomMode === "stage"
        ? `📅 Week ${stage.minWeek} t/m ${stage.maxWeek} (nu W${week})`
        : `📅 ${exactAge}`;
    document.getElementById("heroTitle").textContent = formatCleanHeroTitle(stage.title);
    document.getElementById("heroSummary").textContent = stage.summary;

    // Spotlight (overzichtelijk ingedeeld in: type-label + enkele titel + uitleg + 2 gelijke focus-vakjes)
    const spotBox = document.getElementById("weeklySpotlightBanner");
    const spotType = spotlight.type || "normal";
    spotBox.setAttribute("data-type", spotType);

    const typeLabels = {
      milestone: `🎉 Mijlpaal • Week ${week}`,
      leap: `⚡ Ontwikkelingsstap • Week ${week}`,
      spurt: `📈 Groeispurt • Week ${week}`,
      normal: `📅 Focus • Week ${week}`
    };
    document.getElementById("spotlightBadge").textContent = typeLabels[spotType] || `📅 Week ${week}`;

    const badgeEmojiMatch = String(spotlight.badge || "").match(/^(\S+)\s+/);
    const leadingEmoji = badgeEmojiMatch && spotType !== "normal" ? `${badgeEmojiMatch[1]} ` : "";
    document.getElementById("spotlightHeadline").textContent = `${leadingEmoji}${spotlight.headline}`;

    const spotSummaryEl = document.getElementById("spotlightSummary");
    spotSummaryEl.textContent = spotlight.summary;

    let spotMetaEl = document.getElementById("spotlightMetaRow");
    if (!spotMetaEl) {
      spotMetaEl = document.createElement("div");
      spotMetaEl.id = "spotlightMetaRow";
      spotMetaEl.className = "spotlight-meta";
      spotSummaryEl.parentNode.appendChild(spotMetaEl);
    }
    const metaCards = [];
    if (spotlight.foodFocus) {
      metaCards.push(`
        <div class="spotlight-meta-card">
          <div class="spotlight-meta-head">
            <span class="spotlight-meta-label">🥣 Voedingsfocus deze week</span>
            <span class="stat-phase-tag">${escapeHtml(stage.shortLabel)}</span>
          </div>
          <p class="spotlight-meta-body">${boldNumbersInEscapedHtml(escapeHtml(spotlight.foodFocus))}</p>
        </div>
      `);
    }
    const matchedSpotlightGame = resolveSpotlightGameForWeek(stage, week, spotlight);
    if (spotlight.highlightGame || matchedSpotlightGame) {
      const displayGameTitle = matchedSpotlightGame ? matchedSpotlightGame.title : spotlight.highlightGame;
      const microPreview = matchedSpotlightGame
        ? `<span class="spotlight-game-sub">⏱️ ${escapeHtml(matchedSpotlightGame.duration)} • ${escapeHtml(matchedSpotlightGame.brainBenefit)}</span>`
        : "";
      metaCards.push(`
        <div class="spotlight-meta-card">
          <div class="spotlight-meta-head">
            <span class="spotlight-meta-label">🎲 Speltip deze week</span>
            <button type="button" class="spotlight-jump-btn" id="spotlightJumpToGamesBtn" data-target-game-id="${matchedSpotlightGame ? matchedSpotlightGame.id : ""}">Bekijk spel →</button>
          </div>
          <p class="spotlight-meta-body"><strong>${escapeHtml(displayGameTitle)}</strong>${microPreview}</p>
        </div>
      `);
    }
    spotMetaEl.innerHTML = metaCards.join("");
    spotMetaEl.classList.toggle("hidden", metaCards.length === 0);

    const jumpGamesBtn = document.getElementById("spotlightJumpToGamesBtn");
    if (jumpGamesBtn) {
      jumpGamesBtn.addEventListener("click", () => {
        const targetGid = jumpGamesBtn.dataset.targetGameId || (matchedSpotlightGame ? matchedSpotlightGame.id : "");
        // Zorg dat eventuele filters het gezochte spel niet verbergen
        state.showAllStagesGames = false;
        state.gameCategoryFilter = "all";
        renderGames(stage);

        // Open het tabblad Spel zonder standaard naar de algemene kop te scrollen; we scrollen direct naar de specifieke spelkaart!
        setView("games", false);

        const dock = document.getElementById("timelineDock");
        if (dock && !dock.classList.contains("is-compact")) {
          dock.classList.add("is-compact");
        }

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const gameCardEl =
              (targetGid && document.querySelector(`[data-game-card-id="${targetGid}"]`)) ||
              document.getElementById("panelGames");
            if (gameCardEl) {
              const offset = getStickyNavOffset(18);
              const rect = gameCardEl.getBoundingClientRect();
              const currentY = window.scrollY || window.pageYOffset || 0;
              const targetY = Math.max(0, Math.round(rect.top + currentY - offset));
              window.scrollTo({ top: targetY, behavior: "smooth" });

              gameCardEl.classList.remove("tab-arrival-highlight");
              void gameCardEl.offsetWidth;
              gameCardEl.classList.add("tab-arrival-highlight");
              setTimeout(() => gameCardEl.classList.remove("tab-arrival-highlight"), 1500);
            }
          });
        });
      });
    }

    // Vooruitblik & Fase-doorstroom kaart onderaan de pagina (opgedeeld in overzichtelijke blokjes)
    const upcomingBadgeEl = document.getElementById("upcomingStageBadge");
    const upcomingTextEl = document.getElementById("upcomingPreviewText");
    const upcomingPrevBtnEl = document.getElementById("upcomingPrevStageBtn");
    const upcomingNextBtnEl = document.getElementById("upcomingNextStageBtn");
    if (upcomingTextEl && upcomingNextBtnEl) {
      const stageIdx = DATA.stages.findIndex((s) => s.id === stage.id);
      const prevStage = stageIdx > 0 ? DATA.stages[stageIdx - 1] : null;
      const nextStage = DATA.stages[stageIdx + 1] || null;
      const specialWeeks = Object.keys(DATA.weeklySpecials)
        .map(Number)
        .sort((a, b) => a - b);
      const nextSpecialWeek = specialWeeks.find((sw) => sw > week && sw - week <= 8);

      if (upcomingBadgeEl) {
        upcomingBadgeEl.textContent = nextStage
          ? `🔭 Wat komt eraan na ${stage.shortLabel}?`
          : `🎓 Eindfase • Fase 15/15`;
      }

      if (upcomingPrevBtnEl) {
        if (prevStage) {
          upcomingPrevBtnEl.classList.remove("hidden");
          upcomingPrevBtnEl.textContent = `← ${prevStage.shortLabel}`;
          upcomingPrevBtnEl.dataset.jumpPrevWeek = String(prevStage.minWeek);
        } else {
          upcomingPrevBtnEl.classList.add("hidden");
        }
      }

      if (nextStage) {
        upcomingNextBtnEl.classList.remove("hidden");
        const cardsHtml = [];

        if (nextSpecialWeek) {
          const diffW = nextSpecialWeek - week;
          const spObj = DATA.weeklySpecials[nextSpecialWeek];
          const isLeapOrSpurt = spObj.type === "leap" || spObj.type === "spurt";
          const spTypeLabel =
            spObj.type === "leap"
              ? "⚡ Eerstvolgende ontwikkelingsstap"
              : spObj.type === "spurt"
                ? "📈 Eerstvolgende groeispurt"
                : "🎉 Eerstvolgende mijlpaal";
          const spFirstSentence = String(spObj.summary || "").split(".")[0];
          cardsHtml.push(`
            <div class="upcoming-item-card ${isLeapOrSpurt ? "is-leap" : ""}">
              <div class="upcoming-item-head">
                <span class="upcoming-item-label">${spTypeLabel}</span>
                <span class="upcoming-item-timing">Over ${diffW} ${diffW === 1 ? "week" : "weken"} • Week ${nextSpecialWeek}</span>
              </div>
              <strong class="upcoming-item-title">${escapeHtml(spObj.badge)}</strong>
              <p class="upcoming-item-desc">${escapeHtml(spFirstSentence)}.</p>
            </div>
          `);
        }

        const nextStageFirstSentence = String(nextStage.summary || "").split(".")[0];
        const nextTimingLabel =
          nextStage.minWeek <= 104
            ? `Vanaf Week ${nextStage.minWeek} (${nextStage.shortLabel})`
            : `Fase ${nextStage.phaseIndex}/15 (${nextStage.shortLabel})`;
        cardsHtml.push(`
          <div class="upcoming-item-card">
            <div class="upcoming-item-head">
              <span class="upcoming-item-label">🌱 Volgende ontwikkelingsfase</span>
              <span class="upcoming-item-timing">${escapeHtml(nextTimingLabel)}</span>
            </div>
            <strong class="upcoming-item-title">${escapeHtml(nextStage.heroEmoji)} ${escapeHtml(formatCleanHeroTitle(nextStage.title))}</strong>
            <p class="upcoming-item-desc">${escapeHtml(nextStageFirstSentence)}.</p>
          </div>
        `);

        upcomingTextEl.innerHTML = `<div class="upcoming-grid">${cardsHtml.join("")}</div>`;
        upcomingNextBtnEl.textContent = `Bekijk ${nextStage.shortLabel} →`;
        upcomingNextBtnEl.dataset.jumpNextWeek = String(nextStage.minWeek);
      } else {
        upcomingNextBtnEl.classList.add("hidden");
        upcomingTextEl.innerHTML = `
          <div class="upcoming-grid">
            <div class="upcoming-item-card">
              <div class="upcoming-item-head">
                <span class="upcoming-item-label">🎓 Richting de middelbare school</span>
                <span class="upcoming-item-timing">12+ jaar</span>
              </div>
              <strong class="upcoming-item-title">Zelfstandig, weerbaar &amp; gezond op weg</strong>
              <p class="upcoming-item-desc">Focus op een stevig ontbijt, voldoende slaap tijdens de groeispurt en samen in gesprek blijven aan tafel.</p>
            </div>
          </div>
        `;
      }
    }

    // Dynamische, leeftijdsbewuste kopjes voor de 3 kerncijfers en kaarten
    const vitalMilkLabelEl = document.getElementById("vitalMilkLabel");
    const vitalSolidLabelEl = document.getElementById("vitalSolidLabel");
    const vitalSleepLabelEl = document.getElementById("vitalSleepLabel");
    const vitalMilkPhaseTagEl = document.getElementById("vitalMilkPhaseTag");
    const vitalSolidPhaseTagEl = document.getElementById("vitalSolidPhaseTag");
    const vitalSleepPhaseTagEl = document.getElementById("vitalSleepPhaseTag");
    const pureeCardTitleEl = document.getElementById("pureeCardTitle");
    const blwCardTitleEl = document.getElementById("blwCardTitle");
    const sleepCardTitleEl = document.getElementById("sleepCardTitle");
    const bestFoodsTitleEl = document.getElementById("bestFoodsCardTitle");

    if (vitalMilkPhaseTagEl) vitalMilkPhaseTagEl.textContent = stage.shortLabel;
    if (vitalSolidPhaseTagEl) vitalSolidPhaseTagEl.textContent = stage.shortLabel;
    if (vitalSleepPhaseTagEl) vitalSleepPhaseTagEl.textContent = stage.shortLabel;

    if (week <= 16) {
      if (vitalMilkLabelEl) vitalMilkLabelEl.textContent = "🍼 Melkvoeding";
      if (vitalSolidLabelEl) vitalSolidLabelEl.textContent = "🥣 Vaste Voeding (vanaf 4m)";
      if (vitalSleepLabelEl) vitalSleepLabelEl.textContent = "🌙 Wakkertijd & Slaap";
      if (pureeCardTitleEl) pureeCardTitleEl.textContent = "🍼 Melkvoeding & Hongersignalen";
      if (blwCardTitleEl) blwCardTitleEl.textContent = "🤲 Voorbereiding op Oefenhapjes (4m+)";
      if (bestFoodsTitleEl) bestFoodsTitleEl.textContent = `🌟 Belangrijkste voedingsbasis (${stage.shortLabel})`;
    } else if (week <= 23) {
      if (vitalMilkLabelEl) vitalMilkLabelEl.textContent = "🍼 Melkvoeding";
      if (vitalSolidLabelEl) vitalSolidLabelEl.textContent = "🥄 Oefenhapjes & Portie";
      if (vitalSleepLabelEl) vitalSleepLabelEl.textContent = "🌙 Wakkertijd & Slaap";
      if (pureeCardTitleEl) pureeCardTitleEl.textContent = "🥄 Eerste Gladde Oefenhapjes";
      if (blwCardTitleEl) blwCardTitleEl.textContent = "✋ Zelf Ontdekken & Mondmotoriek";
      if (bestFoodsTitleEl) bestFoodsTitleEl.textContent = `🌟 Aanraders in fase ${stage.shortLabel}`;
    } else if (week <= 52) {
      if (vitalMilkLabelEl) vitalMilkLabelEl.textContent = "🍼 Melkvoeding";
      if (vitalSolidLabelEl) vitalSolidLabelEl.textContent = "🥣 Hapjes & Portie";
      if (vitalSleepLabelEl) vitalSleepLabelEl.textContent = "🌙 Wakkertijd & Slaap";
      if (pureeCardTitleEl) pureeCardTitleEl.textContent = "🥄 Puree & Praktisch Aanbod";
      if (blwCardTitleEl) blwCardTitleEl.textContent = "🥑 Zelf Eten (Rapley / Stukjes)";
      if (bestFoodsTitleEl) bestFoodsTitleEl.textContent = `🌟 Aanraders in fase ${stage.shortLabel}`;
    } else if (week <= 208) {
      if (vitalMilkLabelEl) vitalMilkLabelEl.textContent = "🥛 Zuivel & Drinken";
      if (vitalSolidLabelEl) vitalSolidLabelEl.textContent = "🍽️ Maaltijden & Portie";
      if (vitalSleepLabelEl) vitalSleepLabelEl.textContent = "🌙 Slaap & Dutjes";
      if (pureeCardTitleEl) pureeCardTitleEl.textContent = "🍽️ Gezinsmaaltijd & Structuur";
      if (blwCardTitleEl) blwCardTitleEl.textContent = "🥄 Zelfstandig Eten & Tafelplezier";
      if (bestFoodsTitleEl) bestFoodsTitleEl.textContent = `🌟 Aanraders in fase ${stage.shortLabel}`;
    } else {
      if (vitalMilkLabelEl) vitalMilkLabelEl.textContent = "💧 Drinken & Zuivel";
      if (vitalSolidLabelEl) vitalSolidLabelEl.textContent = "🥪 Bord & Broodtrommel";
      if (vitalSleepLabelEl) vitalSleepLabelEl.textContent = "🌙 Nachtrust & Schoolritme";
      if (pureeCardTitleEl) pureeCardTitleEl.textContent = "🥪 Gezonde Maaltijden & Broodtrommel";
      if (blwCardTitleEl) blwCardTitleEl.textContent = "👩‍🍳 Zelfstandigheid & Samen Koken";
      if (bestFoodsTitleEl) bestFoodsTitleEl.textContent = `🌟 Aanraders in fase ${stage.shortLabel}`;
    }

    if (sleepCardTitleEl) {
      sleepCardTitleEl.textContent =
        week <= 156 ? "🌙 Slaap & Wakkertijd" : "🌙 Nachtrust & Bedtijd-Calculator";
    }

    // 3 Bovenste Kerncijfer-kaarten (alleen getallen dikgedrukt, zonder highlight)
    const milkKeyLabel = week <= 52 ? "Hoeveelheid:" : "Drinken:";
    const solidKeyLabel = week <= 16 ? "Advies:" : "Portie:";
    const solidFreqLabel = week <= 16 ? "Startmoment:" : "Dagritme:";
    const wakeKeyLabel = week <= 156 ? "Wakkertijd:" : "Overdag:";

    document.getElementById("vitalMilkVolume").innerHTML = `<span class="stat-row-key">${milkKeyLabel}</span> <span class="stat-row-text">${boldNumbersInEscapedHtml(
      escapeHtml(stage.nutrition.milkVolumeMetric)
    )}</span>`;
    document.getElementById("vitalMilkStatus").innerHTML = `<span class="stat-row-key">Dagritme:</span> <span class="stat-row-text">${boldNumbersInEscapedHtml(
      escapeHtml(stage.nutrition.feedsPerDay)
    )}</span>`;

    document.getElementById("vitalSolidPortion").innerHTML = `<span class="stat-row-key">${solidKeyLabel}</span> <span class="stat-row-text">${boldNumbersInEscapedHtml(
      escapeHtml(stage.nutrition.portionGuideMetric)
    )}</span>`;
    document.getElementById("vitalSolidFreq").innerHTML = `<span class="stat-row-key">${solidFreqLabel}</span> <span class="stat-row-text">${boldNumbersInEscapedHtml(
      escapeHtml(stage.nutrition.solidsPerDay)
    )}</span>`;

    document.getElementById("vitalWakeWindow").innerHTML = `<span class="stat-row-key">${wakeKeyLabel}</span> <span class="stat-row-text">${boldNumbersInEscapedHtml(
      escapeHtml(stage.sleep.wakeWindow)
    )}</span>`;
    document.getElementById("vitalSleepTotal").innerHTML = `<span class="stat-row-key">Slaapritme:</span> <span class="stat-row-text">${boldNumbersInEscapedHtml(
      escapeHtml(`${stage.sleep.naps} • ${stage.sleep.totalSleep}`)
    )}</span>`;

    // Tab 1: Voeding, Snij-gids & 5-Minuten Recepten (met fase-pills en kerncijfer-balkjes)
    const pureeStagePillEl = document.getElementById("pureeStagePill");
    const blwStagePillEl = document.getElementById("blwStagePill");
    const sampleMenuStagePillEl = document.getElementById("sampleMenuStagePill");
    const avoidFoodsStagePillEl = document.getElementById("avoidFoodsStagePill");
    const bestFoodsStagePillEl = document.getElementById("bestFoodsStagePill");
    const recipesStagePillEl = document.getElementById("recipesStagePill");

    if (pureeStagePillEl) pureeStagePillEl.textContent = stage.shortLabel;
    if (blwStagePillEl) blwStagePillEl.textContent = stage.shortLabel;
    if (sampleMenuStagePillEl) sampleMenuStagePillEl.textContent = stage.shortLabel;
    if (avoidFoodsStagePillEl) avoidFoodsStagePillEl.textContent = stage.shortLabel;
    if (bestFoodsStagePillEl) bestFoodsStagePillEl.textContent = stage.shortLabel;
    if (recipesStagePillEl) recipesStagePillEl.textContent = stage.shortLabel;

    const foodHeaderStagePillEl = document.getElementById("foodHeaderStagePill");
    const foodHeaderSubtitleEl = document.getElementById("foodHeaderSubtitle");
    if (foodHeaderStagePillEl) foodHeaderStagePillEl.textContent = stage.shortLabel;
    if (foodHeaderSubtitleEl) {
      foodHeaderSubtitleEl.textContent =
        week <= 16
          ? "Uitsluitend melkvoeding op verzoek en dagelijks 10 mcg vitamine D (0–3 maanden)."
          : week <= 23
            ? "Start van de eerste gladde oefenhapjes (4–5 maanden) naast borst- of flesmelk."
            : `Voedingsadviezen, veilige serveervorm, dagritme en gezonde maaltijden (${stage.shortLabel}).`;
    }

    const pureeKeyBarEl = document.getElementById("pureeKeyMetricBar");
    if (pureeKeyBarEl) {
      const drinkIcon = week <= 52 ? "🍼" : week <= 208 ? "🥛" : "💧";
      pureeKeyBarEl.innerHTML = `${drinkIcon} <strong>Richtlijn ${escapeHtml(stage.shortLabel)}:</strong> ${boldNumbersInEscapedHtml(
        escapeHtml(stage.nutrition.milkVolumeMetric)
      )} • ${boldNumbersInEscapedHtml(escapeHtml(stage.nutrition.feedsPerDay))}`;
    }

    const blwKeyBarEl = document.getElementById("blwKeyMetricBar");
    if (blwKeyBarEl) {
      const solidIcon = week > 208 ? "🥪" : "🥣";
      blwKeyBarEl.innerHTML =
        week <= 16
          ? `⏳ <strong>Vaste hapjes (${escapeHtml(stage.shortLabel)}):</strong> Start pas vanaf <strong class="num-bold">4 maanden</strong> (Week 17)`
          : `${solidIcon} <strong>Portie ${escapeHtml(stage.shortLabel)}:</strong> ${boldNumbersInEscapedHtml(
              escapeHtml(stage.nutrition.portionGuideMetric)
            )}`;
    }

    document.getElementById("pureePathText").innerHTML = renderStructuredBulletsOrText(stage.nutrition.pureePath);
    document.getElementById("blwPathText").innerHTML = renderStructuredBulletsOrText(stage.nutrition.blwPath);
    document.getElementById("portionVisualHelper").textContent = `Portierichtlijn (${stage.shortLabel}): ${stage.nutrition.portionGuideMetric}`;

    // Verberg onnodige secties in specifieke fases (UI/UX Best Practice)
    const isMilkOnly = week <= 16;
    const blwCardEl = document.getElementById("blwPathCard");
    const cutGuideCardEl = document.getElementById("visualCutGuideCard");
    const sampleMenuDetailsEl = document.getElementById("sampleMenuDetails");
    const avoidFoodsDetailsEl = document.getElementById("avoidFoodsDetails");

    if (blwCardEl) {
      blwCardEl.classList.toggle("hidden", isMilkOnly);
    }
    if (cutGuideCardEl) {
      cutGuideCardEl.classList.toggle("hidden", isMilkOnly);
    }

    // Detailslijsten: op mobiel standaard compact inklappen om scrollruimte te besparen
    const isMobile = window.innerWidth <= 720;
    if (sampleMenuDetailsEl) {
      sampleMenuDetailsEl.open = !isMobile;
    }
    if (avoidFoodsDetailsEl) {
      // Boven 3 jaar (156 weken) zijn er geen baby-beperkingen meer; houd standaard ingeklapt
      avoidFoodsDetailsEl.open = !isMobile && week <= 156;
    }

    renderVisualCutGuide(stage);
    renderStageRecipes(stage);

    const bestFoodsEl = document.getElementById("bestFoodsList");
    bestFoodsEl.innerHTML = stage.nutrition.bestFoods
      .map((bf) => {
        const linkedFoodId = resolveBestFoodLink(bf);
        if (linkedFoodId) {
          const status = store.triedFoods[linkedFoodId] || "";
          const logged = Boolean(status);
          const btnText =
            status === "loved"
              ? "😍 Lekker"
              : status === "retry"
                ? "🤨 Nog oefenen"
                : logged
                  ? "🙂 Geproefd"
                  : "○ Geproefd";
          return `
          <div class="food-row">
            <div class="food-row-left">
              <span class="food-row-icon" aria-hidden="true">${bf.icon}</span>
              <div>
                <span class="food-row-title">${escapeHtml(bf.name)}</span>
                <span class="food-row-note">${escapeHtml(bf.note)}</span>
              </div>
            </div>
            <div class="food-row-actions">
              <button type="button" class="lookup-jump-btn" data-jump-lookup="${linkedFoodId}" title="${week > 208 ? "Bekijk portie- en trommeladvies in Eet-Check" : "Bekijk snij- en bereidingsadvies in Eet-Check"}">
                🔍 Eet-Check
              </button>
              <button type="button" class="log-btn ${logged ? "is-logged" : ""}" data-linked-food="${linkedFoodId}">
                ${btnText}
              </button>
            </div>
          </div>
        `;
        }

        return `
        <div class="food-row">
          <div class="food-row-left">
            <span class="food-row-icon" aria-hidden="true">${bf.icon}</span>
            <div>
              <span class="food-row-title">${escapeHtml(bf.name)}</span>
              <span class="food-row-note">${escapeHtml(bf.note)}</span>
            </div>
          </div>
          <div class="food-row-actions">
            <span class="pill-small pill-ok">✓ Basis ${escapeHtml(stage.shortLabel)}</span>
          </div>
        </div>
      `;
      })
      .join("");

    bestFoodsEl.querySelectorAll("[data-linked-food]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const fid = btn.dataset.linkedFood;
        if (store.triedFoods[fid]) delete store.triedFoods[fid];
        else store.triedFoods[fid] = "tried";
        saveState();
        renderAll(false);
      });
    });

    bestFoodsEl.querySelectorAll("[data-jump-lookup]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const fid = btn.dataset.jumpLookup;
        const foodObj = DATA.foodDatabase.find((f) => f.id === fid);
        state.foodCategoryFilter = "all";
        state.foodStatusFilter = "all";
        state.searchQuery = foodObj ? foodObj.name.split("(")[0].split("/")[0].trim() : "";
        const searchInput = document.getElementById("globalSearchInput");
        if (searchInput) searchInput.value = state.searchQuery;
        setView("lookup", true);
        renderFoodLookup(state.currentWeek);
      });
    });

    const expandedMenuItems = (stage.nutrition.sampleMenu || [])
      .flatMap((m) => String(m || "").split(/\s*•\s*/))
      .map((s) => s.trim())
      .filter(Boolean);
    document.getElementById("sampleMenuList").innerHTML = expandedMenuItems
      .map((m) => `<li>${formatSampleMenuItemHtml(m)}</li>`)
      .join("");

    document.getElementById("avoidFoodsList").innerHTML = (stage.nutrition.avoidFoods || [])
      .map((a) => formatAvoidFoodItemHtml(a))
      .join("");

    // Feature 1: Persoonlijk Gewicht & Voedingstype Banner + Vitals verrijking
    renderPersonalWeightBanner(stage, week);

    // Feature 2: "Loopt mijn kindje voor?" Rijpheidscheck (Voeding & Slaap)
    renderReadinessChecks(stage, week);

    // Feature 3: "Kook 1x voor het hele gezin" Gezinsmaaltijd-Vertaler
    renderFamilyMealTranslator(stage, week);

    // Tab 2: Spelletjes
    renderGames(stage);

    // Tab 3: Slaap, Tips & Mijlpalen
    renderTipsAndSleep(stage, week, spotlight);

    // Tab 4: Eet-Check & Allergenen
    renderFoodLookup(week);
    renderAllergens(week);

    // Tab 5: SOS Eerste Hulp & Consultatiebureau / RVP / Tandjes
    renderSosAndCb(stage, week);

    // Header Profiel, Multi-kind wisselaar & Tijdlijn
    renderProfileChip();
    renderChildSwitcherBar();
    renderDockQuickBar();
    renderTimeline(scrollToTimeline);
    syncTimelineDockCompactState();
  }

  // =========================================================================
  // 6B. FEATURE 1: GEWICHT & VOEDINGSTYPE OP MAAT (150 ML/KG, VIT D/K, PARACETAMOL)
  // =========================================================================
  function getPersonalWeightAdvice(week, stage, profileObj) {
    const active = profileObj || getActiveChild() || state.profile || {};
    const weightKg = Number(active.weightKg) > 0 ? Number(active.weightKg) : 0;
    const feedingType = active.feedingType || "";
    const childName = active.name || "je kindje";
    const fmtKg = weightKg > 0 ? weightKg.toFixed(weightKg % 1 === 0 ? 0 : 1).replace(".", ",") : "";
    const activeStage = stage || getStageForWeek(week);

    const feedingTypeLabels = {
      breast: "🤱 Borstvoeding",
      formula: "🍼 Kunstvoeding (fles)",
      combo: "🤱🍼 Combinatie (borst + fles)"
    };
    const feedingShortLabels = {
      breast: "Borstvoeding (op verzoek)",
      formula: "Kunstvoeding (fles)",
      combo: "Combinatie (borst + fles)"
    };
    const feedingLabel = feedingTypeLabels[feedingType] || "";
    const feedingShortLabel = feedingShortLabels[feedingType] || "";

    // Haal het exacte aantal voedingen uit de huidige fase zodat er nooit tegenstrijdigheid ontstaat
    let minFeeds = 5;
    let maxFeeds = 6;
    const feedsStr = String(activeStage?.nutrition?.feedsPerDay || "");
    const rangeMatch = feedsStr.match(/(\d+)\s*(?:tot|à|–|-)\s*(\d+)/i);
    if (rangeMatch) {
      minFeeds = Math.max(1, Number(rangeMatch[1]));
      maxFeeds = Math.max(minFeeds, Number(rangeMatch[2]));
    } else if (week <= 4) {
      minFeeds = 7;
      maxFeeds = 8;
    } else if (week <= 12) {
      minFeeds = 6;
      maxFeeds = 7;
    } else if (week <= 23) {
      minFeeds = 5;
      maxFeeds = 6;
    } else {
      minFeeds = 4;
      maxFeeds = 5;
    }

    // 1. Melk & Vocht berekening op lichaamsgewicht (alleen 150 ml/kg in de melkfase 0–5 mnd; vanaf 6 mnd geldt het faseschema)
    let milkTitle = "🍼 Melk & Vocht op gewicht";
    let milkAdviceHtml = "";
    let milkInlineMetricHtml = "";
    let milkOppasShort = "";
    let bigBabyNoteHtml = "";
    let fluidShortHtml = "";

    if (weightKg > 0) {
      if (week <= 23) {
        // 0–5 maanden: NCJ / JGZ richtlijn = 150 ml per kg per 24u (max 1000 ml/dag)
        const rawDailyMl = Math.round((weightKg * 150) / 10) * 10;
        const dailyMl = Math.min(1000, Math.max(300, rawDailyMl));
        const perFeedLow = Math.round(dailyMl / maxFeeds / 5) * 5;
        const perFeedHigh = Math.round(dailyMl / minFeeds / 5) * 5;

        if (feedingType === "breast") {
          milkInlineMetricHtml = `Op verzoek aan de borst (afgekolfd flesje bij <strong class="num-bold">${fmtKg} kg</strong>: <strong class="num-bold">${perFeedLow}–${perFeedHigh} ml</strong> per keer, ~<strong class="num-bold">${dailyMl} ml/dag</strong>)`;
          milkOppasShort = `Op ${fmtKg} kg: borstvoeding op verzoek (afgekolfd flesje: ca. ${perFeedLow}–${perFeedHigh} ml per keer, ~${dailyMl} ml/24u)`;
        } else {
          milkInlineMetricHtml = `<strong class="num-bold">${perFeedLow}–${perFeedHigh} ml</strong> per flesje (~<strong class="num-bold">${dailyMl} ml/dag</strong> op <strong class="num-bold">${fmtKg} kg</strong>, 150 ml/kg)`;
          milkOppasShort = `Op ${fmtKg} kg: ca. ${perFeedLow}–${perFeedHigh} ml per flesje (~${dailyMl} ml/24u bij ${minFeeds}–${maxFeeds} voedingen)`;
        }
        milkAdviceHtml = milkInlineMetricHtml;

        // Vangnet voor flinke baby's die tegen de 1000 ml grens aanlopen vóór 4 maanden
        if (week <= 16 && (rawDailyMl >= 930 || weightKg >= 6.2)) {
          bigBabyNoteHtml = `💡 <strong>Flinke groeier (${fmtKg} kg):</strong> Je baby zit qua gewicht al dicht bij het dagmaximum van <strong>1000 ml kunstvoeding</strong>. Start vóór <strong>4 maanden (17 weken)</strong> nog niet met vaste hapjes (de darmpjes zijn nog niet rijp), maar gebruik een kleiner speentje (maat 0/1) of voed horizontaal (15–20 min per fles).`;
        }
      } else if (week <= 52) {
        // Vanaf 6 maanden bouwt melk af naarmate vaste maaltijden toenemen: gebruik altijd exact de fase-richtlijn zodat er geen tegenstrijdigheid is
        const stageMilk = activeStage?.nutrition?.milkVolumeMetric || "600–800 ml/dag";
        const stageFeeds = activeStage?.nutrition?.feedsPerDay || "";
        milkOppasShort = `${stageMilk} (${stageFeeds})`;
      } else {
        milkTitle = "💧 Vocht & Zuivel op gewicht";
        const totalFluidMl = Math.min(1800, Math.max(900, Math.round((1000 + Math.max(0, weightKg - 10) * 50) / 50) * 50));
        fluidShortHtml = `Vochtbehoefte bij <strong class="num-bold">${fmtKg} kg</strong>: ~<strong class="num-bold">${totalFluidMl} ml/dag</strong> (incl. 300 ml zuivel)`;
        milkAdviceHtml = fluidShortHtml;
        milkOppasShort = `Op ${fmtKg} kg: ca. ${totalFluidMl} ml vocht/dag (incl. 300 ml zuivel)`;
      }
    }

    // 2. Vitamine D & K advies op basis van leeftijd en voedingstype (compact & scanbaar)
    let vitTitle = "☀️ Vitamine D & K op maat";
    let vitAdviceHtml = "";
    let vitShortHtml = "";
    if (week <= 12) {
      if (feedingType === "breast") {
        vitShortHtml = `☀️ <strong class="num-bold">10 mcg</strong> Vit D + <strong class="num-bold">150 mcg</strong> Vit K/dag`;
        vitAdviceHtml = `Geef dagelijks <strong>10 mcg Vitamine D</strong> én <strong>150 mcg Vitamine K</strong> (t/m 3 mnd bij borstvoeding).`;
      } else if (feedingType === "formula") {
        vitShortHtml = `☀️ <strong class="num-bold">10 mcg</strong> Vit D/dag (geen extra Vit K nodig bij ≥500 ml flesvoeding)`;
        vitAdviceHtml = `Geef dagelijks <strong>10 mcg Vitamine D</strong> (extra Vit K is niet nodig bij ≥ 500 ml kunstvoeding/dag).`;
      } else if (feedingType === "combo") {
        vitShortHtml = `☀️ <strong class="num-bold">10 mcg</strong> Vit D (+ <strong class="num-bold">150 mcg</strong> Vit K bij &lt;500 ml flesvoeding/dag)`;
        vitAdviceHtml = `Geef dagelijks <strong>10 mcg Vitamine D</strong> (+ <strong>150 mcg Vitamine K</strong> bij &lt;500 ml kunstvoeding/dag t/m 3 mnd).`;
      } else {
        vitShortHtml = `☀️ <strong class="num-bold">10 mcg</strong> Vit D/dag (+ <strong class="num-bold">150 mcg</strong> Vit K bij borstvoeding t/m 3 mnd)`;
        vitAdviceHtml = `Dagelijks <strong>10 mcg Vitamine D</strong> (+ <strong>150 mcg Vitamine K</strong> t/m 3 mnd bij borstvoeding).`;
      }
    } else if (week <= 208) {
      vitShortHtml = `☀️ <strong class="num-bold">10 mcg</strong> Vitamine D/dag (t/m 4 jaar)`;
      vitAdviceHtml = `Geef dagelijks <strong>10 mcg Vitamine D</strong> (aanbevolen voor alle kinderen t/m 4 jaar).`;
    } else {
      vitShortHtml = `☀️ Vitamine D alleen bij getinte huid of weinig buitenlicht`;
      vitAdviceHtml = `Vanaf 4 jaar: <strong>10 mcg Vitamine D</strong> bij een getinte huid of weinig buitenlicht.`;
    }

    // 3. Kinderparacetamol richtlijn op lichaamsgewicht (NHG / Nederlands Kinderformularium — voor SOS & Oppas-kaartje)
    let pcmTitle = "🌡️ Paracetamol-richtlijn (SOS)";
    let pcmAdviceHtml = "";
    let pcmOppasShort = "";
    if (weightKg > 0) {
      if (week < 12 || weightKg < 5.5) {
        pcmAdviceHtml = `Onder 3 mnd / &lt; 5,5 kg (nu <strong>${fmtKg} kg</strong>): paracetamol <strong>alleen na overleg met de huisarts</strong> (richtlijn vanaf 3 kg op artsadvies: <strong>60 mg zetpil</strong>, max. 2–3× per 24u).`;
        pcmOppasShort = `Baby <3 mnd / ${fmtKg} kg: paracetamol alleen na overleg met huisarts (60 mg zetpil)`;
      } else if (weightKg < 10) {
        pcmAdviceHtml = `Bij <strong>${fmtKg} kg</strong> (5,5–10 kg): <strong>120 mg</strong> zetpil of drank, max. <strong>2–3× per 24 uur</strong> (minimaal 8 uur ertussen).`;
        pcmOppasShort = `Op ${fmtKg} kg: 120 mg zetpil/drank, max 2–3× per 24u (elke 8–12u)`;
      } else if (weightKg < 15) {
        pcmAdviceHtml = `Bij <strong>${fmtKg} kg</strong> (10–15 kg): <strong>240 mg</strong> zetpil, drank of kauwtablet, max. <strong>2–3× per 24 uur</strong> (minimaal 8 uur ertussen).`;
        pcmOppasShort = `Op ${fmtKg} kg: 240 mg zetpil/drank/tablet, max 2–3× per 24u (elke 8–12u)`;
      } else if (weightKg < 22) {
        pcmAdviceHtml = `Bij <strong>${fmtKg} kg</strong> (15–22 kg): <strong>240 mg</strong> tablet, drank of zetpil, max. <strong>3–4× per 24 uur</strong> (minimaal 6 uur ertussen).`;
        pcmOppasShort = `Op ${fmtKg} kg: 240 mg tablet/drank/zetpil, max 3–4× per 24u (elke 6–8u)`;
      } else if (weightKg < 30) {
        pcmAdviceHtml = `Bij <strong>${fmtKg} kg</strong> (22–30 kg): <strong>250–360 mg</strong> smelttablet/tablet, max. <strong>3–4× per 24 uur</strong> (minimaal 6 uur ertussen).`;
        pcmOppasShort = `Op ${fmtKg} kg: 250–360 mg tablet, max 3–4× per 24u (elke 6–8u)`;
      } else {
        pcmAdviceHtml = `Bij <strong>${fmtKg} kg</strong> (30+ kg): <strong>375–500 mg</strong> tablet, max. <strong>3–4× per 24 uur</strong> (minimaal 6 uur ertussen).`;
        pcmOppasShort = `Op ${fmtKg} kg: 375–500 mg tablet, max 3–4× per 24u (elke 6–8u)`;
      }
    }

    return {
      hasCustomization: Boolean(weightKg > 0 || feedingType),
      weightKg,
      fmtKg,
      feedingType,
      feedingLabel,
      feedingShortLabel,
      childName,
      milkTitle,
      milkAdviceHtml,
      milkInlineMetricHtml,
      fluidShortHtml,
      milkOppasShort,
      bigBabyNoteHtml,
      vitTitle,
      vitAdviceHtml,
      vitShortHtml,
      pcmTitle,
      pcmAdviceHtml,
      pcmOppasShort
    };
  }

  function openWeightModalEditor() {
    const profDialog = document.getElementById("profileDialog");
    const active = getActiveChild();
    populateProfileFormForChild(active ? active.id : "");
    if (profDialog) profDialog.showModal();
    const wInput = document.getElementById("childWeightInput");
    if (wInput) wInput.focus();
  }

  function renderPersonalWeightBanner(stage, week) {
    const info = getPersonalWeightAdvice(week, stage);
    const vitalMilkEl = document.getElementById("vitalMilkVolume");
    const vitalMilkPersonalRowEl = document.getElementById("vitalMilkPersonalRow");
    const vitalMilkPersonalBtnEl = document.getElementById("vitalMilkPersonalBtn");
    const bannerEl = document.getElementById("personalWeightBanner");
    const sosPcmBarEl = document.getElementById("sosPersonalPcmBar");

    // 1. Knopje rechtsboven in de Melkvoeding-kaart om direct gewicht/voedingstype in te stellen of te wijzigen
    if (vitalMilkPersonalBtnEl) {
      if (info.weightKg > 0) {
        vitalMilkPersonalBtnEl.innerHTML = `⚖️ ${escapeHtml(info.fmtKg)} kg ✏️`;
        vitalMilkPersonalBtnEl.classList.add("has-weight");
      } else if (info.feedingType) {
        vitalMilkPersonalBtnEl.innerHTML = `⚖️ + Gewicht`;
        vitalMilkPersonalBtnEl.classList.remove("has-weight");
      } else {
        vitalMilkPersonalBtnEl.innerHTML = `⚖️ Op maat`;
        vitalMilkPersonalBtnEl.classList.remove("has-weight");
      }
      vitalMilkPersonalBtnEl.onclick = openWeightModalEditor;
    }

    // 2. In-place verrijking van de Melkvoeding-kaart (GEEN los dubbel tekstblok meer eronder!)
    if (info.weightKg > 0 && info.milkInlineMetricHtml && week <= 23 && vitalMilkEl) {
      vitalMilkEl.innerHTML = `<span class="stat-row-key">Hoeveelheid (${escapeHtml(info.fmtKg)} kg):</span> <span class="stat-row-text">${info.milkInlineMetricHtml}</span>`;
    }

    if (vitalMilkPersonalRowEl) {
      const rowParts = [];
      if (week > 52 && info.fluidShortHtml) {
        rowParts.push(info.fluidShortHtml);
      } else if (info.feedingShortLabel && week <= 52) {
        rowParts.push(escapeHtml(info.feedingShortLabel));
      }
      if (info.vitShortHtml) {
        rowParts.push(info.vitShortHtml);
      }

      if (rowParts.length > 0) {
        const keyLabel = info.hasCustomization
          ? `Op maat (${escapeHtml(info.childName)}${info.fmtKg && week > 23 && week <= 52 ? ` • ${escapeHtml(info.fmtKg)} kg` : ""}):`
          : `Vitamine-advies:`;
        vitalMilkPersonalRowEl.classList.remove("hidden");
        vitalMilkPersonalRowEl.innerHTML = `<span class="stat-row-key">${keyLabel}</span> <span class="stat-row-text">${rowParts.join(" • ")}</span>`;
      } else {
        vitalMilkPersonalRowEl.classList.add("hidden");
        vitalMilkPersonalRowEl.innerHTML = "";
      }
    }

    // 3. Toon #personalWeightBanner ALLEEN als er een medische 'flinke groeier (<4 mnd bij 1000ml grens)' tip is
    if (bannerEl) {
      if (info.bigBabyNoteHtml) {
        bannerEl.classList.remove("hidden");
        bannerEl.innerHTML = `<div class="big-baby-inline-note">${info.bigBabyNoteHtml}</div>`;
      } else {
        bannerEl.classList.add("hidden");
        bannerEl.innerHTML = "";
      }
    }

    // 4. Toon Paracetamol-richtlijn op gewicht uitsluitend op de SOS-tab (waar een ouder hem nodig heeft!)
    if (sosPcmBarEl) {
      sosPcmBarEl.classList.remove("hidden");
      if (info.weightKg > 0 && info.pcmAdviceHtml) {
        sosPcmBarEl.innerHTML = `
          <div class="sos-pcm-bar-inner">
            <span class="sos-pcm-bar-text">🌡️ <strong>Paracetamol op maat voor ${escapeHtml(info.childName)}:</strong> ${info.pcmAdviceHtml}</span>
            <button type="button" class="stat-personal-btn has-weight" data-edit-sos-weight="1">✏️ ${escapeHtml(info.fmtKg)} kg</button>
          </div>
        `;
      } else {
        sosPcmBarEl.innerHTML = `
          <div class="sos-pcm-bar-inner">
            <span class="sos-pcm-bar-text">🌡️ <strong>Paracetamol-dosering op gewicht:</strong> Vul het gewicht van je kind in om hier direct de juiste zetpil-/drankdosering te zien.</span>
            <button type="button" class="stat-personal-btn" data-edit-sos-weight="1">➕ Gewicht invullen</button>
          </div>
        `;
      }
      sosPcmBarEl.querySelectorAll("[data-edit-sos-weight]").forEach((btn) => {
        btn.addEventListener("click", openWeightModalEditor);
      });
    }
  }

  // =========================================================================
  // 6C. FEATURE 2: "LOOPT MIJN KINDJE VOOR?" RIJPHEIDSCHECK (VOEDING & SLAAP)
  // =========================================================================
  function getReadinessConfig(stage, week) {
    // Alleen relevant in de eerste 3 jaar (t/m week 156) waar motorische eet-stappen en dutjes-overgangen snel op elkaar volgen
    if (week > 156) return null;

    const stageIdx = DATA.stages.findIndex((s) => s.id === stage.id);
    const nextStage = stageIdx >= 0 && stageIdx < DATA.stages.length - 1 ? DATA.stages[stageIdx + 1] : null;
    if (!nextStage) return null;

    let foodConfig = null;
    if (week <= 16) {
      foodConfig = {
        keyPrefix: "ready-food-4m",
        title: "🚀 Klaar voor de eerste oefenhapjes (4 maanden)?",
        intro: "Sommige baby's zijn er qua mondmotoriek en interesse al vroeg bij. Vink aan welke signalen je al ziet:",
        safetyNote: "🛡️ Medische ondergrens (JGZ): Start vanwege de darmrijping nooit vóór 4 maanden (Week 17) met vaste hapjes, ook niet bij een flinke of hongerige baby.",
        targetWeek: 17,
        targetLabel: "Fase 4–5 mnd (Eerste Oefenhapjes)",
        signals: [
          "Houdt het hoofdje en de nek stevig rechtop bij ondersteund zitten op schoot.",
          "Kijkt het eten letterlijk uit je mond, smakt mee of opent het mondje als er een lepeltje nadert.",
          "Brengt gericht eigen handjes en speeltjes naar de mond om te onderzoeken."
        ]
      };
    } else if (week <= 23) {
      foodConfig = {
        keyPrefix: "ready-food-6m",
        title: "🚀 Loopt je baby voor op structuur? Check voor 6 maanden (Rapley & Zachte stukjes)",
        intro: "Gaat gladde puree al supervlot en wil je baby zelf grijpen? Check of je kindje al toe is aan het 6-maandenschema:",
        safetyNote: "",
        targetWeek: 24,
        targetLabel: "Fase 6 mnd (Zachte Stukjes & Rapley)",
        signals: [
          "Kan met minimale steun rechtop in de kinderstoel zitten zonder opzij te zakken.",
          "De tongduwreflex is verdwenen: iets dikkere hapjes worden vlot doorgeslikt.",
          "Grijpt zelf met het vuistje naar een zacht stronkje groente en brengt dit gericht naar de mond."
        ]
      };
    } else if (week <= 27) {
      foodConfig = {
        keyPrefix: "ready-food-7m",
        title: "🚀 Klaar voor fijne prak, kauwen & een broodkorstje (7–8 mnd)?",
        intro: "Als de eerste oefenmaaltijden goed gaan, kun je alvast doorstromen naar grovere structuren en brood:",
        safetyNote: "",
        targetWeek: 28,
        targetLabel: "Fase 7–8 mnd (Fijne Prak & Brood)",
        signals: [
          "Maakt duidelijke op-en-neer kauwbewegingen met de kaken (ook zonder tandjes).",
          "Eet al met smaak 1 tot 2 kleine oefenmaaltijden per dag naast de melk.",
          "Sabbelen en knabbelen op een lichtbruin broodkorstje of zachte vinger-reep gaat ontspannen."
        ]
      };
    } else if (week <= 36) {
      foodConfig = {
        keyPrefix: "ready-food-9m",
        title: "🚀 Klaar voor de pincetgreep & hapklare blokjes (9–11 mnd)?",
        intro: "Veel baby's ontwikkelen rond 8 maanden al een vlotte fijne motoriek. Check of je baby klaar is voor blokjes:",
        safetyNote: "",
        targetWeek: 37,
        targetLabel: "Fase 9–11 mnd (Pincetgreep & Blokjes)",
        signals: [
          "Pakt kleine stukjes eten (zoals een erwtje of broodblokje) op tussen duim en wijsvinger.",
          "Kauwt grovere stukjes aardappel, groente en brood goed weg zonder snel te kokhalzen.",
          "Neemt al zelfstandig oefenslokjes water of lauwe thee uit een open beker of rietjesbeker."
        ]
      };
    } else if (week <= 48) {
      foodConfig = {
        keyPrefix: "ready-food-12m",
        title: "🚀 Klaar om met de pot mee te eten (12 maanden-schema)?",
        intro: "Eet je kindje al drie maaltijden mee en drinkt het steeds minder melk? Check de overstap naar het 1-jaarsritme:",
        safetyNote: "",
        targetWeek: 49,
        targetLabel: "Fase 12 mnd (Met de Pot Mee)",
        signals: [
          "Eet 3 hoofdmaaltijden (ontbijt, lunch, warm eten) en 2 gezonde tussendoortjes.",
          "Wil zelf een lepeltje vasthouden en eet zachte gezinsgerechten (zonder toegevoegd zout) vlot mee.",
          "Drinkt vlot water of lauwe thee uit een gewone beker bij de maaltijd."
        ]
      };
    } else {
      foodConfig = {
        keyPrefix: `ready-food-${stage.id}`,
        title: `🚀 Loopt je kind voor? Check richting ${nextStage.shortLabel}`,
        intro: `Elke dreumes en peuter ontwikkelt zich in een eigen tempo. Vink aan wat je kind al laat zien:`,
        safetyNote: "",
        targetWeek: nextStage.minWeek,
        targetLabel: `${nextStage.shortLabel} (${nextStage.title})`,
        signals: [
          "Schept zelfstandig met een kinderlepel of prikt al gericht stukjes aan een kindervorkje.",
          "Drinkt volledig uit een open beker aan tafel zonder tuitfles.",
          "Helpt al trots mee met kleine taakjes (zoals groente wassen of het eigen bordje aangeven)."
        ]
      };
    }

    let sleepConfig = null;
    if (week <= 16) {
      sleepConfig = {
        keyPrefix: "ready-sleep-4m",
        title: "🚀 Klaar voor langere wakkertijd (90–120 min) & 3–4 vaste dutjes?",
        intro: "Begint je baby een duidelijk dag- en nachtritme te krijgen en langer vrolijk wakker te blijven?",
        targetWeek: 17,
        targetLabel: "Slaapritme 4–5 maanden",
        signals: [
          "Het langste aaneengesloten slaapblok ligt inmiddels duidelijk in de nacht.",
          "Je baby blijft tussen twee voedingen/slaapjes met gemak 75 tot 90 minuten vrolijk wakker.",
          "Losse hazenslaapjes overdag bundelen zich tot 3 à 4 herkenbare dutjes."
        ]
      };
    } else if (week <= 23) {
      sleepConfig = {
        keyPrefix: "ready-sleep-6m",
        title: "🚀 Klaar voor de overstap van 4 naar 3 dutjes (6 maanden-ritme)?",
        intro: "Merk je dat het 4e late middagdutje steeds vaker geweigerd wordt?",
        targetWeek: 24,
        targetLabel: "Slaapritme 6 maanden (3 dutjes)",
        signals: [
          "Houdt 2 tot 2,5 uur wakkertijd vol zonder oververmoeid te raken.",
          "Het 4e dutje aan het einde van de middag wordt steeds vaker geweigerd of duurt maar 15 min.",
          "Ochtend- en middagdutje worden steviger (vaak 1 tot 1,5 uur)."
        ]
      };
    } else if (week <= 36) {
      sleepConfig = {
        keyPrefix: "ready-sleep-9m",
        title: "🚀 Klaar voor de overgang van 3 naar 2 dutjes (2-3-4 ritme)?",
        intro: "De overgang van 3 naar 2 dutjes vindt meestal plaats tussen 6,5 en 9 maanden. Check de signalen:",
        targetWeek: 37,
        targetLabel: "Slaapritme 9–11 maanden (2 dutjes)",
        signals: [
          "Je baby kan met gemak 2,5 tot 3,5 uur achter elkaar vrolijk wakker blijven.",
          "Het 3e namiddagdutje (rond 16:00u) wordt geweigerd of duwt bedtijd naar na 20:00 uur.",
          "Dit patroon duurt al minstens 1 tot 2 weken achter elkaar."
        ]
      };
    } else if (week <= 65) {
      sleepConfig = {
        keyPrefix: "ready-sleep-15m",
        title: "🚀 Klaar voor de overgang van 2 naar 1 middagdutje?",
        intro: "Sommige kindjes zijn er al met 12–13 maanden aan toe, anderen pas met 16–18 maanden:",
        targetWeek: 66,
        targetLabel: "Slaapritme 14–18 maanden (1 middagdutje)",
        signals: [
          "Kan 's ochtends 4 tot 4,5 uur vrolijk wakker blijven tot na de lunch.",
          "Kletst en speelt tijdens het ochtenddutje in bed, of weigert het middagdutje als er 's ochtends is geslapen.",
          "Dit patroon duurt al minstens 2 weken (geen tijdelijke 12-maanden slaapregressie)."
        ]
      };
    } else {
      sleepConfig = {
        keyPrefix: "ready-sleep-3y",
        title: "🚀 Klaar om het middagdutje af te bouwen naar een rustmoment?",
        intro: "Wordt het 's avonds een feestje in bed als je peuter 's middags nog slaapt?",
        targetWeek: 157,
        targetLabel: "Slaapritme 3+ jaar (Stiltemoment & Vroege Bedtijd)",
        signals: [
          "Valt 's avonds pas na 20:30 uur in slaap op dagen dat er een middagdutje is gedaan.",
          "Kan de middag goed doorkomen met een rustig boekjes- of luistermoment op de bank.",
          "Wordt zonder middagdutje niet overprikkeld of huilerig tijdens het avondeten."
        ]
      };
    }

    return { foodConfig, sleepConfig };
  }

  function renderSingleReadinessBlock(detailsEl, badgeEl, bodyEl, cfg, store) {
    if (!detailsEl || !badgeEl || !bodyEl) return;
    if (!cfg) {
      detailsEl.classList.add("hidden");
      return;
    }
    detailsEl.classList.remove("hidden");

    const sumTitleEl = detailsEl.querySelector("summary span:first-child");
    if (sumTitleEl) {
      sumTitleEl.textContent = cfg.title;
    }

    const checkedCount = cfg.signals.filter((_, idx) => Boolean(store.checkedReadiness[`${cfg.keyPrefix}-${idx}`])).length;
    const isReady = checkedCount >= 2;
    badgeEl.textContent = isReady ? `✓ ${checkedCount}/3 — Klaar!` : `${checkedCount}/3 signalen`;

    const signalsHtml = cfg.signals
      .map((sig, idx) => {
        const rKey = `${cfg.keyPrefix}-${idx}`;
        const isChecked = Boolean(store.checkedReadiness[rKey]);
        return `
          <label class="readiness-check-item">
            <input type="checkbox" data-readiness-key="${rKey}" ${isChecked ? "checked" : ""} />
            <span>${escapeHtml(sig)}</span>
          </label>
        `;
      })
      .join("");

    bodyEl.innerHTML = `
      <p class="readiness-intro">${escapeHtml(cfg.intro)}</p>
      <div class="readiness-checklist">${signalsHtml}</div>
      ${
        cfg.safetyNote
          ? `<div class="highlight-note" style="margin-bottom:0.4rem;">${escapeHtml(cfg.safetyNote)}</div>`
          : ""
      }
      <div class="readiness-result-box">
        <span class="readiness-result-text">
          ${
            isReady
              ? `🎉 <strong>${checkedCount} van de 3 signalen afgevinkt!</strong> Je kindje laat zien er klaar voor te zijn.`
              : `💡 Vink minimaal <strong>2 van de 3 signalen</strong> aan om direct door te klikken naar het volgende schema.`
          }
        </span>
        <button type="button" class="readiness-jump-btn" data-readiness-jump="${cfg.targetWeek}">
          🚀 Bekijk ${escapeHtml(cfg.targetLabel)} →
        </button>
      </div>
    `;

    bodyEl.querySelectorAll("[data-readiness-key]").forEach((chk) => {
      chk.addEventListener("change", () => {
        const k = chk.dataset.readinessKey;
        if (chk.checked) store.checkedReadiness[k] = true;
        else delete store.checkedReadiness[k];
        saveState();
        renderSingleReadinessBlock(detailsEl, badgeEl, bodyEl, cfg, store);
      });
    });

    bodyEl.querySelectorAll("[data-readiness-jump]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetW = Number(btn.dataset.readinessJump);
        if (targetW) {
          setWeek(targetW, true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });
  }

  function renderReadinessChecks(stage, week) {
    const store = getActiveStore();
    const cfgPair = getReadinessConfig(stage, week);

    renderSingleReadinessBlock(
      document.getElementById("foodReadinessDetails"),
      document.getElementById("foodReadinessBadge"),
      document.getElementById("foodReadinessBody"),
      cfgPair ? cfgPair.foodConfig : null,
      store
    );

    renderSingleReadinessBlock(
      document.getElementById("sleepReadinessDetails"),
      document.getElementById("sleepReadinessBadge"),
      document.getElementById("sleepReadinessBody"),
      cfgPair ? cfgPair.sleepConfig : null,
      store
    );
  }

  // =========================================================================
  // 6D. FEATURE 3: "KOOK 1X VOOR HET HELE GEZIN" GEZINSMAALTIJD-VERTALER
  // =========================================================================
  const FAMILY_MEAL_DISHES = [
    {
      id: "pasta",
      icon: "🍝",
      label: "Pasta & Saus",
      panTrick:
        "Kook de pasta en bak gehakt/kip of linzen met ui, courgette, wortel en gezeefde tomaten (passata) eerst 100% zoutloos met Italiaanse kruiden (oregano/basilicum). Schep de baby-/kinderportie uit de pan vóórdat je zout, kaas of pittige kruiden toevoegt!",
      adapt0to3m:
        "Nog 100% melkvoeding: zet je baby gezellig in de newborn-set of wipstoel bij jullie aan tafel voor de geuren en het samenzijn.",
      adapt4to5m:
        "Schep 2 eetlepels zachtgekookte courgette/wortel en een beetje zoutloze tomatensaus uit de pan en pureer dit met een scheutje kookvocht tot een gladde oefenhap.",
      adapt6to8m:
        "Geef 2 grote ongezouten fusilli of penne om zelf met het vuistje te pakken (Rapley) óf prak wat zachtgekookte pasta met de zoutloze groentesaus en rul gehakt.",
      adapt9to12m:
        "Snijd de zachtgekookte pasta en groente in hapklare stukjes (1×1 cm) voor de pincetgreep, gemengd met de zoutloze saus.",
      adapt1to3y:
        "Eet lekker met de pot mee (matig zout). Peuter-tip: serveer 'gedeconstrueerd' (los hoopje pasta, los groente en een klein dip-bakje saus) voor extra overzicht en autonomie!",
      adapt4to12y:
        "Gewone volkoren gezinsportie. Laat je kind zelf verse basilicum knippen of een lepeltje kaas strooien — en bewaar een handje volkorenpasta voor een snelle pastasalade in de broodtrommel morgen!"
    },
    {
      id: "agv",
      icon: "🥔",
      label: "Aardappel, Groente & Vis/Vlees",
      panTrick:
        "Kook aardappels/zoete aardappel en groente (bijv. broccoli, bloemkool of sperziebonen) in water zonder zout. Bak zalm, witvis of kipfilet in olijfolie of vloeibare margarine zonder zout en kruid pas op het eigen bord.",
      adapt0to3m:
        "Nog 100% melkvoeding. Geniet samen van de rust aan tafel.",
      adapt4to5m:
        "Neem een paar roosjes zachtgekookte bloemkool/broccoli of een stukje aardappel uit de pan en pureer glad met een theelepeltje kookvocht of borst-/flesmelk.",
      adapt6to8m:
        "Geef een groot zachtgekookt roosje broccoli/bloemkool met steel voor het vuistje + een fijne prak van aardappel en zacht geplukte vis/kip met een theelepeltje olijfolie.",
      adapt9to12m:
        "Snijd aardappel, zachte groente en malse vis/kip in hapklare blokjes van 1×1 cm die je baby zelf tussen duim en wijsvinger kan oppakken.",
      adapt1to3y:
        "Maak een smeuïge stamppot of serveer aardappelpartjes, groente en vlees/vis naast elkaar met een eigen kinderlepel en vorkje.",
      adapt4to12y:
        "Gezinsportie volgens de Schijf van Vijf. Laat je kind helpen met aardappels wassen of de tafel dekken!"
    },
    {
      id: "rice",
      icon: "🍚",
      label: "Rijst, Roerbak & Curry",
      panTrick:
        "Kook zilvervlies- of witte rijst zoutloos. Wok de groente (paprika, courgette, paksoi, doperwtjes) en kip/tofu eerst met gember, knoflook en milde kerrie/kokosmelk. Schep de kinderportie uit de pan vóórdat ketjap, sojasaus of sambal erin gaat!",
      adapt0to3m:
        "Nog 100% melkvoeding.",
      adapt4to5m:
        "Pureer wat zachtgestoomde pompoen, wortel of courgette uit de wok met een lepeltje milde kokosmelk of kookvocht tot een gladde hap.",
      adapt6to8m:
        "Meng goed gaargekookte, iets plakkerige rijst met fijngesneden zachte wokgroente en kokosmelk zodat je baby het makkelijk van een lepeltje of met de handjes kan eten.",
      adapt9to12m:
        "Maak kleine plakkerige rijstballetjes met zachte stukjes groente en kip/tofu of ei-reepjes (zonder ketjap/zout) die je baby zelf kan oppakken.",
      adapt1to3y:
        "Milde rijstschotel met groente, kip/ei of kikkererwten. Geef er een lepeltje koele Griekse yoghurt of komkommer-reepjes naast.",
      adapt4to12y:
        "Gezinsportie met zilvervliesrijst en kleurrijke wokgroenten. Zet losse bakjes met komkommer, cashewnootjes (vanaf 4 jr) of lente-ui op tafel om zelf te toppen!"
    },
    {
      id: "soup",
      icon: "🥣",
      label: "Soep & Brood",
      panTrick:
        "Kook de soepgroenten (bijv. pompoen, tomaat, courgette of bloemkool) in water met verse kruiden in plaats van zoute bouillonblokjes. Pureer de soep, schep een kommetje uit voor je baby/peuter en voeg daarna pas bouillonpoeder of zout toe aan de grote pan!",
      adapt0to3m:
        "Nog 100% melkvoeding.",
      adapt4to5m:
        "De gepureerde, zoutloze groentesoep (iets dikker gelaten) is direct een perfecte, supergladde oefenhap van de lepel!",
      adapt6to8m:
        "Doop stukjes lichtbruin brood (zonder harde korst) in de dikke, zoutloze groentesoep of laat je baby sabbelen op een broodkorstje.",
      adapt9to12m:
        "Serveer blokjes brood met een dun laagje roomboter/hummus om in de dikke zoutloze soep te dippen.",
      adapt1to3y:
        "Een dikke groentesoep in een ondiep kommetje met volkoren broodreepjes ('soldaatjes') om zelf te dippen: gegarandeerd eetplezier zonder strijd!",
      adapt4to12y:
        "Kom groentesoep met een volkoren tosti of volkorenbrood met ei/hummus. Ook heerlijk in een kleine thermosbeker mee naar school!"
    },
    {
      id: "oven",
      icon: "🥘",
      label: "Ovenschotel & Traybake",
      panTrick:
        "Snijd zoete aardappel, pompoen, courgette, paprika en kip/zalm voor de bakplaat (traybake). Besprenkel met olijfolie en milde kruiden (rozemarijn/paprikapoeder), maar strooi géén zout op het hoekje van de bakplaat dat voor je kindje is!",
      adapt0to3m:
        "Nog 100% melkvoeding.",
      adapt4to5m:
        "Pureer een geroosterd, zacht binnenkantje van zoete aardappel of pompoen met een scheutje water of olijfolie helemaal glad.",
      adapt6to8m:
        "Zacht geroosterde vinger-reepjes zoete aardappel, pompoen en courgette van de bakplaat zijn ideaal voor de Rapley-methode (even het hardere velletje verwijderen).",
      adapt9to12m:
        "Snijd de zachte geroosterde groenten en zalm/kip in blokjes van 1×1 cm voor de pincetgreep.",
      adapt1to3y:
        "Smeuïge ovenschotel of zachte traybake-groenten met een kloddertje yoghurt-dip op het bord.",
      adapt4to12y:
        "Laat je kind vóór het bakken een eigen vakje op de bakplaat vullen met favoriete groenten en aardappelpartjes!"
    },
    {
      id: "wraps",
      icon: "🌮",
      label: "Wraps & Taco's",
      panTrick:
        "Bak gehakt, kipreepjes of zwarte bonen met paprika, tomaat en maïs eerst met milde komijn en paprikapoeder (zonder zoute taco-kruidenmix uit een pakje). Schep de kinderportie uit en voeg daarna chili/zout toe voor de volwassenen.",
      adapt0to3m:
        "Nog 100% melkvoeding.",
      adapt4to5m:
        "Pureer een paar lepels rijpe avocado of zachtgekookte zoete aardappel/tomaat tot een romig eerste oefenhapje.",
      adapt6to8m:
        "Geef reepjes rijpe avocado, zachtgekookte paprika en fijngeprakte zwarte bonen of rul gehakt (zonder zout).",
      adapt9to12m:
        "Snijd een zachte volkoren wrap met een dun laagje avocado/zuivelspread in kleine vierkantjes + losse zachte groente- en gehaktstukjes (plet maïs en bonen even plat).",
      adapt1to3y:
        "Geef een 'open wrap' of losse vakjes met reepjes volkoren wrap, avocado, tomaat, maïs en mild gehakt/bonen zodat je peuter zelf kan pakken.",
      adapt4to12y:
        "Zet alle schaaltjes midden op tafel zodat je kind zelf een eigen volkoren wrap kan bouwen en oprollen!"
    }
  ];

  function getFamilyDishAdaptationTextForWeek(dish, w) {
    if (w <= 16) return dish.adapt0to3m;
    if (w <= 23) return dish.adapt4to5m;
    if (w <= 36) return dish.adapt6to8m;
    if (w <= 52) return dish.adapt9to12m;
    if (w <= 156) return dish.adapt1to3y;
    return dish.adapt4to12y;
  }

  function renderFamilyMealTranslator(stage, week) {
    const detailsEl = document.getElementById("familyMealTranslatorDetails");
    const catRowEl = document.getElementById("familyMealChipsRow") || document.getElementById("familyMealCategoryRow");
    const bodyEl = document.getElementById("familyMealResultBox") || document.getElementById("familyMealTranslatorBody");
    const badgeEl = document.getElementById("familyMealStagePill") || document.getElementById("familyMealTranslatorBadge");
    if (!detailsEl || !catRowEl || !bodyEl) return;

    if (badgeEl) {
      badgeEl.textContent =
        state.children && state.children.length > 1
          ? `Gezinsmodus (${state.children.length} kinderen)`
          : stage.shortLabel;
    }

    const activeDishId = state.activeFamilyDish || "pasta";
    const activeDish = FAMILY_MEAL_DISHES.find((d) => d.id === activeDishId) || FAMILY_MEAL_DISHES[0];

    catRowEl.innerHTML = FAMILY_MEAL_DISHES.map((d) => {
      const isAct = d.id === activeDish.id;
      return `
        <button type="button" class="chip ${isAct ? "active" : ""}" data-family-dish="${d.id}">
          ${d.icon} ${escapeHtml(d.label)}
        </button>
      `;
    }).join("");

    catRowEl.querySelectorAll("[data-family-dish]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.activeFamilyDish = btn.dataset.familyDish;
        saveState();
        renderFamilyMealTranslator(stage, week);
      });
    });

    const stageAdaptText = getFamilyDishAdaptationTextForWeek(activeDish, week);

    // Multi-kind Gezinsmodus: toon voor élk opgeslagen kind naast elkaar hoe je vanuit dezelfde pan opschept!
    let multiChildHtml = "";
    if (state.children && state.children.length >= 2) {
      const childCards = state.children
        .map((ch) => {
          const calc = calculateAgeForProfile(ch);
          const chWeek = calc ? calc.activeTargetWeek : week;
          const chStage = getStageForWeek(chWeek);
          const chAdapt = getFamilyDishAdaptationTextForWeek(activeDish, chWeek);
          return `
            <div class="family-meal-adapt-card">
              <div class="family-meal-adapt-header">
                <span class="family-meal-child-name">👶 ${escapeHtml(ch.name || "Kind")}</span>
                <span class="pill-small">${escapeHtml(calc ? calc.shortAge : chStage.shortLabel)}</span>
              </div>
              <p class="family-meal-adapt-text">${escapeHtml(chAdapt)}</p>
            </div>
          `;
        })
        .join("");

      multiChildHtml = `
        <div class="family-meal-children-grid">
          ${childCards}
        </div>
      `;
    }

    bodyEl.innerHTML = `
      <div class="family-meal-pan-tip">
        🍳 <strong>De 30-seconden Pan-Splitsing (${escapeHtml(activeDish.label)}):</strong> ${escapeHtml(activeDish.panTrick)}
      </div>
      <div class="family-meal-adapt-card">
        <div class="family-meal-adapt-header">
          <span class="family-meal-child-name">${stage.heroEmoji} Zo serveer je dit in fase ${escapeHtml(stage.shortLabel)} (${escapeHtml(stage.ageRangeLabel)})</span>
          <span class="pill-small pill-ok">1× Koken</span>
        </div>
        <p class="family-meal-adapt-text">${escapeHtml(stageAdaptText)}</p>
      </div>
      ${multiChildHtml}
    `;
  }


  // =========================================================================
  // 7. SPELLETJES RENDEREN (6 PER FASE / 90 TOTAAL, MET BEWAARDE FAVORIETEN)
  // =========================================================================
  function renderGames(stage) {
    const grid = document.getElementById("gamesGrid");
    if (!grid) return;

    const store = getActiveStore();
    const cat = state.gameCategoryFilter;

    const allStagesGames = DATA.stages.flatMap((s) =>
      (s.games || []).map((g) => ({
        ...g,
        stageLabel: s.shortLabel,
        heroEmoji: s.heroEmoji
      }))
    );

    const totalAllStagesGamesCount = allStagesGames.length;

    const matchedSpotlightGame = resolveSpotlightGameForWeek(stage, state.currentWeek);
    const spotlightGameId = matchedSpotlightGame ? matchedSpotlightGame.id : "";

    const rawStageGames = (stage.games || []).map((g) => ({
      ...g,
      stageLabel: stage.shortLabel,
      heroEmoji: stage.heroEmoji,
      isSpotlight: g.id === spotlightGameId
    }));

    // Zet de 'Speltip deze week' altijd op plek #1 binnen de huidige fase zodat hij direct zichtbaar is (ook bij progressive disclosure '2 van 6' op mobiel!)
    const stageGames = [...rawStageGames].sort((a, b) => (b.isSpotlight ? 1 : 0) - (a.isSpotlight ? 1 : 0));

    const gamesHeaderTitleEl = document.getElementById("gamesHeaderTitle");
    const gamesHeaderSubEl = document.getElementById("gamesHeaderSubtitle");
    if (gamesHeaderTitleEl) {
      gamesHeaderTitleEl.textContent = state.showAllStagesGames
        ? "🎲 Alle Leerspelletjes (0–12 jaar)"
        : `🎲 Leerspelletjes (${stage.shortLabel})`;
    }
    if (gamesHeaderSubEl) {
      gamesHeaderSubEl.textContent = state.showAllStagesGames
        ? `Overzicht van alle ${totalAllStagesGamesCount} leerspelletjes van geboorte t/m 12 jaar — filter op categorie of bewaarde favorieten.`
        : `Spelenderwijs ontwikkelen in fase ${stage.shortLabel}, afgestemd op deze leeftijd en jouw energieniveau.`;
    }

    const baseList = state.showAllStagesGames ? allStagesGames : stageGames;
    const favGamesAll = allStagesGames.filter((g) => Boolean(store.favoriteGames[g.id]));

    let filtered = baseList;
    if (cat === "fav") {
      filtered = favGamesAll;
    } else if (cat === "low") {
      filtered = baseList.filter((g) => g.energy === "low");
    } else if (cat !== "all") {
      filtered = baseList.filter((g) => g.category === cat);
    }

    const countBadge = document.getElementById("gameCountBadge");
    if (countBadge) {
      countBadge.textContent = String(filtered.length);
    }

    const toggleAllGamesBtn = document.getElementById("toggleAllStagesGamesBtn");
    if (toggleAllGamesBtn) {
      toggleAllGamesBtn.classList.toggle("active", state.showAllStagesGames);
      toggleAllGamesBtn.textContent = state.showAllStagesGames
        ? `🎯 Alleen ${stage.shortLabel} (${stageGames.length})`
        : `📚 Alle ${totalAllStagesGamesCount} spelletjes`;
    }

    // Update exacte aantallen op de filter-chips zodat 'Alle spelletjes' altijd het totaal toont
    const filterRow = document.getElementById("gameCategoryFilterRow");
    if (filterRow) {
      const catCounts = {
        all: baseList.length,
        fav: favGamesAll.length,
        low: baseList.filter((g) => g.energy === "low").length,
        cognitive: baseList.filter((g) => g.category === "cognitive").length,
        motor: baseList.filter((g) => g.category === "motor").length,
        language: baseList.filter((g) => g.category === "language").length,
        social: baseList.filter((g) => g.category === "social").length
      };
      const baseChipLabels = {
        all: "🎲 Alle spelletjes",
        fav: "⭐ Bewaard",
        low: "☕ Rustig",
        cognitive: "🧠 Brein",
        motor: "🤸 Motoriek",
        language: "🗣️ Taal",
        social: "🤝 Samen"
      };
      filterRow.querySelectorAll("[data-game-cat]").forEach((chip) => {
        const key = chip.dataset.gameCat;
        chip.classList.toggle("active", key === cat);
        chip.textContent = `${baseChipLabels[key] || key} (${catCounts[key] || 0})`;
      });
    }

    const catNames = {
      cognitive: "🧠 Brein",
      motor: "🤸 Motoriek",
      language: "🗣️ Taal",
      social: "🤝 Samen"
    };

    if (filtered.length === 0) {
      const emptyMsg =
        cat === "fav"
          ? "Nog geen favoriete spelletjes bewaard. Tik rechtsboven bij een spelletje op '☆ Bewaren' om het hier én op het Oppas-kaartje terug te zien."
          : "Geen spelletjes gevonden voor dit filter in deze selectie.";
      grid.innerHTML = `<div class="minimal-card"><p class="subtle-hint">${emptyMsg}</p></div>`;
      return;
    }

    const toggleWrap = document.getElementById("gamesToggleWrap");
    const expandBtn = document.getElementById("toggleGamesExpandBtn");

    // Progressive disclosure op mobiele schermen (<= 720px): toon standaard de eerste 2 spelletjes
    const isMobile = window.innerWidth <= 720;
    const canExpand = isMobile && filtered.length > 2;

    let visibleGames = filtered;
    if (canExpand && !state.gamesExpanded) {
      visibleGames = filtered.slice(0, 2);
    }

    if (countBadge) {
      countBadge.textContent =
        canExpand && !state.gamesExpanded
          ? `2 van ${filtered.length}`
          : String(filtered.length);
    }

    if (toggleWrap && expandBtn) {
      if (canExpand) {
        toggleWrap.classList.remove("hidden");
        expandBtn.setAttribute("aria-expanded", state.gamesExpanded ? "true" : "false");
        expandBtn.innerHTML = state.gamesExpanded
          ? `▲ Minder spelletjes tonen (toon top 2)`
          : `▼ Bekijk alle ${filtered.length} leerspelletjes (${stage.shortLabel})`;
      } else {
        toggleWrap.classList.add("hidden");
      }
    }

    grid.innerHTML = visibleGames
      .map((g) => {
        const fav = Boolean(store.favoriteGames[g.id]);
        const isSpot = g.id === spotlightGameId;
        const spotlightBadge = isSpot
          ? `<span class="pill-small pill-spotlight">✨ Speltip deze week</span>`
          : "";
        const energyBadge = g.energy === "low" ? `<span class="pill-small">☕ Rustig</span>` : "";
        return `
        <article class="item-card ${isSpot ? "is-spotlight-game" : ""}" data-game-card-id="${g.id}">
          <div class="item-card-top">
            <h3 class="item-title">${escapeHtml(g.title)}</h3>
            <button type="button" class="log-btn ${fav ? "is-logged" : ""}" data-game-id="${g.id}">
              ${fav ? "⭐ Bewaard" : "☆ Bewaren"}
            </button>
          </div>
          <div class="item-card-badges">
            ${spotlightBadge}
            <span class="pill-small">${g.heroEmoji} ${escapeHtml(g.stageLabel)}</span>
            <span class="pill-small">${catNames[g.category] || g.category}</span>
            <span class="pill-small pill-ok">⏱️ ${escapeHtml(g.duration)}</span>
            ${energyBadge}
          </div>
          <div class="highlight-note">
            <strong>💡 Waarom dit werkt (${escapeHtml(g.stageLabel)}):</strong> ${escapeHtml(g.brainBenefit)}
          </div>
          <p class="item-body-text">${escapeHtml(g.howToPlay)}</p>
          <small class="subtle-hint">🎒 <strong>Nodig:</strong> ${escapeHtml(g.materials)} • ✨ <strong>Tip:</strong> ${escapeHtml(g.funTwist)}</small>
        </article>
      `;
      })
      .join("");

    grid.querySelectorAll("[data-game-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const gid = btn.dataset.gameId;
        if (store.favoriteGames[gid]) delete store.favoriteGames[gid];
        else store.favoriteGames[gid] = true;
        saveState();
        renderGames(stage);
      });
    });
  }

  // =========================================================================
  // 8. SLAAP, MAMA TIPS & MIJLPALEN RENDEREN
  // =========================================================================
  function renderTipsAndSleep(stage, week, spotlight) {
    const store = getActiveStore();
    const tipsHeaderStagePillEl = document.getElementById("tipsHeaderStagePill");
    const tipsHeaderTitleEl = document.getElementById("tipsHeaderTitle");
    const sleepStagePillEl = document.getElementById("sleepStagePill");
    const momTipsStagePillEl = document.getElementById("momTipsStagePill");
    const momTipsCardTitleEl = document.getElementById("momTipsCardTitle");
    const milestonesCardTitleEl = document.getElementById("milestonesCardTitle");

    if (tipsHeaderStagePillEl) tipsHeaderStagePillEl.textContent = stage.shortLabel;
    if (tipsHeaderTitleEl) tipsHeaderTitleEl.textContent = `Slaapritme, Tips & Mijlpalen (${stage.shortLabel})`;
    if (sleepStagePillEl) sleepStagePillEl.textContent = stage.shortLabel;
    if (momTipsStagePillEl) momTipsStagePillEl.textContent = stage.shortLabel;
    if (momTipsCardTitleEl) momTipsCardTitleEl.textContent = `💛 Tips voor mama (${stage.shortLabel})`;
    if (milestonesCardTitleEl) milestonesCardTitleEl.textContent = `🏆 Mijlpalen (${stage.shortLabel})`;

    const tips = [...stage.tipsForMom];
    if (spotlight && spotlight.momTip && !tips.includes(spotlight.momTip)) {
      tips.unshift(spotlight.momTip);
    }
    document.getElementById("momTipsList").innerHTML = tips
      .map((t) => `<li>${formatLeadOnlyHtml(t)}</li>`)
      .join("");

    let reassuranceHtml = "";
    if (week <= 16) {
      reassuranceHtml = `💛 <strong>Geen druk (0–3 mnd):</strong> In de eerste maanden draait alles om hechting, melk op verzoek en rust. Je kunt een jonge baby niet verwennen met knuffels en nabijheid.`;
    } else if (week <= 52) {
      reassuranceHtml = `💛 <strong>Samen ontdekken (4–12 mnd):</strong> Tot 1 jaar blijft melk de hoofdvoeding. Elk hapje en elk spelletje is om vrolijk te oefenen—volg het tempo van je baby.`;
    } else if (week <= 208) {
      reassuranceHtml = `💛 <strong>Verbinding vóór correctie (1–3 jaar):</strong> 'Zelf doen!' en grote emoties horen bij een gezond groeiend dreumes- en peuterbrein. Jouw kalmte helpt je kind om weer te landen.`;
    } else if (week <= 416) {
      reassuranceHtml = `💛 <strong>Veilige thuishaven (4–8 jaar):</strong> Een schooldag vraagt veel energie en concentratie. Even ontladen na school is heel normaal—eerst rust en een knuffel, dan pas praten.`;
    } else {
      reassuranceHtml = `💛 <strong>Meebewegen &amp; loslaten (8–12 jaar):</strong> Je kind groeit toe naar meer zelfstandigheid. Blijf nieuwsgierig luisteren zonder direct op te lossen: jouw vertrouwen geeft vleugels.`;
    }
    document.getElementById("momReassuranceBox").innerHTML = reassuranceHtml;

    const wakeLabel = week <= 156 ? "Wakkertijd per blok:" : "Ritme overdag:";
    const napsLabel = week <= 156 ? "Dutjes overdag:" : "Rust & middag:";
    document.getElementById("sleepMetricsBox").innerHTML = `
      <div class="sleep-line"><span>Slaap per 24 uur (${escapeHtml(stage.shortLabel)}):</span><strong>${escapeHtml(stage.sleep.totalSleep)}</strong></div>
      <div class="sleep-line"><span>${wakeLabel}</span><strong>${escapeHtml(stage.sleep.wakeWindow)}</strong></div>
      <div class="sleep-line"><span>${napsLabel}</span><strong>${escapeHtml(stage.sleep.naps)}</strong></div>
      <div class="highlight-note">
        <strong>💡 Slaaptip (${escapeHtml(stage.shortLabel)}):</strong> ${escapeHtml(stage.sleep.tip)}
      </div>
    `;

    updateNapCalculator();

    const msProgressPill = document.getElementById("milestonesProgressPill");
    const updateMilestonesProgress = () => {
      if (!msProgressPill) return;
      const done = stage.milestones.filter((_, i) => Boolean(store.checkedMilestones[`${stage.id}-ms-${i}`])).length;
      msProgressPill.textContent = `${done} / ${stage.milestones.length} afgevinkt`;
    };
    updateMilestonesProgress();

    const msEl = document.getElementById("milestonesChecklist");
    const todayIso = new Date().toISOString().slice(0, 10);

    const renderMilestonesList = () => {
      if (!msEl) return;
      msEl.innerHTML = stage.milestones
        .map((ms, i) => {
          const key = `${stage.id}-ms-${i}`;
          const checked = Boolean(store.checkedMilestones[key]);
          const mem = (store.milestoneMemories && store.milestoneMemories[key]) || { date: todayIso, note: "", photoDataUrl: "" };
          const hasPhoto = Boolean(mem.photoDataUrl);
          return `
          <div class="check-card check-card-wrap ${checked ? "is-checked" : ""}">
            <label class="check-card-main" style="cursor:pointer;">
              <input type="checkbox" data-ms-key="${key}" ${checked ? "checked" : ""} />
              <span>${escapeHtml(ms)}</span>
            </label>
            ${
              checked
                ? `
              <div class="ms-memory-row">
                <input type="date" class="ms-date-input" data-ms-date="${key}" value="${escapeHtml(mem.date || todayIso)}" aria-label="Datum van mijlpaal" title="Datum waarop deze mijlpaal is bereikt" />
                <input type="text" class="ms-note-input" data-ms-note="${key}" maxlength="100" placeholder="Herinnering (bijv. 'Bij oma op het kleed!')" value="${escapeHtml(mem.note || "")}" aria-label="Persoonlijke herinnering bij mijlpaal" />
                <label class="ms-photo-btn ${hasPhoto ? "has-photo" : ""}" title="${hasPhoto ? "Andere foto kiezen" : "Voeg een foto van dit moment toe om mee te sturen op WhatsApp"}">
                  ${hasPhoto ? "📸 Foto wijzigen" : "📷 + Foto"}
                  <input type="file" accept="image/*" data-ms-photo-input="${key}" hidden />
                </label>
                <button type="button" class="ms-share-btn ${hasPhoto ? "has-photo" : ""}" data-ms-share="${key}" data-ms-title="${escapeHtml(ms)}" title="${hasPhoto ? "Deel als Mijlpaal-Fotokaart met tekst via WhatsApp" : "Deel dit mijlpaalkaartje via WhatsApp"}">${hasPhoto ? "📸 Deel met foto" : "💬 Deel"}</button>
              </div>
              ${
                hasPhoto
                  ? `
                <div class="ms-photo-preview-bar">
                  <img src="${mem.photoDataUrl}" alt="Mijlpaalfoto" class="ms-photo-thumb" />
                  <div class="ms-photo-preview-info">
                    <strong>📸 Foto toegevoegd aan deze mijlpaal</strong>
                    <span>Bij klikken op <em>'Deel met foto'</em> maakt de app automatisch een mooie Mijlpaal-Fotokaart voor de familie-WhatsApp!</span>
                  </div>
                  <button type="button" class="ms-photo-del-btn" data-ms-photo-del="${key}" title="Foto verwijderen" aria-label="Foto verwijderen">✕</button>
                </div>
              `
                  : ""
              }
            `
                : ""
            }
          </div>
        `;
        })
        .join("");

      msEl.querySelectorAll("[data-ms-key]").forEach((chk) => {
        chk.addEventListener("change", () => {
          const k = chk.dataset.msKey;
          if (!store.milestoneMemories) store.milestoneMemories = {};
          if (chk.checked) {
            store.checkedMilestones[k] = true;
            if (!store.milestoneMemories[k]) {
              store.milestoneMemories[k] = { date: todayIso, note: "", photoDataUrl: "" };
            }
          } else {
            delete store.checkedMilestones[k];
          }
          saveState();
          updateMilestonesProgress();
          renderMilestonesList();
        });
      });

      msEl.querySelectorAll("[data-ms-date]").forEach((dateIn) => {
        dateIn.addEventListener("change", () => {
          const k = dateIn.dataset.msDate;
          if (!store.milestoneMemories) store.milestoneMemories = {};
          if (!store.milestoneMemories[k]) store.milestoneMemories[k] = { date: todayIso, note: "", photoDataUrl: "" };
          store.milestoneMemories[k].date = dateIn.value;
          saveState();
        });
      });

      msEl.querySelectorAll("[data-ms-note]").forEach((noteIn) => {
        noteIn.addEventListener("input", () => {
          const k = noteIn.dataset.msNote;
          if (!store.milestoneMemories) store.milestoneMemories = {};
          if (!store.milestoneMemories[k]) store.milestoneMemories[k] = { date: todayIso, note: "", photoDataUrl: "" };
          store.milestoneMemories[k].note = noteIn.value;
          saveState();
        });
      });

      msEl.querySelectorAll("[data-ms-photo-input]").forEach((fileIn) => {
        fileIn.addEventListener("change", async (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          const k = fileIn.dataset.msPhotoInput;
          try {
            const compressedDataUrl = await compressMilestonePhoto(file);
            if (!store.milestoneMemories) store.milestoneMemories = {};
            if (!store.milestoneMemories[k]) {
              store.milestoneMemories[k] = { date: todayIso, note: "", photoDataUrl: "" };
            }
            store.milestoneMemories[k].photoDataUrl = compressedDataUrl;
            saveState();
            renderMilestonesList();
          } catch (_) {}
        });
      });

      msEl.querySelectorAll("[data-ms-photo-del]").forEach((delBtn) => {
        delBtn.addEventListener("click", () => {
          const k = delBtn.dataset.msPhotoDel;
          if (store.milestoneMemories && store.milestoneMemories[k]) {
            store.milestoneMemories[k].photoDataUrl = "";
            saveState();
            renderMilestonesList();
          }
        });
      });

      msEl.querySelectorAll("[data-ms-share]").forEach((shareBtn) => {
        shareBtn.addEventListener("click", async () => {
          const k = shareBtn.dataset.msShare;
          const msText = shareBtn.dataset.msTitle || "Nieuwe mijlpaal!";
          const mem = (store.milestoneMemories && store.milestoneMemories[k]) || { date: todayIso, note: "", photoDataUrl: "" };
          const activeChild = getActiveChild();
          const childName = activeChild ? activeChild.name : state.profile.name || "Ons kindje";
          const rawDate = mem.date || todayIso;
          const [yy, mm, dd] = rawDate.split("-");
          const nlDate = dd && mm && yy ? `${dd}-${mm}-${yy}` : rawDate;

          const cardLines = [
            `🏆 *Mijlpaal van ${childName}!* ✨`,
            `📅 *Datum:* ${nlDate} (${stage.shortLabel})`,
            ``,
            `🌟 *${msText}*`,
            mem.note && mem.note.trim() ? `💛 _"${mem.note.trim()}"_` : null,
            ``,
            `_Vastgelegd in Samen Groeien_ 🌱`
          ].filter(Boolean);
          const shareText = cardLines.join("\n");

          if (mem.photoDataUrl) {
            const origLabel = shareBtn.textContent;
            shareBtn.textContent = "⏳ Kaart maken...";
            shareBtn.disabled = true;
            try {
              const cardBlob = await generateMilestonePolaroidCardBlob({
                childName,
                stageLabel: stage.shortLabel,
                nlDate,
                msText,
                note: mem.note ? mem.note.trim() : "",
                photoDataUrl: mem.photoDataUrl
              });
              const safeName = String(childName || "kind")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "") || "mijlpaal";
              const fileObj = new File([cardBlob], `mijlpaal-${safeName}-${rawDate}.png`, { type: "image/png" });

              // 1. Mobiel & moderne browsers (Web Share API Level 2 met fotobestand + tekst direct naar WhatsApp!)
              if (navigator.canShare && navigator.canShare({ files: [fileObj] })) {
                await navigator.share({
                  files: [fileObj],
                  title: `🏆 Mijlpaal van ${childName}`,
                  text: shareText
                });
                shareBtn.textContent = "✓ Foto & tekst gedeeld!";
              } else {
                // 2. Desktop / WhatsApp Web fallback: kopieer de Mijlpaal-Fotokaart naar het klembord + download + open WhatsApp Web
                if (navigator.clipboard && window.ClipboardItem) {
                  try {
                    await navigator.clipboard.write([new ClipboardItem({ "image/png": cardBlob })]);
                  } catch (_) {}
                }
                const dlUrl = URL.createObjectURL(cardBlob);
                const a = document.createElement("a");
                a.href = dlUrl;
                a.download = `mijlpaal-${safeName}-${rawDate}.png`;
                a.click();
                setTimeout(() => URL.revokeObjectURL(dlUrl), 4000);

                openWhatsAppShare(shareText, "auto");
                shareBtn.textContent = "✓ Fotokaart gekopieerd (Ctrl+V)!";
              }
            } catch (err) {
              // Als de gebruiker het deelvenster annuleert, doe niets; bij een andere fout val terug op tekst delen
              if (!err || err.name !== "AbortError") {
                openWhatsAppShare(shareText, "auto");
              }
              shareBtn.textContent = origLabel;
            } finally {
              shareBtn.disabled = false;
              setTimeout(() => {
                shareBtn.textContent = origLabel;
              }, 2400);
            }
            return;
          }

          openWhatsAppShare(shareText, "auto");
          const origLabel = shareBtn.textContent;
          shareBtn.textContent = "✓ Gedeeld!";
          setTimeout(() => {
            shareBtn.textContent = origLabel;
          }, 1800);
        });
      });
    };

    renderMilestonesList();
    renderTeethTracker(stage, week);
  }

  // =========================================================================
  // 8B. MIJLPAAL-FOTO COMPRESSIE & POLAROID FOTOKAART GENERATOR (CANVAS)
  // =========================================================================
  function compressMilestonePhoto(file, maxDim = 900, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("File read error"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Image load error"));
        img.onload = () => {
          let w = img.naturalWidth || img.width || 600;
          let h = img.naturalHeight || img.height || 600;
          if (w > maxDim || h > maxDim) {
            if (w >= h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function wrapCanvasTextLines(ctx, text, maxWidth) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    const lines = [];
    let currentLine = "";
    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  function drawRoundedRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function generateMilestonePolaroidCardBlob({ childName, stageLabel, nlDate, msText, note, photoDataUrl }) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Photo load failed"));
      img.onload = () => {
        const W = 1080;
        const H = 1350;
        const canvas = document.createElement("canvas");
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext("2d");

        // 1. Warme crème achtergrond met subtiele gradiënt
        const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, "#fdfbf7");
        bgGrad.addColorStop(1, "#f3efe6");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // 2. Witte Polaroid-kaart in het midden met zachte schaduw
        const cardX = 56;
        const cardY = 56;
        const cardW = W - 112;
        const cardH = H - 112;

        ctx.save();
        ctx.shadowColor = "rgba(24, 52, 46, 0.14)";
        ctx.shadowBlur = 36;
        ctx.shadowOffsetY = 14;
        drawRoundedRectPath(ctx, cardX, cardY, cardW, cardH, 36);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();

        drawRoundedRectPath(ctx, cardX, cardY, cardW, cardH, 36);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(43, 122, 105, 0.22)";
        ctx.stroke();

        // 3. Bovenste badge & titel
        ctx.textAlign = "center";
        ctx.font = "700 26px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#2b7a69";
        ctx.fillText(`🌱 SAMEN GROEIEN • ${String(stageLabel || "").toUpperCase()}`, W / 2, 132);

        ctx.font = "800 46px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#18342e";
        ctx.fillText(`🏆 Mijlpaal van ${childName}!`, W / 2, 198);

        ctx.font = "600 28px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#5b706b";
        ctx.fillText(`📅 ${nlDate}`, W / 2, 244);

        // 4. Foto-venster (center-crop object-fit: cover met afgeronde hoeken)
        const photoX = 104;
        const photoY = 278;
        const photoW = W - 208;
        const photoH = 680;

        ctx.save();
        drawRoundedRectPath(ctx, photoX, photoY, photoW, photoH, 24);
        ctx.clip();

        const imgRatio = img.width / img.height;
        const boxRatio = photoW / photoH;
        let sx = 0;
        let sy = 0;
        let sw = img.width;
        let sh = img.height;
        if (imgRatio > boxRatio) {
          sw = img.height * boxRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / boxRatio;
          sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
        ctx.restore();

        drawRoundedRectPath(ctx, photoX, photoY, photoW, photoH, 24);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(24, 52, 46, 0.1)";
        ctx.stroke();

        // 5. Mijlpaal-tekst onder de foto
        ctx.textAlign = "center";
        ctx.font = "800 36px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#18342e";
        const msLines = wrapCanvasTextLines(ctx, `🌟 ${msText}`, photoW - 30).slice(0, 3);
        let curY = 1025;
        msLines.forEach((line) => {
          ctx.fillText(line, W / 2, curY);
          curY += 46;
        });

        // 6. Persoonlijke herinnering van mama (indien ingevuld)
        if (note) {
          curY += 12;
          ctx.font = "italic 600 30px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = "#b45309";
          const noteLines = wrapCanvasTextLines(ctx, `💛 "${note}"`, photoW - 50).slice(0, 2);
          noteLines.forEach((nLine) => {
            ctx.fillText(nLine, W / 2, curY);
            curY += 40;
          });
        }

        // 7. Subtiele voettekst onderaan de Polaroid
        ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#7a8e89";
        ctx.fillText("Liefdevol vastgelegd in Samen Groeien", W / 2, H - 88);

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob failed"));
        }, "image/png");
      };
      img.src = photoDataUrl;
    });
  }

  function getNapWindowString(week) {
    const timeVal = document.getElementById("lastWakeTimeInput").value || "07:00";
    const [hh, mm] = timeVal.split(":").map(Number);
    if (isNaN(hh) || isNaN(mm)) return "";

    const baseMins = hh * 60 + mm;
    const fmt = (mTotal) => {
      const norm = ((mTotal % 1440) + 1440) % 1440;
      return `${String(Math.floor(norm / 60)).padStart(2, "0")}:${String(norm % 60).padStart(2, "0")}`;
    };

    // Vanaf 3 jaar (Week 157+): School- & Kleuter Bedtijd-Calculator op basis van opsta-tijd en benodigde nachtrust
    if (week > 156) {
      let sleepMaxMins = 720;
      let sleepMinMins = 690;
      if (week <= 208) {
        // 3–4 jaar: 11,5 tot 12 uur nachtrust (bij 07:00 opstaan -> 19:00 – 19:30)
        sleepMaxMins = 720;
        sleepMinMins = 690;
      } else if (week <= 312) {
        // 4–5 jaar (Groep 1–2): 11 tot 11,5 uur nachtrust (bij 07:00 opstaan -> 19:30 – 20:00)
        sleepMaxMins = 690;
        sleepMinMins = 660;
      } else if (week <= 416) {
        // 6–7 jaar (Groep 3–4): 10,5 tot 11 uur nachtrust (bij 07:00 opstaan -> 20:00 – 20:30)
        sleepMaxMins = 660;
        sleepMinMins = 630;
      } else if (week <= 520) {
        // 8–9 jaar (Groep 5–6): 10 tot 10,5 uur nachtrust (bij 07:00 opstaan -> 20:30 – 21:00)
        sleepMaxMins = 630;
        sleepMinMins = 600;
      } else {
        // 10–12 jaar (Groep 7–8): 9,25 tot 10 uur nachtrust (bij 07:00 opstaan -> 21:00 – 21:45)
        sleepMaxMins = 600;
        sleepMinMins = 555;
      }
      return `Ideale bedtijd (bij opstaan om ${timeVal}): ${fmt(baseMins - sleepMaxMins)} – ${fmt(baseMins - sleepMinMins)}`;
    }

    let minW = 45,
      maxW = 60;
    if (week <= 4) {
      minW = 45;
      maxW = 60;
    } else if (week <= 8) {
      minW = 60;
      maxW = 90;
    } else if (week <= 16) {
      minW = 75;
      maxW = 110;
    } else if (week <= 23) {
      minW = 90;
      maxW = 135;
    } else if (week <= 30) {
      minW = 120;
      maxW = 150;
    } else if (week <= 39) {
      minW = 150;
      maxW = 210;
    } else if (week <= 52) {
      minW = 180;
      maxW = 240;
    } else if (week <= 65) {
      minW = 210;
      maxW = 270;
    } else if (week <= 104) {
      minW = 300;
      maxW = 330;
    } else {
      minW = 330;
      maxW = 390;
    }

    return `Volgend dutje (na wakker om ${timeVal}): ${fmt(baseMins + minW)} – ${fmt(baseMins + maxW)}`;
  }

  function updateNapCalculator() {
    const calcLabelEl = document.getElementById("napCalcLabel");
    if (calcLabelEl) {
      calcLabelEl.textContent =
        state.currentWeek > 156
          ? "⏰ Hoe laat staat je kind 's ochtends op?"
          : "⏰ Hoe laat werd je kind wakker?";
    }
    const str = getNapWindowString(state.currentWeek);
    if (!str) return;
    const parts = str.split(": ");
    document.getElementById("napCalcResult").innerHTML = `${parts[0]}: <strong>${parts[1]}</strong>`;
  }

  // =========================================================================
  // 9. EET-CHECK & ALLERGENEN RENDEREN
  // =========================================================================
  function getPrepForWeek(food, week) {
    // Fase 1–3 (Week 1–16 • 0–3 maanden): Uitsluitend borst- of kunstvoeding
    if (week <= 16) {
      return {
        ok: false,
        badgeText: food.minAgeMonths >= 12 ? "🚫 Pas vanaf 1 jaar" : `Vanaf ${food.minAgeMonths} mnd`,
        title: `Nog niet geven (0–3 mnd • Week ${week})`,
        text:
          food.minAgeMonths >= 12
            ? food.prep4to5m || food.prep6to8m
            : `Tot 4 maanden (Week 17) zijn de darmpjes alleen rijp voor borst- of kunstvoeding. Dit voedingsmiddel mag vanaf ${food.minAgeMonths} maanden.`
      };
    }

    // Fase 4 (Week 17–23 • 4–5 maanden): Eerste gladde oefenhapjes
    if (week <= 23) {
      if (food.minAgeMonths <= 4) {
        return {
          ok: true,
          badgeText: "✓ Oefenhapje (4m+)",
          title: `Oefenhapje 4–5 mnd (Week ${week})`,
          text:
            food.prep4to5m ||
            `Oefenhapje: 1–2 theelepeltjes glad gepureerd. Wacht met losse stukjes (Rapley) tot 6 maanden.`
        };
      }
      return {
        ok: false,
        badgeText: food.minAgeMonths >= 12 ? "🚫 Pas vanaf 1 jaar" : `Vanaf ${food.minAgeMonths} mnd`,
        title: `Wacht tot ${food.minAgeMonths} maanden`,
        text: food.prep4to5m || food.prep6to8m
      };
    }

    // Fase 5 (Week 24–30 • 6–7 maanden): Start 6 mnd puree & Rapley reepjes
    if (week <= 30) {
      const isOk = food.minAgeMonths <= 6;
      return {
        ok: isOk,
        badgeText: isOk ? "✓ Geschikt" : "🚫 Pas vanaf 1 jaar",
        title: isOk ? `Bereiding 6–7 mnd (Week ${week})` : `Wacht tot ${food.minAgeMonths} maanden`,
        text: food.prep6to8m
      };
    }

    // Fase 6 & 7 (Week 31–52 • 8–12 maanden): Pincetgreep & hapklare stukjes
    if (week <= 52) {
      const isOk = food.minAgeMonths <= 9;
      return {
        ok: isOk,
        badgeText: isOk ? "✓ Geschikt" : "🚫 Pas vanaf 1 jaar",
        title: isOk ? `Bereiding 8–12 mnd (Week ${week})` : `Wacht tot ${food.minAgeMonths} maanden`,
        text: food.prep9to12m
      };
    }

    // Fase 8–11 (Week 53–208 • 1–3 jaar): Dreumes & Peuter
    if (week <= 208) {
      return {
        ok: true,
        badgeText: "✓ Geschikt",
        title: `Bereiding 1–3 jaar`,
        text: food.prep1to3y
      };
    }

    // Fase 12–15 (Week 209–624 • 4–12 jaar): Basisschoolkind
    return {
      ok: true,
      badgeText: "✓ Geschikt",
      title: `Bereiding 4–12 jaar`,
      text: food.prep4to12y
    };
  }

  function matchFoodCategory(f, catKey) {
    if (!catKey || catKey === "all") return true;
    const c = f.category.toLowerCase();
    if (catKey === "Zuivel") return c.includes("zuivel") || c.includes("granen");
    return c.includes(catKey.toLowerCase());
  }

  function matchFoodStatus(f, statusKey, week, store) {
    if (week <= 16) return true;
    const st = (store.triedFoods && store.triedFoods[f.id]) || "";
    const prep = getPrepForWeek(f, week);
    if (!prep.ok) return false;
    if (statusKey === "todo") return !st;
    if (statusKey === "retry") return st === "retry";
    if (statusKey === "done") return st === "loved" || st === "tried";
    // Standaard ('all'): alle producten die veilig en geschikt zijn in déze fase
    return true;
  }

  function isAllergenSuitableForWeek(alg, week) {
    if (week <= 16) return false;
    const minM = alg.minAgeMonths || 4;
    if (week <= 23) return minM <= 4;
    return true;
  }

  const CUT_SVGS = {
    spear: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" class="cut-mini-svg" aria-label="Vingerlange reep (5-7 cm)">
      <rect width="54" height="54" rx="12" fill="var(--primary-soft)"/>
      <rect x="19" y="8" width="16" height="38" rx="8" fill="var(--primary)" stroke="#fff" stroke-width="1.5"/>
      <line x1="10" y1="8" x2="10" y2="46" stroke="var(--primary)" stroke-width="1.5" stroke-dasharray="2 2"/>
      <text x="5" y="29" fill="var(--primary)" font-size="7.5" font-weight="800" text-anchor="middle" transform="rotate(-90 5 29)">6 cm</text>
      <circle cx="27" cy="15" r="2.5" fill="#fff" opacity="0.6"/>
      <path d="M22 40C22 43 32 43 32 40" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    quarters: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" class="cut-mini-svg" aria-label="In vieren in de lengte">
      <rect width="54" height="54" rx="12" fill="var(--accent-soft)"/>
      <ellipse cx="27" cy="27" rx="15" ry="19" fill="#fff" stroke="var(--accent)" stroke-width="2"/>
      <line x1="27" y1="8" x2="27" y2="46" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="12" y1="27" x2="42" y2="27" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="21" cy="20" r="1.5" fill="var(--accent)"/>
      <circle cx="33" cy="20" r="1.5" fill="var(--accent)"/>
      <circle cx="21" cy="34" r="1.5" fill="var(--accent)"/>
      <circle cx="33" cy="34" r="1.5" fill="var(--accent)"/>
    </svg>`,
    squash: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" class="cut-mini-svg" aria-label="Platgedrukt tussen vingers">
      <rect width="54" height="54" rx="12" fill="var(--accent-soft)"/>
      <ellipse cx="27" cy="27" rx="19" ry="11" fill="var(--accent)" stroke="#fff" stroke-width="1.5"/>
      <path d="M27 7V13M24 10L27 13L30 10" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M27 47V41M24 44L27 41L30 44" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 27C21 24 33 24 38 27" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
    dices: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" class="cut-mini-svg" aria-label="Kleine blokjes 1x1 cm">
      <rect width="54" height="54" rx="12" fill="var(--primary-soft)"/>
      <rect x="11" y="11" width="13" height="13" rx="3" fill="var(--primary)" stroke="#fff" stroke-width="1.5"/>
      <rect x="30" y="11" width="13" height="13" rx="3" fill="var(--accent)" stroke="#fff" stroke-width="1.5"/>
      <rect x="11" y="30" width="13" height="13" rx="3" fill="var(--accent)" stroke="#fff" stroke-width="1.5"/>
      <rect x="30" y="30" width="13" height="13" rx="3" fill="var(--primary)" stroke="#fff" stroke-width="1.5"/>
      <text x="27" y="47" fill="var(--primary)" font-size="7" font-weight="bold" text-anchor="middle">1 cm</text>
    </svg>`,
    handle: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" class="cut-mini-svg" aria-label="Natuurlijk handvat">
      <rect width="54" height="54" rx="12" fill="var(--primary-soft)"/>
      <circle cx="21" cy="18" r="8" fill="var(--primary)"/>
      <circle cx="33" cy="18" r="8" fill="var(--primary)"/>
      <circle cx="27" cy="13" r="8" fill="var(--primary)"/>
      <rect x="23" y="22" width="8" height="24" rx="4" fill="var(--accent)"/>
      <path d="M19 40H35" stroke="var(--primary)" stroke-width="1.5" stroke-dasharray="2 2"/>
      <text x="27" y="49" fill="var(--primary)" font-size="6.5" font-weight="bold" text-anchor="middle">handvat</text>
    </svg>`,
    puree: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" class="cut-mini-svg" aria-label="Zijdezachte puree">
      <rect width="54" height="54" rx="12" fill="var(--primary-soft)"/>
      <path d="M12 28C12 39 19 44 27 44C35 44 42 39 42 28H12Z" fill="var(--primary)" stroke="#fff" stroke-width="1.5"/>
      <path d="M16 28C20 24 24 25 27 27C30 25 34 24 38 28" stroke="var(--accent-soft)" stroke-width="2" stroke-linecap="round"/>
      <path d="M30 18L44 10" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="27" cy="20" rx="6" ry="3.5" transform="rotate(-20 27 20)" fill="var(--accent)"/>
    </svg>`,
    spread: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" class="cut-mini-svg" aria-label="Dun uitgesmeerd">
      <rect width="54" height="54" rx="12" fill="var(--accent-soft)"/>
      <rect x="10" y="24" width="34" height="18" rx="4" fill="#fff" stroke="var(--accent)" stroke-width="1.5"/>
      <path d="M12 28C18 26 28 26 42 28" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
      <path d="M14 12L38 18" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M36 17L44 19L41 22L34 20Z" fill="var(--primary)"/>
    </svg>`,
    cup: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" class="cut-mini-svg" aria-label="Open beker slokjes">
      <rect width="54" height="54" rx="12" fill="var(--primary-soft)"/>
      <path d="M16 15H38L35 39C35 42 33 44 30 44H24C21 44 19 42 19 39L16 15Z" fill="#fff" stroke="var(--primary)" stroke-width="2"/>
      <path d="M18 23C22 21 32 21 36 23" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="27" cy="30" r="2.5" fill="var(--primary)" opacity="0.6"/>
    </svg>`,
    spoon: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" class="cut-mini-svg" aria-label="Lepelhapje">
      <rect width="54" height="54" rx="12" fill="var(--primary-soft)"/>
      <path d="M13 28C13 38 19 43 27 43C35 43 41 38 41 28H13Z" fill="#fff" stroke="var(--primary)" stroke-width="2"/>
      <path d="M28 10L41 23" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="26" cy="12" rx="5" ry="3.5" fill="var(--accent)" transform="rotate(-40 26 12)"/>
    </svg>`,
    bread: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" class="cut-mini-svg" aria-label="Broodkorst of reepje">
      <rect width="54" height="54" rx="12" fill="var(--primary-soft)"/>
      <path d="M13 20C13 14 18 11 27 11C36 11 41 14 41 20V38C41 41 38 43 35 43H19C16 43 13 41 13 38V20Z" fill="#fff" stroke="var(--primary)" stroke-width="2"/>
      <rect x="23" y="16" width="8" height="23" rx="2" fill="var(--accent)" stroke="#fff" stroke-width="1"/>
      <path d="M16 19C21 16 33 16 38 19" stroke="var(--primary)" stroke-width="1.8"/>
    </svg>`,
    flakes: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" class="cut-mini-svg" aria-label="Malse plukjes of zachte pasta">
      <rect width="54" height="54" rx="12" fill="var(--accent-soft)"/>
      <path d="M14 19C18 15 26 15 30 19C34 23 42 23 46 19" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M12 27C17 23 23 23 27 27C31 31 37 31 42 27" stroke="var(--primary)" stroke-width="3" stroke-linecap="round"/>
      <path d="M15 35C19 31 25 31 29 35C33 39 39 39 43 35" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
    fork: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" class="cut-mini-svg" aria-label="Zelf eten met vorkje of uit de hand">
      <rect width="54" height="54" rx="12" fill="var(--primary-soft)"/>
      <circle cx="27" cy="29" r="15" fill="#fff" stroke="var(--primary)" stroke-width="2"/>
      <rect x="20" y="23" width="6" height="6" rx="2" fill="var(--accent)"/>
      <rect x="28" y="23" width="6" height="6" rx="2" fill="var(--primary)"/>
      <rect x="23" y="31" width="7" height="6" rx="2" fill="var(--primary)"/>
      <path d="M38 10L30 22" stroke="var(--accent)" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M36 9L29 19M40 12L33 22" stroke="var(--accent)" stroke-width="1.4" stroke-linecap="round"/>
    </svg>`,
    plate: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" class="cut-mini-svg" aria-label="Gezinsmaaltijd en schooltrommel">
      <rect width="54" height="54" rx="12" fill="var(--primary-soft)"/>
      <circle cx="27" cy="27" r="16" fill="#fff" stroke="var(--primary)" stroke-width="2"/>
      <path d="M27 11V43" stroke="var(--primary)" stroke-width="1.8"/>
      <path d="M27 27H43" stroke="var(--accent)" stroke-width="1.8"/>
      <circle cx="19" cy="24" r="3" fill="var(--primary)" opacity="0.85"/>
      <circle cx="20" cy="32" r="2.5" fill="var(--primary)" opacity="0.65"/>
      <rect x="31" y="18" width="6" height="5" rx="1.5" fill="var(--accent)"/>
      <rect x="31" y="31" width="6" height="5" rx="1.5" fill="var(--primary)"/>
    </svg>`,
    prohibited: `<svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" class="cut-mini-svg" aria-label="Verboden onder 1 jaar">
      <rect width="54" height="54" rx="12" fill="var(--warn-soft)"/>
      <circle cx="27" cy="27" r="17" fill="#fff" stroke="var(--warn)" stroke-width="3"/>
      <line x1="15" y1="15" x2="39" y2="39" stroke="var(--warn)" stroke-width="3" stroke-linecap="round"/>
      <text x="27" y="31" fill="var(--warn)" font-size="11" font-weight="900" text-anchor="middle">&lt;1j</text>
    </svg>`
  };

  function getFoodCutInfo(food, week, prep) {
    if (!prep.ok) {
      return {
        shape: "prohibited",
        shapeLabel: "🚫 Nog niet geven",
        ageLabel: `Pas vanaf ${food.minAgeMonths} mnd`,
        rule: `Veilig introduceren vanaf ${food.minAgeMonths >= 12 ? "1 jaar" : food.minAgeMonths + " maanden"}`,
        svg: CUT_SVGS.prohibited
      };
    }

    const fid = food.id || "";
    const nameLow = (food.name || "").toLowerCase();

    // 1. Dranken (Water & Thee) — no steaming or cutting!
    if (fid === "fd-water-tea" || nameLow.includes("water") || nameLow.includes("thee")) {
      if (week <= 23) {
        return {
          shape: "cup",
          shapeLabel: "🥛 Oefenslokjes open beker",
          ageLabel: "Vocht uit melk",
          rule: "Baby haalt al het vocht uit melkvoeding; geef evt. 1–2 oefenslokjes lauw water uit een klein open bekertje",
          svg: CUT_SVGS.cup
        };
      }
      if (week <= 52) {
        return {
          shape: "cup",
          shapeLabel: "🥛 Open bekertje (Slokjes)",
          ageLabel: "Mondmotoriek (6–12m)",
          rule: "Geef kleine slokjes water of lauwe ongezoete thee uit een open beker (geen tuitbeker!) na de hapjes",
          svg: CUT_SVGS.cup
        };
      }
      if (week <= 208) {
        return {
          shape: "cup",
          shapeLabel: "🥛 Open beker / Rietjesbeker",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "Bied over de dag 450–700 ml water of lauwe ongezoete thee aan uit een open beker of rietjesbeker",
          svg: CUT_SVGS.cup
        };
      }
      return {
        shape: "cup",
        shapeLabel: "🚰 Waterfles & Glas (1–1,5 L)",
        ageLabel: "School & Sport (4–12 jr)",
        rule: "Geef een vaste herbruikbare waterfles mee naar school en sport; drink 1 tot 1,5 liter water of ongezoete thee per dag",
        svg: CUT_SVGS.cup
      };
    }

    // 2. Gewone Melk & Yoghurt
    if (fid === "fd-dairy" || nameLow.includes("yoghurt") || nameLow.includes("melk")) {
      if (week <= 52) {
        return {
          shape: "spoon",
          shapeLabel: "🥄 Lepelhapje ongezoete yoghurt",
          ageLabel: "Enkele theelepeltjes",
          rule: "Geef ongezoete halfvolle of volle yoghurt met een klein lepeltje (wacht met gewone koemelk als hoofdvoeding tot 1 jaar)",
          svg: CUT_SVGS.spoon
        };
      }
      if (week <= 208) {
        return {
          shape: "cup",
          shapeLabel: "🥛 Beker melk & schaaltje yoghurt",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "Circa 300 ml zuivel per dag (bijv. 2 bekertjes halfvolle melk/karnemelk en een schaaltje ongezoete yoghurt)",
          svg: CUT_SVGS.cup
        };
      }
      return {
        shape: "cup",
        shapeLabel: "🥛 300–500 ml Zuivel per dag",
        ageLabel: "Groei & Botten (4–12 jr)",
        rule: "2 tot 3 glazen halfvolle melk/karnemelk of een schaal ongezoete yoghurt/kwark voor calcium en eiwit in de groei",
        svg: CUT_SVGS.cup
      };
    }

    // 3. Kaas, Hüttenkäse & Zuivelspread
    if (fid === "fd-cheese" || nameLow.includes("hüttenkäse") || nameLow.includes("zuivelspread")) {
      if (week <= 36) {
        return {
          shape: "spread",
          shapeLabel: "🍞 Dun gesmeerd op korst",
          ageLabel: "Zoutarm beleg",
          rule: "Smeer een dun laagje hüttenkäse of zuivelspread light op een broodkorst; geef nog geen gewone zoute kaas",
          svg: CUT_SVGS.spread
        };
      }
      if (week <= 52) {
        return {
          shape: "dices",
          shapeLabel: "🎲 Blokjes 1×1 cm of op brood",
          ageLabel: "Pincetgreep (8–12m)",
          rule: "Zachte zoutarme jonge kaas (20+/30+) of hüttenkäse in kleine blokjes of dun op brood",
          svg: CUT_SVGS.dices
        };
      }
      if (week <= 208) {
        return {
          shape: "spread",
          shapeLabel: "🧀 Op volkorenbrood (30+ kaas)",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "Beleg volkorenbrood met hüttenkäse, zuivelspread of minder zoute 20+/30+ kaas (vermijd rauwmelkse kaas)",
          svg: CUT_SVGS.spread
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🥪 Plakje 30+ kaas of spread",
        ageLabel: "Broodtrommel (4–12 jr)",
        rule: "1 tot 2 plakjes 30+ kaas, hüttenkäse of zuivelspread op de volkoren boterham voor school",
        svg: CUT_SVGS.plate
      };
    }

    // 4. Brood & Havermout
    if (fid === "fd-bread-oats" || nameLow.includes("brood") || nameLow.includes("havermout")) {
      if (week <= 23) {
        return {
          shape: "puree",
          shapeLabel: "🥣 Fijne granenpap",
          ageLabel: "Allergeen-wennen",
          rule: "1 theelepeltje fijne baby-granenpap door de melk of fruit om aan gluten te wennen",
          svg: CUT_SVGS.puree
        };
      }
      if (week <= 36) {
        return {
          shape: "bread",
          shapeLabel: "🍞 Broodkorst / Vingerbreed reepje",
          ageLabel: "Sabbelen & Bijten",
          rule: "Geef een stevige lichtbruine broodkorst om op te sabbelen, of een vingerbreed reepje met flinterdun beleg",
          svg: CUT_SVGS.bread
        };
      }
      if (week <= 52) {
        return {
          shape: "dices",
          shapeLabel: "🎲 Boterham-dobbelsteentjes",
          ageLabel: "Pincetgreep (8–12m)",
          rule: "Snijd de boterham in kleine vierkante blokjes (1×1 cm) met zachte margarine en gezond beleg",
          svg: CUT_SVGS.dices
        };
      }
      if (week <= 208) {
        return {
          shape: "bread",
          shapeLabel: "🍞 Dubbelgevouwen of kwartjes",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "Geef 2–3 volkoren boterhammen per dag in dubbelgevouwen helften of kwartjes, of een schaaltje havermout",
          svg: CUT_SVGS.bread
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🥪 3–6 Volkoren boterhammen",
        ageLabel: "School & Groei (4–12 jr)",
        rule: "Hele volkoren boterhammen voor ontbijt en de schooltrommel (laat je kind zelf meehelpen smeren)",
        svg: CUT_SVGS.plate
      };
    }

    // 5. Pasta, Rijst & Couscous
    if (fid === "fd-pasta-rice" || (nameLow.includes("pasta") && !nameLow.includes("notenpasta")) || nameLow.includes("rijst") || nameLow.includes("couscous")) {
      if (week <= 36) {
        return {
          shape: "flakes",
          shapeLabel: "🍝 Zachte fusilli / plakrijst",
          ageLabel: "BLW Vuistgreep",
          rule: "Kook pastaspiraaltjes (fusilli/penne) extra zacht voor het vuistje, of kook rijst kleverig zodat het een balletje vormt",
          svg: CUT_SVGS.flakes
        };
      }
      if (week <= 52) {
        return {
          shape: "dices",
          shapeLabel: "🎲 Zachtgekookte stukjes",
          ageLabel: "Pincetgreep (8–12m)",
          rule: "Zachtgekookte volkorenpasta in kleine stukjes, zilvervliesrijst of couscous gemengd met groente",
          svg: CUT_SVGS.dices
        };
      }
      if (week <= 208) {
        return {
          shape: "fork",
          shapeLabel: "🍴 Zelf prikken & scheppen",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "2–4 eetlepels volkoren pasta, zilvervliesrijst of couscous bij de warme maaltijd om zelf met vork en lepel te eten",
          svg: CUT_SVGS.fork
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🍽️ Volkoren gezinsportie (25% bord)",
        ageLabel: "Energie & Sport (4–12 jr)",
        rule: "Volkoren pasta, zilvervliesrijst of couscous als 1/4 deel van het avondbord voor langdurige energie",
        svg: CUT_SVGS.plate
      };
    }

    // 6. Ei (geen spears!)
    if (fid === "fd-egg" || nameLow.startsWith("ei") || nameLow.includes("kippenei") || nameLow.includes("roerei") || nameLow === "ei") {
      if (week <= 23) {
        return {
          shape: "spread",
          shapeLabel: "🥄 Kruimeltje door puree",
          ageLabel: "Allergeen-opbouw",
          rule: "Prak een klein mespuntje hardgekookt eigeel/eiwit fijn door een glad groentehapje",
          svg: CUT_SVGS.spread
        };
      }
      if (week <= 36) {
        return {
          shape: "flakes",
          shapeLabel: "🍳 Zacht roerei of partjes",
          ageLabel: "Gaar doorbakken",
          rule: "Geef zachte plukjes rul doorbakken roerei, of snijd een hardgekookt ei in 4 langwerpige partjes",
          svg: CUT_SVGS.flakes
        };
      }
      if (week <= 52) {
        return {
          shape: "dices",
          shapeLabel: "🎲 Blokjes hardgekookt ei",
          ageLabel: "Pincetgreep (8–12m)",
          rule: "Snijd een hardgekookt ei in kleine blokjes van 1×1 cm of prak fijn op brood",
          svg: CUT_SVGS.dices
        };
      }
      if (week <= 208) {
        return {
          shape: "fork",
          shapeLabel: "🍳 Partjes, roerei of op brood",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "Gekookt ei in partjes, plakjes op volkorenbrood of een groente-omelet om zelf met een vorkje te prikken",
          svg: CUT_SVGS.fork
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🥚 Gekookt ei, omelet of roerei",
        ageLabel: "Ontbijt & Lunchtrommel",
        rule: "Alle bereidingen geschikt: op volkorenbrood, bij het ontbijt of als gekookt ei in de schooltrommel",
        svg: CUT_SVGS.plate
      };
    }

    // 7. Vlees, Kip, Zalm & Linzen
    if (fid === "fd-meat-fish" || nameLow.includes("vlees") || nameLow.includes("vis") || nameLow.includes("zalm") || nameLow.includes("kip")) {
      if (week <= 36) {
        return {
          shape: "flakes",
          shapeLabel: "🐟 Zalmvlokken / zachte kip",
          ageLabel: "Mals geplozen",
          rule: "Druk gaar gestoomde zalm met een vork in losse vlokken, pluk zacht kippenvlees uit elkaar, of geef een zacht gehaktballetje",
          svg: CUT_SVGS.flakes
        };
      }
      if (week <= 52) {
        return {
          shape: "dices",
          shapeLabel: "🎲 Zachte stukjes 1×1 cm",
          ageLabel: "Pincetgreep (8–12m)",
          rule: "Mals gesneden stukjes vis, kip, gehakt of geplette linzen/bonen om zelf te pakken",
          svg: CUT_SVGS.dices
        };
      }
      if (week <= 208) {
        return {
          shape: "fork",
          shapeLabel: "🍴 Hapklare stukjes (vorkje)",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "Mee-eten met de gezinsmaaltijd in malse stukjes (vermijd t/m 3 jaar nog wel rauw vlees en rauwe vis)",
          svg: CUT_SVGS.fork
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🍽️ Gezinsportie (25% van het bord)",
        ageLabel: "Groei & IJzer (4–12 jr)",
        rule: "Normale portie vlees, kip, vette vis of peulvruchten; laat je kind aan tafel zelf snijden met mes en vork",
        svg: CUT_SVGS.plate
      };
    }

    // 8. Maisvingers & Crackers
    if (fid === "fd-crackers" || nameLow.includes("maisvinger") || nameLow.includes("cracker")) {
      if (week <= 36) {
        return {
          shape: "spear",
          shapeLabel: "🥢 Smeltende maisvinger",
          ageLabel: "Zelf vasthouden",
          rule: "Kies mais-/gierstvingers die direct smelten in het mondje; vingerlang formaat voor het vuistje",
          svg: CUT_SVGS.spear
        };
      }
      if (week <= 52) {
        return {
          shape: "bread",
          shapeLabel: "🍘 Cracker-reepje / maisvinger",
          ageLabel: "Krokant oefenen (8–12m)",
          rule: "Een zoutloze maisvinger of volkoren cracotte met dun beleg; blijf er altijd bij",
          svg: CUT_SVGS.bread
        };
      }
      if (week <= 208) {
        return {
          shape: "bread",
          shapeLabel: "🍘 Volkoren cracker / soepstengel",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "Volkoren cracker met gezond beleg of een soepstengel (wissel af en geef niet dagelijks rijstwafels)",
          svg: CUT_SVGS.bread
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🍘 Volkoren cracker na school",
        ageLabel: "Tussendoor (4–12 jr)",
        rule: "Volkoren crackers met hummus, 30+ kaas of 100% pindakaas als voedzame snack na school",
        svg: CUT_SVGS.plate
      };
    }

    // 9. Pindakaas & Notenpasta
    if (fid === "fd-peanutbutter" || nameLow.includes("pinda") || nameLow.includes("notenpasta")) {
      if (week <= 23) {
        return {
          shape: "spread",
          shapeLabel: "🥄 Mespuntje door puree",
          ageLabel: "Allergeen-introductie",
          rule: "Roer 1/4 tot 1/2 theelepel gladde 100% pindakaas los door een warm groente- of fruithapje",
          svg: CUT_SVGS.spread
        };
      }
      if (week <= 208) {
        return {
          shape: "spread",
          shapeLabel: "🍞 Dun gesmeerd (zonder stukjes)",
          ageLabel: "Geen hele noten <4 jr",
          rule: "Smeer gladde 100% pindakaas/notenpasta op brood of roer door pap; geef onder 4 jaar géén pindakaas met stukjes of hele noten",
          svg: CUT_SVGS.spread
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🥜 Op brood, dip of handje noten",
        ageLabel: "Gezonde vetten (4–12 jr)",
        rule: "Op volkorenbrood, als dip bij appelpartjes én vanaf 4–5 jaar dagelijks een klein handje ongezouten noten (rustig zittend)",
        svg: CUT_SVGS.plate
      };
    }

    // 10. Honing
    if (fid === "fd-honey" || nameLow.includes("honing")) {
      if (week < 52) {
        return {
          shape: "prohibited",
          shapeLabel: "🚫 Verboden onder 1 jaar",
          ageLabel: "Botulisme-gevaar",
          rule: "Geef NOOIT honing aan baby's onder 1 jaar vanwege gevaar voor ernstig botulisme!",
          svg: CUT_SVGS.prohibited
        };
      }
      if (week <= 208) {
        return {
          shape: "spread",
          shapeLabel: "🍯 Dun gesmeerd (vanaf 1 jaar)",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "Veilig vanaf 12 maanden; spaarzaam gebruiken i.v.m. suikers (1/2 tl honing helpt wel bij nachtelijke kriebelhoest)",
          svg: CUT_SVGS.spread
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🍯 Met mate gebruiken",
        ageLabel: "Vrije suikers beperken",
        rule: "Veilig te gebruiken met mate, bijvoorbeeld een theelepeltje in warme thee bij keelpijn of op een pannenkoek",
        svg: CUT_SVGS.plate
      };
    }

    // 11. Druiven & Snoeptomaatjes (levensgroot verstikkingsgevaar!)
    if (fid === "fd-grapes" || nameLow.includes("druif") || nameLow.includes("tomaat")) {
      if (week <= 208) {
        return {
          shape: "quarters",
          shapeLabel: "🔪 In lengte in 4en",
          ageLabel: "Anti-verstikking (<4 jr)",
          rule: "ALTIJD in de lengte in 4 partjes snijden tot minstens 4 jaar! Nooit dwars of heel geven",
          svg: CUT_SVGS.quarters
        };
      }
      if (week <= 312) {
        return {
          shape: "quarters",
          shapeLabel: "🍇 Halveren & rustig zittend",
          ageLabel: "Kleuter (4–5 jr)",
          rule: "Halveer grote druiven en cherrytomaatjes bij kleuters nog even en laat ze altijd rustig zittend opeten",
          svg: CUT_SVGS.quarters
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🍇 Heel in fruitbak (rustig zittend)",
        ageLabel: "Schoolkind (6–12 jr)",
        rule: "Mag heel gegeten worden in de schoolpauze of thuis, mits je kind rustig zit (nooit tijdens het rennen of spelen)",
        svg: CUT_SVGS.plate
      };
    }

    // 12. Blauwe bessen & Aardbeien
    if (fid === "fd-blueberry" || nameLow.includes("bes") || nameLow.includes("erwt")) {
      if (week <= 52) {
        return {
          shape: "squash",
          shapeLabel: "🫐 Platgedrukt / kwartjes",
          ageLabel: "Anti-verstikking (6–12m)",
          rule: "Plet ronde blauwe bessen altijd tussen duim en wijsvinger; snijd aardbeien in kleine kwartjes",
          svg: CUT_SVGS.squash
        };
      }
      if (week <= 208) {
        return {
          shape: "squash",
          shapeLabel: "🍓 Halveren (grote bessen)",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "Halveer of plet grote, stevige blauwe bessen t/m 3 jaar; aardbeien gehalveerd of uit de hand",
          svg: CUT_SVGS.squash
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🍓 Heel in fruitbak of yoghurt",
        ageLabel: "School & Thuis (4–12 jr)",
        rule: "Gewoon heel uit de hand, in het fruitbakje voor school of door een schaaltje yoghurt/kwark",
        svg: CUT_SVGS.plate
      };
    }

    // 13. Appel & Peer (rauw is te hard!)
    if (fid === "fd-apple" || (nameLow.includes("appel") && !nameLow.includes("aardappel")) || nameLow.includes("peer")) {
      if (week <= 23) {
        return {
          shape: "puree",
          shapeLabel: "🥄 Gladde Fruitpuree",
          ageLabel: "Gestoomd & gepureerd",
          rule: "Stoom geschilde appel of peer zacht en pureer glad met een vork of staafmixer",
          svg: CUT_SVGS.puree
        };
      }
      if (week <= 36) {
        return {
          shape: "puree",
          shapeLabel: "🍎 Gestoomde part / rasp",
          ageLabel: "Zacht stomen!",
          rule: "Rauwe appel is gevaarlijk hard; stoom altijd zacht tot je het tussen 2 vingers platknijpt, of rasp heel fijn",
          svg: CUT_SVGS.puree
        };
      }
      if (week <= 52) {
        return {
          shape: "dices",
          shapeLabel: "🍎 Zachte blokjes / fijne rasp",
          ageLabel: "Pincetgreep (8–12m)",
          rule: "Geef zacht gestoofde blokjes (1×1 cm), geraspte appel of rijpe zachte peer zonder schil",
          svg: CUT_SVGS.dices
        };
      }
      if (week <= 208) {
        return {
          shape: "fork",
          shapeLabel: "🍎 Flinterdunne partjes",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "Snijd rauwe appel in flinterdunne partjes (zonder harde schil) of geef rijpe zachte peer; géén dikke harde brokken",
          svg: CUT_SVGS.fork
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🍎 Partjes met schil of hele appel",
        ageLabel: "10-uurtje & Thuis (4–12 jr)",
        rule: "Knapperige appelpartjes met schil in de fruitbak voor school, of gewoon zelf afhappen van een hele appel",
        svg: CUT_SVGS.plate
      };
    }

    // 14. Banaan
    if (fid === "fd-banana" || nameLow.includes("banaan")) {
      if (week <= 23) {
        return {
          shape: "puree",
          shapeLabel: "🥄 Glad geprakte banaan",
          ageLabel: "Zijdezacht",
          rule: "Prak een rijpe banaan helemaal glad met een vork",
          svg: CUT_SVGS.puree
        };
      }
      if (week <= 36) {
        return {
          shape: "handle",
          shapeLabel: "🍌 Schilhandvat of 3 repen",
          ageLabel: "BLW Vuistgreep",
          rule: "Laat 2 cm schil onderaan als handvat, of duw met je vinger in de lengte in 3 natuurlijke repen",
          svg: CUT_SVGS.handle
        };
      }
      if (week <= 52) {
        return {
          shape: "dices",
          shapeLabel: "🎲 Halve maantjes / blokjes",
          ageLabel: "Pincetgreep (8–12m)",
          rule: "Snijd in halve maantjes of kleine blokjes die je baby zelf tussen duim en wijsvinger kan pakken",
          svg: CUT_SVGS.dices
        };
      }
      if (week <= 208) {
        return {
          shape: "fork",
          shapeLabel: "🍌 Plakjes of zelf afhappen",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "Geef een (halve) gepelde banaan om zelf van af te happen, of schijfjes voor op brood en met een vorkje",
          svg: CUT_SVGS.fork
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🍌 Hele banaan of op brood",
        ageLabel: "School & Sport (4–12 jr)",
        rule: "Zelf pellen en opeten als 10-uurtje op school, voor het sporten of in plakjes op volkorenbrood",
        svg: CUT_SVGS.plate
      };
    }

    // 15. Broccoli & Bloemkool
    if (fid === "fd-broccoli" || nameLow.includes("broccoli") || nameLow.includes("bloemkool")) {
      if (week <= 23) {
        return {
          shape: "puree",
          shapeLabel: "🥄 Gladde Broccolipuree",
          ageLabel: "Milde smaak",
          rule: "Stoom de roosjes goed gaar en pureer met wat kookvocht",
          svg: CUT_SVGS.puree
        };
      }
      if (week <= 36) {
        return {
          shape: "handle",
          shapeLabel: "🥦 Roosje met lange steel",
          ageLabel: "Natuurlijk handvat",
          rule: "Laat de steel lang zodat baby het roosje met de vuist kan pakken; stoom zacht (knijpbaar)",
          svg: CUT_SVGS.handle
        };
      }
      if (week <= 52) {
        return {
          shape: "dices",
          shapeLabel: "🎲 Kleine roosjes & blokjes",
          ageLabel: "Pincetgreep (8–12m)",
          rule: "Snijd de zachte steel in blokjes (1×1 cm) en breek de roosjes in kleine plukjes voor duim en wijsvinger",
          svg: CUT_SVGS.dices
        };
      }
      if (week <= 208) {
        return {
          shape: "fork",
          shapeLabel: "🥦 Gestoomde 'dino-boompjes'",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "Beetgare roosjes om zelf met een vorkje aan te prikken of lekker met de hand te eten",
          svg: CUT_SVGS.fork
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🍽️ Gestoomd, gewokt of uit de oven",
        ageLabel: "Gezinsmaaltijd (4–12 jr)",
        rule: "Normale roosjes bij de avondmaaltijd, gewokt of geroosterd uit de oven (vult samen met andere groente 50% van het bord)",
        svg: CUT_SVGS.plate
      };
    }

    // 16. Avocado
    if (fid === "fd-avocado" || nameLow.includes("avocado")) {
      if (week <= 23) {
        return {
          shape: "puree",
          shapeLabel: "🥄 Gladde Avocado-puree",
          ageLabel: "Gezonde vetten",
          rule: "Prak een zachte rijpe avocado fijn met een vork",
          svg: CUT_SVGS.puree
        };
      }
      if (week <= 36) {
        return {
          shape: "spear",
          shapeLabel: "🥢 Vingerlange reep (met grip)",
          ageLabel: "Rijp & zacht",
          rule: "Snijd in een vingerlange reep; rol eventueel door wat fijne havermoutvlokken voor betere grip",
          svg: CUT_SVGS.spear
        };
      }
      if (week <= 52) {
        return {
          shape: "dices",
          shapeLabel: "🎲 Blokjes 1×1 cm",
          ageLabel: "Pincetgreep (8–12m)",
          rule: "Snijd in zachte hapklare blokjes die je baby zelf tussen duim en wijsvinger kan pakken",
          svg: CUT_SVGS.dices
        };
      }
      if (week <= 208) {
        return {
          shape: "fork",
          shapeLabel: "🥑 Plakjes, blokjes of spread",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "In plakjes op volkorenbrood, als guacamole-dip of in stukjes om met een vorkje te prikken",
          svg: CUT_SVGS.fork
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🥪 Op toast, in wrap of salade",
        ageLabel: "Gezinstafel & Trommel",
        rule: "In plakjes op volkoren toast, in een lunchwrap voor school of in blokjes door een salade of pokébowl",
        svg: CUT_SVGS.plate
      };
    }

    // 17. Wortel, Pompoen & Zoete Aardappel
    if (fid === "fd-carrot" || nameLow.includes("wortel") || nameLow.includes("pompoen") || nameLow.includes("zoete aardappel")) {
      if (week <= 23) {
        return {
          shape: "puree",
          shapeLabel: "🥄 Gladde Wortelpuree",
          ageLabel: "Zoet & zacht",
          rule: "Kook of stoom gaar en pureer met kookvocht glad",
          svg: CUT_SVGS.puree
        };
      }
      if (week <= 36) {
        return {
          shape: "spear",
          shapeLabel: "🥢 Vingerlange reep (5–7 cm)",
          ageLabel: "Zacht gestoomd",
          rule: "Snijd een reep zo dik als je wijsvinger (geen ronde schijfjes!); stoom zo zacht dat je het moeiteloos fijnknijpt",
          svg: CUT_SVGS.spear
        };
      }
      if (week <= 52) {
        return {
          shape: "dices",
          shapeLabel: "🎲 Zachtgekookte blokjes 1×1 cm",
          ageLabel: "Pincetgreep (8–12m)",
          rule: "Zacht gekookte wortel- of pompoenblokjes (of halve schijfjes) om zelf met duim en wijsvinger te pakken",
          svg: CUT_SVGS.dices
        };
      }
      if (week <= 208) {
        return {
          shape: "fork",
          shapeLabel: "🥕 Gekookt of fijn geraspt",
          ageLabel: "Geen harde rauwe wortel <4 jr",
          rule: "Geef wortel gekookt/geroosterd of fijn geraspt; harde rauwe snackwortels pas vanaf 4 jaar geven i.v.m. verslikken",
          svg: CUT_SVGS.fork
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🥕 Rauwe snackworteltjes of warm",
        ageLabel: "Schooltrommel & Diner",
        rule: "Vanaf 4 jaar veilig als knapperige rauwe snackworteltjes in de schooltrommel (rustig zittend eten) of bij het avondeten",
        svg: CUT_SVGS.plate
      };
    }

    // 18. Komkommer, Paprika & Courgette
    if (fid === "fd-cucumber" || nameLow.includes("komkommer") || nameLow.includes("courgette") || nameLow.includes("paprika")) {
      if (week <= 23) {
        return {
          shape: "puree",
          shapeLabel: "🥄 Gladde Courgettepuree",
          ageLabel: "Zonder schil",
          rule: "Stoom courgette gaar en pureer glad (rauwe komkommer en paprika zijn nog te hard)",
          svg: CUT_SVGS.puree
        };
      }
      if (week <= 36) {
        return {
          shape: "spear",
          shapeLabel: "🥒 Vingerlange ontpitte reep",
          ageLabel: "Verkoelend bij tandjes",
          rule: "Schil de komkommer, schraap de zaadlijst eruit en snijd in een stevige vingerlange reep om op te sabbelen",
          svg: CUT_SVGS.spear
        };
      }
      if (week <= 52) {
        return {
          shape: "dices",
          shapeLabel: "🎲 Halve maantjes / blokjes",
          ageLabel: "Pincetgreep (8–12m)",
          rule: "Kleine zachte blokjes ontvelde komkommer of zacht gestoofde paprikareepjes",
          svg: CUT_SVGS.dices
        };
      }
      if (week <= 208) {
        return {
          shape: "fork",
          shapeLabel: "🥒 Rauwkoststaafjes & reepjes",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "Dunne reepjes zoete paprika en komkommerstaafjes (lekker om te dippen in hummus) of gewokte courgette",
          svg: CUT_SVGS.fork
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🥒 Snackgroente in de trommel",
        ageLabel: "10-uurtje & 16:00-plankje",
        rule: "Ideale knapperige snackgroente voor in de schooltrommel of op een schaaltje na school om 16:00 uur",
        svg: CUT_SVGS.plate
      };
    }

    // 19. Mango, Kiwi & Meloen
    if (fid === "fd-mango-kiwi" || nameLow.includes("mango") || nameLow.includes("kiwi") || nameLow.includes("meloen")) {
      if (week <= 23) {
        return {
          shape: "puree",
          shapeLabel: "🥄 Gladde Fruitpuree",
          ageLabel: "Rijp & gepureerd",
          rule: "Prak of pureer een stukje goed rijpe mango, meloen of zoete kiwi helemaal glad",
          svg: CUT_SVGS.puree
        };
      }
      if (week <= 36) {
        return {
          shape: "handle",
          shapeLabel: "🥭 Reep met schilhandvat / grip",
          ageLabel: "Anti-wegglijden",
          rule: "Laat onderaan een strookje schil zitten als handvat óf rol gladde stukken door fijne havermout/kokos",
          svg: CUT_SVGS.handle
        };
      }
      if (week <= 52) {
        return {
          shape: "dices",
          shapeLabel: "🎲 Zachte blokjes 1×1 cm",
          ageLabel: "Pincetgreep (8–12m)",
          rule: "Snijd rijpe mango, kiwi of ontpitte meloen in kleine blokjes voor de pincetgreep",
          svg: CUT_SVGS.dices
        };
      }
      if (week <= 208) {
        return {
          shape: "fork",
          shapeLabel: "🥄 Blokjes of kiwi uitlepelen",
          ageLabel: "Dreumes & Peuter (1–3 jr)",
          rule: "In stukjes om met een vorkje te prikken, of halveer een kiwi zodat je peuter hem zelf met een lepeltje kan uitlepelen",
          svg: CUT_SVGS.fork
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🥭 Fruitbakje voor school",
        ageLabel: "10-uurtje & Sport (4–12 jr)",
        rule: "In partjes of blokjes mee in de fruitbak voor school, door de yoghurt/kwark of als frisse snack",
        svg: CUT_SVGS.plate
      };
    }

    // 20. Rozijntjes & Gedroogd Fruit
    if (fid === "fd-raisins" || nameLow.includes("rozijn") || nameLow.includes("gedroogd")) {
      if (week <= 36) {
        return {
          shape: "prohibited",
          shapeLabel: "⏳ Pas vanaf 9 maanden",
          ageLabel: "Plakt & taai",
          rule: "Wacht met losse rozijntjes tot ca. 9 maanden (wanneer de pincetgreep en kauwbeweging starten)",
          svg: CUT_SVGS.prohibited
        };
      }
      if (week <= 52) {
        return {
          shape: "squash",
          shapeLabel: "🍇 Geweld & gehalveerd",
          ageLabel: "Pincetgreep (9–12m)",
          rule: "Wel rozijntjes 5 minuten in warm water zodat ze zacht zijn en halveer grote rozijnen",
          svg: CUT_SVGS.squash
        };
      }
      if (week <= 208) {
        return {
          shape: "fork",
          shapeLabel: "🍇 Max. 1 doosje op 1 eetmoment",
          ageLabel: "Tandvriendelijk (1–3 jr)",
          rule: "Geef op 1 vast moment (niet de hele middag door i.v.m. gaatjes) met een beker water erbij",
          svg: CUT_SVGS.fork
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🦷 Met mate (1 vast moment)",
        ageLabel: "Gebitsbescherming (4–12 jr)",
        rule: "Gedroogd fruit plakt aan de kiezen; geef het alleen op 1 vast eetmoment en kies voor school liever vers fruit",
        svg: CUT_SVGS.plate
      };
    }

    // 21. Worstjes (Knakworst) & Popcorn
    if (fid === "fd-sausage-popcorn" || nameLow.includes("knakworst") || nameLow.includes("popcorn")) {
      if (week <= 52) {
        return {
          shape: "prohibited",
          shapeLabel: "🚫 Verboden onder 1 jaar",
          ageLabel: "Zout & verstikking",
          rule: "Geef géén knakworst/rookworst (te veel zout) en géén popcorn (verstikkingsgevaar) onder 1 jaar!",
          svg: CUT_SVGS.prohibited
        };
      }
      if (week <= 208) {
        return {
          shape: "quarters",
          shapeLabel: "🔪 Worst in lengte in 4en • Geen popcorn",
          ageLabel: "Anti-verstikking (<4 jr)",
          rule: "Snijd knakworst ALTIJD in de lengte in vieren (nooit ronde schijfjes!). Geef géén popcorn onder 4 jaar",
          svg: CUT_SVGS.quarters
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🍿 Rustig zittend aan tafel",
        ageLabel: "Vanaf 4–5 jaar",
        rule: "Knakworst en popcorn vanaf 4–5 jaar uitsluitend rustig zittend eten (nooit tijdens het rennen of spelen)",
        svg: CUT_SVGS.plate
      };
    }

    // 22. Smeerleverworst, Paté & Rauw Vlees/Vis
    if (fid === "fd-liver-raw" || nameLow.includes("leverworst") || nameLow.includes("paté") || nameLow.includes("rauw")) {
      if (week <= 208) {
        return {
          shape: "spread",
          shapeLabel: "🥪 Max. 1× p/w • Géén rauw vlees/vis",
          ageLabel: "Vitamine A & Hygiëne (<4 jr)",
          rule: "Voedingscentrum: max. 1 boterham smeerleverworst/paté per week. Rauw vlees (filet americain/tartaar) en gerookte zalm pas vanaf 4 jaar!",
          svg: CUT_SVGS.spread
        };
      }
      return {
        shape: "plate",
        shapeLabel: "🥪 Met mate op volkorenbrood",
        ageLabel: "Wissel beleg af (4–12 jr)",
        rule: "Smeerleverworst niet dagelijks geven; let bij vlees en vis in de lunchtrommel op goede koeling",
        svg: CUT_SVGS.plate
      };
    }

    // Algemene fallback op basis van leeftijd
    if (week <= 23) {
      return {
        shape: "puree",
        shapeLabel: "🥄 Gladde Oefenpuree",
        ageLabel: "Zijdezacht zonder stukjes",
        rule: "Stoom gaar en pureer met kookvocht tot yoghurtdikte",
        svg: CUT_SVGS.puree
      };
    }

    if (week <= 36) {
      return {
        shape: "spear",
        shapeLabel: "🥢 Vingerlange reep (5–7 cm)",
        ageLabel: "Zacht gestoomd",
        rule: "Snijd 2 vingers breed; moet knijpbaar zijn tussen je vingers",
        svg: CUT_SVGS.spear
      };
    }

    if (week <= 52) {
      return {
        shape: "dices",
        shapeLabel: "🎲 Blokjes 1×1 cm",
        ageLabel: "Pincetgreep (8–12m)",
        rule: "Snijd in zachte hapklare blokjes die je baby met duim en wijsvinger kan pakken",
        svg: CUT_SVGS.dices
      };
    }

    if (week <= 208) {
      return {
        shape: "fork",
        shapeLabel: "🍴 Hapklare stukjes (vorkje)",
        ageLabel: "Dreumes & Peuter (1–3 jr)",
        rule: "Mee-eten met de gezinsmaaltijd in stukjes om zelf met een vorkje of lepel te eten",
        svg: CUT_SVGS.fork
      };
    }

    return {
      shape: "plate",
      shapeLabel: "🍽️ Gezinsmaaltijd & Schooltrommel",
      ageLabel: "Gezonde portie (4–12 jr)",
      rule: "Gewoon mee-eten aan tafel of mee in de broodtrommel naar school",
      svg: CUT_SVGS.plate
    };
  }

  function buildFoodCardHtml(f, week, stage, store) {
    const prep = getPrepForWeek(f, week);
    const cutInfo = getFoodCutInfo(f, week, prep);
    const status = store.triedFoods[f.id] || "";
    const rawPrac = Number(store.foodPracticeCounts[f.id] || 0);
    const pracCount = Math.max(0, Math.min(10, status === "retry" && rawPrac === 0 ? 1 : rawPrac));
    const showPractice = prep.ok && (status === "retry" || (pracCount > 0 && status !== "loved"));
    const minAgeLabel = f.minAgeMonths >= 12 ? "1 jaar (12 maanden)" : `${f.minAgeMonths} maanden`;

    return `
      <article class="item-card ${prep.ok ? "" : "item-card-wait"}">
        <div class="item-card-top">
          <h3 class="item-title">${f.icon} ${escapeHtml(f.name)}</h3>
          <span class="pill-small ${prep.ok ? "pill-ok" : "pill-wait"}">
            ${escapeHtml(prep.badgeText)}
          </span>
        </div>
        <small class="subtle-hint">${escapeHtml(f.nutrients)}</small>

        <!-- Visuele SVG Snijgids badge -->
        <div class="food-cut-visual-badge ${cutInfo.shape === "prohibited" ? "is-prohibited" : ""}">
          <div class="food-cut-svg-wrap" aria-hidden="true">
            ${cutInfo.svg}
          </div>
          <div class="food-cut-details">
            <div class="food-cut-header-row">
              <span class="food-cut-shape-tag">${escapeHtml(cutInfo.shapeLabel)}</span>
              <span class="food-cut-age-tag">${escapeHtml(cutInfo.ageLabel)}</span>
            </div>
            <div class="food-cut-instruction">
              <strong>${escapeHtml(cutInfo.rule)}</strong>
            </div>
            <div class="food-cut-subtext">${escapeHtml(prep.text)}</div>
          </div>
        </div>

        ${
          prep.ok
            ? `
        <div class="react-row">
          <button type="button" class="react-btn ${status === "loved" ? "active" : ""}" data-fid="${f.id}" data-r="loved">😍 Lekker</button>
          <button type="button" class="react-btn ${status === "tried" ? "active" : ""}" data-fid="${f.id}" data-r="tried">🙂 Geproefd</button>
          <button type="button" class="react-btn ${status === "retry" ? "active" : ""}" data-fid="${f.id}" data-r="retry">🤨 Nog oefenen</button>
        </div>`
            : `
        <div class="locked-stage-bar">
          🔒 Nog niet geven in fase ${escapeHtml(stage.shortLabel)} — veilig vanaf ${escapeHtml(minAgeLabel)}
        </div>`
        }
        ${
          showPractice
            ? `
        <div class="practice-counter-box ${pracCount >= 10 ? "is-complete" : ""}">
          <div class="practice-counter-top">
            <span>🔄 <strong>Smaakgewenning:</strong> ${pracCount}/10 keer geproefd${pracCount >= 10 ? " 🎉" : ""}</span>
            <div class="practice-controls">
              <button type="button" class="practice-step-btn" data-prac-fid="${f.id}" data-prac-step="-1" aria-label="1 keer minder">−</button>
              <button type="button" class="practice-step-btn" data-prac-fid="${f.id}" data-prac-step="1" aria-label="1 keer extra geproefd">+1x</button>
            </div>
          </div>
          <div class="practice-bar-track">
            <div class="practice-bar-fill" style="width: ${Math.min(100, pracCount * 10)}%"></div>
          </div>
        </div>`
            : ""
        }
      </article>
    `;
  }

  function renderFoodLookup(week) {
    const grid = document.getElementById("foodEncyclopediaGrid");
    if (!grid) return;

    const stage = getStageForWeek(week);
    const store = getActiveStore();
    const q = state.searchQuery.trim().toLowerCase();
    const cat = state.foodCategoryFilter || "all";

    if (state.foodStatusFilter === "wait") {
      state.foodStatusFilter = "all";
    }
    const statusFilter = state.foodStatusFilter || "all";

    const headerTitleEl = document.getElementById("lookupHeaderTitle");
    const subtitleEl = document.getElementById("lookupSubtitleHint");
    const stageCountPillEl = document.getElementById("lookupStageCountPill");
    const phaseBannerEl = document.getElementById("lookupPhaseBanner");
    const searchAndFiltersWrapEl = document.getElementById("foodSearchAndFiltersWrap");
    const catBlockEl = document.getElementById("foodCategoryFilterBlock");
    const catContainer = document.getElementById("foodCategoryFilters");
    const statusContainer = document.getElementById("foodStatusFilters");
    const waitDetailsEl = document.getElementById("waitFoodsDetails");
    const waitSummaryTitleEl = document.getElementById("waitFoodsSummaryTitle");
    const waitCountPillEl = document.getElementById("waitFoodsCountPill");
    const waitIntroHintEl = document.getElementById("waitFoodsIntroHint");
    const waitGridEl = document.getElementById("waitFoodsGrid");

    const suitableAllInStage = DATA.foodDatabase.filter((f) => getPrepForWeek(f, week).ok);
    const waitAllInStage = DATA.foodDatabase.filter((f) => !getPrepForWeek(f, week).ok);

    if (headerTitleEl) {
      headerTitleEl.textContent =
        week > 208
          ? `🍽️ Voedings- & Trommelwijzer (${stage.shortLabel})`
          : `🔍 Eet- & Snijgids (${stage.shortLabel})`;
    }
    if (stageCountPillEl) {
      stageCountPillEl.textContent =
        week <= 16
          ? `🍼 100% Melk • ${stage.shortLabel}`
          : `${suitableAllInStage.length} geschikt • ${stage.shortLabel}`;
    }

    // 1. Fase 0–3 maanden (Week 1–16): 100% Melkvoeding — geen zoekbalk of vaste-voedingsfilters tonen
    if (week <= 16) {
      if (subtitleEl) {
        subtitleEl.textContent =
          "Tot 4 maanden (Week 17) drinkt je baby uitsluitend borst- of flesvoeding en geef je nog geen vaste hapjes.";
      }
      if (phaseBannerEl) {
        phaseBannerEl.classList.remove("hidden");
        phaseBannerEl.innerHTML = `
          <div class="lookup-phase-summary-grid">
            <div class="lookup-phase-summary-item">
              <span class="lookup-phase-summary-label">🍼 Nu bij ${escapeHtml(stage.shortLabel)} (Week ${week})</span>
              <strong>100% Melkvoeding — nog géén vaste hapjes</strong>
              <span>De darmpjes zijn tot 4 maanden alleen rijp voor borst- of kunstvoeding (+ dagelijks vitamine D/K). Proefknoppen zijn nu vergrendeld.</span>
            </div>
            <div class="lookup-phase-summary-item">
              <span class="lookup-phase-summary-label">🥄 Straks vanaf 4 maanden (Week 17)</span>
              <strong>Start Eerste Oefenhapjes (8 milde producten)</strong>
              <span>Vanaf 4–5 maanden start je met de eerste glad gepureerde groente-, fruit- en pinda/ei-oefenhapjes.</span>
            </div>
          </div>
          <div class="lookup-phase-banner-actions">
            <button type="button" class="chip" id="jumpTo4MonthsLookupBtn">
              🥄 Bekijk fase 4–5 maanden (Start Oefenhapjes) →
            </button>
          </div>
        `;
        const jump4mBtn = document.getElementById("jumpTo4MonthsLookupBtn");
        if (jump4mBtn) {
          jump4mBtn.addEventListener("click", () => setWeek(17, true));
        }
      }
      if (searchAndFiltersWrapEl) searchAndFiltersWrapEl.classList.add("hidden");
      if (catBlockEl) catBlockEl.classList.add("hidden");
      if (statusContainer) statusContainer.classList.add("hidden");
      if (waitDetailsEl) waitDetailsEl.classList.add("hidden");
      const cutBannerEl = document.getElementById("lookupPhaseCutBanner");
      if (cutBannerEl) {
        cutBannerEl.classList.add("hidden");
        cutBannerEl.innerHTML = "";
      }
      grid.innerHTML = "";
      return;
    }

    // 2. Vanaf 4 maanden (Week 17+): toon zoekbalk + de 2 overzichtelijke filterlagen
    if (phaseBannerEl) {
      phaseBannerEl.classList.add("hidden");
      phaseBannerEl.innerHTML = "";
    }
    const cutBannerEl = document.getElementById("lookupPhaseCutBanner");
    if (cutBannerEl) {
      const cutData = getCutVisualData(stage.cutType, stage);
      const cutBannerTag =
        week > 208
          ? `🍽️ Bord- & Trommelwijzer ${escapeHtml(stage.shortLabel)}`
          : `🔪 Snijadvies ${escapeHtml(stage.shortLabel)}`;
      cutBannerEl.classList.remove("hidden");
      cutBannerEl.innerHTML = `
        <div class="lookup-cut-highlight">
          <div class="lookup-cut-svg-box" aria-hidden="true">${cutData.svg}</div>
          <div class="lookup-cut-text">
            <div class="lookup-cut-top">
              <span class="food-cut-shape-tag">${cutBannerTag}</span>
              <strong class="lookup-cut-title">${escapeHtml(cutData.title)}</strong>
            </div>
            <p class="lookup-cut-desc">${escapeHtml(cutData.desc)}</p>
          </div>
        </div>
      `;
    }
    if (searchAndFiltersWrapEl) searchAndFiltersWrapEl.classList.remove("hidden");
    if (catBlockEl) catBlockEl.classList.remove("hidden");
    if (statusContainer) statusContainer.classList.remove("hidden");

    if (subtitleEl) {
      if (week <= 23) {
        subtitleEl.textContent = `🥄 ${suitableAllInStage.length} veilige oefenhapjes voor 4–5 maanden — kies een productgroep en vink je proeflijst bij (de ${waitAllInStage.length} producten vanaf 6, 9 of 12 mnd staan onderaan).`;
      } else if (week <= 52) {
        subtitleEl.textContent = `🥑 ${suitableAllInStage.length} geschikte producten voor ${stage.shortLabel} — bekijk de veilige snijvorm en vink je proeflijst bij (producten voor later staan onderaan).`;
      } else if (week <= 208) {
        subtitleEl.textContent = `🍽️ Alle ${suitableAllInStage.length} producten zijn geschikt voor ${stage.shortLabel} — bekijk de veilige peuter-serveervorm en vink je proeflijst bij.`;
      } else {
        subtitleEl.textContent = `🥪 Alle ${suitableAllInStage.length} producten zijn geschikt voor ${stage.shortLabel} — bekijk gezonde porties voor aan tafel, het 10-uurtje en de schooltrommel.`;
      }
    }

    // Filterlaag 1: Productgroep-chips (toont aantallen van geschikte producten in déze fase)
    if (catContainer) {
      const catChipNames = {
        all: "🍽️ Alle geschikte",
        Groente: "🥦 Groente",
        Fruit: "🍓 Fruit & Vet",
        Eiwit: "🥚 Eiwit & IJzer",
        Zuivel: "🧀 Granen & Zuivel"
      };
      catContainer.querySelectorAll("[data-food-cat]").forEach((chip) => {
        const k = chip.dataset.foodCat;
        const count = DATA.foodDatabase.filter(
          (f) => matchFoodCategory(f, k) && matchFoodStatus(f, statusFilter, week, store)
        ).length;
        const totalSuitableInCat = DATA.foodDatabase.filter(
          (f) => matchFoodCategory(f, k) && getPrepForWeek(f, week).ok
        ).length;
        chip.classList.toggle("active", k === cat);
        chip.classList.toggle("chip-zero", k !== "all" && totalSuitableInCat === 0);
        chip.textContent = `${catChipNames[k] || k} (${count})`;
      });
    }

    // Filterlaag 2: Gelabelde Segmented Control Balk voor Proefstatus (binnen de gekozen productgroep)
    if (statusContainer) {
      const statusChipNames = {
        all: "Alles",
        todo: "✨ Te proeven",
        retry: "🤨 Oefenen",
        done: "🙂 Geproefd"
      };
      statusContainer.querySelectorAll("[data-food-status]").forEach((btn) => {
        const k = btn.dataset.foodStatus;
        const count = DATA.foodDatabase.filter(
          (f) => matchFoodCategory(f, cat) && matchFoodStatus(f, k, week, store)
        ).length;
        btn.classList.toggle("active", k === statusFilter);
        btn.textContent = `${statusChipNames[k] || k} (${count})`;
      });
    }

    // Uitklapbare sectie onderaan voor producten die pas in een latere fase (6+, 9+ of 12+ mnd) mogen
    const waitListForCat = waitAllInStage.filter((f) => matchFoodCategory(f, cat));
    if (waitDetailsEl && waitGridEl) {
      if (waitAllInStage.length === 0) {
        waitDetailsEl.classList.add("hidden");
      } else {
        waitDetailsEl.classList.remove("hidden");
        const itemsToRenderInWait = waitListForCat.length > 0 ? waitListForCat : waitAllInStage;
        if (waitSummaryTitleEl) {
          waitSummaryTitleEl.textContent =
            week <= 23
              ? "⏳ Nog niet geschikt bij 4–5 maanden (bekijk producten vanaf 6, 9 of 12 maanden)"
              : week <= 36
                ? "🚫 Nog niet geschikt bij 6–8 maanden (Rozijntjes vanaf 9m • Honing & Worstjes vanaf 12m)"
                : "🚫 Nog niet geschikt onder 1 jaar (Honing & Worstjes/Popcorn — pas vanaf 12 maanden)";
        }
        if (waitCountPillEl) {
          waitCountPillEl.textContent = `${itemsToRenderInWait.length} ${itemsToRenderInWait.length === 1 ? "product" : "producten"}`;
        }
        if (waitIntroHintEl) {
          waitIntroHintEl.textContent =
            week <= 23
              ? "Onderstaande producten geef je bij 4–5 maanden nog niet als maaltijd of los hapje. Ze komen aan bod vanaf 6 maanden (zoals brood, pasta, vlees/vis, yoghurt, bessen en druiven), 9 maanden (rozijntjes) of 12 maanden (honing)."
              : "Geef onder de 1 jaar (12 maanden) nog geen honing (botulisme-gevaar) en geen zoute worstjes of popcorn.";
        }
        waitGridEl.innerHTML = itemsToRenderInWait.map((f) => buildFoodCardHtml(f, week, stage, store)).join("");
      }
    }

    // Slimme Kruiszoekresultaten (#lookupCrossResults) over Recepten, Allergenen, Spelletjes & SOS
    const crossBoxEl = document.getElementById("lookupCrossResults");
    if (crossBoxEl) {
      if (q.length >= 2) {
        const crossHits = [];
        // 1. Allergenen
        (DATA.allergens || []).forEach((alg) => {
          const hay = `${alg.name} ${alg.whyEarly || ""} ${alg.safePrep6to12m || ""}`.toLowerCase();
          if (hay.includes(q)) {
            crossHits.push({
              type: "allergen",
              id: alg.id,
              icon: alg.icon || "🥜",
              title: alg.name,
              sub: "Top 9 Allergenen Afvinklijst",
              badge: "Naar Allergenen ↓"
            });
          }
        });
        // 2. 5-Minuten Recepten in huidige fase (of alle fasen)
        const stageRecs = ((stage.nutrition && stage.nutrition.recipes) || stage.recipes || []).map((r, idx) => ({
          ...r,
          id: `rec-${stage.id}-${idx}`
        }));
        stageRecs.forEach((r) => {
          const hay = `${r.title} ${(r.ingredients || []).join(" ")} ${r.steps || ""}`.toLowerCase();
          if (hay.includes(q)) {
            crossHits.push({
              type: "recipe",
              id: r.id,
              icon: "🍳",
              title: r.title,
              sub: `5-Minuten Recept (${stage.shortLabel} • ${r.prepTime})`,
              badge: "Open bij Voeding →"
            });
          }
        });
        // 3. Leerspelletjes in huidige fase
        (stage.games || []).forEach((g) => {
          const hay = `${g.title} ${g.howToPlay || ""} ${g.whyItMatters || ""}`.toLowerCase();
          if (hay.includes(q)) {
            crossHits.push({
              type: "game",
              id: g.id,
              icon: "🎲",
              title: g.title,
              sub: `Leerspelletje (${stage.shortLabel})`,
              badge: "Open bij Spel →"
            });
          }
        });
        // 4. SOS-kaarten
        (DATA.sosCards || []).forEach((sc) => {
          const hay = `${sc.title} ${sc.adviceBabyUnder3m || ""} ${sc.adviceBaby3mTo1y || ""} ${sc.adviceToddlerAndUp || ""}`.toLowerCase();
          if (hay.includes(q)) {
            crossHits.push({
              type: "sos",
              id: sc.id,
              icon: sc.icon || "🆘",
              title: sc.title,
              sub: "SOS Eerste Hulp bij Lastige Momenten",
              badge: "Open bij SOS →"
            });
          }
        });

        if (crossHits.length > 0) {
          crossBoxEl.classList.remove("hidden");
          crossBoxEl.innerHTML = `
            <h4 class="cross-results-title">💡 Ook gevonden in Recepten, Allergenen, Spel &amp; SOS (${crossHits.length}):</h4>
            <div class="cross-results-grid">
              ${crossHits
                .slice(0, 6)
                .map(
                  (h, idx) => `
                <button type="button" class="cross-result-btn" data-cross-idx="${idx}">
                  <div class="cross-result-left">
                    <span class="cross-result-icon" aria-hidden="true">${h.icon}</span>
                    <div class="cross-result-text">
                      <strong>${escapeHtml(h.title)}</strong>
                      <span>${escapeHtml(h.sub)}</span>
                    </div>
                  </div>
                  <span class="cross-result-badge">${escapeHtml(h.badge)}</span>
                </button>
              `
                )
                .join("")}
            </div>
          `;
          crossBoxEl.querySelectorAll("[data-cross-idx]").forEach((btn) => {
            btn.addEventListener("click", () => {
              const hit = crossHits[Number(btn.dataset.crossIdx)];
              if (!hit) return;
              if (hit.type === "allergen") {
                const algDet = document.getElementById("allergensDetails");
                if (algDet) {
                  algDet.open = true;
                  algDet.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              } else if (hit.type === "recipe") {
                state.recipeMealFilter = "all";
                state.recipesExpanded = true;
                setView("food", false);
                renderStageRecipes(stage);
                setTimeout(() => {
                  const recCard = document.getElementById("stageRecipesCard");
                  if (recCard) recCard.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 60);
              } else if (hit.type === "game") {
                state.gameCategoryFilter = "all";
                state.gamesExpanded = true;
                setView("games", true);
                renderGames(stage);
              } else if (hit.type === "sos") {
                state.activeSosCardId = hit.id;
                setView("sos", true);
                renderSosAndCb(stage, week);
              }
            });
          });
        } else {
          crossBoxEl.classList.add("hidden");
          crossBoxEl.innerHTML = "";
        }
      } else {
        crossBoxEl.classList.add("hidden");
        crossBoxEl.innerHTML = "";
      }
    }

    // Hoofdlijst: geschikte producten voor deze fase (plus directe treffers als de ouder specifiek een 'wacht'-product zoekt, bijv. 'honing')
    const list = DATA.foodDatabase.filter((f) => {
      if (!matchFoodCategory(f, cat)) return false;

      let searchable = [
        f.name,
        f.category,
        f.nutrients,
        f.prep4to5m,
        f.prep6to8m,
        f.prep9to12m,
        f.prep1to3y,
        f.prep4to12y
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      // Veelvoorkomende enkelvoud/meervoud synoniemen voor soepele zoekervaring
      if (searchable.includes("druiven")) searchable += " druif";
      if (searchable.includes("aardbeien")) searchable += " aardbei";
      if (searchable.includes("bessen")) searchable += " bes";
      if (searchable.includes("tomaten") || searchable.includes("tomaatjes")) searchable += " tomaat";
      if (searchable.includes("noten")) searchable += " noot";
      if (searchable.includes("eieren")) searchable += " ei";
      if (searchable.includes("rozijntjes")) searchable += " rozijn rozijnen krenten";
      if (searchable.includes("knakworst")) searchable += " worst worstje rookworst";

      if (q) {
        if (!searchable.includes(q)) return false;
        if (statusFilter === "todo" || statusFilter === "retry" || statusFilter === "done") {
          return matchFoodStatus(f, statusFilter, week, store);
        }
        return true;
      }

      return matchFoodStatus(f, statusFilter, week, store);
    });

    if (list.length === 0) {
      let emptyHint = `Geen voedingsmiddel gevonden voor "${escapeHtml(state.searchQuery)}".`;

      if (week <= 23 && cat === "Zuivel" && !q) {
        emptyHint =
          "⏳ In fase 4–5 maanden zijn granen en zuivel (zoals brood, pasta, maisvinger, volkoren cracker, kaas, yoghurt en honing) nog niet geschikt als maaltijd; je start hiermee vanaf 6 maanden. Ze staan hier direct onder uitgeklapt! (Tip: 1 theelepeltje fijne baby-granenpap door melk of fruit mag wel om aan gluten te wennen.)";
        if (waitDetailsEl) waitDetailsEl.open = true;
      } else if (statusFilter === "retry") {
        emptyHint = "Geen voedingsmiddelen gemarkeerd als '🤨 Nog oefenen' binnen deze selectie.";
      } else if (statusFilter === "done") {
        emptyHint = "Nog geen voedingsmiddelen afgevinkt als geproefd of lekker binnen deze selectie.";
      } else if (statusFilter === "todo") {
        emptyHint = "Super! Alle geschikte producten binnen deze selectie voor deze fase zijn al geproefd.";
      }

      const hasActiveFilters = cat !== "all" || statusFilter !== "all" || Boolean(q);
      grid.innerHTML = `
        <div class="minimal-card">
          <p class="subtle-hint">${emptyHint}</p>
          ${
            hasActiveFilters
              ? `<div class="empty-state-action"><button type="button" class="chip" id="resetFoodFiltersBtn">🔄 Toon alle ${suitableAllInStage.length} geschikte producten (${stage.shortLabel})</button></div>`
              : ""
          }
        </div>
      `;
      const resetBtn = document.getElementById("resetFoodFiltersBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          state.foodCategoryFilter = "all";
          state.foodStatusFilter = "all";
          state.searchQuery = "";
          const searchInput = document.getElementById("globalSearchInput");
          if (searchInput) searchInput.value = "";
          if (waitDetailsEl) waitDetailsEl.open = false;
          renderFoodLookup(state.currentWeek);
        });
      }
      return;
    }

    // Progressive disclosure op mobiele schermen (<= 720px): toon standaard de eerste 4 producten
    const toggleWrap = document.getElementById("foodsToggleWrap");
    const expandBtn = document.getElementById("toggleFoodsExpandBtn");
    const isMobile = window.innerWidth <= 720;
    const FOOD_MOBILE_LIMIT = 4;
    const canExpand = isMobile && list.length > FOOD_MOBILE_LIMIT && !q;

    let visibleList = list;
    if (canExpand && !state.foodsExpanded) {
      visibleList = list.slice(0, FOOD_MOBILE_LIMIT);
    }

    if (toggleWrap && expandBtn) {
      if (canExpand) {
        toggleWrap.classList.remove("hidden");
        expandBtn.setAttribute("aria-expanded", state.foodsExpanded ? "true" : "false");
        expandBtn.innerHTML = state.foodsExpanded
          ? `▲ Minder producten tonen (toon top ${FOOD_MOBILE_LIMIT})`
          : `▼ Bekijk alle ${list.length} producten (${list.length - FOOD_MOBILE_LIMIT} overig)`;
      } else {
        toggleWrap.classList.add("hidden");
      }
    }

    if (stageCountPillEl && week > 16) {
      stageCountPillEl.textContent =
        canExpand && !state.foodsExpanded
          ? `${visibleList.length} van ${list.length} getoond • ${stage.shortLabel}`
          : `${list.length} geschikt • ${stage.shortLabel}`;
    }

    grid.innerHTML = visibleList.map((f) => buildFoodCardHtml(f, week, stage, store)).join("");

    grid.querySelectorAll(".react-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const fid = btn.dataset.fid;
        const r = btn.dataset.r;
        if (store.triedFoods[fid] === r) {
          delete store.triedFoods[fid];
        } else {
          store.triedFoods[fid] = r;
          if (r === "retry" && !store.foodPracticeCounts[fid]) {
            store.foodPracticeCounts[fid] = 1;
          }
        }
        saveState();
        renderAll(false);
      });
    });

    grid.querySelectorAll("[data-prac-fid]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const fid = btn.dataset.pracFid;
        const step = Number(btn.dataset.pracStep || 0);
        const cur = Number(store.foodPracticeCounts[fid] || (store.triedFoods[fid] === "retry" ? 1 : 0));
        const next = Math.max(0, Math.min(10, cur + step));
        if (next === 0) delete store.foodPracticeCounts[fid];
        else store.foodPracticeCounts[fid] = next;
        saveState();
        renderFoodLookup(state.currentWeek);
      });
    });
  }

  function renderAllergens(week) {
    const grid = document.getElementById("allergensGrid");
    if (!grid) return;

    const stage = getStageForWeek(week);
    const detailsEl = document.getElementById("allergensDetails");
    const summaryTitleEl = document.getElementById("allergensSummaryTitle");
    const introHintEl = document.getElementById("allergensIntroHint");
    const protocolBoxEl = document.getElementById("allergenProtocolBox");

    // Klap de Top 9 Allergenen automatisch in bij 0–3 mnd (alleen melk) en boven 2 jaar, en open bij 4–24 mnd
    if (detailsEl && lastAllergensAutoStageId !== stage.id) {
      lastAllergensAutoStageId = stage.id;
      detailsEl.open = week >= 17 && week <= 104;
    }

    // Toon het baby-opbouwschema (¼–½ tl proefhapje & eczeem-uitleg) alleen bij 4–24 maanden
    if (protocolBoxEl) {
      protocolBoxEl.classList.toggle("hidden", week <= 16 || week > 104);
    }

    if (summaryTitleEl && introHintEl) {
      if (week <= 16) {
        summaryTitleEl.textContent = "🥜 Top 9 Allergenen Gids (start vanaf 4 maanden)";
        introHintEl.textContent =
          "Tot 4 maanden (Week 17) krijgt je baby uitsluitend borst- of kunstvoeding en vink je nog géén allergenen af. Vanaf 4 maanden start je stap voor stap met pinda en ei.";
      } else if (week <= 23) {
        summaryTitleEl.textContent = "🥜 Top 9 Allergenen Afvinklijst (4 geschikt bij 4–5 mnd • 5 vanaf 6 mnd)";
        introHintEl.textContent =
          "Advies 4–5 maanden: start in deze fase eerst met gladde Pinda, Kippenei, Notenpasta en een lepeltje fijne Gluten-pap. De overige 5 allergenen (yoghurt/zuivel, sesam, vis, soja en schaaldieren) volgen vanaf 6 maanden.";
      } else if (week <= 52) {
        summaryTitleEl.textContent = "🥜 Top 9 Allergenen Afvinklijst (6–12 maanden)";
        introHintEl.textContent =
          "Advies: start tussen 4 en 8 maanden met pinda en ei, breid vanaf 6 maanden uit met de overige allergenen en houd ze na gewenning wekelijks op het menu.";
      } else if (week <= 208) {
        summaryTitleEl.textContent = "🥜 Top 9 Allergenen & Tolerantie-Onderhoud (1–3 jaar)";
        introHintEl.textContent =
          "Bij dreumesen en peuters draait het om wekelijkse variatie (zoals 100% pindakaas/notenpasta, ei, vis, zuivel en hummus) én veiligheid: geef onder 4 jaar nog géén hele noten.";
      } else {
        summaryTitleEl.textContent = `🥜 Top 9 Allergenen & Gezonde Variatie (${stage.shortLabel})`;
        introHintEl.textContent =
          "Op de basisschoolleeftijd leveren ongezouten noten, pinda's, ei, vette vis, zuivel en volkoren granen belangrijke bouwstoffen voor groei en concentratie.";
      }
    }

    const store = getActiveStore();
    const toggleWrap = document.getElementById("allergensToggleWrap");
    const expandBtn = document.getElementById("toggleAllergensExpandBtn");
    const isMobile = window.innerWidth <= 720;
    const ALLERGEN_MOBILE_LIMIT = week <= 23 ? 2 : 3;
    const canExpand = isMobile && DATA.allergens.length > ALLERGEN_MOBILE_LIMIT;

    let visibleAllergens = DATA.allergens;
    if (canExpand && !state.allergensExpanded) {
      visibleAllergens = DATA.allergens.slice(0, ALLERGEN_MOBILE_LIMIT);
    }

    if (toggleWrap && expandBtn) {
      if (canExpand) {
        toggleWrap.classList.remove("hidden");
        expandBtn.setAttribute("aria-expanded", state.allergensExpanded ? "true" : "false");
        expandBtn.innerHTML = state.allergensExpanded
          ? `▲ Minder allergenen tonen (toon top ${ALLERGEN_MOBILE_LIMIT}: Pinda & Ei)`
          : `▼ Bekijk alle ${DATA.allergens.length} allergenen (${DATA.allergens.length - ALLERGEN_MOBILE_LIMIT} overig)`;
      } else {
        toggleWrap.classList.add("hidden");
      }
    }

    const currentIsoWeekKey = getCurrentIsoWeekKey();

    grid.innerHTML = visibleAllergens
      .map((alg) => {
        const rawArr = store.allergenExposures[alg.id] || [false, false, false];
        const count = Math.min(3, rawArr.filter(Boolean).length);
        const isSuitableNow = isAllergenSuitableForWeek(alg, week);
        const minM = alg.minAgeMonths || 4;
        const isGivenThisWeek = Boolean(
          store.allergenWeeklyGiven && store.allergenWeeklyGiven[alg.id] === currentIsoWeekKey
        );

        let prep = alg.safePrep6to12m;
        let ageLabel = "6–12 mnd";
        if (week <= 16) {
          prep =
            alg.safePrep0to3m ||
            "Wacht tot 4 maanden (Week 17). Tot 4 maanden krijgt je baby uitsluitend melkvoeding.";
          ageLabel = "0–3 mnd";
        } else if (week <= 23) {
          prep = alg.safePrep4to5m || alg.safePrep6to12m;
          ageLabel = "4–5 mnd";
        } else if (week <= 52) {
          prep = alg.safePrep6to12m;
          ageLabel = "6–12 mnd";
        } else if (week <= 208) {
          prep = alg.safePrep1to4y;
          ageLabel = "1–3 jaar";
        } else {
          prep = alg.safePrep4to12y || alg.safePrep1to4y;
          ageLabel = stage.shortLabel;
        }

        const badgeHtml = isSuitableNow
          ? `<span class="pill-small ${count === 3 ? "pill-ok" : ""}">${count === 3 ? "✅ 3/3 Gewend (1× p/w)" : `${count}/3 keer geproefd`}</span>`
          : `<span class="pill-small pill-wait">⏳ Vanaf ${minM} mnd</span>`;

        const stepHints =
          week <= 104
            ? [
                "Stap 1: Klein proefhapje (¼–½ tl op de ochtend/middag)",
                "Stap 2: Portie opbouwen (½–1 tl op een volgende dag)",
                "Stap 3: 3e keer zonder klachten (1 tl) — gewend! Houd 1× per week op het menu"
              ]
            : [
                "Stap 1: 1e keer zonder klachten gegeten",
                "Stap 2: 2e keer zonder klachten gegeten",
                "Stap 3: 3e keer zonder klachten gegeten — gewend! Houd wekelijks op het menu"
              ];

        const weeklyMaintenanceHtml =
          isSuitableNow && count === 3
            ? `
          <div class="allergen-weekly-row">
            <span class="allergen-weekly-label">🔄 Wekelijks onderhoud (1× p/w op het menu):</span>
            <button type="button" class="allergen-weekly-btn ${isGivenThisWeek ? "is-given" : ""}" data-alg-weekly="${alg.id}" title="Vink wekelijks aan of dit allergeen deze week op het menu stond">
              ${isGivenThisWeek ? "✓ Deze week gegeven" : "○ Deze week geven"}
            </button>
          </div>`
            : "";

        return `
        <article class="item-card ${isSuitableNow ? "" : "item-card-wait"}">
          <div class="item-card-top">
            <h3 class="item-title">${alg.icon} ${escapeHtml(alg.name)}</h3>
            ${badgeHtml}
          </div>
          ${alg.whyEarly && week <= 104 ? `<small class="subtle-hint">${escapeHtml(alg.whyEarly)}</small>` : ""}
          <div class="highlight-note ${isSuitableNow ? "" : "highlight-note-wait"}">
            <strong>${week > 208 ? "🍽️" : "🥄"} Advies (${escapeHtml(ageLabel)}):</strong> ${escapeHtml(prep)}
          </div>
          ${
            isSuitableNow
              ? `
          <div class="react-row" role="group" aria-label="Stapsgewijs 3 keer proeven voor ${escapeHtml(alg.name)}">
            ${[0, 1, 2]
              .map((i) => {
                const isDone = i < count;
                const isNext = i === count;
                const isLocked = i > count;
                const stateClass = isDone
                  ? "active is-step-done"
                  : isNext
                    ? "is-step-next"
                    : "is-step-locked";
                const icon = isDone ? "✓" : isNext ? "○" : "🔒";
                const titleText = isLocked
                  ? `Vink eerst de ${i}e keer aan voordat je de ${i + 1}e keer kunt afvinken`
                  : isDone
                    ? `${stepHints[i]} (tik om weer uit te vinken)`
                    : stepHints[i];
                return `
              <button type="button" class="react-btn ${stateClass}" data-alg="${alg.id}" data-idx="${i}" ${isLocked ? "disabled" : ""} title="${escapeHtml(titleText)}">
                ${icon} ${i + 1}e keer
              </button>
            `;
              })
              .join("")}
          </div>
          ${weeklyMaintenanceHtml}`
              : `
          <div class="locked-stage-bar">
            🔒 Nog niet geven bij ${escapeHtml(stage.shortLabel)} — veilig starten vanaf ${minM} maanden
          </div>`
          }
        </article>
      `;
      })
      .join("");

    grid.querySelectorAll("[data-alg]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        const aid = btn.dataset.alg;
        const idx = Number(btn.dataset.idx);
        const curArr = store.allergenExposures[aid] || [false, false, false];
        const curCount = Math.min(3, curArr.filter(Boolean).length);

        let nextCount = curCount;
        if (idx === curCount) {
          nextCount = idx + 1;
        } else if (idx < curCount) {
          nextCount = idx;
        } else {
          return;
        }

        store.allergenExposures[aid] = [nextCount >= 1, nextCount >= 2, nextCount >= 3];
        saveState();
        renderAllergens(state.currentWeek);
        updateCounterBadges();
      });
    });

    grid.querySelectorAll("[data-alg-weekly]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const aid = btn.dataset.algWeekly;
        if (!store.allergenWeeklyGiven) store.allergenWeeklyGiven = {};
        if (store.allergenWeeklyGiven[aid] === currentIsoWeekKey) {
          delete store.allergenWeeklyGiven[aid];
        } else {
          store.allergenWeeklyGiven[aid] = currentIsoWeekKey;
        }
        saveState();
        renderAllergens(state.currentWeek);
      });
    });

    updateCounterBadges();
  }

  function updateCounterBadges() {
    const store = getActiveStore();
    const week = state.currentWeek;
    const validFoodIds = new Set(DATA.foodDatabase.map((f) => f.id));
    const triedCount = Object.keys(store.triedFoods || {}).filter(
      (k) => validFoodIds.has(k) && Boolean(store.triedFoods[k])
    ).length;
    const algCount = Object.values(store.allergenExposures || {}).filter(
      (a) => Array.isArray(a) && a.some(Boolean)
    ).length;

    const pillEl = document.getElementById("allergenProgressPill");
    if (pillEl) {
      if (week <= 16) {
        pillEl.textContent = "⏳ Start vanaf 4 mnd";
      } else if (week <= 23) {
        const suitableAlgs = DATA.allergens.filter((a) => isAllergenSuitableForWeek(a, week));
        const startedSuitable = suitableAlgs.filter((a) => {
          const arr = store.allergenExposures && store.allergenExposures[a.id];
          return Array.isArray(arr) && arr.some(Boolean);
        }).length;
        pillEl.textContent = `${startedSuitable} / ${suitableAlgs.length} gestart (4–5 mnd)`;
      } else {
        pillEl.textContent = `${algCount} / 9 gestart`;
      }
    }

    document.getElementById("loggedCountBadge").textContent = triedCount + algCount;
  }

  // =========================================================================
  // 10. TAB 5: SOS "EERSTE HULP" & CONSULTATIEBUREAU / RVP / TANDJES
  // =========================================================================
  function renderSosAndCb(stage, week) {
    const sosHeaderStagePillEl = document.getElementById("sosHeaderStagePill");
    const sosHeaderTitleEl = document.getElementById("sosHeaderTitle");
    const cbTitleEl = document.getElementById("cbCardTitle");
    const cbLabel = document.getElementById("cbStageLabel");
    const cbSub = document.getElementById("cbAgeSubtitle");
    const cbGrid = document.getElementById("healthCbGrid");
    const sosContainer = document.getElementById("sosCardsContainer");
    const sosSub = document.getElementById("sosAgeSubtitle");
    const sosStageLabelEl = document.getElementById("sosStageLabel");
    if (!cbGrid || !sosContainer) return;

    const isSchoolAge = week > 208;
    if (sosHeaderStagePillEl) sosHeaderStagePillEl.textContent = stage.shortLabel;
    if (sosHeaderTitleEl) {
      sosHeaderTitleEl.textContent = isSchoolAge
        ? `SOS Eerste Hulp & Schoolarts (${stage.shortLabel})`
        : `SOS Eerste Hulp & Consultatiebureau (${stage.shortLabel})`;
    }
    if (cbTitleEl) {
      cbTitleEl.textContent = isSchoolAge
        ? "🏫 Schoolarts (JGZ), Vaccinaties & Gebit"
        : "🏥 Consultatiebureau, Vaccinaties & Tandjes";
    }
    if (cbLabel) cbLabel.textContent = stage.shortLabel;
    if (cbSub) {
      cbSub.textContent = isSchoolAge
        ? `Gezondheidsonderzoeken op de basisschool (JGZ), RVP-prikken en het wisselgebit voor fase ${stage.shortLabel} (${stage.ageRangeLabel}).`
        : `Controles, RVP-vaccinaties en gebitsontwikkeling voor fase ${stage.shortLabel} (${stage.ageRangeLabel}).`;
    }

    const h = stage.healthCB || {
      cbVisit: "Reguliere controle op aanvraag.",
      vaccines: "Geen standaard prikken in deze fase.",
      teeth: "Poets 2x per dag met fluoridepeuter-/kindertandpasta."
    };

    const formatCbBoxHtml = (rawStr) => {
      const parts = String(rawStr || "")
        .replace(/([.!?])\s+/g, "$1\n")
        .split(/\s*•\s*|\n+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length <= 1) {
        return `<p class="cb-item-text">${formatLeadOnlyHtml(parts[0] || rawStr)}</p>`;
      }
      return `<ul class="cb-bullet-list">${parts
        .map((p) => `<li>${formatLeadOnlyHtml(p)}</li>`)
        .join("")}</ul>`;
    };

    const cbFirstLabel = isSchoolAge
      ? `🏫 Schoolarts / JGZ (${escapeHtml(stage.shortLabel)})`
      : `🏥 Consultatiebureau / JGZ (${escapeHtml(stage.shortLabel)})`;
    const cbTeethLabel = isSchoolAge
      ? `🦷 Gebit &amp; Wisselen (${escapeHtml(stage.shortLabel)})`
      : `😁 Tandjes &amp; Gebit (${escapeHtml(stage.shortLabel)})`;

    const store = getActiveStore();
    const checkedTeethCount = store.checkedTeeth ? Object.keys(store.checkedTeeth).filter((k) => Boolean(store.checkedTeeth[k])).length : 0;

    cbGrid.innerHTML = `
      <div class="cb-item-box">
        <span class="cb-item-label">${cbFirstLabel}</span>
        ${formatCbBoxHtml(h.cbVisit)}
      </div>
      <div class="cb-item-box">
        <span class="cb-item-label">💉 Vaccinaties / RVP (${escapeHtml(stage.shortLabel)})</span>
        ${formatCbBoxHtml(h.vaccines)}
      </div>
      <div class="cb-item-box">
        <span class="cb-item-label">${cbTeethLabel}</span>
        ${formatCbBoxHtml(h.teeth)}
        <button type="button" class="cb-open-teeth-btn" data-jump-teeth-model="1">
          🦷 Open interactief gebitsmodel (${checkedTeethCount}/20) →
        </button>
      </div>
    `;

    cbGrid.querySelectorAll("[data-jump-teeth-model]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setView("tips", false);
        const teethDet = document.getElementById("teethTrackerDetails");
        if (teethDet) {
          teethDet.open = true;
          setTimeout(() => {
            const offset = getStickyNavOffset(14);
            const top = teethDet.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
            window.scrollTo({ top: Math.max(0, Math.round(top - offset)), behavior: "smooth" });
          }, 60);
        }
      });
    });

    let ageGroupLabel = "Baby 0–3 maanden";
    let shortAgeTag = "0–3 mnd";
    if (week >= 17 && week <= 52) {
      ageGroupLabel = "Baby 4–12 maanden";
      shortAgeTag = "4–12 mnd";
    } else if (week >= 53 && week <= 208) {
      ageGroupLabel = "Dreumes & Peuter (1–3 jaar)";
      shortAgeTag = "1–3 jaar";
    } else if (week >= 209) {
      ageGroupLabel = "Basisschoolkind (4–12 jaar)";
      shortAgeTag = "4–12 jaar";
    }

    if (sosStageLabelEl) {
      sosStageLabelEl.textContent = shortAgeTag;
    }
    sosSub.textContent = `Praktisch stappenplan direct afgestemd op: ${ageGroupLabel} (Week ${week}) — kies een situatie hieronder (er opent steeds 1 onderwerp tegelijk voor rustig overzicht).`;

    const splitIntoSentences = (txt) =>
      String(txt || "")
        .replace(/([.!?])\s+/g, "$1\n")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

    const buildSosCardBodyHtml = (card) => {
      let advice = card.adviceBaby3mTo1y;
      let doctorNote = card.whenToCallDoctor;
      if (week <= 16) {
        advice = card.adviceBabyUnder3m;
      } else if (week >= 17 && week <= 52) {
        advice = card.adviceBaby3mTo1y;
        // Voorkom dubbele 'Bel de huisarts'-opsomming bij Koorts 4-12 mnd (staat al in het rode kader eronder)
        if (card.id === "sos-fever") {
          advice =
            "Vocht aanbieden (≥ 38,0 °C): bied elke 1–2 uur kleine slokjes borst-/flesmelk of een paar lepeltjes water aan. Luchtig aankleden: kleed je baby in één dun laagje katoen en leg onder een dun lakentje zodat de warmte weg kan. Comfort & rust: geef alleen kinderparacetamol (op gewicht) als je baby pijn heeft of erg onrustig is.";
        }
      } else if (week >= 53 && week <= 208) {
        advice = card.adviceToddlerAndUp;
      } else {
        advice = card.adviceSchoolAge || card.adviceToddlerAndUp;
        doctorNote = card.whenToCallDoctorSchoolAge || card.whenToCallDoctor;
      }

      const actionBullets = splitIntoSentences(advice)
        .map((s) => `<li>${formatLeadOnlyHtml(s)}</li>`)
        .join("");

      const weightInfo = getPersonalWeightAdvice(week, stage);
      let personalPcmBoxHtml = "";
      if (card.id === "sos-fever" || card.id === "sos-teeth-cold") {
        if (weightInfo.weightKg > 0 && weightInfo.pcmAdviceHtml) {
          personalPcmBoxHtml = `
            <div class="highlight-note" style="margin-top:0.5rem;">
              <strong>⚖️ Dosering op maat voor ${escapeHtml(weightInfo.childName)} (${escapeHtml(weightInfo.fmtKg)} kg):</strong> ${weightInfo.pcmAdviceHtml}
            </div>
          `;
        } else {
          personalPcmBoxHtml = `
            <div class="highlight-note" style="margin-top:0.5rem; display:flex; align-items:center; justify-content:space-between; gap:0.5rem; flex-wrap:wrap;">
              <span>⚖️ <strong>Paracetamol op gewicht:</strong> Vul het gewicht van je kindje in voor de juiste zetpil-/drankdosering.</span>
              <button type="button" class="personal-weight-edit-btn" data-open-sos-weight="1">➕ Gewicht invullen</button>
            </div>
          `;
        }
      }

      let alertBoxHtml = "";
      if (card.id === "sos-fever") {
        let feverAlertBullets = "";
        if (week <= 16) {
          feverAlertBullets = `
            <li><strong>Altijd dezelfde dag bellen bij ≥ 38,0 °C:</strong> bij een baby van 0–3 maanden (rectaal gemeten) overleg je altijd direct met de huisarts.</li>
            <li><strong>Direct bellen bij alarmsignalen:</strong> sufheid/moeilijk wekbaar, kreunen, benauwdheid, minder dan 50% drinken of niet-wegdrukbare rode/paarse vlekjes (glas-test).</li>
          `;
        } else if (week <= 208) {
          feverAlertBullets = `
            <li><strong>Alarmsignalen:</strong> sufheid of moeilijk wekbaar, klagelijk kreunen, benauwdheid of niet-wegdrukbare rode/paarse vlekjes (glas-test).</li>
            <li><strong>Vocht &amp; duur:</strong> als je kind minder dan 50% van normaal drinkt, bijna geen natte luiers heeft, of als de koorts langer dan 3 dagen aanhoudt.</li>
          `;
        } else {
          feverAlertBullets = `
            <li><strong>Alarmsignalen:</strong> sufheid/verwardheid, nekstijfheid, benauwdheid of niet-wegdrukbare vlekjes (glas-test).</li>
            <li><strong>Vocht &amp; duur:</strong> als de koorts langer dan 5 dagen duurt of je kind minder dan 50% drinkt.</li>
          `;
        }
        alertBoxHtml = `
          <div class="sos-alert-box">
            <span class="sos-block-label">🚨 Wanneer direct de huisarts bellen?</span>
            <ul class="sos-bullet-list">${feverAlertBullets}</ul>
          </div>
        `;
      } else if (doctorNote) {
        const isEmergency112 = doctorNote.startsWith("🚨");
        const isMedical = isEmergency112 || doctorNote.startsWith("📞");
        const isMomTip = doctorNote.startsWith("💛");
        const blockLabel = isEmergency112
          ? "🚨 BEL DIRECT 112 BIJ ECHT STIKKEN"
          : isMedical
            ? "🚨 Wanneer contact opnemen met de huisarts?"
            : isMomTip
              ? "💛 Steuntje in de rug voor jezelf"
              : "💡 Gouden regel & aandachtspunt";
        const cleanedNote = doctorNote
          .replace(/^🚨\s*(BEL DIRECT 112 BIJ ECHT STIKKEN:)\s*/i, "")
          .replace(/^📞\s*(Bel (direct )?de huisarts bij:|Neem contact op met de huisarts\s*)/i, "")
          .replace(/^💡\s*(Gouden regel:|Let op:)\s*/i, "")
          .replace(/^💛\s*(Voor mama:)\s*/i, "")
          .trim();
        const noteSentences = splitIntoSentences(cleanedNote);
        const noteBullets = noteSentences
          .map((s) => {
            const cap = s.charAt(0).toUpperCase() + s.slice(1);
            return `<li>${formatLeadOnlyHtml(cap)}</li>`;
          })
          .join("");
        alertBoxHtml = `
          <div class="sos-alert-box ${isMedical ? "" : "is-tip-box"}">
            <span class="sos-block-label">${blockLabel}</span>
            <ul class="sos-bullet-list">${noteBullets}</ul>
          </div>
        `;
      }

      return `
        <div class="sos-action-box">
          <span class="sos-block-label">✅ Wat kun je nu direct doen (${escapeHtml(shortAgeTag)})?</span>
          <ul class="sos-bullet-list">${actionBullets}</ul>
          ${personalPcmBoxHtml}
        </div>
        ${alertBoxHtml}
      `;
    };

    const sosList = DATA.sosCards || [];
    sosContainer.innerHTML = sosList
      .map((card) => {
        const isOpen = state.activeSosCardId === card.id;
        const cardTitle =
          isSchoolAge && card.id === "sos-teeth-cold"
            ? "Wisselgebit, Kiespijn, Verkoudheid & Oorpijn"
            : card.title;
        return `
        <details class="sos-details" name="sos-accordion" data-sos-id="${card.id}" ${isOpen ? "open" : ""}>
          <summary>
            <span class="sos-summary-title">${card.icon} ${escapeHtml(cardTitle)}</span>
            <span class="summary-badge">${escapeHtml(shortAgeTag)}</span>
          </summary>
          <div class="sos-body">
            ${buildSosCardBodyHtml(card)}
          </div>
        </details>
      `;
      })
      .join("");

    sosContainer.querySelectorAll("[data-open-sos-weight]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const profDialog = document.getElementById("profileDialog");
        const active = getActiveChild();
        populateProfileFormForChild(active ? active.id : "");
        if (profDialog) profDialog.showModal();
        const wInput = document.getElementById("childWeightInput");
        if (wInput) wInput.focus();
      });
    });

    // Exclusieve Accordion (Single-Open UI/UX Patroon): er kan maximaal 1 SOS-onderwerp tegelijk geopend zijn
    const allSosDetails = Array.from(sosContainer.querySelectorAll(".sos-details"));
    allSosDetails.forEach((det) => {
      det.addEventListener("toggle", () => {
        if (det.open) {
          state.activeSosCardId = det.dataset.sosId || null;
          allSosDetails.forEach((other) => {
            if (other !== det && other.open) {
              other.open = false;
            }
          });
          // Als een bovenliggende kaart sluit en de nieuw geopende kaart achter de sticky balk schuift, houd hem netjes in beeld
          const rect = det.getBoundingClientRect();
          if (rect.top < 95) {
            det.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        } else {
          const anyStillOpen = allSosDetails.some((d) => d.open);
          if (!anyStillOpen) {
            state.activeSosCardId = null;
          }
        }
      });
    });

    // Feature 5: Consultatiebureau / Schoolarts Groei-logboek & Vragenlijstje
    renderCbPrepAndGrowth(stage, week);

    // Feature 6: Interactief Tandjes- & Wisselgebit-Kaartje
    renderTeethTracker(stage, week);
  }

  // =========================================================================
  // 10B. FEATURE 5: CONSULTATIEBUREAU / SCHOOLARTS GROEI-LOGBOEK & VRAGENLIJSTJE
  // =========================================================================
  function getDefaultCbQuestionSuggestions(week) {
    if (week <= 12) {
      return [
        "Drinkt mijn baby voldoende voor zijn/haar gewicht en groeicurve?",
        "Hebben jullie tips tegen darmkrampjes of onrust in de avond?"
      ];
    }
    if (week <= 26) {
      return [
        "Hoe combineren we de eerste oefenhapjes met het huidige flessenschema?",
        "Wanneer bouwen we de late avondvoeding rustig af?"
      ];
    }
    if (week <= 52) {
      return [
        "Hoeveel opvolgmelk heeft mijn baby nu nog nodig naast de 3 maaltijden?",
        "Hebben jullie tips voor de overgang van 3 naar 2 dutjes?"
      ];
    }
    if (week <= 208) {
      return [
        "Hoe ga ik ontspannen om met 'zelf doen'-driftbuien of kieskeurig eten aan tafel?",
        "Hoe verloopt de spraak- en taalontwikkeling voor deze leeftijd?"
      ];
    }
    return [
      "Hoe ondersteunen we een gezonde schermtijd- en slaapbalans na school?",
      "Zijn er aandachtspunten voor de ogentest, gehoortest of het wisselgebit?"
    ];
  }

  function renderCbPrepAndGrowth(stage, week) {
    const store = getActiveStore();
    const titleEl = document.getElementById("cbPrepSummaryTitle") || document.getElementById("cbPrepTitle");
    const badgeEl = document.getElementById("cbPrepSummaryBadge") || document.getElementById("cbPrepBadge");
    const latestGrowthPillEl = document.getElementById("latestGrowthPill");
    const questionsCountPillEl = document.getElementById("cbQuestionsCountPill");
    const dateInput = document.getElementById("growthDateInput");
    const growthListEl = document.getElementById("growthLogList");
    const cbqListEl = document.getElementById("cbQuestionsList");
    if (!growthListEl || !cbqListEl) return;

    const isSchoolAge = week > 208;
    if (titleEl) {
      titleEl.textContent = isSchoolAge
        ? "🏫 Schoolarts (JGZ) Groei-logboek & Vragenlijstje"
        : "🏥 Consultatiebureau Groei-logboek & Vragenlijstje";
    }

    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().slice(0, 10);
    }

    const logs = Array.isArray(store.growthLogs) ? store.growthLogs : [];
    const questions = Array.isArray(store.cbQuestions) ? store.cbQuestions : [];
    const openQuestionsCount = questions.filter((q) => !q.done).length;

    if (badgeEl) {
      if (logs.length === 0 && questions.length === 0) {
        badgeEl.textContent = "Logboek & Vragen";
      } else {
        badgeEl.textContent = `${logs.length} ${logs.length === 1 ? "meting" : "metingen"} • ${openQuestionsCount} ${
          openQuestionsCount === 1 ? "open vraag" : "open vragen"
        }`;
      }
    }

    if (questionsCountPillEl) {
      questionsCountPillEl.textContent = `${openQuestionsCount} open`;
    }

    // Sorteer metingen chronologisch (oud -> nieuw) om delta's te berekenen, en toon daarna nieuwste bovenaan
    const sortedAsc = [...logs].sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
    const deltaMap = {};
    for (let i = 0; i < sortedAsc.length; i++) {
      const cur = sortedAsc[i];
      const prev = i > 0 ? sortedAsc[i - 1] : null;
      if (prev) {
        const dParts = [];
        if (cur.weightKg > 0 && prev.weightKg > 0) {
          const diffG = Math.round((cur.weightKg - prev.weightKg) * 1000);
          if (diffG !== 0) {
            const sign = diffG > 0 ? "+" : "";
            dParts.push(
              Math.abs(diffG) < 1000
                ? `${sign}${diffG} g`
                : `${sign}${(diffG / 1000).toFixed(1).replace(".", ",")} kg`
            );
          }
        }
        if (cur.lengthCm > 0 && prev.lengthCm > 0) {
          const diffCm = Math.round((cur.lengthCm - prev.lengthCm) * 10) / 10;
          if (diffCm !== 0) {
            const sign = diffCm > 0 ? "+" : "";
            dParts.push(`${sign}${String(diffCm).replace(".", ",")} cm`);
          }
        }
        if (dParts.length > 0) {
          deltaMap[cur.id] = dParts.join(" • ");
        }
      }
    }

    const sortedDesc = [...sortedAsc].reverse();
    if (latestGrowthPillEl) {
      if (sortedDesc.length > 0) {
        const latest = sortedDesc[0];
        const wStr = latest.weightKg > 0 ? `${Number(latest.weightKg).toFixed(2).replace(/\.?0+$/, "").replace(".", ",")} kg` : "";
        const lStr = latest.lengthCm > 0 ? `${Number(latest.lengthCm).toFixed(1).replace(/\.0$/, "").replace(".", ",")} cm` : "";
        latestGrowthPillEl.textContent = [wStr, lStr].filter(Boolean).join(" • ") || "Laatste meting";
      } else {
        latestGrowthPillEl.textContent = "Nog geen meting";
      }
    }

    if (sortedDesc.length === 0) {
      growthListEl.innerHTML = `<p class="subtle-hint" style="margin:0.2rem 0 0;">Nog geen metingen opgeslagen. Vul hierboven gewicht (kg) en/of lengte (cm) in—het nieuwste gewicht werkt direct je fles- en paracetamol-advies bij!</p>`;
    } else {
      growthListEl.innerHTML = sortedDesc
        .map((entry, idx) => {
          const [yy, mm, dd] = String(entry.date || "").split("-");
          const nlDate = dd && mm && yy ? `${dd}-${mm}-${yy}` : entry.date || "Vandaag";
          const wStr = entry.weightKg > 0 ? `${Number(entry.weightKg).toFixed(2).replace(/\.?0+$/, "").replace(".", ",")} kg` : "";
          const lStr = entry.lengthCm > 0 ? `${Number(entry.lengthCm).toFixed(1).replace(/\.0$/, "").replace(".", ",")} cm` : "";
          const metricsStr = [wStr, lStr].filter(Boolean).join(" • ");
          const deltaStr = deltaMap[entry.id] || (idx === sortedDesc.length - 1 ? "Eerste meting" : "");
          return `
            <div class="growth-log-item">
              <span class="growth-log-date">📅 ${escapeHtml(nlDate)}</span>
              <span class="growth-log-metrics">${escapeHtml(metricsStr)}</span>
              ${deltaStr ? `<span class="growth-log-delta">${escapeHtml(deltaStr)}</span>` : ""}
              <button type="button" class="mini-del-btn" data-del-growth="${entry.id}" title="Meting verwijderen" aria-label="Meting verwijderen">✕</button>
            </div>
          `;
        })
        .join("");

      growthListEl.querySelectorAll("[data-del-growth]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const gid = btn.dataset.delGrowth;
          store.growthLogs = (store.growthLogs || []).filter((g) => g.id !== gid);
          // Synchroniseer het laatst overgebleven gewicht met het actieve kindprofiel
          const remainingAsc = [...store.growthLogs].sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
          const latestWithWeight = [...remainingAsc].reverse().find((g) => g.weightKg > 0);
          const activeChild = getActiveChild();
          if (latestWithWeight) {
            if (activeChild) activeChild.weightKg = latestWithWeight.weightKg;
            state.profile.weightKg = latestWithWeight.weightKg;
          }
          saveState();
          renderAll(false);
        });
      });
    }

    // Vragenlijstje voor CB / Schoolarts
    const suggestions = getDefaultCbQuestionSuggestions(week);
    if (questions.length === 0) {
      cbqListEl.innerHTML = `
        <p class="subtle-hint" style="margin:0.15rem 0 0.35rem;">Nog geen vragen genoteerd. Tik op een veelgestelde vraag voor deze fase of typ je eigen vraag hierboven:</p>
        <div class="filter-row" style="margin-bottom:0.2rem;">
          ${suggestions
            .map(
              (sug) =>
                `<button type="button" class="chip" data-quick-cbq="${escapeHtml(sug)}">➕ ${escapeHtml(sug)}</button>`
            )
            .join("")}
        </div>
      `;
      cbqListEl.querySelectorAll("[data-quick-cbq]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const qText = btn.dataset.quickCbq;
          if (!qText) return;
          if (!Array.isArray(store.cbQuestions)) store.cbQuestions = [];
          store.cbQuestions.push({ id: "cbq-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6), text: qText, done: false });
          saveState();
          renderCbPrepAndGrowth(stage, week);
        });
      });
    } else {
      cbqListEl.innerHTML = questions
        .map((q) => {
          return `
            <div class="cb-question-item ${q.done ? "is-done" : ""}">
              <label class="cb-q-label">
                <input type="checkbox" data-toggle-cbq="${q.id}" ${q.done ? "checked" : ""} aria-label="Vraag besproken" />
                <span>${escapeHtml(q.text)}</span>
              </label>
              <button type="button" class="mini-del-btn" data-del-cbq="${q.id}" title="Vraag verwijderen" aria-label="Vraag verwijderen">✕</button>
            </div>
          `;
        })
        .join("");

      cbqListEl.querySelectorAll("[data-toggle-cbq]").forEach((chk) => {
        chk.addEventListener("change", () => {
          const qid = chk.dataset.toggleCbq;
          const item = (store.cbQuestions || []).find((q) => q.id === qid);
          if (item) {
            item.done = chk.checked;
            saveState();
            renderCbPrepAndGrowth(stage, week);
          }
        });
      });

      cbqListEl.querySelectorAll("[data-del-cbq]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const qid = btn.dataset.delCbq;
          store.cbQuestions = (store.cbQuestions || []).filter((q) => q.id !== qid);
          saveState();
          renderCbPrepAndGrowth(stage, week);
        });
      });
    }
  }

  // =========================================================================
  // 10C. FEATURE 6: INTERACTIEF ANATOMISCH GEBITSMODEL (BOVEN- & ONDERKAAK)
  // =========================================================================
  const PRIMARY_TEETH_CATALOG = {
    upper: [
      { id: "u-m2-r", short: "K2", groupKey: "k2", jaw: "upper", side: "Rechtsboven", toothType: "molar", name: "2e Melkkies rechtsboven", ageErupt: "23–31 mnd", ageShed: "10–12 jr", minW: 96, maxW: 135, shedMinW: 480, shedMaxW: 624, isMolar: true, x: 70, y: 164, rot: -78 },
      { id: "u-m1-r", short: "K1", groupKey: "k1", jaw: "upper", side: "Rechtsboven", toothType: "molarFirst", name: "1e Melkkies rechtsboven", ageErupt: "13–19 mnd", ageShed: "9–11 jr", minW: 54, maxW: 84, shedMinW: 450, shedMaxW: 572, isMolar: true, x: 80, y: 122, rot: -62 },
      { id: "u-c-r", short: "H", groupKey: "h", jaw: "upper", side: "Rechtsboven", toothType: "canine", name: "Hoektand rechtsboven", ageErupt: "16–22 mnd", ageShed: "10–12 jr", minW: 68, maxW: 96, shedMinW: 500, shedMaxW: 624, isMolar: false, x: 100, y: 85, rot: -42 },
      { id: "u-i2-r", short: "S2", groupKey: "s2", jaw: "upper", side: "Rechtsboven", toothType: "incisorLat", name: "Zij-snijtand rechtsboven", ageErupt: "9–13 mnd", ageShed: "7–8 jr", minW: 37, maxW: 58, shedMinW: 350, shedMaxW: 440, isMolar: false, x: 132, y: 58, rot: -22 },
      { id: "u-i1-r", short: "S1", groupKey: "s1", jaw: "upper", side: "Rechtsboven", toothType: "incisorCent", name: "Middelste snijtand rechtsboven", ageErupt: "8–12 mnd", ageShed: "6–7 jr", minW: 32, maxW: 52, shedMinW: 295, shedMaxW: 380, isMolar: false, x: 170, y: 45, rot: -7 },
      { id: "u-i1-l", short: "S1", groupKey: "s1", jaw: "upper", side: "Linksboven", toothType: "incisorCent", name: "Middelste snijtand linksboven", ageErupt: "8–12 mnd", ageShed: "6–7 jr", minW: 32, maxW: 52, shedMinW: 295, shedMaxW: 380, isMolar: false, x: 210, y: 45, rot: 7 },
      { id: "u-i2-l", short: "S2", groupKey: "s2", jaw: "upper", side: "Linksboven", toothType: "incisorLat", name: "Zij-snijtand linksboven", ageErupt: "9–13 mnd", ageShed: "7–8 jr", minW: 37, maxW: 58, shedMinW: 350, shedMaxW: 440, isMolar: false, x: 248, y: 58, rot: 22 },
      { id: "u-c-l", short: "H", groupKey: "h", jaw: "upper", side: "Linksboven", toothType: "canine", name: "Hoektand linksboven", ageErupt: "16–22 mnd", ageShed: "10–12 jr", minW: 68, maxW: 96, shedMinW: 500, shedMaxW: 624, isMolar: false, x: 280, y: 85, rot: 42 },
      { id: "u-m1-l", short: "K1", groupKey: "k1", jaw: "upper", side: "Linksboven", toothType: "molarFirst", name: "1e Melkkies linksboven", ageErupt: "13–19 mnd", ageShed: "9–11 jr", minW: 54, maxW: 84, shedMinW: 450, shedMaxW: 572, isMolar: true, x: 300, y: 122, rot: 62 },
      { id: "u-m2-l", short: "K2", groupKey: "k2", jaw: "upper", side: "Linksboven", toothType: "molar", name: "2e Melkkies linksboven", ageErupt: "23–31 mnd", ageShed: "10–12 jr", minW: 96, maxW: 135, shedMinW: 480, shedMaxW: 624, isMolar: true, x: 310, y: 164, rot: 78 }
    ],
    lower: [
      { id: "l-m2-r", short: "K2", groupKey: "k2", jaw: "lower", side: "Rechtsonder", toothType: "molar", name: "2e Melkkies rechtsonder", ageErupt: "20–30 mnd", ageShed: "10–12 jr", minW: 86, maxW: 130, shedMinW: 480, shedMaxW: 624, isMolar: true, x: 74, y: 266, rot: 78 },
      { id: "l-m1-r", short: "K1", groupKey: "k1", jaw: "lower", side: "Rechtsonder", toothType: "molarFirst", name: "1e Melkkies rechtsonder", ageErupt: "14–18 mnd", ageShed: "9–11 jr", minW: 58, maxW: 80, shedMinW: 450, shedMaxW: 572, isMolar: true, x: 84, y: 306, rot: 62 },
      { id: "l-c-r", short: "H", groupKey: "h", jaw: "lower", side: "Rechtsonder", toothType: "canine", name: "Hoektand rechtsonder", ageErupt: "17–23 mnd", ageShed: "9–12 jr", minW: 72, maxW: 100, shedMinW: 450, shedMaxW: 600, isMolar: false, x: 104, y: 342, rot: 42 },
      { id: "l-i2-r", short: "S2", groupKey: "s2", jaw: "lower", side: "Rechtsonder", toothType: "incisorLat", name: "Zij-snijtand rechtsonder", ageErupt: "10–16 mnd", ageShed: "7–8 jr", minW: 42, maxW: 70, shedMinW: 340, shedMaxW: 430, isMolar: false, x: 135, y: 368, rot: 22 },
      { id: "l-i1-r", short: "S1", groupKey: "s1", jaw: "lower", side: "Rechtsonder", toothType: "incisorCent", name: "Middelste snijtand rechtsonder", ageErupt: "6–10 mnd", ageShed: "6–7 jr", minW: 22, maxW: 44, shedMinW: 280, shedMaxW: 370, isMolar: false, x: 171, y: 382, rot: 7 },
      { id: "l-i1-l", short: "S1", groupKey: "s1", jaw: "lower", side: "Linksonder", toothType: "incisorCent", name: "Middelste snijtand linksonder", ageErupt: "6–10 mnd", ageShed: "6–7 jr", minW: 22, maxW: 44, shedMinW: 280, shedMaxW: 370, isMolar: false, x: 209, y: 382, rot: -7 },
      { id: "l-i2-l", short: "S2", groupKey: "s2", jaw: "lower", side: "Linksonder", toothType: "incisorLat", name: "Zij-snijtand linksonder", ageErupt: "10–16 mnd", ageShed: "7–8 jr", minW: 42, maxW: 70, shedMinW: 340, shedMaxW: 430, isMolar: false, x: 245, y: 368, rot: -22 },
      { id: "l-c-l", short: "H", groupKey: "h", jaw: "lower", side: "Linksonder", toothType: "canine", name: "Hoektand linksonder", ageErupt: "17–23 mnd", ageShed: "9–12 jr", minW: 72, maxW: 100, shedMinW: 450, shedMaxW: 600, isMolar: false, x: 276, y: 342, rot: -42 },
      { id: "l-m1-l", short: "K1", groupKey: "k1", jaw: "lower", side: "Linksonder", toothType: "molarFirst", name: "1e Melkkies linksonder", ageErupt: "14–18 mnd", ageShed: "9–11 jr", minW: 58, maxW: 80, shedMinW: 450, shedMaxW: 572, isMolar: true, x: 296, y: 306, rot: -62 },
      { id: "l-m2-l", short: "K2", groupKey: "k2", jaw: "lower", side: "Linksonder", toothType: "molar", name: "2e Melkkies linksonder", ageErupt: "20–30 mnd", ageShed: "10–12 jr", minW: 86, maxW: 130, shedMinW: 480, shedMaxW: 624, isMolar: true, x: 306, y: 266, rot: -78 }
    ]
  };

  const TEETH_GROUPS_ORDER = [
    { key: "s1", code: "S1", label: "Middelste snijtanden", eruptRange: "6–12 mnd", shedRange: "6–7 jr", firstId: "l-i1-r" },
    { key: "s2", code: "S2", label: "Zij-snijtanden", eruptRange: "9–16 mnd", shedRange: "7–8 jr", firstId: "u-i2-r" },
    { key: "k1", code: "K1", label: "1e Melkkiezen", eruptRange: "13–19 mnd", shedRange: "9–11 jr", firstId: "u-m1-r" },
    { key: "h", code: "H", label: "Hoektanden", eruptRange: "16–23 mnd", shedRange: "9–12 jr", firstId: "u-c-r" },
    { key: "k2", code: "K2", label: "2e Melkkiezen", eruptRange: "20–31 mnd", shedRange: "10–12 jr", firstId: "l-m2-r" }
  ];

  let selectedToothId = "";

  function getToothCareTip(tooth, isSheddingMode) {
    if (isSheddingMode) {
      if (tooth.isMolar) {
        return "Wisselgebit & kiezen: achter de 2e melkkiezen (K2) breken rond 6 jaar ook de 4 blijvende 6-jaarskiezen door. Zet de borstel daar dwars op het kauwvlak en poets nog 1× per dag (’s avonds) na tot 10 jaar!";
      }
      return "Wiebeltand? Laat je kind de tand zelf met de tong of schone vingers loswiebelen. Poets voorzichtig langs het gevoelige tandvlees met fluoride-kindertandpasta (vanaf 5 jaar: 1450 ppm fluoride).";
    }
    if (tooth.toothType === "incisorCent" || tooth.toothType === "incisorLat") {
      return "Ivoren Kruis-tip (Snijtanden): Start zodra het allereerste witte puntje zichtbaar is met 1× per dag poetsen (en vanaf 2 jaar 2× per dag) met een zacht babyborsteltje en een rijstkorrel fluoride-peutertandpasta. Til de bovenlip bij het poetsen van de boventandjes even voorzichtig op.";
    }
    if (tooth.toothType === "canine") {
      return "Ivoren Kruis-tip (Hoektanden): Hoektanden vullen het plekje tussen de snijtanden en de 1e melkkiezen op. Een gekoelde bijtring (uit de koelkast, niet de vriezer!) geeft fijne tegendruk bij gevoelig tandvlees.";
    }
    return "Ivoren Kruis-tip (Melkkiezen): Melkkiezen hebben diepe groefjes (fissuren) op het kauwvlak. Zet de tandenborstel bij doorkomende kiezen dwars op de tandenrij zodat de haartjes goed in het nog lage kauwvlak komen!";
  }

  function buildArchCrownSvgInner(tooth) {
    if (tooth.toothType === "incisorCent") {
      return `
        <path class="arch-crown-outline" d="M -14,-11 C -15,-15 -9,-16 0,-16 C 9,-16 15,-15 14,-11 L 12,9 C 11,14 6,15 0,15 C -6,15 -11,14 -12,9 Z" />
        <path class="arch-crown-shine" d="M -9,-11 C -4,-13 4,-13 9,-11" />
        <path class="arch-crown-fissure" d="M -7,7 Q 0,10 7,7" />
      `;
    }
    if (tooth.toothType === "incisorLat") {
      return `
        <path class="arch-crown-outline" d="M -12,-10 C -13,-14 -7,-15 0,-15 C 7,-15 13,-14 12,-10 L 10,9 C 9,13 5,14 0,14 C -5,14 -9,13 -10,9 Z" />
        <path class="arch-crown-shine" d="M -7,-10 C -3,-12 3,-12 7,-10" />
        <path class="arch-crown-fissure" d="M -5,6 Q 0,9 5,6" />
      `;
    }
    if (tooth.toothType === "canine") {
      return `
        <path class="arch-crown-outline" d="M -13,-5 C -14,-12 -6,-16 0,-18 C 6,-16 14,-12 13,-5 C 14,7 9,14 0,15 C -9,14 -14,7 -13,-5 Z" />
        <path class="arch-crown-shine" d="M 0,-14 L 0,4 M -6,-7 Q 0,-11 6,-7" />
      `;
    }
    if (tooth.toothType === "molarFirst") {
      return `
        <path class="arch-crown-outline" d="M -15,-8 C -16,-14 -9,-16 -2,-15 C 0,-14 2,-15 2,-15 C 9,-16 16,-14 15,-8 C 16,-1 16,6 14,11 C 12,15 5,16 0,15 C -5,16 -12,15 -14,11 C -16,6 -16,-1 -15,-8 Z" />
        <path class="arch-crown-fissure" d="M -9,0 H 9 M -1,-7 V 7 M -9,0 L -12,-5 M -9,0 L -12,5 M 9,0 L 12,-5 M 9,0 L 12,5" />
        <circle class="arch-crown-cusp" cx="-7" cy="-7" r="2.2" />
        <circle class="arch-crown-cusp" cx="7" cy="-7" r="2.2" />
        <circle class="arch-crown-cusp" cx="-7" cy="7" r="2.2" />
        <circle class="arch-crown-cusp" cx="7" cy="7" r="2.2" />
      `;
    }
    // 2e Melkkies (molar) — grote kroon met 4-5 knobbels en kruisgroeven
    return `
      <path class="arch-crown-outline" d="M -16,-9 C -17,-15 -10,-17 -2,-16 C 0,-15 2,-16 2,-16 C 10,-17 17,-15 16,-9 C 18,-1 18,7 15,12 C 12,16 5,17 0,16 C -5,17 -12,16 -15,12 C -18,7 -18,-1 -16,-9 Z" />
      <path class="arch-crown-fissure" d="M -10,0 H 10 M -2,-8 V 8 M 4,-8 V 7 M -10,0 L -13,-6 M -10,0 L -13,6 M 10,0 L 13,-6 M 10,0 L 13,6" />
      <circle class="arch-crown-cusp" cx="-8" cy="-8" r="2.4" />
      <circle class="arch-crown-cusp" cx="8" cy="-8" r="2.4" />
      <circle class="arch-crown-cusp" cx="-8" cy="8" r="2.4" />
      <circle class="arch-crown-cusp" cx="8" cy="8" r="2.4" />
    `;
  }

  function buildSingleToothInspectorSvg(tooth, isErupted, isExpected) {
    const strokeCol = isErupted ? "var(--primary)" : isExpected ? "var(--accent)" : "#94a3b8";
    const fillCol = isErupted ? "#ffffff" : isExpected ? "#fffbeb" : "#f8fafc";
    let anatomicalPaths = "";
    if (tooth.isMolar) {
      // Gedetailleerde molaar met 2 wortels in het tandvlees + geprofileerde kroon en kauwvlakgroeven
      anatomicalPaths = `
        <path d="M 18 34 C 15 46, 13 54, 17 57 C 20 58, 23 50, 26 40 L 30 40 C 33 50, 36 58, 39 57 C 43 54, 41 46, 38 34 Z" fill="#fef3c7" stroke="${strokeCol}" stroke-width="1.6" />
        <path d="M 10 20 C 10 11, 18 9, 25 12 C 28 13, 28 13, 31 12 C 38 9, 46 11, 46 20 C 46 29, 43 35, 38 36 L 18 36 C 13 35, 10 29, 10 20 Z" fill="${fillCol}" stroke="${strokeCol}" stroke-width="2.2" />
        <path d="M 17 21 C 22 25, 34 25, 39 21 M 28 13 V 27 M 21 16 C 23 19, 25 20, 28 20 C 31 20, 33 19, 35 16" stroke="${strokeCol}" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.65" />
      `;
    } else if (tooth.toothType === "canine") {
      // Hoektand met lange conische wortel en spitse cuspid-kroon
      anatomicalPaths = `
        <path d="M 21 34 C 22 46, 25 57, 28 58 C 31 57, 34 46, 35 34 Z" fill="#fef3c7" stroke="${strokeCol}" stroke-width="1.6" />
        <path d="M 15 24 C 14 16, 22 10, 28 7 C 34 10, 42 16, 41 24 C 40 31, 36 35, 28 35 C 20 35, 16 31, 15 24 Z" fill="${fillCol}" stroke="${strokeCol}" stroke-width="2.2" />
        <path d="M 28 11 V 29 M 21 20 Q 28 15 35 20" stroke="${strokeCol}" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.55" />
      `;
    } else {
      // Snijtand met enkele wortel en beitelvormige kroon met glazuurrand
      anatomicalPaths = `
        <path d="M 21 34 C 22 45, 24 55, 28 56 C 32 55, 34 45, 35 34 Z" fill="#fef3c7" stroke="${strokeCol}" stroke-width="1.6" />
        <path d="M 15 14 C 15 10, 21 9, 28 9 C 35 9, 41 10, 41 14 L 38 32 C 37 35, 33 36, 28 36 C 23 36, 19 35, 18 32 Z" fill="${fillCol}" stroke="${strokeCol}" stroke-width="2.2" />
        <path d="M 20 14 H 36 M 21 28 Q 28 31 35 28" stroke="${strokeCol}" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.55" />
      `;
    }

    return `
      <svg viewBox="0 0 56 64" class="tooth-detail-svg" aria-hidden="true">
        <rect x="2" y="2" width="52" height="60" rx="14" fill="var(--surface-soft)" />
        <path d="M 4 35 Q 28 31 52 35 L 52 50 C 52 57 46 60 40 60 H 16 C 10 60 4 57 4 50 Z" fill="rgba(244, 114, 182, 0.16)" />
        ${anatomicalPaths}
      </svg>
    `;
  }

  function normalizeToothDateForInput(rawVal) {
    if (!rawVal || typeof rawVal !== "string") return new Date().toISOString().slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawVal)) return rawVal;
    const m = rawVal.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (m) {
      return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
    }
    return new Date().toISOString().slice(0, 10);
  }

  function formatToothDateDisplay(rawVal) {
    if (!rawVal || typeof rawVal !== "string") return "Afgevinkt";
    const iso = normalizeToothDateForInput(rawVal);
    const [yy, mm, dd] = iso.split("-");
    if (yy && mm && dd) return `${dd}-${mm}-${yy}`;
    return rawVal;
  }

  function renderSingleTeethModelInstance(containerEl, titleEl, badgeEl, store, stage, week, childDisplayName) {
    if (!containerEl) return;
    if (!store.checkedTeeth) store.checkedTeeth = {};

    const isSheddingMode = week > 208;
    const allTeeth = [...PRIMARY_TEETH_CATALOG.upper, ...PRIMARY_TEETH_CATALOG.lower];
    const checkedCount = allTeeth.filter((t) => Boolean(store.checkedTeeth[t.id])).length;

    if (titleEl) {
      const forChildSuffix = childDisplayName ? ` van ${childDisplayName}` : "";
      titleEl.textContent = isSheddingMode
        ? `🦷 Interactief Wisselgebit-Model${forChildSuffix} (6–12 jaar)`
        : `🦷 Interactief Gebitsmodel${forChildSuffix} (Boven- & Onderkaak)`;
    }

    if (badgeEl) {
      badgeEl.textContent = isSheddingMode
        ? `${checkedCount} / 20 gewisseld`
        : `${checkedCount} / 20 doorgekomen`;
    }

    const isExpectedInCurrentWeek = (t) => {
      if (isSheddingMode) {
        return week >= t.shedMinW && week <= t.shedMaxW;
      }
      return week >= t.minW && week <= t.maxW;
    };

    const expectedNowList = allTeeth.filter((t) => isExpectedInCurrentWeek(t));
    if (!selectedToothId || !allTeeth.some((t) => t.id === selectedToothId)) {
      const firstExpected = expectedNowList.find((t) => !store.checkedTeeth[t.id]) || expectedNowList[0];
      selectedToothId = firstExpected ? firstExpected.id : "l-i1-r";
    }
    const activeTooth = allTeeth.find((t) => t.id === selectedToothId) || allTeeth[0];
    const activeIsErupted = Boolean(store.checkedTeeth[activeTooth.id]);
    const activeIsExpected = !activeIsErupted && isExpectedInCurrentWeek(activeTooth);

    const renderArchToothGroup = (t) => {
      const isErupted = Boolean(store.checkedTeeth[t.id]);
      const isExpected = !isErupted && isExpectedInCurrentWeek(t);
      const isSel = t.id === activeTooth.id;
      const ageLabel = isSheddingMode ? t.ageShed : t.ageErupt;
      const stateClasses = [
        "arch-tooth-group",
        `type-${t.toothType}`,
        t.isMolar ? "is-molar" : "is-anterior",
        isErupted ? "is-erupted" : "is-unerupted",
        isExpected ? "is-expected-now" : "",
        isSel ? "is-selected" : ""
      ]
        .filter(Boolean)
        .join(" ");

      return `
        <g
          class="${stateClasses}"
          transform="translate(${t.x}, ${t.y})"
          data-tooth-id="${t.id}"
          role="button"
          tabindex="0"
          aria-label="${escapeHtml(t.name)} (${escapeHtml(ageLabel)}) — ${isErupted ? "Afgevinkt" : "Nog niet afgevinkt"}"
        >
          <title>${escapeHtml(t.name)} (${escapeHtml(ageLabel)})</title>
          ${isExpected ? `<circle cx="0" cy="0" r="21.5" class="arch-expected-halo" />` : ""}
          ${isSel ? `<circle cx="0" cy="0" r="22.5" class="arch-selected-ring" />` : ""}
          <g transform="rotate(${t.rot})" class="arch-crown-rot">
            ${buildArchCrownSvgInner(t)}
          </g>
          <text x="0" y="3.5" text-anchor="middle" class="arch-tooth-code">${escapeHtml(t.short)}</text>
          ${
            isErupted
              ? `
                <g transform="translate(11, -11)" class="arch-check-badge">
                  <circle cx="0" cy="0" r="6.2" class="arch-check-circle" />
                  <path d="M -2.7 0.2 L -0.7 2.2 L 2.9 -1.8" class="arch-check-tick" />
                </g>
              `
              : isExpected
                ? `<circle cx="11" cy="-11" r="4.8" class="arch-expected-dot" />`
                : ""
          }
        </g>
      `;
    };

    const groupsHtml = TEETH_GROUPS_ORDER.map((grp) => {
      const groupTeeth = allTeeth.filter((t) => t.groupKey === grp.key);
      const doneInGroup = groupTeeth.filter((t) => Boolean(store.checkedTeeth[t.id])).length;
      const isActGrp = activeTooth.groupKey === grp.key;
      const rangeText = isSheddingMode ? grp.shedRange : grp.eruptRange;
      return `
        <button
          type="button"
          class="teeth-group-pill ${isActGrp ? "is-active" : ""} ${doneInGroup === groupTeeth.length ? "is-complete" : ""}"
          data-select-tooth-group="${grp.firstId}"
        >
          <span class="teeth-group-code">${escapeHtml(grp.code)}</span>
          <span class="teeth-group-name">${escapeHtml(grp.label)} <small>(${escapeHtml(rangeText)})</small></span>
          <span class="teeth-group-count">${doneInGroup}/${groupTeeth.length}</span>
        </button>
      `;
    }).join("");

    const statusBadgeHtml = activeIsErupted
      ? `<span class="pill-small pill-ok">✓ ${isSheddingMode ? "Gewisseld" : "Doorgekomen"} (${escapeHtml(
          formatToothDateDisplay(store.checkedTeeth[activeTooth.id])
        )})</span>`
      : activeIsExpected
        ? `<span class="pill-small pill-spotlight">🌟 Nu aan de beurt (${escapeHtml(stage.shortLabel)})</span>`
        : `<span class="pill-small">○ Nog in het tandvlees</span>`;

    const dateInputVal = activeIsErupted ? normalizeToothDateForInput(store.checkedTeeth[activeTooth.id]) : "";

    containerEl.innerHTML = `
      <div class="teeth-model-layout">
        <!-- LINKS / BOVEN: Anatomisch Kaakboog-Model (Bovenkaak boven, Onderkaak onder) -->
        <div class="teeth-arch-card">
          <div class="teeth-arch-svg-wrap">
            <svg viewBox="0 0 380 430" class="dental-arch-svg" role="group" aria-label="Anatomisch model van boven- en ondergebit">
              <defs>
                <radialGradient id="${containerEl.id || "arch"}-palateGlow" cx="50%" cy="46%" r="50%">
                  <stop offset="0%" stop-color="rgba(244, 114, 182, 0.08)" />
                  <stop offset="100%" stop-color="rgba(244, 114, 182, 0.22)" />
                </radialGradient>
              </defs>

              <!-- Bovenkaak gehemelte & tandvleesboog (Maxilla) -->
              <path
                d="M 68 168 C 68 58, 122 24, 190 24 C 258 24, 312 58, 312 168 C 282 184, 98 184, 68 168 Z"
                fill="url(#${containerEl.id || "arch"}-palateGlow)"
              />
              <path
                d="M 70 164 C 70 62, 123 30, 190 30 C 257 30, 310 62, 310 164"
                class="dental-gum-arch"
              />
              <!-- Gehemelte-plooien (Rugae palatinae) voor anatomisch detail -->
              <path d="M 156 88 Q 190 78 224 88 M 148 104 Q 190 95 232 104 M 155 120 Q 190 112 225 120" class="dental-palate-rugae" />

              <!-- Onderkaak mondbodem/tong & tandvleesboog (Mandibula) -->
              <path
                d="M 72 262 C 72 368, 124 404, 190 404 C 256 404, 308 368, 308 262 C 278 246, 102 246, 72 262 Z"
                fill="url(#${containerEl.id || "arch"}-palateGlow)"
              />
              <path
                d="M 142 330 C 142 276, 238 276, 238 330"
                class="dental-tongue-contour"
              />
              <path
                d="M 74 266 C 74 366, 125 398, 190 398 C 255 398, 306 366, 306 266"
                class="dental-gum-arch"
              />

              <!-- Symmetrie-assen & Rechts/Links oriëntatie -->
              <line x1="190" y1="22" x2="190" y2="408" class="dental-midline" />
              <line x1="36" y1="215" x2="344" y2="215" class="dental-midline" />

              <text x="190" y="15" text-anchor="middle" class="dental-jaw-heading">👄 BOVENGEBIT (BOVENKAAK)</text>
              <text x="190" y="424" text-anchor="middle" class="dental-jaw-heading">👅 ONDERGEBIT (ONDERKAAK)</text>

              <text x="64" y="210" text-anchor="middle" class="dental-side-label">RECHTS</text>
              <text x="64" y="224" text-anchor="middle" class="dental-side-sub">(kind)</text>
              <text x="316" y="210" text-anchor="middle" class="dental-side-label">LINKS</text>
              <text x="316" y="224" text-anchor="middle" class="dental-side-sub">(kind)</text>

              <!-- Centrale voortgangsbadge midden tussen boven- en onderkaak -->
              <g transform="translate(190, 215)">
                <rect x="-64" y="-21" width="128" height="42" rx="21" class="dental-center-pill" />
                <text x="0" y="-3" text-anchor="middle" class="dental-center-count">🦷 ${checkedCount} / 20 ${
                  isSheddingMode ? "gewisseld" : "door"
                }</text>
                <text x="0" y="12" text-anchor="middle" class="dental-center-sub">Tik op een tand in de boog</text>
              </g>

              <!-- 10 Boventanden langs de bovenste hoefijzerboog -->
              ${PRIMARY_TEETH_CATALOG.upper.map(renderArchToothGroup).join("")}

              <!-- 10 Ondertanden langs de onderste hoefijzerboog -->
              ${PRIMARY_TEETH_CATALOG.lower.map(renderArchToothGroup).join("")}
            </svg>
          </div>

          <div class="teeth-legend-row">
            <span><span class="teeth-legend-dot is-erupted"></span>${isSheddingMode ? "Gewisseld" : "Doorgekomen"} (${checkedCount}/20)</span>
            <span><span class="teeth-legend-dot is-expected"></span>Nu verwacht (${escapeHtml(stage.shortLabel)})</span>
            <span><span class="teeth-legend-dot"></span>Nog in tandvlees</span>
          </div>
        </div>

        <!-- RECHTS / ONDER: Geselecteerde Tand Detail-Inspector & Volgorde-overzicht -->
        <div class="teeth-inspector-panel">
          <div class="teeth-detail-card ${activeIsErupted ? "is-erupted" : ""} ${activeIsExpected ? "is-expected" : ""}">
            <div class="teeth-detail-top">
              ${buildSingleToothInspectorSvg(activeTooth, activeIsErupted, activeIsExpected)}
              <div class="teeth-detail-title-wrap">
                <div class="teeth-detail-badges">
                  <span class="pill-small">${escapeHtml(activeTooth.side)} • Code ${escapeHtml(activeTooth.short)}</span>
                  ${statusBadgeHtml}
                </div>
                <h4 class="teeth-detail-name">${escapeHtml(activeTooth.name)}</h4>
                <div class="teeth-detail-ages">
                  <span>🌱 <strong>Doorkomen:</strong> ${escapeHtml(activeTooth.ageErupt)}</span>
                  <span>•</span>
                  <span>🧚 <strong>Wisselen:</strong> ${escapeHtml(activeTooth.ageShed)}</span>
                </div>
              </div>
            </div>

            <div class="teeth-detail-actions">
              <button
                type="button"
                class="${activeIsErupted ? "btn-secondary" : "btn-primary"} btn-small teeth-toggle-main-btn"
                data-toggle-selected-tooth="${activeTooth.id}"
              >
                ${
                  activeIsErupted
                    ? `✓ ${isSheddingMode ? "Gewisseld" : "Doorgekomen"} — Tik om uit te vinken`
                    : `🦷 ${isSheddingMode ? "Markeer als gewisseld" : "Tandje is doorgekomen! (Afvinken)"}`
                }
              </button>
              ${
                activeIsErupted
                  ? `
                    <label class="teeth-date-label">
                      <span>📅 Datum:</span>
                      <input
                        type="date"
                        class="ms-date-input"
                        data-tooth-date-input="${activeTooth.id}"
                        value="${escapeHtml(dateInputVal)}"
                        aria-label="Doorkomstdatum van ${escapeHtml(activeTooth.name)}"
                      />
                    </label>
                  `
                  : ""
              }
            </div>

            <p class="teeth-care-tip">
              💡 ${escapeHtml(getToothCareTip(activeTooth, isSheddingMode))}
            </p>
          </div>

          <div class="teeth-groups-box">
            <span class="teeth-groups-heading">📋 Gemiddelde volgorde van doorkomen (tik om te bekijken):</span>
            <div class="teeth-groups-grid">
              ${groupsHtml}
            </div>
          </div>
        </div>
      </div>
    `;

    const toggleToothById = (tid, shouldToggleStatus) => {
      const toothObj = allTeeth.find((t) => t.id === tid);
      if (!toothObj) return;
      selectedToothId = tid;
      if (shouldToggleStatus) {
        if (store.checkedTeeth[tid]) {
          delete store.checkedTeeth[tid];
        } else {
          store.checkedTeeth[tid] = new Date().toISOString().slice(0, 10);
        }
        saveState();
      }
      renderTeethTracker(stage, week);
      renderSosAndCb(stage, week);
    };

    // Klik of Enter/Spatie op een tand in het anatomische kaakboog-model: selecteer én vink direct aan/uit
    containerEl.querySelectorAll("[data-tooth-id]").forEach((node) => {
      node.addEventListener("click", () => {
        toggleToothById(node.dataset.toothId, true);
      });
      node.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          toggleToothById(node.dataset.toothId, true);
        }
      });
    });

    // Actieknop in de detailkaart
    containerEl.querySelectorAll("[data-toggle-selected-tooth]").forEach((btn) => {
      btn.addEventListener("click", () => {
        toggleToothById(btn.dataset.toggleSelectedTooth, true);
      });
    });

    // Datum aanpassen wanneer een tandje is afgevinkt
    containerEl.querySelectorAll("[data-tooth-date-input]").forEach((inp) => {
      inp.addEventListener("change", () => {
        const tid = inp.dataset.toothDateInput;
        if (tid && inp.value) {
          store.checkedTeeth[tid] = inp.value;
          saveState();
          renderTeethTracker(stage, week);
        }
      });
    });

    // Klik op een van de 5 tandgroepen om die tandsoort te bekijken zonder hem direct aan te vinken
    containerEl.querySelectorAll("[data-select-tooth-group]").forEach((btn) => {
      btn.addEventListener("click", () => {
        toggleToothById(btn.dataset.selectToothGroup, false);
      });
    });
  }

  function renderTeethTracker(stage, week) {
    const activeStage = stage || getStageForWeek(state.currentWeek);
    const activeWeek = week || state.currentWeek;
    const activeChild = getActiveChild();
    const activeStore = getActiveStore();

    // 1. Render het gebitsmodel op de '🌙 Slaap & Groei' tab (onder Mijlpalen)
    renderSingleTeethModelInstance(
      document.getElementById("teethTrackerContainer"),
      document.getElementById("teethTrackerSummaryTitle") || document.getElementById("teethTrackerTitle"),
      document.getElementById("teethTrackerBadge"),
      activeStore,
      activeStage,
      activeWeek,
      activeChild ? activeChild.name : state.profile.name || ""
    );

    // 2. Render hetzelfde gebitsmodel óók in het Kindprofiel-dialoogvenster (voor het daar geselecteerde kind!)
    const editingId = document.getElementById("editingChildIdInput")?.value || "";
    const editingChild = state.children.find((c) => c.id === editingId) || activeChild;
    const profileStore = editingChild || activeStore;
    const profileCalc = editingChild ? calculateAgeForProfile(editingChild) : null;
    const profileWeek = profileCalc ? profileCalc.activeTargetWeek : activeWeek;
    const profileStage = getStageForWeek(profileWeek);

    renderSingleTeethModelInstance(
      document.getElementById("profileTeethTrackerContainer"),
      document.getElementById("profileTeethSummaryTitle"),
      document.getElementById("profileTeethBadge"),
      profileStore,
      profileStage,
      profileWeek,
      editingChild ? editingChild.name : state.profile.name || ""
    );
  }


  // =========================================================================
  // 11. MULTI-KIND PROFIELEN & WISSELAAR
  // =========================================================================
  function renderProfileChip() {
    const chipText = document.getElementById("profileChipText");
    const jumpBtn = document.getElementById("jumpToChildBtn");

    // Voorkom dubbeling met de meebewegende tijdlijnbalk: de header-knop opent het profielbeheer
    if (chipText) {
      chipText.textContent =
        state.children && state.children.length > 1
          ? `Profielen (${state.children.length})`
          : "Kindprofiel";
    }
    if (jumpBtn) {
      jumpBtn.classList.add("hidden");
    }
  }

  function renderDockQuickBar() {
    const pillsContainer = document.getElementById("dockChildPills");
    const nowBtn = document.getElementById("dockJumpToChildBtn");
    if (!pillsContainer) return;

    const calc = getChildCalculatedAge();

    if (nowBtn) {
      nowBtn.classList.remove("hidden");
      if (calc) {
        let tag = `W${calc.activeTargetWeek}`;
        let isAtNow = state.currentWeek === calc.activeTargetWeek;
        let titleLabel = `Week ${calc.activeTargetWeek}`;

        if (state.zoomMode === "stage") {
          const childStage = getStageForWeek(calc.activeTargetWeek);
          const curStage = getStageForWeek(state.currentWeek);
          tag = `Fase ${childStage.phaseIndex || childStage.shortLabel}`;
          isAtNow = curStage.id === childStage.id;
          titleLabel = `Fase ${childStage.phaseIndex}: ${childStage.shortLabel}`;
        } else if (state.zoomMode === "month") {
          const childMonth = getMonthForWeek(calc.activeTargetWeek);
          const curMonth = getMonthForWeek(state.currentWeek);
          tag = formatMonthNodeLabel(childMonth);
          isAtNow = curMonth === childMonth;
          titleLabel = tag;
        } else if (state.zoomMode === "year") {
          const childYear = Math.min(12, Math.max(1, Math.ceil(calc.activeTargetWeek / 52)));
          const curYear = Math.min(12, Math.max(1, Math.ceil(state.currentWeek / 52)));
          tag = `Jaar ${childYear}`;
          isAtNow = curYear === childYear;
          titleLabel = `Jaar ${childYear}`;
        }

        nowBtn.classList.toggle("is-at-now", isAtNow);
        nowBtn.textContent = isAtNow ? `📍 Nu (${tag})` : `📍 Naar Nu (${tag})`;
        nowBtn.title = isAtNow
          ? `Je bekijkt nu de huidige leeftijd van je kind (${titleLabel})`
          : `Spring direct naar de huidige leeftijd van je kind (${titleLabel})`;
      } else {
        nowBtn.classList.remove("is-at-now");
        nowBtn.textContent = "📍 Nu";
        nowBtn.title = "Stel de geboortedatum van je kind in om met 1 tik naar 'Nu' te springen";
      }
    }

    if (state.children && state.children.length > 0) {
      const pillsHtml = state.children
        .map((ch) => {
          const chCalc = calculateAgeForProfile(ch);
          const isAct = ch.id === state.activeChildId;
          const emoji = chCalc && chCalc.activeTargetWeek > 52 ? "🧒" : "👶";
          return `
            <button type="button" class="dock-child-pill ${isAct ? "active" : ""}" data-dock-switch-child="${ch.id}" title="${
              isAct && state.children.length === 1
                ? `Kindprofiel van ${escapeHtml(ch.name || "Kind")} bekijken of kinderen beheren`
                : `Wissel direct naar ${escapeHtml(ch.name || "Kind")}`
            }">
              <span>${emoji}</span>
              <span>${escapeHtml(ch.name || "Kind")}${chCalc ? ` • ${chCalc.shortAge}` : ""}</span>
            </button>
          `;
        })
        .join("");
      pillsContainer.innerHTML = pillsHtml;
    } else if (state.profile && (state.profile.name || state.profile.dob)) {
      const name = state.profile.name || "Kind";
      pillsContainer.innerHTML = `
        <button type="button" class="dock-child-pill active" data-dock-open-profile="1" title="Kindprofiel bewerken">
          <span>👶</span>
          <span>${escapeHtml(name)}${calc ? ` • ${calc.shortAge}` : ""}</span>
        </button>
      `;
    } else {
      pillsContainer.innerHTML = `
        <button type="button" class="dock-child-pill" data-dock-open-profile="1" title="Stel de naam en geboortedatum van je kind(eren) in">
          <span>👶</span>
          <span>Kind kiezen</span>
        </button>
      `;
    }

    pillsContainer.querySelectorAll("[data-dock-switch-child]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cid = btn.dataset.dockSwitchChild;
        if (cid === state.activeChildId && state.children.length === 1) {
          const profDialog = document.getElementById("profileDialog");
          populateProfileFormForChild(cid);
          if (profDialog) profDialog.showModal();
          return;
        }
        state.activeChildId = cid;
        const chosen = getActiveChild();
        const chCalc = calculateAgeForProfile(chosen);
        if (chCalc) {
          state.currentWeek = chCalc.activeTargetWeek;
          syncEpochToWeek(state.currentWeek);
        }
        saveState();
        renderAll(true);
      });
    });

    pillsContainer.querySelectorAll("[data-dock-open-profile]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const profDialog = document.getElementById("profileDialog");
        const active = getActiveChild();
        populateProfileFormForChild(active ? active.id : "");
        if (profDialog) profDialog.showModal();
      });
    });
  }

  function syncTimelineDockCompactState() {
    const timelineDock = document.getElementById("timelineDock");
    const expandTimelineBtn = document.getElementById("expandTimelineBtn");
    if (!timelineDock) return;

    const hadCompact = timelineDock.classList.contains("is-compact");
    const hadExpanded = timelineDock.classList.contains("is-manual-expanded");

    const y = window.scrollY || document.documentElement.scrollTop || 0;
    if (y <= 4) {
      timelineManualExpanded = false;
      timelineDock.classList.remove("is-compact", "is-manual-expanded");
      if (expandTimelineBtn) {
        expandTimelineBtn.innerHTML = `<span aria-hidden="true">↕</span><span class="expand-btn-text">Weergave</span>`;
        expandTimelineBtn.setAttribute("aria-expanded", "true");
      }
      if (hadCompact || hadExpanded) {
        requestCenterActiveTimelineNode(false);
      }
      return;
    }

    if (y > 12 || timelineDock.classList.contains("is-compact") || timelineDock.classList.contains("is-manual-expanded")) {
      if (timelineManualExpanded) {
        timelineDock.classList.remove("is-compact");
        timelineDock.classList.add("is-manual-expanded");
        if (expandTimelineBtn) {
          expandTimelineBtn.innerHTML = `<span aria-hidden="true">▴</span><span class="expand-btn-text">Inklappen</span>`;
          expandTimelineBtn.setAttribute("aria-expanded", "true");
          expandTimelineBtn.title = "Klap de weergave-opties weer in tot de compacte balk";
        }
      } else {
        timelineDock.classList.add("is-compact");
        timelineDock.classList.remove("is-manual-expanded");
        if (expandTimelineBtn) {
          expandTimelineBtn.innerHTML = `<span aria-hidden="true">↕</span><span class="expand-btn-text">Weergave</span>`;
          expandTimelineBtn.setAttribute("aria-expanded", "false");
          expandTimelineBtn.title = "Wissel weergave (Weken / Maanden / Fasen / Jaren)";
        }
      }

      const nowCompact = timelineDock.classList.contains("is-compact");
      const nowExpanded = timelineDock.classList.contains("is-manual-expanded");
      if (hadCompact !== nowCompact || hadExpanded !== nowExpanded) {
        requestCenterActiveTimelineNode(true);
      }
    }
  }

  function renderChildSwitcherBar() {
    const bar = document.getElementById("childSwitcherBar");
    const comboTip = document.getElementById("multiChildComboTip");
    if (!bar || !comboTip) return;

    // Kind-pills staan nu direct in de tijdlijnbalk (#dockChildPills); toon deze balk alleen bij ≥2 kinderen voor de Gezinstip
    if (!state.children || state.children.length < 2) {
      bar.classList.add("hidden");
      comboTip.classList.add("hidden");
      return;
    }

    bar.classList.remove("hidden");
    const names = state.children.map((c) => escapeHtml(c.name || "Kind")).join(" & ");
    const weeks = state.children
      .map((c) => {
        const calc = calculateAgeForProfile(c);
        return calc ? calc.activeTargetWeek : state.currentWeek;
      })
      .sort((a, b) => a - b);
    const minW = weeks[0];
    const maxW = weeks[weeks.length - 1];

    let tipHtml = "";
    if (minW <= 16) {
      tipHtml = `👨‍👩‍👧‍👦 <strong>Gezinstip (${names}):</strong> Terwijl de jongste nog 100% melk drinkt, kun je voor de oudste een speciaal 'Voedings-mandje' met boekjes, stickers of een snackbordje klaarzetten tijdens de voedingsmomenten—of geef de oudste een trotse 'Grote Helper'-taak (zoals een schone luier aangeven)!`;
    } else if (minW <= 52) {
      tipHtml = `👨‍👩‍👧‍👦 <strong>Gezinstip (${names}):</strong> Kook één ongezouten basismaaltijd (bijv. zoete aardappel, broccoli en zalm/kip) — schep eerst een gepureerde of in zachte reepjes gesneden portie uit voor de jongste en kruid de pan daarna aan tafel voor de rest van het gezin!`;
    } else if (maxW <= 208) {
      tipHtml = `👨‍👩‍👧‍👦 <strong>Gezinstip (${names}):</strong> Zet bij het avondeten losse schaaltjes met groente en toppings op tafel zodat beide kinderen zelf kunnen opscheppen—dat geeft autonomie en rust aan tafel!`;
    } else {
      tipHtml = `👨‍👩‍👧‍👦 <strong>Gezinstip (${names}):</strong> Laat de kinderen om de beurt het 'Kookhulpje van de Dag' zijn en zet om 15:00 uur uit school één gezamenlijk bijtank-plankje met rauwkost en fruit klaar!`;
    }
    comboTip.classList.remove("hidden");
    comboTip.innerHTML = tipHtml;
  }

  function renderProfileModalChildrenList(editingId) {
    const listEl = document.getElementById("savedChildrenList");
    const secEl = document.getElementById("savedChildrenSection");
    if (!listEl || !secEl) return;

    if (state.children.length === 0) {
      secEl.classList.add("hidden");
      return;
    }

    secEl.classList.remove("hidden");
    listEl.innerHTML = state.children
      .map((ch) => {
        const calc = calculateAgeForProfile(ch);
        const isEditing = ch.id === editingId;
        return `
        <button type="button" class="saved-child-pill ${isEditing ? "active" : ""}" data-edit-child="${ch.id}">
          👶 ${escapeHtml(ch.name || "Kind")}${calc ? ` • ${calc.readableAge}` : ""}
        </button>
      `;
      })
      .join("");

    listEl.querySelectorAll("[data-edit-child]").forEach((btn) => {
      btn.addEventListener("click", () => {
        populateProfileFormForChild(btn.dataset.editChild);
      });
    });
  }

  function populateProfileFormForChild(childId) {
    const ch = state.children.find((c) => c.id === childId);
    const fallbackProf = !ch && state.children.length === 0 ? state.profile : null;
    const src = ch || fallbackProf;
    document.getElementById("editingChildIdInput").value = ch ? ch.id : "";
    document.getElementById("childNameInput").value = src ? src.name || "" : "";
    document.getElementById("childDobInput").value = src ? src.dob || "" : "";
    document.getElementById("childDueDateInput").value = src ? src.dueDate || "" : "";
    document.getElementById("useAdjustedAgeCheckbox").checked = src ? src.useAdjusted !== false : true;
    const weightIn = document.getElementById("childWeightInput");
    const feedIn = document.getElementById("childFeedingTypeInput");
    if (weightIn) {
      weightIn.value = src && Number(src.weightKg) > 0 ? String(src.weightKg) : "";
    }
    if (feedIn) {
      feedIn.value = src && src.feedingType ? src.feedingType : "";
    }
    const clearBtn = document.getElementById("clearProfileBtn");
    if (clearBtn) {
      const hasLegacyProfile = Boolean(state.profile && (state.profile.name || state.profile.dob));
      clearBtn.classList.toggle("hidden", !ch && !(state.children.length === 0 && hasLegacyProfile));
    }
    renderProfileModalChildrenList(ch ? ch.id : "");
    updateProfilePreview();
    renderTeethTracker();
  }

  function updateProfilePreview() {
    const name = document.getElementById("childNameInput").value.trim() || "Je kind";
    const dob = document.getElementById("childDobInput").value;
    const due = document.getElementById("childDueDateInput").value;
    const useAdj = document.getElementById("useAdjustedAgeCheckbox").checked;
    const weightVal = parseFloat(document.getElementById("childWeightInput")?.value || "");
    const feedVal = document.getElementById("childFeedingTypeInput")?.value || "";
    const adjRow = document.getElementById("adjustedAgeToggleRow");
    const box = document.getElementById("profilePreviewBox");

    if (!dob) {
      if (adjRow) adjRow.classList.add("hidden");
      box.textContent = "Kies een geboortedatum (of uitgerekende datum) om de huidige week te berekenen.";
      return;
    }

    const calc = calculateAgeForProfile({ name, dob, dueDate: due, useAdjusted: useAdj });
    if (!calc) {
      if (adjRow) adjRow.classList.add("hidden");
      box.textContent = "Kies een geldige datum.";
      return;
    }

    if (adjRow) {
      adjRow.classList.toggle("hidden", !(calc.isPreemie && calc.chronoWeek <= 104));
    }

    const stg = getStageForWeek(calc.activeTargetWeek);
    const weightInfo = getPersonalWeightAdvice(calc.activeTargetWeek, stg, {
      name,
      weightKg: !isNaN(weightVal) && weightVal > 0 ? weightVal : "",
      feedingType: feedVal
    });
    const extraCustomLine =
      weightInfo.milkOppasShort
        ? `<br/><span style="font-size:var(--fs-sm); color:var(--text-muted);">⚖️ ${escapeHtml(weightInfo.milkOppasShort)}</span>`
        : "";

    if (calc.isExpecting) {
      box.innerHTML = `<strong>🤰 ${escapeHtml(name)} wordt verwacht over ${calc.daysUntilDue} ${calc.daysUntilDue === 1 ? "dag" : "dagen"}!</strong><br/>De app staat voor jullie klaar op <strong>Week 1 (${escapeHtml(stg.title)})</strong>.${extraCustomLine}`;
    } else if (calc.isPreemie && calc.chronoWeek <= 104) {
      const modeLabel = useAdj
        ? `Week ${calc.adjustedWeek} (gecorrigeerd • kalenderweek ${calc.chronoWeek})`
        : `Week ${calc.chronoWeek} (kalenderleeftijd • gecorrigeerd week ${calc.adjustedWeek})`;
      box.innerHTML = `<strong>🎉 ${escapeHtml(name)} zit nu in ${modeLabel}!</strong><br/>Fase: ${escapeHtml(stg.title)}${extraCustomLine}`;
    } else {
      box.innerHTML = `<strong>🎉 ${escapeHtml(name)} zit nu in Week ${calc.activeTargetWeek}!</strong><br/>Fase: ${escapeHtml(stg.title)}${extraCustomLine}`;
    }
  }

  // =========================================================================
  // 12. OPPAS- & OMA-KAARTJE GENERATOR
  // =========================================================================
  function buildOppasCardText() {
    const week = state.currentWeek;
    const stage = getStageForWeek(week);
    const activeChild = getActiveChild();
    const childName = activeChild ? activeChild.name : state.profile.name || "Ons kind";
    const exactAge = formatExactAgeFromWeek(week);
    const store = getActiveStore();
    const customNote = document.getElementById("oppasCustomNote").value.trim();

    const weightInfo = getPersonalWeightAdvice(week, stage);
    const milkVol = weightInfo.milkOppasShort
      ? `${weightInfo.milkOppasShort}`
      : `${stage.nutrition.milkVolumeMetric} (${stage.nutrition.feedsPerDay})`;
    const solidPortion = stage.nutrition.portionGuideMetric;
    const cutInfo = getCutVisualData(stage.cutType, stage);
    const napStr = getNapWindowString(week);

    // Geteste allergenen
    const testedAllergens = DATA.allergens
      .filter((a) => {
        const arr = store.allergenExposures && store.allergenExposures[a.id];
        return Array.isArray(arr) && arr.some(Boolean);
      })
      .map((a) => a.name);

    let allergenLine = "";
    if (testedAllergens.length > 0) {
      allergenLine = `🥜 *Al gewend aan allergenen:* ${testedAllergens.join(", ")}`;
    } else if (week <= 16) {
      allergenLine = `🥜 *Allergenen:* Nog niet van toepassing (tot 4 maanden uitsluitend melkvoeding).`;
    } else if (week > 208) {
      allergenLine = `🥜 *Allergieën / Dieet:* Geen bijzonderheden gemeld.`;
    } else {
      allergenLine = `🥜 *Allergenen:* Geef geen nieuwe allergenen zonder overleg.`;
    }

    // Kies een bewaard favoriet spelletje uit deze fase (of anders het eerste spelletje van deze fase)
    const stageGames = stage.games || [];
    const favGame =
      stageGames.find((g) => store.favoriteGames && store.favoriteGames[g.id]) ||
      stageGames[0] ||
      null;

    const drinkHeader =
      week <= 52 ? "🍼 *Melk & Drinken:*" : week <= 208 ? "🥛 *Zuivel & Drinken:*" : "💧 *Drinken & Zuivel:*";
    const solidHeader = week <= 52 ? "🥣 *Vaste voeding:*" : "🍽️ *Maaltijden & Tussendoor:*";
    const cutHeader = week > 208 ? "🍽️ *Bord- & Trommelrichtlijn:*" : "🔪 *Veilig serveren:*";
    const avoidHeader = week > 208 ? "⚠️ *Aandachtspunt:*" : "🚫 *Niet geven:*";

    const lines = [
      `👵 *Oppas- & Oma-Kaartje voor ${childName}*${weightInfo.fmtKg ? ` (${weightInfo.fmtKg} kg)` : ""}`,
      `📅 *Leeftijd:* ${exactAge} (${stage.shortLabel})`,
      ``,
      `${drinkHeader} ${milkVol}`,
      `${solidHeader} ${solidPortion} (${stage.nutrition.solidsPerDay})`,
      `${cutHeader} ${cutInfo.title}`,
      `${avoidHeader} ${stage.nutrition.avoidFoods[0] || "Honing (<1jr) en hele noten/druiven"}`,
      weightInfo.pcmOppasShort ? `🌡️ *Bij koorts/pijn (paracetamol):* ${weightInfo.pcmOppasShort}` : null,
      ``,
      `🌙 *Slaap & Ritme:* ${stage.sleep.wakeWindow} • ${stage.sleep.naps}`,
      napStr ? `⏰ *Richtlijn vandaag:* ${napStr}` : null,
      allergenLine,
      favGame ? `🎲 *Leuke activiteit nu:* ${favGame.title} — ${favGame.howToPlay}` : null,
      customNote ? `\n💛 *Extra notitie:* ${customNote}` : null
    ].filter(Boolean);

    return lines.join("\n");
  }

  function refreshOppasPreview() {
    const previewEl = document.getElementById("oppasPreviewText");
    if (!previewEl) return;
    previewEl.textContent = buildOppasCardText();
  }

  // =========================================================================
  // 13. NAVIGATIE & EVENTS
  // =========================================================================
  function setWeek(w, scroll = true) {
    state.currentWeek = clampWeek(w);
    state.recipesExpanded = false;
    state.gamesExpanded = false;
    state.foodsExpanded = false;
    state.allergensExpanded = false;
    syncEpochToWeek(state.currentWeek);
    saveState();
    renderAll(scroll);
  }

  function setZoom(z) {
    if (!ZOOM_ORDER.includes(z)) return;
    state.zoomMode = z;
    const calc = getChildCalculatedAge();
    if (z === "week" && state.currentWeek > 104) {
      state.currentWeek = calc && calc.activeTargetWeek <= 104 ? calc.activeTargetWeek : 104;
    } else if (z === "month" && state.currentWeek > 156) {
      state.currentWeek = calc && calc.activeTargetWeek <= 156 ? calc.activeTargetWeek : 156;
    }
    syncEpochToWeek(state.currentWeek);
    saveState();
    renderAll(true);
  }

  function getStickyNavOffset(extraPadding = 18) {
    const dock = document.getElementById("timelineDock");
    if (!dock) return 80 + extraPadding;
    if (!dock.classList.contains("is-compact")) {
      dock.classList.add("is-compact");
    }
    const compactHeight = Math.ceil(dock.getBoundingClientRect().height);
    return Math.max(compactHeight, 70) + extraPadding;
  }

  const VALID_VIEWS = ["food", "games", "tips", "lookup", "sos"];
  const VIEW_ALIASES = {
    play: "games",
    milestones: "tips"
  };

  function normalizeViewName(view) {
    const mapped = VIEW_ALIASES[view] || view;
    return VALID_VIEWS.includes(mapped) ? mapped : "food";
  }

  let heroManuallyExpandedOnOtherTab = false;

  function syncHeroCompactForView(safeView) {
    const heroEl = document.getElementById("stageHero");
    const toggleBtn = document.getElementById("toggleHeroOverviewBtn");
    if (!heroEl || !toggleBtn) return;

    if (safeView === "food") {
      heroEl.classList.remove("is-collapsed-for-tab");
      toggleBtn.classList.add("hidden");
      toggleBtn.setAttribute("aria-expanded", "true");
    } else {
      toggleBtn.classList.remove("hidden");
      const isCollapsed = !heroManuallyExpandedOnOtherTab;
      heroEl.classList.toggle("is-collapsed-for-tab", isCollapsed);
      toggleBtn.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
      toggleBtn.textContent = isCollapsed ? "Fase-overzicht ▾" : "Inklappen ▴";
    }
  }

  function setView(view, autoScroll = false, fromPopState = false) {
    const safeView = normalizeViewName(view);
    const isSameView = state.activeView === safeView;
    state.activeView = safeView;
    if (!isSameView) {
      heroManuallyExpandedOnOtherTab = false;
    }
    document.body.setAttribute("data-active-view", safeView);
    syncHeroCompactForView(safeView);

    document.querySelectorAll(".nav-tab").forEach((t) => {
      const isAct = t.dataset.view === safeView;
      t.classList.toggle("active", isAct);
      t.setAttribute("aria-selected", isAct ? "true" : "false");
    });
    let activePanel = null;
    document.querySelectorAll(".tab-panel").forEach((p) => {
      const isAct = p.dataset.pillar === safeView;
      p.classList.toggle("hidden", !isAct);
      if (isAct) activePanel = p;
    });
    saveState();

    if (!fromPopState && !isSameView && window.history && typeof window.history.pushState === "function") {
      try {
        window.history.pushState({ sgView: safeView }, "");
      } catch (_) {}
    }

    if (autoScroll && activePanel) {
      // Zet de sticky dock direct in compacte stand zodat het layout-model stabiel is en niet verspringt tijdens het scrollen
      const dock = document.getElementById("timelineDock");
      if (dock && !dock.classList.contains("is-compact")) {
        dock.classList.add("is-compact");
      }

      // Wacht twee animatieframes zodat de browser de DOM-layout na het zichtbaar maken volledig heeft doorberekend
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const offset = getStickyNavOffset(18);
          const panelRect = activePanel.getBoundingClientRect();
          const currentY = window.scrollY || window.pageYOffset || 0;
          const targetY = Math.max(0, Math.round(panelRect.top + currentY - offset));

          // Als de ouder op hetzelfde tabblad tikt terwijl hij al precies bij de sectiekop staat: scroll terug naar de Hero bovenaan.
          // Staat de ouder nog boven het paneel (bijv. op de Hero-kaart bij 'Voeding') of juist ver eronder, scroll dan naar de sectiekop!
          if (isSameView && Math.abs(currentY - targetY) <= 60 && currentY > 40) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }

          if (Math.abs(currentY - targetY) > 3) {
            window.scrollTo({
              top: targetY,
              behavior: "smooth"
            });
          }

          // Subtiele highlight op de bovenste kaart van het geopende paneel voor directe visuele herkenning
          const topCard = activePanel.querySelector(".section-header-card, .search-header-card, .games-header-card, .minimal-card, article");
          if (topCard) {
            topCard.classList.remove("tab-arrival-highlight");
            void topCard.offsetWidth; // trigger reflow
            topCard.classList.add("tab-arrival-highlight");
            setTimeout(() => topCard.classList.remove("tab-arrival-highlight"), 1200);
          }
        });
      });
    }
  }

  function wireEvents() {
    // Tab navigatie (5 tabs)
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.addEventListener("click", () => setView(tab.dataset.view, true));
    });

    // Hero overzicht in-/uitklappen op niet-Voeding tabs
    const toggleHeroBtn = document.getElementById("toggleHeroOverviewBtn");
    if (toggleHeroBtn) {
      toggleHeroBtn.addEventListener("click", () => {
        heroManuallyExpandedOnOtherTab = !heroManuallyExpandedOnOtherTab;
        syncHeroCompactForView(state.activeView);
      });
    }

    // Nachtmodus wissel
    document.getElementById("themeToggleBtn").addEventListener("click", () => {
      applyTheme(state.theme === "dark" ? "light" : "dark");
      saveState();
    });

    // Zoom-knoppen (Week 0-2j, Maand 0-3j, Fase, Jaar)
    document.querySelectorAll(".zoom-tab").forEach((btn) => {
      btn.addEventListener("click", () => setZoom(btn.dataset.zoom));
    });

    // Compacte tijdlijn bij scrollen + 2-weg Zoom / Inklappen toggle
    const timelineDock = document.getElementById("timelineDock");
    const expandTimelineBtn = document.getElementById("expandTimelineBtn");
    if (expandTimelineBtn && timelineDock) {
      expandTimelineBtn.addEventListener("click", () => {
        timelineManualExpanded = !timelineManualExpanded;
        syncTimelineDockCompactState();
        requestCenterActiveTimelineNode(true);
      });
    }
    window.addEventListener(
      "scroll",
      () => {
        syncTimelineDockCompactState();
      },
      { passive: true }
    );
    window.addEventListener(
      "resize",
      () => {
        scrollActiveNodeToCenter(false);
        renderStageRecipes(getStageForWeek(state.currentWeek));
        renderGames(getStageForWeek(state.currentWeek));
        renderFoodLookup(state.currentWeek);
        renderAllergens(state.currentWeek);
      },
      { passive: true }
    );

    // Vooruitblik & Fase-doorstroom knoppen onderaan de pagina
    const upcomingPrevBtn = document.getElementById("upcomingPrevStageBtn");
    if (upcomingPrevBtn) {
      upcomingPrevBtn.addEventListener("click", () => {
        const targetW = Number(upcomingPrevBtn.dataset.jumpPrevWeek);
        if (targetW) {
          setWeek(targetW, true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }

    const upcomingBtn = document.getElementById("upcomingNextStageBtn");
    if (upcomingBtn) {
      upcomingBtn.addEventListener("click", () => {
        const targetW = Number(upcomingBtn.dataset.jumpNextWeek);
        if (targetW) {
          setWeek(targetW, true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }

    // Periode knoppen (Jaar 1, Jaar 2, Jaar 3)
    document.querySelectorAll(".epoch-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        const ep = pill.dataset.epoch;
        state.epochFilter = ep;
        if (ep === "y1" && state.currentWeek > 52) setWeek(24, true);
        else if (ep === "y2" && (state.currentWeek < 53 || state.currentWeek > 104)) setWeek(65, true);
        else if (ep === "preschool" && (state.currentWeek < 105 || state.currentWeek > 156)) setWeek(120, true);
        else renderTimeline(true);
      });
    });

    // Vorige / Volgende op tijdlijn (stapt exact per week / maand / fase / jaar)
    document.getElementById("prevTimeBtn").addEventListener("click", () => {
      if (state.zoomMode === "week") {
        setWeek(Math.max(1, state.currentWeek - 1), true);
      } else if (state.zoomMode === "month") {
        const curM = Math.min(36, getMonthForWeek(state.currentWeek));
        if (curM > 1) setWeek(getRepresentativeWeekForMonth(curM - 1), true);
      } else if (state.zoomMode === "year") {
        const curY = Math.min(12, Math.max(1, Math.ceil(state.currentWeek / 52)));
        if (curY > 1) setWeek(YEARS_TIMELINE_LIST[curY - 2].week, true);
      } else {
        const cur = getStageForWeek(state.currentWeek);
        const idx = DATA.stages.findIndex((s) => s.id === cur.id);
        if (idx > 0) setWeek(DATA.stages[idx - 1].minWeek, true);
      }
    });

    document.getElementById("nextTimeBtn").addEventListener("click", () => {
      if (state.zoomMode === "week") {
        setWeek(Math.min(104, state.currentWeek + 1), true);
      } else if (state.zoomMode === "month") {
        const curM = getMonthForWeek(state.currentWeek);
        if (curM < 36) setWeek(getRepresentativeWeekForMonth(curM + 1), true);
      } else if (state.zoomMode === "year") {
        const curY = Math.min(12, Math.max(1, Math.ceil(state.currentWeek / 52)));
        if (curY < 12) setWeek(YEARS_TIMELINE_LIST[curY].week, true);
      } else {
        const cur = getStageForWeek(state.currentWeek);
        const idx = DATA.stages.findIndex((s) => s.id === cur.id);
        if (idx < DATA.stages.length - 1) setWeek(DATA.stages[idx + 1].minWeek, true);
      }
    });

    // Schuifbalk & Snel-labels
    const slider = document.getElementById("masterWeekSlider");
    slider.addEventListener("input", () => {
      state.currentWeek = sliderPosToWeek(slider.value);
      syncEpochToWeek(state.currentWeek);
      renderAll(true);
    });
    slider.addEventListener("change", () => saveState());

    document.querySelectorAll("[data-jump-week]").forEach((mark) => {
      mark.addEventListener("click", () => setWeek(Number(mark.dataset.jumpWeek), true));
    });

    // Filters & Zoeken
    document.querySelectorAll("[data-meal-filter]").forEach((chip) => {
      chip.addEventListener("click", () => {
        state.recipeMealFilter = chip.dataset.mealFilter;
        state.recipesExpanded = false;
        renderStageRecipes(getStageForWeek(state.currentWeek));
      });
    });

    const toggleRecipesBtn = document.getElementById("toggleRecipesExpandBtn");
    if (toggleRecipesBtn) {
      toggleRecipesBtn.addEventListener("click", () => {
        const curStage = getStageForWeek(state.currentWeek);
        const wasExpanded = state.recipesExpanded;
        state.recipesExpanded = !state.recipesExpanded;
        renderStageRecipes(curStage);

        if (wasExpanded) {
          const cardEl = document.getElementById("stageRecipesCard");
          if (cardEl) {
            const offset = getStickyNavOffset(16);
            const cardTop = cardEl.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
            window.scrollTo({
              top: Math.max(0, Math.round(cardTop - offset)),
              behavior: "smooth"
            });
          }
        }
      });
    }

    const toggleGamesBtn = document.getElementById("toggleGamesExpandBtn");
    if (toggleGamesBtn) {
      toggleGamesBtn.addEventListener("click", () => {
        const curStage = getStageForWeek(state.currentWeek);
        const wasExpanded = state.gamesExpanded;
        state.gamesExpanded = !state.gamesExpanded;
        renderGames(curStage);

        if (wasExpanded) {
          const cardEl = document.getElementById("panelGames");
          if (cardEl) {
            const offset = getStickyNavOffset(16);
            const cardTop = cardEl.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
            window.scrollTo({
              top: Math.max(0, Math.round(cardTop - offset)),
              behavior: "smooth"
            });
          }
        }
      });
    }

    const toggleAllGamesBtn = document.getElementById("toggleAllStagesGamesBtn");
    if (toggleAllGamesBtn) {
      toggleAllGamesBtn.addEventListener("click", () => {
        state.showAllStagesGames = !state.showAllStagesGames;
        renderGames(getStageForWeek(state.currentWeek));
      });
    }

    document.querySelectorAll("[data-game-cat]").forEach((chip) => {
      chip.addEventListener("click", () => {
        state.gameCategoryFilter = chip.dataset.gameCat;
        state.gamesExpanded = false;
        renderGames(getStageForWeek(state.currentWeek));
      });
    });

    const toggleFoodsBtn = document.getElementById("toggleFoodsExpandBtn");
    if (toggleFoodsBtn) {
      toggleFoodsBtn.addEventListener("click", () => {
        const wasExpanded = state.foodsExpanded;
        state.foodsExpanded = !state.foodsExpanded;
        renderFoodLookup(state.currentWeek);

        if (wasExpanded) {
          const cardEl = document.getElementById("lookupHeaderTitle");
          if (cardEl) {
            const offset = getStickyNavOffset(16);
            const cardTop = cardEl.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
            window.scrollTo({
              top: Math.max(0, Math.round(cardTop - offset)),
              behavior: "smooth"
            });
          }
        }
      });
    }

    const toggleAllergensBtn = document.getElementById("toggleAllergensExpandBtn");
    if (toggleAllergensBtn) {
      toggleAllergensBtn.addEventListener("click", () => {
        const wasExpanded = state.allergensExpanded;
        state.allergensExpanded = !state.allergensExpanded;
        renderAllergens(state.currentWeek);

        if (wasExpanded) {
          const cardEl = document.getElementById("allergensDetails");
          if (cardEl) {
            const offset = getStickyNavOffset(16);
            const cardTop = cardEl.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
            window.scrollTo({
              top: Math.max(0, Math.round(cardTop - offset)),
              behavior: "smooth"
            });
          }
        }
      });
    }

    const searchInput = document.getElementById("globalSearchInput");

    const clearStaleSearchIfEmpty = () => {
      const q = state.searchQuery.trim().toLowerCase();
      if (!q) return;
      const store = getActiveStore();
      const hasMatchWithQuery = DATA.foodDatabase.some((f) => {
        if (!matchFoodCategory(f, state.foodCategoryFilter)) return false;
        if (!matchFoodStatus(f, state.foodStatusFilter, state.currentWeek, store)) return false;
        const searchable = [
          f.name,
          f.category,
          f.nutrients,
          f.prep4to5m,
          f.prep6to8m,
          f.prep9to12m,
          f.prep1to3y,
          f.prep4to12y
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchable.includes(q);
      });
      if (!hasMatchWithQuery) {
        state.searchQuery = "";
        if (searchInput) searchInput.value = "";
      }
    };

    document.querySelectorAll("[data-food-cat]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const clicked = chip.dataset.foodCat;
        state.foodCategoryFilter =
          state.foodCategoryFilter === clicked && clicked !== "all" ? "all" : clicked;
        state.foodsExpanded = false;
        clearStaleSearchIfEmpty();
        renderFoodLookup(state.currentWeek);
      });
    });

    document.querySelectorAll("[data-food-status]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const clicked = chip.dataset.foodStatus;
        state.foodStatusFilter =
          state.foodStatusFilter === clicked && clicked !== "all" ? "all" : clicked;
        state.foodsExpanded = false;
        clearStaleSearchIfEmpty();
        renderFoodLookup(state.currentWeek);
      });
    });

    searchInput.addEventListener("input", () => {
      state.searchQuery = searchInput.value;
      state.foodsExpanded = false;
      renderFoodLookup(state.currentWeek);
    });

    document.getElementById("clearSearchBtn").addEventListener("click", () => {
      searchInput.value = "";
      state.searchQuery = "";
      state.foodsExpanded = false;
      renderFoodLookup(state.currentWeek);
    });

    // Wakkertijd & Bedtijd calculator
    document.getElementById("lastWakeTimeInput").addEventListener("input", updateNapCalculator);

    // Kindprofielen Dialoog (Multi-Kind)
    const profDialog = document.getElementById("profileDialog");
    document.getElementById("openProfileBtn").addEventListener("click", () => {
      const active = getActiveChild();
      populateProfileFormForChild(active ? active.id : "");
      profDialog.showModal();
    });

    document.getElementById("quickAddChildBtn").addEventListener("click", () => {
      populateProfileFormForChild("");
      profDialog.showModal();
    });

    document.getElementById("newChildModeBtn").addEventListener("click", () => {
      populateProfileFormForChild("");
      document.getElementById("childNameInput").focus();
    });

    [
      "childNameInput",
      "childDobInput",
      "childDueDateInput",
      "useAdjustedAgeCheckbox",
      "childWeightInput",
      "childFeedingTypeInput"
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", updateProfilePreview);
        el.addEventListener("change", updateProfilePreview);
      }
    });

    document.getElementById("closeProfileDialogBtn").addEventListener("click", () => profDialog.close());
    document.getElementById("cancelProfileBtn").addEventListener("click", () => profDialog.close());

    document.getElementById("profileForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const editingId = document.getElementById("editingChildIdInput").value;
      const name = document.getElementById("childNameInput").value.trim() || `Kind ${state.children.length + 1}`;
      const dob = document.getElementById("childDobInput").value;
      const dueDate = document.getElementById("childDueDateInput").value;
      const useAdjusted = document.getElementById("useAdjustedAgeCheckbox").checked;
      const rawWeight = parseFloat(document.getElementById("childWeightInput")?.value || "");
      const weightKg = !isNaN(rawWeight) && rawWeight >= 1.5 && rawWeight <= 65 ? Math.round(rawWeight * 100) / 100 : "";
      const feedingType = document.getElementById("childFeedingTypeInput")?.value || "";

      let targetChild = state.children.find((c) => c.id === editingId);
      if (targetChild) {
        targetChild.name = name;
        targetChild.dob = dob;
        targetChild.dueDate = dueDate;
        targetChild.useAdjusted = useAdjusted;
        targetChild.weightKg = weightKg;
        targetChild.feedingType = feedingType;
      } else {
        const newId = "child-" + Date.now();
        targetChild = {
          id: newId,
          name,
          dob,
          dueDate,
          useAdjusted,
          weightKg,
          feedingType,
          customOppasNote: "",
          triedFoods: state.children.length === 0 ? { ...state.triedFoods } : {},
          favoriteGames: state.children.length === 0 ? { ...state.favoriteGames } : {},
          favoriteRecipes: state.children.length === 0 ? { ...state.favoriteRecipes } : {},
          checkedMilestones: state.children.length === 0 ? { ...state.checkedMilestones } : {},
          milestoneMemories: state.children.length === 0 ? { ...state.milestoneMemories } : {},
          checkedReadiness: state.children.length === 0 ? { ...state.checkedReadiness } : {},
          growthLogs: state.children.length === 0 ? [...(state.growthLogs || [])] : [],
          cbQuestions: state.children.length === 0 ? [...(state.cbQuestions || [])] : [],
          checkedTeeth: state.children.length === 0 ? { ...state.checkedTeeth } : {},
          checkedHabits: state.children.length === 0 ? { ...state.checkedHabits } : {},
          allergenExposures: state.children.length === 0 ? { ...state.allergenExposures } : {},
          foodPracticeCounts: state.children.length === 0 ? { ...state.foodPracticeCounts } : {}
        };
        state.children.push(targetChild);
      }

      // Als er een gewicht is ingevuld en dit nog niet in het CB Groei-logboek stond, voeg het automatisch toe op vandaag
      if (weightKg > 0) {
        if (!Array.isArray(targetChild.growthLogs)) targetChild.growthLogs = [];
        const todayIso = new Date().toISOString().slice(0, 10);
        const alreadyLoggedSame = targetChild.growthLogs.some((g) => Number(g.weightKg) === Number(weightKg));
        if (!alreadyLoggedSame) {
          targetChild.growthLogs.push({
            id: "g-" + Date.now(),
            date: todayIso,
            weightKg: Number(weightKg),
            lengthCm: 0
          });
        }
      }

      state.activeChildId = targetChild.id;
      state.profile = {
        name: targetChild.name,
        dob: targetChild.dob,
        dueDate: targetChild.dueDate,
        useAdjusted: targetChild.useAdjusted,
        weightKg: targetChild.weightKg || "",
        feedingType: targetChild.feedingType || "",
        customOppasNote: targetChild.customOppasNote || ""
      };

      const calc = calculateAgeForProfile(targetChild);
      if (calc) {
        state.currentWeek = calc.activeTargetWeek;
        syncEpochToWeek(state.currentWeek);
      }

      saveState();
      profDialog.close();
      renderAll(true);
    });

    document.getElementById("clearProfileBtn").addEventListener("click", () => {
      const editingId = document.getElementById("editingChildIdInput").value;
      if (editingId) {
        state.children = state.children.filter((c) => c.id !== editingId);
        state.activeChildId = state.children[0] ? state.children[0].id : null;
      }
      const nextActive = getActiveChild();
      if (nextActive) {
        state.profile = {
          name: nextActive.name,
          dob: nextActive.dob,
          dueDate: nextActive.dueDate,
          useAdjusted: nextActive.useAdjusted,
          weightKg: nextActive.weightKg || "",
          feedingType: nextActive.feedingType || "",
          customOppasNote: nextActive.customOppasNote || ""
        };
        const calc = calculateAgeForProfile(nextActive);
        if (calc) {
          state.currentWeek = calc.activeTargetWeek;
          syncEpochToWeek(state.currentWeek);
        }
      } else {
        state.profile = { name: "", dob: "", dueDate: "", useAdjusted: true, weightKg: "", feedingType: "", customOppasNote: "" };
      }
      saveState();
      profDialog.close();
      renderAll(false);
    });

    const handleJumpToNowClick = () => {
      const calc = getChildCalculatedAge();
      if (calc) {
        setWeek(calc.activeTargetWeek, true);
      } else {
        const active = getActiveChild();
        populateProfileFormForChild(active ? active.id : "");
        profDialog.showModal();
        const dobInput = document.getElementById("childDobInput");
        if (dobInput) dobInput.focus();
      }
    };

    document.getElementById("jumpToChildBtn").addEventListener("click", handleJumpToNowClick);
    const dockJumpBtn = document.getElementById("dockJumpToChildBtn");
    if (dockJumpBtn) {
      dockJumpBtn.addEventListener("click", handleJumpToNowClick);
    }

    // Oppas- & Oma-Kaartje Dialoog
    const oppasDialog = document.getElementById("oppasDialog");
    const oppasNoteInput = document.getElementById("oppasCustomNote");

    document.getElementById("openOppasBtn").addEventListener("click", () => {
      const active = getActiveChild();
      oppasNoteInput.value = active ? active.customOppasNote || "" : state.profile.customOppasNote || "";
      document.getElementById("oppasStatusMsg").textContent = "";
      refreshOppasPreview();
      oppasDialog.showModal();
    });

    oppasNoteInput.addEventListener("input", () => {
      const active = getActiveChild();
      if (active) active.customOppasNote = oppasNoteInput.value;
      else state.profile.customOppasNote = oppasNoteInput.value;
      saveState();
      refreshOppasPreview();
    });

    document.getElementById("closeOppasDialogBtn").addEventListener("click", () => oppasDialog.close());

    document.getElementById("shareOppasWhatsappBtn").addEventListener("click", () => {
      const text = buildOppasCardText();
      const target = openWhatsAppShare(text, "auto");
      document.getElementById("oppasStatusMsg").textContent =
        target === "web"
          ? "✓ Direct geopend in WhatsApp Web (en met alle emoji's gekopieerd naar je klembord)!"
          : "✓ Geopend in WhatsApp (en gekopieerd naar je klembord)!";
    });

    const shareOppasAppBtn = document.getElementById("shareOppasWhatsappAppBtn");
    if (shareOppasAppBtn) {
      shareOppasAppBtn.addEventListener("click", () => {
        const text = buildOppasCardText();
        openWhatsAppShare(text, "app");
        document.getElementById("oppasStatusMsg").textContent =
          "✓ Geopend in de WhatsApp App (en met alle emoji's gekopieerd naar je klembord)!";
      });
    }

    document.getElementById("copyOppasTextBtn").addEventListener("click", () => {
      const text = buildOppasCardText();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      }
      document.getElementById("oppasStatusMsg").textContent = "✓ Oppas-kaartje met emoji's gekopieerd naar klembord!";
    });

    // Back-up Dialoog
    const backupDialog = document.getElementById("backupDialog");
    document.getElementById("openBackupBtn").addEventListener("click", () => {
      document.getElementById("backupStatusMsg").textContent = "";
      backupDialog.showModal();
    });
    document.getElementById("closeBackupDialogBtn").addEventListener("click", () => backupDialog.close());

    document.getElementById("exportJsonBtn").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "samen-groeien-backup.json";
      a.click();
      URL.revokeObjectURL(url);
      document.getElementById("backupStatusMsg").textContent = "✓ Back-up gedownload!";
    });

    document.getElementById("importJsonInput").addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imp = JSON.parse(reader.result);
          Object.assign(state, imp);
          state.unit = "metric";
          state.currentWeek = clampWeek(state.currentWeek);
          sanitizeTriedFoodsAndHabits(state);
          if (Array.isArray(state.children)) {
            state.children.forEach((ch) => sanitizeTriedFoodsAndHabits(ch));
          }
          syncEpochToWeek(state.currentWeek);
          applyTheme(state.theme);
          setView(state.activeView || "food");
          saveState();
          renderAll(true);
          document.getElementById("backupStatusMsg").textContent = "✓ Gegevens hersteld!";
        } catch (err) {
          document.getElementById("backupStatusMsg").textContent = "⚠️ Ongeldig bestand.";
        }
      };
      reader.readAsText(file);
    });

    // Feedback & Ervaring Dialoog
    const feedbackDialog = document.getElementById("feedbackDialog");
    const openFeedbackBtn = document.getElementById("openFeedbackBtn");
    const closeFeedbackBtn = document.getElementById("closeFeedbackDialogBtn");
    const cancelFeedbackBtn = document.getElementById("cancelFeedbackBtn");
    const feedbackForm = document.getElementById("feedbackForm");
    const feedbackStatusMsg = document.getElementById("feedbackStatusMsg");
    let activeFeedbackType = "compliment";

    const feedbackTypeChips = document.querySelectorAll("#feedbackTypeChips [data-fb-type]");
    feedbackTypeChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        activeFeedbackType = chip.dataset.fbType;
        feedbackTypeChips.forEach((c) => c.classList.toggle("active", c === chip));
      });
    });

    if (openFeedbackBtn && feedbackDialog) {
      openFeedbackBtn.addEventListener("click", () => {
        activeFeedbackType = "compliment";
        feedbackTypeChips.forEach((c) => c.classList.toggle("active", c.dataset.fbType === "compliment"));
        const textInput = document.getElementById("feedbackTextInput");
        const emailInput = document.getElementById("feedbackEmailInput");
        if (textInput) textInput.value = "";
        if (emailInput) emailInput.value = "";
        if (feedbackStatusMsg) {
          feedbackStatusMsg.textContent = "";
          feedbackStatusMsg.style.color = "";
        }
        feedbackDialog.showModal();
        if (textInput) textInput.focus();
      });
    }

    if (closeFeedbackBtn && feedbackDialog) {
      closeFeedbackBtn.addEventListener("click", () => feedbackDialog.close());
    }
    if (cancelFeedbackBtn && feedbackDialog) {
      cancelFeedbackBtn.addEventListener("click", () => feedbackDialog.close());
    }

    // Beheerdersfuncties voor app-eigenaar (beschikbaar via browser-console)
    window.viewFeedback = () => {
      try {
        const raw = localStorage.getItem("samen_groeien_feedback_v1");
        const entries = raw ? JSON.parse(raw) : [];
        console.table(entries);
        return entries;
      } catch (e) {
        return [];
      }
    };

    window.exportFeedback = () => {
      const raw = localStorage.getItem("samen_groeien_feedback_v1") || "[]";
      const blob = new Blob([raw], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `samen_groeien_feedback_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };

    if (feedbackForm && feedbackDialog) {
      feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const textInput = document.getElementById("feedbackTextInput");
        const sectionSelect = document.getElementById("feedbackSectionSelect");
        const emailInput = document.getElementById("feedbackEmailInput");
        const submitBtn = document.getElementById("submitFeedbackBtn");

        const msg = textInput ? textInput.value.trim() : "";
        if (!msg) return;

        const emailVal = emailInput ? emailInput.value.trim() : "";
        const sectionVal = sectionSelect ? sectionSelect.value : "algemeen";
        const curStage = typeof getStageForWeek === "function" ? getStageForWeek(state.currentWeek) : null;
        const stageName = curStage ? curStage.title : `Week ${state.currentWeek}`;

        const typeLabels = {
          compliment: "🌟 Compliment",
          suggestion: "💡 Verbetersuggestie",
          bug: "🐛 Fout / Probleem"
        };
        const typeLabel = typeLabels[activeFeedbackType] || activeFeedbackType;

        const entry = {
          id: "fb-" + Date.now(),
          type: activeFeedbackType,
          section: sectionVal,
          message: msg,
          email: emailVal,
          timestamp: new Date().toISOString(),
          week: state.currentWeek,
          stage: stageName
        };

        // Altijd ook lokaal opslaan als veilige offline back-up (zonder kindnaam voor AVG-privacy)
        try {
          const existingRaw = localStorage.getItem("samen_groeien_feedback_v1");
          const existingList = existingRaw ? JSON.parse(existingRaw) : [];
          existingList.push(entry);
          localStorage.setItem("samen_groeien_feedback_v1", JSON.stringify(existingList));
        } catch (err) {
          // ignore localStorage error
        }

        // Knop op verzenden zetten
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Versturen...";
        }
        if (feedbackStatusMsg) {
          feedbackStatusMsg.textContent = "Even geduld, je feedback wordt verstuurd...";
          feedbackStatusMsg.style.color = "var(--text-muted)";
        }

        // FormSubmit AJAX naar support@bbold.app (AVG-veilig: geen kindnaam meegestuurd)
        const payload = {
          naam: "Ouder (Samen Groeien)",
          email: emailVal || "anoniem@bbold.app",
          _replyto: emailVal || "support@bbold.app",
          _subject: `Samen Groeien Feedback [${typeLabel}] - ${sectionVal}`,
          type_feedback: typeLabel,
          onderdeel: sectionVal,
          ontwikkelingsfase: `Week ${state.currentWeek} • ${stageName}`,
          bericht: msg,
          _captcha: "false"
        };

        try {
          await fetch("https://formsubmit.co/ajax/support@bbold.app", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify(payload)
          });

          if (feedbackStatusMsg) {
            feedbackStatusMsg.textContent = "✓ Hartelijk dank voor je waardevolle feedback! We nemen je ervaring zorgvuldig mee.";
            feedbackStatusMsg.style.color = "var(--primary)";
          }
        } catch (fetchErr) {
          // Offline fallback
          if (feedbackStatusMsg) {
            feedbackStatusMsg.textContent = "✓ Opgeslagen! Zodra er verbinding is wordt het verwerkt. Hartelijk dank!";
            feedbackStatusMsg.style.color = "var(--primary)";
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "✓ Verstuur feedback";
          }
          setTimeout(() => {
            if (feedbackDialog.open) feedbackDialog.close();
            if (feedbackStatusMsg) {
              feedbackStatusMsg.textContent = "";
              feedbackStatusMsg.style.color = "";
            }
            if (textInput) textInput.value = "";
            if (emailInput) emailInput.value = "";
          }, 1600);
        }
      });
    }

    // 1. Onboarding Welkomstkaart acties
    const onboardingSetupBtn = document.getElementById("onboardingSetupChildBtn");
    const onboardingDismissBtn = document.getElementById("onboardingDismissBtn");
    if (onboardingSetupBtn && profDialog) {
      onboardingSetupBtn.addEventListener("click", () => {
        populateProfileFormForChild("");
        profDialog.showModal();
        const nameInput = document.getElementById("childNameInput");
        if (nameInput) nameInput.focus();
      });
    }
    if (onboardingDismissBtn) {
      onboardingDismissBtn.addEventListener("click", () => {
        state.onboardingDismissed = true;
        saveState();
        renderOnboardingWelcomeCard();
      });
    }

    // 2. Gecombineerde Week-Boodschappenlijst acties
    const shareWeeklyWaBtn = document.getElementById("shareWeeklyGroceryWhatsappBtn");
    const copyWeeklyBtn = document.getElementById("copyWeeklyGroceryBtn");
    const clearWeeklyBtn = document.getElementById("clearWeeklyGroceryBtn");

    if (shareWeeklyWaBtn) {
      shareWeeklyWaBtn.addEventListener("click", () => {
        const store = getActiveStore();
        const allCatalog = getAllRecipesCatalog();
        const selected = allCatalog.filter((r) => Boolean(store.weeklyGroceryRecipes && store.weeklyGroceryRecipes[r.id]));
        if (selected.length === 0) return;
        openWhatsAppShare(buildWeeklyGroceryText(selected), "auto");
      });
    }
    if (copyWeeklyBtn) {
      copyWeeklyBtn.addEventListener("click", () => {
        const store = getActiveStore();
        const allCatalog = getAllRecipesCatalog();
        const selected = allCatalog.filter((r) => Boolean(store.weeklyGroceryRecipes && store.weeklyGroceryRecipes[r.id]));
        if (selected.length === 0) return;
        const text = buildWeeklyGroceryText(selected);
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
        }
        const orig = copyWeeklyBtn.textContent;
        copyWeeklyBtn.textContent = "✓ Gekopieerd!";
        setTimeout(() => {
          copyWeeklyBtn.textContent = orig;
        }, 1800);
      });
    }
    if (clearWeeklyBtn) {
      clearWeeklyBtn.addEventListener("click", () => {
        const store = getActiveStore();
        store.weeklyGroceryRecipes = {};
        saveState();
        renderStageRecipes(getStageForWeek(state.currentWeek));
      });
    }

    // 4. Consultatiebureau / Schoolarts Groei-logboek & Vragenlijstje acties
    const addGrowthBtn = document.getElementById("addGrowthEntryBtn");
    if (addGrowthBtn) {
      addGrowthBtn.addEventListener("click", () => {
        const store = getActiveStore();
        const dateIn = document.getElementById("growthDateInput");
        const weightIn = document.getElementById("growthWeightInput");
        const lengthIn = document.getElementById("growthLengthInput");
        const rawW = parseFloat(weightIn ? weightIn.value : "");
        const rawL = parseFloat(lengthIn ? lengthIn.value : "");
        const validW = !isNaN(rawW) && rawW >= 1.5 && rawW <= 65 ? Math.round(rawW * 100) / 100 : 0;
        const validL = !isNaN(rawL) && rawL >= 35 && rawL <= 185 ? Math.round(rawL * 10) / 10 : 0;
        if (validW === 0 && validL === 0) return;

        const entryDate = (dateIn && dateIn.value) || new Date().toISOString().slice(0, 10);
        if (!Array.isArray(store.growthLogs)) store.growthLogs = [];
        store.growthLogs.push({
          id: "g-" + Date.now(),
          date: entryDate,
          weightKg: validW,
          lengthCm: validL
        });

        // Synchroniseer het nieuwst ingevoerde gewicht direct met het actieve kindprofiel (voor 150 ml/kg & paracetamol!)
        const sortedAsc = [...store.growthLogs].sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
        const latestWithWeight = [...sortedAsc].reverse().find((g) => g.weightKg > 0);
        if (latestWithWeight) {
          const activeChild = getActiveChild();
          if (activeChild) activeChild.weightKg = latestWithWeight.weightKg;
          state.profile.weightKg = latestWithWeight.weightKg;
        }

        if (weightIn) weightIn.value = "";
        if (lengthIn) lengthIn.value = "";
        saveState();
        renderAll(false);
      });
    }

    const addCbqBtn = document.getElementById("addCbQuestionBtn");
    const cbqInput = document.getElementById("cbQuestionInput");
    const handleAddCbQuestion = () => {
      if (!cbqInput) return;
      const txt = cbqInput.value.trim();
      if (!txt) return;
      const store = getActiveStore();
      if (!Array.isArray(store.cbQuestions)) store.cbQuestions = [];
      store.cbQuestions.push({
        id: "cbq-" + Date.now(),
        text: txt,
        done: false
      });
      cbqInput.value = "";
      saveState();
      renderCbPrepAndGrowth(getStageForWeek(state.currentWeek), state.currentWeek);
    };
    if (addCbqBtn) {
      addCbqBtn.addEventListener("click", handleAddCbQuestion);
    }
    if (cbqInput) {
      cbqInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAddCbQuestion();
        }
      });
    }

    // 3. Medische Disclaimer, Bronnen & Privacy (AVG / Play Store Data Deletion) Dialoog
    const legalDialog = document.getElementById("legalDialog");
    const openLegalBtn = document.getElementById("openLegalDialogBtn");
    const closeLegalBtn = document.getElementById("closeLegalDialogBtn");
    const confirmLegalBtn = document.getElementById("confirmLegalDialogBtn");
    const deleteAllDataBtn = document.getElementById("deleteAllLocalDataBtn");
    const legalDeleteStatusEl = document.getElementById("legalDeleteStatusMsg");

    if (openLegalBtn && legalDialog) {
      openLegalBtn.addEventListener("click", () => {
        if (legalDeleteStatusEl) legalDeleteStatusEl.textContent = "";
        legalDialog.showModal();
      });
    }
    if (closeLegalBtn && legalDialog) {
      closeLegalBtn.addEventListener("click", () => legalDialog.close());
    }
    if (confirmLegalBtn && legalDialog) {
      confirmLegalBtn.addEventListener("click", () => legalDialog.close());
    }
    if (deleteAllDataBtn) {
      deleteAllDataBtn.addEventListener("click", () => {
        const confirmed = window.confirm(
          "Weet je zeker dat je al je lokaal opgeslagen kindprofielen, afgevinkte hapjes, allergenen en mijlpalen van dit toestel wilt wissen?"
        );
        if (!confirmed) return;
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem("samen_groeien_feedback_v1");
        } catch (_) {}
        state.children = [];
        state.activeChildId = null;
        state.profile = { name: "", dob: "", dueDate: "", useAdjusted: true, weightKg: "", feedingType: "", customOppasNote: "" };
        state.onboardingDismissed = false;
        state.triedFoods = {};
        state.favoriteGames = {};
        state.favoriteRecipes = {};
        state.weeklyGroceryRecipes = {};
        state.checkedMilestones = {};
        state.milestoneMemories = {};
        state.checkedReadiness = {};
        state.growthLogs = [];
        state.cbQuestions = [];
        state.checkedTeeth = {};
        state.checkedHabits = {};
        state.allergenExposures = {};
        state.allergenWeeklyGiven = {};
        state.foodPracticeCounts = {};
        saveState();
        renderAll(false);
        if (legalDeleteStatusEl) {
          legalDeleteStatusEl.textContent = "✓ Al je lokale gegevens zijn volledig van dit toestel gewist.";
        }
      });
    }
  }

  // PWA Installatie: luisteren naar beforeinstallprompt, in-app banner & installatie-instructies
  let deferredInstallPrompt = null;

  function initPwaInstall() {
    const banner = document.getElementById("pwaInstallBanner");
    const installBtn = document.getElementById("pwaInstallBtn");
    const headerInstallBtn = document.getElementById("pwaHeaderInstallBtn");
    const dismissBtn = document.getElementById("pwaDismissBtn");
    const guideDialog = document.getElementById("installGuideDialog");
    const closeGuideBtn = document.getElementById("closeInstallGuideBtn");
    const confirmGuideBtn = document.getElementById("confirmInstallGuideBtn");

    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    if (isStandalone) {
      if (banner) banner.classList.add("hidden");
      if (headerInstallBtn) headerInstallBtn.classList.add("hidden");
      return;
    }

    // Luister naar het officiële installatie-event van de browser (Android Chrome e.a.)
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;

      // Toon de installatiebanner als deze sessie niet eerder is weggeklikt
      if (banner && !sessionStorage.getItem("pwa_banner_dismissed")) {
        banner.classList.remove("hidden");
      }
      if (headerInstallBtn) {
        headerInstallBtn.classList.remove("hidden");
      }
    });

    async function triggerInstallFlow() {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        try {
          const choice = await deferredInstallPrompt.userChoice;
          if (choice && choice.outcome === "accepted") {
            if (banner) banner.classList.add("hidden");
            if (headerInstallBtn) headerInstallBtn.classList.add("hidden");
          }
        } catch (_) {}
        deferredInstallPrompt = null;
      } else {
        // Indien de browser geen directe installatieprompt ondersteunt (bijv. Safari iOS of eerdere weigering):
        if (guideDialog) {
          guideDialog.showModal();
        }
      }
    }

    if (installBtn) {
      installBtn.addEventListener("click", triggerInstallFlow);
    }
    if (headerInstallBtn) {
      headerInstallBtn.addEventListener("click", triggerInstallFlow);
    }

    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        if (banner) banner.classList.add("hidden");
        sessionStorage.setItem("pwa_banner_dismissed", "1");
      });
    }

    if (closeGuideBtn && guideDialog) {
      closeGuideBtn.addEventListener("click", () => guideDialog.close());
    }
    if (confirmGuideBtn && guideDialog) {
      confirmGuideBtn.addEventListener("click", () => guideDialog.close());
    }

    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      if (banner) banner.classList.add("hidden");
      if (headerInstallBtn) headerInstallBtn.classList.add("hidden");
    });

    // Toon de header knop als fallback op mobiele browsers die installatie ondersteunen
    if (headerInstallBtn && !isStandalone) {
      headerInstallBtn.classList.remove("hidden");
    }
  }

  // Service Worker registreren voor offline PWA-werking
  function registerServiceWorker() {
    if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadState();
    applyTheme(state.theme);
    wireEvents();
    window.setWeek = setWeek;
    window.setView = setView;
    window.state = state;

    // Ondersteun Android App-Shortcuts (?tab=lookup, ?tab=sos, ?tab=games, ?tab=tips)
    let initialView = normalizeViewName(state.activeView || "food");
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      if (tabParam) {
        initialView = normalizeViewName(tabParam);
      }
      if (window.history && typeof window.history.replaceState === "function") {
        window.history.replaceState({ sgView: "food" }, "");
        if (initialView !== "food") {
          window.history.pushState({ sgView: initialView }, "");
        }
      }
    } catch (_) {}

    window.addEventListener("popstate", (event) => {
      const openDialog = document.querySelector("dialog[open]");
      if (openDialog && typeof openDialog.close === "function") {
        openDialog.close();
        return;
      }
      const targetView = event.state && event.state.sgView ? normalizeViewName(event.state.sgView) : "food";
      setView(targetView, false, true);
    });

    setView(initialView, false, true);
    renderAll(true);
    initPwaInstall();
    registerServiceWorker();
  });
})();
