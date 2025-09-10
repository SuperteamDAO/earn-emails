FROM node:20 as builder

WORKDIR /earn-emails

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* prisma/schema.prisma ./

RUN pnpm install

COPY . .

RUN pnpm run build || (echo "Build failed, reviewing available files:" && ls -la && false)

CMD [ "node", "dist/index.js" ]
