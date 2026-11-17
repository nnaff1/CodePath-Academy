'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, QrCode, CreditCard, Building2, Smartphone, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Course } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface EnrollModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (course: Course) => void;
}

export function EnrollModal({ course, isOpen, onClose, onSuccess }: EnrollModalProps) {
  const { t, language } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'ewallet' | 'cc'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleCheckout = () => {
    if (!course) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmed(true);
      onSuccess(course);
    }, 1200);
  };

  const handleReset = () => {
    setIsConfirmed(false);
    onClose();
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('Rp', 'Rp ');
  };

  return (
    <AnimatePresence>
      {isOpen && course && (
        <motion.div
          key="enroll-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleReset}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
        >
          <motion.div
            key="enroll-modal-dialog"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
              {course.level} {t.enrollModal.trackSuffix}
            </span>
            <span className="text-xs text-slate-500 font-medium">{t.enrollModal.cohortAdmissions}</span>
          </div>
          <button
            onClick={handleReset}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isConfirmed ? (
            <>
              {/* Course Brief */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>Lead Mentor: <strong className="text-slate-700">{course.mentor.name}</strong></span>
                  <span>•</span>
                  <span>{course.lessonsCount} Modules</span>
                  <span>•</span>
                  <span>{course.hoursCount} Hours</span>
                </p>
              </div>

              {/* What you get */}
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  {t.enrollModal.syllabusIncludes}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {t.enrollModal.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                  {t.enrollModal.paymentMethod}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                      paymentMethod === 'qris'
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">QRIS / Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ewallet')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                      paymentMethod === 'ewallet'
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs">GoPay / OVO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('va')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                      paymentMethod === 'va'
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-slate-700" />
                    <span className="text-xs">BCA / Mandiri</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cc')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                      paymentMethod === 'cc'
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-slate-700" />
                    <span className="text-xs">Credit Card</span>
                  </button>
                </div>

                {/* QR preview if QRIS is selected */}
                {paymentMethod === 'qris' && (
                  <div className="mt-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
                    <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                      <div className="grid grid-cols-4 gap-0.5 w-full h-full p-1 bg-slate-900 rounded">
                        <div className="bg-white rounded-xs" />
                        <div className="bg-slate-900" />
                        <div className="bg-white rounded-xs" />
                        <div className="bg-white rounded-xs" />
                        <div className="bg-slate-900" />
                        <div className="bg-white rounded-xs" />
                        <div className="bg-slate-900" />
                        <div className="bg-white rounded-xs" />
                        <div className="bg-white rounded-xs" />
                        <div className="bg-white rounded-xs" />
                        <div className="bg-slate-900" />
                        <div className="bg-white rounded-xs" />
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <p className="font-semibold text-slate-800">Scan via GoPay, OVO, Dana, BCA Mobile</p>
                      <p className="text-slate-500 mt-0.5">Instant automated payment verification via QRIS National Standard.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-slate-200 pt-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Regular Tuition Price</span>
                  <span className="line-through text-slate-400">{formatIDR(course.originalPrice)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Early Cohort Scholarship (-50%)</span>
                  <span>-{formatIDR(course.originalPrice - course.discountedPrice)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Investment</span>
                  <span className="text-blue-600">{formatIDR(course.discountedPrice)}</span>
                </div>
              </div>
            </>
          ) : (
            /* Success confirmation screen */
            <div className="py-8 text-center animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Enrollment Confirmed
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-3">
                Welcome to CodePath Academy!
              </h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto mt-2 leading-relaxed">
                You are officially enrolled in{' '}
                <strong className="text-slate-900">{course.title}</strong>. Your workspace credentials and Discord invite have been dispatched.
              </p>

              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left max-w-sm mx-auto text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student ID:</span>
                  <span className="font-mono font-semibold text-slate-800">CP-2026-{Math.floor(100 + Math.random() * 900)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Mentor:</span>
                  <span className="font-medium text-slate-800">{course.mentor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">First Live Workshop:</span>
                  <span className="font-medium text-slate-800">Saturday, 10:00 AM WIB</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          {!isConfirmed ? (
            <>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit Bank Level Encryption</span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t.enrollModal.processingBtn}</span>
                  </>
                ) : (
                  <>
                    <span>{t.enrollModal.enrollBtn} ({formatIDR(course.discountedPrice)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.enrollModal.dashboardBtn}</span>
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
}

