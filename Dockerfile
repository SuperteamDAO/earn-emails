FROM node:20 as builder

WORKDIR /earn-emails

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN pnpm run build


CMD [ "node", "dist/index.js" ]
