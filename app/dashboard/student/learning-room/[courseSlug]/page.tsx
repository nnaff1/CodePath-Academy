'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronRight,
  Sparkles,
  BookOpen,
  Send,
  Copy,
  Check,
  Loader2,
  Download,
  Info,
  Play,
  List,
  Award,
  User,
  Flame,
  FolderGit2,
  ArrowLeft,
  FileText,
  ClipboardList,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// ─── Types ─────────────────────────────────────────────────────────────────

interface LessonData {
  id: string;
  title: string;
  videoUrl?: string | null;
  content: string;
  starterCode?: string | null;
  solutionHint?: string | null;
  order: number;
  chapterId: string;
}

interface ChapterData {
  id: string;
  title: string;
  order: number;
  lessons: LessonData[];
}

interface CourseData {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  mentorName: string;
}

interface EnrollmentData {
  id: string;
  progressPercent: number;
  completedAt: string | null;
  certificate?: {
    id: string;
    certificateCode: string;
    grade: string;
    score: number;
  } | null;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  xpPoints: number;
}

interface LearningRoomData {
  course: CourseData;
  chapters: ChapterData[];
  enrollment: EnrollmentData | null;
  student: StudentData;
  totalLessons: number;
  completedCount: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function getLevel(xp: number) {
  if (xp >= 5000) return 'Level 5: Expert';
  if (xp >= 3000) return 'Level 4: Production Architect';
  if (xp >= 1500) return 'Level 3: Advanced Dev';
  if (xp >= 500) return 'Level 2: Junior Dev';
  return 'Level 1: Apprentice';
}

// SVG circular progress ring
function CircularProgress({ percent }: { percent: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke="#E2E8F0" strokeWidth="8" />
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke="#2563EB"
        strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 44 44)"
      />
      <text
        x="44"
        y="44"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="700"
        fill="#0F172A"
      >
        {percent}%
      </text>
    </svg>
  );
}

// ─── Sema AI Chat ────────────────────────────────────────────────────────────

interface SemaMessage {
  role: 'user' | 'assistant';
  content: string;
}

function SemaAIPanel({
  lesson,
  t,
}: {
  lesson: LessonData | null;
  t: Record<string, string>;
}) {
  const [messages, setMessages] = useState<SemaMessage[]>([
    {
      role: 'assistant',
      content: lesson
        ? `Hi! I'm Sema AI 👋 I'm here to help you with **"${lesson.title}"**. What are you struggling with? Ask me anything — I'll guide you with hints instead of spoilers!`
        : "Hi! I'm Sema AI 👋 Select a lesson to get started.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const userText = (text ?? input).trim();
      if (!userText) return;
      setInput('');
      setMessages((m) => [...m, { role: 'user', content: userText }]);
      setIsTyping(true);
      try {
        const res = await fetch('/api/sema-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userText,
            context: lesson
              ? `Lesson: ${lesson.title}\nContent: ${lesson.content.slice(0, 500)}\nHint: ${lesson.solutionHint ?? 'N/A'}\nStarter code: ${lesson.starterCode?.slice(0, 300) ?? 'N/A'}`
              : '',
            history: messages.slice(-6),
          }),
        });
        const data = await res.json();
        setMessages((m) => [...m, { role: 'assistant', content: data.reply ?? "I'm having trouble thinking right now. Try again!" }]);
      } catch {
        setMessages((m) => [
          ...m,
          { role: 'assistant', content: "⚠️ Connection issue. Please try again shortly." },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [input, lesson, messages]
  );

  const quickPrompts = [t.quickPrompt1 ?? '💡 Give me a hint', t.quickPrompt2 ?? '⚡ Explain this concept', t.quickPrompt3 ?? '🔍 Check my logic'];

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[#2563EB] text-white rounded-br-sm'
                    : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-slate-500 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {t.typing ?? 'Sema AI is thinking...'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 pb-2 flex flex-wrap gap-2">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => sendMessage(p)}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-100 rounded-full px-3 py-1.5 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder={t.inputPlaceholder ?? 'Ask Sema AI for a hint...'}
          className="flex-1 text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2563EB]/30 bg-slate-50"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isTyping}
          className="bg-[#2563EB] hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl px-4 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Inner Page (uses useParams inside Suspense) ─────────────────────────────

function LearningRoomInner() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const { language, setLanguage, t } = useLanguage();
  const lr = t.studentDashboard.learningRoom;

  const [data, setData] = useState<LearningRoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active lesson state
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'source' | 'project'>('overview');
  const [rightTab, setRightTab] = useState<'syllabus' | 'sema'>('syllabus');

  // Progress state (local optimistic)
  const [progressPercent, setProgressPercent] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [xp, setXp] = useState(0);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  // Accordion state
  const [openChapters, setOpenChapters] = useState<Record<number, boolean>>({});

  // Source code copy state
  const [codeCopied, setCodeCopied] = useState(false);

  // Submission state
  const [githubUrl, setGithubUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    if (!courseSlug) return;
    setLoading(true);
    fetch(`/api/student/learning-room/${courseSlug}`)
      .then((r) => r.json())
      .then((d: LearningRoomData) => {
        setData(d);
        setProgressPercent(d.enrollment?.progressPercent ?? 0);
        setCompletedCount(d.completedCount);
        setXp(d.student?.xpPoints ?? 0);
        // Open first chapter by default
        setOpenChapters({ 0: true });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load learning room data.');
        setLoading(false);
      });
  }, [courseSlug]);

  const activeLesson =
    data?.chapters?.[activeChapterIdx]?.lessons?.[activeLessonIdx] ?? null;

  const handleMarkComplete = async () => {
    if (!activeLesson || !courseSlug || isMarkingComplete) return;
    setIsMarkingComplete(true);
    try {
      const res = await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: activeLesson.id, courseSlug }),
      });
      const result = await res.json();
      if (result.success) {
        setProgressPercent(result.newProgressPercent);
        setXp(result.newXp);
        setCompletedCount((c) => c + 1);
        setJustCompleted(true);
        setTimeout(() => setJustCompleted(false), 3000);
      }
    } catch {
      // silent
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const handleSubmit = async () => {
    if (!activeLesson || !githubUrl.trim()) return;
    setIsSubmitting(true);
    setSubmitMsg(null);
    try {
      const res = await fetch('/api/student/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: activeLesson.id, githubUrl }),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitMsg(lr.submitSuccess);
        setGithubUrl('');
      } else {
        setSubmitMsg(result.message ?? 'Submission failed.');
      }
    } catch {
      setSubmitMsg('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (activeLesson?.starterCode) {
      navigator.clipboard.writeText(activeLesson.starterCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const toggleChapter = (idx: number) => {
    setOpenChapters((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const selectLesson = (chIdx: number, lesIdx: number) => {
    setActiveChapterIdx(chIdx);
    setActiveLessonIdx(lesIdx);
    setActiveTab('overview');
    setJustCompleted(false);
    setSubmitMsg(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading Learning Room...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-500 font-medium">{error ?? 'No data found.'}</p>
          <Link href="/dashboard/student" className="text-sm text-[#2563EB] hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { course, chapters, enrollment, student, totalLessons } = data;
  const initials = getInitials(student.name);
  const chapter = chapters[activeChapterIdx];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* ═══ LEFT SIDEBAR ═══════════════════════════════════════════════ */}
      <aside className="w-[220px] min-h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-30">
        {/* Logo */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <div>
              <span className="font-bold text-[#0F172A] text-sm">CodePath</span>
              <span className="font-light text-[#0F172A] text-sm ml-1">ACADEMY</span>
            </div>
            <span className="text-[9px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded-full ml-auto">v2.4</span>
          </div>
          <span className="text-[9px] font-semibold text-emerald-500 tracking-widest">• STUDENT PORTAL</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard/student" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            {lr.myCourses}
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 text-[#2563EB] text-sm font-semibold">
            <BookOpen className="w-4 h-4" />
            {lr.learningRoom}
          </div>
          <Link href="/dashboard/student/submissions" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <FolderGit2 className="w-4 h-4" />
            {lr.projectSubmissions}
          </Link>
          <Link href="/dashboard/student/certificates" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Award className="w-4 h-4" />
            {lr.certificates}
          </Link>
          <Link href="/dashboard/student/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <User className="w-4 h-4" />
            {lr.profile}
          </Link>
        </nav>

        {/* Student Card */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-3">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#0F172A] text-xs truncate">{student.name}</p>
                <p className="text-slate-500 text-[10px] truncate">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs text-slate-600 font-medium">12-Day Streak 🔥</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs bg-[#2563EB]/10 text-[#2563EB] font-bold px-2 py-0.5 rounded-full">{xp.toLocaleString()} XP</span>
              <span className="text-[10px] text-slate-500">• ACTIVE LEARNER</span>
            </div>
            <button
              onClick={() => {
                document.cookie = 'auth_token=; Max-Age=0; path=/';
                window.location.href = '/login';
              }}
              className="mt-2 w-full flex items-center justify-center gap-1.5 text-[10px] text-slate-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT (offset by sidebar) ══════════════════════════ */}
      <div className="ml-[220px] flex-1 flex flex-col min-w-0">
        {/* ─── TOP HEADER BAR ─────────────────────────────────────────── */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm flex-shrink-0">
            <Link href="/dashboard/student" className="text-slate-500 hover:text-[#2563EB] flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              {lr.myCourses}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-semibold text-[#0F172A] truncate max-w-[200px]">{course.title}</span>
          </div>

          {/* Progress bar */}
          <div className="flex-1 flex items-center gap-3 mx-4">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#2563EB] rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 whitespace-nowrap flex-shrink-0">
              {lr.progressLabel}: {progressPercent}% {lr.completed} ({completedCount}/{totalLessons} {lr.lessons})
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Language toggle */}
            <div className="flex items-center gap-1 text-sm">
              <button onClick={() => setLanguage('en')} className={`font-semibold transition-colors ${language === 'en' ? 'text-[#2563EB]' : 'text-slate-400 hover:text-slate-600'}`}>EN</button>
              <span className="text-slate-300">|</span>
              <button onClick={() => setLanguage('id')} className={`font-semibold transition-colors ${language === 'id' ? 'text-[#2563EB]' : 'text-slate-400 hover:text-slate-600'}`}>ID</button>
            </div>

            {/* View certificate button */}
            {enrollment?.certificate && (
              <a
                href={`/certificate/${enrollment.certificate.certificateCode}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors text-[#0F172A]"
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                {lr.viewCertificate} ↗
              </a>
            )}

            {/* Avatar */}
            <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </div>
        </header>

        {/* ─── BODY: CENTER + RIGHT SIDEBAR ───────────────────────────── */}
        <div className="flex flex-1 min-h-0">
          {/* CENTER MAIN */}
          <main className="flex-1 overflow-y-auto p-6 space-y-5 min-w-0">
            {/* XP toast */}
            <AnimatePresence>
              {justCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-3.5 flex items-center gap-3 text-sm font-medium shadow-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  {lr.lessonCompleted}
                  <span className="ml-auto font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full text-xs">{lr.xpAwarded}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── VIDEO PLAYER CARD ── */}
            <div className="bg-[#0F172A] rounded-2xl overflow-hidden">
              {/* Top badges */}
              <div className="flex items-center gap-2.5 px-5 pt-4 pb-3">
                <span className="text-[10px] font-bold text-blue-400 border border-blue-700 bg-blue-900/40 px-2.5 py-1 rounded-full">
                  {lr.interactiveLecture}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  Module {chapter?.order ?? 1}.{(activeLessonIdx ?? 0) + 1} •{' '}
                  {chapter?.title ?? course.title}
                </span>
                <span className="ml-auto text-[10px] font-bold text-slate-400 tracking-wider">{lr.hd}</span>
              </div>

              {/* Video area */}
              {activeLesson?.videoUrl ? (
                <div className="relative aspect-video mx-5 rounded-xl overflow-hidden mb-4">
                  <iframe
                    src={activeLesson.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative mx-5 mb-4 aspect-video rounded-xl bg-slate-800 flex items-center justify-center group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex flex-col items-center justify-center gap-4">
                    {/* Fake code lines */}
                    <div className="w-full max-w-sm space-y-2 opacity-30 px-6">
                      {['// Async Server Component: fetches directly on Node runtime',
                        "import { Suspense } from 'react';",
                        "import { db } from '@/lib/database';",
                        'export default async function ProductList() {',
                        '  const items = await db.query.products.findMany({ limit: 10 })',
                      ].map((line, i) => (
                        <div key={i} className="text-xs text-slate-400 font-mono truncate">{line}</div>
                      ))}
                    </div>
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-end pb-5 pl-5">
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5">
                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 text-[#0F172A] ml-0.5" />
                        </div>
                        <span className="text-white text-xs font-semibold truncate max-w-[180px]">{activeLesson?.title ?? 'Select a lesson'}</span>
                      </div>
                      <div className="ml-auto mr-5">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 text-white text-xs">
                          <div className="w-5 h-5 bg-blue-500 rounded-full overflow-hidden flex items-center justify-center text-[9px] font-bold">SW</div>
                          <span className="font-medium">Sarah Wijaya</span>
                          <span className="text-white/60 text-[10px]">— Lead Architect</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── LESSON METADATA CARD ── */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                      {lr.chapterLabel} {chapter?.order ?? 1}: {chapter?.title ?? ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <span>• {lr.lessonLabel} {String((activeLessonIdx ?? 0) + 1).padStart(2, '0')}</span>
                    <span>• {lr.updatedYesterday}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-[#0F172A] mb-4 leading-snug">
                    {activeLesson?.title ?? 'Select a lesson from the syllabus'}
                  </h1>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">SW</div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{course.mentorName}</p>
                      <p className="text-xs text-slate-400">Senior Software Engineer & Staff Instructor</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <button className="w-9 h-9 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500">
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                  <motion.button
                    onClick={handleMarkComplete}
                    disabled={isMarkingComplete || justCompleted}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      justCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#0F172A] hover:bg-slate-800 text-white'
                    } disabled:opacity-60`}
                  >
                    {isMarkingComplete ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : justCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {isMarkingComplete ? lr.marking : justCompleted ? '✓ Completed!' : `✓ ${lr.markComplete}`}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* ── TABBED CONTENT CARD ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Tab bar */}
              <div className="flex border-b border-slate-200">
                {([
                  { key: 'overview', icon: FileText, label: lr.tabOverview },
                  { key: 'source', icon: FolderGit2, label: lr.tabSourceCode },
                  { key: 'project', icon: ClipboardList, label: lr.tabProject },
                ] as const).map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === key
                        ? 'border-[#2563EB] text-[#2563EB]'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {key === 'project' && (
                      <span className="text-[9px] bg-blue-50 text-[#2563EB] border border-blue-100 font-bold px-1.5 py-0.5 rounded-full">Due</span>
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* ── OVERVIEW TAB ── */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-6 space-y-6"
                  >
                    {/* Key takeaway cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm font-bold text-[#0F172A]">{lr.keyTakeaway1Title}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{lr.keyTakeaway1Desc}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                          <span className="text-sm font-bold text-[#0F172A]">{lr.keyTakeaway2Title}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{lr.keyTakeaway2Desc}</p>
                      </div>
                    </div>

                    {/* Code block */}
                    {activeLesson?.starterCode && (
                      <div className="bg-[#0F172A] rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500" />
                              <div className="w-3 h-3 rounded-full bg-yellow-500" />
                              <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <span className="text-slate-400 text-xs font-mono ml-2">{lr.boilerplateHeader}</span>
                          </div>
                          <button
                            onClick={handleCopyCode}
                            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                          >
                            {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            {codeCopied ? lr.codeCopied : lr.copyCode}
                          </button>
                        </div>
                        <pre className="p-5 overflow-x-auto text-xs text-slate-300 font-mono leading-relaxed">
                          <code>{activeLesson.starterCode}</code>
                        </pre>
                      </div>
                    )}

                    {/* Core concepts */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-3">{lr.coreConceptsCovered}</p>
                      <div className="flex flex-wrap gap-2">
                        {['RSC Payload', 'Selective Hydration', 'Streaming HTML', "'use client' Directive", 'Server Actions (RPC)'].map((tag) => (
                          <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-medium">{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Download resources */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: lr.starterTemplate, size: '1.2 MB • TypeScript + Tailwind' },
                        { name: lr.architectureDiagram, size: '840 KB • Flowchart + Vector' },
                      ].map((f) => (
                        <div key={f.name} className="flex items-center gap-3 border border-slate-200 rounded-xl p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Download className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#0F172A] truncate">{f.name}</p>
                            <p className="text-[10px] text-slate-400">{f.size}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── SOURCE CODE TAB ── */}
                {activeTab === 'source' && (
                  <motion.div
                    key="source"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#0F172A] text-sm">Starter Code — Edit & Run</h3>
                      <button onClick={handleCopyCode} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#2563EB] transition-colors border border-slate-200 rounded-lg px-3 py-1.5">
                        {codeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {codeCopied ? lr.codeCopied : lr.copyCode}
                      </button>
                    </div>
                    <div className="bg-[#0F172A] rounded-2xl overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        </div>
                        <span className="text-slate-500 text-xs font-mono">actions.ts</span>
                      </div>
                      <textarea
                        defaultValue={activeLesson?.starterCode ?? '// No starter code available for this lesson'}
                        className="w-full bg-transparent text-slate-200 font-mono text-xs p-5 min-h-[280px] outline-none resize-none leading-relaxed"
                        spellCheck={false}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <div className="text-xs text-emerald-500 font-mono">✓ Compiled successfully (142ms) • Ready for verification</div>
                      <button className="bg-[#2563EB] text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors">
                        <Play className="w-3.5 h-3.5" /> Run Code
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── PROJECT TAB ── */}
                {activeTab === 'project' && (
                  <motion.div
                    key="project"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-6 space-y-6"
                  >
                    {/* Rubric */}
                    <div>
                      <h3 className="font-bold text-[#0F172A] text-sm mb-3">{lr.rubricTitle}</h3>
                      <div className="space-y-2">
                        {[
                          'Implement optimistic cart item deletion and handle edge rollback',
                          'Handle server action failures with 500 error status gracefully',
                          'Attach starter repo template from course resources',
                          'Write at least 2 unit tests with Jest for the action handlers',
                        ].map((item, i) => (
                          <label key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                            <input type="checkbox" className="mt-0.5 w-4 h-4 accent-[#2563EB]" />
                            <span className="text-sm text-slate-600">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Submission form */}
                    <div className="border-t border-slate-100 pt-5">
                      <h3 className="font-bold text-[#0F172A] text-sm mb-3">{lr.submissionsTitle}</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">{lr.githubUrlLabel}</label>
                          <input
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            placeholder={lr.githubUrlPlaceholder}
                            className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                          />
                        </div>
                        <button
                          onClick={handleSubmit}
                          disabled={isSubmitting || !githubUrl.trim()}
                          className="bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors"
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderGit2 className="w-4 h-4" />}
                          {isSubmitting ? lr.submitting : lr.submitBtn}
                        </button>
                        {submitMsg && (
                          <p className="text-xs text-emerald-600 font-medium">{submitMsg}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* ═══ RIGHT SIDEBAR ═══════════════════════════════════════════ */}
          <aside className="w-[320px] flex-shrink-0 border-l border-slate-200 bg-white flex flex-col sticky top-[61px] h-[calc(100vh-61px)] overflow-hidden">
            {/* Tab switcher */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setRightTab('syllabus')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    rightTab === 'syllabus' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  {lr.syllabusTab}
                </button>
                <button
                  onClick={() => setRightTab('sema')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    rightTab === 'sema' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  {lr.semaTab}
                  <span className="text-[9px] bg-purple-100 text-purple-600 font-bold px-1.5 py-0.5 rounded-full">BETA</span>
                </button>
              </div>
            </div>

            {/* Panel content */}
            <AnimatePresence mode="wait">
              {rightTab === 'syllabus' ? (
                <motion.div
                  key="syllabus"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  {/* Syllabus header */}
                  <div className="px-4 pt-4 pb-3 flex items-center gap-4 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">{lr.curriculumPath}</p>
                      <p className="text-xs text-slate-400">{completedCount} of {totalLessons} {lr.lessonsCompleted}</p>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      <CircularProgress percent={progressPercent} />
                    </div>
                  </div>

                  {/* Chapter accordion */}
                  <div className="flex-1 overflow-y-auto py-2">
                    {chapters.map((ch, chIdx) => {
                      const isOpen = openChapters[chIdx] ?? false;
                      const isActive = chIdx === activeChapterIdx;
                      // Determine status: past chapters are "completed", active is current, future are locked
                      const isCompleted = chIdx < activeChapterIdx;
                      const isLocked = chIdx > activeChapterIdx + 1;

                      return (
                        <div key={ch.id} className="border-b border-slate-100 last:border-0">
                          <button
                            onClick={() => !isLocked && toggleChapter(chIdx)}
                            className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors ${
                              isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'
                            } ${isActive ? 'bg-blue-50/50' : ''}`}
                          >
                            <div className="mt-0.5 flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" style={{ width: 18, height: 18 }} />
                              ) : isLocked ? (
                                <Lock className="w-4 h-4 text-slate-300" />
                              ) : (
                                <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${isActive ? 'border-[#2563EB] bg-[#2563EB]' : 'border-slate-300'}`}>
                                  {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-[#0F172A] truncate">
                                  Chapter {ch.order}: {ch.title}
                                </span>
                                {isActive && (
                                  <span className="text-[9px] bg-[#2563EB] text-white font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">{lr.current}</span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {isCompleted ? `${ch.lessons.length}/${ch.lessons.length} ${lr.lessonsCompleted}` : isLocked ? `0/${ch.lessons.length} ${lr.lessonsCompleted} • ${lr.locked}` : `${activeLessonIdx + 1}/${ch.lessons.length} ${lr.lessonsCompleted}`}
                              </p>
                            </div>
                            {!isLocked && (
                              <ChevronDown
                                className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                              />
                            )}
                          </button>

                          {/* Lesson list */}
                          <AnimatePresence>
                            {isOpen && !isLocked && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                {ch.lessons.map((lesson, lesIdx) => {
                                  const isLessonActive = chIdx === activeChapterIdx && lesIdx === activeLessonIdx;
                                  const isLessonCompleted = chIdx < activeChapterIdx || (chIdx === activeChapterIdx && lesIdx < activeLessonIdx);

                                  return (
                                    <button
                                      key={lesson.id}
                                      onClick={() => selectLesson(chIdx, lesIdx)}
                                      className={`w-full flex items-center gap-3 pl-10 pr-4 py-2.5 text-left transition-colors ${
                                        isLessonActive
                                          ? 'bg-blue-50 border-l-2 border-[#2563EB]'
                                          : 'hover:bg-slate-50 border-l-2 border-transparent'
                                      }`}
                                    >
                                      <div className="flex-shrink-0">
                                        {isLessonCompleted ? (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                          <div className={`w-4 h-4 rounded-full border-2 ${isLessonActive ? 'border-[#2563EB] bg-[#2563EB]/20' : 'border-slate-300'}`} />
                                        )}
                                      </div>
                                      <span className={`text-xs flex-1 truncate ${isLessonActive ? 'text-[#2563EB] font-semibold' : 'text-slate-600'}`}>
                                        {String(lesIdx + 1).padStart(2, '0')}. {lesson.title}
                                      </span>
                                      <span className="text-[10px] text-slate-400 flex-shrink-0">21m</span>
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  {/* Office Hours card (pinned bottom) */}
                  <div className="p-4 border-t border-slate-100">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start justify-between gap-3">
                      <div>
                        <div className="w-7 h-7 bg-[#2563EB] rounded-lg flex items-center justify-center mb-2">
                          <BookOpen className="w-3.5 h-3.5 text-white" />
                        </div>
                        <p className="text-xs font-bold text-[#0F172A]">{lr.officeHours}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{lr.officeHoursDesc}</p>
                      </div>
                      <button className="bg-[#2563EB] text-white text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap flex-shrink-0 hover:bg-blue-700 transition-colors">
                        {lr.joinRoom}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="sema"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  {/* Sema header */}
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-bold text-[#0F172A]">{t.studentDashboard.sema.title}</span>
                    <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full ml-1">
                      {t.studentDashboard.sema.guidance}
                    </span>
                    {activeLesson && (
                      <span className="ml-auto text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full truncate max-w-[100px]">
                        📄 {activeLesson.title.slice(0, 20)}...
                      </span>
                    )}
                  </div>

                  <SemaAIPanel lesson={activeLesson} t={t.studentDashboard.sema} />
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─── Export wrapped in Suspense for Next.js prerender / useParams ────────────

export default function LearningRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 text-sm">Loading Learning Room...</p>
          </div>
        </div>
      }
    >
      <LearningRoomInner />
    </Suspense>
  );
}
