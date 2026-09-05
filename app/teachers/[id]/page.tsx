"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Users,
  GraduationCap,
  Award,
  MapPin,
  Calendar,
  Globe,
  Mail,
  Phone,
  Play,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getTeacherById } from "@/api/teacher";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";

export default function TeacherProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = useAuth();
  const { data, isPending } = useQuery({
    queryKey: ["teacher", params.id],
    queryFn: () => getTeacherById(Number(params.id)),
    enabled: !!user,
  });

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="bg-gray-200 rounded-lg h-64 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">المعلم غير موجود</h1>
          <p className="text-muted-foreground">
            لم يتم العثور على المعلم المطلوب
          </p>
        </div>
      </div>
    );
  }

  // Map API data to UI structure
  const teacher = {
    id: data.id,
    name: data.fullName,
    title: data.subjects?.[0]?.titleAr
      ? `مدرس ${data.subjects[0].titleAr}`
      : "معلم",
    university: data.graduatedFrom,
    country: "🇪🇬 مصر",
    subjects: data.subjects?.map((subject: any) => subject.titleAr) || [],
    experience: "خبرة في التدريس",
    rating: data.avgRate || 0,
    totalStudents: 0, // Not provided in API
    totalCourses: data.courses?.length || 0,
    totalReviews: 0, // Not provided in API
    bio: data.about,
    education: data.graduatedFrom ? [`تخرج من ${data.graduatedFrom}`] : [],
    achievements: [], // Not provided in API
    languages: ["العربية (لغة أم)"],
    joinedDate: data.createdAt || "2020-01-15",
    specializations:
      data.subjects?.map((subject: any) => subject.titleAr) || [],
    courses:
      data.courses?.map((course: any) => ({
        id: course.id,
        title: course.titleAr || course.title,
        subject: data.subjects?.[0]?.titleAr || "مادة دراسية",
        grade: data.classes?.[0]?.nameAr || "جميع المراحل",
        students: 0, // Not provided in API
        rating: course.avgRate || 0,
        duration: "مدة الدورة",
        price: course.price,
        thumbnail: course.imageUrl || "/placeholder.svg",
      })) || [],
    profileUrl: data.profileUrl,
    phoneNumber: data.phoneNumber,
    status: data.status,
    classes: data.classes || [],
  };
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <nav className="text-lg text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">
          الرئيسية
        </Link>
        {" / "}
        <Link href="/teachers" className="hover:text-primary">
          المعلمون
        </Link>
        {" / "}
        <span>{teacher.name}</span>
      </nav>

      <Card className="mb-12 animate-slide-up shadow-xl border-0">
        <CardContent className="p-10">
          <div className="grid md:grid-cols-3 gap-10 items-start">
            <div className="md:col-span-2">
              <div className="flex items-start gap-8">
                <Avatar className="h-32 w-32 flex-shrink-0 shadow-xl">
                  <AvatarImage
                    src={
                      teacher.profileUrl ||
                      `/ceholder-svg-key-prof.jpg?key=prof${teacher.id}&height=128&width=128&query=${teacher.name}+professor`
                    }
                  />
                  <AvatarFallback className="text-3xl">
                    {teacher.name
                      .split(" ")
                      .map((n: any) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {teacher.country}
                    </Badge>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      معلم معتمد
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-bold mb-3">{teacher.name}</h1>
                  <p className="text-2xl text-primary mb-3">{teacher.title}</p>
                  <div className="flex items-center text-xl text-muted-foreground mb-6">
                    <MapPin className="h-5 w-5 ml-2" />
                    {teacher.university}
                  </div>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {teacher.subjects.map((subject: any) => (
                      <Badge
                        key={subject}
                        variant="outline"
                        className="text-lg px-3 py-1"
                      >
                        {subject}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-xl">
                    {teacher.bio}
                  </p>
                </div>
              </div>
            </div>

            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {teacher.rating > 0 && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400 ml-2" />
                        <span className="text-3xl font-bold">
                          {teacher.rating}
                        </span>
                      </div>
                      <div className="text-lg text-muted-foreground">
                        بناءً على {teacher.totalReviews} تقييم
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {teacher.totalCourses}
                      </div>
                      <div className="text-base text-muted-foreground">
                        دورة متاحة
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xl font-semibold text-primary">
                      {teacher.status === "active" ? "نشط" : "غير نشط"}
                    </div>
                    <div className="text-base text-muted-foreground">
                      حالة المعلم
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-lg text-muted-foreground">
                    <Calendar className="h-5 w-5 ml-2" />
                    انضم في{" "}
                    {new Date(teacher.joinedDate).toLocaleDateString("ar-EG")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="courses" className="animate-slide-up">
        <TabsList className="grid w-full grid-cols-2 h-16 text-lg">
          <TabsTrigger value="courses">
            الدورات ({teacher.courses.length})
          </TabsTrigger>
          <TabsTrigger value="about">نبذة عنه</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teacher.courses.map((course: any, index: number) => (
              <Card
                key={course.id}
                className="hover-lift animate-scale-in shadow-xl border-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    width={400}
                    height={200}
                  />
                </div>

                <CardHeader className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {course.grade}
                    </Badge>
                    <div className="flex items-center text-lg text-muted-foreground">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 ml-2" />
                      {course.rating}
                    </div>
                  </div>
                  <CardTitle className="text-2xl leading-tight">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {course.subject}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* <div className="flex items-center justify-between text-lg">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-5 w-5 ml-2" />
                        {course.students} طالب
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-5 w-5 ml-2" />
                        {course.duration}
                      </div>
                    </div> */}

                    <div className="flex items-center justify-between pt-3">
                      <span className="flex flex-row-reverse gap-1 text-3xl font-bold text-primary">
                        {course.price}
                        <span className="text-base">جنيه</span>
                      </span>
                      <Button
                        size="sm"
                        className="hover-lift text-lg px-6 py-3 shadow-lg"
                        asChild
                      >
                        <Link href={`/course/${course.id}`}>عرض الدورة</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="about" className="mt-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-xl border-0">
              <CardHeader className="p-8">
                <CardTitle className="text-3xl">التعليم</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {teacher.education.length > 0 ? (
                  <ul className="space-y-4">
                    {teacher.education.map((edu, index) => (
                      <li key={index} className="flex items-start">
                        <GraduationCap className="h-6 w-6 text-primary ml-4 mt-1 flex-shrink-0" />
                        <span className="text-lg">{edu}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-lg">
                    لا توجد معلومات تعليمية متاحة
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0">
              <CardHeader className="p-8">
                <CardTitle className="text-3xl">التخصصات</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {teacher.specializations.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {teacher.specializations.map((spec: any) => (
                      <Badge
                        key={spec}
                        variant="secondary"
                        className="text-lg px-4 py-2"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-lg">
                    لا توجد تخصصات محددة
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0">
              <CardHeader className="p-8">
                <CardTitle className="text-3xl">الصفوف الدراسية</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {teacher.classes.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {teacher.classes.map((classItem: any) => (
                      <Badge
                        key={classItem.id}
                        variant="outline"
                        className="text-lg px-4 py-2"
                      >
                        {classItem.nameAr}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-lg">
                    لا توجد صفوف دراسية محددة
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0">
              <CardHeader className="p-8">
                <CardTitle className="text-3xl">اللغات</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <ul className="space-y-3">
                  {teacher.languages.map((language, index) => (
                    <li key={index} className="flex items-center">
                      <Globe className="h-5 w-5 text-primary ml-3" />
                      <span className="text-lg">{language}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
