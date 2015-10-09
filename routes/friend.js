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

exports.friendslist = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		accountoperation.renderFriendListPage({},res,req);
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};

exports.loadMyFriendList = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username == null || req.session.username == "" ){
		accountoperation.userUnverified(res,"User Session is Invalid!! Please login to continue",{},req);
		//res.send("Error no Session Assoicated With Request");
	}else{
		var user = req.body;
		accountoperation.loadMyFriendList(user,res,req);
	}
};

exports.loadPendingFriendList = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username == null || req.session.username == "" ){
		accountoperation.userUnverified(res,"User Session is Invalid!! Please login to continue",{},req);
		//res.send("Error no Session Assoicated With Request");
	}else{
		var user = req.body;
		accountoperation.loadPendingFriendList(user,res,req);
	}
};

exports.rejectFriendRequest = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username == null || req.session.username == "" ){
		accountoperation.userUnverified(res,"User Session is Invalid!! Please login to continue",{},req);
		//res.send("Error no Session Assoicated With Request");
	}else{
		var user = req.body;
		accountoperation.rejectFriendRequest(user,res,req);
	}
};

exports.acceptFriendRequest = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username == null || req.session.username == "" ){
		accountoperation.userUnverified(res,"User Session is Invalid!! Please login to continue",{},req);
		//res.send("Error no Session Assoicated With Request");
	}else{
		var user = req.body;
		accountoperation.acceptFriendRequest(user,res,req);
	}
};

exports.unFriendUserRequest = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username == null || req.session.username == "" ){
		accountoperation.userUnverified(res,"User Session is Invalid!! Please login to continue",{},req);
		//res.send("Error no Session Assoicated With Request");
	}else{
		var user = req.body;
		accountoperation.unFriendUserRequest(user,res,req);
	}
};