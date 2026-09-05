"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CustomInput from "@/components/ui/custom-input";
import { useForm } from "react-hook-form";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions, useGuestOnly } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, isLoading } = useAuthActions();

  // Redirect if already authenticated
  useGuestOnly();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const isPending = isSubmitting || isLoading;

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const result = await resetPassword(data.email);
    if (result.success) {
      setIsSubmitted(true);
      reset();
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl overflow-hidden bg-primary flex items-center justify-center shadow-xl">
                <Image
                  src="/logo.png"
                  alt="منصة GPA"
                  width={200}
                  height={200}
                />
              </div>
              <span className="md:text-3xl text-2xl font-bold text-foreground">
                منصة GPA
              </span>
            </Link>
            <p className="md:text-lg text-muted-foreground mt-3 text-center">
              بوابتك نحو التميز الأكاديمي
            </p>
          </div>

          <Card className="animate-scale-in hover-lift shadow-2xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="md:text-2xl text-xl font-bold text-center mb-2">
                تم إرسال الرابط بنجاح
              </CardTitle>
              <CardDescription className="md:text-lg text-center text-muted-foreground">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    يرجى التحقق من بريدك الإلكتروني واتباع التعليمات لإعادة
                    تعيين كلمة المرور
                  </p>
                  <p className="text-sm text-muted-foreground">
                    لم تستلم الرسالة؟ تحقق من مجلد الرسائل غير المرغوب فيها
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="w-full h-12 text-lg"
                  >
                    إرسال مرة أخرى
                  </Button>

                  <Link href="/auth" className="w-full">
                    <Button
                      variant="default"
                      className="w-full h-12 text-lg bg-primary shadow-lg hover-lift"
                    >
                      <ArrowLeft className="w-5 h-5 ml-2" />
                      العودة لتسجيل الدخول
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl overflow-hidden bg-primary flex items-center justify-center shadow-xl">
              <Image src="/logo.png" alt="منصة GPA" width={200} height={200} />
            </div>
            <span className="md:text-3xl text-2xl font-bold text-foreground">منصة GPA</span>
          </Link>
          <p className="md:text-lg text-muted-foreground mt-3 text-center">
            بوابتك نحو التميز الأكاديمي
          </p>
        </div>

        <Card className="animate-scale-in hover-lift shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="md:text-xl text-lg font-bold text-center mb-2">
              نسيت كلمة المرور؟
            </CardTitle>
            <CardDescription className="md:text-lg text-center text-muted-foreground">
              أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              {/* Email Input */}
              <div className="space-y-2">
                <CustomInput
                  Icon={Mail}
                  id="email"
                  label="البريد الإلكتروني"
                  placeholder="أدخل بريدك الإلكتروني"
                  type="email"
                  autoComplete="email"
                  disabled={isPending}
                  {...register("email")}
                  error={errors.email?.message}
                />
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
                    <span>جاري الإرسال...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span>إرسال رابط إعادة التعيين</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center mt-8">
              <Link
                href="/auth"
                className="md:text-base text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة لتسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
