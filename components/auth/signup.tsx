"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/validation/auth";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useAuthActions } from "@/hooks/use-auth";
import { toast } from "sonner";
import CustomPasswordInput from "../ui/custom-password-input";
import CustomInput from "../ui/custom-input";
import { useQuery } from "@tanstack/react-query";
import { getCirculum } from "@/api/subjects";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuthActions();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  const { data } = useQuery({
    queryKey: ["curriculum"],
    queryFn: getCirculum,
    staleTime: 1000 * 60 * 60 * 24,
  });
  console.log(errors);
  const onSubmit = async (data: SignupFormData) => {
    // Prevent duplicate submissions
    if (isSubmitting || isLoading) {
      console.log('Signup already in progress, ignoring duplicate submission');
      return;
    }
    
    setIsLoading(true);
    setIsSubmitting(true);
    
    try {
      const result = await signUp(data.email, data.password, {
        fullName: data.fullName,
        classId: Number(data.classId),
        phoneNumber: data.phoneNumber,
        parentPhoneNumber: data.parentPhoneNumber,
        password: data.password,
      });

      if (result.success) {
        if (result.requiresEmailConfirmation) {
          toast.success(
            "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.",
            {
              duration: 8000,
              description:
                "تحقق من صندوق الوارد أو مجلد الرسائل غير المرغوب فيها",
            }
          );
        } else {
          toast.success("تم إنشاء الحساب بنجاح!");
        }
      }
    } catch (error: any) {
      // Error handling is already done in the signUp function
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 overflow-x-hidden">
      <div className="space-y-4">
        <CustomInput
          id="fullName"
          type="text"
          placeholder="أدخل اسمك الكامل"
          {...register("fullName")}
          error={errors.fullName?.message}
          Icon={User}
          label="الاسم الكامل"
        />

        <CustomInput
          id="email"
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          {...register("email")}
          error={errors.email?.message}
          Icon={Mail}
          label="البريد الإلكتروني"
        />
        <div className="grid grid-cols-2 gap-4 ">
          <div className="space-y-3">
            <Label htmlFor="grade" className="md:text-lg">
              الصف
            </Label>
            <div className="relative">
              <Select
                value={selectedGrade}
                onValueChange={(value) => {
                  setSelectedGrade(value);
                  setValue("classId", value);
                }}
                disabled={!selectedCountry}
              >
                <SelectTrigger className="ps-12 h-12 text-lg">
                  <SelectValue
                    placeholder={
                      selectedCountry ? "اختر الصف" : "اختر الدولة أولاً"
                    }
                    className="text-xs"
                  />
                </SelectTrigger>
                <SelectContent>
                  {selectedCountry &&
                    data
                      ?.find(
                        (country: any) =>
                          country.id.toString() === selectedCountry
                      )
                      ?.classes?.map(
                        (classItem: any) =>
                          classItem.isActive && (
                            <SelectItem
                              key={classItem.id}
                              value={classItem.id.toString()}
                              className="focus:bg-primary/90"
                            >
                              {classItem.nameAr}
                            </SelectItem>
                          )
                      )}
                </SelectContent>
              </Select>
              {errors.classId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.classId.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="country" className="md:text-lg">
              الدولة
            </Label>
            <div className="relative">
              <Select
                value={selectedCountry}
                onValueChange={(value) => {
                  setSelectedCountry(value);
                  setValue("country", value);
                  setSelectedGrade("");
                  setValue("classId", "");
                }}
              >
                <SelectTrigger className="ps-12 h-12 text-lg">
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
                <SelectContent>
                  {data?.map((item: any) => (
                    <SelectItem
                      key={item.id}
                      value={item.id.toString()}
                      className="focus:bg-primary/90"
                    >
                      {item.countryAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <CustomInput
          id="phoneNumber"
          type="text"
          placeholder="أدخل رقم هاتفك"
          {...register("phoneNumber")}
          error={errors.phoneNumber?.message}
          Icon={Phone}
          label="رقم الهاتف"
        />

        <CustomInput
          id="parentPhoneNumber"
          type="text"
          placeholder="أدخل رقم هاتف ولي الأمر"
          {...register("parentPhoneNumber")}
          error={errors.parentPhoneNumber?.message}
          Icon={Phone}
          label="رقم هاتف ولي الأمر"
        />

        <CustomPasswordInput
          id="password"
          placeholder="أدخل كلمة المرور"
          {...register("password")}
          error={errors.password?.message}
          label="كلمة المرور"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        <CustomPasswordInput
          id="confirmPassword"
          placeholder="أعد إدخال كلمة المرور"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          label="تأكيد كلمة المرور"
          showPassword={showConfirmPassword}
          setShowPassword={setShowConfirmPassword}
        />

        <div className="flex flex-row-reverse items-center space-x-2 space-x-reverse">
          <input
            type="checkbox"
            id="agreeToTerms"
            {...register("terms")}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="agreeToTerms" className="text-sm">
            أوافق على{" "}
            <a href="/terms" className="text-primary hover:underline">
              الشروط والأحكام
            </a>{" "}
            و{" "}
            <a href="/privacy" className="text-primary hover:underline">
              سياسة الخصوصية
            </a>
          </Label>
        </div>
        {errors.terms && (
          <p className="md:text-sm text-xs text-red-500">{errors.terms.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
        {isLoading ? (
          <>
            <Loader2 className="me-2 h-4 w-4 animate-spin" />
            جاري إنشاء الحساب...
          </>
        ) : (
          "إنشاء حساب"
        )}
      </Button>
    </form>
  );
}
