Ext.define('webApp.view.login.Box', {
    extend: 'Ext.window.Window',
    xtype: 'loginBox',
    requires: ['Ext.layout.container.VBox', 'Ext.container.Container', 'Ext.form.field.Text', 'Ext.form.field.Checkbox', 'Ext.button.Button', 'ux.form.Panel', 'ux.form.field.Verify'],
    controller: 'login',
    cls: 'auth-locked-window',
    closable: false,
    resizable: false,
    autoShow: true,
    titleAlign: 'center',
    maximized: true,
    modal: true,
    header: false,
    title: '登录',
    defaultFocus: 'uxFormPanel',
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'start'
    },
    items: [{
        xtype: 'container',
        flex: 1
    }, {
        layout: {
            type: 'vbox',
            align: 'right',
            pack: 'center',
            padding: '0 300% 20 0'
        },
        width: '100%',
        xtype: 'container',
        items: [{
                width: 300,
                height: 100,
                cls: 'log-bg',
                xtype: 'container'
            }, {
                margin: '0 20 -25 20',
                width: 260,
                height: 50,
                xtype: 'container',
                cls: 'log-title',
                html: '物联网设备管理平台'
            }, {
                xtype: 'uxFormPanel',
                defaultButton: 'loginButton',
                bodyPadding: '50 10',
                cls: 'auth-dialog-login auth-dialog shadow',
                header: false,
                width: 300,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    margin: '5 0',
                    msgTarget: 'qtip',
                    hideLabel: true,
                    cls: 'auth-textbox',
                    allowBlank: false
                },
                items: [{
                        xtype: 'label',
                        text: '用户登录',
                        cls: 'title'
                    },
                    {
                        margin: '10 0 5 0',
                        xtype: 'textfield',
                        reference: 'username',
                        name: 'LoginForm[username]',
                        emptyText: '请输入用户名',
                        blankText: '请输入用户名'
                    },
                    {
                        xtype: 'textfield',
                        emptyText: '请输入密码',
                        blankText: '请输入密码',
                        inputType: 'password',
                        name: 'LoginForm[password]'
                    }, {
                        //默认隐藏
                        hidden: true,
                        xtype: 'fieldVerify',
                        //codeImgUrl: config.codeImg,
                        //文本框
                        textfield: {
                            name: 'captcha',
                            msgTarget: 'qtip',
                            blankText: '请输入验证码'
                        },
                        //value:123,
                        //文本框内置按钮
                        refresh: {
                            cls: 'auth-envelope-trigger x-fa fa-refresh'
                        }
                    },
                    {
                        xtype: 'hidden',
                        name: 'is_captcha',
                        reference: 'is_captcha'
                    },
                    {
                        xtype: 'button',
                        margin: '50 0 10 0',
                        reference: 'loginButton',
                        scale: 'medium',
                        ui: 'soft-blue',
                        cls: 'loginButton',
                        text: '登&emsp;&emsp;录',
                        formBind: true,
                        listeners: {
                            render: 'onRender',
                            click: 'onLoginClick'
                        }
                    }]
            }]
        },
        {
            xtype: 'container',
            flex: 1
        },
        {
            xtype: 'container',
            margin: '0 0 25% 0',
            html: 'Copyright © 2008 - 2017. All Rights Reserved'
        }],
    initComponent: function () {
        this.addCls('user-login-register-container');
        this.callParent(arguments);
    }
});