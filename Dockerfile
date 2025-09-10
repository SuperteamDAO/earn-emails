FROM node:22

WORKDIR /earn-emails

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile

COPY . .

CMD [ "pnpm", "exec", "tsx", "src/index.ts" ]
