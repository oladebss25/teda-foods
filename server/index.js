import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = new Database(path.join(__dirname, 'orders.db'));
db.exec(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  location TEXT,
  notes TEXT,
  order_lines TEXT,
  total INTEGER,
  payment_ref TEXT,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_live_xxxxxxxxxxxx';

app.post('/api/orders', (req, res) => {
  try {
    const { name, phone, email, location, notes, orderLines, total, paymentRef, paymentMethod } = req.body;
    const stmt = db.prepare(`INSERT INTO orders (name, phone, email, location, notes, order_lines, total, payment_ref, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const result = stmt.run(name, phone, email || null, location || null, notes || null, orderLines, total, paymentRef, paymentMethod);

    if (paymentMethod === 'whatsapp') {
      return res.json({ message: 'Your order has been received. We will contact you on WhatsApp shortly.', orderId: result.lastInsertRowid });
    }

    const paystackPublicKey = process.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_2ac524dfe7371a9ad3ea0c3befb355d7e464b3d1';
    res.json({
      orderId: result.lastInsertRowid,
      reference: paymentRef,
      paystackKey: paystackPublicKey,
      message: 'Order created. Proceed to payment.',
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/api/orders/confirm', (req, res) => {
  try {
    const { reference } = req.body;
    const stmt = db.prepare('UPDATE orders SET status = ? WHERE payment_ref = ?');
    stmt.run('paid', reference);
    res.json({ message: 'Payment confirmed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Teda Foods API server running on http://localhost:${PORT}`);
});
