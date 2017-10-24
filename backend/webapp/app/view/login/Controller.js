Ext.define('webApp.view.login.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',
    //页面启动时
    onRender: function () {
        var userName = localStorage.getItem("policeUserName"),
            text = this.lookupReference('username');
        userName && text.setValue(userName);
        //刷新验证码
        //this.getView().down('fieldVerify').onRefreshImg();
    },
    onSpecialkey: function (f, e) {
        var me = this;
        if (e.getKey() == e.ENTER) {
            me.onLoginClick();
        }
    },
    //点击登录
    onLoginClick: function (button) {
        var me = this,
         view = me.getView(),
         form = view.down('form');
 //       view.mask('正在登录中，请等待...');
//        util.ajaxB(config.user.login, form.getValues(), 'POST').then(function (response) {
//            view.unmask();
//            if (response.success) {
//                me.loginSuccess(response.data);
//            } else {
//                //刷新验证码
//                view.down('fieldVerify').setHidden(false);
//                form.getForm().setValues({
//                    'LoginForm[password]': null,
//                    captcha: null
//                });
//                me.lookup('is_captcha').setValue(1);
//            }
//        });
 //         Ext.toast(response.message);
          
         me.getView().close();
            Ext.create({
                xtype: 'mainBox'
            });
          
    },
    //登录成功
    loginSuccess: function (data) {
        config.session_id = data.session_id;
        config.agent_id = data.agent_id;
        config.userName = data.name;
        config.identity_type = data.identity_type;
        //是否番偶代理商
        config.isSign = data.sign;
        config.pflogo = data.plantform_logo.trim();
        config.pfname = data.plantform_name.trim();
        config.pro_id = data.pro_id;
        //设置localStorage
        localStorage.setItem('policeLoggedIn', true);
        //储存用户名
        localStorage.setItem('policeUserName', data.name);

        this.getView().close();
        Ext.create({
            xtype: 'mainBox'
        });
    }
});