"use client";

import React from "react";
import GlobalErrorBoundary from "@/components/ui/global-error-boundary";
import type { GlobalErrorBoundaryProps } from "@/components/ui/global-error-boundary";

// Re-export the global error boundary as AuthErrorBoundary for backward compatibility
// This maintains existing usage while providing global error handling capabilities

// Backward compatible interface
interface AuthErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

// Wrapper component that uses the global error boundary
function AuthErrorBoundary({ children, fallback }: AuthErrorBoundaryProps) {
  return (
    <GlobalErrorBoundary 
      fallback={fallback}
      showTechnicalDetails={true}
    >
      {children}
    </GlobalErrorBoundary>
  );
}

// Re-export components from global error boundary for backward compatibility
export { DefaultErrorFallback, EnhancedErrorFallback } from "@/components/ui/global-error-boundary";
export default AuthErrorBoundary;