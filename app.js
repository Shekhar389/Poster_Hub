const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop');
const path=require('path');
const rootDir=require('./util/path');
const errorController=require('./controllers/404');
const User=require('./models/user');
const mongoose=require('mongoose');
app.set('view engine','ejs');
app.set('views','views');


app.use(bodyParser.urlencoded({extended:false}));//Body Parser
app.use(express.static(path.join(rootDir,'public')));
app.use((req,res,next)=>{
    User.findById('64aa8ec5d0f9ab87e4878b2b').then(user=>{
        //console.log(user);
        req.user= user;
        next();
    })
    })

app.use('/admin',adminRoutes.routes);
app.use(shopRoutes);
app.use('/',errorController.getError);
mongoose.connect('mongodb+srv://kshekhar2807:mKMIOJ2RI6Q6gawO@cluster0.gcxkevb.mongodb.net/shop?retryWrites=true&w=majority')
.then(result=>{
    User.findOne().then(user=>{
        if(!user){
            const user=new User({
                name:"Shekhar",
                email:"shekhar@test.com",
                cart:{
                    item:[]
                }
            })
            user.save();
        }
    })
    
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})


//Section 5 Completed