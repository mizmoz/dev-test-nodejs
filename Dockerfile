FROM node:14-alpine

WORKDIR /app
COPY . /app

RUN npm install

ENV NODE_ENV=production
RUN npm run build

CMD ["npm", "run", "go:prod"]
