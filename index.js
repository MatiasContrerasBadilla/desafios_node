const express = require("express")
const jwt = require("jsonwebtoken")
const { secretKey } = require("./utils")
const { verificarToken } = require("./middlewares/auth")

const { obtenerJugadores, registrarJugador } = require("./controllers/jugadores")
const { obtenerEquipos, agregarEquipo } = require("./controllers/equipos")

const app = express()
app.use(express.json())

app.post("/login", (req, res) => {
  const { username, password } = req.body

  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" })
    return res.json({ token })
  }

  return res.status(400).json({ message: "Credenciales inválidas" })
})

app.get("/equipos", obtenerEquipos)
app.get("/equipos/:teamID/jugadores", obtenerJugadores)

app.post("/equipos", verificarToken, agregarEquipo)
app.post("/equipos/:teamID/jugadores", verificarToken, registrarJugador)

if (require.main === module) {
  app.listen(3000, () => console.log("SERVER ON"))
}

module.exports = app