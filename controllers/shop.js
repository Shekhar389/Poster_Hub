const Product=require('../models/product');
const Cart=require('../models/cart')
exports.getProducts=(req, res, next)=>{
    Product.findAll().then(products =>{
      res.render('shop/product-list',{
        prods:products,
        path :'/products',
        pageTitle:'Shop'
      })}
    )}
    ;

   exports.getProduct=(req,res,next)=>{
    const prodId=req.params.productId;
    Product.findByPk(prodId).then(product=>{
      console.log(product);
      res.render('shop/product-detail',{product: product,
      pageTitle:product.title,
      path:'/product'
      })
    })
  };


   exports.getIndex=(req, res, next)=>{
    
    Product.findAll()
    .then(products=>{
      res.render('shop/product-list',{ 
        prods:products,
        path :'/',
        pageTitle:'Shop',
    });
    })
    .catch(err=>{
      console.log(err)
    });
    
   };

   exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
      Product.fetchAll(products => {
        const cartProducts = [];
        for (product of products) {
          const cartProductData = cart.products.find(
            prod => prod.id === product.id
          );
          if (cartProductData) {
            cartProducts.push({ productData: product, qty: cartProductData.qty });
          }
        }
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: cartProducts
        });
      });
    });
  };
   exports.postCart=(req,res,next)=>{
        const prodId=req.body.productId;
        Product.findById(prodId,(product)=>{
            Cart.addProduct(prodId,product.price);
        })
        res.redirect('/cart');
   };
   exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
      Cart.deleteProduct(prodId, product.price);
      res.redirect('/cart');
    });
  };
   exports.getOrders=(req,res,next)=>{
    res.render('shop/orders',{
        path :'/orders',
        pageTitle: 'Your Orders',
    });
   }

   exports.getChekout=(req,res,next)=>{
    res.render('shop/checkout',{
        path :'/checkout',
        pageTitle: 'checkout',
    });
   }


