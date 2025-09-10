FROM node:20 as builder

WORKDIR /earn-emails

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

COPY prisma ./prisma

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build || (echo "Build failed, reviewing available files:" && ls -la && false)

CMD [ "node", "dist/index.js" ]
