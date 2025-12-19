import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { enrollStudent } from "./enrollment.controller";

const router = Router();

// Student enrollment
router.post(
  "/:courseId",           // ✅ MUST be courseId
  authenticate,
  authorize(["student"]),
  enrollStudent
);

export default router;
