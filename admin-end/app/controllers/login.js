//including dependencies.
var express = require('express');
var mongoose = require('mongoose');

//including libs and middlewares
var responseGenerator = require("../../libs/responseGenerator.js");

var router = express.Router();

//defining model.
var adminModel = mongoose.model('Admin');

//defining controller function.
module.exports.controller = function(app){

  //router for logout.
  router.get('/logout',function(req,res){
    req.session.destroy(function(err){
      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
        res.send(myResponse);
      }
      else{
        console.log("Logout Success.");
        var myResponse = responseGenerator.generate(false,"Logout Success.",200,null);
        res.send(myResponse);
      }
    });
  });

  //router for login admin.
  router.post('/login',function(req,res){
    adminModel.findOne({$and:[{'username':req.body.username},{'password':req.body.password}]},function(err,result){
      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
        res.send(myResponse);
      }
      else if(result == null || result == undefined || result == ""){
        console.log("User Not Found. Please Check Your Username and Password.");
        var myResponse = responseGenerator.generate(true,"User Not Found. Please Check Your Username and Password.",404,null);
        res.send(myResponse);
      }
      else{
        req.admin = result;
        delete req.admin.password;
        req.session.admin = result;
        delete req.session.admin.password;

        console.log("Admin Login Success.");
        var myResponse = responseGenerator.generate(false,"Admin Login Success.",200,result);
        res.send(myResponse);
      }
    });
  });

  app.use('/admin/api/v1',router);

}//end of controller function.
