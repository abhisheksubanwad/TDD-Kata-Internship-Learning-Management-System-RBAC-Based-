import { Request, Response } from "express";
import { registerStudent } from "./auth.service";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const token = await registerStudent({ name, email, password });

    return res.status(201).json({ token });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}
