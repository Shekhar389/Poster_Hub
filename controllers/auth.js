const User=require('../models/user')

exports.getLogin = (req, res, next) => {
        console.log(req.session.isLoggedin)
      res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
        }
      )
}

exports.postLogin=(req,res,next)=>{
    
    User.findById('64aa8ec5d0f9ab87e4878b2b').then(user=>{
      //console.log(user);
      req.session.isLoggedin=true;
      req.session.user= user;
      req.session.save((err)=>{  //save method will only execute when session will create
        res.redirect('/');
      })
      
      })
    
}
exports.postLogout=(req,res,next)=>{
  req.session.destroy(()=>{
    console.log("Session Destroyed");
    res.redirect('/')
  });
  
}