Ext.define('ux.proxy.API', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.api',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    reader: {
        type: 'json',
        rootProperty: 'data',
        totalProperty: 'totalCount',
        messageProperty: 'message'
        //,transform: function (data) {
        //    //快速取模型
        //    var list = data.data;
        //    if (list) {
        //        list = list[0];
        //        var items = [];
        //        for (var name in list) {
        //            items.push(name);
        //        }
        //        console.log(items);
        //    }
        //    return data;
        //}
    },
    writer: {
        type: 'json',
        writeAllFields: true,
        rootProperty: 'data'
    }
});