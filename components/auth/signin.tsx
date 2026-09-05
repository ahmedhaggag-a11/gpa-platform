import React, { useState } from "react";
import { Label } from "../ui/label";
import { Mail, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import CustomInput from "../ui/custom-input";
import CustomPasswordInput from "../ui/custom-password-input";
import { useForm } from "react-hook-form";
import { SigninFormData, signinSchema } from "@/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions, useGuestOnly } from "@/hooks/use-auth";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isLoading } = useAuthActions();
  
  // Redirect if already authenticated
  useGuestOnly();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const isPending = isSubmitting || isLoading;

  const onSubmit = async (data: SigninFormData) => {
    const result = await signIn(data.email, data.password, data.remember);
    if (result.success) {
      reset();
    }
  };
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Email Input */}
        <div className="space-y-2">
          <CustomInput
            Icon={Mail}
            id="email"
            label="البريد الإلكتروني"
            placeholder="أدخل بريدك الإلكتروني"
            type="email"
            autoComplete="email"
            disabled={isSubmitting}
            {...register("email")}
            error={errors.email?.message}
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <CustomPasswordInput
            label="كلمة المرور"
            placeholder="أدخل كلمة المرور"
            id="password"
            autoComplete="current-password"
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            disabled={isSubmitting}
            {...register("password")}
            error={errors.password?.message}
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex flex-row-reverse items-center justify-between">
          <div className="flex items-center gap-3 flex-row-reverse">
            <input
              type="checkbox"
              id="remember"
              className="rounded border-border w-4 h-4 text-primary focus:ring-primary focus:ring-2 disabled:opacity-50"
              disabled={isSubmitting}
              {...register("remember")}
            />
            <Label
              htmlFor="remember"
              className={`md:text-base text-sm cursor-pointer select-none ${
                isSubmitting ? "opacity-50" : "hover:text-primary"
              }`}
            >
              تذكرني
            </Label>
          </div>
          <Link
            href="/auth/forgot-password"
            className={`md:text-base text-sm text-primary hover:underline transition-colors ${
              isSubmitting ? "pointer-events-none opacity-50" : ""
            }`}
            tabIndex={isSubmitting ? -1 : 0}
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full hover-lift h-12 md:text-lg bg-primary shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none transition-all duration-200"
          size="lg"
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>جاري تسجيل الدخول...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>تسجيل الدخول</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default Signin;
