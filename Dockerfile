FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Accept build arguments
ARG NEXT_PUBLIC_DRUPAL_API_URL
ARG NEXT_PUBLIC_CLIENT_ID
ARG NEXT_PUBLIC_CLIENT_SECRET
ARG NEXT_PUBLIC_GRANT_TYPE
ARG NEXT_PUBLIC_REFRESH_GRANT_TYPE

# Set environment variables in the container
ENV NEXT_PUBLIC_DRUPAL_API_URL=${NEXT_PUBLIC_DRUPAL_API_URL}
ENV NEXT_PUBLIC_CLIENT_ID=${NEXT_PUBLIC_CLIENT_ID}
ENV NEXT_PUBLIC_CLIENT_SECRET=${NEXT_PUBLIC_CLIENT_SECRET}
ENV NEXT_PUBLIC_GRANT_TYPE=${NEXT_PUBLIC_GRANT_TYPE}
ENV NEXT_PUBLIC_REFRESH_GRANT_TYPE=${NEXT_PUBLIC_REFRESH_GRANT_TYPE}

# Create an .env file in the container
RUN echo "NEXT_PUBLIC_DRUPAL_API_URL=$NEXT_PUBLIC_DRUPAL_API_URL" >> /app/.env
RUN echo "NEXT_PUBLIC_CLIENT_ID=$NEXT_PUBLIC_CLIENT_ID" >> /app/.env
RUN echo "NEXT_PUBLIC_CLIENT_SECRET=$NEXT_PUBLIC_CLIENT_SECRET" >> /app/.env
RUN echo "NEXT_PUBLIC_GRANT_TYPE=$NEXT_PUBLIC_GRANT_TYPE" >> /app/.env
RUN echo "NEXT_PUBLIC_REFRESH_GRANT_TYPE=$NEXT_PUBLIC_REFRESH_GRANT_TYPE" >> /app/.env

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

# Set environment variables in the container
ENV NEXT_PUBLIC_DRUPAL_API_URL=${NEXT_PUBLIC_DRUPAL_API_URL}
ENV NEXT_PUBLIC_DRUPAL_API_URL_TEST=123555

ENV NEXT_PUBLIC_CLIENT_ID=${NEXT_PUBLIC_CLIENT_ID}
ENV NEXT_PUBLIC_CLIENT_SECRET=${NEXT_PUBLIC_CLIENT_SECRET}
ENV NEXT_PUBLIC_GRANT_TYPE=${NEXT_PUBLIC_GRANT_TYPE}
ENV NEXT_PUBLIC_REFRESH_GRANT_TYPE=${NEXT_PUBLIC_REFRESH_GRANT_TYPE}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]