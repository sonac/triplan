FROM node:13

WORKDIR /usr/src/app/tmp

COPY client .

RUN yarn install && yarn build && mv build ../build

WORKDIR /usr/src/app

COPY backend .

COPY private.key /private.key

RUN yarn install && rm -rf tmp && yarn global add typescript && tsc 

ENV DOCKERIZE_VERSION v0.6.1

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

CMD ["node", "dist/server.js"]

