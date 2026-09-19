// my_clean_website/js/app.js - Controlador nativo JS de la aplicación completa

const US_STATES = {
  CT: { name: 'Connecticut', cities: ['All Connecticut', 'Norwalk', 'Stamford', 'Greenwich', 'Danbury', 'Hartford', 'New Haven'] },
  NY: { name: 'New York', cities: ['All New York', 'New York City', 'Brooklyn', 'Queens', 'Albany', 'Buffalo', 'White Plains'] },
  NJ: { name: 'New Jersey', cities: ['All New Jersey', 'Newark', 'Jersey City', 'Hoboken', 'Princeton', 'Trenton'] }
};

let currentState = 'CT';
let currentCity = 'All Connecticut';

document.addEventListener('DOMContentLoaded', () => {
  const stateBtn = document.getElementById('stateBtn');
  const stateMenu = document.getElementById('stateMenu');
  const stateLabel = document.getElementById('stateLabel');
  const stateOptionsList = document.getElementById('stateOptionsList');

  const cityBtn = document.getElementById('cityBtn');
  const cityMenu = document.getElementById('cityMenu');
  const cityLabel = document.getElementById('cityLabel');
  const cityMenuHeader = document.getElementById('cityMenuHeader');
  const cityOptionsList = document.getElementById('cityOptionsList');

  const titleCityText = document.getElementById('titleCityText');
  const kickerLocationText = document.getElementById('kickerLocationText');
  const searchLocationInput = document.getElementById('searchLocationInput');

  function renderStateMenu() {
    if (!stateOptionsList) return;
    stateOptionsList.innerHTML = Object.keys(US_STATES).map(st => `
      <div class="custom-popover-item ${st === currentState ? 'active' : ''}" onclick="window.selectState('${st}')">
        <div style="display: flex; align-items: center; gap: 0.55rem;">
          <span class="popover-state-code" style="font-weight:700;">${st}</span>
          <span class="popover-state-name" style="color:#475569; font-size:0.85rem;">${US_STATES[st].name}</span>
        </div>
        ${st === currentState ? '✓' : ''}
      </div>
    `).join('');
  }

  function renderCityMenu() {
    if (!cityOptionsList) return;
    cityMenuHeader.textContent = `Cities in ${US_STATES[currentState].name}`;
    cityOptionsList.innerHTML = US_STATES[currentState].cities.map(c => `
      <div class="custom-popover-item ${c === currentCity ? 'active' : ''}" onclick="window.selectCity('${c}')">
        <span class="popover-city-name" style="font-size:0.88rem;">${c}</span>
        ${c === currentCity ? '✓' : ''}
      </div>
    `).join('');
  }

  window.selectState = function(st) {
    currentState = st;
    currentCity = US_STATES[st].cities[0];
    if (stateLabel) stateLabel.textContent = st;
    updateUI();
    if (stateMenu) stateMenu.style.display = 'none';
  };

  window.selectCity = function(c) {
    currentCity = c;
    updateUI();
    if (cityMenu) cityMenu.style.display = 'none';
  };

  function updateUI() {
    if (cityLabel) cityLabel.textContent = currentCity;
    if (titleCityText) titleCityText.textContent = `in ${currentCity}.`;
    if (kickerLocationText) kickerLocationText.textContent = `LIVE IN ${currentState} & LOCAL REGION`;
    if (searchLocationInput) searchLocationInput.value = currentCity;
    document.querySelectorAll('.current-city-text').forEach(el => el.textContent = currentCity);
    renderStateMenu();
    renderCityMenu();
  }

  if (stateBtn) {
    stateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stateMenu.style.display = stateMenu.style.display === 'none' ? 'block' : 'none';
      if (cityMenu) cityMenu.style.display = 'none';
    });
  }

  if (cityBtn) {
    cityBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cityMenu.style.display = cityMenu.style.display === 'none' ? 'block' : 'none';
      if (stateMenu) stateMenu.style.display = 'none';
    });
  }

  document.addEventListener('click', () => {
    if (stateMenu) stateMenu.style.display = 'none';
    if (cityMenu) cityMenu.style.display = 'none';
  });

  // Tab Switcher
  const tabJobs = document.getElementById('tabJobs');
  const tabServices = document.getElementById('tabServices');
  const tabMarketplace = document.getElementById('tabMarketplace');
  const mainSearchInput = document.querySelector('input[name="q"]');
  const mainSearchBtn = document.querySelector('.studio-main-search-btn span');

  if (tabJobs && tabServices && tabMarketplace) {
    tabJobs.addEventListener('click', () => {
      tabJobs.classList.add('active');
      tabServices.classList.remove('active');
      tabMarketplace.classList.remove('active');
      if (mainSearchInput) mainSearchInput.placeholder = "Job title, company or skill (e.g. Warehouse, Cook)";
      if (mainSearchBtn) mainSearchBtn.textContent = "Search Jobs";
    });

    tabServices.addEventListener('click', () => {
      tabServices.classList.add('active');
      tabJobs.classList.remove('active');
      tabMarketplace.classList.remove('active');
      if (mainSearchInput) mainSearchInput.placeholder = "Service needed (e.g. Handyman, Cleaning)";
      if (mainSearchBtn) mainSearchBtn.textContent = "Search Services";
    });

    tabMarketplace.addEventListener('click', () => {
      tabMarketplace.classList.add('active');
      tabJobs.classList.remove('active');
      tabServices.classList.remove('active');
      if (mainSearchInput) mainSearchInput.placeholder = "Item for sale (e.g. MacBook, Tools, Sofa)";
      if (mainSearchBtn) mainSearchBtn.textContent = "Search Items";
    });
  }

  updateUI();
  if (window.lucide) {
    lucide.createIcons();
  }
});
