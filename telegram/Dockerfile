FROM node:14-slim

WORKDIR /usr/src/app

COPY . .

RUN yarn install && rm -rf tmp && yarn global add typescript && tsc 

CMD ["node", "build/src/index.js"]