FROM node:18.13.0

COPY . /app

WORKDIR /app

RUN npm install
RUN [ "npm", "install", "-g", "typescript", "nodemon", "ts-node" ]

EXPOSE 8797

CMD [ "bash", "./docker-start.sh" ]