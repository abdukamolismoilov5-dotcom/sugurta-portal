const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'sugurta.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 1. Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'client',
      balance INTEGER DEFAULT 0,
      cashback INTEGER DEFAULT 25000,
      referral_code TEXT UNIQUE,
      theme TEXT DEFAULT 'light',
      language TEXT DEFAULT 'uz',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Vehicles table
  db.run(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plate TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER DEFAULT 2024,
      color TEXT DEFAULT 'Oq',
      tech_series TEXT NOT NULL,
      tech_number TEXT NOT NULL,
      tech_inspect_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // 3. Policies table
  db.run(`
    CREATE TABLE IF NOT EXISTS policies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      company TEXT NOT NULL,
      policy_no TEXT NOT NULL,
      plate TEXT,
      holder_name TEXT,
      coverage_amount TEXT,
      price INTEGER NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      auto_renew INTEGER DEFAULT 0,
      card_last4 TEXT,
      qr_token TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // 4. Claims table
  db.run(`
    CREATE TABLE IF NOT EXISTS claims (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      claim_no TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      policy_id INTEGER,
      company TEXT,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      estimated_amount INTEGER DEFAULT 0,
      approved_amount INTEGER DEFAULT 0,
      status_step INTEGER DEFAULT 0,
      location TEXT,
      files TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // 5. Fines table
  db.run(`
    CREATE TABLE IF NOT EXISTS fines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plate TEXT NOT NULL,
      article TEXT NOT NULL,
      description TEXT NOT NULL,
      amount INTEGER NOT NULL,
      discount_amount INTEGER,
      discount_until DATE,
      status TEXT DEFAULT 'unpaid',
      date DATETIME NOT NULL
    )
  `);

  // 6. Notifications table
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // 7. Agent sales table
  db.run(`
    CREATE TABLE IF NOT EXISTS agent_sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id INTEGER NOT NULL,
      client_name TEXT NOT NULL,
      client_phone TEXT NOT NULL,
      type TEXT NOT NULL,
      company TEXT NOT NULL,
      amount INTEGER NOT NULL,
      commission INTEGER NOT NULL,
      status TEXT DEFAULT 'completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (agent_id) REFERENCES users (id)
    )
  `);

  // 8. Reviews table
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      user_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed demo user and default data if empty
  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (!err && row.count === 0) {
      console.log('Seeding initial data...');
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('123456', salt);

      db.run(
        `INSERT INTO users (first_name, last_name, email, password_hash, phone, role, balance, cashback, referral_code) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['Abdukamol', 'Ismoilov', 'demo@sugurta.uz', hash, '+998 90 123 45 67', 'client', 150000, 45000, 'SUG7777'],
        function (err) {
          if (err) return console.error(err);
          const userId = this.lastID;

          // Seed Vehicles
          db.run(
            `INSERT INTO vehicles (user_id, plate, model, year, color, tech_series, tech_number, tech_inspect_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, '01 A 777 AA', 'Chevrolet Cobalt LTZ', 2023, 'Oq', 'AAF', '1234567', '2027-05-15']
          );
          db.run(
            `INSERT INTO vehicles (user_id, plate, model, year, color, tech_series, tech_number, tech_inspect_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, '01 B 888 BB', 'Chevrolet Tracker Premier', 2024, 'Qora metallik', 'ABF', '7654321', '2027-11-20']
          );

          // Seed Policies
          const now = Date.now();
          const day = 86400000;
          const fmt = (ts) => new Date(ts).toISOString().split('T')[0];

          db.run(
            `INSERT INTO policies (user_id, type, company, policy_no, plate, holder_name, coverage_amount, price, start_date, end_date, auto_renew, qr_token, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              userId,
              'osago',
              'Gross Insurance',
              'OS-774912',
              '01 A 777 AA',
              'Abdukamol Ismoilov',
              '80 000 000 so‘m',
              180000,
              fmt(now - 300 * day),
              fmt(now + 65 * day),
              1,
              'EP-UZ-OS-774912-2027',
              'active'
            ]
          );

          db.run(
            `INSERT INTO policies (user_id, type, company, policy_no, plate, holder_name, coverage_amount, price, start_date, end_date, auto_renew, qr_token, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              userId,
              'kasko',
              'O‘zbekinvest',
              'KS-903125',
              '01 B 888 BB',
              'Abdukamol Ismoilov',
              '230 000 000 so‘m',
              3500000,
              fmt(now - 120 * day),
              fmt(now + 245 * day),
              0,
              'EP-UZ-KS-903125-2027',
              'active'
            ]
          );

          db.run(
            `INSERT INTO policies (user_id, type, company, policy_no, plate, holder_name, coverage_amount, price, start_date, end_date, auto_renew, qr_token, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              userId,
              'sayohat',
              'Kafolat Sug‘urta',
              'SY-419082',
              '',
              'Abdukamol Ismoilov',
              '30 000 $ (Dubay, BAA)',
              120000,
              fmt(now - 10 * day),
              fmt(now + 20 * day),
              0,
              'EP-UZ-SY-419082-2027',
              'active'
            ]
          );

          // Seed Claim
          db.run(
            `INSERT INTO claims (claim_no, user_id, policy_id, company, type, description, estimated_amount, approved_amount, status_step, location, files, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              'CLM-2026-8842',
              userId,
              1,
              'Gross Insurance',
              'c_yth',
              'Chilonzor 9-mavze chorrahasida orqa bamperga zarba berildi. DYXX xodimlari bayonnoma tuzdi.',
              4200000,
              3800000,
              2,
              '41.2856, 69.2034 (Toshkent, Chilonzor)',
              JSON.stringify(['bamper_zarba1.jpg', 'protokol_dyxx.jpg']),
              'Ekspertiza tasdiqladi. Sug‘urta to‘lovi yaqin 2 kun ichida tayyorlanadi.'
            ]
          );

          // Seed Fines
          db.run(
            `INSERT INTO fines (plate, article, description, amount, discount_amount, discount_until, status, date)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['01 A 777 AA', '128-modda 3-qism', 'Tezlikni 10-20 km/soat oshirish (Radarda 82 km/soat)', 340000, 170000, fmt(now + 8 * day), 'unpaid', fmt(now - 4 * day)]
          );

          // Seed Notifications
          db.run(
            `INSERT INTO notifications (user_id, title, message, type)
             VALUES (?, ?, ?, ?)`,
            [userId, 'Xush kelibsiz!', 'Respublika yagona sug‘urta portaliga xush kelibsiz. Barcha polislaringiz endi xavfsiz himoyada.', 'info']
          );
          db.run(
            `INSERT INTO notifications (user_id, title, message, type)
             VALUES (?, ?, ?, ?)`,
            [userId, 'Da‘vo arizasi tasdiqlandi', 'CLM-2026-8842 raqamli arizangiz ekspertiza tomonidan tasdiqlandi. To‘lov: 3 800 000 so‘m.', 'success']
          );

          // Seed Agent Sales
          db.run(
            `INSERT INTO agent_sales (agent_id, client_name, client_phone, type, company, amount, commission)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, 'Bobur Rahimov', '+998 90 987 65 43', 'osago', 'Gross Insurance', 180000, 27000]
          );
          db.run(
            `INSERT INTO agent_sales (agent_id, client_name, client_phone, type, company, amount, commission)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, 'Shahnoza Aliyeva', '+998 93 111 22 33', 'kasko', 'O‘zbekinvest', 4200000, 630000]
          );

          // Seed Reviews
          const reviews = [
            ['Gross Insurance', 'Javohir M.', 5, 'Hodisa yuz berganda 1 soatda ekspert keldi va pulni 3 kunda to‘lab berishdi. Juda mamnunman!'],
            ['O‘zbekinvest', 'Alisher K.', 5, 'KASKO polisini juda qulay va tez rasmiylashtirdim. Servis zo‘r.'],
            ['Kafolat Sug‘urta', 'Dilnoza B.', 4, 'Sayohat sug‘urtasini vizaga topshirish uchun oldim, elchixona darhol qabul qildi.'],
            ['Alfa Invest', 'Sardor R.', 5, 'Keshbek va chegirmalar bilan juda arzon tushdi. Tavsiya qilaman!'],
            ['Neo Insurance', 'Jasur T.', 4, 'Ilova orqali rasmiylashtirish juda qulay ekan.']
          ];
          reviews.forEach(([co, name, r, c]) => {
            db.run(
              `INSERT INTO reviews (company, user_name, rating, comment) VALUES (?, ?, ?, ?)`,
              [co, name, r, c]
            );
          });

          console.log('Seed completed successfully!');
        }
      );
    }
  });
});

module.exports = db;
