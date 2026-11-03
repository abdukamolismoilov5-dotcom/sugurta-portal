/* ========================================================
   RESPUBLIKA YAGONA SUG'URTA PORTALI — JAVASCRIPT ENGINE
   Full-stack Frontend SPA with REST API Integration
   ======================================================== */

// --- STATE MANAGEMENT ---
const state = {
  token: localStorage.getItem('sugurta_token') || null,
  user: null,
  currentTab: 'dashboard',
  theme: localStorage.getItem('sugurta_theme') || 'light',
  lang: localStorage.getItem('sugurta_lang') || 'uz',
  stats: {},
  policies: [],
  vehicles: [],
  claims: [],
  notifications: [],
  reviews: [],
  activeFilter: 'all',
  selectedType: 'osago',
  calcOffers: [],
  calcOption: 0,
  calcFranchise: 0,
  calcTow: false,
  calcAccident: false,
  calcSort: 'price',
  calcPromo: null,
  comparedOffers: [],
  mobileMenuOpen: false
};

// --- MULTI-LANGUAGE DICTIONARY ---
const I18N = {
  uz: {
    app_title: "Sug‘urta.uz — Respublika Yagona Portali",
    portal_name: "Sug‘urta.uz",
    portal_sub: "Yagona Davlat Portali",
    greeting: "Assalomu alaykum",
    logout: "Chiqish",
    menu_dash: "Boshqaruv Paneli",
    menu_policies: "Mening Polislarim",
    menu_calc: "Kalkulyator & Xarid",
    menu_claims: "Hodisa & Da‘volar",
    menu_fleet: "Mening Avtoparkim",
    menu_fines: "DYXX Jarimalar",
    menu_ai: "AI Maslahatchi",
    menu_agent: "Agent Paneli (CRM)",
    menu_referral: "Keshbek & Referal",
    active_policies: "Faol Polislar",
    expiring_soon: "Tugash arafasida",
    total_vehicles: "Avtomobillar",
    cashback_bal: "Keshbek Balansi",
    active_claims: "Faol Da‘volar",
    hero_title: "Barcha Sug‘urta Polislaringiz Bir Joyda",
    hero_desc: "O‘zbekistonning barcha rasmiy sug‘urta kompaniyalari: eng arzon tariflar, 100% qonuniy E-Polislar va da‘volarni tezkor to‘lash tizimi.",
    btn_get_policy: "Polis Rasmiylashtirish",
    btn_report_claim: "Hodisa Haqida Xabar",
    btn_check_fines: "Jarimalarni Tekshirish",
    btn_view_fleet: "Avtoparkim",
    catalog_title: "Sug‘urta Turlari va Tariflar",
    from_price: "dan boshlab",
    days_left: "kun qoldi",
    expired: "Muddati o‘tgan",
    active: "Faol",
    auto_renew: "Avto-uzaytirish",
    view_epolis: "E-Polis (QR & Sertifikat)",
    renew_1yr: "1 yilga uzaytirish",
    report_accident: "Hodisa bildirish",
    delete: "O‘chirish",
    add_policy_btn: "+ Yangi Polis Qo‘shish",
    add_car_btn: "+ Avtomobil Qo‘shish",
    bulk_renew: "Barchasini Uzaytirish",
    calc_title: "Sug‘urta Narxini Hisoblash va Taqqoslash",
    step1: "1. Sug‘urta Turini Tanlang",
    step2: "2. Parametrlarni Sozlang",
    step3: "3. Kompaniyalar Takliflari",
    sort_price: "Eng arzon narx",
    sort_rating: "Yuqori reyting",
    compare_btn: "Taqqoslash",
    buy_now: "Rasmiylashtirish",
    claim_tracker: "Arizalar Holati (Live Tracker)",
    step_0: "Qabul qilindi",
    step_1: "O‘rganilmoqda",
    step_2: "Tasdiqlandi",
    step_3: "To‘lov tayyorlanmoqda",
    step_4: "Pul to‘landi",
    next_step_demo: "Keyingi bosqichga o‘tkazish (Demo test)",
    new_claim_btn: "+ Yangi Hodisa Xabari",
    login_tab: "Kirish",
    register_tab: "Ro‘yxatdan o‘tish",
    email_label: "Elektron pochta (Email)",
    password_label: "Maxfiy parol",
    fname_label: "Ismingiz",
    lname_label: "Familiyangiz",
    phone_label: "Telefon raqamingiz",
    login_btn: "Tizimga Kirish",
    register_btn: "Hisob Yaratish",
    demo_btn: "Demo Hisob bilan 1-Klikda Kirish",
    search_placeholder: "Polis, avtomobil yoki kompaniya qidirish...",
    ai_chip1: "Eng arzon OSAGO kerak",
    ai_chip2: "Chet elga safar sug‘urtasi",
    ai_chip3: "KASKO 200 mln so‘m",
    ai_chip4: "Kvartirani sug‘urtalash"
  },
  ru: {
    app_title: "Sug‘urta.uz — Единый Республиканский Портал",
    portal_name: "Sug‘urta.uz",
    portal_sub: "Единый Портал Страхования",
    greeting: "Здравствуйте",
    logout: "Выйти",
    menu_dash: "Панель управления",
    menu_policies: "Мои полисы",
    menu_calc: "Калькулятор и покупка",
    menu_claims: "Страховые случаи",
    menu_fleet: "Мой автопарк",
    menu_fines: "Штрафы ГУБДД",
    menu_ai: "AI-Советник",
    menu_agent: "Панель агента (CRM)",
    menu_referral: "Кешбэк и рефералы",
    active_policies: "Действующие полисы",
    expiring_soon: "Заканчиваются",
    total_vehicles: "Автомобили",
    cashback_bal: "Баланс кешбэка",
    active_claims: "Активные случаи",
    hero_title: "Все ваши страховые полисы в одном месте",
    hero_desc: "Все официальные страховые компании Узбекистана: выгодные тарифы, 100% официальный Е-Полис и быстрое урегулирование убытков.",
    btn_get_policy: "Оформить полис",
    btn_report_claim: "Сообщить о случае",
    btn_check_fines: "Проверить штрафы",
    btn_view_fleet: "Мой автопарк",
    catalog_title: "Виды страхования и тарифы",
    from_price: "от",
    days_left: "дн. осталось",
    expired: "Истёк",
    active: "Активен",
    auto_renew: "Автопродление",
    view_epolis: "Е-Полис (QR и сертификат)",
    renew_1yr: "Продлить на 1 год",
    report_accident: "Сообщить о случае",
    delete: "Удалить",
    add_policy_btn: "+ Добавить полис",
    add_car_btn: "+ Добавить авто",
    bulk_renew: "Продлить все",
    calc_title: "Расчёт и сравнение предложений",
    step1: "1. Выберите вид страхования",
    step2: "2. Настройте параметры",
    step3: "3. Предложения компаний",
    sort_price: "По цене",
    sort_rating: "По рейтингу",
    compare_btn: "Сравнить",
    buy_now: "Оформить",
    claim_tracker: "Статус заявки (Live Tracker)",
    step_0: "Принята",
    step_1: "На рассмотрении",
    step_2: "Одобрена",
    step_3: "Готовится выплата",
    step_4: "Выплачено",
    next_step_demo: "Перейти на след. шаг (Демо)",
    new_claim_btn: "+ Подать заявление",
    login_tab: "Вход",
    register_tab: "Регистрация",
    email_label: "Эл. почта (Email)",
    password_label: "Пароль",
    fname_label: "Имя",
    lname_label: "Фамилия",
    phone_label: "Номер телефона",
    login_btn: "Войти в систему",
    register_btn: "Создать аккаунт",
    demo_btn: "Вход в Демо-аккаунт в 1 клик",
    search_placeholder: "Поиск полиса, авто или компании...",
    ai_chip1: "Нужен самый дешёвый ОСАГО",
    ai_chip2: "Страховка для поездки за границу",
    ai_chip3: "КАСКО на 200 млн сум",
    ai_chip4: "Страхование квартиры"
  },
  en: {
    app_title: "Sug‘urta.uz — Unified Insurance Portal",
    portal_name: "Sug‘urta.uz",
    portal_sub: "National Insurance Portal",
    greeting: "Welcome",
    logout: "Sign Out",
    menu_dash: "Dashboard",
    menu_policies: "My Policies",
    menu_calc: "Calculator & Buy",
    menu_claims: "Claims & Cases",
    menu_fleet: "My Fleet",
    menu_fines: "Traffic Fines",
    menu_ai: "AI Advisor",
    menu_agent: "Agent CRM",
    menu_referral: "Cashback & Referrals",
    active_policies: "Active Policies",
    expiring_soon: "Expiring Soon",
    total_vehicles: "Vehicles",
    cashback_bal: "Cashback Balance",
    active_claims: "Active Claims",
    hero_title: "All Your Insurance Policies In One Place",
    hero_desc: "All licensed insurance companies in Uzbekistan: best rates, 100% legal E-Policies, and express claims payout.",
    btn_get_policy: "Get a Policy",
    btn_report_claim: "Report Claim",
    btn_check_fines: "Check Fines",
    btn_view_fleet: "My Fleet",
    catalog_title: "Insurance Types & Rates",
    from_price: "from",
    days_left: "days left",
    expired: "Expired",
    active: "Active",
    auto_renew: "Auto-renew",
    view_epolis: "E-Policy (QR & Cert)",
    renew_1yr: "Renew for 1 year",
    report_accident: "Report incident",
    delete: "Delete",
    add_policy_btn: "+ Add Policy",
    add_car_btn: "+ Add Vehicle",
    bulk_renew: "Renew All",
    calc_title: "Insurance Calculator & Comparison",
    step1: "1. Choose Insurance Type",
    step2: "2. Configure Parameters",
    step3: "3. Insurer Quotes",
    sort_price: "By Price",
    sort_rating: "By Rating",
    compare_btn: "Compare",
    buy_now: "Checkout",
    claim_tracker: "Claim Live Tracker",
    step_0: "Received",
    step_1: "Under Review",
    step_2: "Approved",
    step_3: "Preparing Payout",
    step_4: "Paid Out",
    next_step_demo: "Advance step (Demo test)",
    new_claim_btn: "+ New Claim",
    login_tab: "Sign In",
    register_tab: "Sign Up",
    email_label: "Email Address",
    password_label: "Password",
    fname_label: "First Name",
    lname_label: "Last Name",
    phone_label: "Phone Number",
    login_btn: "Sign In",
    register_btn: "Create Account",
    demo_btn: "Instant 1-Click Demo Login",
    search_placeholder: "Search policies, cars or companies...",
    ai_chip1: "I need cheapest OSAGO",
    ai_chip2: "Travel insurance abroad",
    ai_chip3: "KASKO 200M UZS",
    ai_chip4: "Home & Apartment cover"
  }
};

function t(key) {
  const dict = I18N[state.lang] || I18N.uz;
  return dict[key] || key;
}

// --- API CLIENT ---
const api = {
  async req(url, options = {}) {
    const headers = options.headers || {};
    if (state.token) {
      headers['Authorization'] = `Bearer ${state.token}`;
    }
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Serverda xatolik yuz berdi');
    }
    return data;
  },
  get(url) { return this.req(url, { method: 'GET' }); },
  post(url, body) {
    const isForm = body instanceof FormData;
    return this.req(url, { method: 'POST', body: isForm ? body : JSON.stringify(body) });
  },
  patch(url, body) { return this.req(url, { method: 'PATCH', body: JSON.stringify(body) }); },
  delete(url) { return this.req(url, { method: 'DELETE' }); }
};

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span style="font-size: 18px">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- MODAL SYSTEM ---
function openModal(title, htmlContent) {
  const layer = document.getElementById('modal-layer');
  layer.innerHTML = `
    <div class="modal-overlay" id="modal-bg">
      <div class="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close-btn" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">${htmlContent}</div>
      </div>
    </div>
  `;
  document.getElementById('modal-bg').addEventListener('click', (e) => {
    if (e.target.id === 'modal-bg') closeModal();
  });
  if (window.lucide) lucide.createIcons();
}

function closeModal() {
  document.getElementById('modal-layer').innerHTML = '';
}

// Format numbers
function fmt(num) {
  return Number(num || 0).toLocaleString('uz-UZ').replace(/,/g, ' ');
}

// --- INITIALIZATION ---
async function init() {
  document.documentElement.setAttribute('data-theme', state.theme);
  if (state.token) {
    try {
      state.user = await api.get('/api/auth/me');
      await loadAllData();
      renderApp();
    } catch (err) {
      console.warn('Session expired or invalid:', err);
      state.token = null;
      localStorage.removeItem('sugurta_token');
      renderAuth('login');
    }
  } else {
    renderAuth('login');
  }
}

async function loadAllData() {
  try {
    const [stats, policies, vehicles, claims, notifs, reviews] = await Promise.all([
      api.get('/api/dashboard/stats'),
      api.get('/api/policies'),
      api.get('/api/vehicles'),
      api.get('/api/claims'),
      api.get('/api/notifications'),
      api.get('/api/reviews')
    ]);
    state.stats = stats;
    state.policies = policies;
    state.vehicles = vehicles;
    state.claims = claims;
    state.notifications = notifs;
    state.reviews = reviews;
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

// ========================================================
// AUTHENTICATION SCREEN (LOGIN / REGISTER)
// ========================================================
function renderAuth(tab = 'login') {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-container">
      <div class="auth-hero-side">
        <div class="auth-hero-header">
          <div class="brand-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <h2 style="color:#fff; font-size:22px; font-weight:800;">Sug‘urta.uz</h2>
            <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#38bdf8; font-weight:700;">Respublika Yagona Portali</span>
          </div>
        </div>

        <div class="auth-hero-content">
          <h1>Respublikadagi Barcha Sug‘urtalar <span>Yagona Portallarda</span></h1>
          <p>O‘zbekiston Respublikasining rasmiy sug‘urta agregatori: OSAGO, KASKO, Sayohat va Tibbiy polislarni ortiqcha ovoragarchiliksiz, to‘liq qonuniy va xavfsiz boshqaring.</p>
          
          <div class="auth-stats-grid">
            <div class="auth-stat-card">
              <b>10+</b>
              <span>Yetakchi Sug‘urta Kompaniyalari</span>
            </div>
            <div class="auth-stat-card">
              <b>80 M+</b>
              <span>Kafolatlangan Davlat Qoplamasi</span>
            </div>
            <div class="auth-stat-card">
              <b>100%</b>
              <span>Qonuniy Raqamli E-Polis</span>
            </div>
          </div>
        </div>

        <div style="font-size:12px; color:#94a3b8; display:flex; justify-content:space-between;">
          <span>© 2026 Sug‘urta.uz. Barcha huquqlar himoyalangan.</span>
          <span>Ishonch telefoni: 1120</span>
        </div>
      </div>

      <div class="auth-form-side">
        <div class="auth-card-box">
          <div class="auth-header">
            <h2>${tab === 'login' ? 'Tizimga Kirish' : 'Ro‘yxatdan O‘tish'}</h2>
            <p>${tab === 'login' ? 'Shaxsiy kabinetingizga kirish uchun ma‘lumotlarni kiriting' : 'Bir daqiqada yangi profil yarating va 20 000 so‘m keshbek oling'}</p>
          </div>

          <div class="auth-tabs">
            <button class="auth-tab-btn ${tab === 'login' ? 'active' : ''}" onclick="renderAuth('login')">${t('login_tab')}</button>
            <button class="auth-tab-btn ${tab === 'register' ? 'active' : ''}" onclick="renderAuth('register')">${t('register_tab')}</button>
          </div>

          ${tab === 'login' ? renderLoginForm() : renderRegisterForm()}

          <div style="margin-top:20px; text-align:center;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
              <div style="flex:1; height:1px; background:var(--border);"></div>
              <span style="font-size:12px; color:var(--text-muted); font-weight:600;">YOKI TEZKOR TEST</span>
              <div style="flex:1; height:1px; background:var(--border);"></div>
            </div>
            <button type="button" class="btn-primary btn-demo" onclick="handleDemoLogin()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              ${t('demo_btn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderLoginForm() {
  return `
    <form id="login-form" onsubmit="handleLogin(event)">
      <div class="form-group">
        <label class="form-label">${t('email_label')}</label>
        <div class="input-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <input type="email" id="login-email" class="form-control" placeholder="namuna@sugurta.uz" required>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">${t('password_label')}</label>
        <div class="input-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; font-size:13px;">
        <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
          <input type="checkbox" checked style="accent-color:var(--primary); width:16px; height:16px;">
          <span>Meni eslab qol</span>
        </label>
        <a href="javascript:void(0)" onclick="showToast('Parolni tiklash bo‘yicha ko‘rsatma pochtangizga yuborildi', 'info')">Parolni unutdingizmi?</a>
      </div>

      <button type="submit" class="btn-primary" id="login-submit-btn">
        <span>${t('login_btn')}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
    </form>
  `;
}

function renderRegisterForm() {
  return `
    <form id="register-form" onsubmit="handleRegister(event)">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${t('fname_label')}</label>
          <input type="text" id="reg-fname" class="form-control" placeholder="Ali" required>
        </div>
        <div class="form-group">
          <label class="form-label">${t('lname_label')}</label>
          <input type="text" id="reg-lname" class="form-control" placeholder="Valiyev" required>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">${t('email_label')}</label>
        <div class="input-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <input type="email" id="reg-email" class="form-control" placeholder="sizning@email.uz" required>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">${t('phone_label')}</label>
        <div class="input-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <input type="tel" id="reg-phone" class="form-control" placeholder="+998 90 123 45 67" required>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${t('password_label')}</label>
          <input type="password" id="reg-pass" class="form-control" placeholder="Eng kamida 6 belgi" minlength="6" required>
        </div>
        <div class="form-group">
          <label class="form-label">Parolni tasdiqlash</label>
          <input type="password" id="reg-pass2" class="form-control" placeholder="Qayta kiriting" minlength="6" required>
        </div>
      </div>

      <button type="submit" class="btn-primary" id="reg-submit-btn">
        <span>${t('register_btn')}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
      </button>
    </form>
  `;
}

// Auth Handlers
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-submit-btn');
  btn.disabled = true;
  btn.innerText = 'Kirilmoqda...';

  try {
    const res = await api.post('/api/auth/login', { email, password });
    state.token = res.token;
    state.user = res.user;
    localStorage.setItem('sugurta_token', res.token);
    showToast(`Xush kelibsiz, ${res.user.first_name}!`, 'success');
    await loadAllData();
    renderApp();
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false;
    btn.innerText = t('login_btn');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const first_name = document.getElementById('reg-fname').value;
  const last_name = document.getElementById('reg-lname').value;
  const email = document.getElementById('reg-email').value;
  const phone = document.getElementById('reg-phone').value;
  const password = document.getElementById('reg-pass').value;
  const password2 = document.getElementById('reg-pass2').value;

  if (password !== password2) {
    return showToast('Kiritilgan parollar bir-biriga mos kelmadi!', 'error');
  }

  const btn = document.getElementById('reg-submit-btn');
  btn.disabled = true;
  btn.innerText = 'Yaratilmoqda...';

  try {
    const res = await api.post('/api/auth/register', { first_name, last_name, email, password, phone });
    state.token = res.token;
    state.user = res.user;
    localStorage.setItem('sugurta_token', res.token);
    showToast('Ro‘yxatdan muvaffaqiyatli o‘tdingiz! +20 000 so‘m keshbek berildi', 'success');
    await loadAllData();
    renderApp();
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false;
    btn.innerText = t('register_btn');
  }
}

async function handleDemoLogin() {
  try {
    const res = await api.post('/api/auth/demo', {});
    state.token = res.token;
    state.user = res.user;
    localStorage.setItem('sugurta_token', res.token);
    showToast(`Namuna hisobga ulandingiz: ${res.user.first_name} ${res.user.last_name}`, 'success');
    await loadAllData();
    renderApp();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function handleLogout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('sugurta_token');
  showToast('Tizimdan chiqdingiz', 'info');
  renderAuth('login');
}

// ========================================================
// MAIN APPLICATION LAYOUT & ROUTING
// ========================================================
function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="app-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar ${state.mobileMenuOpen ? 'open' : ''}" id="app-sidebar">
        <div class="brand-header">
          <div class="brand-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="brand-text">
            <h2>${t('portal_name')}</h2>
            <span>${t('portal_sub')}</span>
          </div>
        </div>

        <nav class="nav-menu">
          <div class="nav-category">ASOSIY BO‘LIMLAR</div>
          <button class="nav-item ${state.currentTab === 'dashboard' ? 'active' : ''}" onclick="switchTab('dashboard')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>${t('menu_dash')}</span>
          </button>

          <button class="nav-item ${state.currentTab === 'policies' ? 'active' : ''}" onclick="switchTab('policies')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <span>${t('menu_policies')}</span>
            ${state.policies.length ? `<span class="nav-badge">${state.policies.length}</span>` : ''}
          </button>

          <button class="nav-item ${state.currentTab === 'calculator' ? 'active' : ''}" onclick="switchTab('calculator')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
            <span>${t('menu_calc')}</span>
          </button>

          <button class="nav-item ${state.currentTab === 'claims' ? 'active' : ''}" onclick="switchTab('claims')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>${t('menu_claims')}</span>
            ${state.claims.length ? `<span class="nav-badge" style="background:var(--danger)">${state.claims.length}</span>` : ''}
          </button>

          <div class="nav-category">AVTOMOBIL & PROTOKOLLAR</div>
          <button class="nav-item ${state.currentTab === 'fleet' ? 'active' : ''}" onclick="switchTab('fleet')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <span>${t('menu_fleet')}</span>
          </button>

          <button class="nav-item ${state.currentTab === 'fines' ? 'active' : ''}" onclick="switchTab('fines')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>${t('menu_fines')}</span>
          </button>

          <div class="nav-category">EKOTIZIM & BONUSLAR</div>
          <button class="nav-item ${state.currentTab === 'ai' ? 'active' : ''}" onclick="switchTab('ai')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>${t('menu_ai')}</span>
            <span class="nav-badge" style="background:var(--purple)">AI</span>
          </button>

          <button class="nav-item ${state.currentTab === 'agent' ? 'active' : ''}" onclick="switchTab('agent')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <span>${t('menu_agent')}</span>
          </button>

          <button class="nav-item ${state.currentTab === 'referral' ? 'active' : ''}" onclick="switchTab('referral')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/></svg>
            <span>${t('menu_referral')}</span>
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="user-mini-card" onclick="openProfileModal()">
            <div class="user-avatar">${(state.user?.first_name || 'U').charAt(0)}</div>
            <div class="user-details">
              <div class="user-name">${state.user?.first_name} ${state.user?.last_name}</div>
              <div class="user-role">${state.user?.email}</div>
            </div>
            <button onclick="event.stopPropagation(); handleLogout()" style="background:none; border:none; color:var(--text-muted); cursor:pointer;" title="${t('logout')}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <div class="main-wrapper">
        <header class="topbar">
          <div class="topbar-left">
            <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div class="page-title-box">
              <h1>${getPageTitle()}</h1>
              <p>${t('greeting')}, ${state.user?.first_name || 'Foydalanuvchi'}! 👋</p>
            </div>
          </div>

          <div class="topbar-actions">
            <!-- Cashback Badge -->
            <button class="top-action-btn" style="background:var(--emerald-light); color:var(--emerald); border-color:rgba(5,150,105,0.2);" onclick="switchTab('referral')">
              🎁 <b>${fmt(state.user?.cashback || 0)} so‘m</b>
            </button>

            <!-- Language Switcher -->
            <select class="top-action-btn" onchange="changeLanguage(this.value)" style="padding:6px 10px; cursor:pointer;">
              <option value="uz" ${state.lang === 'uz' ? 'selected' : ''}>🇺🇿 UZ</option>
              <option value="ru" ${state.lang === 'ru' ? 'selected' : ''}>🇷🇺 RU</option>
              <option value="en" ${state.lang === 'en' ? 'selected' : ''}>🇬🇧 EN</option>
            </select>

            <!-- Theme Toggle -->
            <button class="theme-toggle-btn" onclick="toggleTheme()" title="Rejimni o‘zgartirish">
              ${state.theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <!-- Notifications -->
            <button class="theme-toggle-btn" onclick="openNotificationsModal()" title="Bildirishnomalar" style="position:relative;">
              🔔
              ${state.stats.unread_notifications ? `<span style="position:absolute; top:6px; right:6px; width:9px; height:9px; background:var(--danger); border-radius:50%;"></span>` : ''}
            </button>
          </div>
        </header>

        <main class="content-body" id="content-body">
          ${renderTabContent()}
        </main>
      </div>

      <!-- MOBILE BOTTOM NAVIGATION -->
      <nav class="mobile-bottom-nav">
        <button class="mobile-nav-btn ${state.currentTab === 'dashboard' ? 'active' : ''}" onclick="switchTab('dashboard')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>Asosiy</span>
        </button>
        <button class="mobile-nav-btn ${state.currentTab === 'policies' ? 'active' : ''}" onclick="switchTab('policies')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
          <span>Polislar</span>
        </button>
        <button class="mobile-nav-btn ${state.currentTab === 'calculator' ? 'active' : ''}" onclick="switchTab('calculator')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/></svg>
          <span>Kalkulyator</span>
        </button>
        <button class="mobile-nav-btn ${state.currentTab === 'claims' ? 'active' : ''}" onclick="switchTab('claims')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
          <span>Da‘volar</span>
        </button>
        <button class="mobile-nav-btn ${state.currentTab === 'ai' ? 'active' : ''}" onclick="switchTab('ai')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>AI Maslahat</span>
        </button>
      </nav>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

function getPageTitle() {
  switch (state.currentTab) {
    case 'dashboard': return t('menu_dash');
    case 'policies': return t('menu_policies');
    case 'calculator': return t('menu_calc');
    case 'claims': return t('menu_claims');
    case 'fleet': return t('menu_fleet');
    case 'fines': return t('menu_fines');
    case 'ai': return t('menu_ai');
    case 'agent': return t('menu_agent');
    case 'referral': return t('menu_referral');
    default: return t('menu_dash');
  }
}

function switchTab(tabName) {
  state.currentTab = tabName;
  state.mobileMenuOpen = false;
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  state.mobileMenuOpen = !state.mobileMenuOpen;
  renderApp();
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('sugurta_theme', state.theme);
  document.documentElement.setAttribute('data-theme', state.theme);
  renderApp();
}

function changeLanguage(lang) {
  state.lang = lang;
  localStorage.setItem('sugurta_lang', lang);
  renderApp();
}

function renderTabContent() {
  switch (state.currentTab) {
    case 'dashboard': return renderDashboardView();
    case 'policies': return renderPoliciesView();
    case 'calculator': return renderCalculatorView();
    case 'claims': return renderClaimsView();
    case 'fleet': return renderFleetView();
    case 'fines': return renderFinesView();
    case 'ai': return renderAIView();
    case 'agent': return renderAgentView();
    case 'referral': return renderReferralView();
    default: return renderDashboardView();
  }
}

// ========================================================
// 1. DASHBOARD VIEW
// ========================================================
function renderDashboardView() {
  const expiringList = state.policies.filter(p => p.is_expiring);
  return `
    <!-- Hero Banner -->
    <div class="hero-banner">
      <div class="hero-content">
        <div class="hero-tag">🛡️ DAVLAT RESURSI VA YAGONA REESTR</div>
        <h2>${t('hero_title')}</h2>
        <p>${t('hero_desc')}</p>
        <div class="hero-actions">
          <button class="btn-primary" style="width:auto; padding:12px 24px;" onclick="switchTab('calculator')">
            ${t('btn_get_policy')} →
          </button>
          <button class="btn-secondary" style="background:rgba(255,255,255,0.15); color:#fff; border-color:rgba(255,255,255,0.3);" onclick="switchTab('claims')">
            ${t('btn_report_claim')}
          </button>
        </div>
      </div>
    </div>

    <!-- Urgent Alerts for Expiring Policies -->
    ${expiringList.length ? `
      <div style="background:var(--accent-light); border:1.5px solid var(--accent); border-radius:var(--radius-lg); padding:16px 20px; margin-bottom:24px; display:flex; align-items:center; justify-content:space-between; gap:16px;">
        <div style="display:flex; align-items:center; gap:14px;">
          <span style="font-size:26px;">⚠️</span>
          <div>
            <b style="color:#92400e; font-size:15px;">Muddati tugayotgan polis mavjud!</b>
            <p style="color:#b45309; font-size:13px; margin:0;">${expiringList[0].company} (${expiringList[0].policy_no}) muddati ${expiringList[0].days_left} kunda tugaydi. Jarimaga tushmaslik uchun hoziroq uzaytiring.</p>
          </div>
        </div>
        <button class="btn-primary" style="width:auto; padding:8px 18px; font-size:13px; background:#d97706;" onclick="renewPolicy(${expiringList[0].id})">
          1-Klikda Uzaytirish
        </button>
      </div>
    ` : ''}

    <!-- Quick Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card" onclick="switchTab('policies')" style="cursor:pointer;">
        <div class="stat-info">
          <span>${t('active_policies')}</span>
          <h3>${state.stats.active_policies || 0} ta</h3>
        </div>
        <div class="stat-icon blue">🛡️</div>
      </div>

      <div class="stat-card" onclick="switchTab('fleet')" style="cursor:pointer;">
        <div class="stat-info">
          <span>${t('total_vehicles')}</span>
          <h3>${state.stats.total_vehicles || 0} ta</h3>
        </div>
        <div class="stat-icon emerald">🚗</div>
      </div>

      <div class="stat-card" onclick="switchTab('referral')" style="cursor:pointer;">
        <div class="stat-info">
          <span>${t('cashback_bal')}</span>
          <h3 style="color:var(--emerald);">${fmt(state.stats.cashback || 0)} <small style="font-size:14px;">so‘m</small></h3>
        </div>
        <div class="stat-icon amber">🎁</div>
      </div>

      <div class="stat-card" onclick="switchTab('claims')" style="cursor:pointer;">
        <div class="stat-info">
          <span>${t('active_claims')}</span>
          <h3>${state.stats.active_claims || 0} ta</h3>
        </div>
        <div class="stat-icon purple">🚨</div>
      </div>
    </div>

    <!-- Insurance Categories Catalog -->
    <div class="section-header">
      <div>
        <h3>${t('catalog_title')}</h3>
        <p style="color:var(--text-muted); font-size:13px;">O‘zbekiston qonunchiligiga mos 100% rasmiy himoya turlari</p>
      </div>
      <button class="top-action-btn" onclick="switchTab('calculator')">Barchasini hisoblash →</button>
    </div>

    <div class="catalog-grid">
      <!-- OSAGO -->
      <div class="catalog-card">
        <div class="catalog-img-box">
          <img src="/assets/images/car_osago.jpg" alt="OSAGO">
          <span class="catalog-badge">Majburiy davlat sug‘urtasi</span>
        </div>
        <div class="catalog-body">
          <h4>OSAGO (Avtojavobgarlik)</h4>
          <p>Barcha transport vositalari uchun qonun bo‘yicha majburiy. 2026-yilgi yangi tartibda 80 mln so‘mgacha yetkazilgan zararni qoplaydi.</p>
          <div class="catalog-footer">
            <div class="catalog-price">180 000 so‘m <span>/ 1 yil</span></div>
            <button class="btn-primary" style="width:auto; padding:8px 16px; font-size:13px;" onclick="openBuyModal('osago')">Olish</button>
          </div>
        </div>
      </div>

      <!-- KASKO -->
      <div class="catalog-card">
        <div class="catalog-img-box">
          <img src="/assets/images/kasko.jpg" alt="KASKO">
          <span class="catalog-badge">To‘liq VIP Himoya</span>
        </div>
        <div class="catalog-body">
          <h4>KASKO (Avtomobil himoyasi)</h4>
          <p>O‘zingizning mashinangizga yetgan har qanday zarar: avariya, o‘g‘irlik, yong‘in yoki tabiiy ofatlarni to‘liq hajmda qoplaydi.</p>
          <div class="catalog-footer">
            <div class="catalog-price">3 200 000 so‘m <span>${t('from_price')}</span></div>
            <button class="btn-primary" style="width:auto; padding:8px 16px; font-size:13px;" onclick="openBuyModal('kasko')">Olish</button>
          </div>
        </div>
      </div>

      <!-- Sayohat -->
      <div class="catalog-card">
        <div class="catalog-img-box">
          <img src="/assets/images/travel.jpg" alt="Travel">
          <span class="catalog-badge">Xalqaro viza talabi</span>
        </div>
        <div class="catalog-body">
          <h4>Sayohat Sug‘urtasi (Travel)</h4>
          <p>Chet elda to‘satdan kasal bo‘lib qolish yoki baxtsiz hodisalarda 30 000 $ gacha tibbiy xarajatlarni to‘liq qoplaydi.</p>
          <div class="catalog-footer">
            <div class="catalog-price">90 000 so‘m <span>${t('from_price')}</span></div>
            <button class="btn-primary" style="width:auto; padding:8px 16px; font-size:13px;" onclick="openBuyModal('sayohat')">Olish</button>
          </div>
        </div>
      </div>

      <!-- Tibbiy -->
      <div class="catalog-card">
        <div class="catalog-img-box">
          <img src="/assets/images/health.jpg" alt="Health">
          <span class="catalog-badge">Salomatlik kafolati</span>
        </div>
        <div class="catalog-body">
          <h4>Ixtiyoriy Tibbiy Sug‘urta</h4>
          <p>Eng ilg‘or xususiy klinikalarda navbatsiz konsultatsiyalar, operatsiyalar, tahlillar va dori-darmonlar to‘liq ta‘minlanadi.</p>
          <div class="catalog-footer">
            <div class="catalog-price">1 400 000 so‘m <span>/ 1 yil</span></div>
            <button class="btn-primary" style="width:auto; padding:8px 16px; font-size:13px;" onclick="openBuyModal('tibbiy')">Olish</button>
          </div>
        </div>
      </div>

      <!-- Uy-joy -->
      <div class="catalog-card">
        <div class="catalog-img-box">
          <img src="/assets/images/home.jpg" alt="Home">
          <span class="catalog-badge">Xonadon & Kvartira</span>
        </div>
        <div class="catalog-body">
          <h4>Uy-joy va Mol-mulk</h4>
          <p>Yong‘in, qo‘shnilardan suv toshishi, chaqmoq va zilziladan ko‘chmas mulk va uning ichidagi jihozlarni himoyalash.</p>
          <div class="catalog-footer">
            <div class="catalog-price">450 000 so‘m <span>/ 1 yil</span></div>
            <button class="btn-primary" style="width:auto; padding:8px 16px; font-size:13px;" onclick="openBuyModal('uy')">Olish</button>
          </div>
        </div>
      </div>

      <!-- Hayot -->
      <div class="catalog-card">
        <div class="catalog-img-box">
          <img src="/assets/images/life.jpg" alt="Life">
          <span class="catalog-badge">Uzoq muddatli jamg‘arma</span>
        </div>
        <div class="catalog-body">
          <h4>Hayot Sug‘urtasi (Jamg‘arma)</h4>
          <p>Oila moliyaviy barqarorligi va bolalar kelajagi uchun foizli uzoq muddatli jamg‘arma va himoya dasturi.</p>
          <div class="catalog-footer">
            <div class="catalog-price">1 200 000 so‘m <span>/ 1 yil</span></div>
            <button class="btn-primary" style="width:auto; padding:8px 16px; font-size:13px;" onclick="openBuyModal('hayot')">Olish</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ========================================================
// 2. POLICIES VIEW (MENING POLISLARIM)
// ========================================================
function renderPoliciesView() {
  const filtered = state.policies.filter(p => {
    if (state.activeFilter === 'active') return !p.is_expired;
    if (state.activeFilter === 'expiring') return p.is_expiring;
    if (state.activeFilter === 'archive') return p.is_expired;
    return true;
  });

  return `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:14px;">
      <div style="display:flex; gap:8px;">
        <button class="top-action-btn ${state.activeFilter === 'all' ? 'active' : ''}" onclick="setPolicyFilter('all')">Barchasi (${state.policies.length})</button>
        <button class="top-action-btn ${state.activeFilter === 'active' ? 'active' : ''}" onclick="setPolicyFilter('active')">Faol</button>
        <button class="top-action-btn ${state.activeFilter === 'expiring' ? 'active' : ''}" onclick="setPolicyFilter('expiring')">Tugayotgan</button>
        <button class="top-action-btn ${state.activeFilter === 'archive' ? 'active' : ''}" onclick="setPolicyFilter('archive')">Arxiv</button>
      </div>

      <button class="btn-primary" style="width:auto; padding:10px 20px;" onclick="openAddPolicyModal()">
        ${t('add_policy_btn')}
      </button>
    </div>

    ${filtered.length ? filtered.map(p => `
      <div class="policy-card">
        <div class="policy-card-main">
          <div class="company-logo-circle">
            ${p.company.charAt(0)}
          </div>
          <div class="policy-details">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
              <h4>${p.type.toUpperCase()} · ${p.company}</h4>
              <span class="badge ${p.is_expired ? 'badge-danger' : p.is_expiring ? 'badge-warning' : 'badge-active'}">
                ${p.is_expired ? t('expired') : p.is_expiring ? `${p.days_left} ${t('days_left')}` : t('active')}
              </span>
            </div>
            <div class="policy-meta">
              <span><b>Polis №:</b> ${p.policy_no}</span>
              ${p.plate ? `<span><b>Davlat raqami:</b> ${p.plate}</span>` : ''}
              <span><b>Muddat:</b> ${p.end_date} gacha</span>
              <span><b>Qoplama:</b> ${p.coverage_amount}</span>
            </div>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <button class="btn-secondary" style="font-size:13px; padding:8px 14px;" onclick="viewEPolisModal(${p.id})">
            📱 ${t('view_epolis')}
          </button>
          <button class="btn-secondary" style="font-size:13px; padding:8px 14px;" onclick="renewPolicy(${p.id})">
            🔄 ${t('renew_1yr')}
          </button>
          <button class="btn-secondary" style="font-size:13px; padding:8px 14px; color:var(--danger);" onclick="deletePolicy(${p.id})">
            ✕
          </button>
        </div>
      </div>
    `).join('') : `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:60px 20px; text-align:center;">
        <span style="font-size:48px;">📄</span>
        <h3 style="margin-top:14px;">Hozircha polislar yo‘q</h3>
        <p style="color:var(--text-muted); font-size:14px; max-width:400px; margin:8px auto 20px;">Istalgan sug‘urta kompaniyasidan olingan polisingizni qo‘shing yoki yangisini onlayn rasmiylashtiring.</p>
        <button class="btn-primary" style="width:auto; padding:12px 24px; margin:0 auto;" onclick="switchTab('calculator')">Yangi Polis Olish</button>
      </div>
    `}
  `;
}

function setPolicyFilter(filter) {
  state.activeFilter = filter;
  renderApp();
}

// E-Polis Certificate Modal with live QR code
function viewEPolisModal(policyId) {
  const p = state.policies.find(x => x.id === policyId);
  if (!p) return;

  const qrId = `qr-${Date.now()}`;
  openModal("Rasmiy Elektron E-Polis Sertifikati", `
    <div class="certificate-modal-box">
      <div class="cert-watermark">SUG‘URTA.UZ</div>
      
      <div class="cert-header">
        <div class="cert-title">
          <h2>O‘ZBEKISTON RESPUBLIKASI</h2>
          <span>YAGONA ELEKTRON SUG‘URTA POLISI (E-POLIS)</span>
        </div>
        <div class="cert-qr" id="${qrId}"></div>
      </div>

      <div class="cert-grid">
        <div class="cert-field">
          <label>Sug‘urta turi</label>
          <b>${p.type.toUpperCase()} Davlat standarti</b>
        </div>
        <div class="cert-field">
          <label>Polis seriya raqami</label>
          <b>${p.policy_no}</b>
        </div>
        <div class="cert-field">
          <label>Sug‘urta kompaniyasi</label>
          <b>${p.company}</b>
        </div>
        <div class="cert-field">
          <label>Polis egasi</label>
          <b>${p.holder_name}</b>
        </div>
        ${p.plate ? `
          <div class="cert-field">
            <label>Davlat transport vositasi raqami</label>
            <b>${p.plate}</b>
          </div>
        ` : ''}
        <div class="cert-field">
          <label>Kafolatlangan sug‘urta summasi</label>
          <b>${p.coverage_amount}</b>
        </div>
        <div class="cert-field">
          <label>Amal qilish boshlanishi</label>
          <b>${p.start_date}</b>
        </div>
        <div class="cert-field">
          <label>Amal qilish tugashi</label>
          <b style="color:var(--emerald);">${p.end_date} 23:59:59</b>
        </div>
      </div>

      <div style="background:#f1f5f9; padding:12px 16px; border-radius:8px; font-size:12px; color:#475569; margin-bottom:20px;">
        🔒 Mazkur elektron polis QR-kod orqali DYXX inspektorlari hamda Davlat Sug‘urta Nazorati yagona axborot tizimida 100% rasmiy haqiqiy hisoblanadi. Qog‘oz ko‘rinishida olib yurish talab etilmaydi.
      </div>

      <div style="display:flex; gap:12px;">
        <button class="btn-primary" onclick="window.print()">
          🖨️ PDF Chop etish / Yuklab olish
        </button>
        <button class="btn-secondary" onclick="closeModal()">
          Yopish
        </button>
      </div>
    </div>
  `);

  setTimeout(() => {
    const el = document.getElementById(qrId);
    if (el && typeof QRCode !== 'undefined') {
      new QRCode(el, {
        text: `https://sugurta.uz/verify/${p.qr_token}`,
        width: 100,
        height: 100,
        colorDark: "#0f172a",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  }, 100);
}

// Renew Policy
async function renewPolicy(id) {
  try {
    const res = await api.post(`/api/policies/${id}/renew`, {});
    showToast(res.message, 'success');
    await loadAllData();
    renderApp();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Delete Policy
async function deletePolicy(id) {
  if (!confirm('Haqiqatdan ham bu polisni o‘chirmoqchimisiz?')) return;
  try {
    await api.delete(`/api/policies/${id}`);
    showToast('Polis o‘chirildi', 'info');
    await loadAllData();
    renderApp();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Add Policy Modal
function openAddPolicyModal() {
  const d = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];
  openModal("Yangi Polis Qo‘shish", `
    <form onsubmit="handleAddPolicy(event)">
      <div class="form-group">
        <label class="form-label">Sug‘urta turi</label>
        <select id="ap-type" class="form-control" required>
          <option value="osago">OSAGO (Majburiy avtofuqarolik)</option>
          <option value="kasko">KASKO (Avtomobil to‘liq himoyasi)</option>
          <option value="sayohat">Sayohat (Chet elga safar)</option>
          <option value="tibbiy">Tibbiy Sug‘urta</option>
          <option value="uy">Uy-joy va Mol-mulk</option>
          <option value="hayot">Hayot Sug‘urtasi</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Sug‘urta Kompaniyasi</label>
        <select id="ap-company" class="form-control" required>
          <option value="Gross Insurance">Gross Insurance</option>
          <option value="O‘zbekinvest">O‘zbekinvest</option>
          <option value="Kafolat Sug‘urta">Kafolat Sug‘urta</option>
          <option value="Alfa Invest">Alfa Invest</option>
          <option value="Universal Sug‘urta">Universal Sug‘urta</option>
          <option value="Neo Insurance">Neo Insurance</option>
          <option value="Trust Insurance">Trust Insurance</option>
          <option value="Euroasia Insurance">Euroasia Insurance</option>
          <option value="Ishonch Sug‘urta">Ishonch Sug‘urta</option>
          <option value="O‘zbekinvest Hayot">O‘zbekinvest Hayot</option>
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Davlat raqami (agar avto bo‘lsa)</label>
          <input type="text" id="ap-plate" class="form-control" placeholder="01 A 777 AA" style="text-transform:uppercase;">
        </div>
        <div class="form-group">
          <label class="form-label">Tugash sanasi</label>
          <input type="date" id="ap-date" class="form-control" value="${d}" required>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">To‘langan narx (so‘mda)</label>
        <input type="number" id="ap-price" class="form-control" value="180000" required>
      </div>

      <button type="submit" class="btn-primary" style="margin-top:14px;">Saqlash va Tasdiqlash</button>
    </form>
  `);
}

async function handleAddPolicy(e) {
  e.preventDefault();
  const type = document.getElementById('ap-type').value;
  const company = document.getElementById('ap-company').value;
  const plate = document.getElementById('ap-plate').value;
  const end_date = document.getElementById('ap-date').value;
  const price = document.getElementById('ap-price').value;

  try {
    const res = await api.post('/api/policies', {
      type,
      company,
      plate,
      end_date,
      price,
      coverage_amount: type === 'osago' ? '80 000 000 so‘m' : 'Standart'
    });
    showToast(res.message, 'success');
    closeModal();
    await loadAllData();
    renderApp();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ========================================================
// 3. CALCULATOR & AGGREGATOR VIEW
// ========================================================
async function renderCalculatorView() {
  await fetchOffers();

  const types = [
    { id: 'osago', name: 'OSAGO', icon: '🚗' },
    { id: 'kasko', name: 'KASKO', icon: '🛡️' },
    { id: 'sayohat', name: 'Sayohat', icon: '✈️' },
    { id: 'tibbiy', name: 'Tibbiy', icon: '🩺' },
    { id: 'uy', name: 'Uy-joy', icon: '🏠' },
    { id: 'hayot', name: 'Hayot', icon: '❤️' }
  ];

  return `
    <div style="margin-bottom:24px;">
      <h2>${t('calc_title')}</h2>
      <p style="color:var(--text-muted); font-size:14px;">Kompaniyalar narxlari, reytinglari va hodisani ko‘rib chiqish tezligini solishtiring</p>
    </div>

    <!-- Step 1: Type Selection Tabs -->
    <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:8px; margin-bottom:24px;">
      ${types.map(tItem => `
        <button class="top-action-btn ${state.selectedType === tItem.id ? 'active' : ''}" 
                style="${state.selectedType === tItem.id ? 'background:var(--primary); color:#fff; border-color:var(--primary);' : ''}; font-size:15px; padding:10px 18px;"
                onclick="selectCalcType('${tItem.id}')">
          <span>${tItem.icon}</span> <b>${tItem.name}</b>
        </button>
      `).join('')}
    </div>

    <!-- Step 2: Parameters Grid -->
    <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:22px; margin-bottom:24px;">
      <h4 style="margin-bottom:16px;">Hisoblash Parametrlari</h4>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
        
        <div>
          <label class="form-label">Haydovchilar yoki Qoplama darajasi</label>
          <select class="form-control" onchange="state.calcOption = this.value; fetchAndRenderOffers();">
            <option value="0" ${state.calcOption == 0 ? 'selected' : ''}>Cheklanmagan (Har qanday shaxs)</option>
            <option value="1" ${state.calcOption == 1 ? 'selected' : ''}>Cheklangan (Faqat 1-4 kishi)</option>
          </select>
        </div>

        <div>
          <label class="form-label">Franshiza (Zararning o‘z hisobingizdan qismi)</label>
          <select class="form-control" onchange="state.calcFranchise = this.value; fetchAndRenderOffers();">
            <option value="0" ${state.calcFranchise == 0 ? 'selected' : ''}>0% (Kompaniya 100% to‘laydi)</option>
            <option value="1" ${state.calcFranchise == 1 ? 'selected' : ''}>5% (Polis 7% arzonroq)</option>
            <option value="2" ${state.calcFranchise == 2 ? 'selected' : ''}>10% (Polis 13% arzonroq)</option>
            <option value="3" ${state.calcFranchise == 3 ? 'selected' : ''}>15% (Polis 18% arzonroq)</option>
          </select>
        </div>

        <div>
          <label class="form-label">Qo‘shimcha xizmatlar</label>
          <div style="display:flex; flex-direction:column; gap:8px; margin-top:4px;">
            <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
              <input type="checkbox" ${state.calcTow ? 'checked' : ''} onchange="state.calcTow = this.checked; fetchAndRenderOffers();" style="accent-color:var(--primary); width:16px; height:16px;">
              <span>🚛 24/7 Evakuator xizmati (+30 000)</span>
            </label>
            <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
              <input type="checkbox" ${state.calcAccident ? 'checked' : ''} onchange="state.calcAccident = this.checked; fetchAndRenderOffers();" style="accent-color:var(--primary); width:16px; height:16px;">
              <span>🩹 Haydovchi va yo‘lovchilar himoyasi (+45 000)</span>
            </label>
          </div>
        </div>

        <div>
          <label class="form-label">Saralash tartibi</label>
          <div style="display:flex; gap:8px;">
            <button class="top-action-btn ${state.calcSort === 'price' ? 'active' : ''}" style="flex:1;" onclick="state.calcSort = 'price'; fetchAndRenderOffers();">
              ${t('sort_price')}
            </button>
            <button class="top-action-btn ${state.calcSort === 'rating' ? 'active' : ''}" style="flex:1;" onclick="state.calcSort = 'rating'; fetchAndRenderOffers();">
              ${t('sort_rating')}
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Step 3: Company Offers -->
    <div class="section-header">
      <h4>Kompaniyalar Takliflari (${state.calcOffers.length} ta)</h4>
      ${state.comparedOffers.length >= 2 ? `
        <button class="btn-primary" style="width:auto; padding:8px 18px; font-size:13px;" onclick="openCompareModal()">
          📊 Tanlanganlarni Solishtirish (${state.comparedOffers.length})
        </button>
      ` : ''}
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:18px;">
      ${state.calcOffers.map((o, idx) => `
        <div style="background:var(--bg-card); border:1.5px solid var(--border); border-radius:var(--radius-lg); padding:22px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-sm); transition:all 0.2s ease;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <div style="display:flex; align-items:center; gap:12px;">
                <div class="company-logo-circle" style="width:44px; height:44px; font-size:16px;">
                  ${o.company.name.charAt(0)}
                </div>
                <div>
                  <h4 style="font-size:16px; margin:0;">${o.company.name}</h4>
                  <span style="font-size:12px; color:var(--text-muted);">${o.company.trust}</span>
                </div>
              </div>
              <div style="background:var(--accent-light); color:var(--accent); padding:4px 8px; border-radius:var(--radius-full); font-size:12px; font-weight:800;">
                ★ ${o.rating}
              </div>
            </div>

            <div style="background:var(--bg-subtle); padding:10px 14px; border-radius:8px; font-size:12px; margin-bottom:14px;">
              <div><b>Qoplama:</b> ${o.coverage}</div>
              <div><b>Ko‘rib chiqish tezligi:</b> ~${o.claim_speed}</div>
              ${o.franchise_percent ? `<div><b>Franshiza:</b> ${o.franchise_percent}%</div>` : ''}
            </div>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:14px;">
              <span style="font-size:12px; color:var(--text-muted);">Yillik to‘lov:</span>
              <span style="font-size:22px; font-weight:800; color:var(--primary);">${fmt(o.price)} so‘m</span>
            </div>

            <div style="display:flex; gap:10px;">
              <button class="btn-primary" style="flex:1; padding:10px;" onclick="openBuyModalWithOffer('${state.selectedType}', '${o.company.name}', ${o.price})">
                ${t('buy_now')}
              </button>
              <button class="btn-secondary" style="padding:10px 14px; font-size:12px;" onclick="toggleCompare(${idx})">
                ${state.comparedOffers.includes(idx) ? '✓ Belgilandi' : '+ Solishtirish'}
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

async function selectCalcType(type) {
  state.selectedType = type;
  state.comparedOffers = [];
  renderApp();
}

async function fetchOffers() {
  try {
    const q = new URLSearchParams({
      type: state.selectedType,
      optionIndex: state.calcOption,
      franchise: state.calcFranchise,
      tow: state.calcTow ? 1 : 0,
      accident: state.calcAccident ? 1 : 0,
      sort: state.calcSort
    });
    const res = await api.get(`/api/calculator/offers?${q.toString()}`);
    state.calcOffers = res.offers;
  } catch (err) {
    console.error('Error fetching offers:', err);
  }
}

async function fetchAndRenderOffers() {
  await fetchOffers();
  renderApp();
}

function toggleCompare(idx) {
  const pos = state.comparedOffers.indexOf(idx);
  if (pos >= 0) {
    state.comparedOffers.splice(pos, 1);
  } else {
    if (state.comparedOffers.length >= 3) {
      return showToast('Ko‘pi bilan 3 ta kompaniyani solishtirish mumkin', 'info');
    }
    state.comparedOffers.push(idx);
  }
  renderApp();
}

function openCompareModal() {
  const offersToCompare = state.comparedOffers.map(i => state.calcOffers[i]);
  openModal("Kompaniyalar Takliflarini Solishtirish", `
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:14px; text-align:left;">
        <thead>
          <tr style="border-bottom:2px solid var(--border);">
            <th style="padding:12px;">Ko‘rsatkich</th>
            ${offersToCompare.map(o => `
              <th style="padding:12px; font-weight:800; color:var(--primary);">${o.company.name}</th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:12px; font-weight:600; color:var(--text-muted);">Yillik narxi</td>
            ${offersToCompare.map(o => `
              <td style="padding:12px; font-size:16px; font-weight:800;">${fmt(o.price)} so‘m</td>
            `).join('')}
          </tr>
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:12px; font-weight:600; color:var(--text-muted);">Mijozlar reytingi</td>
            ${offersToCompare.map(o => `
              <td style="padding:12px; color:var(--accent); font-weight:700;">★ ${o.rating} / 5.0</td>
            `).join('')}
          </tr>
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:12px; font-weight:600; color:var(--text-muted);">Hodisani ko‘rib chiqish</td>
            ${offersToCompare.map(o => `
              <td style="padding:12px;">~${o.claim_speed}</td>
            `).join('')}
          </tr>
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:12px; font-weight:600; color:var(--text-muted);">Kafolatlangan qoplama</td>
            ${offersToCompare.map(o => `
              <td style="padding:12px;">${o.coverage}</td>
            `).join('')}
          </tr>
          <tr>
            <td style="padding:12px;"></td>
            ${offersToCompare.map(o => `
              <td style="padding:12px;">
                <button class="btn-primary" style="padding:8px 14px; font-size:12px;" onclick="closeModal(); openBuyModalWithOffer('${state.selectedType}', '${o.company.name}', ${o.price})">
                  Tanlash
                </button>
              </td>
            `).join('')}
          </tr>
        </tbody>
      </table>
    </div>
  `);
}

// Purchase Modal
function openBuyModal(type) {
  const p = BASE_RATES[type] ? BASE_RATES[type].base : 180000;
  openBuyModalWithOffer(type, 'Gross Insurance', p);
}

const BASE_RATES = {
  osago: { base: 180000 },
  kasko: { base: 3200000 },
  sayohat: { base: 90000 },
  tibbiy: { base: 1400000 },
  uy: { base: 450000 },
  hayot: { base: 1200000 }
};

function openBuyModalWithOffer(type, company, price) {
  let finalPrice = price;
  openModal("Sug‘urta Polisini Rasmiylashtirish", `
    <form onsubmit="handleFinalCheckout(event, '${type}', '${company}', ${price})">
      <div style="background:var(--bg-subtle); padding:16px; border-radius:var(--radius-md); margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span>Sug‘urta turi:</span>
          <b>${type.toUpperCase()}</b>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span>Sug‘urta kompaniyasi:</span>
          <b>${company}</b>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:18px; font-weight:800; color:var(--primary); padding-top:8px; border-top:1px solid var(--border);">
          <span>Jami to‘lov summasi:</span>
          <span id="checkout-total">${fmt(finalPrice)} so‘m</span>
        </div>
      </div>

      ${type === 'osago' || type === 'kasko' ? `
        <div class="form-group">
          <label class="form-label">Avtomobilni tanlang (Avtoparkdan)</label>
          <select id="co-plate" class="form-control">
            ${state.vehicles.length ? state.vehicles.map(v => `
              <option value="${v.plate}">${v.plate} — ${v.model}</option>
            `).join('') : '<option value="">Avtoparkda avtomobil yo‘q (qo‘lda kiritish)</option>'}
          </select>
        </div>
      ` : ''}

      <div class="form-group">
        <label class="form-label">Promokod (Chegirma uchun)</label>
        <div style="display:flex; gap:8px;">
          <input type="text" id="co-promo" class="form-control" placeholder="STK10, VIP20 yoki ZAPCHAST7" style="text-transform:uppercase;">
          <button type="button" class="btn-secondary" onclick="applyPromoCode(${price})">Qo‘llash</button>
        </div>
      </div>

      <div style="margin-bottom:18px;">
        <label class="form-label">To‘lov tizimini tanlang</label>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px;">
          <label style="background:var(--bg-card); border:1.5px solid var(--border); border-radius:var(--radius-md); padding:10px; display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="radio" name="pay-method" value="payme" checked style="accent-color:var(--primary);">
            <b>Payme</b>
          </label>
          <label style="background:var(--bg-card); border:1.5px solid var(--border); border-radius:var(--radius-md); padding:10px; display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="radio" name="pay-method" value="click" style="accent-color:var(--primary);">
            <b>Click</b>
          </label>
          <label style="background:var(--bg-card); border:1.5px solid var(--border); border-radius:var(--radius-md); padding:10px; display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="radio" name="pay-method" value="uzum" style="accent-color:var(--primary);">
            <b>Uzum Bank</b>
          </label>
        </div>
      </div>

      <div style="background:var(--emerald-light); color:var(--emerald); padding:12px; border-radius:var(--radius-md); font-size:13px; font-weight:700; margin-bottom:20px;">
        🎁 Ushbu xariddan so‘ng hisobingizga +${fmt(Math.round(price * 0.03))} so‘m (3%) keshbek beriladi!
      </div>

      <button type="submit" class="btn-primary" id="checkout-submit-btn">
        To‘lash va Polisni Rasmiylashtirish
      </button>
    </form>
  `);
}

async function applyPromoCode(originalPrice) {
  const code = document.getElementById('co-promo').value;
  try {
    const res = await api.post('/api/calculator/apply-promo', { code });
    const discounted = Math.round(originalPrice * (1 - res.discount / 100));
    document.getElementById('checkout-total').innerHTML = `
      <s style="color:var(--text-muted); font-size:14px;">${fmt(originalPrice)}</s> 
      ${fmt(discounted)} so‘m (-${res.discount}%)
    `;
    showToast(res.title + ' muvaffaqiyatli qo‘llanildi!', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function handleFinalCheckout(e, type, company, price) {
  e.preventDefault();
  const plateEl = document.getElementById('co-plate');
  const plate = plateEl ? plateEl.value : '';
  const btn = document.getElementById('checkout-submit-btn');
  btn.disabled = true;
  btn.innerText = 'To‘lov amalga oshirilmoqda...';

  try {
    const end_date = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];
    const res = await api.post('/api/policies', {
      type,
      company,
      plate,
      price,
      end_date,
      coverage_amount: '80 000 000 so‘m'
    });
    showToast(res.message, 'success');
    closeModal();
    await loadAllData();
    switchTab('policies');
    // Open E-Polis directly
    setTimeout(() => viewEPolisModal(res.id), 400);
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false;
  }
}

// ========================================================
// 4. CLAIMS (HODISA VA DA'VOLAR) VIEW
// ========================================================
function renderClaimsView() {
  return `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:14px;">
      <div>
        <h2>${t('claim_tracker')}</h2>
        <p style="color:var(--text-muted); font-size:14px;">Sug‘urta hodisasi yuz berganda tezkor xabar berish va to‘lov jarayonini jonli kuzatish</p>
      </div>

      <button class="btn-primary" style="width:auto; padding:12px 24px;" onclick="openNewClaimModal()">
        🚨 ${t('new_claim_btn')}
      </button>
    </div>

    ${state.claims.length ? state.claims.map(c => `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-xl); padding:26px; margin-bottom:24px; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:18px;">
          <div>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
              <h3 style="font-size:18px;">Ariza № ${c.claim_no}</h3>
              <span class="badge ${c.status_step === 4 ? 'badge-active' : 'badge-warning'}">
                ${c.status_step === 4 ? 'To‘lov yakunlandi' : 'Ko‘rib chiqilmoqda'}
              </span>
            </div>
            <p style="color:var(--text-muted); font-size:13px; margin:0;">
              <b>Kompaniya:</b> ${c.company} · <b>Sana:</b> ${c.created_at} · <b>Joylashuv:</b> ${c.location || 'GPS aniqlangan'}
            </p>
          </div>

          <button class="btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="advanceClaimStep(${c.id})">
            ⏩ ${t('next_step_demo')}
          </button>
        </div>

        <p style="font-size:14px; background:var(--bg-subtle); padding:12px 16px; border-radius:var(--radius-md); margin-bottom:24px;">
          💬 <b>Tavsif:</b> ${c.description}
        </p>

        <!-- 5-Step Visual Progress Tracker -->
        <div class="claims-stepper">
          <div class="stepper-progress-line" style="width: ${c.status_step * 25}%"></div>

          <div class="step-node ${c.status_step >= 0 ? (c.status_step > 0 ? 'completed' : 'current') : ''}">
            <div class="step-circle">${c.status_step > 0 ? '✓' : '1'}</div>
            <span class="step-label">${t('step_0')}</span>
          </div>

          <div class="step-node ${c.status_step >= 1 ? (c.status_step > 1 ? 'completed' : 'current') : ''}">
            <div class="step-circle">${c.status_step > 1 ? '✓' : '2'}</div>
            <span class="step-label">${t('step_1')}</span>
          </div>

          <div class="step-node ${c.status_step >= 2 ? (c.status_step > 2 ? 'completed' : 'current') : ''}">
            <div class="step-circle">${c.status_step > 2 ? '✓' : '3'}</div>
            <span class="step-label">${t('step_2')}</span>
          </div>

          <div class="step-node ${c.status_step >= 3 ? (c.status_step > 3 ? 'completed' : 'current') : ''}">
            <div class="step-circle">${c.status_step > 3 ? '✓' : '4'}</div>
            <span class="step-label">${t('step_3')}</span>
          </div>

          <div class="step-node ${c.status_step === 4 ? 'completed current' : ''}">
            <div class="step-circle">✓</div>
            <span class="step-label">${t('step_4')}</span>
          </div>
        </div>

        <div style="font-size:13px; color:var(--text-muted); text-align:center; margin-top:16px;">
          ℹ️ <b>Oxirgi status:</b> ${c.notes}
        </div>
      </div>
    `).join('') : `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:60px 20px; text-align:center;">
        <span style="font-size:48px;">🛡️</span>
        <h3 style="margin-top:14px;">Hozircha sug‘urta arizalari mavjud emas</h3>
        <p style="color:var(--text-muted); font-size:14px; max-width:400px; margin:8px auto 20px;">Xudo asrasin, ammo hodisa yuz berganda bitta tugma bilan joyning o‘zidan ariza yuborishingiz mumkin.</p>
        <button class="btn-primary" style="width:auto; padding:12px 24px; margin:0 auto;" onclick="openNewClaimModal()">+ Yangi Ariza Qoldirish</button>
      </div>
    `}
  `;
}

function openNewClaimModal() {
  openModal("Sug‘urta Hodisasi Haqida Xabar Berish", `
    <form onsubmit="handleClaimSubmit(event)">
      <div class="form-group">
        <label class="form-label">Qaysi polisingiz bo‘yicha ariza berasiz?</label>
        <select id="cl-policy" class="form-control" required>
          ${state.policies.map(p => `
            <option value="${p.id}">${p.type.toUpperCase()} · ${p.company} (${p.policy_no})</option>
          `).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Hodisa turi</label>
        <select id="cl-type" class="form-control" required>
          <option value="c_yth">🚗 YTH (Avtohalokat)</option>
          <option value="c_med">🩺 Shoshilinch tibbiy holat</option>
          <option value="c_prop">🏠 Ko‘chmas mulk / Xonadon zarari</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Hodisa qayerda va qanday yuz berdi?</label>
        <textarea id="cl-desc" class="form-control" rows="3" placeholder="Sana, aniq ko‘cha va qisqacha tavsif yozing..." required></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Taxminiy zarar summasi (so‘m)</label>
          <input type="number" id="cl-amount" class="form-control" placeholder="Masalan: 3 500 000">
        </div>
        <div class="form-group">
          <label class="form-label">GPS Joylashuv</label>
          <div style="display:flex; gap:8px;">
            <input type="text" id="cl-loc" class="form-control" placeholder="Toshkent sh." readonly>
            <button type="button" class="btn-secondary" onclick="detectGPSLocation()">📍 Aniqlash</button>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Hodisa joyidan fotosuratlar yuklash</label>
        <input type="file" id="cl-files" class="form-control" accept="image/*" multiple>
      </div>

      <button type="submit" class="btn-primary" style="margin-top:14px;" id="claim-submit-btn">
        Arizani Yuborish (Ekspertizaga)
      </button>
    </form>
  `);
}

function detectGPSLocation() {
  if (!navigator.geolocation) return showToast('Brauzeringizda GPS qo‘llab-quvvatlanmaydi', 'error');
  navigator.geolocation.getCurrentPosition(
    pos => {
      const coords = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (GPS orqali)`;
      document.getElementById('cl-loc').value = coords;
      showToast('GPS joylashuvingiz aniqlandi!', 'success');
    },
    () => {
      document.getElementById('cl-loc').value = "41.3111, 69.2797 (Toshkent markaz)";
      showToast('Standart joylashuv kiritildi', 'info');
    }
  );
}

async function handleClaimSubmit(e) {
  e.preventDefault();
  const policy_id = document.getElementById('cl-policy').value;
  const type = document.getElementById('cl-type').value;
  const description = document.getElementById('cl-desc').value;
  const estimated_amount = document.getElementById('cl-amount').value;
  const location = document.getElementById('cl-loc').value;
  const fileInput = document.getElementById('cl-files');

  const formData = new FormData();
  formData.append('policy_id', policy_id);
  formData.append('type', type);
  formData.append('description', description);
  formData.append('estimated_amount', estimated_amount || 0);
  formData.append('location', location || 'Toshkent shahar');

  if (fileInput.files.length) {
    for (let i = 0; i < fileInput.files.length; i++) {
      formData.append('files', fileInput.files[i]);
    }
  }

  const btn = document.getElementById('claim-submit-btn');
  btn.disabled = true;
  btn.innerText = 'Yuborilmoqda...';

  try {
    const res = await api.post('/api/claims', formData);
    showToast(res.message, 'success');
    closeModal();
    await loadAllData();
    renderApp();
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false;
  }
}

async function advanceClaimStep(id) {
  try {
    const res = await api.patch(`/api/claims/${id}/step`, {});
    showToast(res.message, 'success');
    await loadAllData();
    renderApp();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ========================================================
// 5. FLEET (AVTOPARK) VIEW
// ========================================================
function renderFleetView() {
  return `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:14px;">
      <div>
        <h2>${t('menu_fleet')} (${state.vehicles.length} ta)</h2>
        <p style="color:var(--text-muted); font-size:14px;">Barcha avtomobillaringiz texpasporti, texko‘rik sanasi va sug‘urta holatini bitta ro‘yxatda kuzating</p>
      </div>

      <div style="display:flex; gap:10px;">
        <button class="btn-primary" style="width:auto; padding:10px 20px;" onclick="openAddVehicleModal()">
          ${t('add_car_btn')}
        </button>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:20px;">
      ${state.vehicles.map(v => `
        <div style="background:var(--bg-card); border:1.5px solid var(--border); border-radius:var(--radius-xl); padding:24px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
              <div>
                <h3 style="font-size:18px; margin:0;">${v.model}</h3>
                <span style="font-size:12px; color:var(--text-muted);">${v.year}-yil · ${v.color}</span>
              </div>
              <div style="background:#0f172a; color:#fff; border:1px solid #334155; padding:4px 10px; border-radius:6px; font-family:monospace; font-size:14px; font-weight:800; letter-spacing:1px;">
                ${v.plate}
              </div>
            </div>

            <div style="background:var(--bg-subtle); padding:12px 14px; border-radius:var(--radius-md); font-size:13px; margin-bottom:16px;">
              <div style="margin-bottom:6px;"><b>📘 Texpasport:</b> ${v.tech_series} ${v.tech_number}</div>
              <div><b>🚦 Texnik ko‘rik:</b> ${v.tech_inspect_date} gacha</div>
            </div>
          </div>

          <div style="display:flex; gap:10px;">
            <button class="btn-primary" style="flex:1; padding:8px 12px; font-size:13px;" onclick="checkFinesForPlate('${v.plate}')">
              Jarimalar
            </button>
            <button class="btn-secondary" style="color:var(--danger); padding:8px 14px;" onclick="deleteVehicle(${v.id})">
              ✕
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function openAddVehicleModal() {
  openModal("Yangi Avtomobil Qo‘shish", `
    <form onsubmit="handleAddVehicle(event)">
      <div class="form-group">
        <label class="form-label">Davlat raqami</label>
        <input type="text" id="av-plate" class="form-control" placeholder="01 A 777 AA" style="text-transform:uppercase;" required>
      </div>

      <div class="form-group">
        <label class="form-label">Avtomobil modeli</label>
        <input type="text" id="av-model" class="form-control" placeholder="Masalan: Chevrolet Cobalt LTZ" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Ishlab chiqarilgan yili</label>
          <input type="number" id="av-year" class="form-control" value="2024" required>
        </div>
        <div class="form-group">
          <label class="form-label">Rangi</label>
          <input type="text" id="av-color" class="form-control" value="Oq">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Texpasport seriyasi</label>
          <input type="text" id="av-ts" class="form-control" placeholder="AAF" maxlength="3" style="text-transform:uppercase;" required>
        </div>
        <div class="form-group">
          <label class="form-label">Texpasport raqami</label>
          <input type="text" id="av-tn" class="form-control" placeholder="1234567" maxlength="7" required>
        </div>
      </div>

      <button type="submit" class="btn-primary" style="margin-top:14px;">Avtoparkka Qo‘shish</button>
    </form>
  `);
}

async function handleAddVehicle(e) {
  e.preventDefault();
  const plate = document.getElementById('av-plate').value;
  const model = document.getElementById('av-model').value;
  const year = document.getElementById('av-year').value;
  const color = document.getElementById('av-color').value;
  const tech_series = document.getElementById('av-ts').value;
  const tech_number = document.getElementById('av-tn').value;

  try {
    const res = await api.post('/api/vehicles', { plate, model, year, color, tech_series, tech_number });
    showToast(res.message, 'success');
    closeModal();
    await loadAllData();
    renderApp();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteVehicle(id) {
  if (!confirm('Avtomobilni avtoparkdan o‘chirishni tasdiqlaysizmi?')) return;
  try {
    await api.delete(`/api/vehicles/${id}`);
    showToast('Avtomobil o‘chirildi', 'info');
    await loadAllData();
    renderApp();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ========================================================
// 6. FINES & TECH INSPECTION (DYXX)
// ========================================================
async function renderFinesView() {
  const defaultPlate = state.vehicles.length ? state.vehicles[0].plate : '01 A 777 AA';
  let finesData = { fines: [], tech_inspection: {} };

  try {
    finesData = await api.get(`/api/fines/${defaultPlate}`);
  } catch (err) {
    console.error(err);
  }

  return `
    <div style="margin-bottom:24px;">
      <h2>DYXX Jarimalari va Texnik Ko‘rik Holati</h2>
      <p style="color:var(--text-muted); font-size:14px;">Avtomobilingiz davlat raqami bo‘yicha jarimalarni aniqlang va 50% chegirma bilan to‘lang</p>
    </div>

    <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; margin-bottom:24px; display:flex; gap:12px; max-width:600px;">
      <input type="text" id="fine-search-plate" class="form-control" value="${defaultPlate}" style="text-transform:uppercase; font-size:16px; font-weight:700;">
      <button class="btn-primary" style="width:auto; padding:10px 24px;" onclick="searchFines()">Tekshirish</button>
    </div>

    <div id="fines-results-box">
      ${renderFinesList(finesData)}
    </div>
  `;
}

function renderFinesList(data) {
  return `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px;">
      <!-- Tech Inspection Info Card -->
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px;">
        <h4 style="margin-bottom:12px;">🚗 Texnik Ko‘rik Muddatlari</h4>
        <div style="font-size:15px; margin-bottom:6px;">
          <b>Amal qilish muddati:</b> <span style="color:var(--emerald); font-weight:700;">${data.tech_inspection.valid_until || '2027-05-15'} gacha</span>
        </div>
        <p style="color:var(--text-muted); font-size:13px; margin:0;">Muddati yetganda portal sizga avtomatik eslatma yuboradi.</p>
      </div>

      <!-- Fines Summary -->
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px;">
        <h4 style="margin-bottom:12px;">📊 Jarimalar Jamlanmasi</h4>
        <div style="font-size:24px; font-weight:800; color:${data.fines.length ? 'var(--danger)' : 'var(--emerald)'};">
          ${data.fines.length ? `${data.fines.length} ta to‘lanmagan jarima` : '✓ Jarimalar mavjud emas'}
        </div>
      </div>
    </div>

    ${data.fines.map(f => `
      <div style="background:var(--bg-card); border:1.5px solid var(--border); border-radius:var(--radius-lg); padding:22px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; gap:20px;">
        <div>
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
            <span class="badge badge-danger">Qoidabuzarlik</span>
            <b style="font-size:16px;">${f.article}</b>
          </div>
          <p style="font-size:14px; margin-bottom:6px;">${f.description}</p>
          <div style="font-size:12px; color:var(--text-muted);">
            Sana: ${f.date} · Chegirma muddati: ${f.discount_until} gacha
          </div>
        </div>

        <div style="text-align:right;">
          <div style="font-size:13px; color:var(--text-muted); text-decoration:line-through;">${fmt(f.amount)} so‘m</div>
          <div style="font-size:20px; font-weight:800; color:var(--emerald); margin-bottom:8px;">${fmt(f.discount_amount)} so‘m (-50%)</div>
          <button class="btn-primary" style="padding:8px 18px; font-size:13px;" onclick="payFine(${f.id})">
            50% Chegirmada To‘lash
          </button>
        </div>
      </div>
    `).join('')}
  `;
}

async function searchFines() {
  const plate = document.getElementById('fine-search-plate').value;
  try {
    const data = await api.get(`/api/fines/${plate}`);
    document.getElementById('fines-results-box').innerHTML = renderFinesList(data);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function checkFinesForPlate(plate) {
  switchTab('fines');
  setTimeout(() => {
    const el = document.getElementById('fine-search-plate');
    if (el) {
      el.value = plate;
      searchFines();
    }
  }, 200);
}

async function payFine(id) {
  try {
    const res = await api.post(`/api/fines/${id}/pay`, {});
    showToast(res.message, 'success');
    searchFines();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ========================================================
// 7. AI SUG'URTA MASLAHATChISI VIEW
// ========================================================
function renderAIView() {
  return `
    <div style="max-width:800px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:30px;">
        <span style="font-size:42px;">🤖</span>
        <h2 style="font-size:26px; margin-top:8px;">Sug‘urta.uz Aqlli AI Maslahatchisi</h2>
        <p style="color:var(--text-muted); font-size:15px;">Qanday sug‘urta kerakligini tabiiy tilda yozing — AI sizga eng maqbul va arzon variantni tavsiya qiladi</p>
      </div>

      <!-- Quick Suggestion Chips -->
      <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin-bottom:24px;">
        <button class="top-action-btn" onclick="askAI('${t('ai_chip1')}')">${t('ai_chip1')}</button>
        <button class="top-action-btn" onclick="askAI('${t('ai_chip2')}')">${t('ai_chip2')}</button>
        <button class="top-action-btn" onclick="askAI('${t('ai_chip3')}')">${t('ai_chip3')}')</button>
        <button class="top-action-btn" onclick="askAI('${t('ai_chip4')}')">${t('ai_chip4')}</button>
      </div>

      <!-- Chat Input -->
      <div style="background:var(--bg-card); border:1.5px solid var(--border); border-radius:var(--radius-xl); padding:8px 8px 8px 18px; display:flex; align-items:center; gap:10px; box-shadow:var(--shadow-md); margin-bottom:24px;">
        <input type="text" id="ai-input" class="form-control" placeholder="Ehtiyojingizni yozing (masalan: 1 haftaga Turkiyaga boryapman)..." style="border:none; box-shadow:none; font-size:15px;" onkeypress="if(event.key === 'Enter') sendAIChat()">
        <button class="btn-primary" style="width:auto; padding:12px 24px;" onclick="sendAIChat()">
          So‘rash ➤
        </button>
      </div>

      <!-- AI Response Box -->
      <div id="ai-response-box"></div>
    </div>
  `;
}

function askAI(prompt) {
  document.getElementById('ai-input').value = prompt;
  sendAIChat();
}

async function sendAIChat() {
  const input = document.getElementById('ai-input');
  const msg = input.value.trim();
  if (!msg) return;

  const box = document.getElementById('ai-response-box');
  box.innerHTML = `
    <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-xl); padding:30px; text-align:center;">
      <span style="font-size:28px; animation:spin 1s infinite linear;">⚙️</span>
      <h4 style="margin-top:10px;">Sun‘iy intellekt tahlil qilmoqda...</h4>
    </div>
  `;

  try {
    const res = await api.post('/api/ai/advise', { message: msg, language: state.lang });
    box.innerHTML = `
      <div style="background:var(--bg-card); border:1.5px solid var(--primary); border-radius:var(--radius-xl); padding:28px; box-shadow:var(--shadow-lg); animation:fadeInUp 0.3s ease;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
          <div>
            <span class="badge badge-active" style="margin-bottom:8px;">🤖 AI Tavsiyasi (${res.confidence} ishonchlilik)</span>
            <h3 style="font-size:20px; color:var(--primary);">${res.title}</h3>
          </div>
          <div style="text-align:right;">
            <span style="font-size:12px; color:var(--text-muted);">Taxminiy narx:</span>
            <div style="font-size:18px; font-weight:800;">${res.estimatedPrice}</div>
          </div>
        </div>

        <p style="font-size:15px; line-height:1.6; margin-bottom:18px; color:var(--text-main);">
          ${res.explanation}
        </p>

        <div style="background:var(--bg-subtle); padding:12px 16px; border-radius:var(--radius-md); font-size:13px; margin-bottom:20px;">
          🏢 <b>Tavsiya etilgan sug‘urta kompaniyasi:</b> ${res.recommendedCompany}
        </div>

        <button class="btn-primary" style="width:auto; padding:12px 28px;" onclick="openBuyModal('${res.type}')">
          Polisni Rasmiylashtirish →
        </button>
      </div>
    `;
  } catch (err) {
    box.innerHTML = `<div style="color:var(--danger); text-align:center;">${err.message}</div>`;
  }
}

// ========================================================
// 8. AGENT PANEL (CRM)
// ========================================================
async function renderAgentView() {
  let agentData = { sales: [], total_sales_count: 0, total_sales_amount: 0, total_commission: 0, commission_rate: '15%' };
  try {
    agentData = await api.get('/api/agent/overview');
  } catch (err) {
    console.error(err);
  }

  return `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:14px;">
      <div>
        <h2>${t('menu_agent')}</h2>
        <p style="color:var(--text-muted); font-size:14px;">Mijozlarga sug‘urta soting va har bir sotuvdan 15% to‘g‘ridan-to‘g‘ri komissiya daromadi oling</p>
      </div>

      <button class="btn-primary" style="width:auto; padding:10px 20px;" onclick="openAddSaleModal()">
        + Yangi Sotuv Kiritish
      </button>
    </div>

    <!-- Agent Stats Grid -->
    <div class="stats-grid" style="margin-bottom:24px;">
      <div class="stat-card">
        <div class="stat-info">
          <span>Jami Sotuvlar</span>
          <h3>${agentData.total_sales_count} ta</h3>
        </div>
        <div class="stat-icon blue">📈</div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <span>Umumiy Aylanma</span>
          <h3>${fmt(agentData.total_sales_amount)} <small style="font-size:14px;">so‘m</small></h3>
        </div>
        <div class="stat-icon amber">💳</div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <span>Komissiya Balansi (15%)</span>
          <h3 style="color:var(--emerald);">${fmt(agentData.total_commission)} <small style="font-size:14px;">so‘m</small></h3>
        </div>
        <div class="stat-icon emerald">💰</div>
      </div>
    </div>

    <!-- Sales Table -->
    <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden;">
      <table style="width:100%; border-collapse:collapse; font-size:14px; text-align:left;">
        <thead style="background:var(--bg-subtle); border-bottom:1px solid var(--border);">
          <tr>
            <th style="padding:14px;">Mijoz Ismi</th>
            <th style="padding:14px;">Telefon</th>
            <th style="padding:14px;">Sug‘urta Turi</th>
            <th style="padding:14px;">Kompaniya</th>
            <th style="padding:14px;">Summa</th>
            <th style="padding:14px;">Sizning Komissiyangiz</th>
          </tr>
        </thead>
        <tbody>
          ${agentData.sales.map(s => `
            <tr style="border-bottom:1px solid var(--border);">
              <td style="padding:14px; font-weight:700;">${s.client_name}</td>
              <td style="padding:14px; color:var(--text-muted);">${s.client_phone || '—'}</td>
              <td style="padding:14px;"><span class="badge badge-active">${s.type.toUpperCase()}</span></td>
              <td style="padding:14px;">${s.company}</td>
              <td style="padding:14px;">${fmt(s.amount)} so‘m</td>
              <td style="padding:14px; font-weight:800; color:var(--emerald);">+${fmt(s.commission)} so‘m</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openAddSaleModal() {
  openModal("Yangi Sotuv Kiritish", `
    <form onsubmit="handleAddSale(event)">
      <div class="form-group">
        <label class="form-label">Mijoz Ism-Familiyasi</label>
        <input type="text" id="as-name" class="form-control" placeholder="Javohir Toshmatov" required>
      </div>

      <div class="form-group">
        <label class="form-label">Mijoz Telefon Raqami</label>
        <input type="tel" id="as-phone" class="form-control" placeholder="+998 90 123 45 67">
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Sug‘urta turi</label>
          <select id="as-type" class="form-control">
            <option value="osago">OSAGO</option>
            <option value="kasko">KASKO</option>
            <option value="sayohat">Sayohat</option>
            <option value="tibbiy">Tibbiy</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Kompaniya</label>
          <select id="as-company" class="form-control">
            <option value="Gross Insurance">Gross Insurance</option>
            <option value="O‘zbekinvest">O‘zbekinvest</option>
            <option value="Kafolat Sug‘urta">Kafolat Sug‘urta</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Sotuv summasi (so‘m)</label>
        <input type="number" id="as-amount" class="form-control" placeholder="180000" required>
      </div>

      <button type="submit" class="btn-primary" style="margin-top:14px;">Sotuvni Saqlash (+15% Komissiya)</button>
    </form>
  `);
}

async function handleAddSale(e) {
  e.preventDefault();
  const client_name = document.getElementById('as-name').value;
  const client_phone = document.getElementById('as-phone').value;
  const type = document.getElementById('as-type').value;
  const company = document.getElementById('as-company').value;
  const amount = document.getElementById('as-amount').value;

  try {
    const res = await api.post('/api/agent/sales', { client_name, client_phone, type, company, amount });
    showToast(res.message, 'success');
    closeModal();
    renderApp();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ========================================================
// 9. REFERRAL & CASHBACK VIEW
// ========================================================
function renderReferralView() {
  const refLink = `https://sugurta.uz/invite/${state.user?.referral_code || 'SUG777'}`;
  return `
    <div style="max-width:800px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:30px;">
        <span style="font-size:42px;">🎁</span>
        <h2 style="font-size:26px; margin-top:8px;">Do‘stlarni Taklif Qiling va Keshbek Oling</h2>
        <p style="color:var(--text-muted); font-size:15px;">Sizning taklif havolangiz orqali do‘stingiz birinchi polisini olsa, har ikkalangizga ham 10 000 so‘m keshbek beriladi!</p>
      </div>

      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-xl); padding:30px; box-shadow:var(--shadow-md); margin-bottom:24px;">
        <div class="form-group">
          <label class="form-label">Sizning Shaxsiy Referal Kodingiz</label>
          <div style="font-size:28px; font-weight:800; letter-spacing:2px; color:var(--primary); margin-bottom:14px;">
            ${state.user?.referral_code || 'SUG777'}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Taklif havolasi</label>
          <div style="display:flex; gap:10px;">
            <input type="text" class="form-control" value="${refLink}" readonly id="ref-link-input">
            <button class="btn-primary" style="width:auto; padding:10px 20px;" onclick="copyReferralLink()">
              Nusxalash
            </button>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:20px; border-top:1px solid var(--border); margin-top:20px;">
          <div>
            <span style="font-size:13px; color:var(--text-muted);">Siz to‘plagan keshbek:</span>
            <div style="font-size:24px; font-weight:800; color:var(--emerald);">${fmt(state.user?.cashback || 0)} so‘m</div>
          </div>
          <button class="btn-secondary" onclick="simulateFriendInvite()">
            👥 Do‘st qo‘shildi (Demo test)
          </button>
        </div>
      </div>
    </div>
  `;
}

function copyReferralLink() {
  const input = document.getElementById('ref-link-input');
  input.select();
  navigator.clipboard.writeText(input.value);
  showToast('Havola nusxalandi!', 'success');
}

function simulateFriendInvite() {
  state.user.cashback = (state.user.cashback || 0) + 10000;
  showToast('Do‘stingiz polis oldi! +10 000 so‘m keshbek qo‘shildi 🎉', 'success');
  renderApp();
}

// User Profile Modal
function openProfileModal() {
  openModal("Foydalanuvchi Profili", `
    <div>
      <div style="text-align:center; margin-bottom:20px;">
        <div class="user-avatar" style="width:64px; height:64px; font-size:24px; margin:0 auto 10px;">
          ${(state.user?.first_name || 'U').charAt(0)}
        </div>
        <h3>${state.user?.first_name} ${state.user?.last_name}</h3>
        <p style="color:var(--text-muted); font-size:13px;">${state.user?.email}</p>
      </div>

      <div style="background:var(--bg-subtle); padding:16px; border-radius:var(--radius-md); font-size:14px; margin-bottom:20px;">
        <div style="margin-bottom:8px;"><b>Telefon:</b> ${state.user?.phone || 'Kiritilmagan'}</div>
        <div style="margin-bottom:8px;"><b>Referal kod:</b> ${state.user?.referral_code}</div>
        <div><b>Keshbek balansi:</b> ${fmt(state.user?.cashback)} so‘m</div>
      </div>

      <button class="btn-primary" style="background:var(--danger);" onclick="closeModal(); handleLogout()">
        Tizimdan Chiqish
      </button>
    </div>
  `);
}

// Notifications Modal
function openNotificationsModal() {
  openModal("Bildirishnomalar Markazi", `
    <div style="display:flex; justify-content:space-between; margin-bottom:14px;">
      <span>So‘nggi xabarlar</span>
      <button onclick="markAllNotificationsRead()" style="background:none; border:none; color:var(--primary); font-size:12px; font-weight:700; cursor:pointer;">
        Barchasini o‘qilgan qilish
      </button>
    </div>

    ${state.notifications.length ? state.notifications.map(n => `
      <div style="background:var(--bg-subtle); padding:12px 14px; border-radius:var(--radius-md); margin-bottom:10px;">
        <div style="font-weight:700; font-size:14px; margin-bottom:2px;">${n.title}</div>
        <p style="font-size:13px; color:var(--text-muted); margin:0;">${n.message}</p>
      </div>
    `).join('') : '<p style="text-align:center; color:var(--text-muted);">Yangi bildirishnomalar yo‘q</p>'}
  `);
}

async function markAllNotificationsRead() {
  try {
    await api.patch('/api/notifications/read-all', {});
    state.stats.unread_notifications = 0;
    showToast('Barchasi o‘qildi', 'info');
    closeModal();
    renderApp();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Start Application on Load
window.addEventListener('DOMContentLoaded', init);
