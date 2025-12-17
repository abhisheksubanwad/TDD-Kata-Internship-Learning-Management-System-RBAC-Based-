import request from "supertest";
import app from "../app";

describe("GET /health", () => {
  it("should return 200 and health status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      message: "Internship LMS backend is running"
    });
  });
});
