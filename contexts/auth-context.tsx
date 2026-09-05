"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { enhanceAuthError, formatErrorForLogging, shouldReportError } from '@/lib/auth-errors';
import { checkUser, createUser } from '@/api/user';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string; errorDetails?: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ success: boolean; error?: string; errorDetails?: any; requiresEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; errorDetails?: any }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          // If there's an error getting session, check if user should be remembered
          const rememberUser = localStorage.getItem('gpa_remember_user');
          if (!rememberUser) {
            // Clear any stale session data if user shouldn't be remembered
            localStorage.removeItem('supabase.auth.token');
          }
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          
          // If we have a session, ensure remember preference is maintained
          if (session && !localStorage.getItem('gpa_remember_user')) {
            // User has a session but no remember preference, this might be from a previous session
            console.log('Session found without remember preference');
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle different auth events
        switch (event) {
          case 'SIGNED_OUT':
            toast.success('تم تسجيل الخروج بنجاح');
            router.push('/');
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed');
            break;
          case 'USER_UPDATED':
            console.log('User updated');
            break;
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string, remember: boolean = false) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const enhancedError = enhanceAuthError(error);
        
        // Log error for debugging
        console.error('Sign in error:', formatErrorForLogging(enhancedError));
        
        // Report critical errors (in a real app, you'd send to error tracking service)
        if (shouldReportError(enhancedError)) {
          console.error('Critical auth error reported:', enhancedError);
        }
        
        return { 
          success: false, 
          error: enhancedError.message,
          errorDetails: enhancedError
        };
      }

      // Handle remember me functionality
      if (remember && data.session) {
        // Store session info in localStorage for persistence
        localStorage.setItem('gpa_remember_user', 'true');
        // Ensure session persists by setting it in localStorage
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
      } else {
        localStorage.removeItem('gpa_remember_user');
        // If not remembering, we still want to persist for the current browser session
        // The session will be cleared when browser is closed due to our storage config
      }

      return { success: true };
    } catch (error) {
      const enhancedError = enhanceAuthError(error);
      console.error('Sign in catch error:', formatErrorForLogging(enhancedError));
      
      if (shouldReportError(enhancedError)) {
        console.error('Critical auth error reported:', enhancedError);
      }
      
      return { 
        success: false, 
        error: enhancedError.message,
        errorDetails: enhancedError
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      
      // First check if email or phone already exists
      try {
        const duplicateCheck:any = await checkUser(email, metadata?.phoneNumber);
        
        // Check if user already exists
        if (duplicateCheck?.isDuplicate) {
          const duplicatedFields = duplicateCheck.duplicatedFields || [];
          let errorMessage = 'المستخدم موجود بالفعل';
          
          if (duplicatedFields.includes('email') && duplicatedFields.includes('phoneNumber')) {
            errorMessage = 'البريد الإلكتروني ورقم الهاتف مستخدمان بالفعل';
          } else if (duplicatedFields.includes('email')) {
            errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
          } else if (duplicatedFields.includes('phoneNumber')) {
            errorMessage = 'رقم الهاتف مستخدم بالفعل';
          }
          
          const enhancedError = enhanceAuthError(new Error(errorMessage));
          return { 
            success: false, 
            error: enhancedError.message,
            errorDetails: enhancedError
          };
        }
      } catch (error: any) {
        // Handle API errors
        const enhancedError = enhanceAuthError(error);
        return { 
          success: false, 
          error: enhancedError.message,
          errorDetails: enhancedError
        };
      }
      
      // Create user in backend - this handles both backend user creation and Supabase auth
      const userData = {
        email,
        password,
        fullName: metadata?.fullName,
        classId: metadata?.classId,
        country: metadata?.country,
        phoneNumber: metadata?.phoneNumber,
        parentPhoneNumber: metadata?.parentPhoneNumber,
      };
      
      await createUser(userData);

      return { success: true, requiresEmailConfirmation: true };
    } catch (error) {
      const enhancedError = enhanceAuthError(error);
      console.error('Sign up catch error:', formatErrorForLogging(enhancedError));
      
      if (shouldReportError(enhancedError)) {
        console.error('Critical auth error reported:', enhancedError);
      }
      
      return { 
        success: false, 
        error: enhancedError.message,
        errorDetails: enhancedError
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        const enhancedError = enhanceAuthError(error);
        toast.error(enhancedError.message);
        console.error('Sign out error:', formatErrorForLogging(enhancedError));
        
        if (shouldReportError(enhancedError)) {
          console.error('Critical auth error reported:', enhancedError);
        }
      } else {
        // Clear any stored user preferences and session data
        localStorage.removeItem('gpa_remember_user');
        localStorage.removeItem('supabase.auth.token');
        // Clear all supabase auth related items
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      const enhancedError = enhanceAuthError(error);
      console.error('Sign out catch error:', formatErrorForLogging(enhancedError));
      toast.error(enhancedError.message);
      
      if (shouldReportError(enhancedError)) {
        console.error('Critical auth error reported:', enhancedError);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      const { data: res, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://gpa-be.onrender.com/reset-password'
      });

      if (error) {
        const enhancedError = enhanceAuthError(error);
        
        // Log error for debugging
        console.error('Reset password error:', formatErrorForLogging(enhancedError));
        
        // Report critical errors
        if (shouldReportError(enhancedError)) {
          console.error('Critical auth error reported:', enhancedError);
        }
        
        return { 
          success: false, 
          error: enhancedError.message,
          errorDetails: enhancedError
        };
      }

      return { success: true };
    } catch (error) {
      const enhancedError = enhanceAuthError(error);
      console.error('Reset password catch error:', formatErrorForLogging(enhancedError));
      
      if (shouldReportError(enhancedError)) {
        console.error('Critical auth error reported:', enhancedError);
      }
      
      return { 
        success: false, 
        error: enhancedError.message,
        errorDetails: enhancedError
      };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  return { user, loading };
}

// Hook for guest-only routes (like auth page)
export function useGuestOnly() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/explore');
    }
  }, [user, loading, router]);

  return { user, loading };
}