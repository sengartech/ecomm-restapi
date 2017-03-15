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

  //router for logout.
  router.get('/logout',function(req,res){

    //to prevent session.cart , I have not used req.session.destroy().
    req.session.user = null;

    console.log("Logout Success.");
    var myResponse = responseGenerator.generate(false,"Logout Success.",200,null);
    res.send(myResponse);
  });

  //router for login admin.
  router.post('/login',auth.loggedIn,function(req,res){

    var epass = encrypt.encryptPassword(req.body.password);

    userModel.findOne({$and:[{'email':req.body.email},{'password':epass}]},function(err,result){
      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
        res.send(myResponse);
      }
      else if(result == null || result == undefined || result == ""){
        console.log("User Not Found. Please Check Your Input.");
        var myResponse = responseGenerator.generate(true,"User Not Found. Please Check Your Input.",404,null);
        res.send(myResponse);
      }
      else{
        req.user = result;
        delete req.user.password;
        req.session.user = result;
        delete req.session.user.password;

        console.log("User Login Success.");
        var myResponse = responseGenerator.generate(false,"User Login Success.",200,req.session.user);
        res.send(myResponse);
      }
    });
  });

  app.use('/user/api/v1',router);

}//end of controller function.
