jest.setTimeout(20000);

import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";

const JWT_SECRET = process.env.JWT_SECRET!;

describe("Chapter Management", () => {
  let mentorId: string;
  let mentorToken: string;
  let courseId: string;

  beforeAll(async () => {
    // Create mentor
    const { data: mentor } = await supabase
      .from("users")
      .insert({
        name: "Chapter Mentor",
        email: `chapter_${Date.now()}@test.com`,
        password_hash: "hashed",
        role: "mentor",
        is_approved: true,
      })
      .select()
      .single();

    mentorId = mentor!.id;

    mentorToken = jwt.sign(
      { userId: mentorId, role: "mentor" },
      JWT_SECRET
    );

    // Create course
    const { data: course } = await supabase
      .from("courses")
      .insert({
        title: "Sequential Course",
        description: "Test chapters",
        mentor_id: mentorId,
      })
      .select()
      .single();

    courseId = course!.id;
  });

  it("should add first chapter as sequence 1", async () => {
    const res = await request(app)
      .post(`/api/chapters/${courseId}`)
      .set("Authorization", `Bearer ${mentorToken}`)
      .send({
        title: "Introduction",
        content: "Welcome",
      });

    expect(res.status).toBe(201);
    expect(res.body.sequence_order).toBe(1);
  });

  it("should add second chapter as sequence 2", async () => {
    const res = await request(app)
      .post(`/api/chapters/${courseId}`)
      .set("Authorization", `Bearer ${mentorToken}`)
      .send({
        title: "Basics",
        content: "Learn basics",
      });

    expect(res.status).toBe(201);
    expect(res.body.sequence_order).toBe(2);
  });
});
