FROM node:18 as builder
WORKDIR /tmp
COPY package.json tsconfig.json yarn.lock /tmp/
RUN npm install
COPY ./src ./src
RUN npm run build

FROM node:18-buster-slim
WORKDIR /usr/src/app
COPY package.json ./
RUN apt-get update && apt-get install openssl git -y
RUN npm install
COPY --from=builder /tmp/build ./build
COPY ./prisma ./prisma
RUN npx prisma generate
EXPOSE 8000
CMD ["node", "build/index.js"]