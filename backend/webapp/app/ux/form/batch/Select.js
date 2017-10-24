/**
 * 批量选择扩展
 */
Ext.define('ux.form.batch.Select', {
    extend: 'Ext.form.Panel',
    mixins: ['Ext.util.StoreHolder'],
    requires: ['ux.form.field.SearchField'],
    xtype: 'batchSelect',
    config: {
        hiddenfield: {
            name: 'users'
        },
        leftGrid: {
            flex: 1,
            border: true,
            selModel: {
                //分页时缓存选择
                pruneRemoved: false,
                selType: 'checkboxmodel',
                mode: 'SIMPLE'
            }
        },
        rightGrid: {
            flex: 1,
            border: true,
            margin: '0 0 0 10'
        }
    },
    //初始化
    initComponent: function () {
        var me = this;
        me.bindStore(me.store || 'ext-empty-store', true);
        me.callParent(arguments);
        me.add({
            xtype: 'container',
            height: 400,
            width: 800,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            padding: '0 10 0 75',
            items: [me.getHiddenfield(), me.getLeftGrid(), me.getRightGrid()]
        });
    },
    //创建隐藏域
    applyHiddenfield: function (config) {
        return Ext.factory(config, 'Ext.form.field.Hidden', this.getHiddenfield());
    },
    //创建待选项
    applyLeftGrid: function (config) {
        return Ext.factory(config, 'Ext.grid.Panel', this.getLeftGrid());
    },
    //创建已选项
    applyRightGrid: function (config) {
        return Ext.factory(config, 'Ext.grid.Panel', this.getRightGrid());
    },
    //更新待选项
    updateLeftGrid: function (item) {
        if (item) {
            var me = this;
            //监听选中与取消选中事件
            item.on({
                select: me.select,
                deselect: me.deselect,
                scope: me
            })
        }
    },
    //更新以选项
    updateRightGrid: function (item) {
        if (item) {
            var me = this;
            //监听移除事件
            item.on({
                removeRec: me.removeRec,
                scope: me
            })
        }
    },
    //已选项移除
    removeRec: function (t, rec) {
        var me = this,
        //待选项
        store = me.store,
        rightStore = me.getRightGrid().getStore(),
        //待选项选择器
        selection = me.getLeftGrid().getSelectionModel(),
        //主键
        idProperty = store.getModel().idProperty,
        id = rec.get(idProperty);
        //从store中实时查找对应的模型
        index = store.getById(id);
        //从缓存中移除选中，针对移除项不在当前页时
        selection.deselect(rec);
        if (index) {
            //实时移除选中
            selection.deselect(index);
        } else {
            //如果在待选项中没有找到，在默认选中项中查找是否存在
            var data = me.data,
            length = data.length,
            i;
            for (i = 0; i < length; i++) {
                //如果存在，加入到备选项中
                if (data[i][idProperty] == id) {
                    store.add(rec.getData());
                    break;
                }
            }
        }
        rightStore.remove(rec);
        me.setValue(rightStore);
    },
    setValue: function (store) {
        var data = [];
        //这个流程可以想办法优化一下延迟执行赋值功能，避免频繁计算
        //或者重写隐藏表单的getValue方法来计算取值更好
        store.each(function (rec) {
            data.push(rec.getId());
        });
        this.getHiddenfield().setValue(data.toString());
    },
    //待选项选中
    select: function (t, rec) {
        var grid = this.getRightGrid(),
        store = grid.getStore();
        store.add(rec);
        this.setValue(store);
    },
    //待选项取消选中
    deselect: function (t, rec) {
        //从已选项移除
        this.getRightGrid().getStore().remove(rec);
    },
    //设置默认已选项
    setData: function (data) {
        if (data) {
            this.data = data;
            var me = this,
                length = data.length,
                list = [],
                i;
            for (i = 0; i < length; i++) {
                list.push(data[i].user_id);
            }
            //设置默认值
            me.getHiddenfield().setValue(list.toString());
        }
    },
    //翻页时检查值
    censorData: function (data) {
        var me = this,
        data = me.data,
        store, selectStore, i, length, item, idProperty, index;
        if (data) {
            //待选项
            store = me.store;
            //已选项
            selectStore = me.getRightGrid().getStore();
            length = data.length;
            //主键
            idProperty = store.getModel().idProperty;
            for (i = 0; i < length; i++) {
                item = data[i];
                //查找默认选中项是否继续被选中
                index = selectStore.getById(item[idProperty]);
                if (!index) {
                    //如果没有，向待选项中添加数据
                    store.add(item);
                }
            }
        }
    },
    onBindStore: function (store) {
        var me = this;
        if (store && store != 'ext-empty-store') {
            me.store = store;
            store.on({
                load: me.censorData,
                scope: me
            });
        }
        me.getLeftGrid().bindStore(store);
    }
});
