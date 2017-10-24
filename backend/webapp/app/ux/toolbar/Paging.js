//重写类 分页插件
//汉化
//默认下方布局
//默认显示额外信息
//当删除数据时，处理页面变化
//点击刷新按钮时触发一个刷新事件
Ext.define("ux.toolbar.Paging", {
    extend: "Ext.toolbar.Paging",
    xtype: 'uxPagingtoolbar',
    displayMsg: '{0} - {1} 条',
    emptyMsg: '没有数据',
    getPagingItems: function () {
        var me = this,
            inputListeners = {
                scope: me,
                blur: me.onPagingBlur
            };

        inputListeners[Ext.supports.SpecialKeyDownRepeat ? 'keydown' : 'keypress'] = me.onPagingKeyDown;

        return [{
            itemId: 'prev',
            tooltip: me.prevText,
            overflowText: me.prevText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
            disabled: true,
            handler: me.movePrevious,
            scope: me
        },
        {
            itemId: 'next',
            tooltip: me.nextText,
            overflowText: me.nextText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
            disabled: true,
            handler: me.moveNext,
            scope: me
        },
        {
            itemId: 'refresh',
            tooltip: me.refreshText,
            overflowText: me.refreshText,
            iconCls: Ext.baseCSSPrefix + 'tbar-loading',
            disabled: me.store.isLoading(),
            handler: me.doRefresh,
            scope: me
        }];
    },
});