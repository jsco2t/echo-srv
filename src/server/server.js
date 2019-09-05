"use strict";

var https = require('https');
var http = require('http');
var httpsPort = 443;
var fileSys = require('fs');
var space = '    ';
var echo = require('./echo.js');

const sslOpts = {
    key: fileSys.readFileSync('privatekey.pem'),
    cert: fileSys.readFileSync('fullchain.pem'),
};

http.createServer(serverHandler).listen(
    80,
    ()=> console.log("HTTP ready")
);

https.createServer(sslOpts, serverHandler).listen(
    httpsPort,
    ()=> console.log("HTTPS ready")
);

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
