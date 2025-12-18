import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

describe("RBAC Middleware", () => {
  const studentToken = jwt.sign(
    { userId: "1", role: "student" },
    JWT_SECRET
  );

  const adminToken = jwt.sign(
    { userId: "2", role: "admin" },
    JWT_SECRET
  );

  it("allows student access to student route", async () => {
    const res = await request(app)
      .get("/api/protected/student")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
  });

  it("blocks student from admin route", async () => {
    const res = await request(app)
      .get("/api/protected/admin")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
  });

  it("allows admin access to admin route", async () => {
    const res = await request(app)
      .get("/api/protected/admin")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });
});
