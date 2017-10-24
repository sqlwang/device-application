/**
 *支持快速选择日期的日期控件
 */
Ext.define('ux.form.field.GridDate', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.gridDateField',
    requires: ['ux.picker.GridDate'],
    pickerGrid: {
        store: {
            //默认配置
            data: [{
                value: 30,
                text: '一个月后'
            },
            {
                value: 90,
                text: '三个月后'
            },
            {
                value: 180,
                text: '六个月后'
            },
            {
                value: 365,
                text: '一年后'
            },
            {
                value: 365 * 2,
                text: '两年后'
            },
            {
                value: 365 * 3,
                text: '三年后'
            }]
        }
    },
    //创建弹窗
    createPicker: function () {
        var me = this,
        format = Ext.String.format;
        return new ux.picker.GridDate({
            floating: true,
            hidden: true,
            pickerField: me,
            pickerGrid: me.pickerGrid,
            pickerDate: {
                pickerField: me,
                focusable: false,
                // Key events are listened from the input field which is never blurred
                preventRefocus: true,
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
            }
        });
    }
});