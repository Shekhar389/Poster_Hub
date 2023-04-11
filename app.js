const express=require('express');
const app=express();
const bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use('/add-product',(req, res, next)=>{
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Set Tittle</button></form>');
})
app.post('/product',(req, res, next)=>{
    const title=req.body;
    console.log(title.title);
    res.redirect('/');
})
app.use('/',(req, res, next)=>{
    res.send('<h1>Hello Express</h1>');
})







app.listen(3000);

