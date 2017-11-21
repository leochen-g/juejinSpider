var superagent = require('superagent');//引入superagent 插件
var model = require('../mongodb/model.js');// 引入mongodb 的model

//爬取掘金热文主要函数，接收参数sort: 需要爬取的类别 callback：爬取完成后的回调
spider = function (sort, callback) {

    var limit = 100;//限制爬取的数据为100条，多余100条掘金就不给回应了

    // 每个种类所对应的id值，在发送请求的时候需要
    var categroyList = [
        {
            "id": "5562b410e4b00c57d9b94a92",
            "name": "android"
        },
        {
            "id": "5562b415e4b00c57d9b94ac8",
            "name": "前端"
        },
        {
            "id": "5562b405e4b00c57d9b94a41",
            "name": "iOS"
        },
        {
            "id": "569cbe0460b23e90721dff38",
            "name": "产品"
        },
        {
            "id": "5562b41de4b00c57d9b94b0f",
            "name": "设计"
        },
        {
            "id": "5562b422e4b00c57d9b94b53",
            "name": "工具资源"
        },
        {
            "id": "5562b428e4b00c57d9b94b9d",
            "name": "阅读"
        },
        {
            "id": "5562b419e4b00c57d9b94ae2",
            "name": "后端"
        },
        {
            "id": "57be7c18128fe1005fa902de",
            "name": "人工智能"
        }
    ];
    for (var i = 0; i < categroyList.length; i++) {//根据type值取出对应的id值
        if (categroyList[i].name === sort) {
            var id = categroyList[i].id;
            break;
        }
    }
    //请求链接
    var URL = 'https://timeline-merger-ms.juejin.im/v1/get_entry_by_hot?src=web&limit=' + limit + '&category=' + id;
    superagent
        .get(URL)
        //请求结束后的操作
        .end(function (err, res) {
            if (err) {
                return err;
            }
            //解析请求后得到的body数据
            var result = res.body;
            insertTomongoDB(result, callback);
        });
};
//数据写入mongodb
insertTomongoDB = function (val, callback) {
    //获取body中相关的主要数据，为entrylist数组
    var data = val.d.entrylist;
    //创建一个插入数据库的数组
    var insertList = [];
    for (var i = 0; i < data.length; i++) {
        var insert = {
            author: data[i].author,
            category: {
                id: data[i].category.id,
                name: data[i].category.name,
                title: data[i].category.title
            },
            collectionCount: data[i].collectionCount,
            commentsCount: data[i].commentsCount,
            viewsCount: data[i].viewsCount,
            title: data[i].title,
            summaryInfo: data[i].summaryInfo,
            originalUrl: data[i].originalUrl,
            screenshot: data[i].screenshot
        };
        insertList.push(insert)
    }
    model.insert(insertList, callback); // 插入操作
};

module.exports = {
    spiders: spider
};

