/**
 * 支持自动完成，自动验证功能
 */
Ext.define('ux.form.Panel', {
    extend: 'Ext.form.Panel',
    xtype: 'uxFormPanel',
    requires: [
        'Ext.form.Panel'
    ],
    defaultFocus: 'textfield:focusable:not([hidden]):not([disabled]):not([value])',
    trackResetOnLoad :true,
    autoComplete : false,
    initComponent: function () {
        var me = this, listen;

        if (me.autoComplete) {
            me.autoEl = Ext.applyIf(
                me.autoEl || {},
                {
                    tag: 'form',
                    name: 'authdialog',
                    method: 'post'
                });
        }

        me.callParent();

        if (me.autoComplete) {
            listen = {
                afterrender : 'doAutoComplete',
                scope : me,
                single : true
            };

            Ext.each(me.query('textfield'), function (field) {
                field.on(listen);
            });
        }
    },
    doAutoComplete : function(target) {
        if (target.inputEl && target.autoComplete !== false) {
            target.inputEl.set({ autocomplete: 'on' });
        }
    }
});
