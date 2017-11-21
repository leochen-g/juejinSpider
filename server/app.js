var express = require('express');//引入express
var app = express(); // 构造一个实例
var $ = require('./controllers/controllers.js'); //引入controller


//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// 数据获取接口，需要获得类别
app.get('/api/getListByCategory',$.list);

// 数据采集接口，需要获得类别
app.get('/api/sendSpiderByCategory',$.send);

//监听5000端口
var server = app.listen(5000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});