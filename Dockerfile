FROM node:12-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY ./src /usr/src/app/src

RUN yarn build

FROM node:12-alpine


COPY ./config /config
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

CMD ["node", "./dist/main"]
