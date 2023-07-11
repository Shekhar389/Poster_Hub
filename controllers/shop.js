const Product=require('../models/product');
const Order=require('../models/order');
// const Order= require('../models/order')
exports.getProducts=(req, res, next)=>{
    Product.find().then(products =>{
      res.render('shop/product-list',{
        prods:products,
        path :'/products',
        pageTitle:'Shop',
        isAuthenticated:req.session.isLoggedin
      })}
    )}
    ;

   exports.getProduct=(req,res,next)=>{
    const prodId=req.params.productId;
    Product.findById(prodId).then(product=>{
      console.log(product);
      res.render('shop/product-detail',{product: product,
      pageTitle:product.title,
      path:'/product',
      isAuthenticated:req.session.isLoggedin
      })
    })
  };


   exports.getIndex=(req, res, next)=>{
    
    Product.find()
    .then(products=>{
      res.render('shop/product-list',{ 
        prods:products,
        path :'/',
        pageTitle:'Shop',
        isAuthenticated:req.session.isLoggedin
    });
    })
    .catch(err=>{
      console.log(err)
    });
    
   };

   exports.getCart = (req, res, next) => {
   
   req.session.user.populate('cart.item.productId')
  .then(user=>{
      console.log(user.cart.item);
      const products=user.cart.item;
      res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products: products,
              isAuthenticated:req.session.isLoggedin
      })})
  


  };
   exports.postCart=(req,res,next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product=>{
      return req.session.user.addToCart(product);
    }).then(result=>{
      console.log(result);
      res.redirect('/cart')
    })
  }

   exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.session.user.removeFromCart(prodId)
      .then(result=>{
        res.redirect('/cart');
      }).catch();
  };

  exports.postOrder = (req, res, next) => {
    req.session.user.populate('cart.item.productId')
    .then(user=>{
    console.log(user.cart.item);
    const products=user.cart.item.map(i=>{
    return {quantity : i.quantity, product :{...i.productId._doc}}
    });
    const order=new Order({
      user:{
        name :req.session.user.name,
        userId:req.session.user
      },
      products:products
    });
    return order.save();
  }).then(result=>{
    return req.session.user.clearCart();
  })
  .then(()=>{
    res.redirect('/orders')
  })
  .catch()
  };

   exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.session.user._id})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated:req.session.isLoggedin
      });
      console.log("Order Object")
      console.log(orders);
    })
    .catch(err => console.log(err));
};

//    exports.getChekout=(req,res,next)=>{
//     res.render('shop/checkout',{
//         path :'/checkout',
//         pageTitle: 'checkout',
//     });
//    }
