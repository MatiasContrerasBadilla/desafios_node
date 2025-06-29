const { registrar, leer } = require("./operaciones")

const [operacion, nombre, edad, tipo, color, enfermedad] = process.argv.slice(2)

if (operacion === "registrar") {
  registrar(nombre, edad, tipo, color, enfermedad)
} else if (operacion === "leer") {
  leer()
} else {
  console.log("No se reconoce tu operación. Intenta otra vez: ")
}
