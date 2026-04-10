import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding AgentPulse...')

  const passwordHash = await bcrypt.hash('Demo1234!', 12)

  const tenant = await prisma.tenant.upsert({
    where: { email: 'demo@jenguassur.cm' },
    update: {},
    create: {
      nom: 'Cabinet Demo Assurances',
      sigle: 'CDA',
      email: 'demo@jenguassur.cm',
      telephone: '+237 699 000 001',
      adresse: 'Rue de la Paix, Akwa',
      arrondissement: 'Douala I (Wouri)',
      ville: 'Douala',
      pays: 'Cameroun',
      typeStructure: 'COURTIER',
      plan: 'PRO',
      isActive: true,
      subscriptionAt: new Date(),
    },
  })

  // Admin user
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'demo@jenguassur.cm' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'demo@jenguassur.cm',
      passwordHash,
      nom: 'Admin',
      prenom: 'Demo',
      role: 'ADMIN',
      isActive: true,
    },
  })

  // Agents
  const agents = await Promise.all([
    prisma.agent.upsert({
      where: { tenantId_telephone: { tenantId: tenant.id, telephone: '+237 691 000 001' } },
      update: {},
      create: { tenantId: tenant.id, nom: 'Mballa', prenom: 'Jean', telephone: '+237 691 000 001', zone: 'Douala I (Wouri)', objectifMensuel: 500000, tauxCommission: 10 },
    }),
    prisma.agent.upsert({
      where: { tenantId_telephone: { tenantId: tenant.id, telephone: '+237 691 000 002' } },
      update: {},
      create: { tenantId: tenant.id, nom: 'Ngo Biyong', prenom: 'Marie', telephone: '+237 691 000 002', zone: 'Douala III (Wouri)', objectifMensuel: 600000, tauxCommission: 12 },
    }),
    prisma.agent.upsert({
      where: { tenantId_telephone: { tenantId: tenant.id, telephone: '+237 691 000 003' } },
      update: {},
      create: { tenantId: tenant.id, nom: 'Tchoua', prenom: 'Paul', telephone: '+237 691 000 003', zone: 'Bonabéri', objectifMensuel: 400000, tauxCommission: 10 },
    }),
  ])

  // Prospects
  const prospects = await Promise.all([
    prisma.prospect.create({ data: { tenantId: tenant.id, agentId: agents[0].id, nom: 'Kamga', prenom: 'Robert', telephone: '+237 677 111 001', statut: 'INTERESSE', produitInteret: 'AUTO', arrondissement: 'Douala II (Wouri)' } }),
    prisma.prospect.create({ data: { tenantId: tenant.id, agentId: agents[1].id, nom: 'Eto', prenom: 'Samuel', telephone: '+237 677 111 002', statut: 'DEVIS_ENVOYE', produitInteret: 'MALADIE', arrondissement: 'Douala IV (Wouri)' } }),
    prisma.prospect.create({ data: { tenantId: tenant.id, agentId: agents[0].id, nom: 'Fotso', prenom: 'Claire', telephone: '+237 677 111 003', statut: 'NOUVEAU', produitInteret: 'VIE', arrondissement: 'Douala I (Wouri)' } }),
    prisma.prospect.create({ data: { tenantId: tenant.id, agentId: agents[2].id, nom: 'Biya', prenom: 'Eric', telephone: '+237 677 111 004', statut: 'CONVERTI', produitInteret: 'HABITATION', arrondissement: 'Bonabéri' } }),
  ])

  // Contrats
  const now = new Date()
  const contrats = await Promise.all([
    prisma.contrat.create({
      data: {
        tenantId: tenant.id, agentId: agents[0].id, numero: 'POL-2024-0001',
        nomAssure: 'Kamga Robert', telephoneAssure: '+237 677 111 001',
        typeProduit: 'AUTO', primeAnnuelle: 180000, primeNette: 180000, commission: 18000,
        statut: 'ACTIF', dateEffet: new Date('2024-01-01'),
        dateEcheance: new Date('2024-12-31'), renouvAuto: true,
      },
    }),
    prisma.contrat.create({
      data: {
        tenantId: tenant.id, agentId: agents[1].id, numero: 'POL-2024-0002',
        nomAssure: 'Biya Eric', telephoneAssure: '+237 677 111 004',
        typeProduit: 'HABITATION', primeAnnuelle: 95000, primeNette: 95000, commission: 11400,
        statut: 'ACTIF', dateEffet: new Date('2024-03-01'),
        dateEcheance: new Date(now.getTime() + 20 * 86400000), // expire dans 20j
        renouvAuto: true,
      },
    }),
    prisma.contrat.create({
      data: {
        tenantId: tenant.id, agentId: agents[0].id, numero: 'POL-2024-0003',
        nomAssure: 'Tchinda Lucie', telephoneAssure: '+237 677 111 005',
        typeProduit: 'MALADIE', primeAnnuelle: 240000, primeNette: 240000, commission: 28800,
        statut: 'ACTIF', dateEffet: new Date('2024-02-01'),
        dateEcheance: new Date('2025-01-31'), renouvAuto: true,
      },
    }),
  ])

  // Sinistre démo
  await prisma.sinistre.create({
    data: {
      tenantId: tenant.id, contratId: contrats[0].id, agentId: agents[0].id,
      numero: 'SIN-2024-0001',
      dateSinistre: new Date('2024-06-15'),
      lieuSinistre: 'Carrefour Deido, Douala',
      description: 'Collision avec un autre véhicule. Dommages matériels côté avant gauche.',
      gravite: 'MOYEN',
      statut: 'EN_INSTRUCTION',
      montantDeclare: 450000,
    },
  })

  // Activités
  await prisma.activite.createMany({
    data: [
      { tenantId: tenant.id, agentId: agents[0].id, type: 'CONTRAT_SIGNE', description: 'Contrat POL-2024-0001 signé — Kamga Robert (AUTO)' },
      { tenantId: tenant.id, agentId: agents[1].id, type: 'CONTRAT_SIGNE', description: 'Contrat POL-2024-0002 signé — Biya Eric (HABITATION)' },
      { tenantId: tenant.id, agentId: agents[0].id, type: 'SINISTRE_DECLARE', description: 'Sinistre SIN-2024-0001 déclaré sur POL-2024-0001' },
      { tenantId: tenant.id, agentId: agents[1].id, type: 'RELANCE_RENOUVELLEMENT', description: 'Relance renouvellement POL-2024-0002 (échéance dans 20 jours)' },
    ],
  })

  console.log('✅ Seed terminé!')
  console.log('📧 Login démo: demo@jenguassur.cm / Demo1234!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
