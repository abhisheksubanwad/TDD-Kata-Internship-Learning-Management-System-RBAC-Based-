import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  markChapterCompleted,
  getMyProgress,
} from "./progress.controller";

const router = Router();

router.use(authenticate, authorize(["student"]));

router.post("/:chapterId", markChapterCompleted);
router.get("/me", getMyProgress);

export default router;
