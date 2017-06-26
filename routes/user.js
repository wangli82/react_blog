let express = require('express');
let {User} = require('../model');
/*Multer是nodejs中处理multipart/form-data数据格式(主要用在上传功能中）的中间件。*/

let multer = require('multer');
//dest表示上传的文件的存放路径
let uploads = multer({dest:'public/uploads'});
let {checkLogin,checkNotLogin} = require('../auth');
let router = express.Router();

router.get('/signup',checkNotLogin,function(req,res){
    res.render('user/signup',{title:'注册'});
});

// 只有一个上传字段的话 avatar是上传文件字段的name属性 req.file req.body
router.post('/signup',checkNotLogin,uploads.single('avatar'),function(req,res){
    let user = req.body;//请求体对象(username,password,email)
    user.avatar = `/uploads/${req.file.filename}`;
  User.create(user,function(err,doc){
    if(err){//表示 注册失败
        req.flash('error','用户注册失败');
        res.redirect('back');
    }else{
        req.flash('success','用户注册成功');
        res.redirect('/user/signin');
    }
  });

});
router.get('/signin',checkNotLogin,function (req,res) {
  res.render('user/signin',{title:'登录'});
});
//用户登录
router.post('/signin',checkNotLogin,function(req,res){
  let user = req.body;
  User.findOne(user,function(err,doc){
      if(err){//如果登录查询的时候失败了
          req.flash('error','操作数据库失败');
          res.redirect('back');
      }else{
          if(doc){
              req.flash('success','用户登录成功');
              req.session.user = doc;
              res.redirect('/');
          }else{
              req.flash('error','用户或密码不正确');
              res.redirect('back');
          }
      }
  });
});
//用户退出登录
router.get('/signout',checkLogin,function (req,res) {
    req.session.user = null;
    req.flash('success','用户退出成功');
    res.redirect('/user/signin');
});
module.exports = router;

