//including dependencies.
var express = require('express');
var mongoose = require('mongoose');

//including libs and middlewares
var responseGenerator = require("../../libs/responseGenerator.js");
var encrypt = require('../../libs/encrypt.js');
var auth = require('../../middlewares/auth.js');

var router = express.Router();

//defining model.
var userModel = mongoose.model('User');

//defining controller function.
module.exports.controller = function(app){

  //step-one for checking email, and showing security question.
  router.post("/forgot-password/step-one",auth.loggedIn,function(req,res){

    userModel.findOne({'email':req.body.email},function(err,result){
      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
        res.send(myResponse);
      }
      else if(result == null || result == undefined || result == ""){
        console.log("User Not Found. Please Check Your Email.");
        var myResponse = responseGenerator.generate(true,"User Not Found. Please Check Your Email.",404,null);
        res.send(myResponse);
      }
      else{
        console.log("Now Provide 'email', New 'password' and 'secureAnswer' For This Question : "+result.secureQuestion);
        var myResponse = responseGenerator.generate(false,"Now Provide 'email', New 'password' and 'secureAnswer' For This Question : "+result.secureQuestion,200,"Use put Method With This URI : /user/api/v1/forgot-password/step-final");
        res.send(myResponse);
      }
    });

  });

  //changing password.
  router.put("/forgot-password/step-final",auth.loggedIn,function(req,res){

    //encrypting provided passwords.
    var epass = encrypt.encryptPassword(req.body.password);

    //setting current updated date.
    req.body.updatedOn = Date.now();
    //saving new encrypted password in req.body.password object.
    req.body.password = epass;

    //saving req.body object in variable.
    var update = req.body;

    //updating password.
    userModel.findOneAndUpdate({$and:[{'email':req.body.email},{'secureAnswer':req.body.secureAnswer}]},update,function(err,result){
      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
        res.send(myResponse);
      }
      else if(result == undefined || result == null || result == ""){
        console.log("User Not Found. Please Check Your Input.");
        var myResponse = responseGenerator.generate(true,"User Not Found. Please Check Your Input.",404,null);
        res.send(myResponse);

      }
      else{
        console.log("Password Updation Success.");
        var myResponse = responseGenerator.generate(false,"Password Updation Success.",200,result);
        res.send(myResponse);
      }
    });
  });

  app.use('/user/api/v1',router);

}//end of controller function.
