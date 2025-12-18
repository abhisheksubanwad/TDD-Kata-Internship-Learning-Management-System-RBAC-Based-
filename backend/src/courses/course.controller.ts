import { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest } from "../middleware/auth.middleware";

// Create course
export async function createCourse(req: AuthRequest, res: Response) {
  const { title, description } = req.body;
  const mentorId = req.user!.userId;

  const { data, error } = await supabase.from("courses").insert([
    {
      title,
      description,
      mentor_id: mentorId,
    },
  ]).select().single();

  if (error) {
    return res.status(400).json({ message: "Course creation failed" });
  }

  res.status(201).json(data);
}

// Get mentor's courses
export async function getMyCourses(req: AuthRequest, res: Response) {
  const mentorId = req.user!.userId;

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("mentor_id", mentorId);

  if (error) {
    return res.status(500).json({ message: "Failed to fetch courses" });
  }

  res.json(data);
}
