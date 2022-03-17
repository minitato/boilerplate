FROM node:12.16-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./

RUN yarn --silent

CMD "yarn start:prod"