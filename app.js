const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop');
const path=require('path');
const rootDir=require('./util/path');
const errorController=require('./controllers/404');
const db=require('./util/databse');
app.set('view engine','ejs');
app.set('views','views');


app.use(bodyParser.urlencoded({extended:false}));//Body Parser
app.use(express.static(path.join(rootDir,'public')));

app.use('/admin',adminRoutes.routes);
app.use(shopRoutes);
app.use('/',errorController.getError);

app.listen(8080);

//Section 5 Completed