exports.getNewsFeed = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username == null || req.session.username == "" ){
		accountoperation.userUnverified(res,"User Session is Invalid!! Please login to continue",{},req);
		//res.send("Error no Session Assoicated With Request");
	}else{
		accountoperation.getNewsFeeds({},res,req)	
	}
};

exports.postStatusUpdate = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username == null || req.session.username == "" ){	
		accountoperation.userUnverified(res,"User Session is Invalid!! Please login to continue",{},req);
		//res.send("Error no Session Assoicated With Request");
	}else{
		accountoperation.postStatusUpdate({},res,req)	
	}
};