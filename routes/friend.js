exports.loadFriendList = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username == null || req.session.username == "" ){
		accountoperation.userUnverified(res,"User Session is Invalid!! Please login to continue",{},req);
		//res.send("Error no Session Assoicated With Request");
	}else{
		var user = req.body;
		accountoperation.loadFriendList(user,res,req);
	}
};

exports.sendFiendRequest = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username == null || req.session.username == "" ){
		accountoperation.userUnverified(res,"User Session is Invalid!! Please login to continue",{},req);
		//res.send("Error no Session Assoicated With Request");
	}else{
		var user = req.body;
		accountoperation.sendFiendRequest(user,res,req);
	}
};