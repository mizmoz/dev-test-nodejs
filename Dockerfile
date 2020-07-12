FROM node:10.16

# Create app directory
WORKDIR /code/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
# CMD ["npm", "run", "test"] If you want to run test, depends on redis