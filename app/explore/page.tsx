"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Users, Clock, Star, Play } from "lucide-react";
import Link from "next/link";
import { getCourses } from "@/api/courses";
import { useQuery } from "@tanstack/react-query";
import { useUserProfile } from "@/hooks/use-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { classId } = useUserProfile();
  const {
    data: apiCourses,
    isPending,
    error,
  } = useQuery({
    queryKey: ["courses", classId],
    queryFn: () => getCourses(undefined, classId), // Remove search parameter to fetch all courses
  });

  const displayCourses = apiCourses;

  // Filter courses based on search and filters
  const filteredCourses = displayCourses?.filter((course) => {
    const matchesSearch =
      !searchQuery ||
      (course.titleAr &&
        course.titleAr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.title &&
        course.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.subject?.titleAr &&
        course.subject.titleAr
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (course.subject &&
        typeof course.subject === "string" &&
        course.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.teacher?.fullNameAr &&
        course.teacher.fullNameAr
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (course.teacher?.fullName &&
        course.teacher.fullName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (course.teacher &&
        typeof course.teacher === "string" &&
        course.teacher.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCountry =
      selectedCountry === "all" ||
      (course.country &&
        course.country.toLowerCase().includes(selectedCountry));

    const matchesSubject =
      selectedSubject === "all" ||
      (course.subject?.titleAr &&
        course.subject.titleAr.toLowerCase().includes(selectedSubject)) ||
      (course.subject &&
        typeof course.subject === "string" &&
        course.subject.toLowerCase().includes(selectedSubject));

    return matchesSearch && matchesCountry && matchesSubject;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses?.length || 1 / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCourses = filteredCourses?.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCountry, selectedGrade, selectedSubject]);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">استكشف الدورات</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto md:text-xl leading-relaxed">
          اكتشف دورات شاملة مصممة خصيصاً لمناهج مصر والمملكة العربية السعودية
          والإمارات العربية المتحدة. ابحث واعثر على الدورة المثالية للتفوق في
          دراستك.
        </p>
      </div>

      <Card className="mb-10 animate-scale-in shadow-xl border-0">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute right-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="ابحث عن الدورات أو المواد أو المعلمين..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-14 text-lg"
              />
            </div>
            {/* 
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="جميع الدول" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الدول</SelectItem>
                  <SelectItem value="egypt">🇪🇬 مصر</SelectItem>
                  <SelectItem value="saudi">🇸🇦 السعودية</SelectItem>
                  <SelectItem value="uae">🇦🇪 الإمارات</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="جميع الصفوف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الصفوف</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={`grade-${i + 1}`}>
                      الصف {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="جميع المواد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المواد</SelectItem>
                  <SelectItem value="mathematics">الرياضيات</SelectItem>
                  <SelectItem value="physics">الفيزياء</SelectItem>
                  <SelectItem value="chemistry">الكيمياء</SelectItem>
                  <SelectItem value="biology">الأحياء</SelectItem>
                  <SelectItem value="arabic">اللغة العربية</SelectItem>
                  <SelectItem value="english">اللغة الإنجليزية</SelectItem>
                  <SelectItem value="history">التاريخ</SelectItem>
                  <SelectItem value="geography">الجغرافيا</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="hover-lift bg-transparent h-12 text-lg"
              >
                <Filter className="h-5 w-5 ml-2" />
                المزيد من الفلاتر
              </Button>
            </div> */}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="md:text-3xl text-xl font-semibold">الدورات المتاحة</h2>
          <p className="text-muted-foreground md:text-lg">
            {isPending
              ? "جاري البحث..."
              : searchQuery
              ? `تم العثور على ${filteredCourses?.length} دورة`
              : `جميع الدورات (${filteredCourses?.length})`}
          </p>
        </div>
        {/* <Select defaultValue="popular">
          <SelectTrigger className="w-48 h-12 text-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">الأكثر شعبية</SelectItem>
            <SelectItem value="rating">الأعلى تقييماً</SelectItem>
            <SelectItem value="newest">الأحدث</SelectItem>
            <SelectItem value="price-low">السعر: من الأقل للأعلى</SelectItem>
            <SelectItem value="price-high">السعر: من الأعلى للأقل</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      {isPending ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-2xl font-semibold mb-2">جاري البحث...</h3>
          <p className="text-muted-foreground text-lg">يرجى الانتظار</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-semibold mb-2">حدث خطأ</h3>
          <p className="text-muted-foreground text-lg">
            تعذر تحميل الدورات. يرجى المحاولة مرة أخرى.
          </p>
        </div>
      ) : filteredCourses?.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold mb-2">لا توجد نتائج</h3>
          <p className="text-muted-foreground text-lg">
            لم يتم العثور على دورات تطابق معايير البحث الخاصة بك.
          </p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedCourses?.map((course, index) => (
              <Card
                key={course.id}
                className="hover-lift animate-scale-in shadow-xl border-0 bg-white/95 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={course.imageUrl || "/placeholder.svg"}
                    alt={course.titleAr}
                    className="w-full h-full object-cover"
                    width={400}
                    height={200}
                  />
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="shadow-sm">
                      {"مصر"}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-1" />
                      {course.avgRate?.toFixed(2) || "0.0"}
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight">
                    {course.titleAr}
                  </CardTitle>
                  <CardDescription className="text-base">
                    <Tooltip>
                      <TooltipTrigger>
                        {course.subjects?.[0].titleAr} •{" "}
                        {course.classes?.[0].nameAr}
                      </TooltipTrigger>
                      <TooltipContent>
                        {course.subjects
                          ?.map((subject: any) => subject.titleAr)
                          .join(", ")}{" "}
                        •{" "}
                        {course.classes
                          ?.map((cls: any) => cls.nameAr)
                          .join(", ")}
                      </TooltipContent>
                    </Tooltip>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center text-base">
                      <Avatar className="h-7 w-7 ml-3">
                        <AvatarImage
                          src={
                            course.teacher?.profileUrl ||
                            `/abstract-geometric-shapes.png?key=flk16&height=28&width=28&query=${
                              course.teacher?.fullNameAr ||
                              course.teacher?.fullName ||
                              course.teacher
                            }+teacher`
                          }
                          alt={
                            course.teacher?.fullNameAr ||
                            course.teacher?.fullName ||
                            course.teacher
                          }
                        />
                        <AvatarFallback className="text-sm">
                          {(
                            course.teacher?.fullNameAr ||
                            course.teacher?.fullName ||
                            course.teacher ||
                            ""
                          )
                            .split(" ")
                            .map((n: any) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {course.teacher?.fullNameAr ||
                        course.teacher?.fullName ||
                        course.teacher}
                    </div>

                    {/* <div className="flex items-center justify-between text-base">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 ml-1" />
                        {course.students || "0"} طالب
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 ml-1" />
                        {course.duration || "غير محدد"}
                      </div>
                    </div> */}

                    <div className="flex items-center justify-between pt-3">
                      <span className="text-2xl font-bold text-primary">
                        {course.price}
                        <span className="text-base mr-1">جنيه</span>
                      </span>

                      <Button
                        size="sm"
                        className="hover-lift shadow-lg"
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

          {/* Pagination Controls - Only show if more than 10 items */}
          {filteredCourses && filteredCourses?.length > itemsPerPage && (
            <div className="flex flex-col items-center gap-4 mt-16">
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="text-lg px-6 py-3 bg-transparent"
                >
                  السابق
                </Button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage) {
                      // Show ellipsis for gaps
                      if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span
                            key={page}
                            className="text-lg px-2 text-muted-foreground"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="text-lg px-4 py-3"
                      >
                        {page}
                      </Button>
                    );
                  }
                )}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="text-lg px-6 py-3 bg-transparent"
                >
                  التالي
                </Button>
              </div>

              {/* Quick page navigation for many pages */}
              {totalPages > 5 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>الانتقال إلى الصفحة:</span>
                  <Input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const page = parseInt(e.currentTarget.value);
                        if (page >= 1 && page <= totalPages) {
                          setCurrentPage(page);
                          e.currentTarget.blur();
                        }
                      }
                    }}
                    className="w-16 h-8 text-center"
                    placeholder={currentPage.toString()}
                  />
                  <span>من {totalPages}</span>
                </div>
              )}
            </div>
          )}

          {/* Results Info - Only show if there are results */}
          {filteredCourses && filteredCourses?.length > 0 && (
            <div className="text-center mt-8 text-muted-foreground">
              {filteredCourses.length > itemsPerPage ? (
                <>
                  عرض {startIndex + 1}-
                  {Math.min(endIndex, filteredCourses.length)} من{" "}
                  {filteredCourses.length} دورة
                </>
              ) : (
                <>عرض {filteredCourses.length} دورة</>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
