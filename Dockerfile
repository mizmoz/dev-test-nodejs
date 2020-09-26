FROM node:12.17.0-alpine
WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000
CMD node /app/build/index.js