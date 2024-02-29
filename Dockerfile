FROM node:20

WORKDIR /usr/src/bot

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpx prisma generate

CMD ["node", "index.js"]
