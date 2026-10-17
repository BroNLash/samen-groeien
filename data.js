/**
 * SAMEN GROEIEN — Complete Nederlandstalige Dataset (Week 1 t/m 12 Jaar)
 * Inclusief:
 *  - 15 Ontwikkelingsfases (Voeding, Slaap, Mijlpalen, Mama-tips, Spelletjes)
 *  - 5-Minuten Fase-Recepten + Boodschappenlijstjes
 *  - Consultatiebureau (JGZ), Rijksvaccinatieprogramma (RVP) & Tandjes-kalender
 *  - SOS Eerste Hulp bij Lastige Momenten (Koorts, Eetweigering, Slaap, Krampjes, Driftbuien)
 *  - Top 9 Allergenen & Eet-Check Snijgids
 */

window.GROWING_DATA = {
  // =========================================================================
  // 1. ONTWIKKELINGSSTAPPEN, GROEISPURTS & MIJLPALEN PER WEEK
  // =========================================================================
  weeklySpecials: {
    1: {
      badge: "🍼 Geboorte & Kraamweek",
      type: "milestone",
      headline: "Welkom op de wereld: Huid-op-huid & eerste slokjes colostrum",
      summary: "Een pasgeborene (maagcapaciteit ~20 ml bij geboorte) drinkt op dag 1 nog kleine porties colostrum van 5–7 ml per voeding, oplopend naar 45–60 ml per voeding rond dag 7.",
      foodFocus: "Borstvoeding of kunstvoeding op verzoek (8–12x per 24u). Start vanaf dag 8 met Vitamine D (10 mcg) en Vitamine K (150 mcg bij borstvoeding).",
      momTip: "Focus 100% op herstel, rust en huid-op-huidcontact. Clusteren in de avond helpt je melkproductie op gang te brengen.",
      highlightGame: "Oogcontact & gezichtjes kijken op 20–30 cm"
    },
    2: {
      badge: "📈 1e Regeldagen (Week 2)",
      type: "spurt",
      headline: "Terug op geboortegewicht & eerste regeldagen",
      summary: "Rond dag 10–14 is je baby weer op geboortegewicht. Verwacht 2 dagen extra vraag naar melk waarmee je baby de melkproductie afstemt.",
      foodFocus: "Melk op verzoek: ~60–90 ml per flesje of 8–10x borstvoeding + dagelijks 10 mcg Vitamine D.",
      momTip: "Let op vroege hongersignalen (smakken, handjes naar de mond, zoekreflex). Huilen is een laat hongersignaal.",
      highlightGame: "Buik-op-borst Tummy Time"
    },
    3: {
      badge: "📈 Groeispurt 3 Weken",
      type: "spurt",
      headline: "Meer alert & onrustig uurtje in de avond",
      summary: "Je baby is vaker wakker tussen voedingen en heeft soms een onrustig 'huiluurtje' aan het einde van de middag of avond.",
      foodFocus: "Melkvoeding (~75–105 ml per keer, 8–10x per dag) + Vitamine D (& K t/m 12 weken).",
      momTip: "Houd het overdag licht en gezellig, en maak nachtvoedingen donker en stil voor de rijping van het dag-nachtritme.",
      highlightGame: "Zwart-wit contrastkaartjes volgen"
    },
    5: {
      badge: "⚡ Ontwikkelingsstap: Zintuigen Rijpen",
      type: "leap",
      headline: "Rond 5 weken: Geluiden, geuren en contrasten worden scherper",
      summary: "Rond deze periode rijpen de zintuigen in een eigen, continu tempo. Je baby kijkt iets verder (~30–40 cm), kan sneller overprikkeld zijn en bereidt de eerste sociale glimlach voor.",
      foodFocus: "100% melkvoeding (~90–120 ml per voeding). Extra troostslokjes op verzoek zijn heel normaal bij prikkelverwerking.",
      momTip: "Is je baby onrustig? Dim het licht, draag dicht bij je of gebruik rustgevende witte ruis.",
      highlightGame: "Zacht rammelaartje volgen met de ogen"
    },
    6: {
      badge: "📈 Huilpiek & Eerste Glimlach (Week 6)",
      type: "spurt",
      headline: "Eerste bewuste sociale glimlach & 6-weken huilpiek",
      summary: "Rond 6 weken bereikt het fysiologische huilen vaak een natuurlijke piek, terwijl je baby je beloont met de eerste bewuste sociale glimlach.",
      foodFocus: "Borstvoeding op verzoek of ~750–850 ml kunstvoeding per 24 uur (verdeeld over 6–8 voedingen).",
      momTip: "Wandelen met de draagzak in de buitenlucht kalmeert zowel jouw zenuwstelsel als dat van je baby.",
      highlightGame: "Glimlach-estafette & wenkbrauw-dans"
    },
    8: {
      badge: "⚡ Ontwikkelingsstap: Handjes & Patronen",
      type: "leap",
      headline: "Rond 8 weken: Eigen handjes en visuele patronen ontdekken",
      summary: "Je baby herkent steeds meer patronen in licht en geluid én ontdekt geleidelijk dat die zwaaiende handjes van hem of haar zelf zijn.",
      foodFocus: "Melkvoeding (~110–140 ml per keer). Je baby kan nu sneller afgeleid raken door de omgeving tijdens het drinken.",
      momTip: "Voed op een rustige plek als je baby steeds loslaat om rond te kijken.",
      highlightGame: "Slaan tegen een hangend speeltje of sokje"
    },
    12: {
      badge: "⚡ Ontwikkelingsstap: Soepel Grijpen & Klanken",
      type: "leap",
      headline: "Rond 3 maanden: Vloeiende bewegingen & brabbeltonen",
      summary: "Houterige pasgeboren reflexen maken geleidelijk plaats voor bewust reiken en grijpen, en je baby experimenteert met hoge en lage klinkergeluidjes.",
      foodFocus: "Melkvoeding (~120–160 ml per fles, 6–7x per dag). Let op: Vitamine K stopt na 12 weken; Vitamine D (10 mcg) gaat door tot 4 jaar!",
      momTip: "Werk overdag met een ontspannen ritme op geleide van je baby: Drinken → Spelen/Knuffelen → Slapen.",
      highlightGame: "Knisperdoekje grijpen en voelen"
    },
    16: {
      badge: "🌙 4-Maanden Slaaprijping",
      type: "leap",
      headline: "Slaapcycli rijpen & voorbereiden op 4 maanden",
      summary: "Rond het einde van de 3e maand veranderen de babyslaapcycli naar een meer volwassen patroon met lichte en diepe slaap, en wordt je baby steeds sterker in de nek.",
      foodFocus: "Nog 100% melkvoeding (~130–170 ml per fles, 5–6x per dag) + 10 mcg Vitamine D. Vanaf volgende week (4 maanden) kun je eventueel starten met eerste oefenhapjes!",
      momTip: "Zodra je baby aanstalten maakt om te rollen: direct stoppen met inbakeren en overstappen op een veilige babyslaapzak.",
      highlightGame: "Omrollen lokken met een speeltje"
    },
    17: {
      badge: "🥑 4 Maanden: Start Oefenhapjes!",
      type: "milestone",
      headline: "4 Maanden: Het oefenhapjes-window (4–6 mnd) is geopend",
      summary: "Houdt je baby het hoofdje goed stabiel en kijkt hij het eten uit je mond? Dan kun je tussen 4 en 6 maanden starten met kleine, gladde oefenhapjes.",
      foodFocus: "Melk blijft hoofdvoeding! Optioneel 1x per dag 1–2 theelepeltjes gladde groentepuree (wortel, pompoen, courgette) op een plat babylepeltje.",
      momTip: "Begin eerst 2 weken met zachte groenten vóór zoet fruit; zo went je baby makkelijker aan milde, hartige smaken.",
      highlightGame: "Voel-boekje van keukenspulletjes & lepeltje vasthouden"
    },
    19: {
      badge: "⚡ Ontwikkelingsstap: Oorzaak & Gevolg",
      type: "leap",
      headline: "Rond 4,5 maand: Oorzaak & gevolg en verwachtingen begrijpen",
      summary: "Je baby leert in eigen tempo korte reeksen voorspellen: 'Als ik tegen de rammelaar sla, hoor ik geluid' en 'Slabbetje om betekent: hapje komt eraan!'",
      foodFocus: "Melkvoeding + dagelijks 1–2 oefenhapjes zachte groente of fruit én vroeg starten met gladde 100% pindakaas en goed verhit geprakt ei door een hapje (allergiepreventie).",
      momTip: "Zet je baby gezellig aan tafel tijdens jullie maaltijd; afkijken helpt enorm bij de mondmotoriek.",
      highlightGame: "Trappel- en spetterspel op een bakplaat"
    },
    24: {
      badge: "🥑 6 Maanden: Start Echte Bijvoeding!",
      type: "milestone",
      headline: "Klaar voor vaste voeding: Puree én/of Rapley stukjes",
      summary: "Rond 6 maanden (week 24–26) kan je baby rechtop zitten met steun en heeft het lichaam extra ijzer nodig naast melk.",
      foodFocus: "Melk + 1 tot 2 maaltijden per dag (2–4 eetlepels / 40–75 g) met ijzerrijke voeding (vlees, linzen, ei), groente en gezonde vetten.",
      momTip: "Geef bijvoeding 30–45 minuten NA een melkvoeding. Kokhalzen is een normale leerreflex; verslikken is stil.",
      highlightGame: "Kiekeboe met een hydrofiele doek"
    },
    26: {
      badge: "⚡ Ontwikkelingsstap: Diepte & Nabijheid",
      type: "leap",
      headline: "Rond 6 maanden: Afstand zien & beginnende objectpermanentie",
      summary: "Je baby beseft steeds beter dat jij weg kunt lopen uit de kamer. Dat is een gezonde hechtingsstap, maar kan zorgen voor extra behoefte aan nabijheid.",
      foodFocus: "4–5 melkvoedingen + 2 vaste hapjes (groente/aardappel/vlees en fruit/pap) + oefenen met slokjes water uit een open beker.",
      momTip: "Praat tegen je baby als je even de kamer uitloopt, zodat je baby hoort dat je nog dichtbij bent.",
      highlightGame: "Speeltje verstoppen onder een bekertje"
    },
    32: {
      badge: "🍞 8 Maanden: Pincetgreep & Grove Structuur",
      type: "milestone",
      headline: "Pincetgreep (duim + wijsvinger) & kauwen oefenen",
      summary: "Je baby pakt nu kleine stukjes tussen duim en wijsvinger en leert kauwen op geprakte maaltijden en broodblokjes.",
      foodFocus: "3 melkvoedingen + grovere geprakte maaltijd, fruit en 1 sneetje lichtbruin brood met zachte margarine/pindakaas.",
      momTip: "Blijf niet te lang glad pureren na 8 maanden; grovere stukjes stimuleren de kaakspieren en mondmotoriek!",
      highlightGame: "Blauwe bessen (geplet!) uit een muffinvorm vissen"
    },
    37: {
      badge: "⚡ Ontwikkelingsstap: Categoriseren",
      type: "leap",
      headline: "Rond 8,5 maand: De wereld indelen in herkenbare groepen",
      summary: "Je baby leert voorwerpen en dieren herkennen als categorie: een grote hond, een kleine hond en een hond op een plaatje horen allemaal bij elkaar.",
      foodFocus: "3 maaltijden + 1 tussendoortje + ~500–600 ml melk verdeeld over de dag.",
      momTip: "Benoem tijdens het eten kleuren en eigenschappen: 'Kijk, de broccoli is groen en zacht!'",
      highlightGame: "Onder welk bekertje zit het blokje?"
    },
    46: {
      badge: "⚡ Ontwikkelingsstap: Doelgericht Stapelen",
      type: "leap",
      headline: "Rond 10,5 maand: Stapelen, in- en uitpakken & zelf lepelen",
      summary: "In plaats van alleen omgooien probeert je baby nu doelgericht blokjes in een bakje te stoppen, op elkaar te zetten en zelf een lepel naar de mond te brengen.",
      foodFocus: "Gezinsmaaltijd zonder zout (fijngehakt of in stukjes) + brood + fruit + ~400–500 ml melk.",
      momTip: "Geef je baby een eigen kort lepeltje in de hand terwijl jij helpt met een tweede lepel.",
      highlightGame: "Blokjes door een gleuf in een leeg bakje stoppen"
    },
    52: {
      badge: "🎂 Bijna 1 Jaar! Laatste Babyweek",
      type: "milestone",
      headline: "Afronding van het eerste levensjaar & klaar voor de 1e verjaardag",
      summary: "Wat een mijlpaal! Je baby stapt langs de meubels, brabbelt de eerste woordjes en eet bijna helemaal mee met het gezin (zonder toegevoegd zout).",
      foodFocus: "3 maaltijden + 1–2 tussendoortjes + ~400 ml melk. Let op: wacht met honing en gewone koemelk als hoofdvoeding tot na de 1e verjaardag (volgende week!).",
      momTip: "Bouw de zuigfles rustig af en oefen dagelijks met melk en water uit een open beker of rietjesbeker.",
      highlightGame: "Samen toren bouwen & 'BOEM!' omgooien"
    },
    53: {
      badge: "🎂 Hoera, 1 Jaar! Mee-eten met de Pot",
      type: "milestone",
      headline: "1 Jaar: Dreumes-start, gewone melk & mee-eten met het gezin",
      summary: "Gefeliciteerd met de 1e verjaardag! Vaste voeding is vanaf nu de hoofdbron van energie. Gewone halfvolle melk uit een beker en honing zijn nu veilig!",
      foodFocus: "Mee-eten met het gezin: kook zonder zout en snijd mee van de gezinsmaaltijd. Oefen aan tafel met een open bekertje water.",
      momTip: "In het tweede jaar groeit je kind minder snel: sommige dagen eet een dreumes veel, andere dagen bijna niets. Kijk naar het weekgemiddelde!",
      highlightGame: "Wasmand-vrachtwagen duwen & samen uitladen"
    },
    55: {
      badge: "⚡ Ontwikkelingsstap: Dagelijkse Routines",
      type: "leap",
      headline: "Rond 13 maanden: Meehelpen in huis & routines herkennen",
      summary: "Je dreumes herkent vaste dagelijkse handelingen (tafel afvegen, aankleden, opruimen) en vindt het geweldig om jou na te doen.",
      foodFocus: "Geef een eigen peuterlepel en laat je kind zelf stukjes prikken; zelf scheppen en voelen stimuleert de hand-mondmotoriek.",
      momTip: "Geef je dreumes na het eten een eigen vochtig doekje om het blad van de kinderstoel 'schoon te poetsen'.",
      highlightGame: "Pannetjes & deksels puzzel"
    },
    64: {
      badge: "⚡ Ontwikkelingsstap: Eigen Willetje & Keuzes",
      type: "leap",
      headline: "Rond 15 maanden: Autonomie ontdekken & keuzes maken",
      summary: "Rond 15 maanden ontdekt je dreumes dat hij een eigen wil heeft, oefent met het woordje 'Nee!' en verkent veilige grenzen.",
      foodFocus: "Gevarieerd bordje: ~2–3 eetlepels groente, 2 el aardappel/volkoren pasta/rijst en een stukje vlees/vis/ei/peulvrucht.",
      momTip: "Voorkom strijd aan tafel met een beperkte 'ja-keuze': 'Wil je komkommer in plakjes of in reepjes?'",
      highlightGame: "Havermout scheppen & gieten"
    },
    75: {
      badge: "⚡ Ontwikkelingsstap: 'Ik-Besef' & Fantasie",
      type: "leap",
      headline: "Rond 17–18 maanden: Zelfherkenning, troosten & doen-alsof",
      summary: "Je dreumes herkent zichzelf steeds beter in de spiegel, toont beginnend medeleven (troosten) en heeft een sterk 'Zelf doen!'-gevoel.",
      foodFocus: "Gezinsmaaltijden met eigen kinderbestek. Let op natuurlijke 'voedsel-neofobie' (voorzichtigheid met onbekende groenten rond 18–24 mnd).",
      momTip: "Leg altijd 1 'veilig' bekend hapje op het bord naast kleine proefstukjes van het avondeten, zonder dwang.",
      highlightGame: "Keukenhulpje: Zelf banaan snijden"
    },
    104: {
      badge: "🎈 Bijna 2 Jaar! Dreumes-Finale",
      type: "milestone",
      headline: "Laatste week als dreumes: Woordexplosie & zelfstandigheid",
      summary: "Je kind begrijpt bijna alles wat je zegt, rent vol energie rond en wil aan tafel helemaal zelf met vork en lepel eten.",
      foodFocus: "Dien het eten op in een vakjesbordje (gescheiden smaken); geef 2 gezonde opties ('wil je wortel of komkommer?') om zelfstandigheid te stimuleren.",
      momTip: "Zet een leeg 'Nee-dankjewel-bakje' naast het bord zodat eten dat niet in de smaak valt niet op de grond belandt.",
      highlightGame: "De geheimzinnige voel-tas ('Wat zit erin?')"
    },
    105: {
      badge: "🎈 Hoera, 2 Jaar! Peuter-mijlpaal",
      type: "milestone",
      headline: "2 Jaar: Zinnen maken, springen & rijke fantasie",
      summary: "Welkom in de peuterfase! Je peuter praat in korte zinnetjes, springt met twee voeten tegelijk van de grond en speelt volop rollenspellen.",
      foodFocus: "Bied nieuwe groenten vrolijk aan zonder dwang: 1 piepklein proefhapje is al een succes. Houd gezinsmaaltijden ontspannen en gezellig.",
      momTip: "Jij bepaalt WAT en WANNEER er gegeten wordt; je peuter bepaalt OF en HOEVEEL hij eet.",
      highlightGame: "Winkeltje & Peuter-Restaurant"
    },
    130: {
      badge: "😁 2,5 Jaar: Compleet Melkgebit & Zindelijkheid",
      type: "milestone",
      headline: "2,5 Jaar: Laatste melkkiezen & interesse in het potje",
      summary: "Rond 2,5 jaar zijn alle 20 melktanden en -kiezen doorgekomen en krijgen veel peuters interesse in het potje of de wc.",
      foodFocus: "Zet om 17:00 uur tijdens het koken alvast een schaaltje snackgroenten (komkommer, paprika, gehalveerde tomaatjes) klaar!",
      momTip: "Slaapt je peuter 's avonds pas laat in? Kort het middagslaapje in tot maximaal 45–60 minuten.",
      highlightGame: "Schilderstape evenwichtsbalk & slootje springen"
    },
    157: {
      badge: "🦋 Hoera, 3 Jaar! De 'Waarom?'-Fase",
      type: "milestone",
      headline: "3 Jaar: Verhalen vertellen, samenspelen & 2e BMR-prik",
      summary: "Je peuter stelt volop 'Waarom?'-vragen, maakt echte vriendjes, het middagslaapje vervalt vaak én rond 3 jaar volgt de 2e BMR-vaccinatie (RVP).",
      foodFocus: "100 g groente bij het avondeten + 2–3 volkoren boterhammen overdag + laatste jaar standaard 10 mcg Vitamine D.",
      momTip: "Valt het middagslaapje weg? Vervroeg de bedtijd tijdelijk naar 18:30–18:45 uur zodat je peuter niet oververmoeid aan tafel zit.",
      highlightGame: "Zinken of drijven proefjes"
    },
    195: {
      badge: "🏥 3 Jaar & 9 Mnd: Ogentest & Bijna Kleuter",
      type: "milestone",
      headline: "Laatste CB-bezoek, plaatjes-ogentest & voorbereiden op school",
      summary: "Op het consultatiebureau krijgt je peuter de leuke plaatjes-ogentest en wordt de groei en ontwikkeling besproken vóór de start op de basisschool.",
      foodFocus: "Oefen alvast met een eigen broodtrommel en drinkbeker die je kind zelf open en dicht kan klikken!",
      momTip: "Speel thuis vooraf 'Doktertje en Ogentest' met de knuffels zodat het bezoek op het CB een feestje is.",
      highlightGame: "De Knuffel-Dokter & Pleister-Kliniek"
    },
    209: {
      badge: "🎒 Hoera, 4 Jaar! Naar de Basisschool (Groep 1)",
      type: "milestone",
      headline: "4 Jaar: Een grote stap naar groep 1 & nieuwe indrukken",
      summary: "De basisschooltijd begint! Een spannende overgang vol nieuwe vriendjes, liedjes, kringgesprekken en zelfstandigheid.",
      foodFocus: "Stevig volkoren ontbijt + gevulde schooltrommel (fruit, snoepgroente, volkorenbrood) + om 14:30 een rustig 'Uit-school ontprikkel-bordje'.",
      momTip: "Kleuters houden zich op school de hele dag groot en kunnen thuis ontladen (zelfregulatie-moeheid na schooltijd). Geef bij thuiskomst eerst rust, eten en een knuffel vóór je vragen stelt!",
      highlightGame: "Rug-tekenen raadsel (rustig ontprikkelen na school)"
    },
    261: {
      badge: "🎲 Hoera, 5 Jaar! Groep 2, Letters & Zwemles",
      type: "milestone",
      headline: "5 Jaar: Rijmen, tellen, fietsen, DKT-prik & eerste wiebeltand",
      summary: "In groep 2 ontdekt je kleuter letters en getallen, leert fietsen zonder zijwieltjes en ontvangt rond 5 jaar de DKT-boosterprik (RVP).",
      foodFocus: "Gezonde 10-uurtjes voor school: geef knapperige snackgroente mee (komkommerlinten of snoeptomaatjes) naast een stuk fruit en water.",
      momTip: "Stap vanaf 5 jaar over op junior-/volwassenentandpasta (1.000–1.500 ppm fluoride) voor de nieuwe blijvende 'zesjaarskiezen' en poets elke avond zorgvuldig na!",
      highlightGame: "Rijm-raketten & 'Ik zie, ik zie met de letter...'"
    },
    313: {
      badge: "📚 Hoera, 6 Jaar! Groep 3: Leren Lezen & Rekenen",
      type: "milestone",
      headline: "6 Jaar: De magische sprong van letters naar echte woorden",
      summary: "In groep 3 leert je kind in razend tempo lezen, schrijven en rekenen én wisselen de eerste melktanden.",
      foodFocus: "Kinderhersenen op 6-jarige leeftijd draaien op volle toeren: zorg voor volkoren granen, 150 g groente, eiwitten en 1 liter water per dag.",
      momTip: "Leer je kind het toverwoordje 'NOG': 'Ik kan dit NOG niet lezen!' geeft ruimte om te oefenen zonder faalangst.",
      highlightGame: "Speurtocht met geheime briefjes"
    },
    365: {
      badge: "🏊 Hoera, 7 Jaar! Groep 4, Klokkijken & Sport",
      type: "milestone",
      headline: "7 Jaar: Vlot lezen, zwemdiploma's & teamsport",
      summary: "Je kind leest zelfstandig langere verhalen, leert klokkijken en de tafels van vermenigvuldiging en geniet van sportclubs.",
      foodFocus: "Geef voor of na zwemles en sport een voedzaam tussendoortje (banaan met pindakaas, volkoren mueslibol of smoothie) in plaats van suikerrijke sportdrank.",
      momTip: "Om-en-om 15 minuten lezen in bed voor het slapen gaan houdt het leesplezier hoog en zorgt voor een ontspannen avondritueel.",
      highlightGame: "Verliefde Harten dobbel-race (samen 10 maken)"
    },
    417: {
      badge: "🔭 Hoera, 8 Jaar! Groep 5 & Junior-Chef",
      type: "milestone",
      headline: "8 Jaar: Van 'leren lezen' naar 'lezen om te leren'",
      summary: "Je kind duikt diep in eigen passies (ruimtevaart, dieren, sport, techniek), denkt logisch na en kan al echt meehelpen met koken.",
      foodFocus: "Vaste waterfles mee naar school: water en ongezoete thee zijn de beste dorstlessers voor scherpe concentratie tussen de lessen.",
      momTip: "Laat je 8-jarige één keer per week zelf een eenvoudig gerecht (zoals wraps, soep of roerei) klaarmaken voor het gezin!",
      highlightGame: "Mystery-Box Junior Chef-Kok"
    },
    469: {
      badge: "🌍 Hoera, 9 Jaar! Groep 6 & Eigen Mening",
      type: "milestone",
      headline: "9 Jaar: Kritisch denken, hechte vriendschappen & eigen kijk",
      summary: "In groep 6 worden vriendschappen intenser, ontwikkelt je kind een sterk gevoel voor rechtvaardigheid en groeit het zelfstandig plannen.",
      foodFocus: "Praat positief over voeding als 'brandstof voor spieren en hersenen' en eet zoveel mogelijk schermvrij samen aan tafel.",
      momTip: "Vraag bij lastige situaties eerst: 'Wil je dat ik alleen even luister, of zullen we samen een oplossing bedenken?'",
      highlightGame: "Familie-Reporter & Interview-Podcast"
    },
    521: {
      badge: "⚡ Hoera, 10 Jaar! Groep 7 & Start Groeispurt",
      type: "milestone",
      headline: "10 Jaar: Tiener-start, botopbouw & HPV-vaccinatie",
      summary: "Welkom in de pre-tienerfase! De lengtegroeispurt en hersen-remodeling starten en je kind groeit toe naar meer zelfstandigheid.",
      foodFocus: "Piekmoment botopbouw: zorg voor volwaardige voeding met calcium, zaden, peulvruchten en dagelijks 30–60 minuten beweging in het daglicht.",
      momTip: "De beste gesprekken ontstaan nu 'zij-aan-zij' tijdens het samen fietsen, wandelen of koken.",
      highlightGame: "€15 Familie-Diner Challenge"
    },
    573: {
      badge: "🌟 Hoera, 11 Jaar! Groep 8 & Richting Brugklas",
      type: "milestone",
      headline: "11 Jaar: Oudste van de basisschool & open dagen bezoeken",
      summary: "Een bijzonder jaar met het schoolkamp, de eindmusical en het kiezen van een middelbare school.",
      foodFocus: "Grote trek na school is heel normaal in de groeispurt: richt een 'Gezonde Tiener-Plank' in de koelkast in (wraps, hummus, gekookte eitjes, kwark, noten).",
      momTip: "Laat telefoons en schermen 's nachts buiten de slaapkamer opladen zodat het tienerbrein echt aan 9–10 uur diepe slaap toekomt.",
      highlightGame: "Het 'Wissel-van-Kant' Tafel-Debat"
    },
    624: {
      badge: "🎓 12 Jaar! Klaar voor de Middelbare School",
      type: "milestone",
      headline: "12 Jaar (Week 624): Zelfstandig, veerkrachtig & klaar voor de brugklas!",
      summary: "Van pasgeboren baby naar een zelfstandige 12-jarige! Je kind plant eigen huiswerk en sport, kookt mee en fietst zelfstandig een nieuwe wereld tegemoet.",
      foodFocus: "Stevig ontbijt vóór het fietsen naar school: havermout, volkorenbrood of eieren voorkomen middagdipjes en leveren langdurige energie.",
      momTip: "Blijf het rustige anker thuis: ook als 12-jarigen stoer en zelfstandig lijken, hebben ze jouw aanmoediging en gezamenlijke eetmomenten nog elke dag nodig.",
      highlightGame: "Zonder-Google-Maps Expeditie (Brugklas-Route)"
    }
  },

  // =========================================================================
  // 2. 15 ONTWIKKELINGSFASES (VAN GEBOORTE TOT 12 JAAR)
  // =========================================================================
  stages: [
    {
      id: "stage-w1-4",
      phaseIndex: 1,
      title: "Pasgeboren (Week 1–4)",
      shortLabel: "0–1 mnd",
      minWeek: 1,
      maxWeek: 4,
      ageRangeLabel: "Week 1 t/m 4 (Maand 1)",
      heroEmoji: "👶",
      cutType: "milk",
      summary: "Zachte landing op de wereld. Alles draait om voeden op verzoek, huid-op-huidcontact en slapen.",
      nutrition: {
        milkStatus: "100% Borstvoeding of Startvoeding (nr. 1)",
        feedsPerDay: "8 tot 12+ voedingen per 24 uur",
        milkVolumeMetric: "45–90 ml per flesje (~500–750 ml/dag)",
        milkVolumeImperial: "1.5–3 oz per flesje (~17–25 oz/dag)",
        solidsPerDay: "Geen vaste voeding of extra water",
        portionGuideMetric: "0 g • Dagelijks 10 mcg Vitamine D + 150 mcg Vitamine K (bij borstvoeding)",
        portionGuideImperial: "0 oz • Dagelijks 400 IU Vitamine D + Vitamine K",
        pureePath: "Nog niet van toepassing. Focus op rustig aanleggen of therapeutisch (horizontaal) flesvoeden.",
        blwPath: "Nog niet van toepassing. Laat je baby vrij aan de eigen schone handjes sabbelen.",
        bestFoods: [
          { name: "Borstvoeding / Colostrum", icon: "🤱", note: "Past zich elke dag aan de behoefte en afweer van je baby aan." },
          { name: "Volledige Zuigelingenvoeding (nr. 1)", icon: "🍼", note: "Voed op verzoek met een langzame speen (ca. 15–20 min per fles)." },
          { name: "Vitamine D & K druppels", icon: "☀️", note: "Vanaf dag 8: dagelijks 10 mcg Vitamine D (en Vitamine K bij >50% borstvoeding)." }
        ],
        avoidFoods: [
          "Geen extra water of kruidenthee (belast de jonge nieren; melk bevat al voldoende vocht)",
          "Geen honing of vaste voeding (de darmpjes zijn tot 4 maanden alleen rijp voor melk)"
        ],
        sampleMenu: [
          "Elke 2 tot 3 uur: Borstvoeding of flesje op verzoek",
          "Avond (18:00–22:00): Clustervoedingen zijn heel normaal"
        ],
        recipes: [
          {
            title: "Kraamweek Eenhandig Energie-Bordje (Voor Mama)",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["2 volkoren beschuiten of crackers", "100% pindakaas & plakjes banaan", "Handje walnoten & 2 dadels", "Grote bidon water (2L/dag bij borstvoeding)"],
            steps: "Beleg de crackers met pindakaas en banaan en leg de walnoten en dadels ernaast. Zet dit met een rietjesfles water naast je voedingskussen zodat je met één hand kunt eten tijdens het voeden."
          },
          {
            title: "Lauwwarme Havermout met Appel & Kaneel (Melkproductie & Herstel)",
            mealType: "ontbijt",
            prepTime: "4 min",
            ingredients: ["50 g fijne havermout", "200 ml halfvolle melk of havermelk", "1/2 appel in blokjes", "Snuf kaneel & 1 el gebroken lijnzaad"],
            steps: "Verwarm de havermout, melk en appelblokjes 3 minuten in een pannetje of magnetron. Roer kaneel en lijnzaad erdoor voor vezels en ijzer na de bevalling."
          },
          {
            title: "Therapeutisch Flesje + Vitamine D & K Ochtendritueel (Voor Baby)",
            mealType: "ontbijt",
            prepTime: "3 min",
            ingredients: ["60–90 ml afgekolfde moedermelk of zuigelingenvoeding nr. 1", "10 mcg Vitamine D druppels (vanaf dag 8)", "150 mcg Vitamine K druppels (bij borstvoeding)"],
            steps: "Geef voor het eerste ochtendvoedingsmoment de vitamine D (en K) druppels op een klein lepeltje of in het wangzakje, en voed je baby half-rechtop met een langzame speen."
          },
          {
            title: "Snelle IJzer-Booster Wrap met Hummus & Ei (Mama-Lunch)",
            mealType: "lunch",
            prepTime: "4 min",
            ingredients: ["1 volkoren tortilla wrap", "2 el hummus", "1 hardgekookt ei in plakjes", "Handje verse bladspinazie"],
            steps: "Besmeer de wrap met hummus, beleg met spinazie en ei, en rol strak op. Eet je makkelijk met één hand terwijl je baby op je borst slaapt!"
          },
          {
            title: "Nachtvoeding 'Geen-Kruimel' Dadel-Noten Hapjes",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["6 zachte Medjoul dadels", "2 el 100% amandel- of pindakaas", "6 halve walnoten"],
            steps: "Snijd de dadels open, haal de pit eruit, vul met een theelepel notenpasta en druk er een walnoot in. Bewaar in een bakje op je nachtkastje tegen de nachtelijke honger."
          },
          {
            title: "Rustgevende Kamille-Gember Drinkmoment (1,5L Kraamkan)",
            mealType: "warme-hap",
            prepTime: "2 min",
            ingredients: ["1 zakje kamillethee (geen venkel- of anijsthee)", "2 schijfjes verse gember", "1 liter heet water in een thermoskan"],
            steps: "Zet 's ochtends één grote thermoskan kamillethee met gember klaar op het aanrecht zodat je de hele dag zonder moeite warm en gehydrateerd blijft."
          }
        ]
      },
      healthCB: {
        cbVisit: "Week 1: Hielprik & Gehoorscreening thuis • Week 2: Huisbezoek jeugdverpleegkundige • Week 4: 1e afspraak bij de jeugdarts op het Consultatiebureau.",
        vaccines: "Nog geen prikken (tenzij maternale kinkhoestprik niet is gehaald; dan evt. vanaf 6 weken).",
        teeth: "Nog geen tandjes zichtbaar (de melktandjes zitten al wel klaar in de kaak!)."
      },
      sleep: {
        totalSleep: "14 tot 17 uur per 24u",
        wakeWindow: "35 tot 60 minuten (incl. voeden!)",
        naps: "4 tot 6+ korte en lange dutjes",
        tip: "Wacht niet tot je baby oververmoeid huilt: bij gapen of wegkijken na ~45 minuten wakker is het tijd om te slapen."
      },
      milestones: [
        "Tilt het hoofdje kort op tijdens buik-op-borst liggen",
        "Kijkt scherp op 20–30 cm afstand naar jouw gezicht",
        "Kalmeert door jouw stem, geur en hartslag",
        "Toont zoek-, zuig- en grijpreflex"
      ],
      tipsForMom: [
        "Zes of meer zware plasluiers per dag (vanaf dag 5) betekent dat je baby genoeg melk binnenkrijgt.",
        "Houd de kraamvisite kort en neem zelf elke middag rust."
      ],
      games: [
        {
          id: "g-w1-face",
          title: "Oogcontact & Gezichtjes Kijken (20–30 cm)",
          category: "social",
          duration: "3–5 min",
          energy: "low",
          brainBenefit: "Stimuleert visuele fixatie op 20–30 cm afstand, gezichtsherkenning en de aanmaak van het hechtingshormoon oxytocine.",
          materials: "Alleen jouw gezicht",
          howToPlay: "Houd je baby op 20 tot 30 cm van je gezicht (de exacte scherpstelafstand van een pasgeborene). Maak rustig oogcontact, glimlach warm en praat met zachte, hoge stembuigingen terwijl je baby jouw ogen en mondcontouren verkent.",
          funTwist: "Neurie op een lage, warme toon tegen je borstkas."
        },
        {
          id: "g-w1-chest",
          title: "Buik-op-borst Tummy Time",
          category: "motor",
          duration: "2–4 min",
          energy: "low",
          brainBenefit: "Versterkt de nekspieren op een veilige, geborgen manier.",
          materials: "Kussens in je rug op de bank",
          howToPlay: "Ga half achterover zitten en leg je baby met de buik op jouw borst. Praat zachtjes zodat je baby het hoofdje optilt om je aan te kijken.",
          funTwist: "Wieg heel zachtjes van links naar rechts voor het evenwichtsgevoel."
        },
        {
          id: "g-w1-contrast",
          title: "Zwart-wit contrast volgen",
          category: "cognitive",
          duration: "3–5 min",
          energy: "low",
          brainBenefit: "Stimuleert de oogzenuw en het volgen met beide ogen.",
          materials: "Zwart-wit kaartje of gestreept doekje",
          howToPlay: "Houd een contrastkaartje op 25 cm afstand en beweeg het heel langzaam 10 cm naar links en naar rechts.",
          funTwist: "Zet een kaartje naast het aankleedkussen voor tijdens het verschonen."
        },
        {
          id: "g-w1-voice",
          title: "Stem-Kompas (Links & Rechts Luisteren)",
          category: "language",
          duration: "3 min",
          energy: "low",
          brainBenefit: "Helpt de hersenen om geluid te koppelen aan richting en herkenning van jouw stem.",
          materials: "Geen",
          howToPlay: "Fluister of zing zachtjes eerst bij het linkeroor van je baby en daarna bij het rechteroor. Kijk hoe je baby het hoofdje of de ogen naar je stem draait.",
          funTwist: "Laat ook je partner meedoen zodat je baby beide stemmen leert onderscheiden."
        },
        {
          id: "g-w1-finger",
          title: "Vinger-Grijpreflex & Handpalm-Massage",
          category: "motor",
          duration: "3 min",
          energy: "low",
          brainBenefit: "Versterkt de tastzin en helpt gesloten pasgeboren vuistjes ontspannen.",
          materials: "Druppeltje baby-olie (optioneel)",
          howToPlay: "Strijk zachtjes over de rug van het handje zodat het vuistje vanzelf opent, en leg je pink in de handpalm zodat je baby die stevig vastgrijpt.",
          funTwist: "Masseer ook zachtjes de voetzooltjes van hiel naar teentjes."
        },
        {
          id: "g-w1-skin",
          title: "Huid-op-Huid Hartslag-Rust",
          category: "social",
          duration: "15 min",
          energy: "low",
          brainBenefit: "Reguleert temperatuur, ademhaling en verlaagt stresshormonen bij moeder én baby.",
          materials: "Warme deken",
          howToPlay: "Leg je baby alleen in een luier op jouw blote borst onder een warme deken en adem diep en langzaam in en uit.",
          funTwist: "Vertel op zachte verteltoon wat jullie vandaag samen gaan doen."
        }
      ]
    },
    {
      id: "stage-m1-2",
      phaseIndex: 2,
      title: "Eerste Lach & Geluidjes (Maand 1–2 / Week 5–8)",
      shortLabel: "1–2 mnd",
      minWeek: 5,
      maxWeek: 8,
      ageRangeLabel: "Week 5 t/m 8 (Maand 1–2)",
      heroEmoji: "😊",
      cutType: "milk",
      summary: "De eerste echte glimlach! Je baby maakt lieve 'uh-oh' geluidjes, volgt je met de ogen en ontdekt de eigen handjes.",
      nutrition: {
        milkStatus: "100% Borstvoeding of Zuigelingenvoeding",
        feedsPerDay: "6 tot 8 voedingen per 24 uur",
        milkVolumeMetric: "90–130 ml per flesje (~700–900 ml/dag)",
        milkVolumeImperial: "3–4.5 oz per flesje (~24–30 oz/dag)",
        solidsPerDay: "Geen vaste voeding",
        portionGuideMetric: "0 g • Dagelijks Vitamine D (10 mcg) + Vitamine K",
        portionGuideImperial: "0 oz • Dagelijks Vitamine D (400 IU)",
        pureePath: "Nog niet. De darmpjes rijpen nog volop.",
        blwPath: "Sabbelen op de eigen vuistjes is gezonde mondontdekking (niet altijd honger!).",
        bestFoods: [
          { name: "Borstvoeding of Kunstvoeding nr. 1", icon: "🍼", note: "Richtlijn kunstvoeding: ca. 150 ml per kg lichaamsgewicht per 24 uur." },
          { name: "Vitamine D & K", icon: "☀️", note: "Elke ochtend bij de eerste voeding geven zodat je het niet vergeet." }
        ],
        avoidFoods: [
          "Geen rijstebloem of vaste hapjes (wacht met oefenhapjes tot minimaal 4 maanden)",
          "Geen extra water, kruidenthee of honing (melkvoeding dekt de volledige vochtbehoefte)"
        ],
        sampleMenu: [
          "Overdag elke 3 uur een melkvoeding (~100–130 ml)",
          "Nacht: vaak 1 iets langer blok van 4–5 uur slaap"
        ],
        recipes: [
          {
            title: "Rustig Fles- & Voedingsritueel tegen Darmkrampjes (Baby)",
            mealType: "ontbijt",
            prepTime: "2 min",
            ingredients: ["100–130 ml zuigelingenvoeding nr. 1 of moedermelk", "Vitamine D druppels (10 mcg)", "Vitamine K druppels (150 mcg bij borstvoeding)"],
            steps: "Roer het flesje zachtjes met een vork of draai het rond (niet hard schudden i.v.m. luchtbelletjes!). Voed je baby half-rechtop en houd het flesje horizontaal."
          },
          {
            title: "Mama's 3-Minuten Kwark-Bessen-Walnoot Kom",
            mealType: "ontbijt",
            prepTime: "3 min",
            ingredients: ["200 g volle of halfvolle kwark", "Handje blauwe bessen of aardbeien", "2 el volkoren muesli of havermout", "Handje ongezouten walnoten"],
            steps: "Schep de kwark in een kom en strooi het fruit, de havermout en walnoten erover. Rijk aan eiwit, calcium en omega-3 voor jouw herstel."
          },
          {
            title: "Eenhandige Avocado-Ei Volkoren Toast (Mama-Lunch)",
            mealType: "lunch",
            prepTime: "4 min",
            ingredients: ["2 volkoren boterhammen", "1/2 rijpe avocado", "1 gekookt of gebakken ei", "Snufje sesamzaad & peper"],
            steps: "Prak de avocado direct op het geroosterde volkorenbrood, beleg met plakjes ei en snijd in reepjes zodat je het makkelijk met één hand kunt eten."
          },
          {
            title: "Snelle Banaan-Havermout Lactatie-Smoothie",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["250 ml melk of amandeldrink", "1 rijpe banaan", "3 el fijne havermout", "1 el 100% pindakaas & 1 tl lijnzaad"],
            steps: "Blend alles in 45 seconden glad en schenk in een beker met rietje. Geeft direct langdurige energie na een gebroken nacht."
          },
          {
            title: "5-Minuten Tomaten-Linzen Kopsoep (Warm & IJzerrijk)",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["200 ml gezeefde tomaten (passata)", "100 g voorgekookte rode linzen of kikkererwten", "100 ml bouillon", "Scheutje olijfolie & basilicum"],
            steps: "Verwarm de passata, linzen en bouillon 4 minuten in een steelpannetje, pureer kort of laat heel en drink warm uit een grote mok."
          },
          {
            title: "Appel-Pindakaas Schijfjes ('Gezonde Koekjes')",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["1 appel in ronde plakken (zonder klokhuis)", "2 el 100% pindakaas", "1 el rozijnen of kokosrasp"],
            steps: "Besmeer de appelringen met pindakaas en bestrooi met rozijnen. Knapperig, fris en klaar in 3 minuten."
          }
        ]
      },
      healthCB: {
        cbVisit: "Rond 8 weken: Controle op het Consultatiebureau (groei, ogen, hartje en heupjes).",
        vaccines: "6–9 weken: Eerste drinkvaccin Rotavirus + rond 8–12 weken eerste DKTP-Hib-HepB en Pneumokokken prik (afhankelijk van 22-wekenprik tijdens zwangerschap).",
        teeth: "Nog geen tandjes; wel meer speekselvorming vanaf 2 maanden."
      },
      sleep: {
        totalSleep: "14 tot 16 uur per 24u",
        wakeWindow: "60 tot 90 minuten",
        naps: "4 tot 5 slaapjes per dag",
        tip: "Rond 6 weken zijn baby's het meest prikkelgevoelig. Een draagdoek of witte ruis doet wonderen."
      },
      milestones: [
        "Schenkt de eerste bewuste sociale glimlach",
        "Maakt klinkergeluidjes ('aaah', 'ooo')",
        "Houdt het hoofdje op 45° tijdens buikligging",
        "Volgt een bewegend voorwerp met de ogen"
      ],
      tipsForMom: [
        "Klets terug als je baby geluidjes maakt en wacht steeds even op 'antwoord'—zo leert je baby al beurtgedrag.",
        "Leg je baby na elke luierwissel 2 minuutjes op de buik; kort en vaak werkt veel beter dan één lange sessie."
      ],
      games: [
        {
          id: "g-m1-coo",
          title: "Brabbel-gesprekje voeren",
          category: "language",
          duration: "5 min",
          energy: "low",
          brainBenefit: "Traint de taalgebieden in de hersenen door beurt-om-beurt reageren.",
          materials: "Geen",
          howToPlay: "Herhaal het precieze geluidje dat je baby maakt ('Aaa-goe!') met een grote glimlach en wacht 5 seconden zodat je baby terug kan praten.",
          funTwist: "Wissel af tussen fluisteren en vrolijk zingen."
        },
        {
          id: "g-m1-kick",
          title: "Trappelen tegen knisperpapier",
          category: "motor",
          duration: "5 min",
          energy: "medium",
          brainBenefit: "Versterkt de beenspieren en leert eerste oorzaak-gevolg.",
          materials: "Knisperboekje of bakpapier onder een handdoek bij de voetjes",
          howToPlay: "Leg je baby met blote voetjes tegen een knisperdoekje. Elke trap geeft een leuk knispergeluid!",
          funTwist: "Fiets zachtjes met de beentjes op het ritme van een kinderliedje."
        },
        {
          id: "g-m1-rolltowel",
          title: "Handdoekrolletje Tummy Time & Spiegel",
          category: "motor",
          duration: "4 min",
          energy: "low",
          brainBenefit: "Maakt buikligging veel makkelijker en versterkt nek- en schouderspieren.",
          materials: "Opgerolde handdoek + onbreekbaar spiegeltje",
          howToPlay: "Leg een klein opgerold handdoekje onder de borstkas en okseltjes van je baby en zet een spiegeltje ervoor.",
          funTwist: "Tik met je vinger op het spiegelbeeld en zeg 'Wie is die knappe baby daar?'"
        },
        {
          id: "g-m1-track",
          title: "180-Graden Regenboog Oog-Volgen",
          category: "cognitive",
          duration: "4 min",
          energy: "low",
          brainBenefit: "Traint soepele oogvolgbewegingen (smooth pursuit) en het kruisen van de lichaamsmiddellijn.",
          materials: "Rood of zwart-wit speeltje",
          howToPlay: "Beweeg een speeltje op 30 cm afstand in een langzame boog van links over het midden naar rechts zodat je baby het helemaal volgt.",
          funTwist: "Laat het speeltje aan het einde een zacht kriebeltje op de buik geven."
        },
        {
          id: "g-m1-smile",
          title: "Glimlach-Estafette & Wenkbrauw-Dans",
          category: "social",
          duration: "5 min",
          energy: "low",
          brainBenefit: "Versterkt emotionele hechting en herkenning van gezichtsuitdrukkingen.",
          materials: "Geen",
          howToPlay: "Trek je wenkbrauwen hoog op met een verbaasde lach ('Oooo!') en ontspan je gezicht weer. Tel hoe snel je baby teruglacht!",
          funTwist: "Geef bij elke glimlach een kusje op allebei de handjes."
        },
        {
          id: "g-m1-shadow",
          title: "Dansende Lichtjes & Schaduwen",
          category: "cognitive",
          duration: "5 min",
          energy: "low",
          brainBenefit: "Prikkelt het visuele aandachtssysteem en het herkennen van licht-donkerpatronen.",
          materials: "Zaklampje van je telefoon + vergiet of je eigen handen",
          howToPlay: "Schijn in een schemerige kamer via het plafond of door een vergiet zodat er rustige lichtpuntjes over de muur wandelen.",
          funTwist: "Neurie een rustig slaapliedje terwijl jullie samen kijken."
        }
      ]
    },
    {
      id: "stage-m3-4",
      phaseIndex: 3,
      title: "Schaterlachen, Grijpen & Omrollen (2–3 mnd / Week 9–16)",
      shortLabel: "2–3 mnd",
      minWeek: 9,
      maxWeek: 16,
      ageRangeLabel: "Week 9 t/m 16 (2 tot 4 maanden)",
      heroEmoji: "🤸",
      cutType: "milk",
      summary: "Je baby lacht hardop, steunt stevig op de onderarmen, grijpt bewust naar speelgoed en drinkt 5 tot 6 grotere melkvoedingen per dag.",
      nutrition: {
        milkStatus: "100% Borstvoeding of Volledige Zuigelingenvoeding (nr. 1)",
        feedsPerDay: "5 tot 6 melkvoedingen per 24 uur",
        milkVolumeMetric: "130–170 ml per flesje (~750–950 ml/dag)",
        milkVolumeImperial: "4.5–5.5 oz per flesje (~25–32 oz/dag)",
        solidsPerDay: "Nog geen vaste voeding (oefenhapjes pas vanaf 4 mnd / week 17)",
        portionGuideMetric: "0 g • Dagelijks 10 mcg Vitamine D (Vitamine K stopt na 12 weken)",
        portionGuideImperial: "0 oz • Dagelijks 400 IU Vitamine D (Vitamine K stopt na 12 weken)",
        pureePath: "Nog niet van toepassing: t/m 3 maanden (week 16) zijn de darmpjes nog aan het rijpen en haalt je baby alle voedingsstoffen uit borst- of flesvoeding.",
        blwPath: "Je baby stopt nu volop de eigen schone handjes en een veilig bijtspeeltje in de mond: dat traint de kaakjes en verplaatst de kokhalsreflex alvast voor straks.",
        bestFoods: [
          { name: "Borstvoeding of Zuigelingenvoeding nr. 1", icon: "🍼", note: "Levert in maand 2 en 3 nog 100% van alle benodigde energie en vocht." },
          { name: "Dagelijks 10 mcg Vitamine D", icon: "☀️", note: "Na 12 weken (week 12) mag je stoppen met Vitamine K; Vitamine D blijf je dagelijks geven tot 4 jaar." },
          { name: "Sabbelen op Handjes & Bijtspeeltje", icon: "🖐️", note: "Belangrijke mondmotorische voorbereiding op de oefenhapjes vanaf 4 maanden." }
        ],
        avoidFoods: [
          "Geen vaste oefenhapjes, fruit of rijstebloem (pas veilig vanaf 4 maanden / week 17)",
          "Geen extra water, kruidenthee, honing of gewone koemelk (belast de nieren en darmen)"
        ],
        sampleMenu: [
          "07:00, 10:30, 14:00, 17:30, 21:30 (+ evt. nachtvoeding): Borst- of flesvoeding",
          "Overdag tussen de slaapjes: Tummy Time & gezellig erbij aan tafel in de wipstoel"
        ],
        recipes: [
          {
            title: "Rustig Voedingsritueel bij de 3-Maanden Afleidingsfase (Baby)",
            mealType: "ontbijt",
            prepTime: "2 min",
            ingredients: ["130–170 ml moedermelk of zuigelingenvoeding nr. 1", "10 mcg Vitamine D druppels", "Rustige, prikkelarme hoek van de kamer"],
            steps: "Rond 3 maanden kijkt je baby tijdens het drinken snel om zich heen. Voed in een rustige kamer met gedimd licht en geef vooraf de dagelijkse Vitamine D druppels."
          },
          {
            title: "Mama's 4-Minuten Spinazie-Feta Omelet Wrap (IJzer & Energie)",
            mealType: "lunch",
            prepTime: "4 min",
            ingredients: ["1 volkoren tortilla wrap", "2 eieren", "Handje verse bladspinazie", "2 el verkruimelde feta of hüttenkäse"],
            steps: "Roerbak de spinazie en eieren in 2 minuten gaar, schep op de volkoren wrap met feta en rol strak op. Voedzaam en met één hand te eten!"
          },
          {
            title: "Snelle Appel-Kaneel-Walnoot Havermout (Mama-Ontbijt)",
            mealType: "ontbijt",
            prepTime: "4 min",
            ingredients: ["50 g havermout", "200 ml halfvolle melk of plantaardige drink", "1/2 appel in blokjes + kaneel", "Handje walnoten & 1 el lijnzaad"],
            steps: "Verwarm de havermout met melk en appelblokjes 3 minuten. Top met walnoten en lijnzaad voor stabiele ochtendenergie."
          },
          {
            title: "5-Minuten Romige Tomaten-Wortel-Linzen Soep (Mama Warme Hap)",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["250 ml tomatenpassata", "100 g voorgekookte rode linzen", "1 geraspte wortel", "1 el olijfolie, Italiaanse kruiden & volkoren broodje"],
            steps: "Verwarm de passata, linzen en fijngeraspte wortel 4 minuten in een pannetje en pureer kort met olijfolie tot een vullende maaltijdsoep."
          },
          {
            title: "Voorbereiding op 4 Maanden: Eerste Groente-IJsblokjes Voorraad",
            mealType: "warme-hap",
            prepTime: "5 min actief (+ 12 min stomen)",
            ingredients: ["250 g zachte wortel, pompoen of courgette (voor vanaf week 17!)", "2 el kookvocht", "1 siliconen ijsblokjesvorm met deksel"],
            steps: "Bijna 4 maanden? Stoom alvast een portie zachte groente gaar, pureer helemaal glad en vries in als ijsblokjes. Zo staat je eerste oefenhapje vanaf week 17 direct klaar!"
          },
          {
            title: "3-Minuten Hummus-Komkommer Volkoren Crackers (Mama-Snack)",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["2 volkoren crackers", "2 el hummus", "Plakjes komkommer & geroosterde pompoenpitten"],
            steps: "Besmeer de volkoren crackers royaal met hummus en beleg met komkommer en pompoenpitten voor een snelle eiwit- en vezelboost."
          }
        ]
      },
      healthCB: {
        cbVisit: "3 maanden: Afspraak op het Consultatiebureau (groei, motoriek en bespreken van de naderende 4-maanden fase).",
        vaccines: "3 maanden: Tweede Rotavirus-druppelvaccin + DKTP-Hib-HepB en Pneumokokken (volgens RVP-schema).",
        teeth: "Kwijlen en op de vuistjes sabbelen neemt toe doordat de speekselklieren en tandkassen zich ontwikkelen."
      },
      sleep: {
        totalSleep: "13,5 tot 15 uur per 24u",
        wakeWindow: "75 tot 110 minuten",
        naps: "3 tot 4 slaapjes per dag",
        tip: "Begint je baby aanstalten te maken om op de zij te rollen? Bouw het inbakeren direct af en gebruik een goed passende babyslaapzak."
      },
      milestones: [
        "Steunt stevig op de onderarmen en tilt het hoofdje 90° op tijdens buikligging",
        "Pakt een rammelaar vast en brengt beide handen naar het midden",
        "Rolt van buik naar rug of draait op de zij",
        "Lacht hardop (schaterlach!) als je gekke bekken trekt"
      ],
      tipsForMom: [
        "Na 12 weken mag je stoppen met Vitamine K druppels. Vitamine D (10 mcg per dag) blijf je wél elke dag geven tot de 4e verjaardag!",
        "Zet je baby in de wipstoel of newborn-set gezellig bij jullie aan tafel: door naar jullie te kijken went je baby alvast aan het eetritueel voor vanaf 4 maanden."
      ],
      games: [
        {
          id: "g-m3-scarf",
          title: "Zwevend sjaaltje vangen",
          category: "motor",
          duration: "5 min",
          energy: "low",
          brainBenefit: "Oefent oog-handcoördinatie en grijpen met twee handjes.",
          materials: "Licht sjaaltje of schone spuugdoek",
          howToPlay: "Laat een licht doekje langzaam naar beneden dwarrelen boven de buik van je baby en moedig aan om het vast te pakken.",
          funTwist: "Trek het doekje zachtjes langs de blote handjes en voetjes."
        },
        {
          id: "g-m3-roll",
          title: "Omrol-lokkertje",
          category: "motor",
          duration: "5 min",
          energy: "medium",
          brainBenefit: "Traint de schuine buikspieren voor het omrollen.",
          materials: "Favoriete rammelaar",
          howToPlay: "Houd een speeltje schuin naast het hoofdje zodat je baby op de zij draait. Help eventueel zachtjes bij het bovenste heupje.",
          funTwist: "Klap enthousiast bij elke rol zodat buikligging een feestje wordt!"
        },
        {
          id: "g-m3-giggle",
          title: "Schaterlach 'Ik kom je kriebelen!'-Opbouw",
          category: "social",
          duration: "5 min",
          energy: "low",
          brainBenefit: "Leert sociale voorspelbaarheid, anticipatie en positieve spanning opbouwen.",
          materials: "Alleen je handen",
          howToPlay: "Laat je vingers langzaam vanaf de voetjes omhoog 'wandelen' met een oplopende stem ('Kriebel... kriebel... KRIEBEL!') tot op het buikje.",
          funTwist: "Pauzeer 2 seconden vlak voor het buikje: vaak begint je baby al op voorhand te schaterlachen!"
        },
        {
          id: "g-m3-textures",
          title: "Voel-Boekje van Keukenspulletjes",
          category: "cognitive",
          duration: "6 min",
          energy: "low",
          brainBenefit: "Stimuleert de tastzin en het verschil tussen zacht, glad en ribbelig.",
          materials: "Zacht washandje, siliconen pannenlikker & houten lepel",
          howToPlay: "Laat je baby om de beurt voelen aan het zachte washandje, de gladde lepel en het ribbelige siliconen kwastje en benoem hoe het voelt.",
          funTwist: "Laat je baby op het schone siliconen kwastje sabbelen bij werkende tandkassen."
        },
        {
          id: "g-m3-sing",
          title: "Klank-Glijbaan ('Oeeee-Aaaaa!')",
          category: "language",
          duration: "5 min",
          energy: "low",
          brainBenefit: "Helpt je baby ontdekken hoe hij zijn eigen stemhoogte kan sturen.",
          materials: "Geen",
          howToPlay: "Maak met je stem een glijbaan van laag naar hoog ('wiiieee!') terwijl je je baby of zijn handjes omhoog tilt, en weer omlaag.",
          funTwist: "Blaas zachte 'prrrr'-belletjes met je lippen en kijk of je baby het nadoet."
        },
        {
          id: "g-m3-ribbon",
          title: "Rammelaar-Sokjes aan de Enkels",
          category: "cognitive",
          duration: "6 min",
          energy: "medium",
          brainBenefit: "Leert je baby dat zijn eigen benen het geluid veroorzaken (oorzaak-gevolg).",
          materials: "Rammelsokje of zacht belletjesbandje om de sok",
          howToPlay: "Bevestig onder toezicht een zacht rammeltje aan één sokje. Zodra je baby trappelt, hoort hij direct muziek!",
          funTwist: "Wissel het rammeltje na 3 minuten naar het andere voetje."
        }
      ]
    },
    {
      id: "stage-m5",
      phaseIndex: 4,
      title: "Start Oefenhapjes, Rollen & Voetjes Pakken (4–5 mnd / Week 17–23)",
      shortLabel: "4–5 mnd",
      minWeek: 17,
      maxWeek: 23,
      ageRangeLabel: "Week 17 t/m 23 (4 tot 6 maanden)",
      heroEmoji: "🥄",
      cutType: "puree",
      summary: "Het oefenhapjes-window (4–6 mnd) is geopend! Je baby pakt de eigen tenen vast, rolt om en proeft dagelijks kleine lepeltjes gladde groente, fruit, pindakaas en ei naast de melk.",
      nutrition: {
        milkStatus: "Melk blijft de hoofdvoeding (4–6 voedingen) + 1 tot 2 gladde oefenhapjes",
        feedsPerDay: "4 tot 6 melkvoedingen + 1–2 kleine oefenhapjes",
        milkVolumeMetric: "150–200 ml per flesje (~750–900 ml/dag)",
        milkVolumeImperial: "5–6.5 oz per flesje (~25–30 oz/dag)",
        solidsPerDay: "1 tot 2 oefenhapjes per dag (van 1–2 theelepeltjes naar 2–3 eetlepels)",
        portionGuideMetric: "5–30 g (1–3 theelepeltjes bij 4 mnd → 2–3 eetlepels bij 5 mnd) gladde puree",
        portionGuideImperial: "1–3 tsp (4 mnd) tot 2–3 tbsp (5 mnd) gladde puree per keer",
        pureePath: "Start vanaf 4 maanden (week 17) met 1–2 theelepeltjes glad gepureerde zachte groente (wortel, pompoen, bloemkool, broccoli, courgette) en bouw in maand 5 op naar 2–3 eetlepels + vroege introductie van 100% pindakaas en geprakt ei.",
        blwPath: "Wacht met losse stukjes uit het vuistje (Rapley) tot je baby 6 maanden (week 24) is en stevig rechtop kan zitten. Laat je baby nu wel alvast een plat babylepeltje vasthouden aan tafel!",
        bestFoods: [
          { name: "Zachte Groentepuree (Wortel, Pompoen, Broccoli)", icon: "🥦", note: "Begin eerst 2 weken met zachte groenten om smaakgewenning op te bouwen vóór de echte maaltijden bij 6 maanden." },
          { name: "Avocado, Peer & Banaan (glad geprakt)", icon: "🥑", note: "Zacht, romig en rijk aan gezonde vetten en vezels." },
          { name: "Vroege Pinda & Ei introductie (door hapje)", icon: "🥜", note: "Advies CB/Voedingscentrum: roer tussen 4 en 6 mnd wekelijks gladde 100% pindakaas en fijngeprakt hardgekookt ei door een hapje om allergie te voorkomen." }
        ],
        avoidFoods: [
          "Geen losse stukjes voedsel (verslikkingsgevaar vóór 6 maanden)",
          "Geen honing, toegevoegd zout, suiker of gewone koemelk als drinken (honing is gevaarlijk onder 1 jaar)"
        ],
        sampleMenu: [
          "07:00 Melk • 10:00 Glad fruit-oefenhapje (+ 1/2 tl 100% pindakaas)",
          "11:00 Melk • 14:30 Melk • 17:00 Glad groente-oefenhapje (+ evt. geprakt ei) • 19:00 Avondmelk"
        ],
        recipes: [
          {
            title: "Eerste Fluweelzachte Wortel- of Pompoenhapje (Vanaf 4 mnd)",
            mealType: "warme-hap",
            prepTime: "5 min actief (+ 12 min stomen)",
            ingredients: ["250 g wortel of flespompoen", "2 el kookvocht of moedermelk/flesvoeding", "1 siliconen ijsblokjesvorm met deksel"],
            steps: "Stoom of kook de groente in 12 minuten boterzacht. Pureer helemaal glad met een beetje kookvocht of melk en vries in als ijsblokjes voor dagelijkse verse oefenhapjes."
          },
          {
            title: "Romige Banaan- of Peerpuree met 100% Pindakaas (Allergeen-Start)",
            mealType: "ontbijt",
            prepTime: "3 min",
            ingredients: ["1/2 rijpe banaan of zacht gestoomde peer", "1/2 tot 1 tl gladde 100% pindakaas (zonder zout/stukjes)", "1 el lauw water of melkvoeding"],
            steps: "Pureer of prak het fruit helemaal glad met de 100% pindakaas en een lepeltje warme melk of water tot yoghurtdikte."
          },
          {
            title: "Zijdezachte Ei-Avocado Mousse (IJzer & Vroege Ei-Introductie)",
            mealType: "lunch",
            prepTime: "4 min",
            ingredients: ["1/2 hardgekookt ei", "1/2 rijpe zachte avocado", "1–2 el warme moedermelk, flesvoeding of lauw water"],
            steps: "Prak of mix het nog warme hardgekookte ei samen met de rijpe avocado en een scheutje melk tot een gladde, romige mousse."
          },
          {
            title: "Zoete Aardappel, Broccoli & Courgette Fluweelpuree",
            mealType: "warme-hap",
            prepTime: "5 min actief",
            ingredients: ["1 kleine zoete aardappel", "4 roosjes broccoli of 1/2 courgette", "1 tl milde olijfolie & kookvocht"],
            steps: "Stoom de zoete aardappel en groente zacht en pureer helemaal glad met een druppel olijfolie en wat kookvocht."
          },
          {
            title: "Zachte Mango-Peer Zonneschijnhapje",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["4 blokjes rijpe mango (vers of ontdooid)", "1/2 zachte geschilde Conference peer"],
            steps: "Pureer de rijpe mango en zachte peer met de staafmixer in 60 seconden tot een fluweelzacht fruithapje vol vitamine C."
          },
          {
            title: "2-Minuten Fijne Haver- of Meergranen-Babypap met Perzik",
            mealType: "ontbijt",
            prepTime: "2 min",
            ingredients: ["100 ml warme moedermelk of zuigelingenvoeding", "1–2 el fijne haver- of meergranen-babypap (4–6 mnd, liever dan rijstebloem)", "2 el glad gepureerde perzik of peer"],
            steps: "Roer de fijne babygranen door de warme melk en schep er een lepeltje gladde fruitpuree door om van een plat babylepeltje te oefenen én voorzichtig aan gluten te wennen."
          }
        ]
      },
      healthCB: {
        cbVisit: "4 maanden & 5 maanden: Controle op het Consultatiebureau (groei, motoriek, start oefenhapjes en vroege introductie pinda/ei).",
        vaccines: "5 maanden: DKTP-Hib-HepB en Pneumokokken vaccinatie (volgens RVP-schema).",
        teeth: "Rond 5–6 maanden kunnen de eerste twee onderste snijtandjes al beginnen te schemeren!"
      },
      sleep: {
        totalSleep: "13 tot 14,5 uur per 24u",
        wakeWindow: "1,5 tot 2,25 uur (90–135 min)",
        naps: "3 slaapjes per dag (ochtend, middag, korte namiddag-powernap)",
        tip: "Rond 4 maanden rijpen de slaapcycli naar 45 minuten. Het derde slaapje aan het eind van de middag hoeft maar 30–40 minuten te duren tot bedtijd (19:00)."
      },
      milestones: [
        "Pakt de eigen voetjes vast en stopt tenen in de mond",
        "Geeft een speeltje over van de ene hand naar de andere en rolt om",
        "Draait het hoofd direct als je zijn of haar naam roept",
        "Hapt enthousiast naar het platte oefenlepeltje"
      ],
      tipsForMom: [
        "Begin bij oefenhapjes eerst met zachte groenten en geef oefenhapjes altijd NA een melkvoeding, wanneer je baby rustig en niet te hongerig is.",
        "Klaar voor echte stukjes bij 6 maanden? Check de 3 signalen: (1) Rechtop zitten in de kinderstoel, (2) Zelf naar eten reiken, (3) Eten niet meer automatisch met de tong naar buiten duwen."
      ],
      games: [
        {
          id: "g-m5-sock",
          title: "Felle sokjes van de voeten trekken",
          category: "motor",
          duration: "5 min",
          energy: "low",
          brainBenefit: "Traint de buikspieren die straks nodig zijn om los te zitten.",
          materials: "Felgekleurde sokjes",
          howToPlay: "Doe één opvallend sokje half over de tenen van je baby en moedig aan om het voetje te pakken en de sok uit te trekken!",
          funTwist: "Kietel zachtjes onder het voetje bij elke uitgetrokken sok."
        },
        {
          id: "g-m5-splash",
          title: "Waterspetteren op een bakplaat",
          category: "cognitive",
          duration: "8 min",
          energy: "medium",
          brainBenefit: "Zintuiglijke prikkeling en langere buikligging zonder moeite.",
          materials: "Bakplaat met opstaande rand + klein laagje lauw water + badspeeltjes",
          howToPlay: "Leg je baby op een handdoek op de buik voor de bakplaat en laat hem of haar lekker op het water slaan.",
          funTwist: "Leg een schijfje citroen of sinaasappel in het water om naar te grijpen."
        },
        {
          id: "g-m5-pass",
          title: "Van Handje naar Handje Doorgeef-Spel",
          category: "motor",
          duration: "5 min",
          energy: "low",
          brainBenefit: "Oefent het kruisen van de lichaamsmiddellijn en tweehandige coördinatie.",
          materials: "2 lichte ringen of zachte blokjes",
          howToPlay: "Geef je baby een speeltje in de rechterhand en bied een tweede speeltje weer aan de rechterkant aan: kijk hoe je baby het eerste speeltje overpakt naar links!",
          funTwist: "Wissel daarna van kant zodat beide handjes evenveel oefenen."
        },
        {
          id: "g-m5-name",
          title: "Waar komt mijn naam vandaan? (Koekoek-Roep)",
          category: "language",
          duration: "5 min",
          energy: "low",
          brainBenefit: "Versterkt naamherkenning en gerichte auditieve aandacht.",
          materials: "Geen",
          howToPlay: "Ga iets schuin achter of naast je baby zitten en roep op vrolijke zangerige toon zijn of haar naam. Draait je baby direct het hoofd? Geef een dikke glimlach!",
          funTwist: "Doe een hoedje of sjaaltje op als je baby zich omdraait."
        },
        {
          id: "g-m5-mirror",
          title: "Spiegel-Dubbelganger & Kusjes Geven",
          category: "social",
          duration: "6 min",
          energy: "low",
          brainBenefit: "Bouwt sociaal bewustzijn en gedeelde aandacht op.",
          materials: "Grote spiegel in de badkamer of slaapkamer",
          howToPlay: "Houd je baby op de arm voor de grote spiegel, wijs naar jezelf ('Daar is mama!') en naar je baby, en laat je baby tegen het spiegelbeeld tikken.",
          funTwist: "Geef een kusje op het wangetje in de spiegel."
        },
        {
          id: "g-m5-book",
          title: "Knisper- & Voelboekje Samen Omslaan",
          category: "language",
          duration: "6 min",
          energy: "low",
          brainBenefit: "Prikkelt woordbegrip en leert hoe een boekje werkt.",
          materials: "Stoffen knisperboekje of dik kartonboekje",
          howToPlay: "Zet je baby op schoot, wijs naar één groot plaatje per bladzijde ('Kijk, de gele eend: kwak-kwak!') en laat je baby helpen de bladzijde om te duwen.",
          funTwist: "Maak bij elk dier een grappig dierengeluid."
        }
      ]
    },
    {
      id: "stage-m6-7",
      phaseIndex: 5,
      title: "Start Vaste Maaltijden & Rapley (Maand 6–7 / Week 24–30)",
      shortLabel: "6–7 mnd",
      minWeek: 24,
      maxWeek: 30,
      ageRangeLabel: "Week 24 t/m 30 (Maand 6–7)",
      heroEmoji: "🥑",
      cutType: "spear",
      summary: "Het grote eet-avontuur! Je baby zit in de kinderstoel, krijgt ijzerrijke hapjes (puree én/of vuistgrote Rapley-repen) en oefent met slokjes water.",
      nutrition: {
        milkStatus: "4–5 melkvoedingen (Opvolgmelk nr. 2 of Borstvoeding) + 2 vaste hapjes",
        feedsPerDay: "4 tot 5 melkvoedingen + 1 fruitmoment + 1 warme maaltijd",
        milkVolumeMetric: "150–200 ml per flesje (~650–800 ml/dag) + slokjes water",
        milkVolumeImperial: "5–6.5 oz per flesje (~22–27 oz/dag) + slokjes water",
        solidsPerDay: "2 maaltijden per dag (opbouwen naar 3–4 eetlepels per keer)",
        portionGuideMetric: "40–75 g (3 tot 4 eetlepels) per maaltijd",
        portionGuideImperial: "1.5–2.5 oz (3 tot 4 tbsp) per maaltijd",
        pureePath: "Maak groentehapjes nu een echte maaltijd: combineer groente + aardappel/rijst/pasta + 1 eetlepel vlees, vis, ei of peulvruchten + een theelepeltje olijfolie of zachte margarine.",
        blwPath: "Rapley-methode: Snijd zachte groente (gestoomde stronkjes broccoli, zoete aardappel, avocado) in repen ter grootte van een volwassen vinger, zodat de helft boven het vuistje uitsteekt! Check altijd of je het makkelijk tussen duim en wijsvinger kunt pletten.",
        bestFoods: [
          { name: "IJzerrijk: Rundvlees, Kip, Ei of Linzen", icon: "🥩", note: "Na 6 maanden slinkt de aangeboren ijzervoorraad; geef dagelijks ijzerrijke voeding." },
          { name: "Broccoli-roosjes & Zoete Aardappel-repen", icon: "🥦", note: "Het steeltje van de broccoli is een ideaal handvat voor kleine babyhandjes." },
          { name: "Lichtbruin Broodkorstje of Pap", icon: "🍞", note: "Vanaf 6–7 maanden heerlijk om op te sabbelen met zachte margarine of dun pindakaas." }
        ],
        avoidFoods: [
          "Geen honing (onder 1 jaar gevaar op infantiel botulisme!)",
          "Geen toegevoegd zout, suiker, smeerleverworst of rauw vlees, vis en ei (belastend voor de nieren en kans op infectie)",
          "Geen hele noten, hele druiven of rauwe harde wortel en appel (verslikkingsgevaar)"
        ],
        sampleMenu: [
          "07:00 Borstvoeding of fles (180 ml)",
          "09:30 Fruit (geprakt of zachte reepjes banaan/peer) + slokjes water",
          "12:00 Broodkorstje of pap + melkvoeding",
          "17:00 Warme hap: groente + aardappel + vlees/ei/linzen + 1 tl olie",
          "19:00 Avondvoeding melk"
        ],
        recipes: [
          {
            title: "IJzerrijke Zoete-Aardappel, Broccoli & Rode Linzen Stoof",
            mealType: "warme-hap",
            prepTime: "5 min voorbereiding (+ 12 min koken)",
            ingredients: ["1 zoete aardappel", "100 g broccoli-roosjes", "40 g rode splitlinzen (of rundergehakt)", "1 tl milde olijfolie"],
            steps: "Kook de zoete aardappel en rode linzen in 12 min gaar en stoom de broccoli mee. Prak met 1 tl olijfolie óf geef de grote stronkjes broccoli en repen zoete aardappel los voor het vuistje!"
          },
          {
            title: "Rapley Omelet-Reepjes met Avocado-vingers",
            mealType: "lunch",
            prepTime: "4 min",
            ingredients: ["1 ei", "1 el melk", "1/2 rijpe avocado in repen", "1 tl ongezouten roomboter of olijfolie"],
            steps: "Klop het ei los met een scheutje melk, bak een dunne omelet aan beide kanten goed gaar en snijd in vingerlange repen van 2 cm breed. Serveer met repen avocado."
          },
          {
            title: "Fijne Havermoutpap met Banaan & 100% Pindakaas",
            mealType: "ontbijt",
            prepTime: "4 min",
            ingredients: ["2 el fijne havermout", "100 ml opvolgmelk of water", "1/2 geprakte banaan", "1 tl gladde 100% pindakaas"],
            steps: "Kook de fijne havermout in 3 minuten zacht, roer de geprakte banaan en de pindakaas erdoor en laat afkoelen tot lauwwarm."
          },
          {
            title: "Zachte Zalm, Courgette & Aardappel Prak/Stick",
            mealType: "warme-hap",
            prepTime: "5 min actief",
            ingredients: ["40 g verse zalmfilet (zonder graat)", "1/2 courgette", "1 kleine aardappel", "Snufje dille & 1 tl olijfolie"],
            steps: "Stoom of pocheer de zalm, courgette en aardappel in 8–10 minuten gaar. Prak grof met olijfolie en dille, of geef als zachte vuistgrote stukken."
          },
          {
            title: "Sabbel-Broodkorstje met Gepureerde Aardbei-Avocado",
            mealType: "lunch",
            prepTime: "2 min",
            ingredients: ["1 kapje of korstje lichtbruin brood", "3 rijpe aardbeien", "1/4 avocado"],
            steps: "Prak de aardbeien met de avocado en dip het broodkorstje erin zodat je baby heerlijk kan sabbelen en de kaakspieren traint."
          },
          {
            title: "Warme Appel-Kaneel Stoofreepjes (Rapley & Puree)",
            mealType: "tussendoor",
            prepTime: "5 min",
            ingredients: ["1 zoete appel (geschild, in dikke parten)", "2 el water", "Snufje Ceylon kaneel"],
            steps: "Stoof de appelparten met 2 el water en een snufje kaneel in 4–5 minuten met het deksel op de pan tot je ze makkelijk tussen twee vingers kunt pletten."
          }
        ]
      },
      healthCB: {
        cbVisit: "6 maanden & 7,5 maand: Controle op het Consultatiebureau (groei, motoriek en bijvoeding).",
        vaccines: "Geen standaard vaccinaties in maand 6–7.",
        teeth: "De twee onderste middelste snijtanden komen meestal door tussen 6 en 8 maanden. Een gekoelde bijtring verzacht het tandvlees!"
      },
      sleep: {
        totalSleep: "13 tot 14,5 uur per 24u",
        wakeWindow: "2 tot 2,5 uur",
        naps: "Overgang van 3 naar 2 slaapjes per dag",
        tip: "Zorg voor een voetenplankje onder de kinderstoel zodat je baby stevig en veilig kan slikken."
      },
      milestones: [
        "Zit rechtop in de kinderstoel (met lichte steun)",
        "Pakt grote stukken eten met de hele handpalm en brengt ze naar de mond",
        "Rolt vlot beide kanten op en draait om de as op de buik",
        "Brabbelt reeksen medeklinkers ('ba-ba', 'da-da')"
      ],
      tipsForMom: [
        "Verschil tussen kokhalzen en stikken: bij kokhalzen maakt je baby geluid en werkt de tong het stukje zelf naar voren—grijp niet met je vingers in de mond, maar blijf rustig kijken.",
        "Vitamine C uit groente en fruit helpt het lichaam om ijzer uit brood en peulvruchten 3x beter op te nemen."
      ],
      games: [
        {
          id: "g-m6-peek",
          title: "Kiekeboe & Speeltje onder de doek",
          category: "cognitive",
          duration: "5–10 min",
          energy: "low",
          brainBenefit: "Leert objectpermanentie: dingen bestaan nog steeds als je ze even niet ziet.",
          materials: "Rammelaar + theedoek",
          howToPlay: "Verstop een speeltje half onder een doek terwijl je baby kijkt en vraag: 'Waar is de bal nou?'",
          funTwist: "Laat je baby de doek ook van jouw hoofd aftrekken!"
        },
        {
          id: "g-m6-drum",
          title: "Pollepel & Beslagkom Drumband",
          category: "motor",
          duration: "8 min",
          energy: "medium",
          brainBenefit: "Versterkt de zitbalans en het ritmegevoel.",
          materials: "Omgekeerde plastic kom + houten of siliconen lepel",
          howToPlay: "Tik samen een ritme op de kom: drie keer hard ('Boem boem boem!') en drie keer zachtjes kriebelen.",
          funTwist: "Zing 'In de Maneschijn' met grote handgebaren."
        },
        {
          id: "g-m6-drop",
          title: "Het Grote 'Boem-Valt-Niks!'-Zwaartekrachtspel",
          category: "cognitive",
          duration: "8 min",
          energy: "low",
          brainBenefit: "Leert afstand, diepte en dat vallende dingen niet voorgoed verdwijnen.",
          materials: "Kinderstoel + 3 verschillende veilige voorwerpen (spons, plastic beker, houten lepel)",
          howToPlay: "Bind eventueel een kort lintje aan een speeltje aan het blad van de kinderstoel. Laat je baby het over de rand duwen en ontdek samen hoe elk voorwerp een ander geluid maakt!",
          funTwist: "Zeg elke keer met grote ogen 'O-oh... BOEM!' voordat je het samen ophaalt."
        },
        {
          id: "g-m6-baba",
          title: "Medeklinker-Echo ('Ba-ba, Ma-ma, Da-da')",
          category: "language",
          duration: "5 min",
          energy: "low",
          brainBenefit: "Stimuleert de mondmotoriek en het vormen van eerste lettergrepen.",
          materials: "Geen",
          howToPlay: "Zit recht tegenover je baby zodat hij je lippen goed ziet en maak ritmische klanken: 'Ba-ba-ba!' of 'Pa-pa-pa!'. Wacht en luister welke klank je baby teruggeeft.",
          funTwist: "Tik zachtjes met je vinger op je eigen lippen terwijl je 'b-b-b' zegt."
        },
        {
          id: "g-m6-tissue",
          title: "Toverdoos met Sjaaltjes Uittrekken",
          category: "motor",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Traint grijpkracht, polsbeweging en nieuwsgierigheid.",
          materials: "Lege billendoekjes-verpakking of tissuedoos + 5 schone spuugdoekjes/sokjes",
          howToPlay: "Stop gekleurde doekjes of sokjes in een lege doekjesdoos met het eerste puntje omhoog en laat je baby ze er één voor één uittrekken.",
          funTwist: "Knoop twee dunne sjaaltjes aan elkaar voor een 'eindeloze' sliert!"
        },
        {
          id: "g-m6-row",
          title: "Samen 'Schuitje Varen' op Schoot",
          category: "social",
          duration: "5 min",
          energy: "low",
          brainBenefit: "Geeft voorspelbare sociale interactie, oogcontact en evenwichtsgevoel.",
          materials: "Geen",
          howToPlay: "Zet je baby op je bovenbenen met het gezicht naar jou toe, houd de handjes vast en wieg zachtjes naar voren en achteren terwijl je 'Schuitje varen, theetje drinken' zingt.",
          funTwist: "Vertraag bij het laatste zinnetje en eindig met een dikke knuffel."
        }
      ]
    },
    {
      id: "stage-m8-9",
      phaseIndex: 6,
      title: "Pincetgreep, Brood & Kruipen (Maand 8–9 / Week 31–39)",
      shortLabel: "8–9 mnd",
      minWeek: 31,
      maxWeek: 39,
      ageRangeLabel: "Week 31 t/m 39 (Maand 8–9)",
      heroEmoji: "🍞",
      cutType: "pincer",
      summary: "Je baby tijgert of kruipt de kamer rond, pakt kleine blokjes brood tussen duim en wijsvinger en eet grovere maaltijden.",
      nutrition: {
        milkStatus: "3 melkvoedingen (~500–600 ml/dag) + 3 vaste eetmomenten",
        feedsPerDay: "3 melkvoedingen + ontbijt/lunch met brood + fruit + warme maaltijd",
        milkVolumeMetric: "150–200 ml per keer (~500–600 ml/dag) + 100 ml water/thee",
        milkVolumeImperial: "5–6.5 oz per keer (~17–20 oz/dag) + 3–4 oz water",
        solidsPerDay: "3 maaltijden + 1 tussendoortje",
        portionGuideMetric: "75–120 g warme maaltijd + 1 sneetje brood + 1 portie fruit",
        portionGuideImperial: "3–4 oz warme maaltijd + 1 sneetje brood + fruit",
        pureePath: "Prak het eten nu grof met een vork in plaats van de staafmixer! Zo leert je baby kauwbewegingen maken.",
        blwPath: "De pincetgreep is er! Geef kleine zachte blokjes brood (1x1 cm) met margarine/pindakaas, platgedrukte blauwe bessen, zachte pastaspiraaltjes en stukjes roerei.",
        bestFoods: [
          { name: "Lichtbruin Brood in stukjes", icon: "🍞", note: "Besmeer met zachte halvarine/margarine, 100% pindakaas, geprakte avocado of banaan." },
          { name: "Geplette Blauwe Bessen & Frambozen", icon: "🍓", note: "Plet ronde bessen altijd even plat zodat ze veilig zijn én makkelijk te pakken met de pincetgreep." },
          { name: "Zalmvlokken, Ei of Kikkererwten", icon: "🐟", note: "Omega-3 vetzuren uit vette vis ondersteunen de kruip- en taalontwikkeling." }
        ],
        avoidFoods: [
          "Geen hele druiven, cherrytomaatjes of ongeplette bessen (altijd in vieren snijden of pletten tegen verslikken)",
          "Geen honing, smeerkaas, leverpastei of gewone koemelk als hoofdvoeding (onder 1 jaar niet geschikt)"
        ],
        sampleMenu: [
          "07:30 Pap of sneetje brood + melkvoeding",
          "10:00 Vers fruit + bekertje water of slappe lauwe thee",
          "12:30 1 sneetje lichtbruin brood in blokjes + melkvoeding",
          "17:30 Geprakte groente, aardappel/pasta en stukjes vis/kip/ei",
          "19:00 Laatste melkvoeding voor het slapen"
        ],
        recipes: [
          {
            title: "5-Minuten Banaan-Ei-Havermout Pannenkoekjes",
            mealType: "ontbijt",
            prepTime: "5 min",
            ingredients: ["1 rijpe banaan", "1 ei", "2 el fijne havermout", "1 tl olijfolie of boter om in te bakken"],
            steps: "Prak de banaan met het ei en de havermout in een kommetje. Bak op laag vuur kleine pannenkoekjes aan beide kanten goudbruin en snijd in reepjes of blokjes van 1x1 cm."
          },
          {
            title: "Pincetgreep Brood-Soldaatjes Driekleuren (Pinda, Avocado & Aardbei)",
            mealType: "lunch",
            prepTime: "3 min",
            ingredients: ["1 sneetje lichtbruin brood", "1 tl 100% pindakaas", "1/4 geprakte avocado", "2 geprakte aardbeien"],
            steps: "Snijd de korstjes smal af en beleg drie stroken van de boterham met pindakaas, avocado en aardbei. Snijd in blokjes van 1×1 cm om zelf met duim en wijsvinger te pakken."
          },
          {
            title: "Zachte Couscous met Pompoen, Courgette & Kikkererwten",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["3 el volkoren couscous", "50 g zachte pompoen- of courgetteblokjes", "2 el zachte kikkererwten (geplet!)", "1 tl olijfolie"],
            steps: "Schenk kokend water over de couscous (staat in 3 min klaar), roer de gestoomde groente en tussen je vingers geplette kikkererwten erdoor met 1 tl olijfolie."
          },
          {
            title: "Romige Roerei-Vlinders met Zachte Tomaat",
            mealType: "lunch",
            prepTime: "4 min",
            ingredients: ["1 ei", "1 el melk", "1/2 rijpe tomaat (ontveld en in kleine blokjes)", "1 tl ongezouten roomboter"],
            steps: "Roerbak het ei met de melk en tomaatblokjes in 2 minuten op zacht vuur tot zachte roerei-stukjes die je baby zo met de vingertjes kan oppakken."
          },
          {
            title: "Volle Yoghurt Swirl met Geplette Blauwe Bessen & Havermout",
            mealType: "tussendoor",
            prepTime: "2 min",
            ingredients: ["3 el ongezoete volle yoghurt", "10 blauwe bessen (even platgedrukt)", "1 el fijne havermoutvlokken"],
            steps: "Druk de blauwe bessen plat met een vork en roer ze met een lepeltje havermout door de volle yoghurt. Dik genoeg om samen met een babylepeltje te oefenen!"
          },
          {
            title: "Zalm-Aardappel-Doperwtjes Prakje met Dille",
            mealType: "warme-hap",
            prepTime: "5 min actief",
            ingredients: ["40 g gestoomde of gebakken zalmfilet", "1 kruimige aardappel", "2 el doperwtjes", "1 tl zachte margarine of olijfolie"],
            steps: "Prak de gekookte aardappel en doperwtjes grof met een vork en vlok de zachte zalm erdoorheen. Vol ijzer en omega-3 voor kruipende baby's!"
          }
        ]
      },
      healthCB: {
        cbVisit: "9 maanden: Afspraak op het Consultatiebureau (indien gewenst of op indicatie).",
        vaccines: "Geen prikken bij 8–9 maanden.",
        teeth: "De twee bovenste middelste voortanden komen vaak door rond 8–10 maanden. Poets vanaf het 1e tandje 1x per dag met peutertandpasta!"
      },
      sleep: {
        totalSleep: "13 tot 14 uur per 24u",
        wakeWindow: "2,5 tot 3,5 uur (2-3-4 ritme: 2u, 3u en 3,5u wakker)",
        naps: "2 vaste slaapjes per dag",
        tip: "Gaat je baby ineens staan in bed? Oefen overdag 15 keer hoe je vanuit staan weer op je billen gaat zitten!"
      },
      milestones: [
        "Pakt kleine stukjes eten tussen duim en wijsvinger (pincetgreep)",
        "Tijgert of kruipt op handen en knieën en trekt zich op tot stand",
        "Zwaait 'dag-dag' en klapt in de handjes",
        "Drinkt slokjes uit een open beker of rietjesbeker"
      ],
      tipsForMom: [
        "Je baby heeft géén kiezen nodig om zacht brood en stukjes groente te kauwen: de kaken zijn sterk genoeg om zacht eten te malen.",
        "Maak een kruipveilige woonkamer op ooghoogte: stopcontacten beveiligen en losse snoeren wegwerken geeft jou rust."
      ],
      games: [
        {
          id: "g-m8-muffin",
          title: "Muffinvorm Pincet-Schatzoeken",
          category: "motor",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Traint de fijne motoriek van duim en wijsvinger.",
          materials: "Muffinbakvorm + stukjes fruit/maisvingers of balletjes",
          howToPlay: "Leg in elk vakje van een muffinvorm een klein hapje of een balletje en laat je baby elk vakje leegvissen.",
          funTwist: "Plak een stukje schilderstape over een vakje dat je baby los mag peuteren."
        },
        {
          id: "g-m8-tunnel",
          title: "Bankkussen Kruip-Berg",
          category: "motor",
          duration: "10 min",
          energy: "high",
          brainBenefit: "Versterkt bilaterale kruislingse motorische coördinatie, rompstabiliteit en dieptezicht.",
          materials: "2 of 3 bankkussens op het vloerkleed",
          howToPlay: "Leg kussens op de grond en lok je baby om over de 'berg' heen naar jou toe te kruipen.",
          funTwist: "Maak een kiekeboe-tunneltje met een laken over twee eetkamerstoelen."
        },
        {
          id: "g-m8-cups",
          title: "Onder Welk Bekertje Zit het Blokje?",
          category: "cognitive",
          duration: "8 min",
          energy: "low",
          brainBenefit: "Versterkt het visuele werkgeheugen, objectpermanentie en categorie-denken.",
          materials: "2 ondoorzichtige plastic bekertjes + 1 kleurrijk blokje",
          howToPlay: "Verstop het blokje onder één van de twee bekertjes terwijl je baby kijkt en vraag: 'Waar is het blokje gebleven?'",
          funTwist: "Wissel de bekertjes één keer langzaam van plek als je baby het doorheeft."
        },
        {
          id: "g-m8-clap",
          title: "Klap-eens-in-de-Handjes & Dag-Dag Zwaaien",
          category: "social",
          duration: "5 min",
          energy: "low",
          brainBenefit: "Leert sociale gebaren imiteren en samen plezier delen.",
          materials: "Geen",
          howToPlay: "Zing langzaam 'Klap eens in je handjes, blij, blij, blij' en doe de gebaren groot voor (klappen, handjes op het bolletje, zwaaien).",
          funTwist: "Zwaai samen naar de poes, een knuffel of papa bij de deur."
        },
        {
          id: "g-m8-soundbox",
          title: "De Dierengeluiden-Mand",
          category: "language",
          duration: "8 min",
          energy: "low",
          brainBenefit: "Koppelt woorden en klanken aan herkenbare voorwerpen.",
          materials: "Mandje met 4 knuffeldieren of plastic diertjes",
          howToPlay: "Haal één voor één een dier uit het mandje ('Kijk, de koe! Boeeee!') en laat je baby het volgende dier uit het mandje pakken.",
          funTwist: "Vraag: 'Waar is de hond? Woef-woef!' en kijk of je baby ernaar kijkt of reikt."
        },
        {
          id: "g-m8-ballroll",
          title: "Samen de Bal Heen-en-Weer Rollen",
          category: "social",
          duration: "8 min",
          energy: "low",
          brainBenefit: "Oefent beurtwisseling ('Nu jij, nu ik!') en zitbalans.",
          materials: "Zachte bal",
          howToPlay: "Ga met gespreide benen tegenover je zittende baby op de grond zitten en rol een zachte bal rustig naar zijn buikje en handjes.",
          funTwist: "Moedig je baby aan om de bal een duwtje terug te geven."
        }
      ]
    },
    {
      id: "stage-m10-12",
      phaseIndex: 7,
      title: "Langslopen, Eerste Woordjes & Tafelpot (Maand 10–12 / Week 40–52)",
      shortLabel: "10–12 mnd",
      minWeek: 40,
      maxWeek: 52,
      ageRangeLabel: "Week 40 t/m 52 (Maand 10–12)",
      heroEmoji: "🚶",
      cutType: "pincer",
      summary: "Bijna 1 jaar! Je baby stapt langs de bank, wijst naar alles wat interessant is, zegt de eerste woordjes en eet bijna volledig mee met het gezin (zonder zout).",
      nutrition: {
        milkStatus: "2 tot 3 melkvoedingen (~400–500 ml) + 3 hoofdmaaltijden",
        feedsPerDay: "3 maaltijden + 1–2 tussendoortjes + 2–3 melkmomenten",
        milkVolumeMetric: "~400–500 ml melk per dag + 150–200 ml water",
        milkVolumeImperial: "~14–17 oz melk per dag + 5–7 oz water",
        solidsPerDay: "3 maaltijden + 1–2 tussendoortjes",
        portionGuideMetric: "100–150 g avondeten (3–4 el groente, 2–3 el aardappel/pasta, 1–2 el vlees/vis/vega)",
        portionGuideImperial: "3.5–5 oz avondeten + 1–2 sneetjes brood overdag",
        pureePath: "Schep voor je baby een portie van jullie eigen avondeten uit de pan VÓÓR je zout toevoegt en snijd het in kleine hapklare stukjes.",
        blwPath: "Geef een klein babylepeltje om zelf te oefenen met scheppen in dikke yoghurt of stamppot, en laat lekker zelf eten met de handjes.",
        bestFoods: [
          { name: "Pasta, Rijst & Stamppot (zonder zout)", icon: "🍝", note: "Gezinsmaaltijd met zachte groente, aardappel of volkoren pasta gekruid met knoflook, paprikapoeder of Italiaanse kruiden." },
          { name: "Volkoren / Bruin Brood (1–2 sneetjes)", icon: "🥪", note: "Met 100% notenpasta, hüttenkäse, ei, geprakte aardbei of zachte margarine." },
          { name: "Volle Yoghurt als toetje", icon: "🥣", note: "Een schaaltje ongezoete yoghurt bereidt de overgang naar gewone zuivel bij 1 jaar voor." }
        ],
        avoidFoods: [
          "Nog steeds géén honing (wacht tot na de 1e verjaardag i.v.m. infantiel botulisme)",
          "Geen hele noten, popcorn, rauwe harde wortel of ongesneden druiven en tomaatjes (verslikkingsgevaar)"
        ],
        sampleMenu: [
          "07:30 1 sneetje bruin brood + beker/fles melk (150 ml)",
          "10:00 Stukjes vers fruit + water",
          "12:30 1 sneetje brood met ei of pindakaas + melk (150 ml)",
          "15:00 Komkommer/tomaat (in vieren) of maisvinger + water",
          "17:30 Mee-eten met de pot (zonder zout) + klein schaaltje yoghurt"
        ],
        recipes: [
          {
            title: "Zoutarme Gezinspasta met Courgette, Tomaat & Zalm/Kip",
            mealType: "warme-hap",
            prepTime: "5 min snijden (+ 10 min koken)",
            ingredients: ["Volkoren fusilli (spiraalpasta)", "1 courgette in kleine blokjes", "Gezeefde tomaten (passata zonder zout)", "Zalmfilet of kipfilet + Italiaanse kruiden"],
            steps: "Kook de spiraalpasta zacht en stoof de courgette, passata, knoflook en kruiden met stukjes vis of kip. Schep het babyportie op vóór je zout of kaas voor de volwassenen toevoegt."
          },
          {
            title: "5-Minuten Volkoren Wentelteefjes-Blokjes met Kaneel & Fruit",
            mealType: "ontbijt",
            prepTime: "5 min",
            ingredients: ["1 sneetje bruin of volkorenbrood", "1 ei", "2 el melk + snufje kaneel", "Handje zachte frambozen of aardbeien"],
            steps: "Klop het ei met de melk en kaneel los, wentel het brood erdoor en bak aan beide kanten goudbruin. Snijd in hapklare blokjes en serveer met zacht fruit."
          },
          {
            title: "Brood-Rolletjes ('Baby-Sushi') met Hüttenkäse & Avocado",
            mealType: "lunch",
            prepTime: "4 min",
            ingredients: ["1 vers sneetje bruin brood (zonder korst)", "1 el hüttenkäse (cottage cheese)", "1/4 rijpe avocado", "Snufje milde paprikapoeder"],
            steps: "Rol het sneetje brood plat met een deegroller of glas, besmeer met geprakte avocado en hüttenkäse, rol strak op en snijd in 6 hapklare 'sushi-rolletjes'."
          },
          {
            title: "Snelle Spinazie-Aardappel-Ei Stamppot (Plakt goed aan de lepel!)",
            mealType: "warme-hap",
            prepTime: "5 min actief",
            ingredients: ["1 grote kruimige aardappel", "2 flinke handen verse bladspinazie", "1 hardgekookt ei", "1 tl ongezouten roomboter"],
            steps: "Stamp de gekookte aardappel met de rauwe fijngesneden spinazie en roomboter zodat de spinazie direct slinkt. Prak het gekookte ei erdoor: ideaal om zelf met een babylepel te scheppen!"
          },
          {
            title: "3-Minuten Appel-Kaneel Havermoutpap",
            mealType: "ontbijt",
            prepTime: "3 min",
            ingredients: ["3 el fijne havermout", "120 ml melkvoeding of water", "1/2 fijn geraspte zoete appel", "1 tl 100% amandel- of pindakaas"],
            steps: "Verwarm de havermout met de fijn geraspte appel en melk 3 minuten in een pannetje en roer de notenpasta erdoor."
          },
          {
            title: "Middag-Proefbordje: Komkommer-sterretjes, Tomaat & Zuivelspread",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["4 dikke plakken geschilde komkommer (zacht middenstuk)", "4 cherrytomaatjes (in de lengte in kwarten!)", "1 maisvinger", "1 el zuivelspread om te dippen"],
            steps: "Leg alles overzichtelijk op het blad van de kinderstoel zodat je baby zelf kan oefenen met dippen en prikken."
          }
        ]
      },
      healthCB: {
        cbVisit: "Rond 11–12 maanden: Belangrijke afspraak op het Consultatiebureau rond de eerste verjaardag.",
        vaccines: "Rond 12 maanden (voorheen 11 mnd): DKTP-Hib-HepB en Pneumokokken boosterprik (volgens het vernieuwde RIVM RVP-schema).",
        teeth: "De zijdelingse snijtanden boven en onder komen door (vaak 6 tot 8 tandjes rond de 1e verjaardag)."
      },
      sleep: {
        totalSleep: "12,5 tot 14 uur per 24u",
        wakeWindow: "3 tot 4 uur",
        naps: "2 slaapjes per dag (ochtend en middag)",
        tip: "Weigert je baby rond 11 maanden soms het middagdutje? Kort het ochtenddutje in tot max. 60 minuten; 1 dutje is meestal pas vanaf 14–16 maanden genoeg."
      },
      milestones: [
        "Stapt zijwaarts langs de bank of salontafel",
        "Wijst met het wijsvingertje om dingen aan jou te laten zien",
        "Zegt 1 tot 3 herkenbare woordjes ('mama', 'papa', 'bal', 'die')",
        "Stopt blokjes in een doosje en haalt ze er weer uit"
      ],
      tipsForMom: [
        "Veeg het gezicht en de handjes pas aan het EINDE van de maaltijd schoon met een warm washandje—tussendoor poetsen zorgt vaak voor frustratie aan tafel!",
        "Bouw de zuigfles rustig af richting de 1e verjaardag en bied melk aan uit een open beker of rietjesbeker."
      ],
      games: [
        {
          id: "g-m10-post",
          title: "Blokjes door de gleuf ('Brievenbus')",
          category: "cognitive",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Oefent precisie, ruimtelijk passen en polsrotatie.",
          materials: "Leeg yoghurt- of havermoutbakje met een gat in het deksel + blokjes",
          howToPlay: "Laat zien hoe je een blokje door het gat duwt ('Ploep!') en maak daarna samen het deksel open.",
          funTwist: "Tel hardop mee: 'Één... twee... drie... daar gaat-ie!'"
        },
        {
          id: "g-m10-point",
          title: "Aanwijs-Safari door het huis",
          category: "language",
          duration: "8 min",
          energy: "low",
          brainBenefit: "Samen naar hetzelfde kijken en benoemen versnelt de taalontwikkeling.",
          materials: "Geen",
          howToPlay: "Loop met je baby op de arm langs het raam of door de kamer. Alles waar je baby naar wijst benoem je enthousiast met een geluid erbij!",
          funTwist: "Vraag voor de spiegel: 'Waar is je neus? En waar is mama's neus?'"
        },
        {
          id: "g-m10-cruise",
          title: "Schat-Etalage Langs de Bank (Zijwaarts Stappen)",
          category: "motor",
          duration: "10 min",
          energy: "high",
          brainBenefit: "Traint gewichtsverplaatsing van voet naar voet voor het leren lopen.",
          materials: "3 favoriete speeltjes op de zitting van de bank",
          howToPlay: "Zet drie leuke speeltjes met steeds 40 cm tussenruimte op de bank zodat je baby zich optrekt en zijwaarts van speeltje naar speeltje stapt.",
          funTwist: "Zet het laatste speeltje op de salontafel vlak naast de bank om het oversteken te oefenen."
        },
        {
          id: "g-m10-tower",
          title: "Samen Toren Bouwen & 'BOEM!' Omgooien",
          category: "social",
          duration: "8 min",
          energy: "low",
          brainBenefit: "Oefent samenwerken, anticipatie en ruimtelijk inzicht.",
          materials: "Zachte blokken of plastic bekers",
          howToPlay: "Stapel 4 blokken op elkaar terwijl je spannend telt en laat je baby de toren met één zwaai omgooien.",
          funTwist: "Geef je baby één blokje in de hand en help hem het bovenop jouw blokje te zetten."
        },
        {
          id: "g-m10-whisk",
          title: "Pompons of Sokjes uit een Garde Peuteren",
          category: "motor",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Uitdagende fijne motoriek en probleemoplossend denken.",
          materials: "Keukengarde + 3 opgerolde babysokjes of grote sponzen",
          howToPlay: "Stop schone opgerolde babysokjes tussen de draden van een keukengarde en laat je baby ontdekken hoe hij ze eruit kan trekken.",
          funTwist: "Laat je baby de sokjes daarna weer in een kommetje stoppen."
        },
        {
          id: "g-m10-phone",
          title: "Hallo? Wie is daar aan de Telefoon?",
          category: "social",
          duration: "6 min",
          energy: "low",
          brainBenefit: "Stimuleert eerste rollenspel en sociaal brabbelen.",
          materials: "Speelgoedtelefoon, banaan of blokje als 'telefoon'",
          howToPlay: "Houd een blokje of banaan tegen je oor ('Tringgg! Hallo oma!') en geef hem daarna aan je baby: 'Het is voor jou!'",
          funTwist: "Laat oma of papa op luidspreker écht even terugzeggen: 'Dag lieverd!'"
        }
      ]
    },
    {
      id: "stage-m12-15",
      phaseIndex: 8,
      title: "Jonge Dreumes: Los Lopen & Eigen Lepel (12–15 mnd / Week 53–65)",
      shortLabel: "12–15 mnd",
      minWeek: 53,
      maxWeek: 65,
      ageRangeLabel: "Maand 12 t/m 15 (Week 53–65 • 1 jaar)",
      heroEmoji: "👟",
      cutType: "quarters",
      summary: "Officieel een dreumes! De eerste losse stapjes, gewone melk uit een beker, zelf scheppen met een lepel en een wisselende eetlust.",
      nutrition: {
        milkStatus: "Borstvoeding op verzoek óf ~300 ml gewone halfvolle melk/yoghurt per dag",
        feedsPerDay: "3 hoofdmaaltijden + 2 gezonde tussendoortjes",
        milkVolumeMetric: "300 ml halfvolle zuivel (max 450 ml!) + 450–700 ml water/thee per dag",
        milkVolumeImperial: "10 oz zuivel (max 15 oz!) + 15–24 oz water per dag",
        solidsPerDay: "3 maaltijden + 2 tussendoortjes",
        portionGuideMetric: "Avondeten: 2–3 el groente (50–75 g) + 2 el aardappel/volkoren pasta + 1 el vlees/vis/peulvrucht",
        portionGuideImperial: "Avondeten: ~4–5 oz totaal + 2–3 sneetjes volkorenbrood overdag",
        pureePath: "Alles met de pot mee! Dikkere gerechten zoals stamppot, havermout en halfvolle kwark of yoghurt blijven goed aan een kinderlepel plakken zodat je dreumes zelf kan scheppen.",
        blwPath: "Geef een kort kinderlepeltje én een klein kindervorkje om stukjes mee aan te prikken. Blijf ronde voeding (druiven, tomaatjes) in de lengte snijden.",
        bestFoods: [
          { name: "Volkorenbrood (2–3 sneetjes/dag)", icon: "🍞", note: "Vezels en jodium voor de groei; besmeer met halvarine en gezond beleg." },
          { name: "Dip-groenten met Hummus of Zuivelspread", icon: "🥒", note: "Dreumesen zijn dol op zelf dippen met komkommer of zachte wortel." },
          { name: "Halfvolle Melk & Yoghurt (300 ml totaal)", icon: "🥛", note: "Genoeg voor calcium; geef niet te veel melk zodat er trek blijft in ijzerrijk eten." }
        ],
        avoidFoods: [
          "Niet meer dan 450 ml zuivel per dag (remt de ijzeropname en vult het maagje te veel)",
          "Geen hele noten, hele druiven, popcorn of rauwe vleeswaren zoals filet americain (verslikkings- en infectiegevaar)"
        ],
        sampleMenu: [
          "07:30 1 volkoren boterham of havermout + beker melk (150 ml)",
          "10:00 Vers fruit + beker water",
          "12:30 1–2 volkoren boterhammen + beker melk of karnemelk (150 ml)",
          "15:00 Snoeptomaatjes (in vieren) / komkommer / volkoren cracker + water",
          "17:30 Warme maaltijd met het gezin + water (+ 10 mcg Vitamine D)"
        ],
        recipes: [
          {
            title: "Dreumes Roerei-Wrap Rolletjes",
            mealType: "lunch",
            prepTime: "5 min",
            ingredients: ["1 volkoren tortilla wrap", "1 ei", "Handje fijngesneden spinazie of tomaat", "1 el zuivelspread of avocado"],
            steps: "Roerbak het ei met de fijngesneden spinazie in 2 minuten gaar. Besmeer de volkoren wrap met zuivelspread, verdeel het ei erover, rol strak op en snijd in hapklare rolletjes."
          },
          {
            title: "Stevige Knoei-Vrije Havermoutpap met Banaan & Pindakaas",
            mealType: "ontbijt",
            prepTime: "4 min",
            ingredients: ["4 el havermout", "150 ml halfvolle melk", "1/2 banaan in plakjes", "1 tl 100% pindakaas"],
            steps: "Kook de havermout in 3 minuten lekker dik zodat hij goed aan het kinderlepeltje blijft plakken. Roer de banaan en pindakaas erdoor zodat je dreumes zelf kan scheppen!"
          },
          {
            title: "5-Minuten Doperwtjes-Avocado Pesto Pasta",
            mealType: "warme-hap",
            prepTime: "5 min (+ pasta koken)",
            ingredients: ["60 g volkoren penne of fusilli", "3 el diepvries doperwtjes", "1/2 rijpe avocado", "1 el hüttenkäse & druppel citroensap"],
            steps: "Kook de doperwtjes de laatste 3 minuten met de pasta mee. Prak de avocado met de hüttenkäse tot een romige saus en schep door de warme pasta."
          },
          {
            title: "Zelf-Dip Trio: Komkommer, Zachte Wortel & Hummus",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["6 komkommer-staafjes", "6 kort gestoomde wortel-staafjes", "2 el zoutarme hummus", "1 volkoren soepstengel"],
            steps: "Zet een bakje hummus in het midden van het bordje en laat je dreumes zelf dippen met de groenten en soepstengel."
          },
          {
            title: "Zoete Aardappel-Zalm-Broccoli Prak",
            mealType: "warme-hap",
            prepTime: "5 min actief",
            ingredients: ["1 zoete aardappel in blokjes", "50 g broccoli-roosjes", "40 g gebakken zalm of witvis", "1 tl olijfolie"],
            steps: "Stoom of kook de zoete aardappel en broccoli gaar en prak ze grof met de zalmvlokken en olijfolie. Plakt goed aan een kindervorkje of lepel!"
          },
          {
            title: "Volkoren Brood-Puzzel met Hüttenkäse & Geplette Bessen",
            mealType: "lunch",
            prepTime: "3 min",
            ingredients: ["1 volkoren boterham", "1,5 el hüttenkäse", "8 blauwe bessen (gehalveerd)", "Snufje kaneel"],
            steps: "Besmeer de volkoren boterham met hüttenkäse, druk de gehalveerde bessen erin en snijd de boterham in 4 grote 'puzzelstukken'."
          }
        ]
      },
      healthCB: {
        cbVisit: "12 maanden & 14 maanden: Controles op het Consultatiebureau (groei, lopen en spraak).",
        vaccines: "12 maanden: DKTP-Hib-HepB en Pneumokokken booster • 14 maanden: BMR-prik (Bof, Mazelen, Rodehond) + Meningokokken ACWY (de BMR geeft soms pas na 5–12 dagen wat koorts).",
        teeth: "De eerste vier kiezen komen door tussen 12 en 16 maanden. Dit kan zorgen voor rode wangen en onrustige nachten."
      },
      sleep: {
        totalSleep: "12 tot 14 uur per 24u",
        wakeWindow: "3,5 tot 4,5 uur",
        naps: "Overgang van 2 slaapjes naar 1 lang middagslaapje (meestal tussen 13 en 16 mnd)",
        tip: "Als je dreumes op 1 slaapje overgaat: geef een vroege lunch om 11:45 en leg rond 12:30 op bed."
      },
      milestones: [
        "Zet de eerste losse stapjes met de armpjes wijd",
        "Drinkt zelfstandig uit een beker en oefent met een lepel",
        "Begrijpt eenvoudige vraagjes ('Pak je schoenen maar')",
        "Stapelt 2 tot 3 blokjes op elkaar"
      ],
      tipsForMom: [
        "Gouden eetregel: Jij bepaalt WAT er op tafel komt, je dreumes bepaalt HOEVEEL hij eet. Dring geen extra hapjes op.",
        "Laat je dreumes binnenshuis op blote voetjes of antislip-sokjes lopen voor optimale voet- en balansontwikkeling."
      ],
      games: [
        {
          id: "g-m12-push",
          title: "Wasmand-Vrachtwagen duwen",
          category: "motor",
          duration: "10 min",
          energy: "high",
          brainBenefit: "Geeft steun en traint het evenwicht bij het leren lopen.",
          materials: "Omgekeerde wasmand met 2 knuffels erop",
          howToPlay: "Laat je dreumes de wasmand door de gang duwen en bij elke kamer een knuffel 'bezorgen'.",
          funTwist: "Laat je kind de wasmand zelf volladen en weer omkieperen."
        },
        {
          id: "g-m12-scoop",
          title: "Havermout scheppen & gieten",
          category: "motor",
          duration: "15 min",
          energy: "low",
          brainBenefit: "Oefent precies de polsdraai die nodig is om netjes met een lepel te eten.",
          materials: "Bakje met droge havermoutvlokken + lepels en bekertjes",
          howToPlay: "Zet een bak met droge havermout op een handdoek en laat je dreumes scheppen en overgieten in kleine bekertjes.",
          funTwist: "Verstop 4 speelgoeddieren onder de havermout om op te graven."
        },
        {
          id: "g-m12-lids",
          title: "Pannetjes & Deksels Puzzel",
          category: "cognitive",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Traint grootte-inschatting, passen en ruimtelijk redeneren.",
          materials: "3 verschillende maten bakjes of pannetjes + bijpassende deksels",
          howToPlay: "Zet de drie bakjes op de vloer en laat je dreumes uitzoeken welk deksel op welk bakje past.",
          funTwist: "Verstop een klein blokje of rozijntje in één van de bakjes als verrassing!"
        },
        {
          id: "g-m12-bodyparts",
          title: "Waar zit je buik? Waar zit je teen?",
          category: "language",
          duration: "6 min",
          energy: "low",
          brainBenefit: "Vergroot passieve en actieve woordenschat en lichaamsbesef.",
          materials: "Geen (of een knuffelbeer)",
          howToPlay: "Vraag vrolijk: 'Waar zit jouw neus? Pief!' en daarna: 'En waar zit de neus van Beer?'.",
          funTwist: "Plak een stukje schilderstape op de knie of hand van je dreumes en vraag: 'Wat zit daar nou op je knie?'"
        },
        {
          id: "g-m12-teddyfeed",
          title: "Knuffelbeer Eten Geven & Instoppen",
          category: "social",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Stimuleert empathie, zorgzaamheid en eerste verbeeldingskracht.",
          materials: "Knuffel + lepeltje + bekertje + theedoek als dekentje",
          howToPlay: "Geef je dreumes een leeg lepeltje zodat hij eerst een 'hapje' aan zijn knuffel mag geven en Beer daarna onder het doekje mag instoppen ('Sssst, Beer gaat slapen!').",
          funTwist: "Laat Beer zachtjes snurken en weer wakker springen!"
        },
        {
          id: "g-m12-colander",
          title: "Rietjes of Pijpenragers in het Vergiet Steken",
          category: "cognitive",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Supergoede oefening voor oog-handcoördinatie en diepe concentratie.",
          materials: "Keukenvergiet + dikke papieren rietjes of houten lepels",
          howToPlay: "Zet het vergiet omgekeerd neer en laat zien hoe je een rietje in een gaatje prikt zodat er een 'stekelvarken' ontstaat.",
          funTwist: "Laat je dreumes ze er daarna één voor één weer uittrekken."
        }
      ]
    },
    {
      id: "stage-m16-24",
      phaseIndex: 9,
      title: "Actieve Dreumes: Woordexplosie & 'Zelf Doen!' (16–24 mnd / Week 66–104)",
      shortLabel: "16–24 mnd",
      minWeek: 66,
      maxWeek: 104,
      ageRangeLabel: "Maand 16 t/m 24 (1,5 tot 2 jaar)",
      heroEmoji: "🦖",
      cutType: "quarters",
      summary: "De woordenschat schiet omhoog! Je dreumes rent, klimt, speelt rollenspellen en wil aan tafel alles zelf doen.",
      nutrition: {
        milkStatus: "~300 ml zuivel per dag + 400–600 ml water",
        feedsPerDay: "3 maaltijden + 2 vaste tussendoortjes",
        milkVolumeMetric: "300 ml melk/yoghurt + 500 ml water per dag",
        milkVolumeImperial: "10 oz melk/yoghurt + 17 oz water per dag",
        solidsPerDay: "3 maaltijden + 2 tussendoortjes",
        portionGuideMetric: "50–100 g groente + 2–3 el volkoren graan/aardappel + 50 g eiwitbron",
        portionGuideImperial: "5–7 oz per maaltijd (~2 eetlepels per onderdeel)",
        pureePath: "Serveer sausjes of dips apart in een klein bakje; veel dreumesen houden niet van 'alles door elkaar'.",
        blwPath: "Laat je dreumes meehelpen met banaan of komkommer snijden met een bot kindermesje of ribbelsnijder.",
        bestFoods: [
          { name: "Groente, Volkoren Pasta & Kip (los op een vakjesbord)", icon: "🍝", note: "Leg groente, pasta en kip/bonen los naast elkaar op een vakjesbord voor overzicht en rust aan tafel." },
          { name: "Ei, Vis, Peulvruchten & Notenpasta", icon: "🥚", note: "Bouwstenen voor de enorme taal- en hersengroei rond 18–24 maanden." },
          { name: "Banaan-Ei Pannenkoekjes of Groentemuffins", icon: "🍌", note: "Volkoren banaan-ei-spinazie pannenkoekjes zijn ideaal bij groente-weigering." }
        ],
        avoidFoods: [
          "Geen hele druiven, cherrytomaatjes, hele noten of popcorn (verslikkingsgevaar t/m 4 jaar)",
          "Niet de hele middag door tussendoortjes of knijpfruit geven (neemt de trek in het avondeten weg)"
        ],
        sampleMenu: [
          "07:30 Havermoutpap of volkorenbrood + beker halfvolle melk",
          "10:00 Stukjes appel (dun geschild) en mandarijn + water",
          "12:00 2 volkoren boterhammen met ei/pindakaas + komkommer + melk",
          "15:00 Handje zacht fruit of volkoren soepstengel met hummus",
          "17:30 Gezinsmaaltijd + klein schaaltje halfvolle yoghurt"
        ],
        recipes: [
          {
            title: "Groene Hulk-Pannenkoekjes (Spinazie-Banaan-Ei)",
            mealType: "lunch",
            prepTime: "5 min",
            ingredients: ["1 rijpe banaan", "1 ei", "1 flinke hand verse bladspinazie", "3 el volkorenmeel of havermout"],
            steps: "Mix banaan, ei, spinazie en havermout kort met de staafmixer tot een felgroen beslag en bak kleine pannenkoekjes. Zelfs kieskeurige dreumesen smullen hiervan!"
          },
          {
            title: "Overzichtelijk 4-Vakjes Avondbordje ('Niks Raakt Elkaar')",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["4 el gekookte volkoren rijst of pasta", "50 g gestoomde broccoli-boompjes", "40 g stukjes kip, ei of kikkererwten", "1 el halfvolle yoghurt of kwark als dip"],
            steps: "Schep elk onderdeel in een apart vakje van het kinderbord zodat je dreumes zelf kan kiezen wat hij op zijn vorkje prikt."
          },
          {
            title: "Banaan-Pindakaas Sushi-Rolletjes (Samen Snijden!)",
            mealType: "ontbijt",
            prepTime: "3 min",
            ingredients: ["1 volkoren tortilla wrap", "1 el 100% pindakaas", "1 gepelde banaan"],
            steps: "Besmeer de wrap met pindakaas, leg de hele banaan erop en rol strak op. Laat je dreumes met een bot kindermesje zelf plakjes snijden!"
          },
          {
            title: "5-Minuten Courgette-Maïs-Kaas Omelet",
            mealType: "lunch",
            prepTime: "5 min",
            ingredients: ["1 ei", "3 el fijn geraspte courgette", "2 el zoete maïs", "1 el geraspte 30+ kaas"],
            steps: "Roer de geraspte courgette, maïs en kaas door het losgeklopte ei en bak in 3 minuten aan beide kanten goudbruin. Snijd in puntjes zoals een taartje."
          },
          {
            title: "Snelle Couscous-Regenboog met Tomaat, Komkommer & Bonen",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["4 el volkoren couscous", "5 cherrytomaatjes (in de lengte in kwarten)", "Blokjes komkommer & gele paprika", "2 el witte bonen of kikkererwten"],
            steps: "Wel de couscous 3 minuten in kokend water en serveer met de gekleurde groenten en zachte bonen."
          },
          {
            title: "Bevroren Yoghurt-Bessen Druppels ('Gezonde Snoepjes')",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["4 el halfvolle kwark of yoghurt", "Handje geprakte aardbeien of frambozen", "1 tl 100% amandelpasta"],
            steps: "Roer het geprakte fruit door de dikke kwark of yoghurt en eet direct met een lepeltje, of vries in kleine dopjes in voor warme dagen."
          }
        ]
      },
      healthCB: {
        cbVisit: "18 maanden & 24 maanden: Afspraak op het Consultatiebureau (taalontwikkeling, lopen en groei).",
        vaccines: "Geen standaard RVP-prikken tussen 15 en 24 maanden.",
        teeth: "De hoektanden komen door rond 16–22 maanden. Vanaf 2 jaar poets je 2x per dag (ochtend en avond) met peutertandpasta (500–750 ppm fluoride)."
      },
      sleep: {
        totalSleep: "11,5 tot 13,5 uur per 24u",
        wakeWindow: "5 tot 5,5 uur vóór en na het middagslaapje",
        naps: "1 middagslaapje van 1,5 tot 2,5 uur (vaak 12:30–14:30)",
        tip: "Rond 18 maanden kan er slaapweerstand zijn door 'Zelf doen!'. Geef keuzes in het bedritueel: 'Welk boekje lezen we vandaag?'"
      },
      milestones: [
        "Rent door de kamer, klimt op de bank en schopt tegen een bal",
        "Kent 50+ woorden en maakt de eerste 2-woordzinnetjes ('Mama bal', 'Meer melk')",
        "Eet zelfstandig met lepel en vorkje",
        "Speelt eenvoudig doen-alsof (knuffel laten slapen, bellen)"
      ],
      tipsForMom: [
        "Weigert je dreumes plotseling groente? Dat heet 'voedsel-neofobie' en hoort bij deze leeftijd. Blijf een klein stukje aanbieden zonder druk; vaak zijn 10–15 keer proeven nodig!",
        "Zet een leeg 'Nee-dankjewel-bakje' naast het bord: wat je kind niet wil eten, mag hij netjes in het bakje leggen in plaats van op de grond gooien."
      ],
      games: [
        {
          id: "g-m16-chef",
          title: "Keukenhulpje: Zelf banaan snijden",
          category: "motor",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Vergroot trots, fijne motoriek én de bereidheid om zelfgemaakt eten te proeven.",
          materials: "Gepelde banaan + bot smeer- of ribbelmesje + snijplank",
          howToPlay: "Laat je dreumes met twee handen op het botte mesje drukken om zelf plakjes banaan te snijden.",
          funTwist: "Laat je kind de plakjes uitdelen aan jou!"
        },
        {
          id: "g-m16-freeze",
          title: "Dierendans & Standbeeld-Stop",
          category: "cognitive",
          duration: "10 min",
          energy: "high",
          brainBenefit: "Traint impulscontrole (stoppen op een signaal) en grove motoriek.",
          materials: "Muziekje",
          howToPlay: "Stamp als een olifant of spring als een kikker zolang de muziek speelt. Zodra de muziek stopt: 'BEVRIES als een standbeeld!'",
          funTwist: "Laat je dreumes op 'Stop!' roepen zodat jij moet bevriezen."
        },
        {
          id: "g-m16-colorsort",
          title: "Kleuren-Speurtocht op 2 Gekleurde Vellen",
          category: "cognitive",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Stimuleert categoriseren en eerste kleurherkenning.",
          materials: "1 rood en 1 geel vel papier (of handdoek) + blokjes/speelgoed",
          howToPlay: "Leg een rood en een geel vlak op de vloer en verzamel samen alle rode blokjes op rood en alle gele dingen op geel.",
          funTwist: "Zoek ook een rood en een geel stuk fruit in de keuken!"
        },
        {
          id: "g-m16-mysterybag",
          title: "De Geheimzinnige Voel-Tas ('Wat zit erin?')",
          category: "language",
          duration: "8 min",
          energy: "low",
          brainBenefit: "Prikkelt de woordexplosie en 2-woordzinnetjes ('Grote bal!', 'Mijn lepel!').",
          materials: "Kussensloop of stoffen tas + 5 bekende spulletjes (bal, lepel, schoen, auto, banaan)",
          howToPlay: "Laat je dreumes met zijn hand in de tas voelen en een voorwerp eruit halen. Zeg samen wat het is en wat je ermee doet!",
          funTwist: "Laat je dreumes daarna stiekem iets in de tas verstoppen voor jou."
        },
        {
          id: "g-m16-wash",
          title: "Speelgoeddieren Wassen & Afdrogen",
          category: "social",
          duration: "15 min",
          energy: "low",
          brainBenefit: "Leert zorgzaamheid, volgordes en rustig zintuiglijk spel.",
          materials: "Bakje lauw sop + tandenborstel/washandje + theedoek + plastic dieren",
          howToPlay: "Geef de plastic dieren 'modderpootjes' (bijv. een drupje yoghurt) en laat je dreumes elk dier wassen en droogdeppen met de doek.",
          funTwist: "Zet de schone dieren op een rijtje te slapen."
        },
        {
          id: "g-m16-ballkick",
          title: "Kegel-Bowling met Plastic Flessen",
          category: "motor",
          duration: "10 min",
          energy: "medium",
          brainBenefit: "Traint oog-voetcoördinatie, richten en balans op één been.",
          materials: "3 lege plastic flessen + zachte bal",
          howToPlay: "Zet drie lege flessen in de gang en laat je dreumes de bal ertegenaan rollen of schoppen.",
          funTwist: "Laat je dreumes de omgevallen flessen zelf weer rechtop zetten ('1, 2, 3!')."
        }
      ]
    },
    {
      id: "stage-y2",
      phaseIndex: 10,
      title: "Peuter 2–3 Jaar: Fantasie, Zinnen & Grote Gevoelens (Week 105–156)",
      shortLabel: "2–3 jaar",
      minWeek: 105,
      maxWeek: 156,
      ageRangeLabel: "2 tot 3 Jaar (Week 105–156)",
      heroEmoji: "🎨",
      cutType: "quarters",
      summary: "Volledige zinnen, rijke fantasie, springen met twee voeten, zindelijkheidsinteresse en leren omgaan met grote peuteremoties.",
      nutrition: {
        milkStatus: "300 ml halfvolle melk/zuivel + 600–700 ml water per dag",
        feedsPerDay: "3 maaltijden + 2 vaste tussendoortjes",
        milkVolumeMetric: "300 ml zuivel + 600–700 ml water/thee",
        milkVolumeImperial: "10 oz zuivel + 20–24 oz water",
        solidsPerDay: "3 maaltijden + 2 tussendoortjes (~1.100–1.300 kcal/dag)",
        portionGuideMetric: "Avondeten: 50–100 g groente + 2–3 el volkoren pasta/aardappel + 50–60 g vlees/vis/vega",
        portionGuideImperial: "6–8 oz per maaltijd (~2–3 eetlepels per onderdeel)",
        pureePath: "Maak groenten speels: noem broccoli 'dino-boompjes' of serveer rauwkost al om 17:00 uur in een bakje terwijl jij kookt (dan hebben peuters de meeste honger!).",
        blwPath: "Peuters kunnen nu zelf hun brood smeren met een bot mesje en water inschenken uit een klein kannetje.",
        bestFoods: [
          { name: "Snackgroenten om 17:00 uur", icon: "🥕", note: "Zet tijdens het koken alvast paprika, komkommer en gehalveerde tomaatjes klaar." },
          { name: "Volkoren Granen & Peulvruchten", icon: "🌾", note: "Zorgen voor een stabiele bloedsuikerspiegel (minder driftbuien door honger!)." },
          { name: "Halfvolle Melk, Yoghurt & 10 mcg Vitamine D", icon: "🥛", note: "300 ml zuivel voor calcium + tot de 4e verjaardag dagelijks 10 mcg Vitamine D." }
        ],
        avoidFoods: [
          "Geen hele druiven, cherrytomaatjes of hele noten (snijd druiven en tomaatjes nog steeds in de lengte doormidden)",
          "Geen zoete pakjes sap of limonade (water en lauwe vruchtenthee zijn de beste dorstlessers)"
        ],
        sampleMenu: [
          "07:30 1–2 volkoren boterhammen of havermout + beker melk",
          "10:00 Vers fruit + beker water",
          "12:30 2 volkoren boterhammen + rauwkost + beker melk",
          "15:00 Volkoren cracker met pindakaas of handje fruit + water",
          "17:30 Warme gezinsmaaltijd + bakje halfvolle yoghurt"
        ],
        recipes: [
          {
            title: "17:00-Uur 'Kook-Wacht-Bordje' met Hummus Dip",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["1/4 komkommer in reepjes", "1/2 rode paprika in reepjes", "6 cherrytomaatjes (in de lengte gehalveerd)", "2 el zoutarme hummus of yoghurtdip"],
            steps: "Zet dit bordje om 17:00 uur op de salontafel terwijl jij kookt. Peuters hebben om 17:00 uur rammelende honger en eten hun hele portie groente dan zó op!"
          },
          {
            title: "Vrolijke Leeuwen-Boterham met Pindakaas & Mandarijn",
            mealType: "lunch",
            prepTime: "4 min",
            ingredients: ["1 volkoren boterham", "1 el 100% pindakaas", "1 mandarijntje (in partjes)", "2 plakjes banaan & 3 blauwe bessen (gehalveerd)"],
            steps: "Steek of snijd de boterham rond, besmeer met pindakaas, leg de mandarijnpartjes eromheen als 'leeuwenmanen' en maak oogjes en een neusje van banaan en besjes."
          },
          {
            title: "Romige 'Dinosaurus-Groene' Spinazie Pasta",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["60 g gekookte volkoren spirelli", "1 flinke hand verse spinazie", "2 el zuivelspread light of ricotta", "1 el geraspte milde 30+ kaas"],
            steps: "Pureer de rauwe spinazie met de zuivelspread en een scheutje warm kookvocht in 30 seconden tot een felgroene 'Dino-saus' en schep door de warme pasta."
          },
          {
            title: "Warme Appel-Kaneel Havermout met 'Zelf-Kies' Toppings",
            mealType: "ontbijt",
            prepTime: "4 min",
            ingredients: ["4 el fijne havermout", "150 ml halfvolle melk", "1/2 geraspte appel + snufje kaneel", "2 kleine schaaltjes: rozijntjes & kokosrasp"],
            steps: "Verwarm de havermout met melk en geraspte appel in 2 minuten. Zet de 2 kleine topping-schaaltjes ernaast zodat je peuter zélf mag strooien (voorkomt 'Nee!'-strijd!)."
          },
          {
            title: "5-Minuten Zalm- & Erwtjes Couscous",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["4 el volkoren couscous", "40 g diepvries doperwtjes", "40 g gebakken of gestoomde zalmfilet", "1 tl olijfolie & citroendruppeltje"],
            steps: "Overgiet de couscous en diepvrieserwtjes samen in een kom met kokend water, dek 4 minuten af, roer los met olijfolie en vlok de zalm erdoorheen."
          },
          {
            title: "Gezonde Banaan-Pindakaas 'IJs-Lolly's' (Yoghurt Dip)",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["1 banaan (gehalveerd)", "3 el halfvolle kwark of yoghurt", "1 tl 100% pindakaas", "Snufje kaneel"],
            steps: "Steek een houten ijsstokje of lepeltje in een halve banaan, wentel door de dikke kwark of yoghurt met een sliertje pindakaas en eet direct als 'ijsje' of vries kort in."
          }
        ]
      },
      healthCB: {
        cbVisit: "2 jaar & 3 jaar: Afspraak op het Consultatiebureau (spraak, sociale ontwikkeling en eerste ogentest bij 3 jaar).",
        vaccines: "Geen prikken op 2-jarige leeftijd (rond 3 jaar volgt de 2e BMR-prik volgens het vernieuwde RIVM RVP-schema).",
        teeth: "Tussen 2 en 2,5 jaar komen de achterste melkkiezen door: het melkgebit (20 tanden en kiezen) is nu compleet! Neem je peuter vanaf 2 jaar gezellig mee naar de tandarts."
      },
      sleep: {
        totalSleep: "11 tot 13 uur per 24u",
        wakeWindow: "5,5 tot 6,5 uur",
        naps: "1 middagslaapje (1–1,5 uur) of rustmoment op de kamer",
        tip: "Slaapt je 2,5-jarige laat in 's avonds? Kort het middagslaapje in tot maximaal 45–60 minuten."
      },
      milestones: [
        "Springt met twee voeten tegelijk van de grond",
        "Praat in zinnetjes van 3 tot 4 woorden en stelt eerste 'Waarom?'-vragen",
        "Toont interesse in het potje of de wc",
        "Speelt rollenspellen (winkeltje, koken, bouwen)"
      ],
      tipsForMom: [
        "Gebruik humor en spel bij weerstand: een peuter weigert 'Trek je schoenen aan!', maar lacht als zijn schoen een hongerig hap-monster is dat een voet zoekt!",
        "Erken het gevoel, houd de grens: 'Je bent boos dat we naar binnen gaan, dat snap ik. Zullen we als kikkers naar de voordeur springen?'"
      ],
      games: [
        {
          id: "g-y2-tape",
          title: "Schilderstape Evenwichtsbalk & Slootje Springen",
          category: "motor",
          duration: "15 min",
          energy: "high",
          brainBenefit: "Traint balans, springkracht en afstandsinschatting.",
          materials: "Schilderstape op de vloer",
          howToPlay: "Plak een lange streep tape op de vloer om over te balanceren, gevolgd door 3 dwarsstrepen om met twee voeten overheen te springen.",
          funTwist: "Breng aan het einde van de brug een knuffel in veiligheid!"
        },
        {
          id: "g-y2-shop",
          title: "Winkeltje & Peuter-Restaurant",
          category: "social",
          duration: "15 min",
          energy: "low",
          brainBenefit: "Stimuleert taal, tellen tot 3 en rijke verbeeldingskracht.",
          materials: "Boodschappentasje + een paar lege doosjes en bordjes",
          howToPlay: "Bestel bij je 'ober' twee rode dingen en een geel hapje, en wissel daarna van rol.",
          funTwist: "Laat je peuter helpen met het dekken van de echte eettafel."
        },
        {
          id: "g-y2-socks",
          title: "De Grote Sokken-Tweeling Speurtocht",
          category: "cognitive",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Oefent visueel vergelijken, patronen herkennen en sorteren.",
          materials: "5 paar vrolijke kinder- en volwassensokken door elkaar",
          howToPlay: "Leg de 10 sokken op het kleed en laat je peuter van elke sok het 'tweelingbroertje' zoeken.",
          funTwist: "Maak er samen bolletjes van en mik ze in de wasmand!"
        },
        {
          id: "g-y2-story",
          title: "Plaatjesboek: 'En wat gebeurt er nú?'",
          category: "language",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Stimuleert zinsopbouw van 3–4 woorden en oorzaak-gevolg denken.",
          materials: "Prentenboek met grote zoekplaten",
          howToPlay: "Lees niet alleen de tekst voor, maar wijs naar een grappig detail op de plaat en vraag: 'Ojee, kijk naar dat hondje! Wat gaat hij doen?'",
          funTwist: "Laat je peuter het verhaal aan jou 'voorlezen' aan de hand van de plaatjes."
        },
        {
          id: "g-y2-pasta",
          title: "Reuze-Ketting Rijgen met Penne Pasta",
          category: "motor",
          duration: "12 min",
          energy: "low",
          brainBenefit: "Traint tweehandige precisie en fijne vingercoördinatie.",
          materials: "Dikke schoenveter of lint (met knoop aan het eind) + grote ongekookte penne of rigatoni pasta",
          howToPlay: "Laat je peuter de pastabuisjes één voor één aan de dikke veter rijgen tot een ketting of slang.",
          funTwist: "Rijg om-en-om een pastabuisje en een stukje gekleurd rietje."
        },
        {
          id: "g-y2-feelings",
          title: "Blij, Boos, Verbaasd & Slaperig Gezichtjes-Spel",
          category: "social",
          duration: "8 min",
          energy: "low",
          brainBenefit: "Helpt peuters om hun eigen grote emoties te herkennen en woorden te geven.",
          materials: "Spiegel of gewoon samen op de bank",
          howToPlay: "Zeg: 'Hoe kijkt een boze leeuw? Grrr!' en 'Hoe kijkt een superblij konijntje?' en trek samen de gezichten.",
          funTwist: "Oefen ook de 'Kaarsje Uitblazen'-ademhaling op je vijf vingers voor als je peuter echt boos is."
        }
      ]
    },
    {
      id: "stage-y3",
      phaseIndex: 11,
      title: "Peuter 3–4 Jaar: 'Waarom?'-Fase & Vriendjes (Week 157–208)",
      shortLabel: "3–4 jaar",
      minWeek: 157,
      maxWeek: 208,
      ageRangeLabel: "3 tot 4 Jaar (Week 157–208)",
      heroEmoji: "🦋",
      cutType: "quarters",
      summary: "De gouden 'Waarom?'-leeftijd! Je kind fietst op een loopfiets of driewieler, knipt met een kinderschaar, verzint verhalen en maakt echte vriendjes.",
      nutrition: {
        milkStatus: "300–350 ml halfvolle zuivel + 700–900 ml water per dag",
        feedsPerDay: "3 maaltijden + 2 tussendoortjes",
        milkVolumeMetric: "300–350 ml zuivel + 800 ml water",
        milkVolumeImperial: "10–12 oz zuivel + 27 oz water",
        solidsPerDay: "3 maaltijden + 2 tussendoortjes (~1.250–1.450 kcal/dag)",
        portionGuideMetric: "100 g groente + 2–3 opscheplepels volkoren graan/aardappel + 60 g vis/vlees/peulvrucht",
        portionGuideImperial: "7.5–9 oz per maaltijd (~3 eetlepels per onderdeel)",
        pureePath: "Betrek je 3-jarige bij het koken: groenten wassen, sla scheuren en roeren. Kinderen die helpen koken proeven veel makkelijker!",
        blwPath: "Zet schaaltjes op tafel zodat je kind zelf 2 of 3 lepels groente op zijn eigen bord kan scheppen.",
        bestFoods: [
          { name: "Zelf-bouw Wraps of Volkoren Pita's", icon: "🌮", note: "Zet bakjes paprika, maïs, kip/bonen en avocado op tafel om zelf te vullen." },
          { name: "Vette Vis, Ei & Notenpasta", icon: "🐟", note: "Ondersteunt concentratie en geheugen richting de basisschool." },
          { name: "Kaas, Zuivelspread & 10 mcg Vitamine D", icon: "🧀", note: "Zoutarme zuivelspread of 30+ kaas op brood + t/m de 4e verjaardag dagelijks 10 mcg Vitamine D." }
        ],
        avoidFoods: [
          "Geen hele noten en pinda's tot 4 jaar (gebruik wel gladde 100% notenpasta op brood)",
          "Geen zoete yoghurtdrankjes en frisdrank (bescherm het melkgebit tegen suiker en zuur)"
        ],
        sampleMenu: [
          "07:30 Yoghurt met havermout & bessen óf 2 volkoren boterhammen",
          "10:00 Stuk fruit + beker water",
          "12:30 2–3 volkoren boterhammen + rauwkost + melk",
          "15:00 Volkoren cracker of maiswafel met hummus/pindakaas",
          "18:00 Warme maaltijd met het gezin"
        ],
        recipes: [
          {
            title: "Zelf-Bouw Volkoren Pita-Pizzaatjes",
            mealType: "warme-hap",
            prepTime: "5 min (+ 8 min oven)",
            ingredients: ["Volkoren pitabroodjes", "2 el tomatenpassata met oregano", "Paprika, champignons & maïs", "Geraspte 30+ mozzarella"],
            steps: "Laat je peuter zelf tomatensaus op een volkoren pitabroodje strijken en een vrolijk gezichtje leggen van paprika, maïs en kaas. Even 8 minuten in de oven!"
          },
          {
            title: "Regenboog Wrap-Pinwheels (Sushi-Rolletjes)",
            mealType: "lunch",
            prepTime: "5 min",
            ingredients: ["1 volkoren tortilla wrap", "2 el zuivelspread of hummus", "Geraspte wortel, gele paprika & komkommerlinten", "2 plakjes kipfilet of jonge kaas"],
            steps: "Besmeer de wrap, beleg met een regenboog aan groentereepjes, rol strak op en snijd in 6 vrolijke 'sushi'-wieltjes."
          },
          {
            title: "Yoghurt 'Schattenjacht' met Havermout & Verborgen Fruit",
            mealType: "ontbijt",
            prepTime: "3 min",
            ingredients: ["150 ml halfvolle yoghurt", "3 el havermout of gepofte spelt", "Handje aardbeien & blauwe bessen in stukjes", "1 tl 100% amandel- of pindakaas"],
            steps: "Verstop het fruit onderin het schaaltje, schep de yoghurt en granen eroverheen en laat je peuter met zijn lepel op 'schattenjacht' gaan naar de kleuren."
          },
          {
            title: "Snelle Gnocchi in Romige Tomaten-Courgettesaus",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["120 g verse gnocchi (kooktijd 2 min!)", "1/2 courgette (grof geraspt)", "4 el tomatenpassata", "1 el zuivelspread light & blaadje basilicum"],
            steps: "Kook de gnocchi in 2 minuten gaar. Verwarm intussen de geraspte courgette 3 minuten in de passata met zuivelspread en schep de zachte kussentjes erdoorheen."
          },
          {
            title: "Appel-Donuts met Pindakaas & Gepofte Granen",
            mealType: "tussendoor",
            prepTime: "4 min",
            ingredients: ["1 appel (in dikke ringen zonder klokhuis)", "2 tl 100% pindakaas of zuivelspread", "1 el gepofte spelt, havermout of rozijntjes", "Snufje kaneel"],
            steps: "Snijd de appel in horizontale plakken en steek het klokhuis eruit zodat je 'donuts' krijgt. Laat je peuter ze besmeren met pindakaas en versieren."
          },
          {
            title: "5-Minuten Omelet-Taco met Maïs & Avocado",
            mealType: "lunch",
            prepTime: "5 min",
            ingredients: ["2 eieren", "2 el maïs (uitgelekt)", "1/4 rijpe avocado in blokjes", "1 volkoren mini-tortilla"],
            steps: "Klop de eieren met maïs los in een koekenpan, druk de volkoren tortilla direct bovenop het nog natte ei, keer na 2 minuten om en vouw dubbel met avocado."
          }
        ]
      },
      healthCB: {
        cbVisit: "3 jaar en 9 maanden: Laatste peuter-afspraak op het Consultatiebureau (plaatjes-ogentest en overdracht naar de jeugdgezondheidszorg op de basisschool).",
        vaccines: "Rond 3 jaar: Tweede BMR-vaccinatie (Bof, Mazelen, Rodehond — volgens het vernieuwde RIVM RVP-schema; de DKT-booster volgt rond 5 jaar).",
        teeth: "Compleet melkgebit (20 tanden). Poets 2x per dag 2 minuten met peutertandpasta (500–750 ppm fluoride) en poets als ouder altijd na!"
      },
      sleep: {
        totalSleep: "10,5 tot 12,5 uur per 24u",
        wakeWindow: "Hele dag (~11,5–12,5 uur; evt. kort rustmoment)",
        naps: "Het middagslaapje vervalt meestal tussen 3 en 3,5 jaar",
        tip: "Valt het middagslaapje weg? Vervroeg de bedtijd tijdelijk met 30–45 minuten (bijv. 18:45) en gebruik een slaaptrainer-klokje."
      },
      milestones: [
        "Rijdt vlot op een loopfiets/driewieler en hinkelt op één been",
        "Vertelt hele verhaaltjes en is voor iedereen goed verstaanbaar",
        "Knipt met een kinderschaar en tekent een poppetje (koppoter)",
        "Is overdag zindelijk en kleedt zichzelf grotendeels aan"
      ],
      tipsForMom: [
        "Vraagt je kind 50 keer per dag 'Waarom?' Draai de vraag eens speels om: 'Goeie vraag! Waarom denk JIJ dat de maan niet naar beneden valt?'",
        "Geef complimenten op inzet ('Wat heb je goed geoefend met je rits!') in plaats van alleen op resultaat."
      ],
      games: [
        {
          id: "g-y3-scissor",
          title: "Klei-Kapsalon (Knippen oefenen)",
          category: "motor",
          duration: "15 min",
          energy: "low",
          brainBenefit: "Traint de fijne handspieren die straks op school nodig zijn voor de pengreep.",
          materials: "Speelklei + veilige kinderschaar",
          howToPlay: "Rol lange slierten klei als 'haren' op een klei-poppetje en laat je kind als kapper de slierten in stukjes knippen.",
          funTwist: "Maak daarna van de geknipte stukjes 'pizza-beleg' op een platte schijf klei."
        },
        {
          id: "g-y3-sink",
          title: "Zinken of Drijven Proefjes",
          category: "cognitive",
          duration: "15 min",
          energy: "low",
          brainBenefit: "Stimuleert logisch redeneren en voorspellen ('Wat denk jij dat er gebeurt?').",
          materials: "Bak water + appel, muntje, legoblokje, lepel en mandarijn",
          howToPlay: "Laat je kind vóór elk voorwerp raden of het zinkt of blijft drijven, en test het samen uit!",
          funTwist: "Ontdek samen dat een mandarijn mét schil drijft, maar zónder schil zinkt!"
        },
        {
          id: "g-y3-missing",
          title: "Wat is er Verdwénen onder de Theedoek?",
          category: "cognitive",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Traint het visuele werkgeheugen en concentratie.",
          materials: "4 kleine voorwerpen op tafel + 1 theedoek",
          howToPlay: "Leg een lepel, blokje, auto en banaan op tafel. Laat je peuter zijn ogen dichtdoen, haal 1 voorwerp weg onder de doek en vraag: 'Wat is er weg?'",
          funTwist: "Wissel van rol zodat jouw peuter iets voor jou mag verstoppen!"
        },
        {
          id: "g-y3-storybag",
          title: "Het 3-Voorwerpen Verhaaltje Verzinnen",
          category: "language",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Stimuleert fantasie, langere zinnen en verhaalopbouw.",
          materials: "3 willekeurige speeltjes in een kussensloop",
          howToPlay: "Trek om de beurt een voorwerp uit de zak en verzin samen een gek avontuur waarin alle drie de dingen voorkomen ('Er was eens een kikker die op een tractor naar de maan reed...').",
          funTwist: "Neem het verhaaltje op met de dictafoon van je telefoon en luister het samen terug!"
        },
        {
          id: "g-y3-doctor",
          title: "De Knuffel-Dokter & Pleister-Kliniek",
          category: "social",
          duration: "15 min",
          energy: "low",
          brainBenefit: "Helpt medische controles of het consultatiebureau verwerken en traint inlevingsvermogen.",
          materials: "Knuffels + rolletje schilderstape als 'pleisters' + leeg lepeltje",
          howToPlay: "Beer heeft pijn aan zijn pootje! Laat je peuter als dokter luisteren naar het hartje, een stukje schilderstape als pleister plakken en Beer troosten.",
          funTwist: "Laat je peuter ook jouw knie 'onderzoeken'."
        },
        {
          id: "g-y3-lava",
          title: "De Vloer is Lava! (Kussen-Eilandensprong)",
          category: "motor",
          duration: "15 min",
          energy: "high",
          brainBenefit: "Versterkt grote sprongkracht, balans op één been en ruimtelijk plannen.",
          materials: "4 kussens of placemats op de vloer",
          howToPlay: "Leg kussens als 'eilanden' door de kamer. Roep: '5, 4, 3, 2, 1... De vloer is lava!' en spring samen van eiland naar eiland zonder de vloer te raken.",
          funTwist: "Geef op elk eiland een grappige opdracht ('Sta 3 tellen als een flamingo op 1 been!')."
        }
      ]
    },
    {
      id: "stage-y4-5",
      phaseIndex: 12,
      title: "Kleuter 4–5 Jaar: Basisschool, Letters & Regelspelletjes (Week 209–312)",
      shortLabel: "4–5 jaar",
      minWeek: 209,
      maxWeek: 312,
      ageRangeLabel: "4 tot 5 Jaar (Groep 1 & 2 • Week 209–312)",
      heroEmoji: "🎒",
      cutType: "plate",
      summary: "Naar de basisschool! Een grote sprong in zelfstandigheid, rijmen en letters herkennen, bordspelletjes spelen en bijkomen na een drukke schooldag.",
      nutrition: {
        milkStatus: "300–400 ml halfvolle zuivel + 800–1.000 ml water per dag",
        feedsPerDay: "3 maaltijden + 10-uurtje op school + middag-tussendoortje",
        milkVolumeMetric: "350 ml zuivel + 900 ml water per dag",
        milkVolumeImperial: "12 oz zuivel + 30 oz water per dag",
        solidsPerDay: "3 maaltijden + 2 tussendoortjes (~1.400–1.600 kcal/dag)",
        portionGuideMetric: "100–150 g groente + 2–3 volkoren boterhammen bij de lunch + handje ongezouten noten",
        portionGuideImperial: "9–11 oz per maaltijd (~1/2 volwassen portie)",
        pureePath: "Kleuters kunnen nu rustig zittend een klein handje ongezouten noten (15 g) eten.",
        blwPath: "Leer je kleuter het 'Regenboog-bord': elke kleur groente en fruit geeft een eigen superkracht (oranje voor scherpe ogen, groen voor sterke spieren!).",
        bestFoods: [
          { name: "Stevig School-Ontbijt (Volkoren Brood & Havermout)", icon: "🥣", note: "Havermout of volkorenbrood met ei of 100% pindakaas geeft urenlang rustige focus in groep 1 en 2." },
          { name: "Snoepgroenten voor het 10-Uurtje (Komkommer & Snoeptomaat)", icon: "🥒", note: "Kleurrijk 10-uurtje en lunchtrommel met komkommer, paprika, snoeptomaatjes en een beker water." },
          { name: "Appelpartjes & Ongezouten Noten ('Ontprikkel-Bordje')", icon: "🍎", note: "Zet om 14:30 direct een bordje klaar met appel, banaan en een klein handje ongezouten nootjes (15 g) voordat je vragen stelt over school." }
        ],
        avoidFoods: [
          "Geen suikerrijke ontbijtgranen (zorgen voor een energiedip halverwege de ochtend op school)",
          "Niet rennend of spelend eten met nootjes of druiven (eet altijd rustig zittend aan tafel)"
        ],
        sampleMenu: [
          "07:15 Volkorenbrood met ei of pindakaas + beker melk",
          "10:00 (School) Vers fruit + beker water",
          "12:00 (School) 2–3 volkoren boterhammen + snoepgroenten + melk/water",
          "14:45 Uit-school bordje: appelpartjes, komkommer & klein handje walnoten/amandelen",
          "18:00 Warme maaltijd met 100–150 g groente, volkoren pasta/aardappel en vis/kip/peulvruchten"
        ],
        recipes: [
          {
            title: "Vrolijke Bento-Schooltrommel in 4 Minuten",
            mealType: "lunch",
            prepTime: "4 min",
            ingredients: ["2 volkoren boterhammen", "100% pindakaas of zuivelspread + komkommer", "1 handje blauwe bessen of aardbeien", "5 snoeptomaatjes & 1 klein handje walnoten (15 g)"],
            steps: "Snijd de boterhammen in driehoekjes en vul de andere vakjes van de broodtrommel met bessen, snoepgroente en een paar nootjes voor langdurige schooldag-energie."
          },
          {
            title: "14:30-Uur 'Uit-School Ontprikkel-Bordje'",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["1/2 appel in partjes", "1/4 komkommer in muntjes", "1 klein handje ongezouten cashewnoten (15 g)", "2 blokjes jonge 30+ kaas"],
            steps: "Zet dit bordje direct na school op tafel zonder meteen 10 vragen te stellen over de schooldag. Eerst rustig knabbelen en opladen, dan komen de verhalen vanzelf!"
          },
          {
            title: "Kleuter 'Raket-Havermout' met Banaan & Pindakaas",
            mealType: "ontbijt",
            prepTime: "4 min",
            ingredients: ["5 el fijne havermout", "180 ml halfvolle melk", "1/2 banaan in plakjes + 4 aardbeien", "1 tl 100% pindakaas"],
            steps: "Kook de havermout met melk in 2 minuten romig. Leg van bananenplakjes een raketvorm op de pap en maak 'vuurvlammen' onderaan van aardbeien en pindakaas."
          },
          {
            title: "5-Minuten Tortellini in Romige Tomaten-Spinaziesaus",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["125 g verse kaas- of groentetortellini (kooktijd 3 min)", "1 flinke hand verse spinazie", "5 el tomatenpassata", "2 el hüttenkäse of zuivelspread light"],
            steps: "Kook de verse tortellini in 3 minuten gaar. Verwarm intussen de passata met spinazie en hüttenkäse tot de spinazie slinkt en schep de tortellini erdoor."
          },
          {
            title: "Volkoren 'Tosti-Verrassing' met Appel, Kaneel & Hüttenkäse",
            mealType: "lunch",
            prepTime: "5 min",
            ingredients: ["2 volkoren boterhammen", "2 el hüttenkäse of zuivelspread", "1/2 appel in flinterdunne plakjes", "Snufje kaneel & 5 rozijntjes"],
            steps: "Besmeer het brood met hüttenkäse, beleg met dunne appelplakjes en kaneel, en rooster 3 minuten in het tosti-ijzer of een droge koekenpan: smaakt naar warme appeltaart!"
          },
          {
            title: "Snelle Kikkererwten- & Maïs 'Taco-Bowl'",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["4 el voorgekookte zilvervliesrijst of couscous", "3 el kikkererwten & 2 el maïs (afgespoeld)", "1/2 avocado & 5 gehalveerde snoeptomaatjes", "1 el milde yoghurtdressing"],
            steps: "Verwarm de rijst en kikkererwten 2 minuten en zet alle kleurrijke onderdelen in vakjes in een diep bord zodat je kleuter zelf kan mixen."
          }
        ]
      },
      healthCB: {
        cbVisit: "Groep 2 (rond 5 jaar): Gezondheidsonderzoek door de jeugdarts/verpleegkundige van de GGD (ogen, gehoor, lengte, gewicht en motoriek).",
        vaccines: "Rond 5 jaar (voorheen 4 jaar): DKT-boosterprik tegen Difterie, Kinkhoest en Tetanus (volgens het vernieuwde RIVM RVP-schema).",
        teeth: "Rond 5–6 jaar breken achterin de eerste blijvende 'zesjaarskiezen' door. Stap vanaf 5 jaar over op junior-/volwassenentandpasta (1.000–1.500 ppm fluoride) en poets elke avond zorgvuldig na!"
      },
      sleep: {
        totalSleep: "10 tot 12 uur per nacht",
        wakeWindow: "Hele dag (~12–13 uur overdag)",
        naps: "Geen middagslaapje meer",
        tip: "Kleuters zijn de eerste maanden op de basisschool vaak doodmoe na 14:00 uur. Houd de middagen na school lekker rustig en leg ze op tijd (18:45–19:15) in bed."
      },
      milestones: [
        "Rijmt, telt tot 10–20 en herkent of schrijft de letters van de eigen naam",
        "Speelt gezelschapsspelletjes met regels en leert omgaan met verliezen",
        "Kan vangen, hinkelen, klimmen en leert fietsen zonder zijwieltjes",
        "Smeert zelf brood en kleedt zich helemaal zelfstandig aan"
      ],
      tipsForMom: [
        "Ontlading na schooltijd (zelfregulatie-moeheid): kleuters spannen zich op school de hele dag in en kunnen thuis in hun veilige haven ineens huilen of boos worden om iets kleins. Geef eerst rust, een knuffel en wat eten, pas later kletsen!",
        "Vraag aan tafel niet 'Hoe was het op school?' (antwoord is altijd 'Leuk' of 'Weet ik niet'), maar: 'Wat was het grappigste dat er vandaag gebeurde?'"
      ],
      games: [
        {
          id: "g-y4-rhyme",
          title: "Rijm-Raketten & 'Ik zie, ik zie met de letter...'",
          category: "language",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Klankbewustzijn en rijmen leggen de basis voor vlot leren lezen in groep 3.",
          materials: "Geen (ideaal aan tafel of onderweg)",
          howToPlay: "Zeg: 'Ik zie iets op tafel dat begint met de klank /b/...' (banaan, beker, bord) of verzin samen gekke rijmwoorden op jullie namen!",
          funTwist: "Klap de lettergrepen van al het eten op tafel ('kom-kom-mer' = 3 klappen)."
        },
        {
          id: "g-y4-redlight",
          title: "Andersom-Stoplicht ('Brein-Wissel!')",
          category: "cognitive",
          duration: "10 min",
          energy: "high",
          brainBenefit: "Traint de prefrontale cortex (werkgeheugen en impulscontrole).",
          materials: "Woonkamer of tuin",
          howToPlay: "Speel eerst gewoon Groen Licht = Lopen, Rood Licht = Stop. Roep na 3 rondes 'BREIN-WISSEL!': nu betekent Rood Licht = Lopen en Groen Licht = Standbeeld!",
          funTwist: "Voeg 'Paars Licht = Kikker-sprong' toe."
        },
        {
          id: "g-y4-backdraw",
          title: "Rug-Tekenen Raadsel (Rustig Ontprikkelen na School)",
          category: "social",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Kalmeert het zenuwstelsel na een drukke schooldag en traint lichaamsgevoel.",
          materials: "Geen",
          howToPlay: "Teken met je wijsvinger langzaam een vorm of letter op de rug van je kleuter (een zon, een hartje, een slang of de eerste letter van zijn naam) en laat hem raden wat het is.",
          funTwist: "Wissel daarna om: heerlijk ontspannend voor mama op de bank!"
        },
        {
          id: "g-y4-balloon",
          title: "Ballon-Hooghouden met Geheime Opdracht",
          category: "motor",
          duration: "12 min",
          energy: "medium",
          brainBenefit: "Traint reactiesnelheid, oog-handcoördinatie en samenwerken (niet tegen elkaar, maar mét elkaar!).",
          materials: "1 opgeblazen ballon",
          howToPlay: "Houd samen de ballon in de lucht zonder dat hij de grond raakt en tel hardop tot 20.",
          funTwist: "Volgende ronde: je mag de ballon alleen met je elleboog, knie of hoofd aanraken!"
        },
        {
          id: "g-y4-shopcount",
          title: "Restaurant-Ober met 'Bestel-Briefjes' (Getallen 1 t/m 6)",
          category: "cognitive",
          duration: "15 min",
          energy: "low",
          brainBenefit: "Koppelt getalsymbolen aan hoeveelheden (voorbereidend rekenen groep 2).",
          materials: "Notitieblokje + potlood + snackbordje",
          howToPlay: "Laat je kleuter als ober met een notitieblokje jouw bestelling opnemen door streepjes of rondjes te tekenen ('3 komkommertjes, 2 tomaatjes en 4 nootjes') en het precies uit te tellen.",
          funTwist: "Betaal met knopen of muntjes en tel samen terug."
        },
        {
          id: "g-y4-emotioncharades",
          title: "Dieren-Emotie Uitbeelden & Raden",
          category: "social",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Vergroot emotionele woordenschat en sociale vaardigheden voor het schoolplein.",
          materials: "Geen",
          howToPlay: "Beeld zonder woorden een dier met een gevoel uit (bijv. een verlegen muisje, een trotse pauw of een verbaasde aap) en laat de ander raden.",
          funTwist: "Bespreek speels: 'Wat helpt een verlegen muisje als hij iemand wil vragen om mee te spelen?'"
        }
      ]
    },
    {
      id: "stage-y6-7",
      phaseIndex: 13,
      title: "Schoolkind 6–7 Jaar: Leren Lezen, Rekenen & Tanden Wisselen (Week 313–416)",
      shortLabel: "6–7 jaar",
      minWeek: 313,
      maxWeek: 416,
      ageRangeLabel: "6 tot 7 Jaar (Groep 3 & 4 • Week 313–416)",
      heroEmoji: "📚",
      cutType: "plate",
      summary: "De magische sprong van groep 3 en 4! Je kind leert echt lezen en rekenen, wisselt de eerste melktanden, haalt zwemdiploma's en bouwt hechte vriendschappen.",
      nutrition: {
        milkStatus: "400 ml halfvolle zuivel/kaas + 1,0 tot 1,2 liter water per dag",
        feedsPerDay: "3 maaltijden + 2 voedzame tussendoortjes (voor school & sport)",
        milkVolumeMetric: "400 ml zuivel + 1,0–1,2 liter water per dag",
        milkVolumeImperial: "14 oz zuivel + 34–40 oz water per dag",
        solidsPerDay: "3 maaltijden + 2 tussendoortjes (~1.500–1.750 kcal/dag)",
        portionGuideMetric: "150 g groente + 3–4 opscheplepels volkoren pasta/rijst/aardappel + 70–80 g eiwitbron",
        portionGuideImperial: "10–13 oz per maaltijd (~65% van een volwassen portie)",
        pureePath: "Laat je 6–7-jarige elke avond zelf 2 gezonde dingen kiezen voor de eigen broodtrommel van morgen.",
        blwPath: "Samen koken in het weekend: eieren breken, groente snijden onder toezicht en beslag afwegen op de weegschaal (meteen een leuke rekenoefening!).",
        bestFoods: [
          { name: "Volkoren Brandstof voor het Lees-Brein", icon: "🥪", note: "Kinderhersenen verbruiken op 6–7-jarige leeftijd bijna 2x zoveel glucose als volwassen hersenen!" },
          { name: "Calcium & Vitamine D voor Blijvende Tanden", icon: "🥛", note: "Yoghurt, melk, kaas en vette vis ondersteunen het nieuwe volwassen gebit." },
          { name: "Ongezouten Noten, Bessen & Zaden", icon: "🍓", note: "Zink, ijzer en antioxidanten voor geheugen en weerstand." }
        ],
        avoidFoods: [
          "Niet zonder ontbijt naar school gaan (zorgt voor concentratieverlies in de klas)",
          "Geen suikerrijke sportdrankjes bij gewone zwem- of sporttraining (water en een banaan zijn veel gezonder)"
        ],
        sampleMenu: [
          "07:15 Havermout met fruit & noten óf 2 volkoren boterhammen + melk",
          "10:00 (School) Fruit + handje snoepgroenten + water",
          "12:00 (School) 3 volkoren boterhammen met hartig beleg + melk/water",
          "15:00 Na school/voor sport: Volkoren mueslibol of banaan met pindakaas",
          "18:00 Warme maaltijd met 150 g groente + schaaltje yoghurt"
        ],
        recipes: [
          {
            title: "Zwemles & Sport Power-Smoothie",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["200 ml halfvolle melk of yoghurt", "1 banaan", "Handje diepvries aardbeien of blauwe bessen", "2 el havermout + 1 tl 100% pindakaas"],
            steps: "Blend alle ingrediënten in 60 seconden glad. Geeft direct energie en eiwitten vóór of na de zwemles of sporttraining!"
          },
          {
            title: "Groep-3 'Lees-Brandstof' Ontbijtbowl met Noten & Bessen",
            mealType: "ontbijt",
            prepTime: "3 min",
            ingredients: ["150 g halfvolle kwark of Griekse yoghurt", "3 el volkoren havermout of muesli zonder toegevoegde suiker", "Handje blauwe bessen", "15 g gehakte walnoten & 1 tl lijnzaad"],
            steps: "Schep de kwark in een kom en laat je kind er met bessen en walnoten de eerste letter van zijn of haar eigen naam op leggen."
          },
          {
            title: "Krokante Volkoren Wrap-Tosti met Hummus, Paprika & Kaas",
            mealType: "lunch",
            prepTime: "5 min",
            ingredients: ["1 grote volkoren tortilla wrap", "2 el hummus", "1/2 rode paprika in dunne reepjes & handje babyspinazie", "1 plak 30+ kaas"],
            steps: "Besmeer de helft van de wrap met hummus, beleg met paprika, spinazie en kaas, vouw dubbel en bak 2 minuten per kant in een droge koekenpan."
          },
          {
            title: "5-Minuten Zalm-Noedels met Edamame & Broccoli",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["1 nestje volkoren mie-noedels", "60 g kleine broccoliroosjes & 40 g gepelde edamame-boontjes", "60 g warmgerookte of gebakken zalm", "1 tl sesamolie"],
            steps: "Kook de volkoren noedels samen met de kleine broccoliroosjes en edamame in 4 minuten gaar. Giet af, meng met sesamolie en verdeel de zalm erover."
          },
          {
            title: "Gevulde 'Bootjes' van Puntpaprika met Zuivelspread & Zaden",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["1 zoete rode puntpaprika", "2 el zuivelspread light of hüttenkäse", "1 el pompoenpitten of zonnebloempitten", "Snufje milde paprikapoeder"],
            steps: "Halveer de puntpaprika in de lengte en verwijder de zaadlijsten zodat je 2 'kano-bootjes' hebt. Vul met zuivelspread en bestrooi met knapperige pitjes."
          },
          {
            title: "Snelle Groente-Omelet op Volkorenbrood ('Uitsmijter Deluxe')",
            mealType: "lunch",
            prepTime: "5 min",
            ingredients: ["2 volkoren boterhammen", "2 eieren", "Handje gehalveerde cherrytomaatjes & bosui", "Snufje Italiaanse kruiden"],
            steps: "Bak de tomaatjes 1 minuut in een druppel olijfolie, schenk de losgeklopte eieren erover, laat in 3 minuten stollen en serveer op 2 volkoren boterhammen."
          }
        ]
      },
      healthCB: {
        cbVisit: "Jeugdgezondheidszorg op school (op aanvraag bij vragen over groei, zicht of gedrag).",
        vaccines: "Geen standaard prikken op 6–7-jarige leeftijd.",
        teeth: "Wisselfase! De onderste en bovenste snijtanden wisselen en de nieuwe 'zesjaarskiezen' komen helemaal achterin door. Poets 2x per dag met 5+ / junior- of volwassenentandpasta (1.000–1.500 ppm fluoride, waar je vanaf 5 jaar mee bent gestart) en poets nog elke avond na tot 10 jaar!"
      },
      sleep: {
        totalSleep: "9,5 tot 11,5 uur per nacht",
        wakeWindow: "Hele dag (~13–14 uur)",
        naps: "Geen",
        tip: "Samen 15 minuten om-en-om voorlezen in bed (jij één bladzijde, je kind één alinea) maakt lezen gezellig én zorgt voor ontspannen inslapen."
      },
      milestones: [
        "Leest zelfstandig eerste boekjes en rekent met optellen en aftrekken",
        "Kan klok kijken (hele en halve uren) en veters strikken",
        "Wisselt de eerste voortanden en krijgt de blijvende kiezen",
        "Heeft een sterk gevoel voor eerlijkheid en spelregels"
      ],
      tipsForMom: [
        "Leer je kind het woordje 'NOG': als je kind gefrustreerd roept 'Ik kan dit niet lezen!', zeg je samen: 'Ik kan dit NOG niet!'",
        "Hang een visuele weekplanning met icoontjes op in de keuken (school, zwemles, speelafspraak) voor overzicht en rust."
      ],
      games: [
        {
          id: "g-y6-treasure",
          title: "Speurtocht met Geheime Briefjes",
          category: "language",
          duration: "20 min",
          energy: "medium",
          brainBenefit: "Maakt leren lezen superspannend zonder dat het als huiswerk voelt.",
          materials: "6 post-it briefjes + kleine verrassing aan het eind",
          howToPlay: "Schrijf 6 korte aanwijzingen op post-its ('KIJK ONDER DE RODE STOEL', 'ZOEK BIJ DE SCHOENEN'). Elk briefje leidt naar de volgende tot de schat gevonden is!",
          funTwist: "Laat je kind daarna zelf 5 briefjes schrijven om voor jou te verstoppen."
        },
        {
          id: "g-y6-bridge",
          title: "Druiven- & Prikkertjes Brug Bouwen",
          category: "cognitive",
          duration: "20 min",
          energy: "low",
          brainBenefit: "Leert 3D-inzicht, constructie en waarom driehoeken zo sterk zijn.",
          materials: "Cocktailprikkers + druiven of kikkererwten",
          howToPlay: "Bouw samen een toren of brug van prikkers en druiven die sterk genoeg is om een speelgoedautootje te dragen.",
          funTwist: "Lekker samen de bouwdruiven opeten als het experiment klaar is!"
        },
        {
          id: "g-y6-dice10",
          title: "Verliefde Harten Dobbel-Race (Samen 10 Maken)",
          category: "cognitive",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Automatiseert de 'vriendjes van 10' (dé belangrijkste rekenbasis in groep 3/4).",
          materials: "2 dobbelstenen + papier en pen",
          howToPlay: "Gooi om de beurt een dobbelsteen en roep zo snel mogelijk welk getal er nog bij moet om samen 10 te maken (gooi je 4, dan roep je '6!').",
          funTwist: "Gooi met 2 dobbelstenen tegelijk en tel ze razendsnel bij elkaar op."
        },
        {
          id: "g-y6-laser",
          title: "Geheim Agent 'Laser-Gang' Parcours",
          category: "motor",
          duration: "15 min",
          energy: "high",
          brainBenefit: "Traint lichaamsbeheersing, lenigheid en ruimtelijke planning.",
          materials: "Bolletje wol of schilderstape tussen de muren/trapspijlen in de gang",
          howToPlay: "Span 5 of 6 stroken schilderstape of draad kruislings op verschillende hoogtes in de gang. Kan je kind naar de overkant klimmen en tijgeren zonder één 'laserstraal' te raken?",
          funTwist: "Klok de tijd met een stopwatch of laat je kind het parcours voor jou bouwen!"
        },
        {
          id: "g-y6-comics",
          title: "Samen een 4-Vakjes Stripverhaal Tekenen",
          category: "language",
          duration: "15 min",
          energy: "low",
          brainBenefit: "Stimuleert schrijfplezier, humor en verhaallogica.",
          materials: "Vel A4-papier (in 4 vakjes gevouwen) + stiften",
          howToPlay: "Vouw een blaadje in 4 vakjes. Jij tekent vakje 1 met een tekstballonnetje, je kind tekent vakje 2, jij vakje 3 en je kind verzint de grappige ontknoping in vakje 4!",
          funTwist: "Hang de strip met een magneet op de koelkast."
        },
        {
          id: "g-y6-compliment",
          title: "Het Tafel-Complimenten & 'Hoogtepunt van de Dag'-Spel",
          category: "social",
          duration: "10 min",
          energy: "low",
          brainBenefit: "Versterkt zelfvertrouwen, dankbaarheid en warme verbinding aan tafel.",
          materials: "Geen (tijdens het avondeten)",
          howToPlay: "Iedereen aan tafel noemt: (1) zijn 'Roosje' (leukste moment van vandaag), (2) zijn 'Doorntje' (wat was lastig?), en (3) zijn 'Knopje' (waar heb je morgen zin in?).",
          funTwist: "Geef de persoon links van je een specifiek compliment!"
        }
      ]
    },
    {
      id: "stage-y8-9",
      phaseIndex: 14,
      title: "Schoolkind 8–9 Jaar: Eigen Passies, Koken & Logica (Week 417–520)",
      shortLabel: "8–9 jaar",
      minWeek: 417,
      maxWeek: 520,
      ageRangeLabel: "8 tot 9 Jaar (Groep 5 & 6 • Week 417–520)",
      heroEmoji: "🔭",
      cutType: "plate",
      summary: "Van 'leren lezen' naar 'lezen om te leren'! Je kind duikt diep in eigen interesses, sport in teams, plant grotere projecten en kan al echte gerechten helpen koken.",
      nutrition: {
        milkStatus: "450 ml halfvolle zuivel/kaas + 1,2 tot 1,5 liter water per dag",
        feedsPerDay: "3 maaltijden + 2 tussendoortjes",
        milkVolumeMetric: "450 ml halfvolle zuivel + 1,2–1,5 liter water per dag",
        milkVolumeImperial: "15 oz zuivel + 40–50 oz water per dag",
        solidsPerDay: "3 maaltijden + 2 tussendoortjes (~1.650–2.000 kcal/dag)",
        portionGuideMetric: "150–200 g groente + 4 volkoren boterhammen + 4 opscheplepels volkoren graan/aardappel + 80–100 g eiwit",
        portionGuideImperial: "12–15 oz per maaltijd (~80% van een volwassen portie)",
        pureePath: "Laat je 8–9-jarige één keer per week met een receptenkaart zelf roerei, soep, wraps of pannenkoeken maken.",
        blwPath: "Praat positief over voeding als 'brandstof voor spieren en hersenen' in plaats van 'dikmakers'.",
        bestFoods: [
          { name: "IJzer, Magnesium & Eiwitten voor Sport & Groei", icon: "🥘", note: "Volkoren pasta, linzen, eieren, kip, vis en bananen voor actieve schooldagen." },
          { name: "Dagelijks een Handje Ongezouten Noten (25 g)", icon: "🥜", note: "Gezonde onverzadigde vetten en mineralen." },
          { name: "Zelfgemaakte Havermout-Energieballetjes", icon: "🥣", note: "Ideale snack vóór voetbal, hockey, dans of gym." }
        ],
        avoidFoods: [
          "Geen energiedrankjes en cafeïnehoudende frisdrank (verstoren slaap en concentratie)",
          "Geen schermen aan tafel tijdens het eten (zorgt voor onbewust te veel of te weinig eten)"
        ],
        sampleMenu: [
          "07:15 Halfvolle kwark/yoghurt met muesli, fruit & noten óf 2–3 volkoren boterhammen",
          "10:00 Vers fruit + waterfles",
          "12:30 3–4 volkoren boterhammen met ei/30+ kaas/hummus + rauwkost",
          "15:30 Voor het sporten: Banaan + volkoren mueslibol of handje noten",
          "18:15 Warme maaltijd met 150–200 g groente"
        ],
        recipes: [
          {
            title: "Zelfgerolde Havermout-Pindakaas Energieballetjes",
            mealType: "tussendoor",
            prepTime: "5 min (zonder bakken!)",
            ingredients: ["100 g havermout", "3 el 100% pindakaas", "1 el honing", "1 el lijnzaad of kleine pure chocoladedruppels"],
            steps: "Laat je kind alles in een kom kneden en er 10 balletjes van rollen. Bewaar in de koelkast voor na school of vóór het sporten."
          },
          {
            title: "Junior-Chef 'Egg-in-a-Hole' Volkoren Toast met Avocado",
            mealType: "ontbijt",
            prepTime: "5 min",
            ingredients: ["2 volkoren boterhammen", "2 eieren", "1/2 rijpe avocado in plakjes", "Handje cherrytomaatjes"],
            steps: "Steek met een glas een rondje uit het midden van de boterham, leg in de koekenpan, breek het ei precies in het gaatje en bak in 3–4 minuten gaar."
          },
          {
            title: "Gevulde Volkoren Pita 'Grieks Stijl' met Kip, Komkommer & Tzatziki",
            mealType: "lunch",
            prepTime: "5 min",
            ingredients: ["2 volkoren pitabroodjes (geroosterd)", "75 g gerookte of gebakken kipfiletreepjes", "1/3 komkommer & 6 tomaatjes in blokjes", "2 el frisse halfvolle yoghurt-komkommerdip (tzatziki)"],
            steps: "Rooster de volkoren pita's in de broodrooster, snijd open en laat je kind ze royaal vullen met groente, kip en een lepel frisse yoghurtdip."
          },
          {
            title: "5-Minuten Mexicaanse Burrito-Bowl met Zilvervliesrijst & Bonen",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["150 g gekookte zilvervliesrijst", "4 el kidneybonen & 3 el maïs (afgespoeld)", "1/2 rode paprika in blokjes & 1/2 avocado", "2 el halfvolle Griekse yoghurt of kwark & snufje milde paprikapoeder"],
            steps: "Verwarm de rijst met bonen en maïs 3 minuten in de pan en garneer met knapperige paprika, avocado en een dot frisse yoghurt."
          },
          {
            title: "Snelle Wok met Volkoren Noedels, Garnalen/Kip & Roerbakgroente",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["1 blok volkoren eiernoedels", "150 g verse roerbakgroente (peultjes, paprika, taugé)", "80 g kipreepjes, garnalen of tofu-blokjes", "1 el zoutarme ketjap of sesamolie"],
            steps: "Wok de groente en eiwitbron 3 minuten op hoog vuur, voeg de voorgewelde volkoren noedels en een scheutje sesamolie toe en serveer direct."
          },
          {
            title: "Warme Appel-Nacho's met Pindakaas-Drizzle & Walnoten",
            mealType: "tussendoor",
            prepTime: "4 min",
            ingredients: ["1 grote appel in dunne partjes", "1 el 100% pindakaas (even 15 sec verwarmd)", "15 g gehakte ongezouten walnoten", "1 el rozijnen & kaneel"],
            steps: "Leg de appelpartjes als 'nacho's' op een bord, druppel de warme vloeibare pindakaas eroverheen en bestrooi met walnoten en kaneel."
          }
        ]
      },
      healthCB: {
        cbVisit: "Groep 6 of 7 (rond 9–10 jaar): Gezondheidsonderzoek op school door de jeugdverpleegkundige.",
        vaccines: "Geen standaard prik op 8–9 jaar in het vernieuwde RVP-schema (de 2e BMR is vervroegd naar 3 jaar, HPV volgt in het jaar dat je kind 10 wordt en DTP + MenACWY rond 14 jaar; kinderen geboren vóór 2016 krijgen de BMR/DTP-inhaalprik nog wel rond 9 jaar).",
        teeth: "Tot het 10e jaar adviseren tandartsen (Ivoren Kruis) om 's avonds nog steeds even mee te kijken of kort na te poetsen met fluoride-tandpasta (1.000–1.500 ppm)!"
      },
      sleep: {
        totalSleep: "9 tot 11 uur per nacht",
        wakeWindow: "Hele dag (~14 uur)",
        naps: "Geen",
        tip: "Zet schermen 60 minuten voor het slapen uit; blauw licht remt de aanmaak van melatonine aanzienlijk."
      },
      milestones: [
        "Leest vlot dikke kinderboeken en zoekt zelf informatie op over hobby's",
        "Beheerst complexe sport-, zwem- en knutselvaardigheden",
        "Kan zich goed verplaatsen in de gevoelens van anderen",
        "Leert omgaan met zakgeld en eigen spullen plannen"
      ],
      tipsForMom: [
        "Vraag bij vriendschapsgedoe eerst: 'Wil je dat ik alleen even luister, dat we samen meedenken, of dat ik je help?' Kinderen van 8–9 voelen zich daardoor enorm serieus genomen.",
        "Geef vaste eigen verantwoordelijkheden in huis (zoals tafel dekken of 1x per week koken)."
      ],
      games: [
        {
          id: "g-y8-chef",
          title: "Mystery-Box Junior Chef-Kok",
          category: "cognitive",
          duration: "30 min",
          energy: "medium",
          brainBenefit: "Traint plannen, afwegen/rekenen en zelfvertrouwen in de keuken.",
          materials: "4 veilige ingrediënten op het aanrecht",
          howToPlay: "Zet 4 ingrediënten klaar (bijv. wraps, maïs, paprika, kaas/bonen) en laat je kind als Hoofdchef een borrelhapje of lunch bedenken en klaarmaken!",
          funTwist: "Geef aan tafel sterren-complimenten zoals in een echt restaurant."
        },
        {
          id: "g-y8-cipher",
          title: "Geheimschrift & Escape-Room Raadsel",
          category: "cognitive",
          duration: "20 min",
          energy: "low",
          brainBenefit: "Stimuleert logisch redeneren, patroonherkenning en doorzettingsvermogen.",
          materials: "Papier en pen (letter-verschuiving A=D, B=E)",
          howToPlay: "Maak samen een geheim alfabet waarbij elke letter 3 plekken opschuift en schrijf een geheime boodschap die leidt naar de filmkeuze voor het weekend.",
          funTwist: "Schrijf met citroensap ('onzichtbare inkt') op papier en maak het zichtbaar boven een warme lamp."
        },
        {
          id: "g-y8-podcast",
          title: "Familie-Reporter & Interview-Podcast",
          category: "language",
          duration: "15 min",
          energy: "low",
          brainBenefit: "Oefent open vragen stellen, luisteren en samenvatten.",
          materials: "Telefoon met spraakrecorder (of houten lepel als microfoon)",
          howToPlay: "Laat je kind 5 verrassende vragen bedenken om jou of opa/oma te interviewen ('Welk kattenkwaad haalde jij uit toen je 8 was?').",
          funTwist: "Wissel daarna om zodat jij je kind interviewt als 'expert' over zijn favoriete hobby!"
        },
        {
          id: "g-y8-juggle",
          title: "2-Bal Jongleer- & Hand-Oog Challenge",
          category: "motor",
          duration: "12 min",
          energy: "medium",
          brainBenefit: "Versterkt bimanuele oog-handcoördinatie, reactiesnelheid en ruimtelijke timing voor bal- en teamsporten.",
          materials: "2 paar opgerolde sokken of tennisballen",
          howToPlay: "Oefen de 'X-worp': gooi bal 1 van rechts boogvormig naar links, en zodra hij op het hoogste punt is, gooi je bal 2 van links onderlangs naar rechts ('Gooi-gooi, vang-vang!').",
          funTwist: "Probeer het ook samen tegen de muur met klappen tussendoor."
        },
        {
          id: "g-y8-island",
          title: "Onbewoond Eiland: Welke 5 Dingen Neem Jij Mee?",
          category: "social",
          duration: "15 min",
          energy: "low",
          brainBenefit: "Stimuleert onderhandelen, samen beslissingen nemen en elkaars argumenten wegen.",
          materials: "Geen (ideaal aan tafel of in de auto)",
          howToPlay: "Jullie gaan samen een week naar een onbewoond eiland en mogen als team maar 5 spullen meenemen. Overleg tot jullie het allebei eens zijn over de top 5!",
          funTwist: "Wat als één van de 5 dingen een gezelschapsspel of eten moet zijn?"
        },
        {
          id: "g-y8-forbiddenword",
          title: "Het 'Verboden Woord'-Raadspel (30 Seconds Junior)",
          category: "language",
          duration: "15 min",
          energy: "low",
          brainBenefit: "Vergroot woordenschat, synoniemen vinden en creatief omschrijven.",
          materials: "10 kaartjes met woorden erop + timer van 30 seconden",
          howToPlay: "Omschrijf het woord op het kaartje (bijv. 'Pannenkoek') zónder de woorden 'bakken', 'stroop' of 'rond' te gebruiken. Hoeveel raden jullie er in 1 minuut?",
          funTwist: "Laat je kind zelf 10 kaartjes maken over school, sport of dieren."
        }
      ]
    },
    {
      id: "stage-y10-12",
      phaseIndex: 15,
      title: "Tiener-Start 10–12 Jaar: Groeispurt, Brein-Remodeling & Identiteit (Week 521–624)",
      shortLabel: "10–12 jaar",
      minWeek: 521,
      maxWeek: 624,
      ageRangeLabel: "10 tot 12 Jaar (Groep 7 & 8 • Week 521–624)",
      heroEmoji: "🌟",
      cutType: "plate",
      summary: "De brug naar de middelbare school! Een flinke lengtegroeispurt en hersenherbouw vragen om extra calcium, ijzer, eiwitten, goede slaap en een luisterend oor zonder oordeel.",
      nutrition: {
        milkStatus: "Piekmoment voor botopbouw! 3–4 porties halfvolle zuivel/kaas + 1,5 liter water per dag",
        feedsPerDay: "3 stevige maaltijden + 2 voedzame tussendoortjes",
        milkVolumeMetric: "500 ml halfvolle zuivel + 1,5 liter water per dag",
        milkVolumeImperial: "17 oz zuivel + 50 oz water per dag",
        solidsPerDay: "3 maaltijden + 2 stevige tussendoortjes (~1.850–2.400 kcal/dag)",
        portionGuideMetric: "200 g groente + 4–6 volkoren boterhammen + 4–5 opscheplepels volkoren graan/aardappel + 100 g eiwit",
        portionGuideImperial: "15–19 oz per maaltijd (volwaardige portie)",
        pureePath: "10–12-jarigen kunnen zelfstandig een gezonde avondmaaltijd koken (pasta, roerbak, ovenschotel).",
        blwPath: "Zorg voor een 'Gezonde Tiener-Plank' in de koelkast (gekookte eieren, halfvolle kwark, hummus, gesneden fruit, volkoren wraps, ongezouten noten) voor de grote trek na school.",
        bestFoods: [
          { name: "Calcium & Vitamine D voor de Groeispurt", icon: "🥛", note: "Tussen 10 en 14 jaar wordt bijna de helft van de volwassen botmassa opgebouwd!" },
          { name: "IJzerrijke Voeding (Volkoren, Peulvruchten, Vlees, Spinazie)", icon: "🥩", note: "Extra belangrijk bij snelle spiergroei en voor meisjes rond de eerste menstruatie." },
          { name: "Vette Vis, Noten & Volkoren Granen", icon: "🥑", note: "Ondersteunt stemming, geheugen en concentratie in groep 7/8." }
        ],
        avoidFoods: [
          "Geen energiedrankjes of sterke ijskoffie (verstoren slaap en hartslag bij tieners)",
          "Geen maaltijden overslaan of strenge diëten van social media volgen (juist nu zijn bouwstoffen nodig voor de groeispurt)"
        ],
        sampleMenu: [
          "07:00 3 volkoren boterhammen met ei/30+ kaas óf grote kom halfvolle kwark met havermout, bessen & noten",
          "10:15 Vers fruit + volkoren mueslibol + waterfles",
          "12:30 4 volkoren boterhammen of rijkgevulde wrap + rauwkost + halfvolle melk",
          "15:30 Na school: Tosti volkoren / smoothie met halfvolle kwark / handje noten & fruit",
          "18:30 Gezamenlijke warme maaltijd aan tafel (200 g groente)"
        ],
        recipes: [
          {
            title: "Snelle Na-Schoolse Volkoren Quesadilla met Zwarte Bonen",
            mealType: "tussendoor",
            prepTime: "5 min",
            ingredients: ["2 volkoren tortilla wraps", "4 el zwarte bonen of maïs (uitgelekt)", "1/2 paprika in blokjes", "Plakje 30+ kaas & avocado"],
            steps: "Beleg één volkoren wrap met bonen, paprika en kaas, leg de tweede wrap erop en bak in een droge koekenpan in 2 minuten per kant goudbruin."
          },
          {
            title: "Groeispurt Kwark-Bowl met Havermout, Mango & Pompoenpitten",
            mealType: "ontbijt",
            prepTime: "3 min",
            ingredients: ["200 g magere of halfvolle kwark (bomvol calcium & eiwit)", "4 el volkoren havermout", "Handje (diepvries) mangoblokjes of bessen", "1 el pompoenpitten & walnoten"],
            steps: "Schep de kwark in een grote kom en top met havermout, fruit en pompoenpitten (rijk aan ijzer en magnesium voor groeiende spieren)."
          },
          {
            title: "Dubbele Volkoren 'Club-Sandwich' met Ei, Kip & Avocado",
            mealType: "lunch",
            prepTime: "5 min",
            ingredients: ["3 geroosterde volkoren boterhammen", "1 gekookt of gebakken ei", "2 plakjes kipfilet & 1/2 avocado", "Plakjes tomaat, komkommer & 1 el yoghurtsaus"],
            steps: "Stapel de 3 geroosterde volkoren boterhammen met laagjes ei, kip, avocado en tomaat en snijd schuin doormidden voor een stevige groep-7/8 lunch."
          },
          {
            title: "5-Minuten Zalm-Spinazie Pasta met Pesto & Cherrytomaatjes",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["120 g verse volkoren pasta (kooktijd 3 min)", "2 grote handen verse bladspinazie & 8 cherrytomaatjes", "100 g zalmfilet of makreel", "1 el groene pesto & 2 el kookroom light"],
            steps: "Kook de verse pasta met de spinazie in 3 minuten gaar, giet af en roer direct de pesto, gehalveerde tomaatjes en zalm erdoorheen."
          },
          {
            title: "Snelle Kikkererwten-Shakshuka (1-Pans Ei in Tomatensaus)",
            mealType: "warme-hap",
            prepTime: "5 min",
            ingredients: ["200 ml gekruide tomatenpassata", "4 el kikkererwten (uitgelekt) & handje spinazie", "2 eieren", "2 volkoren pitabroodjes om te dippen"],
            steps: "Verwarm de passata met kikkererwten en spinazie in een koekenpan, breek 2 eieren in de saus, leg de deksel op de pan en laat in 3–4 minuten stollen."
          },
          {
            title: "Tiener Sport-Herstel Shake (Banaan, Kwark & Cacao)",
            mealType: "tussendoor",
            prepTime: "3 min",
            ingredients: ["200 ml halfvolle melk", "3 flinke el halfvolle kwark", "1 rijpe banaan + 3 el havermout", "1 tl 100% pure cacaopoeder & 1 tl pindakaas"],
            steps: "Blend alles in 45 seconden tot een romige chocolade-bananenshake zonder toegevoegde suikers. Ideaal na een zware voetbal-, hockey- of danstraining!"
          }
        ]
      },
      healthCB: {
        cbVisit: "Groep 7/8 (10–11 jaar): Gezondheidsgesprek op school ter voorbereiding op de brugklas.",
        vaccines: "Jaar dat je kind 10 wordt: HPV-vaccinatie (voor jongens én meisjes, 2 prikken met 6 maanden tussenpoos). Daarna volgt rond 14 jaar nog de DTP- en Meningokokken ACWY-vaccinatie (RVP 2025/2026).",
        teeth: "De laatste melkkiezen en hoektanden wisselen tussen 10 en 12 jaar; controleer bij de tandarts of een beugel nodig is."
      },
      sleep: {
        totalSleep: "9 tot 11 uur per nacht",
        wakeWindow: "Hele dag (~14–15 uur)",
        naps: "Geen",
        tip: "Laat telefoons en tablets 's nachts in de woonkamer of keuken opladen—nooit op de slaapkamer!"
      },
      milestones: [
        "Denkt kritisch en abstract na over de wereld, humor en rechtvaardigheid",
        "Plant zelfstandig huiswerk, sportspullen en eigen verzorging",
        "Kan een volledige maaltijd bereiden en met een budget omgaan",
        "Bereidt zich voor op de overstap naar de middelbare school"
      ],
      tipsForMom: [
        "De beste gesprekken met een 10–12-jarige ontstaan 'zij-aan-zij': tijdens het autorijden, samen fietsen of samen afwassen in plaats van recht tegenover elkaar.",
        "Luister 80% van de tijd en geef pas advies als je kind zich gehoord voelt."
      ],
      games: [
        {
          id: "g-y10-debate",
          title: "Het 'Wissel-van-Kant' Tafel-Debat",
          category: "language",
          duration: "15 min",
          energy: "low",
          brainBenefit: "Traint kritisch denken, inlevingsvermogen en argumenteren.",
          materials: "Leuke stelling tijdens het avondeten",
          howToPlay: "Kies een grappige stelling ('School moet pas om 10:00 uur beginnen'). Iedereen verdedigt 2 minuten zijn mening—en na het belletje moet iedereen de TEGENOVERGESTELDE mening verdedigen!",
          funTwist: "Laat je kind een familie-uitje pitchen binnen een vast budget."
        },
        {
          id: "g-y10-budget",
          title: "€15 Familie-Diner Challenge",
          category: "cognitive",
          duration: "45 min",
          energy: "medium",
          brainBenefit: "Leert budgetteren, gezond samenstellen en zelfstandig koken.",
          materials: "€15 budget + boodschappenlijstje",
          howToPlay: "Geef je kind €15 om zelf een gezond driegangendiner (met minstens 200 g groente p.p.) te bedenken, in te kopen en samen klaar te maken.",
          funTwist: "Maak een foto voor jullie eigen familie-kookboek!"
        },
        {
          id: "g-y10-fakenews",
          title: "Twee Waarheden & Één Sterk Verhaal (Fact-Check)",
          category: "language",
          duration: "12 min",
          energy: "low",
          brainBenefit: "Scherpt kritisch luisteren, mediawijsheid en gezonde scepsis.",
          materials: "Geen (leuk aan tafel of onderweg)",
          howToPlay: "Bedenk allebei 3 bijzondere weetjes of gebeurtenissen waarvan er 2 echt waar zijn en 1 verzonnen. Mag de ander 3 scherpe detective-vragen stellen om de leugen te ontmaskeren?",
          funTwist: "Zoek samen een gek wetenschappelijk weetje op om in je lijstje te verstoppen."
        },
        {
          id: "g-y10-plank",
          title: "Plank- & Balans-Quiz (Fysiek + Brein)",
          category: "motor",
          duration: "10 min",
          energy: "high",
          brainBenefit: "Combineert core-stability in de groeispurt met snelle hersenactivatie.",
          materials: "Vloerkleed of sportmatje + stopwatch",
          howToPlay: "Ga samen in de plank-houding of muurzit staan en speel tegelijkertijd 'Woordketting' (elk volgend dier of land moet beginnen met de laatste letter van het vorige woord).",
          funTwist: "Wie houdt de muurzit én de woordketting het langst vol?"
        },
        {
          id: "g-y10-dilemma",
          title: "Het 'Wat Zou Jij Doen?'-Dilemmaspel",
          category: "social",
          duration: "15 min",
          energy: "low",
          brainBenefit: "Opent diepgaande gesprekken over vriendschap, groepsdruk en eigen waarden richting de middelbare school.",
          materials: "Geen (ideaal tijdens een avondwandeling)",
          howToPlay: "Bespreek samen prikkelende dilemma's zonder goed of fout oordeel: 'Wat doe je als een vriend in een groepsapp een vervelende grap maakt over een klasgenoot?'",
          funTwist: "Deel ook eerlijk een lastig moment dat jij zelf op die leeftijd hebt meegemaakt."
        },
        {
          id: "g-y10-route",
          title: "Zonder-Google-Maps Expeditie (Brugklas-Route)",
          category: "motor",
          duration: "30 min",
          energy: "medium",
          brainBenefit: "Bouwt ruimtelijk oriëntatievermogen en zelfstandigheid in het verkeer op.",
          materials: "Fiets + papieren plattegrond of vooraf bekeken route",
          howToPlay: "Laat je kind vooraf de route naar een nieuwe plek (of de toekomstige middelbare school/sportclub) op de kaart bekijken en daarna als navigator voorop fietsen zonder scherm!",
          funTwist: "Trakteer onderweg op een gezonde snack bij het eindpunt."
        }
      ]
    }
  ],

  // =========================================================================
  // 3. SOS "EERSTE HULP BIJ LASTIGE MOMENTEN" (LEEFTIJDSGERICHT)
  // =========================================================================
  sosCards: [
    {
      id: "sos-fever",
      icon: "🌡️",
      title: "Koorts & Ziek zijn: Wat doen & wanneer bellen?",
      adviceBabyUnder3m: "🚨 BEL DIRECT DE HUISARTS als je baby jonger is dan 3 maanden (Week 1–13) en een temperatuur heeft van 38,0 °C of hoger (rectaal gemeten). Bij 3 maanden (Week 14–16): bel ook dezelfde dag bij ≥38,0 °C. Kleed je baby luchtig aan en bied extra vaak melk aan.",
      adviceBaby3mTo1y: "Bij ≥ 38,0 °C: bied elke 1–2 uur kleine slokjes melk of (vanaf 4–6 mnd) een paar lepeltjes water aan. Bel de huisarts als je baby suf is, kreunt, benauwd is, minder dan de helft drinkt of als de koorts langer dan 3 dagen duurt.",
      adviceToddlerAndUp: "Koorts is een gezonde afweerreactie. Focus op vocht (water, lauwe thee, waterijsje) en rust; eten hoeft even niet. Geef alleen kinderparacetamol (op gewicht) als je kind pijn heeft of niet kan slapen.",
      adviceSchoolAge: "Op de basisschoolleeftijd (4–12 jr) gaat koorts vaak samen met keel-, oor- of griepklachten. Laat je kind regelmatig water of thee drinken en rustig uitzieken. Geef kinderparacetamol gedoseerd op lichaamsgewicht bij flinke hoofdpijn, oorpijn of slecht slapen.",
      whenToCallDoctor: "📞 Bel direct de huisarts bij: baby <3 mnd met ≥38,0 °C, sufheid/moeilijk wekbaar, benauwdheid, rode/paarse vlekjes die niet wegdrukbaar zijn (glas-test), of <50% drinken.",
      whenToCallDoctorSchoolAge: "📞 Bel de huisarts bij: koorts langer dan 5 dagen, sufheid/verwardheid, nekstijfheid, benauwdheid, niet-wegdrukbare vlekjes of <50% drinken."
    },
    {
      id: "sos-picky",
      icon: "🥦",
      title: "Weigert eten of lastige momenten aan tafel",
      adviceBabyUnder3m: "Drinkt je baby onrustig aan borst of fles of laat hij steeds los? Check op een boertje dat dwarszit, een verstopte neus (gebruik zoutoplossing-neusspray), spruw (witte waas in het mondje) of overprikkeling.",
      adviceBaby3mTo1y: "Houdt je baby de lippen stijf op elkaar bij het lepeltje of draait hij het hoofd weg? Stop direct en probeer het morgen vrolijk opnieuw. Tot 1 jaar blijft melk de hoofdvoeding; ontdekkend voelen en kliederen hoort bij het leren!",
      adviceToddlerAndUp: "Strijd aan tafel werkt averechts! Zet bij voedsel-neofobie (1–4 jr) altijd 1 'veilig' onderdeel op het bord (zoals volkorenbrood of komkommer), gebruik een 'Nee-dankjewel-bakje' tegen gooien en haal het bord na 20–25 minuten neutraal weg.",
      adviceSchoolAge: "Geen strijd aan tafel: spreek eventueel 1 'proefhapje' af zonder dwang en laat je kind (4–12 jr) meehelpen met groenten snijden of 1x per week het gezinsmenu kiezen. Houd de sfeer gezellig en vervang een geweigerde maaltijd niet door zoete snacks.",
      whenToCallDoctor: "💡 Gouden regel: Jij bepaalt WAT en WANNEER er op tafel komt; je kind bepaalt OF en HOEVEEL het daarvan eet. Bespreek het op het CB als je kind afvalt of zich structureel verslikt.",
      whenToCallDoctorSchoolAge: "💡 Gouden regel: Jij bepaalt WAT en WANNEER er op tafel komt; je kind bepaalt HOEVEEL het eet. Overleg met de jeugdarts (GGD) of huisarts bij gewichtsverlies of buikklachten."
    },
    {
      id: "sos-sleep",
      icon: "🌙",
      title: "Onrustig slapen, moeilijk inslapen of vroeg wakker",
      adviceBabyUnder3m: "Hazenslaapjes van 30–45 minuten overdag zijn heel normaal. Een draagzak, inbakeren (alleen zolang je baby nog niet rolt!) en witte ruis helpen slaapcycli te koppelen.",
      adviceBaby3mTo1y: "Rond 4, 8 en 11 maanden verstoren nieuwe motorische ontwikkelingsstappen (rollen, kruipen, optrekken tot staan) vaak tijdelijk de slaap. Oefen de nieuwe beweging overdag volop op het speelkleed en houd de kamer donker en voorspelbaar.",
      adviceToddlerAndUp: "Kijk bij dreumes en peuter (1–3 jr) of het middagslaapje niet te laat of te lang is (na 15:00 uur wakker maakt inslapen rond 19:00 uur lastig) en gebruik een duidelijk slaaptrainer-klokje voor vroege vogels.",
      adviceSchoolAge: "Ligt je schoolkind (4–12 jr) lang wakker door een 'vol hoofd' of piekergedachten? Zet alle schermen minstens 1 uur voor bedtijd uit, doe een kort 1-op-1 kletsmomentje op de bedrand (of gebruik een 'piekerdoosje') en lees samen voor.",
      whenToCallDoctor: "💡 Let op: Plotseling veel wakker worden met huilen in liggende houding kan bij baby's en peuters wijzen op oorpijn of doorkomende kiezen.",
      whenToCallDoctorSchoolAge: "💡 Let op: Houdt een inslaapprobleem, nachtangst of snurken met ademstops langer aan? Bespreek het met de huisarts of jeugdgezondheidszorg (GGD)."
    },
    {
      id: "sos-tummy",
      icon: "🍼",
      title: "Krampjes, spugen, buikpijn of harde ontlasting",
      adviceBabyUnder3m: "Darmkrampjes pieken rond 6–8 weken. Fiets rustig met de beentjes, draag je baby in de 'tijger-in-de-boom'-houding op je onderarm en laat halverwege de voeding boeren.",
      adviceBaby3mTo1y: "Bij de start van vaste voeding (4–6 mnd) moeten de darmen wennen. Geef bij hardere ontlasting extra slokjes water, een theelepeltje olijfolie door de groentehap en zachte peer of pruim.",
      adviceToddlerAndUp: "Zorg bij dreumes en peuter voor voldoende water, volkoren vezels (volkorenbrood, havermout, groente, rijpe kiwi) en een ontspannen zithouding op het potje of de wc met een voetenbankje.",
      adviceSchoolAge: "Buikpijn of verstopping bij schoolkinderen (4–12 jr) komt vaak door te weinig drinken op school, de wc op school ophouden of gezonde spanning. Zorg voor een gevulde waterfles, volkoren vezels en een vast rustig wc-moment na het ontbijt en na school.",
      whenToCallDoctor: "📞 Neem contact op met de huisarts bij projectielbraken (met krachtige boog), bloed of slijm bij de ontlasting, of hevige buikpijn met koorts.",
      whenToCallDoctorSchoolAge: "📞 Neem contact op met de huisarts bij aanhoudende verstopping, bloed bij de ontlasting, nachtelijke buikpijn of hevige pijn rechtsonder in de buik."
    },
    {
      id: "sos-tantrum",
      icon: "⚡",
      title: "Onrust, huilbuien, driftbui of ontlading na school",
      adviceBabyUnder3m: "Het 'huiluurtje' tussen 17:00 en 22:00 komt door het verwerken van alle dagprikkels. Huid-op-huidcontact, dimlicht en samen in de draagzak of onder een warme douche brengen rust.",
      adviceBaby3mTo1y: "Tijdens een nieuwe ontwikkelingsstap, scheidingsangst/eenkennigheid (rond 8–9 mnd) of doorkomende tandjes wil je baby dicht bij jou zijn. Troost gerust—een baby onder 1 jaar kun je niet verwennen met nabijheid!",
      adviceToddlerAndUp: "Tijdens een peuter-driftbui (1–3 jr) is het denk-brein tijdelijk 'offline'. Ga op ooghoogte zitten, praat zacht en kort ('Ik zie dat je heel boos bent, ik blijf bij je') en bespreek het pas als de storm voorbij is.",
      adviceSchoolAge: "Boze uitbarsting om 15:00 uur uit school (ontlading na schooltijd door zelfregulatie-moeheid) of pre-puber emoties? Je kind heeft zich de hele schooldag ingehouden en ontlaadt in zijn veilige haven. Stel eerst 30 minuten géén vragen, geef een bijtank-snack en bespreek grenzen pas als het brein weer rustig is.",
      whenToCallDoctor: "💛 Voor mama: Wordt het huilen je even te veel? Leg je baby of peuter veilig in bed, loop 5 minuten naar een andere kamer om rustig adem te halen of bel iemand die even overneemt.",
      whenToCallDoctorSchoolAge: "💛 Voor mama: Loop bij hoog oplopende emoties zelf ook gerust 2 minuten naar de keuken voor een glas water ('Ik koel even af, zo praten we rustig verder')—daarmee geef je direct het beste voorbeeld in emotieregulatie!"
    },
    {
      id: "sos-choking",
      icon: "🫁",
      title: "Kokhalzen vs. Verslikken aan tafel (Eerste Hulp)",
      adviceBabyUnder3m: "Spuugt of proest je baby tijdens de melkvoeding? Haal je baby rustig van de borst of fles, houd hem rechtop tegen je schouder en klop zachtjes op de rug. Voed in een iets rechtere houding (paced bottle feeding).",
      adviceBaby3mTo1y: "Kokhalzen (geluid maken, hoesten, rood aanlopen, tong naar voren) is bij de start van vaste voeding een VEILIGE beschermingsreflex die voorin op de tong ligt. Blijf kalm, praat rustig en ga NOOIT met je vinger in de mond (dan duw je een stukje juist dieper!).",
      adviceToddlerAndUp: "Laat je dreumes of peuter altijd rustig rechtop zittend eten (nooit lopend of in de auto). Snijd druiven, cherrytomaatjes en knakworstjes ALTIJD in de lengte in vieren en geef geen hele noten of popcorn onder 4 jaar.",
      adviceSchoolAge: "Ook bij schoolkinderen (4–12 jr) blijft de regel: rustig zittend eten bij snoeptomaatjes, druiven, noten, popcorn of harde snoepjes (niet tijdens het rennen of stoeien).",
      whenToCallDoctor: "🚨 BEL DIRECT 112 BIJ ECHT STIKKEN: Als je kind plotseling STIL is, geen geluid of hoest meer kan maken en blauw/bleek aanloopt. Geef direct 5 krachtige slagen met de hiel van je hand tussen de schouderbladen (baby voorover op je onderarm met hoofdje lager dan de billen).",
      whenToCallDoctorSchoolAge: "🚨 BEL DIRECT 112 BIJ ECHT STIKKEN: Als je kind niet kan hoesten of praten en naar de keel grijpt. Laat vooroverbuigen en geef 5 krachtige slagen tussen de schouderbladen, gevolgd door 5 buikstoten (Heimlich) indien nodig."
    },
    {
      id: "sos-teeth-cold",
      icon: "🦷",
      title: "Doorkomende Tandjes, Verkoudheid & Oorpijn",
      adviceBabyUnder3m: "Een pasgeboren baby ademt bijna volledig door de neus. Gebruik bij een verstopte neus vóór elke melkvoeding en het slapen 1 druppeltje/spraytje fysiologisch zout (0,9% NaCl) per neusgat. Gebruik géén losse kussens in het babybedje.",
      adviceBaby3mTo1y: "Kwijlen, rode wangen en op alles bijten? Geef een gekoelde bijtring uit de koelkast (nooit uit de vriezer!) of masseer het tandvlees met een schone vinger. Bij neusverkoudheid helpt fysiologisch zout neusspray zodat je baby vrij kan drinken.",
      adviceToddlerAndUp: "Doorkomende kiezen en oorpijn geven vaak extra pijn zodra je kind plat in bed ligt (door druk op het middenoor). Gebruik fysiologisch zout neusspray, bied koud/zacht eten aan (zoals gekoelde yoghurt of fruitpuree) en poets 2x per dag met peutertandpasta.",
      adviceSchoolAge: "Bij wisselende melktanden, kiespijn of verkoudheid met oorpijn: laat goed neussnuiten (één neusgat tegelijk), spoel of spray met fysiologisch zout en poets 2x per dag 2 minuten met junior/volwassen fluoridetandpasta.",
      whenToCallDoctor: "📞 Bel de huisarts bij: oorpijn bij een baby <6 maanden, een loopoor (vocht/pus uit het oor), een afstaand oor, of oorpijn met koorts die na 3 dagen niet verbetert.",
      whenToCallDoctorSchoolAge: "📞 Bel de huisarts bij: oorpijn die na 3 dagen niet afneemt, een loopoor dat langer dan 1 week duurt, of oorpijn met hoge koorts en sufheid."
    }
  ],

  // =========================================================================
  // 4. TOP 9 ALLERGENEN GIDS & AFVINKLIJST
  // =========================================================================
  allergens: [
    {
      id: "alg-peanut",
      name: "Pinda (100% Pindakaas)",
      icon: "🥜",
      minAgeMonths: 4,
      whyEarly: "Starten tussen 4 en 8 maanden verlaagt de kans op pinda-allergie met tot wel 80%!",
      safePrep0to3m: "Wacht tot 4 maanden (Week 17). Tot 4 maanden krijgt je baby uitsluitend borst- of kunstvoeding.",
      safePrep4to5m: "Oefenhapje (4–5 mnd): Roer 1/2 tot 1 theelepel gladde 100% pindakaas (zonder zout/stukjes) los door een warm glad groente- of fruithapje. Geef nooit een losse klodder van de lepel.",
      safePrep6to12m: "Roer 1 theelepel gladde 100% pindakaas door een groente-/fruithapje of pap, of smeer flinterdun op zacht brood (geef minstens 1x per week om tolerantie te behouden).",
      safePrep1to4y: "Dun gesmeerd op volkorenbrood of door de havermout. Geef géén hele pinda's onder 4 jaar vanwege verslikkingsgevaar.",
      safePrep4to12y: "100% pindakaas op volkorenbrood, als appeldip of een klein handje ongezouten pinda's (alleen rustig zittend)."
    },
    {
      id: "alg-egg",
      name: "Kippenei (Eigeel & Eiwit)",
      icon: "🥚",
      minAgeMonths: 4,
      whyEarly: "Vroege introductie van goed verhit ei (vanaf 4–6 maanden) voorkomt ei-allergie.",
      safePrep0to3m: "Wacht tot 4 maanden (Week 17). Tot 4 maanden krijgt je baby uitsluitend borst- of kunstvoeding.",
      safePrep4to5m: "Oefenhapje (4–5 mnd): Prak 1/4 tot 1/2 hardgekookt ei (eigeel én eiwit goed gestold) met wat kookvocht en olijfolie helemaal glad door een groente- of aardappelpuree.",
      safePrep6to12m: "Prak een hardgekookt ei door groente/aardappel, of geef vanaf 6 maanden vingerlange reepjes goed doorbakken omelet.",
      safePrep1to4y: "Roerei, gekookt ei op volkorenbrood of een groente-omelet.",
      safePrep4to12y: "Gekookt ei in de schooltrommel, roerei, omelet of ei-muffins."
    },
    {
      id: "alg-treenut",
      name: "Noten (Amandel, Cashew, Hazelnoot)",
      icon: "🌰",
      minAgeMonths: 4,
      whyEarly: "Bouwt tolerantie op voor boomnoten via 100% gladde notenpasta.",
      safePrep0to3m: "Wacht tot 4–6 maanden. Tot 4 maanden krijgt je baby uitsluitend borst- of kunstvoeding.",
      safePrep4to5m: "Oefenhapje (4–5 mnd): Roer 1/2 theelepel gladde 100% amandel- of cashewpasta los door een warm glad fruithapje.",
      safePrep6to12m: "Roer 1/2 tot 1 theelepel gladde 100% amandel-, cashew- of gemengde notenpasta door fruit, pap of op brood.",
      safePrep1to4y: "Gladde 100% notenpasta op brood of door de pap. Nog géén hele noten onder 4 jaar.",
      safePrep4to12y: "Elke dag een klein handje (15–25 g) ongezouten noten of 100% notenpasta op brood."
    },
    {
      id: "alg-wheat",
      name: "Tarwe / Gluten",
      icon: "🌾",
      minAgeMonths: 4,
      whyEarly: "Rustig opbouwen vanaf 4–6 maanden laat de darmen wennen aan gluten.",
      safePrep0to3m: "Wacht tot minstens 4 maanden (Week 17). Darmen zijn tot 4 maanden alleen rijp voor melk.",
      safePrep4to5m: "Oefenhapje (4–5 mnd): 1 theelepeltje fijne baby-granenpap met gluten door de melk of door een glad fruithapje.",
      safePrep6to12m: "Fijne havermout-/tarwepap, zachtgekookte pastaspiraaltjes of vanaf 6–7 maanden stukjes lichtbruin brood.",
      safePrep1to4y: "Volkorenbrood, volkorenpasta, havermout en volkoren couscous.",
      safePrep4to12y: "Volkorenbrood, volkoren wraps, volkorenpasta en havermout voor stabiele schoolenergie."
    },
    {
      id: "alg-dairy",
      name: "Koemelk / Zuivel (Yoghurt)",
      icon: "🧀",
      minAgeMonths: 6,
      whyEarly: "Laat het immuunsysteem wennen aan melkeiwitten en levert calcium.",
      safePrep0to3m: "Via borstvoeding of standaard zuigelingenmelk (Nr. 1). Geef géén gewone koemelk of yoghurt onder 6 maanden.",
      safePrep4to5m: "Blijf bij borst- of kunstvoeding (Nr. 1); start pas vanaf 6 maanden met een lepeltje ongezoete yoghurt als bijvoeding.",
      safePrep6to12m: "Geef vanaf 6–8 maanden een paar lepeltjes ongezoete halfvolle of volle yoghurt. Vervang borst-/kunstvoeding pas vanaf 12 maanden door gewone halfvolle melk.",
      safePrep1to4y: "300 ml halfvolle melk, karnemelk of ongezoete halfvolle yoghurt per dag.",
      safePrep4to12y: "300–450 ml halfvolle melk/yoghurt en een plakje 30+ kaas op volkorenbrood."
    },
    {
      id: "alg-sesame",
      name: "Sesam (Tahin / Hummus)",
      icon: "🌻",
      minAgeMonths: 6,
      whyEarly: "Rijk aan calcium en ijzer; tijdige introductie voorkomt sesamallergie.",
      safePrep0to3m: "Wacht tot 6 maanden. Tot 4 maanden alleen borst- of kunstvoeding.",
      safePrep4to5m: "Focus bij 4–5 maanden eerst op pinda, ei, groente en fruit; start vanaf 6 maanden met een mespuntje 100% tahin of zoutarme hummus.",
      safePrep6to12m: "Verdunde tahin (100% sesampasta) door groente of zoutarme hummus op brood.",
      safePrep1to4y: "Hummus als broodbeleg of groentedip.",
      safePrep4to12y: "Hummus met rauwkost in de schooltrommel of geroosterde sesamzaadjes over een rijstbowl."
    },
    {
      id: "alg-fish",
      name: "Vis (Zalm, Witvis)",
      icon: "🐟",
      minAgeMonths: 6,
      whyEarly: "Levert essentiële DHA omega-3 vetzuren voor hersenen en ogen.",
      safePrep0to3m: "Wacht tot 6 maanden (via borstvoeding of DHA in zuigelingenmelk krijgt je baby nu al omega-3 binnen).",
      safePrep4to5m: "Wacht tot 6 maanden met vis bij de warme maaltijd.",
      safePrep6to12m: "Goed gegaarde zalm of kabeljauw, zorgvuldig met de vingers gecontroleerd op graatjes.",
      safePrep1to4y: "1x per week vette of magere vis bij de warme maaltijd of op brood.",
      safePrep4to12y: "1x per week vette vis (zoals zalm) voor concentratie en geheugen op school."
    },
    {
      id: "alg-soy",
      name: "Soja (Tofu & Edamame)",
      icon: "🌱",
      minAgeMonths: 6,
      whyEarly: "Volwaardig plantaardig eiwit rijk aan ijzer.",
      safePrep0to3m: "Wacht tot 6 maanden met soja in bijvoeding.",
      safePrep4to5m: "Focus bij 4–5 maanden eerst op groente, fruit, pinda en ei; start met tofu of edamame vanaf 6 maanden.",
      safePrep6to12m: "Zachte reepjes tofu meegebakken in olijfolie of fijngeprakte edamame boontjes.",
      safePrep1to4y: "Tofublokjes, edamame, sojayoghurt of verrijkte ongezoete sojadrink (12m+).",
      safePrep4to12y: "Krokante tofublokjes in roerbakgerechten of edamame boontjes als gezonde snack."
    },
    {
      id: "alg-shellfish",
      name: "Schaal- & Schelpdieren",
      icon: "🦐",
      minAgeMonths: 6,
      whyEarly: "Maakt de top 9 allergenen compleet vanaf 6 maanden.",
      safePrep0to3m: "Wacht tot minstens 6 maanden.",
      safePrep4to5m: "Wacht tot minstens 6 maanden.",
      safePrep6to12m: "Goed doorbakken garnaal heel fijngehakt door rijst of groentepuree (hele garnalen zijn te stug).",
      safePrep1to4y: "Fijngesneden goed verhitte garnaaltjes of viskoekjes.",
      safePrep4to12y: "Goed verhitte garnalen of witvis/schaaldieren in pasta of paella."
    }
  ],

  // =========================================================================
  // 5. "MAG MIJN KIND DIT ETEN?" VOEDINGS- & SNIJGIDS
  // =========================================================================
  foodDatabase: [
    {
      id: "fd-avocado",
      name: "Avocado",
      icon: "🥑",
      category: "Fruit & Vetten",
      minAgeMonths: 4,
      nutrients: "Gezonde hersenvetten, vezels, foliumzuur",
      prep4to5m: "Oefenhapje (4–5 mnd): Prak een stukje zachte rijpe avocado met een vork en eventueel een paar druppels borst-/kunstvoeding of water tot een fluweelzachte puree.",
      prep6to8m: "Puree: Fijnprakken met een vork. Rapley: Snijd een rijpe avocado in vingerlange repen (rol evt. door fijngemalen havermout tegen het wegglijden).",
      prep9to12m: "Kleine zachte blokjes (1x1 cm) of geprakt op een stukje brood.",
      prep1to3y: "In blokjes, plakjes of als guacamole-dip.",
      prep4to12y: "Op volkoren toast, in salades of wraps."
    },
    {
      id: "fd-banana",
      name: "Banaan",
      icon: "🍌",
      category: "Fruit & Vetten",
      minAgeMonths: 4,
      nutrients: "Kalium, vitamine B6, snelle energie",
      prep4to5m: "Oefenhapje (4–5 mnd): Prak een stukje goed rijpe banaan helemaal glad met een vork (voeg evt. een theelepeltje lauw water of melk toe).",
      prep6to8m: "Puree: Geprakt. Rapley: Halveer de banaan en snijd 2 cm schil weg zodat de onderkant een handvat vormt, óf duw met je vinger in de lengte in 3 natuurlijke repen.",
      prep9to12m: "Halve maandjes of kleine blokjes.",
      prep1to3y: "Plakjes of zelf afhappen van een gepelde banaan.",
      prep4to12y: "Los uit het vuistje of door de havermout."
    },
    {
      id: "fd-broccoli",
      name: "Broccoli & Bloemkool",
      icon: "🥦",
      category: "Groente",
      minAgeMonths: 4,
      nutrients: "Vitamine C, vitamine K, vezels",
      prep4to5m: "Oefenhapje (4–5 mnd): Stoom broccoli- of bloemkoolroosjes goed gaar en pureer met een scheutje kookvocht en een druppel olijfolie tot een gladde puree.",
      prep6to8m: "Puree: Zacht stomen en pureren. Rapley: Stoom grote roosjes zacht; het steeltje is het perfecte handvat!",
      prep9to12m: "Kleine zachtgekookte roosjes om met de pincetgreep te pakken.",
      prep1to3y: "Gestoomde of geroosterde 'dino-boompjes'.",
      prep4to12y: "Gestoomd of geroosterd uit de oven."
    },
    {
      id: "fd-carrot",
      name: "Wortel, Pompoen & Zoete Aardappel",
      icon: "🥕",
      category: "Groente",
      minAgeMonths: 4,
      nutrients: "Bèta-caroteen (vitamine A), vezels",
      prep4to5m: "Oefenhapje (4–5 mnd): Kook of stoom blokjes wortel, pompoen of zoete aardappel boterzacht en pureer helemaal glad met wat kookvocht.",
      prep6to8m: "Puree: Zacht koken en pureren. Rapley: Snijd wortel ALTIJD in de lengte in repen (geen ronde schijfjes!) en kook zacht tot je het makkelijk kunt pletten.",
      prep9to12m: "Zachtgekookte blokjes of halve schijfjes.",
      prep1to3y: "Gekookte wortel of fijn geraspte rauwe wortel (geen harde rauwe stukken onder 4 jaar).",
      prep4to12y: "Knapperige rauwe snackworteltjes of gekookt."
    },
    {
      id: "fd-cucumber",
      name: "Komkommer, Paprika & Courgette",
      icon: "🥒",
      category: "Groente",
      minAgeMonths: 4,
      nutrients: "Vitamine C, vocht, vezels",
      prep4to5m: "Oefenhapje (4–5 mnd): Stoom geschilde courgette zacht en pureer glad. Rauwe komkommer en paprika zijn op deze leeftijd nog te hard.",
      prep6to8m: "Courgette/paprika: Zacht stomen in vingerlange repen (verwijder velletjes). Komkommer: Schil en geef alleen het zachte zaadlijsten-middenstuk in lange repen.",
      prep9to12m: "Dunne halve plakjes geschilde komkommer of zacht gestoofde blokjes paprika en courgette.",
      prep1to3y: "Komkommerstaafjes en dunne reepjes rauwe rode/gele paprika (lekker met hummus).",
      prep4to12y: "Rauwkostreepjes in de schooltrommel of als snack om 17:00 uur."
    },
    {
      id: "fd-egg",
      name: "Ei",
      icon: "🥚",
      category: "Eiwit & IJzer",
      minAgeMonths: 4,
      nutrients: "Choline, ijzer, vitamine B12, eiwit",
      prep4to5m: "Oefenhapje (4–5 mnd): Kook het ei hard (10 min) en prak of pureer 1/4 tot 1/2 ei helemaal glad door een warm groente- of aardappelhapje (vroege introductie!).",
      prep6to8m: "Puree: Hardgekookt ei prakken door groente. Rapley (6m+): Goed doorbakken platte omelet in reepjes van 2 vingers breed.",
      prep9to12m: "Stukjes roerei of partjes hardgekookt ei (geen rauw/zachtgekookt eigeel onder 1 jaar).",
      prep1to3y: "Gekookt, roerei of omelet.",
      prep4to12y: "Alle bereidingen."
    },
    {
      id: "fd-peanutbutter",
      name: "100% Pindakaas & Notenpasta",
      icon: "🥜",
      category: "Eiwit & IJzer",
      minAgeMonths: 4,
      nutrients: "Onverzadigde vetten, plantaardig eiwit, vitamine E",
      prep4to5m: "Oefenhapje (4–5 mnd): Geef NOOIT een losse lik van een lepel! Roer 1/2 tot 1 theelepel gladde 100% pindakaas (zonder zout/stukjes) los door een warm glad groente- of fruithapje.",
      prep6to8m: "Geef NOOIT een dikke klodder pindakaas van een lepel (plakt in de keel). Roer gladde 100% pindakaas los met warm water/fruit óf smeer flinterdun op brood.",
      prep9to12m: "Dun gesmeerd op lichtbruin brood of door de pap.",
      prep1to3y: "Dun op volkorenbrood of crackers (nog geen pindakaas met stukjes noot).",
      prep4to12y: "Op brood, als appeldip én vanaf 4 jaar een klein handje hele ongezouten noten."
    },
    {
      id: "fd-blueberry",
      name: "Blauwe Bessen & Aardbeien",
      icon: "🍓",
      category: "Fruit & Vetten",
      minAgeMonths: 6,
      nutrients: "Vitamine C (bevordert ijzeropname!), antioxidanten",
      prep4to5m: "Wacht tot 6 maanden met rauwe bessen (of pureer ze volledig glad zonder velletjes door een fruithapje).",
      prep6to8m: "Blauwe bessen ALTIJD platdrukken tussen duim en wijsvinger! Aardbeien geprakt of hele grote rijpe aardbeien om op te sabbelen.",
      prep9to12m: "Geplette blauwe bessen en aardbeien in kwartjes.",
      prep1to3y: "Halveer of plet grote stevige blauwe bessen t/m 3 jaar.",
      prep4to12y: "Los uit de hand of door de yoghurt."
    },
    {
      id: "fd-grapes",
      name: "Druiven & Cherrytomaatjes",
      icon: "🍇",
      category: "Fruit & Vetten",
      minAgeMonths: 6,
      nutrients: "Vitamine C, lycopeen, vocht",
      prep4to5m: "Nog niet geschikt voor 4–5 maanden vanwege de stugge velletjes en ronde vorm.",
      prep6to8m: "Snijd ALTIJD in de lengte in 4 smalle kwartjes! Hele druiven en tomaatjes hebben precies de maat van de luchtpijp.",
      prep9to12m: "In de lengte in vieren gesneden.",
      prep1to3y: "Blijf druiven en cherrytomaatjes in de lengte in vieren of halveren tot minstens 4–5 jaar!",
      prep4to12y: "Gehalveerd (4 jaar) of rustig zittend heel (vanaf 5 jaar)."
    },
    {
      id: "fd-apple",
      name: "Appel & Peer",
      icon: "🍎",
      category: "Fruit & Vetten",
      minAgeMonths: 4,
      nutrients: "Voedingsvezels, vitamine C",
      prep4to5m: "Oefenhapje (4–5 mnd): Schil en kook/stoom appel of peer helemaal zacht en pureer glad. Geef géén rauwe harde appel.",
      prep6to8m: "Rauwe harde appel geeft hoog verslikkingsgevaar! Stoom appelpartjes zacht (of gebruik rijpe zachte peer) óf rasp rauwe appel fijn.",
      prep9to12m: "Zacht gestoofde blokjes appel, geraspte appel of flinterdunne schijfjes.",
      prep1to3y: "Flinterdunne partjes zonder harde schil of zachte peer.",
      prep4to12y: "Appelpartjes met schil of een hele appel."
    },
    {
      id: "fd-meat-fish",
      name: "Vlees, Kip, Zalm & Linzen",
      icon: "🥩",
      category: "Eiwit & IJzer",
      minAgeMonths: 6,
      nutrients: "Heem-ijzer, zink, omega-3 (vis), eiwit",
      prep4to5m: "Start bij 4–5 maanden eerst met groente, fruit, ei en pindakaas; vanaf 6 maanden zijn vlees, vis en peulvruchten dagelijks nodig voor ijzer.",
      prep6to8m: "Puree: Meegepureerd met groente. Rapley: Zachte grote vlokken zalm (check op graatjes!), mals gestoofde reepjes kip/rund of zachte linzen.",
      prep9to12m: "Fijngesneden mals vlees, gehaktballetje (zonder zout), visvlokken of geplette bonen.",
      prep1to3y: "Mee-eten met de gezinsmaaltijd (geen rauw vlees zoals tartaar of filet americain).",
      prep4to12y: "Alle gezonde bereidingen."
    },
    {
      id: "fd-bread-oats",
      name: "Brood & Havermout",
      icon: "🍞",
      category: "Zuivel & Granen",
      minAgeMonths: 6,
      nutrients: "Jodium (brood!), ijzer, B-vitamines, vezels",
      prep4to5m: "Wacht met brood tot 6–7 maanden; een theelepeltje fijne baby-granenpap door melk of fruit mag wel om aan gluten te wennen.",
      prep6to8m: "Start rond 6–7 maanden met een lichtbruin broodkorstje om op te sabbelen of fijne havermoutpap.",
      prep9to12m: "Blokjes lichtbruin/volkoren brood met zachte margarine en 100% pindakaas of ei.",
      prep1to3y: "2 tot 3 volkoren boterhammen per dag.",
      prep4to12y: "3 tot 6 volkoren boterhammen per dag afhankelijk van de leeftijd."
    },
    {
      id: "fd-pasta-rice",
      name: "Pasta, Rijst & Couscous",
      icon: "🍝",
      category: "Zuivel & Granen",
      minAgeMonths: 6,
      nutrients: "Complexe koolhydraten, B-vitamines, vezels",
      prep4to5m: "Vanaf 6 maanden als onderdeel van de warme maaltijd.",
      prep6to8m: "Puree: Gekookte rijst of pasta meepureren met groente. Rapley: Grote zachtgekookte volkoren fusilli of penne (makkelijk vast te pakken).",
      prep9to12m: "Zachtgekookte pasta-stukjes, zilvervliesrijst of couscous gemengd met groente of avocado zodat het plakt.",
      prep1to3y: "2–3 eetlepels volkoren pasta, couscous of zilvervliesrijst bij de avondmaaltijd.",
      prep4to12y: "Volkoren varianten als energiebron voor school en sport."
    },
    {
      id: "fd-cheese",
      name: "Kaas, Hüttenkäse & Zuivelspread",
      icon: "🧀",
      category: "Zuivel & Granen",
      minAgeMonths: 6,
      nutrients: "Calcium, eiwit, vitamine B12",
      prep4to5m: "Wacht tot minstens 6 maanden (nieren zijn nog gevoelig voor zout en eiwit).",
      prep6to8m: "Kies zoutarme hüttenkäse, ricotta of lichte zuivelspread dun op brood. Gewone harde kaas bevat nog te veel zout.",
      prep9to12m: "Hüttenkäse, zuivelspread light of 20+/30+ Milner/jonge kaas met minder zout (max. 15 g per dag, geen rauwmelkse kaas).",
      prep1to3y: "Op brood of door een gerecht (kies bij voorkeur minder zoute 30+ kaas en vermijd rauwmelkse kaas).",
      prep4to12y: "Plakje 30+ kaas op volkorenbrood of hüttenkäse."
    },
    {
      id: "fd-crackers",
      name: "Maisvingers & Volkoren Cracker",
      icon: "🍘",
      category: "Zuivel & Granen",
      minAgeMonths: 6,
      nutrients: "Lichte energie, oefening voor kaakspieren en hand-mondcoördinatie",
      prep4to5m: "Wacht tot 6 maanden wanneer je baby rechtop kan zitten.",
      prep6to8m: "Zoutloze maisvingers smelten direct op de tong en zijn ideaal om zelf vast te houden.",
      prep9to12m: "Zoutloze maisvinger of volkoren cracotte (geef niet dagelijks rijstwafels i.v.m. arseen in rijst).",
      prep1to3y: "Volkoren cracker of soepstengel met hummus, zuivelspread light of 100% pindakaas (wissel af en geef niet dagelijks rijstwafels).",
      prep4to12y: "Volkoren crackers met gezond beleg als tussendoortje na school."
    },
    {
      id: "fd-water-tea",
      name: "Water & Thee",
      icon: "💧",
      category: "Zuivel & Granen",
      minAgeMonths: 6,
      nutrients: "Hydratatie zonder suiker",
      prep4to5m: "Tot 6 maanden haalt je baby al het vocht uit borst- of kunstvoeding (eventueel 1–2 oefenslokjes lauw water uit een open bekertje).",
      prep6to8m: "Geef na de oefenhapjes een paar slokjes water uit een klein open bekertje (geen venkel- of anijsthee voor baby's!).",
      prep9to12m: "Water of lauwe slappe rooibos-/vruchtenthee zonder suiker uit een open beker of rietjesbeker naast de melkvoedingen.",
      prep1to3y: "450–700 ml water of lauwe thee zonder suiker per dag naast 300 ml zuivel (geen venkelthee onder 4 jaar).",
      prep4to12y: "1 tot 1,5 liter water of ongezoete thee per dag (vaste waterfles mee naar school)."
    },
    {
      id: "fd-honey",
      name: "Honing",
      icon: "🍯",
      category: "Zuivel & Granen",
      minAgeMonths: 12,
      nutrients: "Natuurlijke suikers",
      prep4to5m: "🚫 VERBODEN ONDER 1 JAAR! Honing kan sporen bevatten van de botulisme-bacterie waar baby's onder 12 maanden ernstig ziek van worden.",
      prep6to8m: "🚫 VERBODEN ONDER 1 JAAR! Honing kan sporen bevatten van de botulisme-bacterie waar baby's onder 12 maanden ernstig ziek van worden.",
      prep9to12m: "🚫 VERBODEN ONDER 1 JAAR! Wacht tot na de eerste verjaardag.",
      prep1to3y: "✅ Veilig vanaf 1 jaar (met mate gebruiken vanwege suiker; 1/2 tl honing helpt wel goed bij nachtelijke kriebelhoest).",
      prep4to12y: "Veilig met mate."
    },
    {
      id: "fd-dairy",
      name: "Gewone Melk & Yoghurt",
      icon: "🥛",
      category: "Zuivel & Granen",
      minAgeMonths: 6,
      nutrients: "Calcium, vitamine B2 & B12, eiwit",
      prep4to5m: "Onder 6 maanden alleen borstvoeding of standaard zuigelingenmelk (Nr. 1); nog geen yoghurt of gewone koemelk.",
      prep6to8m: "Vanaf 6–8 maanden mag een klein schaaltje ongezoete halfvolle of volle yoghurt. Gewone koemelk als hoofdvoeding pas vanaf 1 jaar!",
      prep9to12m: "Schaaltje ongezoete yoghurt als toetje; melkvoeding blijft borst- of opvolgmelk.",
      prep1to3y: "✅ Vanaf 1 jaar: 300 ml gewone halfvolle melk/yoghurt per dag uit een beker (max 450 ml per dag zodat de ijzeropname goed blijft).",
      prep4to12y: "300–500 ml halfvolle melk/yoghurt en een plakje 30+ kaas per dag."
    },
    {
      id: "fd-mango-kiwi",
      name: "Mango, Kiwi & Meloen",
      icon: "🥭",
      category: "Fruit & Vetten",
      minAgeMonths: 4,
      nutrients: "Vitamine C (extra hoog in kiwi!), vezels, vocht",
      prep4to5m: "Oefenhapje (4–5 mnd): Prak of pureer een stukje zachte rijpe mango, meloen of zoete (gele) kiwi helemaal glad.",
      prep6to8m: "Puree: Geprakt. Rapley: Snijd een grote vingerlange reep met een strookje schil aan de onderkant als handvat, óf rol gladde stukken door fijne havermout of geraspte kokos voor grip.",
      prep9to12m: "Kleine zachte blokjes (1x1 cm) van rijpe mango, kiwi of watermeloen (zonder pitjes).",
      prep1to3y: "In blokjes, partjes of een gehalveerde kiwi om zelf met een lepeltje uit te lepelen.",
      prep4to12y: "In de fruitbak voor school, door de yoghurt of als frisse zomersnack."
    },
    {
      id: "fd-raisins",
      name: "Rozijntjes & Gedroogd Fruit",
      icon: "🍇",
      category: "Fruit & Vetten",
      minAgeMonths: 9,
      nutrients: "Vezels, ijzer, snelle energie (let op: plakt aan tanden)",
      prep4to5m: "Nog niet geschikt voor 4–5 maanden (te taai en plakt in het mondje).",
      prep6to8m: "Wacht met losse rozijntjes tot circa 9 maanden; je kunt wel een rozijntje meekoken met appel en volledig gladpureren.",
      prep9to12m: "Wel rozijntjes eerst 5 minuten in warm water zodat ze zacht zijn en halveer grote rozijnen — ideaal om de pincetgreep te oefenen!",
      prep1to3y: "Max. 1 klein doosje rozijntjes en altijd op 1 vast eetmoment (Ivoren Kruis: geef ze niet verspreid over de middag i.v.m. gaatjes en geef er een beker water bij).",
      prep4to12y: "Met mate als tussendoortje op 1 vast eetmoment (bij voorkeur vers fruit kiezen voor het gebit)."
    },
    {
      id: "fd-sausage-popcorn",
      name: "Worstjes (Knakworst) & Popcorn",
      icon: "🌭",
      category: "Eiwit & IJzer",
      minAgeMonths: 12,
      nutrients: "Let op: hoog verstikkings- en zoutgevaar bij jonge kinderen!",
      prep4to5m: "🚫 NIET GEVEN! Veel te zout voor de nieren en hoog verstikkingsgevaar.",
      prep6to8m: "🚫 NIET GEVEN ONDER 1 JAAR! Knakworst en rookworst bevatten te veel zout en verzadigd vet voor een baby; popcorn geeft acuut verstikkingsgevaar.",
      prep9to12m: "🚫 NIET GEVEN ONDER 1 JAAR! Kies liever een zelfgemaakt runder- of kipgehaktballetje zonder zout.",
      prep1to3y: "⚠️ Knakworst/rookworst (af en toe): snijd ALTIJD eerst in de lengte in vieren en daarna in stukjes (NOOIT ronde munt-schijfjes!). 🚫 Popcorn: nog NIET geven onder 4 jaar vanwege scherp vliesje en verslikkingsgevaar.",
      prep4to12y: "Knakworst rustig zittend eten. Popcorn mag vanaf 4–5 jaar uitsluitend rustig zittend (nooit tijdens het rennen of spelen)."
    },
    {
      id: "fd-liver-raw",
      name: "Smeerleverworst, Paté & Rauw Vlees/Vis",
      icon: "🥪",
      category: "Eiwit & IJzer",
      minAgeMonths: 6,
      nutrients: "IJzer, vitamine B12 (let op vitamine A & bacteriën)",
      prep4to5m: "Wacht met broodbeleg tot minstens 6–7 maanden.",
      prep6to8m: "Kies liever 100% pindakaas, geprakt ei of zoutarme hummus op brood. Geef maximaal 1 boterham met smeerleverworst per week (vanwege te veel vitamine A). 🚫 Géén rauw vlees of rauwe vis.",
      prep9to12m: "Voedingscentrum-advies: maximaal 1 boterham met smeerleverworst of paté per week. 🚫 Geef géén filet americain, ossenworst, tartaar of voorverpakte gerookte zalm.",
      prep1to3y: "Smeerleverworst/paté: max. 1 boterham per week (vitamine A-limiet). 🚫 Rauw vlees (filet americain, ossenworst, carpaccio), rauwe vis en voorverpakte gerookte vis pas vanaf 4 jaar geven!",
      prep4to12y: "Smeerleverworst met mate (niet dagelijks). Let bij rauw vlees of gerookte vis altijd op koeling en versheid."
    }
  ]
};
