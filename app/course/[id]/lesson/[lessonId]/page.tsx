"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Confetti from "react-confetti";

import {
  Play,
  Download,
  CheckCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourseById,
  getLessonById,
  getLessons,
  getLessonUrls,
  markLessonAsCompleted,
} from "@/api/courses";
import ProtectedVideoPlayer from "@/components/video/protected-video-player";
import { useAuth } from "@/hooks/use-auth";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X, Trophy, Star } from "lucide-react";

export default function LessonPlayerPage({
  params,
}: {
  params: { id: string; lessonId: string };
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasWatchedToEnd, setHasWatchedToEnd] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string;
    url: string;
    type: string;
  } | null>(null);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Handle window dimensions for confetti
  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  const { data: lessonsData, isLoading: courseLoading } = useQuery({
    queryKey: [`lessons-${params.id}`],
    queryFn: async () => {
      const res = await getLessons(Number(params.id));
      return res;
    },
  });
  const { data: lessonUrls, isLoading: lessonUrlsLoading } = useQuery({
    queryKey: [`lesson-urls-${params.id}`],
    queryFn: async () => getLessonUrls(Number(params.lessonId)),
  });
  const { data: courseData, isLoading: courseDataLoading } = useQuery({
    queryKey: [`course-data-${params.id}`],
    queryFn: async () => getCourseById(Number(params.id)),
  });

  // Check enrollment status and redirect if not enrolled
  useEffect(() => {
    if (courseData && !courseDataLoading) {
      if (!courseData.isEnrolled) {
        router.push(`/course/${params.id}`);
        return;
      }
    }
  }, [courseData, courseDataLoading, router, params.id]);
  const markCompleteMutation = useMutation({
    mutationFn: (lessonId: number) => markLessonAsCompleted(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`course-${params.id}`] });
      queryClient.invalidateQueries({ queryKey: [`lesson-urls-${params.id}`] });
      setIsCompleted(true);
      setHasWatchedToEnd(true);

      // Check if all lessons are completed
      if (lessonsData) {
        const activeLessons = lessonsData.filter(
          (lesson: any) => lesson.isActive !== false
        );
        const currentLessonIndex = activeLessons.findIndex(
          (l: any) => l.id === Number(params.lessonId)
        );
        const isLastLesson = currentLessonIndex === activeLessons.length - 1;

        if (isLastLesson) {
          // Show congratulations dialog and confetti
          setShowConfetti(true);
          setShowCongrats(true);

          // Stop confetti after 5 seconds
          setTimeout(() => {
            setShowConfetti(false);
          }, 5000);
        }
      }
    },
  });

  // Navigation functions
  const navigateToLesson = useCallback(
    (lessonId: number) => {
      router.push(`/course/${params.id}/lesson/${lessonId}`);
    },
    [router, params.id]
  );

  const goToPreviousLesson = useCallback(() => {
    if (!lessonsData) return;
    // Use filtered lessons that are active
    const activeLessons = lessonsData.filter(
      (lesson: any) => lesson.isActive !== false
    );
    const currentIndex = activeLessons.findIndex(
      (l: any) => l.id === Number(params.lessonId)
    );
    if (currentIndex > 0) {
      navigateToLesson(activeLessons[currentIndex - 1].id);
    }
  }, [lessonsData, params.lessonId, navigateToLesson]);

  const goToNextLesson = useCallback(() => {
    if (!lessonsData) return;
    // Use filtered lessons that are active
    const activeLessons = lessonsData.filter(
      (lesson: any) => lesson.isActive !== false
    );
    const currentIndex = activeLessons.findIndex(
      (l: any) => l.id === Number(params.lessonId)
    );
    if (currentIndex < activeLessons.length - 1) {
      navigateToLesson(activeLessons[currentIndex + 1].id);
    }
  }, [lessonsData, params.lessonId, navigateToLesson]);

  // Use course lessons from lessonsData, filtering out inactive lessons
  const lessons =
    lessonsData?.filter((lesson: any) => lesson.isActive !== false) || [];
  const currentLessonIndex = lessons.findIndex(
    (l: any) => l.id === Number.parseInt(params.lessonId)
  );
  const currentLesson = lessons[currentLessonIndex];
  const isCurrentLessonCompleted =
    currentLesson?.completed || currentLesson?.isCompleted || isCompleted;

  const handleMarkComplete = useCallback(() => {
    if (!isCompleted && !isCurrentLessonCompleted) {
      setIsCompleted(true);
      markCompleteMutation.mutate(Number(params.lessonId));
    }
  }, [
    isCompleted,
    isCurrentLessonCompleted,
    markCompleteMutation,
    params.lessonId,
  ]);

  const handleDocumentClick = useCallback(
    (name: string, url: string, type: string) => {
      setSelectedDocument({ name, url, type });
      setIsDocViewerOpen(true);
    },
    []
  );

  const closeDocViewer = useCallback(() => {
    setIsDocViewerOpen(false);
    setSelectedDocument(null);
  }, []);

  // Auto-progression when video ends
  const handleVideoEnd = useCallback(() => {
    setHasWatchedToEnd(true);
    if (!isCurrentLessonCompleted) {
      handleMarkComplete();
    }
    // Auto-progress to next lesson after 3 seconds
    setTimeout(() => {
      goToNextLesson();
    }, 3000);
  }, [isCurrentLessonCompleted, handleMarkComplete, goToNextLesson]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          goToPreviousLesson();
          break;
        case "ArrowRight":
          e.preventDefault();
          goToNextLesson();
          break;
        case " ":
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goToPreviousLesson, goToNextLesson, isPlaying]);

  // Show loading state while data is being fetched
  if (courseLoading || !lessonsData || courseDataLoading || !courseData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الدورة...</p>
        </div>
      </div>
    );
  }

  // If user is not enrolled, they will be redirected by the useEffect above
  // This is an additional safety check
  if (!courseData.isEnrolled) {
    return null;
  }

  // Get current lesson from course lessons or fallback to mock data
  const lesson = currentLesson ?? {
    id: params.lessonId,
    title: "فهم النهايات",
    description:
      "تعلم المفهوم الأساسي للنهايات في حساب التفاضل والتكامل وكيف تشكل الأساس للمشتقات والتكاملات.",
    duration: "15 دقيقة",
    lessonUrl: "video/placeholder-video.mp4",
    transcript: `
      مرحباً بكم في درسنا حول فهم النهايات. في هذا الدرس، سنستكشف أحد أهم المفاهيم الأساسية في حساب التفاضل والتكامل.
      
      النهاية تصف سلوك الدالة عندما يقترب مدخلها من قيمة معينة. هذا المفهوم ضروري لفهم الاستمرارية والمشتقات والتكاملات.
      
      لنبدأ بمثال بسيط. اعتبر الدالة f(x) = x². عندما يقترب x من 2، ماذا يحدث لـ f(x)؟
      
      يمكننا أن نرى أنه كلما اقترب x أكثر وأكثر من 2، فإن f(x) يقترب أكثر وأكثر من 4. نكتب هذا كالتالي: lim(x→2) x² = 4
    `,
    notes: [
      "النهايات تصف سلوك الدالة عندما يقترب المدخل من قيمة معينة",
      "ضرورية لفهم المشتقات والتكاملات",
      "يمكن تقييمها جبرياً أو بيانياً",
      "النهايات أحادية الجانب قد تختلف عن النهايات ثنائية الجانب",
    ],
    resources: [
      { name: "شرائح الدرس", type: "PDF", size: "2.3 ميجابايت", url: "#" },
      { name: "مسائل تدريبية", type: "PDF", size: "1.8 ميجابايت", url: "#" },
      { name: "ورقة الصيغ", type: "PDF", size: "0.5 ميجابايت", url: "#" },
    ],
  };

  // Use real course data or fallback to mock data
  const course = lessonsData ?? {
    id: params.id,
    title: "حساب التفاضل والتكامل المتقدم",
    lessons: [
      { id: 1, title: "فهم النهايات", completed: true },
      { id: 2, title: "قوانين وخصائص النهايات", completed: false },
      { id: 3, title: "الاستمرارية وعدم الاستمرارية", completed: false },
      { id: 4, title: "مسائل تدريبية", completed: false },
      { id: 5, title: "تعريف المشتقة", completed: false },
    ],
  };

  return (
    <div
      className="min-h-screen bg-background"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex sm:flex-row flex-col sm:items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="focus:bg-primary md:text-base text-xs"
              >
                <Link href={`/course/${params.id}`}>العودة إلى الدورة</Link>
              </Button>
              <div>
                <h1 className="md:text-lg text-sm font-semibold">
                  {lesson.title}
                </h1>
                <p className="md:text-sm text-xs text-muted-foreground">
                  {course.title}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:justify-start justify-between">
              <Badge
                variant={isCurrentLessonCompleted ? "default" : "secondary"}
              >
                {isCurrentLessonCompleted ? "مكتمل" : "قيد التقدم"}
              </Badge>
              <Button
                variant={isCurrentLessonCompleted ? "outline" : "default"}
                size="sm"
                onClick={handleMarkComplete}
                disabled={
                  isCurrentLessonCompleted || markCompleteMutation.isPending
                }
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {markCompleteMutation.isPending
                  ? "جاري التحديد..."
                  : isCurrentLessonCompleted
                  ? "مكتمل"
                  : "تحديد كمكتمل"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Auto-progression notification */}
        {hasWatchedToEnd && currentLessonIndex < lessons.length - 1 && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    تم إكمال الدرس! الانتقال إلى الدرس التالي خلال 3 ثوانٍ...
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={goToNextLesson}
                  className="bg-green-600 hover:bg-green-700"
                >
                  اذهب الآن
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player */}
            <Card className="animate-fade-in">
              <CardContent className="p-0">
                <div className="">
                  {/* Video placeholder */}

                  <ProtectedVideoPlayer
                    url={`https://gpa-be.onrender.com/hls/${
                      lesson.lessonUrl?.split("/")?.[1]
                    }/playlist.m3u8`}
                    userId={user?.id || "anonymous"}
                    lessonId={params.lessonId}
                    playing={isPlaying}
                    onPlayPause={setIsPlaying}
                    onEnded={handleVideoEnd}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lesson Content */}
            <Tabs defaultValue="overview" className="animate-slide-up">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                {/* <TabsTrigger value="transcript">النص المكتوب</TabsTrigger> */}
                <TabsTrigger value="resources">المفات</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{lesson.title || lesson.titleAr}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center flex-row-reverse">
                          <Clock className="h-4 w-4 ml-1" />
                          <span>
                            {Math.floor((lesson.period || 0) / 60)} دقيقة
                          </span>
                        </div>
                        <div className="flex items-center flex-row-reverse">
                          <Play className="h-4 w-4 ml-1" />
                          <span>{lesson.contentType || "فيديو"}</span>
                        </div>
                        <div className="flex items-center ">
                          <Badge
                            variant={
                              lesson.status === "approved"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {lesson.status === "approved"
                              ? "معتمد"
                              : lesson.status}
                          </Badge>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-right">
                          <span className="font-medium text-muted-foreground">
                            نوع المحتوى:
                          </span>
                          <span className="mr-2">
                            {lesson.contentType === "video"
                              ? "فيديو تعليمي"
                              : lesson.contentType}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-muted-foreground">
                            الحالة:
                          </span>
                          <span className="mr-2">
                            {lesson.isActive ? "نشط" : "غير نشط"}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-muted-foreground">
                            مجاني:
                          </span>
                          <span className="mr-2">
                            {lesson.isFree ? "نعم" : "لا"}
                          </span>
                        </div>
                      </div>
                      {lesson.description && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2 text-right">
                            وصف الدرس:
                          </h4>
                          <p className="text-muted-foreground leading-relaxed text-right">
                            {lesson.description}
                          </p>
                        </div>
                      )}
                      {lesson.extraDocuments &&
                        lesson.extraDocuments.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2 text-right">
                              المستندات الإضافية:
                            </h4>
                            <p className="text-sm text-muted-foreground text-right">
                              {lesson.extraDocuments.length} مستند متاح في قسم
                              الملفات
                            </p>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* <TabsContent value="transcript" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>النص المكتوب للفيديو</CardTitle>
                    <CardDescription>النص الكامل لفيديو الدرس</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                        {lesson.transcript}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> */}

              {/* <TabsContent value="notes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>ملاحظات الدرس</CardTitle>
                    <CardDescription>
                      النقاط الرئيسية والملاحظات المهمة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lesson.notes.map((note, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 border rounded-lg bg-muted/20"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-xs font-medium text-primary">{index + 1}</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> */}

              <TabsContent value="resources" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>مفات الحصة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Display extraDocuments with view buttons */}
                      {lesson.extraDocuments?.map(
                        (doc: string, docIdx: number) => {
                          const docUrl =
                            lessonUrls?.extraDocumentsSignedUrls?.[docIdx]
                              ?.signedUrl;
                          const ext = doc.split(".").pop()?.toLowerCase();
                          const cleanName = doc.replace(/^documents\//, "");

                          if (!docUrl) return null;

                          return (
                            <div
                              key={`extra-doc-${docIdx}`}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="font-medium">{cleanName}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDocumentClick(
                                      cleanName,
                                      docUrl,
                                      ext || ""
                                    )
                                  }
                                  className="hover-lift bg-transparent"
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  عرض
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hover-lift bg-transparent"
                                  onClick={() => window.open(docUrl, "_blank")}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  تحميل
                                </Button>
                              </div>
                            </div>
                          );
                        }
                      )}

                      {/* Display existing lesson resources */}
                      {lesson.resources?.map((resource, index) => {
                        const ext = resource.type?.toLowerCase() || "pdf";

                        return (
                          <div
                            key={`lesson-resource-${index}`}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">{resource.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {resource.type} • {resource.size}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDocumentClick(
                                    resource.name,
                                    resource.url,
                                    ext
                                  )
                                }
                                className="hover-lift bg-transparent"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                عرض
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover-lift bg-transparent"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                تحميل
                              </Button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Show message if no resources available */}
                      {(!lesson.extraDocuments ||
                        lesson.extraDocuments.length === 0) &&
                        (!lesson.resources ||
                          lesson.resources.length === 0) && (
                          <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>لا توجد ملفات متاحة لهذا الدرس</p>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 animate-scale-in">
              <CardHeader>
                <CardTitle className="text-lg">دروس الدورة</CardTitle>
                <CardDescription>
                  {
                    lessons.filter((l: any) => l.completed || l.isCompleted)
                      .length
                  }{" "}
                  من {lessons.length} مكتمل
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lessons.map((courseLesson: any, index: number) => {
                    const isCurrentLesson =
                      courseLesson.id === Number.parseInt(params.lessonId);
                    const isLessonCompleted =
                      courseLesson.completed || courseLesson.isCompleted;

                    return (
                      <Link
                        key={courseLesson.id}
                        href={`/course/${params.id}/lesson/${courseLesson.id}`}
                        className={`block p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
                          isCurrentLesson ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {isLessonCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : isCurrentLesson ? (
                              <Play className="h-5 w-5 text-primary" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {index + 1}. {courseLesson.title}
                            </p>
                            {courseLesson.duration && (
                              <p className="text-xs text-muted-foreground">
                                {courseLesson.duration}
                              </p>
                            )}
                          </div>
                          {isCurrentLesson && (
                            <Badge variant="secondary" className="text-xs">
                              الحالي
                            </Badge>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <Dialog open={isDocViewerOpen} onOpenChange={setIsDocViewerOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedDocument?.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeDocViewer}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {selectedDocument && (
              <div className="w-full h-[70vh]">
                {selectedDocument.type &&
                ["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(
                  selectedDocument.type
                ) ? (
                  <DocViewer
                    documents={[
                      {
                        uri: selectedDocument.url,
                        fileName: selectedDocument.name,
                      },
                    ]}
                    pluginRenderers={DocViewerRenderers}
                    style={{ height: "100%" }}
                    config={{ header: { disableHeader: true } }}
                  />
                ) : (
                  <iframe
                    src={selectedDocument.url}
                    className="w-full h-full border rounded"
                    title={selectedDocument.name}
                  />
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Congratulations Dialog */}
      <Dialog open={showCongrats} onOpenChange={setShowCongrats}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Trophy className="h-16 w-16 text-yellow-500" />
                <Star className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              مبروك! 🎉
            </DialogTitle>
            <DialogDescription className="text-lg text-center mt-2">
              لقد أكملت جميع دروس الكورس بنجاح!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-4">
            <p className="text-muted-foreground text-center">
              أحسنت! لقد أنهيت رحلتك التعليمية في هذا الكورس. نتمنى أن تكون قد
              استفدت من المحتوى المقدم.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => {
                  setShowCongrats(false);
                  router.push(`/course/${params.id}`);
                }}
                className="flex-1"
              >
                العودة للكورس
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCongrats(false);
                  router.push("/my-courses");
                }}
                className="flex-1"
              >
                كورساتي
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confetti */}
      {showConfetti && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 9999 }}
        >
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        </div>
      )}
    </div>
  );
}
