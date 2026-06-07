async function nactiPolohuISS() {
  try {
    const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    const data = await response.json();
    document.getElementById('iss-lat').textContent = parseFloat(data.latitude).toFixed(4) + '°';
    document.getElementById('iss-lon').textContent = parseFloat(data.longitude).toFixed(4) + '°';
  } catch (chyba) {
    document.getElementById('iss-lat').textContent = 'Chyba';
    document.getElementById('iss-lon').textContent = 'Chyba';
  }
}

function zobrazPosadkuStaticky() {
  const posadka = [
    { jmeno: 'Oleg Kononenko', role: 'Velitel', vlajka: '🇷🇺' },
    { jmeno: 'Nikolaj Čub', role: 'Palubní inženýr', vlajka: '🇷🇺' },
    { jmeno: 'Tracy Dyson', role: 'Palubní inženýr', vlajka: '🇺🇸' },
    { jmeno: 'Matthew Dominick', role: 'Palubní inženýr', vlajka: '🇺🇸' },
    { jmeno: 'Michael Barratt', role: 'Palubní inženýr', vlajka: '🇺🇸' },
    { jmeno: 'Jeanette Epps', role: 'Palubní inženýr', vlajka: '🇺🇸' },
    { jmeno: 'Alexander Grebenkin', role: 'Palubní inženýr', vlajka: '🇷🇺' },
  ];
  document.getElementById('iss-crew').innerHTML = posadka.map(c => `
    <div class="crew-clen">
      <span class="crew-avatar">${c.vlajka}</span>
      <div>
        <div class="crew-jmeno">👨‍🚀 ${c.jmeno}</div>
        <div class="crew-role">${c.role}</div>
      </div>
    </div>
  `).join('');
}

document.getElementById('refresh-iss').addEventListener('click', function() {
  this.textContent = '⏳ Načítám...';
  nactiPolohuISS().then(() => { this.textContent = '🔄 Aktualizovat polohu'; });
});

nactiPolohuISS();
zobrazPosadkuStaticky();
setInterval(nactiPolohuISS, 10000);