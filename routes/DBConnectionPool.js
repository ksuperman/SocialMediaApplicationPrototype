module.exports = {

	handleDBRequest : function(operation,data,res,req,requestId){
		
		switch(operation){

		case "verifyUser" :
		case "loginUser" :
			console.log("handleDBRequest --requestId-- : " + requestId);
			if(req.session.username != null && req.session.username != "")
				data.username =  req.session.username;
			
			if(data.username != null && data.username != ""){
				var mysql = require('mysql');
				var sql_query = "SELECT * FROM ?? WHERE ?? = ?";
				var inserts = ['USERS', 'EMAIL_ADDR', data.username];
				sql_query = mysql.format(sql_query, inserts);
				if(connectionPoolFlag)
					getNewConnectionFromDBPool(sql_query,data,req,res,operation,executeSelectQueryConnectionPool,requestId);
				else
					executeSelectQuery(sql_query,data,req,res,operation);	
			}
			else{
				res.status(404).send("Error");
			}
			break;
			

		default:
			break;
		}
	}
};

var counter = 0;
var dbconnections = [];
var connectionPoolFlag = true;
var poolcreated = false;
var RequestQueue = {};
var requestQueueScheduler = null;
var poolSize = 100;

function getNewConnectionFromDB(){
	if(connectionPoolFlag){
		if(dbconnections.length <= 0){
			dbconnections = createConnectionPool();
			poolcreated = true;
		}
		console.log("dbconnections length : " + dbconnections.length);
		return dbconnections.pop();	
	}else{
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
				console.log("Interval Function is not defined and the requests are queued in the Array")
				
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

function createConnectionPool(){
	var mysql = require('mysql');
	var dbconnections = [];
	for(var i = 0;i<poolSize;i++){
		var dbconnection = mysql.createConnection({
			multipleStatements: true,
			host : 'localhost',
			user : 'root',
			password : 'YyX26VXPxLHAGQK8',
			database: 'SocialMediaPrototypeDB'
			});	
		dbconnection.connect();
		dbconnections[i] = dbconnection;
		//dbconnections[i].connect();
		console.log("The Connection " + i + " is " + dbconnection.threadId);
		dbconnection = null;
	}
	return dbconnections;
}

function executeSelectQueryConnectionPool(sql_stmt,data,req,res,operation,dbconnection,requestId){
	try {
		var mysql = require('mysql');
		var bcrypt = require('bcrypt');
		var accountoperation = require('./accountoperation');
		console.log("Got Connection and Executing Query !! ==>> " + sql_stmt);
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
									console.log("==>Session found User Detials being returned !!");
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
										res.status(200).send("Sucessfully Logged In!");
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
										res.status(200).send("Succcess");
										console.log("==>>User Verified !!! ");
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
																			|| operation == "unFriendUserRequest") {
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
																		|| operation == "createGroup"
																			|| operation == "unFriendUserRequest") {
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
			else
				dbconnection.end();
		}
		//dbconnection.end();
	}
}

