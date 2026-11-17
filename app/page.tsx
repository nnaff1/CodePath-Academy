'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CurriculumFlow } from '@/components/CurriculumFlow';
import { CourseCatalog } from '@/components/CourseCatalog';
import { ValueProposition } from '@/components/ValueProposition';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/modals/AuthModal';
import { EnrollModal } from '@/components/modals/EnrollModal';
import { FreeLessonModal } from '@/components/modals/FreeLessonModal';
import { CertificateModal } from '@/components/modals/CertificateModal';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import { Course, DemoRole } from '@/types';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<DemoRole>('visitor');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [freeLessonModalOpen, setFreeLessonModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [activeCertId, setActiveCertId] = useState('CP-2026-889');

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'error' = 'success'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSelectRole = (role: DemoRole) => {
    setCurrentRole(role);
    if (role === 'student') {
      addToast(
        'Student Mode Activated',
        'Signed in as Alex Pratama (Fullstack Track Cohort #4)',
        'info'
      );
    } else if (role === 'mentor') {
      addToast(
        'Mentor Admin Mode',
        'Signed in as Sarah Wijaya (Staff Mentor • 3 PR reviews waiting)',
        'info'
      );
    } else if (role === 'superadmin') {
      addToast(
        'Super Admin View',
        'Platform telemetry active: 1,420 learners online across 12 countries',
        'info'
      );
    } else {
      addToast('Visitor View', 'Returned to public landing page mode', 'info');
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleEnroll = (course: Course) => {
    setSelectedCourse(course);
    setEnrollModalOpen(true);
  };

  const handleEnrollSuccess = (course: Course) => {
    addToast(
      'Enrollment Confirmed!',
      `You have successfully registered for ${course.title}. Welcome to the cohort!`,
      'success'
    );
  };

  const handleVerifyCredential = (certId: string) => {
    setActiveCertId(certId || 'CP-2026-889');
    setCertificateModalOpen(true);
  };

  const handleSubscribe = (email: string) => {
    addToast(
      'Subscription Confirmed!',
      `We sent a confirmation email to ${email}. You will receive our weekly engineering teardowns.`,
      'success'
    );
  };

  const handleCopyNotice = () => {
    addToast(
      'Copied to Clipboard!',
      'Verification details saved to your clipboard.',
      'info'
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Sticky Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        onOpenAuth={handleOpenAuth}
        onOpenVerifyModal={() => handleVerifyCredential('CP-2026-889')}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenFreeLesson={() => setFreeLessonModalOpen(true)}
          onCopyNotice={handleCopyNotice}
        />

        {/* Curriculum Flow Section */}
        <CurriculumFlow />

        {/* Industry-Vetted Courses Catalog */}
        <CourseCatalog onEnroll={handleEnroll} />

        {/* Value Proposition Dark Banner */}
        <ValueProposition />
      </main>

      {/* Footer */}
      <Footer
        onVerify={handleVerifyCredential}
        onSubscribeNotice={handleSubscribe}
      />

      {/* Interactive Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSelectRole={handleSelectRole}
      />

      <EnrollModal
        course={selectedCourse}
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        onSuccess={handleEnrollSuccess}
      />

      <FreeLessonModal
        isOpen={freeLessonModalOpen}
        onClose={() => setFreeLessonModalOpen(false)}
      />

      <CertificateModal
        isOpen={certificateModalOpen}
        initialCertId={activeCertId}
        onClose={() => setCertificateModalOpen(false)}
        onCopyNotice={handleCopyNotice}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
