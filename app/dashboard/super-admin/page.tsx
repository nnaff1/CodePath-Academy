'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
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
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSuperAdmin } from './SuperAdminContext';
import Link from 'next/link';

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface SuperAdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  xpPoints?: number;
}

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

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  price: number;
  formattedPrice: string;
  status: string;
  codeTag: string;
  isFeatured: boolean;
  featuredSlot: number | null;
  createdAt: string;
  mentor: {
    id: string;
    name: string;
    email: string;
    initials: string;
    title: string;
  };
  moduleCount: number;
  labCount: number;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED';
  xpPoints: number;
  initials: string;
  enrollmentCount: number;
  courseCount: number;
  createdAt: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

function SuperAdminDashboardContent() {
  const { language, setLanguage, t } = useLanguage();
  const sa = t.superAdminDashboard;
  const {
    superAdmin: sharedSuperAdmin,
    setPendingApprovals,
    isMaintenanceMode,
    setIsMaintenanceMode,
    showToast,
  } = useSuperAdmin();

  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'analytics' | 'approvals' | 'users' | 'cms' | null;

  // Active navigation tab
  const [activeNav, setActiveNav] = useState<
    'analytics' | 'approvals' | 'users' | 'revenue' | 'cms'
  >('analytics');

  useEffect(() => {
    if (tabParam && ['analytics', 'approvals', 'users', 'cms'].includes(tabParam)) {
      setActiveNav(tabParam);
      const el = document.getElementById(`section-${tabParam}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tabParam]);

  // Loading & Data States
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<PlatformKPIs | null>(null);
  const [system, setSystem] = useState<SystemStatus | null>(null);
  const [superAdmin, setSuperAdmin] = useState<SuperAdminProfile | null>(null);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);

  // Interactive Table States
  const [courseSearch, setCourseSearch] = useState('');
  const [courseSpecialization, setCourseSpecialization] = useState('ALL');
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [isApproving, setIsApproving] = useState<Record<string, boolean>>({});
  const [isBulkApproving, setIsBulkApproving] = useState(false);

  // User Management States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'USER' | 'ADMIN' | 'SUPER_ADMIN'>('USER');
  const [invitePassword, setInvitePassword] = useState('codepath123');
  const [isInviting, setIsInviting] = useState(false);

  // CMS States
  const [bannerText, setBannerText] = useState('');
  const [isBannerLive, setIsBannerLive] = useState(true);
  const [isUpdatingBanner, setIsUpdatingBanner] = useState(false);
  const [featuredSlots, setFeaturedSlots] = useState<{ slot: number; courseId: string }[]>([
    { slot: 1, courseId: '' },
    { slot: 2, courseId: '' },
    { slot: 3, courseId: '' },
  ]);
  const [isSavingMerch, setIsSavingMerch] = useState(false);

  // Maintenance Toggle State
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [overviewRes, coursesRes, usersRes, cmsRes] = await Promise.all([
        fetch('/api/super-admin/overview').then((r) => r.json()),
        fetch('/api/super-admin/courses?status=ALL').then((r) => r.json()),
        fetch('/api/super-admin/users').then((r) => r.json()),
        fetch('/api/super-admin/cms').then((r) => r.json()),
      ]);

      if (overviewRes.success) {
        setKpis(overviewRes.kpis);
        setSystem(overviewRes.system);
        setSuperAdmin(overviewRes.superAdmin);
        setIsMaintenanceMode(overviewRes.system?.maintenanceMode ?? false);
        if (typeof overviewRes.kpis?.pendingApprovals === 'number') {
          setPendingApprovals(overviewRes.kpis.pendingApprovals);
        }
      }

      if (coursesRes.success) {
        setCourses(coursesRes.courses);
      }

      if (usersRes.success) {
        setUsers(usersRes.users);
      }

      if (cmsRes.success) {
        setBannerText(cmsRes.cms.bannerText);
        setIsBannerLive(cmsRes.cms.isBannerLive);
        // Build slots
        const pubCourses: CourseItem[] = cmsRes.cms.courses || [];
        const slot1 = pubCourses.find((c) => c.featuredSlot === 1)?.id || pubCourses[0]?.id || '';
        const slot2 = pubCourses.find((c) => c.featuredSlot === 2)?.id || pubCourses[1]?.id || '';
        const slot3 = pubCourses.find((c) => c.featuredSlot === 3)?.id || pubCourses[2]?.id || '';
        setFeaturedSlots([
          { slot: 1, courseId: slot1 },
          { slot: 2, courseId: slot2 },
          { slot: 3, courseId: slot3 },
        ]);
      }
    } catch (err) {
      console.error('Failed to load Super Admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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
        showToast(data.message);
      }
    } catch {
      showToast('Failed to toggle maintenance mode.');
    } finally {
      setIsTogglingMaintenance(false);
    }
  };

  // Handle Single Course Approve
  const handleApproveCourse = async (courseId: string) => {
    setIsApproving((prev) => ({ ...prev, [courseId]: true }));
    try {
      const res = await fetch(`/api/super-admin/courses/${courseId}/approve`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, status: 'PUBLISHED' } : c))
        );
        // Decrement pending count
        setKpis((prev) =>
          prev
            ? {
                ...prev,
                pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
                publishedCourses: prev.publishedCourses + 1,
              }
            : null
        );
        showToast(data.message);
      }
    } catch {
      showToast('Failed to approve course.');
    } finally {
      setIsApproving((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  // Handle Bulk Approve
  const handleBulkApprove = async () => {
    if (selectedCourseIds.length === 0) return;
    setIsBulkApproving(true);
    try {
      const res = await fetch('/api/super-admin/courses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulk-approve', courseIds: selectedCourseIds }),
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) =>
          prev.map((c) => (selectedCourseIds.includes(c.id) ? { ...c, status: 'PUBLISHED' } : c))
        );
        setKpis((prev) =>
          prev
            ? {
                ...prev,
                pendingApprovals: Math.max(0, prev.pendingApprovals - selectedCourseIds.length),
                publishedCourses: prev.publishedCourses + selectedCourseIds.length,
              }
            : null
        );
        setSelectedCourseIds([]);
        showToast(data.message);
      }
    } catch {
      showToast('Bulk approve failed.');
    } finally {
      setIsBulkApproving(false);
    }
  };

  // Handle User Status / Role Update
  const handleUpdateUser = async (
    userId: string,
    updates: { role?: string; status?: 'ACTIVE' | 'SUSPENDED' }
  ) => {
    setUpdatingUserId(userId);
    try {
      const res = await fetch(`/api/super-admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
        );
        showToast(data.message);
      }
    } catch {
      showToast('Failed to update user.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Handle Invite / Add User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    setIsInviting(true);
    try {
      const res = await fetch('/api/super-admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inviteName,
          email: inviteEmail,
          role: inviteRole,
          password: invitePassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowInviteModal(false);
        setInviteName('');
        setInviteEmail('');
        fetchData();
        showToast(data.message);
      } else {
        showToast(data.message || 'Failed to create user');
      }
    } catch {
      showToast('Network error while inviting user.');
    } finally {
      setIsInviting(false);
    }
  };

  // Handle Save Banner
  const handleUpdateBanner = async () => {
    setIsUpdatingBanner(true);
    try {
      const res = await fetch('/api/super-admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-banner',
          bannerText,
          isBannerLive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
      }
    } catch {
      showToast('Failed to update announcement banner.');
    } finally {
      setIsUpdatingBanner(false);
    }
  };

  // Handle Save Merchandising
  const handleSaveMerchandising = async () => {
    setIsSavingMerch(true);
    try {
      const res = await fetch('/api/super-admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-merchandising',
          featuredSlots,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(sa.cms.savedSuccess);
      }
    } catch {
      showToast('Failed to save merchandising changes.');
    } finally {
      setIsSavingMerch(false);
    }
  };

  // Handle Export Audit Report
  const handleGenerateReport = () => {
    const reportData = [
      ['AUDIT REPORT - CODEPATH ACADEMY PLATFORM GOVERNANCE'],
      ['Generated At', new Date().toISOString()],
      ['Cluster', 'ap-southeast-prod-01'],
      ['Total Platform Revenue', kpis?.formattedRevenue || 'Rp 148.500.000'],
      ['Active Students', kpis?.activeStudents.toString() || '4820'],
      ['Verified Mentors', kpis?.verifiedMentors.toString() || '18'],
      ['Pending Course Approvals', kpis?.pendingApprovals.toString() || '3'],
      ['Environment Status', isMaintenanceMode ? 'MAINTENANCE' : 'OPERATIONAL'],
      [],
      ['PENDING COURSES QUEUE'],
      ['ID', 'Title', 'Mentor', 'Price', 'Status'],
      ...courses
        .filter((c) => c.status === 'PENDING')
        .map((c) => [c.id, c.title, c.mentor.name, c.formattedPrice, c.status]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      reportData.map((e) => e.map((val) => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `codepath_governance_audit_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Platform governance audit report generated and downloaded.');
  };

  // Filtered Courses (Queue)
  const pendingCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.mentor.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.codeTag.toLowerCase().includes(courseSearch.toLowerCase());

      if (courseSpecialization === 'ALL') return matchSearch;
      if (courseSpecialization === 'BACKEND') {
        return (
          matchSearch &&
          (c.codeTag.includes('GO') || c.codeTag.includes('NODE') || c.title.includes('Microservices'))
        );
      }
      if (courseSpecialization === 'FRONTEND') {
        return matchSearch && (c.codeTag.includes('REACT') || c.title.includes('UI'));
      }
      if (courseSpecialization === 'AI') {
        return matchSearch && (c.codeTag.includes('AI') || c.title.includes('AI'));
      }
      if (courseSpecialization === 'DEVOPS') {
        return matchSearch && (c.codeTag.includes('K8S') || c.title.includes('Kubernetes'));
      }
      return matchSearch;
    });
  }, [courses, courseSearch, courseSpecialization]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.id.toLowerCase().includes(userSearch.toLowerCase());

      if (userRoleFilter === 'ALL') return matchSearch;
      if (userRoleFilter === 'MENTORS') return matchSearch && u.role === 'ADMIN';
      if (userRoleFilter === 'ADMINS') return matchSearch && u.role === 'SUPER_ADMIN';
      if (userRoleFilter === 'STUDENTS') return matchSearch && u.role === 'USER';
      return matchSearch;
    });
  }, [users, userSearch, userRoleFilter]);

  // Published courses for CMS
  const publishedCourses = useMemo(() => {
    return courses.filter((c) => c.status === 'PUBLISHED');
  }, [courses]);

  // Select all courses in queue
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCourseIds(pendingCourses.filter((c) => c.status === 'PENDING').map((c) => c.id));
    } else {
      setSelectedCourseIds([]);
    }
  };

  const handleToggleCourseSelect = (id: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Super admin initials
  const adminInitials = useMemo(() => {
    if (!superAdmin?.name) return 'AW';
    return superAdmin.name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }, [superAdmin]);

  const pendingCount = kpis?.pendingApprovals ?? courses.filter((c) => c.status === 'PENDING').length;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-[1600px] w-full">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 1: EXECUTIVE HEADER & 4-COLUMN PLATFORM KPI CARDS   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div
        id="section-analytics"
            className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-semibold">
                <Zap className="w-3 h-3 text-[#2563EB]" />
                <span>{sa.auditCycle}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {sa.pageTitle}
              </h1>
              <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                {sa.pageSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
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
          </div>

          {/* 4-COLUMN PLATFORM KPI STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* CARD 1: TOTAL PLATFORM REVENUE */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {sa.kpi.totalRevenue}
                  </p>
                  <p className="text-2xl font-extrabold text-[#0F172A] mt-2">
                    {kpis?.formattedRevenue || 'Rp 148.500.000'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-sm">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {sa.kpi.revenueGrowth}
                </span>
              </div>
            </div>

            {/* CARD 2: ACTIVE STUDENTS */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {sa.kpi.activeStudents}
                  </p>
                  <p className="text-2xl font-extrabold text-[#0F172A] mt-2">
                    {kpis?.activeStudents ? kpis.activeStudents.toLocaleString() : '4,820'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shadow-sm">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-medium text-slate-500">
                  {sa.kpi.studentGrowth}
                </span>
              </div>
            </div>

            {/* CARD 3: VERIFIED MENTORS */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {sa.kpi.verifiedMentors}
                  </p>
                  <p className="text-2xl font-extrabold text-[#0F172A] mt-2">
                    {kpis?.verifiedMentors || '18'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-emerald-600">
                  {sa.kpi.mentorSla}
                </span>
              </div>
            </div>

            {/* CARD 4: PENDING COURSE APPROVALS */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {sa.kpi.pendingApprovals}
                  </p>
                  <p className="text-2xl font-extrabold text-[#0F172A] mt-2">
                    {pendingCount}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  {sa.kpi.pendingAction}
                </span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 2: COURSE APPROVAL QUEUE TABLE (Full-Width Card)   */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div
            id="section-approvals"
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
          >
            {/* Queue Header & Filters */}
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-extrabold text-[#0F172A]">
                  • {sa.approvals.title}
                </h2>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100">
                  {pendingCount} {sa.approvals.awaitingBadge}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search input */}
                <div className="relative w-56 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder={sa.approvals.filterPlaceholder}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition"
                  />
                </div>

                {/* Specialization dropdown */}
                <div className="relative">
                  <select
                    value={courseSpecialization}
                    onChange={(e) => setCourseSpecialization(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-[#2563EB]/20"
                  >
                    <option value="ALL">{sa.approvals.allSpecializations}</option>
                    <option value="BACKEND">{sa.approvals.backend}</option>
                    <option value="FRONTEND">{sa.approvals.frontend}</option>
                    <option value="AI">{sa.approvals.ai}</option>
                    <option value="DEVOPS">{sa.approvals.devops}</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedCourseIds.length > 0 &&
                          selectedCourseIds.length ===
                            pendingCourses.filter((c) => c.status === 'PENDING').length
                        }
                        onChange={handleSelectAll}
                        className="rounded accent-[#2563EB] cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4">{sa.approvals.colCourse}</th>
                    <th className="py-3.5 px-4">{sa.approvals.colMentor}</th>
                    <th className="py-3.5 px-4">{sa.approvals.colDifficulty}</th>
                    <th className="py-3.5 px-4">{sa.approvals.colPrice}</th>
                    <th className="py-3.5 px-4">{sa.approvals.colSubmitted}</th>
                    <th className="py-3.5 px-4 text-right">{sa.approvals.colGovernance}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingCourses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        {sa.approvals.noPending}
                      </td>
                    </tr>
                  ) : (
                    pendingCourses.map((c) => {
                      const isPending = c.status === 'PENDING';
                      const isSelected = selectedCourseIds.includes(c.id);
                      const approving = isApproving[c.id];

                      return (
                        <tr
                          key={c.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isSelected ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <td className="py-4 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={!isPending}
                              onChange={() => handleToggleCourseSelect(c.id)}
                              className="rounded accent-[#2563EB] cursor-pointer disabled:opacity-30"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-start gap-3">
                              <span className="font-mono text-[10px] font-bold px-2 py-1 rounded bg-[#0F172A] text-white">
                                {c.codeTag}
                              </span>
                              <div>
                                <p className="font-bold text-[#0F172A] text-sm leading-snug">
                                  {c.title}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                                  ID: {c.id.slice(0, 16)}... • {c.moduleCount} Modules • {c.labCount} Labs
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#2563EB]/10 text-[#2563EB] font-bold flex items-center justify-center text-xs flex-shrink-0">
                                {c.mentor.initials}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">{c.mentor.name}</p>
                                <p className="text-[10px] text-slate-400">{c.mentor.title}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                c.level === 'ADVANCED'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : c.level === 'INTERMEDIATE'
                                  ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {c.level}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-slate-800">
                            {c.formattedPrice}
                          </td>
                          <td className="py-4 px-4 text-slate-500 text-[11px]">
                            {new Date(c.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            <span className="text-[10px] text-slate-400 block">
                              {isPending ? 'Action Required' : 'Live on Catalog'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {isPending ? (
                              <button
                                onClick={() => handleApproveCourse(c.id)}
                                disabled={approving}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition cursor-pointer disabled:opacity-50"
                              >
                                {approving ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                                <span>{sa.approvals.approveBtn}</span>
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>{sa.approvals.approvedBtn}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Bulk Approve */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {selectedCourseIds.length} course(s) selected
              </span>
              <button
                onClick={handleBulkApprove}
                disabled={selectedCourseIds.length === 0 || isBulkApproving}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition disabled:opacity-40 flex items-center gap-2 cursor-pointer"
              >
                {isBulkApproving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>
                  {sa.approvals.bulkApprove} ({selectedCourseIds.length})
                </span>
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTION 3: 2-COLUMN SPLIT CONTROLS (Users + Landing CMS)   */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ── LEFT CARD: USER & ROLE MANAGEMENT ── */}
            <div
              id="section-users"
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="font-extrabold text-[#0F172A] text-base">
                      {sa.users.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Direct role provisioning & active account locks in SQLite
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-lg">
                    {users.length} Total Users
                  </span>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder={sa.users.searchPlaceholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-semibold">
                    {['ALL', 'STUDENTS', 'MENTORS', 'ADMINS'].map((role) => (
                      <button
                        key={role}
                        onClick={() => setUserRoleFilter(role)}
                        className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                          userRoleFilter === role
                            ? 'bg-white text-[#0F172A] shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {role === 'ALL'
                          ? sa.users.filterAll
                          : role === 'MENTORS'
                          ? sa.users.filterMentors
                          : role === 'ADMINS'
                          ? sa.users.filterAdmins
                          : sa.users.filterStudents}
                      </button>
                    ))}
                  </div>
                </div>

                {/* User List Rows */}
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {filteredUsers.map((u) => {
                    const isSuspended = u.status === 'SUSPENDED';
                    const isUpdating = updatingUserId === u.id;

                    return (
                      <div
                        key={u.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isSuspended
                            ? 'bg-red-50/40 border-red-200'
                            : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              u.role === 'SUPER_ADMIN'
                                ? 'bg-[#0F172A] text-white'
                                : u.role === 'ADMIN'
                                ? 'bg-[#2563EB] text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {u.initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-800 text-xs truncate">{u.name}</p>
                              {isSuspended ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-600">
                                  {sa.users.suspended}
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700">
                                  {sa.users.active}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                          </div>
                        </div>

                        {/* Interactive Role Dropdown + Suspend Toggle */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <select
                            value={u.role}
                            disabled={isUpdating}
                            onChange={(e) => handleUpdateUser(u.id, { role: e.target.value })}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-[#2563EB]"
                          >
                            <option value="USER">{sa.users.roleUser}</option>
                            <option value="ADMIN">{sa.users.roleMentor}</option>
                            <option value="SUPER_ADMIN">{sa.users.roleSuperAdmin}</option>
                          </select>

                          <button
                            onClick={() =>
                              handleUpdateUser(u.id, {
                                status: isSuspended ? 'ACTIVE' : 'SUSPENDED',
                              })
                            }
                            disabled={isUpdating}
                            title={isSuspended ? 'Activate User' : 'Suspend User'}
                            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer transition"
                          >
                            {isSuspended ? (
                              <ToggleLeft className="w-5 h-5 text-red-500" />
                            ) : (
                              <ToggleRight className="w-5 h-5 text-emerald-500" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer: + Invite New User Button */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-[#2563EB] text-[#2563EB] hover:bg-blue-50/50 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{sa.users.inviteBtn}</span>
                </button>
              </div>
            </div>

            {/* ── RIGHT CARD: LANDING PAGE CMS CONTROL ── */}
            <div
              id="section-cms"
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-[#0F172A] text-base">
                      {sa.cms.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Merchandising & announcements on the public student portal
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{sa.cms.syncActive}</span>
                  </span>
                </div>

                {/* Announcement Banner Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      {sa.cms.bannerLabel}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400">
                        {sa.cms.liveOnSite}
                      </span>
                      <button
                        onClick={() => setIsBannerLive(!isBannerLive)}
                        className="cursor-pointer"
                      >
                        {isBannerLive ? (
                          <ToggleRight className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      value={bannerText}
                      onChange={(e) => setBannerText(e.target.value)}
                      placeholder="🔥 Flash Enrollment: Get 25% off all Fullstack Cohorts with code CODEPATH25..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleUpdateBanner}
                      disabled={isUpdatingBanner}
                      className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isUpdatingBanner ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>{sa.cms.updateBanner}</span>
                    </button>
                  </div>
                </div>

                {/* Featured Courses on Landing Page (Slots 01, 02, 03) */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700">
                    {sa.cms.featuredTitle}
                  </h4>

                  <div className="space-y-2.5">
                    {featuredSlots.map((slotItem) => {
                      const slotNum = `0${slotItem.slot}`;
                      return (
                        <div
                          key={slotItem.slot}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
                        >
                          <span className="font-mono text-xs font-extrabold bg-[#2563EB] text-white px-2 py-1 rounded-lg">
                            {slotNum}
                          </span>
                          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                            {sa.cms.slotLabel} {slotItem.slot}
                          </span>

                          <div className="flex-1 min-w-0">
                            <select
                              value={slotItem.courseId}
                              onChange={(e) => {
                                const newCourseId = e.target.value;
                                setFeaturedSlots((prev) =>
                                  prev.map((s) =>
                                    s.slot === slotItem.slot
                                      ? { ...s, courseId: newCourseId }
                                      : s
                                  )
                                );
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none truncate cursor-pointer"
                            >
                              <option value="">-- Choose Course --</option>
                              {publishedCourses.map((c) => (
                                <option key={c.id} value={c.id}>
                                  [{c.codeTag}] {c.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Save Merchandising Changes Button */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  onClick={handleSaveMerchandising}
                  disabled={isSavingMerch}
                  className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingMerch ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{sa.cms.saveMerchandising}</span>
                </button>
              </div>
            </div>
          </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: INVITE NEW USER / ASSIGN SUPER ADMIN                     */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 relative"
            >
              <button
                onClick={() => setShowInviteModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Invite or Provision User
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Create new staff credentials, grant mentor permissions, or assign a platform super administrator.
              </p>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Dr. Rayhan Alamsyah"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="e.g. rayhan@codepath.id"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Platform Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                    >
                      <option value="USER">Student (USER)</option>
                      <option value="ADMIN">Mentor (ADMIN)</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Initial Password
                    </label>
                    <input
                      required
                      value={invitePassword}
                      onChange={(e) => setInvitePassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isInviting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Provision Account</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SuperAdminDashboard() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading platform analytics...</div>}>
      <SuperAdminDashboardContent />
    </Suspense>
  );
}
