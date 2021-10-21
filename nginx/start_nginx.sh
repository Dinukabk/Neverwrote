#!/bin/bash -e
#
# This file starts the NGINX server. The api and frontend services are detected
# and written to configuration files that are included in the main configuration
# file (nginx.conf).

linkvars() {
  if [ -n "$(getent ahosts "${1}_${3}")" ]
  then
    link_addr="${1}_${3}"
    link_port="${2}"
    return 0
  else
    return 1
  fi
}

rm -rf /etc/nginx/includes/
mkdir -p /etc/nginx/includes/

# Create include file describing the API service.
# Load balancing multiple service instances is supported.
echo "upstream api_service {" >> /etc/nginx/includes/api_service.conf
counter=1
while linkvars "api" "3000" $counter
do
  echo "  server $link_addr:$link_port;" >> /etc/nginx/includes/api_service.conf
  let counter+=1
done
echo "}" >> /etc/nginx/includes/api_service.conf

# Create include file describing the frontend service.
# Load balancing multiple service instances is supported.
echo "upstream frontend_service {" >> /etc/nginx/includes/frontend_service.conf
counter=1
while linkvars "frontend" "3000" $counter
do
  echo "  server $link_addr:$link_port;" >> /etc/nginx/includes/frontend_service.conf
  let counter+=1
done
echo "}" >> /etc/nginx/includes/frontend_service.conf

# Start NGINX with daemon mode disabled.
nginx -g 'daemon off;'
