import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  addChapter,
  getChapters,
  completeChapter,
} from "./chapter.controller";

const router = Router();

// Student + Mentor can read
router.get(
  "/:courseId",
  authenticate,
  authorize(["student", "mentor"]),
  getChapters
);

// Student marks chapter complete
router.post(
  "/complete/:chapterId",
  authenticate,
  authorize(["student"]),
  completeChapter
);

// Mentor adds chapter
router.post(
  "/:courseId",
  authenticate,
  authorize(["mentor"]),
  addChapter
);

export default router;
