FROM node:12-alpine

WORKDIR /usr/local/dev-test

COPY ./build/ package.json ./

RUN npm i

EXPOSE 8000
CMD ["node", "index.js"]