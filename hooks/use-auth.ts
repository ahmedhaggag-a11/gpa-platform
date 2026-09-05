"use client";

import { useAuth as useAuthContext } from "@/contexts/auth-context";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  enhanceAuthError,
  getErrorTypeIcon,
  isRetryableError,
} from "@/lib/auth-errors";
import { getUser } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

// Re-export the main auth hook
export { useAuth, useRequireAuth, useGuestOnly } from "@/contexts/auth-context";

// Custom hook for handling authentication actions with UI feedback
export function useAuthActions() {
  const { signIn, signUp, signOut, resetPassword } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(new Set<string>());

  const handleSignIn = useCallback(
    async (email: string, password: string, remember?: boolean) => {
      setIsLoading(true);
      try {
        const result = await signIn(email, password, remember);
        if (!result.success) {
          const errorDetails = result.errorDetails;
          if (errorDetails) {
            // Show enhanced error with icon and user action
            const icon = getErrorTypeIcon(errorDetails.type);
            toast.error(`${icon} ${result.error}`, {
              description: errorDetails.userAction,
              duration: errorDetails.severity === "high" ? 8000 : 5000,
            });

            // Show retry option for retryable errors
            if (isRetryableError(errorDetails)) {
              setTimeout(() => {
                toast.info("💡 يمكنك المحاولة مرة أخرى الآن");
              }, 3000);
            }
          } else {
            toast.error(result.error || "حدث خطأ أثناء تسجيل الدخول");
          }
        }
        return result;
      } catch (error) {
        const enhancedError = enhanceAuthError(error);
        const icon = getErrorTypeIcon(enhancedError.type);
        toast.error(`${icon} ${enhancedError.message}`, {
          description: enhancedError.userAction,
          duration: enhancedError.severity === "high" ? 8000 : 5000,
        });
        return {
          success: false,
          error: enhancedError.message,
          errorDetails: enhancedError,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [signIn]
  );

  const handleSignUp = useCallback(
    async (email: string, password: string, metadata?: any) => {
      // Create a unique request key
      const requestKey = `signup-${email}`;
      
      // Check if this request is already pending
      if (pendingRequests.has(requestKey)) {
        console.log('Signup request already pending for:', email);
        toast.warning('طلب إنشاء الحساب قيد المعالجة بالفعل');
        return {
          success: false,
          error: 'طلب إنشاء الحساب قيد المعالجة',
          errorDetails: {
            message: 'طلب إنشاء الحساب قيد المعالجة',
            type: 'validation' as const,
            severity: 'low' as const,
            userAction: 'يرجى الانتظار حتى اكتمال الطلب الحالي'
          }
        };
      }
      
      // Add request to pending set
      console.log('Adding signup request to pending set:', requestKey);
      setPendingRequests(prev => new Set(prev).add(requestKey));
      setIsLoading(true);
      
      try {
        const result = await signUp(email, password, metadata);
        if (!result.success) {
          const errorDetails = result.errorDetails;
          if (errorDetails) {
            // Show enhanced error with icon and user action
            const icon = getErrorTypeIcon(errorDetails.type);
            toast.error(`${icon} ${result.error}`, {
              description: errorDetails.userAction,
              duration: errorDetails.severity === "high" ? 8000 : 5000,
            });

            // Show retry option for retryable errors
            if (isRetryableError(errorDetails)) {
              setTimeout(() => {
                toast.info("💡 يمكنك المحاولة مرة أخرى الآن");
              }, 3000);
            }
          } else {
            toast.error(result.error || "حدث خطأ أثناء إنشاء الحساب");
          }
        }
        return result;
      } catch (error) {
        const enhancedError = enhanceAuthError(error);
        const icon = getErrorTypeIcon(enhancedError.type);
        toast.error(`${icon} ${enhancedError.message}`, {
          description: enhancedError.userAction,
          duration: enhancedError.severity === "high" ? 8000 : 5000,
        });
        return {
          success: false,
          error: enhancedError.message,
          errorDetails: enhancedError,
        };
      } finally {
        setIsLoading(false);
        // Remove request from pending set
        console.log('Removing signup request from pending set:', requestKey);
        setPendingRequests(prev => {
          const newSet = new Set(prev);
          newSet.delete(requestKey);
          return newSet;
        });
      }
    },
    [signUp, pendingRequests]
  );

  const handleSignOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      const enhancedError = enhanceAuthError(error);
      const icon = getErrorTypeIcon(enhancedError.type);
      toast.error(`${icon} ${enhancedError.message}`, {
        description: enhancedError.userAction,
        duration: enhancedError.severity === "high" ? 8000 : 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [signOut]);

  const handleResetPassword = useCallback(
    async (email: string) => {
      setIsLoading(true);
      try {
        const result = await resetPassword(email);
        if (!result.success) {
          const errorDetails = result.errorDetails;
          if (errorDetails) {
            // Show enhanced error with icon and user action
            const icon = getErrorTypeIcon(errorDetails.type);
            toast.error(`${icon} ${result.error}`, {
              description: errorDetails.userAction,
              duration: errorDetails.severity === "high" ? 8000 : 5000,
            });

            // Show retry option for retryable errors
            if (isRetryableError(errorDetails)) {
              setTimeout(() => {
                toast.info("💡 يمكنك المحاولة مرة أخرى الآن");
              }, 3000);
            }
          } else {
            toast.error(
              result.error || "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور"
            );
          }
        } else {
          toast.success(
            "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
          );
        }
        return result;
      } catch (error) {
        const enhancedError = enhanceAuthError(error);
        const icon = getErrorTypeIcon(enhancedError.type);
        toast.error(`${icon} ${enhancedError.message}`, {
          description: enhancedError.userAction,
          duration: enhancedError.severity === "high" ? 8000 : 5000,
        });
        return {
          success: false,
          error: enhancedError.message,
          errorDetails: enhancedError,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [resetPassword]
  );

  return {
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    isLoading,
  };
}

// Hook for checking user permissions or roles (can be extended later)
export function useUserPermissions() {
  const { user } = useAuthContext();

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false;
      // Add permission logic here based on user metadata or roles
      // For now, all authenticated users have basic permissions
      return true;
    },
    [user]
  );

  const isAdmin = useCallback(() => {
    if (!user) return false;
    // Check if user has admin role
    return (
      user.user_metadata?.role === "admin" ||
      user.app_metadata?.role === "admin"
    );
  }, [user]);

  const isTeacher = useCallback(() => {
    if (!user) return false;
    // Check if user has teacher role
    return (
      user.user_metadata?.role === "teacher" ||
      user.app_metadata?.role === "teacher"
    );
  }, [user]);

  const isStudent = useCallback(() => {
    if (!user) return false;
    // Default role is student, or explicitly check
    return !isAdmin() && !isTeacher();
  }, [user, isAdmin, isTeacher]);

  return {
    hasPermission,
    isAdmin,
    isTeacher,
    isStudent,
  };
}

// Hook for user profile information
export function useUserProfile() {
  const { user } = useAuthContext();
  
  // Fetch full user data from backend
  const {
    data,
  } = useQuery<any>({
    queryKey: [`user-${user?.id}`],
    queryFn: getUser,
    enabled: !!user, // Only fetch when user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getDisplayName = useCallback(() => {
    if (!user) return "";
    // Use backend data first, fallback to Supabase metadata
    return (
      data?.fullName ||
      data?.name ||
      user.user_metadata?.fullName ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "مستخدم"
    );
  }, [user, data]);

  const getAvatarUrl = useCallback(() => {
    if (!user) return null;
    // Use backend data first, fallback to Supabase metadata
    return (
      data?.profileUrl ||
      data?.picture ||
      user.user_metadata?.profileUrl ||
      user.user_metadata?.picture ||
      null
    );
  }, [user, data]);

  return {
    displayName: getDisplayName(),
    avatarUrl: getAvatarUrl(),
    email: data?.email || user?.email || "",
    userId: data?.id || user?.id || "",
    role: data?.role || user?.user_metadata?.role || "",
    class: data?.class || {},
    classId: data?.classId || user?.user_metadata?.classId || "",
    phoneNumber: data?.phoneNumber || user?.phone || "",
    parentPhoneNumber:
      data?.parentPhoneNumber ||
      user?.user_metadata?.parentPhoneNumber ||
      "",
    about: data?.about || "",
  };
}
