const https = require('https');
const http = require('http');
const url = require('url');

exports.handler = (event, context, callback) =>{
    console.log(event);
    console.log(context);

    var postDataStr = JSON.stringify({
        event: event,
        context: context
    });
    
    var url_params = url.parse(process.env.FORWARD_URL);
    const options = {
        hostname: url_params.hostname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postDataStr.length
        }
    };
    if( url_params.port )
        options.port = url_params.port;
    if( url_params.path )
        options.path = url_params.path;
    console.log(options);
    
    try{
        var http_request;
        if( url_params.protocol == 'https:')
            http_request = https;
        else
            http_request = http;

        const req = http_request.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (d) => {
                callback(null, JSON.parse(d));
            });
        });
        
        req.on('error', (e) => {
            console.error(e);
            callback(e);
        });
        
        req.write(postDataStr);
        req.end();
    }catch(error){
        callback(error);
    }
};
