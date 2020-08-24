FROM node:14-slim

WORKDIR /usr/src/app

COPY backend .

RUN yarn install && rm -rf tmp && yarn global add typescript && tsc 

ENV DOCKERIZE_VERSION v0.6.1

RUN apt-get update && apt-get install wget -y && \
  wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

CMD ["node", "dist/server.js"]

