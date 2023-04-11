const express=require('express');
const app=express();

app.use('/app-product',(req, res, next)=>{
    console.log("In the another Middleware");
    res.send('<h1>The add product</h1>');
})
app.use('/',(req, res, next)=>{
    console.log("In this  Middleware");
    res.send('<h1>Hello</h1>');
})







app.listen(3000);

