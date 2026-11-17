'use client';

import React, { useState } from 'react';
import { ArrowRight, Play, Star, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { TechCore3D } from '@/components/3d/TechCore3D';
import { useLanguage } from '@/context/LanguageContext';

interface HeroProps {
  onOpenFreeLesson: () => void;
  onCopyNotice: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

export function Hero({ onOpenFreeLesson, onCopyNotice }: HeroProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'app' | 'demo'>('app');
  const [copied, setCopied] = useState(false);
  const [compileTime, setCompileTime] = useState(42);
  const [isCompiling, setIsCompiling] = useState(false);

  // 3D Perspective Tilt Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for silky 60fps tilt
  const mouseX = useSpring(x, { stiffness: 220, damping: 24 });
  const mouseY = useSpring(y, { stiffness: 220, damping: 24 });

  // Map mouse movement to subtle, realistic rotation angles (-10deg to 10deg)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseXPos = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseXPos);
    y.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const appCode = [
    { line: '01', code: "<span class='text-blue-600 font-semibold'>import</span> { useState, useEffect } <span class='text-blue-600 font-semibold'>from</span> <span class='text-emerald-600 font-medium'>'react'</span>;" },
    { line: '02', code: "<span class='text-blue-600 font-semibold'>import</span> { BootcampEnrollment } <span class='text-blue-600 font-semibold'>from</span> <span class='text-emerald-600 font-medium'>'@codepath/core'</span>;" },
    { line: '03', code: "" },
    { line: '04', code: "<span class='text-slate-400 italic'>// Interactive cohort session active</span>" },
    { line: '05', code: "<span class='text-blue-600 font-semibold'>export default function</span> <span class='text-indigo-600 font-bold'>DeveloperTrack</span>() {" },
    { line: '06', code: "  <span class='text-blue-600 font-semibold'>const</span> [isHired, setIsHired] = <span class='text-blue-600 font-medium'>useState</span>(<span class='text-amber-600 font-semibold'>false</span>);" },
    { line: '07', code: "  <span class='text-slate-400 italic'>// Complete real portfolio deliverables</span>" },
    { line: '08', code: "  <span class='text-blue-600 font-semibold'>const</span> stack = [<span class='text-emerald-600'>'TypeScript'</span>, <span class='text-emerald-600'>'React 19'</span>, <span class='text-emerald-600'>'PostgreSQL'</span>];" },
    { line: '09', code: "  <span class='text-blue-600 font-semibold'>return</span> (" },
    { line: '10', code: "    &lt;<span class='text-slate-900 font-bold'>CareerSuccess</span> <span class='text-indigo-600 font-medium'>candidates</span>=<span class='text-emerald-600'>\"you\"</span> <span class='text-indigo-600 font-medium'>mentors</span>={vetted} /&gt;" },
    { line: '11', code: "  );" },
    { line: '12', code: "}" },
  ];

  const demoCode = [
    { line: '01', code: "<span class='text-slate-400 italic'>// Real-time peer code review & mentorship</span>" },
    { line: '02', code: "<span class='text-blue-600 font-semibold'>import</span> { CodeReviewEngine } <span class='text-blue-600 font-semibold'>from</span> <span class='text-emerald-600 font-medium'>'@codepath/mentor'</span>;" },
    { line: '03', code: "" },
    { line: '04', code: "<span class='text-blue-600 font-semibold'>export async function</span> <span class='text-indigo-600 font-bold'>verifyReadiness</span>(studentId: <span class='text-slate-700 font-medium'>string</span>) {" },
    { line: '05', code: "  <span class='text-blue-600 font-semibold'>const</span> review = <span class='text-blue-600 font-semibold'>await</span> CodeReviewEngine.<span class='text-blue-600 font-medium'>inspectPR</span>({" },
    { line: '06', code: "    student: <span class='text-emerald-600 font-medium'>'Alex Pratama'</span>," },
    { line: '07', code: "    stack: [<span class='text-emerald-600 font-medium'>'Next.js 16'</span>, <span class='text-emerald-600 font-medium'>'Docker'</span>, <span class='text-emerald-600 font-medium'>'Redis'</span>]," },
    { line: '08', code: "    rubric: <span class='text-emerald-600 font-medium'>'Production Standard'</span>," },
    { line: '09', code: "  });" },
    { line: '10', code: "  <span class='text-blue-600 font-semibold'>return</span> review.approved ? <span class='text-emerald-600 font-bold'>'Hire Ready ✓'</span> : <span class='text-amber-600'>'Refactor'</span>;" },
    { line: '11', code: "}" },
  ];

  const currentCodeLines = activeTab === 'app' ? appCode : demoCode;

  const handleCopy = () => {
    const rawCode = (activeTab === 'app' ? appCode : demoCode)
      .map((c) => c.code.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>'))
      .join('\n');
    navigator.clipboard?.writeText(rawCode);
    setCopied(true);
    onCopyNotice();
    setTimeout(() => setCopied(false), 2000);
  };

  const recompileCode = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setCompileTime(Math.floor(28 + Math.random() * 20));
      setIsCompiling(false);
    }, 400);
  };

  return (
    <section className="relative w-full bg-white pt-10 sm:pt-16 pb-16 sm:pb-24 overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column (Hero Content with Framer Motion Staggered Entrance) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col items-start text-left"
          >
            {/* Pill Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </span>
                <span>{t.hero.badge}</span>
              </div>
            </motion.div>

            {/* Bold Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#0F172A] tracking-tight leading-[1.14] mb-6"
            >
              {t.hero.headline}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl"
            >
              {t.hero.subheadline}
            </motion.p>

            {/* Primary & Secondary Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-10 w-full sm:w-auto"
            >
              <a
                href="#courses"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-sm transition shadow-xs hover:shadow-md cursor-pointer group whitespace-nowrap"
              >
                <span>{t.hero.exploreCourses}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </a>

              <button
                type="button"
                onClick={onOpenFreeLesson}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold text-sm transition shadow-2xs cursor-pointer group whitespace-nowrap"
              >
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>{t.hero.tryFreeLesson}</span>
              </button>
            </motion.div>

            {/* Social Proof & Rating */}
            <motion.div variants={itemVariants} className="pt-2 border-t border-slate-100 w-full">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-slate-600 mb-5">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="font-bold text-slate-900">{t.hero.ratingText}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">
                  {language === 'id' ? (
                    <>Lebih dari <strong className="font-bold text-slate-900">12.400+ alumni</strong> tersalurkan kerja global</>
                  ) : (
                    <>Over <strong className="font-bold text-slate-900">12,400+ graduates</strong> hired globally</>
                  )}
                </span>
              </div>

              {/* Muted Grayscale Company Logos */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                <span className="font-black tracking-tighter text-slate-800 text-sm hover:text-green-600 transition-colors">
                  GOJEK
                </span>
                <span className="font-bold tracking-tight text-slate-800 text-sm hover:text-blue-500 transition-colors">
                  traveloka
                </span>
                <span className="font-extrabold tracking-tight text-slate-800 text-sm hover:text-emerald-500 transition-colors">
                  tokopedia
                </span>
                <span className="font-black tracking-wider text-slate-800 text-sm hover:text-orange-600 transition-colors">
                  Shopee
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column (3D Perspective Interactive macOS Code Editor Window + 3D Geometric Tech Core) */}
          <div
            className="lg:col-span-6 relative pb-8 sm:pb-10"
            style={{ perspective: 1200 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Interactive 3D Geometric Tech Core Orbiting subtly behind/beside the code window */}
            <div className="absolute -top-16 -right-10 sm:-right-6 w-72 h-72 sm:w-96 sm:h-96 pointer-events-auto opacity-50 sm:opacity-60 -z-10 transition-opacity duration-300">
              <TechCore3D colorScheme="hero" interactive={true} />
            </div>

            {/* Ambient soft glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-50 via-indigo-50/50 to-slate-100/60 rounded-3xl blur-xl -z-10 pointer-events-none" />

            {/* 3D Tilted Code Editor Card */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="relative rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 text-left transition-shadow duration-300 hover:shadow-2xl hover:shadow-blue-900/15"
            >
              {/* 3D Layered Depth Floating Badge: TypeScript 5.8 (Top-Right) */}
              <div
                style={{ transform: 'translateZ(38px)' }}
                className="absolute -top-3.5 right-8 z-30 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-200/90 shadow-lg shadow-slate-900/10 flex items-center gap-1.5 select-none pointer-events-none"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="font-mono text-xs font-bold text-slate-800">TypeScript 5.8</span>
                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">Strict</span>
              </div>

              {/* 3D Layered Depth Floating Badge: React 19 (Left) */}
              <div
                style={{ transform: 'translateZ(32px)' }}
                className="absolute top-28 -left-3.5 z-30 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/90 shadow-lg shadow-slate-900/10 flex items-center gap-1.5 select-none pointer-events-none"
              >
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                <span className="font-mono text-[11px] font-bold text-slate-800">React 19</span>
              </div>

              {/* 3D Layered Depth Floating Badge: Node / Postgres (Bottom-Left) */}
              <div
                style={{ transform: 'translateZ(26px)' }}
                className="absolute -bottom-2.5 left-8 z-30 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/90 shadow-lg shadow-slate-900/10 flex items-center gap-1.5 select-none pointer-events-none"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-mono text-[11px] font-bold text-slate-800">Node / Postgres</span>
              </div>

              {/* macOS Window Titlebar */}
              <div className="px-4 py-3 bg-[#F8FAFC] border-b border-slate-200/90 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-2xs" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-2xs" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-2xs" />
                </div>

                {/* Tabs with layoutId smooth sliding transition */}
                <div className="flex items-center gap-1.5 text-xs bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => setActiveTab('app')}
                    className="relative px-3 py-1 rounded-md font-mono text-xs transition cursor-pointer"
                  >
                    {activeTab === 'app' && (
                      <motion.div
                        layoutId="activeCodeTab"
                        className="absolute inset-0 bg-white border border-slate-200/80 shadow-2xs rounded-md"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className={`relative z-10 ${activeTab === 'app' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'}`}>
                      App.tsx
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('demo')}
                    className="relative px-3 py-1 rounded-md font-mono text-xs transition cursor-pointer"
                  >
                    {activeTab === 'demo' && (
                      <motion.div
                        layoutId="activeCodeTab"
                        className="absolute inset-0 bg-white border border-slate-200/80 shadow-2xs rounded-md"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className={`relative z-10 ${activeTab === 'demo' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'}`}>
                      CourseDemo.ts
                    </span>
                  </button>
                </div>

                {/* Copy Action */}
                <button
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded transition cursor-pointer flex items-center gap-1 text-xs"
                  title="Copy code snippet"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Code Body Area with AnimatePresence quick fade when switching tabs */}
              <div className="p-6 font-mono text-[13px] leading-[1.8] text-slate-800 overflow-x-auto min-h-[320px] bg-white rounded-b-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    {currentCodeLines.map((row, index) => (
                      <div key={index} className="flex gap-4 hover:bg-slate-50/80 px-1 rounded transition-colors">
                        <span className="text-slate-400 select-none w-5 text-right font-mono text-xs">
                          {row.line}
                        </span>
                        <span
                          className="font-mono text-slate-800"
                          dangerouslySetInnerHTML={{ __html: row.code || '&nbsp;' }}
                        />
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Floating Status Pill with Continuous Gentle Floating Animation and 3D Layered Depth */}
              <motion.div
                style={{ transform: 'translateZ(48px)' }}
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-2 sm:-bottom-1 right-2 sm:right-4 z-30 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-2xl shadow-slate-900/15 px-4 py-2.5 flex flex-col gap-1 select-none"
              >
                <div
                  onClick={recompileCode}
                  className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600 cursor-pointer hover:text-slate-900 transition"
                  title={t.hero.recompileTooltip}
                >
                  <span className={`w-2 h-2 rounded-full bg-emerald-500 ${isCompiling ? 'animate-ping' : ''}`} />
                  <span>{t.hero.livePreview} • {isCompiling ? t.hero.compiling : `${t.hero.compiledIn} ${compileTime}ms`}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-900 font-bold flex items-center gap-1">
                    {t.hero.welcomeMsg}
                    <span className="text-emerald-600 font-bold">✓</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
                    {t.hero.versionReady}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
