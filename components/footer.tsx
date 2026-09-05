import Link from "next/link";
import {
  BookOpen,
  Facebook,
  Instagram,
  MessageCircle,
  Youtube,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">منصة GPA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              تمكين الطلاب في مصر والمملكة العربية السعودية والإمارات العربية
              المتحدة بتعليم عالي الجودة ودعم شامل للمناهج.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">روابط سريعة</h3>
            <div className="space-y-2">
              <Link
                href="/explore"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                استكشاف الدورات
              </Link>
              <Link
                href="/teachers"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                معلمونا
              </Link>
              <Link
                href="/subjects"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                المواد
              </Link>
              <Link
                href="/about"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                من نحن
              </Link>
            </div>
          </div>

          {/* Student Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">موارد الطلاب</h3>
            <div className="space-y-2">
              <Link
                href="/my-courses"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                دوراتي
              </Link>
              <Link
                href="/saved"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                المحفوظات
              </Link>
              <Link
                href="/purchase-history"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                تاريخ الشراء
              </Link>
              <Link
                href="/profile"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                الملف الشخصي
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">تواصل معنا</h3>
            <div className="space-y-2">
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                اتصل بنا
              </Link>
              <Link
                href="/privacy-policy"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                سياسة الخصوصية
              </Link>
              <div className="flex space-x-4 pt-2">
                <Link
                  target="_blank"
                  href="https://www.facebook.com/share/1Ht9rRSBqK/?mibextid=wwXIfr"
                  className="text-muted-foreground hover:text-primary transition-colors hover-lift"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  target="_blank"
                  href="https://www.instagram.com/gpa_platform?igsh=NW1zZWJzYXh5NzQ0"
                  className="text-muted-foreground hover:text-primary transition-colors hover-lift"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  target="_blank"
                  href="https://youtube.com/@gpaplatform?si=YlkvX6qUcnDqIV5Y"
                  className="text-muted-foreground hover:text-primary transition-colors hover-lift"
                >
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">Youtube</span>
                </Link>
                <Link
                  target="_blank"
                  href="https://wa.me/201012345678"
                  className="text-muted-foreground hover:text-primary transition-colors hover-lift"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="sr-only">WhatsApp</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} منصة GPA. جميع الحقوق محفوظة. تمكين
            التعليم في الشرق الأوسط.
          </p>
        </div>
      </div>
    </footer>
  );
}
