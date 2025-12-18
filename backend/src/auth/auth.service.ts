import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";
import { JwtPayload } from "./auth.types";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function registerStudent(
  name: string,
  email: string,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert({
      name,
      email,
      password_hash: hashedPassword,
      role: "student",
      is_approved: true
    })
    .select()
    .single();

  if (error) throw error;
  return data;
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

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const payload: JwtPayload = {
    userId: user.id,
    role: user.role
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d"
  });

  return { token, role: user.role };
}
