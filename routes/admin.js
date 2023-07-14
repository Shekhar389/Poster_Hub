const express=require('express');
const router=express.Router();
const adminController=require('../controllers/admin');
const isauth=require('../middleware/is-auth')
router.get('/add-product',isauth,adminController.getAddProduct);
router.get('/products',isauth,adminController.getProduct);
router.get('/edit-products')
router.get('/edit-product/:productId',isauth,adminController.getEditProduct)
router.post('/add-product',isauth,adminController.postAddProduct);
router.post('/edit-product',isauth,adminController.postEditProduct);
router.post('/delete-product',isauth,adminController.postDeleteProduct);

exports.routes=router;