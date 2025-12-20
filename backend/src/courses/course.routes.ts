import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  createCourse,
  getAllCourses,
  getMentorCourses,
} from "./course.controller";

const router = Router();

// STUDENT + MENTOR + ADMIN 
router.get("/", authenticate, getAllCourses);

// MENTOR ONLY 
router.post("/", authenticate, authorize(["mentor"]), createCourse);

// MENTOR ONLY 
router.get(
  "/mentor",
  authenticate,
  authorize(["mentor"]),
  getMentorCourses
);

export default router;
