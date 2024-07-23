FROM node:18 as builder
WORKDIR /tmp
COPY package.json tsconfig.json pnpm-lock.yaml /tmp/
RUN npm install -g pnpm
RUN pnpm install
COPY ./src ./src
RUN pnpm run build

FROM node:18-buster-slim
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN apt-get update && apt-get install openssl git -y
RUN npm install -g pnpm
RUN pnpm install
COPY --from=builder /tmp/build ./build
COPY ./prisma ./prisma
RUN npx prisma generate
EXPOSE 8000
CMD ["node", "build/index.js"]