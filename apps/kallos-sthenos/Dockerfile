# ---- Dependencies ----
FROM node:24-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.15.1 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/kallos-sthenos/package.json ./apps/kallos-sthenos/package.json
COPY apps/verse/package.json ./apps/verse/package.json
COPY apps/www/package.json ./apps/www/package.json
RUN pnpm install --frozen-lockfile --filter @waxeccentric/kallos-sthenos

# ---- Build ----
FROM node:24-slim AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.15.1 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/kallos-sthenos/node_modules ./apps/kallos-sthenos/node_modules
COPY . .
RUN pnpm --filter @waxeccentric/kallos-sthenos build

# ---- Runtime ----
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV KALLOS_DB_PATH=/app/data/kallos.db

# better-sqlite3 needs these native libs at runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsqlite3-0 \
    && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone server and app assets
COPY --from=builder --chown=nextjs:nodejs /app/apps/kallos-sthenos/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/kallos-sthenos/.next/static ./apps/kallos-sthenos/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/kallos-sthenos/public ./apps/kallos-sthenos/public

# Create data directory for SQLite (will be mounted as a volume)
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs
EXPOSE 3000

CMD ["node", "apps/kallos-sthenos/server.js"]
