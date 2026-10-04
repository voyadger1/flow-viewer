# ==========================================
# ЭТАП 1: Сборка (Builder)
# ==========================================
FROM node:24-alpine AS builder

WORKDIR /app

# 1. Копируем только package.json для использования кэша Docker
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/

# 2. Устанавливаем ВСЕ зависимости (включая dev для сборки)
RUN npm ci

# 3. Копируем исходный код
COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend
COPY apps/backend ./apps/backend

# 4. Собираем проекты в строгом порядке
# Сначала общие типы
RUN npm run build -w packages/shared
# Потом фронтенд
RUN npm run build -w apps/frontend
# Потом бекенд
RUN npm run build -w apps/backend

# 5. Копируем собранный фронтенд в папку бекенда (в папку public)
RUN mkdir -p apps/backend/public && \
    cp -r apps/frontend/dist/* apps/backend/public/

# 6. Удаляем dev-зависимости, чтобы уменьшить размер node_modules
RUN npm prune --omit=dev


# ==========================================
# ЭТАП 2: Продакшен образ
# ==========================================
FROM node:24-alpine AS production

WORKDIR /app

# Переменная окружения для продакшена
ENV NODE_ENV=production

# Копируем package.json (нужны для корректной работы npm workspaces)
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

# Копируем очищенные node_modules из этапа сборки
COPY --from=builder /app/node_modules ./node_modules

# Копируем скомпилированный бекенд и статику фронтенда
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/public ./apps/backend/public

# Открываем порт (стандартный для NestJS)
EXPOSE 3000

# Запускаем бекенд
CMD ["node", "apps/backend/dist/src/main.js"]