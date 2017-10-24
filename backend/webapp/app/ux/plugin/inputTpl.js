Ext.define('ux.plugin.InputTpl', {
    alias: 'plugin.inputTpl',
    xtype: 'inputTpl',
    config: {
        cmp: null,
        //监控对象选择器
        delegate: 'input'
    },
    constructor: function (config) {
        this.initConfig(config);
        this.callParent([config]);
    },
    //初始化
    init: function (cmp) {
        var me = this;
        me.changeValue = new Ext.util.DelayedTask(function () {
            var cmp = me.getCmp(),
            e = me.tempE,
            el = e.getTarget(me.getDelegate(), null, true),
            name = el.getAttribute('name'),
            value = el.getValue(),
            item = e.getTarget(cmp.itemSelector),
            rec;
            if (item) {
                rec = cmp.getRecord(item);
                rec.set(name, value, {
                    silent: true
                });
            }
        });
        this.setCmp(cmp);
    },
    //更新配置
    updateCmp: function (newCmp, oldCmp) {
        if (newCmp) {
            newCmp.on({
                beforeitemclick: 'onBeforeitemclick',
                //只有创建完成后才能监听事件
                render: 'onRender',
                scope: this
            });
        }
    },
    //创建完成
    onRender: function (t, eOpts) {
        t.el.on({
            change: 'onChane',
            delegate: this.getDelegate(),
            scope: this
        });
    },
    //执行动作
    onChane: function (e) {
        this.tempE = e;
        this.changeValue.delay(0);
    },
    onBeforeitemclick: function (t, record, item, index, e) {
        return e.target.tagName != 'INPUT';
    }
});