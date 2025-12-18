import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  getAllUsers,
  approveMentor,
  deleteUser,
} from "./admin.controller";

const router = Router();

router.use(authenticate, authorize(["admin"]));

router.get("/users", getAllUsers);
router.put("/users/:id/approve-mentor", approveMentor);
router.delete("/users/:id", deleteUser);

export default router;
