FROM node:12.18-alpine
ENV NODE_ENV production
WORKDIR /
COPY ["package*.json", "./"]
RUN yarn
COPY . .
EXPOSE 9090
# CMD ["yarn go:prod"]
