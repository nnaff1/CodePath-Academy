import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CodePath Academy database seeding...');

  // Hash common password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Clean existing records in reverse dependency order
  await prisma.certificate.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 2. Create Users
  const superAdmin = await prisma.user.create({
    data: {
      name: 'CodePath Platform Owner',
      email: 'owner@codepath.id',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      xpPoints: 5000,
    },
  });

  const mentor1 = await prisma.user.create({
    data: {
      name: 'Alex Vance',
      email: 'mentor@codepath.id',
      password: hashedPassword,
      role: 'ADMIN',
      xpPoints: 3400,
    },
  });

  const mentor2 = await prisma.user.create({
    data: {
      name: 'Sarah Wijaya',
      email: 'sarah.mentor@codepath.id',
      password: hashedPassword,
      role: 'ADMIN',
      xpPoints: 4200,
    },
  });

  const student = await prisma.user.create({
    data: {
      name: 'Affando Fathinatha',
      email: 'student@codepath.id',
      password: hashedPassword,
      role: 'USER',
      xpPoints: 1450,
      bio: 'Fullstack Next.js developer aspiring to build production AI orchestration systems.',
      githubUsername: 'nnaff1',
    },
  });

  console.log('👥 Users seeded successfully:');
  console.log(` - Super Admin: ${superAdmin.email} (password123)`);
  console.log(` - Mentor 1: ${mentor1.email} (password123)`);
  console.log(` - Mentor 2: ${mentor2.email} (password123)`);
  console.log(` - Student: ${student.email} (password123)`);

  // 3. Create Courses with Chapters and Lessons
  // Course 1: Fullstack Next.js & TypeScript
  const course1 = await prisma.course.create({
    data: {
      mentorId: mentor2.id,
      title: 'Fullstack Next.js & TypeScript',
      slug: 'fullstack-nextjs-typescript',
      description:
        'Master modern full-stack web development with Next.js App Router, TypeScript generics, Tailwind CSS, and Prisma ORM on SQLite/PostgreSQL.',
      level: 'BEGINNER',
      price: 299000,
      status: 'PUBLISHED',
      chapters: {
        create: [
          {
            title: 'TypeScript & Server Components Fundamentals',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Type-Safe API Contracts with Generics',
                  order: 1,
                  content:
                    'Learn how to build end-to-end type-safe contracts without using the any type. Validate API payloads at compile time with TypeScript Generics and Zod.',
                  starterCode:
                    'export interface ApiResponse<T> {\n  data: T;\n  status: "success" | "error";\n}\n\nexport function parseResponse<T>(json: string): ApiResponse<T> {\n  // TODO: Implement generic parser\n  return JSON.parse(json);\n}',
                  solutionHint:
                    'Use generic type parameter <T> and assert the parsed JSON matches ApiResponse<T> or pass a runtime validator like Zod schema.',
                },
                {
                  title: 'React 19 Server Components & Actions',
                  order: 2,
                  content:
                    'Understand how Server Components minimize client bundle size and how Server Actions mutate database records directly.',
                  starterCode:
                    "'use server';\n\nexport async function updateProfile(formData: FormData) {\n  const name = formData.get('name') as string;\n  // TODO: Mutate user record\n}",
                  solutionHint:
                    'Call prisma.user.update within the Server Action and invoke revalidatePath to refresh UI cache.',
                },
              ],
            },
          },
          {
            title: 'SERVER ACTIONS & DATABASE MUTATIONS',
            order: 2,
            lessons: {
              create: [
                {
                  title: 'Prisma Schema & Relational Modeling',
                  order: 1,
                  content:
                    'Design self-contained SQLite schemas with 1-to-many and 1-to-1 relations, cascading deletes, and unique compound indexes.',
                  starterCode:
                    '// prisma/schema.prisma\nmodel Course {\n  id String @id @default(cuid())\n  title String\n}',
                  solutionHint:
                    'Define foreign key fields such as courseId String and link with @relation(fields: [courseId], references: [id]).',
                },
                {
                  title: 'Optimistic UI Updates with useActionState',
                  order: 2,
                  content:
                    'Master optimistic UI rollbacks using React 19 useActionState and useOptimistic with Next.js 15 Server Actions.',
                  starterCode:
                    "import { useActionState, useOptimistic } from 'react';\nimport { updateCartQuantity } from '@/app/actions';\n\n// Action state hook managing server pending transitions\nexport function CartManager({ initialCount }: { initialCount: number }) {\n  const [state, formAction, isPending] =\n    useActionState(updateCartQuantity, { count: initialCount });\n  const [optimisticCount, setOptimisticCount] = useOptimistic(\n    state.count,\n    (current, newTotal: number) => newTotal\n  );\n\n  return (\n    <div className=\"flex items-center gap-4\">\n      <span>Items in Cart: {optimisticCount}</span>\n      {isPending && <span className=\"animate-spin\">⏳</span>}\n    </div>\n  );\n}",
                  solutionHint:
                    'Notice the execution order between your optimistic state mutation and the resolved action payload. If initialCount is undefined on mount, hydration defaults to 0 before DB.',
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 2: Backend Microservices Architecture
  const course2 = await prisma.course.create({
    data: {
      mentorId: mentor1.id,
      title: 'Backend Microservices Architecture',
      slug: 'backend-microservices-architecture',
      description:
        'Design robust event-driven microservices with Node.js, Express, PostgreSQL, Redis distributed caching, and Kafka message brokers.',
      level: 'INTERMEDIATE',
      price: 349000,
      status: 'PUBLISHED',
      chapters: {
        create: [
          {
            title: 'Distributed Systems & Event Brokers',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'API Gateway & Service Discovery',
                  order: 1,
                  content:
                    'Build an edge reverse proxy with rate limiting, JWT verification, and service discovery for decentralized microservices.',
                  starterCode:
                    '// Gateway entry point\nimport express from "express";\nconst app = express();\n// TODO: Implement rate limiting and proxying',
                  solutionHint:
                    'Use express-rate-limit and http-proxy-middleware to route requests to respective microservice ports.',
                },
                {
                  title: 'Kafka Event Sourcing & CQRS',
                  order: 2,
                  content:
                    'Separate command and query responsibilities using Apache Kafka topics for event sourcing and eventual consistency.',
                  starterCode:
                    'import { Kafka } from "kafkajs";\n// TODO: Produce and consume order-placed events',
                  solutionHint:
                    'Initialize producer with idempotence enabled to ensure zero message duplication across partitions.',
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 3: Frontend UI Engineering & Motion
  const course3 = await prisma.course.create({
    data: {
      mentorId: mentor2.id,
      title: 'Frontend UI Engineering & Motion',
      slug: 'frontend-ui-engineering-motion',
      description:
        'Craft fluid 60fps micro-interactions with Framer Motion, reactive 3D WebGL scenes with Three.js, and accessible design systems.',
      level: 'BEGINNER',
      price: 249000,
      status: 'PUBLISHED',
      chapters: {
        create: [
          {
            title: 'Framer Motion Spring Physics & Layout Animations',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Spring Physics & Shared Layout Transitions',
                  order: 1,
                  content:
                    'Learn how layoutId and spring physics create frictionless pill toggles and expanding card modals.',
                  starterCode:
                    'import { motion } from "framer-motion";\nexport function PillSwitcher() {\n  // TODO: Animate active pill with layoutId\n}',
                  solutionHint:
                    'Attach layoutId="activeTab" to the active background element and pass spring transition stiffness 500 and damping 35.',
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 4: Applied AI Engineering
  const course4 = await prisma.course.create({
    data: {
      mentorId: superAdmin.id,
      title: 'Applied AI Engineering',
      slug: 'applied-ai-engineering',
      description:
        'Orchestrate LLMs with Groq API (Llama 3.3 / Qwen 2.5 Coder), vector retrieval (RAG), and build autonomous agentic coding mentors like Sema AI.',
      level: 'ADVANCED',
      price: 399000,
      status: 'PUBLISHED',
      chapters: {
        create: [
          {
            title: 'Sema AI Socratic Architecture & LLM Orchestration',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Structured Outputs & Function Calling with Sema AI',
                  order: 1,
                  content:
                    'Build high-performance AI coding mentors with Groq API, using system prompts designed for Socratic debugging guidance.',
                  starterCode:
                    'import Groq from "groq-sdk";\n// TODO: Initialize Groq client with Sema AI Socratic System Prompt',
                  solutionHint:
                    'Send messages with role "system" containing strict guidelines to ask leading questions without spoiling answers.',
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 5: Algorithmic Systems & Data Structures
  const course5 = await prisma.course.create({
    data: {
      mentorId: mentor1.id,
      title: 'Algorithmic Systems',
      slug: 'algorithmic-systems',
      description:
        'Advanced graph algorithms, distributed consensus, algorithmic optimization, and competitive interview patterns in Go and TypeScript.',
      level: 'ADVANCED',
      price: 329000,
      status: 'PUBLISHED',
      chapters: {
        create: [
          {
            title: 'Graph Traversal & Dynamic Programming',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Topological Sort & Dependency Resolution',
                  order: 1,
                  content: 'Implement cycle detection and DAG topological sorting for build dependency resolution.',
                  starterCode: 'export function topologicalSort(graph: Map<string, string[]>): string[] {\n  return [];\n}',
                  solutionHint: 'Use Kahn algorithm with indegree tracking.',
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('📚 5 Courses seeded with chapters and lessons:');
  console.log(` - ${course1.title} (${course1.slug})`);
  console.log(` - ${course2.title} (${course2.slug})`);
  console.log(` - ${course3.title} (${course3.slug})`);
  console.log(` - ${course4.title} (${course4.slug})`);
  console.log(` - ${course5.title} (${course5.slug})`);

  // 4. Create Completed Enrollments and Certificates
  // Enrollment 1 for student -> Course 1 (In Progress 78%)
  const enrollment1 = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      paymentStatus: 'PAID',
      progressPercent: 78,
      completedAt: null,
    },
  });

  // Enrollment 2 for student -> Course 2 (Completed 100%)
  const enrollment2 = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course2.id,
      paymentStatus: 'PAID',
      progressPercent: 100,
      completedAt: new Date('2026-03-10T14:30:00Z'),
    },
  });

  // Certificate 2: CP-2026-104 (Backend Microservices)
  const cert2 = await prisma.certificate.create({
    data: {
      enrollmentId: enrollment2.id,
      certificateCode: 'CP-2026-104',
      grade: 'Excellence',
      score: 95.2,
      issuedAt: new Date('2026-03-10T14:30:00Z'),
    },
  });

  // Enrollment 3 for student -> Course 3 (In Progress 70%)
  const enrollment3 = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course3.id,
      paymentStatus: 'PAID',
      progressPercent: 70,
      completedAt: null,
    },
  });

  // Enrollment 4 for student -> Course 4 (In Progress 68%)
  const enrollment4 = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course4.id,
      paymentStatus: 'PAID',
      progressPercent: 68,
      completedAt: null,
    },
  });

  // Enrollment 5 for student -> Course 5 (Completed 100%)
  const enrollment5 = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course5.id,
      paymentStatus: 'PAID',
      progressPercent: 100,
      completedAt: new Date('2026-02-15T10:00:00Z'),
    },
  });

  // Certificate 1: CP-2026-889 (Algorithmic Systems)
  const cert1 = await prisma.certificate.create({
    data: {
      enrollmentId: enrollment5.id,
      certificateCode: 'CP-2026-889',
      grade: 'Distinction',
      score: 98.4,
      issuedAt: new Date('2026-02-15T10:00:00Z'),
    },
  });

  console.log('🎓 Certificates seeded:');
  console.log(` - Certificate: ${cert1.certificateCode} (${cert1.grade}, ${cert1.score}%) -> Student: ${student.name}`);
  console.log(` - Certificate: ${cert2.certificateCode} (${cert2.grade}, ${cert2.score}%) -> Student: ${student.name}`);

  // ─────────────────────────────────────────────────────────────
  // 5. Additional Demo Students + Submissions (for Mentor Dashboard)
  // ─────────────────────────────────────────────────────────────

  const demoStudents = [
    { name: 'Alex Vance',     email: 'alex@codepath.org',       xpPoints: 870 },
    { name: 'Maya Lin',       email: 'maya.lin@dev.io',          xpPoints: 1140 },
    { name: 'David Kusuma',   email: 'dkusuma@alumni.org',       xpPoints: 620 },
    { name: 'Elena Rostova',  email: 'elena.r@techhub.com',      xpPoints: 950 },
    { name: 'Jordan Chen',    email: 'jordan.c@codepath.org',    xpPoints: 780 },
  ];

  const createdDemoStudents = await Promise.all(
    demoStudents.map((s) =>
      prisma.user.create({
        data: { ...s, password: hashedPassword, role: 'USER' },
      })
    )
  );

  // Enroll demo students into various courses
  await prisma.enrollment.createMany({
    data: [
      { userId: createdDemoStudents[0].id, courseId: course1.id, paymentStatus: 'PAID', progressPercent: 72 },
      { userId: createdDemoStudents[1].id, courseId: course2.id, paymentStatus: 'PAID', progressPercent: 55 },
      { userId: createdDemoStudents[2].id, courseId: course2.id, paymentStatus: 'PAID', progressPercent: 38 },
      { userId: createdDemoStudents[3].id, courseId: course1.id, paymentStatus: 'PAID', progressPercent: 60 },
      { userId: createdDemoStudents[4].id, courseId: course1.id, paymentStatus: 'PAID', progressPercent: 25 },
    ],
  });

  // Fetch lesson IDs for submissions — course1 ch1 lesson1, course1 ch1 lesson2, course2 ch1 lesson1
  const lessonsC1 = await prisma.lesson.findMany({
    where: { chapter: { courseId: course1.id } },
    orderBy: { order: 'asc' },
    take: 4,
  });
  const lessonsC2 = await prisma.lesson.findMany({
    where: { chapter: { courseId: course2.id } },
    orderBy: { order: 'asc' },
    take: 4,
  });

  // Create PENDING submissions (awaiting mentor review)
  if (lessonsC1.length > 0 && lessonsC2.length > 0) {
    await prisma.submission.createMany({
      data: [
        {
          userId: createdDemoStudents[0].id,
          lessonId: lessonsC1[0].id,
          githubUrl: 'https://github.com/alexvance/next15-store',
          status: 'PENDING',
        },
        {
          userId: createdDemoStudents[1].id,
          lessonId: lessonsC2[0].id,
          githubUrl: 'https://github.com/mayalin/cache-worker',
          status: 'PENDING',
        },
        {
          userId: createdDemoStudents[2].id,
          lessonId: lessonsC2.length > 1 ? lessonsC2[1].id : lessonsC2[0].id,
          githubUrl: 'https://github.com/dkusuma/algo-challenges-go',
          status: 'PENDING',
        },
        {
          userId: createdDemoStudents[3].id,
          lessonId: lessonsC1.length > 1 ? lessonsC1[1].id : lessonsC1[0].id,
          githubUrl: 'https://github.com/erostova/rsc-flight-demo',
          status: 'PENDING',
        },
        {
          userId: createdDemoStudents[4].id,
          lessonId: lessonsC1[0].id,
          githubUrl: 'https://github.com/jordanc/next-auth-starter',
          status: 'PENDING',
        },
      ],
    });
  }

  console.log('👥 5 demo students + submissions seeded for Mentor Dashboard.');
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

