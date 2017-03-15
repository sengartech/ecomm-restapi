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
              .where('orderedBy').equals(req.session.user.userId)
              .sort('-orderDate')
              .exec(function(err,result){
                if(err){
                  console.log(err);
                  var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
                  res.send(myResponse);
                }
                else if(result == undefined || result == null || result == ""){
                  console.log("Orders Not Found.");
                  var myResponse = responseGenerator.generate(true,"Orders Not Found.",404,null);
                  res.send(myResponse);
                }
                else{
                  console.log("Showing Orders.");
                  var myResponse = responseGenerator.generate(false,"Orders Found Success.",200,result);
                  res.send(myResponse);
                }
              });
  });

  app.use('/user/api/v1',router);

}//end of controller function.
