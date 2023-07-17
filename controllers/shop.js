const Product=require('../models/product');
const Order=require('../models/order');
const fs=require('fs')
const path=require('path')
const PDFDocument=require('pdfkit')
// const stripe=require('stripe')('sk_test_51NU6M8SGc2BOiEgPKNxak3OdxomcTekGMsvTQyPKFSPQo5kFObtxhifxUUIT3cO3HHoRxFEtQ7os1CR3i8DuuIFx006DQam3Bo')
const ITEMS_PER_PAGE = 4;
// const Order= require('../models/order')
exports.getProducts=(req, res, next)=>{
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

   exports.getProduct=(req,res,next)=>{
    const prodId=req.params.productId;
    console.log("Reached")
    Product.findById(prodId).then(product=>{
      console.log(product);
      res.render('shop/product-detail',{product: product,
      pageTitle:product.title,
      path:'/product'
      })
    })
  };


   exports.getIndex=(req, res, next)=>{
    const page = +req.query.page || 1;
    let totalItems;
    Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

   exports.getCart = (req, res, next) => {
   
   req.user.populate('cart.item.productId')
  .then(user=>{
      console.log(user.cart.item);
      const products=user.cart.item;
      res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products: products,
              
      })})
  


  };
   exports.postCart=(req,res,next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product=>{
      return req.user.addToCart(product);
    }).then(result=>{
      console.log(result);
      res.redirect('/cart')
    })
  }

   exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
      .then(result=>{
        res.redirect('/cart');
      }).catch();
  };
  exports.getCheckout = async (req, res, next) => {
    let products;
    let total=0;
    console.log(req.user)
    const user= await xyz(req)
    console.log("This is User")
    console.log(user)
    products=user.cart.item;
    products.forEach(p => {
            total += p.quantity * p.productId.price;
          })

    // req.user
    //   .populate('cart.item.productId')
    //   .then(user => {
    //     products = user.cart.item;
    //     console.log("This is user")
    //     console.log(products)
    //     products.forEach(p => {
    //       total += p.quantity * p.productId.price;
    //     })
        console.log("This is Product")
        console.log(products)
      //   const session = await stripe.checkout.sessions.create({
      //   line_items: [{
      //     // name: products[0].productId.title,
      //     // description: products[0].productId.description,
      //     // images: [products[0].productId.imageUrl],
      //     // amount: products[0].productId.price,
      //     // currency: 'usd',
      //     price_data: {
      //       currency: 'usd',
      //       unit_amount: products[0].productId.price,
      //       product_data: {
      //         name: products[0].productId.title,
      //         description: products[0].productId.description,
      //         // images: [products[0].productId.imageUrl],
      //       },
      //     },
      //     quantity: products[0].quantity,
      //   }],
      //   mode: 'payment',
      //   success_url: req.protocol + '://' + req.get('host') + '/checkout-success', // => http://localhost:3000
      //     cancel_url: req.protocol + '://' + req.get('host') + '/checkout-cancel'
      // })

      const session = await stripe.checkout.sessions.create({
        line_items: products.map(p => {
          return {
            price_data: {
                    currency: 'usd',
                    unit_amount: p.productId.price,
                    product_data: {
                      name: p.productId.title,
                      description: p.productId.description,
                      // images: [products[0].productId.imageUrl],
                    },
                  },
                  quantity: p.quantity,
                }
          }),
        mode: 'payment',
        success_url: req.protocol + '://' + req.get('host') + '/checkout-success', // => http://localhost:3000
          cancel_url: req.protocol + '://' + req.get('host') + '/checkout-cancel'
      })
        console.log("This is session "+session.id)
        res.render('shop/checkout', {
          path: '/checkout',
          pageTitle: 'Checkout',
          products: products,
          totalSum: total,
          sessionId: session.id
        });
      }
  exports.postOrder = (req, res, next) => {
    req.user.populate('cart.item.productId')
    .then(user=>{
    console.log(user.cart.item);
    const products=user.cart.item.map(i=>{
    return {quantity : i.quantity, product :{...i.productId._doc}}
    });
    const order=new Order({
      user:{
        email :req.user.email,
        userId:req.user
      },
      products:products
    });
    return order.save();
  }).then(result=>{
    return req.user.clearCart();
  })
  .then(()=>{
    res.redirect('/orders')
  })
  .catch()
  };

   exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id})
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

exports.getInvoice=(req,res,next)=>{
  let orderId=req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
  const invoiceName='invoice-'+orderId+'.pdf';
  const invoicePath=path.join('data','invoice',invoiceName);

  const pdfDoc=new PDFDocument();
  res.setHeader('Content-Type','application/pdf')
 res.setHeader(
'Content-Disposition',
  'inline; filename="' + invoiceName + '"'
 );
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);

  pdfDoc.fontSize(26).text('Invoice',{underline: true})

  pdfDoc.text('-----------------------------')
  let totalPrice=0;
  order.products.forEach(prod=>{
    totalPrice=totalPrice+prod.quantity*prod.product.price;
    pdfDoc.fontSize(14).text(prod.product.title+ ' - '+ prod.quantity + ' X ' + ' $ ' +prod.product.price);
  })
  pdfDoc.text('Total Price = $'+ totalPrice)

  pdfDoc.end();
//   fs.readFile(invoicePath,(err,data)=>{
//     if(err){
//       return next(err);
//     }
//     res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader(
//           'Content-Disposition',
//           'inline; filename="' + invoiceName + '"'
//         );
//         res.send(data);
//   })})
// }
    })}


const xyz = async (req)=>{
  return  await req.user.populate('cart.item.productId')
      
      
}


//    exports.getChekout=(req,res,next)=>{
//     res.render('shop/checkout',{
//         path :'/checkout',
//         pageTitle: 'checkout',
//     });
//    }


//   return stripe.checkout.sessions.create({
      //     payment_method_types: ['card'],
      //     line_items: [{
      //       name: 'T-shirt',
      //       description: 'Comfortable cotton t-shirt',
      //       images: ['https://example.com/t-shirt.png'],
      //       amount: 2000,
      //       currency: 'usd',
      //       price_data: {
      //         currency: 'usd',
      //         unit_amount: 2000,
      //         product_data: {
      //           name: 'T-shirt',
      //           description: 'Comfortable cotton t-shirt',
      //           images: ['https://example.com/t-shirt.png'],
      //         },
      //       },
      //       quantity: 1,
      //     }],
      //     success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
      //     cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      //   });
      // })