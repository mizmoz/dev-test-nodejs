FROM node:12.18-alpine
WORKDIR /
COPY ["package*.json", "./"]
RUN yarn
COPY . .
RUN yarn build
# ENV NODE_ENV production
EXPOSE 9090
# CMD ["yarn go:prod"]
