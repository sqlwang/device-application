//扩展
//只能选月的时间扩展
Ext.define('ux.form.field.Month', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.uxMonthfield',
    xtype: 'uxMonthfield',
    requires: ['ux.picker.Month'],
    format: "Y-m",
    selectMonth: new Date(),
    createPicker: function () {
        var me = this;
        return new ux.picker.Month({
            value: new Date(),
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            listeners: {
                scope: me,
                select: me.onSelect,
                cancelclick: me.onCancelClick,
                okclick: me.onOKClick,
                yeardblclick: me.onOKClick,
                monthdblclick: me.onOKClick
            }
        });
    },
    onCancelClick: function () {
        var me = this;
        me.selectMonth = null;
        me.collapse();
    },
    onOKClick: function () {
        var me = this;
        if (me.selectMonth) {
            me.setValue(me.selectMonth);
            me.fireEvent('select', me, me.selectMonth);
        }
        me.collapse();
    },
    onSelect: function (m, d) {
        var me = this;
        me.selectMonth = new Date((d[0] + 1) + '/1/' + d[1]);
    }
});