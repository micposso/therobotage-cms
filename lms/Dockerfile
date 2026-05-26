# ── Stage 1: install deps ──────────────────────────────────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /repo

# Copy every package.json that npm workspaces needs to link @therobotage/ui
COPY package.json package-lock.json ./
COPY packages/ui/package.json ./packages/ui/package.json
COPY lms/package.json ./lms/package.json

RUN npm ci

# ── Stage 2: build ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /repo

COPY --from=deps /repo/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN cd lms && npm run build

# ── Stage 3: runtime ───────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# In a monorepo, Next.js standalone nests the app under its workspace path:
#   standalone/lms/server.js  (not standalone/server.js)
# So we copy the full standalone tree and work from the nested lms/ dir.
COPY --from=builder --chown=nextjs:nodejs /repo/lms/.next/standalone /app

# Static assets and public must sit next to server.js (inside lms/)
COPY --from=builder --chown=nextjs:nodejs /repo/lms/.next/static /app/lms/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/lms/public /app/lms/public

WORKDIR /app/lms
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
