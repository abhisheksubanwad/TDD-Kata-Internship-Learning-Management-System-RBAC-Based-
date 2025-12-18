import request from "supertest";
import app from "../app";

describe("POST /api/auth/register", () => {
  it("should register a student successfully", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Student",
        email: "student@test.com",
        password: "password123"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });
});
