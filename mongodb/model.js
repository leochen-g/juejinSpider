var Juejin = require('./juejinSchema.js'); //引入Schema 文件

//数据插入
function insert(conditions,callback) {
    conditions = conditions || {};
    Juejin.create(conditions,callback)
}

//数据查询
function find(conditions,callback) {
    conditions = conditions || {};
    Juejin.find(conditions,callback);
}

//数据更新
function update(conditions,update) {
    Juejin.update(conditions,update,function (err,res) {
        if(err) console.log('Error' + err);
        else console.log('Res:' + res);
    })
}

//数据删除
function del(conditions) {
    Juejin.remove(conditions,function (err,res) {
        if(err) console.log('Error' + err);
        else console.log('Res:' + res);
    })
}

module.exports = {
    find:find,
    del:del,
    update:update,
    insert:insert
};