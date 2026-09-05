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
  HelpCircle, 
  RefreshCw, 
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { EnhancedAuthError, getErrorSeverityColor, isRetryableError } from '@/lib/auth-errors';
import { useState } from 'react';
import { toast } from 'sonner';

interface EnhancedErrorDisplayProps {
  error: EnhancedAuthError;
  onRetry?: () => void;
  onDismiss?: () => void;
  showTechnicalDetails?: boolean;
  className?: string;
}

const getErrorIcon = (type: EnhancedAuthError['type']) => {
  switch (type) {
    case 'validation':
      return <AlertTriangle className="h-5 w-5" />;
    case 'network':
      return <Wifi className="h-5 w-5" />;
    case 'auth':
      return <Shield className="h-5 w-5" />;
    case 'server':
      return <Server className="h-5 w-5" />;
    default:
      return <HelpCircle className="h-5 w-5" />;
  }
};

const getSeverityVariant = (severity: EnhancedAuthError['severity']) => {
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

const getTypeLabel = (type: EnhancedAuthError['type']) => {
  switch (type) {
    case 'validation':
      return 'خطأ في البيانات';
    case 'network':
      return 'خطأ في الشبكة';
    case 'auth':
      return 'خطأ في المصادقة';
    case 'server':
      return 'خطأ في الخادم';
    default:
      return 'خطأ غير معروف';
  }
};

const getSeverityLabel = (severity: EnhancedAuthError['severity']) => {
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

export function EnhancedErrorDisplay({
  error,
  onRetry,
  onDismiss,
  showTechnicalDetails = false,
  className = ''
}: EnhancedErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry && !isRetrying) {
      setIsRetrying(true);
      try {
        await onRetry();
      } catch (err) {
        console.error('Retry failed:', err);
      } finally {
        setIsRetrying(false);
      }
    }
  };

  const copyTechnicalDetails = () => {
    if (error.technicalDetails) {
      navigator.clipboard.writeText(error.technicalDetails);
      toast.success('تم نسخ التفاصيل التقنية');
    }
  };

  const canRetry = isRetryableError(error) && onRetry;

  return (
    <Card className={`border-l-4 ${className}`} style={{ borderLeftColor: getErrorSeverityColor(error.severity) }}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5" style={{ color: getErrorSeverityColor(error.severity) }}>
            {getErrorIcon(error.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Error Header */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getSeverityVariant(error.severity)} className="text-xs">
                {getTypeLabel(error.type)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getSeverityLabel(error.severity)}
              </Badge>
              {error.code && (
                <Badge variant="outline" className="text-xs font-mono">
                  {error.code}
                </Badge>
              )}
            </div>

            {/* Error Message */}
            <h4 className="font-semibold text-foreground mb-1">
              {error.message}
            </h4>

            {/* User Action */}
            {error.userAction && (
              <p className="text-sm text-muted-foreground mb-3">
                💡 {error.userAction}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-3">
              {canRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="h-8"
                >
                  <RefreshCw className={`h-3 w-3 me-1 ${isRetrying ? 'animate-spin' : ''}`} />
                  {isRetrying ? 'جاري المحاولة...' : 'إعادة المحاولة'}
                </Button>
              )}
              
              {onDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDismiss}
                  className="h-8"
                >
                  إغلاق
                </Button>
              )}
              
              {error.type === 'network' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open('https://www.speedtest.net/', '_blank')}
                  className="h-8"
                >
                  <ExternalLink className="h-3 w-3 me-1" />
                  اختبار الاتصال
                </Button>
              )}
            </div>

            {/* Technical Details Toggle */}
            {(showTechnicalDetails || error.technicalDetails) && (
              <div className="border-t pt-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowDetails(!showDetails)}
                  className="h-6 p-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showDetails ? (
                    <ChevronUp className="h-3 w-3 me-1" />
                  ) : (
                    <ChevronDown className="h-3 w-3 me-1" />
                  )}
                  التفاصيل التقنية
                </Button>
                
                {showDetails && error.technicalDetails && (
                  <div className="mt-2 p-2 bg-muted rounded text-xs font-mono text-muted-foreground">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-sans">رسالة الخطأ التقنية:</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyTechnicalDetails}
                        className="h-5 w-5 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="break-all">
                      {error.technicalDetails}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Simplified version for inline display
export function InlineErrorDisplay({ 
  error, 
  onRetry, 
  className = '' 
}: { 
  error: EnhancedAuthError; 
  onRetry?: () => void; 
  className?: string; 
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry && !isRetrying) {
      setIsRetrying(true);
      try {
        await onRetry();
      } catch (err) {
        console.error('Retry failed:', err);
      } finally {
        setIsRetrying(false);
      }
    }
  };

  const canRetry = isRetryableError(error) && onRetry;

  return (
    <Alert className={className} variant={error.severity === 'high' ? 'destructive' : 'default'}>
      <div style={{ color: getErrorSeverityColor(error.severity) }}>
        {getErrorIcon(error.type)}
      </div>
      <AlertTitle className="flex items-center gap-2">
        {error.message}
        <Badge variant="outline" className="text-xs">
          {getTypeLabel(error.type)}
        </Badge>
      </AlertTitle>
      {error.userAction && (
        <AlertDescription className="mt-1">
          {error.userAction}
          {canRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleRetry}
              disabled={isRetrying}
              className="ms-2 h-6"
            >
              <RefreshCw className={`h-3 w-3 me-1 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'جاري المحاولة...' : 'إعادة المحاولة'}
            </Button>
          )}
        </AlertDescription>
      )}
    </Alert>
  );
}

// Hook for using enhanced error display
export function useEnhancedErrorDisplay() {
  const [currentError, setCurrentError] = useState<EnhancedAuthError | null>(null);
  
  const showError = (error: EnhancedAuthError) => {
    setCurrentError(error);
  };
  
  const clearError = () => {
    setCurrentError(null);
  };
  
  return {
    currentError,
    showError,
    clearError
  };
}