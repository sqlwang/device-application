//月弹窗扩展
//只选月
Ext.define('ux.picker.Month', {
    extend: 'Ext.picker.Month',
    alias: 'widget.uxMonthpicker',
    alternateClassName: 'ux.uxMonthPicker',
    afterRender: function () {
        var me = this;
        //取消监听mousedown事件，否则无法触发事件
        me.el.on('mousedown', me.onElClick, me, { translate: false });
        me.callParent();
    }
});