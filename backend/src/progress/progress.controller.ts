import { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest } from "../middleware/auth.middleware";

// MARK CHAPTER COMPLETED
export async function markChapterCompleted(
  req: AuthRequest,
  res: Response
) {
  const studentId = req.user!.userId;
  const { chapterId } = req.params;

  // Get chapter info
  const { data: chapter } = await supabase
    .from("chapters")
    .select("id, sequence_order, course_id")
    .eq("id", chapterId)
    .single();

  if (!chapter) {
    return res.status(404).json({ message: "Chapter not found" });
  }

  // Check previous chapter completion
  if (chapter.sequence_order > 1) {
    const { data: prevChapter } = await supabase
      .from("chapters")
      .select("id")
      .eq("course_id", chapter.course_id)
      .eq("sequence_order", chapter.sequence_order - 1)
      .single();

    const { data: prevProgress } = await supabase
      .from("chapter_progress")
      .select("id")
      .eq("student_id", studentId)
      .eq("chapter_id", prevChapter!.id)
      .eq("completed", true)
      .single();

    if (!prevProgress) {
      return res
        .status(403)
        .json({ message: "Complete previous chapter first" });
    }
  }

  // Mark completed
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

// COURSE PROGRESS
export async function getCourseProgress(
  req: AuthRequest,
  res: Response
) {
  const studentId = req.user!.userId;
  const { courseId } = req.params;

  // Total chapters
  const { count: totalChapters } = await supabase
    .from("chapters")
    .select("*", { count: "exact", head: true })
    .eq("course_id", courseId);

  // Completed chapters
  const { count: completedChapters } = await supabase
    .from("chapter_progress")
    .select("*", { count: "exact", head: true })
    .eq("student_id", studentId)
    .eq("completed", true);

  const progress =
    totalChapters && totalChapters > 0
      ? Math.round((completedChapters! / totalChapters) * 100)
      : 0;

  res.json({
    progress,
    isCompleted: progress === 100,
  });
}
