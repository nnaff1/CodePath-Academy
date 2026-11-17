'use client';

import React from 'react';
import { Code2, Layout, Database, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

export function CurriculumFlow() {
  const { t } = useLanguage();

  const stepIcons = [Code2, Layout, Database, Rocket];

  return (
    <section id="roadmap" className="w-full bg-[#F8FAFC] py-20 sm:py-28 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold tracking-wider uppercase mb-4">
            {t.curriculum.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            {t.curriculum.headline}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3.5 leading-relaxed">
            {t.curriculum.subheadline}
          </p>
        </motion.div>

        {/* 4-Column Grid of Cards with whileInView Staggered Reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {t.curriculum.steps.map((step, idx) => {
            const Icon = stepIcons[idx] || Code2;
            return (
              <motion.div
                key={step.num}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-lg hover:border-blue-400 transition-all duration-200 flex flex-col justify-between group cursor-default"
              >
                <div>
                  {/* Card Header: Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black text-slate-300 group-hover:text-blue-600 transition-colors font-mono">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center border border-blue-100/80 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 min-h-[64px]">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Tags */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                  {step.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50/50 group-hover:text-blue-700 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
