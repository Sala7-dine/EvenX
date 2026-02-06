# Base stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Install dependencies (including devDependencies for build)
RUN npm install

# Build the application
WORKDIR /app
RUN npx turbo run build --filter=api

# Production stage
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package files
COPY apps/api/package.json ./package.json

# Install only production dependencies
RUN npm install --omit=dev

# Copy built artifacts from builder stage
COPY --from=builder /app/apps/api/dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
