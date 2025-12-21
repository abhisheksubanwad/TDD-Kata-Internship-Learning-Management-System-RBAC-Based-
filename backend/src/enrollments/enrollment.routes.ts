import { Router } from "express";
import {
  assignCourseToStudent,
  getMyEnrollments,
} from "./enrollment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();


// MENTOR → ASSIGN COURSE

router.post(
  "/assign",
  authenticate,
  authorize(["mentor"]),
  assignCourseToStudent
);


// STUDENT → VIEW ASSIGNED COURSES

router.get(
  "/me",
  authenticate,
  authorize(["student"]),
  getMyEnrollments
);

export default router;
