


require("dotenv").config();

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
const multer=require('multer')
const MONGODB_URI=process.env.MONGO_DB;
const store=MongoDBStore({

    uri:MONGODB_URI,
    collection:'sessions',
});

const csrfProtection=csrf();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/png'||file.mimetype==='image/jpg'||file.mimetype==='image/jpeg'){
        cb(null,true);
    }
    else{
    cb(null,false);
    }
}
app.use(flash());
app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));//Body Parser
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'))
app.use(express.static(path.join(rootDir,'public')));
app.use('/images',express.static(path.join(rootDir,'images')));
app.use(session({secret:'my secret',resave: false,saveUninitialized:false,store:store} ));
app.use(csrfProtection)
app.use((req,res,next)=>{
    if(!req.session.user){
       return next();
    }
    User.findById(req.session.user._id).then(user=>{
        req.user=user;
        next();
        })
        .catch((err)=>{throw new Error(err)})
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
mongoose.connect(MONGODB_URI)
.then(result=>{
    app.listen(process.env.PORT || 8001);
})
.catch(err=>{
    console.log(err);
})
