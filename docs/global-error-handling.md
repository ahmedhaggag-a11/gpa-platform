# Global Error Handling System

This document describes the global error handling system that replaces the auth-specific error boundary with a more comprehensive solution.

## Overview

The global error handling system provides:
- Universal error catching for any type of error (not just authentication)
- Enhanced error categorization and user-friendly messages
- Consistent error display across the application
- Backward compatibility with existing auth error boundary usage

## Components

### 1. Error Utilities (`/lib/error-utils.ts`)

Provides core error enhancement functionality:

```typescript
import { enhanceError, formatErrorForLogging, shouldReportError } from '@/lib/error-utils';

// Enhance any error with additional context
const enhancedError = enhanceError(someError);

// Check if error should be retried
const canRetry = isRetryableError(enhancedError);
```

**Error Types:**
- `validation` - Form validation, input errors
- `network` - Connection, fetch, timeout errors
- `auth` - Authentication and authorization errors
- `server` - Server-side errors (5xx)
- `client` - Client-side JavaScript errors
- `unknown` - Unclassified errors

**Severity Levels:**
- `low` - Minor issues, user can continue
- `medium` - Moderate issues, may need user action
- `high` - Critical issues, requires immediate attention

### 2. Global Error Display (`/components/ui/global-error-display.tsx`)

Provides rich error display components:

```typescript
import { GlobalErrorDisplay, InlineErrorDisplay } from '@/components/ui/global-error-display';

// Full error display with all features
<GlobalErrorDisplay 
  error={enhancedError}
  onRetry={handleRetry}
  showTechnicalDetails={true}
/>

// Compact inline display
<InlineErrorDisplay 
  error={enhancedError}
  onRetry={handleRetry}
/>
```

### 3. Global Error Boundary (`/components/ui/global-error-boundary.tsx`)

The main error boundary component:

```typescript
import GlobalErrorBoundary from '@/components/ui/global-error-boundary';

// Basic usage
<GlobalErrorBoundary>
  <YourComponent />
</GlobalErrorBoundary>

// With custom error handler
<GlobalErrorBoundary 
  onError={(error, errorInfo) => {
    // Custom error handling logic
  }}
  showTechnicalDetails={true}
>
  <YourComponent />
</GlobalErrorBoundary>
```

## Usage Examples

### 1. Wrapping Your App

```typescript
// app/layout.tsx
import GlobalErrorBoundary from '@/components/ui/global-error-boundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GlobalErrorBoundary showTechnicalDetails={process.env.NODE_ENV === 'development'}>
          {children}
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
```

### 2. Page-Level Error Boundaries

```typescript
// app/dashboard/page.tsx
import GlobalErrorBoundary from '@/components/ui/global-error-boundary';

export default function DashboardPage() {
  return (
    <GlobalErrorBoundary>
      <DashboardContent />
    </GlobalErrorBoundary>
  );
}
```

### 3. Component-Level Error Boundaries

```typescript
// components/data-table.tsx
import { withErrorBoundary } from '@/components/ui/global-error-boundary';

function DataTable({ data }) {
  // Component logic that might throw errors
  return <div>{/* table content */}</div>;
}

// Wrap with error boundary
export default withErrorBoundary(DataTable, {
  showTechnicalDetails: false
});
```

### 4. Programmatic Error Handling

```typescript
// hooks/use-api.ts
import { useErrorBoundary } from '@/components/ui/global-error-boundary';
import { enhanceError } from '@/lib/error-utils';

export function useApi() {
  const { captureError } = useErrorBoundary();
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      // This will trigger the error boundary
      captureError(enhanceError(error));
    }
  };
  
  return { fetchData };
}
```

### 5. Custom Error Fallback

```typescript
// components/custom-error-fallback.tsx
import { GlobalErrorDisplay } from '@/components/ui/global-error-display';
import { enhanceError } from '@/lib/error-utils';

function CustomErrorFallback({ error, retry }) {
  const enhancedError = enhanceError(error);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg">
        <h1>Something went wrong</h1>
        <GlobalErrorDisplay 
          error={enhancedError}
          onRetry={retry}
          showTechnicalDetails={true}
        />
      </div>
    </div>
  );
}

// Use with error boundary
<GlobalErrorBoundary fallback={CustomErrorFallback}>
  <App />
</GlobalErrorBoundary>
```

## Migration from Auth Error Boundary

The existing `AuthErrorBoundary` has been updated to use the global error boundary internally, so **no code changes are required** for existing usage:

```typescript
// This still works exactly the same
import AuthErrorBoundary from '@/components/auth/auth-error-boundary';

<AuthErrorBoundary>
  <LoginForm />
</AuthErrorBoundary>
```

However, you can now use the more powerful global error boundary:

```typescript
// New recommended approach
import GlobalErrorBoundary from '@/components/ui/global-error-boundary';

<GlobalErrorBoundary showTechnicalDetails={true}>
  <LoginForm />
</GlobalErrorBoundary>
```

## Error Reporting Integration

To integrate with error reporting services (Sentry, Bugsnag, etc.):

```typescript
// lib/error-reporting.ts
import * as Sentry from '@sentry/nextjs';
import { shouldReportError } from '@/lib/error-utils';

export function reportError(error: Error, errorInfo?: React.ErrorInfo) {
  const enhancedError = enhanceError(error);
  
  if (shouldReportError(enhancedError)) {
    Sentry.captureException(error, {
      extra: errorInfo,
      tags: {
        errorType: enhancedError.type,
        severity: enhancedError.severity
      }
    });
  }
}

// Use in error boundary
<GlobalErrorBoundary 
  onError={(error, errorInfo) => reportError(error, errorInfo)}
>
  <App />
</GlobalErrorBoundary>
```

## Best Practices

1. **Place error boundaries strategically**: At app level, page level, and around complex components
2. **Use appropriate technical details**: Show in development, hide in production
3. **Provide meaningful retry actions**: Only show retry for recoverable errors
4. **Log errors appropriately**: Use `formatErrorForLogging` for consistent logging
5. **Report critical errors**: Use `shouldReportError` to determine what to send to error tracking
6. **Handle async errors**: Use `useErrorBoundary` hook for async operations

## Configuration

The error system can be configured through environment variables:

```env
# Show technical details in error displays
NEXT_PUBLIC_SHOW_ERROR_DETAILS=true

# Error reporting service configuration
SENTRY_DSN=your_sentry_dsn
```

## Troubleshooting

### Error Boundary Not Catching Errors

- Error boundaries only catch errors in React components during rendering
- For async errors, use the `useErrorBoundary` hook
- Event handlers need manual error handling

### Missing Error Details

- Check if `showTechnicalDetails` is enabled
- Verify error enhancement is working correctly
- Ensure error has proper stack trace

### Styling Issues

- Error displays use Tailwind CSS classes
- Customize through the `className` prop
- Override default styles in your CSS