'use client';

import React, { useState } from 'react';
import { BookOpen, Clock, Award, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Course, CourseLevel } from '@/types';
import { COURSES } from '@/data/courses';
import { CourseThumbnail } from './CourseThumbnails';
import { useLanguage } from '@/context/LanguageContext';

interface CourseCatalogProps {
  onEnroll: (course: Course) => void;
}

export function CourseCatalog({ onEnroll }: CourseCatalogProps) {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<CourseLevel>('All Levels');

  const filterTabs: CourseLevel[] = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  const getFilterTabLabel = (tab: CourseLevel) => {
    switch (tab) {
      case 'All Levels':
        return t.catalog.filterAll;
      case 'Beginner':
        return t.catalog.filterBeginner;
      case 'Intermediate':
        return t.catalog.filterIntermediate;
      case 'Advanced':
        return t.catalog.filterAdvanced;
      default:
        return tab;
    }
  };

  const getLevelBadgeLabel = (level: string) => {
    if (language === 'id') {
      if (level === 'Beginner') return 'Pemula';
      if (level === 'Intermediate') return 'Menengah';
      if (level === 'Advanced') return 'Mahir';
    }
    return level;
  };

  const filteredCourses = COURSES.filter((course) => {
    if (activeFilter === 'All Levels') return true;
    return course.level === activeFilter;
  });

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('Rp', 'Rp ');
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <section id="courses" className="w-full bg-white py-20 sm:py-28 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header row with Title and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold tracking-wider uppercase mb-3">
              {t.catalog.eyebrow}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              {t.catalog.headline}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
              {t.catalog.subheadline}
            </p>
          </div>

          {/* Filter Pills with layoutId animated sliding pill */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 self-start md:self-auto overflow-x-auto max-w-full">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className="relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap"
              >
                {activeFilter === tab && (
                  <motion.div
                    layoutId="activeFilterTab"
                    className="absolute inset-0 bg-[#0F172A] rounded-lg shadow-xs"
                    transition={{ type: 'spring', stiffness: 480, damping: 32 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    activeFilter === tab ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {getFilterTabLabel(tab)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Grid of Courses with AnimatePresence & layout transition */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => (
              <motion.div
                layout
                key={course.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                whileHover={{ y: -4, borderColor: '#2563EB', transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-shadow flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top: Graphic Thumbnail */}
                <div className="p-3 bg-slate-50 border-b border-slate-100 relative">
                  <CourseThumbnail type={course.thumbnailType} />
                  <span
                    className={`absolute top-5 left-5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs backdrop-blur-md ${getLevelBadge(
                      course.level
                    )}`}
                  >
                    {getLevelBadgeLabel(course.level)}
                  </span>
                </div>

                {/* Card Body: Title, Mentor, Stats */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors mb-2">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        <strong className="text-slate-800">{course.mentor.name}</strong> ({course.mentor.role})
                      </span>
                    </div>

                    {/* 3-Column Stats Bar */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-slate-50/80 rounded-xl border border-slate-100 text-slate-600 text-[11px] font-medium mb-6">
                      <div className="flex items-center gap-1.5 justify-center">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.lessonsCount} {t.catalog.lessonsLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-center border-x border-slate-200">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.hoursCount} {t.catalog.hoursLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-center">
                        <Award className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t.catalog.certificateLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price and Enroll Button Row with hover arrow slide */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 line-through block">
                        {formatIDR(course.originalPrice)}
                      </span>
                      <span className="text-base sm:text-lg font-extrabold text-[#0F172A]">
                        {formatIDR(course.discountedPrice)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onEnroll(course)}
                      className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition shadow-xs hover:shadow cursor-pointer flex items-center gap-1.5 group/btn whitespace-nowrap"
                    >
                      <span>{t.catalog.enrollNow}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Courses Link */}
        <div className="mt-14 text-center">
          <button
            onClick={() => setActiveFilter('All Levels')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition group cursor-pointer"
          >
            <span>{t.catalog.viewAllCourses}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
          </button>
        </div>

      </div>
    </section>
  );
}
