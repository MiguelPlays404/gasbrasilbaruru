# syntax=docker/dockerfile:1

# ---------- Etapa 1: build ----------
FROM node:22-slim AS build
WORKDIR /app

# bun é o gerenciador do projeto (existe bun.lock)
RUN npm i -g bun

COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

COPY . .

# Variável pública, entra no código durante o build (canonical, sitemap, og:url)
ARG VITE_SITE_URL
ENV VITE_SITE_URL=${VITE_SITE_URL}

# O projeto vem configurado para Cloudflare. Aqui forçamos o preset de servidor Node.
ENV NITRO_PRESET=node-server
RUN bun run build

# ---------- Etapa 2: execução ----------
FROM node:22-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

# O build do Nitro já leva as dependências dentro de .output
COPY --from=build --chown=node:node /app/.output ./.output

USER node
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
