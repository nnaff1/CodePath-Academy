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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      code,
      language = 'en',
      history = [],
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: 'Prompt is required.' },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    // Build message payload
    const userMessageContent = code
      ? `Student Code:\n\`\`\`typescript\n${code}\n\`\`\`\n\nStudent Question / Dilemma:\n${prompt}`
      : prompt;

    const messages = [
      { role: 'system', content: SEMA_AI_SYSTEM_PROMPT },
      ...history.slice(-6), // Send last 6 turns of context
      { role: 'user', content: userMessageContent },
    ];

    // If Groq API key is present, execute live LLM inference
    if (groqApiKey) {
      try {
        const groqResponse = await fetch(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages,
              temperature: 0.6,
              max_tokens: 600,
            }),
          }
        );

        if (groqResponse.ok) {
          const data = await groqResponse.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              success: true,
              mentor: 'Sema AI',
              model: 'llama-3.3-70b-versatile',
              reply,
            });
          }
        } else {
          console.warn('Groq API returned error status:', groqResponse.status);
        }
      } catch (err) {
        console.warn('Groq API request failed, falling back to local Socratic heuristic engine:', err);
      }
    }

    // High-fidelity fallback Socratic generator when offline or no API key
    let socraticReply = '';
    const lowerPrompt = prompt.toLowerCase();
    const isId = language === 'id' || lowerPrompt.includes('bagaimana') || lowerPrompt.includes('kenapa') || lowerPrompt.includes('kode');

    if (lowerPrompt.includes('generic') || lowerPrompt.includes('any')) {
      socraticReply = isId
        ? `Halo! Sema AI di sini. Pertanyaan yang sangat bagus tentang generics vs \`any\`! 💡

Coba bayangkan: saat kamu menggunakan \`any\`, TypeScript pada dasarnya 'menyerah' dan mematikan pemeriksaan tipe. Kode kamu lolos kompilasi, tapi bagaimana jika API mengembalikan data yang berbeda saat runtime?

Dengan Generic (\`<T>\`), kamu memberi tahu TypeScript: *"Aku belum tahu tipe pastinya sekarang, tapi tolong ingat dan kunci tipenya saat fungsi ini dipanggil."*

**Pertanyaan refleksi untukmu:**
Jika fungsi \`parseResponse<T>\` menerima payload JSON pengguna, bagaimana Generic mencegah kesalahan \`undefined is not an object\` pada baris pemanggil? Coba telusuri return type-nya!`
        : `Hey there! Sema AI here. That is one of the most fundamental shifts from junior to production TypeScript! 💡

Think of \`any\` as turning off the type checker entirely. TypeScript stops protecting you, so runtime crashes can easily slip through.

With a Generic parameter (\`<T>\`), you are essentially creating a reusable contract: *"I don't know the exact shape yet, but whatever type the caller specifies, enforce that exact shape throughout."*

**A quick Socratic question for you:**
If you pass \`User\` into \`parseResponse<User>(rawJson)\`, what happens if someone later tries to access \`.nonExistentField\` on the returned object? How does the compiler catch that before it reaches production?`;
    } else if (lowerPrompt.includes('edge') || lowerPrompt.includes('bug') || lowerPrompt.includes('error')) {
      socraticReply = isId
        ? `Sema AI siap membantumu meninjau kode! 🔍

Sebelum kita masuk ke perbaikan, mari perhatikan baris di mana parsing atau pemanggilan data terjadi. 

1. Apakah kamu sudah menangani skenario saat nilai kembalian adalah \`null\`, \`undefined\`, atau string JSON yang tidak valid (malformed)?
2. Apa yang akan terjadi jika jaringan mengalami timeout di tengah proses?

Coba periksa blok penanganan error: apakah kamu menggunakan \`try/catch\` di sekitar operasi parsing tersebut? Apa langkah pertamamu untuk mengujinya?`
        : `Sema AI here to help you review the edge cases! 🔍

Take a close look at where the data parsing or network boundary happens:

1. What happens if the incoming JSON string is malformed or empty (\`""\`)?
2. Does your type contract account for possible HTTP 4xx or 5xx payloads where the server returns an \`error\` message instead of the expected \`data\`?

Before adding more code, what is one defensive check you could add around \`JSON.parse()\` to keep the application resilient?`;
    } else {
      socraticReply = isId
        ? `Hai! Sema AI di sini. Senang melihatmu menelusuri tantangan arsitektur ini! 🚀

Sebagai Sema AI di CodePath Academy, tugasku bukan langsung memberikan jawaban copy-paste, melainkan melatih naluri pemecahan masalahmu layaknya seorang Staff Engineer.

Mari pecah masalah ini menjadi bagian-bagian kecil:
- Apa input yang kamu miliki saat ini?
- Apa output ideal yang kamu harapkan di akhir fungsi ini?

Coba amati baris kode yang sedang kamu kerjakan. Bagian mana yang menurutmu berperilaku berbeda dari ekspektasimu?`
        : `Hello! Sema AI here. Great to see you digging into this architectural challenge! 🚀

As your Socratic mentor at CodePath Academy, I won't just hand you the finished code—instead, let's train your engineering intuition so you can debug anything with confidence.

Let's break this down into two simple questions:
- What is the exact input state entering this function?
- What contract or invariant do you need to guarantee at the return statement?

Looking closely at your current implementation, where do you suspect the assumptions might be breaking down?`;
    }

    return NextResponse.json({
      success: true,
      mentor: 'Sema AI',
      model: groqApiKey ? 'llama-3.3-70b-versatile' : 'sema-ai-socratic-local',
      reply: socraticReply,
    });
  } catch (error) {
    console.error('Error in Sema AI route:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Sema AI encountered an unexpected error. Please try again.',
      },
      { status: 500 }
    );
  }
}

