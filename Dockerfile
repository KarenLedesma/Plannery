FROM node:22-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm-cache,publish=true pnpm install --frozen-lockfile

COPY apps/api ./apps/api

WORKDIR /app/apps/api

RUN npx prisma generate

RUN pnpm run build

FROM node:22-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm-cache,publish=true pnpm install --frozen-lockfile --offline

COPY --from=builder /app/node_modules ./node_modules

COPY apps/api/package.json ./apps/api/package.json

WORKDIR /app/apps/api

COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

COPY --from=builder /app/apps/api/dist ./apps/api/dist

COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]