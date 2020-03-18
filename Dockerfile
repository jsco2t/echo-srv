FROM node:8.16.1-alpine
LABEL "author"="jsco2t"

# dependencies
RUN apk --no-cache add openssl

# copy code
WORKDIR /opt
ADD src/utilities/create-dev-cert.sh /opt
ADD src/server/echo.js /opt
ADD src/server/server.js /opt

# create certs
RUN sh create-dev-cert.sh

# run the server
EXPOSE 80 443
CMD node server.js


# building:
#   docker build -t "jsco2t/echo-srv:0.01" .
#
# running:
#   docker run -d --rm -p 8080:80 -p 8443:443 jsco2t/echo-srv:0.01
#   docker run -it --rm -p 8080:80 -p 8443:443 jsco2t/echo-srv:0.01 <--- interactive to see exceptions
#
# cleanup:
#   Take the container id reported from the above run request and use it for `docker stop`:
#   docker stop 2f08f247bab6a2fc02d99367420aba9509e477beac9c2c1a84dab6adf10e2bb5
