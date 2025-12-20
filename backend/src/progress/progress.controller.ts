import { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest } from "../middleware/auth.middleware";

export async function markChapterCompleted(
  req: AuthRequest,
  res: Response
) {
  const studentId = req.user!.userId;
  const { chapterId } = req.params;

  const { error } = await supabase
    .from("chapter_progress")
    .upsert({
      student_id: studentId,
      chapter_id: chapterId,
      completed: true,
    });

  if (error) {
    return res.status(400).json({ message: "Failed to update progress" });
  }

  res.json({ message: "Chapter marked as completed" });
}

export async function getMyProgress(
  req: AuthRequest,
  res: Response
) {
  const studentId = req.user!.userId;

  const { data, error } = await supabase
    .from("chapter_progress")
    .select("chapter_id")
    .eq("student_id", studentId);

  if (error) {
    return res.status(500).json({ message: "Failed to fetch progress" });
  }

  res.json(data.map(p => p.chapter_id));
}
