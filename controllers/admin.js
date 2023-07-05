const Product=require('../models/product');
exports.postAddProduct=(req, res, next)=>{
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const discription=req.body.discription;
    Product.create({
        title :title,
        imageUrl:imageUrl,
        price:price,
        description:discription,
    }).then(result=>{
        res.redirect('/admin/products')
        console.log(result);
    }).catch(err=>{console.log(err);})
    
};
exports.getEditProduct=(req, res, next)=>{
    const editMode=req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId=req.params.productId;
    Product.findByPk(prodId).then(product=>{
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
Product.findByPk(prodId).then(
    product=>{
        product.title=updatedTitle;
        product.price=updatedPrice;
        product.description=updatedDiscription;
        product.imageUrl=updatedImage;
        return product.save()//method provide by sequelize
    })
    .then(console.log("Product Updated Successfully"),
    res.redirect('/admin/products')).catch(err=>{console.log(err)});

}
exports.postDeleteProduct=(req,res,next)=>{
        const prodId=req.body.productId;
        Product.findByPk(prodId).then(product=>{
            return product.destroy();
        }).then(result=>console.log(result));
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
    Product.findAll().then(products=>{
        res.render('admin/products',{ 
            prods:products,
            path :'/admin/products',
            pageTitle:'Admin Products',
        })})};