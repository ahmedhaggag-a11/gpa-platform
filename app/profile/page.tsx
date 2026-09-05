"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  passwordChangeSchema,
  type PasswordChangeFormData,
} from "@/validation/profile";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { getCirculum } from "@/api/subjects";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileTabs from "@/components/profile/profile-tabs";
import { useUserProfile } from "@/hooks/use-auth";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const {
    displayName,
    avatarUrl,
    email,
    userId,
    role,
    classId,
    phoneNumber,
    class: { curriculum, id, nameAr },
    parentPhoneNumber,
    about
  } = useUserProfile();

  const [profileData, setProfileData] = useState({
    fullName: displayName || "",
    email: email || "",
    phoneNumber: phoneNumber || "",
    country: curriculum?.country || "",
    grade: nameAr || "",
    avatar: avatarUrl || "",
    parentPhoneNumber: parentPhoneNumber || "",
    bio: "",
    about: about || "",
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

  // Update profile data when user data changes
  useEffect(() => {
    setProfileData({
      fullName: displayName || "",
      email: email || "",
            phoneNumber: phoneNumber || "",
      country: curriculum?.country || "",
      grade: nameAr || "",
      avatar: avatarUrl || "",
      parentPhoneNumber: parentPhoneNumber || "",
      bio: "",
      about: about || "",

    });
    // Initialize selected values for dropdowns
    if (curriculum?.id) {
      setSelectedCountry(curriculum.id.toString());
    }
    if (classId) {
      setSelectedGrade(classId.toString());
    }
  }, [displayName, email, phoneNumber, classId, avatarUrl, parentPhoneNumber, about, curriculum]);
  const { data } = useQuery({
    queryKey: ["curriculum"],
    queryFn: getCirculum,
    staleTime: 1000 * 60 * 60 * 24,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="sm:text-5xl text-3xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-relaxed">
            ملفي الشخصي
          </h1>
          <p className="sm:text-xl text-gray-600 font-medium">  
            إدارة إعدادات حسابك وتتبع تقدمك التعليمي
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <ProfileHeader
              profileData={profileData}
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing(!isEditing)}
              onProfileUpdate={(updatedData) => {
                setProfileData(prev => ({ ...prev, ...updatedData }));
              }}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <ProfileTabs
              profileData={profileData}
              data={data}
              selectedCountry={selectedCountry}
              selectedGrade={selectedGrade}
              isEditing={isEditing}
              isLoading={isLoading}
              showPassword={showPassword}
              errors={errors}
              register={register}
              handleSubmit={handleSubmit}
              onPasswordSubmit={onPasswordSubmit}
              onCountryChange={(value) => {
                setSelectedCountry(value);
                const selectedCountryData = data?.find(
                  (item: any) => item.id.toString() === value
                );
                if (selectedCountryData) {
                  setProfileData({
                    ...profileData,
                    country: selectedCountryData.countryAr,
                  });
                }
                setSelectedGrade("");
                setProfileData({
                  ...profileData,
                  grade: "",
                  country: selectedCountryData?.countryAr || "",
                });
              }}
              onGradeChange={(value) => {
                setSelectedGrade(value);
                // Find the selected class to update profile data
                const selectedClass = data
                  ?.find(
                    (country: any) =>
                      country.id.toString() === selectedCountry
                  )
                  ?.classes?.find(
                    (classItem: any) =>
                      classItem.id.toString() === value
                  );
                if (selectedClass) {
                  setProfileData({
                    ...profileData,
                    grade: selectedClass.nameAr,
                  });
                }
              }}
              onProfileDataChange={setProfileData}
              onShowPasswordChange={setShowPassword}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
