const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop');
const path=require('path');
const rootDir=require('./util/path');
const errorController=require('./controllers/404');
const sequelize=require('./util/databse');
const Product = require('./models/product');
const User = require('./models/user');
const Cart=require('./models/cart');
const CartItem=require('./models/cart-item')
app.set('view engine','ejs');
app.set('views','views');


app.use(bodyParser.urlencoded({extended:false}));//Body Parser
app.use(express.static(path.join(rootDir,'public')));
app.use((req,res,next)=>{
    User.findByPk(1).then(user=>{
        req.user=user;
        next();
    })
})
app.use('/admin',adminRoutes.routes);
app.use(shopRoutes);
app.use('/',errorController.getError);

Product.belongsTo(User,{constraints :true, onDelete : 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through : CartItem});
Product.belongsToMany(Cart,{through : CartItem});

sequelize.sync()
.then(result=> {
    return User.findByPk(1)
    //console.log(result)
    
})
.then(user=>{
    if(!user){
        return User.create({name: 'Shekhar', email: 'kshekhar@test.com'})
        
    }
    return user;
})
.then(user=>{
    //console.log(user);
    return user.createCart();
    
}).then(cart=>{
    app.listen(8080);
})
.catch();


//Section 5 Completed