//including dependencies.
var mongoose = require('mongoose');

//including libs and middlewares
var responseGenerator = require("../libs/responseGenerator.js");

//router level middleware for checking login.
module.exports.checkLogin = function(req,res,next){

	if(!req.user && !req.session.user){
		console.log("Requires User Login.");
		var myResponse = responseGenerator.generate(true,"Requires User Login.",404,null);
		res.send(myResponse);
	}
	else{
		next();
	}

}//end checkLogin.

//router level middleware for checking if user is already logged in.
module.exports.loggedIn = function(req,res,next){

	if(!req.user && !req.session.user){
		next();
	}
	else{
		console.log("User Is Already Logged In.");
		var myResponse = responseGenerator.generate(true,"User Is Already Logged In.",400,null);
		res.send(myResponse);
	}

}//end loogedIn
