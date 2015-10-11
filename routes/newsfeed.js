exports.getNewsFeed = function(req,res){
	var accountoperation = require('./accountoperation');
	console.log("newsFeed " + req.session.username);
	console.log("newsFeed expr " + ( typeof req.session.username === 'undefined' && !req.session.username)) ;
	if(req.session.username == null || req.session.username == "" || ( typeof req.session.username === 'undefined' && !req.session.username)){
		console.log("No Seesion Newsfeed");
		accountoperation.userUnverified(res,"User Session is Invalid!! Please login to continue",{},req);
		
		//res.send("Error no Session Assoicated With Request");
	}else{
		accountoperation.getNewsFeeds({},res,req)	
	}
};

exports.postStatusUpdate = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username == null || req.session.username == "" || typeof req.session.username == 'undefined' ){	
		accountoperation.userUnverified(res,"User Session is Invalid!! Please login to continue",{},req);
		//res.send("Error no Session Assoicated With Request");
	}else{
		accountoperation.postStatusUpdate({},res,req)	
	}
};