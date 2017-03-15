//including dependencies.
var express = require('express');
var mongoose = require('mongoose');
// var sync = require('synchronize');

//including libs and middlewares
var responseGenerator = require("../../libs/responseGenerator.js");
var auth = require('../../middlewares/auth.js');

var router = express.Router();

//defining model.
var adminModel = mongoose.model('Admin');
// var productModel = mongoose.model('Product');
// var userModel = mongoose.model('User');
// var orderModel = mongoose.model('Order');

//defining controller function.
module.exports.controller = function(app){

  //route to create a admin.
  router.post("/create",function(req,res){

    //getting current date.
    var today = Date.now();

    var newAdmin = new adminModel({

      username : req.body.username,
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      email : req.body.email,
      password : req.body.password,
      createdOn : today

    });
    //saving new blog.
    newAdmin.save(function(err,result){
      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
        res.send(myResponse);
      }
      else if(result == null || result == undefined || result == ""){
        console.log("Admin Is Not Created.");
        var myResponse = responseGenerator.generate(true,"Admin Is Not Created.",404,null);
        res.send(myResponse);
      }
      else{
        console.log("Admin Creation Success.");
        var myResponse = responseGenerator.generate(false,"Admin Creation Success.",200,result);
        res.send(myResponse);
      }
    });
  });


  app.use("/admin",router);

}//end of controller function.
