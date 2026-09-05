"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  ExternalLink,
  CheckCircle,
  Users,
  BookOpen,
  HelpCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    subject: "",
    message: "",
    inquiryType: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleContactClick = (method: any) => {
    if (method.icon === Mail) {
      window.open(`mailto:${method.contact}`, "_blank");
    } else if (method.icon === Phone) {
      window.open(`tel:${method.contact}`, "_blank");
    } else if (method.icon === MessageCircle) {
      // For WhatsApp, extract phone number and create WhatsApp link
      const phoneNumber = method.contact.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${phoneNumber}`, "_blank");
    }
  };

  const handleSocialClick = (social: any) => {
    window.open(social.url, "_blank");
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "الدعم عبر البريد الإلكتروني",
      description: "احصل على المساعدة عبر البريد الإلكتروني خلال 24 ساعة",
      contact: "support@gpaplatform.com",
      action: "إرسال بريد إلكتروني",
      color: "bg-blue-500",
    },
    {
      icon: MessageCircle,
      title: "واتساب",
      description: "دعم سريع عبر واتساب",
      contact: "+20 123 456 7890",
      action: "دردشة على واتساب",
      color: "bg-green-600",
    },
  ];

  const socialMediaData = {
    title: "وسائل التواصل الاجتماعي",
    facebook: "فيسبوك",
    instagram: "انستجرام",
    youtube: "يوتيوب",
    whatsapp: "واتساب",
  };

  const socialMedia = [
    {
      name: socialMediaData.facebook,
      icon: Facebook,
      handle: "@GPAPlatform",
      url: "https://www.facebook.com/share/1Ht9rRSBqK/?mibextid=wwXIfr",
      description: "تابعنا للحصول على التحديثات والمحتوى التعليمي",
      color: "bg-blue-600",
    },
    {
      name: socialMediaData.instagram,
      icon: Instagram,
      handle: "@gpa_platform",
      url: "https://www.instagram.com/gpa_platform?igsh=NW1zZWJzYXh5NzQ0",
      description: "نصائح يومية وقصص نجاح الطلاب",
      color: "bg-pink-500",
    },
    {
      name: socialMediaData.youtube,
      icon: Youtube,
      handle: "@GPAPlatform",
      url: "https://youtube.com/@gpaplatform?si=YlkvX6qUcnDqIV5Y",
      description: "فيديوهات تعليمية ومحاضرات مجانية",
      color: "bg-red-600",
    },
  ];

  // const offices = [
  //   {
  //     country: "مصر",
  //     city: "القاهرة",
  //     address: "123 ميدان التحرير، وسط القاهرة، مصر",
  //     phone: "+20 2 1234 5678",
  //     hours: "الأحد - الخميس: 9:00 ص - 6:00 م",
  //   },
  //   {
  //     country: "السعودية",
  //     city: "الرياض",
  //     address: "456 طريق الملك فهد، الرياض، السعودية",
  //     phone: "+966 11 234 5678",
  //     hours: "الأحد - الخميس: 9:00 ص - 6:00 م",
  //   },
  //   {
  //     country: "الإمارات",
  //     city: "دبي",
  //     address: "789 شارع الشيخ زايد، دبي، الإمارات",
  //     phone: "+971 4 234 5678",
  //     hours: "الأحد - الخميس: 9:00 ص - 6:00 م",
  //   },
  // ]

  const helpData = {
    title: "مركز المساعدة",
    content: {
      title:
        "عندك سؤال؟ غالبًا غيرك سأل نفس السؤال! إليك إجابات سريعة لأكثر الأسئلة شيوعًا بين الطلاب:",
      list_one: {
        header: "أسئلة حول الدورات:",
        items: [
          {
            question: "كيف أنضم إلى دورة؟",
            answer:
              "اضغط على 'الدورات' → اختر الدورة → اضغط 'اشترك الآن'. تأكد من إتمام الدفع أولاً.",
          },
          {
            question: "أين أجد الدورات التي اشتركت فيها؟",
            answer:
              "اذهب إلى قسم 'دوراتي' — ستجد كل الدورات التي اشتركت بها هناك.",
          },
          {
            question: "كيف أعرف تقدمي في الدورة؟",
            answer: "كل دورة تعرض عدد الفيديوهات أو الدروس التي أكملتها.",
          },
        ],
      },
      // list_two: {
      //   header: "المكتبة:",
      //   items: [
      //     {
      //       question: "كيف أشتري كتاب أو ملزمة؟",
      //       answer: "افتح تبويب 'المتجر'، اختر ما تريد، واتبع خطوات الدفع."
      //     },
      //     {
      //       question: "أين أجد ما اشتريته؟",
      //       answer: "اذهب إلى 'الملف الشخصي' → 'سجل المشتريات'."
      //     }
      //   ]
      // },
      list_three: {
        header: "الحساب والدعم:",
        items: [
          {
            question: "نسيت كلمة المرور. ماذا أفعل؟",
            answer:
              "في شاشة تسجيل الدخول، اضغط على 'نسيت كلمة المرور' واتبع الخطوات.",
          },
          {
            question: "تم قفل حسابي. ما الحل؟",
            answer: "تواصل معنا وسنساعدك في حل المشكلة بأسرع وقت.",
          },
          {
            question: "أحتاج مساعدة في شيء آخر.",
            answer: "ولا يهمك! ادخل على قسم الدعم داخل الموقع وسنكون معك.",
          },
        ],
      },
    },
  };

  const faqCategories = [
    {
      icon: BookOpen,
      title: "أسئلة الدورات",
      description: "أسئلة حول الدورات والتسجيل والمحتوى",
    },
    {
      icon: Users,
      title: "دعم الحساب",
      description: "مساعدة في إعداد الحساب وتسجيل الدخول وإدارة الملف الشخصي",
    },
    {
      icon: HelpCircle,
      title: "المشاكل التقنية",
      description: "أخطاء المنصة وتشغيل الفيديو والمشاكل التقنية",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center md:mb-16 mb-8">
          <Badge className="md:mb-8 mb-4 text-primary border-primary/20 bg-primary/20 text-lg px-6 py-2">
            تواصل معنا
          </Badge>
          <h1 className="md:text-5xl text-3xl font-bold text-gray-900 md:mb-8 mb-4 text-balance leading-tight">
            نحن هنا{" "}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              لمساعدتك
            </span>
          </h1>
          <p className="md:text-2xl text-gray-600 max-w-4xl mx-auto text-pretty leading-relaxed">
            هل لديك أسئلة حول دوراتنا أو تحتاج إلى دعم؟ فريقنا مستعد لمساعدتك.
            تواصل معنا من خلال أي من القنوات أدناه وسنعود إليك بسرعة.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:mb-16 mb-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-white to-blue-50/30">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 md:text-2xl text-lg">
                  <Send className="w-7 h-7 text-primary" />
                  أرسل لنا رسالة
                </CardTitle>
                <CardDescription className="md:text-lg">
                  املأ النموذج أدناه وسنرد خلال 24 ساعة
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center md:py-16 py-8">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      تم إرسال الرسالة بنجاح!
                    </h3>
                    <p className="text-xl text-gray-600">
                      سنعود إليك خلال 24 ساعة.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="name"
                          className="md:text-lg font-semibold"
                        >
                          الاسم الكامل *
                        </Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="أدخل اسمك الكامل"
                          className="h-12 md:text-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="email"
                          className="md:text-lg font-semibold"
                        >
                          عنوان البريد الإلكتروني *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="أدخل بريدك الإلكتروني"
                          className="h-12 md:text-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="phone"
                          className="md:text-lg font-semibold"
                        >
                          رقم الهاتف
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="أدخل رقم هاتفك"
                          className="h-12 md:text-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="country"
                          className="md:text-lg font-semibold"
                        >
                          البلد
                        </Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) =>
                            setFormData({ ...formData, country: value })
                          }
                        >
                          <SelectTrigger className="h-12 md:text-lg">
                            <SelectValue placeholder="اختر بلدك" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="egypt">مصر</SelectItem>
                            <SelectItem value="saudi">السعودية</SelectItem>
                            <SelectItem value="uae">الإمارات</SelectItem>
                            <SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="inquiryType"
                        className="md:text-lg font-semibold"
                      >
                        نوع الاستفسار
                      </Label>
                      <Select
                        value={formData.inquiryType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, inquiryType: value })
                        }
                      >
                        <SelectTrigger className="h-12 md:text-lg">
                          <SelectValue placeholder="كيف يمكننا مساعدتك؟" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="course">معلومات الدورة</SelectItem>
                          <SelectItem value="technical">
                            الدعم التقني
                          </SelectItem>
                          <SelectItem value="billing">
                            الفواتير والمدفوعات
                          </SelectItem>
                          <SelectItem value="partnership">
                            فرص الشراكة
                          </SelectItem>
                          <SelectItem value="feedback">
                            التعليقات والاقتراحات
                          </SelectItem>
                          <SelectItem value="other">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="subject"
                        className="md:text-lg font-semibold"
                      >
                        الموضوع *
                      </Label>
                      <Input
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        placeholder="وصف مختصر لاستفسارك"
                        className="h-12 md:text-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="message"
                        className="md:text-lg font-semibold"
                      >
                        الرسالة *
                      </Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="يرجى تقديم تفاصيل حول استفسارك..."
                        rows={6}
                        className="md:text-lg"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 md:text-xl font-bold"
                      size="lg"
                    >
                      <Send className="w-6 h-6 ml-3" />
                      إرسال الرسالة
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-white to-green-50/30">
              <CardHeader>
                <CardTitle className="md:text-2xl text-lg">
                  تواصل سريع
                </CardTitle>
                <CardDescription className="md:text-lg">
                  اختر الطريقة المفضلة للتواصل معنا
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    onClick={() => handleContactClick(method)}
                    className="flex items-center gap-6 p-6 rounded-xl border hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
                  >
                    <div
                      className={`p-4 ${method.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold md:text-lg text-gray-900">
                        {method.title}
                      </h4>
                      <p className="md:text-base text-sm text-gray-600 mb-2">
                        {method.description}
                      </p>
                      <p className="text-base font-bold text-primary">
                        {method.contact}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {method.action}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-white to-pink-50/30">
              <CardHeader>
                <CardTitle className="md:text-2xl text-lg">تابعنا</CardTitle>
                <CardDescription className="md:text-lg">
                  ابق على تواصل عبر وسائل التواصل الاجتماعي
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {socialMedia.map((social, index) => (
                  <div
                    key={index}
                    onClick={() => handleSocialClick(social)}
                    className="flex items-center gap-6 p-6 rounded-xl border hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <div
                      className={`p-4 ${social.color} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <social.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold md:text-lg text-gray-900">
                          {social.name}
                        </h4>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="md:text-base text-sm text-gray-600 mb-2">
                        {social.description}
                      </p>
                      <p className="text-base font-bold text-primary">
                        {social.handle}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-white to-purple-50/30">
              <CardHeader>
                <CardTitle className="text-2xl">تحتاج مساعدة سريعة؟</CardTitle>
                <CardDescription className="text-lg">تصفح أقسام الأسئلة الشائعة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl border hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <category.icon className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-bold text-base text-gray-900">{category.title}</h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card> */}
          </div>
        </div>

        <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 mb-16 bg-gradient-to-br from-white to-yellow-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 md:text-2xl text-lg">
              <HelpCircle className="w-7 h-7 text-primary" />
              {helpData.title}
            </CardTitle>
            <CardDescription className="md:text-lg">
              {helpData.content.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-6">
                <h3 className="font-bold md:text-xl text-gray-900 mb-4">
                  {helpData.content.list_one.header}
                </h3>
                {helpData.content.list_one.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 transition-all duration-300"
                  >
                    <h4 className="font-bold md:text-base text-sm text-gray-900 mb-2">
                      {item.question}
                    </h4>
                    <p className="md:text-sm text-xs text-gray-600">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
              {/* <div className="space-y-6">
                <h3 className="font-bold text-xl text-gray-900 mb-4">{helpData.content.list_two.header}</h3>
                {helpData.content.list_two.items.map((item, index) => (
                  <div key={index} className="p-4 rounded-xl border hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 transition-all duration-300">
                    <h4 className="font-bold text-base text-gray-900 mb-2">{item.question}</h4>
                    <p className="text-sm text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div> */}
              <div className="space-y-6">
                <h3 className="font-bold md:text-xl text-gray-900 mb-4">
                  {helpData.content.list_three.header}
                </h3>
                {helpData.content.list_three.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 transition-all duration-300"
                  >
                    <h4 className="font-bold md:text-base text-sm text-gray-900 mb-2">
                      {item.question}
                    </h4>
                    <p className="md:text-sm text-xs text-gray-600">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-3xl bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white">
          <CardContent className="md:p-12 p-8 text-center">
            <Clock className="w-16 h-16 mx-auto mb-6 text-blue-200 drop-shadow-lg" />
            <h3 className="md:text-3xl text-2xl font-bold mb-4">
              ضمان الاستجابة السريعة
            </h3>
            <p className="md:text-xl text-blue-100 mb-8 leading-relaxed">
              نحن عادة نرد على جميع الاستفسارات خلال 24 ساعة خلال أيام العمل.
              للمشاكل التقنية العاجلة، فريق الدعم لدينا متاح على مدار الساعة
              طوال أيام الأسبوع.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 md:text-lg text-xs md:px-6 px-4 py-3"
              >
                البريد الإلكتروني: خلال 24 ساعة
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 md:text-lg text-xs md:px-6 px-4 py-3"
              >
                واتساب: خلال ساعتين
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
