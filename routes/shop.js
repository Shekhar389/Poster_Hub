const express=require('express');
const router=express.Router();
const shopController=require('../controllers/shop');
router.get('/',shopController.getIndex)
router.get('/products',shopController.getProducts);
router.get('/product/:productId',shopController.getProduct);
router.get('/cart',shopController.getCart);
router.post('/cart',shopController.postCart);
router.get('/orders',shopController.getOrders);
router.get('/checkout',shopController.getChekout);

module.exports=router;