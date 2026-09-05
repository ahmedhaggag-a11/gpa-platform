"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  passwordChangeSchema,
  type PasswordChangeFormData,
} from "@/validation/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import CustomPasswordInput from "@/components/ui/custom-password-input";
import { supabase } from "@/lib/supabaseClient";

interface PasswordChangeProps {
  email: string;
}

export default function PasswordChange({ email }: PasswordChangeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // React Hook Form setup for password change
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetPasswordForm,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (data: PasswordChangeFormData) => {
    setIsLoading(true);
    try {
      // 1. Re-authenticate user with current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: data.currentPassword,
      });
      if (signInError) {
        toast.error("كلمة المرور الحالية غير صحيحة");
        setIsLoading(false);
        return;
      }
      // 2. Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      if (updateError) {
        toast.error("فشل في تحديث كلمة المرور");
        setIsLoading(false);
        return;
      }
      toast.success("تم تغيير كلمة المرور بنجاح");
      resetPasswordForm();
    } catch (error) {
      toast.error("حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-red-50/30">
      <CardHeader className="flex-row-reverse">
        <CardTitle className="text-2xl flex items-center gap-3 flex-row-reverse">
          <Lock className="w-6 h-6 text-red-500" />
          تغيير كلمة المرور
        </CardTitle>
        <CardDescription className="text-lg">
          قم بتحديث كلمة المرور الخاصة بك
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          onSubmit={handleSubmit(onPasswordSubmit)}
          className="space-y-6"
        >
          <CustomPasswordInput
            label="كلمة المرور الحالية"
            placeholder="أدخل كلمة المرور الحالية"
            id="currentPassword"
            showPassword={showPassword.current}
            setShowPassword={(show) =>
              setShowPassword({ ...showPassword, current: show })
            }
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />

          <CustomPasswordInput
            label="كلمة المرور الجديدة"
            placeholder="أدخل كلمة المرور الجديدة"
            id="newPassword"
            showPassword={showPassword.new}
            setShowPassword={(show) =>
              setShowPassword({ ...showPassword, new: show })
            }
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />

          <CustomPasswordInput
            label="تأكيد كلمة المرور الجديدة"
            placeholder="أعد إدخال كلمة المرور الجديدة"
            id="confirmPassword"
            showPassword={showPassword.confirm}
            setShowPassword={(show) =>
              setShowPassword({ ...showPassword, confirm: show })
            }
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>ملاحظة:</strong> يجب أن تحتوي كلمة المرور
              الجديدة على 8 أحرف على الأقل وتحتوي على حرف كبير وحرف
              صغير ورقم.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-lg font-semibold bg-red-600 hover:bg-red-700"
          >
            <Lock className="w-5 h-5 ml-2" />
            {isLoading ? "جاري التحديث..." : "تغيير كلمة المرور"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}