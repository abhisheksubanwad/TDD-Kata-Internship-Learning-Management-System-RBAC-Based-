import express, { Request, Response } from "express";
import authRoutes from "./auth/auth.routes";
import { supabase } from "./config/supabase";
import { authenticate } from "./middleware/auth.middleware";
import { authorize } from "./middleware/role.middleware";
import adminRoutes from "./admin/admin.routes";
import courseRoutes from "./courses/course.routes";
import chapterRoutes from "./chapters/chapter.routes";
import enrollmentRoutes from "./enrollments/enrollment.routes";


const app = express(); 

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

// Enrollments routs
app.use("/api/enrollments", enrollmentRoutes);

// Chapters routs
app.use("/api/chapters", chapterRoutes);

// Admin routs
app.use("/api/admin", adminRoutes);

// Course routes
app.use("/api/courses", courseRoutes);

// Auth routes
app.use("/api/auth", authRoutes);

// RBAC test routes
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
