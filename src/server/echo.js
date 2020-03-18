var os = require('os');

exports.init = function (req) {

    this.welcomeMessage = `Welcome to echo-srv [${(new Date().toISOString())}]`;
    this.httpVersion = req.httpVersion;
    this.httpMethod = req.method;
    this.requestHost = req.headers['host'];
    this.requestPort = req.socket.localPort;
    this.requestUrl = req.url;
    this.requestHeaders = req.headers;
    this.outputContentType = 'text/plain';
    this.outputJson = false;
    if (this.requestUrl.includes('out=json')) {
        this.outputJson = true;
        this.outputContentType = 'application/json';
    }

    if (this.requestUrl.includes('opt=basic') === false) {

        var networkInterfaces = {};

        var ifaces = os.networkInterfaces();

        Object.keys(ifaces).forEach(function(ifname) {
            //console.log(`ifname: ${ifname}`);
            ifaces[ifname].forEach(function(iface) {
                if ('IPv4' == iface.family) {
                    //console.log(`address: ${iface.address}`);
                    networkInterfaces[ifname] = iface.address
                }
            });
        })

        this.osInfo = {
            arch: os.arch(),
            platform: os.platform(),
            version: os.release(),
            totalMem: `${os.totalmem() / (1024 * 1024)}mb`,
            freeMem: `${os.freemem() / (1024 * 1024)}mb`,
            osType: os.type(),
            loadAverage: `${os.loadavg()} [1,5,15]`,
            hostName: os.hostname(),
            networkInterfaces: networkInterfaces
        }
    } else {
        delete this.osInfo;
    }

    this.message = function () {
        var result = '';
        var space = '    ';

        if (this.requestUrl.includes('?help')) {
            result += `${this.welcomeMessage}\n\n`;
            result += 'Valid request parameters are:\n';
            result += `${space}'?help' == show this message\n`
            result += `${space}'?out=json' == return the output as json\n`
            result += `${space}'?opt=basic' == return minimal output\n`
        } else {
            if (this.outputJson) {

                var tempObj = JSON.stringify(this);
                tempObj = JSON.parse(tempObj);
                delete tempObj.outputJson;
                delete tempObj.outputContentType;
                result = JSON.stringify(tempObj);

            } else {

                result += `${this.welcomeMessage}\n\n`;
                result += `${space}http version:\t${this.httpVersion}\n`;
                result += `${space}http method:\t${this.httpMethod}\n`;
                result += `${space}host:\t\t${this.requestHost}\n`;
                result += `${space}url:\t\t${this.requestUrl}\n`;
                result += `${space}request port: \t${this.requestPort}\n`

                // headers
                result += '\n';
                result += `${space}headers: \n`;
                result += `${space}------------------------------------------------\n`;
                for (let item of Object.keys(this.requestHeaders)) {
                    result += `${space}${item}: ${this.requestHeaders[item]}\n`;
                }
                result += `${space}------------------------------------------------\n`;

                if (this.hasOwnProperty('osInfo')) {
                    result += '\n';
                    result += `${space}os info: \n`;
                    result += `${space}------------------------------------------------\n`;
                    for (let item of Object.keys(this.osInfo)) {
                        if (item != 'networkInterfaces') {

                            result += `${space}${item}: ${this.osInfo[item]}\n`;

                        } else {
                            result += `${space}networkInterfaces:`;
                            var ifaces = this.osInfo[item];
                            Object.keys(ifaces).forEach(function(ifname) {
                                result += ` ${ifname}=${ifaces[ifname]}`;
                            })
                            result += '\n';
                        }
                    }
                    result += `${space}------------------------------------------------\n`;
                }

            }
        }

        return result;
    }
}