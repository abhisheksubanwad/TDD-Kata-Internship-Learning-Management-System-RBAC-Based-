import { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * MARK CHAPTER AS COMPLETED
 * Enforces strict sequence
 * Student cannot skip chapters
 */
export async function markChapterCompleted(
  req: AuthRequest,
  res: Response
) {
  try {
    const studentId = req.user!.userId;
    const { chapterId } = req.params;

    // Get chapter info
    const { data: chapter, error: chapterError } = await supabase
      .from("chapters")
      .select("id, course_id, sequence_order")
      .eq("id", chapterId)
      .single();

    if (chapterError || !chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    // If not first chapter check previous chapter completion
    if (chapter.sequence_order > 1) {
      const { data: prevChapter } = await supabase
        .from("chapters")
        .select("id")
        .eq("course_id", chapter.course_id)
        .eq("sequence_order", chapter.sequence_order - 1)
        .single();

      if (!prevChapter) {
        return res.status(400).json({
          message: "Previous chapter missing",
        });
      }

      const { data: progress } = await supabase
        .from("chapter_progress")
        .select("*")
        .eq("student_id", studentId)
        .eq("chapter_id", prevChapter.id)
        .eq("completed", true)
        .maybeSingle();

      if (!progress) {
        return res.status(403).json({
          message: "Complete previous chapter first",
        });
      }
    }

    // Mark chapter completed
    const { error } = await supabase
      .from("chapter_progress")
      .upsert({
        student_id: studentId,
        chapter_id: chapterId,
        completed: true,
      });

    if (error) {
      return res.status(400).json({
        message: "Failed to update progress",
      });
    }

    return res.json({
      message: "Chapter marked as completed",
    });
  } catch (err) {
    console.error("Progress error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// GET STUDENT PROGRESS

export async function getMyProgress(
  req: AuthRequest,
  res: Response
) {
  try {
    const studentId = req.user!.userId;

    const { data, error } = await supabase
      .from("chapter_progress")
      .select("chapter_id")
      .eq("student_id", studentId)
      .eq("completed", true);

    if (error) {
      return res.status(500).json({
        message: "Failed to fetch progress",
      });
    }

    return res.json(data.map((p) => p.chapter_id));
  } catch (err) {
    console.error("Get progress error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
