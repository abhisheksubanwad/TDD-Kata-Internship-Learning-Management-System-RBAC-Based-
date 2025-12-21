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

  for (const course of courses ?? []) {
    /* total chapters */
    const { count: totalChapters } = await supabase
      .from("chapters")
      .select("*", { count: "exact", head: true })
      .eq("course_id", course.id);

    /* enrolled students */
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select(
        `
        student:users (
          id,
          name,
          email
        )
      `
      )
      .eq("course_id", course.id);

    for (const e of enrollments ?? []) {
      // ✅ FIX HERE
      const student = e.student?.[0];
      if (!student) continue;

      /* completed chapters (for this course only) */
      const { data: chapterIds } = await supabase
        .from("chapters")
        .select("id")
        .eq("course_id", course.id);

      const { count: completed } = await supabase
        .from("chapter_progress")
        .select("*", { count: "exact", head: true })
        .eq("student_id", student.id)
        .in(
          "chapter_id",
          chapterIds?.map(c => c.id) ?? []
        );

      const progress =
        totalChapters && totalChapters > 0
          ? Math.round(((completed || 0) / totalChapters) * 100)
          : 0;

      analytics.push({
        courseId: course.id,
        courseTitle: course.title,
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        completedChapters: completed || 0,
        totalChapters: totalChapters || 0,
        progress,
        isCompleted: progress === 100,
      });
    }
  }

  return res.json(analytics);
}
