const { getPlayers, addPlayer } = require('../db/consultas')

const obtenerJugadores = async (req, res) => {
  try {
    const { teamID } = req.params
    const jugadores = await getPlayers(parseInt(teamID))  
    res.status(200).json(jugadores)
  } catch (error) {
    console.error("Error en obtenerJugadores:", error.message)  
    res.status(500).json({ error: "Error al obtener jugadores" })
  }
}

const registrarJugador = async (req, res) => {
  try {
    const { teamID } = req.params
    const { name, positionID } = req.body

    if (!name || !positionID) {
      return res.status(400).json({ error: "Se requieren 'name' y 'positionID'" })
    }

    const nuevo = await addPlayer({ 
      jugador: name, 
      teamID: parseInt(teamID), 
      positionID: parseInt(positionID) 
    })
    res.status(201).json(nuevo)  
  } catch (error) {
    console.error("Error en registrarJugador:", error.message)  
    res.status(500).json({ error: "Error al registrar jugador" })
  }
}

module.exports = { obtenerJugadores, registrarJugador }