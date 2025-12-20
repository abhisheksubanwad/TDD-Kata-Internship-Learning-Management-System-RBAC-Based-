import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: "student" | "mentor" | "admin"
) {
  // Check if user exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ FIX: use password_hash, not password
  const { data, error } = await supabase
    .from("users")
    .insert({
      name,
      email,
      password_hash: hashedPassword, // ✅ FIXED
      role,
      is_approved: role === "student", // students auto-approved
    })
    .select()
    .single();

  if (error) {
    console.error("Register error:", error);
    throw new Error(error.message);
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
  };
}

export async function loginUser(email: string, password: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    throw new Error("Invalid credentials");
  }

  
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return {
    token,
    role: user.role,
  };
}
