const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const adminData=require('./routes/admin');
const shopRoutes=require('./routes/shop');
const path=require('path');
const rootDir=require('./util/path');
app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));//Body Parser
app.use(express.static(path.join(rootDir,'public')));

app.use('/admin',adminData.routes);
app.use(shopRoutes);
app.use('/',(req,res,next)=> {
    res.status(404).render('404',{pageTitle:'404'})
});

app.listen(8080);

//Section 5 Completed