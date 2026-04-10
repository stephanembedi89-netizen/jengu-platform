/**
 * Tenant-scoped Prisma client using $extends
 *
 * Automatically injects `where: { tenantId }` on every query so API routes
 * can never accidentally leak cross-tenant data — even if a developer forgets
 * to add the tenantId filter manually.
 *
 * Usage in API routes:
 *   import { getTenantPrisma } from '@/lib/prisma-tenant'
 *   const db = getTenantPrisma(session.tenantId)
 *   const contrats = await db.contrat.findMany()  // tenantId injected automatically
 *
 * Data isolation tiers:
 *   STARTER / PRO  — shared DB + this extension (app-layer isolation)
 *   ENTERPRISE     — schema-per-tenant via DATABASE_URL override (DB-layer isolation)
 *                    Provision: create schema, run prisma migrate, set tenant URL in env
 */

import { prisma } from './prisma'
import { Prisma } from '@prisma/client'

// Models that carry a tenantId column
const TENANT_MODELS = new Set([
  'tenant',
  'user',
  'agent',
  'produit',
  'prospect',
  'contrat',
  'sinistre',
  'activite',
])

type TenantExtension = ReturnType<typeof buildExtension>

function buildExtension(tenantId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }: { model: string; args: Prisma.Args<typeof prisma, 'findMany'>; query: (args: unknown) => Promise<unknown> }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { tenantId, ...args.where }
          }
          return query(args)
        },
        async findFirst({ model, args, query }: { model: string; args: Prisma.Args<typeof prisma, 'findFirst'>; query: (args: unknown) => Promise<unknown> }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { tenantId, ...args.where }
          }
          return query(args)
        },
        async findUnique({ model, args, query }: { model: string; args: Prisma.Args<typeof prisma, 'findUnique'>; query: (args: unknown) => Promise<unknown> }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            // findUnique requires the unique field; wrap as findFirst to add tenantId
            const { where, ...rest } = args as { where: Record<string, unknown> }
            return (prisma as unknown as Record<string, { findFirst: (a: unknown) => Promise<unknown> }>)[model].findFirst({
              where: { ...where, tenantId },
              ...rest,
            })
          }
          return query(args)
        },
        async create({ model, args, query }: { model: string; args: Prisma.Args<typeof prisma, 'create'>; query: (args: unknown) => Promise<unknown> }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            ;(args.data as Record<string, unknown>).tenantId = tenantId
          }
          return query(args)
        },
        async update({ model, args, query }: { model: string; args: Prisma.Args<typeof prisma, 'update'>; query: (args: unknown) => Promise<unknown> }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { ...args.where, tenantId }
          }
          return query(args)
        },
        async updateMany({ model, args, query }: { model: string; args: Prisma.Args<typeof prisma, 'updateMany'>; query: (args: unknown) => Promise<unknown> }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { tenantId, ...args.where }
          }
          return query(args)
        },
        async delete({ model, args, query }: { model: string; args: Prisma.Args<typeof prisma, 'delete'>; query: (args: unknown) => Promise<unknown> }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            // Rewrite as deleteMany to allow adding tenantId guard
            return (prisma as unknown as Record<string, { deleteMany: (a: unknown) => Promise<unknown> }>)[model].deleteMany({
              where: { id: (args.where as Record<string, unknown>).id, tenantId },
            })
          }
          return query(args)
        },
        async deleteMany({ model, args, query }: { model: string; args: Prisma.Args<typeof prisma, 'deleteMany'>; query: (args: unknown) => Promise<unknown> }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { tenantId, ...args.where }
          }
          return query(args)
        },
        async count({ model, args, query }: { model: string; args: Prisma.Args<typeof prisma, 'count'>; query: (args: unknown) => Promise<unknown> }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { tenantId, ...args.where }
          }
          return query(args)
        },
        async aggregate({ model, args, query }: { model: string; args: Prisma.Args<typeof prisma, 'aggregate'>; query: (args: unknown) => Promise<unknown> }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { tenantId, ...args.where }
          }
          return query(args)
        },
        async groupBy({ model, args, query }: { model: string; args: Prisma.Args<typeof prisma, 'groupBy'>; query: (args: unknown) => Promise<unknown> }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { tenantId, ...args.where }
          }
          return query(args)
        },
      },
    },
  })
}

// Cache one extended client per tenant to avoid re-creating on every request
const cache = new Map<string, TenantExtension>()

export function getTenantPrisma(tenantId: string): TenantExtension {
  if (!cache.has(tenantId)) {
    cache.set(tenantId, buildExtension(tenantId))
  }
  return cache.get(tenantId)!
}

/*
 * ─── POSTGRESQL ROW-LEVEL SECURITY (production) ──────────────────────────────
 *
 * For STARTER/PRO tenants on a shared PostgreSQL database, add these RLS
 * policies via a migration after switching the datasource provider to postgresql.
 *
 * Run once per table (example for `Contrat`):
 *
 *   ALTER TABLE "Contrat" ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY tenant_isolation ON "Contrat"
 *     USING ("tenantId" = current_setting('app.tenant_id', true));
 *
 * Then set the session variable at connection time (e.g., in a Prisma middleware
 * or via a dedicated DB user per tenant):
 *   await prisma.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId}, true)`
 *
 * This provides DB-layer isolation: even a SQL injection cannot cross tenant
 * boundaries because the database itself enforces the filter.
 *
 * ─── ENTERPRISE: SCHEMA-PER-TENANT ───────────────────────────────────────────
 *
 * For ENTERPRISE customers who require full schema isolation:
 *   1. Provision a dedicated PostgreSQL schema: CREATE SCHEMA tenant_<id>;
 *   2. Run: DATABASE_URL="postgresql://...?schema=tenant_<id>" prisma migrate deploy
 *   3. Store the per-tenant DATABASE_URL in a secrets vault (Vercel env, Doppler)
 *   4. In getTenantPrisma(), return a new PrismaClient({ datasources: { db: { url } } })
 *      instead of the $extends wrapper.
 *
 * This gives each ENTERPRISE tenant a completely separate schema — zero shared
 * tables, independent migration history, and audit logs per schema.
 */
