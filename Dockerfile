FROM node:alpine AS BUILD_IMAGE

WORKDIR /app

COPY package.json yarn.lock *.json ./

RUN yarn --frozen-lockfile

COPY ./src /app/src

RUN yarn build

FROM node:alpine

COPY ./config /config
COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules

CMD ["node", "./dist/main"]
