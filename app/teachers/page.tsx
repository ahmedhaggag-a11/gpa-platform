"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Star,
  Users,
  BookOpen,
  GraduationCap,
  Award,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getTeachers } from "@/api/teacher";
import { useAuth } from "@/contexts/auth-context";

export default function TeachersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterGrade, setFilterGrade] = useState("my-grade");
  const [sortBy, setSortBy] = useState("rating");

  const { user } = useAuth();

  // Determine classId based on filter selection
  const getClassId = () => {
    if (filterGrade === "all") return undefined;
    if (filterGrade === "my-grade") return user?.user_metadata?.classId;
    return parseInt(filterGrade);
  };

  const { data: teachers = [], isPending } = useQuery({
    queryKey: ["teachers", filterGrade],
    queryFn: () => getTeachers(undefined, getClassId()),
    enabled: !!user,
  });

  const filteredTeachers = teachers
    .filter((teacher) => {
      const matchesSearch =
        teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subjects.some(
          (subject: any) =>
            subject.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subject.title.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        teacher.graduatedFrom.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject =
        filterSubject === "all" ||
        teacher.subjects.some(
          (subject: any) =>
            subject.titleAr
              .toLowerCase()
              .includes(filterSubject.toLowerCase()) ||
            subject.title.toLowerCase().includes(filterSubject.toLowerCase())
        );
      const matchesCountry =
        filterCountry === "all" ||
        teacher.graduatedFrom.includes(filterCountry);

      return matchesSearch && matchesSubject && matchesCountry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "courses":
          return b.coursesCount - a.coursesCount;
        case "name":
          return a.fullName.localeCompare(b.fullName, "ar");
        default:
          return 0;
      }
    });

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8 animate-fade-in min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-4">
            جاري تحميل المعلمين...
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-16 animate-slide-up">
        <h1 className="md:text-5xl text-3xl font-bold mb-6">
          تعرف على معلمينا الخبراء
        </h1>
        <p className="text-muted-foreground md:text-2xl  max-w-3xl mx-auto leading-relaxed">
          تعلم من معلمين مؤهلين بسنوات من الخبرة وسجل حافل مثبت في مجالاتهم
          المختلفة.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <Card className="animate-scale-in hover-lift shadow-xl border-0">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">
              {teachers.length}
            </div>
            <div className="text-lg text-muted-foreground">معلم خبير</div>
          </CardContent>
        </Card>
        <Card
          className="animate-scale-in hover-lift shadow-xl border-0"
          style={{ animationDelay: "0.1s" }}
        >
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">
              {teachers.reduce((acc, t) => acc + t.coursesCount, 0)}
            </div>
            <div className="text-lg text-muted-foreground">إجمالي الدورات</div>
          </CardContent>
        </Card>
        <Card
          className="animate-scale-in hover-lift shadow-xl border-0"
          style={{ animationDelay: "0.2s" }}
        >
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">
              {teachers.length > 0
                ? teachers.reduce((acc, t) => acc + t.classes.length, 0)
                : 0}
            </div>
            <div className="text-lg text-muted-foreground">إجمالي الصفوف</div>
          </CardContent>
        </Card>
        <Card
          className="animate-scale-in hover-lift shadow-xl border-0"
          style={{ animationDelay: "0.3s" }}
        >
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">
              {teachers.length > 0
                ? teachers.reduce((acc, t) => acc + t.subjects.length, 0)
                : 0}
            </div>
            <div className="text-lg text-muted-foreground">إجمالي المواد</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-12 animate-scale-in shadow-xl border-0">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="relative">
              <Search className="absolute right-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="ابحث عن المعلمين أو المواد أو الجامعات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-14 text-lg"
              />
            </div>

            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="h-14 text-lg">
                <SelectValue placeholder="جميع المواد" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المواد</SelectItem>
                {teachers &&
                  Array.from(
                    new Set(
                      teachers.flatMap((teacher: any) =>
                        teacher.subjects.map((subject: any) => subject.titleAr)
                      )
                    )
                  ).map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger className="h-14 text-lg">
                <SelectValue placeholder="جميع الجامعات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الجامعات</SelectItem>
                {teachers &&
                  Array.from(
                    new Set(
                      teachers
                        .map((teacher) => teacher.graduatedFrom)
                        .filter(Boolean)
                    )
                  ).map((university) => (
                    <SelectItem key={university} value={university}>
                      {university}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="md:text-3xl text-2xl font-semibold">معلمونا</h2>
          <p className="text-muted-foreground md:text-xl text-lg">
            تم العثور على {filteredTeachers.length} معلم
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTeachers.map((teacher, index) => (
          <Card
            key={teacher.id}
            className="hover-lift animate-scale-in shadow-xl border-0"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Avatar className="h-24 w-24 mx-auto mb-6 shadow-lg">
                  <AvatarImage
                    src={
                      teacher.profileUrl?.replace(/`/g, "") ||
                      "/placeholder.svg"
                    }
                  />
                  <AvatarFallback className="text-2xl">
                    {teacher.fullName
                      .split(" ")
                      .map((n: any) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-semibold mb-2">
                  {teacher.fullName}
                </h3>
                <p className="text-primary font-medium text-xl">معلم متخصص</p>
                <div className="flex items-center justify-center text-lg text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4 ml-2" />
                  {teacher.graduatedFrom}
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {teacher.status === "active" ? "نشط" : "غير نشط"}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {teacher.subjects.map((subject: any) => (
                    <Badge
                      key={subject.id}
                      variant="outline"
                      className="text-base px-3 py-1"
                    >
                      {subject.titleAr}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6 text-center text-lg">
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <BookOpen className="h-5 w-5 text-primary ml-2" />
                      <span className="font-medium">
                        {teacher.coursesCount}
                      </span>
                    </div>
                    <div className="text-muted-foreground">دورة</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-5 w-5 text-primary ml-2" />
                      <span className="font-medium">
                        {teacher.classes.length}
                      </span>
                    </div>
                    <div className="text-muted-foreground">صف</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 text-center text-lg">
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Phone className="h-5 w-5 text-primary ml-2" />
                      <span className="font-medium">{teacher.phoneNumber}</span>
                    </div>
                    <div className="text-muted-foreground">رقم الهاتف</div>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground text-center line-clamp-3 leading-relaxed">
                  {teacher.about}
                </p>

                <div className="flex gap-3 pt-3">
                  <Button
                    className="flex-1 hover-lift text-lg py-3 shadow-lg"
                    asChild
                  >
                    <Link href={`/teachers/${teacher.id}`}>
                      عرض الملف الشخصي
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover-lift bg-transparent p-3"
                  >
                    <Award className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <Card className="text-center py-16 shadow-xl border-0">
          <CardContent>
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-3">
              لم يتم العثور على معلمين
            </h3>
            <p className="text-muted-foreground mb-6 text-xl">
              حاول تعديل معايير البحث أو التصفية
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-4"
              onClick={() => {
                setSearchQuery("");
                setFilterSubject("all");
                setFilterCountry("all");
              }}
            >
              مسح الفلاتر
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
