import { Request, Response } from "express";
import { supabase } from "../config/supabase";

// GET all users
export async function getAllUsers(_req: Request, res: Response) {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, is_approved, created_at");

  if (error) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }

  res.json(data);
}

// Approve mentor
export async function approveMentor(req: Request, res: Response) {
  const { id } = req.params;

  const { error } = await supabase
    .from("users")
    .update({ is_approved: true })
    .eq("id", id)
    .eq("role", "mentor");

  if (error) {
    return res.status(400).json({ message: "Approval failed" });
  }

  res.json({ message: "Mentor approved" });
}

// Delete user
export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    return res.status(400).json({ message: "Delete failed" });
  }

  res.json({ message: "User deleted" });
}
