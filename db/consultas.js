const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'abc',   
    database: 'futscript',
    allowExitOnIdle: true
})
const getTeams = async () => {
    const { rows } = await pool.query("SELECT id, name FROM equipos")
    return rows
}

const getPlayers = async (teamID) => {
    const query = `
        SELECT j.name, p.name AS posicion
        FROM jugadores j
        INNER JOIN posiciones p ON j.position = p.id
        WHERE j.id_equipo = $1
    `
    const { rows } = await pool.query(query, [teamID])
    return rows
}

const addTeam = async (equipo) => {
    const query = "INSERT INTO equipos (name) VALUES ($1) RETURNING *"
    const values = [equipo]
    const { rows } = await pool.query(query, values)
    return rows[0]
}

const addPlayer = async ({ jugador, teamID, positionID }) => {
    const query = `
        INSERT INTO jugadores (name, id_equipo, position) 
        VALUES ($1, $2, $3) RETURNING *
    `
    const values = [jugador, teamID, positionID]
    const { rows } = await pool.query(query, values)
    return rows[0]
}

module.exports = { getTeams, addTeam, getPlayers, addPlayer }