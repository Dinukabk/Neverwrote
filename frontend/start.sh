#!/bin/bash -e
#
# This is the script for starting the frontend server. In development mode
# it will start the server with Nodemon, which automatically restarts the
# server when it detects changes to JavaScript files.

# Start the server
if [ "$NODE_ENV" == "production" ]
then
  node src/server.js
else
  nodemon -L -x "node --nolazy" -e .js -w src src/server.js
fi
