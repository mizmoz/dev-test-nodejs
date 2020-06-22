FROM    node:12.16.2-alpine
STOPSIGNAL SIGTERM

WORKDIR /src
COPY    src ./
COPY    package.json .env.example tsconfig.json ./
RUN     apk add --update make cmake gcc g++
RUN     apk add --update python
RUN     npm i
RUN     npm install --build-from-source sqlite3
RUN     touch .env
RUN     npm run build

# Expose the service port
EXPOSE  80

CMD  ["node", "build/index.js"]
