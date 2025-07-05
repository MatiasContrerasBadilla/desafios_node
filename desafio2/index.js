const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('.'));

const getCanciones = () => {
  try {
    const data = fs.readFileSync('canciones.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveCanciones = (canciones) => {
  fs.writeFileSync('canciones.json', JSON.stringify(canciones, null, 2));
};

app.get('/canciones', (req, res) => {
  try {
    const canciones = getCanciones();
    res.json(canciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las canciones' });
  }
});

app.post('/canciones', (req, res) => {
  try {
    const { id, titulo, artista, tono } = req.body;
    
    const nuevaCancion = {
      id: id || Date.now(),
      titulo,
      artista,
      tono
    };

    const canciones = getCanciones();
    canciones.push(nuevaCancion);
    saveCanciones(canciones);

    res.status(201).json(nuevaCancion);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar la canción' });
  }
});

app.put('/canciones/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { titulo, artista, tono } = req.body;

    const canciones = getCanciones();
    const index = canciones.findIndex(c => c.id == id);

    if (index === -1) {
      return res.status(404).json({ error: 'Canción no encontrada' });
    }

    canciones[index] = {
      id,
      titulo,
      artista,
      tono
    };

    saveCanciones(canciones);
    res.json(canciones[index]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la canción' });
  }
});

app.delete('/canciones/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    let canciones = getCanciones();
    canciones = canciones.filter(c => c.id != id);
    
    saveCanciones(canciones);
    res.json({ mensaje: 'Canción eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la canción' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});