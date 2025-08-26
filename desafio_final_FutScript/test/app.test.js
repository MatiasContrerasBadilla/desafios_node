const request = require("supertest")
const app = require("../index")

test("GET /equipos → debe devolver array y status 200", async () => {
  const res = await request(app).get("/equipos")
  expect(res.statusCode).toBe(200)
  expect(Array.isArray(res.body)).toBe(true)
})

test("POST /login correcto → debe devolver objeto con token", async () => {
  const res = await request(app)
    .post("/login")
    .send({ username: "admin", password: "1234" })
  expect(res.statusCode).toBe(200)
  expect(res.body).toHaveProperty("token")
})

test("POST /login incorrecto → debe devolver código 400", async () => {
  const res = await request(app)
    .post("/login")
    .send({ username: "fake", password: "bad" })
  expect(res.statusCode).toBe(400)
})