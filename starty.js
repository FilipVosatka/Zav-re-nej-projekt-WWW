const SLEDOVANE_KEY = 'sledovane_starty';

function nactiSledovane() {
  const data = localStorage.getItem(SLEDOVANE_KEY);
  return data ? JSON.parse(data) : [];
}

function ulozSledovane(seznam) {
  localStorage.setItem(SLEDOVANE_KEY, JSON.stringify(seznam));
}

function prepniSledovane(id) {
  let seznam = nactiSledovane();
  if (seznam.includes(id)) {
    seznam = seznam.filter(x => x !== id);
  } else {
    seznam.push(id);
  }
  ulozSledovane(seznam);
  return seznam;
}

function formatujDatum(isoString) {
  if (!isoString) return 'Datum není znám';
  const d = new Date(isoString);
  return d.toLocaleString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function spocitejOdpocet(isoString) {
  if (!isoString) return '–';
  const rozdil = new Date(isoString) - new Date();
  if (rozdil < 0) return '✅ Již odstartoval';
  const dny = Math.floor(rozdil / (1000*60*60*24));
  const hodiny = Math.floor((rozdil % (1000*60*60*24)) / (1000*60*60));
  const minuty = Math.floor((rozdil % (1000*60*60)) / (1000*60));
  if (dny > 0) return `Za ${dny}d ${hodiny}h ${minuty}m`;
  if (hodiny > 0) return `Za ${hodiny}h ${minuty}m`;
  return `Za ${minuty} minut`;
}

function statusTrida(statusName) {
  if (!statusName) return 'status-tbd';
  const n = statusName.toLowerCase();
  if (n.includes('go')) return 'status-go';
  if (n.includes('success')) return 'status-success';
  return 'status-tbd';
}

function vytvorStartKartu(launch) {
  const sledovane = nactiSledovane();
  const jeSledovany = sledovane.includes(launch.id);
  const statusText = launch.status?.name || 'Neznámý';
  const agentura = launch.launch_service_provider?.name || 'Neznámá společnost';
  const raketa = launch.rocket?.configuration?.name || 'Neznámá raketa';

  const div = document.createElement('div');
  div.className = 'launch-karta';
  div.innerHTML = `
    <div class="launch-info">
      <div class="launch-nazev">🚀 ${launch.name || 'Neznámý start'}</div>
      <div class="launch-detail">
        <strong>Společnost:</strong> ${agentura}<br/>
        <strong>Raketa:</strong> ${raketa}<br/>
        <strong>Místo startu:</strong> ${launch.pad?.name || '–'}<br/>
        <strong>Plánovaný start:</strong> ${formatujDatum(launch.net)}
      </div>
    </div>
    <div class="launch-right">
      <div class="odpocet" id="odpocet-${launch.id}">${spocitejOdpocet(launch.net)}</div>
      <div><span class="launch-status ${statusTrida(statusText)}">${statusText}</span></div>
      <button class="sledovat-btn ${jeSledovany ? 'active' : ''}" data-id="${launch.id}">
        ${jeSledovany ? '👁️ Sleduji' : '+ Sledovat'}
      </button>
    </div>
  `;

  div.querySelector('.sledovat-btn').addEventListener('click', function() {
    const nove = prepniSledovane(launch.id);
    const aktivni = nove.includes(launch.id);
    this.textContent = aktivni ? '👁️ Sleduji' : '+ Sledovat';
    this.classList.toggle('active', aktivni);
  });

  return div;
}

function naplnAgentury(launches) {
  const select = document.getElementById('agency-filter');
  const agentury = [...new Set(launches.map(l => l.launch_service_provider?.name).filter(Boolean))].sort();
  agentury.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a;
    opt.textContent = a;
    select.appendChild(opt);
  });
  select.addEventListener('change', function() {
    zobrazStarty(window._allLaunches, this.value);
  });
}

function zobrazStarty(launches, filtrAgentura = '') {
  const container = document.getElementById('launches-container');
  container.innerHTML = '';
  let seznam = filtrAgentura ? launches.filter(l => l.launch_service_provider?.name === filtrAgentura) : launches;
  document.getElementById('launches-count').textContent = `Nalezeno: ${seznam.length} startů`;
  if (seznam.length === 0) { container.innerHTML = '<div class="chyba">Žádné starty nenalezeny.</div>'; return; }
  const list = document.createElement('div');
  list.className = 'launches-list';
  seznam.forEach(l => list.appendChild(vytvorStartKartu(l)));
  container.appendChild(list);
}

async function nactiStarty() {
  const container = document.getElementById('launches-container');
  try {
    const response = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=20&format=json');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    window._allLaunches = data.results || [];
    naplnAgentury(window._allLaunches);
    zobrazStarty(window._allLaunches);
    setInterval(() => {
      window._allLaunches.forEach(l => {
        const el = document.getElementById(`odpocet-${l.id}`);
        if (el) el.textContent = spocitejOdpocet(l.net);
      });
    }, 60000);
  } catch (chyba) {
    container.innerHTML = `<div class="chyba">❌ Nepodařilo se načíst data z API.<br/><small>API může být dočasně nedostupné.</small><br/><button onclick="nactiStarty()" class="btn-primary" style="margin-top:1rem">🔄 Zkusit znovu</button></div>`;
  }
}

nactiStarty();