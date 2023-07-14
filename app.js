const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop');
const path=require('path');
const rootDir=require('./util/path');
const session=require('express-session')
const errorController=require('./controllers/404');
const User=require('./models/user');
const authRoutes=require('./routes/auth');
const mongoose=require('mongoose');
const MongoDBStore=require('connect-mongodb-session')(session)
const csrf=require('csurf')
const flash=require('connect-flash')
const MONGODB_URI='mongodb+srv://kshekhar2807:mKMIOJ2RI6Q6gawO@cluster0.gcxkevb.mongodb.net/shop';
const store=MongoDBStore({

    uri:MONGODB_URI,
    collection:'sessions',
});

const csrfProtection=csrf();
app.use(flash());
app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));//Body Parser
app.use(express.static(path.join(rootDir,'public')));
app.use(session({secret:'my secret',resave: false,saveUninitialized:false,store:store} ));
app.use(csrfProtection)
app.use((req,res,next)=>{
    if(!req.session.user){
       return next();
    }
    User.findById(req.session.user._id).then(user=>{
        //console.log(user);
        req.user=user;
        next();
        })
})

app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedin;
    res.locals.csrfToken=req.csrfToken();
    next();
})
app.use('/admin',adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/',errorController.getError);
mongoose.connect('mongodb+srv://kshekhar2807:mKMIOJ2RI6Q6gawO@cluster0.gcxkevb.mongodb.net/shop?retryWrites=true&w=majority')
.then(result=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})


//Section 5 Completed