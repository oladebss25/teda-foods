import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { validateOrderInput } from './validation.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logger = {
  info: (msg, data) => console.log(JSON.stringify({ level: 'info', msg, data, time: new Date().toISOString() })),
  error: (msg, data) => console.error(JSON.stringify({ level: 'error', msg, data, time: new Date().toISOString() })),
};

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
if (!PAYSTACK_SECRET_KEY) {
  logger.error('FATAL: PAYSTACK_SECRET_KEY is not set');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://tedafoods.com.ng']
  : ['http://localhost:5173', 'http://localhost:3001'];

app.use(cors({ origin: allowedOrigins, methods: ['GET', 'POST'] }));
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'orders.db');
const db = new Database(DB_PATH);
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

app.post('/api/paystack-webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(req.body).digest('hex');
  if (hash !== req.headers['x-paystack-signature']) {
    logger.error('Invalid Paystack webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(req.body.toString());
  if (event.event === 'charge.success') {
    const reference = event.data.reference;
    const stmt = db.prepare('UPDATE orders SET status = ? WHERE payment_ref = ?');
    stmt.run('paid', reference);
    logger.info('Payment confirmed via webhook', { reference });
  }

  res.sendStatus(200);
});

app.use(express.json());

app.post('/api/orders', (req, res) => {
  try {
    const errors = validateOrderInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { name, phone, email, location, notes, orderLines, total, paymentRef, paymentMethod } = req.body;
    const stmt = db.prepare('INSERT INTO orders (name, phone, email, location, notes, order_lines, total, payment_ref, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const result = stmt.run(name, phone, email || null, location || null, notes || null, orderLines, total, paymentRef, paymentMethod);

    if (paymentMethod === 'whatsapp') {
      return res.json({ message: 'Your order has been received. We will contact you on WhatsApp shortly.', orderId: result.lastInsertRowid });
    }

    res.json({
      orderId: result.lastInsertRowid,
      reference: paymentRef,
      paystackKey: process.env.PAYSTACK_PUBLIC_KEY,
      message: 'Order created. Proceed to payment.',
    });
  } catch (err) {
    logger.error('Order creation error', { error: err.message, body: req.body });
    res.status(500).json({ error: 'Failed to create order' });
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
    logger.info('Server started', { port: PORT });
});
