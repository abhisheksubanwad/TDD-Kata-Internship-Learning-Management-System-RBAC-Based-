import request from "supertest";
import app from "../app";

describe("Auth API", () => {
  const randomEmail = `auth_${Date.now()}@student.com`;

  const testUser = {
    name: "Auth Student",
    email: randomEmail,
    password: "password123"
  };

  it("should register a student", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(testUser.email);
  });

  it("should login a user and return JWT", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
