import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";

const JWT_SECRET = process.env.JWT_SECRET!;

describe("Mentor Course Management", () => {
  let mentorId: string;
  let mentorToken: string;

  beforeAll(async () => {
    const email = `mentor_${Date.now()}@test.com`;

    const { data, error } = await supabase
      .from("users")
      .insert({
        name: "Test Mentor",
        email,
        password_hash: "hashed",
        role: "mentor",
        is_approved: true,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    mentorId = data.id;

    mentorToken = jwt.sign(
      { userId: mentorId, role: "mentor" },
      JWT_SECRET
    );
  });

  it("should create a course", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${mentorToken}`)
      .send({
        title: "Node.js Basics",
        description: "Learn backend fundamentals",
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Node.js Basics");
  });

  it("should fetch mentor courses", async () => {
    const res = await request(app)
      .get("/api/courses/my")
      .set("Authorization", `Bearer ${mentorToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
