var cache =  require('memory-cache');

var pg = require('pg').native;
var conString = "postgres://offerupchallenge:ouchallenge@offerupchallenge.cgtzqpsohu0g.us-east-1.rds.amazonaws.com/itemprices"
	
	
	pg.defaults.poolSize = 50;
    pg.defaults.reapIntervalMillis = 10000;

    
    
/*
 * generates our unique key for the cache
 */    
var keygen = function(item, city){
	//TODO: replace with hashing function
	return city == undefined || city == null ? item : city + item;
};    


/**
 * returns a {template, params} map
 */
var queryGen = function(item, city){
	//adjust the where clause and parameters depending on if we have a city or not
	if(city == undefined){
		return{
			template:"WITH item AS ( " +
			" SELECT id, title, list_price, sell_price, city, cashless  FROM \"itemPrices_itemsale\" " +
			" WHERE title = $1  " + 
			" ) SELECT " +
			"    MAX(title) as item," +
			"    count(id) AS item_count, " +
			"   MODE() WITHIN GROUP (ORDER BY list_price DESC ) AS price_suggestion " +
			" FROM item ;",
			params:[item]
		}
	}else{
		return{
			template:"WITH item AS ( " +
			" SELECT id, title, list_price, sell_price, city, cashless  FROM \"itemPrices_itemsale\" " +
			" WHERE title = $1 AND city = $2 " + 
			" ) SELECT " +
			"    MAX(title) as item," +
			"    count(id) AS item_count, " +
			"   MODE() WITHIN GROUP (ORDER BY list_price DESC ) AS price_suggestion " +
			" FROM item ;",
			params:[item, city]
		}
	}
}

var sendResponse = function(res, responseObject){
	   res.contentType = "json";
	   res.send(responseObject);
}  

var cacheResponse = function(item, city, responseObject){
		var key = keygen(item, city);

		cache.put(key, responseObject, 30000);
}

 var generateResponseObject = function(content, city){
		  content.city = city == undefined ? "Not specified" : city;
		  return({
			  "status":200,
			  "content":content
		  });
 }

 

exports.read = function(req, res, next){
		var item = req.query.item;
		var city = req.query.city;
	
		console.log("Request: city:" + city + " item:" +item);
		
		//Guards
		//city is optional but you must at least provide an item
		//if we neither city or item were provided then send the 404 error
		if(item == undefined || ( item == undefined && city == undefined)){
			res.send({
				"status":404,
				"content":{
					"message":"Not found"
				}
			});
			next();
		}


		//handle's postgress connection errors, closes client connection
	    var handlePgConnectionError = function(err, client) {
	        // no error occurred, continue with the request
	        if(!err) { return false; }

	        // An error occurred, remove the client from the connection pool.
	        // A truthy value passed to done will remove the connection from the pool
	        // instead of simply returning it to be reused.
	        // In this case, if we have successfully received a client (truthy)
	        // then it will be removed from the pool.
	        if(client){
	          done(client);
	        }
	        
	        res.end('An error occurred: ' + err);
	        return true;
	      };


	    
		
	    
		var connectAndQuery = function(item, city){
			
			//generate the the query
			query = queryGen(item, city);
			
			//get a connection from the connection pool
			pg.connect(conString, function(err, client, done){
			      
			      // handle an error from the connection
			      if(handlePgConnectionError(err, client)){ return; }

			      
			      client.query(query.template, query.params, function(err, result){
			    	 
			    	  if(handlePgConnectionError(err, client)){ return;}
			    	  
			    	  done(); //return the pg connection to the pool

			    	  
			    	  //content object structure is correct json as returned from the database but we need to add the city
			    	  var responseObject = generateResponseObject(result.rows[0], city);
			    	  cacheResponse(item, city, responseObject)
			    	  sendResponse(res, responseObject);
			    	  next();
			      });
				
			});
		}
		
		
		var key = keygen(item, city);
		
		var responseObject = cache.get(key);
		if(responseObject == null){
			console.log("cache MISS")
			connectAndQuery(item, city);
		}else{
			console.log("cache hit")
			sendResponse(res, responseObject);
		}
	

	};
