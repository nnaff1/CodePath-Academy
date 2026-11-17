'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Menu, X, Award, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { DemoRole } from '@/types';

interface NavbarProps {
  currentRole?: DemoRole;
  onSelectRole?: (role: DemoRole) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenVerifyModal: () => void;
}

export function Navbar({
  currentRole = 'visitor',
  onSelectRole,
  onOpenAuth,
  onOpenVerifyModal,
}: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-slate-200/80'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Minimalist Logo with code bracket icon */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-mono text-sm font-bold shadow-2xs group-hover:bg-blue-600 transition-colors">
            &lt;/&gt;
          </div>
          <span className="text-lg font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
            CodePath Academy
          </span>
        </Link>

        {/* Center: Smooth scroll links with bilingual support */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium text-slate-600">
          <a
            href="#roadmap"
            className="hover:text-slate-900 hover:font-semibold transition"
          >
            {t.navbar.roadmap}
          </a>
          <a
            href="#courses"
            className="hover:text-slate-900 hover:font-semibold transition"
          >
            {t.navbar.courses}
          </a>
          <a
            href="#standard"
            className="hover:text-slate-900 hover:font-semibold transition"
          >
            {t.navbar.mentors}
          </a>
          <button
            onClick={onOpenVerifyModal}
            className="hover:text-slate-900 hover:font-semibold transition flex items-center gap-1.5 cursor-pointer text-slate-600"
          >
            <span>{t.navbar.verifyCert}</span>
          </button>
        </nav>

        {/* Right: Language Switcher, Log In, Start Learning, Profile Icon */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Bilingual Language Switcher (EN | ID) with Globe Icon & Framer Motion layoutId */}
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
                  layoutId="activeLangTab"
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
                  layoutId="activeLangTab"
                  className="absolute inset-0 bg-[#0F172A] rounded-md shadow-2xs"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`relative z-10 ${language === 'id' ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                ID
              </span>
            </button>
          </div>

          {/* Log In Link */}
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            {t.navbar.logIn}
          </Link>

          {/* Start Learning Button (Directly navigates to /login) */}
          <Link
            href="/login"
            className="text-sm font-semibold text-white bg-[#0F172A] hover:bg-slate-800 px-4 py-2.5 rounded-lg transition shadow-xs hover:shadow cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>{t.navbar.startLearning}</span>
          </Link>

          {/* User Profile Avatar Icon */}
          <Link
            href="/login"
            className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition shadow-2xs cursor-pointer ml-1"
            title="User Account"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile compact language toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-md border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                language === 'en' ? 'bg-[#0F172A] text-white' : 'text-slate-600'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('id')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                language === 'id' ? 'bg-[#0F172A] text-white' : 'text-slate-600'
              }`}
            >
              ID
            </button>
          </div>

          <Link
            href="/login"
            className="text-xs font-semibold text-white bg-[#0F172A] px-3 py-1.5 rounded-lg"
          >
            {t.navbar.logIn}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <a
              href="#roadmap"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              {t.navbar.roadmap}
            </a>
            <a
              href="#courses"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              {t.navbar.courses}
            </a>
            <a
              href="#standard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              {t.navbar.mentors}
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVerifyModal();
              }}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 text-left flex items-center justify-between"
            >
              <span>{t.navbar.verifyCert}</span>
              <Award className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          <div className="pt-3 flex gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 text-center hover:bg-slate-50 transition"
            >
              {t.navbar.logIn}
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 rounded-lg bg-slate-900 text-sm font-semibold text-white text-center hover:bg-slate-800 transition"
            >
              {t.navbar.startLearning}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
