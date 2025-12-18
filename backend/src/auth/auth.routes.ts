import { Router } from "express";
import { register, login } from "./auth.controller";

const router = Router();

router.post("/register", register); // student only
router.post("/login", login);       // all roles

export default router;
