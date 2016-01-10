var http = require('http');



http.createServer(function (req, res) {
  //console.log(req);
  //debugger;
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('SERVER IS RUNNING\n\n Request URL:\n ' + req.url);
}).listen(8080);

console.log('Server running on port 8080.');