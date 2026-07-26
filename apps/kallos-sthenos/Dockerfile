# ---- Dependencies ----
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/kallos-sthenos/package.json ./apps/kallos-sthenos/package.json
RUN npm ci --workspace=@waxeccentric/kallos-sthenos

# ---- Build ----
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace=@waxeccentric/kallos-sthenos

# ---- Runtime ----
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

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
