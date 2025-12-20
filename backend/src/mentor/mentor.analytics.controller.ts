import { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest } from "../middleware/auth.middleware";

export async function getMentorAnalytics(
  req: AuthRequest,
  res: Response
) {
  const mentorId = req.user!.userId;

  const { data: courses, error: courseError } = await supabase
    .from("courses")
    .select("id, title")
    .eq("mentor_id", mentorId);

  if (courseError) {
    return res.status(500).json({ message: "Failed to load courses" });
  }

  const analytics: any[] = [];

  for (const course of courses || []) {
    const { count: totalChapters } = await supabase
      .from("chapters")
      .select("*", { count: "exact", head: true })
      .eq("course_id", course.id);

    const { data: students } = await supabase
      .from("course_students")
      .select("student_id, users(name)")
      .eq("course_id", course.id);

    for (const s of students || []) {
      const { count: completed } = await supabase
        .from("chapter_progress")
        .select("*", { count: "exact", head: true })
        .eq("student_id", s.student_id)
        .eq("completed", true);

      const progress =
        totalChapters && completed
          ? Math.round((completed / totalChapters) * 100)
          : 0;

      analytics.push({
        courseTitle: course.title,
        studentName: s.users?.[0]?.name ?? "Unknown",
        completedChapters: completed || 0,
        totalChapters: totalChapters || 0,
        progress,
        isCompleted: progress === 100,
      });
    }
  }

  return res.json(analytics);
}
