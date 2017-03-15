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

  //router for api deleting product.
  router.post("/product/delete/:id",auth.checkLogin,function(req,res){
    productModel.remove({'_id':req.params.id},function(err,result){

      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
        res.send(myResponse);
      }
      else{
        //parsing JSON data for accessing fields of result.
        var newResult = JSON.parse(result);
        
        if(result == undefined || result == null || result == "" || newResult.n == 0){
          console.log("Product Does Not Exist. Please Check Your Input.");
          var myResponse = responseGenerator.generate(true,"Product Does Not Exist. Please Check Your Input.",404,null);
          res.send(myResponse);
        }
        else{
          console.log("Product Deletion Success.");
          var myResponse = responseGenerator.generate(false,"Product Deletion Success.",200,result);
          res.send(myResponse);

        }
      }
    });
  });

  app.use("/admin/api/v1",router);

}//end of controller function.
