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

exports.uploadProfilePic = function(req,res){
	var accountoperation = require('./accountoperation');
	if(req.session.username != null && req.session.username != ""){
		console.log(req);
		var fs = require('fs');
		fs.readFile(req.files.pofilepic.path, function (err, data) {
			fs.exists(req.files.pofilepic.path)
			  var newPath = "/home/rakshithk/workspace/SocialMediaApplicationPrototype/public/uploads/"+req.files.pofilepic.name;
			  console.log("File newPath " + "");
			  fs.writeFile(newPath, data, function (err) {
				  console.log("File Uploaded" + err);
				  accountoperation.updateProfilePicture({newPath: "/public/uploads/"+req.files.pofilepic.name},res,req)
				  //accountoperation.renderUserDetailsPage({},res,req);
		  });
		});
	}
	else
		accountoperation.userUnverified(res, "Invalid Session Please Login to Continue!!", {}, req);
};
