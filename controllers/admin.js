const Product=require('../models/product');
exports.postAddProduct=(req, res, next)=>{
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const discription=req.body.discription;

    const product =new Product(null,title,imageUrl,discription,price);
    product.save();
    res.redirect('/');
};
exports.getEditProduct=(req, res, next)=>{
    const editMode=req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId=req.params.productId;
    Product.findById(prodId,product=>{
        if(!product)
        {
            return res.redirect('/');
        }
        res.render('admin/edit-product',{ 
            pageTitle:"Add-Product",
            editing: editMode,
            path: '/admin/edit-product',
            product : product
        });
    })
    
};
exports.postEditProduct=(req,res,next)=>{
const prodId=req.body.productId;
const updatedTitle=req.body.title;
const updatedPrice=req.body.price;
const updatedImage=req.body.imageUrl;
const updatedDiscription=req.body.discription;
const updatedProduct=new Product(prodId,updatedTitle,updatedImage,updatedDiscription,updatedPrice);
updatedProduct.save();
res.redirect('/admin/products');
}
exports.postDeleteProduct=(req,res,next)=>{
        const prodId=req.body.productId;
        Product.delete(prodId);
        res.redirect('/admin/products');
}
exports.getAddProduct=(req, res, next)=>{
    res.render('admin/edit-product',{ 
        pageTitle:"Add-Product",
        path: '/admin/add-product',
        editing:false,
    });
};
exports.getProduct=(req, res, next)=>{
    Product.fetchAll((products)=>{
        res.render('admin/products',{ 
            prods:products,
            path :'/admin/products',
            pageTitle:'Admin Products',
        })})};