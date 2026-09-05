import { z } from "zod";

// Profile Update Schema
export const profileUpdateSchema = z.object({
  fullName: z 
    .string()
    .trim()
    .min(1, "الاسم الكامل مطلوب")
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم لا يجب أن يتجاوز 50 حرف"),
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("يرجى إدخال بريد إلكتروني صحيح"),
  phoneNumber: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^[+]?[0-9]{10,15}$/, "يرجى إدخال رقم هاتف صحيح"),
  parentPhoneNumber: z
    .string()
    .min(1, "رقم هاتف الأب مطلوب")
    .regex(/^[+]?[0-9]{10,15}$/, "يرجى إدخال رقم هاتف صحيح"),
  about: z
    .string()
    .max(500, "النبذة الشخصية لا يجب أن تتجاوز 500 حرف")
    .optional(),
})
// Phone numbers must be different
.refine((data) => data.phoneNumber !== data.parentPhoneNumber, {
  message: "رقم هاتف الأب يجب أن يكون مختلفًا عن رقم هاتف الطالب",
  path: ["parentPhoneNumber"],
});

// Password Change Schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6, "كلمة المرور الحالية مطلوبة"),
  newPassword: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .max(50, "كلمة المرور لا يجب أن تتجاوز 50 حرف"),
  confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقتين",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية",
  path: ["newPassword"],
});

// Type exports
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;