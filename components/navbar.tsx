"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Menu,
  X,
  Heart,
  User,
  LogOut,
  Settings,
  BookOpen,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth, useAuthActions, useUserProfile } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const { signOut } = useAuthActions();
  const { displayName, avatarUrl } = useUserProfile();

  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="container mx-auto px-6 overflow-visible">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:translate-y-[-6px] transition-transform duration-500"
          >
            <div className="h-14 w-14 rounded-2xl overflow-hidden bg-primary flex items-center justify-center shadow-xl">
              <Image src="/logo.png" alt="logo" width={200} height={200} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">
                منصة GPA
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                للتعلم
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8 overflow-visible">
            {isAuthenticated && (
              <>
                <Link
                  href="/explore"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  استكشف
                  <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/my-courses"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  دوراتي
                  <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/teachers"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  المعلمون
                  <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            )}
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
            >
              من نحن
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
            >
              تواصل معنا
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {/* <Button
              variant="ghost"
              size="sm"
              className="h-11 w-11 rounded-full hover-lift hover:bg-primary"

            >
              <Bell className="h-4 w-4" />
            </Button> */}

            {!loading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-11 w-11 rounded-full hover-lift hover:bg-primary"
                      onClick={() => router.push("/saved")}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-2" />
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-11 w-11 rounded-full hover-lift"
                        >
                          <Avatar className="h-11 w-11">
                            <AvatarImage
                              src={avatarUrl || "/student-avatar.png"}
                              alt="الملف الشخصي"
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {<User className="h-5 w-5" />}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56 absolute top-20 left-20"
                        align="end"
                      >
                        <div className="px-2 py-1.5 text-sm font-medium">
                          {displayName}
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          asChild
                          className="focus:bg-primary/90"
                        >
                          <Link
                            href="/profile"
                            className="flex items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            الملف الشخصي
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          asChild
                          className="focus:bg-primary/90"
                        >
                          <Link
                            href="/saved"
                            className="flex items-center gap-2"
                          >
                            <Heart className="h-4 w-4" />
                            المحفوظات
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          asChild
                          className="focus:bg-primary/90"
                        >
                          <Link
                            href="/purchase-history"
                            className="flex items-center gap-2"
                          >
                            <ShoppingBag className="h-4 w-4" />
                            سجل المشتريات
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleSignOut}
                          className="flex items-center gap-2 text-red-600 focus:text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          تسجيل الخروج
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <Button
                    className="me-4 hover-lift bg-primary border-0 shadow-lg"
                    asChild
                  >
                    <Link href="/auth">تسجيل الدخول</Link>
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-11 w-11 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden animate-slide-up">
            <div className="px-2 pt-4 pb-6 space-y-2 border-t border-border/50 mt-4">
              {isAuthenticated && (
                <>
                  {" "}
                  <Link
                    href="/explore"
                    className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    استكشف
                  </Link>
                  <Link
                    href="/my-courses"
                    className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    دوراتي
                  </Link>
                  <Link
                    href="/teachers"
                    className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    المعلمون
                  </Link>
                </>
              )}
              <Link
                href="/about"
                className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                من نحن
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                تواصل معنا
              </Link>
              <div className="border-t border-border/50 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      الملف الشخصي
                    </Link>
                    <Link
                      href="/saved"
                      className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      المحفوظات
                    </Link>

                    <Link
                      href="/purchase-history"
                      className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      سجل المشتريات
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-start px-4 py-3 text-base font-medium text-red-600 hover:bg-secondary/50 rounded-lg transition-colors"
                    >
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth"
                    className="block px-4 py-3 text-base font-medium text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    تسجيل الدخول
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
