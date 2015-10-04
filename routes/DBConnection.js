module.exports = {

	handleDBRequest : function(operation,data,res,req){
		console.log("	handleDBRequest" + req);
		
		switch(operation){
		case "createUser" :
			console.log("CreateUser");
			var bcrypt = require('bcrypt');
			
			//Getting User Object from Request
			var FIRST_NAME = data.firstname;
			var LAST_NAME = data.lastname;
			var EMAIL_ADDR = data.emailM;
			var DATE_OF_BIRTH = data.dateofbirth;
			var PASSWORD = data.password;
			var GENDER = data.gender;

			//Getting Salt Value and Encrypting Password
			var salt = bcrypt.genSaltSync(10);
			data.password = bcrypt.hashSync(PASSWORD, salt);	
			
			//Debug information
			console.log(JSON.stringify(data));
			console.log(FIRST_NAME);
			console.log(LAST_NAME);
			console.log(EMAIL_ADDR);
			console.log(DATE_OF_BIRTH);
			console.log(PASSWORD);
			console.log(GENDER);
			//console.log(bcrypt);
			//console.log(salt);
			console.log(PASSWORD);
			console.log( data.IMAGE_URL);
						
			var fieldmap = { firstname: "FIRST_NAME" , lastname: "LAST_NAME" , emailM: "EMAIL_ADDR" , dateofbirth: "DATE_OF_BIRTH" , password: "PASSWORD" , gender: "GENDER",IMAGE_URL : "IMAGE_URL"};
			
			var newuser = {};
			
			for (var key in data) {
			  if (data.hasOwnProperty(key) && fieldmap[key] != null && fieldmap[key] != "") {
			    console.log(key + " -> " + data[key]);
			    newuser[fieldmap[key]] = data[key]
			  }
			}

			console.log(newuser);
			
			var sql_stmt = 'INSERT INTO USERS SET ?';
			
			executeInsertQuery(sql_stmt,newuser,req,res,operation);
			break;
			
		case "verifyUser" :
		case "loginUser" :
			console.log(operation);
			console.log(data);
			if(req.session.username != null && req.session.username != "")
				data.username =  req.session.username;
			var sql_query = "SELECT * FROM USERS WHERE EMAIL_ADDR = '" + data.username + "'";
			executeSelectQuery(sql_query,data,req,res,operation);	
			break;
			
		case "getNewsFeed" :
			if(req.session.username != null && req.session.username != "")
				data.username =  req.session.username;
		//	var sql_query = "SELECT * FROM NEWSFEEDS WHERE USER_ID = ( SELECT ROW_ID FROM USERS WHERE EMAIL_ADDR= '" + data.username + "')";
			
			var sql_query = "SELECT news.POST_MESSAGE as 'POST_MESSAGE',user.FIRST_NAME AS 'FIRST_NAME',user.IMAGE_URL as'IMAGE_URL',user.LAST_NAME AS 'LAST_NAME'";
				sql_query += "FROM NEWSFEEDS news, USERS user where user.ROW_ID = news.USER_ID AND ";
				sql_query += "(news.USER_ID = " + req.session.ROW_ID + " OR news.USER_ID IN (SELECT USER2 FROM FRIENDS_LIST WHERE USER1 = '" + req.session.ROW_ID + "' AND ACCEPTED = 'Y')) ORDER BY news.TIMESTAMP DESC";
			
			executeSelectQuery(sql_query,data,req,res,operation);
			break;
			
		case "postStatusUpdate" :
			if(req.session.username != null && req.session.username != "")
				data.username =  req.session.username;
			
			var newpost = {};
			
			newpost.USER_ID = req.session.ROW_ID;
			newpost.POST_MESSAGE = req.body.POST_MESSAGE;
			newpost.IMAGE_URL = req.body.IMAGE_URL; 

			console.log(newpost);
			
			var sql_stmt = 'INSERT INTO NEWSFEEDS SET ?';
			
			executeInsertQuery(sql_stmt,newpost,req,res,operation);
			break;
			
		case "loadFriendList" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query = "SELECT ROW_ID, FIRST_NAME, LAST_NAME, EMAIL_ADDR, DATE_OF_BIRTH,GENDER, IMAGE_URL FROM USERS WHERE ROW_ID <> " + req.session.ROW_ID + " AND ROW_ID NOT IN (SELECT USER2 FROM FRIENDS_LIST WHERE USER1 = " + req.session.ROW_ID + ") LIMIT 15";
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			
		case "sendFiendRequest" :
			if(req.session.username != null && req.session.username != ""){
				var sql_stmt = 'INSERT INTO FRIENDS_LIST SET ?';
				var newfriendReq = {};
				
				newfriendReq.USER1 = req.session.ROW_ID;
				newfriendReq.USER2 = req.body.friendId;
				
				executeInsertQuery(sql_stmt,newfriendReq,req,res,operation);
				
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			
		case "renderFriendListPage" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query = "SELECT ROW_ID, FIRST_NAME, LAST_NAME, EMAIL_ADDR, DATE_OF_BIRTH,GENDER, IMAGE_URL FROM USERS WHERE ROW_ID = " + req.session.ROW_ID;
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			
		case "loadMyFriendList" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query = "SELECT ROW_ID, FIRST_NAME, LAST_NAME, EMAIL_ADDR, DATE_OF_BIRTH,GENDER, IMAGE_URL FROM USERS WHERE ROW_ID IN (SELECT USER2 FROM FRIENDS_LIST WHERE USER1 = " + req.session.ROW_ID + " AND ACCEPTED = 'Y')";
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			
		case "loadPendingFriendList" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query = "SELECT ROW_ID, FIRST_NAME, LAST_NAME, EMAIL_ADDR, DATE_OF_BIRTH,GENDER, IMAGE_URL FROM USERS WHERE ROW_ID IN (SELECT USER1 FROM FRIENDS_LIST WHERE USER2 = " + req.session.ROW_ID + " AND ACCEPTED = 'N')";
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			
		case "rejectFriendRequest" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query = "DELETE FROM FRIENDS_LIST WHERE USER1 = " + req.body.ROW_ID + " AND USER2 = " + req.session.ROW_ID + " AND ACCEPTED = 'N'";
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			
		case "acceptFriendRequest" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query = "UPDATE FRIENDS_LIST SET ACCEPTED = 'Y' WHERE USER1 = " + req.body.ROW_ID + " AND USER2 = " + req.session.ROW_ID + " AND ACCEPTED = 'N';";
				sql_query += "INSERT INTO FRIENDS_LIST (USER1, USER2, ACCEPTED) VALUES ('" + req.session.ROW_ID + "', '" + req.body.ROW_ID + "', 'Y');";
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
		/*	
		case "addOtherUserFriendRequest" :
			if(req.session.username != null && req.session.username != ""){
				var sql_stmt = 'INSERT INTO FRIENDS_LIST SET ?';
				var newfriendReq = {};
				
				newfriendReq.USER1 = req.session.ROW_ID;
				newfriendReq.USER2 = req.body.ROW_ID;
				newfriendReq.ACCEPTED = "Y";
				
				executeInsertQuery(sql_stmt,newfriendReq,req,res,operation);
				
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			*/
		case "renderUserDetailsPage" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query = "SELECT usd.PHONE as 'PHONE',usd.CURR_CITY as 'CURR_CITY',usd.ABOUT_ME,usd.HOME_ADDR as 'HOME_ADDR', usd.WEB_URL as 'WEB_URL', usd.PROFESSIONAL_SKILLS as 'PROFESSIONAL SKILLS', usd.COMPANY as 'COMPANY', usd.COLLEGE as 'COLLEGE', usd.HIGH_SCHL as 'HIGH_SCHL',usr.ROW_ID as 'ROW_ID', usr.FIRST_NAME as 'FIRST_NAME', usr.LAST_NAME as 'LAST_NAME', usr.EMAIL_ADDR as 'EMAIL_ADDR', usr.DATE_OF_BIRTH as 'DATE_OF_BIRTH', usr.PASSWORD as 'PASSWORD', usr.GENDER as 'GENDER', usr.IMAGE_URL as 'IMAGE_URL' FROM USER_DETAILS usd , USERS usr WHERE usd.USER_ID = usr.ROW_ID AND usr.ROW_ID =" + req.session.ROW_ID;
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			
		case "getLifeEvents" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query = "SELECT ROW_ID, USER_ID, EVENT_NAME, DATE FROM LIFE_EVENTS WHERE USER_ID = " + req.session.ROW_ID + " ORDER BY DATE DESC";
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			
		case "updateProfilePicture" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query = "UPDATE USERS SET IMAGE_URL = '" + data.newPath + "' WHERE ROW_ID = " + req.session.ROW_ID;
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			
		case "renderGroupsPage" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query = "SELECT usd.PHONE as 'PHONE',usd.CURR_CITY as 'CURR_CITY',usd.ABOUT_ME,usd.HOME_ADDR as 'HOME_ADDR', usd.WEB_URL as 'WEB_URL', usd.PROFESSIONAL_SKILLS as 'PROFESSIONAL SKILLS', usd.COMPANY as 'COMPANY', usd.COLLEGE as 'COLLEGE', usd.HIGH_SCHL as 'HIGH_SCHL',usr.ROW_ID as 'ROW_ID', usr.FIRST_NAME as 'FIRST_NAME', usr.LAST_NAME as 'LAST_NAME', usr.EMAIL_ADDR as 'EMAIL_ADDR', usr.DATE_OF_BIRTH as 'DATE_OF_BIRTH', usr.PASSWORD as 'PASSWORD', usr.GENDER as 'GENDER', usr.IMAGE_URL as 'IMAGE_URL' FROM USER_DETAILS usd , USERS usr WHERE usd.USER_ID = usr.ROW_ID AND usr.ROW_ID =" + req.session.ROW_ID;
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			
		case "loadAllGroups" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query ="SELECT * FROM `GROUPS` WHERE ROW_ID NOT IN (SELECT `GROUP_ID`FROM GROUP_USERS where USER_ID = " + req.session.ROW_ID + ")";
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			
		case "loadMyGroups" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query ="SELECT * FROM GROUPS WHERE ROW_ID IN (SELECT GROUP_ID FROM GROUP_USERS where USER_ID = " + req.session.ROW_ID + ")";
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			
		case "addUserToGroup" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query ="INSERT INTO GROUP_USERS (GROUP_ID, USER_ID) VALUES ('" + data.ROW_ID + "', '" + req.session.ROW_ID + "')";
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			
		case "removeUserFromGroup" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query ="DELETE FROM GROUP_USERS WHERE USER_ID = '" + req.session.ROW_ID + "' AND GROUP_ID = '" + data.ROW_ID + "'";
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;
			
		case "createGroup" :
			if(req.session.username != null && req.session.username != ""){
				var sql_query = "INSERT INTO GROUPS(GROUP_NAME, GROUP_INFO, IMAGE_URL,CREATED_BY) VALUES ('" + data.GROUP_NAME + "','" + data.GROUP_INFO + "','" + data.IMAGE_URL + "','" + req.session.ROW_ID + "');"
				//var sql_query ="INSERT INTO GROUP_USERS (GROUP_ID, USER_ID) VALUES ('" + data.ROW_ID + "', '" + req.session.ROW_ID + "');";
				executeSelectQuery(sql_query,data,req,res,operation);
			}else{
				var accountoperation = require('./accountoperation');
				accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
			}
			break;

		default:
			break;
		}
	}
};

function getNewConnectionFromDB(){
	var mysql = require('mysql');
	var dbconnection = mysql.createConnection({
	multipleStatements: true,
	host : 'localhost',
	user : 'root',
	password : 'YyX26VXPxLHAGQK8',
	database: 'SocialMediaPrototypeDB'
	});	
	return dbconnection;
}

function executeSelectQuery(sql_stmt,data,req,res,operation){
	try {
		console.log("executeSelectQuery" + req);
		var mysql = require('mysql');
		var bcrypt = require('bcrypt');
		var accountoperation = require('./accountoperation');
		console.log("Getting Connection!!");
		var dbconnection = getNewConnectionFromDB();
		console.log("Got Connection!!" + sql_stmt);
		dbconnection
		.query(
				sql_stmt,
				function(error, results, fields) {
					if (!error) {
						//console.log(fields);
						if (operation == "verifyUser"
								|| operation == "loginUser" 
									|| operation == "renderFriendListPage"
									|| operation == "renderUserDetailsPage" 
										|| operation == "updateProfilePicture" 
											|| operation == "renderGroupsPage") {
							try {
								console.log(data);
								if (data == null || data == "")
									data = {};
								//console.log(results[0].PASSWORD);
								//console.log(data.password);
								if (req.session.username != ""
										&& req.session.username != null) {
									console
											.log("Session found User Detials being returned !!");
									var fieldmap = {
										ROW_ID : "ROW_ID",
										FIRST_NAME : "firstname",
										LAST_NAME : "lastname",
										EMAIL_ADDR : "emailM",
										DATE_OF_BIRTH : "dateofbirth",
										GENDER : "gender",
										IMAGE_URL : "IMAGE_URL"
									};

									for ( var key in results[0]) {
										if (results[0]
												.hasOwnProperty(key)
												&& fieldmap[key] != null
												&& fieldmap[key] != ""
												&& results[0][key] != ""
												&& results[0][key] != null) {
											console.log(key
													+ " session -> "
													+ results[0][key]);
											data[fieldmap[key]] = results[0][key];
										}
									}
									console.log("Test");
									if (operation == "verifyUser")
										accountoperation.userVerified(
												data, res, req);
									else if (operation == "loginUser") {
										console.log("Test" + operation);
										accountoperation
												.homeRedirection(data,
														res, req);
									}else if(operation == "renderFriendListPage"){
										console.log("Test" + operation);
										accountoperation
										.FriendListPageRedirect(data,
												res, req);
									}else if(operation == "renderUserDetailsPage"){
										console.log("Test" + operation);
										accountoperation
										.userDetailsPageRedirect(results[0],
												res, req);
									}else if(operation == "updateProfilePicture"){
										accountoperation
										.renderUserDetailsPage({},
												res, req);
									}else if(operation == "renderGroupsPage"){
										console.log("Test" + operation);
										accountoperation
										.groupPageRedirect(results[0],
												res, req);
									}
								} else {
									console.log("no session found!!");
									if (bcrypt.compareSync(
											data.password,
											results[0].PASSWORD)) {
										//if(data.password == results[0].PASSWORD){
										var fieldmap = {
											ROW_ID : "ROW_ID",
											FIRST_NAME : "firstname",
											LAST_NAME : "lastname",
											EMAIL_ADDR : "emailM",
											DATE_OF_BIRTH : "dateofbirth",
											GENDER : "gender",
											IMAGE_URL : "IMAGE_URL"
										};

										for ( var key in results[0]) {
											if (results[0]
													.hasOwnProperty(key)
													&& fieldmap[key] != null
													&& fieldmap[key] != ""
													&& results[0][key] != ""
													&& results[0][key] != null) {
												console
														.log(key
																+ " No Session -> "
																+ results[0][key]);
												data[fieldmap[key]] = results[0][key];
											}
										}
										accountoperation.userVerified(
												data, res, req);
										console
												.log("User Verified !!! ");
									} else {
										console
												.log("User Not Verfied !!! ");
										data.password = "";
										accountoperation
												.userUnverified(
														res,
														"Incorrect username or Password Specified",
														data, req);
									}
								}

							} catch (e) {
								console.log(e.toString());
								console.log("User Not Verfied !!! ");
								data.password = "";
								accountoperation
										.userUnverified(
												res,
												"Incorrect username or Password Specified",
												data, req);
							}
						}
						//Async Request which dont needs rendering of pages
						if (operation == "getNewsFeed"
								|| operation == "loadFriendList"
									|| operation == "loadMyFriendList"
										|| operation == "loadPendingFriendList"
											|| operation == "rejectFriendRequest"
												|| operation == "acceptFriendRequest" 
													|| operation == "getLifeEvents"
														|| operation == "loadAllGroups"
															|| operation == "loadMyGroups"
																||operation == "addUserToGroup"
																	|| operation == "removeUserFromGroup"
																		|| operation == "createGroup") {
							res.status(200).send(results);
						}
						//if(operation ==  "acceptFriendRequest"){}
					} else {
						if (operation == "verifyUser" 
							|| operation == "loginUser"
								||  operation == "renderFriendListPage"
									|| operation == "renderUserDetailsPage"
										|| operation == "updateProfilePicture"
											|| operation == "renderGroupsPage") {
							var newuser = {};
							newuser.username = data.username;
							console.log(error);
							console.log(newuser);
							accountoperation
									.userUnverified(
											res,
											"Incorrect username or Password Specified",
											newuser, req);
						}
						if (operation == "getNewsFeed"
								|| operation == "loadFriendList"  
									|| operation == "loadMyFriendList"
										|| operation == "loadPendingFriendList" 
											|| operation == "rejectFriendRequest"
												|| operation ==  "acceptFriendRequest"
													|| operation == "getLifeEvents"
														||operation == "loadAllGroups"
															|| operation == "loadMyGroups"
																||operation == "addUserToGroup"
																	|| operation == "removeUserFromGroup"
																		|| operation == "createGroup") {
							res.status(403).send(error);
						}
					}
				});
	} catch (e) {
		// TODO: handle exception
		console.log(e);
	}finally{
		if(dbconnection != null && dbconnection!= "")
			dbconnection.end();
	}
}


function executeInsertQuery(sql_stmt,data,req,res,operation){
	try {
		console.log("executeInsertQuery" + req);
		var mysql = require('mysql');
		var accountoperation = require('./accountoperation');
		var dbconnection = getNewConnectionFromDB();
		dbconnection.query(sql_stmt, data, function(error, results, fields) {
			if (!error) {
				if (operation === "createUser") {
					var fieldmap = {
						FIRST_NAME : "firstname",
						LAST_NAME : "lastname",
						EMAIL_ADDR : "emailM",
						DATE_OF_BIRTH : "dateofbirth",
						PASSWORD : "password",
						GENDER : "gender",
						IMAGE_URL : "IMAGE_URL"
					};

					var newuser = {};

					for ( var key in data) {
						if (data.hasOwnProperty(key) && fieldmap[key] != null
								&& fieldmap[key] != "" && data[key] != ""
								&& data[key] != null) {
							console.log(key + " -> " + data[key]);
							newuser[fieldmap[key]] = data[key]
						}
					}
					newuser.ROW_ID = results.insertId;
					accountoperation.userCreated(res, newuser, req);
				}
				if (operation == "postStatusUpdate" || operation == "sendFiendRequest") {
					res.status(200).send(results);
				}
			} else {
				if (operation === "createUser") {
					var fieldmap = {
						FIRST_NAME : "firstname",
						LAST_NAME : "lastname",
						EMAIL_ADDR : "emailM",
						DATE_OF_BIRTH : "dateofbirth",
						PASSWORD : "password",
						GENDER : "gender"
					};

					var newuser = {};

					for ( var key in data) {
						if (data.hasOwnProperty(key) && fieldmap[key] != null
								&& fieldmap[key] != "" && data[key] != ""
								&& data[key] != null) {
							console.log(key + " -> " + data[key]);
							newuser[fieldmap[key]] = data[key]
						}
					}
					console.log(error);
					console.log(newuser);
					accountoperation
							.userCreationError(res, error, newuser, req);
				}
				if (operation == "postStatusUpdate" || operation == "sendFiendRequest") {
					res.status(403).send(error);
				}
			}
		});
	} catch (e) {
		// TODO: handle exception
		console.log(e);
	}
	finally{
		if(dbconnection != null && dbconnection!= ""){
			dbconnection.end();
			console.log("Connection Dropped");
		}
			
	}
}