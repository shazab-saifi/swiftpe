import z from "zod";

export const signupSchema = z.object({
  username: z.email(),
  password: z.string().min(6).max(50),
  firstName: z.string().max(50),
  lastName: z.string().max(50),
});

export const signinSchema = signupSchema.pick({
  username: true,
  password: true,
});

export type SignupInput = z.infer<typeof signupSchema>;
