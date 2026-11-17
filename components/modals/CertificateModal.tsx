'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Copy, Share2, Search, Check, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CertificateRecord } from '@/types';
import { findCertificate } from '@/data/certificates';
import { useLanguage } from '@/context/LanguageContext';

interface CertificateModalProps {
  isOpen: boolean;
  initialCertId?: string;
  onClose: () => void;
  onCopyNotice?: () => void;
}

export function CertificateModal({
  isOpen,
  initialCertId = 'CP-2026-889',
  onClose,
  onCopyNotice,
}: CertificateModalProps) {
  const { t } = useLanguage();
  const [certIdInput, setCertIdInput] = useState(initialCertId);
  const [currentCert, setCurrentCert] = useState<CertificateRecord>(() =>
    findCertificate(initialCertId)
  );
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchCertificateFromApi = async (code: string) => {
    if (!code.trim()) return;
    setIsLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`/api/certificates/${encodeURIComponent(code.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.certificate) {
          const c = data.certificate;
          setCurrentCert({
            id: c.certificateCode,
            studentName: c.student.name,
            courseName: c.course.title,
            completionDate: new Date(c.issuedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            skillsAcquired: c.skills,
            grade: c.grade,
            score: c.score,
            verificationHash: `SHA256-${c.certificateCode}-VERIFIED-DB`,
            mentorName: 'Sarah Wijaya',
            mentorRole: 'Staff Engineer & Course Lead',
            status: 'Verified',
          });
          return;
        }
      }
      // Fallback check against static registry or mark not found
      const staticMatch = findCertificate(code);
      if (staticMatch && staticMatch.id.toUpperCase() === code.trim().toUpperCase()) {
        setCurrentCert(staticMatch);
      } else {
        setNotFound(true);
      }
    } catch {
      setCurrentCert(findCertificate(code));
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (initialCertId && isOpen) {
      setCertIdInput(initialCertId);
      fetchCertificateFromApi(initialCertId);
    }
  }, [initialCertId, isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certIdInput.trim()) {
      fetchCertificateFromApi(certIdInput);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(
      `https://codepath.academy/verify/${currentCert.id}`
    );
    setCopied(true);
    if (onCopyNotice) onCopyNotice();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cert-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm"
        >
          <motion.div
            key="cert-modal-dialog"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[94vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top header */}
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {t.certModal.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t.certModal.badge}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick query search bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3">
          <form onSubmit={handleSearch} className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={certIdInput}
                onChange={(e) => setCertIdInput(e.target.value)}
                placeholder={t.certModal.searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono text-slate-800"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              {t.certModal.verifyBtn}
            </button>
          </form>
        </div>

        {/* Certificate Display Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {notFound ? (
            <div className="text-center py-12 space-y-3 bg-slate-50 rounded-2xl border border-slate-200 p-8 my-auto">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <X className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Certificate Record Not Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No matching verified credential was found in the database for{' '}
                <span className="font-mono font-bold text-slate-800">{certIdInput}</span>. Please check the credential code or try <span className="font-mono text-blue-600 font-semibold cursor-pointer" onClick={() => fetchCertificateFromApi('CP-2026-889')}>CP-2026-889</span>.
              </p>
            </div>
          ) : (
            <div className="relative bg-gradient-to-b from-white to-slate-50/70 rounded-2xl border-2 border-slate-200 p-6 sm:p-10 pt-8 sm:pt-10 shadow-xs">
            {/* Corner Status Stamp */}
            <div className="sm:absolute sm:top-5 sm:right-5 mb-4 sm:mb-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>OFFICIAL RECORD VERIFIED</span>
            </div>

            {/* Certificate Header */}
            <div className="text-center pb-6 border-b border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-lg mx-auto mb-3 shadow-md">
                &lt;/&gt;
              </div>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                CodePath Academy • Official Credential
              </h2>
              <p className="text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                Certificate of Engineering Competence
              </p>
            </div>

            {/* Student & Course Details with generous top & bottom breathing room */}
            <div className="pt-8 pb-6 text-center space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t.certModal.conferredTo}
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentCert.studentName}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto pt-1 leading-relaxed">
                for demonstrating production-grade engineering mastery, delivering peer-reviewed pull requests, and successfully completing
              </p>
              <div className="inline-block px-4 py-2 bg-blue-50 text-blue-800 font-bold rounded-xl text-sm border border-blue-200/80 mt-2">
                {currentCert.courseName}
              </div>
            </div>

            {/* Credential Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 my-2 border-y border-slate-200 text-center">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                  {t.certModal.grade}
                </span>
                <span className="text-sm font-bold text-slate-900">{currentCert.grade}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                  Score
                </span>
                <span className="text-sm font-bold text-emerald-600">{currentCert.score}%</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                  {t.certModal.issueDate}
                </span>
                <span className="text-sm font-semibold text-slate-900">{currentCert.completionDate}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                  {t.certModal.credentialId}
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">{currentCert.id}</span>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="pt-3">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                {t.certModal.skillsTitle}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentCert.skillsAcquired.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Database Proof & Signature */}
            <div className="mt-6 p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-left">
              <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono">
                <span>Verification Record:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                  {t.certModal.badge}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-700 truncate mt-1 select-all">
                Registry ID: {currentCert.verificationHash || currentCert.id}
              </p>
            </div>
          </div>
          )}
        </div>

        {/* Public Focused Action Bar */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Copy Verification URL */}
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">{t.certModal.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.certModal.copyUrl}</span>
                </>
              )}
            </button>

            {/* Add to LinkedIn Profile */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=https://codepath.academy/verify/${currentCert.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.certModal.addToLinkedIn}</span>
            </a>
          </div>

          {/* Clean "Verified Active" Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">{t.certModal.verifiedActive}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
}
