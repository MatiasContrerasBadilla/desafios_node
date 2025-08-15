require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.originalUrl}`);
  next();
});

const requireCreds = (req, res, next) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan credenciales: email y password son obligatorios' });
  }
  next();
};

const validateToken = (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const [, token] = auth.split(' '); // "Bearer token"
    if (!token) return res.status(401).json({ error: 'Token no provisto' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { email, iat, exp }
    next();
  } catch (err) {
    console.error('validateToken error:', err.message);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

console.log('ENV CHECK:', {
  PGUSER: process.env.PGUSER,
  PGHOST: process.env.PGHOST,
  PGDATABASE: process.env.PGDATABASE,
  PGPORT: process.env.PGPORT,
  PGPASSWORD: process.env.PGPASSWORD ? '(set)' : '(MISSING)',
});

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
});

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.get('/db-check', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW() as now');
    res.json({ ok: true, now: rows[0].now });
  } catch (e) {
    console.error('DB check error:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/usuarios', requireCreds, async (req, res) => {
  console.log('POST /usuarios body:', req.body);
  try {
    const { email, password, rol = 'user', lenguage = 'es' } = req.body;

    console.log('Check existe email');
    const exists = await pool.query('SELECT 1 FROM usuarios WHERE email = $1', [email]);
    console.log('Existe listo, rowCount:', exists.rowCount);
    if (exists.rowCount > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    console.log('Hashing password');
    const hashed = await bcrypt.hash(password, 10);
    console.log('Hash listo');

    console.log('Insertando usuario');
    const insert = `
      INSERT INTO usuarios (email, password, rol, lenguage)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, rol, lenguage
    `;
    const { rows } = await pool.query(insert, [email, hashed, rol, lenguage]);
    console.log('Insert listo');

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error en POST /usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/login', requireCreds, async (req, res) => {
  console.log('POST /login body:', req.body);
  try {
    const { email, password } = req.body;

    console.log('Buscando usuario por email');
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    console.log('Búsqueda lista, encontrados:', rows.length);
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    console.log('Comparando password');
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    console.log('Firmando token');
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '1d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error en POST /login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/usuarios', validateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const { rows } = await pool.query(
      'SELECT id, email, rol, lenguage FROM usuarios WHERE email = $1',
      [email]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en GET /usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});