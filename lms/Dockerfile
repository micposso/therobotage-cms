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
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# standalone output contains a self-contained server.js + minimal node_modules
COPY --from=builder --chown=nextjs:nodejs /repo/lms/.next/standalone ./
# static assets and public dir must sit next to server.js
COPY --from=builder --chown=nextjs:nodejs /repo/lms/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/lms/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
