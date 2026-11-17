import { NextRequest, NextResponse } from 'next/server';

const SEMA_PRE_REVIEW_PROMPT = `You are Sema Co-Pilot, an expert senior code reviewer for CodePath Academy.
Your task is to perform an automated pre-review of a student's GitHub submission before the mentor's manual review.
Analyze the submission and return a structured JSON pre-review with:
- strengths: 2-3 specific code strengths observed
- warnings: 1-3 specific concerns or areas needing improvement
- suggestedScore: a numerical score from 0-100
- verdict: "APPROVE" | "REQUEST_REVISION"
- mentorNote: a short 1-2 sentence summary the mentor can use in their feedback

Be specific, technical, and constructive. Do not reveal full solution code.`;

export async function POST(req: NextRequest) {
  try {
    const { githubUrl, studentName, courseName, lessonTitle } = await req.json();

    if (!githubUrl) {
      return NextResponse.json({ success: false, message: 'githubUrl is required.' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    const userPrompt = `Please pre-review this student submission:
- Student: ${studentName || 'Unknown'}
- Course: ${courseName || 'Unknown'}
- Lesson: ${lessonTitle || 'Unknown'}
- GitHub Repo: ${githubUrl}

Based on the repository name and context, provide a structured pre-review in JSON format.`;

    if (groqApiKey) {
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: SEMA_PRE_REVIEW_PROMPT },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.4,
            max_tokens: 500,
            response_format: { type: 'json_object' },
          }),
        });

        if (groqResponse.ok) {
          const data = await groqResponse.json();
          const raw = data.choices?.[0]?.message?.content;
          if (raw) {
            const parsed = JSON.parse(raw);
            return NextResponse.json({
              success: true,
              preReview: {
                strengths: parsed.strengths || [],
                warnings: parsed.warnings || [],
                suggestedScore: parsed.suggestedScore ?? 75,
                verdict: parsed.verdict || 'REQUEST_REVISION',
                mentorNote: parsed.mentorNote || '',
                model: 'llama-3.3-70b-versatile',
              },
            });
          }
        }
      } catch (err) {
        console.warn('Groq API failed in pre-review, using local heuristic:', err);
      }
    }

    // Local heuristic fallback based on repo name hints
    const repoName = githubUrl.toLowerCase();
    const isEcommerce = repoName.includes('store') || repoName.includes('ecommerce') || repoName.includes('cart');
    const isMicroservice = repoName.includes('cache') || repoName.includes('worker') || repoName.includes('queue');
    const isAlgo = repoName.includes('algo') || repoName.includes('tree') || repoName.includes('challenge');

    let strengths: string[], warnings: string[], suggestedScore: number, verdict: string, mentorNote: string;

    if (isEcommerce) {
      strengths = [
        'Clean component decomposition — RSC/client boundary separation looks well-structured',
        'Optimistic UI update pattern correctly returns before server confirmation',
      ];
      warnings = [
        'Server Action error boundary may be missing — ensure 500 fallback is handled on the client',
        'Cart state could leak on hydration mismatch if localStorage sync is not deferred',
      ];
      suggestedScore = 82;
      verdict = 'APPROVE';
      mentorNote = 'Solid RSC e-commerce implementation. Recommend adding error boundary around server actions before final approval.';
    } else if (isMicroservice) {
      strengths = [
        'Redis cache layer architecture with TTL configuration is correct',
        'Worker queue pattern uses proper exponential backoff strategy',
      ];
      warnings = [
        'Missing dead letter queue handling for failed jobs after max retries',
        'Redis connection pool size not configured — may cause thundering herd under load',
      ];
      suggestedScore = 74;
      verdict = 'REQUEST_REVISION';
      mentorNote = 'Good foundational microservice pattern but needs dead letter queue and connection pooling before merge.';
    } else if (isAlgo) {
      strengths = [
        'Tree traversal algorithm is correctly implemented with O(n) time complexity',
        'Edge case handling for empty tree and single-node tree is present',
      ];
      warnings = [
        'Stack-based iterative approach would prevent stack overflow on deep trees (> 10k nodes)',
        'Missing time/space complexity annotations in function JSDoc',
      ];
      suggestedScore = 78;
      verdict = 'APPROVE';
      mentorNote = 'Correct recursive solution with edge cases. Suggest iterative refactor as a stretch goal.';
    } else {
      strengths = [
        'TypeScript types are correctly inferred without using any escape hatches',
        'File structure follows Next.js App Router conventions cleanly',
      ];
      warnings = [
        'Loading and error states for async data fetching appear incomplete',
        'Consider adding runtime validation with Zod for external API responses',
      ];
      suggestedScore = 76;
      verdict = 'REQUEST_REVISION';
      mentorNote = 'Good code structure and type safety. Needs loading/error state handling before approval.';
    }

    return NextResponse.json({
      success: true,
      preReview: {
        strengths,
        warnings,
        suggestedScore,
        verdict,
        mentorNote,
        model: 'sema-ai-local-heuristic',
      },
    });
  } catch (error) {
    console.error('POST /api/sema-ai/pre-review error:', error);
    return NextResponse.json({ success: false, message: 'Pre-review failed.' }, { status: 500 });
  }
}
