import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

describe("Admin User Management", () => {
  const adminToken = jwt.sign(
    { userId: "admin-id", role: "admin" },
    JWT_SECRET
  );

  it("should fetch all users", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
