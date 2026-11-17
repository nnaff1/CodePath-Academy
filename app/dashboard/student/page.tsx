'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Flame,
  Globe,
  Bell,
  Play,
  PlayCircle,
  RotateCcw,
  Sparkles,
  Send,
  Paperclip,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Award,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  MoreHorizontal,
  LogOut,
  Zap,
  LayoutDashboard,
  Hammer,
  GraduationCap,
  MessageSquare,
  Copy,
  Check,
  Loader2,
  Terminal,
  FolderGit2,
  ArrowRight,
  UserCheck,
  HelpCircle,
  ThumbsUp,
  User,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { StudentProfileModal } from '@/components/dashboard/StudentProfileModal';

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  xpPoints: number;
  bio?: string;
  githubUsername?: string;
}

interface StudentKPIs {
  totalXp: number;
  activeCoursesCount: number;
  averageProgress: number;
  certificatesCount: number;
  latestCertificate: {
    code: string;
    grade: string;
    score: number;
    courseTitle: string;
  } | null;
}

interface LessonData {
  id: string;
  title: string;
  order: number;
  chapterTitle: string;
  courseTitle: string;
  content: string;
  starterCode: string | null;
  solutionHint: string | null;
}

interface EnrolledCourse {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  courseLevel: string;
  progressPercent: number;
  completedAt: string | null;
  certificateCode: string | null;
}

interface CertificateData {
  id: string;
  certificateCode: string;
  grade: string;
  score: number;
  issuedAt: string;
  courseTitle: string;
  courseSlug: string;
}

interface CatalogCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  price: number;
  mentorName: string;
  chaptersCount: number;
  lessonsCount: number;
  isEnrolled: boolean;
  progressPercent: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

type TabKey = 'learning' | 'workspace' | 'catalog' | 'certificates' | 'community';

// ─── Code Snippets ──────────────────────────────────────────────────────────

const DEFAULT_ACTIONS_CODE = `import { useActionState, useOptimistic } from 'react';
import { updateCartQuantity } from '@/app/actions';

// Action state hook managing server pending transitions
export function CartManager({ initialCount }: { initialCount: number }) {
  const [state, formAction, isPending] =
    useActionState(updateCartQuantity, { count: initialCount });
  const [optimisticCount, setOptimisticCount] = useOptimistic(
    state.count,
    (current, newTotal: number) => newTotal
  );

  return (
    <div className="flex items-center gap-4">
      <span>Items in Cart: {optimisticCount}</span>
      {isPending && <span className="animate-spin">⏳</span>}
    </div>
  );
}`;

const DEFAULT_CART_ITEM_CODE = `'use client';

import React from 'react';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  onRemove: (id: string) => Promise<void>;
}

export function CartItemRow({ id, name, price, quantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-slate-700 text-white">
      <div>
        <span className="font-semibold text-sm">{name}</span>
        <span className="text-xs text-slate-400 block">\${price} each</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs bg-slate-800 px-2 py-1 rounded">Qty: {quantity}</span>
        <button
          onClick={() => onRemove(id)}
          className="text-xs text-rose-400 hover:text-rose-300 font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  );
}`;

// ─── Main Student Dashboard Component ───────────────────────────────────────

export default function StudentDashboard() {
  const { language, setLanguage, t } = useLanguage();
  const sd = t.studentDashboard;

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<TabKey>('learning');

  // Dashboard Data from Database
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [student, setStudent] = useState<StudentProfile>({
    id: 'student-demo',
    name: 'Affando Fathinatha',
    email: 'student@codepath.id',
    role: 'USER',
    xpPoints: 1450,
    bio: 'Fullstack Next.js developer aspiring to build production AI orchestration systems.',
    githubUsername: 'nnaff1',
  });
  const [kpis, setKpis] = useState<StudentKPIs>({
    totalXp: 1450,
    activeCoursesCount: 3,
    averageProgress: 72,
    certificatesCount: 2,
    latestCertificate: {
      code: 'CP-2026-889',
      grade: 'Distinction',
      score: 98.4,
      courseTitle: 'Algorithmic Systems',
    },
  });
  const [currentLesson, setCurrentLesson] = useState<LessonData | null>(null);
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [catalogCourses, setCatalogCourses] = useState<CatalogCourse[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);

  // Studio Code Editor State
  const [activeEditorTab, setActiveEditorTab] = useState<'actions' | 'cart-item'>('actions');
  const [actionsCode, setActionsCode] = useState(DEFAULT_ACTIONS_CODE);
  const [cartItemCode, setCartItemCode] = useState(DEFAULT_CART_ITEM_CODE);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [compileStatus, setCompileStatus] = useState<string | null>(null);

  // GitHub Assignment Submission
  const [githubUrl, setGithubUrl] = useState('https://github.com/nnaff1/next15-actions-demo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Sema AI Chat Stream
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'user',
      content: 'Why does my cart count flicker back to 0 before the server action settles?',
      timestamp: '10:42 AM',
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content: `Great catch! Notice the execution order between your optimistic state mutation and the resolved action payload.\n\nWhat initial value did you provide as the fallback in useActionState(..., { count: ? }) during pending transitions?\n\n*Hint: If initialCount is undefined on mount, hydration defaults to 0 before DB.*`,
      timestamp: '10:42 AM',
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Profile Menu Dropdown & Notifications
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);
  const [copiedCertCode, setCopiedCertCode] = useState<string | null>(null);

  // ─── Fetch Dashboard Data ───────────────────────────────────────────────────

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await fetch('/api/student/dashboard');
      const data = await res.json();
      if (data.success) {
        if (data.student) {
          setStudent(data.student);
          if (data.student.githubUsername) {
            setGithubUrl(`https://github.com/${data.student.githubUsername}/next15-actions-demo`);
          }
        }
        if (data.kpis) setKpis(data.kpis);
        if (data.currentLesson) {
          setCurrentLesson(data.currentLesson);
          if (data.currentLesson.starterCode) {
            setActionsCode(data.currentLesson.starterCode);
          }
        }
        if (data.certificates) setCertificates(data.certificates);
      }
    } catch (err) {
      console.error('Error fetching student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleProfileUpdated = (updated: {
    name: string;
    bio: string;
    githubUsername: string;
  }) => {
    setStudent((prev) => ({
      ...prev,
      name: updated.name,
      bio: updated.bio,
      githubUsername: updated.githubUsername,
    }));
    if (updated.githubUsername) {
      setGithubUrl(`https://github.com/${updated.githubUsername}/next15-actions-demo`);
    }
  };

  const fetchCatalogCourses = useCallback(async () => {
    setCatalogLoading(true);
    try {
      const res = await fetch('/api/student/courses');
      const data = await res.json();
      if (data.success && data.courses) {
        setCatalogCourses(data.courses);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (activeTab === 'catalog') {
      fetchCatalogCourses();
    }
  }, [activeTab, fetchCatalogCourses]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, aiThinking]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleRunCode = () => {
    setIsRunningCode(true);
    setCompileStatus(sd.studio.runningCode);
    setTimeout(() => {
      setIsRunningCode(false);
      setCompileStatus(sd.studio.compiledSuccess);
    }, 600);
  };

  const handleResetCode = () => {
    if (activeEditorTab === 'actions') {
      setActionsCode(currentLesson?.starterCode || DEFAULT_ACTIONS_CODE);
    } else {
      setCartItemCode(DEFAULT_CART_ITEM_CODE);
    }
    setCompileStatus(null);
  };

  const handleSubmitAssignment = async () => {
    if (!githubUrl.trim() || !githubUrl.includes('github.com')) {
      setSubmitError(sd.studio.submissionError);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/student/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: currentLesson?.id,
          githubUrl: githubUrl.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        if (data.newXp) {
          setStudent((prev) => ({ ...prev, xpPoints: data.newXp }));
          setKpis((prev) => ({ ...prev, totalXp: data.newXp }));
        }
        setTimeout(() => setSubmitSuccess(false), 4000);
      } else {
        setSubmitError(data.message || 'Failed to submit assignment.');
      }
    } catch {
      setSubmitError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = promptText || aiInput;
    if (!textToSend.trim() || aiThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!promptText) setAiInput('');
    setAiThinking(true);

    try {
      const currentCode = activeEditorTab === 'actions' ? actionsCode : cartItemCode;
      const history = chatMessages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/sema-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          code: currentCode,
          language,
          history,
        }),
      });

      const data = await res.json();
      const replyContent =
        data.reply ||
        (language === 'id'
          ? 'Perhatikan urutan pemanggilan state mutasi Anda dengan saksama. Apa fallback yang diberikan pada hook tersebut?'
          : 'Observe the order between optimistic mutations and resolved payloads carefully. What initial fallback is being supplied?');

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'id'
            ? 'Sema AI sedang merefleksikan arsitektur kodemu. Coba periksa apakah nilai `initialCount` terdefinisi saat render pertama.'
            : 'Sema AI is reviewing your architecture. Verify if `initialCount` is defined on first mount.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setAiThinking(false);
    }
  };

  const handleEnrollCourse = async (courseId: string) => {
    try {
      const res = await fetch('/api/student/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (data.success) {
        setCatalogCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, isEnrolled: true, progressPercent: 0 } : c))
        );
        if (data.newXp) {
          setStudent((prev) => ({ ...prev, xpPoints: data.newXp }));
          setKpis((prev) => ({ ...prev, totalXp: data.newXp }));
        }
      }
    } catch (err) {
      console.error('Enroll error:', err);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCertCode(code);
    setTimeout(() => setCopiedCertCode(null), 2500);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  // ─── Navigation Items Configuration ─────────────────────────────────────────

  const navItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'learning', label: sd.nav.learning, icon: <LayoutDashboard size={18} /> },
    { key: 'workspace', label: sd.nav.workspace, icon: <Code size={18} /> },
    { key: 'catalog', label: sd.nav.catalog, icon: <BookOpen size={18} /> },
    { key: 'certificates', label: sd.nav.certificates, icon: <Award size={18} /> },
    { key: 'community', label: sd.nav.community, icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ── Fixed Left Sidebar ── */}
      <aside className="fixed left-0 top-0 h-screen w-[220px] bg-white border-r border-slate-200 flex flex-col z-30">
        
        {/* Brand Header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-xs">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-[#0F172A] leading-none">CodePath</div>
              <div className="text-[9px] font-semibold tracking-widest text-[#2563EB] uppercase leading-none mt-0.5">
                ACADEMY
              </div>
            </div>
            <span className="ml-auto text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">
              v2.4
            </span>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-5 pt-4 pb-2">
          <span className="text-[9px] font-bold tracking-widest text-emerald-600 uppercase">
            • {sd.portalLabel}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ key, label, icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{icon}</span>
                <span className="flex-1 text-left truncate text-[13px]">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Pinned Student Profile Card */}
        <div className="px-3 pb-4 pt-3 border-t border-slate-100 mt-2">
          <div
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors relative cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              {student.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate group-hover:text-[#2563EB] transition-colors">
                {student.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {student.xpPoints.toLocaleString()} XP • Level 4 Back...
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu(!showProfileMenu);
              }}
              className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer flex-shrink-0"
            >
              <MoreHorizontal size={16} />
            </button>

            {/* Profile & Logout Dropdown */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50 divide-y divide-slate-100"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfileMenu(false);
                      setShowProfileModal(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <User size={13} className="text-[#2563EB]" />
                    Profile & Settings
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut size={13} />
                    {sd.logout}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-1.5 px-3 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="text-[10px] font-semibold text-emerald-600">{sd.activeLearner}</span>
          </div>
        </div>
      </aside>

      {/* ── Fixed Top Header Bar ── */}
      <header className="fixed top-0 left-[220px] right-0 h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 z-20">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-slate-500 flex-shrink-0 min-w-0">
          <span className="text-slate-400">{sd.breadcrumb}</span>
          <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
          <span className="font-semibold text-slate-700 truncate">{sd.breadcrumbConsole}</span>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xs relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={sd.searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        {/* Right Header Elements */}
        <div className="flex items-center gap-3 ml-auto flex-shrink-0">
          
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 border border-orange-200/60 px-3 py-1 rounded-full text-xs font-semibold">
            <Flame size={13} className="text-orange-500 fill-orange-500" />
            {sd.streak}
          </div>

          {/* Bilingual EN | ID Switcher */}
          <div className="flex items-center bg-slate-100 rounded-full p-0.5 gap-0.5">
            {(['en', 'id'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`relative px-2.5 py-1 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                  language === lang ? 'bg-[#0F172A] text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => setHasNotif(false)}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-slate-500"
          >
            <Bell size={18} />
            {hasNotif && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white" />
            )}
          </button>

          {/* Dark Navy Resume Button */}
          <button
            onClick={() => setActiveTab('learning')}
            className="hidden sm:flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-xs cursor-pointer"
          >
            <Play size={11} className="fill-white" />
            {sd.resumeBtn}
          </button>

          {/* Student Avatar */}
          <button
            onClick={() => setShowProfileModal(true)}
            title="Profile & Settings"
            className="w-8 h-8 rounded-full bg-[#0F172A] hover:bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            {student.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
          </button>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="ml-[220px] pt-14 min-h-screen">
        <div className="p-6 space-y-6 max-w-[1360px] mx-auto">

          {/* ════════════════════════════════════════════════════════════════════
              TAB 1: MY LEARNING (Studio + KPIs + Welcome Banner)
          ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'learning' && (
            <>
              {/* Welcome Banner Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl font-bold text-[#0F172A]">
                      {sd.welcome} {student.name.split(' ')[0]} 👋
                    </h1>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {sd.trackPill}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{sd.welcomeSub}</p>
                </div>
                <button
                  onClick={() => setActiveTab('workspace')}
                  className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm cursor-pointer whitespace-nowrap"
                >
                  {sd.continueLearning}
                </button>
              </motion.div>

              {/* 3 Metric KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* KPI 1: TOTAL XP EARNED */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.35 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {sd.kpi.totalXp}
                      </div>
                      <div className="text-3xl font-bold text-[#0F172A] leading-none mt-1">
                        {kpis.totalXp.toLocaleString()} <span className="text-sm font-medium text-slate-400">XP</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center flex-shrink-0">
                      <Zap size={20} className="fill-[#2563EB]" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <TrendingUp size={11} /> {sd.kpi.thisWeek}
                    </span>
                    <span className="text-slate-400">{sd.kpi.topPercent}</span>
                  </div>
                </motion.div>

                {/* KPI 2: ACTIVE COURSES */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14, duration: 0.35 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {sd.kpi.activeCourses}
                      </div>
                      <div className="text-3xl font-bold text-[#0F172A] leading-none mt-1">
                        {kpis.activeCoursesCount} <span className="text-sm font-normal text-slate-400">{sd.kpi.inProgress}</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center flex-shrink-0">
                      <BookOpen size={20} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span>{sd.kpi.avgCompletion}</span>
                      <span className="font-semibold text-slate-700">{kpis.averageProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${kpis.averageProgress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-[#2563EB] rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* KPI 3: VERIFIED CERTIFICATES */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.35 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {sd.kpi.verifiedCertificates}
                      </div>
                      <div className="text-3xl font-bold text-[#0F172A] leading-none mt-1">
                        {kpis.certificatesCount} <span className="text-sm font-normal text-slate-400">{sd.kpi.issued}</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs">
                    {kpis.latestCertificate ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <ShieldCheck size={12} className="text-[#2563EB]" />
                        ID: {kpis.latestCertificate.code}
                        <span className="font-sans text-slate-400">• {kpis.latestCertificate.courseTitle}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">Complete curriculum to earn certificate</span>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Split-Screen Studio: Left Sandbox + Right Sema AI */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* ── Left Pane: Active Lesson & Editable Code Sandbox (7 cols) ── */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Lesson Metadata Header */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                      <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
                        {currentLesson?.chapterTitle || sd.studio.chapter}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {sd.studio.lessonBadge}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {sd.studio.techPill1}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {sd.studio.techPill2}
                        </span>
                      </div>
                    </div>
                    <h2 className="text-lg font-bold text-[#0F172A]">
                      {currentLesson?.title || sd.studio.lessonTitle}
                    </h2>
                  </div>

                  {/* Dark Multi-Tab Code Editor (bg-[#0F172A]) */}
                  <div className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-md overflow-hidden text-slate-200">
                    
                    {/* Editor Tab Bar */}
                    <div className="px-4 py-2.5 bg-[#090D16] border-b border-slate-800 flex items-center justify-between gap-3">
                      
                      {/* Window Dots & File Tabs */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                        </div>

                        {/* File Tabs */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setActiveEditorTab('actions')}
                            className={`px-3 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                              activeEditorTab === 'actions'
                                ? 'bg-[#0F172A] text-white border border-slate-700/80 font-medium'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {sd.studio.tabActions}
                          </button>
                          <button
                            onClick={() => setActiveEditorTab('cart-item')}
                            className={`px-3 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                              activeEditorTab === 'cart-item'
                                ? 'bg-[#0F172A] text-white border border-slate-700/80 font-medium'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {sd.studio.tabCartItem}
                          </button>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleResetCode}
                          title={sd.studio.resetCode}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                        >
                          <RotateCcw size={13} />
                        </button>
                        <button
                          onClick={handleRunCode}
                          disabled={isRunningCode}
                          className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50 shadow-xs"
                        >
                          {isRunningCode ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Play size={11} className="fill-white" />
                          )}
                          {sd.studio.runCode}
                        </button>
                      </div>
                    </div>

                    {/* Monospace Code Editor Area */}
                    <div className="p-4 font-mono text-xs overflow-x-auto relative min-h-[340px]">
                      <textarea
                        value={activeEditorTab === 'actions' ? actionsCode : cartItemCode}
                        onChange={(e) =>
                          activeEditorTab === 'actions'
                            ? setActionsCode(e.target.value)
                            : setCartItemCode(e.target.value)
                        }
                        className="w-full h-80 bg-transparent text-slate-200 resize-none font-mono text-xs leading-relaxed focus:outline-none selection:bg-blue-600/30 selection:text-white"
                        spellCheck={false}
                      />
                    </div>

                    {/* Bottom Console / Status Bar */}
                    <div className="px-4 py-2.5 bg-[#090D16] border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-slate-300">
                          {compileStatus || sd.studio.compiledSuccess}
                        </span>
                      </div>
                      <span className="text-slate-500">Next.js Turbopack</span>
                    </div>
                  </div>

                  {/* GitHub Assignment Submission Bar */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                        <FolderGit2 size={14} className="text-slate-400" />
                        {sd.studio.githubRepoLabel}
                      </label>
                      {submitSuccess && (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={13} /> {sd.studio.submissionSuccess}
                        </span>
                      )}
                      {submitError && (
                        <span className="text-xs font-medium text-rose-600">{submitError}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          placeholder={sd.studio.githubPlaceholder}
                          className="w-full pl-3 pr-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                        />
                      </div>
                      <button
                        onClick={handleSubmitAssignment}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer disabled:opacity-60 whitespace-nowrap"
                      >
                        {isSubmitting ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={13} />
                        )}
                        {isSubmitting ? sd.studio.submitting : sd.studio.submitAssignment}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Right Pane: ✨ Sema AI Socratic Coding Tutor (5 cols) ── */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[580px]">
                  
                  {/* Sema AI Header */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-amber-900 shadow-2xs">
                        <Sparkles size={14} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          {sd.sema.title}
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                            • {sd.sema.guidance}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Context Banner */}
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-[11px] font-mono text-slate-500">
                    <Zap size={11} className="text-[#2563EB]" />
                    <span className="truncate">{sd.sema.contextBadge}</span>
                  </div>

                  {/* Live Scrollable Chat Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        {msg.role === 'user' ? (
                          <div className="bg-[#0F172A] text-white rounded-2xl rounded-tr-xs px-4 py-2.5 max-w-[85%] shadow-xs leading-relaxed">
                            {msg.content}
                          </div>
                        ) : (
                          <div className="bg-slate-50 border border-slate-200/80 text-slate-800 rounded-2xl rounded-tl-xs p-3.5 max-w-[92%] shadow-xs space-y-2 leading-relaxed">
                            {msg.content.split('\n\n').map((paragraph, idx) => (
                              <p key={idx} className={paragraph.startsWith('*Hint') ? 'italic text-slate-600 bg-amber-50/70 p-2 rounded-lg border border-amber-200/40' : ''}>
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        )}
                        <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                      </div>
                    ))}

                    {aiThinking && (
                      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-2xl border border-slate-200 w-fit">
                        <Loader2 size={13} className="animate-spin text-[#2563EB]" />
                        <span>{sd.sema.typing}</span>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Quick-Prompt Chips */}
                  <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto border-t border-slate-100 bg-slate-50/50">
                    <button
                      onClick={() => handleSendMessage('Give me a Socratic hint about fixing this.')}
                      className="text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-slate-50 cursor-pointer shadow-2xs"
                    >
                      {sd.sema.quickPrompt1}
                    </button>
                    <button
                      onClick={() => handleSendMessage('Explain how useActionState manages pending transition.')}
                      className="text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-slate-50 cursor-pointer shadow-2xs"
                    >
                      {sd.sema.quickPrompt2}
                    </button>
                    <button
                      onClick={() => handleSendMessage('Check my logic in the optimistic count callback.')}
                      className="text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-slate-50 cursor-pointer shadow-2xs"
                    >
                      {sd.sema.quickPrompt3}
                    </button>
                  </div>

                  {/* Bottom Chat Input Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white rounded-b-2xl"
                  >
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder={sd.sema.inputPlaceholder}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    />
                    <button
                      type="button"
                      title="Attach code context"
                      className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <Paperclip size={14} />
                    </button>
                    <button
                      type="submit"
                      disabled={!aiInput.trim() || aiThinking}
                      className="w-8 h-8 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white flex items-center justify-center transition cursor-pointer disabled:opacity-40 shadow-xs flex-shrink-0"
                    >
                      <Send size={13} />
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              TAB 2: INTERACTIVE WORKSPACE (Focus Coding Sandbox)
          ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'workspace' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{sd.nav.workspace}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Full-featured developer sandbox with real-time compilation and testing.
                  </p>
                </div>
                <button
                  onClick={handleRunCode}
                  className="flex items-center gap-2 bg-[#2563EB] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition cursor-pointer"
                >
                  <Play size={12} className="fill-white" />
                  {sd.studio.runCode}
                </button>
              </div>

              {/* Large Code Workspace */}
              <div className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-lg overflow-hidden text-slate-200">
                <div className="px-4 py-3 bg-[#090D16] border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400">● Turbopack Live</span>
                    <span className="text-xs text-slate-500">|</span>
                    <span className="text-xs font-mono text-slate-300">actions.ts</span>
                  </div>
                  <button
                    onClick={handleResetCode}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={12} /> {sd.studio.resetCode}
                  </button>
                </div>
                <div className="p-6 font-mono text-xs leading-relaxed">
                  <textarea
                    value={actionsCode}
                    onChange={(e) => setActionsCode(e.target.value)}
                    className="w-full h-96 bg-transparent text-slate-200 resize-none font-mono text-sm leading-relaxed focus:outline-none"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              TAB 3: COURSE CATALOG
          ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'catalog' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900">{sd.catalog.title}</h2>
                <p className="text-sm text-slate-500 mt-1">{sd.catalog.subtitle}</p>
              </div>

              {catalogLoading ? (
                <div className="text-center py-16 text-slate-400">
                  <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#2563EB]" />
                  Loading courses...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catalogCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB]">
                            {course.level}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {course.lessonsCount} lessons
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#0F172A] leading-snug">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 font-medium">MENTOR</div>
                          <div className="text-xs font-semibold text-slate-700">{course.mentorName}</div>
                        </div>

                        {course.isEnrolled ? (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 flex items-center gap-1.5">
                            <CheckCircle2 size={13} />
                            {sd.catalog.enrolled}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleEnrollCourse(course.id)}
                            className="text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
                          >
                            {sd.catalog.enrollNow}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              TAB 4: MY CERTIFICATES
          ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900">{sd.certificates.title}</h2>
                <p className="text-sm text-slate-500 mt-1">{sd.certificates.subtitle}</p>
              </div>

              {certificates.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
                  <Award size={32} className="mx-auto mb-2 text-slate-300" />
                  {sd.certificates.noCerts}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((cert) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 mb-2">
                            <ShieldCheck size={13} /> {cert.grade} • {cert.score}%
                          </span>
                          <h3 className="text-base font-bold text-[#0F172A]">{cert.courseTitle}</h3>
                          <p className="text-xs text-slate-400 mt-1 font-mono">
                            {sd.certificates.issuedOn}: {new Date(cert.issuedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center flex-shrink-0">
                          <Award size={26} />
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {cert.certificateCode}
                          </span>
                          <button
                            onClick={() => handleCopyCode(cert.certificateCode)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition cursor-pointer"
                            title={sd.certificates.copyCode}
                          >
                            {copiedCertCode === cert.certificateCode ? (
                              <Check size={14} className="text-emerald-600" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>

                        <Link
                          href={`/?verify=${cert.certificateCode}`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition"
                        >
                          {sd.certificates.verifyOnline}
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              TAB 5: COMMUNITY Q&A
          ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'community' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{sd.community.title}</h2>
                  <p className="text-sm text-slate-500 mt-1">{sd.community.subtitle}</p>
                </div>
                <button className="flex items-center gap-2 bg-[#2563EB] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition cursor-pointer shadow-xs">
                  {sd.community.askBtn}
                </button>
              </div>

              {/* Sample Forum Questions */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
                {[
                  {
                    title: 'How to handle optimistic rollback when Next.js Server Action returns 500?',
                    author: 'Maya Lin',
                    answers: 6,
                    votes: 14,
                    tag: 'React 19 & Next.js 15',
                  },
                  {
                    title: 'Best practice for Redis distributed caching in Node microservices?',
                    author: 'David Kusuma',
                    answers: 4,
                    votes: 9,
                    tag: 'Backend Microservices',
                  },
                  {
                    title: 'Topological sort vs Kahn algorithm for dependency resolution in build systems?',
                    author: 'Elena Rostova',
                    answers: 8,
                    votes: 21,
                    tag: 'Algorithmic Systems',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-md">
                        {item.tag}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 cursor-pointer hover:text-[#2563EB] transition">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400">Asked by {item.author} • 2 hours ago</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={13} className="text-slate-400" /> {item.votes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={13} className="text-slate-400" /> {item.answers}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Student Profile & Settings Modal ── */}
      <StudentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        student={student}
        certificates={certificates}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
}
