'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Check,
  Lock,
  User,
  Eye,
  EyeOff,
  Globe,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync mode with URL search params if present (e.g. /login?mode=register)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get('mode');
      if (urlMode === 'register') {
        setMode('register');
      } else if (urlMode === 'login') {
        setMode('login');
      }
    }
  }, []);

  const handleDemoAccess = async (role: 'student' | 'mentor' | 'superadmin') => {
    setIsSubmitting(true);
    const demoEmail =
      role === 'superadmin'
        ? 'owner@codepath.id'
        : role === 'mentor'
        ? 'sarah.mentor@codepath.id'
        : 'student@codepath.id';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'password123' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('codepath_demo_role', role);
          localStorage.setItem('codepath_user_session', JSON.stringify(data.user));
        }
        router.push(data.redirectUrl);
        return;
      }
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('codepath_demo_role', role);
    }
    if (role === 'student') router.push('/dashboard/student');
    else if (role === 'mentor') router.push('/dashboard/mentor');
    else router.push('/dashboard/super-admin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload =
      mode === 'login'
        ? { email, password }
        : { name: fullName, email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          const roleMapping =
            data.user.role === 'SUPER_ADMIN'
              ? 'superadmin'
              : data.user.role === 'ADMIN'
              ? 'mentor'
              : 'student';
          localStorage.setItem('codepath_demo_role', roleMapping);
          localStorage.setItem('codepath_user_session', JSON.stringify(data.user));
        }
        router.push(data.redirectUrl || '/dashboard/student');
      } else {
        setErrorMessage(data.message || 'Authentication failed. Please check your credentials.');
      }
    } catch {
      // Offline fallback
      handleDemoAccess('student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white selection:bg-blue-100 selection:text-blue-900 font-sans">
      
      {/* ======================================================== */}
      {/* LEFT BRANDING PANEL (Deep Navy #0F172A)                   */}
      {/* ======================================================== */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] bg-[#0F172A] p-8 xl:p-12 flex-col justify-between relative overflow-hidden text-white border-r border-slate-800">
        {/* Subtle radial ambient blue glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row: Logo & Back to Home */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 shadow-md shadow-blue-500/25 flex items-center justify-center text-white font-mono font-bold text-sm group-hover:scale-105 transition-transform">
              &lt;&gt;
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block">
                CodePath Academy
              </span>
              <span className="text-[10px] font-mono tracking-widest text-blue-400 font-bold block uppercase">
                {t.authPage.campusSubtitle}
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition shadow-2xs font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.authPage.backToHome}</span>
          </Link>
        </div>

        {/* Middle Hero Copy & Testimonial Card */}
        <div className="relative z-10 my-auto py-8 space-y-8">
          
          {/* Eyebrow & Headline */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-300 text-xs font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>{t.authPage.cohortBadge}</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t.authPage.heroHeadline}
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
              {t.authPage.heroDescription}
            </p>
          </div>

          {/* Testimonial Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xs relative space-y-4">
            {/* Stars & Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400 text-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-xs font-mono text-slate-400 font-medium">
                  {t.authPage.alumniRating}
                </span>
              </div>
              <span className="text-slate-700 font-serif text-3xl leading-none select-none">
                “
              </span>
            </div>

            {/* Quote text */}
            <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed font-normal">
              {t.authPage.testimonialQuote}
            </p>

            {/* Student Profile & Badge */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  AV
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">
                    {t.authPage.alumniName}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {t.authPage.alumniCohort}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 text-xs font-semibold whitespace-nowrap">
                <Check className="w-3.5 h-3.5" />
                <span>{t.authPage.hiredBadge}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Status & Security Badges */}
        <div className="relative z-10 pt-4 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.authPage.activeDevelopers}</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 tracking-wider">
            {t.authPage.securitySpecs}
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* RIGHT AUTHENTICATION PANEL (Pure White #FFFFFF)           */}
      {/* ======================================================== */}
      <div className="flex-1 bg-white p-6 sm:p-10 xl:p-12 flex flex-col justify-between overflow-y-auto">
        
        {/* Mobile top bar */}
        <div className="flex lg:hidden items-center justify-between pb-6 mb-4 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-white font-mono text-xs font-bold">
              &lt;&gt;
            </div>
            <span className="font-extrabold text-slate-900 text-sm">
              CodePath Academy
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.authPage.mobileHome}</span>
          </Link>
        </div>

        {/* Top Control Bar: Language Switcher (EN | ID) + Mode Switcher */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
          
          {/* Bilingual Language Switcher (EN | ID) */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80 text-xs">
            <div className="pl-2 pr-1 text-slate-400">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className="relative px-2 py-1 rounded-md text-xs font-bold transition cursor-pointer"
              title="Switch to English"
            >
              {language === 'en' && (
                <motion.div
                  layoutId="authPageLang"
                  className="absolute inset-0 bg-[#0F172A] rounded-md shadow-2xs"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`relative z-10 ${language === 'en' ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                EN
              </span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('id')}
              className="relative px-2 py-1 rounded-md text-xs font-bold transition cursor-pointer"
              title="Ganti ke Bahasa Indonesia"
            >
              {language === 'id' && (
                <motion.div
                  layoutId="authPageLang"
                  className="absolute inset-0 bg-[#0F172A] rounded-md shadow-2xs"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`relative z-10 ${language === 'id' ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                ID
              </span>
            </button>
          </div>

          {/* Mode Switcher (Log In / Create Free Account) */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.authPage.tabLogin}
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.authPage.tabRegister}
            </button>
          </div>
        </div>

        {/* Main Form Center Area */}
        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          
          {/* Eyebrow & Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-medium">
              <span>{mode === 'login' ? t.authPage.badgeLogin : t.authPage.badgeRegister}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'login' ? t.authPage.titleLogin : t.authPage.titleRegister}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500">
              {mode === 'login'
                ? t.authPage.subtitleLogin
                : t.authPage.subtitleRegister}
            </p>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => handleDemoAccess('student')}
            className="w-full py-2.5 px-4 border border-slate-200 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition shadow-2xs flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t.authPage.continueWithGoogle}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="w-full border-t border-slate-200" />
            <div className="absolute bg-white px-3 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block leading-tight">
                {t.authPage.orDivider}
              </span>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name in Register mode */}
            {mode === 'register' && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="block text-[11px] font-bold text-slate-700 tracking-wider uppercase">
                  {t.authPage.fullNameLabel}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.authPage.fullNamePlaceholder}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-400 transition shadow-2xs font-normal"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 tracking-wider uppercase">
                {t.authPage.emailLabel}
              </label>
              <div className="relative">
                <span className="text-slate-400 absolute left-3.5 top-2.5 font-mono text-sm select-none">
                  @
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.authPage.emailPlaceholder}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-400 transition shadow-2xs font-normal"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-700 tracking-wider uppercase">
                  {t.authPage.passwordLabel}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert(t.authPage.passwordResetNotice)}
                    className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
                  >
                    {t.authPage.forgotPassword}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === 'login'
                      ? t.authPage.passwordLoginPlaceholder
                      : t.authPage.passwordRegisterPlaceholder
                  }
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 placeholder:text-slate-400 transition shadow-2xs font-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 absolute right-3.5 top-3 transition cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me row */}
            {mode === 'login' && (
              <div className="flex items-center pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                  />
                  <span>{t.authPage.keepSignedIn}</span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login'
                      ? t.authPage.submitLogin
                      : t.authPage.submitRegister}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">Quick Demo:</span>
            <button
              type="button"
              onClick={() => handleDemoAccess('student')}
              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-[11px] font-bold transition cursor-pointer"
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoAccess('mentor')}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold transition cursor-pointer"
            >
              👨‍🏫 Mentor
            </button>
            <button
              type="button"
              onClick={() => handleDemoAccess('superadmin')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition cursor-pointer"
            >
              🛡️ Super Admin
            </button>
          </div>
        </div>

        {/* Footer Note & Links */}
        <div className="pt-6 mt-6 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {t.authPage.footerNote}
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 transition">
              {t.authPage.privacyPolicy}
            </Link>
            <span>•</span>
            <Link href="/" className="hover:text-slate-600 transition">
              {t.authPage.termsOfService}
            </Link>
            <span>•</span>
            <Link href="/" className="hover:text-slate-600 transition">
              {t.authPage.securityWhitepaper}
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
