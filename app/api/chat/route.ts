import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT_FR, SYSTEM_PROMPT_EN } from '@/lib/ai-prompts';

// Empêcher le caching de cette route
export const dynamic = 'force-dynamic';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  lang?: 'fr' | 'en';
}

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, lang = 'fr' } = body;

    // Validation basique
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Messages requis' }, { status: 400 });
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Choisir le system prompt selon la langue
    const systemPrompt = lang === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_FR;

    // Créer le stream
    const stream = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
    });

    // Créer un ReadableStream pour envoyer le texte en streaming
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
            if (event.type === 'message_stop') {
              controller.close();
            }
          }
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('[API Chat] Erreur:', error);
    return Response.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
