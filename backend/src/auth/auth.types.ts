export type UserRole = "student" | "mentor" | "admin";

export interface JwtPayload {
  userId: string;
  role: UserRole;
}
