const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop');
const path=require('path');
const rootDir=require('./util/path');
const errorController=require('./controllers/404');
const mongoConnect=require('./util/databse').mongoConnect;
const User=require('./models/user');
app.set('view engine','ejs');
app.set('views','views');


app.use(bodyParser.urlencoded({extended:false}));//Body Parser
app.use(express.static(path.join(rootDir,'public')));
app.use((req,res,next)=>{
    User.findById('64aa78a8ba8cd03f2504b364').then(user=>{
        //console.log(user);
        req.user=new User(user.name,user.email,user.cart,user._id);
        next();
    })
    })

app.use('/admin',adminRoutes.routes);
app.use(shopRoutes);
app.use('/',errorController.getError);
mongoConnect(()=>{
    app.listen(3000);
})


//Section 5 Completed