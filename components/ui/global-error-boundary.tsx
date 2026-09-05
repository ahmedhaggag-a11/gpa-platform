"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { enhanceError, formatErrorForLogging, shouldReportError } from "@/lib/error-utils";
import { GlobalErrorDisplay } from "./global-error-display";
import type { EnhancedError } from "@/lib/error-utils";

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showTechnicalDetails?: boolean;
}

class GlobalErrorBoundary extends React.Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): GlobalErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const enhancedError = enhanceError(error);
    console.error("Global Error Boundary caught an error:", formatErrorForLogging(enhancedError));
    console.error("Error Info:", errorInfo);
    
    // Report critical errors
    if (shouldReportError(enhancedError)) {
      console.error("Critical error reported to error tracking:", enhancedError);
      // In a real app, you would send this to your error tracking service
      // errorTrackingService.captureException(error, { extra: errorInfo });
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return (
        <EnhancedErrorFallback 
          error={this.state.error} 
          retry={this.retry} 
          showTechnicalDetails={this.props.showTechnicalDetails}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  retry: () => void;
  showTechnicalDetails?: boolean;
}

function EnhancedErrorFallback({ error, retry, showTechnicalDetails = false }: ErrorFallbackProps) {
  const enhancedError = enhanceError(error);
  
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <GlobalErrorDisplay 
            error={enhancedError}
            onRetry={retry}
            showTechnicalDetails={showTechnicalDetails}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Keep the original as a fallback for simple cases
function DefaultErrorFallback({ error, retry }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            حدث خطأ غير متوقع
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
          </p>
          {error && (
            <details className="text-start">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                تفاصيل الخطأ
              </summary>
              <pre className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          <Button onClick={retry} className="w-full">
            <RefreshCw className="me-2 h-4 w-4" />
            المحاولة مرة أخرى
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for using error boundary programmatically
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);
  
  const resetError = React.useCallback(() => {
    setError(null);
  }, []);
  
  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);
  
  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);
  
  return { captureError, resetError };
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<GlobalErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <GlobalErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </GlobalErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export default GlobalErrorBoundary;
export { DefaultErrorFallback, EnhancedErrorFallback };
export type { GlobalErrorBoundaryProps, ErrorFallbackProps };