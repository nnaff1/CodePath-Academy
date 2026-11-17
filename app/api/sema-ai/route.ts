import { NextRequest, NextResponse } from 'next/server';

const SEMA_AI_SYSTEM_PROMPT = `You are Sema AI, the official Socratic AI Code Mentor for CodePath Academy.
Your role is to coach aspiring software engineers to think like staff engineers and debug production code with confidence.

Guiding Socratic Principles:
1. NEVER spoon-feed complete copy-paste code blocks or reveal full solutions right away.
2. Guide students step-by-step using targeted questions, conceptual mental models, and subtle hints.
3. Praise good logic or clean patterns first before guiding the student's attention to edge cases, type safety flaws, or off-by-one errors.
4. If a student asks "just give me the solution" or "write the code for me", warmly explain that Sema AI is here to build their problem-solving muscle for tech interviews and real production systems, then offer a structured hint.
5. Tone: Sharp, friendly, encouraging, empathetic, and professional.
6. Language: If the user addresses you or asks in Indonesian (Bahasa Indonesia), reply in natural, professional Indonesian tech terminology. If in English, reply in English.
7. Always sign off with a concise Socratic thought question to keep the learner engaged.`;

async function callGemini(messages: { role: string; content: string }[], systemPrompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  // Convert chat history to Gemini contents format
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 700,
          },
        }),
      }
    );

    if (!res.ok) {
      console.warn('Gemini API error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (err) {
    console.warn('Gemini API fetch failed:', err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, code, language = 'en', history = [] } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, message: 'Prompt is required.' }, { status: 400 });
    }

    const userMessageContent = code
      ? `Student Code:\n\`\`\`typescript\n${code}\n\`\`\`\n\nStudent Question / Dilemma:\n${prompt}`
      : prompt;

    const messages = [
      ...history.slice(-6),
      { role: 'user', content: userMessageContent },
    ];

    // Try Gemini first
    const geminiReply = await callGemini(messages, SEMA_AI_SYSTEM_PROMPT);
    if (geminiReply) {
      return NextResponse.json({
        success: true,
        mentor: 'Sema AI',
        model: 'gemini-2.0-flash',
        reply: geminiReply,
      });
    }

    // High-fidelity fallback Socratic generator
    const lowerPrompt = prompt.toLowerCase();
    const isId =
      language === 'id' ||
      lowerPrompt.includes('bagaimana') ||
      lowerPrompt.includes('kenapa') ||
      lowerPrompt.includes('kode');

    let socraticReply = '';

    if (lowerPrompt.includes('generic') || lowerPrompt.includes('any')) {
      socraticReply = isId
        ? `Halo! Sema AI di sini. Pertanyaan yang sangat bagus tentang generics vs \`any\`! 💡\n\nCoba bayangkan: saat kamu menggunakan \`any\`, TypeScript pada dasarnya 'menyerah' dan mematikan pemeriksaan tipe.\n\nDengan Generic (\`<T>\`), kamu memberi tahu TypeScript: *"Aku belum tahu tipe pastinya sekarang, tapi tolong ingat dan kunci tipenya saat fungsi ini dipanggil."*\n\n**Pertanyaan refleksi untukmu:**\nJika fungsi \`parseResponse<T>\` menerima payload JSON pengguna, bagaimana Generic mencegah kesalahan \`undefined is not an object\` pada baris pemanggil?`
        : `Hey! Sema AI here. That is one of the most fundamental shifts from junior to production TypeScript! 💡\n\nThink of \`any\` as turning off the type checker entirely. With a Generic (\`<T>\`), you create a reusable contract that enforces shape throughout.\n\n**A quick Socratic question:** If you pass \`User\` into \`parseResponse<User>(rawJson)\`, what happens if someone later tries to access \`.nonExistentField\` on the returned object? How does the compiler catch that before it reaches production?`;
    } else if (lowerPrompt.includes('edge') || lowerPrompt.includes('bug') || lowerPrompt.includes('error')) {
      socraticReply = isId
        ? `Sema AI siap membantumu meninjau kode! 🔍\n\nSebelum kita masuk ke perbaikan:\n1. Apakah kamu sudah menangani skenario saat nilai kembalian adalah \`null\`, \`undefined\`, atau JSON yang tidak valid?\n2. Apa yang akan terjadi jika jaringan mengalami timeout?\n\nCoba periksa blok penanganan error — apakah kamu menggunakan \`try/catch\`? Apa langkah pertamamu untuk mengujinya?`
        : `Sema AI here to help review the edge cases! 🔍\n\n1. What happens if the incoming JSON string is malformed or empty?\n2. Does your type contract account for HTTP 4xx/5xx responses where the server returns an error message instead of data?\n\nBefore adding code, what is one defensive check you could add around \`JSON.parse()\`?`;
    } else {
      socraticReply = isId
        ? `Hai! Sema AI di sini. Senang melihatmu menelusuri tantangan ini! 🚀\n\nSebagai Sema AI di CodePath Academy, tugasku bukan langsung memberikan jawaban copy-paste, melainkan melatih naluri pemecahan masalahmu.\n\nMari pecah masalah ini:\n- Apa input yang kamu miliki saat ini?\n- Apa output ideal yang kamu harapkan?\n\nBagian mana yang menurutmu berperilaku berbeda dari ekspektasimu?`
        : `Hello! Sema AI here. Great to see you digging into this! 🚀\n\nAs your Socratic mentor at CodePath Academy, let's train your engineering intuition together.\n\nTwo simple questions:\n- What is the exact input state entering this function?\n- What invariant do you need to guarantee at the return statement?\n\nWhere do you suspect the assumptions might be breaking down?`;
    }

    return NextResponse.json({
      success: true,
      mentor: 'Sema AI',
      model: 'sema-ai-socratic-local',
      reply: socraticReply,
    });
  } catch (error) {
    console.error('Error in Sema AI route:', error);
    return NextResponse.json({ success: false, message: 'Sema AI encountered an unexpected error.' }, { status: 500 });
  }
}
