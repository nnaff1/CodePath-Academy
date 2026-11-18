'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  BookOpen,
  Users,
  Layout,
  DollarSign,
  LogOut,
  Shield,
  Clock,
  Search,
  Bell,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { SuperAdminProvider, useSuperAdmin } from './SuperAdminContext';

function SuperAdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { language, setLanguage, t } = useLanguage();
  const sa = t.superAdminDashboard;
  const pr = t.superAdminDashboard.promoRevenue;

  const {
    superAdmin,
    pendingApprovals,
    isMaintenanceMode,
    toastMessage,
  } = useSuperAdmin();

  // Active route checks based on pathname
  const isAnalyticsPage = pathname === '/dashboard/super-admin';
  const isApprovalsPage = pathname === '/dashboard/super-admin/course-approvals';
  const isUsersPage = pathname === '/dashboard/super-admin/users';
  const isCmsPage = pathname === '/dashboard/super-admin/cms';
  const isPromoPage = pathname === '/dashboard/super-admin/promo-revenue';

  const activePageTitle = useMemo(() => {
    if (isPromoPage) return pr.breadcrumb;
    if (isApprovalsPage) return sa.nav.approvals;
    if (isUsersPage) return sa.nav.users;
    if (isCmsPage) return sa.nav.cms;
    return sa.breadcrumbCurrent;
  }, [isPromoPage, isApprovalsPage, isUsersPage, isCmsPage, pr.breadcrumb, sa.nav, sa.breadcrumbCurrent]);

  const activeSearchPlaceholder = useMemo(() => {
    if (isPromoPage) return pr.searchPlaceholder;
    if (isApprovalsPage) return language === 'id' ? 'Cari kursus atau mentor...' : 'Filter courses or mentors...';
    if (isUsersPage) return language === 'id' ? 'Cari pengguna, email, peran...' : 'Filter by name or email...';
    if (isCmsPage) return language === 'id' ? 'Cari teks banner, slot kursus...' : 'Search banner text, slots...';
    return sa.searchPlaceholder;
  }, [isPromoPage, isApprovalsPage, isUsersPage, isCmsPage, language, pr.searchPlaceholder, sa.searchPlaceholder]);

  // Dual Live Clocks (UTC & WIB)
  const [timeUtc, setTimeUtc] = useState('14:32');
  const [timeWib, setTimeWib] = useState('21:32');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setTimeUtc(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'UTC',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
      setTimeWib(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      document.cookie = 'codepath_session=; Max-Age=0; path=/';
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

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
          {/* 1. Platform Analytics */}
          <Link
            href="/dashboard/super-admin"
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isAnalyticsPage
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 flex-shrink-0" />
              <span>{sa.nav.analytics}</span>
            </div>
          </Link>

          {/* 2. Course Approvals */}
          <Link
            href="/dashboard/super-admin/course-approvals"
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isApprovalsPage
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              <span>{sa.nav.approvals}</span>
            </div>
            {pendingApprovals > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center shadow-2xs animate-pulse">
                {pendingApprovals}
              </span>
            )}
          </Link>

          {/* 3. User & Role Management */}
          <Link
            href="/dashboard/super-admin/users"
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isUsersPage
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>{sa.nav.users}</span>
            </div>
          </Link>

          {/* 4. Landing Page CMS */}
          <Link
            href="/dashboard/super-admin/cms"
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isCmsPage
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layout className="w-4 h-4 flex-shrink-0" />
              <span>{sa.nav.cms}</span>
            </div>
          </Link>

          {/* ─── SEPARATOR DIVIDER & SPACING (Antara CMS dengan Promo) ─── */}
          <div className="pt-3 pb-1.5 px-1">
            <div className="border-t border-slate-200" />
          </div>

          {/* 5. Promo & Revenue (Placed at very bottom after divider) */}
          <Link
            href="/dashboard/super-admin/promo-revenue"
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isPromoPage
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <span>{sa.nav.revenue}</span>
            </div>
          </Link>
        </nav>

        {/* Bottom Pinned Super Admin Profile Card */}
        <div className="p-3 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm border border-slate-800">
                {superAdmin?.initials || 'AW'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#0F172A] text-xs truncate">
                  {superAdmin?.name || 'Alexander Wright'}
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
                onClick={handleLogout}
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
        <header className="bg-white border-b border-slate-200 px-4 sm:px-5 py-2.5 flex items-center justify-between sticky top-0 z-20 w-full min-w-0">
          {/* Breadcrumb, Status Pill & Dual Clock */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs">
              <Link
                href="/dashboard/super-admin"
                className="text-slate-400 hover:text-slate-600 font-medium whitespace-nowrap transition"
              >
                {sa.breadcrumbPrefix}
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
              <span className="font-bold text-[#0F172A] whitespace-nowrap">
                {activePageTitle}
              </span>
            </div>

            {/* Status Pill */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap flex-shrink-0 transition-colors ${
                isPromoPage
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : isMaintenanceMode
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isPromoPage
                    ? 'bg-emerald-500 animate-pulse'
                    : isMaintenanceMode
                    ? 'bg-amber-500 animate-ping'
                    : 'bg-emerald-500 animate-pulse'
                }`}
              />
              <span>
                {isPromoPage
                  ? pr.gatewayStatus
                  : isMaintenanceMode
                  ? sa.maintenanceMode
                  : sa.allServicesOperational}
              </span>
            </div>

            {/* Dual Live Clocks - dengan jarak pas dari status operasi, ringkas & rapi */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-[11px] font-mono text-slate-600 whitespace-nowrap flex-shrink-0 ml-1">
              <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>UTC {timeUtc}</span>
              <span className="text-slate-300">|</span>
              <span className="font-semibold text-slate-800">WIB {timeWib}</span>
            </div>
          </div>

          {/* Right Controls: Search, Language, Notifications, Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-shrink-0">
            {/* Global Search Bar */}
            <div className="relative hidden md:block w-32 sm:w-36 lg:w-44 xl:w-48 focus-within:!w-56 transition-all duration-200">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                placeholder={activeSearchPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition truncate"
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
              {pendingApprovals > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
              )}
            </div>

            {/* Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:bg-slate-800 transition cursor-pointer"
              >
                {superAdmin?.initials || 'AW'}
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-[#0F172A] truncate">
                      {superAdmin?.name || 'Alexander Wright'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {superAdmin?.email || 'owner@codepath.id'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2 cursor-pointer transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {sa.logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ─── PAGE CONTENT CONTAINER ─── */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SuperAdminProvider>
      <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
        <SuperAdminLayoutContent>{children}</SuperAdminLayoutContent>
      </Suspense>
    </SuperAdminProvider>
  );
}
