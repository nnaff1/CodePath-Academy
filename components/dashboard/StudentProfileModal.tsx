'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Shield,
  KeyRound,
  Award,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
  Lock,
  Loader2,
  ShieldCheck,
  Save,
  ArrowRight,
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

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  certificates?: CertificateData[];
  onProfileUpdated?: (updated: {
    name: string;
    bio: string;
    githubUsername: string;
  }) => void;
}

type ProfileTab = 'profile' | 'security' | 'credentials';

export function StudentProfileModal({
  isOpen,
  onClose,
  student,
  certificates = [],
  onProfileUpdated,
}: StudentProfileModalProps) {
  const { language, setLanguage, t } = useLanguage();
  const pm = t.studentDashboard.profileModal;

  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');

  // Form states
  const [name, setName] = useState(student.name);
  const [bio, setBio] = useState(student.bio || '');
  const [githubUsername, setGithubUsername] = useState(student.githubUsername || '');

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

  // Sync state when student prop updates
  useEffect(() => {
    setName(student.name);
    setBio(student.bio || '');
    setGithubUsername(student.githubUsername || '');
  }, [student]);

  if (!isOpen) return null;

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
        if (onProfileUpdated) {
          onProfileUpdated({
            name: data.user.name,
            bio: data.user.bio || '',
            githubUsername: data.user.githubUsername || '',
          });
        }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] leading-tight">
                {pm.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{pm.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="px-6 pt-3 pb-2 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto">
          {[
            { key: 'profile', label: pm.tabProfile, icon: <User size={13} /> },
            { key: 'security', label: pm.tabSecurity, icon: <KeyRound size={13} /> },
            { key: 'credentials', label: pm.tabCredentials, icon: <Award size={13} /> },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as ProfileTab)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* ════════════════════════════════════════════════════════════════════
              TAB 1: PROFILE & DEVELOPER LINKS
          ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Profile Avatar Card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-14 h-14 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center text-lg font-bold shadow-xs">
                  {name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900">{name}</div>
                  <div className="text-xs text-slate-500">{student.email}</div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium pt-0.5">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      • {student.role}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="font-semibold text-[#2563EB] flex items-center gap-1">
                      <Zap size={11} className="fill-[#2563EB]" /> {student.xpPoints.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Success & Error Toasts */}
              {profileSuccessMsg && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                  <CheckCircle2 size={14} />
                  {profileSuccessMsg}
                </div>
              )}
              {profileErrorMsg && (
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">
                  <AlertCircle size={14} />
                  {profileErrorMsg}
                </div>
              )}

              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  {pm.nameLabel}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Email Address (Read-only) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 block">
                    {pm.emailLabel}
                  </label>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Lock size={10} /> Verified
                  </span>
                </div>
                <input
                  type="email"
                  value={student.email}
                  disabled
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-mono"
                />
              </div>

              {/* GitHub Username with auto-fill prefix */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <GithubIcon className="w-3.5 h-3.5 text-slate-700" />
                  {pm.githubLabel}
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                  <span className="px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-xs font-mono text-slate-500 select-none">
                    https://github.com/
                  </span>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="your-github-handle"
                    className="flex-1 px-3 py-2.5 text-xs font-mono bg-white text-slate-900 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">{pm.githubHint}</p>
              </div>

              {/* Developer Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  {pm.bioLabel}
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={pm.bioPlaceholder}
                  rows={3}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                  {isSavingProfile ? pm.saving : pm.saveBtn}
                </button>
              </div>
            </form>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              TAB 2: SECURITY (Change Password)
          ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password Form */}
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="flex items-center gap-2 pb-1">
                  <Shield size={16} className="text-slate-700" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {pm.securityTitle}
                  </h3>
                </div>

                {passwordSuccessMsg && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                    <CheckCircle2 size={14} />
                    {passwordSuccessMsg}
                  </div>
                )}
                {passwordErrorMsg && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">
                    <AlertCircle size={14} />
                    {passwordErrorMsg}
                  </div>
                )}

                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    {pm.currentPasswordLabel}
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder={pm.currentPasswordPlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* New Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">
                      {pm.newPasswordLabel}
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder={pm.newPasswordPlaceholder}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">
                      {pm.confirmPasswordLabel}
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder={pm.confirmPasswordPlaceholder}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isChangingPassword ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <KeyRound size={13} />
                    )}
                    {isChangingPassword ? pm.saving : pm.securityTitle}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              TAB 3: CREDENTIAL SHOWCASE
          ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'credentials' && (
            <div className="space-y-5">
              
              {/* XP & Rank Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md relative overflow-hidden">
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-blue-200 uppercase">
                      {pm.levelTitle}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold">{pm.levelBadge}</h3>
                    <p className="text-xs text-blue-100/90 pt-1">
                      {pm.xpTitle}:{' '}
                      <span className="font-bold text-white text-sm">
                        {student.xpPoints.toLocaleString()} XP
                      </span>
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white">
                    <Award size={24} />
                  </div>
                </div>
              </div>

              {/* Public Share Link Bar */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-600 font-mono flex-1 truncate px-1">
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}/?verify=${certificates[0]?.certificateCode || 'CP-2026-889'}`
                    : 'https://codepath.academy/?verify=CP-2026-889'}
                </div>
                <button
                  onClick={handleCopyProfileLink}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-blue-700 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer flex-shrink-0"
                >
                  {copiedProfileLink ? <Check size={13} /> : <Copy size={13} />}
                  {copiedProfileLink ? pm.linkCopied : pm.copyLink}
                </button>
              </div>

              {/* Certificates List */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {pm.certificatesEarned} ({certificates.length})
                </h4>

                {certificates.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                    {pm.noCertificates}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-300 transition flex items-center justify-between gap-4 flex-wrap"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {cert.courseTitle}
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                              {cert.grade} • {cert.score}%
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            ID: <span className="text-slate-700 font-semibold">{cert.certificateCode}</span> • {new Date(cert.issuedAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyCode(cert.certificateCode)}
                            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="Copy code"
                          >
                            {copiedCode === cert.certificateCode ? (
                              <Check size={14} className="text-emerald-600" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                          <Link
                            href={`/?verify=${cert.certificateCode}`}
                            target="_blank"
                            className="flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200/60 transition"
                          >
                            Verify
                            <ExternalLink size={11} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
