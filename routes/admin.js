const express=require('express');
const router=express.Router();
const path=require('path');
router.get('/add-product',(req, res, next)=>{
    res.sendFile(path.join(__dirname,'../','views','add-product.html'));
})
router.post('/product',(req, res, next)=>{
    const title=req.body;
    console.log(title.title);
    res.redirect('/');
})

module.exports=router;