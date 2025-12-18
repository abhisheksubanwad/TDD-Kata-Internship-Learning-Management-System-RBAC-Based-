import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  addChapter,
  getChapters,
} from "./chapter.controller";

const router = Router();

// Mentor-only chapter routes
router.use(authenticate, authorize(["mentor"]));

router.post("/:courseId", addChapter);
router.get("/:courseId", getChapters);

export default router;
