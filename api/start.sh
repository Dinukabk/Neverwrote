#!/bin/bash -e
#
# ## start.sh ##
#
# This is the script which starts our server. In development mode, nodemon will
# be used instead of the usual node executable. This means that the server will
# be automatically restarted when we edit code.
#
# "package.json" has been configured such that running `npm start` will call
# this script.

# Run database migrations
until sequelize db:migrate
do
  echo "Migration failed, retrying in 5 seconds..."
  sleep 5
done

if [ "$NODE_ENV" == "development" ]
then
  # In development mode, use nodemon to automatically restart the server when
  # code changes.
  nodemon -L -x "node --use_strict --nolazy" -e .js -w src src/server.js
else
  # In production mode, run node directly without any debugging.
  node --use_strict src/server.js
fi
