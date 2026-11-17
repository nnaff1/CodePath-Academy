import { NextRequest, NextResponse } from 'next/server';

const DRAFT_SYSTEM = `You are Sema AI, the official AI lesson architect for CodePath Academy.
Return ONLY a valid JSON object (no markdown, no extra text) with exactly these fields:
- "lessonTitle": string — a specific, compelling lesson title
- "videoDescription": string — 1-sentence description for the video lecture
- "assignmentPrompt": string — a clear coding assignment with 3-5 bullet point requirements (use \\n• for bullets)
- "socraticHint": string — a subtle Socratic coaching hint (1-2 sentences, no solution)
- "starterCode": string — TypeScript/JavaScript starter scaffold with TODO comments

Keep the tone technical, practical, and production-focused. Use \\n for newlines in strings.`;

export async function POST(req: NextRequest) {
  try {
    const { topic, courseSlug, courseTitle } = await req.json();

    if (!topic) {
      return NextResponse.json({ success: false, message: 'topic is required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const userPrompt = `Draft a production-quality lesson for CodePath Academy:
- Topic: ${topic}
- Course: ${courseTitle || courseSlug || 'CodePath Academy'}

Return a JSON object with lessonTitle, videoDescription, assignmentPrompt, socraticHint, and starterCode.`;

    if (apiKey) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: DRAFT_SYSTEM }] },
              contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
              generationConfig: {
                temperature: 0.65,
                maxOutputTokens: 800,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(raw.trim());
            return NextResponse.json({ success: true, draft: parsed, model: 'gemini-2.0-flash' });
          }
        } else {
          console.warn('Gemini draft-lesson error:', res.status);
        }
      } catch (err) {
        console.warn('Gemini draft-lesson failed, using local fallback:', err);
      }
    }

    // Local fallback
    const topicClean = topic.trim();
    const fnName = topicClean.replace(/[^a-zA-Z0-9]/g, '');
    return NextResponse.json({
      success: true,
      model: 'sema-ai-local-draft',
      draft: {
        lessonTitle: `${topicClean}: Production Patterns & Best Practices`,
        videoDescription: `A deep-dive into ${topicClean} with real-world Next.js App Router examples and type-safe patterns.`,
        assignmentPrompt: `Build a production-ready implementation of ${topicClean}:\n• Implement the core feature with full TypeScript type safety\n• Add proper loading and error boundary handling\n• Write at least 2 edge case validations\n• Document your approach with inline JSDoc comments\n• Ensure no console.error or any type escape hatches`,
        socraticHint: `Before writing any code, ask yourself: what invariants must hold true before and after this function executes? Start by defining your types and contracts.`,
        starterCode: `// ${topicClean} — Starter Scaffold\n// TODO: Implement the feature below\n\nexport async function implement${fnName}() {\n  // Step 1: Define your types and contracts\n  // Step 2: Implement core logic\n  // Step 3: Handle edge cases\n  throw new Error('Not implemented yet');\n}`,
      },
    });
  } catch (error) {
    console.error('POST /api/sema-ai/draft-lesson error:', error);
    return NextResponse.json({ success: false, message: 'Draft lesson generation failed.' }, { status: 500 });
  }
}
