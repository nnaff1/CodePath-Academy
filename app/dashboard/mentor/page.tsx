'use client';

import React from 'react';
import Link from 'next/link';
import {
  Code2,
  Zap,
  ArrowLeft,
  CheckCircle2,
  Clock,
  GitPullRequest,
  Users,
  MessageSquare,
  Award,
  AlertCircle,
} from 'lucide-react';

export default function MentorDashboard() {
  const pendingPRs = [
    {
      id: 'PR #108',
      student: 'Alex Vance',
      branch: 'feature/optimistic-cart-sync',
      course: 'Modern Fullstack Web Development',
      submitted: '32m ago',
      filesChanged: 4,
      status: 'Awaiting Review',
    },
    {
      id: 'PR #107',
      student: 'Nadia Salsabila',
      branch: 'microservice/redis-distributed-lock',
      course: 'Backend Microservices & Cloud',
      submitted: '2h ago',
      filesChanged: 7,
      status: 'In Progress',
    },
    {
      id: 'PR #105',
      student: 'Dimas Aditya',
      branch: 'ai-agent/vector-similarity-rerank',
      course: 'Fullstack AI Engineering & LLM Apps',
      submitted: '5h ago',
      filesChanged: 3,
      status: 'Awaiting Review',
    },
  ];

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
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Mentor Portal (Admin)
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
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
              SW
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Staff Engineer Mentor Queue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sarah Wijaya • Review Command Center
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Lead Backend Architect @ Traveloka • Mentoring 8 candidates in Cohort #12 &amp; #14. 3 pull requests awaiting synchronous review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('All pending PR review environments initialized.')}
              className="px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>Launch Multi-PR Reviewer</span>
            </button>
          </div>
        </div>

        {/* Mentor Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              PRs in Review Queue
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-indigo-600">3 Pending</span>
              <span className="text-xs font-mono text-amber-600 font-medium">Avg SLA: 2.1h</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Active Mentees
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">8 Candidates</span>
              <span className="text-xs text-emerald-600 font-semibold font-mono">100% On-Track</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Code Review Rubric Score
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">98.6%</span>
              <span className="text-xs text-blue-600 font-semibold">Strict Standard</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Graduation Placement
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-600">92.4%</span>
              <span className="text-xs text-slate-500">Unicorn Tier</span>
            </div>
          </div>
        </div>

        {/* PR Review Queue Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Active Code Review Queue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Line-by-line inspection required before code can be merged into production main branch.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
              3 Tasks
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingPRs.map((pr) => (
              <div
                key={pr.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600">
                      {pr.id}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {pr.student}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {pr.branch}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Course: <strong className="text-slate-700">{pr.course}</strong> • {pr.filesChanged} files modified • Submitted {pr.submitted}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Opening Code Review Diff for ${pr.id} (${pr.student})...`)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-700 text-xs font-semibold transition cursor-pointer shadow-2xs"
                  >
                    Inspect Diff
                  </button>
                  <button
                    onClick={() => alert(`Approval submitted for ${pr.id}. Candidate notified!`)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer shadow-2xs"
                  >
                    Approve PR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

