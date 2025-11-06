# استفاده از Node.js 20 به عنوان base image
FROM node:20-alpine AS base

# نصب dependencies فقط زمانی که نیاز است
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# کپی فایل‌های package
COPY package.json package-lock.json* ./
RUN npm ci

# بیلد کردن سورس کد
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# غیرفعال کردن تلمتری Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# تنظیم API Base URL برای build time
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN npm run build

# تصویر نهایی برای اجرا
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# کپی فایل‌های بیلد شده
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
