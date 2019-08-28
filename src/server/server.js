"use strict";

var https = require('https');
var http = require('http');
var httpsPort = 443;
var fileSys = require('fs');

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
        // let result = {
        //     httpVersion: req.httpVersion,
        //     method: req.method,
        //     url: req.url,
        //     headers: req.headers
        // };
        //res.setHeader('Content-Type', 'application/json');
        //res.end(JSON.stringify(result));

        res.setHeader('Content-Type', 'text/plain');
        res.write('Welcome to: ECHO-SRV \n');
        res.write('\n');
        res.write(`\t http version:\t${req.httpVersion}\n`);
        res.write(`\t http method:\t${req.method}\n`);
        
        let host = req.headers['host']; 
        if (host != '') {
            res.write(`\t host:\t\t${host}\n`);
        } else {
            res.write(`\t host:\t\t${req.host}\n`);
        }
        
        res.write(`\t url:\t\t${req.url}\n`);
        //res.write(`\t path:\t\t${req.path}\n`); # currently reports  'undefined'
        
        res.write('\n');
        res.write(`\t headers: \n`);
        res.write('\t ------------------------------------------------\n');
        for (let headerItem of Object.keys(req.headers).sort()) {
            res.write(`\t ${headerItem}: ${req.headers[headerItem]}\n`);
        }

        // produces the same result as above:
        // let str = '';
        // for (let i = 0; i < req.rawHeaders.length; i = i + 2) {
        //     str += `\t ${req.rawHeaders[i]}: ${req.rawHeaders[i + 1]}\n`
        // }
        //res.write(str);
        res.write('\t ------------------------------------------------\n');
        res.end();
    })
}
