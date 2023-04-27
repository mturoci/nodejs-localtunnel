FROM node:16-alpine

WORKDIR /app

COPY package.json /app/
COPY yarn.lock /app/

RUN yarn install --production && yarn cache clean

COPY . /app
EXPOSE 3000

ENV NODE_ENV=production
ENTRYPOINT ["node", "./bin/server", "--port", "3000", "--ip", "35.85.251.43", "--ssl-cert", "/app/ssl/server.crt", "--ssl-key", "/app/ssl/server.key", "--secure"]
