let mongoose = require('mongoose');
mongoose.Promise = Promise;
let ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.connect(require('../config').dbUrl);

let UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    avatar:String
});

let User = mongoose.model('User',UserSchema);
exports.User = User;
let ArticleSchema = new mongoose.Schema({
    title:String,//标题
    content:{type:String},//正文 内容
    createAt:{type:Date,default:Date.now},//创建时间
    //user是一个外键，引用的是另外一个集合(User)的主键
    user:{type:ObjectId,ref:'User'}//作者，引用的是用户表的主键(_id)
});
let Article = mongoose.model('Article',ArticleSchema);
exports.Article = Article;
