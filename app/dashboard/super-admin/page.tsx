'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  DollarSign,
  GraduationCap,
  Award,
  FileText,
  Zap,
  Download,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  Activity,
  BookOpen,
  Users,
  Layout,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Server,
  ArrowUpRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSuperAdmin } from './SuperAdminContext';

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface PlatformKPIs {
  totalRevenue: number;
  formattedRevenue: string;
  revenueGrowth: string;
  activeStudents: number;
  studentGrowth: string;
  verifiedMentors: number;
  mentorSla: string;
  pendingApprovals: number;
  pendingSla: string;
  publishedCourses: number;
}

interface SystemStatus {
  status: 'OPERATIONAL' | 'MAINTENANCE';
  cluster: string;
  auditCycle: string;
  maintenanceMode: boolean;
  announcementBanner: string;
  isAnnouncementLive: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

function SuperAdminAnalyticsContent() {
  const { language, t } = useLanguage();
  const sa = t.superAdminDashboard;
  const {
    pendingApprovals,
    setPendingApprovals,
    isMaintenanceMode,
    setIsMaintenanceMode,
    showToast,
  } = useSuperAdmin();

  // Loading & Data States
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<PlatformKPIs | null>(null);
  const [system, setSystem] = useState<SystemStatus | null>(null);
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false);

  // Fetch live overview from SQLite
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/super-admin/overview');
      const data = await res.json();

      if (data.success) {
        setKpis(data.kpis);
        setSystem(data.system);
        setIsMaintenanceMode(data.system?.maintenanceMode ?? false);
        if (typeof data.kpis?.pendingApprovals === 'number') {
          setPendingApprovals(data.kpis.pendingApprovals);
        }
      }
    } catch (err) {
      console.error('Failed to load Super Admin overview:', err);
      showToast(language === 'id' ? 'Gagal memuat analitik platform.' : 'Failed to load platform analytics.');
    } finally {
      setLoading(false);
    }
  }, [language, setIsMaintenanceMode, setPendingApprovals, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Maintenance Mode Toggle
  const handleToggleMaintenance = async () => {
    setIsTogglingMaintenance(true);
    const target = !isMaintenanceMode;
    try {
      const res = await fetch('/api/super-admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-maintenance', isMaintenanceMode: target }),
      });
      const data = await res.json();
      if (data.success) {
        setIsMaintenanceMode(target);
        showToast(
          language === 'id'
            ? target
              ? 'Mode pemeliharaan platform DIAKTIFKAN'
              : 'Mode pemeliharaan platform DIMATIKAN'
            : target
            ? 'Platform maintenance mode ACTIVATED'
            : 'Platform maintenance mode DEACTIVATED'
        );
      }
    } catch {
      showToast(language === 'id' ? 'Gagal mengubah status pemeliharaan.' : 'Failed to toggle maintenance mode.');
    } finally {
      setIsTogglingMaintenance(false);
    }
  };

  // Handle Export Audit Report
  const handleGenerateReport = () => {
    const reportData = [
      ['AUDIT REPORT - CODEPATH ACADEMY PLATFORM GOVERNANCE'],
      ['Generated At', new Date().toISOString()],
      ['Cluster', 'ap-southeast-prod-01'],
      ['Environment Mode', isMaintenanceMode ? 'MAINTENANCE' : 'OPERATIONAL'],
      ['Total Platform Gross Revenue', kpis?.formattedRevenue || 'Rp 151.720.000'],
      ['Active Students (USER)', (kpis?.activeStudents ?? 4820).toString()],
      ['Verified Mentors (ADMIN)', (kpis?.verifiedMentors ?? 18).toString()],
      ['Pending Course Approvals', (kpis?.pendingApprovals ?? pendingApprovals).toString()],
      ['Published Courses', (kpis?.publishedCourses ?? 12).toString()],
      ['Database Engine', 'SQLite via Prisma ORM (prisma/dev.db)'],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      reportData.map((e) => e.map((val) => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `codepath_platform_governance_audit_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(
      language === 'id'
        ? 'Laporan audit tata kelola platform berhasil diunduh.'
        : 'Platform governance audit report generated and downloaded.'
    );
  };

  const displayPending = kpis?.pendingApprovals ?? pendingApprovals;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] w-full">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. EXECUTIVE HEADER (Platform Governance & Operations)      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
      >
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-semibold">
            <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{sa.auditCycle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {sa.pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            {sa.pageSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={fetchData}
            disabled={loading}
            title={language === 'id' ? 'Segarkan Data' : 'Refresh Metrics'}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#2563EB]' : ''}`} />
          </button>

          {/* Generate Audit Report button */}
          <button
            onClick={handleGenerateReport}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{sa.generateReport}</span>
          </button>

          {/* Prod: Normal / Maintenance Mode Toggle */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
              {isMaintenanceMode ? sa.maintenanceMode : sa.normalMode}
            </span>
            <button
              onClick={handleToggleMaintenance}
              disabled={isTogglingMaintenance}
              className="cursor-pointer transition hover:opacity-80 disabled:opacity-50"
            >
              {isMaintenanceMode ? (
                <ToggleRight className="w-7 h-7 text-amber-500" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-[#2563EB]" />
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2. 4-COLUMN PLATFORM KPI CARDS                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* CARD 1: TOTAL PLATFORM REVENUE */}
        <Link
          href="/dashboard/super-admin/promo-revenue"
          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-sm transition group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {sa.kpi.totalRevenue}
              </p>
              <p className="text-2xl font-extrabold text-[#0F172A] mt-2 group-hover:text-[#2563EB] transition-colors">
                {kpis?.formattedRevenue || 'Rp 151.720.000'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {sa.kpi.revenueGrowth}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5 group-hover:text-[#2563EB]">
              {language === 'id' ? 'Detail Finansial' : 'Inspect'} <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* CARD 2: ACTIVE STUDENTS */}
        <Link
          href="/dashboard/super-admin/users"
          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {sa.kpi.activeStudents}
              </p>
              <p className="text-2xl font-extrabold text-[#0F172A] mt-2">
                {kpis?.activeStudents ? kpis.activeStudents.toLocaleString('id-ID') : '4.820'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">
              {sa.kpi.studentGrowth}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5 group-hover:text-[#0F172A]">
              {language === 'id' ? 'Direktori' : 'Directory'} <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* CARD 3: VERIFIED MENTORS */}
        <Link
          href="/dashboard/super-admin/users"
          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-sm transition group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {sa.kpi.verifiedMentors}
              </p>
              <p className="text-2xl font-extrabold text-[#0F172A] mt-2">
                {kpis?.verifiedMentors || '18'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100 shadow-2xs">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-600">
              {sa.kpi.mentorSla}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5 group-hover:text-[#2563EB]">
              {language === 'id' ? 'Tim Mentor' : 'Mentors'} <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* CARD 4: PENDING COURSE APPROVALS */}
        <Link
          href="/dashboard/super-admin/course-approvals"
          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-rose-300 hover:shadow-sm transition group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {sa.kpi.pendingApprovals}
              </p>
              <p className="text-2xl font-extrabold text-[#0F172A] mt-2 group-hover:text-rose-600 transition-colors">
                {displayPending}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {sa.kpi.pendingAction}
            </span>
            <span className="text-[10px] font-semibold text-rose-600 flex items-center gap-0.5 group-hover:underline">
              {language === 'id' ? 'Tinjau Antrean →' : 'Review Queue →'}
            </span>
          </div>
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. EXECUTIVE ACTIVITY & COHORT HEALTH SUMMARY (ABOVE FOLD)  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2): Cohort #14 Telemetry & Microservices Health */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card A: Active Cohort #14 Telemetry */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {language === 'id'
                      ? 'Telemetri Cohort #14 • Kecepatan Kurikulum'
                      : 'Active Cohort #14 Telemetry • Curriculum Velocity'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'id'
                      ? 'Penyelesaian modul, commit kode proyek, dan performa SLA mentor real-time'
                      : 'Real-time module completions, project code commits, and mentor turnaround SLA'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                94.6% On Track
              </span>
            </div>

            {/* Progress Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'id' ? 'Progress Kurikulum' : 'Curriculum Progress'}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-extrabold text-[#0F172A]">78.4%</span>
                  <span className="text-[10px] text-emerald-600 font-bold">↗ +4.2%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '78.4%' }} />
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'id' ? 'Review Proyek Hari Ini' : 'Today Submissions'}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-extrabold text-[#0F172A]">128</span>
                  <span className="text-[10px] text-slate-500 font-medium">PRs Merged</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  {language === 'id' ? 'Dari 410 siswa aktif cohort' : 'From 410 active cohort students'}
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'id' ? 'Rata-rata Respon SLA' : 'Avg. Mentor Response'}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-extrabold text-emerald-600">42m</span>
                  <span className="text-[10px] text-slate-500 font-medium">/ 2h SLA Target</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  {language === 'id' ? '18 mentor aktif bertugas' : '18 active on-duty mentors'}
                </p>
              </div>
            </div>

            {/* Microservice & Platform Node Health */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {language === 'id' ? 'Status Klaster & Microservices' : 'Microservice Health & Ingestion Nodes'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">Auth & RBAC</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    99.99%
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-semibold text-slate-700">Code Sandbox</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    32 Nodes
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-semibold text-slate-700">Payment Gateway</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Live Governance Audit Feed */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-[#0F172A]">
                  {language === 'id' ? 'Log Aktivitas Tata Kelola Terkini' : 'Recent Platform Governance Activity'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {language === 'id' ? 'Diperbarui otomatis' : 'Live Sync'}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#0F172A] truncate">
                      {language === 'id'
                        ? 'Pengajuan silabus baru: Advanced Microservices in Go'
                        : 'New course curriculum submitted for review'}
                    </p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">18m ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Sarah Wijaya • ID: CRS-GO-2026 • {language === 'id' ? 'Menunggu persetujuan Super Admin' : 'Awaiting super admin publish decision'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Layout className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#0F172A] truncate">
                      {language === 'id'
                        ? 'Pembaruan banner pengumuman publik landing page'
                        : 'Landing page announcement banner updated'}
                    </p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">1h ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Alexander Wright • {system?.isAnnouncementLive ? 'Status: LIVE ON SITE' : 'Status: DRAFT'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#0F172A] truncate">
                      {language === 'id'
                        ? 'Settlement Midtrans webhook: Rp 399.000 terverifikasi'
                        : 'Midtrans tuition transaction verified & settled'}
                    </p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">2h ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Maya Lin • Production AI Agents & LLM • Code: EARLYBIRD
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Span 1): Operations Quick-Jump Station */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-[#0F172A] text-white flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  {language === 'id' ? 'Navigasi Cepat Modul Operasional' : 'Operations Station Quick Jump'}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {language === 'id' ? 'Pindah langsung ke modul spesifik' : 'Dedicated sub-portal routing'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Jump 1: Course Approvals */}
              <Link
                href="/dashboard/super-admin/course-approvals"
                className="block p-3.5 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/30 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {sa.nav.approvals}
                    </span>
                  </div>
                  {displayPending > 0 ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                      {displayPending} {language === 'id' ? 'Menunggu' : 'Pending'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                      Clear
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {language === 'id'
                    ? 'Tinjau modul, kurikulum, dan publish kursus baru'
                    : 'Review syllabus, price models, and publish courses'}
                </p>
              </Link>

              {/* Jump 2: User & Role Management */}
              <Link
                href="/dashboard/super-admin/users"
                className="block p-3.5 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/30 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {sa.nav.users}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {(kpis?.activeStudents ?? 4820) + (kpis?.verifiedMentors ?? 18)} Accounts
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {language === 'id'
                    ? 'Kelola peran USER, ADMIN, SUPER_ADMIN & status suspend'
                    : 'Manage platform permissions, invites, and account suspension'}
                </p>
              </Link>

              {/* Jump 3: Landing Page CMS */}
              <Link
                href="/dashboard/super-admin/cms"
                className="block p-3.5 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/30 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Layout className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {sa.nav.cms}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">
                    Slot 1–3
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {language === 'id'
                    ? 'Kontrol banner pengumuman & kursus unggulan beranda'
                    : 'Configure announcement bar & top 3 featured landing tracks'}
                </p>
              </Link>

              {/* Jump 4: Promo & Revenue */}
              <Link
                href="/dashboard/super-admin/promo-revenue"
                className="block p-3.5 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/30 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {sa.nav.revenue}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                    Live Escrow
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {language === 'id'
                    ? 'Voucher diskon, pembagian hasil mentor (70/30), & ekspor CSV'
                    : 'Promo voucher management, mentor 70/30 splits, & CSV export'}
                </p>
              </Link>
            </div>
          </div>

          {/* Quick System Status Card */}
          <div className="bg-[#0F172A] text-white rounded-2xl p-5 shadow-sm border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                SYSTEM TELEMETRY
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs font-semibold text-slate-300">
              Cluster: <span className="font-mono text-white">ap-southeast-prod-01</span>
            </p>
            <p className="text-xs font-semibold text-slate-300 mt-1">
              Database: <span className="font-mono text-emerald-400">Prisma + SQLite (Healthy)</span>
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Security SLA: 100%</span>
              <span className="text-white font-mono">0 CVE Alerts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminDashboard() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading platform analytics...</div>}>
      <SuperAdminAnalyticsContent />
    </Suspense>
  );
}
