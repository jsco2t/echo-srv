#!/bin/sh
# based on: https://github.com/Daplie/nodejs-self-signed-certificate-example/blob/master/make-root-ca-and-certificates.sh


# create CA:
openssl genrsa -out root-ca.key.pem 2048

# self sign root CA:
openssl req \
    -x509 \
    -new \
    -nodes \
    -key root-ca.key.pem \
    -days 9999 \
    -out root-ca.crt.pem \
    -subj "/C=US/ST=WA/L=Nowhere/O=ACME Fake Dev Certificate DO NOT TRUST/CN=example.com"

# create device certificate
openssl genrsa -out privatekey.pem 2048

# create certificate sign request
openssl req -new \
    -key privatekey.pem \
    -out device-csr.pem \
    -subj "/C=US/ST=WA/L=Nowhere/O=ACME Fake Dev Certificate DO NOT TRUST/CN=example.com"

# create signed cert
openssl x509 \
    -req -in device-csr.pem \
    -CA root-ca.crt.pem \
    -CAkey root-ca.key.pem \
    -CAcreateserial \
    -out cert.pem \
    -days 9999

# create full chain cert:
cat cert.pem root-ca.crt.pem > fullchain.pem