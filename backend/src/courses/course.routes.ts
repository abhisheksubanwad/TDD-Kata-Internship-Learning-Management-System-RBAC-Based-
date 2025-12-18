import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  createCourse,
  getMyCourses,
} from "./course.controller";

const router = Router();

router.use(authenticate, authorize(["mentor"]));

router.post("/", createCourse);
router.get("/my", getMyCourses);

export default router;
