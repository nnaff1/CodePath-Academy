'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  Layers,
  GraduationCap,
  Sparkles,
  Loader2,
  RefreshCw,
  Clock,
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSuperAdmin } from '../SuperAdminContext';

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  mentorName: string;
  mentorAvatar: string | null;
  specialization: string;
  price: number;
  level: string;
  status: 'PENDING' | 'PUBLISHED' | 'DRAFT' | 'REJECTED';
  modulesCount: number;
  lessonsCount: number;
  submittedAt: string;
}

function CourseApprovalsContent() {
  const { language, t } = useLanguage();
  const sa = t.superAdminDashboard;
  const { setPendingApprovals, showToast } = useSuperAdmin();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [courseSpecialization, setCourseSpecialization] = useState('ALL');
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [isApproving, setIsApproving] = useState<Record<string, boolean>>({});
  const [isBulkApproving, setIsBulkApproving] = useState(false);
  const [previewCourse, setPreviewCourse] = useState<CourseItem | null>(null);

  // Fetch courses from SQLite
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/super-admin/courses?status=ALL');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
        const pendingCount = data.courses.filter((c: CourseItem) => c.status === 'PENDING').length;
        setPendingApprovals(pendingCount);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      showToast('Gagal memuat antrean persetujuan kursus.');
    } finally {
      setLoading(false);
    }
  }, [setPendingApprovals, showToast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.mentorName.toLowerCase().includes(courseSearch.toLowerCase());
      const matchSpec =
        courseSpecialization === 'ALL' || c.specialization === courseSpecialization;
      return matchSearch && matchSpec;
    });
  }, [courses, courseSearch, courseSpecialization]);

  const pendingCourses = useMemo(
    () => courses.filter((c) => c.status === 'PENDING'),
    [courses]
  );

  // Approve single course
  const handleApprove = async (courseId: string) => {
    try {
      setIsApproving((prev) => ({ ...prev, [courseId]: true }));
      const res = await fetch(`/api/super-admin/courses/${courseId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE' }),
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, status: 'PUBLISHED' } : c))
        );
        setSelectedCourseIds((prev) => prev.filter((id) => id !== courseId));
        setPendingApprovals(Math.max(0, pendingCourses.length - 1));
        showToast(
          language === 'id'
            ? 'Kursus berhasil disetujui & dipublikasikan ke katalog!'
            : 'Course approved and published to catalog!'
        );
      } else {
        showToast(data.message || 'Gagal menyetujui kursus.');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan.');
    } finally {
      setIsApproving((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  // Reject single course
  const handleReject = async (courseId: string) => {
    try {
      setIsApproving((prev) => ({ ...prev, [courseId]: true }));
      const res = await fetch(`/api/super-admin/courses/${courseId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REJECT' }),
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, status: 'REJECTED' } : c))
        );
        setSelectedCourseIds((prev) => prev.filter((id) => id !== courseId));
        setPendingApprovals(Math.max(0, pendingCourses.length - 1));
        showToast(
          language === 'id'
            ? 'Kursus ditolak dan dikembalikan ke draf instruktur.'
            : 'Course rejected and returned to instructor drafts.'
        );
      }
    } catch {
      showToast('Gagal menolak kursus.');
    } finally {
      setIsApproving((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  // Bulk approve selected courses
  const handleBulkApprove = async () => {
    if (selectedCourseIds.length === 0) return;
    try {
      setIsBulkApproving(true);
      const res = await fetch('/api/super-admin/courses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseIds: selectedCourseIds, action: 'BULK_APPROVE' }),
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) =>
          prev.map((c) =>
            selectedCourseIds.includes(c.id) ? { ...c, status: 'PUBLISHED' } : c
          )
        );
        setPendingApprovals(Math.max(0, pendingCourses.length - selectedCourseIds.length));
        showToast(
          language === 'id'
            ? `${selectedCourseIds.length} kursus berhasil dipublikasikan!`
            : `Successfully approved ${selectedCourseIds.length} courses!`
        );
        setSelectedCourseIds([]);
      }
    } catch {
      showToast('Gagal memproses bulk approval.');
    } finally {
      setIsBulkApproving(false);
    }
  };

  const handleSelectAllPending = () => {
    const pendingIds = filteredCourses
      .filter((c) => c.status === 'PENDING')
      .map((c) => c.id);
    if (selectedCourseIds.length === pendingIds.length) {
      setSelectedCourseIds([]);
    } else {
      setSelectedCourseIds(pendingIds);
    }
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] w-full">
      {/* ─── PAGE HEADER ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 text-xs font-mono font-semibold">
            <Zap className="w-3 h-3 text-[#2563EB]" />
            <span>• CURRICULUM GOVERNANCE • SLA: 4 HOURS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {sa.approvals.title}
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            {language === 'id'
              ? 'Tinjau silabus modul, penetapan harga kursus, dan publikasikan kelas baru ke platform CodePath.'
              : 'Review submitted module curricula, course tuition structures, and approve classes for publication.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchCourses}
            disabled={loading}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>{language === 'id' ? 'Segarkan' : 'Refresh'}</span>
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-xs font-bold text-[#2563EB]">
            <BookOpen className="w-4 h-4" />
            <span>{pendingCourses.length} {sa.approvals.awaitingBadge}</span>
          </div>
        </div>
      </div>

      {/* ─── COURSE APPROVAL QUEUE TABLE CARD ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters & Search Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder={sa.approvals.filterPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition"
              />
            </div>

            {/* Specialization Filter Dropdown */}
            <div className="relative">
              <select
                value={courseSpecialization}
                onChange={(e) => setCourseSpecialization(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] cursor-pointer"
              >
                <option value="ALL">{sa.approvals.allSpecializations}</option>
                <option value="FULLSTACK">Fullstack</option>
                <option value="FRONTEND">Frontend</option>
                <option value="BACKEND">Backend</option>
                <option value="AI">AI & Agents</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Bulk Approve Action */}
          {selectedCourseIds.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">
                {selectedCourseIds.length} {language === 'id' ? 'dipilih' : 'selected'}
              </span>
              <button
                onClick={handleBulkApprove}
                disabled={isBulkApproving}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isBulkApproving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{sa.approvals.bulkApprove} ({selectedCourseIds.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredCourses.filter((c) => c.status === 'PENDING').length > 0 &&
                      selectedCourseIds.length ===
                        filteredCourses.filter((c) => c.status === 'PENDING').length
                    }
                    onChange={handleSelectAllPending}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">{sa.approvals.colCourse}</th>
                <th className="py-3 px-4">{sa.approvals.colMentor}</th>
                <th className="py-3 px-4">{sa.approvals.colDifficulty}</th>
                <th className="py-3 px-4">{sa.approvals.colPrice}</th>
                <th className="py-3 px-4">{sa.approvals.colSubmitted}</th>
                <th className="py-3 px-4 text-right">{sa.approvals.colGovernance}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2563EB]" />
                    <p>{language === 'id' ? 'Memuat antrean persetujuan...' : 'Loading approval queue...'}</p>
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">{sa.approvals.noPending}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {language === 'id'
                        ? 'Semua pengajuan kursus telah selesai ditinjau.'
                        : 'All submitted courses have been reviewed and published.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((c) => {
                  const isSelected = selectedCourseIds.includes(c.id);
                  const isProcessing = isApproving[c.id];

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        {c.status === 'PENDING' ? (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedCourseIds((prev) =>
                                prev.includes(c.id)
                                  ? prev.filter((id) => id !== c.id)
                                  : [...prev, c.id]
                              );
                            }}
                            className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                          />
                        ) : (
                          <span className="w-4 h-4 block" />
                        )}
                      </td>

                      {/* Course Title & Code */}
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0F172A] text-xs hover:text-[#2563EB] transition cursor-pointer">
                            {c.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                            /{c.slug} • {c.level}
                          </span>
                        </div>
                      </td>

                      {/* Mentor & Specialization */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                            {c.mentorName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-xs">{c.mentorName}</p>
                            <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-1.5 py-0.2 rounded">
                              {c.specialization}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Curriculum Stats */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-600 font-mono text-xs">
                          {c.modulesCount} mod • {c.lessonsCount} lessons
                        </span>
                      </td>

                      {/* Tuition Price */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {formatPrice(c.price)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            c.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : c.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              c.status === 'PENDING'
                                ? 'bg-amber-500 animate-pulse'
                                : c.status === 'PUBLISHED'
                                ? 'bg-emerald-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          {c.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {c.status === 'PENDING' ? (
                            <>
                              <button
                                onClick={() => handleApprove(c.id)}
                                disabled={isProcessing}
                                title={sa.approvals.approveBtn}
                                className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#2563EB] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                              >
                                {isProcessing ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                )}
                                <span>{sa.approvals.approveBtn}</span>
                              </button>
                              <button
                                onClick={() => handleReject(c.id)}
                                disabled={isProcessing}
                                title={language === 'id' ? 'Tolak Kursus' : 'Reject Course'}
                                className="p-1.5 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-slate-500 transition cursor-pointer disabled:opacity-50"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setPreviewCourse(c)}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>{language === 'id' ? 'Detail' : 'Inspect'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL: CURRICULUM INSPECTION ─── */}
      <AnimatePresence>
        {previewCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 relative"
            >
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {previewCourse.specialization} • {previewCourse.level}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0F172A] mt-2">
                    {previewCourse.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Instructor: {previewCourse.mentorName}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewCourse(null)}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs text-slate-600">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Modules Count:</span>
                  <span className="font-bold text-[#0F172A]">{previewCourse.modulesCount} Chapters</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Total Lessons:</span>
                  <span className="font-bold text-[#0F172A]">{previewCourse.lessonsCount} Video & Interactive</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Standard Tuition:</span>
                  <span className="font-bold text-emerald-600">{formatPrice(previewCourse.price)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Current Status:</span>
                  <span className="font-bold text-[#2563EB]">{previewCourse.status}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  onClick={() => setPreviewCourse(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CourseApprovalsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading course approvals queue...</div>}>
      <CourseApprovalsContent />
    </Suspense>
  );
}

