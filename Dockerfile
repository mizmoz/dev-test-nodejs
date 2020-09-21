#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:latest

ENV PORT=7000
ENV DB=mongodb://mongo:27017
ENV DB_NAME=cloudemployee

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src

RUN npm ci --quiet && npm run build

COPY . /usr/src/app

EXPOSE 7000

CMD npm start