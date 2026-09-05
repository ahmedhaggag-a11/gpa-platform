"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Lock } from "lucide-react";
import ProfileSettings from "./profile-settings";
import PasswordChange from "./password-change";
import { ProfileUpdateFormData } from "@/validation/profile";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  country: string;
  grade: string;
  avatar: string;
  parentPhone: string;
  bio: string;
  about: string;
}

interface CurriculumData {
  id: number;
  name: string;
  classes: Array<{
    id: number;
    name: string;
  }>;
}

interface ProfileTabsProps {
  profileData: ProfileUpdateFormData;
  data: any;
  selectedCountry: string;
  selectedGrade: string;
  isEditing: boolean;
  isLoading: boolean;
  showPassword: any;
  errors: any;
  register: any;
  handleSubmit: any;
  onPasswordSubmit: (data: any) => void;
  onCountryChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onProfileDataChange: (data: any) => void;
  onShowPasswordChange: (show: any) => void;
}

export default function ProfileTabs({
  profileData,
  data,
  isEditing,
  isLoading,
  showPassword,
  errors,
  register,
  handleSubmit,
  onPasswordSubmit,
  onProfileDataChange,
  onShowPasswordChange,
}: ProfileTabsProps) {
  return (
    <Tabs defaultValue="settings" className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-100 rounded-xl p-1">
        <TabsTrigger
          value="settings"
          className="flex items-center gap-3 text-lg font-semibold h-12 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
        >
          <Settings className="w-5 h-5" />
          الإعدادات
        </TabsTrigger>
        <TabsTrigger
          value="password"
          className="flex items-center gap-3 text-lg font-semibold h-12 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
        >
          <Lock className="w-5 h-5" />
          كلمة المرور
        </TabsTrigger>
      </TabsList>

      <TabsContent value="settings" className="mt-8">
        <ProfileSettings
          profileData={profileData}
          data={data}
          isEditing={isEditing}
          isLoading={isLoading}
          onProfileDataChange={onProfileDataChange}
        />
      </TabsContent>

      <TabsContent value="password" className="mt-8">
        <PasswordChange
          email={profileData.email}
          isLoading={isLoading}
          showPassword={showPassword}
          errors={errors}
          register={register}
          handleSubmit={handleSubmit}
          onPasswordSubmit={onPasswordSubmit}
          onShowPasswordChange={onShowPasswordChange}
        />
      </TabsContent>
    </Tabs>
  );
}