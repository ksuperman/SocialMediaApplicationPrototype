module.exports = {
		createUser : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("createUser",user,res,req);
		},
		userCreationError : function(res,error,newuser,req){
			if(error.code == "ER_DUP_ENTRY")
				newuser.errorMessage = "This email is already registered to another user!";
			else{
				console.log("userCreationError == " + error);
				newuser.errorMessage = "Error creating user!! Please try Again";
				newuser.emailR = newuser.emailM;
			}	
			newuser.password = "";
			newuser.errorInForm = true;
			res.render('index', { user: JSON.stringify(newuser),login:JSON.stringify({})});
		},
		userCreated : function(res,data,req){
			data.username = data.emailR;
			userLogin(res,data,req);
		},
		verifyUser : function(user,res,req){
			if(req.session.username != null && req.session.username != ""){
				
			}
			var DBConnection = require('./DBConnection');
			console.log("Verify User");
			DBConnection.handleDBRequest("verifyUser",user,res,req);
		},
		userVerified : function(user,res,req){
			userLogin(res,user,req);
		},
		userUnverified : function(res,error,user,req){
			user.errorInloginForm = true;
			user.errorMessage = error;
			res.render('index', { user: JSON.stringify({}),login:JSON.stringify(user)});
		},
		homeRedirection : function(user,res,req){
			console.log(user);
			res.render('home', { user: JSON.stringify(user)});	
		},
		getNewsFeeds : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("getNewsFeed",user,res,req);
		},
		postStatusUpdate : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("postStatusUpdate",user,res,req);
		}
};

function userLogin(res,data,req){
	//console.log(req);
	var userName = data.username;
	console.log("userName " + userName);
	if(req.session.username == "" || req.session.username == null){
		req.session.username = data.emailM;
		req.session.firstname = data.firstname;
		req.session.lastname = data.lastname;
		req.session.ROW_ID = data.ROW_ID;
		console.log("Session set" + req.session.username + "," + req.session.ROW_ID + "," + req.session.firstname);
	}
	console.log("Exisiting Session " + req.session.username + "," + req.session.ROW_ID + "," + req.session.firstname);
	res.redirect("/home");
	//res.render('home', { user: JSON.stringify(data)});	
};