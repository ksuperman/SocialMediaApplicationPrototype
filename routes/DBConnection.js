module.exports = {

	handleDBRequest : function(operation,data,res,req){
		console.log("	handleDBRequest" + req);
		
		if(operation == "createUser"){		
			console.log("CreateUser");
			var bcrypt = require('bcrypt');
			
			//Getting User Object from Request
			var FIRST_NAME = data.firstname;
			var LAST_NAME = data.lastName;
			var EMAIL_ADDR = data.emailM;
			var DATE_OF_BIRTH = data.dateofbirth;angular-messages.js
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
			console.log(bcrypt);
			console.log(salt);
			console.log(PASSWORD);
						
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
		}
		
		if(operation == "verifyUser" || operation == "loginUser"){
			console.log(operation);
			console.log(data);
			if(req.session.username != null && req.session.username != "")
				data.username =  req.session.username;
			var sql_query = "SELECT * FROM USERS WHERE EMAIL_ADDR = '" + data.username + "'";
			executeSelectQuery(sql_query,data,req,res,operation);			
		}
		
		if(operation == "getNewsFeed"){
			if(req.session.username != null && req.session.username != "")
				data.username =  req.session.username;
			var sql_query = "SELECT * FROM NEWSFEEDS WHERE USER_ID = ( SELECT ROW_ID FROM USERS WHERE EMAIL_ADDR= '" + data.username + "')";
			executeSelectQuery(sql_query,data,req,res,operation);	
		}
		
		if(operation == "postStatusUpdate"){
			if(req.session.username != null && req.session.username != "")
				data.username =  req.session.username;
			
			var newpost = {};
			
			newpost.USER_ID = req.session.ROW_ID;
			newpost.POST_MESSAGE = req.body.POST_MESSAGE;
			newpost.IMAGE_URL = req.body.IMAGE_URL; 

			console.log(newpost);
			
			var sql_stmt = 'INSERT INTO NEWSFEEDS SET ?';
			
			executeInsertQuery(sql_stmt,newpost,req,res,operation);
		}
	}
};

function getNewConnectionFromDB(){
	var mysql = require('mysql');
	var dbconnection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'YyX26VXPxLHAGQK8',
	database: 'SocialMediaPrototypeDB'
	});	
	return dbconnection;
}

function executeSelectQuery(sql_stmt,data,req,res,operation){
	console.log("	executeSelectQuery" + req);
	var mysql = require('mysql');
	var bcrypt = require('bcrypt');
	var accountoperation = require('./accountoperation');
	console.log("Getting Connection!!");
	var dbconnection = getNewConnectionFromDB();
	console.log("Got Connection!!" + sql_stmt);
	dbconnection.query(sql_stmt, function (error, results, fields) {
		if (!error){	
			//console.log(fields);
			if(operation == "verifyUser" || operation == "loginUser"){
				try{
					console.log(data);
					if(data == null || data == "")
						data = {};
					console.log(results[0].PASSWORD);
					console.log(data.password);
					if(req.session.username != "" && req.session.username != null){
						console.log("Session found User Detials being returned !!");
						var fieldmap = {ROW_ID:"ROW_ID", FIRST_NAME: "firstname" , LAST_NAME : "lastname" , EMAIL_ADDR: "emailM" , DATE_OF_BIRTH: "dateofbirth" , GENDER : "gender", IMAGE_URL : "IMAGE_URL"};
						
						for (var key in results[0]) {
						  if (results[0].hasOwnProperty(key) && fieldmap[key] != null && fieldmap[key] != "" && results[0][key] != "" && results[0][key] != null) {
						    console.log(key + " session -> " + results[0][key]);
						    data[fieldmap[key]] = results[0][key];
						  }
						}
						console.log("Test");
						if(operation == "verifyUser")
							accountoperation.userVerified(data, res,req);
						else if(operation == "loginUser"){
							console.log("Test");
							accountoperation.homeRedirection(data, res,req);
						}
					}
					else{
						console.log("no session found!!");
						if(bcrypt.compareSync(data.password, results[0].PASSWORD)){
							//if(data.password == results[0].PASSWORD){
							var fieldmap = {ROW_ID:"ROW_ID", FIRST_NAME: "firstname" , LAST_NAME : "lastname" , EMAIL_ADDR: "emailM" , DATE_OF_BIRTH: "dateofbirth" , GENDER : "gender", IMAGE_URL : "IMAGE_URL"};
							
							for (var key in results[0]) {
							  if (results[0].hasOwnProperty(key) && fieldmap[key] != null && fieldmap[key] != "" && results[0][key] != "" && results[0][key] != null) {
							    console.log(key + " No Session -> " + results[0][key]);
							    data[fieldmap[key]] = results[0][key];
							  }
							}
							accountoperation.userVerified(data, res,req);
							console.log("User Verified !!! ");
						}
						else{
							console.log("User Not Verfied !!! ");
							data.password = "";
							accountoperation.userUnverified(res,"Incorrect username or Password Specified",data,req);
						}
					}
					
				}catch(e){
					console.log(e.toString());
					console.log("User Not Verfied !!! ");
					data.password = "";
					accountoperation.userUnverified(res,"Incorrect username or Password Specified",data,req);
				}
			}
			if(operation == "getNewsFeed"){
				res.status(200).send(results);
			}
		}
		else{
			if(operation == "verifyUser"){
				var newuser = {};
				newuser.username = data.username;
				console.log(error);
				console.log(newuser);
				accountoperation.userUnverified(res,"Incorrect username or Password Specified",newuser,req);
			}
			if(operation == "getNewsFeed"){
				res.status(403).send(error);
			}
		}
	});
}


function executeInsertQuery(sql_stmt,data,req,res,operation){
	console.log("	executeInsertQuery" + req);
	var mysql = require('mysql');
	var accountoperation = require('./accountoperation');
	var dbconnection = getNewConnectionFromDB();
	dbconnection.query(sql_stmt, data , function (error, results, fields) {
		if (!error){	
			if(operation === "createUser"){
				var fieldmap = { FIRST_NAME: "firstname" , LAST_NAME : "lastname" , EMAIL_ADDR: "emailM" , DATE_OF_BIRTH: "dateofbirth" , PASSWORD : "password" , GENDER : "gender", IMAGE_URL : "IMAGE_URL"};
				
				var newuser = {};
				
				for (var key in data) {
				  if (data.hasOwnProperty(key) && fieldmap[key] != null && fieldmap[key] != "" && data[key] != "" && data[key] != null) {
				    console.log(key + " -> " + data[key]);
				    newuser[fieldmap[key]] = data[key]
				  }
				}
				accountoperation.userCreated(res,newuser,req);
			}
			if(operation == "postStatusUpdate"){
				res.status(200).send(results);
			}
		}
		else{
			if(operation === "createUser"){
				var fieldmap = { FIRST_NAME: "firstname" , LAST_NAME : "lastname" , EMAIL_ADDR: "emailM" , DATE_OF_BIRTH: "dateofbirth" , PASSWORD : "password" , GENDER : "gender"};
				
				var newuser = {};
				
				for (var key in data) {
				  if (data.hasOwnProperty(key) && fieldmap[key] != null && fieldmap[key] != "" && data[key] != "" && data[key] != null) {
				    console.log(key + " -> " + data[key]);
				    newuser[fieldmap[key]] = data[key]
				  }
				}
				console.log(error);
				console.log(newuser);
				accountoperation.userCreationError(res,error,newuser,req);
			}
			if(operation == "postStatusUpdate"){
				res.status(403).send(error);
			}
		}
	});
}