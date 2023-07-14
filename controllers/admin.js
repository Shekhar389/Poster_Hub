const Product=require('../models/product')
exports.postAddProduct=(req, res, next)=>{
    const title=req.body.title;
    const image=req.file;
    const price=req.body.price;
    const description=req.body.description;
    if(!image){
        return res.render('404');
    }
    const imageUrl=image.path;
    const product =new Product({title:title,price:price,description:description,imageUrl:imageUrl,userId:req.user});
    product.save().then(result=>{
        res.redirect('/admin/products')
        console.log(result);
    }).catch(err=>{console.log(err)})
    
};
exports.getEditProduct=(req, res, next)=>{
    const editMode=req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId=req.params.productId;
    Product.findById(prodId)
    .then(product=>{
        if(!product)
        {
            return res.redirect('/');
        }
        res.render('admin/edit-product',{ 
            pageTitle:"Add-Product",
            editing: editMode,
            path: '/admin/edit-product',
            product : product,
            isAuthenticated:req.session.isLoggedin
        });
    })
    
 };
exports.postEditProduct=(req,res,next)=>{
const prodId=req.body.productId;
const updatedTitle=req.body.title;
const updatedPrice=req.body.price;
const image=req.file;
const updatedDiscription=req.body.discription;

Product.findById(prodId).then(product=>{
    if(product.userId.toString()!==req.user._id.toString()){
        return res.redirect('/');
    }
    product.title=updatedTitle;
    product.price=updatedPrice;
    product.description=updatedDiscription;
    product.imageUrl=updatedImage;
    return product.save()
    .then(result=>{
        console.log("Product Updated Successfully")
        res.redirect('/admin/products')})
})

    .catch(err=>{console.log(err)});

}
exports.postDeleteProduct=(req,res,next)=>{
        const prodId=req.body.productId;
        Product.deleteOne({_id:prodId,userId:req.user._id})
        .then(()=>{
            console.log("Deleted")
        }).catch();
}
exports.getAddProduct=(req, res, next)=>{
     res.render('admin/edit-product',{ 
         pageTitle:"Add-Product",
         path: '/admin/add-product',
         editing:false,
         isAuthenticated:req.session.isLoggedin
     });
 };
exports.getProduct=(req, res, next)=>{
    Product.find({userId:req.user._id})
    // .select('title')
    // .populate('userId')
    .then(products=>{
        console.log(products);
        res.render('admin/products',{ 
            prods:products,
            path :'/admin/products',
            pageTitle:'Admin Products',
            isAuthenticated:req.session.isLoggedin
        })})};