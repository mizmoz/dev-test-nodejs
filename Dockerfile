FROM node:12.20.2

WORKDIR /var/www/app

COPY . .

EXPOSE 3000 3000

CMD ["node", "build/index.js"]
