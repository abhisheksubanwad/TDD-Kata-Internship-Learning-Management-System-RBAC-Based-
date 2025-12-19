import { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest } from "../middleware/auth.middleware";


export async function addChapter(req: AuthRequest, res: Response) {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;
    const mentorId = req.user!.userId;

    // Verify mentor owns the course
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id")
      .eq("id", courseId)
      .eq("mentor_id", mentorId)
      .single();

    if (courseError || !course) {
      return res.status(403).json({ message: "Not your course" });
    }

    // Get last chapter sequence
    const { data: lastChapter } = await supabase
      .from("chapters")
      .select("sequence_order")
      .eq("course_id", courseId)
      .order("sequence_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = lastChapter
      ? lastChapter.sequence_order + 1
      : 1;

    // Insert chapter
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
      console.error("Chapter insert error:", error);
      return res.status(400).json({
        message: "Chapter creation failed",
      });
    }

    // VERY IMPORTANT — send response
    return res.status(201).json(data);
  } catch (err) {
    console.error("Unexpected chapter error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function getChapters(req: AuthRequest, res: Response) {
  try {
    const { courseId } = req.params;

    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("course_id", courseId)
      .order("sequence_order", { ascending: true });

    if (error) {
      return res.status(500).json({ message: "Failed to fetch chapters" });
    }

    return res.json(data);
  } catch (err) {
    console.error("Get chapters error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
