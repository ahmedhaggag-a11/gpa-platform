"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, ArrowRight, Search, BookOpen } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* 404 Number with gradient */}
        <div className="relative">
          <div className="text-9xl md:text-[12rem] font-bold bg-gradient-to-br from-primary via-accent to-primary/60 bg-clip-text text-transparent leading-none">
            404
          </div>
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold text-primary/10 blur-sm leading-none">
            404
          </div>
        </div>

        {/* Error Badge */}
        <Badge 
          variant="secondary" 
          className="bg-destructive/10 text-destructive border-destructive/20 text-lg px-6 py-2"
        >
          الصفحة غير موجودة
        </Badge>

        {/* Main heading */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            عذراً، لم نتمكن من العثور على هذه الصفحة
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو أن الرابط غير صحيح
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-5 h-5" />
              العودة للصفحة الرئيسية
            </Link>
          </Button>
          
        </div>



        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}