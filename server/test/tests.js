var assert = require('assert');
var restify = require('restify');
var superagent = require('superagent');

describe('OfferUp Challenge API Test', function(){
	var server;
	
	before(function(){
		server = restify.createServer({
			name:"OfferUpChallengeTest"
		})
		
		server.use(restify.queryParser());
		
		var itemPriceService = require('../api.js');

		server.get('/item-price-service', itemPriceService.read);
		
		server.listen(8080);
	});
	
	//test to just test that test are running
	it('mocha tests can run', function(done){
		done();
	});
	
	//test to read chairs in seattle //count 5 @ mode 146
	it('Chairs in Seattle', function(done){
		superagent.get("http://localhost:8080/item-price-service?item=Chairs&city=seattle", function(err, res){
			//console.log(res.body);
			var json = res.body;
			assert.equal(200, json.status);
			assert.equal("Chairs",json.content.item);
			assert.equal(5, json.content.item_count);
			assert.equal(146, json.content.price_suggestion);
			assert.equal("Not specified",json.content.city);
			done();
		});
	});
	
	//test to read chairs in all cities  //count 104 @ mode 156
 	it('Chairs in all cities', function(done){
		superagent.get("http://localhost:8080/item-price-service?item=Chairs", function(err, res){
			//console.log(res.body);
			var json = res.body;
			assert.equal(200, json.status);
			assert.equal("Chairs",json.content.item);
			assert.equal(104, json.content.item_count);
			assert.equal(156, json.content.price_suggestion);
			assert.equal("Not specified",json.content.city);
			
			done();
		});
	});
	
	
	after(function(){
		server.close();
	});
	
});
