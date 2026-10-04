# ==========================================
# STAGE 1: Assembly (Builder)
# ==========================================
FROM node:24-alpine AS builder

WORKDIR /app

# 1. Copy only package.json to utilize the Docker cache.
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/

# 2. Install ALL dependencies (including dev dependencies for the build).
RUN npm ci

# 3. Copy the source code.
COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend
COPY apps/backend ./apps/backend

# 4. We assemble the projects in strict order.
# First, the general types.
RUN npm run build -w packages/shared
# Then the frontend.
RUN npm run build -w apps/frontend
# Then the backend.
RUN npm run build -w apps/backend

# 5. Copy the built frontend to the backend folder (into the `public` folder).
RUN mkdir -p apps/backend/public && \
    cp -r apps/frontend/dist/* apps/backend/public/

# 6. Remove dev dependencies to reduce the size of node_modules.
RUN npm prune --omit=dev


# ==========================================
# STAGE 2: Production Look
# ==========================================
FROM node:24-alpine AS production

WORKDIR /app

# Production environment variable
ENV NODE_ENV=production

# Copy package.json (required for npm workspaces to work correctly).
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

# Copy package.json (required for npm workspaces to work correctly).
COPY --from=builder /app/node_modules ./node_modules

# Copy the compiled backend and frontend static files.
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/public ./apps/backend/public

# Opening the port (standard for NestJS)
EXPOSE 3000

# Launching the backend
CMD ["node", "apps/backend/dist/src/main.js"]