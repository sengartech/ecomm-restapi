//including dependencies.
var express = require('express');
var mongoose = require('mongoose');

//including libs and middlewares
var responseGenerator = require("../../libs/responseGenerator.js");

var router = express.Router();

//defining model.
var productModel = mongoose.model('Product');

//defining controller function.
module.exports.controller = function(app){

  router.get("/product/list",function(req,res){
    productModel.find({},function(err,result){
      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
        res.send(myResponse);
      }
      else if(result == undefined || result == null || result == ""){
        console.log("No Products Are Created Yet.");
        var myResponse = responseGenerator.generate(true,"No Products Are Created Yet.",404,null);
        res.send(myResponse);
      }
      else{
        console.log("Products Found Success.");
        var myResponse = responseGenerator.generate(false,"Products Found Success.",200,result);
        res.send(myResponse);
      }
    });
  });

  //single-product.
  router.get('/product/single-product/:id',function(req,res){
    productModel.findOne({'_id':req.params.id},function(err,result){
      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
        res.send(myResponse);
      }
      else if(result == undefined || result == null || result == ""){
        console.log("Product Not Found.");
        var myResponse = responseGenerator.generate(true,"Product Not Found.",404,null);
        res.send(myResponse);
      }
      else{
        console.log("Product Found Success.");
        var myResponse = responseGenerator.generate(false,"Product Found Success.",200,result);
        res.send(myResponse);
      }
    });
  });

  app.use('/user/api/v1',router);

}//end of controller function.
