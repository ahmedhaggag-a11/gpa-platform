"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  profileUpdateSchema,
  type ProfileUpdateFormData,
} from "@/validation/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Save, Edit, X } from "lucide-react";
import { toast } from "sonner";
import { updateMe } from "@/api/user";

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  grade: string;
  avatar: string;
  parentPhoneNumber: string;
  about?: string;
}

interface CurriculumData {
  id: number;
  name: string;
  classes: Array<{
    id: number;
    name: string;
  }>;
}

interface ProfileSettingsProps {
  profileData: ProfileData;
  curriculum: CurriculumData[];
  selectedCountry: number;
  selectedGrade: number;
  onCountryChange: (countryId: number) => void;
  onGradeChange: (gradeId: number) => void;
  onSave?: (data: ProfileUpdateFormData) => Promise<void>;
  isLoading: boolean;
}

export default function ProfileSettings({
  profileData,
  onSave,
  isLoading,
}: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // React Hook Form setup
  console.log("ProfileData.about on component load:", profileData.about);
  console.log("ProfileData.about type:", typeof profileData.about);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: profileData.fullName,
      email: profileData.email,
      phoneNumber: profileData.phoneNumber,
      parentPhoneNumber: profileData.parentPhoneNumber,
      about: profileData.about,
    },
  });

  // React Query mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: async (data, variables) => {
      // Show success message
      toast.success("تم حفظ التغييرات بنجاح", {
        description: "تم تحديث معلوماتك الشخصية بنجاح",
        duration: 3000,
      });

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Call the parent onSave function if provided
      if (onSave) {
        await onSave(variables);
      }

      // Exit edit mode
      setIsEditing(false);
    },
    onError: (error: any) => {
      // Show error message
      toast.error("فشل في حفظ التغييرات", {
        description: error.message || "حدث خطأ أثناء تحديث معلوماتك الشخصية",
        duration: 5000,
      });

      console.error("Profile update error:", error);
    },
  });

  const onSubmit = (data: ProfileUpdateFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      reset({
        fullName: profileData.fullName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
        parentPhoneNumber: profileData.parentPhoneNumber,
        about: profileData.about || "",
      });
    }
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    reset({
      fullName: profileData.fullName,
      email: profileData.email,
      phoneNumber: profileData.phoneNumber,
      parentPhoneNumber: profileData.parentPhoneNumber,
      about: profileData.about || "",
    });
  }, [profileData]);
  return (
    <Card
      className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-500 ${
        isEditing
          ? "bg-gradient-to-br from-blue-50 to-green-50/30"
          : "bg-gradient-to-br from-white to-green-50/30"
      }`}
    >
      <CardHeader className="flex-row-reverse">
        <div className="flex justify-between items-center w-full">
          <Button
            onClick={handleEditToggle}
            variant={isEditing ? "destructive" : "outline"}
            className={`flex items-center gap-2 md:text-base text-[10px] ${
              isEditing
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                إلغاء التعديل
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                تعديل الملف الشخصي
              </>
            )}
          </Button>
          <div className="text-right">
            <CardTitle className="md:text-2xl text-sm flex items-center gap-3 flex-row-reverse">
              <User className="w-6 h-6 text-green-500" />
              المعلومات الشخصية
            </CardTitle>
            <CardDescription className="md:text-lg text-xs">
              {isEditing
                ? "قم بتحديث معلوماتك الشخصية"
                : "عرض معلوماتك الشخصية"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="md:space-y-6 space-y-3">
        <form onSubmit={handleSubmit(onSubmit)} className="md:space-y-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="md:text-lg font-medium">
                الاسم الكامل
              </Label>
              <Input
                id="name"
                placeholder="أدخل اسمك الكامل"
                className={`h-12 md:text-lg ${
                  !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                }`}
                disabled={!isEditing}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="md:text-lg font-medium">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className={`h-12 md:text-lg ${
                  !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                }`}
                disabled={true}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="md:text-lg font-medium">
                رقم الهاتف
              </Label>
              <Input
                id="phone"
                placeholder="أدخل رقم هاتفك"
                className={`h-12 md:text-lg ${
                  !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                }`}
                disabled={!isEditing}
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentPhone" className="md:text-lg font-medium">
                رقم هاتف ولي الأمر
              </Label>
              <Input
                id="parentPhone"
                placeholder="أدخل رقم هاتف ولي الأمر"
                className={`h-12 md:text-lg ${
                  !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                }`}
                disabled={!isEditing}
                {...register("parentPhoneNumber")}
              />
              {errors.parentPhoneNumber && (
                <p className="text-red-500 text-sm">
                  {errors.parentPhoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="md:text-lg font-medium">
                الدولة
              </Label>
              <div className="h-12 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center text-lg text-gray-600">
                {profileData.country || "غير محدد"}
              </div>
              <p className="text-sm text-gray-500">لا يمكن تغيير الدولة</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade" className="md:text-lg font-medium">
                الصف الدراسي
              </Label>
              <div className="h-12 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center text-lg text-gray-600">
                {profileData.grade || "غير محدد"}
              </div>
              <p className="text-sm text-gray-500">
                لا يمكن تغيير الصف الدراسي
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="about" className="md:text-lg font-medium">
              نبذة شخصية
            </Label>
            <Textarea
              id="about"
              placeholder="اكتب نبذة مختصرة عن نفسك..."
              className={`min-h-[120px] text-lg resize-none ${
                !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
              disabled={!isEditing}
              {...register("about")}
            />
            {errors.about && (
              <p className="text-red-500 text-sm">{errors.about.message}</p>
            )}
          </div>

          {isEditing && (
            <Button
              type="submit"
              disabled={isLoading || updateProfileMutation.isPending}
              className="w-full h-12 md:text-lg font-semibold bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="w-5 h-5 ml-2" />
              {isLoading || updateProfileMutation.isPending
                ? "جاري الحفظ..."
                : "حفظ التغييرات"}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
