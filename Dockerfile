# Use an official Node.js runtime as the base image
FROM node:17

RUN mkdir -p /app/node_modules && chown -R node:node /app

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

USER node

# Install the application dependencies using npm
RUN npm install

# Copy the application code to the working directory
COPY --chown=node:node . .

RUN chmod -R 777 /app

# Expose a port for the Node.js application to listen on
EXPOSE 3000

# Start the Node.js application
CMD ["npm", "run", "dev"]