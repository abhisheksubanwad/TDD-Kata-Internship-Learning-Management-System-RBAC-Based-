import { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest } from "../middleware/auth.middleware";

export async function enrollStudent(req: AuthRequest, res: Response) {
  const { courseId } = req.params;
  const studentId = req.user!.userId;

  console.log("🔥 enrollStudent controller HIT");
  console.log("PARAMS:", req.params);

  if (!courseId) {
    return res.status(400).json({ message: "Course ID missing" });
  }

  const { data, error } = await supabase
    .from("enrollments")
    .insert([
      {
        course_id: courseId,
        student_id: studentId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Enrollment insert error:", error);
    return res.status(400).json({ message: "Enrollment failed" });
  }

  return res.status(201).json(data);
}
