"use strict";
require('dotenv').config();
var https = require('https');
var http = require('http');
var httpsPort = 443;
var fileSys = require('fs');
var space = '    ';
var echo = require('./echo.js');
var sslKeyPath = process.env.CERT_PATH + 'privatekey.pem';
var sslCertPath = process.env.CERT_PATH + 'fullchain.pem';

http.createServer(serverHandler).listen(
    80,
    ()=> console.log("HTTP ready")
);

if (fileSys.existsSync(sslKeyPath) && fileSys.existsSync(sslCertPath)) {
  console.log("SSL cert and key files exist, setting up HTTPS support");

  const sslOpts = {
    key: fileSys.readFileSync(sslKeyPath),
    cert: fileSys.readFileSync(sslCertPath),
  };

  https.createServer(sslOpts, serverHandler).listen(
      httpsPort,
      ()=> console.log("HTTPS ready")
  );
} else {
  console.log("SSL cert or key files DO NOT exist - HTTPS support is not enabled");
  console.log(`Search path for SSL Key: ${sslKeyPath}`);
  console.log(`Search path for SSL Cert: ${sslCertPath}`);
  console.log("File path for key and cert can be set with environmental variable: CERT_PATH")
}


function serverHandler(req, res) {
    req.on('data', ()=> null);
    req.on('end', ()=> {

        res.sendDate = true;

        // use echo object to send output
        echo.init(req);
        res.setHeader('Content-Type', echo.outputContentType);
        res.write(echo.message());
        res.end();
    })
}
