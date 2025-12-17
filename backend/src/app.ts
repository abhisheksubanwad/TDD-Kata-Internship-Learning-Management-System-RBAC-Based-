import express, { Request, Response } from "express";
import { supabase } from "./config/supabase";

const app = express();

app.use(express.json());

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Internship LMS backend is running"
  });
});

// Database connection test
app.get("/db-test", async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .limit(1);

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  return res.status(200).json({
    message: "Database connected successfully",
    data
  });
});

export default app;
