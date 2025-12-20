import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { downloadCertificate } from "./certificate.controller";

const router = Router();

router.get(
  "/:courseId",
  authenticate,
  authorize(["student"]),
  downloadCertificate
);

export default router;
