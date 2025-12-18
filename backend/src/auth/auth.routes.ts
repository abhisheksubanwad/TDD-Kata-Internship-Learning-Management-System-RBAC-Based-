import { Router } from "express";
import { register } from "./auth.controller";

const router = Router();

router.post("/register", register);

router.post("/login", (_req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

export default router;
