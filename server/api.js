exports.read = function(req, res, next){
		var item = req.query.item;
		var city = req.query.city;
		var other = req.query.other;
	
		
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
		
		
		
		
		//for now just echo the response
		res.contentType = 'json';
		res.send({
			'item':item,
			'city':city,
			'other':other
		});
		next();
	};
