import { z } from "zod";

export const ZodSignUpEmailSchema = z.object({
  email: z.string().email({ message: "Email must be valid" }),
});

export const ZodLoginSchema = z.object({
  email: z.string().email({ message: "Email must be valid" }),
  password: z
    .string()
    .min(8, { message: "Password must contain at least 8 character(s)" }),
});

export const ZodEditProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must contain at least 3 character(s)" })
    .max(15, { message: "Username must contain at most 15 character(s)" })
    .regex(/^[A-Za-z][A-Za-z0-9_]{3,15}$/, {
      message: "Example: Laasya_Setty (1Hashnode is invalid)",
    }),
  firstName: z
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .regex(/^[A-Za-z]+$/, { message: "Alphabetic characters only" }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "Last name is required" })
    .regex(/^[A-Za-z]+$/, { message: "Alphabetic characters only" }),
});

export const ZodEmailVerificationCodeSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, { message: "Username must contain at least 3 character(s)" })
      .max(15, { message: "Username must contain at most 15 character(s)" })
      .regex(/^[A-Za-z][A-Za-z0-9_]{3,15}$/, {
        message: "Example: Laasya_Setty (1Hashnode is invalid)",
      }),
    firstName: z
      .string()
      .trim()
      .min(1, { message: "First name is required" })
      .regex(/^[A-Za-z]+$/, { message: "Alphabetic characters only" }),
    lastName: z
      .string()
      .trim()
      .min(1, { message: "Last name is required" })
      .regex(/^[A-Za-z]+$/, { message: "Alphabetic characters only" }),
    verificationCode: z
      .string()
      .trim()
      .length(6, { message: "Code must contain exactly 6 character(s)" })
      .trim(),
    email: z.string().email({ message: "Email must be valid" }),
    password: z
      .string()
      .min(8, { message: "Password must contain at least 8 character(s)" })
      .max(20, { message: "Password must contain at most 20 character(s)" }),
    confirmPassword: z.string().min(1, { message: "Field required" }).trim(),
  })
  .refine((prop) => prop.password === prop.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type TSignUpEmail = z.infer<typeof ZodSignUpEmailSchema>;
export type TLogin = z.infer<typeof ZodLoginSchema>;
export type TEmailVerificationCode = z.infer<
  typeof ZodEmailVerificationCodeSchema
>;
export type TEditProfile = z.infer<typeof ZodEditProfileSchema>;
