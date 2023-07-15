const express=require('express');
const router=express.Router();
const shopController=require('../controllers/shop');
const isauth=require('../middleware/is-auth')
router.get('/',shopController.getIndex)
router.get('/products',shopController.getProducts);
router.get('/products/:productId',shopController.getProduct);
router.get('/cart',isauth,shopController.getCart);
router.post('/cart',isauth,shopController.postCart);
router.post('/cart-delete-item',isauth, shopController.postCartDeleteProduct);
router.get('/checkout', shopController.getCheckout);
router.get('/checkout-success', shopController.postOrder);
router.get('/checkout-cancel', shopController.getCheckout);
// router.post('/create-order',isauth,shopController.postOrder);
router.get('/orders',isauth,shopController.getOrders);
router.get('/orders/:orderId',isauth,shopController.getInvoice);
// router.get('/checkout',shopController.getChekout);

module.exports=router;
