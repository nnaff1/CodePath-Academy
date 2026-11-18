'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
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
  BookOpen,
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSuperAdmin } from '../SuperAdminContext';

interface PublishedCourse {
  id: string;
  title: string;
  slug: string;
  codeTag: string;
  mentorName: string;
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

  // Featured Courses Merchandising State
  const [featuredSlots, setFeaturedSlots] = useState<{ slot: number; courseId: string }[]>([
    { slot: 1, courseId: '' },
    { slot: 2, courseId: '' },
    { slot: 3, courseId: '' },
  ]);
  const [isSavingMerch, setIsSavingMerch] = useState(false);

  // Fetch initial CMS data
  const fetchCmsData = useCallback(async () => {
    try {
      setLoading(true);
      const [cmsRes, coursesRes] = await Promise.all([
        fetch('/api/super-admin/cms').then((r) => r.json()),
        fetch('/api/super-admin/courses?status=PUBLISHED').then((r) => r.json()),
      ]);

      if (cmsRes.success) {
        if (cmsRes.bannerText) setBannerText(cmsRes.bannerText);
        if (typeof cmsRes.isBannerLive === 'boolean') setIsBannerLive(cmsRes.isBannerLive);
        if (cmsRes.featuredSlots && cmsRes.featuredSlots.length > 0) {
          setFeaturedSlots(cmsRes.featuredSlots);
        }
      }

      if (coursesRes.success) {
        setCourses(coursesRes.courses);
        // Pre-fill slots if empty
        if (coursesRes.courses.length > 0) {
          setFeaturedSlots((prev) =>
            prev.map((slot, idx) => ({
              slot: slot.slot,
              courseId: slot.courseId || coursesRes.courses[idx % coursesRes.courses.length]?.id || '',
            }))
          );
        }
      }
    } catch (err) {
      console.error('Failed to load CMS data:', err);
      showToast('Gagal memuat pengaturan CMS.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

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
          action: 'UPDATE_BANNER',
          bannerText,
          isLive: isBannerLive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          language === 'id'
            ? 'Banner pengumuman publik berhasil diperbarui secara live!'
            : 'Announcement banner updated and deployed live!'
        );
      } else {
        showToast(data.message || 'Gagal menyimpan banner.');
      }
    } catch {
      showToast('Gagal memperbarui banner pengumuman.');
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
          action: 'UPDATE_FEATURED',
          slots: featuredSlots,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          language === 'id'
            ? 'Slot kursus unggulan landing page berhasil disimpan!'
            : 'Featured courses slots saved successfully!'
        );
      } else {
        showToast(data.message || 'Gagal menyimpan slot kursus.');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan featured slots.');
    } finally {
      setIsSavingMerch(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] w-full">
      {/* ─── PAGE HEADER ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 text-xs font-mono font-semibold">
            <Zap className="w-3 h-3 text-[#2563EB]" />
            <span>• CONTENT MANAGEMENT • LIVE PRODUCTION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {sa.cms.title}
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            {language === 'id'
              ? 'Kelola banner pengumuman dan penempatan slot kursus unggulan di beranda publik CodePath Academy.'
              : 'Configure global alert banners and premier course slot positioning on the public landing page.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchCmsData}
            disabled={loading}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>{language === 'id' ? 'Segarkan' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ─── LEFT: GLOBAL ANNOUNCEMENT BANNER CONTROL (7 cols) ─── */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#2563EB]" />
                <span>{sa.cms.bannerLabel}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure promotional hero alerts shown at the very top of all student landing pages.
              </p>
            </div>
            {/* Live Toggle */}
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold ${
                  isBannerLive ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {isBannerLive ? sa.cms.liveOnSite : language === 'id' ? 'NONAKTIF' : 'OFFLINE'}
              </span>
              <button
                onClick={() => setIsBannerLive(!isBannerLive)}
                className="cursor-pointer text-slate-600 hover:text-[#2563EB] transition"
              >
                {isBannerLive ? (
                  <ToggleRight className="w-8 h-8 text-emerald-500" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-300" />
                )}
              </button>
            </div>
          </div>

          {/* Banner Copy Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              {sa.cms.bannerLabel}
            </label>
            <textarea
              rows={3}
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              placeholder="e.g. 🔥 Flash Enrollment: Get 25% off all Fullstack Cohorts with code CODEPATH25"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition resize-none font-medium text-slate-800"
            />
          </div>

          {/* Live Preview Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Pratinjau Langsung' : 'Live Preview'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {isBannerLive ? '• Broadcast: Active' : '• Broadcast: Hidden'}
              </span>
            </div>

            <div
              className={`rounded-xl p-3.5 text-xs font-semibold flex items-center justify-between border transition-all ${
                isBannerLive
                  ? 'bg-blue-50 text-[#2563EB] border-blue-200 shadow-2xs'
                  : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-500" />
                <span className="truncate">{bannerText || 'No active announcement'}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/70 text-[#2563EB] font-bold border border-blue-200/60 ml-2 whitespace-nowrap">
                CODEPATH25
              </span>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
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

        {/* ─── RIGHT: FEATURED COURSES MERCHANDISING (5 cols) ─── */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-[#0F172A] text-base flex items-center gap-2">
              <Layout className="w-4 h-4 text-[#2563EB]" />
              <span>{sa.cms.featuredTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select which published courses occupy premier card slots on the student landing page catalog.
            </p>
          </div>

          {/* Slots 1 - 3 */}
          <div className="space-y-4">
            {featuredSlots.map((item, index) => {
              const selectedCourse = courses.find((c) => c.id === item.courseId);

              return (
                <div
                  key={item.slot}
                  className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-lg bg-[#0F172A] text-white flex items-center justify-center text-[10px] font-bold">
                        {item.slot}
                      </span>
                      <span>{sa.cms.slotLabel} {item.slot}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {index === 0 ? 'FLAGSHIP' : index === 1 ? 'TRENDING' : 'NEW COHORT'}
                    </span>
                  </div>

                  <select
                    value={item.courseId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setFeaturedSlots((prev) =>
                        prev.map((s) => (s.slot === item.slot ? { ...s, courseId: newId } : s))
                      );
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] cursor-pointer"
                  >
                    <option value="">{language === 'id' ? '-- Pilih Kursus --' : '-- Select a Course --'}</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.mentorName})
                      </option>
                    ))}
                  </select>

                  {selectedCourse && (
                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Mentor: <strong className="text-slate-700">{selectedCourse.mentorName}</strong></span>
                      <span className="font-mono text-[10px] text-slate-400">/{selectedCourse.slug}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Save Merchandising */}
          <div className="pt-2 flex justify-end">
            <button
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

