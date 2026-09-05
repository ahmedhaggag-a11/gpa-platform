import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { QueryProvider } from "@/components/query-provider"
import { AuthProvider } from "@/contexts/auth-context";
import AuthErrorBoundary from "@/components/auth/auth-error-boundary";
import { Suspense } from "react"
import { Toaster } from "sonner"
import "./globals.css"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "منصة GPA - تعليم عالي الجودة للشرق الأوسط",
  description:
    "مناهج شاملة للطلاب في مصر والمملكة العربية السعودية والإمارات العربية المتحدة. تعلم من أفضل المعلمين وحقق التميز الأكاديمي.",
    icons: {
      icon: "/white-logo.png",
      apple: "/white-logo.png",
      shortcut: "/white-logo.png",
    }
  }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`font-sans ${cairo.variable} antialiased`}>
        <QueryProvider>
          <AuthErrorBoundary>
            <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <Navbar />
              </Suspense>
              <main className="flex-1">{children}</main>
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <Footer />
              </Suspense>
            </div>
            <Toaster 
              position="top-center"
              dir="rtl"
              richColors
              closeButton
              expand={false}
              duration={4000}
            />
          </AuthProvider>
          </AuthErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  )
}
