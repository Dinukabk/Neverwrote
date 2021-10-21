# ## Dockerfile ##
#
# This file describes the complete environment in which our server will run,
# including the operating system and all software dependencies. It is used
# by Docker Compose to build a Docker image for our application.

# Base this image on an official Node.js long term support image.
FROM node:8.1.2-alpine

# Install some additional packages that we need.
RUN apk add --no-cache tini curl bash sudo

# Use Tini as the init process. Tini will take care of important system stuff
# for us, like forwarding signals and reaping zombie processes.
ENTRYPOINT ["/sbin/tini", "--"]

# Create a working directory for our application.
RUN mkdir -p /app
WORKDIR /app

# Install other system dependencies (for building sqlite3).
RUN apk add --no-cache python g++ make git

# Install the project's NPM dependencies.
COPY package.json /app/
RUN npm --silent install

# Install sequelize-mocking manually - it's ugly, but it works.
RUN npm --silent install git+https://github.com/anibali/node-sqlite3.git#alpine
RUN npm --silent install sequelize-mocking@0.4.1

# Move NPM dependencies out of the /app folder.
RUN mkdir /deps && mv node_modules /deps/node_modules

# Set environment variables to point to the installed NPM modules.
ENV NODE_PATH=/deps/node_modules \
    PATH=/deps/node_modules/.bin:$PATH

# Copy our application files into the image.
COPY . /app

# Switch to a non-privileged user for running commands inside the container.
RUN chown -R node:node /app /deps \
 && echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/90-node
USER node

# Start the server on exposed port 3000.
EXPOSE 3000
CMD [ "npm", "start" ]
