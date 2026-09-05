"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { EnrollmentModal } from "./enrollment-modal";

interface CourseSidebarProps {
  course: {
    id: number;
    title: string;
    price: number;
    imageUrl?: string;
    firstLessonId?: number;
  };
  isEnrolled: boolean;
  isSaved: boolean;
  onSaveToggle: () => void;
  saveMutation: { isPending: boolean };
  unsaveMutation: { isPending: boolean };
}

export function CourseSidebar({
  course,
  isEnrolled,
  isSaved,
  onSaveToggle,
  saveMutation,
  unsaveMutation,
}: CourseSidebarProps) {
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: course.title,
      text: `تحقق من هذه الدورة الرائعة: ${course.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("تم مشاركة الدورة بنجاح");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("تم نسخ رابط الدورة إلى الحافظة");
      }
    } catch (error) {
      console.error("Share error:", error);
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("تم نسخ رابط الدورة إلى الحافظة");
      } catch (clipboardError) {
        toast.error("حدث خطأ أثناء مشاركة الدورة");
      }
    }
  };

  const handleEnrollClick = () => {
    setShowEnrollmentModal(true);
  };

  return (
    <>
      <Card className="sticky top-24 animate-scale-in hover-lift shadow-2xl border-0">
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={course.imageUrl || "/placeholder.jpg"}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>

        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-4xl font-bold text-primary">
                  {course.price} جنيه
                </span>
              </div>
            </div>

            {isEnrolled ? (
              <div className="space-y-4">
                <Button
                  className="w-full hover-lift text-lg py-6 shadow-lg"
                  asChild
                >
                  <Link
                    href={`/course/${course.id}/lesson/${
                      course.firstLessonId
                    }`}
                  >
                    متابعة التعلم
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button
                    className="flex-1 hover-lift text-lg py-6 shadow-lg bg-primary"
                    size="lg"
                    onClick={handleEnrollClick}
                  >
                    التسجيل الآن
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 w-12 hover-lift bg-transparent text-lg py-3"
                    onClick={onSaveToggle}
                    disabled={
                      saveMutation.isPending || unsaveMutation.isPending
                    }
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isSaved ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 hover-lift bg-transparent p-3"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <EnrollmentModal
        isOpen={showEnrollmentModal}
        onClose={() => setShowEnrollmentModal(false)}
        courseId={course.id}
        courseTitle={course.title}
      />
    </>
  );
}
