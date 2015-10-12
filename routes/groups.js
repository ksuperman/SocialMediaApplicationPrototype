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

exports.navToGroupDetailPage = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){	
		console.log("Group ID Got in the Get Request : " + req.query.groupid);
		req.session.groupid = req.query.groupid;
		//res.redirect("/groupDetailPage");
		accountoperation.navToGroupDetailPage({},res,req);
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};

exports.groupDetailPage = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		if(req.session.groupid != null && req.session.groupid != "")
			accountoperation.navToGroupDetailPage({},res,req);
		else
			res.status(404).send("Please drilldown on the Group to get the group information for!!");
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};

exports.getGroupDetails = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		if(req.session.groupid != null && req.session.groupid != "")
			accountoperation.getGroupDetails({},res,req);
		else
			res.status(404).send("Please drilldown on the Group to get the group information for!!");
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};

exports.getGroupUserList = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){	
		if(req.session.groupid != null && req.session.groupid != "")
			accountoperation.getGroupUserList({},res,req);
		else
			res.status(404).send("Please drilldown on the Group to get the group information for!!");
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};

exports.getGroupNonMembers = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){	
		if(req.session.groupid != null && req.session.groupid != "")
			accountoperation.getGroupNonMembers({},res,req);
		else
			res.status(404).send("Please drilldown on the Group to get the group information for!!");
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};


exports.addUserToGroupAdmin = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		accountoperation.addUserToGroupAdmin(req.body,res,req);
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};

exports.removeUserFromGroupAdmin = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		accountoperation.removeUserFromGroupAdmin(req.body,res,req);
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};

exports.deleteGroup = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		accountoperation.deleteGroup(req.body,res,req);
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);	
};
