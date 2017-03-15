//including dependencies.
var express = require('express');
var mongoose = require('mongoose');

//including libs and middlewares
var responseGenerator = require("../../libs/responseGenerator.js");
var auth = require('../../middlewares/auth.js');

var router = express.Router();

//defining model.
var userModel = mongoose.model('User');

//defining controller function.
module.exports.controller = function(app){

  router.get("/users",auth.checkLogin,function(req,res){

    userModel.find({},function(err,result){
      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
        res.send(myResponse);
      }
      else if(result == undefined || result == null || result == ""){
        console.log("Users Not Found.");
        var myResponse = responseGenerator.generate(true,"Users Not Found",404,null);
        res.send(myResponse);
      }
      else{
        console.log("Users Found Success.");
        var myResponse = responseGenerator.generate(false,"Users Found Success.",200,result);
        res.send(myResponse);
      }
    });
  });

  app.use('/admin/api/v1',router);

}//end of controller function.
