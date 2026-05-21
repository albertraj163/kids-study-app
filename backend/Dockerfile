# =============================================================================
# Backend Dockerfile - Node.js API (production-like, non-root user)
# =============================================================================

FROM node:20-alpine AS base
WORKDIR /app

# Install production dependencies only (smaller image)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application source
COPY src ./src

# Health checks and wget for Docker Compose (install before switching user)
RUN apk add --no-cache wget

# Create non-root user for security (never run as root in production)
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup && \
    chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
