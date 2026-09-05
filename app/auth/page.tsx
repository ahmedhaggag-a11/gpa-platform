"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import Signin from "@/components/auth/signin";
import Signup from "@/components/auth/signup";
import { useGuestOnly } from "@/hooks/use-auth";

export default function AuthPage() {
  // Redirect if already authenticated
  useGuestOnly();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-xl animate-fade-in">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl overflow-hidden bg-primary flex items-center justify-center shadow-xl">
              <Image src="/logo.png" alt="منصة GPA" width={200} height={200} />
            </div>
            <span className="md:text-3xl text-2xl font-bold text-foreground">منصة GPA</span>
          </Link>
          <p className="md:text-lg text-muted-foreground mt-3 text-center">
            بوابتك نحو التميز الأكاديمي
          </p>
        </div>

        <Card className="animate-scale-in hover-lift shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="md:text-2xl text-xl font-bold text-center mb-2">
              مرحباً بك في منصة GPA
            </CardTitle>
            <CardDescription className="md:text-lg text-center text-muted-foreground">
              انضم إلينا أو سجل دخولك للوصول إلى دوراتك التعليمية
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-full">
                <TabsTrigger value="signin" className="text-lg py-3">
                  تسجيل الدخول
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-lg py-3">
                  إنشاء حساب
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-6">
                <Signin />
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-6">
                <Signup />
              </TabsContent>
            </Tabs>
            
            <div className="text-center mt-8">
              <Link
                href="/"
                className="md:text-base text-sm text-muted-foreground hover:text-primary transition-colors"
              >
               العودة للرئيسية
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
