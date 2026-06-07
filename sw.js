const CACHE_NAZEV = 'vesmir-cache-v1';

// Relativní cesty zajišťují, že cache funguje i na subdoménách
const SOUBORY = [
  './', 
  'index.html', 
  'css/style.css', 
  'js/data.js', 
  'js/objekty.js', 
  'js/starty.js', 
  'js/iss.js', 
  'js/app.js', 
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Instalace Service Workeru a uložení statických souborů do cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAZEV)
      .then(cache => {
        console.log('Service Worker: Cachování souborů');
        return cache.addAll(SOUBORY);
      })
      .then(() => self.skipWaiting()) // Přinutí nový SW aktivovat se okamžitě
  );
});

// Aktivace Service Workeru a smazání starých verzí cache
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAZEV) {
            console.log('Service Worker: Mazání staré cache', k);
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim()) // Okamžitě převezme kontrolu nad otevřenými záložkami
  );
});

// Strategie: Síť jako první, při výpadku se použije cache (Network First)
// Vhodné pro weby, které tahají živá data z API (ISS, starty raket)
self.addEventListener('fetch', e => {
  // Ignorujeme požadavky z API, aby se cache nepokoušela ukládat externí data
  if (e.request.url.includes('api.wheretheiss.at') || e.request.url.includes('thespacedevs.com')) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Pokud je odpověď v pořádku, uložíme kopii do cache
        if (res.status === 200) {
          const resClone = res.clone();
          caches.open(CACHE_NAZEV).then(c => c.put(e.request, resClone));
        }
        return res;
      })
      .catch(() => caches.match(e.request)) // Při offline režimu vrátí soubor z cache
  );
});