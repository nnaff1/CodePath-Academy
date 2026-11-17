'use client';

import React from 'react';
import Link from 'next/link';
import {
  Code2,
  Shield,
  ArrowLeft,
  Users,
  Activity,
  Server,
  CreditCard,
  Settings,
  Download,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const telemetryData = [
    { label: 'Active Concurrent Learners', value: '1,420', change: '+18.4% vs last week', status: 'Optimal' },
    { label: 'Total Verified Graduates', value: '12,418', change: 'Across 14 countries', status: 'Audited' },
    { label: 'Platform Availability (30d)', value: '99.98%', change: 'Zero critical incidents', status: 'Healthy' },
    { label: 'Q1 Cohort Tuition Volume', value: 'Rp 3.840.000.000', change: 'QRIS & Instant VA', status: 'Reconciled' },
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
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Super Admin / Platform Owner
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
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
              SA
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Platform Master Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              System Telemetry &amp; Ecosystem Ops
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Real-time monitoring across admissions, student cohort progress, staff mentors, and automated evaluation clusters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Platform audit export generated and downloaded.')}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit</span>
            </button>
            <button
              onClick={() => alert('Broadcast announcement modal opened.')}
              className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Broadcast Alert</span>
            </button>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {telemetryData.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {item.status}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900">{item.value}</div>
              <p className="text-xs text-slate-500">{item.change}</p>
            </div>
          ))}
        </div>

        {/* Global Cohort Status & Infrastructure Cluster */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cohort Admissions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900">
              Active Cohorts &amp; Admissions
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Cohort 2026.1 (Fullstack &amp; Backend)</h4>
                  <p className="text-[11px] text-slate-500">184 active learners • Week 8 of 12</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold font-mono">
                  LIVE NOW
                </span>
              </div>
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Cohort 2026.2 (AI Engineering &amp; Systems)</h4>
                  <p className="text-[11px] text-blue-600">Admissions Open • Starts in 14 days</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold font-mono">
                  92% FILLED
                </span>
              </div>
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900">
              Service Clusters &amp; Security
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Code Evaluation Sandbox (Docker pods)</span>
                <span className="text-emerald-600 font-mono font-bold">100% Operational</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Sema AI Socratic Inference Pipeline (Groq)</span>
                <span className="text-emerald-600 font-mono font-bold">Latency 142ms</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Certificate Verification Ledger</span>
                <span className="text-emerald-600 font-mono font-bold">Synced (SHA-256)</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

