FROM node:lts-alpine

RUN npm install -g pm2 pnpm

WORKDIR /api/dist

COPY ./packages/api /api

RUN cd /api && rm -rf node_modules && pnpm install && pnpm run build

CMD [ "pm2", "start", "server.js", "--no-daemon", "--", "--port", "8081" ]