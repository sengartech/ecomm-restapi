//including dependencies.
var express = require('express');
var mongoose = require('mongoose');

//including libs and middlewares
var responseGenerator = require("../../libs/responseGenerator.js");
var auth = require('../../middlewares/auth.js');

var router = express.Router();

//defining model.
var productModel = mongoose.model('Product');

//defining controller function.
module.exports.controller = function(app){

  //router for api product creation.
  router.post("/product/create",function(req,res){

    var today = Date.now();

    //create product.
    var newProduct = new productModel({

      productName : req.body.productName,
      category : req.body.category,
      price : req.body.price,
      description : req.body.description,
      quantity : req.body.quantity,
      color : req.body.color,
      model : req.body.model,
      brandName : req.body.brandName,
      size : req.body.size,
      createdOn : today,
      updatedOn : today

    });

    //saving details.
    newProduct.save(function(err,result){
      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
        res.send(myResponse);
      }
      else if(result == undefined || result == null || result == ""){
        console.log("Product Is Not Created. Please Try Again.");
        var myResponse = responseGenerator.generate(true,"Product Is Not Created. Please Try Again.",404,null);
        res.send(myResponse);
      }
      else{
        console.log("Product Creation Success.");
        var myResponse = responseGenerator.generate(false,"Product Creation Success.",200,result);
        res.send(myResponse);

      }
    });

  });

  app.use("/admin/api/v1",router);

}//end of controller function.
