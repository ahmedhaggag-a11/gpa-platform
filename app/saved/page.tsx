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
  Heart,
  Search,
  Star,
  BookOpen,
  Trash2,
  ShoppingCart,
  Grid3X3,
  List,
  Loader2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSavedCourses } from "@/api/user";
import { unsaveCourse } from "@/api/courses";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const { data, isPending } = useQuery({
    queryKey: ["saved"],
    queryFn: getSavedCourses,
  });
  const queryClient = useQueryClient();
  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: unsaveCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
      toast.success("تم إلغاء حفظ الدورة");
    },
    onError: (error: any) => {
      toast.error("حدث خطأ أثناء إلغاء حفظ الدورة");
      console.error("Unsave course error:", error);
    },
  });
  const router = useRouter();
  const filteredCourses = data?.filter(
    (item) =>
      item.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course.teacher?.fullName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.course.subject?.titleAr
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const sortedCourses = filteredCourses?.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.course.price - b.course.price;
      case "price-high":
        return b.course.price - a.course.price;
      case "rating":
        return (b.course.avgRate || 0) - (a.course.avgRate || 0);
      case "recent":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  const CourseCard = ({ item }: { item: any }) => {
    console.log(item);
    return (
      <Card className="p-0 group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
        <div className="relative">
          <img
            src={item.course.imageUrl || "/placeholder.svg"}
            alt={item.course.titleAr}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 end-4 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg"
              onClick={() => mutate(item.course.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5 text-red-500" />
              )}
            </Button>
          </div>
          {/* {item.course.originalPrice > item.course.price && (
          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-3 py-1">
            {Math.round(
              ((item.course.originalPrice - item.course.price) / item.course.originalPrice) *
                100
            )}
            % خصم
          </Badge>
        )} */}
        </div>

        <CardContent className="p-6 pt-0">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-sm font-medium">
              {item.course.subject?.titleAr}
            </Badge>
            {/* <Badge variant="outline" className="text-sm font-medium">
              {item.course.level}
            </Badge> */}
          </div>

          <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-relaxed">
            {item.course.titleAr}
          </h3>

          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={item.course.teacher?.profileUrl || "/placeholder.svg"}
                alt={item.course.teacher?.fullName}
              />
              <AvatarFallback className="text-sm">
                {item.course.teacher?.fullName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-base text-gray-700 font-medium">
              {item.course.teacher?.fullName}
            </span>
          </div>

          <p className="text-base text-gray-600 mb-5 line-clamp-2 leading-relaxed">
            {item.course.aboutAr}
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-5">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-base">
                {item.course.avgRate || "0.0"}
              </span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">
              {item.course.students.toLocaleString()}
            </span>
            </div> */}
            {/* <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{item.course.duration}</span>
            </div> */}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-primary">
                ${item.course.price}
              </span>
            </div>
            <Button className="flex items-center gap-2 h-11 px-6 font-semibold">
              الذهاب إلى الدورة
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  const CourseListItem = ({ item }: { item: (typeof data)[0] }) => (
    <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-blue-50/30">
      <CardContent className="p-6 pt-0">
        <div className="flex gap-6">
          <div className="relative flex-shrink-0">
            <img
              src={item.course.imageUrl || "/placeholder.svg"}
              alt={item.course.titleAr}
              className="md:w-32 md:h-24 w-24  object-cover rounded-lg"
            />
            {/* {item.course.originalPrice > item.course.price && (
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-3 py-1 text-xs">
                {Math.round(
                  ((item.course.originalPrice - item.course.price) /
                    item.course.originalPrice) *
                    100
                )}
                % خصم
              </Badge>
            )} */}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="md:text-sm text-xs font-medium">
                    {item.course.subject?.titleAr}
                  </Badge>
                  {/* <Badge variant="outline" className="text-sm font-medium">
                    {item.course.level}
                  </Badge> */}
                </div>
                <h3 className="font-bold md:text-xl text-sm mb-1 hover:text-primary transition-colors cursor-pointer leading-relaxed">
                  {item.course.titleAr}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="md:w-8 md:h-8 w-5 h-5">
                    <AvatarImage
                      src={
                        item.course.teacher?.profileUrl || "/placeholder.svg"
                      }
                      alt={item.course.teacher?.fullName}
                    />
                    <AvatarFallback className="text-sm">
                      {item.course.teacher?.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="md:text-base text-xs text-gray-700 font-medium">
                    {item.course.teacher?.fullName}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => mutate(item.id)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </Button>
            </div>

            <p className="md:text-base text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
              {item.course.aboutAr}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Star className="md:w-5 md:h-5 w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold md:text-base text-xs">
                    {item.course.avgRate || "0.0"}
                  </span>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">
                    {item.course.students.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">{item.course.duration}</span>
                </div> */}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="md:text-2xl text-xs font-bold text-primary">
                      ${item.course.price}
                    </span>
                    {/* {item.course.originalPrice > item.course.price && (
                      <span className="text-base text-gray-500 line-through">
                        ${item.course.originalPrice}
                      </span>
                    )} */}
                  </div>
                </div>
                <Button className="flex items-center gap-2 h-11 md:px-6 px-4 font-semibold">
                  الذهاب إلى الدورة
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  if (isPending) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Heart className="w-10 h-10 text-red-500 fill-red-500" />
            <h1 className="sm:text-5xl text-3xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 bg-clip-text text-transparent leading-relaxed">
              قائمة المحفوظات
            </h1>
          </div>
          <p className="sm:text-xl text-gray-600 font-medium">
            الدورات التي حفظتها لوقت لاحق • {sortedCourses?.length || 0} دورة
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-xl mb-8 bg-gradient-to-r from-white to-blue-50/30">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-6 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="البحث في الدورات أو المدرسين أو المواد..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 md:text-lg "
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-52 h-12 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">المضافة حديثاً</SelectItem>
                    <SelectItem value="price-low">
                      السعر: من الأقل للأعلى
                    </SelectItem>
                    <SelectItem value="price-high">
                      السعر: من الأعلى للأقل
                    </SelectItem>
                    <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-12 px-4"
                >
                  <Grid3X3 className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-12 px-4"
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Grid/List */}
        {!sortedCourses || sortedCourses.length === 0 ? (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/30">
            <CardContent className="p-16 text-center">
              <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="md:text-2xl text-lg font-bold text-gray-900 mb-3">
                لا توجد دورات
              </h3>
              <p className="md:text-xl text-gray-600 mb-8">
                {searchQuery
                  ? "جرب تعديل مصطلحات البحث"
                  : "ابدأ بإضافة دورات إلى قائمة الأمنيات"}
              </p>
              <Button
                className="h-12 px-8 nd:text-lg font-semibold"
                onClick={() => router.push("/explore")}
              >
                <BookOpen className="w-5 h-5 ml-2" />
                استكشف الدورات
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-8"
            }
          >
            {sortedCourses?.map((course) =>
              viewMode === "grid" ? (
                <CourseCard key={course.id} item={course} />
              ) : (
                <CourseListItem key={course.id} item={course} />
              )
            )}
          </div>
        )}

        {/* Quick Actions */}
        {/* {data && data.length > 0 && sortedCourses && sortedCourses.length > 0 && (
          <Card className="border-0 shadow-xl mt-8 bg-gradient-to-r from-white to-green-50/30">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
                <div>
                  <h3 className="font-bold text-2xl mb-2 text-gray-900">
                    مستعد لبدء التعلم؟
                  </h3>
                  <p className="text-xl text-gray-600">
                    اشترك في جميع دورات قائمة الأمنيات ووفر أكثر!
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="h-12 px-6 text-lg font-semibold bg-transparent"
                  >
                    <Trash2 className="w-5 h-5 ml-2" />
                    مسح القائمة
                  </Button>
                  <Button className="h-12 px-6 text-lg font-semibold">
                    <ShoppingCart className="w-5 h-5 ml-2" />
                    اشترك في الكل
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  );
}
