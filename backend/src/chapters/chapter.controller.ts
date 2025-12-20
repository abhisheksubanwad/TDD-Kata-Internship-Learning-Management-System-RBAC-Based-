import { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest } from "../middleware/auth.middleware";

// MENTOR: ADD CHAPTER

export async function addChapter(req: AuthRequest, res: Response) {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;
    const mentorId = req.user!.userId;

    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("id", courseId)
      .eq("mentor_id", mentorId)
      .single();

    if (!course) {
      return res.status(403).json({ message: "Not your course" });
    }

    const { data: lastChapter } = await supabase
      .from("chapters")
      .select("sequence_order")
      .eq("course_id", courseId)
      .order("sequence_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = lastChapter ? lastChapter.sequence_order + 1 : 1;

    const { data, error } = await supabase
      .from("chapters")
      .insert({
        course_id: courseId,
        title,
        content,
        sequence_order: nextOrder,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: "Chapter creation failed" });
    }

    return res.status(201).json(data);
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}


// STUDENT: GET CHAPTERS (LOCKED)

export async function getChapters(req: AuthRequest, res: Response) {
  try {
    const { courseId } = req.params;
    const studentId = req.user!.userId;

    // Fetch chapters
    const { data: chapters } = await supabase
      .from("chapters")
      .select("*")
      .eq("course_id", courseId)
      .order("sequence_order", { ascending: true });

    if (!chapters) {
      return res.json([]);
    }

    // Fetch completed chapters
    const { data: progress } = await supabase
      .from("chapter_progress")
      .select("chapter_id")
      .eq("student_id", studentId);

    const completedSet = new Set(
      progress?.map((p) => p.chapter_id) || []
    );

    // Build strict sequence response
    const response = chapters.map((chapter, index) => {
      const isCompleted = completedSet.has(chapter.id);

      const isUnlocked =
        index === 0 ||
        completedSet.has(chapters[index - 1].id);

      return {
        ...chapter,
        isCompleted,
        isUnlocked,
      };
    });

    return res.json(response);
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// STUDENT: COMPLETE CHAPTER

export async function completeChapter(
  req: AuthRequest,
  res: Response
) {
  const studentId = req.user!.userId;
  const { chapterId } = req.params;

  const { error } = await supabase
    .from("chapter_progress")
    .insert({
      student_id: studentId,
      chapter_id: chapterId,
    });

  if (error) {
    return res.status(400).json({ message: "Already completed" });
  }

  return res.status(201).json({ message: "Chapter completed" });
}
