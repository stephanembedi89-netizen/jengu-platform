import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `Tu es JenguAI, l'assistant intelligent intégré à JenguAssur — la plateforme de gestion commerciale pour compagnies d'assurance à Douala, Cameroun.

Tu as une expertise approfondie en :
- Assurance IARD (Auto, Habitation, Incendie, Transport) et Vie au Cameroun
- Code des Assurances CIMA (marché africain)
- Pratiques commerciales du marché de l'assurance à Douala (Wouri, Bonabéri, Akwa, Bonanjo...)
- Produits des compagnies locales : Activa, Chanas, Saham, Saar, UIC
- Calcul de primes, gestion de sinistres, renouvellements
- Conformité réglementaire CIMA et reporting

Tu peux aider les agents et managers à :
1. Rédiger des devis personnalisés (avec calcul de prime indicatif)
2. Analyser un prospect (risque, produit adapté, argumentation)
3. Rédiger des communications professionnelles (relances, confirmations)
4. Répondre aux questions sur la conformité CIMA
5. Analyser des performances commerciales et suggérer des améliorations
6. Expliquer les clauses et garanties d'assurance en langage simple

Utilise toujours le français. Sois précis, professionnel et adapté au contexte camerounais.
Les montants sont en XAF (Franc CFA BEAC). Référence les arrondissements de Douala si pertinent.`

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 })
  }

  // Vérifier que l'ANTHROPIC_API_KEY est configurée
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Assistant IA non configuré. Ajoutez ANTHROPIC_API_KEY dans .env' }), { status: 503 })
  }

  const { messages, context } = await req.json()

  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'Messages requis' }), { status: 400 })
  }

  // Récupérer des données contextuelles pour enrichir l'assistant
  let contextInfo = ''
  if (context?.type === 'prospect' && context.id) {
    const prospect = await prisma.prospect.findFirst({
      where: { id: context.id, tenantId: session.tenantId },
      include: { agent: { select: { nom: true, prenom: true } } },
    })
    if (prospect) {
      contextInfo = `\n\nCONTEXTE PROSPECT:\nNom: ${prospect.nom} ${prospect.prenom ?? ''}\nTéléphone: ${prospect.telephone}\nZone: ${prospect.arrondissement ?? 'Douala'}\nStatut: ${prospect.statut}\nProduit d'intérêt: ${prospect.produitInteret ?? 'Non défini'}\nNote: ${prospect.noteInterne ?? 'Aucune'}`
    }
  } else if (context?.type === 'contrat' && context.id) {
    const contrat = await prisma.contrat.findFirst({
      where: { id: context.id, tenantId: session.tenantId },
    })
    if (contrat) {
      contextInfo = `\n\nCONTEXTE CONTRAT:\nN° Police: ${contrat.numero}\nAssuré: ${contrat.nomAssure}\nProduit: ${contrat.typeProduit}\nPrime annuelle: ${contrat.primeAnnuelle} XAF\nStatut: ${contrat.statut}\nÉchéance: ${new Date(contrat.dateEcheance).toLocaleDateString('fr-CM')}`
    }
  }

  const systemWithContext = SYSTEM_PROMPT + contextInfo

  // Streaming avec Claude Opus 4.6 + adaptive thinking
  const stream = await client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    thinking: { type: 'adaptive' },
    system: systemWithContext,
    messages: messages.slice(-10), // Garder les 10 derniers messages pour le contexte
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`))
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
