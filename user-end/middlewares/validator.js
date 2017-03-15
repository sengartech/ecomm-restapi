//requiring dependencies.
var mongoose = require('mongoose');

//including libs and middlewares
var responseGenerator = require("../libs/responseGenerator.js");

var userModel = mongoose.model('User');

//router level middleware for checking existing user.
module.exports.emailExist = function(req,res,next){
  userModel.findOne({'email':req.body.email},function(err,result){
    if(err){
      console.log(err);
      var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
      res.send(myResponse);
    }
    else if(result){
      console.log("User Already Exist.");
      var myResponse = responseGenerator.generate(true,"User Already Exist.",400,null);
      res.send(myResponse);
    }
    else{
      next();
    }
  });
};
