exports.checkNotLogin = function(req,res,next){
   if(req.session.user){//如果已登录
      res.redirect('/');//跳回首页
   }else{
       next();//继续访问
   }
}

exports.checkLogin = function(req,res,next){
   if(req.session.user){//如果已登录
       next();//继续访问
   }else{
       res.redirect('/user/signin');//重定向到登录页
   }
}