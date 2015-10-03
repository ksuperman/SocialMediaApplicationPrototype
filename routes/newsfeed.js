exports.getNewsFeed = function(req,res){
	if(req.session.username == null || req.session.username == "" ){
		var accountoperation = require('./accountoperation');
		accountoperation.userUnverified(res,"User Session is Invalid!! Please login to continue",{},req);
		//res.send("Error no Session Assoicated With Request");
	}else{
		var accountoperation = require('./accountoperation');
		accountoperation.getNewsFeeds({},res,req)	
	}
};

exports.postStatusUpdate = function(req,res){
	if(req.session.username == null || req.session.username == "" ){
		var accountoperation = require('./accountoperation');
		accountoperation.userUnverified(res,"User Session is Invalid!! Please login to continue",{},req);
		//res.send("Error no Session Assoicated With Request");
	}else{
		var accountoperation = require('./accountoperation');
		accountoperation.postStatusUpdate({},res,req)	
	}
};