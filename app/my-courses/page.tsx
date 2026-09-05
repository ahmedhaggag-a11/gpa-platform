"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Search,
  Calendar,
  Award,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/protected-route";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { getEnrolledCourses } from "@/api/user";

function MyCoursesContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const { user } = useAuth();
  const {
    data: enrolledCourses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", "enrolled-courses"],
    queryFn: getEnrolledCourses,
    enabled: !!user,
  });

  // Transform API data to match UI format
  const courses =
    enrolledCourses?.map((enrollment: any) => {
      const course = enrollment.course;
      return {
        id: course.id,
        title: course.titleAr || course.title,
        subject: course.subject?.titleAr || course.subject?.title || "غير محدد",
        grade: "غير محدد", // Not available in API data
        country: "مصر", // Default country
        teacher: course.teacher?.fullName || "غير محدد",
        avgRate: course.avgRate?.toFixed(1) || "0",
        // students: 0, // Not available in API data
        // duration: "غير محدد", // Not available in API data
        // progress: 0, // Default to 0 as no progress data available
        status:
          enrollment.status === "confirmed"
            ? "in-progress"
            : enrollment.status === "completed"
            ? "completed"
            : enrollment.status === "pending"
            ? "pending"
            : enrollment.status === "withdrawn"
            ? "withdrawn"
            : enrollment.status === "canceled"
            ? "canceled"
            : "pending",
        enrolledDate: enrollment.createdAt,
        lastAccessed: course.lessons?.find((l: nay) => l.isActive)?.id, // Not available in API data
        completedLessons: 0, // Not available in API data
        totalLessons: 0, // Not available in API data
        thumbnail: course.imageUrl || "/placeholder.svg",
        teacherAvatar: course.teacher?.profileUrl || "/placeholder-user.jpg",
        price: course.price,
        about: course.aboutAr || course.about,
        keywords: course.keywords || [],
      };
    }) || [];

  // Extract unique subjects from enrolled courses
  const subjects = courses.reduce((acc: string[], course) => {
    if (
      course.subject &&
      course.subject !== "غير محدد" &&
      !acc.includes(course.subject)
    ) {
      acc.push(course.subject);
    }
    return acc;
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesTab = activeTab === "all" || course.status === activeTab;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      filterSubject === "all" || course.subject === filterSubject;

    return matchesTab && matchesSearch && matchesSubject;
  });

  

  const stats = {
    total: courses.length,
    inProgress: courses.filter((c) => c.status === "in-progress").length,
    completed: courses.filter((c) => c.status === "completed").length,
    pending: courses.filter((c) => c.status === "pending").length,
    withdrawn: courses.filter((c) => c.status === "withdrawn").length,
    canceled: courses.filter((c) => c.status === "canceled").length,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center py-16">
          <div className="text-2xl font-semibold mb-3">
            جاري تحميل دوراتك...
          </div>
          <p className="text-muted-foreground text-xl">يرجى الانتظار</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center py-16">
          <div className="text-2xl font-semibold mb-3 text-red-500">
            حدث خطأ في تحميل الدورات
          </div>
          <p className="text-muted-foreground text-xl">
            يرجى المحاولة مرة أخرى
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-12 animate-slide-up">
        <h1 className="text-5xl font-bold mb-6">دوراتي</h1>
        <p className="text-muted-foreground text-2xl leading-relaxed">
          إدارة وتتبع الدورات المسجل بها
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="animate-scale-in hover-lift shadow-xl border-0">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
            <div className="text-lg text-muted-foreground">إجمالي الدورات</div>
          </CardContent>
        </Card>
        <Card
          className="animate-scale-in hover-lift shadow-xl border-0"
          style={{ animationDelay: "0.1s" }}
        >
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-500">
              {stats.inProgress}
            </div>
            <div className="text-lg text-muted-foreground">قيد التقدم</div>
          </CardContent>
        </Card>
        <Card
          className="animate-scale-in hover-lift shadow-xl border-0"
          style={{ animationDelay: "0.2s" }}
        >
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-500">
              {stats.completed}
            </div>
            <div className="text-lg text-muted-foreground">مكتملة</div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="animate-slide-up"
      >
        <TabsList className="grid w-full grid-cols-6 h-14 text-lg">
          <TabsTrigger value="all">الكل ({stats.total})</TabsTrigger>
          <TabsTrigger value="in-progress">
            قيد التقدم ({stats.inProgress})
          </TabsTrigger>
          <TabsTrigger value="completed">
            مكتملة ({stats.completed})
          </TabsTrigger>
          <TabsTrigger value="pending">
            في الانتظار ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="withdrawn">منسحب ({stats.withdrawn})</TabsTrigger>
          <TabsTrigger value="canceled">ملغية ({stats.canceled})</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          {/* Search and Filter */}
          <Card className="mb-8 shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1">
                  <Search className="absolute right-4 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="ابحث في الدورات أو المعلمين..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-12 h-14 text-lg"
                  />
                </div>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger className="w-full md:w-48 h-14 text-lg">
                    <SelectValue placeholder="تصفية حسب المادة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المواد</SelectItem>
                    {subjects.map((subject: string) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <Card
                key={course.id}
                className="hover-lift animate-scale-in shadow-xl border-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {/* <div className="absolute top-6 right-6">{getStatusBadge(course.status, course.progress)}</div> */}
                  {course.status === "completed" && (
                    <div className="absolute top-6 left-6">
                      <div className="bg-green-500 text-white p-3 rounded-full shadow-lg">
                        <Award className="h-5 w-5" />
                      </div>
                    </div>
                  )}
                </div>

                <CardHeader className="p-6 pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {course.country}
                    </Badge>
                    <div className="flex items-center text-lg text-muted-foreground">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 ml-2" />
                      {course.avgRate}
                    </div>
                  </div>
                  <CardTitle className="text-2xl leading-tight">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {course.subject}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0 -mt-5">
                  <div className="space-y-5">
                    <div className="flex items-center text-lg text-muted-foreground flex-row-reverse">
                      <Avatar className="h-8 w-8 ml-3">
                        <AvatarImage src={course.teacherAvatar} />
                        <AvatarFallback>
                          {course.teacher
                            .split(" ")
                            .map((n: any) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {course.teacher}
                    </div>

                    {/* {course.progress > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-lg">
                          <span>التقدم</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-3" />
                        <div className="text-base text-muted-foreground">
                          {course.completedLessons} من {course.totalLessons} درس
                        </div>
                      </div>
                    )} */}

                    {/* <div className="flex items-center justify-between text-lg text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 ml-2" />
                        {course.students} طالب
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 ml-2" />
                        {course.duration}
                      </div>
                    </div> */}

                    <div className="text-base text-muted-foreground">
                      <div className="flex items-center flex-row-reverse">
                        <Calendar className="h-4 w-4 ml-2" />
                        التسجيل:{" "}
                        {new Date(course.enrolledDate).toLocaleDateString(
                          "ar-EG"
                        )}
                      </div>
                      <div className="mt-2">
                        آخر وصول: {course.lastAccessed}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3">
                      {course.status === "completed" ? (
                        <Button
                          variant="outline"
                          className="flex-1 hover-lift bg-transparent text-lg py-3"
                          asChild
                        >
                          <Link href={`/course/${course.id}`}>
                            <CheckCircle className="h-5 w-5 ml-2" />
                            مراجعة
                          </Link>
                        </Button>
                      ) : course.status === "in-progress" ? (
                        <Button
                          className="flex-1 hover-lift text-lg py-3 shadow-lg"
                          asChild
                        >
                          <Link
                            href={`/course/${course.id}`}
                          >
                            <Play className="h-5 w-5 ml-2" />
                            متابعة
                          </Link>
                        </Button>
                      ) : course.status === "pending" ? (
                        <Button
                          variant="outline"
                          className="flex-1 hover-lift text-lg py-3"
                          disabled
                        >
                          في الانتظار
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="flex-1 hover-lift text-lg py-3"
                          disabled
                        >
                          غير متاح
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-lg px-4 py-3 bg-transparent"
                        asChild
                      >
                        <Link href={`/course/${course.id}`}>التفاصيل</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <Card className="text-center py-16 shadow-xl border-0">
              <CardContent>
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-3">
                  لم يتم العثور على دورات
                </h3>
                <p className="text-muted-foreground mb-6 text-xl">
                  {searchQuery || filterSubject !== "all"
                    ? "حاول تعديل معايير البحث أو التصفية"
                    : courses.length === 0
                    ? "لم تسجل في أي دورات بعد"
                    : "لا توجد دورات تطابق المعايير المحددة"}
                </p>
                <Button size="lg" className="text-lg px-8 py-4" asChild>
                  <Link href="/explore">استكشف الدورات</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </Tabs>
    </div>
  );
}

export default function MyCoursesPage() {
  return (
    <ProtectedRoute>
      <MyCoursesContent />
    </ProtectedRoute>
  );
}
