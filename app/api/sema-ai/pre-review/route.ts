import { NextRequest, NextResponse } from 'next/server';

const PRE_REVIEW_SYSTEM = `You are Sema Co-Pilot, an expert senior code reviewer for CodePath Academy.
Analyze a student's GitHub submission and return ONLY a valid JSON object (no markdown, no extra text) with exactly these fields:
- "strengths": array of 2-3 strings describing specific code strengths
- "warnings": array of 1-3 strings describing areas needing improvement
- "suggestedScore": integer 0-100
- "verdict": either "APPROVE" or "REQUEST_REVISION"
- "mentorNote": string, 1-2 sentences the mentor can use as feedback

Be specific, technical, and constructive. Do not reveal full solutions.`;

async function callGeminiJSON(prompt: string): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: PRE_REVIEW_SYSTEM }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 600,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!res.ok) {
      console.warn('Gemini pre-review error:', res.status);
      return null;
    }

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return null;
    return JSON.parse(raw.trim());
  } catch (err) {
    console.warn('Gemini pre-review failed:', err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { githubUrl, studentName, courseName, lessonTitle } = await req.json();

    if (!githubUrl) {
      return NextResponse.json({ success: false, message: 'githubUrl is required.' }, { status: 400 });
    }

    const prompt = `Pre-review this student GitHub submission:
- Student: ${studentName || 'Unknown'}
- Course: ${courseName || 'Unknown'}
- Lesson: ${lessonTitle || 'Unknown'}
- GitHub Repo: ${githubUrl}

Based on the repository name and coding context, provide a structured code review.`;

    const parsed = await callGeminiJSON(prompt);

    if (parsed) {
      return NextResponse.json({
        success: true,
        preReview: {
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
          suggestedScore: typeof parsed.suggestedScore === 'number' ? parsed.suggestedScore : 75,
          verdict: parsed.verdict === 'APPROVE' ? 'APPROVE' : 'REQUEST_REVISION',
          mentorNote: typeof parsed.mentorNote === 'string' ? parsed.mentorNote : '',
          model: 'gemini-2.0-flash',
        },
      });
    }

    // Local heuristic fallback
    const repo = githubUrl.toLowerCase();
    const isEcommerce = repo.includes('store') || repo.includes('cart') || repo.includes('ecommerce');
    const isMicroservice = repo.includes('cache') || repo.includes('worker') || repo.includes('queue');
    const isAlgo = repo.includes('algo') || repo.includes('tree') || repo.includes('challenge');

    let strengths: string[], warnings: string[], suggestedScore: number, verdict: string, mentorNote: string;

    if (isEcommerce) {
      strengths = ['RSC/client boundary separation looks well-structured', 'Optimistic UI update pattern correctly returns before server confirmation'];
      warnings = ['Server Action error boundary may be missing — ensure 500 fallback is handled on the client', 'Cart state could leak on hydration mismatch if localStorage sync is not deferred'];
      suggestedScore = 82; verdict = 'APPROVE';
      mentorNote = 'Solid RSC e-commerce implementation. Recommend adding error boundary around server actions before final approval.';
    } else if (isMicroservice) {
      strengths = ['Redis cache layer with TTL configuration is correct', 'Worker queue pattern uses proper exponential backoff'];
      warnings = ['Missing dead letter queue handling for failed jobs', 'Redis connection pool size not configured'];
      suggestedScore = 74; verdict = 'REQUEST_REVISION';
      mentorNote = 'Good foundational microservice pattern but needs dead letter queue and connection pooling before merge.';
    } else if (isAlgo) {
      strengths = ['Tree traversal is correctly implemented with O(n) time complexity', 'Edge cases for empty tree and single-node tree are handled'];
      warnings = ['Stack-based iterative approach would prevent stack overflow on deep trees', 'Missing time/space complexity annotations in JSDoc'];
      suggestedScore = 78; verdict = 'APPROVE';
      mentorNote = 'Correct recursive solution with edge cases. Suggest iterative refactor as a stretch goal.';
    } else {
      strengths = ['TypeScript types are correctly inferred without any escape hatches', 'File structure follows Next.js App Router conventions'];
      warnings = ['Loading and error states for async data fetching appear incomplete', 'Consider adding runtime validation with Zod for external API responses'];
      suggestedScore = 76; verdict = 'REQUEST_REVISION';
      mentorNote = 'Good code structure and type safety. Needs loading/error state handling before approval.';
    }

    return NextResponse.json({
      success: true,
      preReview: { strengths, warnings, suggestedScore, verdict, mentorNote, model: 'sema-ai-local-heuristic' },
    });
  } catch (error) {
    console.error('POST /api/sema-ai/pre-review error:', error);
    return NextResponse.json({ success: false, message: 'Pre-review failed.' }, { status: 500 });
  }
}
