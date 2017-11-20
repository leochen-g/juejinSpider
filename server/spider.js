var superagent = require('superagent');
var model = require('../mongodb/model.js');

spider = function (sort,callback) {
    var limit = 100;
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
    for (var i=0; i < categroyList.length; i++) {
        if (categroyList[i].name === sort) {
            var id = categroyList[i].id;
            break;
        }
    }
    var URL = 'https://timeline-merger-ms.juejin.im/v1/get_entry_by_hot?src=web&limit=' + limit + '&category=' + id;
    superagent
        .get(URL)
        .end(function (err, res) {
            if (err) {
                return err;
            }
            var result = res.body;
            insertTomongoDB(result,callback);
        });
};
//数据写入mongodb
insertTomongoDB =function (val,callback) {
    var data = val.d.entrylist;
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
    model.insert(insertList,callback);

};

module.exports = {
    spiders:spider
};

