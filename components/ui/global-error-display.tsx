"use client";

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Wifi, 
  Shield, 
  Server, 
  Monitor,
  HelpCircle, 
  RefreshCw, 
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { EnhancedError, getErrorSeverityColor, isRetryableError } from '@/lib/error-utils';
import { useState } from 'react';
import { toast } from 'sonner';

interface GlobalErrorDisplayProps {
  error: EnhancedError;
  onRetry?: () => void;
  onDismiss?: () => void;
  showTechnicalDetails?: boolean;
  className?: string;
}

const getErrorIcon = (type: EnhancedError['type']) => {
  switch (type) {
    case 'validation':
      return <AlertTriangle className="h-5 w-5" />;
    case 'network':
      return <Wifi className="h-5 w-5" />;
    case 'auth':
      return <Shield className="h-5 w-5" />;
    case 'server':
      return <Server className="h-5 w-5" />;
    case 'client':
      return <Monitor className="h-5 w-5" />;
    default:
      return <HelpCircle className="h-5 w-5" />;
  }
};

const getSeverityVariant = (severity: EnhancedError['severity']) => {
  switch (severity) {
    case 'low':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'high':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getTypeLabel = (type: EnhancedError['type']) => {
  switch (type) {
    case 'validation':
      return 'خطأ في البيانات';
    case 'network':
      return 'خطأ شبكة';
    case 'auth':
      return 'خطأ مصادقة';
    case 'server':
      return 'خطأ خادم';
    case 'client':
      return 'خطأ تطبيق';
    default:
      return 'خطأ غير معروف';
  }
};

const getSeverityLabel = (severity: EnhancedError['severity']) => {
  switch (severity) {
    case 'low':
      return 'منخفض';
    case 'medium':
      return 'متوسط';
    case 'high':
      return 'عالي';
    default:
      return 'غير محدد';
  }
};

export function GlobalErrorDisplay({
  error,
  onRetry,
  onDismiss,
  showTechnicalDetails = false,
  className = ''
}: GlobalErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleCopyError = async () => {
    setCopying(true);
    try {
      const errorText = `Error Type: ${error.type}\nSeverity: ${error.severity}\nMessage: ${error.message}\nCode: ${error.code || 'N/A'}\nTechnical Details: ${error.technicalDetails || 'N/A'}\nStack: ${error.stack || 'N/A'}`;
      await navigator.clipboard.writeText(errorText);
      toast.success('تم نسخ تفاصيل الخطأ');
    } catch (err) {
      toast.error('فشل في نسخ تفاصيل الخطأ');
    } finally {
      setCopying(false);
    }
  };

  const canRetry = isRetryableError(error);

  return (
    <div className={`space-y-4 ${className}`}>
      <Alert className={`border-l-4 ${getErrorSeverityColor(error.severity)}`}>
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <div className="flex-shrink-0 mt-0.5">
            {getErrorIcon(error.type)}
          </div>
          <div className="flex-1 min-w-0">
            <AlertTitle className="text-base font-semibold mb-2">
              {error.message}
            </AlertTitle>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant={getSeverityVariant(error.severity)} className="text-xs">
                {getTypeLabel(error.type)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                الأولوية: {getSeverityLabel(error.severity)}
              </Badge>
              {error.code && (
                <Badge variant="outline" className="text-xs font-mono">
                  {error.code}
                </Badge>
              )}
            </div>

            {error.userAction && (
              <AlertDescription className="text-sm text-muted-foreground mb-3">
                <strong>الإجراء المطلوب:</strong> {error.userAction}
              </AlertDescription>
            )}

            <div className="flex flex-wrap gap-2">
              {canRetry && onRetry && (
                <Button
                  onClick={onRetry}
                  size="sm"
                  variant="outline"
                  className="h-8"
                >
                  <RefreshCw className="w-3 h-3 me-1" />
                  إعادة المحاولة
                </Button>
              )}
              
              {onDismiss && (
                <Button
                  onClick={onDismiss}
                  size="sm"
                  variant="ghost"
                  className="h-8"
                >
                  إغلاق
                </Button>
              )}

              {showTechnicalDetails && (error.technicalDetails || error.stack) && (
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  size="sm"
                  variant="ghost"
                  className="h-8"
                >
                  {showDetails ? (
                    <ChevronUp className="w-3 h-3 me-1" />
                  ) : (
                    <ChevronDown className="w-3 h-3 me-1" />
                  )}
                  التفاصيل التقنية
                </Button>
              )}

              <Button
                onClick={handleCopyError}
                size="sm"
                variant="ghost"
                className="h-8"
                disabled={copying}
              >
                <Copy className="w-3 h-3 me-1" />
                {copying ? 'جاري النسخ...' : 'نسخ'}
              </Button>
            </div>
          </div>
        </div>
      </Alert>

      {showDetails && showTechnicalDetails && (error.technicalDetails || error.stack) && (
        <Card className="border-l-4 border-gray-300">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold mb-2 text-gray-700">
              التفاصيل التقنية
            </h4>
            
            {error.technicalDetails && (
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-1">رسالة الخطأ:</p>
                <pre className="text-xs bg-gray-50 p-2 rounded border overflow-auto max-h-32">
                  {error.technicalDetails}
                </pre>
              </div>
            )}
            
            {error.stack && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Stack Trace:</p>
                <pre className="text-xs bg-gray-50 p-2 rounded border overflow-auto max-h-40 font-mono">
                  {error.stack}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Inline version for smaller spaces
export function InlineErrorDisplay({ 
  error, 
  onRetry, 
  className = '' 
}: { 
  error: EnhancedError; 
  onRetry?: () => void; 
  className?: string; 
}) {
  const canRetry = isRetryableError(error);
  
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50 ${className}`}>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-red-800 truncate">
            {error.message}
          </p>
          {error.userAction && (
            <p className="text-xs text-red-600 mt-1">
              {error.userAction}
            </p>
          )}
        </div>
      </div>
      
      {canRetry && onRetry && (
        <Button
          onClick={onRetry}
          size="sm"
          variant="outline"
          className="ms-3 flex-shrink-0 h-7 text-xs"
        >
          <RefreshCw className="w-3 h-3 me-1" />
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}

// Hook for programmatic error display
export function useGlobalErrorDisplay() {
  const [error, setError] = useState<EnhancedError | null>(null);
  
  const showError = (error: EnhancedError) => {
    setError(error);
  };
  
  const clearError = () => {
    setError(null);
  };
  
  return { error, showError, clearError };
}