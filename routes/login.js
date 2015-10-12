var requestId = 0;

exports.login = function(req,res){
	var user = req.body;
	var accountoperation = require('./accountoperation');
	console.log("Login Invoked \n");
	//console.log(req.session);
	accountoperation.verifyUser(user,res,req);
};

/*
exports.loginREST = function(req,res){
	deligateDBAccessRequest(req,res,requestId);
	requestId++;
};

function deligateRequest(req,res,requestId){
	var user = req.body;
	console.log("loginREST requestId ---> " + requestId );
	var DBConnections = require('./DBConnectionPool');
	setTimeout(function() { DBConnections.handleDBRequest("loginUser",user,res,req,requestId); }, 0);
};
*/

exports.home = function(req,res){
	var user = req.body;
	var accountoperation = require('./accountoperation');
	console.log("Home Redirection Invoked");
	console.log(req.session);
	var DBConnection = require('./DBConnection');
	console.log("login User");
	if((req.session.username != null && req.session.username != "") || req.session != {})
		DBConnection.handleDBRequest("loginUser",user,res,req);
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", user, req);
};

exports.logout = function(req,res){
	var user = req.body;
	req.session.destroy();
	console.log(JSON.stringify(req.session));
	res.status(200).send("Session Terminated!! Please close the browser for Safety.");
	//res.redirect('/');
};