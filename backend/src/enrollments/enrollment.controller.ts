import { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest } from "../middleware/auth.middleware";


// MENTOR → ASSIGN COURSE TO STUDENT

export const assignCourseToStudent = async (
  req: AuthRequest,
  res: Response
) => {
  const mentorId = req.user!.userId;
  const { courseId, studentId } = req.body;

  if (!courseId || !studentId) {
    return res
      .status(400)
      .json({ message: "courseId and studentId are required" });
  }

//   Check mentor owns this course
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .eq("mentor_id", mentorId)
    .single();

  if (courseError || !course) {
    return res.status(403).json({ message: "Not your course" });
  }

// Assign course 
  const { error } = await supabase.from("enrollments").insert({
    student_id: studentId,
    course_id: courseId,
  });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  return res.status(201).json({
    message: "Course assigned successfully",
  });
};


// STUDENT → VIEW MY ASSIGNED COURSES

export const getMyEnrollments = async (
  req: AuthRequest,
  res: Response
) => {
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
    return res
      .status(500)
      .json({ message: "Failed to fetch enrollments" });
  }

  // Return clean array of courses
  return res.json(data.map((e: any) => e.course));
};
