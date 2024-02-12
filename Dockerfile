FROM oven/bun:alpine AS base
WORKDIR /home/bun/app

FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
WORKDIR /temp/prod
RUN bun install --frozen-lockfile --production

FROM base AS prerelease
COPY . .
COPY --from=install /temp/prod/node_modules node_modules
RUN bun build ./src/index.ts --target bun --outfile=index.js --minify

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /home/bun/app/index.js .
COPY --from=prerelease /home/bun/app/package.json .
RUN mkdir -p /home/bun/app/data
RUN touch /home/bun/app/data/database.SQLite3
RUN chown -R bun:bun /home/bun/app
RUN chmod -R 777 /home/bun/app

USER bun

ENV NODE_ENV=production

ENTRYPOINT [ "bun", "run", "index.js" ]
