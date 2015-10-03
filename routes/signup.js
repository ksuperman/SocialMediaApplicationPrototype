exports.signup = function(req, res){
	
	var accountoperation = require('./accountoperation');
	
	//Getting User Object from Request
	var user = req.body;
	
	console.log("Recieved Request for Account Creation " + JSON.stringify(user));
	//Hardcoded Default Image URL
	user.IMAGE_URL="http://www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg";
	accountoperation.createUser(user,res,req);
	
	//res.status(400).send("Test");
	/*
	var FIRST_NAME = user.firstname;
	var LAST_NAME = user.lastName;
	var EMAIL_ADDR = user.emailM;
	var DATE_OF_BIRTH = user.dateofbirth;
	var PASSWORD = user.password;
	var GENDER = user.gender;

	//Getting Salt Value and Encrypting Password
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(PASSWORD, salt);	
	
	
	console.log(JSON.stringify(req.body));
	console.log(FIRST_NAME);
	console.log(LAST_NAME);
	console.log(EMAIL_ADDR);
	console.log(DATE_OF_BIRTH);
	console.log(PASSWORD);
	console.log(GENDER);
	console.log(bcrypt);
	console.log(salt);
	console.log(hash);
	*/
	
	
	
	/*
	var sql_stmt = 'INSERT INTO USERS SET ?';
	dbconnection.query(sql_stmt, { FIRST_NAME: FIRST_NAME , LAST_NAME: LAST_NAME , EMAIL_ADDR: EMAIL_ADDR , DATE_OF_BIRTH: DATE_OF_BIRTH , PASSWORD: hash , GENDER: GENDER} , function (error, results, fields) {
		if (!error){
			if(results.insertId == "")
				res.render('home', { title: 'Collaborative Developement Environment' , error: error});
		}
		else{
			console.log(error);
			res.status(400).send(error);
		}
	});*/
};