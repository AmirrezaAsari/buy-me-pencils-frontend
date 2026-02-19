# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://localhost:3002
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=production

COPY package.json package-lock.json* ./
RUN npm ci 2>/dev/null || npm install

COPY . .
RUN npm run build

# Standalone does not include .next/static — copy so CSS and assets are served
# Next.js may put server.js in a subfolder (e.g. frontend/) when the app is in a subfolder
RUN set -eux; \
  STANDALONE_APP=".next/standalone"; \
  if [ -d "$$STANDALONE_APP/frontend" ]; then STANDALONE_APP="$$STANDALONE_APP/frontend"; fi; \
  mkdir -p "$$STANDALONE_APP/.next"; \
  cp -a .next/static "$$STANDALONE_APP/.next/"; \
  if [ -d public ]; then cp -a public "$$STANDALONE_APP/"; fi; \
  echo "Static files in standalone:"; ls -la "$$STANDALONE_APP/.next/static" 2>/dev/null || true

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Bump CACHEBUST when frontend assets change to avoid stale CSS (e.g. --build-arg CACHEBUST=2)
ARG CACHEBUST=1
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run from the directory that contains server.js (standalone/frontend when app is in a subfolder)
CMD ["sh", "-c", "if [ -f frontend/server.js ]; then cd frontend && exec node server.js; else exec node server.js; fi"]
