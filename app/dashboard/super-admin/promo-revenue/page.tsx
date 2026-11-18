'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Activity,
  Users,
  BookOpen,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Bell,
  Clock,
  Sparkles,
  RefreshCw,
  Plus,
  ToggleLeft,
  ToggleRight,
  MoreVertical,
  LogOut,
  Layers,
  GraduationCap,
  Award,
  Zap,
  Check,
  X,
  FileText,
  Sliders,
  Globe,
  Loader2,
  Lock,
  ArrowUpRight,
  Megaphone,
  Ticket,
  PieChart,
  Calendar,
  Hourglass,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface RevenueKPIs {
  grossRevenue: number;
  formattedGrossRevenue: string;
  grossGrowth: string;
  netPlatformShare: number;
  formattedNetShare: string;
  mentorShareSub: string;
  activeRedemptions: number;
  promoSub: string;
  pendingMentorPayouts: number;
  formattedPendingPayouts: string;
  pendingMentorsCount: number;
  pendingSub: string;
}

interface MonthlyBar {
  month: string;
  gross: number;
  discounted: number;
  formattedGross: string;
  formattedDisc: string;
  isPeak?: boolean;
}

interface ChartData {
  monthlyData: MonthlyBar[];
  peakBadge: string;
  netRevenueMargin: string;
  totalDiscountsAbsorbed: string;
}

interface PromoItem {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  formattedDiscount: string;
  minSpend: number;
  formattedMinSpend: string;
  usedCount: number;
  usageQuota: number;
  percentUsed: number;
  targetTrack: string;
  expiresAt: string;
  isActive: boolean;
  isExpired: boolean;
}

interface TransactionItem {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    initials: string;
  };
  course: {
    id: string;
    title: string;
    codeTag: string;
  };
  promoBadge: string;
  promoCode: string | null;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  formattedGross: string;
  formattedDiscount: string;
  formattedNet: string;
  paymentGateway: string;
  status: string;
  timeAgo: string;
  createdAt: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PromoRevenuePage() {
  const { language, setLanguage, t } = useLanguage();
  const pr = t.superAdminDashboard.promoRevenue;
  const sa = t.superAdminDashboard;

  // Data States
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<RevenueKPIs | null>(null);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [promos, setPromos] = useState<PromoItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  // Timeframe filter for chart
  const [timeframe, setTimeframe] = useState<'6M' | '1Y' | 'ALL'>('6M');

  // Promo search & toggle
  const [promoSearch, setPromoSearch] = useState('');
  const [togglingPromoId, setTogglingPromoId] = useState<string | null>(null);

  // Quick Voucher Studio Form States
  const [studioCode, setStudioCode] = useState('CODEPATH25');
  const [studioDiscountType, setStudioDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [studioDiscountValue, setStudioDiscountValue] = useState<number>(25);
  const [studioUsageQuota, setStudioUsageQuota] = useState<number>(200);
  const [studioMinSpend, setStudioMinSpend] = useState<number>(300000);
  const [studioExpiresAt, setStudioExpiresAt] = useState('2026-11-30');
  const [studioTargetTrack, setStudioTargetTrack] = useState('All Courses & Capstones');
  const [isActivatingVoucher, setIsActivatingVoucher] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live Dual Clocks
  const [timeUtc, setTimeUtc] = useState('14:32 UTC');
  const [timeWib, setTimeWib] = useState('21:32 WIB');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setTimeUtc(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'UTC',
          hour: '2-digit',
          minute: '2-digit',
        }) + ' UTC'
      );
      setTimeWib(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
        }) + ' WIB'
      );
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [revRes, promoRes] = await Promise.all([
        fetch('/api/super-admin/revenue').then((r) => r.json()),
        fetch('/api/super-admin/promos').then((r) => r.json()),
      ]);

      if (revRes.success) {
        setKpis(revRes.kpis);
        setChart(revRes.chart);
        setTransactions(revRes.recentTransactions || []);
      }

      if (promoRes.success) {
        setPromos(promoRes.promos || []);
      }
    } catch (err) {
      console.error('Failed to load promo revenue data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Generate Random Code
  const handleGenerateRandomCode = () => {
    const prefixes = ['FLASH', 'COHORT', 'DEV', 'TECH', 'SPEED', 'NXT'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    setStudioCode(`${randomPrefix}${randomNum}-${randomSuffix}`);
  };

  // Handle Voucher Activation
  const handleActivateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioCode.trim()) return;

    setIsActivatingVoucher(true);
    try {
      const res = await fetch('/api/super-admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: studioCode,
          discountType: studioDiscountType,
          discountValue: studioDiscountValue,
          minSpend: studioMinSpend,
          usageQuota: studioUsageQuota,
          targetTrack: studioTargetTrack,
          expiresAt: studioExpiresAt ? new Date(studioExpiresAt).toISOString() : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        // Refresh list
        const refreshed = await fetch('/api/super-admin/promos').then((r) => r.json());
        if (refreshed.success) setPromos(refreshed.promos);
        handleGenerateRandomCode();
      } else {
        showToast(data.message || 'Failed to activate voucher.');
      }
    } catch {
      showToast('Error activating voucher code.');
    } finally {
      setIsActivatingVoucher(false);
    }
  };

  // Toggle Promo Active State
  const handleTogglePromo = async (promoId: string) => {
    setTogglingPromoId(promoId);
    try {
      const res = await fetch(`/api/super-admin/promos/${promoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setPromos((prev) =>
          prev.map((p) => (p.id === promoId ? { ...p, isActive: data.promo.isActive } : p))
        );
        showToast(data.message);
      }
    } catch {
      showToast('Failed to toggle promo code.');
    } finally {
      setTogglingPromoId(null);
    }
  };

  // Export Financial CSV
  const handleExportCsv = () => {
    const headers = [
      'Transaction ID',
      'Student Name',
      'Student Email',
      'Course',
      'Promo Applied',
      'Gross Amount (IDR)',
      'Discount Amount (IDR)',
      'Net Amount (IDR)',
      'Payment Gateway',
      'Status',
      'Date & Time',
    ];

    const rows = transactions.map((t) => [
      t.id,
      t.user.name,
      t.user.email,
      t.course.title,
      t.promoCode || 'None',
      t.grossAmount,
      t.discountAmount,
      t.netAmount,
      t.paymentGateway,
      t.status,
      t.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `codepath_financial_transactions_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Financial CSV exported and downloaded.');
  };

  // Filtered promos
  const filteredPromos = useMemo(() => {
    return promos.filter((p) =>
      p.code.toLowerCase().includes(promoSearch.toLowerCase()) ||
      p.targetTrack.toLowerCase().includes(promoSearch.toLowerCase())
    );
  }, [promos, promoSearch]);

  const activeCodesCount = promos.filter((p) => p.isActive).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* ─── TOAST NOTIFICATION ─── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FIXED LEFT SIDEBAR (220px)                                      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <aside className="fixed left-0 top-0 h-screen w-[220px] bg-white border-r border-slate-200 flex flex-col z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-mono text-xs font-extrabold shadow-sm">
              &lt;&gt;
            </div>
            <div>
              <span className="font-extrabold text-[#0F172A] text-sm tracking-tight block">
                CodePath
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 font-bold block uppercase -mt-1">
                ACADEMY
              </span>
            </div>
          </div>
          {/* Super Admin Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F172A] text-white text-[10px] font-bold tracking-wider">
            <Shield className="w-3 h-3 text-blue-400" />
            <span>{sa.portalBadge}</span>
          </div>
        </div>

        {/* Section Label: OPERATIONS */}
        <div className="px-5 pt-4 pb-2">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            • {sa.sectionOperations}
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          <Link
            href="/dashboard/super-admin"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <Activity size={16} className="text-slate-400" />
            <span className="flex-1 text-left truncate">{sa.nav.analytics}</span>
          </Link>

          <Link
            href="/dashboard/super-admin"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <BookOpen size={16} className="text-slate-400" />
            <span className="flex-1 text-left truncate">{sa.nav.approvals}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
              3
            </span>
          </Link>

          <Link
            href="/dashboard/super-admin"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <Users size={16} className="text-slate-400" />
            <span className="flex-1 text-left truncate">{sa.nav.users}</span>
          </Link>

          <Link
            href="/dashboard/super-admin"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <Megaphone size={16} className="text-slate-400" />
            <span className="flex-1 text-left truncate">{sa.nav.cms}</span>
          </Link>

          {/* Garis pemisah & jarak antara CMS dengan Promo */}
          <div className="pt-3 pb-1.5 px-1">
            <div className="border-t border-slate-200" />
          </div>

          {/* ACTIVE TAB: Promo & Pendapatan ditaruh paling bawah */}
          <div className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#2563EB] text-white shadow-sm cursor-pointer">
            <DollarSign size={16} className="text-white" />
            <span className="flex-1 text-left truncate">{sa.nav.revenue}</span>
          </div>
        </nav>

        {/* Pinned Chief Administrator Profile Card */}
        <div className="p-3 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm border border-slate-800">
                AW
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#0F172A] text-xs truncate">
                  Alexander Wright
                </p>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  {sa.chiefAdmin}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
              <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PLATFORM ROOT
              </span>
              <button
                onClick={() => {
                  document.cookie = 'codepath_session=; Max-Age=0; path=/';
                  window.location.href = '/login';
                }}
                className="text-[10px] font-semibold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                {sa.logout}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MAIN VIEWPORT (Offset by 220px Sidebar)                         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="ml-[220px] flex-1 flex flex-col min-w-0">
        {/* ─── TOP OPERATIONAL HEADER BAR ─── */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          {/* Breadcrumb & Gateway Status Pill */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <Link href="/dashboard/super-admin" className="text-slate-400 hover:text-slate-600 font-medium transition">
                {sa.breadcrumbPrefix}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-bold text-[#0F172A]">{pr.breadcrumb}</span>
            </div>

            {/* Gateway Status Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{pr.gatewayStatus}</span>
            </div>
          </div>

          {/* Right Controls: Dual Clock, Search, Language, Notifications, Avatar */}
          <div className="flex items-center gap-4">
            {/* Dual Live Clocks */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-mono text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>UTC {timeUtc}</span>
              <span className="text-slate-300">|</span>
              <span className="font-semibold text-slate-800">WIB {timeWib}</span>
            </div>

            {/* Global Search Bar */}
            <div className="relative hidden md:block w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                placeholder={pr.searchPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition"
              />
            </div>

            {/* Language Toggle */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`font-bold transition-colors ${
                  language === 'en' ? 'text-[#2563EB]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                EN
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setLanguage('id')}
                className={`font-bold transition-colors ${
                  language === 'id' ? 'text-[#2563EB]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                ID
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative cursor-pointer">
              <div className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition">
                <Bell className="w-4 h-4" />
              </div>
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1 ring-2 ring-white" />
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                AW
              </div>
              <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                Alexander W.
              </span>
            </div>
          </div>
        </header>

        {/* ─── MAIN CONTENT CONTAINER ─── */}
        <main className="p-6 sm:p-8 space-y-8 max-w-[1600px] w-full">
          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 1: PAGE HEADER & 4-COLUMN FINANCIAL STAT CARDS      */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 text-xs font-mono font-semibold">
                <Zap className="w-3 h-3 text-[#2563EB]" />
                <span>{pr.eyebrow}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {pr.title}
              </h1>
              <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                {pr.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Export Financial CSV */}
              <button
                onClick={handleExportCsv}
                className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>{pr.exportCsv}</span>
              </button>

              {/* + Create Promo Code */}
              <button
                onClick={() => {
                  const el = document.getElementById('voucher-studio');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>{pr.createCodeBtn}</span>
              </button>
            </div>
          </div>

          {/* 4 FINANCIAL KPI STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* CARD 1: GROSS PLATFORM REVENUE */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {pr.kpi.grossRevenue}
                  </p>
                  <p className="text-2xl font-extrabold text-[#0F172A] mt-2">
                    {kpis?.formattedGrossRevenue || 'Rp 148.500.000'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100 shadow-2xs">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {pr.kpi.grossGrowth}
                </span>
              </div>
            </div>

            {/* CARD 2: NET PLATFORM SHARE (30%) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {pr.kpi.netShare}
                  </p>
                  <p className="text-2xl font-extrabold text-[#0F172A] mt-2">
                    {kpis?.formattedNetShare || 'Rp 44.550.000'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100 shadow-2xs">
                  <PieChart className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-medium text-slate-500">
                  • {pr.kpi.netShareSub}
                </span>
              </div>
            </div>

            {/* CARD 3: ACTIVE PROMO REDEMPTIONS */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {pr.kpi.activeRedemptions}
                  </p>
                  <p className="text-2xl font-extrabold text-[#0F172A] mt-2">
                    {kpis?.activeRedemptions ? `${kpis.activeRedemptions} uses` : '642 uses'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100 shadow-2xs">
                  <Ticket className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-medium text-slate-500">
                  {pr.kpi.activeRedemptionsSub}
                </span>
              </div>
            </div>

            {/* CARD 4: PENDING MENTOR PAYOUTS */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {pr.kpi.pendingPayouts}
                  </p>
                  <p className="text-2xl font-extrabold text-[#0F172A] mt-2">
                    {kpis?.formattedPendingPayouts || 'Rp 12.400.000'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 shadow-2xs">
                  <Hourglass className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                  {pr.kpi.pendingPayoutsSub}
                </span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 2: MIDDLE 2-COLUMN SPLIT (CHART + VOUCHER STUDIO)   */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ── LEFT CARD: MONTHLY REVENUE & PROMO IMPACT CHART (7 cols) ── */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-[#0F172A] text-base">
                      {pr.chart.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {pr.chart.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-semibold">
                    {(['6M', '1Y', 'ALL'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                          timeframe === tf
                            ? 'bg-[#2563EB] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tf === '6M' ? pr.chart.time6m : tf === '1Y' ? pr.chart.time1y : pr.chart.timeAll}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Legend & Peak Badge */}
                <div className="flex items-center justify-between pt-4 mb-6">
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-[#2563EB]" />
                      <span className="text-slate-700">{pr.chart.grossLegend}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-[#CBD5E1]" />
                      <span className="text-slate-500">{pr.chart.discountLegend}</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {chart?.peakBadge || pr.chart.octPeak}
                  </span>
                </div>

                {/* Interactive Dual Bar Chart */}
                <div className="pt-2 pb-6 px-2">
                  <div className="h-64 flex items-end justify-between gap-4 sm:gap-6 border-b border-slate-200 pb-2 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                      <div className="border-b border-dashed border-slate-200 w-full" />
                      <div className="border-b border-dashed border-slate-200 w-full" />
                      <div className="border-b border-dashed border-slate-200 w-full" />
                      <div className="border-b border-dashed border-slate-200 w-full" />
                    </div>

                    {(chart?.monthlyData || [
                      { month: 'May', gross: 85, discounted: 18, formattedGross: '85M', formattedDisc: '18M' },
                      { month: 'Jun', gross: 98, discounted: 22, formattedGross: '98M', formattedDisc: '22M' },
                      { month: 'Jul', gross: 110, discounted: 25, formattedGross: '110M', formattedDisc: '25M' },
                      { month: 'Aug', gross: 122, discounted: 27, formattedGross: '122M', formattedDisc: '27M' },
                      { month: 'Sep', gross: 130, discounted: 29, formattedGross: '130M', formattedDisc: '29M' },
                      { month: "Oct '26", gross: 148.5, discounted: 32, formattedGross: '148.5M', formattedDisc: '32M', isPeak: true },
                    ]).map((b) => {
                      const maxVal = 160;
                      const grossHeight = Math.round((b.gross / maxVal) * 230);
                      const discHeight = Math.round((b.discounted / maxVal) * 230);

                      return (
                        <div
                          key={b.month}
                          className="flex-1 flex flex-col items-center justify-end h-full z-10 group relative"
                        >
                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-[#0F172A] text-white text-[10px] font-mono py-1 px-2.5 rounded-lg pointer-events-none whitespace-nowrap shadow-lg z-20">
                            Gross: Rp {b.gross}M • Disc: Rp {b.discounted}M
                          </div>

                          {/* Top pill for Oct peak */}
                          {b.isPeak && (
                            <span className="text-[10px] font-bold font-mono text-[#2563EB] mb-1.5 whitespace-nowrap">
                              148.5M / 32M
                            </span>
                          )}

                          {/* Bars container */}
                          <div className="flex items-end gap-1.5 w-full justify-center">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: grossHeight }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="w-1/2 max-w-[28px] bg-[#2563EB] rounded-t-lg group-hover:brightness-110 transition-all cursor-pointer"
                            />
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: discHeight }}
                              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                              className="w-1/2 max-w-[28px] bg-[#CBD5E1] rounded-t-lg group-hover:brightness-95 transition-all cursor-pointer"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Month Labels */}
                  <div className="flex justify-between gap-4 sm:gap-6 mt-3 px-1 text-xs font-bold text-slate-500">
                    {['May', 'Jun', 'Jul', 'Aug', 'Sep', "Oct '26"].map((m) => (
                      <span key={m} className="flex-1 text-center">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  {pr.chart.margin}
                </span>
                <span className="text-slate-500">
                  {pr.chart.discountsAbsorbed}
                </span>
              </div>
            </div>

            {/* ── RIGHT CARD: ⚡ QUICK VOUCHER STUDIO (5 cols) ── */}
            <div
              id="voucher-studio"
              className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs"
            >
              <div className="pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="font-extrabold text-[#0F172A] text-base">
                    {pr.studio.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {pr.studio.subtitle}
                </p>
              </div>

              <form onSubmit={handleActivateVoucher} className="space-y-4">
                {/* VOUCHER CODE input + RANDOM button */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {pr.studio.codeLabel}
                  </label>
                  <div className="flex gap-2">
                    <input
                      required
                      value={studioCode}
                      onChange={(e) => setStudioCode(e.target.value.toUpperCase())}
                      placeholder="e.g. CODEPATH25"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold tracking-wider text-slate-800 outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateRandomCode}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-[11px] font-bold rounded-xl border border-blue-100 transition cursor-pointer"
                    >
                      {pr.studio.randomBtn}
                    </button>
                  </div>
                </div>

                {/* DISCOUNT TYPE + VALUE */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {pr.studio.typeLabel}
                    </label>
                    <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setStudioDiscountType('PERCENTAGE')}
                        className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
                          studioDiscountType === 'PERCENTAGE'
                            ? 'bg-[#2563EB] text-white shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {pr.studio.typePct}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStudioDiscountType('FIXED')}
                        className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
                          studioDiscountType === 'FIXED'
                            ? 'bg-[#2563EB] text-white shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {pr.studio.typeFixed}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {pr.studio.valueLabel}
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="number"
                        min="1"
                        value={studioDiscountValue}
                        onChange={(e) => setStudioDiscountValue(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                        {studioDiscountType === 'PERCENTAGE' ? '%' : 'Rp'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* USAGE QUOTA + MIN SPEND */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {pr.studio.quotaLabel}
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={studioUsageQuota}
                      onChange={(e) => setStudioUsageQuota(Number(e.target.value))}
                      placeholder="200"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {pr.studio.minSpendLabel}
                    </label>
                    <input
                      required
                      type="number"
                      value={studioMinSpend}
                      onChange={(e) => setStudioMinSpend(Number(e.target.value))}
                      placeholder="300000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                </div>

                {/* EXPIRY DATE */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {pr.studio.expiryLabel}
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="date"
                      value={studioExpiresAt}
                      onChange={(e) => setStudioExpiresAt(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition cursor-pointer"
                    />
                  </div>
                </div>

                {/* TARGET TRACK */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {pr.studio.trackLabel}
                  </label>
                  <div className="relative">
                    <select
                      value={studioTargetTrack}
                      onChange={(e) => setStudioTargetTrack(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    >
                      <option value="All Courses & Capstones">All Courses & Capstones</option>
                      <option value="Fullstack Track">Fullstack Next.js & TypeScript</option>
                      <option value="Backend Track">Backend Microservices Architecture</option>
                      <option value="AI Engineering">Applied AI & LLM Systems</option>
                      <option value="Frontend Track">Frontend UI Engineering & Motion</option>
                      <option value="Algorithms">Algorithmic Systems</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isActivatingVoucher}
                  className="w-full mt-2 py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isActivatingVoucher ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{pr.studio.activateBtn}</span>
                </button>
              </form>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 3: BOTTOM 2-COLUMN SPLIT (PROMOS + RECENT TXS)      */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ── LEFT CARD: ACTIVE PROMO CODES & CAMPAIGNS (6 cols) ── */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-extrabold text-[#0F172A] text-sm">
                      {pr.promos.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100">
                      {activeCodesCount} {pr.promos.activeCodesBadge}
                    </span>
                  </div>

                  <div className="relative w-48">
                    <Search className="w-3 h-3 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={promoSearch}
                      onChange={(e) => setPromoSearch(e.target.value)}
                      placeholder={pr.promos.filterPlaceholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2.5 py-1 text-[11px] outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">{pr.promos.colCode}</th>
                        <th className="py-3 px-4">{pr.promos.colDiscount}</th>
                        <th className="py-3 px-4">{pr.promos.colRedeemed}</th>
                        <th className="py-3 px-4">{pr.promos.colStatus}</th>
                        <th className="py-3 px-4 text-right">{pr.promos.colToggle}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPromos.map((p) => {
                        const isToggling = togglingPromoId === p.id;
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-[#0F172A] text-white">
                                {p.code}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-800">
                              {p.formattedDiscount}
                            </td>
                            <td className="py-3.5 px-4 w-36">
                              <div className="space-y-1">
                                <span className="font-mono text-[11px] font-bold text-slate-700">
                                  {p.usedCount} / {p.usageQuota}
                                </span>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#2563EB] rounded-full"
                                    style={{ width: `${p.percentUsed}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              {p.isActive && !p.isExpired ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {pr.promos.active}
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                                  {pr.promos.expired}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleTogglePromo(p.id)}
                                disabled={isToggling}
                                className="cursor-pointer transition hover:opacity-80 disabled:opacity-40"
                              >
                                {p.isActive ? (
                                  <ToggleRight className="w-5 h-5 text-[#2563EB]" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5 text-slate-300" />
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  Showing {filteredPromos.length} of {promos.length} promotional campaigns
                </span>
                <span className="font-bold text-[#2563EB] hover:underline cursor-pointer text-[11px]">
                  {pr.promos.viewAll}
                </span>
              </div>
            </div>

            {/* ── RIGHT CARD: RECENT TUITION TRANSACTIONS (6 cols) ── */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-[#0F172A] text-sm">
                      {pr.transactions.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{pr.transactions.liveFeed}</span>
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer">
                    {pr.transactions.viewAll}
                  </span>
                </div>

                {/* Ledger Items */}
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-2xs">
                          {tx.user.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-xs truncate">
                            {tx.user.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {tx.course.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {tx.promoBadge} • {tx.timeAgo} • {tx.paymentGateway}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="inline-flex text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mb-1">
                          PAID
                        </span>
                        <p className="font-mono font-extrabold text-xs text-[#0F172A]">
                          {tx.formattedNet}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Escrow settlement notice */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-slate-600 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
                  <span>{pr.transactions.escrowNotice}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

