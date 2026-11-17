import { NextRequest, NextResponse } from 'next/server';

const SEMA_DRAFT_SYSTEM_PROMPT = `You are Sema AI, the official AI lesson architect for CodePath Academy.
Your task is to auto-draft a production-quality lesson outline based on a topic and course context.
Return a valid JSON object with:
- lessonTitle: string — a specific, compelling lesson title
- videoDescription: string — 1-sentence description for the video lecture
- assignmentPrompt: string — a clear coding assignment with requirements (3-5 bullet points)
- socraticHint: string — a subtle Socratic coaching hint (1-2 sentences without revealing the solution)
- starterCode: string — a TypeScript/JavaScript starter code scaffold with TODO comments

Keep the tone technical, practical, and production-focused.`;

export async function POST(req: NextRequest) {
  try {
    const { topic, courseSlug, courseTitle } = await req.json();

    if (!topic) {
      return NextResponse.json({ success: false, message: 'topic is required.' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    const userPrompt = `Draft a lesson for this topic:
- Topic: ${topic}
- Course: ${courseTitle || courseSlug || 'CodePath Academy'}
Return a JSON object with lessonTitle, videoDescription, assignmentPrompt, socraticHint, and starterCode.`;

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
              { role: 'system', content: SEMA_DRAFT_SYSTEM_PROMPT },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.65,
            max_tokens: 700,
            response_format: { type: 'json_object' },
          }),
        });

        if (groqResponse.ok) {
          const data = await groqResponse.json();
          const raw = data.choices?.[0]?.message?.content;
          if (raw) {
            const parsed = JSON.parse(raw);
            return NextResponse.json({ success: true, draft: parsed, model: 'llama-3.3-70b-versatile' });
          }
        }
      } catch (err) {
        console.warn('Groq API failed in draft-lesson, using local fallback:', err);
      }
    }

    // Local fallback draft
    const topicClean = topic.trim();
    return NextResponse.json({
      success: true,
      model: 'sema-ai-local-draft',
      draft: {
        lessonTitle: `${topicClean}: Production Patterns & Best Practices`,
        videoDescription: `A deep-dive into ${topicClean} with real-world Next.js App Router examples and type-safe patterns.`,
        assignmentPrompt: `Build a production-ready implementation of ${topicClean}:\n• Implement the core feature with full TypeScript type safety\n• Add proper loading and error boundary handling\n• Write at least 2 edge case validations\n• Document your approach with inline JSDoc comments\n• Ensure no console.error or any type escape hatches`,
        socraticHint: `Before writing any code, ask yourself: what invariants must hold true before and after this function executes? Start by defining your types and contracts.`,
        starterCode: `// ${topicClean} — Starter Scaffold\n// TODO: Implement the feature below\n\nexport async function implement${topicClean.replace(/\s+/g, '')}() {\n  // Step 1: Define your types and contracts\n  // Step 2: Implement core logic\n  // Step 3: Handle edge cases\n  throw new Error('Not implemented yet');\n}`,
      },
    });
  } catch (error) {
    console.error('POST /api/sema-ai/draft-lesson error:', error);
    return NextResponse.json({ success: false, message: 'Draft lesson generation failed.' }, { status: 500 });
  }
}
