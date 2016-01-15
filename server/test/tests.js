var assert = require('assert');
var restify = require('restify');
var superagent = require('superagent');

//mocha tests written in assert style ... 
//TODO: change these to spec style
describe('OfferUp Challenge API Test', function(){
	var server;
	
	before(function(){
		server = restify.createServer({
			name:"OfferUpChallengeTest"
		})
		
		server.use(restify.queryParser());
		
		var itemPriceService = require('../api.js');

		server.get(/^\/item-price-service(?:\/)?$/i, itemPriceService.read);

		server.listen(8888);
	});
	
	//test to just test that test are running
	it('mocha tests can run', function(done){
		done();
	});
	
	//test to read chairs in seattle //count 60 @ mode 29
	it('Chairs in Seattle', function(done){
		this.timeout(5000);
		superagent.get("http://localhost:8888/item-price-service/?item=Chairs&city=Seattle", function(err, res){
			//console.log(res.body);
			var json = res.body;
			assert.equal(json.status, 200);
			assert.equal(json.content.item, "Chairs");
			assert.equal(json.content.item_count, 60);
			assert.equal(json.content.price_suggestion, 29);
			assert.equal(json.content.city, "Seattle");
			
			done();
		});
	});
	
	//test not a real item should return 404
	it('NotARealItem in Seattle', function(done){
		this.timeout(5000);
		superagent.get("http://localhost:8888/item-price-service/?item=NotARealitem&city=Seattle", function(err, res){
			//console.log(res.body);
			var json = res.body;
			assert.equal(404, json.status);
			assert.equal("Not found",json.content.message);
			done();
		});
	});
	
	//test to read chairs in all cities  //count 897 @ mode 35
 	it('Chairs in all cities', function(done){
 		this.timeout(5000);
		superagent.get("http://localhost:8888/item-price-service/?item=Chairs", function(err, res){
			//console.log(res.body);
			var json = res.body;
			assert.equal(json.status, 200);
			assert.equal(json.content.item, "Chairs");
			assert.equal(json.content.item_count, 897);
			assert.equal(json.content.price_suggestion, 35);
			assert.equal(json.content.city, "Not specified");
			
			done();
		});
	});
	
	//test to read chairs in all cities  //count 897 @ mode 35  (used for checking cache hits in console)
 	it('Chairs in all cities #2', function(done){
 		this.timeout(5000);
		superagent.get("http://localhost:8888/item-price-service/?item=Chairs", function(err, res){
			//console.log(res.body);
			var json = res.body;
			assert.equal(json.status, 200);
			assert.equal(json.content.item, "Chairs");
			assert.equal(json.content.item_count, 897);
			assert.equal(json.content.price_suggestion, 35);
			assert.equal(json.content.city, "Not specified");
			
			done();
		});
	});
	
 	
		
	//no city nowhere return 404
 	it('nothing nowhere should return 404', function(done){
		superagent.get("http://localhost:8888/item-price-service/", function(err, res){
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
