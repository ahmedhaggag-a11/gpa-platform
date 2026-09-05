"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, BookOpen, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterGrade, setFilterGrade] = useState("all")
  const [filterCountry, setFilterCountry] = useState("all")

  const subjects = [
    {
      id: "mathematics",
      name: "الرياضيات",
      description: "أتقن المفاهيم الرياضية من الجبر الأساسي إلى حساب التفاضل والتكامل المتقدم والإحصاء وما بعدها.",
      icon: "📊",
      totalCourses: 120,
      totalStudents: 8500,
      averageRating: 4.8,
      grades: ["الصف التاسع", "الصف العاشر", "الصف الحادي عشر", "الصف الثاني عشر"],
      countries: ["🇪🇬 مصر", "🇸🇦 السعودية", "🇦🇪 الإمارات"],
      topics: ["الجبر", "حساب التفاضل والتكامل", "الهندسة", "الإحصاء", "المثلثات"],
      color: "bg-blue-500",
      popularity: "high",
    },
    {
      id: "physics",
      name: "الفيزياء",
      description: "استكشف القوانين الأساسية للطبيعة، من الميكانيكا الكلاسيكية إلى فيزياء الكم.",
      icon: "⚛️",
      totalCourses: 85,
      totalStudents: 6200,
      averageRating: 4.7,
      grades: ["الصف العاشر", "الصف الحادي عشر", "الصف الثاني عشر"],
      countries: ["🇪🇬 مصر", "🇸🇦 السعودية", "🇦🇪 الإمارات"],
      topics: ["الميكانيكا", "الديناميكا الحرارية", "الكهرومغناطيسية", "البصريات", "الفيزياء الحديثة"],
      color: "bg-purple-500",
      popularity: "high",
    },
    {
      id: "chemistry",
      name: "الكيمياء",
      description: "فهم التفاعلات الكيميائية والتراكيب الجزيئية واللبنات الأساسية للمادة.",
      icon: "🧪",
      totalCourses: 75,
      totalStudents: 5800,
      averageRating: 4.6,
      grades: ["الصف العاشر", "الصف الحادي عشر", "الصف الثاني عشر"],
      countries: ["🇪🇬 مصر", "🇸🇦 السعودية", "🇦🇪 الإمارات"],
      topics: ["الكيمياء العضوية", "الكيمياء غير العضوية", "الكيمياء الفيزيائية", "الكيمياء الحيوية"],
      color: "bg-green-500",
      popularity: "high",
    },
    {
      id: "biology",
      name: "الأحياء",
      description: "اكتشف عجائب الحياة، من العمليات الخلوية إلى النظم البيئية المعقدة.",
      icon: "🧬",
      totalCourses: 90,
      totalStudents: 7100,
      averageRating: 4.7,
      grades: ["الصف التاسع", "الصف العاشر", "الصف الحادي عشر", "الصف الثاني عشر"],
      countries: ["🇪🇬 مصر", "🇸🇦 السعودية", "🇦🇪 الإمارات"],
      topics: ["بيولوجيا الخلية", "علم الوراثة", "علم البيئة", "الأحياء البشرية", "التطور"],
      color: "bg-emerald-500",
      popularity: "high",
    },
    {
      id: "arabic",
      name: "اللغة العربية والأدب",
      description: "أتقن مهارات اللغة العربية وتحليل الأدب والفهم الثقافي.",
      icon: "📚",
      totalCourses: 60,
      totalStudents: 4500,
      averageRating: 4.5,
      grades: ["الصف التاسع", "الصف العاشر", "الصف الحادي عشر", "الصف الثاني عشر"],
      countries: ["🇪🇬 مصر", "🇸🇦 السعودية", "🇦🇪 الإمارات"],
      topics: ["النحو", "الأدب", "الشعر", "البلاغة", "الإنشاء"],
      color: "bg-amber-500",
      popularity: "medium",
    },
    {
      id: "english",
      name: "اللغة الإنجليزية",
      description: "طور إتقان اللغة الإنجليزية في القراءة والكتابة والتحدث وتحليل الأدب.",
      icon: "🌍",
      totalCourses: 95,
      totalStudents: 6800,
      averageRating: 4.6,
      grades: ["الصف التاسع", "الصف العاشر", "الصف الحادي عشر", "الصف الثاني عشر"],
      countries: ["🇪🇬 مصر", "🇸🇦 السعودية", "🇦🇪 الإمارات"],
      topics: ["القواعد", "الأدب", "الكتابة", "التحدث", "المفردات"],
      color: "bg-indigo-500",
      popularity: "high",
    },
    {
      id: "history",
      name: "التاريخ",
      description: "رحلة عبر الزمن لفهم الحضارات والثقافات والأحداث التاريخية.",
      icon: "🏛️",
      totalCourses: 45,
      totalStudents: 3200,
      averageRating: 4.4,
      grades: ["الصف التاسع", "الصف العاشر", "الصف الحادي عشر", "الصف الثاني عشر"],
      countries: ["🇪🇬 مصر", "🇸🇦 السعودية", "🇦🇪 الإمارات"],
      topics: ["التاريخ القديم", "التاريخ الإسلامي", "التاريخ الحديث", "الحروب العالمية", "الحضارات"],
      color: "bg-orange-500",
      popularity: "medium",
    },
    {
      id: "geography",
      name: "الجغرافيا",
      description: "استكشف المعالم الطبيعية للأرض وأنماط المناخ والتفاعلات بين الإنسان والبيئة.",
      icon: "🌎",
      totalCourses: 40,
      totalStudents: 2800,
      averageRating: 4.3,
      grades: ["الصف التاسع", "الصف العاشر", "الصف الحادي عشر"],
      countries: ["🇪🇬 مصر", "🇸🇦 السعودية", "🇦🇪 الإمارات"],
      topics: ["الجغرافيا الطبيعية", "الجغرافيا البشرية", "المناخ", "الموارد الطبيعية", "الخرائط"],
      color: "bg-teal-500",
      popularity: "medium",
    },
  ]

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesGrade = filterGrade === "all" || subject.grades.includes(filterGrade)
    const matchesCountry =
      filterCountry === "all" ||
      subject.countries.some((country) => country.toLowerCase().includes(filterCountry.toLowerCase()))

    return matchesSearch && matchesGrade && matchesCountry
  })

  const totalCourses = subjects.reduce((acc, subject) => acc + subject.totalCourses, 0)
  const totalStudents = subjects.reduce((acc, subject) => acc + subject.totalStudents, 0)

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-16 animate-slide-up">
        <h1 className="text-5xl font-bold mb-6">استكشف المواد الدراسية</h1>
        <p className="text-muted-foreground text-2xl max-w-3xl mx-auto leading-relaxed">
          اكتشف دورات شاملة عبر مواد مختلفة مصممة لمستويات صفية ومناهج متنوعة.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <Card className="animate-scale-in hover-lift shadow-xl border-0">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">{subjects.length}</div>
            <div className="text-lg text-muted-foreground">مادة متاحة</div>
          </CardContent>
        </Card>
        <Card className="animate-scale-in hover-lift shadow-xl border-0" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">{totalCourses}</div>
            <div className="text-lg text-muted-foreground">إجمالي الدورات</div>
          </CardContent>
        </Card>
        <Card className="animate-scale-in hover-lift shadow-xl border-0" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">{totalStudents.toLocaleString()}</div>
            <div className="text-lg text-muted-foreground">طالب نشط</div>
          </CardContent>
        </Card>
        <Card className="animate-scale-in hover-lift shadow-xl border-0" style={{ animationDelay: "0.3s" }}>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">3</div>
            <div className="text-lg text-muted-foreground">دولة</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-12 animate-scale-in shadow-xl border-0">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="absolute right-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="ابحث في المواد أو المواضيع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-14 text-lg"
              />
            </div>

            <Select value={filterGrade} onValueChange={setFilterGrade}>
              <SelectTrigger className="h-14 text-lg">
                <SelectValue placeholder="جميع الصفوف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الصفوف</SelectItem>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={`الصف ${i + 1}`}>
                    الصف {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger className="h-14 text-lg">
                <SelectValue placeholder="جميع الدول" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الدول</SelectItem>
                <SelectItem value="egypt">🇪🇬 مصر</SelectItem>
                <SelectItem value="saudi">🇸🇦 السعودية</SelectItem>
                <SelectItem value="uae">🇦🇪 الإمارات</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-semibold">المواد المتاحة</h2>
          <p className="text-muted-foreground text-xl">تم العثور على {filteredSubjects.length} مادة</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSubjects.map((subject, index) => (
          <Card
            key={subject.id}
            className="hover-lift animate-scale-in shadow-xl border-0"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{subject.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{subject.name}</h3>
                <p className="text-lg text-muted-foreground text-pretty leading-relaxed">{subject.description}</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3 text-center text-lg">
                  <div>
                    <div className="font-semibold text-primary text-xl">{subject.totalCourses}</div>
                    <div className="text-muted-foreground">دورة</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary text-xl">{subject.totalStudents.toLocaleString()}</div>
                    <div className="text-muted-foreground">طالب</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary text-xl">{subject.averageRating}</div>
                    <div className="text-muted-foreground">تقييم</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-muted-foreground">الصفوف:</span>
                    <span className="font-medium">{subject.grades.length} مستوى</span>
                  </div>
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-muted-foreground">الدول:</span>
                    <span className="font-medium">{subject.countries.length} منطقة</span>
                  </div>
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-muted-foreground">الشعبية:</span>
                    <Badge
                      variant={subject.popularity === "high" ? "default" : "secondary"}
                      className="text-lg px-3 py-1"
                    >
                      {subject.popularity === "high" ? (
                        <>
                          <TrendingUp className="h-4 w-4 ml-2" />
                          عالية
                        </>
                      ) : (
                        "متوسطة"
                      )}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-lg font-medium">المواضيع الرئيسية:</div>
                  <div className="flex flex-wrap gap-2">
                    {subject.topics.slice(0, 3).map((topic) => (
                      <Badge key={topic} variant="outline" className="text-base px-3 py-1">
                        {topic}
                      </Badge>
                    ))}
                    {subject.topics.length > 3 && (
                      <Badge variant="outline" className="text-base px-3 py-1">
                        +{subject.topics.length - 3} أكثر
                      </Badge>
                    )}
                  </div>
                </div>

                <Button className="w-full hover-lift text-lg py-4 shadow-lg" asChild>
                  <Link href={`/subjects/${subject.id}`}>
                    استكشف {subject.name}
                    <ArrowLeft className="h-5 w-5 mr-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <Card className="text-center py-16 shadow-xl border-0">
          <CardContent>
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-3">لم يتم العثور على مواد</h3>
            <p className="text-muted-foreground mb-6 text-xl">حاول تعديل معايير البحث أو التصفية</p>
            <Button
              size="lg"
              className="text-lg px-8 py-4"
              onClick={() => {
                setSearchQuery("")
                setFilterGrade("all")
                setFilterCountry("all")
              }}
            >
              مسح الفلاتر
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
