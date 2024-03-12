FROM node:18.13.0
RUN useradd -ms /bin/sh -u 1001 app

COPY --chown=app:app . /app

WORKDIR /app

RUN npm install
RUN [ "npm", "install", "-g", "typescript", "nodemon", "ts-node" ]

EXPOSE 8797

USER app

CMD [ "bash", "./docker-start.sh" ]