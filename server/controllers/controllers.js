var model = require('../../mongodb/model.js');
var spider = require('../spider');
var path =require('path');

//获取文章列表

list = function (req,res,next) {
    var param = req.query.sort;
    model.find({'category.name':param},function (err,doc) {
        if(err){
            res.end(err);
            return
        }
        res.end(JSON.stringify(doc));
    });
};

//根据类型选择爬取的内容

send = function (req,res,next) {
    var param = req.query.sort;
    spider.spiders(param,function (err,doc) {
        if(err){
            res.end(JSON.stringify(err));
            return
        }

        res.end(JSON.stringify({msg:'ok'}));

    });

};

module.exports = {
    list:list,
    send:send
};