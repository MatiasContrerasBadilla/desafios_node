const jwt = require("jsonwebtoken")
const { secretKey } = require("../utils")

const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"]

  if (!token) {
    return res.status(401).json({ error: "Token requerido" })
  }

  try {
    const decoded = jwt.verify(token, secretKey)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ error: "Token inválido" })
  }
}

module.exports = { verificarToken }