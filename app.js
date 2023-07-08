const express=require('express');
const app=express();
const bodyParser=require('body-parser');
// const adminRoutes=require('./routes/admin');
// const shopRoutes=require('./routes/shop');
const path=require('path');
const rootDir=require('./util/path');
const errorController=require('./controllers/404');
const mongoConnect=require('./util/databse').mongoConnect;
app.set('view engine','ejs');
app.set('views','views');


app.use(bodyParser.urlencoded({extended:false}));//Body Parser
app.use(express.static(path.join(rootDir,'public')));
app.use((req,res,next)=>{
    // User.findByPk(1).then(user=>{
    //     req.user=user;
    //     next();
    // })
})
// app.use('/admin',adminRoutes.routes);
// app.use(shopRoutes);
app.use('/',errorController.getError);
mongoConnect(()=>{
    app.listen(3000);
})


//Section 5 Completed