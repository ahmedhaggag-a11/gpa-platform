import { AuthError } from '@supabase/supabase-js';

// Enhanced error types for better categorization
export interface EnhancedAuthError {
  message: string;
  type: 'validation' | 'network' | 'auth' | 'server' | 'unknown';
  code?: string;
  severity: 'low' | 'medium' | 'high';
  userAction?: string;
  technicalDetails?: string;
}

// Comprehensive Supabase error code mappings
const SUPABASE_ERROR_MESSAGES: Record<string, EnhancedAuthError> = {
  // Authentication errors
  'invalid_credentials': {
    message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    type: 'auth',
    severity: 'medium',
    userAction: 'تأكد من صحة البريد الإلكتروني وكلمة المرور'
  },
  'email_not_confirmed': {
    message: 'يرجى تأكيد بريدك الإلكتروني أولاً',
    type: 'auth',
    severity: 'medium',
    userAction: 'تحقق من بريدك الإلكتروني واضغط على رابط التأكيد'
  },
  'signup_disabled': {
    message: 'التسجيل غير متاح حالياً',
    type: 'auth',
    severity: 'high',
    userAction: 'يرجى المحاولة لاحقاً أو التواصل مع الدعم'
  },
  'email_address_invalid': {
    message: 'عنوان البريد الإلكتروني غير صحيح',
    type: 'validation',
    severity: 'low',
    userAction: 'تأكد من كتابة البريد الإلكتروني بالشكل الصحيح'
  },
  'password_too_short': {
    message: 'كلمة المرور قصيرة جداً',
    type: 'validation',
    severity: 'low',
    userAction: 'استخدم كلمة مرور تحتوي على 6 أحرف على الأقل'
  },
  'weak_password': {
    message: 'كلمة المرور ضعيفة',
    type: 'validation',
    severity: 'medium',
    userAction: 'استخدم كلمة مرور قوية تحتوي على أحرف وأرقام ورموز'
  },
  'user_already_registered': {
    message: 'هذا البريد الإلكتروني مسجل مسبقاً',
    type: 'auth',
    severity: 'medium',
    userAction: 'جرب تسجيل الدخول أو استخدم بريد إلكتروني آخر'
  },
  'user_not_found': {
    message: 'المستخدم غير موجود',
    type: 'auth',
    severity: 'medium',
    userAction: 'تأكد من صحة البريد الإلكتروني أو قم بإنشاء حساب جديد'
  },
  'too_many_requests': {
    message: 'تم تجاوز عدد المحاولات المسموح',
    type: 'auth',
    severity: 'high',
    userAction: 'يرجى الانتظار قليلاً قبل المحاولة مرة أخرى'
  },
  'session_not_found': {
    message: 'انتهت صلاحية الجلسة',
    type: 'auth',
    severity: 'medium',
    userAction: 'يرجى تسجيل الدخول مرة أخرى'
  },
  'token_expired': {
    message: 'انتهت صلاحية الرمز المميز',
    type: 'auth',
    severity: 'medium',
    userAction: 'يرجى تسجيل الدخول مرة أخرى'
  },
  'invalid_token': {
    message: 'الرمز المميز غير صحيح',
    type: 'auth',
    severity: 'medium',
    userAction: 'يرجى تسجيل الدخول مرة أخرى'
  },
  'email_change_token_invalid': {
    message: 'رابط تغيير البريد الإلكتروني غير صحيح أو منتهي الصلاحية',
    type: 'auth',
    severity: 'medium',
    userAction: 'يرجى طلب رابط جديد لتغيير البريد الإلكتروني'
  },
  'password_reset_token_invalid': {
    message: 'رابط إعادة تعيين كلمة المرور غير صحيح أو منتهي الصلاحية',
    type: 'auth',
    severity: 'medium',
    userAction: 'يرجى طلب رابط جديد لإعادة تعيين كلمة المرور'
  },
  'email_rate_limit_exceeded': {
    message: 'تم تجاوز الحد المسموح لإرسال الرسائل الإلكترونية',
    type: 'auth',
    severity: 'high',
    userAction: 'يرجى الانتظار قبل طلب رسالة إلكترونية جديدة'
  },
  'sms_rate_limit_exceeded': {
    message: 'تم تجاوز الحد المسموح لإرسال الرسائل النصية',
    type: 'auth',
    severity: 'high',
    userAction: 'يرجى الانتظار قبل طلب رسالة نصية جديدة'
  },
  'captcha_failed': {
    message: 'فشل في التحقق من الكابتشا',
    type: 'validation',
    severity: 'medium',
    userAction: 'يرجى إعادة المحاولة والتأكد من إكمال التحقق'
  },
  'same_password': {
    message: 'كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية',
    type: 'validation',
    severity: 'low',
    userAction: 'اختر كلمة مرور مختلفة عن كلمة المرور الحالية'
  },
  'email_address_not_authorized': {
    message: 'هذا البريد الإلكتروني غير مخول للوصول',
    type: 'auth',
    severity: 'high',
    userAction: 'تواصل مع الدعم للحصول على إذن الوصول'
  },
  'invite_not_found': {
    message: 'الدعوة غير موجودة أو منتهية الصلاحية',
    type: 'auth',
    severity: 'medium',
    userAction: 'يرجى طلب دعوة جديدة'
  },
  'validation_failed': {
    message: 'فشل في التحقق من البيانات',
    type: 'validation',
    severity: 'medium',
    userAction: 'تأكد من صحة جميع البيانات المدخلة'
  },
  'database_error': {
    message: 'خطأ في قاعدة البيانات',
    type: 'server',
    severity: 'high',
    userAction: 'يرجى المحاولة لاحقاً أو التواصل مع الدعم'
  },
  'network_error': {
    message: 'خطأ في الاتصال بالشبكة',
    type: 'network',
    severity: 'medium',
    userAction: 'تأكد من اتصالك بالإنترنت وحاول مرة أخرى'
  },
  'server_error': {
    message: 'خطأ في الخادم',
    type: 'server',
    severity: 'high',
    userAction: 'يرجى المحاولة لاحقاً'
  },
  'service_unavailable': {
    message: 'الخدمة غير متاحة حالياً',
    type: 'server',
    severity: 'high',
    userAction: 'يرجى المحاولة لاحقاً'
  }
};

// Network error patterns
const NETWORK_ERROR_PATTERNS = [
  /network/i,
  /fetch/i,
  /connection/i,
  /timeout/i,
  /offline/i,
  /ENOTFOUND/i,
  /ECONNREFUSED/i
];

// Server error patterns
const SERVER_ERROR_PATTERNS = [
  /5\d{2}/,
  /internal server error/i,
  /service unavailable/i,
  /bad gateway/i,
  /gateway timeout/i
];

/**
 * Enhanced error handler for Supabase authentication errors
 * @param error - The error object from Supabase or any other source
 * @returns Enhanced error object with user-friendly message and metadata
 */
export function enhanceAuthError(error: any): EnhancedAuthError {
  // Handle null or undefined errors
  if (!error) {
    return {
      message: 'حدث خطأ غير متوقع',
      type: 'unknown',
      severity: 'medium',
      userAction: 'يرجى المحاولة مرة أخرى'
    };
  }

  // Extract error details
  const errorMessage = error.message || error.error_description || error.error || String(error);
  const errorCode = error.error_code || error.code || error.status;
  
  // Check for specific Supabase error codes first
  if (errorCode && SUPABASE_ERROR_MESSAGES[errorCode]) {
    return {
      ...SUPABASE_ERROR_MESSAGES[errorCode],
      code: errorCode,
      technicalDetails: errorMessage
    };
  }

  // Check for error patterns in message
  const lowerMessage = errorMessage.toLowerCase();
  
  // Network errors
  if (NETWORK_ERROR_PATTERNS.some(pattern => pattern.test(errorMessage))) {
    return {
      message: 'خطأ في الاتصال بالشبكة',
      type: 'network',
      severity: 'medium',
      userAction: 'تأكد من اتصالك بالإنترنت وحاول مرة أخرى',
      technicalDetails: errorMessage
    };
  }

  // Server errors
  if (SERVER_ERROR_PATTERNS.some(pattern => pattern.test(errorMessage))) {
    return {
      message: 'خطأ في الخادم',
      type: 'server',
      severity: 'high',
      userAction: 'يرجى المحاولة لاحقاً',
      technicalDetails: errorMessage
    };
  }

  // Check for common error patterns in message
  if (lowerMessage.includes('invalid') && lowerMessage.includes('credentials')) {
    return SUPABASE_ERROR_MESSAGES['invalid_credentials'];
  }
  
  if (lowerMessage.includes('email') && lowerMessage.includes('not') && lowerMessage.includes('confirmed')) {
    return SUPABASE_ERROR_MESSAGES['email_not_confirmed'];
  }
  
  if (lowerMessage.includes('user') && lowerMessage.includes('already') && lowerMessage.includes('registered')) {
    return SUPABASE_ERROR_MESSAGES['user_already_registered'];
  }
  
  if (lowerMessage.includes('too') && lowerMessage.includes('many') && lowerMessage.includes('requests')) {
    return SUPABASE_ERROR_MESSAGES['too_many_requests'];
  }
  
  if (lowerMessage.includes('password') && lowerMessage.includes('too') && lowerMessage.includes('short')) {
    return SUPABASE_ERROR_MESSAGES['password_too_short'];
  }
  
  if (lowerMessage.includes('weak') && lowerMessage.includes('password')) {
    return SUPABASE_ERROR_MESSAGES['weak_password'];
  }
  
  if (lowerMessage.includes('email') && lowerMessage.includes('invalid')) {
    return SUPABASE_ERROR_MESSAGES['email_address_invalid'];
  }
  
  if (lowerMessage.includes('session') && lowerMessage.includes('not') && lowerMessage.includes('found')) {
    return SUPABASE_ERROR_MESSAGES['session_not_found'];
  }
  
  if (lowerMessage.includes('token') && lowerMessage.includes('expired')) {
    return SUPABASE_ERROR_MESSAGES['token_expired'];
  }
  
  if (lowerMessage.includes('user') && lowerMessage.includes('not') && lowerMessage.includes('found')) {
    return SUPABASE_ERROR_MESSAGES['user_not_found'];
  }

  // Default fallback error
  return {
    message: errorMessage || 'حدث خطأ غير متوقع',
    type: 'unknown',
    severity: 'medium',
    userAction: 'يرجى المحاولة مرة أخرى أو التواصل مع الدعم',
    technicalDetails: errorMessage
  };
}

/**
 * Get error severity color for UI display
 * @param severity - Error severity level
 * @returns CSS color class or hex color
 */
export function getErrorSeverityColor(severity: EnhancedAuthError['severity']): string {
  switch (severity) {
    case 'low':
      return '#f59e0b'; // amber-500
    case 'medium':
      return '#ef4444'; // red-500
    case 'high':
      return '#dc2626'; // red-600
    default:
      return '#6b7280'; // gray-500
  }
}

/**
 * Get error type icon for UI display
 * @param type - Error type
 * @returns Icon name or emoji
 */
export function getErrorTypeIcon(type: EnhancedAuthError['type']): string {
  switch (type) {
    case 'validation':
      return '⚠️';
    case 'network':
      return '🌐';
    case 'auth':
      return '🔐';
    case 'server':
      return '🔧';
    default:
      return '❓';
  }
}

/**
 * Format error for logging purposes
 * @param error - Enhanced error object
 * @returns Formatted error string for logs
 */
export function formatErrorForLogging(error: EnhancedAuthError): string {
  return `[${error.type.toUpperCase()}] ${error.message} | Severity: ${error.severity} | Code: ${error.code || 'N/A'} | Technical: ${error.technicalDetails || 'N/A'}`;
}

/**
 * Check if error should trigger a retry mechanism
 * @param error - Enhanced error object
 * @returns Whether the error is retryable
 */
export function isRetryableError(error: EnhancedAuthError): boolean {
  return error.type === 'network' || error.type === 'server';
}

/**
 * Check if error should be reported to error tracking service
 * @param error - Enhanced error object
 * @returns Whether the error should be reported
 */
export function shouldReportError(error: EnhancedAuthError): boolean {
  return error.severity === 'high' || error.type === 'server' || error.type === 'unknown';
}