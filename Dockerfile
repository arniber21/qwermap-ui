# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# ── install ───────────────────────────────────
# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# ── build ─────────────────────────────────────
# copy cached node_modules, then copy source and build
FROM base AS prerelease

# Vite inlines VITE_* env vars at build time, so they must be ARGs
ARG VITE_API_BASE_URL=http://localhost:8000/v1
ARG VITE_MAPBOX_TOKEN
ARG VITE_GOOGLE_GENERATIVE_AI_API_KEY

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_MAPBOX_TOKEN=$VITE_MAPBOX_TOKEN
ENV VITE_GOOGLE_GENERATIVE_AI_API_KEY=$VITE_GOOGLE_GENERATIVE_AI_API_KEY

COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

# ── release ───────────────────────────────────
# copy production build output into final image
FROM base AS release
COPY --from=prerelease /usr/src/app/.output ./.output
COPY --from=prerelease /usr/src/app/package.json .

USER bun
ENV PORT=3000
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "run", ".output/server/index.mjs"]
