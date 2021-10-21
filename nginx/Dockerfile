FROM nginx:1.13.1-alpine

# Install some additional packages that we need.
RUN apk add --no-cache tini curl bash sudo

# Use Tini as the init process. Tini will take care of important system stuff
# for us, like forwarding signals and reaping zombie processes.
ENTRYPOINT ["/sbin/tini", "--"]

# Remove default configuration file.
RUN rm /etc/nginx/conf.d/default.conf

# Copy our configuration into the image.
COPY conf /etc/nginx
COPY start_nginx.sh /

# Start the NGINX server on exposed port 80.
EXPOSE 80
CMD [ "/start_nginx.sh" ]
