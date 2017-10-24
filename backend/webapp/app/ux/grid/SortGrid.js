/**
 * 自定义排序列表
 */
Ext.define('ux.grid.SortGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'uxSortGrid',
    requires: 'Ext.grid.plugin.DragDrop',
    //必须禁止表头，或者不能通过表头进行排序
    hideHeaders: true,
    border: true,
    selModel: {
        //多选
        mode: 'SIMPLE'
    },
    viewConfig: {
        plugins: {
            //支持拖拽
            ptype: 'gridviewdragdrop'
        }
    },
    sortButtons: ['top', 'up', 'down', 'bottom'],
    buttonsConfig: {
        top: {
            text: '移到顶部',
            ico: 'x-fa fa-angle-double-up'
        },
        up: {
            text: '上移',
            ico: 'x-fa fa-angle-up'
        },
        down: {
            text: '下移',
            ico: 'x-fa fa-angle-down'
        },
        bottom: {
            text: '移到底部',
            ico: 'x-fa fa-angle-double-down'
        }
    },
    config: {
        //排序是否改变
        isSortChange: false,
        sorttoolbar: {
            //默认禁用按钮
            disabled: true,
            dock: 'bottom'
        }
    },
    //初始化
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.addDocked(me.getSorttoolbar());
        me.on({
            selectionchange: 'onSlectionchange',
            beforedrop: 'onBeforedrop',
            scope: me
        });
    },
    //创建排序栏
    applySorttoolbar: function (config) {
        config.items = this.createButtons();
        return Ext.factory(config, 'Ext.toolbar.Toolbar', this.getSorttoolbar());
    },
    //更新是否开始排序状态
    updateIsSortChange: function (value) {
        //标识排序开始改变
        if (value) {
            var me = this,
            store = me.getStore(),
            list = [];
            if (store) {
                //记录排序改变前的排序
                store.each(function (rec) {
                    list.push(rec.getData());
                });
                //记录排序前的只
                me.oldData = list;
            }
        }
    },
    //重置排序
    resetSort: function () {
        var me = this;
        if (me.oldData) {
            var store = me.getStore();
            //store.removeAll();
            store.setData(me.oldData);
            me.setIsSortChange(false);
        }
    },
    //创建排序按钮集合
    createButtons: function () {
        var me = this,
        buttons = [],
        text,
        ico;

        Ext.Array.forEach(me.sortButtons,
        function (name) {
            //名称
            text = me.buttonsConfig[name].text;
            //图标
            ico = me.buttonsConfig[name].ico;
            buttons.push({
                xtype: 'button',
                ui: 'default',
                tooltip: text,
                ariaLabel: text,
                handler: me['on' + Ext.String.capitalize(name) + 'BtnClick'],
                cls: Ext.baseCSSPrefix + 'form-itemselector-btn',
                iconCls: ico,
                scope: me,
                margin: '0 10 0 0'
            });
        });
        return buttons;
    },
    onBeforedrop: function () {
        this.setIsSortChange(true);
    },
    //选中项改变时
    onSlectionchange: function (t, selected) {
        var disabled = true;
        //如果没有选中则禁用排序按钮
        if (selected.length > 0) {
            disabled = false;
        }
        this.getSorttoolbar().setDisabled(disabled);
    },
    //获取当前选中项
    getSelections: function () {
        var store = this.getStore();
        //不按选择顺序排序，而是按显示顺序排序
        return Ext.Array.sort(this.getSelectionModel().getSelection(),
        function (a, b) {
            a = store.indexOf(a);
            b = store.indexOf(b);

            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            }
            return 0;
        });
    },
    //移到顶部
    onTopBtnClick: function () {
        this.setIsSortChange(true);
        var store = this.getStore(),
        selected = this.getSelections();

        store.suspendEvents();
        store.remove(selected, true);
        store.insert(0, selected);
        store.resumeEvents();
        this.getView().refresh();
    },
    //移到底部
    onBottomBtnClick: function () {
        this.setIsSortChange(true);
        var store = this.getStore(),
        selected = this.getSelections();

        store.suspendEvents();
        store.remove(selected, true);
        store.add(selected);
        store.resumeEvents();
        this.getView().refresh();
    },
    //上移
    onUpBtnClick: function () {
        this.setIsSortChange(true);
        var store = this.getStore(),
        selected = this.getSelections(),
        rec,
        i = 0,
        len = selected.length,
        index = 0;

        // Move each selection up by one place if possible 
        store.suspendEvents();
        for (; i < len; ++i, index++) {
            rec = selected[i];
            index = Math.max(index, store.indexOf(rec) - 1);
            store.remove(rec, true);
            store.insert(index, rec);
        }
        store.resumeEvents();
        this.getView().refresh();
    },
    //下移
    onDownBtnClick: function () {
        this.setIsSortChange(true);
        var store = this.getStore(),
        selected = this.getSelections(),
        rec,
        i = selected.length - 1,
        index = store.getCount() - 1;

        // Move each selection down by one place if possible 
        store.suspendEvents();
        for (; i > -1; --i, index--) {
            rec = selected[i];
            index = Math.min(index, store.indexOf(rec) + 1);
            store.remove(rec, true);
            store.insert(index, rec);
        }
        store.resumeEvents();
        this.getView().refresh();
    }
});