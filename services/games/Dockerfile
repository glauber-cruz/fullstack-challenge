FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .

EXPOSE 4001

CMD ["sh", "-c", "bunx prisma generate && bunx prisma db push && bun run src/main.ts"]
