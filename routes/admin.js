const express=require('express');
const router=express.Router();
const path=require('path');

const rootDir=require('../util/path');

const products=[];
router.get('/add-product',(req, res, next)=>{
    res.render('add-product',{pageTitle:"Add"});
})
router.post('/product',(req, res, next)=>{
    products.push({title : req.body.title});
    res.redirect('/');
})
exports.routes=router;
exports.products=products;