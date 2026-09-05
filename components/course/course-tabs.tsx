"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Clock, Star, CheckCircle, Lock, Plus } from "lucide-react";
import Link from "next/link";
import { ReviewModal } from "./review-modal";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: string;
  completed: boolean;
  isFree: boolean;
}

interface CourseTabsProps {
  course: {
    id: number;
    duration: string;
    description: string;
    features?: string[];
    requirements?: string[];
  };
  lessons: Lesson[];
  isEnrolled: boolean;
  testimonials?: any[];
  data?: any;
  hasUserReviewed?: boolean;
  currentUserId?: string;
}

export function CourseTabs({
  course,
  lessons,
  isEnrolled,
  testimonials = [],
  data,
  currentUserId,
}: CourseTabsProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const totalLessons = lessons.length;
  const hasUserReviewed = testimonials.some(
    (testimonial) => testimonial.userId === currentUserId
  );
  return (
    <Tabs defaultValue="curriculum" className="animate-slide-up">
      <TabsList className="grid w-full md:grid-cols-3 grid-cols-2 md:h-14 h-full md:text-lg">
        <TabsTrigger value="curriculum">المنهج</TabsTrigger>
        <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
        <TabsTrigger value="reviews">التقييمات</TabsTrigger>
      </TabsList>

      <TabsContent value="curriculum" className="mt-8">
        <Card className="shadow-xl border-0">
          <CardHeader className="p-8">
            <CardTitle className="md:text-3xl text-xl">منهج الدورة</CardTitle>
            <CardDescription className="md:text-xl ">
              إجمالي المدة {course.duration}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="lessons">
                <AccordionTrigger className="text-xl flex items-center">
                  <span className="font-medium ml-auto">دروس الدورة</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between flex-row-reverse p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-row-reverse">
                          {lesson.completed ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : isEnrolled || lesson.isFree ? (
                            <Play className="h-6 w-6 text-primary" />
                          ) : (
                            <Lock className="h-6 w-6 text-muted-foreground" />
                          )}
                          <div>
                            <p className="font-medium md:text-lg">
                              {lesson.title}
                            </p>
                            <div className="flex items-center md:text-lg text-sm text-muted-foreground flex-row-reverse">
                              <Clock className="h-4 w-4 ml-2" />
                              {lesson.duration}
                              <Badge
                                variant="outline"
                                className="mr-3 md:text-sm text-xs"
                              >
                                {lesson.type}
                              </Badge>
                              {lesson.isFree && (
                                <Badge
                                  variant="secondary"
                                  className="mr-2 md:text-sm text-xs"
                                >
                                  مجاني
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        {(isEnrolled || lesson.isFree) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="md:text-lg text-sm"
                            asChild
                          >
                            <Link
                              href={`/course/${course.id}/lesson/${lesson.id}`}
                            >
                              {lesson.completed ? "مراجعة" : "ابدأ"}
                            </Link>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="overview" className="mt-8">
        <Card className="shadow-xl border-0">
          <CardHeader className="p-8">
            <CardTitle className="md:text-3xl text-xl">
              نظرة عامة على الدورة
            </CardTitle>
            <CardDescription className="md:text-xl text-sm">
              تفاصيل شاملة حول محتوى الدورة وأهدافها
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none text-right" dir="rtl">
              <p className="md:text-xl leading-relaxed mb-6">
                {course.description}
              </p>

              {data?.learningObjectives &&
                data.learningObjectives.length > 0 && (
                  <>
                    <h3 className="md:text-2xl font-bold mb-4">
                      ما ستتعلمه في هذه الدورة:
                    </h3>
                    <ul className="space-y-3 mb-8">
                      {data.learningObjectives.map(
                        (objective: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-lg">{objective}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}

              {course.requirements && course.requirements.length > 0 && (
                <>
                  <h3 className="md:text-2xl text-lg font-bold mb-4">
                    المتطلبات:
                  </h3>
                  <ul className="space-y-2 mb-6 md:text-base text-sm">
                    {course.requirements.map(
                      (requirement: string, index: number) => (
                        <li key={index} className="text-lg">
                          • {requirement}
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reviews" className="mt-8">
        <Card className="shadow-xl border-0">
          <CardHeader className="p-8">
            <div className="flex items-center justify-between flex-row-reverse">
              <div>
                <CardTitle className="md:text-3xl text-xl">
                  تقييمات الطلاب
                </CardTitle>
                <CardDescription className="md:text-xl text-sm">
                  آراء الطلاب الذين أكملوا هذه الدورة
                </CardDescription>
              </div>
              {isEnrolled && !hasUserReviewed && (
                <Button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  إضافة تقييم
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {testimonials && testimonials.length > 0 ? (
              <div className="space-y-6">
                {testimonials.map((testimonial: any, index: number) => (
                  <div key={index} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-center justify-between gap-4 mb-3 flex-row-reverse">
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <Avatar className="md:h-10 md:w-10 w-6 h-6">
                          <AvatarImage src={testimonial.user?.profileUrl} />
                          <AvatarFallback>
                            {testimonial.user?.fullName
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("") || "ط"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium md:text-lg text-xs">
                          {testimonial.user?.fullName || "طالب"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`md:h-5 md:w-5 w-2 h-2 ${
                                i <
                                (testimonial.rate || testimonial.rating || 5)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="md:text-lg text-muted-foreground">
                          {new Date(testimonial.createdAt).toLocaleDateString(
                            "ar-EG"
                          )}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground md:text-lg leading-relaxed">
                      {testimonial.comment ||
                        testimonial.content ||
                        "تقييم ممتاز"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  لا توجد تقييمات بعد
                </p>
                {isEnrolled && !hasUserReviewed && (
                  <p className="text-lg text-muted-foreground mt-2">
                    كن أول من يشارك رأيه في هذه الدورة
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <ReviewModal
          courseId={course.id}
          isOpen={isReviewModalOpen}
          onOpenChange={setIsReviewModalOpen}
        />
      </TabsContent>
    </Tabs>
  );
}
