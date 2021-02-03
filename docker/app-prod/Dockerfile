FROM node:14

WORKDIR /app
COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock
RUN yarn install
COPY ./ /app
RUN yarn build
CMD [ "yarn", "go:prod" ]
