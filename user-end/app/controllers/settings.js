//including dependencies.
var express = require('express');
var mongoose = require('mongoose');

//including libs and middlewares
var responseGenerator = require("../../libs/responseGenerator.js");
var auth = require('../../middlewares/auth.js');
var encrypt = require('../../libs/encrypt.js');

var router = express.Router();

//defining model.
var userModel = mongoose.model('User');

//defining controller function.
module.exports.controller = function(app){

  //router to modify email.
  router.put("/account/modify/:userId",auth.checkLogin,function(req,res){

    //setting current updated date.
    req.body.updatedOn = Date.now();
    var update = req.body;
    userModel.findOneAndUpdate({'userId':req.params.userId},update,function(err,result){
      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
        res.send(myResponse);
      }
      else if(result == undefined || result == null || result == ""){
        console.log("User Does Not Exist.");
        var myResponse = responseGenerator.generate(true,"User Does Not Exist.",404,null);
        res.send(myResponse);
      }
      else{
        //reading and showing the updated result.
        userModel.findOne({'userId':req.params.userId},function(err,newResult){

          if(err){
            console.log(err);
            var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
            res.send(myResponse);
          }
          else{
            //resaving session data.
            req.user = newResult;
            delete req.user.password;
            req.session.user = newResult;
            delete req.session.user.password;

            console.log("User Updation Success.");
            var myResponse = responseGenerator.generate(false,"User Updation Success.",200,req.session.user);
            res.send(myResponse);
          }
        });
      }
    });

  });

  //router to change password.
  router.put("/change/password/:userId",auth.checkLogin,function(req,res){

    if(!req.body.oldPassword || !req.body.password){
      console.log("Please Provide 'oldPassword' and New 'password'.");
      var myResponse = responseGenerator.generate(true,"Please Provide 'oldPassword' and New 'password'.",400,null);
      res.send(myResponse);
    }
    else{

      //encrypting provided passwords.
      var eoldPass = encrypt.encryptPassword(req.body.oldPassword);
      var epass = encrypt.encryptPassword(req.body.password);

      //setting current updated date.
      req.body.updatedOn = Date.now();
      //saving new encrypted password in req.body.password object.
      req.body.password = epass;
      //deleting oldPassword field from req.body object.
      delete req.body.oldPassword;
      //saving req.body object in variable.
      var update = req.body;

      //finding user.
      userModel.findOne({$and:[{'userId':req.params.userId},{'password':eoldPass}]},function(err,result){
        if(err){
          console.log(err);
          var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
          res.send(myResponse);
        }
        else if(result == undefined || result == null || result == ""){
          console.log("User Does Not Exist. Or Incorrect Password.");
          var myResponse = responseGenerator.generate(true,"User Does Not Exist. Or Incorrect Password.",404,null);
          res.send(myResponse);

        }
        else{

          //updating password.
          userModel.findOneAndUpdate({'userId':req.params.userId},update,function(err,newResult){
            if(err){
              console.log(err);
              var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
              res.send(myResponse);
            }
            else{

              //making user logout on password change.So as to login again.
              req.user = null;
              req.session.user = null;

              console.log("Password Change And Logout Success.");
              var myResponse = responseGenerator.generate(false,"Password Change And Logout Success.",200,null);
              res.send(myResponse);
            }
          });
        }
      });

    }
  });

  //router to delete account.
  router.post("/account/delete/:userId",auth.checkLogin,function(req,res){
    userModel.remove({'userId':req.params.userId},function(err,result){

      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
        res.send(myResponse);
      }
      else{
        //parsing JSON data for accessing fields of result.
        var newResult = JSON.parse(result);

        if(result == undefined || result == null || result == "" || newResult.n == 0){
          console.log("User Does Not Exist.");
          var myResponse = responseGenerator.generate(true,"User Does Not Exist.",404,null);
          res.send(myResponse);

        }
        else{
          //making user logout on Deleting account.
          req.user = null;
          req.session.user = null;

          console.log("Account Deleted And Logout Success.");
          var myResponse = responseGenerator.generate(false,"Account Deleted And Logout Success.",200,null);
          res.send(myResponse);
        }
      }
    });
  });

  app.use('/user/api/v1',router);

}//end of controller function.
