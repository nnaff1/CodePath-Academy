import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Certificate code is required.' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // Query Certificate case-insensitively from SQLite
    // Note: SQLite string comparison with equals or findFirst can be matched with UPPER/like or finding all candidate matches
    const certificate = await prisma.certificate.findFirst({
      where: {
        certificateCode: cleanCode,
      },
      include: {
        enrollment: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                level: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          message: `Certificate with code "${cleanCode}" was not found in the verified database.`,
        },
        { status: 404 }
      );
    }

    // Format skills based on course level and title
    const skillsMap: Record<string, string[]> = {
      'fullstack-nextjs-typescript': [
        'React 19 Server Components',
        'Next.js 16 App Router',
        'TypeScript Generics',
        'Prisma ORM & SQLite',
        'Tailwind CSS v4',
      ],
      'backend-microservices-architecture': [
        'Event-Driven Microservices',
        'Node.js & Express',
        'Redis Distributed Cache',
        'Kafka Event Sourcing',
        'PostgreSQL Optimization',
      ],
      'frontend-ui-engineering-motion': [
        'Framer Motion Physics',
        'Three.js / React Three Fiber',
        'Layout Transitions',
        'Responsive Design',
      ],
      'applied-ai-engineering': [
        'Groq API Orchestration',
        'Llama 3.3 & Qwen Coder',
        'Sema AI Socratic Prompting',
        'Vector Embeddings & RAG',
      ],
    };

    const courseSlug = certificate.enrollment.course.slug;
    const skills = skillsMap[courseSlug] || [
      'Fullstack Web Architecture',
      'Production Code Quality',
      'System Design',
    ];

    return NextResponse.json(
      {
        success: true,
        certificate: {
          id: certificate.id,
          certificateCode: certificate.certificateCode,
          grade: certificate.grade,
          score: certificate.score,
          issuedAt: certificate.issuedAt.toISOString(),
          status: 'VERIFIED_ACTIVE',
          student: {
            name: certificate.enrollment.user.name,
            email: certificate.enrollment.user.email,
          },
          course: {
            title: certificate.enrollment.course.title,
            slug: certificate.enrollment.course.slug,
            level: certificate.enrollment.course.level,
            description: certificate.enrollment.course.description,
          },
          skills,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error verifying certificate.' },
      { status: 500 }
    );
  }
}

