var model = require('../../mongodb/model.js'); // 引入model文件
var spider = require('../spider');//引入spider文件

//获取文章列表

list = function (req,res,next) {
    var param = req.query.sort; //解析get请求所携带的参数sort

    model.find({'category.name':param},function (err,doc) {
        if(err){
            res.end(err);
            return
        }
        //这里直接返回数据库返回的数据，我并没有进行其他封装，所以返回的是一个数组，后续会考虑统一标准
        res.end(JSON.stringify(doc));
    });
};

//根据类型选择爬取的内容

send = function (req,res,next) {
    var param = req.query.sort;//解析get请求所携带的参数sort
    //触发采集程序运行，并返回数据插入操作的结果
    spider.spiders(param,function (err,doc) {
        if(err){
            res.end(JSON.stringify(err));
            return
        }
        //如果数据插入成功，返回ok
        res.end(JSON.stringify({msg:'ok'}));

    });

};

module.exports = {
    list:list,
    send:send
};