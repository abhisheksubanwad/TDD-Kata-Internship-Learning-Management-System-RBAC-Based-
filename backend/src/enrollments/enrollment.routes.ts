import { Router } from "express";
import { enrollStudent, getMyEnrollments } from "./enrollment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.post(
  "/:courseId",
  authenticate,
  authorize(["student"]),
  enrollStudent
);

router.get(
  "/me",
  authenticate,
  authorize(["student"]),
  getMyEnrollments
);

export default router;
