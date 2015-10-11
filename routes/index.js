exports.index = function(req, res){
	console.log("This is the Index" + req.session.username);
	if(req.session.username != "" && req.session.username != null){
		var accountoperation = require('./accountoperation');
		accountoperation.verifyUser(req.body,res,req);
	}
	else
		res.render('index', { user: JSON.stringify({}),login:JSON.stringify({})});
};