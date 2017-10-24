/**
 * 参考于http://www.cnblogs.com/ganqiyin/p/5029633.html
 * 支持时分秒的日期控件
 */
Ext.define('ux.form.field.Date', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.datetimefield',
    requires: ['ux.picker.Date'],
    createPicker: function () {
        var me = this,
            format = Ext.String.format;
        return new ux.picker.Date({
            pickerField: me,
            floating: true,
            focusable: false, // Key events are listened from the input field which is never blurred
            preventRefocus: true,
            hidden: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            ariaDisabledDatesText: me.ariaDisabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            ariaDisabledDaysText: me.ariaDisabledDaysText,
            format: me.format,
            showToday: me.showToday,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            ariaMinText: format(me.ariaMinText, me.formatDate(me.minValue, me.ariaFormat)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            ariaMaxText: format(me.ariaMaxText, me.formatDate(me.maxValue, me.ariaFormat)),
            listeners: {
                scope: me,
                select: me.onSelect,
                tabout: me.onTabOut
            },
            keyNavConfig: {
                esc: function () {
                    me.inputEl.focus();
                    me.collapse();
                }
            }
        });
    },
    onExpand: function () {
        var me = this,
            value = me.getValue() instanceof Date ? me.getValue() : new Date();
        me.picker.setValue(value);
        me.picker.hour.setValue(value.getHours());
        me.picker.minute.setValue(value.getMinutes());
        //me.picker.second.setValue(value.getSeconds());
    },
});
