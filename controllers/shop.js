const Product=require('../models/product');
exports.getProducts=(req, res, next)=>{
    Product.fetchAll((products)=>{
       res.render('shop/product-list',{
        prods:products,
        docTitle:"All Products",
        path :'/products',
        pageTitle:'Shop'
    });
   });
   };

   exports.getIndex=(req, res, next)=>{
    
    Product.fetchAll((products)=>{
        res.render('shop/product-list',{ 
            prods:products,
            path :'/',
            pageTitle:'Shop',
        });
    });
   };

   exports.getCart=(req,res,next)=>{
    res.render('shop/cart',{
        path :'/cart',
        pageTitle: 'Your Cart',
    });
   }

   exports.getChekout=(req,res,next)=>{
    res.render('shop/checkout',{
        path :'/checkout',
        pageTitle: 'checkout',
    });
   }


