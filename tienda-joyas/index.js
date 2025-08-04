const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  const fecha = new Date().toISOString();
  console.log(`[${fecha}] Consulta a la ruta: ${req.originalUrl}`);
  next();
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'joyas',
  password: 'abc', 
  port: 5432,
});


app.get('/', (req, res) => {
  res.send('API Tienda de Joyas funcionando');
});

app.get('/joyas', async (req, res) => {
  try {
    const { limits = 10, page = 1, order_by = "id_ASC" } = req.query;
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits;
    const query = `
      SELECT * FROM inventario
      ORDER BY ${campo} ${direccion === "DESC" ? "DESC" : "ASC"}
      LIMIT $1 OFFSET $2
    `;
    const values = [parseInt(limits), parseInt(offset)];
    const { rows } = await pool.query(query, values);
    const results = rows.map((joya) => ({
      ...joya,
      href: `/joyas/${joya.id}`,
    }));
    res.json({
      total: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/joyas/filtros', async (req, res) => {
  try {
    const { precio_max, precio_min, categoria, metal } = req.query;
    let filtros = [];
    let values = [];
    let idx = 1;
    if (precio_min) {
      filtros.push(`precio >= $${idx++}`);
      values.push(precio_min);
    }
    if (precio_max) {
      filtros.push(`precio <= $${idx++}`);
      values.push(precio_max);
    }
    if (categoria) {
      filtros.push(`categoria = $${idx++}`);
      values.push(categoria);
    }
    if (metal) {
      filtros.push(`metal = $${idx++}`);
      values.push(metal);
    }
    let where = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";
    const query = `SELECT * FROM inventario ${where}`;
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});