'use client';

import React from 'react';
import Link from 'next/link';
import {
  Code2,
  GraduationCap,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ExternalLink,
  MessageSquare,
  Play,
  GitPullRequest,
} from 'lucide-react';

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-white font-mono text-xs font-bold">
                &lt;&gt;
              </div>
              <span className="font-extrabold text-slate-900 text-sm hidden sm:inline">
                CodePath Academy
              </span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Student Portal (User)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Switch Demo Role</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
              AV
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cohort #12 • Active Enrollment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, Alex Vance 👋
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              You are currently on track to complete Modern Fullstack Web Development. 2 modules remaining before capstone presentation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/#courses"
              className="px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Module 7.3</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Course Progress
            </span>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-black text-slate-900">68%</span>
              <span className="text-xs text-blue-600 font-semibold">32 of 48 Lessons</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[68%] h-full bg-blue-600 rounded-full" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              PR Reviews Completed
            </span>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-black text-slate-900">14 / 16</span>
              <span className="text-xs text-emerald-600 font-semibold font-mono">98.4% Score</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[88%] h-full bg-emerald-500 rounded-full" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Assigned Lead Mentor
            </span>
            <div className="text-base font-bold text-slate-900 truncate">Rian Pratama</div>
            <div className="text-xs text-slate-500 mt-1">Staff Eng at Tech Unicorn</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Target Credential ID
            </span>
            <div className="text-base font-mono font-bold text-blue-600">CP-2026-889</div>
            <div className="text-xs text-slate-500 mt-1">Verified on completion</div>
          </div>
        </div>

        {/* Current Active Course & Review Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Course Progress Card (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Active Course
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Modern Fullstack Web Development (React &amp; Node.js)
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                In Progress
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Module 6: PostgreSQL Schema &amp; Prisma ORM</h4>
                    <p className="text-[11px] text-slate-500">Passed automated CI test suite • Verified</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600">100 / 100</span>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Module 7: Optimistic UI &amp; Server Actions</h4>
                    <p className="text-[11px] text-blue-600">Currently active • Lesson 7.3</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                >
                  Continue
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between opacity-70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Module 8: Docker Containerization &amp; AWS CI/CD</h4>
                    <p className="text-[11px] text-slate-500">Unlocks upon completing Module 7</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">Locked</span>
              </div>
            </div>
          </div>

          {/* Socratic Feedback & Mentor Notes (1 col) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GitPullRequest className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Latest Mentor PR Feedback
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-800">PR #42: /api/checkout</strong>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    APPROVED
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed italic">
                  &ldquo;Clean schema validation with Zod and great use of transactions on the order items. Ready to merge.&rdquo;
                </p>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between">
                  <span>Reviewed by Rian Pratama</span>
                  <span>Yesterday</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
              <div>
                <span className="font-bold block">Next Live 1-on-1 Mentorship</span>
                <span className="text-[11px] text-blue-700">Saturday at 10:00 AM WIB</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-semibold">
                Confirmed
              </span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

