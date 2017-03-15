//including dependencies.
var express = require('express');
var mongoose = require('mongoose');

//including libs and middlewares
var responseGenerator = require("../../libs/responseGenerator.js");
var cart = require('../../libs/guest-cart.js');

var router = express.Router();

//defining model.
var userModel = mongoose.model('User');
var productModel = mongoose.model('Product');

//defining controller function.
module.exports.controller = function(app){

  //router to show cart data.
  router.get("/cart",function(req,res){

    //function defined at last to show cart.
    showCart(res,req.session.cart);

  });

  //router to make cart empty.
  router.get("/cart/empty",function(req,res){
    delete req.session.cart;

    console.log("All Products Removed. Cart Is Empty.");
    var myResponse = responseGenerator.generate(false,"All Products Removed. Cart Is Empty.",404,null);
    res.send(myResponse);
  });

  //router for adding products to cart.
  router.get("/product/add-to-cart/:id",function(req,res){

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
        var oldCart = req.session.cart;
        req.session.cart = cart.addProduct(oldCart,result,req.params.id);
        req.cart = req.session.cart;

        //function defined at last to show cart.
        showCart(res,req.session.cart);
      }
    });

  });

  //router for deleting products from cart.
  router.get("/product/delete-from-cart/:id",function(req,res){

    var oldCart = req.session.cart;
    req.session.cart = cart.deleteProduct(oldCart,req.params.id);
    req.cart = req.session.cart;

    //function defined at last to show cart.
    showCart(res,req.session.cart);
  });

  //router for adding one product to cart.
  router.get("/product/addOne-to-cart/:id",function(req,res){

    var oldCart = req.session.cart;
    req.session.cart = cart.addOne(oldCart,req.params.id);
    req.cart = req.session.cart;

    //function defined at last to show cart.
    showCart(res,req.session.cart);
  });

  //router for deleting one product from cart.
  router.get("/product/deleteOne-from-cart/:id",function(req,res){

    var oldCart = req.session.cart;
    req.session.cart = cart.deleteOne(oldCart,req.params.id);
    req.cart = req.session.cart;

    //function defined at last to show cart.
    showCart(res,req.session.cart);
  });


  //function to show cart data.
  var showCart = function(res,cart){

    if(cart.empty){
      console.log("Cart Is Empty. Add Some Products.");
      var myResponse = responseGenerator.generate(false,"Cart Is Empty. Add Some Products.",404,cart);
      res.send(myResponse);
    }
    else {
      console.log("Showing Cart Data.");
      var myResponse = responseGenerator.generate(false,"Showing Cart Data.",200,cart);
      res.send(myResponse);
    }

  };


  app.use('/user/api/v1',router);

}//end of controller function.
