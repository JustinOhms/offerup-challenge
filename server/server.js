var http = require('http');
var restify = require('restify');

var server = restify.createServer({
	name:"test"
});

//we will need to parse query strings (but only allow in the query string per spec)
server.use(restify.queryParser());


function itemPriceService(req, res, next){
	var item = req.query.item;
	var city = req.query.city;
	var other = req.query.other;

	//for now just echo the response
	res.contentType = 'json';
	res.send({
		'item':item,
		'city':city,
		'other':other
	});

	
	next();
}


//set mappings
//Your service should be able to take item & city parameters using the following pattern:
//http://127.0.0.1/item-price-service/?item=Furniture&city=Philadelphia
server.get('/item-price-service', itemPriceService);



server.listen(8080);
console.log('Restify Server listening on port 8080')

//
//http.createServer(function (req, res) {
//  //console.log(req);
//  //debugger;
//  res.writeHead(200, {'Content-Type': 'text/plain'});
//  res.end('SERVER IS RUNNING\n\n Request URL:\n ' + req.url);
//}).listen(8080);

//console.log('Server running on port 8080.');