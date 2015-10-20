var counter = 0;
var dbconnections = [];
var connectionPoolFlag = true;
var poolcreated = false;
var RequestQueue = {};
var requestQueueScheduler = null;
var poolSize = 99;
var requestId = 0;

module.exports = {
		handleDBRequest : function(operation,data,res,req){
			console.log("handleDBRequest got the Request to '" + operation +"' and its handled with RequestId : " + requestId);
			deligateDBAccessRequest(operation,data,res,req,requestId);
			requestId++;
		}
};

function deligateDBAccessRequest(operation,data,res,req,requestId){

	console.log("handleDBRequest --requestId-- : " + requestId);

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
		if(FIRST_NAME != null && FIRST_NAME != "" 
			&& LAST_NAME != null && LAST_NAME != ""
				&& EMAIL_ADDR != null && EMAIL_ADDR != ""
					&& DATE_OF_BIRTH != null && DATE_OF_BIRTH != ""
						&& PASSWORD != null && PASSWORD != ""
							&& GENDER != null && GENDER != ""){

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
			console.log(data.IMAGE_URL);

			if(data.IMAGE_URL == null || data.IMAGE_URL == "")
				data.IMAGE_URL = "/images/profile-photo_default.jpg";

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
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_stmt,newuser,req,res,operation,executeInsertQueryConnPool,requestId);
			else
				executeInsertQuery(sql_stmt,newuser,req,res,operation,requestId);

		}
		else{
			var accountoperation = require('./accountoperation');
			accountoperation.userCreationError(res, "There was an Error Creating the user due to missing information!! Please try Again later.", data, req);
		}
		break;

	case "verifyUser" :
	case "loginUser" :
		console.log(operation);
		console.log(data);
		if(req.session.username != null && req.session.username != "")
			data.username =  req.session.username;
		//var sql_query = "SELECT * FROM USERS WHERE EMAIL_ADDR = '" + data.username + "'";
		if(data.username != null && data.username != ""){
			var mysql = require('mysql');
			var sql_query = "SELECT * FROM ?? WHERE ?? = ?";
			var inserts = ['USERS', 'EMAIL_ADDR', data.username];
			sql_query = mysql.format(sql_query, inserts);
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);	
		}
		else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
		}
		break;

	case "getNewsFeed" :
		if(req.session.username != null && req.session.username != ""){
			data.username =  req.session.username;

			var sql_query = "SELECT news.POST_MESSAGE as 'POST_MESSAGE',user.FIRST_NAME AS 'FIRST_NAME',user.IMAGE_URL as'IMAGE_URL',user.LAST_NAME AS 'LAST_NAME'";
			sql_query += "FROM NEWSFEEDS news, USERS user where user.ROW_ID = news.USER_ID AND ";
			sql_query += "(news.USER_ID = " + req.session.ROW_ID + " OR news.USER_ID IN (SELECT USER2 FROM FRIENDS_LIST WHERE USER1 = '" + req.session.ROW_ID + "' AND ACCEPTED = 'Y')) ORDER BY news.TIMESTAMP DESC";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);	
		}
		break;

	case "postStatusUpdate" :
		if(req.session.username != null && req.session.username != ""){
			data.username =  req.session.username;

			var newpost = {};

			newpost.USER_ID = req.session.ROW_ID;
			newpost.POST_MESSAGE = req.body.POST_MESSAGE;
			newpost.IMAGE_URL = req.body.IMAGE_URL; 

			console.log(newpost);

			var sql_stmt = 'INSERT INTO NEWSFEEDS SET ?';
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_stmt,newpost,req,res,operation,executeInsertQueryConnPool,requestId);
			else
				executeInsertQuery(sql_stmt,newpost,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "loadFriendList" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "SELECT ROW_ID, FIRST_NAME, LAST_NAME, EMAIL_ADDR, DATE_OF_BIRTH,GENDER, IMAGE_URL FROM USERS WHERE ROW_ID <> " + req.session.ROW_ID + " AND ROW_ID NOT IN (SELECT USER2 FROM FRIENDS_LIST WHERE USER1 = " + req.session.ROW_ID + ") LIMIT 15";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
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

			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_stmt,newfriendReq,req,res,operation,executeInsertQueryConnPool,requestId);
			else
				executeInsertQuery(sql_stmt,newfriendReq,req,res,operation,requestId);

		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "renderFriendListPage" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "SELECT ROW_ID, FIRST_NAME, LAST_NAME, EMAIL_ADDR, DATE_OF_BIRTH,GENDER, IMAGE_URL FROM USERS WHERE ROW_ID = " + req.session.ROW_ID;
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "loadMyFriendList" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "SELECT ROW_ID, FIRST_NAME, LAST_NAME, EMAIL_ADDR, DATE_OF_BIRTH,GENDER, IMAGE_URL FROM USERS WHERE ROW_ID IN (SELECT USER2 FROM FRIENDS_LIST WHERE USER1 = " + req.session.ROW_ID + " AND ACCEPTED = 'Y')";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "loadPendingFriendList" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "SELECT ROW_ID, FIRST_NAME, LAST_NAME, EMAIL_ADDR, DATE_OF_BIRTH,GENDER, IMAGE_URL FROM USERS WHERE ROW_ID IN (SELECT USER1 FROM FRIENDS_LIST WHERE USER2 = " + req.session.ROW_ID + " AND ACCEPTED = 'N')";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "rejectFriendRequest" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "DELETE FROM FRIENDS_LIST WHERE USER1 = " + req.body.ROW_ID + " AND USER2 = " + req.session.ROW_ID + " AND ACCEPTED = 'N'";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req);
		}
		break;

	case "acceptFriendRequest" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "UPDATE FRIENDS_LIST SET ACCEPTED = 'Y' WHERE USER1 = " + req.body.ROW_ID + " AND USER2 = " + req.session.ROW_ID + " AND ACCEPTED = 'N';";
			sql_query += "INSERT INTO FRIENDS_LIST (USER1, USER2, ACCEPTED) VALUES ('" + req.session.ROW_ID + "', '" + req.body.ROW_ID + "', 'Y');";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "renderUserDetailsPage" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "SELECT usd.PHONE as 'PHONE',usd.CURR_CITY as 'CURR_CITY',usd.ABOUT_ME,usd.HOME_ADDR as 'HOME_ADDR', usd.WEB_URL as 'WEB_URL', usd.PROFESSIONAL_SKILLS as 'PROFESSIONAL SKILLS', usd.COMPANY as 'COMPANY', usd.COLLEGE as 'COLLEGE', usd.HIGH_SCHL as 'HIGH_SCHL',usr.ROW_ID as 'ROW_ID', usr.FIRST_NAME as 'FIRST_NAME', usr.LAST_NAME as 'LAST_NAME', usr.EMAIL_ADDR as 'EMAIL_ADDR', usr.DATE_OF_BIRTH as 'DATE_OF_BIRTH', usr.PASSWORD as 'PASSWORD', usr.GENDER as 'GENDER', usr.IMAGE_URL as 'IMAGE_URL' FROM USER_DETAILS usd , USERS usr WHERE usd.USER_ID = usr.ROW_ID AND usr.ROW_ID =" + req.session.ROW_ID;
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "getLifeEvents" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "SELECT ROW_ID, USER_ID, EVENT_NAME, DATE FROM LIFE_EVENTS WHERE USER_ID = " + req.session.ROW_ID + " ORDER BY DATE DESC";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "updateProfilePicture" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "UPDATE USERS SET IMAGE_URL = '" + data.newPath + "' WHERE ROW_ID = " + req.session.ROW_ID;
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "renderGroupsPage" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "SELECT usd.PHONE as 'PHONE',usd.CURR_CITY as 'CURR_CITY',usd.ABOUT_ME,usd.HOME_ADDR as 'HOME_ADDR', usd.WEB_URL as 'WEB_URL', usd.PROFESSIONAL_SKILLS as 'PROFESSIONAL SKILLS', usd.COMPANY as 'COMPANY', usd.COLLEGE as 'COLLEGE', usd.HIGH_SCHL as 'HIGH_SCHL',usr.ROW_ID as 'ROW_ID', usr.FIRST_NAME as 'FIRST_NAME', usr.LAST_NAME as 'LAST_NAME', usr.EMAIL_ADDR as 'EMAIL_ADDR', usr.DATE_OF_BIRTH as 'DATE_OF_BIRTH', usr.PASSWORD as 'PASSWORD', usr.GENDER as 'GENDER', usr.IMAGE_URL as 'IMAGE_URL' FROM USER_DETAILS usd , USERS usr WHERE usd.USER_ID = usr.ROW_ID AND usr.ROW_ID =" + req.session.ROW_ID;
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "loadAllGroups" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query ="SELECT * FROM `GROUPS` WHERE ROW_ID NOT IN (SELECT `GROUP_ID`FROM GROUP_USERS where USER_ID = " + req.session.ROW_ID + ")";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "loadMyGroups" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query ="SELECT * FROM GROUPS WHERE ROW_ID IN (SELECT GROUP_ID FROM GROUP_USERS where USER_ID = " + req.session.ROW_ID + ")";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "addUserToGroup" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query ="INSERT INTO GROUP_USERS (GROUP_ID, USER_ID) VALUES ('" + data.ROW_ID + "', '" + req.session.ROW_ID + "')";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "removeUserFromGroup" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query ="DELETE FROM GROUP_USERS WHERE USER_ID = '" + req.session.ROW_ID + "' AND GROUP_ID = '" + data.ROW_ID + "'";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "createGroup" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "INSERT INTO GROUPS(GROUP_NAME, GROUP_INFO, IMAGE_URL,CREATED_BY) VALUES ('" + data.GROUP_NAME + "','" + data.GROUP_INFO + "','" + data.IMAGE_URL + "','" + req.session.ROW_ID + "');"
			//var sql_query ="INSERT INTO GROUP_USERS (GROUP_ID, USER_ID) VALUES ('" + data.ROW_ID + "', '" + req.session.ROW_ID + "');";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "unFriendUserRequest" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "DELETE FROM FRIENDS_LIST WHERE USER1 = " + req.body.ROW_ID + " AND USER2 = " + req.session.ROW_ID + " AND ACCEPTED = 'Y';";
			sql_query += "DELETE FROM FRIENDS_LIST WHERE USER2 = " + req.body.ROW_ID + " AND USER1 = " + req.session.ROW_ID + " AND ACCEPTED = 'Y';";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;
		
	case "navToGroupDetailPage" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "SELECT `ROW_ID`, `FIRST_NAME`, `LAST_NAME`, `EMAIL_ADDR`, `DATE_OF_BIRTH`, `GENDER`, `IMAGE_URL` FROM `USERS` WHERE ROW_ID=" + req.session.ROW_ID + ";";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;
		
	case "getGroupDetails" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query ="SELECT * FROM `GROUPS` WHERE ROW_ID = " + req.session.groupid + ";";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;
		
	case "getGroupUserList" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "SELECT `ROW_ID`, `FIRST_NAME`, `LAST_NAME`, `EMAIL_ADDR`, `DATE_OF_BIRTH`,`GENDER`, `IMAGE_URL` FROM `USERS` WHERE ROW_ID IN (SELECT USER_ID FROM `GROUP_USERS` WHERE GROUP_ID = " + req.session.groupid + ");";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;
		
	case "getGroupNonMembers" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "SELECT `ROW_ID`, `FIRST_NAME`, `LAST_NAME`, `EMAIL_ADDR`, `DATE_OF_BIRTH`,`GENDER`, `IMAGE_URL` FROM `USERS` WHERE ROW_ID NOT IN (SELECT USER_ID FROM `GROUP_USERS` WHERE GROUP_ID = " + req.session.groupid + ") LIMIT 15;";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;
		
		
	case "addUserToGroupAdmin" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query ="INSERT INTO GROUP_USERS (GROUP_ID, USER_ID) VALUES ('" + data.GROUP_ID+ "', '" + data.ROW_ID + "')";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;

	case "removeUserFromGroupAdmin" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query ="DELETE FROM GROUP_USERS WHERE USER_ID = '" + data.ROW_ID + "' AND GROUP_ID = '" + data.GROUP_ID + "';";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;
		
	case "deleteGroup" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query ="DELETE FROM GROUPS WHERE ROW_ID = '" + req.session.groupid + "';";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;
		
	case "navToFriendDetailPage" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "SELECT `ROW_ID`, `FIRST_NAME`, `LAST_NAME`, `EMAIL_ADDR`, `DATE_OF_BIRTH`, `GENDER`, `IMAGE_URL` FROM `USERS` WHERE ROW_ID=" + req.session.ROW_ID + ";";
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;
		
	case "getFriendDetails" :
		if(req.session.username != null && req.session.username != ""){
			var sql_query = "SELECT usd.PHONE as 'PHONE',usd.CURR_CITY as 'CURR_CITY',usd.ABOUT_ME,usd.HOME_ADDR as 'HOME_ADDR', usd.WEB_URL as 'WEB_URL', usd.PROFESSIONAL_SKILLS as 'PROFESSIONAL SKILLS', usd.COMPANY as 'COMPANY', usd.COLLEGE as 'COLLEGE', usd.HIGH_SCHL as 'HIGH_SCHL',usr.ROW_ID as 'ROW_ID', usr.FIRST_NAME as 'FIRST_NAME', usr.LAST_NAME as 'LAST_NAME', usr.EMAIL_ADDR as 'EMAIL_ADDR', usr.DATE_OF_BIRTH as 'DATE_OF_BIRTH', usr.PASSWORD as 'PASSWORD', usr.GENDER as 'GENDER', usr.IMAGE_URL as 'IMAGE_URL' FROM USER_DETAILS usd , USERS usr WHERE usd.USER_ID = usr.ROW_ID AND usr.ROW_ID =" + req.session.friendid;
			if(connectionPoolFlag)
				getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
			else
				executeSelectQuery(sql_query,data,req,res,operation,requestId);
		}else{
			var accountoperation = require('./accountoperation');
			accountoperation.userUnverified(res,"Invalid Session!! Please Login to continue.",{},req)
		}
		break;
		
		
	default:
		break;
	}
}

function getNewConnectionFromDB(){
	if(!connectionPoolFlag){
		var mysql = require('mysql');
		var dbconnection = mysql.createConnection({
			multipleStatements: true,
			host : 'localhost',
			user : 'root',
			password : 'YyX26VXPxLHAGQK8',
			database: 'SocialMediaPrototypeDB',
			connectTimeout: 6000,
			waitForConnections: true,
			pool: false,
		});	
		return dbconnection;
	}
}

function getNewConnectionFromDBPool(sql_query,data,req,res,operation,callback,requestId){

	if(connectionPoolFlag){
		
		//Create a connection Pool.
		if(dbconnections.length <= 0 && !poolcreated){
			dbconnections = createConnectionPool();
			poolcreated = true;
		}

		//If there are no More connection left in the pool
		if(dbconnections.length == 0){
			//Queuing Request into a List for later Execution
			if((RequestQueue[requestId] == null || RequestQueue[requestId] == "")){
				RequestQueue[requestId] = {};
				RequestQueue[requestId].sql_query = sql_query;
				RequestQueue[requestId].data = data;
				RequestQueue[requestId].req = req;
				RequestQueue[requestId].res = res;
				RequestQueue[requestId].operation = operation;
				RequestQueue[requestId].callback = callback;
				RequestQueue[requestId].requestId = requestId;
				RequestQueue[requestId].RequestSent = "N";
				console.log("Pool Empty Error Response Sent Back to Client!!! but add the requestid " +RequestQueue[requestId].requestId + " to waitlist");
			}else if((RequestQueue[requestId] != null && RequestQueue[requestId] != "")){
				RequestQueue[requestId].RequestSent = "N";
				console.log("Request is already Queue for execution!!");
			}
			console.log("RequestQueue has " + Object.keys(RequestQueue).length + " waiting !!!");
			//res.status(403).send("There are no more database connections to Handle the user Request");
		}

		//Assigning a Connection to Requesting Object if Connections are available.
		if(dbconnections.length > 0){
			var dbconnection = dbconnections.shift();
			console.log("Connection " + dbconnection.threadId + " Assigned for requestId("+ requestId + ")  to be excuted : ");
			console.log("dbconnections length after removing : " + dbconnections.length);
			setTimeout(function() { callback(sql_query,data,req,res,operation,dbconnection,requestId); }, 0);

			//Delete the Request from the wait Queue
			if((RequestQueue[requestId] != null && RequestQueue[requestId] != "")){
				delete RequestQueue[requestId];
				try{
					RequestQueue[requestId].requestId;
				}catch(e){
					//console.log("error : " + e);
				}
				console.log("Requestid exisiting in request Queue and its process so its deleted, ");
				console.log("RequestQueue has " + Object.keys(RequestQueue).length + " waiting !!!")
			}
		}	

		//If Request queue is not null and requestQueueScheduler is not defined
		if(RequestQueue != null && RequestQueue != "" && (requestQueueScheduler == null || requestQueueScheduler == "")){

			if(Object.keys(RequestQueue).length > 0) {
				console.log("Interval Function is not defined and the requests are queued in the Array");
				//Start the Interval Function to execute Request from the 
				requestQueueScheduler = setInterval(function() {

					if(dbconnections.length >= 1){

						var firstRequestId = "";

						//get First Request from Request Queue which is not already sent for execution
						for (firstRequestId in RequestQueue){
							if (RequestQueue.hasOwnProperty(firstRequestId)){
								if(RequestQueue[firstRequestId].RequestSent == "N")
									break;	
							}
						}

						//If there are Any request to be queue into the queue.
						if(firstRequestId != null && firstRequestId != ""){
							console.log(" Got firstRequestId : " + RequestQueue[firstRequestId].requestId);
							
							//Get Request Details
							if(RequestQueue[firstRequestId].RequestSent == "N"){
								var sql_query = RequestQueue[firstRequestId].sql_query;
								var data = RequestQueue[firstRequestId].data;
								var req = RequestQueue[firstRequestId].req;
								var res = RequestQueue[firstRequestId].res;
								var operation = RequestQueue[firstRequestId].operation;
								var callbackf = RequestQueue[firstRequestId].callback;
								var requestId = RequestQueue[firstRequestId].requestId;
								RequestQueue[requestId].RequestSent = "Y";
								
								//Queue the request for execution !!!
								setTimeout(function() { getNewConnectionFromDBPool(sql_query,data,req,res,operation,callbackf,requestId); }, 0);
								console.log("The firstRequestId has been scheduled for execution : " + RequestQueue[firstRequestId].requestId);
							}
						}

						//Stop This Interval Function if there are no more requests in the queue to be processed.
						if(Object.keys(RequestQueue).length == 0){
							clearInterval(requestQueueScheduler);
							requestQueueScheduler = null;
							console.log("All the Queued Requests are now processed so Stopping the Timeout Function!");
						}
					}
				}, 0);
			}
		}
	}
}

function createConnectionPool(){
	var mysql = require('mysql');
	var dbconnections = [];
	for(var i = 0;i<poolSize;i++){
		var dbconnection = mysql.createConnection({
			multipleStatements: true,
			host : 'localhost',
			user : 'root',
			password : 'YyX26VXPxLHAGQK8',
			database: 'SocialMediaPrototypeDB',
			connectTimeout: 600000,
			waitForConnections: false,
			connectionLimit: 499,
			pool: false,
		});	
		dbconnection.connect();
		dbconnections[i] = dbconnection;
		console.log("The Connection " + i + " is " + dbconnection.threadId);
		dbconnection = null;
	}
	return dbconnections;
}

function executeSelectQuery(sql_stmt,data,req,res,operation,requestId){
	try {
		var mysql = require('mysql');
		var bcrypt = require('bcrypt');
		var accountoperation = require('./accountoperation');
		console.log("Getting Connection!!");
		var dbconnection = getNewConnectionFromDB();
		console.log("Got Connection and Executing Query !! (requestId) ==> "+ requestId +" ==>> " + sql_stmt);
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
											|| operation == "renderGroupsPage"
												|| operation == "navToGroupDetailPage"
													|| operation == "deleteGroup"
														|| operation == "navToFriendDetailPage") {
							try {
								console.log(data);
								if (data == null || data == "")
									data = {};
								//console.log(results[0].PASSWORD);
								//console.log(data.password);
								if (req.session.username != ""
									&& req.session.username != null) {
									console.log("Session found User Detials being returned !!");
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
											//console.log(key	+ " session -> " + results[0][key]);
											data[fieldmap[key]] = results[0][key];
										}
									}
									//console.log("Test");
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
									}else if(operation == "navToGroupDetailPage"){
										console.log("Test" + operation);
										accountoperation
										.groupDetailsPageRedirect(results[0],
												res, req);
									}else if (operation == "deleteGroup") {
										console.log("Test" + operation);
										accountoperation
										.userVerified(data,
												res, req);
									}else if(operation == "navToFriendDetailPage"){
										console.log("Test" + operation);
										accountoperation
										.friendDetailsPageRedirect(results[0],
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
																	|| operation == "createGroup"
																		|| operation == "unFriendUserRequest"
																			|| operation == "getGroupDetails"
																				|| operation == "getGroupUserList"
																					|| operation == "getGroupNonMembers"
																						|| operation == "addUserToGroupAdmin"
																							|| operation == "removeUserFromGroupAdmin"
																								|| operation == "getFriendDetails") {
							res.status(200).send(results);
						}
						//if(operation ==  "acceptFriendRequest"){}
					} else {
						if (operation == "verifyUser" 
							|| operation == "loginUser"
								||  operation == "renderFriendListPage"
									|| operation == "renderUserDetailsPage"
										|| operation == "updateProfilePicture"
											|| operation == "renderGroupsPage"
												|| operation == "navToGroupDetailPage"
													|| operation == "deleteGroup"
														|| operation == "navToFriendDetailPage") {
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
																	|| operation == "createGroup"
																		|| operation == "unFriendUserRequest"
																			|| operation == "getGroupDetails"
																				|| operation == "getGroupUserList"
																					|| operation == "getGroupNonMembers"
																						|| operation == "addUserToGroupAdmin"
																							|| operation == "removeUserFromGroupAdmin"
																								|| operation == "getFriendDetails") {
							res.status(403).send(error);
						}
					}
				});
	} catch (e) {
		// TODO: handle exception
		console.log(e);
	}finally{
		if(dbconnection != null && dbconnection!= ""){
			if(connectionPoolFlag){
				dbconnections.push(dbconnection);
				console.log("New Depth of the Pool " + dbconnections.length + " ,after requestId (" + requestId + ") connection returned back to the Pool : " + dbconnection.threadId );
				dbconnection = null;
			}
			else{
				console.log("Non Pooled Connection is Terminated!!")
				dbconnection.end();
			}
		}
	}
}

function executeSelectQueryConnectionPool(sql_stmt,data,req,res,operation,dbconnection,requestId){
	try {
		console.log("\n==>>executeSelectQueryConnectionPool  : " + requestId);
		var mysql = require('mysql');
		var bcrypt = require('bcrypt');
		var accountoperation = require('./accountoperation');
		console.log("Got Connection and Executing Query !! (requestId) ==> "+ requestId +" ==>> " + sql_stmt);
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
											|| operation == "renderGroupsPage"
												|| operation == "navToGroupDetailPage"
													|| operation == "deleteGroup"
														|| operation == "navToFriendDetailPage") {
							try {
								console.log(data);
								if (data == null || data == "")
									data = {};
								//console.log(results[0].PASSWORD);
								//console.log(data.password);
								if (req.session.username != ""
									&& req.session.username != null) {
									console.log("Session found User Detials being returned !!");
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
											//console.log(key	+ " session -> " + results[0][key]);
											data[fieldmap[key]] = results[0][key];
										}
									}
									//console.log("Test");
									if (operation == "verifyUser"){
										console.log("Test" + operation);
										accountoperation.userVerified(
												data, res, req);
									}else if (operation == "loginUser") {
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
									}else if(operation == "navToGroupDetailPage"){
										console.log("Test" + operation);
										accountoperation
										.groupDetailsPageRedirect(results[0],
												res, req);	
									}else if (operation == "deleteGroup") {
										console.log("Test" + operation);
										accountoperation
										.userVerified(data,
												res, req);
									}else if(operation == "navToFriendDetailPage"){
										console.log("Test" + operation);
										accountoperation
										.friendDetailsPageRedirect(results[0],
												res, req);	
									}
								} else {
									console.log("Else no session found!!");
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
																	|| operation == "createGroup"
																		|| operation == "unFriendUserRequest"
																			|| operation == "getGroupDetails"
																				|| operation == "getGroupUserList"
																					|| operation == "getGroupNonMembers"
																						|| operation == "addUserToGroupAdmin"
																							|| operation == "removeUserFromGroupAdmin"
																								|| operation == "getFriendDetails") {
							res.status(200).send(results);
						}
						//if(operation ==  "acceptFriendRequest"){}
					} else {
						if (operation == "verifyUser" 
							|| operation == "loginUser"
								||  operation == "renderFriendListPage"
									|| operation == "renderUserDetailsPage"
										|| operation == "updateProfilePicture"
											|| operation == "renderGroupsPage"
												|| operation == "navToGroupDetailPage"
													|| operation == "deleteGroup"
														|| operation == "navToFriendDetailPage") {
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
																	|| operation == "createGroup"
																		|| operation == "unFriendUserRequest"
																			|| operation == "getGroupDetails"
																				|| operation == "getGroupUserList"
																					|| operation == "getGroupNonMembers"
																						|| operation == "addUserToGroupAdmin"
																							|| operation == "removeUserFromGroupAdmin"
																								|| operation == "getFriendDetails") {
							res.status(403).send(error);
						}
					}
				});
	} catch (e) {
		// TODO: handle exception
		console.log(e);
	}finally{
		if(dbconnection != null && dbconnection!= ""){
			if(connectionPoolFlag){
				dbconnections.push(dbconnection);
				console.log("New Depth of the Pool " + dbconnections.length + " ,after requestId (" + requestId + ") connection returned back to the Pool : " + dbconnection.threadId );
				dbconnection = null;
			}
			else{
				console.log("Non Pooled Connection is Terminated!!")
				dbconnection.end();
			}

		}
	}
}

function executeInsertQuery(sql_stmt,data,req,res,operation,requestId){
	try {
		console.log("Got Connection and Executing Query !! (requestId) ==> "+ requestId +" ==>> " + sql_stmt);
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
			if(connectionPoolFlag){
				dbconnections.push(dbconnection);
				console.log("New Depth of the Pool " + dbconnections.length + " ,after requestId (" + requestId + ") connection returned back to the Pool : " + dbconnection.threadId );
				dbconnection = null;
			}
			else{
				console.log("Non Pooled Connection is Terminated!!")
				dbconnection.end();
			}

		}	
	}
}

function executeInsertQueryConnPool(sql_stmt,data,req,res,operation,dbconnection,requestId){
	try {
		console.log("Got Connection and Executing Query !! (requestId) ==> "+ requestId +" ==>> " + sql_stmt);
		var mysql = require('mysql');
		var accountoperation = require('./accountoperation');
		//var dbconnection = getNewConnectionFromDB();
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
			if(connectionPoolFlag){
				dbconnections.push(dbconnection);
				console.log("New Depth of the Pool " + dbconnections.length + " ,after requestId (" + requestId + ") connection returned back to the Pool : " + dbconnection.threadId );
				dbconnection = null;
			}
			else{
				console.log("Non Pooled Connection is Terminated!!")
				dbconnection.end();
			}

		}	
	}
}