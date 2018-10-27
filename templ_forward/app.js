'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var cors = require('cors');
app.use(cors());
require('dotenv').config();

app.set('case sensitive routing', true);
app.use(bodyParser.json());

var proxy_url = process.env.PROXY_URL || 'http://localhost:10010';
var path_post = process.env.PATH_POST || '/*';
var path_get = process.env.PATH_GET || '/*';

console.log('PROXY_URL:' + proxy_url);
console.log('PATH_POST:' + path_post);
console.log('PATH_GET:' + path_get);

var request = require('request');

app.post(path_post, (req, res) => {
//    console.log(req);
    var proxy_path = proxy_url + req.path;
    console.log('proxy_path ' + proxy_path);

    const headers = {};
    if( req.headers['content-type'] !== undefined )
        headers['Content-Type'] = req.headers['content-type'];
    if( req.headers['authorization'] !== undefined )
        headers['Authorization'] = req.headers['authorization'];
    if( req.headers['user-agent'] !== undefined )
        headers['User-Agent'] = req.headers['user-agent'];
    try{
        return request({
            url: proxy_path,
            qs: req.query,
            method: req.method,
            headers: headers,
            json: true,
            body: req.body
        }).pipe(res);
    }catch(error){
        console.log(error);
    }
});

app.get(path_get, (req, res) =>{
//    console.log(req);
    var proxy_path = proxy_url + req.path;
    console.log('proxy_path ' + proxy_path);

    const headers = {};
    if( req.headers['content-type'] !== undefined )
        headers['Content-Type'] = req.headers['content-type'];
    if( req.headers['authorization'] !== undefined )
        headers['Authorization'] = req.headers['authorization'];
    if( req.headers['user-agent'] !== undefined )
        headers['User-Agent'] = req.headers['user-agent'];
    try{
        return request({
            url: proxy_path,
            qs: req.query,
            method: req.method,
            headers: headers,
            json: true,
            body: req.body
        }).pipe(res);
    }catch(error){
        console.log(error);
    }
});

if (module === require.main) {
  const PORT = process.env.PORT || 80;
  app.listen(PORT, () => {
    console.log(`App listening on http port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });

  var https = require('https');
  var fs = require('fs');
  try{
    var options = {
      key:  fs.readFileSync('./cert/server.key'),
      cert: fs.readFileSync('./cert/server.crt'),
      ca: fs.readFileSync('./cert/JPRS_DVCA_G2_PEM.cer')
  //    key: fs.readFileSync('./cert/oreore/private-key.pem'),
  //    cert: fs.readFileSync('./cert/oreore/certificate.pem')
    };
    var sport = Number(process.env.SPORT) || 10443;
    var servers = https.createServer(options, app);
    console.log('https PORT=' + sport );
    servers.listen(sport, () => {
        console.log(`App listening on https port ${sport}`);
        console.log('Press Ctrl+C to quit.');
    });
  }catch(error){
//    console.log(error);
    console.log('can not load https');
  }
}

module.exports = app;
