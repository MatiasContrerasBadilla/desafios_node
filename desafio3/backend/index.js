const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',        
  host: 'localhost',
  database: 'likeme',
  password: 'abc',            
  port: 5432,
});

app.get('/posts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/posts', async (req, res) => {
  try {
    const { titulo, img, descripcion } = req.body;
    const result = await pool.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *',
      [titulo, img, descripcion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));