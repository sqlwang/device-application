/**
 * 支持快速选择日期的日期控件
 */
Ext.define('ux.picker.GridDate', {
    extend: 'Ext.container.Container',
    alias: 'widget.gridDatePicker',
    requires: ['Ext.picker.Date', 'Ext.form.field.ComboBox'],
    layout: 'hbox',
    config: {
        pickerDate: {

        },
        pickerGrid: {
            width: 120,
            height:'100%',
            title: '快速选择',
            hideHeaders: true,
            columns: [{
                flex:1,
                dataIndex: 'text'
            }]
        }
    },
    //初始化
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.add([me.getPickerGrid(), me.getPickerDate()]);
    },
    //创建时间控件
    applyPickerDate: function (config) {
        return Ext.factory(config, 'Ext.picker.Date', this.getPickerDate());
    },
    //创建下拉框
    applyPickerGrid: function (config) {
        return Ext.factory(config, 'Ext.grid.Panel', this.getPickerGrid());
    },
    //更新下拉框
    updatePickerGrid: function (item) {
        if (item) {
            item.on({
                itemclick: 'onItemclick',
                scope: this
            });
        }
    },
    //快速选择
    onItemclick: function (t, rec) {
        //设置值
        this.pickerField.setValue(new Date(Date.now() + 1000 * 60 * 60 * 24 * rec.get('value')));
        //隐藏弹出层
        this.pickerField.collapse();
    },
    //设置禁止时间
    setDisabledDates: function (value) {
        this.getPickerDate().setDisabledDates(value);
    },
    //设置禁止日期
    setDisabledDays: function (value) {
        this.getPickerDate().setDisabledDays(value);
    },
    //设置最小值
    setMinValue: function (value) {
        this.getPickerDate().setMinDate(value);
    },
    //设置最大值
    setMaxValue: function (value) {
        this.getPickerDate().setMaxDate(value);
    },
    //设置值
    setValue:function (value) {
        this.getPickerDate().setValue(value);
    }
});