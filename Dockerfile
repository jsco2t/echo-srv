FROM node:13.10.1-alpine3.11
LABEL "author"="jsco2t"

# environment
ENV CERT_PATH './' 

# dependencies
RUN apk --no-cache add openssl

# copy code
WORKDIR /opt
ADD src/utilities/*.sh /opt/
ADD src/server/*.js /opt/
ADD src/server/*.json /opt/
RUN npm install

# create certs
RUN sh create-dev-cert.sh

# run the server
EXPOSE 80 443
CMD npm start


# building:
#   docker build -t "jsco2t/echo-srv:0.01" .
#
# running:
#   docker run -d --rm -p 8080:80 -p 8443:443 jsco2t/echo-srv:0.01
#   docker run -it --rm -p 8080:80 -p 8443:443 jsco2t/echo-srv:0.01 <--- interactive to see exceptions
#   docker run -it --rm -p 8080:80 -p 8443:443 -e CERT_PATH='/foo/bar/' jsco2t/echo-srv:0.01 <---- specify alternate cert path
#
# cleanup:
#   Take the container id reported from the above run request and use it for `docker stop`:
#   docker stop 2f08f247bab6a2fc02d99367420aba9509e477beac9c2c1a84dab6adf10e2bb5
