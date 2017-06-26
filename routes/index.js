let express = require('express');
let {Article} = require('../model');
let router = express.Router();
router.get('/',function(req,res){
    let keyword = req.query.
        keyword;
    let pageNum = isNaN(req.query.pageNum)?1:parseInt(req.query.pageNum);//当前页码
    let pageSize = isNaN(req.query.pageSize)?3:parseInt(req.query.pageSize);//每页的条数
    let query = {};
    if(keyword){
        query['$or'] = [{title:new RegExp(keyword)},
            {content:new RegExp(keyword)}];
    }
    //populate可以把一个字段从字符串转成对象
    Article.count(query,function(err,count){//总条数
        Article.find(query).sort({createAt:-1}).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function(err,articles){
            res.render('index',{
                title:'首页',
                keyword,//关键字
                pageNum,//当前页码
                pageSize,//每页条数
                totalPages:Math.ceil(count/pageSize),//总页数
                articles});//当前页码对应的记录
        });
    })
});
module.exports = router;
