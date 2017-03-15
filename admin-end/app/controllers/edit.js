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

  //router for api editing product.
  router.put("/product/edit/:id",auth.checkLogin,function(req,res){
    //setting current updated date.
    req.body.updatedOn = Date.now();
    var update = req.body;

    productModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){
      if(err){
        console.log(err);
        var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
        res.send(myResponse);
      }
      else if(result == undefined || result == null || result == ""){
        console.log("Product Does Not Exist. Please Check Your Input.");
        var myResponse = responseGenerator.generate(true,"Product Does Not Exist. Please Check Your Input.",404,null);
        res.send(myResponse);
      }
      else{
        //reading and showing the updated result.
        productModel.findOne({'_id':req.params.id},function(err,newResult){
          console.log("Product Updation Success.");
          var myResponse = responseGenerator.generate(false,"Product Updation Success.",200,newResult);
          res.send(myResponse);
        });
      }

    });
  });

  app.use("/admin/api/v1",router);

}//end of controller function.
