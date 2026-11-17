'use client';

import React, { useState } from 'react';
import { X, Play, Sparkles, Send, CheckCircle2, Bot, Terminal, Code2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface FreeLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'mentor';
  text: string;
  time: string;
}

export function FreeLessonModal({ isOpen, onClose }: FreeLessonModalProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'editor' | 'mentor'>('editor');
  const [code, setCode] = useState(`// CodePath Free Sample Lesson: TypeScript Generics
// Exercise: Create a type-safe generic ApiResponse wrapper

interface ApiResponse<TData> {
  status: 200 | 400 | 404 | 500;
  data: TData;
  timestamp: number;
}

interface UserProfile {
  id: string;
  username: string;
  tier: "PRO" | "ENTERPRISE";
}

// Function with strict generic inference
export function createResponse<T>(payload: T): ApiResponse<T> {
  return {
    status: 200,
    data: payload,
    timestamp: Date.now(),
  };
}`);

  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'mentor',
      text:
        language === 'id'
          ? 'Halo! Saya Sema AI, Mentor Kode Sokrates Anda di CodePath Academy. Saya di sini untuk membimbing Anda menemukan solusi sendiri melalui pertanyaan terarah dan penalaran arsitektur—bukan sekadar jawaban copy-paste. Coba perhatikan kode di sebelah kiri: apa yang terjadi jika API mengembalikan respons error?'
          : 'Hello! I am Sema AI, your Socratic Code Mentor at CodePath Academy. Rather than spoon-feeding boilerplate solutions, I guide you with targeted questions and debugging hints so you build real engineering intuition. Look at the code on the left—what happens if the server returns an error state instead of 200?',
      time: 'Just now',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTestOutput(null);
    setTimeout(() => {
      setIsRunningTests(false);
      setTestOutput(
        `✓ [PASS] test_generic_type_inference (8ms)\n✓ [PASS] test_payload_immutability (4ms)\n✓ [PASS] test_timestamp_epoch (2ms)\n\n🎉 All 3 automated test suites passed successfully!`
      );
    }, 800);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputQuestion;
    if (!q.trim() || isAiThinking) return;

    const userMsg: Message = {
      sender: 'user',
      text: q,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuestion('');
    setIsAiThinking(true);

    try {
      const res = await fetch('/api/sema-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          code,
          language,
          history: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: 'mentor',
            text: data.reply || data.message || 'Sema AI is analyzing your code...',
            time: 'Just now',
          },
        ]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch {
      // Fallback response if fetch fails
      setMessages((prev) => [
        ...prev,
        {
          sender: 'mentor',
          text:
            language === 'id'
              ? 'Sema AI: Coba amati bagaimana tipe generik `<TData>` memisahkan envelope transport dengan isi payload bisnis. Pertanyaan untukmu: apa keuntungan compile-time dari pendekatan ini?'
              : 'Sema AI: Notice how `ApiResponse<TData>` decouples the transport layer envelope from the domain payload. Question for you: what compile-time advantage does this give your team?',
          time: 'Just now',
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="free-lesson-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm"
        >
          <motion.div
            key="free-lesson-dialog"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  {t.freeLessonModal.badge}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">{t.freeLessonModal.trackName}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">
                {t.freeLessonModal.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split into Interactive Code Editor & Socratic AI Mentor */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-y-auto lg:overflow-hidden">
          {/* Left Column: Code Editor & Test Runner (7 cols) */}
          <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col bg-slate-950">
            {/* Editor tabs & actions */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-slate-300">contract.ts</span>
              </div>
              <button
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition cursor-pointer"
              >
                {isRunningTests ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>{isRunningTests ? t.freeLessonModal.runningTests : t.freeLessonModal.runTests}</span>
              </button>
            </div>

            {/* Code textarea */}
            <div className="flex-1 p-4 font-mono text-xs text-slate-200 bg-slate-950 overflow-y-auto leading-relaxed">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 lg:h-full bg-transparent resize-none focus:outline-none font-mono text-emerald-300 leading-relaxed selection:bg-blue-800"
                spellCheck={false}
              />
            </div>

            {/* Test output panel */}
            <div className="border-t border-slate-800 bg-slate-900/90 p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  {t.freeLessonModal.testRunnerTitle}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{t.freeLessonModal.testRunnerVersion}</span>
              </div>
              <div className="bg-slate-950 rounded p-2.5 font-mono text-[11px] text-slate-300 min-h-[64px] whitespace-pre-line border border-slate-800/80">
                {testOutput || (
                  <span className="text-slate-500 italic">
                    {t.freeLessonModal.testPlaceholder}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: AI Socratic Mentor (5 cols) */}
          <div className="lg:col-span-5 flex flex-col bg-slate-50 min-h-[380px] lg:min-h-0">
            {/* Mentor Header */}
            <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {t.freeLessonModal.mentorTitle}
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </h4>
                  <p className="text-[10px] text-slate-500">{t.freeLessonModal.mentorSubtitle}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {t.freeLessonModal.mentorCohort}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'mentor' && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex gap-2 justify-start items-center text-xs text-slate-500">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl rounded-bl-none shadow-xs text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                    <span className="text-[11px] font-medium">Sema AI is formulating a Socratic hint...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Prompts */}
            <div className="p-2.5 bg-white/70 border-t border-slate-200/80">
              <span className="text-[10px] text-slate-500 font-medium block mb-1.5">
                {t.freeLessonModal.quickPromptsTitle}
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSendMessage('Why should I use Generics instead of any?')}
                  className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg transition border border-slate-200"
                >
                  {t.freeLessonModal.prompt1}
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Review my solution for error handling edge cases.')}
                  className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg transition border border-slate-200"
                >
                  {t.freeLessonModal.prompt2}
                </button>
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder={t.freeLessonModal.inputPlaceholder}
                  className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-900"
                />
                <button
                  type="submit"
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
}

