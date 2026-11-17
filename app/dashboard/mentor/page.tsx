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
  ExternalLink,
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
  AlertTriangle,
  ChevronLeft,
  BookMarked,
  Loader2,
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

// ─── Avatar helper ───────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
];

function getAvatarColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

type NavKey = 'overview' | 'courses' | 'builder' | 'submissions' | 'forum';

interface SidebarProps {
  activeNav: NavKey;
  setActiveNav: (k: NavKey) => void;
  pendingCount: number;
  onLogout: () => void;
}

function MentorSidebar({ activeNav, setActiveNav, pendingCount, onLogout }: SidebarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems: { key: NavKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { key: 'courses', label: 'My Courses', icon: <BookOpen size={18} /> },
    { key: 'builder', label: 'Course Builder', icon: <Hammer size={18} /> },
    { key: 'submissions', label: 'Student Submissions', icon: <ClipboardList size={18} /> },
    { key: 'forum', label: 'Q&A Forum', icon: <MessageSquare size={18} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-white border-r border-slate-200 flex flex-col z-30">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
            <Code size={14} className="text-white" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#0F172A] leading-none">CodePath</div>
            <div className="text-[9px] font-semibold tracking-widest text-[#2563EB] uppercase leading-none mt-0.5">
              ACADEMY
            </div>
          </div>
          <span className="ml-auto text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            v2.4
          </span>
        </div>
      </div>

      {/* Section Label */}
      <div className="px-5 pt-4 pb-2">
        <span className="text-[9px] font-bold tracking-widest text-emerald-600 uppercase">
          • INSTRUCTOR PORTAL
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ key, label, icon }) => {
          const isActive = activeNav === key;
          return (
            <button
              key={key}
              onClick={() => setActiveNav(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-400'}>{icon}</span>
              <span className="flex-1 text-left truncate">{label}</span>
              {key === 'submissions' && pendingCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
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
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors relative">
          <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            SW
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">Sarah Wijaya</div>
            <div className="text-xs text-slate-500 truncate">Lead Instructor</div>
          </div>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
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
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-1.5 px-3 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-emerald-600">ACTIVE MENTOR</span>
        </div>
      </div>
    </aside>
  );
}

// ─── Top Header ───────────────────────────────────────────────────────────────

interface HeaderProps {
  activeNav: NavKey;
}

function TopHeader({ activeNav }: HeaderProps) {
  const { language, setLanguage } = useLanguage();
  const [hasNotif, setHasNotif] = useState(true);

  const navLabels: Record<NavKey, string> = {
    overview: 'Overview',
    courses: 'My Courses',
    builder: 'Course Builder',
    submissions: 'Curriculum & Cohort Console',
    forum: 'Q&A Forum',
  };

  return (
    <header className="fixed top-0 left-[220px] right-0 h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 z-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-slate-500 flex-shrink-0">
        <span className="text-slate-400">Instructor Portal</span>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-semibold text-slate-700">{navLabels[activeNav]}</span>
      </div>

      {/* Office Hours Pill */}
      <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0">
        <Clock size={12} />
        Office Hours at 4:00 PM EST
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search code, students, labs..."
          className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Language Toggle */}
        <div className="flex items-center bg-slate-100 rounded-full p-0.5 gap-0.5">
          <Globe size={12} className="text-slate-400 ml-1.5" />
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
          className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Bell size={18} className="text-slate-500" />
          {hasNotif && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white" />
          )}
        </button>

        {/* Avatar */}
        <button className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-white text-xs font-bold cursor-pointer">
          SW
        </button>
        <ChevronDown size={14} className="text-slate-400" />
      </div>
    </header>
  );
}

// ─── Review Drawer ────────────────────────────────────────────────────────────

interface ReviewDrawerProps {
  submission: Submission | null;
  onClose: () => void;
  onReviewed: (id: string, status: 'APPROVED' | 'REVISION', feedback: string) => void;
}

function ReviewDrawer({ submission, onClose, onReviewed }: ReviewDrawerProps) {
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
    // Auto-fetch pre-review
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
      .then((d) => {
        if (d.success) setPreReview(d.preReview);
      })
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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-[480px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div>
                <div className="text-sm font-bold text-slate-900">Review Submission</div>
                <div className="text-xs text-slate-500 mt-0.5">{submission.studentName} · {submission.courseTitle}</div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {/* Student Info */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${getAvatarColor(submission.studentName)}`}
                >
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
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">GitHub Repo</div>
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
                  <span className="text-sm font-semibold text-[#2563EB]">Sema Co-Pilot Pre-Review</span>
                  <span className="ml-auto text-[10px] font-medium text-blue-400 bg-blue-100 px-2 py-0.5 rounded-full">
                    AI Analysis
                  </span>
                </div>
                <div className="p-4">
                  {preReviewLoading ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500 py-3">
                      <Loader2 size={14} className="animate-spin text-[#2563EB]" />
                      Sema AI is analyzing the submission...
                    </div>
                  ) : preReview ? (
                    <div className="space-y-3">
                      {/* Score */}
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-[#0F172A]">{preReview.suggestedScore}</div>
                        <div className="flex-1">
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                preReview.suggestedScore >= 80 ? 'bg-emerald-500' : preReview.suggestedScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${preReview.suggestedScore}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Suggested Score / 100</div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                            preReview.verdict === 'APPROVE'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {preReview.verdict === 'APPROVE' ? 'APPROVE' : 'REVISION'}
                        </span>
                      </div>

                      {/* Strengths */}
                      {preReview.strengths.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5">
                            ✓ Strengths
                          </div>
                          <ul className="space-y-1">
                            {preReview.strengths.map((s, i) => (
                              <li key={i} className="text-xs text-slate-600 flex gap-2">
                                <span className="text-emerald-500 flex-shrink-0 mt-0.5">•</span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Warnings */}
                      {preReview.warnings.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1.5">
                            ⚠ Areas to Improve
                          </div>
                          <ul className="space-y-1">
                            {preReview.warnings.map((w, i) => (
                              <li key={i} className="text-xs text-slate-600 flex gap-2">
                                <span className="text-amber-500 flex-shrink-0 mt-0.5">•</span>
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Mentor Note */}
                      {preReview.mentorNote && (
                        <div className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-600 italic border border-slate-200">
                          <span className="font-semibold not-italic text-slate-700">Sema suggests: </span>
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

              {/* Feedback Textarea */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">
                  Mentor Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Leave constructive feedback for the student..."
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
                Request Revision
              </button>
              <button
                onClick={() => handleSubmit('APPROVED')}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting && action === 'APPROVED' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                Approve & Award XP
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Submissions Table ────────────────────────────────────────────────────────

interface SubmissionsTableProps {
  submissions: Submission[];
  loading: boolean;
  onReviewClick: (s: Submission) => void;
}

function SubmissionsTable({ submissions, loading, onReviewClick }: SubmissionsTableProps) {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All Modules');
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = submissions.filter((s) => {
    const matchSearch =
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentEmail.toLowerCase().includes(search.toLowerCase());
    const matchModule = moduleFilter === 'All Modules' || s.courseTitle.includes(moduleFilter);
    return matchSearch && matchModule;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const courses = Array.from(new Set(submissions.map((s) => s.courseTitle)));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-3">
        <div>
          <div className="font-bold text-slate-900 text-base">Student Submissions</div>
        </div>
        <span className="bg-[#2563EB] text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {submissions.length} Awaiting
        </span>
        <div className="flex-1" />
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Filter student..."
            className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-36"
          />
        </div>
        {/* Module Filter */}
        <div className="relative">
          <select
            value={moduleFilter}
            onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}
            className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
          >
            <option>All Modules</option>
            {courses.map((c) => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3">
                Student Name
              </th>
              <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">
                Course & Module
              </th>
              <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">
                GitHub Repo
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-400 text-sm">
                  <Loader2 size={20} className="animate-spin mx-auto mb-2" />
                  Loading submissions...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-400 text-sm">
                  No pending submissions found.
                </td>
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
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(s.studentName)}`}
                      >
                        {getInitials(s.studentName)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{s.studentName}</div>
                        <div className="text-xs text-slate-400">{s.studentEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-sm font-medium text-slate-800 leading-snug">{s.courseTitle}</div>
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
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-[#2563EB] hover:bg-blue-50 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Review →
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
        <span className="text-xs text-slate-500">
          Showing {Math.min(paged.length, PER_PAGE)} of {filtered.length} total cohort submissions
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

interface LessonBuilderProps {
  courses: CourseWithChapters[];
}

function LessonBuilder({ courses }: LessonBuilderProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
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

  const autoSelectFirstChapter = useCallback((courseId: string) => {
    const c = courses.find((c) => c.id === courseId);
    if (c?.chapters.length) setSelectedChapterId(c.chapters[0].id);
  }, [courses]);

  const handleAutoDraft = async () => {
    if (!lessonTitle.trim()) {
      alert('Enter a lesson topic/title first for Sema AI to draft.');
      return;
    }
    setDrafting(true);
    try {
      const res = await fetch('/api/sema-ai/draft-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: lessonTitle,
          courseTitle: selectedCourse?.title,
          courseSlug: selectedCourse?.slug,
        }),
      });
      const data = await res.json();
      if (data.success && data.draft) {
        setLessonTitle(data.draft.lessonTitle || lessonTitle);
        setAssignmentPrompt(data.draft.assignmentPrompt || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDrafting(false);
    }
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
        body: JSON.stringify({
          chapterId: selectedChapterId,
          title: lessonTitle,
          videoUrl: videoUrl || null,
          content: assignmentPrompt,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus(asDraft ? 'draft' : 'saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
        if (!asDraft) {
          setLessonTitle('');
          setVideoUrl('');
          setAssignmentPrompt('');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
        <BookMarked size={16} className="text-slate-500" />
        <div className="font-bold text-slate-900 text-sm flex-1">Add New Lesson</div>
        <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
          Next.js 15
        </span>
      </div>

      <div className="px-5 py-4 space-y-4">
        <p className="text-xs text-slate-500">Draft and stage new curriculum modules into your active syllabus.</p>

        {/* Auto-Draft Button */}
        <button
          onClick={handleAutoDraft}
          disabled={drafting}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-70 cursor-pointer"
        >
          {drafting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} />
          )}
          {drafting ? 'Sema AI is drafting...' : '✨ Auto-Draft Lesson with Sema AI'}
        </button>

        {/* Course Select */}
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Course</label>
          <div className="relative">
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedChapterId('');
                autoSelectFirstChapter(e.target.value);
              }}
              className="w-full appearance-none border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 pr-8 cursor-pointer"
            >
              <option value="">Select a course...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Chapter Placement */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">Chapter Placement</label>
            <button className="flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:text-blue-700 cursor-pointer">
              <PlusCircle size={11} /> New Chapter
            </button>
          </div>
          <div className="relative">
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              disabled={chapters.length === 0}
              className="w-full appearance-none border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 pr-8 disabled:opacity-50 cursor-pointer"
            >
              <option value="">
                {chapters.length === 0 ? 'Select course first...' : 'Select chapter...'}
              </option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Chapter {ch.order}: {ch.title}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Lesson Title */}
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Lesson Title</label>
          <input
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            placeholder="e.g. Optimistic UI Updates with useActionState"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        {/* Video URL */}
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Video Lecture Embed URL</label>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://player.vimeo.com/video/..."
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        {/* Assignment Prompt */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">Assignment Prompt & Rubric</label>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"><Bold size={11} /></button>
              <button className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"><Italic size={11} /></button>
              <button className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"><Code size={11} /></button>
            </div>
          </div>
          <textarea
            value={assignmentPrompt}
            onChange={(e) => setAssignmentPrompt(e.target.value)}
            placeholder="Implement optimistic cart item deletion and handle edge rollback when server action fails with 500 error status."
            rows={4}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none font-mono text-xs"
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-2.5">
          {[
            { label: 'Attach Starter Repo Template', state: attachStarter, setter: setAttachStarter },
            { label: 'Mandatory for Cohort Completion', state: mandatory, setter: setMandatory },
          ].map(({ label, state, setter }) => (
            <label key={label} className="flex items-center gap-3 cursor-pointer group">
              <div className="flex-1 text-xs text-slate-700 flex items-center gap-2">
                <BookOpen size={12} className="text-slate-400" />
                {label}
              </div>
              <div
                onClick={() => setter(!state)}
                className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors cursor-pointer ${
                  state ? 'bg-[#2563EB] border-[#2563EB]' : 'border-slate-300 hover:border-blue-400'
                }`}
              >
                {state && <CheckCircle2 size={12} className="text-white" />}
              </div>
            </label>
          ))}
        </div>

        {/* Save Status */}
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
              {saveStatus === 'saved' ? 'Lesson staged to curriculum!' : 'Saved as draft.'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save & Stage */}
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <SendHorizontal size={14} />}
          Save & Stage to Curriculum
        </button>

        {/* Save Draft */}
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
        >
          <Save size={13} />
          Save Draft
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function MentorDashboard() {
  const [activeNav, setActiveNav] = useState<NavKey>('submissions');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithChapters[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Fetch submissions
  const fetchSubmissions = useCallback(async () => {
    setSubmissionsLoading(true);
    try {
      const res = await fetch('/api/mentor/submissions');
      const data = await res.json();
      if (data.success) setSubmissions(data.submissions);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmissionsLoading(false);
    }
  }, []);

  // Fetch courses for lesson builder
  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch('/api/mentor/lessons');
      const data = await res.json();
      if (data.success) setCourses(data.courses ?? []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
    fetchCourses();
  }, [fetchSubmissions, fetchCourses]);

  const handleReviewed = (id: string, _status: string, _feedback: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  // KPI stats
  const totalEnrolled = 1240;
  const pendingPRs = submissions.length;
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

      {/* Main Content */}
      <main className="ml-[220px] pt-14 min-h-screen">
        <div className="p-6 space-y-5 max-w-[1200px]">

          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex items-center gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-xl font-bold text-[#0F172A]">Welcome back, Sarah 👋</h1>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                  FALL &#39;24 COHORT
                </span>
              </div>
              <p className="text-sm text-slate-500">
                Here is what&#39;s happening across your active cohorts and pending code reviews today.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                <Download size={14} />
                Export Gradebook
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer">
                <RefreshCw size={14} />
                Sync GitHub Classrooms
              </button>
            </div>
          </motion.div>

          {/* KPI Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: 'TOTAL ENROLLED STUDENTS',
                value: totalEnrolled.toLocaleString(),
                sub: 'this month across 3 active cohorts',
                badge: '+12%',
                badgeColor: 'bg-emerald-100 text-emerald-700',
                icon: <Users size={20} className="text-[#2563EB]" />,
                iconBg: 'bg-blue-100',
                delay: 0.1,
              },
              {
                label: 'PENDING CODE REVIEWS',
                value: `${pendingPRs}`,
                valueSub: 'PRs in queue',
                sub: `Requires review within 24h • ${Math.min(pendingPRs, 2)} high priority`,
                subIcon: <span className="w-2 h-2 rounded-full bg-amber-400 inline-block mr-1" />,
                icon: <GitPullRequest size={20} className="text-slate-600" />,
                iconBg: 'bg-slate-100',
                delay: 0.15,
              },
              {
                label: 'INSTRUCTOR EFFECTIVENESS',
                value: ratingScore.toFixed(1),
                valueSub: '/5.0',
                sub: '384 ratings (98% positive)',
                subIcon: (
                  <div className="flex gap-0.5 mr-1">
                    {[1, 2, 3, 4].map((i) => (
                      <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                    ))}
                    <Star size={10} className="text-amber-300 fill-amber-100" />
                  </div>
                ),
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
                  <div className="flex items-baseline gap-1">
                    <div className="text-3xl font-bold text-[#0F172A] leading-none">{kpi.value}</div>
                    {kpi.valueSub && <div className="text-sm text-slate-500 font-semibold">{kpi.valueSub}</div>}
                    {'badge' in kpi && kpi.badge && (
                      <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${kpi.badgeColor}`}>
                        <TrendingUp size={9} /> {kpi.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1.5 flex items-center">
                    {kpi.subIcon}
                    {kpi.sub}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Workspace: Submissions (65%) + Lesson Builder (35%) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="grid grid-cols-[1fr_340px] gap-5 items-start"
          >
            {/* Submissions Table */}
            <SubmissionsTable
              submissions={submissions}
              loading={submissionsLoading}
              onReviewClick={setSelectedSubmission}
            />

            {/* Lesson Builder */}
            <LessonBuilder courses={courses} />
          </motion.div>
        </div>
      </main>

      {/* Review Drawer */}
      <ReviewDrawer
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onReviewed={handleReviewed}
      />
    </div>
  );
}
