'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  KeyRound,
  Award,
  Globe,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
  Lock,
  Loader2,
  Save,
  ArrowLeft,
  ChevronRight,
  Flame,
  Bell,
  Code,
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  MoreHorizontal,
  LogOut,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  githubUsername?: string;
  xpPoints: number;
  role: string;
}

interface CertificateData {
  id: string;
  certificateCode: string;
  grade: string;
  score: number;
  issuedAt: string;
  courseTitle: string;
  courseSlug?: string;
}

type ProfileTab = 'profile' | 'security' | 'credentials';

export default function StudentProfilePage() {
  const { language, setLanguage, t } = useLanguage();
  const sd = t.studentDashboard;
  const pm = t.studentDashboard.profileModal;

  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [loading, setLoading] = useState(true);

  const [student, setStudent] = useState<StudentProfile>({
    id: 'student-demo',
    name: 'Affando Fathinatha',
    email: 'student@codepath.id',
    role: 'USER',
    xpPoints: 1450,
    bio: 'Fullstack Next.js developer aspiring to build production AI orchestration systems.',
    githubUsername: 'nnaff1',
  });

  const [certificates, setCertificates] = useState<CertificateData[]>([]);

  // Form states
  const [name, setName] = useState('Affando Fathinatha');
  const [bio, setBio] = useState('Fullstack Next.js developer aspiring to build production AI orchestration systems.');
  const [githubUsername, setGithubUsername] = useState('nnaff1');

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status feedback
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedProfileLink, setCopiedProfileLink] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);

  useEffect(() => {
    fetch('/api/student/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setStudent(data.profile);
          setName(data.profile.name);
          setBio(data.profile.bio || '');
          setGithubUsername(data.profile.githubUsername || '');
          if (data.certificates) setCertificates(data.certificates);
        }
      })
      .catch((err) => console.error('Error fetching profile:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    try {
      const res = await fetch('/api/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim(),
          githubUsername: githubUsername.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProfileSuccessMsg(pm.saveSuccess);
        setStudent((prev) => ({
          ...prev,
          name: data.user.name,
          bio: data.user.bio || '',
          githubUsername: data.user.githubUsername || '',
        }));
        setTimeout(() => setProfileSuccessMsg(''), 3500);
      } else {
        setProfileErrorMsg(data.message || 'Failed to update profile.');
      }
    } catch {
      setProfileErrorMsg('Connection error. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccessMsg('');
    setPasswordErrorMsg('');

    if (newPassword.length < 6) {
      setPasswordErrorMsg(pm.passwordTooShort);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg(pm.passwordMismatch);
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPasswordSuccessMsg(pm.passwordSuccess);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccessMsg(''), 4000);
      } else {
        setPasswordErrorMsg(data.message || 'Failed to change password.');
      }
    } catch {
      setPasswordErrorMsg('Connection error. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCopyProfileLink = () => {
    const link = `${window.location.origin}/?verify=${certificates[0]?.certificateCode || 'CP-2026-889'}`;
    navigator.clipboard.writeText(link);
    setCopiedProfileLink(true);
    setTimeout(() => setCopiedProfileLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ── Fixed Left Sidebar ── */}
      <aside className="fixed left-0 top-0 h-screen w-[220px] bg-white border-r border-slate-200 flex flex-col z-30">
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

        <div className="px-5 pt-4 pb-2">
          <span className="text-[9px] font-bold tracking-widest text-emerald-600 uppercase">
            • {sd.portalLabel}
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <Link
            href="/dashboard/student"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <LayoutDashboard size={18} className="text-slate-400" />
            <span className="truncate text-[13px]">{sd.nav.learning}</span>
          </Link>
          <Link
            href="/dashboard/student"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <Code size={18} className="text-slate-400" />
            <span className="truncate text-[13px]">{sd.nav.workspace}</span>
          </Link>
          <Link
            href="/dashboard/student"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <BookOpen size={18} className="text-slate-400" />
            <span className="truncate text-[13px]">{sd.nav.catalog}</span>
          </Link>
          <Link
            href="/dashboard/student"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <Award size={18} className="text-slate-400" />
            <span className="truncate text-[13px]">{sd.nav.certificates}</span>
          </Link>
          <Link
            href="/dashboard/student"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <MessageSquare size={18} className="text-slate-400" />
            <span className="truncate text-[13px]">{sd.nav.community}</span>
          </Link>
        </nav>

        <div className="px-3 pb-4 pt-3 border-t border-slate-100 mt-2">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-blue-50/60 border border-blue-100/60 relative">
            <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs">
              {student.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">{student.name}</div>
              <div className="text-[11px] text-slate-500 truncate">
                {student.xpPoints.toLocaleString()} XP
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Fixed Top Header Bar ── */}
      <header className="fixed top-0 left-[220px] right-0 h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 z-20">
        <div className="flex items-center gap-1.5 text-sm text-slate-500 flex-shrink-0 min-w-0">
          <Link href="/dashboard/student" className="text-slate-400 hover:text-slate-600 flex items-center gap-1">
            <ArrowLeft size={13} />
            {sd.breadcrumb}
          </Link>
          <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
          <span className="font-semibold text-slate-700 truncate">{pm.title}</span>
        </div>

        <div className="flex items-center gap-3 ml-auto flex-shrink-0">
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

          <Link
            href="/dashboard/student"
            className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-xs"
          >
            ← Return to Console
          </Link>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="ml-[220px] pt-14 min-h-screen">
        <div className="p-8 max-w-4xl mx-auto space-y-6">

          {/* Page Title Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-widest text-[#2563EB] uppercase">
                STUDENT SETTINGS
              </span>
              <h1 className="text-2xl font-bold text-[#0F172A]">{pm.title}</h1>
              <p className="text-xs sm:text-sm text-slate-500">{pm.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-base shadow-xs">
                {student.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
              </div>
            </div>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { key: 'profile', label: pm.tabProfile, icon: <User size={14} /> },
              { key: 'security', label: pm.tabSecurity, icon: <KeyRound size={14} /> },
              { key: 'credentials', label: pm.tabCredentials, icon: <Award size={14} /> },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as ProfileTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Profile & Developer Links */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <form onSubmit={handleSaveProfile} className="space-y-5">
                {profileSuccessMsg && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
                    <CheckCircle2 size={15} />
                    {profileSuccessMsg}
                  </div>
                )}
                {profileErrorMsg && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 p-3.5 rounded-xl">
                    <AlertCircle size={15} />
                    {profileErrorMsg}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">{pm.nameLabel}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 block">{pm.emailLabel}</label>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Lock size={10} /> Verified
                    </span>
                  </div>
                  <input
                    type="email"
                    value={student.email}
                    disabled
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <GithubIcon className="w-3.5 h-3.5 text-slate-700" />
                    {pm.githubLabel}
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                    <span className="px-3.5 py-2.5 bg-slate-50 border-r border-slate-200 text-xs font-mono text-slate-500 select-none">
                      https://github.com/
                    </span>
                    <input
                      type="text"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      placeholder="your-github-handle"
                      className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm font-mono bg-white text-slate-900 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">{pm.githubHint}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">{pm.bioLabel}</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={pm.bioPlaceholder}
                    rows={4}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSavingProfile ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {isSavingProfile ? pm.saving : pm.saveBtn}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Security & Preferences */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-[#2563EB]" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {pm.languageTitle}
                  </h3>
                </div>
                <p className="text-xs text-slate-500">{pm.languageSub}</p>
                
                <div className="flex items-center gap-3 pt-1">
                  {(['en', 'id'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        language === lang
                          ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Globe size={13} />
                      {lang === 'en' ? 'English (EN)' : 'Bahasa Indonesia (ID)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="flex items-center gap-2 pb-1">
                    <Shield size={18} className="text-slate-700" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {pm.securityTitle}
                    </h3>
                  </div>

                  {passwordSuccessMsg && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
                      <CheckCircle2 size={15} />
                      {passwordSuccessMsg}
                    </div>
                  )}
                  {passwordErrorMsg && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 p-3.5 rounded-xl">
                      <AlertCircle size={15} />
                      {passwordErrorMsg}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">{pm.currentPasswordLabel}</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder={pm.currentPasswordPlaceholder}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 block">{pm.newPasswordLabel}</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder={pm.newPasswordPlaceholder}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 block">{pm.confirmPasswordLabel}</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder={pm.confirmPasswordPlaceholder}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {isChangingPassword ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
                      {isChangingPassword ? pm.saving : pm.securityTitle}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tab 3: Credential Showcase */}
          {activeTab === 'credentials' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-widest text-blue-200 uppercase">{pm.levelTitle}</span>
                  <h3 className="text-xl font-bold">{pm.levelBadge}</h3>
                  <p className="text-xs text-blue-100 pt-1">
                    {pm.xpTitle}: <span className="font-bold text-white text-base">{student.xpPoints.toLocaleString()} XP</span>
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white">
                  <Award size={30} />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-600 font-mono flex-1 truncate px-1">
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}/?verify=${certificates[0]?.certificateCode || 'CP-2026-889'}`
                    : 'https://codepath.academy/?verify=CP-2026-889'}
                </div>
                <button
                  onClick={handleCopyProfileLink}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-blue-700 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200/60 transition cursor-pointer flex-shrink-0"
                >
                  {copiedProfileLink ? <Check size={13} /> : <Copy size={13} />}
                  {copiedProfileLink ? pm.linkCopied : pm.copyLink}
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {pm.certificatesEarned} ({certificates.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <span className="inline-flex text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                          {cert.grade} • {cert.score}%
                        </span>
                        <h4 className="text-sm font-bold text-[#0F172A]">{cert.courseTitle}</h4>
                        <p className="text-xs text-slate-400 font-mono">
                          ID: <span className="font-semibold text-slate-700">{cert.certificateCode}</span>
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => handleCopyCode(cert.certificateCode)}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          {copiedCode === cert.certificateCode ? (
                            <Check size={13} className="text-emerald-600" />
                          ) : (
                            <Copy size={13} />
                          )}
                          <span>{copiedCode === cert.certificateCode ? 'Copied' : 'Copy ID'}</span>
                        </button>
                        <Link
                          href={`/?verify=${cert.certificateCode}`}
                          target="_blank"
                          className="flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-blue-700"
                        >
                          Verify
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
