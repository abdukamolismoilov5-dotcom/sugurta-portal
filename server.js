const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'sugurta_respublika_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads dir
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({ storage });

// JWT Middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token mavjud emas' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token yaroqsiz yoki muddati o‘tgan' });
    req.user = decoded;
    next();
  });
}

// ==========================================
// 1. AUTHENTICATION (NO SMS, EMAIL + PASSWORD)
// ==========================================

// Register
app.post('/api/auth/register', (req, res) => {
  const { first_name, last_name, email, password, phone } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: 'Barcha maydonlarni (Ism, Familiya, Email, Parol) to‘ldiring!' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const refCode = 'SUG' + Math.floor(1000 + Math.random() * 9000);

  db.get('SELECT id FROM users WHERE email = ?', [cleanEmail], (err, row) => {
    if (err) return res.status(500).json({ error: 'Baza xatosi' });
    if (row) return res.status(400).json({ error: 'Bu email bilan allaqachon ro‘yxatdan o‘tilgan!' });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    db.run(
      `INSERT INTO users (first_name, last_name, email, password_hash, phone, referral_code, balance, cashback)
       VALUES (?, ?, ?, ?, ?, ?, 100000, 20000)`,
      [first_name.trim(), last_name.trim(), cleanEmail, hash, phone || '+998 90 000 00 00', refCode],
      function (err2) {
        if (err2) return res.status(500).json({ error: 'Ro‘yxatdan o‘tishda xato yuz berdi' });
        const userId = this.lastID;

        // Create welcome notification
        db.run(
          `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
          [userId, 'Xush kelibsiz!', 'Ro‘yxatdan muvaffaqiyatli o‘tdingiz. 20 000 so‘m tabrik keshbegi hisobingizga o‘tkazildi!', 'success']
        );

        const token = jwt.sign({ id: userId, email: cleanEmail }, JWT_SECRET, { expiresIn: '30d' });
        res.json({
          message: 'Muvaffaqiyatli ro‘yxatdan o‘tdingiz!',
          token,
          user: {
            id: userId,
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: cleanEmail,
            phone: phone || '+998 90 000 00 00',
            balance: 100000,
            cashback: 20000,
            referral_code: refCode
          }
        });
      }
    );
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email va parolni kiriting!' });
  }

  const cleanEmail = email.toLowerCase().trim();

  db.get('SELECT * FROM users WHERE email = ?', [cleanEmail], (err, user) => {
    if (err) return res.status(500).json({ error: 'Baza xatosi' });
    if (!user) return res.status(400).json({ error: 'Bunday email topilmadi!' });

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Parol noto‘g‘ri kiritildi!' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    delete user.password_hash;
    res.json({
      message: 'Xush kelibsiz!',
      token,
      user
    });
  });
});

// Demo login (Instant 1-click test)
app.post('/api/auth/demo', (req, res) => {
  db.get('SELECT * FROM users WHERE email = ?', ['demo@sugurta.uz'], (err, user) => {
    if (err || !user) return res.status(500).json({ error: 'Demo foydalanuvchi topilmadi' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    delete user.password_hash;
    res.json({
      message: 'Demo hisobga ulandingiz!',
      token,
      user
    });
  });
});

// Get current user profile
app.get('/api/auth/me', authMiddleware, (req, res) => {
  db.get('SELECT id, first_name, last_name, email, phone, role, balance, cashback, referral_code, theme, language FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    res.json(user);
  });
});

// ==========================================
// 2. DASHBOARD STATS
// ==========================================
app.get('/api/dashboard/stats', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const now = new Date().toISOString().split('T')[0];
  const in30Days = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const queries = {
    active_policies: 'SELECT COUNT(*) as c FROM policies WHERE user_id = ? AND end_date >= ?',
    expiring_policies: 'SELECT COUNT(*) as c FROM policies WHERE user_id = ? AND end_date >= ? AND end_date <= ?',
    total_vehicles: 'SELECT COUNT(*) as c FROM vehicles WHERE user_id = ?',
    active_claims: 'SELECT COUNT(*) as c FROM claims WHERE user_id = ? AND status_step < 4',
    unread_notifs: 'SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND is_read = 0'
  };

  db.get(queries.active_policies, [userId, now], (e1, r1) => {
    db.get(queries.expiring_policies, [userId, now, in30Days], (e2, r2) => {
      db.get(queries.total_vehicles, [userId], (e3, r3) => {
        db.get(queries.active_claims, [userId], (e4, r4) => {
          db.get(queries.unread_notifs, [userId], (e5, r5) => {
            db.get('SELECT balance, cashback FROM users WHERE id = ?', [userId], (e6, u) => {
              res.json({
                active_policies: r1 ? r1.c : 0,
                expiring_policies: r2 ? r2.c : 0,
                total_vehicles: r3 ? r3.c : 0,
                active_claims: r4 ? r4.c : 0,
                unread_notifications: r5 ? r5.c : 0,
                balance: u ? u.balance : 0,
                cashback: u ? u.cashback : 0
              });
            });
          });
        });
      });
    });
  });
});

// ==========================================
// 3. POLICIES (POLISLAR)
// ==========================================

// Get user policies
app.get('/api/policies', authMiddleware, (req, res) => {
  const userId = req.user.id;
  db.all('SELECT * FROM policies WHERE user_id = ? ORDER BY end_date ASC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Baza xatosi' });
    const now = Date.now();
    const list = rows.map((p) => {
      const endTs = new Date(p.end_date).getTime();
      const diffDays = Math.ceil((endTs - now) / 86400000);
      return {
        ...p,
        days_left: diffDays,
        is_expired: diffDays < 0,
        is_expiring: diffDays >= 0 && diffDays <= 30
      };
    });
    res.json(list);
  });
});

// Add new policy
app.post('/api/policies', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { type, company, plate, coverage_amount, price, end_date, auto_renew } = req.body;

  if (!type || !company || !end_date) {
    return res.status(400).json({ error: 'Majburiy maydonlarni to‘ldiring' });
  }

  const policy_no = `${type.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const qr_token = `EP-UZ-${policy_no}-${new Date().getFullYear()}`;
  const start_date = new Date().toISOString().split('T')[0];
  const finalPrice = Number(price) || 180000;
  const cashGain = Math.round(finalPrice * 0.03); // 3% cashback

  db.get('SELECT first_name, last_name FROM users WHERE id = ?', [userId], (err, u) => {
    const holder_name = u ? `${u.first_name} ${u.last_name}` : 'Mijoz';

    db.run(
      `INSERT INTO policies (user_id, type, company, policy_no, plate, holder_name, coverage_amount, price, start_date, end_date, auto_renew, qr_token, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [userId, type, company, policy_no, plate || '', holder_name, coverage_amount || 'Standart', finalPrice, start_date, end_date, auto_renew ? 1 : 0, qr_token],
      function (err2) {
        if (err2) return res.status(500).json({ error: 'Polis saqlanmadi' });

        // Update cashback and add notification
        db.run('UPDATE users SET cashback = cashback + ? WHERE id = ?', [cashGain, userId]);
        db.run(
          'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
          [userId, 'Yangi polis rasmiylashtirildi', `${company} kompaniyasidan ${policy_no} raqamli polis olindi. +${cashGain.toLocaleString()} so‘m keshbek berildi!`, 'success']
        );

        res.json({
          message: 'Polis muvaffaqiyatli rasmiylashtirildi!',
          id: this.lastID,
          policy_no,
          cashback_earned: cashGain
        });
      }
    );
  });
});

// Delete policy
app.delete('/api/policies/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM policies WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: 'O‘chirishda xatolik' });
    res.json({ message: 'Polis o‘chirildi' });
  });
});

// Toggle auto-renew
app.patch('/api/policies/:id/auto-renew', authMiddleware, (req, res) => {
  const { auto_renew, card_last4 } = req.body;
  db.run(
    'UPDATE policies SET auto_renew = ?, card_last4 = ? WHERE id = ? AND user_id = ?',
    [auto_renew ? 1 : 0, card_last4 || '•••• 8888', req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Xatolik' });
      res.json({ message: auto_renew ? 'Avto-uzaytirish yoqildi' : 'Avto-uzaytirish o‘chirildi' });
    }
  );
});

// Renew policy for 1 year
app.post('/api/policies/:id/renew', authMiddleware, (req, res) => {
  db.get('SELECT * FROM policies WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, p) => {
    if (err || !p) return res.status(404).json({ error: 'Polis topilmadi' });

    const currentEnd = new Date(p.end_date).getTime();
    const newEnd = new Date(Math.max(currentEnd, Date.now()) + 365 * 86400000).toISOString().split('T')[0];

    db.run('UPDATE policies SET end_date = ?, status = ? WHERE id = ?', [newEnd, 'active', p.id], (err2) => {
      if (err2) return res.status(500).json({ error: 'Yangilashda xato' });

      db.run(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [req.user.id, 'Polis uzaytirildi', `${p.policy_no} raqamli polis ${newEnd} gacha 1 yilga uzaytirildi.`, 'success']
      );

      res.json({ message: `Polis ${newEnd} gacha muvaffaqiyatli uzaytirildi!`, new_end_date: newEnd });
    });
  });
});

// ==========================================
// 4. VEHICLES (AVTOPARK)
// ==========================================
app.get('/api/vehicles', authMiddleware, (req, res) => {
  db.all('SELECT * FROM vehicles WHERE user_id = ? ORDER BY id DESC', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Baza xatosi' });
    res.json(rows);
  });
});

app.post('/api/vehicles', authMiddleware, (req, res) => {
  const { plate, model, year, color, tech_series, tech_number, tech_inspect_date } = req.body;
  if (!plate || !model || !tech_series || !tech_number) {
    return res.status(400).json({ error: 'Davlat raqami, model va texpasport maydonlari to‘ldirilishi shart' });
  }

  db.run(
    `INSERT INTO vehicles (user_id, plate, model, year, color, tech_series, tech_number, tech_inspect_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.user.id,
      plate.toUpperCase().trim(),
      model.trim(),
      year || 2024,
      color || 'Oq',
      tech_series.toUpperCase().trim(),
      tech_number.trim(),
      tech_inspect_date || new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
    ],
    function (err) {
      if (err) return res.status(500).json({ error: 'Mashina saqlanmadi' });
      res.json({ message: 'Avtomobil avtoparkka qo‘shildi!', id: this.lastID });
    }
  );
});

app.delete('/api/vehicles/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM vehicles WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: 'O‘chirishda xatolik' });
    res.json({ message: 'Avtomobil o‘chirildi' });
  });
});

// ==========================================
// 5. CLAIMS (HODISA VA DA'VOLAR)
// ==========================================
app.get('/api/claims', authMiddleware, (req, res) => {
  db.all('SELECT * FROM claims WHERE user_id = ? ORDER BY id DESC', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Baza xatosi' });
    res.json(rows);
  });
});

app.post('/api/claims', authMiddleware, upload.array('files', 5), (req, res) => {
  const { policy_id, company, type, description, estimated_amount, location } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Hodisa tavsifini yozing' });
  }

  const claim_no = `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const fileNames = req.files ? req.files.map((f) => f.filename) : [];

  db.run(
    `INSERT INTO claims (claim_no, user_id, policy_id, company, type, description, estimated_amount, status_step, location, files, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, 'Ariza sug‘urta kompaniyasiga qabul qilindi. Mutaxassis tayinlanmoqda.')`,
    [
      claim_no,
      req.user.id,
      policy_id || null,
      company || 'Gross Insurance',
      type || 'c_yth',
      description,
      Number(estimated_amount) || 0,
      location || 'Toshkent shahar (GPS aniqlangan)',
      JSON.stringify(fileNames)
    ],
    function (err) {
      if (err) return res.status(500).json({ error: 'Ariza saqlanmadi' });

      db.run(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [req.user.id, 'Da‘vo arizasi qabul qilindi', `${claim_no} raqamli arizangiz muvaffaqiyatli yuborildi. Holatni kuzatishingiz mumkin.`, 'info']
      );

      res.json({ message: 'Arizangiz qabul qilindi!', claim_no, id: this.lastID });
    }
  );
});

// Advance claim step for demo testing
app.patch('/api/claims/:id/step', authMiddleware, (req, res) => {
  db.get('SELECT * FROM claims WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, c) => {
    if (err || !c) return res.status(404).json({ error: 'Ariza topilmadi' });

    const nextStep = Math.min(4, c.status_step + 1);
    const stepNotes = [
      'Ariza sug‘urta kompaniyasiga qabul qilindi.',
      'Hujjatlar va zararlar ekspertiza tomonidan ko‘rib chiqilmoqda.',
      'Hodisa va zarar miqdori tasdiqlandi.',
      'Sug‘urta to‘lovi tayyorlanmoqda, bank hisobiga o‘tkazish buyrug‘i berildi.',
      'Sug‘urta to‘lovi to‘liq mijoz kartasiga o‘tkazib berildi!'
    ];

    db.run(
      'UPDATE claims SET status_step = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [nextStep, stepNotes[nextStep], c.id],
      (err2) => {
        if (err2) return res.status(500).json({ error: 'Yangilashda xato' });

        if (nextStep === 4) {
          db.run(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [req.user.id, 'Sug‘urta to‘lovi amalga oshirildi!', `${c.claim_no} bo‘yicha to‘lov muvaffaqiyatli yakunlandi.`, 'success']
          );
        }

        res.json({ message: `Ariza holati: ${stepNotes[nextStep]}`, status_step: nextStep });
      }
    );
  });
});

// ==========================================
// 6. CALCULATOR & COMPANIES
// ==========================================
const COMPANIES = [
  { id: 'gross', name: 'Gross Insurance', rating: 4.9, claimsDays: 2, icon: 'shield-check', trust: 'Yuqori ishonchlilik (AAA)', phone: '+998 71 207 00 11' },
  { id: 'uzinv', name: 'O‘zbekinvest', rating: 4.8, claimsDays: 3, icon: 'award', trust: 'Davlat litsenziyasi (AAA)', phone: '+998 71 180 00 00' },
  { id: 'kafolat', name: 'Kafolat Sug‘urta', rating: 4.8, claimsDays: 3, icon: 'check-circle', trust: 'Milliy yetakchi (AA+)', phone: '+998 71 202 20 22' },
  { id: 'alfa', name: 'Alfa Invest', rating: 4.7, claimsDays: 2, icon: 'zap', trust: 'Tezkor to‘lov kafolati', phone: '+998 71 120 00 55' },
  { id: 'universal', name: 'Universal Sug‘urta', rating: 4.7, claimsDays: 4, icon: 'globe', trust: 'Respublika bo‘ylab 45 filial', phone: '+998 71 200 55 22' },
  { id: 'neo', name: 'Neo Insurance', rating: 4.9, claimsDays: 1, icon: 'smartphone', trust: 'To‘liq onlayn sug‘urta', phone: '+998 71 203 00 33' },
  { id: 'trust', name: 'Trust Insurance', rating: 4.6, claimsDays: 3, icon: 'lock', trust: 'Bank kafolati tizimi', phone: '+998 71 230 40 50' },
  { id: 'euro', name: 'Euroasia Insurance', rating: 4.6, claimsDays: 4, icon: 'compass', trust: 'Xalqaro sug‘urta tajribasi', phone: '+998 71 200 80 80' },
  { id: 'ishonch', name: 'Ishonch Sug‘urta', rating: 4.5, claimsDays: 5, icon: 'heart', trust: 'Ishonchli himoya', phone: '+998 71 281 44 44' },
  { id: 'uzhayot', name: 'O‘zbekinvest Hayot', rating: 4.9, claimsDays: 3, icon: 'heart-pulse', trust: 'Uzoq muddatli hayot sug‘urtasi', lifeOnly: true, phone: '+998 71 207 10 00' }
];

const BASE_RATES = {
  osago: { base: 180000, coverage: '80 000 000 so‘m' },
  kasko: { base: 3200000, coverage: 'Avtomobil to‘liq bozor qiymati' },
  sayohat: { base: 90000, coverage: '30 000 $ (Jahon bo‘ylab)' },
  tibbiy: { base: 1400000, coverage: '50 000 000 so‘m (Klinikalarda)' },
  uy: { base: 450000, coverage: 'Ko‘chmas mulk qiymatining 80%i' },
  hayot: { base: 1200000, coverage: 'Jamg‘arma va 100 mln so‘m himoya' }
};

app.get('/api/calculator/offers', (req, res) => {
  const { type = 'osago', optionIndex = 0, franchise = 0, tow = 0, accident = 0, sort = 'price' } = req.query;

  const baseConfig = BASE_RATES[type] || BASE_RATES.osago;
  let multiplier = 1;

  if (type === 'osago') multiplier = optionIndex == 1 ? 1.4 : 1.0;
  if (type === 'kasko') multiplier = optionIndex == 1 ? 1.8 : optionIndex == 2 ? 2.6 : 1.0;
  if (type === 'sayohat') multiplier = optionIndex == 1 ? 1.7 : optionIndex == 2 ? 2.6 : 1.0;
  if (type === 'tibbiy') multiplier = optionIndex == 1 ? 1.35 : optionIndex == 2 ? 1.9 : 1.0;
  if (type === 'uy') multiplier = optionIndex == 1 ? 1.5 : 1.0;

  // Franchise discount: 0% -> 1.0, 5% -> 0.93, 10% -> 0.87, 15% -> 0.82
  const franchiseFactors = [1.0, 0.93, 0.87, 0.82];
  const franchiseFactor = franchiseFactors[Number(franchise)] || 1.0;

  // Add-ons
  const extras = (Number(tow) ? 30000 : 0) + (Number(accident) ? 45000 : 0);

  const availableCompanies = COMPANIES.filter((c) => (type === 'hayot' ? c.lifeOnly : !c.lifeOnly));

  const offers = availableCompanies.map((c, idx) => {
    // slight variation per company for realism
    const companyVariance = [1.0, 0.98, 1.02, 0.95, 1.04, 0.97, 1.01, 0.96, 0.99, 1.0][idx % 10];
    const price = Math.round(baseConfig.base * multiplier * franchiseFactor * companyVariance) + extras;

    return {
      company: c,
      price,
      coverage: baseConfig.coverage,
      term: '1 yil',
      claim_speed: `${c.claimsDays} ish kuni`,
      rating: c.rating,
      franchise_percent: [0, 5, 10, 15][Number(franchise)] || 0,
      extras_included: { tow: !!Number(tow), accident: !!Number(accident) }
    };
  });

  if (sort === 'rating') {
    offers.sort((a, b) => b.rating - a.rating);
  } else {
    offers.sort((a, b) => a.price - b.price);
  }

  res.json({ type, offers });
});

// Promo code validator
app.post('/api/calculator/apply-promo', (req, res) => {
  const { code } = req.body;
  const PROMOS = {
    STK10: { discount: 10, title: '10% hamkorlik chegirmasi' },
    SALON5: { discount: 5, title: 'Avtosalon 5% chegirmasi' },
    ZAPCHAST7: { discount: 7, title: 'Avto ehtiyot qismlar 7%' },
    VIP20: { discount: 20, title: 'Respublika VIP 20% keshbek' }
  };

  const clean = (code || '').toUpperCase().trim();
  if (PROMOS[clean]) {
    res.json({ valid: true, code: clean, ...PROMOS[clean] });
  } else {
    res.status(400).json({ valid: false, error: 'Bunday promokod mavjud emas yoki muddati tugagan!' });
  }
});

// ==========================================
// 7. DYXX FINES & TECH INSPECTION
// ==========================================
app.get('/api/fines/:plate', (req, res) => {
  const plate = req.params.plate.toUpperCase().trim();

  db.all('SELECT * FROM fines WHERE plate = ?', [plate], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Baza xatosi' });

    // Seed mock fines if none found for demo purposes
    if (!rows || rows.length === 0) {
      const mockFine = {
        id: 999,
        plate,
        article: '128-modda 2-qism',
        description: 'To‘xtash yoki to‘xtab turish qoidalarini buzish (Toshkent sh., Navoiy ko‘chasi)',
        amount: 340000,
        discount_amount: 170000,
        discount_until: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
        status: 'unpaid',
        date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0]
      };
      return res.json({
        plate,
        fines: [mockFine],
        tech_inspection: {
          valid_until: new Date(Date.now() + 240 * 86400000).toISOString().split('T')[0],
          status: 'valid'
        }
      });
    }

    res.json({
      plate,
      fines: rows,
      tech_inspection: {
        valid_until: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
        status: 'valid'
      }
    });
  });
});

app.post('/api/fines/:id/pay', authMiddleware, (req, res) => {
  db.run('UPDATE fines SET status = "paid" WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: 'To‘lovda xato' });
    res.json({ message: 'Jarima to‘landi! 50% chegirma muvaffaqiyatli qo‘llanildi.' });
  });
});

// ==========================================
// 8. AI SUG‘URTA MASLAHATChISI
// ==========================================
app.post('/api/ai/advise', (req, res) => {
  const { message, language = 'uz' } = req.body;
  if (!message) return res.status(400).json({ error: 'Savolingizni yozing' });

  const q = message.toLowerCase();
  let type = 'osago';
  let title = 'Majburiy sug‘urta (OSAGO)';
  let explanation = '';
  let recommendedCompany = 'Gross Insurance';
  let estimatedPrice = '180 000 so‘m';

  if (q.includes('kasko') || q.includes('qimmat mashina') || q.includes('avariya') || q.includes('urib ketsa')) {
    type = 'kasko';
    title = 'To‘liq KASKO sug‘urtasi';
    explanation = 'Yangi yoki qimmatbaho avtomobilingizni har qanday avariya, o‘g‘irlik, tosh sachrashi yoki tabiiy ofatdan 100% himoya qiladi.';
    recommendedCompany = 'O‘zbekinvest';
    estimatedPrice = '3 200 000 so‘mdan';
  } else if (q.includes('safar') || q.includes('chet el') || q.includes('viza') || q.includes('dubay') || q.includes('turkiya') || q.includes('samolyot')) {
    type = 'sayohat';
    title = 'Xalqaro Sayohat Sug‘urtasi (Travel)';
    explanation = 'Elchixonalar viza talabiga to‘liq javob beradi. Chet elda 30 000 $ gacha bo‘lgan shoshilinch tibbiy yordam, evakuatsiya va yuk yo‘qolishini qoplaydi.';
    recommendedCompany = 'Kafolat Sug‘urta';
    estimatedPrice = '90 000 so‘mdan';
  } else if (q.includes('davolanish') || q.includes('doktor') || q.includes('klinika') || q.includes('salomatlik') || q.includes('tibbiy')) {
    type = 'tibbiy';
    title = 'Ixtiyoriy Tibbiy Sug‘urta';
    explanation = 'Xususiy pullik klinikalarda navbatsiz davolanish, tahlillar va dori-darmon xarajatlarini 50 mln so‘mgacha qoplab beradi.';
    recommendedCompany = 'Neo Insurance';
    estimatedPrice = '1 400 000 so‘m / yil';
  } else if (q.includes('uy') || q.includes('kvartira') || q.includes('xonadon') || q.includes('yongin') || q.includes('suv')) {
    type = 'uy';
    title = 'Uy-joy va Mol-mulk Sug‘urtasi';
    explanation = 'Kvartira yoki hovlingizni yong‘in, qo‘shnilardan suv toshishi va tabiiy ofatlardan to‘liq himoyalaydi.';
    recommendedCompany = 'Alfa Invest';
    estimatedPrice = '450 000 so‘mdan';
  } else {
    type = 'osago';
    title = 'OSAGO (Davlat standartidagi majburiy avto sug‘urta)';
    explanation = 'Har bir haydovchi uchun qonun bo‘yicha majburiy. 2026-yilgi yangi tartibga binoan qoplama 80 000 000 so‘mgacha oshirilgan.';
    recommendedCompany = 'Gross Insurance';
    estimatedPrice = '180 000 so‘m';
  }

  res.json({
    type,
    title,
    explanation,
    recommendedCompany,
    estimatedPrice,
    confidence: '98%',
    action_url: `/api/calculator/offers?type=${type}`
  });
});

// ==========================================
// 9. AGENT CRM & REVIEWS & NOTIFICATIONS
// ==========================================
app.get('/api/agent/overview', authMiddleware, (req, res) => {
  db.all('SELECT * FROM agent_sales WHERE agent_id = ? ORDER BY id DESC', [req.user.id], (err, sales) => {
    if (err) return res.status(500).json({ error: 'Baza xatosi' });
    const totalSales = sales.reduce((acc, s) => acc + s.amount, 0);
    const totalCommission = sales.reduce((acc, s) => acc + s.commission, 0);
    res.json({
      sales,
      total_sales_count: sales.length,
      total_sales_amount: totalSales,
      total_commission: totalCommission,
      commission_rate: '15%'
    });
  });
});

app.post('/api/agent/sales', authMiddleware, (req, res) => {
  const { client_name, client_phone, type, company, amount } = req.body;
  if (!client_name || !amount) return res.status(400).json({ error: 'Mijoz ismi va summa kerak' });

  const numAmount = Number(amount);
  const commission = Math.round(numAmount * 0.15); // 15%

  db.run(
    `INSERT INTO agent_sales (agent_id, client_name, client_phone, type, company, amount, commission)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, client_name, client_phone || '', type || 'osago', company || 'Gross Insurance', numAmount, commission],
    function (err) {
      if (err) return res.status(500).json({ error: 'Sotuv saqlanmadi' });
      db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [commission, req.user.id]);
      res.json({ message: 'Sotuv saqlandi! + ' + commission.toLocaleString() + ' so‘m komissiya hisoblFactoryndi', id: this.lastID });
    }
  );
});

// Notifications
app.get('/api/notifications', authMiddleware, (req, res) => {
  db.all('SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 20', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Baza xatosi' });
    res.json(rows);
  });
});

app.patch('/api/notifications/read-all', authMiddleware, (req, res) => {
  db.run('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id], (err) => {
    if (err) return res.status(500).json({ error: 'Xatolik' });
    res.json({ message: 'Barchasi o‘qilgan deb belgilandi' });
  });
});

// Reviews
app.get('/api/reviews', (req, res) => {
  db.all('SELECT * FROM reviews ORDER BY id DESC LIMIT 30', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Baza xatosi' });
    res.json(rows);
  });
});

app.post('/api/reviews', authMiddleware, (req, res) => {
  const { company, rating, comment } = req.body;
  db.get('SELECT first_name, last_name FROM users WHERE id = ?', [req.user.id], (err, u) => {
    const name = u ? `${u.first_name} ${u.last_name.charAt(0)}.` : 'Foydalanuvchi';
    db.run(
      'INSERT INTO reviews (company, user_name, rating, comment) VALUES (?, ?, ?, ?)',
      [company || 'Gross Insurance', name, Number(rating) || 5, comment || ''],
      function (err2) {
        if (err2) return res.status(500).json({ error: 'Baholashda xato' });
        res.json({ message: 'Rahmat! Fikringiz qabul qilindi.' });
      }
    );
  });
});

// Fallback to SPA index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🛡️  RESPUBLIKA YAGONA SUG'URTA PORTALI ISHGA TUSHDI!`);
  console.log(`🚀 Server manzili: http://localhost:${PORT}`);
  console.log(`===============================================`);
});
