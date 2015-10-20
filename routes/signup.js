exports.signup = function(req, res){
	
	var accountoperation = require('./accountoperation');
	
	//Getting User Object from Request
	var user = req.body;
	
	console.log("Recieved Request for Account Creation " + JSON.stringify(user));
	
	//Hard coded Default Image URL
	user.IMAGE_URL="/images/profile-photo_default.jpg";
	accountoperation.createUser(user,res,req);
};