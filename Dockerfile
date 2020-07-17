FROM node:12

# Create app directory
WORKDIR /usr/src/app
COPY . .

# Install packages
RUN npm install

# Build react app
RUN cd ./src/client
RUN npm build
RUN cd ../../

EXPOSE 3000
CMD [ "npm", "start" ]