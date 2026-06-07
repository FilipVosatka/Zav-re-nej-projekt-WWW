function nactiOblibene() {
  const ulozene = localStorage.getItem('oblibene');
  return ulozene ? JSON.parse(ulozene) : [];
}

function ulozOblibene(oblibene) {
  localStorage.setItem('oblibene', JSON.stringify(oblibene));
}

function prepniOblibene(id) {
  let oblibene = nactiOblibene();
  if (oblibene.includes(id)) {
    oblibene = oblibene.filter(x => x !== id);
  } else {
    oblibene.push(id);
  }
  ulozOblibene(oblibene);
  return oblibene;
}

function vytvorKartu(objekt) {
  const oblibene = nactiOblibene();
  const jeOblibeny = oblibene.includes(objekt.id);

  const karta = document.createElement('div');
  karta.className = 'objekt-karta';
  karta.dataset.id = objekt.id;
  karta.dataset.kategorie = objekt.kategorie;

  // Pokud má obrázek zobraz ho, jinak šedé pole
  const obrazek = objekt.img
    ? `<img src="${objekt.img}" alt="${objekt.nazev}" />`
    : `<div class="no-img">?</div>`;

  karta.innerHTML = `
    <button class="fav-btn" data-id="${objekt.id}">${jeOblibeny ? '⭐' : '☆'}</button>
    ${obrazek}
    <div class="objekt-nazev">${objekt.nazev}</div>
    <div class="objekt-overlay">
      <div class="overlay-nazev">${objekt.nazev}</div>
      <div class="overlay-info">
        <span>📏 ${objekt.velikost}</span>
        <span>📡 ${objekt.vzdalenost}</span>
        <span style="margin-top:0.3rem">${objekt.info}</span>
      </div>
    </div>
  `;

  karta.querySelector('.fav-btn').addEventListener('click', function(e) {
    e.stopPropagation();
    const noveOblibene = prepniOblibene(objekt.id);
    this.textContent = noveOblibene.includes(objekt.id) ? '⭐' : '☆';
    const aktivniFilter = document.querySelector('.filter-btn.active');
    if (aktivniFilter && aktivniFilter.dataset.filter === 'oblibene') {
      zobrazObjekty('oblibene');
    }
  });

  karta.addEventListener('click', function() {
    if (window.innerWidth <= 700) otevriModal(objekt);
  });

  return karta;
}

function zobrazObjekty(filtr = 'vse') {
  const grid = document.getElementById('objekty-grid');
  grid.innerHTML = '';

  let seznam = VESMIRNE_OBJEKTY;
  if (filtr === 'oblibene') {
    const oblibene = nactiOblibene();
    seznam = seznam.filter(o => oblibene.includes(o.id));
  } else if (filtr !== 'vse') {
    seznam = seznam.filter(o => o.kategorie === filtr);
  }

  if (seznam.length === 0) {
    grid.innerHTML = '<p style="color:var(--text2);grid-column:1/-1">Žádné objekty nenalezeny.</p>';
    return;
  }

  seznam.forEach(objekt => grid.appendChild(vytvorKartu(objekt)));
}

function otevriModal(objekt) {
  const modal = document.getElementById('modal');
  const obrazek = objekt.img
    ? `<img src="${objekt.img}" alt="${objekt.nazev}" style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:1rem" />`
    : `<div style="font-size:4rem;text-align:center;margin-bottom:1rem">🌌</div>`;

  document.getElementById('modal-body').innerHTML = `
    ${obrazek}
    <h2 style="font-family:'Orbitron',sans-serif;margin-bottom:1rem;color:var(--accent)">${objekt.nazev}</h2>
    <div style="color:var(--text2);line-height:1.7;font-size:0.9rem">
      <p><strong style="color:var(--text)">📏 Velikost:</strong> ${objekt.velikost}</p>
      <p style="margin-top:0.5rem"><strong style="color:var(--text)">📡 Vzdálenost:</strong> ${objekt.vzdalenost}</p>
      <p style="margin-top:0.8rem">${objekt.info}</p>
    </div>
  `;
  modal.classList.remove('hidden');
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    zobrazObjekty(this.dataset.filter);
  });
});

zobrazObjekty();