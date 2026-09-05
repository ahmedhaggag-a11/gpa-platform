# Enhanced Auth Error Handling System

This document describes the enhanced authentication error handling system for Supabase integration.

## Overview

The enhanced auth error handling system provides:
- User-friendly Arabic error messages
- Categorized error types with appropriate UI feedback
- Retry mechanisms for recoverable errors
- Comprehensive error logging and reporting
- Visual error indicators with icons and severity levels

## Core Components

### 1. Auth Error Utilities (`lib/auth-errors.ts`)

Provides the foundation for enhanced error handling:

```typescript
import { enhanceAuthError, isRetryableError, getErrorSeverityColor } from '@/lib/auth-errors';

// Enhance a Supabase error
const enhancedError = enhanceAuthError(supabaseError);

// Check if error is retryable
if (isRetryableError(enhancedError)) {
  // Show retry option
}
```

### 2. Enhanced Error Display Components

#### EnhancedErrorDisplay
Full-featured error display with all details:

```tsx
import { EnhancedErrorDisplay } from '@/components/auth/enhanced-error-display';

<EnhancedErrorDisplay 
  error={enhancedError}
  onRetry={() => handleRetry()}
  showTechnicalDetails={true}
/>
```

#### InlineErrorDisplay
Compact inline error display:

```tsx
import { InlineErrorDisplay } from '@/components/auth/enhanced-error-display';

<InlineErrorDisplay 
  error={enhancedError}
  onRetry={() => handleRetry()}
/>
```

### 3. Enhanced Auth Context

The auth context now includes enhanced error handling:

```typescript
const { signIn, signUp, signOut, errorDetails } = useAuth();

// errorDetails contains the enhanced error information
if (errorDetails) {
  console.log('Error category:', errorDetails.category);
  console.log('User message:', errorDetails.userMessage);
  console.log('Suggested action:', errorDetails.userAction);
}
```

## Error Categories

Errors are categorized for better handling:

- **VALIDATION**: Input validation errors (email format, password strength)
- **AUTHENTICATION**: Login/signup failures
- **AUTHORIZATION**: Permission denied errors
- **NETWORK**: Connection and timeout issues
- **RATE_LIMIT**: Too many requests
- **SERVER**: Internal server errors
- **UNKNOWN**: Unrecognized errors

## Severity Levels

- **LOW**: Minor issues, user can continue
- **MEDIUM**: Significant issues, user action required
- **HIGH**: Critical issues, immediate attention needed
- **CRITICAL**: System-level failures

## Usage Examples

### Basic Error Handling in Forms

```tsx
import { useAuthActions } from '@/hooks/use-auth';
import { InlineErrorDisplay } from '@/components/auth/enhanced-error-display';

function SignInForm() {
  const { signIn, isLoading, error } = useAuthActions();
  
  const handleSubmit = async (data) => {
    await signIn(data.email, data.password);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      
      {error && (
        <InlineErrorDisplay 
          error={error}
          onRetry={() => handleSubmit(lastFormData)}
        />
      )}
      
      <button type="submit" disabled={isLoading}>
        تسجيل الدخول
      </button>
    </form>
  );
}
```

### Error Boundary Integration

```tsx
import { AuthErrorBoundary } from '@/components/auth/auth-error-boundary';

function App() {
  return (
    <AuthErrorBoundary>
      <YourAuthenticatedApp />
    </AuthErrorBoundary>
  );
}
```

### Custom Error Handling

```tsx
import { enhanceAuthError, shouldReportError } from '@/lib/auth-errors';

function customErrorHandler(error: Error) {
  const enhancedError = enhanceAuthError(error);
  
  // Log for debugging
  console.error('Enhanced error:', enhancedError);
  
  // Report critical errors
  if (shouldReportError(enhancedError)) {
    // Send to error tracking service
    errorTracker.captureException(error, {
      extra: enhancedError
    });
  }
  
  // Show user-friendly message
  toast.error(enhancedError.userMessage);
}
```

## Testing

Use the Error Testing Panel for development:

```tsx
import { ErrorTestingPanel } from '@/components/auth/error-testing-panel';

// Add to your development environment
<ErrorTestingPanel />
```

## Configuration

### Customizing Error Messages

Edit `lib/auth-errors.ts` to customize error messages:

```typescript
const SUPABASE_ERROR_MESSAGES: Record<string, ErrorMapping> = {
  'invalid_credentials': {
    userMessage: 'بيانات الدخول غير صحيحة',
    userAction: 'تحقق من البريد الإلكتروني وكلمة المرور',
    category: 'AUTHENTICATION',
    severity: 'MEDIUM',
    retryable: true
  },
  // Add more mappings...
};
```

### Adding New Error Types

1. Add the error code to `SUPABASE_ERROR_MESSAGES`
2. Define the user message in Arabic
3. Set appropriate category and severity
4. Specify if the error is retryable

## Best Practices

1. **Always enhance errors**: Use `enhanceAuthError()` for all Supabase errors
2. **Provide user actions**: Include clear instructions for users
3. **Use appropriate severity**: Match severity to actual impact
4. **Enable retry for recoverable errors**: Network issues, rate limits, etc.
5. **Log enhanced errors**: Use `formatErrorForLogging()` for consistent logging
6. **Report critical errors**: Use `shouldReportError()` to determine what to report

## Troubleshooting

### Common Issues

1. **Missing error mappings**: Add new Supabase error codes to the mapping
2. **Incorrect Arabic text**: Ensure proper RTL text direction
3. **Missing icons**: Verify Lucide React icons are installed
4. **Toast not showing**: Check if toast provider is configured

### Debug Mode

Enable detailed logging by setting the error severity to 'CRITICAL' temporarily:

```typescript
// In development
const enhancedError = {
  ...enhanceAuthError(error),
  severity: 'CRITICAL' as const
};
```

This will ensure the error is logged and reported for debugging.