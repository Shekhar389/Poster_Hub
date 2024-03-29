const crypto=require('crypto');
const bcrypt = require('bcryptjs');
const {validationResult}=require('express-validator')
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const transporter=nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key: process.env.SENDGRID
  }
}));
exports.getLogin = (req, res, next) => {
  let message=req.flash('error');
  if(message.length>0){
    message=message[0]
  }
  else{
    message=null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
    
  });
};

exports.getSignup = (req, res, next) => {
  let message=req.flash('error');
  if(message.length>0){
    message=message[0]
  }
  else{
    message=null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage:message
    
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors=validationResult(req);
  console.log(errors.array());
  if(!errors.isEmpty()){
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage:errors.array()[0].msg
      
    });
  }
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error','Invalid email or password');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedin = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error','Invalid email or password');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors=validationResult(req);
  console.log(errors.array());
  if(!errors.isEmpty()){
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage:errors.array()[0].msg
      
    });
  }
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error','Email already exist');
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
          return transporter.sendMail({
            to:email,
            from:"hungrygrabo@gmail.com",
            subject:'Signup Succeeded',
            html:'<h1>You Successfully Signed Up! <h1>'
          })
          
        })
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset=(req,res,next)=>{
  let message=req.flash('error');
  if(message.length>0){
    message=message[0]
  }
  else{
    message=null;
  }
res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset',
    errorMessage: message
    
  })
}

exports.postReset=(req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
      if(err){
        console.log(err);
        return res.redirect('/reset');
      }
      const token =buffer.toString('hex');
      User.findOne({email:req.body.email}).then(user=>{
        if(!user){
          req.flash("error","No user with that email found");
          return  res.redirect("/reset")
        }
        //update the resetToken and expireTime in database for this particular user
        user.resetToken=token;
        user.resetTokenExpiration=Date.now()+3600000;
        return user.save();
      })
      .then(result=>{
        res.redirect('/login')
        return transporter.sendMail({
          to:req.body.email,
          from:"hungrygrabo@gmail.com",
          subject:'Password Reset',
          html:`
          
          <p>You Requested a password reset</p>
          <p>Click This <a href="http://localhost:3000/reset/${token}">link to set a password</p>
          
          `
        })
        
      })
      .catch()
    })
}


exports.getNewPassword=(req,res,next)=>{
  
   const token=req.params.token;
    User.findOne({resetToken: token,resetTokenExpiration :{$gt:Date.now()}})//Gt means Greater than special operator
    .then(user=>{
      let message=req.flash('error');
      if(message.length>0){
        message=message[0]
      }
      else{
        message=null;
      }
    res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Passsword',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken:token
        
      })
    })
    .catch(err=>{
      console.log(err)
    })
  
 

}

exports.postNewPassword=(req,res,next)=>{
  const newPassword=req.body.password;
  const userId=req.body.userId;
  const passwordToken=req.body.passwordToken;
  let resetUser;
  // console.log(userId)
  User.findOne({resetToken:passwordToken,resetTokenExpiration:{$gt : Date.now()},
  _id:userId})
  .then(user=>{
    resetUser=user
    return bcrypt.hash(newPassword,12)
  })
  .then(hashedPassword=>{
    resetUser.password=hashedPassword;
    resetUser.resetToken=null;
    resetUser.resetTokenExpiration=undefined;
    return resetUser.save();
  })
  .then(result=>{
    res.redirect('/login')
    return transporter.sendMail({
      to:resetUser.email,
      from:"hungrygrabo@gmail.com",
      subject:'Signup Succeeded',
      html:'<h1>Password Changed<h1>'
    })
    
  })
  .catch(err=>{
    console.log(err)
  })
}