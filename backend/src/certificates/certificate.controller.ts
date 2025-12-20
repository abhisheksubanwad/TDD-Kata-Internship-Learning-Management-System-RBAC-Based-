import { Response } from "express";
import PDFDocument from "pdfkit";
import { supabase } from "../config/supabase";
import { AuthRequest } from "../middleware/auth.middleware";

export async function downloadCertificate(
  req: AuthRequest,
  res: Response
) {
  const studentId = req.user!.userId;
  const { courseId } = req.params;

  /* ---------------- STUDENT ---------------- */
  const { data: student, error: studentError } = await supabase
    .from("users")
    .select("name")
    .eq("id", studentId)
    .single();

  if (studentError || !student) {
    return res.status(404).json({ message: "Student not found" });
  }

  /* ---------------- COURSE ---------------- */
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("title")
    .eq("id", courseId)
    .single();

  if (courseError || !course) {
    return res.status(404).json({ message: "Course not found" });
  }

  /* ---------------- TOTAL CHAPTERS ---------------- */
  const { count: totalChapters, error: totalError } = await supabase
    .from("chapters")
    .select("*", { count: "exact", head: true })
    .eq("course_id", courseId);

  if (totalError || !totalChapters) {
    return res.status(400).json({ message: "No chapters found" });
  }

  /* ---------------- COMPLETED CHAPTERS ---------------- */
  const { count: completedChapters, error: completedError } = await supabase
    .from("chapter_progress")
    .select("*", { count: "exact", head: true })
    .eq("student_id", studentId)
    .eq("completed", true);

  if (completedError) {
    return res
      .status(500)
      .json({ message: "Failed to check progress" });
  }

  /* ---------------- VALIDATION ---------------- */
  if (completedChapters !== totalChapters) {
    return res
      .status(403)
      .json({ message: "Course not fully completed" });
  }

  /* ---------------- PDF GENERATION ---------------- */
  const doc = new PDFDocument();

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=certificate-${course.title}.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  doc.fontSize(24).text("🎓 Course Completion Certificate", {
    align: "center",
  });

  doc.moveDown(2);
  doc.fontSize(16).text("This certifies that", {
    align: "center",
  });

  doc.moveDown();
  doc.fontSize(20).text(student.name, { align: "center" });

  doc.moveDown();
  doc.fontSize(16).text("has successfully completed the course", {
    align: "center",
  });

  doc.moveDown();
  doc.fontSize(18).text(course.title, { align: "center" });

  doc.moveDown(2);
  doc
    .fontSize(12)
    .text(`Date: ${new Date().toDateString()}`, {
      align: "center",
    });

  doc.end();
}
