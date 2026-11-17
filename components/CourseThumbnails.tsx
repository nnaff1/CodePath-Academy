'use client';

import React from 'react';

interface ThumbnailProps {
  type: 'fullstack' | 'microservices' | 'ai' | 'algorithms' | 'devops' | 'distributed';
}

export function CourseThumbnail({ type }: ThumbnailProps) {
  if (type === 'fullstack') {
    return (
      <div className="relative w-full h-44 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 p-3 overflow-hidden flex flex-col justify-between border border-slate-200 shadow-2xs">
        {/* Browser header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="w-2 h-2 rounded-full bg-slate-300" />
          </div>
          <span className="text-[10px] font-mono text-slate-400">codepath.academy/fullstack</span>
          <span className="text-[10px] text-blue-600 font-mono font-medium">React 19</span>
        </div>
        
        {/* Inner content matching screenshot */}
        <div className="grid grid-cols-12 gap-3 my-auto items-center px-1">
          <div className="col-span-7 space-y-1.5">
            <span className="text-[10px] font-mono text-blue-600 font-bold block">
              Master Modern
            </span>
            <p className="text-[11px] font-extrabold text-slate-800 leading-tight">
              Fullstack Web, React, TypeScript &amp; Scaled Systems
            </p>
            <div className="flex gap-1 pt-1">
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[8px] font-mono font-semibold border border-blue-200">
                Next.js SSR
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[8px] font-mono font-semibold border border-emerald-200">
                Postgres
              </span>
            </div>
          </div>

          {/* 3D Isometric / Network Graphic */}
          <div className="col-span-5 flex items-center justify-center">
            <div className="relative w-16 h-16 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
              <div className="absolute inset-1 border border-white/30 rounded-lg flex items-center justify-center">
                <span className="font-mono text-xs font-bold">&lt;/&gt;</span>
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[9px] font-mono text-slate-500">
          <span>Prisma ORM • Server Actions</span>
          <span className="text-emerald-600 font-medium">Production-Grade ✓</span>
        </div>
      </div>
    );
  }

  if (type === 'microservices') {
    return (
      <div className="relative w-full h-44 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 p-3 overflow-hidden flex flex-col justify-between border border-slate-200 shadow-2xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-mono text-slate-600 font-bold">Cloud Microservices</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">50k req/s • gRPC</span>
        </div>

        {/* Architecture flow diagram on light background */}
        <div className="flex items-center justify-between gap-1.5 my-auto px-1">
          <div className="p-2 rounded-lg bg-white border border-slate-200/90 text-center flex-1 shadow-2xs">
            <span className="text-[9px] font-mono text-blue-600 font-bold block">Gateway</span>
            <span className="text-[8px] text-slate-500 font-medium">Kong / Traefik</span>
          </div>
          <span className="text-slate-400 font-mono text-xs">→</span>
          <div className="p-2 rounded-lg bg-white border border-slate-200/90 text-center flex-1 shadow-2xs">
            <span className="text-[9px] font-mono text-indigo-600 font-bold block">Kafka</span>
            <span className="text-[8px] text-slate-500 font-medium">Event Stream</span>
          </div>
          <span className="text-slate-400 font-mono text-xs">→</span>
          <div className="p-2 rounded-lg bg-white border border-slate-200/90 text-center flex-1 shadow-2xs">
            <span className="text-[9px] font-mono text-emerald-600 font-bold block">Postgres</span>
            <span className="text-[8px] text-slate-500 font-medium">Read Replicas</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[9px] font-mono text-slate-500">
          <span>Go 1.23 • Redis Cache</span>
          <span className="text-blue-600 font-medium">Zero-Downtime HA</span>
        </div>
      </div>
    );
  }

  if (type === 'ai') {
    return (
      <div className="relative w-full h-44 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 p-3 overflow-hidden flex flex-col justify-between border border-slate-200 shadow-2xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <span className="text-[10px] font-mono text-purple-700 font-bold">Autonomous AI Agents</span>
          <span className="text-[10px] text-slate-500 font-mono">RAG + Embeddings</span>
        </div>

        {/* AI Graphic with dark center console like screenshot */}
        <div className="my-auto">
          <div className="bg-[#0F172A] rounded-lg p-2.5 text-white shadow-xs border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-purple-300 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LLM Tool Invocation
              </span>
              <span className="text-[8px] font-mono text-slate-400 bg-slate-800 px-1 py-0.5 rounded">
                Pinecone 0.96
              </span>
            </div>
            <div className="h-1 bg-slate-800 rounded overflow-hidden">
              <div className="w-3/4 h-full bg-gradient-to-r from-purple-500 to-blue-500" />
            </div>
            <p className="text-[9px] font-mono text-emerald-300 truncate">
              &gt; Streaming tokens via Vercel AI SDK...
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[9px] font-mono text-slate-500">
          <span>LangChain • Llama 3 • Python</span>
          <span className="text-purple-700 font-medium">Tool Calling Protocol</span>
        </div>
      </div>
    );
  }

  if (type === 'algorithms') {
    return (
      <div className="relative w-full h-44 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 p-3 overflow-hidden flex flex-col justify-between border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <span className="text-[10px] font-mono text-blue-700 font-bold">DSA Visual Engine</span>
          <span className="text-[10px] text-slate-500 font-mono">O(log n) Binary Search</span>
        </div>

        <div className="my-auto flex items-center justify-center gap-1.5">
          {[2, 5, 8, 12, 16, 23, 38, 56].map((num, i) => (
            <div
              key={i}
              className={`w-7 h-9 rounded-md flex flex-col items-center justify-center font-mono text-xs border ${
                i === 5
                  ? 'bg-blue-600 text-white font-bold border-blue-500 shadow-sm ring-2 ring-blue-200'
                  : 'bg-white text-slate-700 border-slate-200 shadow-2xs'
              }`}
            >
              <span>{num}</span>
              <span className="text-[7px] text-slate-400">{i === 5 ? 'MID' : `[${i}]`}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[9px] font-mono text-slate-500">
          <span>Two Pointers • Dynamic Prog</span>
          <span className="text-blue-600 font-medium">FAANG Interview Prep</span>
        </div>
      </div>
    );
  }

  if (type === 'devops') {
    return (
      <div className="relative w-full h-44 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 p-3 overflow-hidden flex flex-col justify-between border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <span className="text-[10px] font-mono text-teal-700 font-bold">AWS &amp; Kubernetes EKS</span>
          <span className="text-[10px] text-emerald-600 font-mono font-medium">Cluster: Healthy</span>
        </div>

        <div className="grid grid-cols-3 gap-2 my-auto">
          <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
            <span className="text-[9px] font-mono text-teal-700 font-bold block">Ingress ALB</span>
            <span className="text-[8px] text-slate-500 font-mono">SSL Cert ✓</span>
          </div>
          <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-center shadow-2xs">
            <span className="text-[9px] font-mono text-teal-800 font-bold block">Pod x3</span>
            <span className="text-[8px] text-teal-600 font-mono">Zero Downtime</span>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
            <span className="text-[9px] font-mono text-slate-700 font-bold block">Terraform</span>
            <span className="text-[8px] text-slate-500 font-mono">Applied ✓</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[9px] font-mono text-slate-500">
          <span>GitHub Actions CI/CD</span>
          <span className="text-teal-700 font-medium">Blue-Green Rollout</span>
        </div>
      </div>
    );
  }

  // distributed / rust
  return (
    <div className="relative w-full h-44 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 p-3 overflow-hidden flex flex-col justify-between border border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
        <span className="text-[10px] font-mono text-amber-700 font-bold">Distributed Systems</span>
        <span className="text-[10px] text-amber-600 font-mono font-medium">Tokio Async Rust</span>
      </div>

      <div className="my-auto p-2 bg-white border border-slate-200 rounded-lg font-mono text-[10px] text-slate-700 shadow-2xs space-y-1">
        <div className="flex justify-between">
          <span className="text-amber-700 font-semibold">Raft Consensus:</span>
          <span className="text-emerald-600 font-bold">Leader Term 4</span>
        </div>
        <div className="flex justify-between">
          <span>Latency p99:</span>
          <span className="text-blue-600 font-bold">0.84 ms</span>
        </div>
        <div className="flex justify-between">
          <span>Memory Footprint:</span>
          <span className="text-purple-600 font-medium">14.2 MB (Zero GC)</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[9px] font-mono text-slate-500">
        <span>gRPC Protocol Buffers</span>
        <span className="text-amber-700 font-medium">Strict Memory Safety</span>
      </div>
    </div>
  );
}
