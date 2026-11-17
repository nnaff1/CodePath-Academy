import { CertificateRecord } from '@/types';

export const MOCK_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'CP-2026-889',
    studentName: 'Alex Pratama Putra',
    courseName: 'Modern Fullstack Web Development (React & Node.js)',
    completionDate: 'February 24, 2026',
    grade: 'High Distinction',
    score: 98.4,
    verificationHash: '0x8f4b9c1d2e3a5f7089bcaef1289c09d845e1b2c3',
    mentorName: 'Rian Pratama',
    mentorRole: 'Staff Engineer @ Tech Unicorn',
    skillsAcquired: [
      'Next.js 16 App Router',
      'React 19 Server Components',
      'TypeScript v5 Strict Mode',
      'PostgreSQL Schema Design',
      'CI/CD GitHub Actions',
      'Production Docker Deployments',
    ],
    status: 'Verified',
  },
  {
    id: 'CP-2026-102',
    studentName: 'Nadia Salsabila',
    courseName: 'Backend Microservices & Cloud Architecture',
    completionDate: 'January 18, 2026',
    grade: 'Distinction',
    score: 96.2,
    verificationHash: '0x3a7e9f1c4b2d5a8091efbcda3498a1c720f4e5a9',
    mentorName: 'Sarah Wijaya',
    mentorRole: 'Lead Backend Architect @ Traveloka',
    skillsAcquired: [
      'Go Microservices',
      'Distributed Caching with Redis',
      'Kafka Event Streaming',
      'Docker & Kubernetes Pods',
    ],
    status: 'Verified',
  },
  {
    id: 'CP-2026-554',
    studentName: 'Dimas Aditya',
    courseName: 'Fullstack AI Engineering & LLM Apps',
    completionDate: 'March 05, 2026',
    grade: 'High Distinction',
    score: 99.1,
    verificationHash: '0x5c8e2a1b9f7d4e3082acdeba4512c9e781b3f6d0',
    mentorName: 'David Kusuma',
    mentorRole: 'AI Researcher & Founder',
    skillsAcquired: [
      'Retrieval-Augmented Generation (RAG)',
      'Vector Search with Pinecone',
      'LangChain Agent Architecture',
      'Streaming LLM Interfaces',
    ],
    status: 'Verified',
  },
];

export function findCertificate(id: string): CertificateRecord {
  const normalizedId = id.trim().toUpperCase();
  const found = MOCK_CERTIFICATES.find(
    (c) => c.id.toUpperCase() === normalizedId
  );
  if (found) return found;

  // Generate dynamic authentic record for any entered ID if not pre-seeded
  return {
    id: normalizedId || 'CP-2026-889',
    studentName: 'Budi Santoso',
    courseName: 'Modern Fullstack Web Development (React & Node.js)',
    completionDate: 'March 14, 2026',
    grade: 'High Distinction',
    score: 97.8,
    verificationHash: `0x${Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`,
    mentorName: 'Rian Pratama',
    mentorRole: 'Staff Engineer @ Tech Unicorn',
    skillsAcquired: [
      'TypeScript Architecture',
      'Fullstack Web APIs',
      'Database Optimization',
      'Production Deployment',
    ],
    status: 'Verified',
  };
}

