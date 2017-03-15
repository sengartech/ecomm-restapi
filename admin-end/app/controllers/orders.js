//including dependencies.
var express = require('express');
var mongoose = require('mongoose');

//including libs and middlewares
var responseGenerator = require("../../libs/responseGenerator.js");
var auth = require('../../middlewares/auth.js');

var router = express.Router();

//defining model.
var orderModel = mongoose.model('Order');

//defining controller function.
module.exports.controller = function(app){

  router.get("/orders",auth.checkLogin,function(req,res){

    orderModel.find({})
              .sort('-orderDate')
              .exec(function(err,result){
                if(err){
                  console.log(err);
                  var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
                  res.send(myResponse);
                }
                else if(result == undefined || result == null || result == ""){
                  console.log("No Orders Placed Yet.");
                  var myResponse = responseGenerator.generate(true,"No Orders Placed Yet.",404,null);
                  res.send(myResponse);
                }
                else{
                  console.log("Orders Found Success.");
                  var myResponse = responseGenerator.generate(false,"Orders Found Success.",200,result);
                  res.send(myResponse);
                }
              });
  });

  app.use('/admin/api/v1',router);

}//end of controller function.
