'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Hammer,
  ClipboardList,
  MessageSquare,
  Users,
  GitPullRequest,
  Star,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  RotateCcw,
  X,
  Sparkles,
  Bold,
  Italic,
  Code,
  PlusCircle,
  Save,
  SendHorizontal,
  Download,
  RefreshCw,
  Globe,
  MoreHorizontal,
  LogOut,
  TrendingUp,
  Clock,
  ChevronLeft,
  BookMarked,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Submission {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  chapterTitle: string;
  lessonTitle: string;
  githubUrl: string;
  status: string;
  feedback: string | null;
  createdAt: string;
  userId: string;
  lessonId: string;
}

interface CourseChapter {
  id: string;
  title: string;
  order: number;
}

interface CourseWithChapters {
  id: string;
  title: string;
  slug: string;
  chapters: CourseChapter[];
}

interface PreReview {
  strengths: string[];
  warnings: string[];
  suggestedScore: number;
  verdict: string;
  mentorNote: string;
  model: string;
}

type NavKey = 'overview' | 'courses' | 'builder' | 'submissions' | 'forum';

// ─── Avatar helper ───────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
];

function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function MentorSidebar({
  activeNav,
  setActiveNav,
  pendingCount,
  onLogout,
}: {
  activeNav: NavKey;
  setActiveNav: (k: NavKey) => void;
  pendingCount: number;
  onLogout: () => void;
}) {
  const { t } = useLanguage();
  const md = t.mentorDashboard;
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems: { key: NavKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: md.nav.overview, icon: <LayoutDashboard size={18} /> },
    { key: 'courses', label: md.nav.courses, icon: <BookOpen size={18} /> },
    { key: 'builder', label: md.nav.builder, icon: <Hammer size={18} /> },
    { key: 'submissions', label: md.nav.submissions, icon: <ClipboardList size={18} /> },
    { key: 'forum', label: md.nav.forum, icon: <MessageSquare size={18} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-white border-r border-slate-200 flex flex-col z-30">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center flex-shrink-0">
            <Code size={14} className="text-white" />
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
          • {md.portalLabel}
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ key, label, icon }) => {
          const isActive = activeNav === key;
          return (
            <button
              key={key}
              onClick={() => setActiveNav(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}>{icon}</span>
              <span className="flex-1 text-left truncate text-[13px]">{label}</span>
              {key === 'submissions' && pendingCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center flex-shrink-0 ${
                    isActive ? 'bg-white/25 text-white' : 'bg-[#2563EB] text-white'
                  }`}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile Card */}
      <div className="px-3 pb-4 pt-3 border-t border-slate-100 mt-2">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors relative">
          <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            SW
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">Sarah Wijaya</div>
            <div className="text-xs text-slate-500 truncate">{md.leadInstructor}</div>
          </div>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer flex-shrink-0"
          >
            <MoreHorizontal size={16} />
          </button>
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50"
              >
                <button
                  onClick={() => { setShowProfileMenu(false); onLogout(); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  {md.logout}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-1.5 px-3 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span className="text-[10px] font-semibold text-emerald-600">{md.activeMentor}</span>
        </div>
      </div>
    </aside>
  );
}

// ─── Top Header ───────────────────────────────────────────────────────────────

function TopHeader({ activeNav }: { activeNav: NavKey }) {
  const { language, setLanguage, t } = useLanguage();
  const md = t.mentorDashboard;
  const [hasNotif, setHasNotif] = useState(true);

  const navLabels: Record<NavKey, string> = {
    overview: md.nav.overview,
    courses: md.nav.courses,
    builder: md.nav.builder,
    submissions: md.nav.submissions,
    forum: md.nav.forum,
  };

  return (
    <header className="fixed top-0 left-[220px] right-0 h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 z-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-slate-500 flex-shrink-0 min-w-0">
        <span className="text-slate-400 hidden sm:block truncate">{md.breadcrumb}</span>
        <ChevronRight size={14} className="text-slate-300 flex-shrink-0 hidden sm:block" />
        <span className="font-semibold text-slate-700 truncate">{navLabels[activeNav]}</span>
      </div>

      {/* Office Hours Pill */}
      <div className="hidden lg:flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0">
        <Clock size={12} />
        {md.officeHours}
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs relative hidden md:block">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={md.searchPlaceholder}
          className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto flex-shrink-0">
        {/* Language Toggle */}
        <div className="flex items-center bg-slate-100 rounded-full p-0.5 gap-0.5">
          <Globe size={12} className="text-slate-400 ml-1.5 flex-shrink-0" />
          {(['en', 'id'] as const).map((lang) => (
            <motion.button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`relative px-2.5 py-1 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                language === lang ? 'bg-[#0F172A] text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {lang.toUpperCase()}
            </motion.button>
          ))}
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setHasNotif(false)}
          className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Bell size={18} className="text-slate-500" />
          {hasNotif && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white" />
          )}
        </button>

        {/* Avatar */}
        <button className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-white text-xs font-bold cursor-pointer flex-shrink-0">
          SW
        </button>
        <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
      </div>
    </header>
  );
}

// ─── Review Drawer ────────────────────────────────────────────────────────────

function ReviewDrawer({
  submission,
  onClose,
  onReviewed,
}: {
  submission: Submission | null;
  onClose: () => void;
  onReviewed: (id: string, status: 'APPROVED' | 'REVISION', feedback: string) => void;
}) {
  const { t } = useLanguage();
  const dr = t.mentorDashboard.drawer;

  const [feedback, setFeedback] = useState('');
  const [preReview, setPreReview] = useState<PreReview | null>(null);
  const [preReviewLoading, setPreReviewLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [action, setAction] = useState<'APPROVED' | 'REVISION' | null>(null);

  useEffect(() => {
    if (!submission) return;
    setFeedback('');
    setPreReview(null);
    setAction(null);
    setPreReviewLoading(true);
    fetch('/api/sema-ai/pre-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        githubUrl: submission.githubUrl,
        studentName: submission.studentName,
        courseName: submission.courseTitle,
        lessonTitle: submission.lessonTitle,
      }),
    })
      .then((r) => r.json())
      .then((d) => { if (d.success) setPreReview(d.preReview); })
      .catch(console.warn)
      .finally(() => setPreReviewLoading(false));
  }, [submission]);

  const handleSubmit = async (status: 'APPROVED' | 'REVISION') => {
    if (!submission) return;
    setSubmitting(true);
    setAction(status);
    try {
      await fetch('/api/mentor/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: submission.id, status, feedback }),
      });
      onReviewed(submission.id, status, feedback);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {submission && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-[480px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col"
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div>
                <div className="text-sm font-bold text-slate-900">{dr.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{submission.studentName} · {submission.courseTitle}</div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {/* Student Info */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${getAvatarColor(submission.studentName)}`}>
                  {getInitials(submission.studentName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-sm">{submission.studentName}</div>
                  <div className="text-xs text-slate-500">{submission.studentEmail}</div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">{submission.chapterTitle}</div>
                </div>
              </div>

              {/* GitHub Link */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{dr.githubRepo}</div>
                <a
                  href={submission.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#2563EB] hover:text-blue-700 font-mono bg-blue-50 px-3 py-2.5 rounded-lg border border-blue-100 transition-colors"
                >
                  <Code size={13} />
                  <span className="flex-1 truncate">{submission.githubUrl.replace('https://github.com/', '')}</span>
                  <ExternalLink size={12} className="flex-shrink-0" />
                </a>
              </div>

              {/* Sema Co-Pilot Pre-Review */}
              <div className="border border-blue-100 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 flex items-center gap-2 border-b border-blue-100">
                  <Sparkles size={14} className="text-[#2563EB]" />
                  <span className="text-sm font-semibold text-[#2563EB]">{dr.semaTitle}</span>
                  <span className="ml-auto text-[10px] font-medium text-blue-400 bg-blue-100 px-2 py-0.5 rounded-full">
                    {dr.semaAI}
                  </span>
                </div>
                <div className="p-4">
                  {preReviewLoading ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500 py-3">
                      <Loader2 size={14} className="animate-spin text-[#2563EB]" />
                      {dr.semaAnalyzing}
                    </div>
                  ) : preReview ? (
                    <div className="space-y-3">
                      {/* Score Bar */}
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-[#0F172A]">{preReview.suggestedScore}</div>
                        <div className="flex-1">
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${preReview.suggestedScore}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full rounded-full ${
                                preReview.suggestedScore >= 80 ? 'bg-emerald-500' : preReview.suggestedScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                            />
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{dr.suggestedScore}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          preReview.verdict === 'APPROVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {preReview.verdict === 'APPROVE' ? 'APPROVE' : 'REVISION'}
                        </span>
                      </div>

                      {preReview.strengths.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5">{dr.strengths}</div>
                          <ul className="space-y-1">
                            {preReview.strengths.map((s, i) => (
                              <li key={i} className="text-xs text-slate-600 flex gap-2">
                                <span className="text-emerald-500 flex-shrink-0 mt-0.5">•</span>{s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {preReview.warnings.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1.5">{dr.warnings}</div>
                          <ul className="space-y-1">
                            {preReview.warnings.map((w, i) => (
                              <li key={i} className="text-xs text-slate-600 flex gap-2">
                                <span className="text-amber-500 flex-shrink-0 mt-0.5">•</span>{w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {preReview.mentorNote && (
                        <div className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-600 italic border border-slate-200">
                          <span className="font-semibold not-italic text-slate-700">{dr.semaSuggests}</span>
                          {preReview.mentorNote}
                        </div>
                      )}
                      <div className="text-[9px] text-slate-400">Model: {preReview.model}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 py-2">Pre-review unavailable.</div>
                  )}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">{dr.feedbackLabel}</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={dr.feedbackPlaceholder}
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 border-t border-slate-200 flex gap-3 flex-shrink-0 bg-white">
              <button
                onClick={() => handleSubmit('REVISION')}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting && action === 'REVISION' ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                {dr.requestRevision}
              </button>
              <button
                onClick={() => handleSubmit('APPROVED')}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting && action === 'APPROVED' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                {dr.approve}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Submissions Table ────────────────────────────────────────────────────────

function SubmissionsTable({
  submissions,
  loading,
  onReviewClick,
}: {
  submissions: Submission[];
  loading: boolean;
  onReviewClick: (s: Submission) => void;
}) {
  const { t } = useLanguage();
  const sub = t.mentorDashboard.submissions;

  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const courses = Array.from(new Set(submissions.map((s) => s.courseTitle)));

  const filtered = submissions.filter((s) => {
    const matchSearch =
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentEmail.toLowerCase().includes(search.toLowerCase());
    const matchModule = !moduleFilter || s.courseTitle === moduleFilter;
    return matchSearch && matchModule;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, moduleFilter]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-slate-200">
        {/* Row 1: title + badge */}
        <div className="flex items-center gap-3 mb-3">
          <div className="font-bold text-slate-900 text-base leading-tight">{sub.title}</div>
          <span className="inline-flex items-center justify-center bg-[#2563EB] text-white text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
            {submissions.length} {sub.awaiting}
          </span>
        </div>
        {/* Row 2: search + filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[140px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={sub.filterPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div className="relative">
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
            >
              <option value="">{sub.allModules}</option>
              {courses.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">{sub.colStudent}</th>
              <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{sub.colCourse}</th>
              <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{sub.colRepo}</th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-400 text-sm">
                  <Loader2 size={20} className="animate-spin mx-auto mb-2" />
                  {sub.loading}
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-400 text-sm">{sub.empty}</td>
              </tr>
            ) : (
              paged.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-100 last:border-0 hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(s.studentName)}`}>
                        {getInitials(s.studentName)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">{s.studentName}</div>
                        <div className="text-xs text-slate-400 truncate">{s.studentEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-sm font-medium text-slate-800 leading-snug truncate max-w-[180px]">{s.courseTitle}</div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">{s.chapterTitle}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <a
                      href={s.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-mono text-[#2563EB] hover:text-blue-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Code size={11} className="flex-shrink-0" />
                      <span className="truncate max-w-[140px]">{s.githubUrl.replace('https://github.com/', '')}</span>
                    </a>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => onReviewClick(s)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-[#2563EB] hover:bg-blue-50 px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      {sub.reviewBtn}
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/40 flex-wrap gap-2">
        <span className="text-xs text-slate-500">
          {sub.showing} {Math.min(paged.length + (page - 1) * PER_PAGE, filtered.length)} {sub.of} {filtered.length} {sub.totalSuffix}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded text-xs font-semibold transition-colors cursor-pointer ${
                page === p ? 'bg-[#2563EB] text-white' : 'hover:bg-slate-200 text-slate-600'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Lesson Builder ───────────────────────────────────────────────────────────

function LessonBuilder({ courses }: { courses: CourseWithChapters[] }) {
  const { t } = useLanguage();
  const bd = t.mentorDashboard.builder;

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [assignmentPrompt, setAssignmentPrompt] = useState('');
  const [attachStarter, setAttachStarter] = useState(true);
  const [mandatory, setMandatory] = useState(true);
  const [saving, setSaving] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'draft'>('idle');

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const chapters = selectedCourse?.chapters ?? [];

  const handleAutoDraft = async () => {
    if (!lessonTitle.trim()) { alert('Enter a lesson topic/title first.'); return; }
    setDrafting(true);
    try {
      const res = await fetch('/api/sema-ai/draft-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: lessonTitle, courseTitle: selectedCourse?.title, courseSlug: selectedCourse?.slug }),
      });
      const data = await res.json();
      if (data.success && data.draft) {
        setLessonTitle(data.draft.lessonTitle || lessonTitle);
        setAssignmentPrompt(data.draft.assignmentPrompt || '');
      }
    } catch (err) { console.error(err); }
    finally { setDrafting(false); }
  };

  const handleSave = async (asDraft = false) => {
    if (!selectedChapterId || !lessonTitle || !assignmentPrompt) {
      alert('Please fill in Chapter, Lesson Title, and Assignment Prompt.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/mentor/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: selectedChapterId, title: lessonTitle, videoUrl: videoUrl || null, content: assignmentPrompt }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus(asDraft ? 'draft' : 'saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
        if (!asDraft) { setLessonTitle(''); setVideoUrl(''); setAssignmentPrompt(''); }
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
        <BookMarked size={16} className="text-slate-500 flex-shrink-0" />
        <div className="font-bold text-slate-900 text-sm flex-1">{bd.title}</div>
        <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex-shrink-0">
          Next.js 15
        </span>
      </div>

      <div className="px-5 py-4 space-y-4">
        <p className="text-xs text-slate-500">{bd.subtitle}</p>

        {/* Auto-Draft Button */}
        <button
          onClick={handleAutoDraft}
          disabled={drafting}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-70 cursor-pointer"
        >
          {drafting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {drafting ? bd.drafting : bd.autoDraft}
        </button>

        {/* Course */}
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1.5 block">{bd.courseLabel}</label>
          <div className="relative">
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                const c = courses.find((c) => c.id === e.target.value);
                setSelectedChapterId(c?.chapters[0]?.id ?? '');
              }}
              className="w-full appearance-none border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 pr-8 cursor-pointer"
            >
              <option value="">{bd.courseSelect}</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Chapter */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">{bd.chapterLabel}</label>
            <button className="flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:text-blue-700 cursor-pointer">
              <PlusCircle size={11} /> {bd.newChapter}
            </button>
          </div>
          <div className="relative">
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              disabled={chapters.length === 0}
              className="w-full appearance-none border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 pr-8 disabled:opacity-50 cursor-pointer"
            >
              <option value="">{chapters.length === 0 ? bd.chapterSelectFirst : bd.chapterSelect}</option>
              {chapters.map((ch) => <option key={ch.id} value={ch.id}>Chapter {ch.order}: {ch.title}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Lesson Title */}
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1.5 block">{bd.lessonTitle}</label>
          <input
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            placeholder={bd.lessonPlaceholder}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        {/* Video URL */}
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1.5 block">{bd.videoLabel}</label>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder={bd.videoPlaceholder}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        {/* Assignment Prompt */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">{bd.promptLabel}</label>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"><Bold size={11} /></button>
              <button className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"><Italic size={11} /></button>
              <button className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"><Code size={11} /></button>
            </div>
          </div>
          <textarea
            value={assignmentPrompt}
            onChange={(e) => setAssignmentPrompt(e.target.value)}
            placeholder={bd.promptPlaceholder}
            rows={4}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none font-mono text-xs"
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-2.5">
          {[
            { label: bd.attachStarter, state: attachStarter, setter: setAttachStarter },
            { label: bd.mandatory, state: mandatory, setter: setMandatory },
          ].map(({ label, state, setter }) => (
            <label key={label} className="flex items-center gap-3 cursor-pointer">
              <div className="flex-1 text-xs text-slate-700 flex items-center gap-2">
                <BookOpen size={12} className="text-slate-400 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </div>
              <div
                onClick={() => setter(!state)}
                className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors cursor-pointer flex-shrink-0 ${
                  state ? 'bg-[#2563EB] border-[#2563EB]' : 'border-slate-300 hover:border-blue-400'
                }`}
              >
                {state && <CheckCircle2 size={12} className="text-white" />}
              </div>
            </label>
          ))}
        </div>

        {/* Save Status Toast */}
        <AnimatePresence>
          {saveStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-2 ${
                saveStatus === 'saved' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <CheckCircle2 size={12} />
              {saveStatus === 'saved' ? bd.savedMsg : bd.draftMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <SendHorizontal size={14} />}
          {bd.saveStage}
        </button>

        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
        >
          <Save size={13} />
          {bd.saveDraft}
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function MentorDashboard() {
  const { t } = useLanguage();
  const md = t.mentorDashboard;

  const [activeNav, setActiveNav] = useState<NavKey>('submissions');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithChapters[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setSubmissionsLoading(true);
    try {
      const res = await fetch('/api/mentor/submissions');
      const data = await res.json();
      if (data.success) setSubmissions(data.submissions);
    } catch (err) { console.error(err); }
    finally { setSubmissionsLoading(false); }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch('/api/mentor/lessons');
      const data = await res.json();
      if (data.success) setCourses(data.courses ?? []);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchSubmissions();
    fetchCourses();
  }, [fetchSubmissions, fetchCourses]);

  const handleReviewed = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const ratingScore = 4.9;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <MentorSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        pendingCount={submissions.length}
        onLogout={handleLogout}
      />
      <TopHeader activeNav={activeNav} />

      <main className="ml-[220px] pt-14 min-h-screen">
        <div className="p-6 space-y-5 max-w-[1200px]">

          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-wrap items-center gap-4"
          >
            <div className="flex-1 min-w-[220px]">
              <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                <h1 className="text-xl font-bold text-[#0F172A]">{md.welcome}</h1>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {md.cohort}
                </span>
              </div>
              <p className="text-sm text-slate-500">{md.welcomeSub}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap">
                <Download size={14} />
                {md.exportGradebook}
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer whitespace-nowrap">
                <RefreshCw size={14} />
                {md.syncGitHub}
              </button>
            </div>
          </motion.div>

          {/* KPI Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: md.kpi.enrolled,
                value: '1,240',
                sub: md.kpi.enrolledSub,
                badge: '+12%',
                badgeColor: 'bg-emerald-100 text-emerald-700',
                icon: <Users size={20} className="text-[#2563EB]" />,
                iconBg: 'bg-blue-100',
                delay: 0.1,
              },
              {
                label: md.kpi.reviews,
                value: `${submissions.length}`,
                valueSub: md.kpi.reviewsQueue,
                sub: `${md.kpi.reviewsSub} • ${Math.min(submissions.length, 2)} ${md.kpi.highPriority}`,
                subDot: true,
                icon: <GitPullRequest size={20} className="text-slate-600" />,
                iconBg: 'bg-slate-100',
                delay: 0.15,
              },
              {
                label: md.kpi.effectiveness,
                value: ratingScore.toFixed(1),
                valueSub: '/5.0',
                sub: `384 ${md.kpi.effectivenessSub}`,
                subStars: true,
                icon: <Star size={20} className="text-[#2563EB]" />,
                iconBg: 'bg-blue-100',
                delay: 0.2,
              },
            ].map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: kpi.delay, duration: 0.4 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex items-start gap-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${kpi.iconBg}`}>
                  {kpi.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{kpi.label}</div>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <div className="text-3xl font-bold text-[#0F172A] leading-none">{kpi.value}</div>
                    {'valueSub' in kpi && kpi.valueSub && (
                      <div className="text-sm text-slate-500 font-semibold">{kpi.valueSub}</div>
                    )}
                    {'badge' in kpi && kpi.badge && (
                      <span className={`ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${kpi.badgeColor}`}>
                        <TrendingUp size={9} /> {kpi.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-1 flex-wrap">
                    {'subDot' in kpi && kpi.subDot && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 inline-block flex-shrink-0" />
                    )}
                    {'subStars' in kpi && kpi.subStars && (
                      <div className="flex gap-0.5">
                        {[1,2,3,4].map((j) => <Star key={j} size={10} className="text-amber-400 fill-amber-400" />)}
                        <Star size={10} className="text-amber-300 fill-amber-100" />
                      </div>
                    )}
                    {kpi.sub}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Workspace */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 items-start"
          >
            <SubmissionsTable
              submissions={submissions}
              loading={submissionsLoading}
              onReviewClick={setSelectedSubmission}
            />
            <LessonBuilder courses={courses} />
          </motion.div>
        </div>
      </main>

      <ReviewDrawer
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onReviewed={handleReviewed}
      />
    </div>
  );
}
