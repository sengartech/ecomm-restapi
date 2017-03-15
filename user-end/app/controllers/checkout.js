//including dependencies.
var express = require('express');
var mongoose = require('mongoose');

//including libs and middlewares
var responseGenerator = require("../../libs/responseGenerator.js");
var auth = require('../../middlewares/auth.js');

var router = express.Router();

//defining model.
var productModel = mongoose.model('Product');
var userModel = mongoose.model('User');
var orderModel = mongoose.model('Order');

//defining controller function.
module.exports.controller = function(app){

  //router to make order.
  router.get("/checkout/make-order",auth.checkLogin,function(req,res){

    if(req.session.cart.empty){
      console.log("Order Can Not Be Placed. Cart Is Empty.");
      var myResponse = responseGenerator.generate(true,"Order Can Not Be Placed. Cart Is Empty.",404,null);
      res.send(myResponse);
    }
    else{

      var arrId = [];
      var arrQty = [];
      var arrName = [];
      var arrPrice = [];
      var count = 0;
      for(id in req.session.cart.items){
        arrId.push(id);
        arrQty.push(req.session.cart.items[id].quantity);
        arrName.push(req.session.cart.items[id].item.productName);
        arrPrice.push(req.session.cart.items[id].item.price);
        count++;
      }

      today = Date.now();

      var newOrder = new orderModel({

        orderedBy : req.session.user.userId,
        productId : arrId,
        productName : arrName,
        productPrice : arrPrice,
        productQty : arrQty,
        uniqueProducts : count,
        quantity : req.session.cart.totalQuantity,
        price : req.session.cart.totalPrice,
        orderDate :today,
        contact : req.session.user.contact,
        houseNo : req.session.user.houseNo,
        city : req.session.user.city,
        state : req.session.user.state,
        country : req.session.user.country,
        pinCode : req.session.user.pinCode,
        landMark : req.session.user.landMark

      });

      newOrder.save(function(err,result){
        if(err){
          console.log(err);
          var myResponse = responseGenerator.generate(true,"Some Error : "+err,500,null);
          res.send(myResponse);
        }
        else if(result == undefined || result == null || result == ""){
          console.log("Order Is Not Placed. Please Try Again.");
          var myResponse = responseGenerator.generate(true,"Order Is Not Placed. Please Try Again.",404,null);
          res.send(myResponse);
        }
        else{
          delete req.session.cart;

          console.log("Order Placed Success.");
          var myResponse = responseGenerator.generate(false,"Order Placed Success.",200,result);
          res.send(myResponse);
        }
      });

    }//end of else.

  });

  app.use('/user/api/v1',router);

}//end of controller function.
