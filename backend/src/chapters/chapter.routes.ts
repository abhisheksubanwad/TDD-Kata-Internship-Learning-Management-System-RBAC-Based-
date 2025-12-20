import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { addChapter, getChapters } from "./chapter.controller";

const router = Router();


// READ chapters Student + Mentor
router.get(
  "/:courseId",
  authenticate,
  authorize(["student", "mentor"]),
  getChapters
);


// CREATE chapters Mentor only

router.post(
  "/:courseId",
  authenticate,
  authorize(["mentor"]),
  addChapter
);

export default router;
