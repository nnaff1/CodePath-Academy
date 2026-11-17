'use client';

import React from 'react';
import { GitPullRequest, Users, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { TechCore3D } from '@/components/3d/TechCore3D';
import { useLanguage } from '@/context/LanguageContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
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

export function ValueProposition() {
  const { t } = useLanguage();

  const cardIcons = [GitPullRequest, Users, Award, ShieldCheck];

  return (
    <section id="standard" className="w-full bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Deep Navy Container with radial glow & subtle scroll entrance */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-3xl bg-[#0F172A] border border-slate-800 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl"
        >
          {/* Subtle Radial Blue Glow in background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Glowing Cyan/Blue 3D Geometric Tech Core Centerpiece in Background */}
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-80 h-80 sm:w-[420px] sm:h-[420px] pointer-events-auto opacity-35 sm:opacity-45 -z-0">
            <TechCore3D colorScheme="banner" interactive={true} />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column (Brand Standard Statement) */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-5 text-left"
            >
              <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase mb-3 block">
                {t.valueProp.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                {t.valueProp.headline}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                {t.valueProp.subheadline}
              </p>
            </motion.div>

            {/* Right Column (2x2 Grid of Feature Cards with staggered reveal & hover) */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {t.valueProp.cards.map((card, i) => {
                const Icon = cardIcons[i] || GitPullRequest;
                return (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    whileHover={{ y: -4, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800/70 transition-colors duration-200 cursor-default"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800/60 flex items-center justify-center mb-3.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight mb-1.5">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

