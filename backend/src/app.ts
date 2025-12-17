import express from "express";

const app = express();

// middleware
app.use(express.json());

// health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Internship LMS backend is running"
  });
});

export default app;
