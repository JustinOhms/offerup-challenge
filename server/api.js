exports.read = function(req, res, next){
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
	};
