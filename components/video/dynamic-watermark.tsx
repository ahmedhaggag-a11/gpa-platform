"use client";

import { useState, useEffect } from "react";

interface DynamicWatermarkProps {
  userId: string;
  lessonId: string;
  isVisible?: boolean;
}

export default function DynamicWatermark({
  userId,
  lessonId,
  isVisible = true,
}: DynamicWatermarkProps) {
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [opacity, setOpacity] = useState(0.3);

  useEffect(() => {
    if (!isVisible) return;

    const moveWatermark = () => {
      // Get random position within the video container only
      // Use percentage-based positioning to stay within video bounds
      const maxX = 85; // Max 85% to leave space for watermark
      const maxY = 85; // Max 85% to leave space for watermark
      
      const newX = Math.random() * maxX;
      const newY = Math.random() * maxY;
      
      setPosition({ x: newX, y: newY });
      
      // Randomly change opacity for subtle effect
      setOpacity(0.2 + Math.random() * 0.3);
    };

    // Move watermark every 3-8 seconds randomly
    const interval = setInterval(moveWatermark, 3000 + Math.random() * 5000);
    
    // Initial position
    moveWatermark();

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="absolute pointer-events-none z-[9999] select-none transition-all duration-1000 ease-in-out"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        opacity,
        transform: 'rotate(-15deg)',
      }}
    >
      <div className="bg-black/70 text-white px-3 py-1 rounded text-xs font-mono backdrop-blur-sm border border-white/10">
        <div>User: {userId}</div>
        <div>Lesson: {lessonId}</div>
        <div className="text-[10px] text-white">
          {new Date().toLocaleTimeString([], { hour12: false }) + '.' + String(new Date().getMilliseconds()).padStart(3, '0')}
      </div>
      </div>
    </div>
  );
}