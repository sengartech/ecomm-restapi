//including dependencies.
var express = require('express');
var mongoose = require('mongoose');
var shortid = require("shortid");

//including libs and middlewares
var responseGenerator = require("../../libs/responseGenerator.js");
var auth = require('../../middlewares/auth.js');
var validator = require('../../middlewares/validator.js');
var encrypt = require('../../libs/encrypt.js');

var router = express.Router();

//defining model.
var userModel = mongoose.model('User');

//defining controller function.
module.exports.controller = function(app){

  //to create user.
  router.post("/signup",auth.loggedIn,validator.emailExist,function(req,res){

    if(!req.body.email || !req.body.firstName || !req.body.password){
      console.log("Please Provide Full Details.");
      var myResponse = responseGenerator.generate(true,"Please Provide Full Details.",400,null);
      res.send(myResponse);
    }
    else{

      var today = Date.now();
      var id = shortid.generate();
      var epass = encrypt.encryptPassword(req.body.password);

      //create user.
      var newUser = new userModel({

        userId : id,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : epass,
        secureQuestion : req.body.secureQuestion,
        secureAnswer : req.body.secureAnswer,
        contact : req.body.contact,
        houseNo : req.body.houseNo,
        city : req.body.city,
        state : req.body.state,
        country : req.body.country,
        pinCode : req.body.pinCode,
        landMark: req.body.landMark,
        createdOn : today,
        updatedOn : today

      });

      newUser.save(function(err,result){
        if(err){
          console.log(err);
          var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
          res.send(myResponse);
        }
        else if(result == undefined || result == null || result == ""){
          console.log("User Not Created. Please Try Again.");
          var myResponse = responseGenerator.generate(true,"User Not Created. Please Try Again.",400,null);
          res.send(myResponse);
        }
        else{
          req.user = result;
          delete req.user.password;
          req.session.user = result;
          delete req.session.user.password;

          console.log("User Created And Login Success.");
          var myResponse = responseGenerator.generate(false,"User Created And Login Success.",200,req.session.user);
          res.send(myResponse);
        }
      });

    }//end of else.

  });

  app.use('/user/api/v1',router);

}//end of controller function.
