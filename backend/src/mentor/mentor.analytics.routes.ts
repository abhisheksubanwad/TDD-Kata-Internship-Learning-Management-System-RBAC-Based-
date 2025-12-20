import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { getMentorAnalytics } from "./mentor.analytics.controller";

const router = Router();

router.get(
  "/analytics",
  authenticate,
  authorize(["mentor"]),
  getMentorAnalytics
);

export default router;
