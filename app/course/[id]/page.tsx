"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourseById, saveCourse, unsaveCourse } from "@/api/courses";
import { getSavedCourses } from "@/api/user";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  CourseHeader,
  CourseSidebar,
  CourseTabs,
  TeacherCard,
} from "@/components/course";

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [isSaved, setIsSaved] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isPending } = useQuery({
    queryKey: [`course-${params.id}`],
    queryFn: async () => getCourseById(params.id),
  });

  const { data: savedCourses } = useQuery({
    queryKey: ["saved"],
    queryFn: getSavedCourses,
  });

  // Check if course is saved
  useEffect(() => {
    if (savedCourses && params.id) {
      const isCourseSaved = savedCourses.some(
        (savedCourse: any) => savedCourse.course.id.toString() === params.id
      );
      setIsSaved(isCourseSaved);
    }
  }, [savedCourses, params.id]);

  // Save course mutation
  const saveMutation = useMutation({
    mutationFn: saveCourse,
    onSuccess: () => {
      setIsSaved(true);
      queryClient.invalidateQueries({ queryKey: ["saved"] });
      toast.success("تم حفظ الدورة بنجاح");
    },
    onError: (error: any) => {
      toast.error("حدث خطأ أثناء حفظ الدورة");
      console.error("Save course error:", error);
    },
  });

  // Unsave course mutation
  const unsaveMutation = useMutation({
    mutationFn: unsaveCourse,
    onSuccess: () => {
      setIsSaved(false);
      queryClient.invalidateQueries({ queryKey: ["saved"] });
      toast.success("تم إلغاء حفظ الدورة");
    },
    onError: (error: any) => {
      toast.error("حدث خطأ أثناء إلغاء حفظ الدورة");
      console.error("Unsave course error:", error);
    },
  });

  // Handle save/unsave toggle
  const handleSaveToggle = () => {
    const courseId = parseInt(params.id);
    if (isSaved) {
      unsaveMutation.mutate(courseId);
    } else {
      saveMutation.mutate(courseId);
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    const shareData = {
      title: course.title,
      text: `تحقق من هذه الدورة الرائعة: ${course.title}`,
      url: window.location.href,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("تم مشاركة الدورة بنجاح");
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success("تم نسخ رابط الدورة إلى الحافظة");
      }
    } catch (error) {
      console.error("Share error:", error);
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("تم نسخ رابط الدورة إلى الحافظة");
      } catch (clipboardError) {
        toast.error("حدث خطأ أثناء مشاركة الدورة");
      }
    }
  };

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8 mih-h-[70vh]">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded w-2/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[70vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">الدورة غير موجودة</h1>
          <p className="text-muted-foreground">
            لم يتم العثور على الدورة المطلوبة
          </p>
        </div>
      </div>
    );
  }

  const isEnrolled = data.isEnrolled;

  // Calculate total duration from lessons
  const totalDuration = data.lessons.reduce(
    (acc: number, lesson: any) => acc + lesson.period,
    0
  );
  const totalHours = Math.floor(totalDuration / 60 / 60);
  const totalMinutes = Math.floor(totalDuration % 60);
  const durationText =
    totalHours > 0
      ? `${totalHours} ساعة ${totalMinutes} دقيقة`
      : `${totalMinutes} دقيقة`;

  const course = {
    id: data.id,
    firstLessonId: data.lessons?.find((l) => l.isActive)?.id,
    title: data.titleAr || data.title,
    subject:
      data.courseClassSubjects[0]?.classSubject?.subject?.titleAr || "غير محدد",
    grade:
      data.courseClassSubjects[0]?.classSubject?.class?.nameAr || "غير محدد",
    country: `🇪🇬 ${
      data.courseClassSubjects[0]?.classSubject?.class?.curriculum?.countryAr ||
      "مصر"
    }`,
    description: data.aboutAr || data.about || "وصف الدورة غير متوفر",
    teacher: data.teacher
      ? {
          name: data.teacher.fullName,
          title: "مدرس",
          university: "غير محدد",
          experience: "غير محدد",
          rating: 4.5,
          students: 0,
          courses: 0,
          about: "معلومات المدرس غير متوفرة",
          profileUrl: data.teacher.profileUrl,
        }
      : null,
    rating:
      (
        data.testimonials?.reduce(
          (acc: number, item: any) => acc + item.rate,
          0
        ) / data.testimonials?.length
      )?.toFixed(1) || "0.0",
    totalStudents: data.testimonials?.length || 0,
    duration: durationText,
    lessons: data.lessons?.length || 0,
    price: data.price || 0,
    originalPrice: Math.round((data.price || 0) * 1.3),
    level: "متوسط",
    lastUpdated: new Date(data.updatedAt).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
    }),
    imageUrl: data.imageUrl,
    certificate: true,
    features: data.features || [
      "محتوى تعليمي شامل",
      "دروس تفاعلية",
      "موارد تعليمية",
      "اختبارات ومراجعات",
    ],
    requirements: data.requirements || ["لا توجد متطلبات خاصة"],
  };

  // Function to convert minutes to hours and minutes format
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60 / 60);
    const remainingMinutes = Math.floor(minutes % 60);

    if (hours > 0) {
      return `${hours} ساعة ${remainingMinutes} دقيقة`;
    } else {
      return `${remainingMinutes} دقيقة `;
    }
  };

  // Create lessons array from data.lessons with proper structure
  const sortedLessons =
    data.lessons
      ?.filter((lesson) => lesson.isActive)
      .map((lesson: any, index: number) => ({
        id: lesson.id,
        title: lesson.titleAr || lesson.title,
        duration: formatDuration(lesson.period),
        type: "فيديو",
        completed: false,
        isFree: index === 0, // First lesson is free
      })) || [];

  const totalLessons = sortedLessons.length;
  const completedLessons = sortedLessons.filter(
    (lesson) => lesson.completed
  ).length;
  const progress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <CourseHeader course={course} />
          {course.teacher && <TeacherCard teacher={course.teacher} />}
        </div>

        <div className="lg:col-span-1">
          <CourseSidebar
            course={course}
            isEnrolled={isEnrolled}
            isSaved={isSaved}
            onSaveToggle={handleSaveToggle}
            saveMutation={saveMutation}
            unsaveMutation={unsaveMutation}
          />
        </div>
      </div>

      <CourseTabs
        course={course}
        lessons={sortedLessons}
        isEnrolled={isEnrolled}
        testimonials={data.testimonials}
        data={data}
        currentUserId={user?.id}
      />
    </div>
  );
}
