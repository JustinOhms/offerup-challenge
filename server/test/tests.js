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
		this.timeout(5000);
		superagent.get("http://localhost:8080/item-price-service?item=Chairs&city=Seattle", function(err, res){
			//console.log(res.body);
			var json = res.body;
			assert.equal(json.status, 200);
			assert.equal(json.content.item, "Chairs");
			assert.equal(json.content.item_count, 5);
			assert.equal(json.content.price_suggestion, 146);
			assert.equal(json.content.city, "Seattle");
			
			done();
		});
	});
	
	//test to read chairs in all cities  //count 104 @ mode 156
 	it('Chairs in all cities', function(done){
 		this.timeout(5000);
		superagent.get("http://localhost:8080/item-price-service?item=Chairs", function(err, res){
			console.log(res.body);
			var json = res.body;
			assert.equal(json.status, 200);
			assert.equal(json.content.item, "Chairs");
			assert.equal(json.content.item_count, 104);
			assert.equal(json.content.price_suggestion, 156);
			assert.equal(json.content.city, "Not specified");
			
			done();
		});
	});
	
	
	//test to read chairs in all cities  //count 104 @ mode 156
 	it('nothing nowhere should return 404', function(done){
		superagent.get("http://localhost:8080/item-price-service", function(err, res){
			//console.log(res.body);
			var json = res.body;
			assert.equal(404, json.status);
			assert.equal("Not found",json.content.message);
			done();
		});
	});
	
	
	after(function(){
		server.close();
	});
	
});
