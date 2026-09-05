"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  CheckCircle,
  Users,
  Database,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  const privacyData = {
    title: "سياسة الخصوصية",
    actions: {
      ok: "حسنا"
    },
    content: {
      title: "في GPA، نحترم خصوصيتك ونتعامل مع بياناتك بجدية. إليك ما تحتاج معرفته:",
      list_one: {
        header: "ما البيانات التي نجمعها:",
        items: [
          "اسمك، بريدك الإلكتروني، رقم هاتفك، والصف الدراسي",
          "الدورات التي التحقت بها وتقدّمك فيها",
          "المدفوعات التي قمت بها (إن وُجدت)",
          "معلومات عن جهازك (لمساعدتنا في حماية حسابك)"
        ]
      },
      list_two: {
        header: "لماذا نجمعها:",
        items: [
          "لكي تتمكن من تسجيل الدخول واستخدام المنصة بأمان",
          "لمساعدة معلميك في متابعة تقدّمك",
          "لإرسال التحديثات الهامة إليك",
          "لمشاركة تقارير الأداء مع ولي أمرك (إذا لزم الأمر)"
        ]
      },
      list_three: {
        header: "نَعِدُك بأن:",
        items: [
          "لن نبيع أو نشارك معلوماتك الشخصية أبدًا",
          "يتم تخزين بياناتك بأمان وحماية تامة",
          "يمكنك دائمًا طلب حذف أو تحديث معلوماتك"
        ]
      },
      footer: "لو عندك أي استفسار، فقط تواصل معنا. نحن دائمًا هنا لمساعدتك."
    }
  };

  const termsData = {
    title: "الشروط والاحكام",
    actions: {
      ok: "حسنا"
    },
    content: {
      title: "باستخدامك لمنصة GPA، فأنت توافق على مجموعة من القواعد البسيطة التي تهدف إلى حماية تجربتك وضمان أمان المنصة.",
      list_one: {
        header: "استخدام الحساب:",
        items: [
          "حسابك مخصص لك فقط — لا تشاركه مع أي شخص.",
          "إذا حاولت تسجيل الدخول من جهاز آخر بدون إبلاغنا، قد يتم قفل الحساب تلقائيًا لأسباب أمنية.",
          "في حال تم قفل الحساب، فقط تواصل معنا وسنساعدك في حله."
        ]
      },
      list_two: {
        header: "الدورات والمواد:",
        items: [
          "جميع الفيديوهات والكتب الموجودة على GPA مملوكة للمنصة أو للمدرسين.",
          "يُمنع نسخ أو تسجيل أو مشاركة أي محتوى — هذا قد يؤدي إلى تعليق حسابك."
        ]
      },
      list_three: {
        header: "تقارير ولي الأمر والمدفوعات والسلوك:",
        items: [
          "قد يتم إرسال تقاريرك الدراسية لولي أمرك (مثل الدرجات والإنجازات).",
          "لا يتم استرجاع الأموال بعد شراء دورة أو كتاب، لكن يمكننا استبدال الكتب المعيبة.",
          "كن محترمًا في التعليقات والرسائل داخل المنصة — لا يُسمح بالتنمر أو الكراهية. الحسابات المخالفة يتم حظرها بدون إنذار."
        ]
      },
      footer: "GPA غير مسؤولة عن مستوى فهم الطالب أو نتائجه الأكاديمية طالما تم توفير المحتوى والدعم بشكل كامل. باتباعك لهذه القواعد، تساهم في جعل GPA بيئة آمنة وعادلة للجميع."
    }
  };

  const sectionIcons = {
    privacy: {
      list_one: Database,
      list_two: Eye,
      list_three: Shield
    },
    terms: {
      list_one: Users,
      list_two: FileText,
      list_three: Phone
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-8 text-primary border-primary/20 bg-primary/20 text-lg px-6 py-2">
            الخصوصية والشروط
          </Badge>
          <h1 className="md:text-5xl text-2xl font-bold text-gray-900 mb-8 text-balance leading-tight">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              سياسة الخصوصية
            </span>
            {" "}
            والشروط والأحكام
          </h1>
          <p className="text-2xl text-gray-600 mb-12 max-w-4xl mx-auto text-pretty leading-relaxed">
            نحن ملتزمون بحماية خصوصيتك وضمان تجربة آمنة وموثوقة على منصة GPA
          </p>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-8 bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-200 text-lg px-6 py-2">
              {privacyData.title}
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-8 text-balance leading-tight">
              حماية بياناتك أولويتنا
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto text-pretty leading-relaxed mb-12">
              {privacyData.content.title}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Data Collection */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-white to-blue-50/30">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {privacyData.content.list_one.header}
                </h3>
                <div className="space-y-4">
                  {privacyData.content.list_one.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Why We Collect */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-white to-purple-50/30">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {privacyData.content.list_two.header}
                </h3>
                <div className="space-y-4">
                  {privacyData.content.list_two.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Our Promise */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-white to-green-50/30">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {privacyData.content.list_three.header}
                </h3>
                <div className="space-y-4">
                  {privacyData.content.list_three.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-12 border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8 text-center">
              <p className="text-lg text-gray-700 leading-relaxed">
                {privacyData.content.footer}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Terms and Conditions Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-white to-gray-50/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-8 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-200 text-lg px-6 py-2">
              {termsData.title}
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-8 text-balance leading-tight">
              قواعد الاستخدام الآمن
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto text-pretty leading-relaxed mb-12">
              {termsData.content.title}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Account Usage */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-white to-orange-50/30">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {termsData.content.list_one.header}
                </h3>
                <div className="space-y-4">
                  {termsData.content.list_one.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Courses and Materials */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-white to-red-50/30">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {termsData.content.list_two.header}
                </h3>
                <div className="space-y-4">
                  {termsData.content.list_two.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reports, Payments, and Behavior */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-white to-indigo-50/30">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {termsData.content.list_three.header}
                </h3>
                <div className="space-y-4">
                  {termsData.content.list_three.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-12 border-0 shadow-xl bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-8 text-center">
              <p className="text-lg text-gray-700 leading-relaxed">
                {termsData.content.footer}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 shadow-3xl bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-16 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20"></div>
              <div className="relative z-10">
                <Lock className="w-20 h-20 mx-auto mb-8 text-blue-200 drop-shadow-lg" />
                <h2 className="text-5xl font-bold mb-8 text-balance leading-tight">
                  هل لديك أسئلة حول خصوصيتك؟
                </h2>
                <p className="text-2xl mb-12 text-blue-100 max-w-3xl mx-auto text-pretty leading-relaxed">
                  فريق الدعم لدينا جاهز للإجابة على جميع استفساراتك حول الخصوصية والأمان
                </p>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-xl px-10 py-8 h-auto font-bold border-white text-white hover:bg-white hover:text-primary bg-white/10 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
                  onClick={() => router.push("/contact")}
                >
                  تواصل معنا
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}