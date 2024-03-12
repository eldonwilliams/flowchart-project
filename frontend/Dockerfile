FROM node:18.13.0 AS dependencies

WORKDIR /app

COPY package.json .

RUN npm install
RUN [ "npm", "install", "-g", "typescript", "nodemon", "ts-node" ]

FROM node:18.13.0 AS build 
USER root

WORKDIR /app

COPY --chown=root:root . .

COPY --from=dependencies /app/node_modules /app/node_modules

CMD [ "bash", "./docker-start.sh" ]