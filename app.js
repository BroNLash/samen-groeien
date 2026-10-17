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
      customOppasNote: ""
    },
    triedFoods: {},
    favoriteGames: {},
    favoriteRecipes: {},
    checkedMilestones: {},
    checkedHabits: {},
    allergenExposures: {},
    foodPracticeCounts: {}
  };

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
      if (saved.profile) state.profile = { ...state.profile, ...saved.profile };
      if (saved.triedFoods) state.triedFoods = saved.triedFoods;
      if (saved.favoriteGames) state.favoriteGames = saved.favoriteGames;
      if (saved.favoriteRecipes) state.favoriteRecipes = saved.favoriteRecipes;
      if (saved.checkedMilestones) state.checkedMilestones = saved.checkedMilestones;
      if (saved.checkedHabits) state.checkedHabits = saved.checkedHabits;
      if (saved.allergenExposures) state.allergenExposures = saved.allergenExposures;
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
          customOppasNote: state.profile.customOppasNote || "",
          triedFoods: { ...state.triedFoods },
          favoriteGames: { ...state.favoriteGames },
          favoriteRecipes: { ...state.favoriteRecipes },
          checkedMilestones: { ...state.checkedMilestones },
          checkedHabits: { ...state.checkedHabits },
          allergenExposures: { ...state.allergenExposures },
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
    if (!target.checkedMilestones) target.checkedMilestones = {};
    if (!target.checkedHabits) target.checkedHabits = {};
    if (!target.allergenExposures) target.allergenExposures = {};
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

  function calculateAgeForProfile(prof) {
    if (!prof || !prof.dob) return null;
    const dobDate = new Date(prof.dob + "T00:00:00");
    const now = new Date();
    const diffMs = now - dobDate;
    if (isNaN(diffMs) || diffMs < 0) return null;

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

    if (titleEl) {
      titleEl.textContent =
        week <= 23
          ? `🥄 5-Minuten Oefenhapjes (${stage.shortLabel})`
          : `🍳 5-Minuten Fase-Recepten (${stage.shortLabel})`;
    }
    if (subtitleEl) {
      subtitleEl.textContent =
        week <= 23
          ? "Alleen gladde eerste oefenhapjes die veilig zijn voor 4–5 maanden, met 1 tik op WhatsApp te zetten."
          : `Alleen gerechten die veilig en geschikt zijn voor ${stage.shortLabel} — met 1 tik als boodschappenlijstje op WhatsApp te zetten.`;
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
          <button type="button" class="btn-secondary btn-small" data-copy-recipe="${r.id}">
            📋 Kopieer lijstje
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
    if (n.includes("druiven")) return "fd-grapes";
    return null;
  }

  // =========================================================================
  // 6. HOOFDSCHERM RENDEREN
  // =========================================================================
  function renderAll(scrollToTimeline = false) {
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
    if (spotlight.highlightGame) {
      metaCards.push(`
        <div class="spotlight-meta-card">
          <div class="spotlight-meta-head">
            <span class="spotlight-meta-label">🎲 Speltip deze week</span>
            <button type="button" class="spotlight-jump-btn" id="spotlightJumpToGamesBtn">Bekijk bij Spel →</button>
          </div>
          <p class="spotlight-meta-body"><strong>${escapeHtml(spotlight.highlightGame)}</strong></p>
        </div>
      `);
    }
    spotMetaEl.innerHTML = metaCards.join("");
    spotMetaEl.classList.toggle("hidden", metaCards.length === 0);

    const jumpGamesBtn = document.getElementById("spotlightJumpToGamesBtn");
    if (jumpGamesBtn) {
      jumpGamesBtn.addEventListener("click", () => {
        setView("games", true);
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
      pureeKeyBarEl.innerHTML = `🍼 <strong>Richtlijn ${escapeHtml(stage.shortLabel)}:</strong> ${boldNumbersInEscapedHtml(
        escapeHtml(stage.nutrition.milkVolumeMetric)
      )} • ${boldNumbersInEscapedHtml(escapeHtml(stage.nutrition.feedsPerDay))}`;
    }

    const blwKeyBarEl = document.getElementById("blwKeyMetricBar");
    if (blwKeyBarEl) {
      blwKeyBarEl.innerHTML =
        week <= 16
          ? `⏳ <strong>Vaste hapjes (${escapeHtml(stage.shortLabel)}):</strong> Start pas vanaf <strong class="num-bold">4 maanden</strong> (Week 17)`
          : `🥣 <strong>Portie ${escapeHtml(stage.shortLabel)}:</strong> ${boldNumbersInEscapedHtml(
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
              <button type="button" class="lookup-jump-btn" data-jump-lookup="${linkedFoodId}" title="Bekijk snij- en bereidingsadvies in Eet-Check">
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

    const stageGames = (stage.games || []).map((g) => ({
      ...g,
      stageLabel: stage.shortLabel,
      heroEmoji: stage.heroEmoji
    }));

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
        const energyBadge = g.energy === "low" ? `<span class="pill-small">☕ Rustig</span>` : "";
        return `
        <article class="item-card">
          <div class="item-card-top">
            <h3 class="item-title">${escapeHtml(g.title)}</h3>
            <button type="button" class="log-btn ${fav ? "is-logged" : ""}" data-game-id="${g.id}">
              ${fav ? "⭐ Bewaard" : "☆ Bewaren"}
            </button>
          </div>
          <div class="item-card-badges">
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
    const sleepStagePillEl = document.getElementById("sleepStagePill");
    const momTipsStagePillEl = document.getElementById("momTipsStagePill");
    const momTipsCardTitleEl = document.getElementById("momTipsCardTitle");
    const milestonesCardTitleEl = document.getElementById("milestonesCardTitle");

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
    msEl.innerHTML = stage.milestones
      .map((ms, i) => {
        const key = `${stage.id}-ms-${i}`;
        const checked = Boolean(store.checkedMilestones[key]);
        return `
        <label class="check-card">
          <input type="checkbox" data-ms-key="${key}" ${checked ? "checked" : ""} />
          <span>${ms}</span>
        </label>
      `;
      })
      .join("");

    msEl.querySelectorAll("input").forEach((chk) => {
      chk.addEventListener("change", () => {
        const k = chk.dataset.msKey;
        if (chk.checked) store.checkedMilestones[k] = true;
        else delete store.checkedMilestones[k];
        saveState();
        updateMilestonesProgress();
      });
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
          rule: "Baby haalt al het vocht uit melkvoeding; geef evt. 1-2 oefenslokjes lauw water uit een klein open bekertje",
          svg: CUT_SVGS.cup
        };
      }
      if (week <= 52) {
        return {
          shape: "cup",
          shapeLabel: "🥛 Open bekertje (Slokjes)",
          ageLabel: "Mondmotoriek",
          rule: "Geef kleine slokjes water of lauwe ongezoete thee uit een open beker (geen tuitbeker!) na de hapjes",
          svg: CUT_SVGS.cup
        };
      }
      return {
        shape: "cup",
        shapeLabel: "🥛 Open beker / Rietjesbeker",
        ageLabel: "Zelfstandig drinken",
        rule: "Bied over de dag 450–700 ml water of ongezoete thee aan uit een open beker of rietjesbeker",
        svg: CUT_SVGS.cup
      };
    }

    // 2. Gewone Melk & Yoghurt
    if (fid === "fd-dairy" || nameLow.includes("yoghurt") || nameLow.includes("melk")) {
      if (week <= 52) {
        return {
          shape: "spoon",
          shapeLabel: "🥄 Lepelhapje volle yoghurt",
          ageLabel: "Enkele theelepeltjes",
          rule: "Geef volle ongezoete yoghurt/kwark met een klein lepeltje (wacht met gewone koemelk als drank tot 1 jaar)",
          svg: CUT_SVGS.spoon
        };
      }
      return {
        shape: "cup",
        shapeLabel: "🥛 Beker melk & lepel yoghurt",
        ageLabel: "Mee-eten (vanaf 1 jaar)",
        rule: "Ongeveer 300 ml zuivel per dag (bijv. 2 bekertjes melk en een schaaltje volle yoghurt)",
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
      return {
        shape: "dices",
        shapeLabel: "🎲 Blokjes 1×1 cm",
        ageLabel: "Pincetgreep",
        rule: "Zachte zoutarme jonge kaas of hüttenkäse in kleine hapklare blokjes of dun op brood",
        svg: CUT_SVGS.dices
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
      return {
        shape: "dices",
        shapeLabel: "🎲 Boterham-dobbelsteentjes",
        ageLabel: "Pincetgreep",
        rule: "Snijd de boterham in kleine vierkante blokjes (1×1 cm) met zachte margarine en gezond beleg",
        svg: CUT_SVGS.dices
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
      return {
        shape: "dices",
        shapeLabel: "🎲 Zachtgekookt mee-eten",
        ageLabel: "Zelf prikken/lepelen",
        rule: "Volkorenpasta in hapklare stukjes, rijst of couscous met groentesaus om zelf te scheppen",
        svg: CUT_SVGS.dices
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
      return {
        shape: "dices",
        shapeLabel: "🎲 Blokjes hardgekookt ei",
        ageLabel: "Pincetgreep",
        rule: "Snijd een hardgekookt ei in kleine blokjes van 1×1 cm of prak fijn op brood",
        svg: CUT_SVGS.dices
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
      return {
        shape: "dices",
        shapeLabel: "🎲 Zachte stukjes 1×1 cm",
        ageLabel: "Kauwontwikkeling",
        rule: "Mals gesneden stukjes vis, kip, gehakt of zachte linzen/bonen om zelf te prikken",
        svg: CUT_SVGS.dices
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
      return {
        shape: "bread",
        shapeLabel: "🍘 Volkoren cracker / soepstengel",
        ageLabel: "Krokant oefenen",
        rule: "Een stukje volkoren cracker met dun beleg of zachte soepstengel; blijf er altijd bij",
        svg: CUT_SVGS.bread
      };
    }

    // 9. Pindakaas & Notenpasta
    if (fid === "fd-peanutbutter" || nameLow.includes("pinda") || nameLow.includes("notenpasta")) {
      if (week <= 23) {
        return {
          shape: "spread",
          shapeLabel: "🥄 Mespuntje door puree",
          ageLabel: "Allergeen-introductie",
          rule: "Roer 1/4 theelepel 100% pindakaas los door warm groente- of fruithapje",
          svg: CUT_SVGS.spread
        };
      }
      return {
        shape: "spread",
        shapeLabel: "🍞 Flinterdun gesmeerd",
        ageLabel: "Geen losse klodder",
        rule: "Smeer flinterdun op brood of roer door de pap; geef NOOIT een dikke lepel (plakt in de keel)",
        svg: CUT_SVGS.spread
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
      return {
        shape: "spread",
        shapeLabel: "🍯 Dun gesmeerd (vanaf 1 jaar)",
        ageLabel: "Met mate",
        rule: "Veilig vanaf 12 maanden; met mate gebruiken op brood of door de pap vanwege suikers",
        svg: CUT_SVGS.spread
      };
    }

    // 11. Druiven & Snoeptomaatjes (levensgroot verstikkingsgevaar!)
    if (fid === "fd-grapes" || nameLow.includes("druif") || nameLow.includes("tomaat")) {
      if (week <= 208) {
        return {
          shape: "quarters",
          shapeLabel: "🔪 In lengte in 4en",
          ageLabel: "Anti-verstikking",
          rule: "ALTIJD in de lengte in 4 partjes snijden tot minstens 4 jaar! Nooit dwars of heel geven",
          svg: CUT_SVGS.quarters
        };
      }
      return {
        shape: "dices",
        shapeLabel: "🍇 Gehalveerd of heel",
        ageLabel: "Rustig zittend",
        rule: "Vanaf 4 jaar mag kind hele druiven leren eten, maar uitsluitend rustig zittend aan tafel",
        svg: CUT_SVGS.dices
      };
    }

    // 12. Blauwe bessen & Erwtjes (pletten!)
    if (fid === "fd-blueberry" || nameLow.includes("bes") || nameLow.includes("erwt")) {
      if (week > 208) {
        return {
          shape: "dices",
          shapeLabel: "🫐 Heel (Schoolkind)",
          ageLabel: "Vanaf 4 jaar",
          rule: "Mag heel gegeten worden mits kind rustig aan tafel zit",
          svg: CUT_SVGS.dices
        };
      }
      return {
        shape: "squash",
        shapeLabel: "🫐 Platgedrukt",
        ageLabel: "Anti-verstikking",
        rule: "Plet ronde bessen of erwtjes tussen duim en vinger; snijd aardbeien in partjes",
        svg: CUT_SVGS.squash
      };
    }

    // 13. Appel & Peer (rauw is te hard!)
    if (fid === "fd-apple" || (nameLow.includes("appel") && !nameLow.includes("aardappel")) || nameLow.includes("peer")) {
      if (week <= 23) {
        return {
          shape: "puree",
          shapeLabel: "🥄 Gladde Fruitpuree",
          ageLabel: "Gestoomd & gepureerd",
          rule: "Stoom geschilde appel zacht en pureer glad met een vork of staafmixer",
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
      if (week <= 104) {
        return {
          shape: "dices",
          shapeLabel: "🍎 Flinterdunne schijfjes",
          ageLabel: "Zonder schil",
          rule: "Snijd flinterdunne schijfjes (als chips) of rasp grof; geef géén dikke harde brokken rauwe appel",
          svg: CUT_SVGS.dices
        };
      }
      return {
        shape: "dices",
        shapeLabel: "🍎 Dunne partjes",
        ageLabel: "Met schil",
        rule: "Dunne maantjes of partjes; vanaf 4 jaar ook afhappen uit het vuistje",
        svg: CUT_SVGS.dices
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
      return {
        shape: "dices",
        shapeLabel: "🎲 Schijfjes of blokjes",
        ageLabel: "Pincetgreep",
        rule: "Snijd in ronde schijfjes of halve maantjes om zelf te prikken",
        svg: CUT_SVGS.dices
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
      return {
        shape: "dices",
        shapeLabel: "🎲 Kleine roosjes & blokjes",
        ageLabel: "Pincetgreep",
        rule: "Snijd de steel in kleine blokjes en breek de roosjes in kleine plukjes",
        svg: CUT_SVGS.dices
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
      return {
        shape: "dices",
        shapeLabel: "🎲 Blokjes 1×1 cm",
        ageLabel: "Pincetgreep",
        rule: "Snijd in zachte hapklare blokjes die baby zelf tussen duim en wijsvinger kan pakken",
        svg: CUT_SVGS.dices
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
          rule: "Snijd een reep zo dik als je wijsvinger; stoom zo zacht dat je het moeiteloos fijnknijpt",
          svg: CUT_SVGS.spear
        };
      }
      return {
        shape: "dices",
        shapeLabel: "🎲 Blokjes 1×1 cm",
        ageLabel: "Pincetgreep",
        rule: "Zacht gekookte wortel- of pompoenblokjes om zelf te prikken",
        svg: CUT_SVGS.dices
      };
    }

    // 18. Komkommer, Paprika & Courgette
    if (fid === "fd-cucumber" || nameLow.includes("komkommer") || nameLow.includes("courgette") || nameLow.includes("paprika")) {
      if (week <= 23) {
        return {
          shape: "puree",
          shapeLabel: "🥄 Gladde Courgettepuree",
          ageLabel: "Zonder schil",
          rule: "Stoom courgette gaar en pureer glad (komkommer nog niet pureren)",
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
      return {
        shape: "dices",
        shapeLabel: "🎲 Halve maantjes / blokjes",
        ageLabel: "Pincetgreep",
        rule: "Kleine zachte blokjes ontvelde komkommer of zacht gestoofde paprikareepjes",
        svg: CUT_SVGS.dices
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

    return {
      shape: "dices",
      shapeLabel: "🎲 Blokjes 1×1 cm",
      ageLabel: "Pincetgreep & Mee-eten",
      rule: "Snijd in hapklare blokjes of schijfjes die zelf geprikt kunnen worden",
      svg: CUT_SVGS.dices
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
      headerTitleEl.textContent = `🔍 Eet- & Snijgids (${stage.shortLabel})`;
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
      cutBannerEl.classList.remove("hidden");
      cutBannerEl.innerHTML = `
        <div class="lookup-cut-highlight">
          <div class="lookup-cut-svg-box" aria-hidden="true">${cutData.svg}</div>
          <div class="lookup-cut-text">
            <div class="lookup-cut-top">
              <span class="food-cut-shape-tag">🔪 Snijadvies ${escapeHtml(stage.shortLabel)}</span>
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
        subtitleEl.textContent = `🥄 ${suitableAllInStage.length} veilige oefenhapjes voor 4–5 maanden — kies een productgroep en vink je proeflijst bij (de ${waitAllInStage.length} producten vanaf 6 of 12 mnd staan onderaan).`;
      } else if (week <= 52) {
        subtitleEl.textContent = `🥑 ${suitableAllInStage.length} geschikte producten voor ${stage.shortLabel} — bekijk de veilige snijvorm en vink je proeflijst bij (honing vanaf 12 mnd staat onderaan).`;
      } else {
        subtitleEl.textContent = `🍽️ Alle ${suitableAllInStage.length} producten zijn geschikt voor ${stage.shortLabel} — bekijk de veilige snijvorm en vink je proeflijst bij.`;
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

    // Uitklapbare sectie onderaan voor producten die pas in een latere fase (6+ of 12+ mnd) mogen
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
              ? "⏳ Nog niet geschikt bij 4–5 maanden (bekijk producten vanaf 6 of 12 maanden)"
              : "🚫 Nog niet geschikt onder 1 jaar (Honing — pas vanaf 12 maanden)";
        }
        if (waitCountPillEl) {
          waitCountPillEl.textContent = `${itemsToRenderInWait.length} ${itemsToRenderInWait.length === 1 ? "product" : "producten"}`;
        }
        if (waitIntroHintEl) {
          waitIntroHintEl.textContent =
            week <= 23
              ? "Onderstaande producten geef je bij 4–5 maanden nog niet als maaltijd of los hapje. Ze komen aan bod vanaf 6 maanden (zoals brood, pasta, vlees/vis, yoghurt, bessen en druiven) of 12 maanden (honing)."
              : "Geef onder de 1 jaar (12 maanden) nog geen honing vanwege het risico op infantiel botulisme.";
        }
        waitGridEl.innerHTML = itemsToRenderInWait.map((f) => buildFoodCardHtml(f, week, stage, store)).join("");
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
          "⏳ In fase 4–5 maanden zijn granen en zuivel (zoals brood, pasta, rijstwafel, kaas, yoghurt en honing) nog niet geschikt als maaltijd; je start hiermee vanaf 6 maanden. Ze staan hier direct onder uitgeklapt! (Tip: 1 theelepeltje fijne baby-granenpap door melk of fruit mag wel om aan gluten te wennen.)";
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

    if (protocolBoxEl) {
      protocolBoxEl.classList.toggle("hidden", week <= 16);
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
      } else {
        summaryTitleEl.textContent = "🥜 Top 9 Allergenen Afvinklijst";
        introHintEl.textContent =
          "Advies: start tussen 4 en 8 maanden met pinda en ei, breid vanaf 6 maanden uit met de overige allergenen en houd ze na gewenning wekelijks op het menu.";
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

    grid.innerHTML = visibleAllergens
      .map((alg) => {
        const rawArr = store.allergenExposures[alg.id] || [false, false, false];
        const count = Math.min(3, rawArr.filter(Boolean).length);
        const isSuitableNow = isAllergenSuitableForWeek(alg, week);
        const minM = alg.minAgeMonths || 4;

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
          ageLabel = "4–12 jaar";
        }

        const badgeHtml = isSuitableNow
          ? `<span class="pill-small ${count === 3 ? "pill-ok" : ""}">${count === 3 ? "✅ 3/3 Gewend (1× p/w)" : `${count}/3 keer geproefd`}</span>`
          : `<span class="pill-small pill-wait">⏳ Vanaf ${minM} mnd</span>`;

        const stepHints = [
          "Stap 1: Klein proefhapje (¼–½ tl op de ochtend/middag)",
          "Stap 2: Portie opbouwen (½–1 tl op een volgende dag)",
          "Stap 3: 3e keer zonder klachten (1 tl) — gewend! Houd 1× per week op het menu"
        ];

        return `
        <article class="item-card ${isSuitableNow ? "" : "item-card-wait"}">
          <div class="item-card-top">
            <h3 class="item-title">${alg.icon} ${escapeHtml(alg.name)}</h3>
            ${badgeHtml}
          </div>
          ${alg.whyEarly ? `<small class="subtle-hint">${escapeHtml(alg.whyEarly)}</small>` : ""}
          <div class="highlight-note ${isSuitableNow ? "" : "highlight-note-wait"}">
            <strong>🥄 Advies (${escapeHtml(ageLabel)}):</strong> ${escapeHtml(prep)}
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
          </div>`
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
    const cbLabel = document.getElementById("cbStageLabel");
    const cbSub = document.getElementById("cbAgeSubtitle");
    const cbGrid = document.getElementById("healthCbGrid");
    const sosContainer = document.getElementById("sosCardsContainer");
    const sosSub = document.getElementById("sosAgeSubtitle");
    const sosStageLabelEl = document.getElementById("sosStageLabel");
    if (!cbGrid || !sosContainer) return;

    if (cbLabel) cbLabel.textContent = stage.shortLabel;
    if (cbSub) {
      cbSub.textContent = `Controles, RVP-vaccinaties en gebitsontwikkeling voor fase ${stage.shortLabel} (${stage.ageRangeLabel}).`;
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

    cbGrid.innerHTML = `
      <div class="cb-item-box">
        <span class="cb-item-label">🏥 Consultatiebureau / JGZ (${escapeHtml(stage.shortLabel)})</span>
        ${formatCbBoxHtml(h.cbVisit)}
      </div>
      <div class="cb-item-box">
        <span class="cb-item-label">💉 Vaccinaties / RVP (${escapeHtml(stage.shortLabel)})</span>
        ${formatCbBoxHtml(h.vaccines)}
      </div>
      <div class="cb-item-box">
        <span class="cb-item-label">😁 Tandjes &amp; Gebit (${escapeHtml(stage.shortLabel)})</span>
        ${formatCbBoxHtml(h.teeth)}
      </div>
    `;

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
        const isMedical = doctorNote.startsWith("📞");
        const isMomTip = doctorNote.startsWith("💛");
        const blockLabel = isMedical
          ? "🚨 Wanneer contact opnemen met de huisarts?"
          : isMomTip
            ? "💛 Steuntje in de rug voor jezelf"
            : "💡 Gouden regel & aandachtspunt";
        const cleanedNote = doctorNote
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
        </div>
        ${alertBoxHtml}
      `;
    };

    const sosList = DATA.sosCards || [];
    sosContainer.innerHTML = sosList
      .map((card) => {
        const isOpen = state.activeSosCardId === card.id;
        return `
        <details class="sos-details" name="sos-accordion" data-sos-id="${card.id}" ${isOpen ? "open" : ""}>
          <summary>
            <span class="sos-summary-title">${card.icon} ${escapeHtml(card.title)}</span>
            <span class="summary-badge">${escapeHtml(shortAgeTag)}</span>
          </summary>
          <div class="sos-body">
            ${buildSosCardBodyHtml(card)}
          </div>
        </details>
      `;
      })
      .join("");

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
    document.getElementById("editingChildIdInput").value = ch ? ch.id : "";
    document.getElementById("childNameInput").value = ch ? ch.name || "" : "";
    document.getElementById("childDobInput").value = ch ? ch.dob || "" : "";
    document.getElementById("childDueDateInput").value = ch ? ch.dueDate || "" : "";
    document.getElementById("useAdjustedAgeCheckbox").checked = ch ? ch.useAdjusted !== false : true;
    const clearBtn = document.getElementById("clearProfileBtn");
    if (clearBtn) {
      const hasLegacyProfile = Boolean(state.profile && (state.profile.name || state.profile.dob));
      clearBtn.classList.toggle("hidden", !ch && !(state.children.length === 0 && hasLegacyProfile));
    }
    renderProfileModalChildrenList(ch ? ch.id : "");
    updateProfilePreview();
  }

  function updateProfilePreview() {
    const name = document.getElementById("childNameInput").value.trim() || "Je kind";
    const dob = document.getElementById("childDobInput").value;
    const due = document.getElementById("childDueDateInput").value;
    const useAdj = document.getElementById("useAdjustedAgeCheckbox").checked;
    const adjRow = document.getElementById("adjustedAgeToggleRow");
    const box = document.getElementById("profilePreviewBox");

    if (!dob) {
      if (adjRow) adjRow.classList.add("hidden");
      box.textContent = "Kies een geboortedatum om de huidige week te berekenen.";
      return;
    }

    const calc = calculateAgeForProfile({ name, dob, dueDate: due, useAdjusted: useAdj });
    if (!calc) {
      if (adjRow) adjRow.classList.add("hidden");
      box.textContent = "Kies een datum in het verleden.";
      return;
    }

    if (adjRow) {
      adjRow.classList.toggle("hidden", !(calc.isPreemie && calc.chronoWeek <= 104));
    }

    const stg = getStageForWeek(calc.activeTargetWeek);
    if (calc.isPreemie && calc.chronoWeek <= 104) {
      const modeLabel = useAdj
        ? `Week ${calc.adjustedWeek} (gecorrigeerd • kalenderweek ${calc.chronoWeek})`
        : `Week ${calc.chronoWeek} (kalenderleeftijd • gecorrigeerd week ${calc.adjustedWeek})`;
      box.innerHTML = `<strong>🎉 ${escapeHtml(name)} zit nu in ${modeLabel}!</strong><br/>Fase: ${escapeHtml(stg.title)}`;
    } else {
      box.innerHTML = `<strong>🎉 ${escapeHtml(name)} zit nu in Week ${calc.activeTargetWeek}!</strong><br/>Fase: ${escapeHtml(stg.title)}`;
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

    const milkVol = stage.nutrition.milkVolumeMetric;
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
    } else {
      allergenLine = `🥜 *Allergenen:* Geef geen nieuwe allergenen zonder overleg.`;
    }

    // Kies een bewaard favoriet spelletje uit deze fase (of anders het eerste spelletje van deze fase)
    const stageGames = stage.games || [];
    const favGame =
      stageGames.find((g) => store.favoriteGames && store.favoriteGames[g.id]) ||
      stageGames[0] ||
      null;

    const lines = [
      `👵 *Oppas- & Oma-Kaartje voor ${childName}*`,
      `📅 *Leeftijd:* ${exactAge} (${stage.shortLabel})`,
      ``,
      `🍼 *Melk & Drinken:* ${milkVol} (${stage.nutrition.feedsPerDay})`,
      `🥣 *Vaste voeding:* ${solidPortion} (${stage.nutrition.solidsPerDay})`,
      `🔪 *Veilig serveren:* ${cutInfo.title}`,
      `🚫 *Niet geven:* ${stage.nutrition.avoidFoods[0] || "Honing (<1jr) en hele noten/druiven"}`,
      ``,
      `🌙 *Slaap & Ritme:* ${stage.sleep.wakeWindow} • ${stage.sleep.naps}`,
      napStr ? `⏰ *Richtlijn vandaag:* ${napStr}` : null,
      allergenLine,
      favGame ? `🎲 *Leuk spelletje nu:* ${favGame.title} — ${favGame.howToPlay}` : null,
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

  function setView(view, autoScroll = false) {
    const isSameView = state.activeView === view;
    state.activeView = view;
    document.querySelectorAll(".nav-tab").forEach((t) => {
      const isAct = t.dataset.view === view;
      t.classList.toggle("active", isAct);
      t.setAttribute("aria-selected", isAct ? "true" : "false");
    });
    let activePanel = null;
    document.querySelectorAll(".tab-panel").forEach((p) => {
      const isAct = p.dataset.pillar === view;
      p.classList.toggle("hidden", !isAct);
      if (isAct) activePanel = p;
    });
    saveState();

    if (isSameView && autoScroll) {
      // Als de ouder al op dit tabblad staat en er nogmaals op tikt: vloeiend terug naar boven scrollen (native app best practice)
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
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

          // Vloeiend naar het actieve paneel scrollen als er een waarneembare verschuiving is (> 3px)
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

    ["childNameInput", "childDobInput", "childDueDateInput", "useAdjustedAgeCheckbox"].forEach((id) => {
      document.getElementById(id).addEventListener("input", updateProfilePreview);
      document.getElementById(id).addEventListener("change", updateProfilePreview);
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

      let targetChild = state.children.find((c) => c.id === editingId);
      if (targetChild) {
        targetChild.name = name;
        targetChild.dob = dob;
        targetChild.dueDate = dueDate;
        targetChild.useAdjusted = useAdjusted;
      } else {
        const newId = "child-" + Date.now();
        targetChild = {
          id: newId,
          name,
          dob,
          dueDate,
          useAdjusted,
          customOppasNote: "",
          triedFoods: state.children.length === 0 ? { ...state.triedFoods } : {},
          favoriteGames: state.children.length === 0 ? { ...state.favoriteGames } : {},
          favoriteRecipes: state.children.length === 0 ? { ...state.favoriteRecipes } : {},
          checkedMilestones: state.children.length === 0 ? { ...state.checkedMilestones } : {},
          checkedHabits: state.children.length === 0 ? { ...state.checkedHabits } : {},
          allergenExposures: state.children.length === 0 ? { ...state.allergenExposures } : {},
          foodPracticeCounts: state.children.length === 0 ? { ...state.foodPracticeCounts } : {}
        };
        state.children.push(targetChild);
      }

      state.activeChildId = targetChild.id;
      state.profile = {
        name: targetChild.name,
        dob: targetChild.dob,
        dueDate: targetChild.dueDate,
        useAdjusted: targetChild.useAdjusted,
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
          customOppasNote: nextActive.customOppasNote || ""
        };
        const calc = calculateAgeForProfile(nextActive);
        if (calc) {
          state.currentWeek = calc.activeTargetWeek;
          syncEpochToWeek(state.currentWeek);
        }
      } else {
        state.profile = { name: "", dob: "", dueDate: "", useAdjusted: true, customOppasNote: "" };
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
        if (feedbackStatusMsg) feedbackStatusMsg.textContent = "";
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

    if (feedbackForm && feedbackDialog) {
      feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const textInput = document.getElementById("feedbackTextInput");
        const sectionSelect = document.getElementById("feedbackSectionSelect");
        const emailInput = document.getElementById("feedbackEmailInput");

        const msg = textInput ? textInput.value.trim() : "";
        if (!msg) return;

        const entry = {
          id: "fb-" + Date.now(),
          type: activeFeedbackType,
          section: sectionSelect ? sectionSelect.value : "algemeen",
          message: msg,
          email: emailInput ? emailInput.value.trim() : "",
          timestamp: new Date().toISOString(),
          week: state.currentWeek,
          childName: getActiveChild() ? getActiveChild().name : ""
        };

        try {
          const existingRaw = localStorage.getItem("samen_groeien_feedback_v1");
          const existingList = existingRaw ? JSON.parse(existingRaw) : [];
          existingList.push(entry);
          localStorage.setItem("samen_groeien_feedback_v1", JSON.stringify(existingList));
        } catch (err) {
          // ignore error
        }

        if (feedbackStatusMsg) {
          feedbackStatusMsg.textContent = "✓ Hartelijk dank voor je waardevolle feedback! We nemen je ervaring zorgvuldig mee.";
        }

        setTimeout(() => {
          if (feedbackDialog.open) feedbackDialog.close();
          if (feedbackStatusMsg) feedbackStatusMsg.textContent = "";
        }, 1600);
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
    setView(state.activeView || "food");
    renderAll(true);
    initPwaInstall();
    registerServiceWorker();
  });
})();
