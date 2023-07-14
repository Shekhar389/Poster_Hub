const express=require('express');
const router=express.Router();
const {check,body}=require('express-validator')
const authController=require('../controllers/auth')
router.get('/login',authController.getLogin)



router.post('/login',   check('email').isEmail().withMessage("Please enter a valid Email"),   //Validator
                        body('password',"Enter Proper Password").isLength({min:8})
                      ,authController.postLogin)


router.get('/signup', authController.getSignup);
router.post('/signup', check('email').isEmail().withMessage("Please enter a valid Email"),             //Validator
                       body('password',"Enter Proper Password").isLength({min:8}), 
                       body('confirmPassword').custom((value,{req})=>{
                        if(value!== req.body.password){
                            throw new Error("Password Have to match");
                       }
                       return true;
                       
                    }),
                       authController.postSignup);
router.post('/logout',authController.postLogout)
router.get('/reset',authController.getReset);
router.post('/reset',authController.postReset);
router.get('/reset/:token',authController.getNewPassword);
router.post('/new-password',authController.postNewPassword); 
module.exports=router;