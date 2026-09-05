"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Award,
  Globe,
  Target,
  Heart,
  Lightbulb,
  Rocket,
  CheckCircle,
  Star,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function AboutPage() {
  const stats = [
    {
      label: "الطلاب المسجلين",
      value: "1000+",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "المعلمين الخبراء",
      value: "10+",
      icon: Award,
      color: "bg-green-500",
    },
    {
      label: "الدورات المتاحة",
      value: "20+",
      icon: BookOpen,
      color: "bg-purple-500",
    },
    {
      label: "البلدان المخدومة",
      value: "3",
      icon: Globe,
      color: "bg-orange-500",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "التميز في التعليم",
      description:
        "نسعى لتقديم أعلى جودة من المحتوى التعليمي الذي يلبي المعايير الدولية ويساعد الطلاب على تحقيق أهدافهم الأكاديمية.",
      color: "bg-blue-500",
    },
    {
      icon: Heart,
      title: "نهج يركز على الطالب",
      description:
        "كل قرار نتخذه يضع الطلاب في المقدمة. نصمم منصتنا ودوراتنا لتحقيق أقصى نتائج التعلم ورضا الطلاب.",
      color: "bg-red-500",
    },
    {
      icon: Lightbulb,
      title: "الابتكار والتكنولوجيا",
      description:
        "نستفيد من أحدث التقنيات لإنشاء تجارب تعليمية تفاعلية وجذابة تجعل التعليم متاحاً وممتعاً.",
      color: "bg-yellow-500",
    },
    {
      icon: Shield,
      title: "الثقة والموثوقية",
      description:
        "نبني الثقة من خلال الشفافية والجودة المستمرة والدعم الموثوق، مما يضمن للطلاب التركيز على التعلم بثقة.",
      color: "bg-green-500",
    },
  ];

  // const team = [
  //   {
  //     name: "د. سارة أحمد",
  //     role: "مديرة الشؤون الأكاديمية",
  //     image: "/student-avatar.png",
  //     bio: "أستاذة سابقة في جامعة كامبريدج مع أكثر من 15 عاماً في التكنولوجيا التعليمية.",
  //     expertise: ["الرياضيات", "تصميم المناهج", "التكنولوجيا التعليمية"],
  //   },
  //   {
  //     name: "أ.د. محمد حسن",
  //     role: "رئيس قسم العلوم",
  //     image: "/student-avatar.png",
  //     bio: "فيزيائي ومعلم مشهور، مؤلف أكثر من 50 ورقة بحثية منشورة.",
  //     expertise: ["الفيزياء", "البحث العلمي", "المنهج العلمي"],
  //   },
  //   {
  //     name: "د. فاطمة الزهراء",
  //     role: "رئيسة قسم الكيمياء",
  //     image: "/student-avatar.png",
  //     bio: "معلمة كيمياء حائزة على جوائز مع خبرة في الكيمياء العضوية والتحليلية.",
  //     expertise: ["الكيمياء", "علوم المختبر", "البحث العلمي"],
  //   },
  //   {
  //     name: "أحمد محمود",
  //     role: "أخصائي الأدب العربي",
  //     image: "/student-avatar.png",
  //     bio: "كاتب مشهور وأستاذ أدب، خبير في النصوص العربية الكلاسيكية والحديثة.",
  //     expertise: ["الأدب العربي", "الشعر", "الدراسات الثقافية"],
  //   },
  // ]

  // const milestones = [
  //   {
  //     year: "2020",
  //     title: "إطلاق المنصة",
  //     description: "تأسست منصة GPA بمهمة ثورة التعليم في الشرق الأوسط",
  //   },
  //   {
  //     year: "2021",
  //     title: "10,000 طالب",
  //     description: "وصلنا إلى أول معلم رئيسي وهو 10,000 طالب مسجل في مصر",
  //   },
  //   {
  //     year: "2022",
  //     title: "التوسع الإقليمي",
  //     description: "توسعنا إلى السعودية والإمارات، وجلبنا التعليم الجيد لمزيد من الطلاب",
  //   },
  //   {
  //     year: "2023",
  //     title: "دمج الذكاء الاصطناعي",
  //     description: "قدمنا مسارات التعلم الشخصية المدعومة بالذكاء الاصطناعي والتقييمات التكيفية",
  //   },
  //   {
  //     year: "2024",
  //     title: "أكثر من 50,000 طالب",
  //     description: "نحتفل بأكثر من 50,000 طالب و500+ معلم خبير على منصتنا",
  //   },
  // ]
  const router = useRouter();
  const {user}=useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-8 text-primary border-primary/20 bg-primary/20 text-lg px-6 py-2">
            عن GPA
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 text-balance leading-tight">
            مرحبًا بك في GPA –
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              رفيقك في التعلم
            </span>
          </h1>
          <p className="md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto text-pretty leading-relaxed">
            في GPA، نحن هنا لجعل الدراسة أسهل، أوضح، وأكثر متعة. سواء كنت تستعد
            لامتحان أو فقط تريد فهم موادك بشكل أفضل، GPA يوفر لك الأدوات والدعم
            اللي تحتاجه.
          </p>
          <div className="flex flex-col sm:flex-row md:gap-6 gap-4 justify-center">
            <Button
              size="lg"
              className="md:text-xl px-10 py-8 h-auto font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={() => {
                if (user) {
                  router.push("/explore");
                } else {
                  router.push("/auth");
                }
              }}
            >
              <Rocket className="w-6 h-6 ml-3" />
              ابدأ التعلم اليوم
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="md:text-xl px-10 py-8 h-auto font-bold bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={() => router.push("/teachers")}
            >
              <Users className="w-6 h-6 ml-3" />
              تعرف على معلمينا
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 text-center bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-3">
                    {stat.value}
                  </div>
                  <div className="text-lg text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="md:mb-8 mb-4 bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-200 text-lg px-6 py-2">
                ستجد في GPA ما يلي:
              </Badge>
              <h2 className="md:text-4xl text-2xl font-bold text-gray-900 mb-8 text-balance leading-tight">
                كل ما تحتاجه للنجاح الأكاديمي
              </h2>
              <p className="md:text-xl text-gray-600 mb-8 text-pretty leading-relaxed">
                نحن نؤمن أن التعلم يجب أن يتماشى مع حياتك — وليس العكس. لهذا تم
                تصميم GPA ليعمل على هاتفك، بدروس واضحة، ووصول سريع لموادك، ودعم
                متاح وقت ما تحتاجه.
              </p>
              <div className="space-y-6 ">
                {[
                  "الوصول إلى دورات مسجّلة يقدّمها مدرسون خبراء",
                  "متجر يحتوي على كتب يمكنك شراؤها",
                  "تتبع التقدّم الدراسي لتعرف مستواك دائمًا",
                  "ملفات تعريف المعلمين لمساعدتك في اختيار الدورة المناسبة",
                  "تطبيق سهل الاستخدام وبتصميم مريح",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="md:text-lg text-gray-700 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="/abstract-geometric-shapes.png"
                alt="الطلاب يتعلمون"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-white to-blue-50/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <Badge className="md:mb-8 mb-4 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-200 text-lg px-6 py-2">
              قيمنا
            </Badge>
            <h2 className="md:text-4xl text-2xl font-bold text-gray-900 mb-8 text-balance leading-tight">
              ما يدفعنا للأمام
            </h2>
            <p className="md:text-xl text-gray-600 max-w-4xl mx-auto text-pretty leading-relaxed">
              قيمنا الأساسية توجه كل ما نقوم به، من تطوير الدورات إلى دعم
              الطلاب، مما يضمن تقديم أفضل تجربة تعليمية ممكنة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group bg-gradient-to-br from-white to-gray-50/30"
              >
                <CardContent className="p-10">
                  <div
                    className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                  >
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {value.title}
                  </h3>
                  <p className="text-lg text-gray-600 text-pretty leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <Badge className="mb-8 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200 text-lg px-6 py-2">
              فريقنا
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-8 text-balance leading-tight">
              تعرف على معلمينا الخبراء
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto text-pretty leading-relaxed">
              يتكون فريقنا من معلمين وباحثين وخبراء صناعة عالميين متحمسين لمساعدة الطلاب على تحقيق أهدافهم الأكاديمية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member, index) => (
              <Card
                key={index}
                className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group bg-gradient-to-br from-white to-blue-50/30"
              >
                <CardContent className="p-8 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-6 group-hover:scale-105 transition-transform duration-500 ring-4 ring-primary/20 shadow-xl">
                    <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary to-blue-600 text-white">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-primary font-bold mb-4 text-lg">{member.role}</p>
                  <p className="text-base text-gray-600 mb-6 text-pretty leading-relaxed">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-sm font-medium">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* <section className="py-24 px-4 bg-gradient-to-br from-white to-gray-50/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-20">
            <Badge className="mb-8 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-200 text-lg px-6 py-2">
              رحلتنا
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-8 text-balance leading-tight">المعالم والإنجازات</h2>
            <p className="text-xl text-gray-600 text-pretty leading-relaxed">
              من شركة ناشئة صغيرة إلى منصة تعليمية رائدة، إليك كيف نمونا على مر السنين.
            </p>
          </div>

          <div className="relative">
            <div className="absolute right-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-blue-500 to-purple-600 rounded-full"></div>
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start gap-10">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-2xl ring-4 ring-primary/20">
                    {milestone.year}
                  </div>
                  <Card className="flex-1 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-white to-blue-50/30">
                    <CardContent className="p-8">
                      <h3 className="font-bold text-2xl text-gray-900 mb-4">{milestone.title}</h3>
                      <p className="text-lg text-gray-600 text-pretty leading-relaxed">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 shadow-3xl bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-16 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20"></div>
              <div className="relative z-10">
                <Star className="w-20 h-20 mx-auto mb-8 text-yellow-300 drop-shadow-lg" />
                <h2 className="md:text-4xl text-2xl font-bold mb-8 text-balance leading-tight">
                  مستعد لبدء رحلتك التعليمية؟
                </h2>
                <p className="md:text-2xl text-lg md:mb-8 mb-4 text-blue-100 max-w-3xl mx-auto text-pretty leading-relaxed">
                  دعنا ننمو ونتطور ونحقق النجاح — معًا.
                </p>
                <p className="md:text-xl md:mb-12 mb-8 text-blue-100 max-w-3xl mx-auto text-pretty leading-relaxed">
                  انضم إلى آلاف الطلاب الذين حولوا أداءهم الأكاديمي مع منصة GPA.
                  ابدأ بتجربة مجانية اليوم!
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  {/* <Button
                    size="lg"
                    variant="secondary"
                    className="text-xl px-10 py-8 h-auto font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <TrendingUp className="w-6 h-6 ml-3" />
                    ابدأ التجربة المجانية
                  </Button> */}
                  <Button
                    size="lg"
                    variant="outline"
                    className="md:text-xl px-10 py-8 h-auto font-bold border-white text-white hover:bg-white hover:text-primary bg-white/10 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
                    onClick={() => {
                      if (user) {
                        router.push("/explore");
                      } else {
                        router.push("/auth");
                      }
                    }}
                  >
                    <Rocket className="w-6 h-6 ml-3" />
                    ابدأ الآن
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
