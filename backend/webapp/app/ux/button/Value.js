//value值在1或''中不断改变的按钮
Ext.define('ux.button.Value', {
    //继承于Ext.form.field.Text能够动态设置值
    extend: 'Ext.form.field.Text',
    requires: ['Ext.button.Button', 'Ext.form.trigger.Component'],
    xtype: 'valueButton',
    value: '',
    submitValue: false,
    border: 0,
    cls: 'valueButton',
    buttonConfig: {
        padding: '8 0 0 0',
        text: '高级查询',
        iconAlign: 'right',
        iconCls: 'x-fa fa-angle-down'
    },
    triggers: {
        button: {
            type: 'component',
            hideOnReadOnly: false,
            // Most form fields prevent the default browser action on mousedown of the trigger.
            // This is intended to prevent the field's input element from losing focus when
            // the trigger is clicked.  File fields disable this behavior because:
            // 1. The input element does not receive focus when the field is focused. The button does.
            // 2. Preventing the default action of touchstart (translated from mousedown
            // on mobile browsers) prevents the browser's file dialog from opening.
            preventMouseDown: false
        }
    },
    //添加按钮
    applyTriggers: function (triggers) {
        var me = this,
        triggerCfg = (triggers || {}).button;

        if (triggerCfg) {
            triggerCfg.component = Ext.apply({
                xtype: 'button',
                ownerCt: me,
                id: me.id + '-button',
                ui: me.ui,
                disabled: me.disabled,
                listeners: {
                    scope: me,
                    click: me.onClick
                }
            },
            me.buttonConfig);

            return me.callParent([triggers]);
        }
    },
    onClick: function (t) {
        var me = this,
        value = me.getValue(),
        iconCls = 'x-fa fa-angle-up';
        if (value) {
            iconCls = 'x-fa fa-angle-down';
        }
        value = value ? '' : 1;
        me.setValue(value);
        t.setIconCls(iconCls);
    },
    onRender: function () {
        this.callParent(arguments);
        //隐藏文本框
        this.inputWrap.setDisplayed(false);
    },
    //禁止重置
    reset: Ext.emptyFn
});