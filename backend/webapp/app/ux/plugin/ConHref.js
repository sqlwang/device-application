/*
*监听超链接，拦截a标签点击事件
*/
Ext.define('ux.plugin.ConHref', {
    alias: 'plugin.conHref',
    xtype: 'conHref',
    config: {
        cmp: null
    },
    constructor: function (config) {
        this.initConfig(config);
        this.callParent([config]);
    },
    //初始化
    init: function (cmp) {
        this.setCmp(cmp);
    },
    //更新配置
    updateCmp: function (newCmp, oldCmp) {
        if (newCmp) {
            newCmp.on({
                //只有创建完成后才能监听事件
                render: 'onRender',
                scope: this
            });
        }
    },
    //创建完成
    onRender: function (t, eOpts) {
        t.el.on({
            click: 'onTap',
            delegate: 'a',
            scope: this
        });
    },
    //执行动作
    onTap: function (e) {
        var a = e.getTarget('a');
        if (a) {
            a.href = '#';
            a.target = '_self';
            a.onclick = function () {
                return false;
            }
        }
    }
});