import express, { Request, Response } from "express";
import authRoutes from "./auth/auth.routes";

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Internship LMS backend is running"
  });
});

export default app;
