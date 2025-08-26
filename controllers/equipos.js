const { getTeams, addTeam } = require('../db/consultas')

const obtenerEquipos = async (req, res) => {
  try {
    const equipos = await getTeams()
    res.status(200).json(equipos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al obtener equipos" })
  }
}

const agregarEquipo = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: "El campo 'name' es requerido" })
    }

    const nuevo = await addTeam(name)
    res.status(201).json(nuevo)  
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al agregar equipo" })
  }
}

module.exports = { obtenerEquipos, agregarEquipo }