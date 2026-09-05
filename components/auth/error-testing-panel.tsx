"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GlobalErrorDisplay, InlineErrorDisplay } from '@/components/ui/global-error-display';
import { enhanceError, EnhancedError } from '@/lib/error-utils';
import { toast } from 'sonner';

// Sample error scenarios for testing
const ERROR_SCENARIOS = {
  'invalid_credentials': {
    message: 'Invalid login credentials',
    error_code: 'invalid_credentials'
  },
  'email_not_confirmed': {
    message: 'Email not confirmed',
    error_code: 'email_not_confirmed'
  },
  'user_already_registered': {
    message: 'User already registered',
    error_code: 'user_already_registered'
  },
  'too_many_requests': {
    message: 'Too many requests',
    error_code: 'too_many_requests'
  },
  'weak_password': {
    message: 'Password is too weak',
    error_code: 'weak_password'
  },
  'network_error': {
    message: 'Network connection failed',
    error: 'fetch failed'
  },
  'server_error': {
    message: 'Internal server error',
    status: 500
  },
  'validation_error': {
    message: 'Email address is invalid',
    error_code: 'email_address_invalid'
  },
  'session_expired': {
    message: 'Session has expired',
    error_code: 'token_expired'
  },
  'signup_disabled': {
    message: 'Sign up is disabled',
    error_code: 'signup_disabled'
  },
  'unknown_error': {
    message: 'Something went wrong',
  }
};

interface ErrorTestingPanelProps {
  className?: string;
}

export function ErrorTestingPanel({ className = '' }: ErrorTestingPanelProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [currentError, setCurrentError] = useState<EnhancedError | null>(null);
  const [displayMode, setDisplayMode] = useState<'card' | 'inline' | 'toast'>('card');

  const simulateError = (scenarioKey: string) => {
    const scenario = ERROR_SCENARIOS[scenarioKey as keyof typeof ERROR_SCENARIOS];
    if (!scenario) return;

    const enhancedError = enhanceError(scenario);
    setCurrentError(enhancedError);

    if (displayMode === 'toast') {
      const icon = enhancedError.type === 'validation' ? '⚠️' : 
                   enhancedError.type === 'network' ? '🌐' : 
                   enhancedError.type === 'auth' ? '🔐' : 
                   enhancedError.type === 'server' ? '🔧' : '❓';
      
      toast.error(`${icon} ${enhancedError.message}`, {
        description: enhancedError.userAction,
        duration: enhancedError.severity === 'high' ? 8000 : 5000,
      });
    }
  };

  const handleRetry = () => {
    toast.success('🔄 محاولة إعادة الاتصال...');
    setTimeout(() => {
      setCurrentError(null);
      toast.success('✅ تم حل المشكلة بنجاح!');
    }, 2000);
  };

  const clearError = () => {
    setCurrentError(null);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🧪 لوحة اختبار الأخطاء المحسنة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">اختر سيناريو الخطأ:</label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الخطأ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invalid_credentials">بيانات دخول خاطئة</SelectItem>
                  <SelectItem value="email_not_confirmed">بريد إلكتروني غير مؤكد</SelectItem>
                  <SelectItem value="user_already_registered">مستخدم مسجل مسبقاً</SelectItem>
                  <SelectItem value="too_many_requests">محاولات كثيرة</SelectItem>
                  <SelectItem value="weak_password">كلمة مرور ضعيفة</SelectItem>
                  <SelectItem value="network_error">خطأ في الشبكة</SelectItem>
                  <SelectItem value="server_error">خطأ في الخادم</SelectItem>
                  <SelectItem value="validation_error">خطأ في التحقق</SelectItem>
                  <SelectItem value="session_expired">انتهاء الجلسة</SelectItem>
                  <SelectItem value="signup_disabled">التسجيل معطل</SelectItem>
                  <SelectItem value="unknown_error">خطأ غير معروف</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">طريقة العرض:</label>
              <Select value={displayMode} onValueChange={(value: 'card' | 'inline' | 'toast') => setDisplayMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">بطاقة مفصلة</SelectItem>
                  <SelectItem value="inline">عرض مبسط</SelectItem>
                  <SelectItem value="toast">إشعار منبثق</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => selectedScenario && simulateError(selectedScenario)}
              disabled={!selectedScenario}
              variant="destructive"
            >
              🚨 محاكاة الخطأ
            </Button>
            
            <Button 
              onClick={clearError}
              variant="outline"
              disabled={!currentError}
            >
              🧹 مسح الخطأ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display Area */}
      {currentError && displayMode !== 'toast' && (
        <div className="space-y-4">
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📋 عرض الخطأ
              <Badge variant="outline">{displayMode === 'card' ? 'مفصل' : 'مبسط'}</Badge>
            </h3>
            
            {displayMode === 'card' ? (
              <GlobalErrorDisplay
                error={currentError}
                onRetry={handleRetry}
                onDismiss={clearError}
                showTechnicalDetails={true}
              />
            ) : (
              <InlineErrorDisplay
                error={currentError}
                onRetry={handleRetry}
              />
            )}
          </div>
        </div>
      )}

      {/* Error Details Panel */}
      {currentError && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">🔍 تفاصيل الخطأ المحسن</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>الرسالة:</strong>
                <p className="mt-1 p-2 bg-muted rounded">{currentError.message}</p>
              </div>
              
              <div>
                <strong>النوع:</strong>
                <p className="mt-1">
                  <Badge variant="outline">{currentError.type}</Badge>
                </p>
              </div>
              
              <div>
                <strong>الخطورة:</strong>
                <p className="mt-1">
                  <Badge 
                    variant={currentError.severity === 'high' ? 'destructive' : 'default'}
                  >
                    {currentError.severity}
                  </Badge>
                </p>
              </div>
              
              {currentError.code && (
                <div>
                  <strong>الكود:</strong>
                  <p className="mt-1">
                    <Badge variant="outline" className="font-mono">{currentError.code}</Badge>
                  </p>
                </div>
              )}
              
              {currentError.userAction && (
                <div className="md:col-span-2">
                  <strong>الإجراء المطلوب:</strong>
                  <p className="mt-1 p-2 bg-blue-50 dark:bg-blue-950 rounded text-blue-800 dark:text-blue-200">
                    💡 {currentError.userAction}
                  </p>
                </div>
              )}
              
              {currentError.technicalDetails && (
                <div className="md:col-span-2">
                  <strong>التفاصيل التقنية:</strong>
                  <p className="mt-1 p-2 bg-muted rounded font-mono text-xs break-all">
                    {currentError.technicalDetails}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📚 أمثلة الاستخدام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>🔐 أخطاء المصادقة:</strong>
              <p className="text-muted-foreground">بيانات دخول خاطئة، بريد غير مؤكد، مستخدم مسجل مسبقاً</p>
            </div>
            
            <div>
              <strong>🌐 أخطاء الشبكة:</strong>
              <p className="text-muted-foreground">انقطاع الاتصال، مهلة زمنية منتهية، خادم غير متاح</p>
            </div>
            
            <div>
              <strong>⚠️ أخطاء التحقق:</strong>
              <p className="text-muted-foreground">بيانات غير صحيحة، كلمة مرور ضعيفة، بريد إلكتروني خاطئ</p>
            </div>
            
            <div>
              <strong>🔧 أخطاء الخادم:</strong>
              <p className="text-muted-foreground">خطأ داخلي، خدمة غير متاحة، قاعدة بيانات معطلة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}