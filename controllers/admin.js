const Product=require('../models/product');
exports.postAddProduct=(req, res, next)=>{
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const discription=req.body.discription;

    const product =new Product(title,imageUrl,discription,price);
    product.save();
    res.redirect('/');
};
exports.getAddProduct=(req, res, next)=>{
    res.render('admin/add-product',{ 
        pageTitle:"Add-Product",
        path: '/admin/add-product'
    });
};
exports.getProduct=(req, res, next)=>{
    Product.fetchAll((products)=>{
        res.render('admin/products',{ 
            prods:products,
            path :'/admin.products',
            pageTitle:'Admin Products',
        })})};