FROM node:alpine

WORKDIR '/app'

COPY package.json .
RUN yarn && yarn cache clean
COPY . .
# command intentionally left in Dockerfile just in case

CMD ["yarn", "start"]