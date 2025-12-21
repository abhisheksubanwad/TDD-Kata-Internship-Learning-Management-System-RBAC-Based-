import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  markChapterCompleted,
  getCourseProgress,
} from "./progress.controller";

const router = Router();

router.use(authenticate, authorize(["student"]));

router.post("/:chapterId", markChapterCompleted);
router.get("/course/:courseId", getCourseProgress);

export default router;
