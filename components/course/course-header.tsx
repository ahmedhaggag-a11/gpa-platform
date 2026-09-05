"use client";

import { Badge } from "@/components/ui/badge";
import { Star, Clock, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";

interface CourseHeaderProps {
  course: {
    title: string;
    description: string;
    country: string;
    level: string;
    subject: string;
    rating: string;
    totalStudents: number;
    duration: string;
    lessons: number;
    lastUpdated: string;
  };
}

export function CourseHeader({ course }: CourseHeaderProps) {
  return (
    <div className="animate-slide-up">
      {/* Breadcrumb */}
      <nav className="md:text-sm text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">
          الرئيسية
        </Link>
        {" / "}
        <Link href="/explore" className="hover:text-primary">
          استكشف
        </Link>
        {" / "}
        <span>{course.title}</span>
      </nav>

      <div className="flex items-center gap-3 mb-6">
        <Badge variant="secondary" className="md:text-lg px-4 py-2">
          {course.country}
        </Badge>
        <Badge variant="outline" className="md:text-lg px-4 py-2">
          {course.level}
        </Badge>
        <Badge variant="outline" className="md:text-lg px-4 py-2">
          {course.subject}
        </Badge>
      </div>

      <h1 className="md:text-5xl text-3xl font-bold mb-6 text-balance leading-tight">
        {course.title}
      </h1>
      <p className="md:text-2xl text-muted-foreground mb-8 text-pretty leading-relaxed">
        {course.description}
      </p>

      <div className="flex flex-wrap items-center gap-8 md:text-lg">
        <div className="flex items-center">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 ml-2" />
          <span className="font-medium">{course.rating}</span>
          <span className="text-muted-foreground mr-2">
            ({course.totalStudents} طالب)
          </span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-5 w-5 ml-2" />
          {course.duration}
        </div>
        <div className="flex items-center text-muted-foreground">
          <BookOpen className="h-5 w-5 ml-2" />
          {course.lessons} درس
        </div>
        <div className="flex items-center text-muted-foreground">
          <Calendar className="h-5 w-5 ml-2" />
          محدث {course.lastUpdated}
        </div>
      </div>
    </div>
  );
}