// Generic error enhancement utilities for global error handling

export interface EnhancedError {
  message: string;
  type: 'validation' | 'network' | 'auth' | 'server' | 'client' | 'unknown';
  code?: string;
  severity: 'low' | 'medium' | 'high';
  userAction?: string;
  technicalDetails?: string;
  stack?: string;
}

// Common error patterns for different types
const NETWORK_ERROR_PATTERNS = [
  /network/i,
  /fetch/i,
  /connection/i,
  /timeout/i,
  /offline/i,
  /ENOTFOUND/i,
  /ECONNREFUSED/i
];

const SERVER_ERROR_PATTERNS = [
  /5\d{2}/,
  /internal server error/i,
  /service unavailable/i,
  /bad gateway/i,
  /gateway timeout/i
];

const VALIDATION_ERROR_PATTERNS = [
  /validation/i,
  /invalid/i,
  /required/i,
  /format/i,
  /schema/i
];

const AUTH_ERROR_PATTERNS = [
  /auth/i,
  /unauthorized/i,
  /forbidden/i,
  /token/i,
  /session/i,
  /login/i,
  /credential/i
];

// Generic error messages in Arabic
const GENERIC_ERROR_MESSAGES: Record<string, Partial<EnhancedError>> = {
  network: {
    message: 'خطأ في الاتصال بالشبكة',
    type: 'network',
    severity: 'medium',
    userAction: 'تأكد من اتصالك بالإنترنت وحاول مرة أخرى'
  },
  server: {
    message: 'خطأ في الخادم',
    type: 'server',
    severity: 'high',
    userAction: 'يرجى المحاولة لاحقاً'
  },
  validation: {
    message: 'خطأ في البيانات المدخلة',
    type: 'validation',
    severity: 'low',
    userAction: 'تأكد من صحة البيانات المدخلة'
  },
  auth: {
    message: 'خطأ في المصادقة',
    type: 'auth',
    severity: 'medium',
    userAction: 'يرجى تسجيل الدخول مرة أخرى'
  },
  client: {
    message: 'خطأ في التطبيق',
    type: 'client',
    severity: 'medium',
    userAction: 'يرجى إعادة تحميل الصفحة'
  },
  unknown: {
    message: 'حدث خطأ غير متوقع',
    type: 'unknown',
    severity: 'medium',
    userAction: 'يرجى المحاولة مرة أخرى'
  }
};

/**
 * Enhances any error with additional context and user-friendly information
 */
export function enhanceError(error: any): EnhancedError {
  if (!error) {
    return {
      ...GENERIC_ERROR_MESSAGES.unknown,
      message: 'حدث خطأ غير معروف',
      type: 'unknown',
      severity: 'medium'
    } as EnhancedError;
  }

  // If it's already an enhanced error, return as is
  if (error.type && error.severity) {
    return error as EnhancedError;
  }

  const errorMessage = error.message || error.toString() || 'خطأ غير معروف';
  const errorCode = error.code || error.status?.toString();
  const errorStack = error.stack;

  // Determine error type based on patterns
  let errorType: EnhancedError['type'] = 'unknown';
  let baseErrorInfo = GENERIC_ERROR_MESSAGES.unknown;

  if (NETWORK_ERROR_PATTERNS.some(pattern => pattern.test(errorMessage))) {
    errorType = 'network';
    baseErrorInfo = GENERIC_ERROR_MESSAGES.network;
  } else if (SERVER_ERROR_PATTERNS.some(pattern => pattern.test(errorMessage))) {
    errorType = 'server';
    baseErrorInfo = GENERIC_ERROR_MESSAGES.server;
  } else if (VALIDATION_ERROR_PATTERNS.some(pattern => pattern.test(errorMessage))) {
    errorType = 'validation';
    baseErrorInfo = GENERIC_ERROR_MESSAGES.validation;
  } else if (AUTH_ERROR_PATTERNS.some(pattern => pattern.test(errorMessage))) {
    errorType = 'auth';
    baseErrorInfo = GENERIC_ERROR_MESSAGES.auth;
  } else if (error.name === 'TypeError' || error.name === 'ReferenceError' || error.name === 'SyntaxError') {
    errorType = 'client';
    baseErrorInfo = GENERIC_ERROR_MESSAGES.client;
  }

  // Handle specific error codes
  if (errorCode) {
    const statusCode = parseInt(errorCode);
    if (statusCode >= 400 && statusCode < 500) {
      if (statusCode === 401 || statusCode === 403) {
        errorType = 'auth';
        baseErrorInfo = GENERIC_ERROR_MESSAGES.auth;
      } else {
        errorType = 'validation';
        baseErrorInfo = GENERIC_ERROR_MESSAGES.validation;
      }
    } else if (statusCode >= 500) {
      errorType = 'server';
      baseErrorInfo = GENERIC_ERROR_MESSAGES.server;
    }
  }

  return {
    message: baseErrorInfo.message || errorMessage,
    type: errorType,
    severity: baseErrorInfo.severity || 'medium',
    userAction: baseErrorInfo.userAction,
    code: errorCode,
    technicalDetails: errorMessage,
    stack: errorStack
  };
}

/**
 * Formats error for logging purposes
 */
export function formatErrorForLogging(error: EnhancedError): string {
  return `[${error.type.toUpperCase()}] ${error.message} ${error.code ? `(${error.code})` : ''}`;
}

/**
 * Determines if an error should be reported to error tracking services
 */
export function shouldReportError(error: EnhancedError): boolean {
  return error.severity === 'high' || error.type === 'server' || error.type === 'unknown';
}

/**
 * Determines if an error is retryable
 */
export function isRetryableError(error: EnhancedError): boolean {
  return error.type === 'network' || error.type === 'server' || error.severity === 'medium';
}

/**
 * Gets color class for error severity
 */
export function getErrorSeverityColor(severity: EnhancedError['severity']): string {
  switch (severity) {
    case 'low':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'medium':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Gets icon name for error type
 */
export function getErrorTypeIcon(type: EnhancedError['type']): string {
  switch (type) {
    case 'validation':
      return 'AlertTriangle';
    case 'network':
      return 'Wifi';
    case 'auth':
      return 'Shield';
    case 'server':
      return 'Server';
    case 'client':
      return 'Monitor';
    default:
      return 'HelpCircle';
  }
}