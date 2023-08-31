FROM node:latest

COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

CMD [ "pnpm", "start" ]