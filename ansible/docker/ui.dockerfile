FROM node:lts-alpine

RUN npm install -g pm2 pnpm

WORKDIR /ui/dist

COPY ./packages/ui /ui

RUN cd /ui && rm -rf node_modules && pnpm install -p && pnpm run build:production

CMD ["pm2", "serve", "--spa", "--no-daemon", "--port", "8082"]