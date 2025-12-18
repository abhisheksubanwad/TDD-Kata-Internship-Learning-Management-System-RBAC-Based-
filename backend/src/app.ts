import express, { Request, Response } from "express";
import authRoutes from "./auth/auth.routes";
import { supabase } from "./config/supabase";
import { authenticate } from "./middleware/auth.middleware";
import { authorize } from "./middleware/role.middleware";

const app = express(); // ✅ THIS WAS MISSING

app.use(express.json());

// 🔹 Health check
app.get("/health", async (_req: Request, res: Response) => {
  const { error } = await supabase.from("users").select("id").limit(1);

  if (error) {
    return res.status(500).json({
      status: "ERROR",
      db: "disconnected",
    });
  }

  return res.status(200).json({
    status: "OK",
    db: "connected",
  });
});

// 🔹 Auth routes
app.use("/api/auth", authRoutes);

// 🔹 RBAC test routes
app.get(
  "/api/protected/student",
  authenticate,
  authorize(["student"]),
  (_req: Request, res: Response) => {
    res.json({ message: "Student access granted" });
  }
);

app.get(
  "/api/protected/admin",
  authenticate,
  authorize(["admin"]),
  (_req: Request, res: Response) => {
    res.json({ message: "Admin access granted" });
  }
);

export default app;
