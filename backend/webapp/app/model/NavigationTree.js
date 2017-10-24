//数据源
//导航树
Ext.define('webApp.model.NavigationTree', {
    extend: 'Ext.data.TreeModel',
    fields: [{
        name: 'text'
    }, {
        name: 'icon_class',
        convert: function (value, record) {
            if (value) {
                record.set('iconCls', value);
            }
            return value;
        }
    }, {
        name: 'description',
        convert: function (value, record) {
            if (value) {
                record.set('text', value);
            }
            return value;
        }
    }, {
        name: 'view_type',
        convert: function (value, record) {
            if (value) {
                record.set('leaf', true);
            }
            return value;
        }
    }, { name: 'page_type' }],
    proxy: {
        type: 'api',
        url: config.user.account
    }
});