import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest } from "../middleware/auth.middleware";

// POST /api/enrollments/:courseId

export const enrollStudent = async (req: AuthRequest, res: Response) => {
  const studentId = req.user!.userId;
  const { courseId } = req.params;

  if (!courseId) {
    return res.status(400).json({ message: "Course ID required" });
  }

  const { data, error } = await supabase
    .from("enrollments")
    .insert([{ student_id: studentId, course_id: courseId }])
    .select()
    .single();

  if (error) {
    return res.status(400).json({ message: "Enrollment failed" });
  }

  res.status(201).json(data);
};

// GET /api/enrollments/me
export const getMyEnrollments = async (req: AuthRequest, res: Response) => {
  const studentId = req.user!.userId;

  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      course:courses (
        id,
        title,
        description
      )
    `
    )
    .eq("student_id", studentId);

  if (error) {
    return res.status(500).json({ message: "Failed to fetch enrollments" });
  }

  // ✅ Return clean course array
  res.json(data.map((e: any) => e.course));
};

