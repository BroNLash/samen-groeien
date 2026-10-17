# Google Play Store Publicatie- & Verkoopdraaiboek — Samen Groeien

Dit document bevat alle kant-en-klare teksten, beeldmaterialen en formulier-antwoorden die je één-op-één kunt kopiëren naar de **Google Play Console** en **PWABuilder** om *Samen Groeien* als betaalde Android-app te publiceren.

---

## 1. Overzicht van Klaargezette Bestanden in de Repository

| Onderdeel | Bestand in repo | Eisen Google Play | Status |
| :--- | :--- | :--- | :--- |
| **App-icoon (512×512)** | [`icon-512.png`](icon-512.png) | 512×512 px, 32-bit PNG | ✅ Gereed |
| **Maskable Adaptive Icons** | [`icon-maskable-192.png`](icon-maskable-192.png) & [`icon-maskable-512.png`](icon-maskable-512.png) | 80% safe-zone zonder rand-afsnijding | ✅ Gereed |
| **Feature Graphic (1024×500)** | [`feature-graphic-1024x500.png`](feature-graphic-1024x500.png) | 1024×500 px, 24-bit RGB PNG (geen transparantie) | ✅ Gereed |
| **Telefoon-screenshots (4×)** | [`screenshot-1-voeding.png`](screenshot-1-voeding.png) t/m [`screenshot-4-sos-oppas.png`](screenshot-4-sos-oppas.png) | 1080×1920 px (9:16 staand), 24-bit PNG | ✅ Gereed |
| **Zelfstandige Privacy-URL** | [`privacy.html`](privacy.html) | Publieke HTTPS-link met AVG, Data Safety & Gegevens wissen | ✅ Gereed |
| **Digital Asset Links (TWA)** | [`.well-known/assetlinks.json`](.well-known/assetlinks.json) + [`.nojekyll`](.nojekyll) | Verbergt de Chrome-adresbalk in de Android-app | ✅ Gereed (alleen SHA-256 nog invullen na upload) |
| **Android Terug-knop & Shortcuts** | [`app.js`](app.js) & [`manifest.json`](manifest.json) | Systeem-terugknop sluit eerst modals/subtabs + 4 snelkoppelingen | ✅ Gereed |

---

## 2. Kant-en-klare Teksten voor de Winkelpagina (Main Store Listing)

### A. App-naam (max. 30 tekens — hier: 27 tekens)
```text
Samen Groeien: Kind 0-12 jr
```

### B. Korte beschrijving (max. 80 tekens — hier: 77 tekens)
```text
Voeding, snijgids, 5-minuten recepten, slaap, spel & groei voor 0 tot 12 jaar
```

### C. Volledige beschrijving (max. 4.000 tekens — hier: ~2.750 tekens, inclusief verplichte medische disclaimer & bronvermelding)
```text
Samen Groeien is de complete, rustgevende en wetenschappelijk onderbouwde gids voor ouders en verzorgers van kinderen van 0 tot 12 jaar. Ontdek per week, maand en levensjaar precies welke voeding, hoeveelheden, snijvormen, leerspelletjes, slaaptijden en mijlpalen passen bij de leeftijd van jouw kind.

🌱 WAAROM OUDERS KIEZEN VOOR SAMEN GROEIEN
• Direct op maat van jouw kind: Stel de geboortedatum (of uitgerekende datum én eventuele vroeggeboorte) in en de app springt automatisch naar het juiste week-, maand- of jaaradvies.
• Geschikt voor meerdere kinderen: Wissel met één tik tussen broertjes en zusjes en ontvang slimme gezinstips om één maaltijd voor het hele gezin te koken.
• 100% Privé & Offline: Geen account nodig, geen advertenties en geen verborgen trackers. Alle gegevens van je kind blijven uitsluitend lokaal op jouw eigen telefoon.

🥣 1. VOEDING, HOEVEELHEDEN & 5-MINUTEN RECEPTEN
• Duidelijke dagschema's en portiegroottes per leeftijdsfase (van borst-/flesvoeding en eerste oefenhapjes vanaf 4 maanden tot gezinsmaaltijden en gezonde broodtrommels).
• Vitamine D- en Vitamine K-adviezen afgestemd op het voedingstype.
• Gezonde 5-minuten recepten voor ontbijt, lunch, warme hap en tussendoor.
• Combineer meerdere recepten tot één weekboodschappenlijst en deel deze met één tik via WhatsApp.

🔪 2. EET-CHECK, VISUELE SNIJGIDS & TOP-9 ALLERGENEN
• Zoek in 22+ productgroepen (zoals banaan, ei, blauwe bessen, druiven, brood, mango, pindakaas, vlees, vis en rozijntjes).
• Visuele snij-instructies per leeftijd (6–8 mnd, 8–12 mnd en 12+ mnd) om verslikking aan tafel te voorkomen.
• Veilig 3-stappen introductieschema voor de Top-9 allergenen (waaronder pinda en kippenei vanaf 4–8 maanden) inclusief wekelijkse onderhouds-check voor blijvende tolerantie.

🎲 3. LEERSPELLETJES, SLAAPRITME & WAKKERTIJDEN
• Leeftijdsgeschikte spelletjes die motoriek, taalbegrip, geheugen en executieve functies spelenderwijs stimuleren — met spullen die je al in huis hebt.
• Overzichtelijke slaapschema's, wakkertijden en dutjes-overgangen per fase.

📈 4. VAN WIECHEN MIJLPALEN & GROEIDAGBOEK
• Vink ontwikkelingsmijlpalen af voor grove/fijne motoriek, spraak & taal en sociaal-emotionele groei.
• Houd gewicht en lengte bij in de lokale groeicurve (gebaseerd op WHO/TNO-referenties) en bereid je voor op het volgende bezoek aan het consultatiebureau (JGZ).

🆘 5. SOS-HULP BIJ TWIJFEL & 1-TIK OPPAS-KAART
• Praktische eerste-hulpkaarten bij kokhalzen vs. echt verslikken, koorts, doorkomende tandjes & verkoudheid, darmkrampjes, slaapregressie en voedselweigering.
• Genereer met één tik een complete Oppas-Kaart (met dagschema, slaaptijden, allergenen en noodnummers) en stuur deze via WhatsApp naar opa, oma of de gastouder.

📚 WETENSCHAPPELIJKE BRONNEN
Alle richtlijnen in Samen Groeien zijn gebaseerd op openbare Nederlandse en internationale standaarden van:
• Voedingscentrum & Gezondheidsraad (Eerste 1000 dagen & Schijf van Vijf)
• RIVM & Rijksvaccinatieprogramma (RVP)
• Nederlands Centrum Jeugdgezondheid (NCJ / JGZ-richtlijnen & Van Wiechenonderzoek)
• Nederlands Huisartsen Genootschap (NHG-Standaarden)
• Nederlandse Vereniging voor Kindergeneeskunde (NVK) & DAVO (Vroege introductie hoog-allergene bijvoeding)
• Ivoren Kruis (Advies Cariëspreventie) & Rode Kruis (EHBO bij baby's en kinderen)

🩺 MEDISCHE DISCLAIMER
Samen Groeien is uitsluitend bedoeld voor informatieve en educatieve doeleinden voor ouders en verzorgers. Deze app is géén medisch hulpmiddel en vervangt nooit het persoonlijk medisch advies, de diagnose of de behandeling van een arts, verloskundige of het consultatiebureau (JGZ). Raadpleeg bij medische klachten of twijfel altijd een arts en bel bij spoed direct 112.
```

---

## 3. Antwoorden voor de Verplichte Formulieren in Google Play Console (`App Content`)

Onder **Beleid en programma's → App-inhoud (App Content)** in de Google Play Console vul je de onderstaande antwoorden in:

1. **Privacybeleid (Privacy Policy):**
   * Vul de publieke URL naar `privacy.html` in:
     `https://bronlash.github.io/samen-groeien/privacy.html` *(of je eigen domeinnaam + `/privacy.html`)*.
2. **Doelgroep en inhoud (Target Audience and Content) — *Cruciaal!***
   * **Doelleeftijdsgroep:** Vink **uitsluitend `18 jaar en ouder`** aan.
   * **Kan je winkelvermelding onbedoeld kinderen aantrekken?** Kies **Nee**.
   * *Toelichting:* De app is een naslagwerk voor volwassen ouders/verzorgers. Door 18+ te kiezen valt de app niet onder het beperkende kinder-advertentie/linkbeleid.
3. **Gegevensveiligheid (Data Safety):**
   * **Verzamelt of deelt je app vereiste gebruikersgegevens?**
     * Kies **Nee** (of indien je het vrijwillige feedbackformulier wilt declareren: kies **Ja → Alleen optionele app-feedback en optioneel e-mailadres, versleuteld via HTTPS, uitsluitend op initiatief van de gebruiker, nooit gedeeld met derden**).
   * Alle kindprofielen, groeimetingen en mijlpalen blijven 100% lokaal in `localStorage` op het toestel zelf; dit telt volgens de richtlijnen van Google Play **niet** als gegevensverzameling (*"Data stored only locally on the user's device is not considered collected"*).
4. **Gezondheidsapps (Health Apps Declaration):**
   * Vink aan: **Medisch naslagwerk en educatie (Medical reference and education)** en/of **Gezondheidsinformatie**.
   * Geef aan dat de app **geen** medisch hulpmiddel (*Medical device*) is en geen koppeling maakt met medische hardware.
5. **Advertenties (Ads) & Advertising ID:**
   * Bevat je app advertenties? **Nee**.
   * Gebruikt je app een Advertising ID? **Nee**.
6. **App-toegang (App Access):**
   * **Alle functionaliteit is beschikbaar zonder speciale toegang** (er is geen inlogscherm of betaalmuur binnen de app zelf).

---

## 4. In 3 Stappen je `.aab` Genereren en Koppelen (PWABuilder)

1. **Genereer het Android-pakket (`.aab`):**
   * Ga naar [https://www.pwabuilder.com](https://www.pwabuilder.com) en vul je live HTTPS-URL in (`https://bronlash.github.io/samen-groeien/`).
   * Klik op **Package for stores → Android → Generate Package**.
   * Gebruik als **Package ID**: `app.bbold.samengroeien` (dit staat al vooraf ingevuld in [`.well-known/assetlinks.json`](.well-known/assetlinks.json)).
   * Zet **Fallback behavior** op **WebView** of **Custom Tabs** met **Offline Support** ingeschakeld.
   * Download het `.zip`-bestand en bewaar het bestand **`signing.keystore`** en de bijbehorende wachtwoorden (`signing-key-info.txt`) op een veilige plek!
2. **Upload de `.aab` naar Google Play Console:**
   * Maak in de Google Play Console een nieuwe betaalde app aan, stel je verkoopprijs in onder **Monetize → App pricing** en upload het `.aab`-bestand naar een test- of productietrack.
3. **Koppel je `SHA-256` sleutel in `.well-known/assetlinks.json`:**
   * Ga in de Google Play Console naar **Setup → App signing**.
   * Kopieer de **SHA-256 certificate fingerprint** onder *App signing key certificate*.
   * Plak deze code op regel 9 van [`.well-known/assetlinks.json`](.well-known/assetlinks.json) (ter vervanging van `00:00:...`), commit en push naar GitHub. Vanaf dat moment opent de Android-app volledig schermvullend zonder adresbalk!
