'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { TechCoreCanvasProps } from './TechCoreCanvas';

// Dynamic import with SSR disabled to eliminate hydration issues
const TechCoreCanvas = dynamic(() => import('./TechCoreCanvas'), {
  ssr: false,
  loading: () => <TechCoreFallback />,
});

function TechCoreFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Animated concentric rings */}
        <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border border-blue-500/30 animate-pulse" />
        <div className="absolute inset-6 rounded-full border border-dashed border-blue-400/40 animate-spin duration-1000" />
        {/* Center node */}
        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/50 flex items-center justify-center shadow-lg">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function TechCore3D(props: TechCoreCanvasProps) {
  return <TechCoreCanvas {...props} />;
}

