import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { SYSTEM_PROMPT_FR, SYSTEM_PROMPT_EN } from '@/lib/ai-prompts';

// Empêcher le caching de cette route
export const dynamic = 'force-dynamic';

// ─── Schémas de validation Zod ──────────────────────────────

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(8000),
});

const ChatRequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(30),
  lang: z.enum(['fr', 'en']).default('fr'),
});

// ─── Constantes ─────────────────────────────────────────────

const MODEL = 'claude-opus-4-6';
const MAX_TOKENS = 4096;

// ─── Handler ────────────────────────────────────────────────

export async function POST(req: Request) {
  let lang: 'fr' | 'en' = 'fr';

  try {
    const body = await req.json();
    const parsed = ChatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: 'Requête invalide', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { messages } = parsed.data;
    lang = parsed.data.lang;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const systemPrompt = lang === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_FR;

    // Créer le stream avec claude-opus-4-6, thinking adaptatif et cache du system prompt
    const stream = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      thinking: { type: 'adaptive' },
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
    });

    // Stream uniquement le texte (les blocs de thinking sont ignorés côté client)
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
    // Erreurs typées Anthropic SDK
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json(
        {
          error:
            lang === 'en'
              ? 'Too many requests. Please retry in a moment.'
              : 'Trop de requêtes. Réessayez dans un moment.',
        },
        { status: 429, headers: { 'Retry-After': '30' } }
      );
    }
    if (error instanceof Anthropic.AuthenticationError) {
      console.error('[API Chat] Clé API invalide');
      return Response.json({ error: 'Configuration API invalide' }, { status: 500 });
    }
    if (error instanceof Anthropic.BadRequestError) {
      return Response.json(
        { error: 'Requête mal formée', details: error.message },
        { status: 400 }
      );
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`[API Chat] Erreur API ${error.status}:`, error.message);
      return Response.json(
        { error: 'Service temporairement indisponible. Réessayez.' },
        { status: 503 }
      );
    }

    console.error('[API Chat] Erreur inattendue:', error);
    return Response.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
