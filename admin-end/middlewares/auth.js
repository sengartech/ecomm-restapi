//including dependencies.
var mongoose = require('mongoose');

//including libs and middlewares
var responseGenerator = require("../libs/responseGenerator.js");

//router level middleware for checking login.
module.exports.checkLogin = function(req,res,next){

	if(!req.admin && !req.session.admin){
		console.log("Requires Admin Login.");
		var myResponse = responseGenerator.generate(true,"Requires Admin Login.",404,null);
		res.send(myResponse);
	}
	else{
		next();
	}

}//end checkLogin.
