exports.userdetails = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		accountoperation.renderUserDetailsPage({},res,req);
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
	//res.render('userdetails', { user: JSON.stringify({})});
};

exports.getLifeEvents = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		accountoperation.getLifeEvents({},res,req);
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};

exports.groups = function(req,res){
	
};