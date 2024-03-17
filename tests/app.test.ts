import request from "supertest"
import app from "../src/app"

describe("GET:", () => {
  it("should return 200 status code", async () => {
    const response = await request(app).get("/")
    expect(response.statusCode).toBe(200)
  })
})
