"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden gradient-hero py-28 lg:py-36">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <div className="animate-slide-up">
              <Badge
                variant="secondary"
                className="mb-8 bg-white/25 text-white border-white/40 hover:bg-white/35 text-lg px-6 py-2"
              >
                مرحباً بك في منصة GPA
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white text-balance leading-tight">
                أتقن رحلتك
                <br />
                <span className="text-white/90 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  التعليمية
                </span>
              </h1>
              <p className="text-xl md:text-3xl text-white/85 text-pretty max-w-4xl mx-auto mt-8 leading-relaxed">
                نمكن الطلاب في مصر والمملكة العربية السعودية والإمارات من خلال
                دورات منهجية عالمية المستوى
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-scale-in pt-6">
              <Button
                onClick={() => {
                  if (user) {
                    router.push("/explore");
                  } else {
                    router.push("/auth");
                  }
                }}
                size="lg"
                variant="secondary"
                className="hover-lift text-xl px-10 py-6 h-auto shadow-2xl"
              >
                ابدأ التعلم الآن
                <ArrowLeft className="mr-3 h-6 w-6" />
              </Button>
              {/* <Button
                variant="outline"
                size="lg"
                className="hover-lift bg-transparent border-white/40 text-white hover:bg-white/15 text-xl px-10 py-6 h-auto"
              >
                عرض جميع المواد
              </Button> */}
            </div>

            <div className="grid grid-cols-3 gap-10 pt-16 animate-slide-up">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white">
                  +80
                </div>
                <div className="text-lg text-white/75 mt-2">دورة تعليمية</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white">
                  +15
                </div>
                <div className="text-lg text-white/75 mt-2">معلم خبير</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white">
                  +1K
                </div>
                <div className="text-lg text-white/75 mt-2">طالب</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              استكشف المواد الدراسية
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-xl leading-relaxed">
              اختر من مجموعتنا الشاملة من المواد المصممة للمناهج الإقليمية
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              {
                name: "الرياضيات",
                icon: "📊",
                courses: 13,
                color: "bg-blue-100 text-blue-600",
              },
              {
                name: "الفيزياء",
                icon: "⚛️",
                courses: 8,
                color: "bg-purple-100 text-purple-600",
              },
              {
                name: "الكيمياء",
                icon: "🧪",
                courses: 15,
                color: "bg-green-100 text-green-600",
              },
              {
                name: "الأحياء",
                icon: "🧬",
                courses: 11,
                color: "bg-orange-100 text-orange-600",
              },
              {
                name: "اللغة العربية",
                icon: "📚",
                courses: 18,
                color: "bg-red-100 text-red-600",
              },
              {
                name: "اللغة الإنجليزية",
                icon: "🌍",
                courses: 11,
                color: "bg-indigo-100 text-indigo-600",
              },
            ].map((subject, index) => (
              <Card
                key={subject.name}
                className="card-hover cursor-pointer text-center border-0 shadow-lg animate-scale-in bg-white/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div
                    className={`w-20 h-20 rounded-3xl ${subject.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <span className="text-3xl">{subject.icon}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {subject.courses} دورة
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
{/* 
          <div className="text-center mt-16">
            <Button
              variant="outline"
              className="hover-lift bg-transparent text-lg px-8 py-4"
              asChild
            >
              <Link href="/subjects">
                عرض جميع المواد
                <ArrowLeft className="mr-3 h-5 w-5" />
              </Link>
            </Button>
          </div> */}
        </div>
      </section>

      {/* <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">الدورات المميزة</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-xl leading-relaxed">
              دورات مختارة بعناية من أفضل المدرسين لدينا
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "حساب التفاضل والتكامل المتقدم",
                subject: "الرياضيات",
                grade: "الصف الثاني عشر",
                country: "مصر",
                teacher: "د. أحمد حسن",
                rating: 4.9,
                students: 1250,
                duration: "24 ساعة",
                price: "99$",
                originalPrice: "149$",
                image: "/calculus-math-education.jpg",
              },
              {
                title: "الميكانيكا وفيزياء الحركة",
                subject: "الفيزياء",
                grade: "الصف الحادي عشر",
                country: "السعودية",
                teacher: "أ. سارة الراشد",
                rating: 4.8,
                students: 890,
                duration: "18 ساعة",
                price: "79$",
                originalPrice: "119$",
                image: "/physics-quantum-atoms.jpg",
              },
              {
                title: "أساسيات الكيمياء العضوية",
                subject: "الكيمياء",
                grade: "الصف الثاني عشر",
                country: "الإمارات",
                teacher: "د. عمر المنصوري",
                rating: 4.9,
                students: 1100,
                duration: "20 ساعة",
                price: "89$",
                originalPrice: "129$",
                image: "/organic-molecules.png",
              },
            ].map((course, index) => (
              <Card
                key={course.title}
                className="card-hover overflow-hidden border-0 shadow-xl animate-slide-up bg-white/95 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-6 right-6">
                    <Badge variant="secondary" className="bg-white/95 text-foreground shadow-lg">
                      {course.country}
                    </Badge>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <Button size="sm" variant="secondary" className="rounded-full bg-white/95 hover:bg-white shadow-lg">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-sm">
                      {course.subject} • {course.grade}
                    </Badge>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-1" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight">{course.title}</CardTitle>
                  <CardDescription className="text-sm">بواسطة {course.teacher}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 ml-1" />
                        {course.students.toLocaleString()} طالب
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 ml-1" />
                        {course.duration}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-primary">{course.price}</span>
                        <span className="text-sm text-muted-foreground line-through">{course.originalPrice}</span>
                      </div>
                      <Button className="hover-lift shadow-lg">احصل على الدورة</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button variant="outline" size="lg" className="hover-lift bg-transparent text-lg px-8 py-4" asChild>
              <Link href="/explore">
                عرض الكل
                <ArrowLeft className="mr-3 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">تعرف على معلمينا الخبراء</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-xl leading-relaxed">
              تعلم من معلمين ذوي خبرة من أفضل الجامعات في المنطقة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                name: "د. أحمد حسن",
                subject: "الرياضيات",
                university: "جامعة القاهرة",
                experience: "15 سنة",
                courses: 25,
                rating: 4.9,
                students: 5200,
                initials: "أح",
              },
              {
                name: "أ. سارة الراشد",
                subject: "الفيزياء",
                university: "جامعة الملك سعود",
                experience: "12 سنة",
                courses: 18,
                rating: 4.8,
                students: 3800,
                initials: "سر",
              },
              {
                name: "د. فاطمة الزهراء",
                subject: "الكيمياء",
                university: "جامعة الإمارات",
                experience: "10 سنوات",
                courses: 22,
                rating: 4.9,
                students: 4100,
                initials: "فز",
              },
              {
                name: "د. منى خليل",
                subject: "الأحياء",
                university: "الجامعة الأمريكية بالقاهرة",
                experience: "8 سنوات",
                courses: 16,
                rating: 4.7,
                students: 2900,
                initials: "مخ",
              },
            ].map((teacher, index) => (
              <Card
                key={teacher.name}
                className="card-hover text-center border-0 shadow-xl animate-scale-in bg-white/95 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-10">
                  <div className="relative mb-8">
                    <Avatar className="h-24 w-24 mx-auto border-4 border-white shadow-2xl">
                      <AvatarImage
                        src={`/abstract-geometric-shapes.png?height=96&width=96&query=${teacher.name}+teacher`}
                      />
                      <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                        {teacher.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1 shadow-lg">
                        {teacher.subject}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{teacher.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{teacher.university}</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">الخبرة</span>
                      <span className="font-medium">{teacher.experience}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">الدورات</span>
                      <span className="font-medium">{teacher.courses}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">الطلاب</span>
                      <span className="font-medium">{teacher.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-center pt-3">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-1" />
                      <span className="font-medium">{teacher.rating}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-6 hover-lift bg-transparent">
                    عرض الملف الشخصي
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button variant="outline" className="hover-lift bg-transparent text-lg px-8 py-4" asChild>
              <Link href="/teachers">
                عرض جميع المعلمين
                <ArrowLeft className="mr-3 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section> */}

      {!user && (
         <section className="relative overflow-hidden gradient-hero py-28">
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="container mx-auto px-6 text-center relative">
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="animate-float">
                <GraduationCap className="h-20 w-20 text-white/90 mx-auto mb-8" />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white text-balance leading-tight">
                هل أنت مستعد لبدء رحلتك التعليمية؟
              </h2>
              <p className="text-2xl text-white/85 max-w-3xl mx-auto leading-relaxed">
                انضم إلى آلاف الطلاب الذين حولوا أداءهم الأكاديمي مع منصة GPA
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                <Button
                  onClick={() => {
                    router.push("/auth");
                  }}
                  size="lg"
                  variant="secondary"
                  className="hover-lift text-xl px-10 py-6 h-auto shadow-2xl"
                >
                  ابدأ الان
                  <ArrowLeft className="mr-3 h-6 w-6" />
                </Button>
                {/* <Button
                size="lg"
                variant="outline"
                className="hover-lift border-white/40 text-white hover:bg-white/15 bg-transparent text-xl px-10 py-6 h-auto"
              >
                تصفح جميع الدورات
              </Button> */}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
