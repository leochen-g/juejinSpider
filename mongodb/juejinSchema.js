var mongoose = require('./dbconfig.js'),
    Schema = mongoose.Schema;

// 构造Schema
var JuejinSchema = new Schema({
    author:String,
    category:{
        id:String,
        name:String,
        title:String
    },
    collectionCount:Number,
    commentsCount:Number,
    viewsCount:Number,
    title:String,
    summaryInfo:String,
    originalUrl:{type:String,unique: true},
    screenshot:String
});

module.exports = mongoose.model('juejin',JuejinSchema);