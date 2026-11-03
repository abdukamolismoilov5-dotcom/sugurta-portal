// Pure JavaScript Persistent Database Engine (No C++ GLIBC dependencies)
// Fully compatible with Linux, Ubuntu, Alpine, Windows, Mac, Render, Railway, Vercel
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataFile = path.join(__dirname, 'sugurta_data.json');

// In-memory data store with JSON persistence
let data = {
  users: [],
  vehicles: [],
  policies: [],
  claims: [],
  fines: [],
  notifications: [],
  agent_sales: [],
  reviews: []
};

function saveData() {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

function loadData() {
  if (fs.existsSync(dataFile)) {
    try {
      const content = fs.readFileSync(dataFile, 'utf8');
      data = JSON.parse(content);
    } catch (e) {
      console.warn('Could not read existing dataFile, initializing fresh seed');
      seedInitialData();
    }
  } else {
    seedInitialData();
  }
}

function seedInitialData() {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('123456', salt);
  const now = Date.now();
  const day = 86400000;
  const fmt = (ts) => new Date(ts).toISOString().split('T')[0];

  data.users = [
    {
      id: 1,
      first_name: 'Abdukamol',
      last_name: 'Ismoilov',
      email: 'demo@sugurta.uz',
      password_hash: hash,
      phone: '+998 90 123 45 67',
      role: 'client',
      balance: 150000,
      cashback: 45000,
      referral_code: 'SUG7777',
      theme: 'light',
      language: 'uz',
      created_at: fmt(now - 30 * day)
    }
  ];

  data.vehicles = [
    {
      id: 1,
      user_id: 1,
      plate: '01 A 777 AA',
      model: 'Chevrolet Cobalt LTZ',
      year: 2023,
      color: 'Oq',
      tech_series: 'AAF',
      tech_number: '1234567',
      tech_inspect_date: '2027-05-15',
      created_at: fmt(now - 100 * day)
    },
    {
      id: 2,
      user_id: 1,
      plate: '01 B 888 BB',
      model: 'Chevrolet Tracker Premier',
      year: 2024,
      color: 'Qora metallik',
      tech_series: 'ABF',
      tech_number: '7654321',
      tech_inspect_date: '2027-11-20',
      created_at: fmt(now - 40 * day)
    }
  ];

  data.policies = [
    {
      id: 1,
      user_id: 1,
      type: 'osago',
      company: 'Gross Insurance',
      policy_no: 'OS-774912',
      plate: '01 A 777 AA',
      holder_name: 'Abdukamol Ismoilov',
      coverage_amount: '80 000 000 so‘m',
      price: 180000,
      start_date: fmt(now - 300 * day),
      end_date: fmt(now + 65 * day),
      auto_renew: 1,
      card_last4: '•••• 8888',
      qr_token: 'EP-UZ-OS-774912-2027',
      status: 'active',
      created_at: fmt(now - 300 * day)
    },
    {
      id: 2,
      user_id: 1,
      type: 'kasko',
      company: 'O‘zbekinvest',
      policy_no: 'KS-903125',
      plate: '01 B 888 BB',
      holder_name: 'Abdukamol Ismoilov',
      coverage_amount: '230 000 000 so‘m',
      price: 3500000,
      start_date: fmt(now - 120 * day),
      end_date: fmt(now + 245 * day),
      auto_renew: 0,
      card_last4: '',
      qr_token: 'EP-UZ-KS-903125-2027',
      status: 'active',
      created_at: fmt(now - 120 * day)
    },
    {
      id: 3,
      user_id: 1,
      type: 'sayohat',
      company: 'Kafolat Sug‘urta',
      policy_no: 'SY-419082',
      plate: '',
      holder_name: 'Abdukamol Ismoilov',
      coverage_amount: '30 000 $ (Dubay, BAA)',
      price: 120000,
      start_date: fmt(now - 10 * day),
      end_date: fmt(now + 20 * day),
      auto_renew: 0,
      card_last4: '',
      qr_token: 'EP-UZ-SY-419082-2027',
      status: 'active',
      created_at: fmt(now - 10 * day)
    }
  ];

  data.claims = [
    {
      id: 1,
      claim_no: 'CLM-2026-8842',
      user_id: 1,
      policy_id: 1,
      company: 'Gross Insurance',
      type: 'c_yth',
      description: 'Chilonzor 9-mavze chorrahasida orqa bamperga zarba berildi. DYXX xodimlari bayonnoma tuzdi.',
      estimated_amount: 4200000,
      approved_amount: 3800000,
      status_step: 2,
      location: '41.2856, 69.2034 (Toshkent, Chilonzor)',
      files: JSON.stringify(['bamper_zarba1.jpg', 'protokol_dyxx.jpg']),
      notes: 'Ekspertiza tasdiqladi. Sug‘urta to‘lovi yaqin 2 kun ichida tayyorlanadi.',
      created_at: fmt(now - 5 * day),
      updated_at: fmt(now - 1 * day)
    }
  ];

  data.fines = [
    {
      id: 1,
      plate: '01 A 777 AA',
      article: '128-modda 3-qism',
      description: 'Tezlikni 10-20 km/soat oshirish (Radarda 82 km/soat)',
      amount: 340000,
      discount_amount: 170000,
      discount_until: fmt(now + 8 * day),
      status: 'unpaid',
      date: fmt(now - 4 * day)
    }
  ];

  data.notifications = [
    {
      id: 1,
      user_id: 1,
      title: 'Xush kelibsiz!',
      message: 'Respublika yagona sug‘urta portaliga xush kelibsiz. Barcha polislaringiz endi xavfsiz himoyada.',
      type: 'info',
      is_read: 0,
      created_at: fmt(now)
    },
    {
      id: 2,
      user_id: 1,
      title: 'Da‘vo arizasi tasdiqlandi',
      message: 'CLM-2026-8842 raqamli arizangiz ekspertiza tomonidan tasdiqlandi. To‘lov: 3 800 000 so‘m.',
      type: 'success',
      is_read: 0,
      created_at: fmt(now - 1 * day)
    }
  ];

  data.agent_sales = [
    {
      id: 1,
      agent_id: 1,
      client_name: 'Bobur Rahimov',
      client_phone: '+998 90 987 65 43',
      type: 'osago',
      company: 'Gross Insurance',
      amount: 180000,
      commission: 27000,
      status: 'completed',
      created_at: fmt(now - 5 * day)
    },
    {
      id: 2,
      agent_id: 1,
      client_name: 'Shahnoza Aliyeva',
      client_phone: '+998 93 111 22 33',
      type: 'kasko',
      company: 'O‘zbekinvest',
      amount: 4200000,
      commission: 630000,
      status: 'completed',
      created_at: fmt(now - 2 * day)
    }
  ];

  data.reviews = [
    { id: 1, company: 'Gross Insurance', user_name: 'Javohir M.', rating: 5, comment: 'Hodisa yuz berganda 1 soatda ekspert keldi va pulni 3 kunda to‘lab berishdi. Juda mamnunman!', created_at: fmt(now - 15 * day) },
    { id: 2, company: 'O‘zbekinvest', user_name: 'Alisher K.', rating: 5, comment: 'KASKO polisini juda qulay va tez rasmiylashtirdim. Servis zo‘r.', created_at: fmt(now - 12 * day) },
    { id: 3, company: 'Kafolat Sug‘urta', user_name: 'Dilnoza B.', rating: 4, comment: 'Sayohat sug‘urtasini vizaga topshirish uchun oldim, elchixona darhol qabul qildi.', created_at: fmt(now - 8 * day) },
    { id: 4, company: 'Alfa Invest', user_name: 'Sardor R.', rating: 5, comment: 'Keshbek va chegirmalar bilan juda arzon tushdi. Tavsiya qilaman!', created_at: fmt(now - 4 * day) },
    { id: 5, company: 'Neo Insurance', user_name: 'Jasur T.', rating: 4, comment: 'Ilova orqali rasmiylashtirish juda qulay ekan.', created_at: fmt(now - 2 * day) }
  ];

  saveData();
}

// Initial load
loadData();

// Database Interface Compatible with SQLite API
const db = {
  serialize(callback) {
    if (callback) callback();
  },

  run(sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    params = params || [];
    callback = callback || function () {};

    const cleanSql = sql.trim();
    let lastID = 1;

    try {
      // 1. CREATE TABLE
      if (cleanSql.startsWith('CREATE TABLE')) {
        return callback.call({ lastID: 0 }, null);
      }

      // 2. INSERT INTO users
      if (cleanSql.startsWith('INSERT INTO users')) {
        const id = data.users.length ? Math.max(...data.users.map(u => u.id)) + 1 : 1;
        const [first_name, last_name, email, password_hash, phone, referral_code] = params;
        const newUser = {
          id,
          first_name,
          last_name,
          email,
          password_hash,
          phone,
          referral_code,
          role: 'client',
          balance: 100000,
          cashback: 20000,
          theme: 'light',
          language: 'uz',
          created_at: new Date().toISOString().split('T')[0]
        };
        data.users.push(newUser);
        saveData();
        return callback.call({ lastID: id }, null);
      }

      // 3. INSERT INTO policies
      if (cleanSql.startsWith('INSERT INTO policies')) {
        const id = data.policies.length ? Math.max(...data.policies.map(p => p.id)) + 1 : 1;
        const [user_id, type, company, policy_no, plate, holder_name, coverage_amount, price, start_date, end_date, auto_renew, qr_token] = params;
        const newPolicy = {
          id,
          user_id,
          type,
          company,
          policy_no,
          plate: plate || '',
          holder_name: holder_name || 'Mijoz',
          coverage_amount: coverage_amount || 'Standart',
          price: Number(price) || 180000,
          start_date,
          end_date,
          auto_renew: auto_renew ? 1 : 0,
          card_last4: '',
          qr_token,
          status: 'active',
          created_at: new Date().toISOString().split('T')[0]
        };
        data.policies.unshift(newPolicy);
        saveData();
        return callback.call({ lastID: id }, null);
      }

      // 4. INSERT INTO vehicles
      if (cleanSql.startsWith('INSERT INTO vehicles')) {
        const id = data.vehicles.length ? Math.max(...data.vehicles.map(v => v.id)) + 1 : 1;
        const [user_id, plate, model, year, color, tech_series, tech_number, tech_inspect_date] = params;
        const newVehicle = {
          id,
          user_id,
          plate,
          model,
          year,
          color,
          tech_series,
          tech_number,
          tech_inspect_date,
          created_at: new Date().toISOString().split('T')[0]
        };
        data.vehicles.unshift(newVehicle);
        saveData();
        return callback.call({ lastID: id }, null);
      }

      // 5. INSERT INTO claims
      if (cleanSql.startsWith('INSERT INTO claims')) {
        const id = data.claims.length ? Math.max(...data.claims.map(c => c.id)) + 1 : 1;
        const [claim_no, user_id, policy_id, company, type, description, estimated_amount, location, files] = params;
        const newClaim = {
          id,
          claim_no,
          user_id,
          policy_id: policy_id || null,
          company: company || 'Gross Insurance',
          type: type || 'c_yth',
          description,
          estimated_amount: Number(estimated_amount) || 0,
          approved_amount: 0,
          status_step: 0,
          location: location || 'Toshkent',
          files: files || '[]',
          notes: 'Ariza sug‘urta kompaniyasiga qabul qilindi. Mutaxassis tayinlanmoqda.',
          created_at: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString().split('T')[0]
        };
        data.claims.unshift(newClaim);
        saveData();
        return callback.call({ lastID: id }, null);
      }

      // 6. INSERT INTO notifications
      if (cleanSql.startsWith('INSERT INTO notifications')) {
        const id = data.notifications.length ? Math.max(...data.notifications.map(n => n.id)) + 1 : 1;
        const [user_id, title, message, type] = params;
        data.notifications.unshift({
          id,
          user_id,
          title,
          message,
          type: type || 'info',
          is_read: 0,
          created_at: new Date().toISOString().split('T')[0]
        });
        saveData();
        return callback.call({ lastID: id }, null);
      }

      // 7. INSERT INTO agent_sales
      if (cleanSql.startsWith('INSERT INTO agent_sales')) {
        const id = data.agent_sales.length ? Math.max(...data.agent_sales.map(s => s.id)) + 1 : 1;
        const [agent_id, client_name, client_phone, type, company, amount, commission] = params;
        data.agent_sales.unshift({
          id,
          agent_id,
          client_name,
          client_phone,
          type,
          company,
          amount: Number(amount),
          commission: Number(commission),
          status: 'completed',
          created_at: new Date().toISOString().split('T')[0]
        });
        saveData();
        return callback.call({ lastID: id }, null);
      }

      // 8. INSERT INTO reviews
      if (cleanSql.startsWith('INSERT INTO reviews')) {
        const id = data.reviews.length ? Math.max(...data.reviews.map(r => r.id)) + 1 : 1;
        const [company, user_name, rating, comment] = params;
        data.reviews.unshift({
          id,
          company,
          user_name,
          rating: Number(rating),
          comment: comment || '',
          created_at: new Date().toISOString().split('T')[0]
        });
        saveData();
        return callback.call({ lastID: id }, null);
      }

      // 9. DELETE FROM policies
      if (cleanSql.startsWith('DELETE FROM policies')) {
        const [id, user_id] = params;
        data.policies = data.policies.filter(p => !(p.id == id && p.user_id == user_id));
        saveData();
        return callback.call({ changes: 1 }, null);
      }

      // 10. DELETE FROM vehicles
      if (cleanSql.startsWith('DELETE FROM vehicles')) {
        const [id, user_id] = params;
        data.vehicles = data.vehicles.filter(v => !(v.id == id && v.user_id == user_id));
        saveData();
        return callback.call({ changes: 1 }, null);
      }

      // 11. UPDATE policies SET auto_renew
      if (cleanSql.includes('UPDATE policies SET auto_renew = ?')) {
        const [auto_renew, card_last4, id, user_id] = params;
        const p = data.policies.find(x => x.id == id && x.user_id == user_id);
        if (p) {
          p.auto_renew = auto_renew ? 1 : 0;
          p.card_last4 = card_last4;
          saveData();
        }
        return callback.call({ changes: 1 }, null);
      }

      // 12. UPDATE policies SET end_date
      if (cleanSql.includes('UPDATE policies SET end_date = ?')) {
        const [end_date, status, id] = params;
        const p = data.policies.find(x => x.id == id);
        if (p) {
          p.end_date = end_date;
          p.status = status;
          saveData();
        }
        return callback.call({ changes: 1 }, null);
      }

      // 13. UPDATE claims SET status_step
      if (cleanSql.includes('UPDATE claims SET status_step = ?')) {
        const [status_step, notes, id] = params;
        const c = data.claims.find(x => x.id == id);
        if (c) {
          c.status_step = status_step;
          c.notes = notes;
          c.updated_at = new Date().toISOString().split('T')[0];
          saveData();
        }
        return callback.call({ changes: 1 }, null);
      }

      // 14. UPDATE users SET cashback
      if (cleanSql.includes('UPDATE users SET cashback = cashback + ?')) {
        const [cashGain, userId] = params;
        const u = data.users.find(x => x.id == userId);
        if (u) {
          u.cashback = (u.cashback || 0) + Number(cashGain);
          saveData();
        }
        return callback.call({ changes: 1 }, null);
      }

      // 15. UPDATE users SET balance
      if (cleanSql.includes('UPDATE users SET balance = balance + ?')) {
        const [balGain, userId] = params;
        const u = data.users.find(x => x.id == userId);
        if (u) {
          u.balance = (u.balance || 0) + Number(balGain);
          saveData();
        }
        return callback.call({ changes: 1 }, null);
      }

      // 16. UPDATE fines SET status = "paid"
      if (cleanSql.includes('UPDATE fines SET status = "paid"')) {
        const [id] = params;
        const f = data.fines.find(x => x.id == id);
        if (f) {
          f.status = 'paid';
          saveData();
        }
        return callback.call({ changes: 1 }, null);
      }

      // 17. UPDATE notifications SET is_read = 1
      if (cleanSql.includes('UPDATE notifications SET is_read = 1')) {
        const [userId] = params;
        data.notifications.forEach(n => {
          if (n.user_id == userId) n.is_read = 1;
        });
        saveData();
        return callback.call({ changes: 1 }, null);
      }

      // Default fallback
      callback.call({ changes: 1 }, null);
    } catch (err) {
      console.error('DB Run error:', err);
      callback(err);
    }
  },

  get(sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    params = params || [];
    callback = callback || function () {};

    const cleanSql = sql.trim();

    try {
      // 1. SELECT COUNT(*) as count FROM users
      if (cleanSql.includes('SELECT COUNT(*) as count FROM users')) {
        return callback(null, { count: data.users.length });
      }

      // 2. Dashboard count queries
      if (cleanSql.includes('SELECT COUNT(*) as c FROM policies') && cleanSql.includes('AND end_date <= ?')) {
        const [userId, now, in30Days] = params;
        const count = data.policies.filter(p => p.user_id == userId && p.end_date >= now && p.end_date <= in30Days).length;
        return callback(null, { c: count });
      }

      if (cleanSql.includes('SELECT COUNT(*) as c FROM policies') && cleanSql.includes('AND end_date >= ?')) {
        const [userId, now] = params;
        const count = data.policies.filter(p => p.user_id == userId && p.end_date >= now).length;
        return callback(null, { c: count });
      }

      if (cleanSql.includes('SELECT COUNT(*) as c FROM vehicles')) {
        const [userId] = params;
        const count = data.vehicles.filter(v => v.user_id == userId).length;
        return callback(null, { c: count });
      }

      if (cleanSql.includes('SELECT COUNT(*) as c FROM claims')) {
        const [userId] = params;
        const count = data.claims.filter(c => c.user_id == userId && c.status_step < 4).length;
        return callback(null, { c: count });
      }

      if (cleanSql.includes('SELECT COUNT(*) as c FROM notifications')) {
        const [userId] = params;
        const count = data.notifications.filter(n => n.user_id == userId && n.is_read == 0).length;
        return callback(null, { c: count });
      }

      // 3. SELECT balance, cashback FROM users
      if (cleanSql.includes('SELECT balance, cashback FROM users WHERE id = ?')) {
        const [userId] = params;
        const u = data.users.find(x => x.id == userId);
        return callback(null, u ? { balance: u.balance, cashback: u.cashback } : null);
      }

      // 4. SELECT id FROM users WHERE email = ?
      if (cleanSql.includes('SELECT id FROM users WHERE email = ?')) {
        const [email] = params;
        const u = data.users.find(x => (x.email || '').toLowerCase() === (email || '').toLowerCase());
        return callback(null, u ? { id: u.id } : null);
      }

      // 5. SELECT * FROM users WHERE email = ?
      if (cleanSql.includes('SELECT * FROM users WHERE email = ?')) {
        const [email] = params;
        const u = data.users.find(x => (x.email || '').toLowerCase() === (email || '').toLowerCase());
        return callback(null, u ? { ...u } : null);
      }

      // 6. SELECT ... FROM users WHERE id = ?
      if (cleanSql.includes('FROM users WHERE id = ?')) {
        const [id] = params;
        const u = data.users.find(x => x.id == id);
        return callback(null, u ? { ...u } : null);
      }

      // 7. SELECT * FROM policies WHERE id = ?
      if (cleanSql.includes('FROM policies WHERE id = ?')) {
        const [id, user_id] = params;
        const p = data.policies.find(x => x.id == id && (user_id ? x.user_id == user_id : true));
        return callback(null, p ? { ...p } : null);
      }

      // 8. SELECT * FROM claims WHERE id = ?
      if (cleanSql.includes('FROM claims WHERE id = ?')) {
        const [id, user_id] = params;
        const c = data.claims.find(x => x.id == id && (user_id ? x.user_id == user_id : true));
        return callback(null, c ? { ...c } : null);
      }

      // Fallback
      callback(null, null);
    } catch (err) {
      console.error('DB Get error:', err);
      callback(err);
    }
  },

  all(sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    params = params || [];
    callback = callback || function () {};

    const cleanSql = sql.trim();

    try {
      // 1. SELECT * FROM policies WHERE user_id = ?
      if (cleanSql.includes('FROM policies WHERE user_id = ?')) {
        const [userId] = params;
        const res = data.policies.filter(p => p.user_id == userId);
        res.sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());
        return callback(null, res);
      }

      // 2. SELECT * FROM vehicles WHERE user_id = ?
      if (cleanSql.includes('FROM vehicles WHERE user_id = ?')) {
        const [userId] = params;
        const res = data.vehicles.filter(v => v.user_id == userId);
        return callback(null, res);
      }

      // 3. SELECT * FROM claims WHERE user_id = ?
      if (cleanSql.includes('FROM claims WHERE user_id = ?')) {
        const [userId] = params;
        const res = data.claims.filter(c => c.user_id == userId);
        return callback(null, res);
      }

      // 4. SELECT * FROM fines WHERE plate = ?
      if (cleanSql.includes('FROM fines WHERE plate = ?')) {
        const [plate] = params;
        const res = data.fines.filter(f => (f.plate || '').toUpperCase() === (plate || '').toUpperCase());
        return callback(null, res);
      }

      // 5. SELECT * FROM notifications WHERE user_id = ?
      if (cleanSql.includes('FROM notifications WHERE user_id = ?')) {
        const [userId] = params;
        const res = data.notifications.filter(n => n.user_id == userId).slice(0, 20);
        return callback(null, res);
      }

      // 6. SELECT * FROM agent_sales WHERE agent_id = ?
      if (cleanSql.includes('FROM agent_sales WHERE agent_id = ?')) {
        const [agentId] = params;
        const res = data.agent_sales.filter(s => s.agent_id == agentId);
        return callback(null, res);
      }

      // 7. SELECT * FROM reviews
      if (cleanSql.includes('FROM reviews')) {
        const res = data.reviews.slice(0, 30);
        return callback(null, res);
      }

      // Fallback
      callback(null, []);
    } catch (err) {
      console.error('DB All error:', err);
      callback(err);
    }
  }
};

module.exports = db;
