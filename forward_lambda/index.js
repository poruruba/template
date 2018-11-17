const request = require('request');

exports.handler = (event, context, callback) =>{
    console.log(event);
    console.log(context);
    
    var options = {
        url: process.env.FORWARD_URL,
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        json: {
            event: event,
            context: context
        }
    };

    return request(options, function (error, response, body) {
        if( error ){
            callback(error);
            return;
        }

        callback(null, JSON.parse(body));
    });
};
