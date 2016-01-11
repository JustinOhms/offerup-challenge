var http = require('http');
var restify = require('restify');



var server = restify.createServer({
	name:"OfferUpChallenge"
});

//we will need to parse query strings (but only allow in the query string per spec)
server.use(restify.queryParser());

var itemPriceService = require('./api.js');


//set mappings
//Your service should be able to take item & city parameters using the following pattern:
//http://127.0.0.1/item-price-service/?item=Furniture&city=Philadelphia
server.get('/item-price-service', itemPriceService.read);


server.listen(8080);
console.log('Restify Server listening on port 8080')
