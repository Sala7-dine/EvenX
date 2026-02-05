# Base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package files including lockfile
COPY package-lock.json package.json ./

# Copy app package.json into its workspace directory
COPY apps/web/package.json ./apps/web/package.json

# Copy other necessary workspace configs if needed, or simply install from root
# To make npm ci work for a workspace, we realistically need the whole workspace structure setup in package.json
# or we can try to install dependencies from the root.

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# We need to run the build from the app directory, or use turbo if available in the image
# Since we copied everything ".", we are at root.
WORKDIR /app/apps/web

# Build the application
# We might need to ensure that Next.js can find the local dependencies like @repo/ui
# The "COPY . ." above copies the entire repo content, including packages/* and apps/*
# So the workspace links should be valid.

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
