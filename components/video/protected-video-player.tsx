"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import DynamicWatermark from "./dynamic-watermark";
import VideoProtection from "./video-protection";
import Hls from "hls.js";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from "media-chrome/react";

interface ProtectedVideoPlayerProps {
  url: string;
  userId: string;
  lessonId: string;
  onProgress?: (progress: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => void;
  onDuration?: (duration: number) => void;
  onEnded?: () => void;
  playing?: boolean;
  onPlayPause?: (playing: boolean) => void;
}

export default function ProtectedVideoPlayer({
  url,
  userId,
  lessonId,
  onProgress,
  onDuration,
  onEnded,
  playing = false,
  onPlayPause,
}: ProtectedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isViolationDetected, setIsViolationDetected] = useState(false);
  const [lastValidTime, setLastValidTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleViolationDetected = useCallback(() => {
    setIsViolationDetected(true);
    // Pause the video when violation is detected
    onPlayPause?.(false);
  }, [onPlayPause]);

  const handleProgress = useCallback(() => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 0;

    // Update lastValidTime to current position (allow normal seeking)
    setLastValidTime(currentTime);

    onProgress?.({
      played: duration > 0 ? currentTime / duration : 0,
      playedSeconds: currentTime,
      loaded:
        duration > 0
          ? videoRef.current.buffered.length > 0
            ? videoRef.current.buffered.end(0) / duration
            : 0
          : 0,
      loadedSeconds:
        videoRef.current.buffered.length > 0
          ? videoRef.current.buffered.end(0)
          : 0,
    });
  }, [onProgress]);

  // Removed handleSeek function as seeking is now handled directly in video event handlers

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      // Enter fullscreen
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }, [isFullscreen]);

  // Initialize HLS and handle video source
  useEffect(() => {
    if (!videoRef.current || !url) return;

    const video = videoRef.current;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Check if the URL is an HLS stream
    if (url.includes(".m3u8") && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
      });

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest parsed");
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
      });

      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = url;
    } else {
      // Regular video file
      video.src = url;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url]);

  // Handle play/pause state
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (playing && !isViolationDetected) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, [playing, isViolationDetected]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement ||
        (document as any).mozFullScreenElement
      );
      console.log("Fullscreen state changed:", isCurrentlyFullscreen);
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // Add multiple event listeners for different browsers
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleFullscreenChange);
    window.addEventListener("resize", handleFullscreenChange);

    // Also check periodically in case events are missed
    const interval = setInterval(handleFullscreenChange, 100);

    // Initial check
    handleFullscreenChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener("visibilitychange", handleFullscreenChange);
      window.removeEventListener("resize", handleFullscreenChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <VideoProtection onViolationDetected={handleViolationDetected}>
      <div ref={containerRef} className="relative w-full h-full">
        {/* Video Player */}
        <div
          className="relative w-full h-full"
          onContextMenu={(e) => e.preventDefault()}
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
        >
          <MediaController
            style={{
              width: "100%",
              aspectRatio: "16/9",
            }}
          >
            <video
              ref={videoRef}
              slot="media"
              src={url}
              width="100%"
              height="100%"
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              onTimeUpdate={handleProgress}
              onLoadedMetadata={() =>
                onDuration?.(videoRef.current?.duration || 0)
              }
              onEnded={onEnded}
              onSeeked={() => {
                if (videoRef.current) {
                  const currentTime = videoRef.current.currentTime;
                  // Update lastValidTime to current position after seek
                  setLastValidTime(currentTime);
                }
                handleProgress();
              }}
              onPlay={() => onPlayPause?.(true)}
              onPause={() => onPlayPause?.(false)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
            <MediaControlBar>
              <MediaPlayButton />
              <MediaSeekBackwardButton seekOffset={10} />
              <MediaSeekForwardButton seekOffset={10} />
              <MediaTimeRange />
              <MediaTimeDisplay showDuration />
              <MediaMuteButton />
              <MediaVolumeRange />
              <MediaPlaybackRateButton />
              {/* <MediaFullscreenButton /> */}
            </MediaControlBar>
          </MediaController>
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70 transition-opacity z-40"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            )}
          </button>

          <div
            className="absolute inset-0 z-10"
            onContextMenu={(e) => e.preventDefault()}
            onSelectStart={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            style={{
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              pointerEvents: "none", // Allow clicks to pass through to video controls
            }}
          />
        </div>

        {/* Dynamic Watermark - positioned within video container */}
        <div
          className={`absolute inset-0 pointer-events-none ${
            isFullscreen ? "z-[9999]" : "z-30"
          }`}
          style={{
            zIndex: isFullscreen ? 9999 : 30,
          }}
        >
          {" "}
          <DynamicWatermark
            userId={userId}
            lessonId={lessonId}
            isVisible={!isViolationDetected}
          />
        </div>
      </div>
    </VideoProtection> 
  );
}
