var pg = require('pg');
var conString = "postgres://offerupchallenge:ouchallenge@offerupchallenge.cgtzqpsohu0g.us-east-1.rds.amazonaws.com/itemprices"



exports.read = function(req, res, next){
		var item = req.query.item;
		var city = req.query.city;
	
		var queryParams;
		var whereclause;
		
		//Guards
		//if we neither city or item were provided then send the 404 error
		if(item == undefined && city == undefined){
			res.send({
				"status":404,
				"content":{
					"message":"Not found"
				}
			});
			next();
		}

		//adjust the where clause and parameters depending on if we have a city or not
		if(city == undefined){
			whereclause = " WHERE title = $1  "; 
			queryParams = [item];
		}else{
			whereclause = " WHERE title = $1 AND city = $2 "; 
			queryParams = [item, city];
		}
		
		
		
		//construct the query
		var queryTemplate = "WITH item AS ( " +
			" SELECT id, title, list_price, sell_price, city, cashless  FROM \"itemPrices_itemsale\" " +
			whereclause + 
			" ) SELECT MODE() WITHIN GROUP (ORDER BY list_price DESC ) AS price_suggestion, " +
			"    count(id) AS item_count, " +
			"    MAX(title) as item" +
			" FROM item ;";

		
		
		//get a connection from the connection pool
		pg.connect(conString, function(err, client, done){
			
		    var handleError = function(err) {
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

		      // handle an error from the connection
		      if(handleError(err)){ return; }

		      
		      client.query(queryTemplate, queryParams, function(err, result){
		    	 
		    	  if(handleError(err)){ return;}
		    	  
		    	  done(); //return the pg connection to the pool

		    	  var content = result.rows[0];
		    	      content.city = city == undefined ? "Not specified" : city;
		    	  
		    	  res.contentType = 'json';
		    	  res.send({
		    		  "status":200,
		    		  "content":content
		    	  });
		    	  next();
		      });
			
		});
		

	};
