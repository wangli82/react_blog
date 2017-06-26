let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
//消息提示中间件
let flash = require('connect-flash');
let app = express();
//设置模板引擎 html
app.set('view engine','html');
//指定模板的存放根目录
app.set('views',path.resolve('views'));
//指定对于html类型的模板使用ejs方法来进行渲染
app.engine('html',require('ejs').__express);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.resolve('node_modules')));
app.use(express.static(path.resolve('public')));
//在使用了此会话中间件之后，会在请求对象上增加req.session属性
app.use(session({
    resave:true,
    secret:'zfpx',//用来加密cookie
    cookie:{
      maxAge:3600*1000 //指定cookie的过期时间
    },
    saveUninitialized:true, //保存未初始化的session
    store:new MongoStore({
        url:require('./config').dbUrl
    })
}));

app.use(flash());
let index = require('./routes/index');
let user = require('./routes/user');
let article = require('./routes/article');
app.use(function (req,res,next) {
    //真正渲染模板的是res.locals
    res.locals.user = req.session.user;
    res.locals.keyword = '';
    //flash的功能是读完一次之后会立刻清空数据
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});
app.use('/',index);

app.use('/user',user);
app.use('/article',article);

app.listen(8080);