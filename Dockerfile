# Specify a base image
FROM node:10.16

# Specify a working directory
WORKDIR /var/www/app

# Copy the dependencies file
COPY ./package.json ./

# Install dependencies
RUN npm install

# Copy remaining files
COPY ./ ./

# Default command
CMD ["npm", "start"]