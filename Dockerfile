FROM ubuntu:latest

RUN apt-get update -y && \
	apt-get install -y \
		apt-utils \
		nodejs npm

RUN set -xe \
    && npm install -g json-server \
    && rm -rf /tmp/npm* /var/cache/apk/*

EXPOSE 3000

COPY redis-server.js .
COPY countries.json .
COPY package.json .

RUN npm install

# ENTRYPOINT ["json-server"]
# CMD ["--help"]

CMD SERVERPORT=3000 SERVERDATABASEFILENAME=./countries.json node ./redis-server.js
