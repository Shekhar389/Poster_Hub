const express=require('express');
const router=express.Router();
const adminController=require('../controllers/admin');
router.get('/add-product',adminController.getAddProduct);
router.get('/products',adminController.getProduct);
router.get('/edit-products')
router.get('/edit-product/:productId',adminController.getEditProduct)
router.post('/add-product',adminController.postAddProduct);


exports.routes=router;