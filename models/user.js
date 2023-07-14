const mongoose= require('mongoose');
const Schema= mongoose.Schema;
const userSchema= new Schema({
    
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    resetToken :String,
    resetTokenExpiration: Date,
    cart:{
        item: [{productId :{type:Schema.Types.ObjectId,ref:'Product',required:true},quantity :{type : Number,required:true}}]
    }
    
})

userSchema.methods.addToCart=function(product){

    const cartProductIndex =this.cart.item.findIndex(cp=>{
                    return cp.productId.toString() === product._id.toString();
                });
                let newQuantity=1;
                const updatedCartItems=[...this.cart.item]
                if(cartProductIndex>=0)
                {
                    newQuantity=this.cart.item[cartProductIndex].quantity+1;
                    updatedCartItems[cartProductIndex].quantity=newQuantity;
                }
                else{
                    updatedCartItems.
                        push({
                            productId : product._id,
                            quantity:newQuantity
                        })
                    
                }
               
                const updatedCart={item : updatedCartItems};
                this.cart=updatedCart;
                return this.save();
            }

            userSchema.methods.removeFromCart=function(productId){
                const updatedCartItems=this.cart.item.filter(i=>{
                    return i.productId.toString()!==productId.toString();
                })
                this.cart.item=updatedCartItems;
                return this.save();
            }

            userSchema.methods.clearCart=function(){
                this.cart={item:[]};
                return this.save();
            }


module.exports=mongoose.model('User',userSchema);






// const getDb=require('../util/databse').getDb;
// const mongodb=require('mongodb');
// class User{
//     constructor(username,email,cart,id)
//     {
//         this.name=username;
//         this.email=email;
//         this.cart=cart;
//         this._id=id;
//     }
//     save()
//     {
//         const db=getDb();
//         return db.collection('users').insertOne(this);
//     }
//     addToCart(product){
//         const cartProductIndex =this.cart.item.findIndex(cp=>{
//             return cp.productId.toString() === product._id.toString();
//         });
//         let newQuantity=1;
//         const updatedCartItems=[...this.cart.item]
//         if(cartProductIndex>=0)
//         {
//             newQuantity=this.cart.item[cartProductIndex].quantity+1;
//             updatedCartItems[cartProductIndex].quantity=newQuantity;
//         }
//         else{
//             updatedCartItems.
//                 push({
//                     productId : new mongodb.ObjectId(product._id),
//                     quantity:newQuantity
//                 })
            
//         }
       
//         const updatedCart={item : updatedCartItems};
//         const db=getDb();
//         return db.collection('users')
//         .updateOne({_id : new mongodb.ObjectId(this._id)},{$set :{cart : updatedCart}});
//     }
//     getCart()
//     {
//         const db=getDb();
//         const productIds=this.cart.item.map(i=>{
//             return i.productId;
//         })
        
//         return db.collection('products').find({_id : {$in: productIds}})
//         .toArray()
//         .then(products=>{
//             return products.map(p=>{
//                 return {
//                     ...p,quantity: this.cart.item.find(i=>{
//                     return i.productId.toString()===p._id.toString();
//                 }).quantity
//             }                
//             })
//         })
//     }
//     static findById(userId){
//         const db=getDb();
//         return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)}).then(user=>{ return user}).catch();
//     } 
//     deleteItemCart(productId){
        // const updatedCartItems=this.cart.item.filter(i=>{
        //     return i.productId.toString()!==productId.toString();
        // })
//         const db=getDb();
//             return db.collection('users')
//         .updateOne({_id : new mongodb.ObjectId(this._id)},{$set :{cart : {item : updatedCartItems}}});
//         }
//         addOrder() {
//             const db = getDb();
//             return this.getCart()
//               .then(products => {
//                 const order = {
//                   item: products,
//                   user: {
//                     _id: new mongodb.ObjectId(this._id),
//                     name: this.name
//                   }
//                 };
//                 return db.collection('orders').insertOne(order);
//               })
//               .then(result => {
//                 this.cart = { item: [] };
//                 return db
//                   .collection('users')
//                   .updateOne(
//                     { _id: new mongodb.ObjectId(this._id) },
//                     { $set: { cart: { item: [] } } }
//                   );
//               });
//           }
//           getOrders(){
//             const db=getDb();
//             return db.collection('orders')
//             .find({'user._id' : new mongodb.ObjectId(this._id)})
//             .toArray();
//           }
//     }
// module.exports=User;