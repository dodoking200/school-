import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const classSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Class name is required"),
  floor: z.number().min(0, "Floor number must be a positive number"),
  grade: z.number().min(1, "Grade must be a positive number"),
});
