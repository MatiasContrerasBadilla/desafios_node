const fs = require ("fs")

const registrar = (nombre, edad, tipo, color, enfermedad) => {
    const citas = JSON.parse(fs.readFileSync("citas.json", "utf-8"))
    const nuevaCita = {nombre,edad,tipo,color,enfermedad}
    citas.push(nuevaCita)
    fs.writeFileSync("citas.json", JSON.stringify(citas))
    console.log("Cita registrada")
}

const leer = () => {
    const citas = JSON.parse(fs.readFileSync("citas.json", "utf-8"))
    citas.forEach((cita, i) => {
        console.log(`Cita ${i + 1}:`, cita);
    })
}
module.exports = {registrar, leer}
