'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Mail, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FooterProps {
  onVerify: (certId: string) => void;
  onSubscribeNotice: (email: string) => void;
}

export function Footer({ onVerify, onSubscribeNotice }: FooterProps) {
  const { t } = useLanguage();
  const [certInput, setCertInput] = useState('CP-2026-889');
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (certInput.trim()) {
      onVerify(certInput.trim());
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribing(true);
      setTimeout(() => {
        setIsSubscribing(false);
        onSubscribeNotice(emailInput.trim());
        setEmailInput('');
      }, 500);
    }
  };

  return (
    <footer className="w-full bg-[#F8FAFC] border-t border-slate-200 pt-16 pb-12 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">
          
          {/* Column 1: Brand Info (3.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-mono text-sm font-bold">
                &lt;/&gt;
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base">
                CodePath Academy
              </span>
            </a>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              {t.footer.tagline}
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.footer.systemsOperational.toUpperCase()}</span>
            </div>
          </div>

          {/* Column 2: Explore Courses (2.5 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.footer.exploreTitle}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              {t.footer.tracks.map((track, i) => (
                <li key={i}>
                  <a href={i === 3 ? '#roadmap' : '#courses'} className="hover:text-blue-600 transition">
                    {track}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Verify Credential (3 cols) */}
          <div id="verify" className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.footer.verifyTitle}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t.footer.verifyDesc}
            </p>
            <form onSubmit={handleCheck} className="flex gap-2">
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder={t.footer.verifyPlaceholder}
                className="flex-1 min-w-0 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono text-slate-800"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition shrink-0 cursor-pointer"
              >
                {t.footer.verifyBtn}
              </button>
            </form>
          </div>

          {/* Column 4: Stay Updated (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.footer.newsletterTitle}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t.footer.newsletterDesc}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={t.footer.newsletterPlaceholder}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="w-full py-2 px-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                {isSubscribing ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>{t.footer.subscribeBtn}</span>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 {t.footer.copyright}
          </div>
          <div className="flex items-center gap-6">
            <a href="#verify" className="hover:text-slate-800 transition">
              {t.footer.links.directory}
            </a>
            <a href="#standard" className="hover:text-slate-800 transition">
              {t.footer.links.mentorship}
            </a>
            <a href="#roadmap" className="hover:text-slate-800 transition">
              {t.footer.links.pathways}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

