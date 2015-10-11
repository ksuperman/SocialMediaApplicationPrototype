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
			console.log("Verify User in Account Operation\n ");
			DBConnection.handleDBRequest("verifyUser",user,res,req);
		},
		userVerified : function(user,res,req){
			userLogin(res,user,req);
		},
		userUnverified : function(res,error,user,req){
			if(error != null && error != ""){
				user.errorInloginForm = true;
				user.errorMessage = error;	
			}
			res.render('index', { user: JSON.stringify({}),login:JSON.stringify(user)});
		},
		homeRedirection : function(user,res,req){
			console.log("Finally Responsed " + JSON.stringify(user));
			res.render('home', { user: JSON.stringify(user)});	
		},
		getNewsFeeds : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("getNewsFeed",user,res,req);
		},
		postStatusUpdate : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("postStatusUpdate",user,res,req);
		},
		loadFriendList : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("loadFriendList",user,res,req);
		},
		sendFiendRequest : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("sendFiendRequest",user,res,req);
		},
		renderFriendListPage : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("renderFriendListPage",user,res,req);
		},
		FriendListPageRedirect : function(data,res, req){
			console.log(data);
			res.render('friendslist', { user: JSON.stringify(data)});	
		},
		loadMyFriendList : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("loadMyFriendList",user,res,req);
		},
		loadPendingFriendList : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("loadPendingFriendList",user,res,req);
		},
		rejectFriendRequest : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("rejectFriendRequest",user,res,req);
		},
		acceptFriendRequest : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("acceptFriendRequest",user,res,req);
			//DBConnection.handleDBRequest("addOtherUserFriendRequest",user,res,req);
		},
		renderUserDetailsPage : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("renderUserDetailsPage",user,res,req);
		},
		userDetailsPageRedirect : function(data,res, req){
			console.log(data);
			res.render('userdetails', { user: JSON.stringify(data)});	
		},
		getLifeEvents : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("getLifeEvents",user,res,req);
		},
		updateProfilePicture : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("updateProfilePicture",user,res,req);
		},
		renderGroupsPage  : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("renderGroupsPage",user,res,req);
		},
		groupPageRedirect : function(data,res, req){
			console.log(data);
			res.render('groups', { user: JSON.stringify(data)});	
		},
		loadAllGroups : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("loadAllGroups",user,res,req);
		},
		loadMyGroups : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("loadMyGroups",user,res,req);
		},
		addUserToGroup : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("addUserToGroup",user,res,req);
		},
		removeUserFromGroup : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("removeUserFromGroup",user,res,req);
		},
		createGroup : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("createGroup",user,res,req);
		},
		unFriendUserRequest : function(user,res,req){
			var DBConnection = require('./DBConnection');
			DBConnection.handleDBRequest("unFriendUserRequest",user,res,req);
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
	}else
		console.log("Exisiting Session " + req.session.username + "," + req.session.ROW_ID + "," + req.session.firstname);
	res.redirect("/home");
	//res.render('home', { user: JSON.stringify(data)});	
};