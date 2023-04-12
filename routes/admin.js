const express=require('express');
const router=express.Router();

router.get('/add-product',(req, res, next)=>{
    res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Set Tittle</button></form>');
})
router.post('/product',(req, res, next)=>{
    const title=req.body;
    console.log(title.title);
    res.redirect('/');
})

module.exports=router;