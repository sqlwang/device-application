//只选择年的控件
Ext.define('ux.form.field.Year', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.uxYearfield',
    xtype: 'uxYearfield',
    requires: ['ux.picker.Year'],
    format: "Y",
    selectYear: new Date(),
    createPicker: function () {
        var me = this;
        return new ux.picker.Year({
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
        me.selectYear = null;
        me.collapse();
    },
    onOKClick: function () {
        var me = this;
        if (me.selectYear) {
            me.setValue(me.selectYear);
            me.fireEvent('select', me, me.selectYear);
        }
        me.collapse();
    },
    onSelect: function (m, d) {
        var me = this;
        me.selectYear = new Date((d[0] + 1) + '/1/' + d[1]);
    }
});