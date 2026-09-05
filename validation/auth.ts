import { z } from "zod";

// Sign In Schema
export const signinSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("يرجى إدخال بريد إلكتروني صحيح"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  remember: z.boolean().optional(),
});

// Sign Up Schema
export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "الاسم الكامل مطلوب")
      .min(2, "الاسم يجب أن يكون حرفين على الأقل")
      .max(50, "الاسم لا يجب أن يتجاوز 50 حرف"),
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("يرجى إدخال بريد إلكتروني صحيح"),
    classId: z.string().min(1, "الصف مطلوب"),
    country: z.string().min(1, "الدولة مطلوبة"),
    phoneNumber: z
      .string()
      .min(1, "رقم الهاتف مطلوب")
      .regex(/^[+]?[0-9]{10,15}$/, "يرجى إدخال رقم هاتف صحيح"),
    parentPhoneNumber: z
      .string()
      .min(1, "رقم هاتف الأب مطلوب")
      .regex(/^[+]?[0-9]{10,15}$/, "يرجى إدخال رقم هاتف صحيح"),
    password: z
      .string()
      .min(1, "كلمة المرور مطلوبة")
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    terms: z.boolean().refine((val) => val === true, {
      message: "يجب الموافقة على شروط الخدمة",
    }),
  })
  // Password confirmation validation
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  })
  // Phone numbers must be different
  .refine((data) => data.phoneNumber !== data.parentPhoneNumber, {
    message: "رقم هاتف الأب يجب أن يكون مختلفًا عن رقم هاتف الطالب",
    path: ["parentPhoneNumber"],
  });

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("يرجى إدخال بريد إلكتروني صحيح"),
});

// Password Change Schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6, "كلمة المرور الحالية مطلوبة"),
  newPassword: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقتين",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية",
  path: ["newPassword"],
});

// Type exports
export type SigninFormData = z.infer<typeof signinSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
