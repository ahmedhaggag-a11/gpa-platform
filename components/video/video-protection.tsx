"use client";

import { useState, useEffect, useCallback } from "react";

interface VideoProtectionProps {
  children: React.ReactNode;
  onViolationDetected?: () => void;
}

export default function VideoProtection({
  children,
  onViolationDetected,
}: VideoProtectionProps) {
  const [isBlurred, setIsBlurred] = useState(false);
  const [violationType, setViolationType] = useState<string | null>(null);
  const [tabSwitchTime, setTabSwitchTime] = useState<number | null>(null);

  // Screen recording detection
  const detectScreenRecording = useCallback(() => {
    // Check for screen recording APIs
    if (typeof navigator !== 'undefined') {
      // Check if getDisplayMedia is being used
      const originalGetDisplayMedia = navigator.mediaDevices?.getDisplayMedia;
      if (originalGetDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia = function(...args) {
          setIsBlurred(true);
          setViolationType('Screen Recording Detected');
          onViolationDetected?.();
          return originalGetDisplayMedia.apply(this, args);
        };
      }
    }
  }, [onViolationDetected]);

  // Developer tools detection
  const detectDevTools = useCallback(() => {
    let devtools = { open: false };
    
    const threshold = 160;
    
    setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          setIsBlurred(true);
          setViolationType('Developer Tools Detected');
          onViolationDetected?.();
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    // Additional detection methods
    const detectByConsole = () => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      if (end - start > 100) {
        setIsBlurred(true);
        setViolationType('Debugger Detected');
        onViolationDetected?.();
      }
    };

    setInterval(detectByConsole, 1000);
  }, [onViolationDetected]);

  // Disable common shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+Shift+C
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) ||
      (e.ctrlKey && e.shiftKey && e.key === 'K') // Firefox console
    ) {
      e.preventDefault();
      e.stopPropagation();
      setIsBlurred(true);
      setViolationType('Unauthorized Shortcut Detected');
      onViolationDetected?.();
      return false;
    }
  }, [onViolationDetected]);

  // Disable right-click context menu
  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    return false;
  }, []);

  // Disable text selection
  const handleSelectStart = useCallback((e: Event) => {
    e.preventDefault();
    return false;
  }, []);

  // Disable drag and drop
  const handleDragStart = useCallback((e: DragEvent) => {
    e.preventDefault();
    return false;
  }, []);

  // Blur detection (when user switches tabs/windows)
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // User switched away - record the time
      setTabSwitchTime(Date.now());
    } else {
      // User returned - check if more than 2 minutes have passed
      if (tabSwitchTime !== null) {
        const timeAway = Date.now() - tabSwitchTime;
        const twoMinutesInMs = 2 * 60 * 1000; // 2 minutes in milliseconds
        
        if (timeAway > twoMinutesInMs) {
          setIsBlurred(true);
          setViolationType('Extended Tab/Window Switch Detected (>2 minutes)');
          onViolationDetected?.();
        }
        
        // Reset the timer
        setTabSwitchTime(null);
      }
    }
  }, [onViolationDetected, tabSwitchTime]);

  useEffect(() => {
    detectScreenRecording();
    detectDevTools();

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Disable print
    window.addEventListener('beforeprint', (e) => {
      e.preventDefault();
      setIsBlurred(true);
      setViolationType('Print Attempt Detected');
      onViolationDetected?.();
    });

    // Clear selection periodically
    const clearSelection = setInterval(() => {
      if (window.getSelection) {
        window.getSelection()?.removeAllRanges();
      }
    }, 1000);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(clearSelection);
    };
  }, [handleKeyDown, handleContextMenu, handleSelectStart, handleDragStart, handleVisibilityChange, detectScreenRecording, detectDevTools]);

  return (
    <div className="relative">
      {children}
      
      {/* Blur overlay when violation is detected */}
      {isBlurred && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-lg flex items-center justify-center">
          <div className="bg-red-600 text-white p-6 rounded-lg text-center max-w-md">
            <h2 className="text-xl font-bold mb-2">Security Violation Detected</h2>
            <p className="mb-4">{violationType}</p>
            <p className="text-sm opacity-90">
              This content is protected. Please close any recording software or developer tools and refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-white text-red-600 px-4 py-2 rounded font-medium hover:bg-gray-100"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}