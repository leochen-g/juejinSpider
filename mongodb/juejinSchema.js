var mongoose = require('./dbconfig.js'), // 引入mongodb配置文件
    Schema = mongoose.Schema;

// 构造Schema
var JuejinSchema = new Schema({
    author:String, //作者
    category:{     //类别
        id:String, //类别ID，因为爬取的时候发现，九大类别在发送请求的时候是发送的id号
        name:String, //名称
        title:String
    },
    collectionCount:Number, //收藏数
    commentsCount:Number, //评论数
    viewsCount:Number, //浏览数
    title:String, //文章标题
    summaryInfo:String, //文章摘要
    originalUrl:{type:String,unique: true}, // 文章原始链接
    screenshot:String // 缩略图
});

module.exports = mongoose.model('juejin',JuejinSchema);