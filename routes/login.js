exports.login = function(req,res){
	var user = req.body;
	var accountoperation = require('./accountoperation');
	console.log("Login Invoked");
	console.log(req.session);
	accountoperation.verifyUser(user,res,req);
};

exports.home = function(req,res){
	var user = req.body;
	var accountoperation = require('./accountoperation');
	console.log("Home Redirection Invoked");
	console.log(req.session);
	var DBConnection = require('./DBConnection');
	console.log("login User");
	if(req.session.username != null && req.session.username != "")
		DBConnection.handleDBRequest("loginUser",user,res,req);
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", user, req);
};

exports.logout = function(req,res){
	var user = req.body;
	req.session.destroy();
	res.redirect('/');
};