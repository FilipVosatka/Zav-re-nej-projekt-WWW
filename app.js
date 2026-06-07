document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('tab-' + this.dataset.tab).classList.add('active');
    localStorage.setItem('aktivni_tab', this.dataset.tab);
  });
});

function obnovTab() {
  const ulozenyTab = localStorage.getItem('aktivni_tab');
  if (ulozenyTab) {
    const btn = document.querySelector(`.nav-btn[data-tab="${ulozenyTab}"]`);
    if (btn) btn.click();
  }
}

const themeBtn = document.getElementById('theme-toggle');

function nastavTema(tema) {
  document.body.className = tema;
  themeBtn.textContent = tema === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('tema', tema);
}

themeBtn.addEventListener('click', function() {
  nastavTema(document.body.classList.contains('dark') ? 'light' : 'dark');
});

nastavTema(localStorage.getItem('tema') || 'dark');

document.getElementById('modal-close').addEventListener('click', function() {
  document.getElementById('modal').classList.add('hidden');
});

document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) this.classList.add('hidden');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js');
  });
}

obnovTab();