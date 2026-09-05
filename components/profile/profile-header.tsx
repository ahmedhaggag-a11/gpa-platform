"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Camera,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/auth-context";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { updateMe } from "@/api/user";
import { useQueryClient } from "@tanstack/react-query";

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  grade: string;
  avatar: string;
  parentPhoneNumber: string;
  bio: string;
  about: string;
}

interface ProfileHeaderProps {
  profileData: ProfileData;
  isEditing: boolean;
  onToggleEdit: () => void;
  onProfileUpdate?: (updatedData: Partial<ProfileData>) => void;
}

export default function ProfileHeader({
  profileData,
  onProfileUpdate,
}: ProfileHeaderProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
const queryClient = useQueryClient();
  const pickAndUploadImage = async () => {
    if (!user) {
       toast.error("يجب تسجيل الدخول لرفع الصورة");
       return;
     }

    // Trigger file input click
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
     if (!file.type.startsWith('image/')) {
       toast.error("يرجى اختيار ملف صورة صالح");
       return;
     }

     // Validate file size (max 5MB)
     if (file.size > 5 * 1024 * 1024) {
       toast.error("يجب أن يكون حجم الصورة أقل من 5 ميجابايت");
       return;
     }

    try {
      setUploading(true);
      const filePath = `students/${user.id}-${Date.now()}.${file.name.split('.').pop()}`;

      // Remove old image if exists
      let oldPath = profileData.avatar;
      if (oldPath && oldPath.startsWith("http")) {
        // Match students/uuid-timestamp.jpg after /images/
        const match = oldPath.match(/images\/(students\/[\w-]+\.\w{3,4})$/);
        oldPath = match ? match[1] : undefined;
      } else if (oldPath && oldPath.startsWith("images/")) {
        // Remove 'images/' prefix
        oldPath = oldPath.replace(/^images\//, "");
      }
      
      if (oldPath) {
        await supabase.storage.from("images").remove([oldPath]);
      }

      // Upload new image
      const { data, error } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          upsert: true,
          cacheControl: "3600",
        });

      if (error) {
         console.error("Upload error:", error);
         toast.error("فشل في رفع الصورة");
         return;
       }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      
      // Update user profile in Supabase Auth
       await supabase.auth.updateUser({ 
         data: { profileUrl: publicUrl } 
       });
       
       // Update user profile in backend database
       await updateMe({ profileUrl: publicUrl });
       
       // Update local state
       if (onProfileUpdate) {
         onProfileUpdate({ avatar: publicUrl });
       }
        queryClient.invalidateQueries({ queryKey: [`user-${user?.id}`] });
      toast.success("تم تحديث صورة الملف الشخصي بنجاح!");
    } catch (error) {
       console.error("Error uploading image:", error);
       toast.error("فشل في رفع الصورة");
     } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  return (
    <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-6">
          <Avatar className="w-28 h-28 border-4 border-white shadow-2xl ring-4 ring-primary/20">
            <AvatarImage
              src={profileData.avatar || "/placeholder.svg"}
              alt={profileData.fullName}
            />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-blue-600 text-white">
              {profileData.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            onClick={pickAndUploadImage}
            disabled={uploading}
            className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg disabled:opacity-50"
          >
            <Camera className="w-5 h-5" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          {profileData.fullName}  
        </CardTitle>
        <CardDescription className="flex items-center justify-center gap-2 text-lg">
          <MapPin className="w-5 h-5" />
          {profileData.country} • {profileData.grade}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 text-base text-gray-700 p-3 rounded-lg bg-gray-50/50">
          <Mail className="w-5 h-5 text-primary" />
          <span>{profileData.email}</span>
        </div>
        <div className="flex items-center gap-4 text-base text-gray-700 p-3 rounded-lg bg-gray-50/50">
          <Phone className="w-5 h-5 text-primary" />
          <span>{profileData.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-4 text-base text-gray-700 p-3 rounded-lg bg-gray-50/50">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>{profileData.grade}</span>
        </div>
      </CardContent>
    </Card>
  );
}