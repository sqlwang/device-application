//消息模块
//在类中mixins: ['ux.mixin.Message'],调用
//alarmDeclare communityProperty deviceDoor communityAttention logAlert deviceCard控制层公用
//点击消息中心消息后处理逻辑
Ext.define('ux.mixin.Message', {
    mixinId: 'uxMixinMessage',
    //点击消息后
    onMessageShow: function () {
        if (config.isMessageClick) {
            var me = this, button, valuse;
            //延迟执行，避免查询条件为空
            setTimeout(function () {
                //找到页面中的查询按钮
                button = me.getView().down('[handler=onGridSearch]');
                //重置搜索条件为默认搜索条件
                me.resetToolbar(button);
                //设置查询条件
                me.setToolbarValuse(button, config.messageValuse);
                //查询
                me.onGridSearch(button);
                //重置状态
                config.isMessageClick = false;
            }, 200);
        }
    },
    //设置Toolbar内控件的值
    setToolbarValuse: function (button, values) {
        if (values) {
            var item,
                toolbar = button.up('toolbar');
            for (var name in values) {
                item = toolbar.down('[name=' + name + ']');
                item.setValue(values[name]);
            }
        }
    }
});