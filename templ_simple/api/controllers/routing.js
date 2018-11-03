'use strict';

/* 関数を以下に追加する */
const func_table = {
//  "test-func" : require('./test_func').handler,
//  "test-dialogflow" : require('./test_dialogflow').fulfillment,
};
const alexa_table = {
  //  "test-alexa" : require('./test_alexa').handler,
};
const lambda_table = {
//  "test-lambda" : require('./test_lambda').handler,
};
/* ここまで */

/* 必要に応じて、バイナリレスポンスのContent-Typeを以下に追加する */
const binary_table = [
//  'application/octet-stream',
];
/* ここまで */

var exports_list = {};
for( var operationId in func_table ){
  exports_list[operationId] = routing;
}
for( var operationId in alexa_table ){
  exports_list[operationId] = routing;
}
for( var operationId in lambda_table ){
  exports_list[operationId] = routing;
}

module.exports = exports_list;

function routing(req, res) {
//  console.log(req);

  var operationId = req.swagger.operation.operationId;
  console.log('[' + operationId + ' calling]');

  try{
    var event;
    var func;
    if( func_table.hasOwnProperty(operationId) ){
      event = {
        headers: req.headers,
        body: JSON.stringify(req.body),
        path: req.swagger.apiPath,
        httpMethod: req.method,
        queryStringParameters: req.query,
        requestContext: ( req.requestContext ) ? req.requestContext : {}
      };
    
      if( event.headers['content-type'] )
        event.headers['Content-Type'] = event.headers['content-type'];
      if( event.headers['authorization'] )
        event.headers['Authorization'] = event.headers['authorization'];
      if( event.headers['user-agent'] )
        event.headers['User-Agent'] = event.headers['user-agent'];

      func = func_table[operationId];
      res.func_type = "normal";
    }else if( alexa_table.hasOwnProperty(operationId) ){
      event = req.body;

      func = alexa_table[operationId];
      res.func_type = "alexa";
    }else if( lambda_table.hasOwnProperty(operationId) ){
      event = req.body.event;

      func = lambda_table[operationId];
      res.func_type = "lambda";
    }else{
      console.log('can not found operationId: ' + operationId);
      return_error(res, new Error('can not found operationId'));
      return;
    }
    //  console.log(event);

    var context = {
      succeed: (msg)=>{
        console.log('succeed called');
        return_response(res, msg);
      },
      fail: (error) => {
        console.log('failed called');
        return_error(res, error);
      }
    };

    var task = func(event, context, (error, response) =>{
      console.log('callback called');
      if( error )
        return_error(res, error);
      else
        return_response(res, response);
    });
    if( task === undefined ){
      return;
    }else if( task instanceof Promise ){
      task.then(ret =>{
        if( ret ){
          console.log('promise is called');
          return_response(res, ret);
        }
      });
    }else{
      console.log('return called');
      return_response(res, task);
    }
  }catch(err){
    console.log('error throwed');
    return_error(res, err);
  }
}

function return_error(res, err){
  res.status(500);
  res.json({ errorMessage: err.toString() });
}

function return_response(res, ret){
  if( ret.statusCode )
    res.status(ret.statusCode);
  for( var key in ret.headers )
    res.set(key, ret.headers[key]);

//  console.log(ret.body);

  if (!res.get('Content-Type'))
    res.type('application/json');

  if( binary_table.indexOf(res.get('Content-Type')) >= 0 ){
    var bin = new Buffer(ret.body, 'base64')
    res.send(bin);
  }else{
    if( res.func_type == 'alexa' || res.func_type == 'lambda'){
      res.send(JSON.stringify(ret));
    }else{
      if( ret.body )
        res.send(ret.body);
    }
  }
}
