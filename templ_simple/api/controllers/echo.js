'use strict';

module.exports = {
  echo: echo,
  test_post: test,
  test_get: test
};

function echo(req, res) {
    console.log("calling: echo");

    res.json({ message: req.body});
}

function test(req, res) {
  console.log("calling: test");

  var event = {
    headers: req.headers,
    body: JSON.stringify(req.body),
    path: req.swagger.apiPath,
    httpMethod: req.method,
    queryStringParameters: req.query
  };

  res.json( { event: event } );
}
