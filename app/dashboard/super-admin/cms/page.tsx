'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Layout,
  Megaphone,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
  Save,
  Loader2,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Zap,
  Tag,
  Check,
  Globe,
  Monitor,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSuperAdmin } from '../SuperAdminContext';

interface PublishedCourse {
  id: string;
  title: string;
  slug: string;
  codeTag: string;
  level: string;
  price: number;
  mentorName: string;
  isFeatured?: boolean;
  featuredSlot?: number | null;
}

function LandingPageCmsContent() {
  const { language, t } = useLanguage();
  const sa = t.superAdminDashboard;
  const { showToast } = useSuperAdmin();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<PublishedCourse[]>([]);

  // Banner State
  const [bannerText, setBannerText] = useState(
    '🔥 Flash Enrollment: Get 25% off all Fullstack Cohorts with code CODEPATH25'
  );
  const [isBannerLive, setIsBannerLive] = useState(true);
  const [isUpdatingBanner, setIsUpdatingBanner] = useState(false);
  const [lastBannerSaved, setLastBannerSaved] = useState<string | null>(null);

  // Featured Courses Merchandising State
  const [featuredSlots, setFeaturedSlots] = useState<{ slot: number; courseId: string }[]>([
    { slot: 1, courseId: '' },
    { slot: 2, courseId: '' },
    { slot: 3, courseId: '' },
  ]);
  const [isSavingMerch, setIsSavingMerch] = useState(false);
  const [lastMerchSaved, setLastMerchSaved] = useState<string | null>(null);

  // Fetch initial CMS data
  const fetchCmsData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/super-admin/cms');
      const data = await res.json();

      if (data.success) {
        const text = data.bannerText ?? data.cms?.bannerText;
        const live = data.isBannerLive ?? data.cms?.isBannerLive;
        const slots = data.featuredSlots ?? data.cms?.featuredSlots;
        const courseList: PublishedCourse[] = data.courses ?? data.cms?.courses ?? [];

        if (typeof text === 'string') setBannerText(text);
        if (typeof live === 'boolean') setIsBannerLive(live);
        if (Array.isArray(courseList)) setCourses(courseList);

        if (Array.isArray(slots) && slots.length === 3) {
          setFeaturedSlots(slots);
        } else if (courseList.length > 0) {
          setFeaturedSlots([
            { slot: 1, courseId: courseList[0]?.id || '' },
            { slot: 2, courseId: courseList[1]?.id || '' },
            { slot: 3, courseId: courseList[2]?.id || '' },
          ]);
        }
      }
    } catch (err) {
      console.error('Failed to load CMS data:', err);
      showToast(language === 'id' ? 'Gagal memuat pengaturan CMS.' : 'Failed to load CMS settings.');
    } finally {
      setLoading(false);
    }
  }, [language, showToast]);

  useEffect(() => {
    fetchCmsData();
  }, [fetchCmsData]);

  // Save Announcement Banner
  const handleSaveBanner = async () => {
    try {
      setIsUpdatingBanner(true);
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
        setLastBannerSaved(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        showToast(
          language === 'id'
            ? 'Banner pengumuman publik berhasil disimpan & disinkronkan ke situs!'
            : 'Announcement banner updated and synchronized with live site!'
        );
      } else {
        showToast(data.message || 'Gagal menyimpan banner.');
      }
    } catch {
      showToast(language === 'id' ? 'Gagal memperbarui banner.' : 'Failed to update banner.');
    } finally {
      setIsUpdatingBanner(false);
    }
  };

  // Save Featured Courses Merchandising
  const handleSaveMerchandising = async () => {
    try {
      setIsSavingMerch(true);
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
        setLastMerchSaved(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        showToast(
          language === 'id'
            ? '3 Slot kursus unggulan landing page berhasil disimpan & dipublikasikan!'
            : 'Featured courses slots saved and deployed to catalog!'
        );
      } else {
        showToast(data.message || 'Gagal menyimpan slot kursus.');
      }
    } catch {
      showToast(language === 'id' ? 'Gagal menyimpan slot kursus.' : 'Failed to save slots.');
    } finally {
      setIsSavingMerch(false);
    }
  };

  // Quick preset insert helper
  const handleInsertTag = (tag: string) => {
    setBannerText((prev) => (prev.trim() ? `${prev.trim()} • ${tag}` : tag));
  };

  // Format currency
  const formatPrice = (val?: number) => (val ? `Rp ${val.toLocaleString('id-ID')}` : 'Rp 0');

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] w-full">
      {/* ─── PAGE HEADER ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 text-xs font-mono font-semibold">
            <Zap className="w-3 h-3 text-[#2563EB]" />
            <span>• CONTENT MANAGEMENT • LIVE PRODUCTION CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {sa.cms.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            {language === 'id'
              ? 'Kelola banner pengumuman hero, status siaran langsung, dan kurasi penempatan 3 slot kursus unggulan di katalog beranda.'
              : 'Configure promotional hero alerts, announcement broadcast status, and premier course slot positioning on the public landing page.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={fetchCmsData}
            disabled={loading}
            title={language === 'id' ? 'Segarkan' : 'Refresh'}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin text-[#2563EB]' : ''}`} />
          </button>

          {/* View Live Landing Page Button */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'id' ? 'Buka Beranda Publik' : 'Preview Landing Page'}</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* ─── 2-COLUMN BALANCED CMS GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8 items-start">
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* LEFT COLUMN: GLOBAL ANNOUNCEMENT BANNER CARD                */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
          {/* Section Header with Live Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shadow-2xs">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#0F172A] text-sm sm:text-base">
                  {language === 'id' ? 'Banner Pengumuman Global' : 'Global Announcement Banner'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'id'
                    ? 'Pesan promosi siaran langsung di bagian paling atas situs'
                    : 'Broadcast alert displayed at the very top of all visitor pages'}
                </p>
              </div>
            </div>

            {/* Live Toggle Pill */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
              <span
                className={`text-[11px] font-bold flex items-center gap-1.5 ${
                  isBannerLive ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {isBannerLive && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                {isBannerLive
                  ? language === 'id' ? 'SIARAN AKTIF' : 'LIVE ON SITE'
                  : language === 'id' ? 'DRAF NONAKTIF' : 'OFFLINE DRAFT'}
              </span>
              <button
                type="button"
                onClick={() => setIsBannerLive(!isBannerLive)}
                className="cursor-pointer transition hover:opacity-80"
                title={isBannerLive ? 'Click to deactivate' : 'Click to activate'}
              >
                {isBannerLive ? (
                  <ToggleRight className="w-7 h-7 text-emerald-500" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-300" />
                )}
              </button>
            </div>
          </div>

          {/* Banner Copy Input with Character Count & Quick Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                {language === 'id' ? 'Konten Pesan Pengumuman' : 'Banner Message Copy'}
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                {bannerText.length} / 160 {language === 'id' ? 'karakter' : 'chars'}
              </span>
            </div>

            <textarea
              rows={3}
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              placeholder="e.g. 🔥 Flash Enrollment: Get 25% off all Fullstack Cohorts with code CODEPATH25"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition resize-none font-medium text-slate-800 shadow-inner"
            />

            {/* Quick Helper Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Tag className="w-3 h-3" />
                {language === 'id' ? 'Sisipkan Cepat:' : 'Quick Tags:'}
              </span>
              <button
                type="button"
                onClick={() => handleInsertTag('Kode: CODEPATH25')}
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-100 hover:bg-blue-100 transition cursor-pointer"
              >
                + CODEPATH25
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('Flash Sale 25% OFF 🔥')}
                className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
              >
                + Flash Sale 🔥
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('Pendaftaran Cohort #14 Dibuka 🚀')}
                className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
              >
                + Cohort #14 🚀
              </button>
            </div>
          </div>

          {/* ─── REALISTIC BROWSER VIEWPORT SIMULATOR ─── */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{language === 'id' ? 'Pratinjau Nyata di Tampilan Browser' : 'Live Browser Viewport Preview'}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {isBannerLive ? '• Status: Broadcast Live' : '• Status: Hidden on Site'}
              </span>
            </div>

            {/* Mini Browser Frame */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-white">
              {/* Browser Address Bar */}
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                </div>
                <div className="flex-1 bg-white rounded-md px-2.5 py-0.5 text-[10px] font-mono text-slate-500 border border-slate-200/80 truncate">
                  https://codepath.id/
                </div>
              </div>

              {/* Simulated Top Announcement Bar (Zero Overflow) */}
              <div
                className={`py-2 px-3 text-xs transition-all ${
                  isBannerLive
                    ? 'bg-[#0F172A] text-white'
                    : 'bg-slate-200 text-slate-400 line-through'
                }`}
              >
                <div className="flex items-center justify-center gap-2 min-w-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-pulse" />
                  <p className="text-[11px] font-medium text-center truncate min-w-0">
                    {bannerText || (language === 'id' ? 'Tidak ada pengumuman aktif' : 'No announcement broadcast')}
                  </p>
                </div>
              </div>

              {/* Simulated Mini Navbar */}
              <div className="px-3 py-2 bg-white flex items-center justify-between border-b border-slate-100 text-[10px]">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <span className="w-4 h-4 rounded bg-[#2563EB] text-white flex items-center justify-center text-[8px] font-mono">
                    &lt;&gt;
                  </span>
                  <span>CodePath ACADEMY</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <span>Courses</span>
                  <span>Curriculum</span>
                  <span>Mentors</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              {lastBannerSaved
                ? `${language === 'id' ? 'Tersimpan pukul' : 'Saved at'} ${lastBannerSaved}`
                : language === 'id' ? 'Belum ada perubahan tersimpan' : 'Ready to deploy'}
            </span>

            <button
              type="button"
              onClick={handleSaveBanner}
              disabled={isUpdatingBanner}
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isUpdatingBanner ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{sa.cms.updateBanner}</span>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* RIGHT COLUMN: FEATURED COURSES MERCHANDISING CARD           */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
          {/* Section Header with Direct Save Button */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
                <Layout className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#0F172A] text-sm sm:text-base">
                  {sa.cms.featuredTitle}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'id'
                    ? 'Atur 3 kelas unggulan terdepan di katalog publik'
                    : 'Select premier card positions on the public course catalog'}
                </p>
              </div>
            </div>

            {/* Quick Save Merchandising Button in Header */}
            <button
              type="button"
              onClick={handleSaveMerchandising}
              disabled={isSavingMerch}
              className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isSavingMerch ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{language === 'id' ? 'Simpan' : 'Save'}</span>
            </button>
          </div>

          {/* 3 Compact Featured Slots */}
          <div className="space-y-3">
            {featuredSlots.map((item, index) => {
              const selectedCourse = courses.find((c) => c.id === item.courseId);

              const slotBadge =
                index === 0
                  ? { label: 'FLAGSHIP', bg: 'bg-blue-50 text-[#2563EB] border-blue-100' }
                  : index === 1
                  ? { label: 'TRENDING', bg: 'bg-purple-50 text-purple-600 border-purple-100' }
                  : { label: 'NEW COHORT', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100' };

              return (
                <div
                  key={item.slot}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 hover:border-slate-300 transition"
                >
                  {/* Slot Top Meta */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-[#0F172A] text-white flex items-center justify-center text-[10px] font-bold">
                        {item.slot}
                      </span>
                      <span>{sa.cms.slotLabel} {item.slot}</span>
                    </span>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${slotBadge.bg}`}
                    >
                      {slotBadge.label}
                    </span>
                  </div>

                  {/* Course Selector Dropdown with full title clarity */}
                  <select
                    value={item.courseId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setFeaturedSlots((prev) =>
                        prev.map((s) => (s.slot === item.slot ? { ...s, courseId: newId } : s))
                      );
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] cursor-pointer truncate shadow-2xs"
                  >
                    <option value="">
                      {language === 'id' ? '-- Pilih Kursus Unggulan --' : '-- Select a Featured Course --'}
                    </option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.codeTag}] {c.title} — {c.mentorName}
                      </option>
                    ))}
                  </select>

                  {/* Course Details Bar */}
                  {selectedCourse ? (
                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60">
                      <span className="truncate">
                        Mentor: <strong className="text-slate-700 font-semibold">{selectedCourse.mentorName}</strong>
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="font-semibold text-slate-600">
                          {formatPrice(selectedCourse.price)}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          /{selectedCourse.slug}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">
                      {language === 'id' ? 'Belum ada kursus dipilih untuk slot ini' : 'No course assigned to this slot'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Merchandising Action Bar */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              {lastMerchSaved
                ? `${language === 'id' ? 'Slot disimpan pukul' : 'Slots deployed at'} ${lastMerchSaved}`
                : language === 'id' ? '3 Kursus siap ditampilkan di beranda' : '3 Slots ready for live showcase'}
            </span>

            <button
              type="button"
              onClick={handleSaveMerchandising}
              disabled={isSavingMerch}
              className="px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSavingMerch ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              <span>{sa.cms.saveMerchandising}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPageCmsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading Landing Page CMS...</div>}>
      <LandingPageCmsContent />
    </Suspense>
  );
}
