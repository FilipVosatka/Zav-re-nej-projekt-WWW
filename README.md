# Vesmír – Průvodce kosmem

Webová aplikace poskytující základní informace o vesmíru pro širokou veřejnost.

Reálné využití: člověk, který se ve vesmíru nevyzná, si chce rychle zjistit základní informace o planetách, černých dírách nebo hvězdách, sledovat nadcházející starty raket a zjistit kde se právě nachází ISS — vše na jednom místě, přehledně a jednoduše.

## Struktura projektu
/
├── index.html        # Hlavní stránka aplikace (struktura UI, všechny tři sekce)
├── manifest.json     # PWA manifest (ikony, název, barvy)
├── sw.js             # Service Worker (PWA, cachování, offline podpora)
├── css/
│   └── style.css     # Veškeré styly (dark/light mode, grid, animace, responzivita)
├── js/
│   ├── data.js       # Statická data o vesmírných objektech
│   ├── objekty.js    # Logika sekce Objekty (karty, oblíbené, filtry, modal)
│   ├── starty.js     # Logika sekce Starty raket (API, odpočet, filtr, sledování)
│   ├── iss.js        # Logika sekce ISS (živá poloha, posádka)
│   └── app.js        # Přepínání tabů, dark/light mode, modal, registrace SW
└── README.md         # Tato dokumentace

## Použité technologie

| Technologie | Využití |
|-------------|---------|
| HTML5 | Sémantická struktura stránky |
| CSS3 | Dark/light mode, CSS Grid, animace, responzivní design |
| JavaScript (ES6+) | Veškerá logika, API volání, DOM manipulace |
| Launch Library 2 API | Zdroj dat o nadcházejících startech raket |
| Where The ISS At API | Živá poloha ISS |
| localStorage | Ukládání oblíbených, sledovaných startů, tématu a aktivního tabu |
| Service Worker | PWA podpora, cachování souborů aplikace |

## Princip fungování

### 1. Sekce: Vesmírné objekty
Data o objektech jsou uložena staticky v `data.js` jako pole objektů. Při načtení stránky JavaScript vygeneruje karty pomocí funkce `vytvorKartu()`. Hover nad kartou zobrazí overlay s informacemi přes CSS přechod opacity. Na mobilních zařízeních se místo hoveru otevírá modal dialog. Filtry přepínají zobrazené kategorie filtrováním pole dat. Oblíbené objekty se ukládají do `localStorage`.

### 2. Sekce: Starty raket
Data se načítají asynchronně pomocí `fetch()` z Launch Library 2 API. Po načtení se dynamicky vygenerují karty startů. Odpočet do každého startu se přepočítává každou minutu pomocí `setInterval()`. Uživatel může filtrovat starty podle agentury přes `<select>` element. Sledované starty se ukládají do `localStorage`.

### 3. Sekce: ISS
Poloha ISS se načítá z Where The ISS At API a aktualizuje každých 10 sekund pomocí `setInterval()`. Posádka stanice je zobrazena staticky. Uživatel může polohu obnovit ručně tlačítkem.

### 4. localStorage
Aplikace ukládá data lokálně bez nutnosti backendu.

| Klíč | Obsah | Kdy se ukládá |
|------|-------|---------------|
| `oblibene` | ID oblíbených vesmírných objektů | Kliknutím na hvězdičku |
| `sledovane_starty` | ID sledovaných startů | Kliknutím na Sledovat |
| `aktivni_tab` | Poslední aktivní záložka | Přepnutím záložky |
| `tema` | Zvolené téma (dark/light) | Přepnutím tématu |

### 5. Dark / Light mode
Přepínání tématu funguje přidáním/odebráním CSS třídy `dark` / `light` na elementu `<body>`. Barvy jsou definované jako CSS proměnné v `:root`, takže celá stránka se přebarví jedním přepnutím třídy. Zvolené téma se ukládá do `localStorage` a obnovuje při dalším načtení.

### 6. PWA (Progressive Web App)
Aplikace je registrovaná jako PWA pomocí:
- `manifest.json` — definuje název, ikony, barvy a chování při instalaci
- `sw.js` (Service Worker) — cachuje soubory aplikace při první návštěvě, při výpadku sítě slouží obsah z cache. ISS a raketové API volání nejsou cachována (vždy jdou přes síť).

## Použitá API

Všechna volání probíhají přes `fetch()` bez nutnosti API klíče.

| Metoda | Endpoint | Účel |
|--------|----------|------|
| GET | `https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=20` | Nadcházející starty raket |
| GET | `https://api.wheretheiss.at/v1/satellites/25544` | Živá poloha ISS |

## Funkcionality

| Funkce | Popis |
|--------|-------|
| Vesmírné objekty | Karty s obrázky, hover zobrazí informace |
| Filtry objektů | Filtrování podle kategorie (planety, hvězdy, černé díry, jiné) |
| Oblíbené | Přidání objektu do oblíbených, uloženo v localStorage |
| Starty raket | Načítání z API, odpočet do startu |
| Filtr agentur | Filtrování startů podle vesmírné agentury |
| Sledování startů | Označení startu ke sledování, uloženo v localStorage |
| Živá poloha ISS | Souřadnice aktualizované každých 10 sekund |
| Posádka ISS | Seznam aktuální posádky stanice |
| Dark / Light mode | Přepínání tématu, uloženo v localStorage |
| Responzivní design | Funguje na mobilu i desktopu |
| PWA | Instalovatelná aplikace, offline podpora |

## Responzivní design

| Šířka obrazovky | Chování |
|-----------------|---------|
| > 900px | 4–5 sloupců karet objektů |
| 500px – 900px | 2–3 sloupce karet |
| < 500px | 2 sloupce, zjednodušená navigace |

## Use-case diagram
┌──────────┐
│          │──── Zobrazit vesmírné objekty ──────────── [data.js]
│          │         ├── Filtrovat podle kategorie
│          │         ├── Přidat do oblíbených ────────── localStorage
│          │         └── Zobrazit detail (hover / modal)
│          │
│Uživatel  │──── Zobrazit starty raket ───────────────── [Space Devs API]
│          │         ├── Filtrovat podle agentury
│          │         └── Sledovat start ────────────────  localStorage
│          │
│          │──── Zobrazit ISS ────────────────────────── [Where The ISS At API]
│          │         ├── Živá poloha (každých 10s)
│          │         └── Posádka stanice
│          │
│          │──── Přepnout dark / light mode ──────────── localStorage
└──────────┘

## Možná budoucí rozšíření

- Mapa s živou polohou ISS
- Více vesmírných objektů s vlastními obrázky
- Notifikace před startem rakety
- Detailní stránka pro každý objekt
- Podpora více jazyků
