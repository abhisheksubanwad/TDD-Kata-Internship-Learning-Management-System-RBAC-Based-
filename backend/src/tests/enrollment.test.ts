import request from "supertest";
import app from "../app";

let studentToken: string;
const courseId = "04c8affe-b720-41ad-a2f2-405f9c755a17"; // Use existing course

beforeAll(async () => {

  // Register and login student
  await request(app).post("/api/auth/register").send({
    name: "Student One",
    email: "student1@test.com",
    password: "password",
    role: "student",
  });

  const studentLogin = await request(app).post("/api/auth/login").send({
    email: "student1@test.com",
    password: "password",
  });

  studentToken = studentLogin.body.token;
  if (!studentToken) throw new Error("Student login failed");
});

describe("Student Enrollment", () => {
  it("should enroll student in a course", async () => {
    const res = await request(app)
      .post(`/api/enrollments/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(201);
    expect(res.body.course_id).toBe(courseId);
    expect(res.body.student_id).toBeDefined();
  });
});
