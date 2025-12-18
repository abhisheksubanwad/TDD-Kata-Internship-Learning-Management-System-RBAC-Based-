import bcrypt from "bcrypt";
import { supabase } from "../config/supabase";
import { generateToken } from "./jwt";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export async function registerStudent(input: RegisterInput) {
  const { name, email, password } = input;

  // check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    throw new Error("User already exists");
  }

  // hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // insert user
  const { data, error } = await supabase
    .from("users")
    .insert({
      name,
      email,
      password_hash: passwordHash,
      role: "student",
      is_approved: true
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error("Failed to create user");
  }

  // generate token
  const token = generateToken({
    userId: data.id,
    role: data.role
  });

  return token;
}
