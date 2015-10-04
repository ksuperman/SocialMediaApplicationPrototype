exports.groups = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		accountoperation.renderGroupsPage({},res,req);
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
	//res.render('groups', { user: JSON.stringify({})});	
};

exports.loadAllGroups = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		accountoperation.loadAllGroups({},res,req);
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};

exports.loadMyGroups = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		accountoperation.loadMyGroups({},res,req);
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};

exports.addUserToGroup = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		accountoperation.addUserToGroup(req.body,res,req);
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};

exports.removeUserFromGroup = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		accountoperation.removeUserFromGroup(req.body,res,req);
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};

exports.createGroup = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		var data = req.body;
		data.IMAGE_URL = "/images/group_thumbnail.jpg";//Default Image to Group
		accountoperation.createGroup(req.body,res,req);
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};

