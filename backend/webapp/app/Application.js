/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */

//指定ux起调目录
Ext.Loader.setPath({
    'ux': 'app/ux'
});


Ext.define('webApp.Application', {
    extend: 'Ext.app.Application',
    
    name: 'webApp',

    stores: [
        // TODO: add global / shared stores here
    ],
    requires: ['webApp.view.login.Box','webApp.view.login.Controller'], 
    launch: function () {
        // TODO - Launch the application
        //初始化
 //       util.init();

        var me = this,
            supportsLocalStorage = Ext.supports.LocalStorage,
            loggedIn;
        //浏览器不支持缓存，直接跳转到登录界面
        if (!supportsLocalStorage) {
            console.log('浏览器不支持缓存，直接跳转到登录界面');
            me.showViewport();
            return;
        }
        // 检查localStorage，不存在则直接跳转到登录界面
        loggedIn = localStorage.getItem("policeLoggedIn");
        if (!loggedIn) {
            console.log('localStorage不存在，直接跳转到登录界面');
            me.showViewport();
            return;
        }
        //Cookie验证
//        util.ajaxB(config.user.isLogged, null, 'POST').then(function (response) {
//            if (response.success) {
//                var data = response.data;
//                config.session_id = data.session_id;
//                config.userName = data.name;
//                //代理商id
//                config.agent_id = data.agent_id;
//                config.identity_type = data.identity_type;
//                config.pflogo = data.plantform_logo.trim();
//                config.pfname = data.plantform_name.trim();
//                config.pro_id = data.pro_id;
//                //是否番偶代理商
//                config.isSign = data.sign;
//                //console.log('自动登录成功，session_id', config.session_id);
//                me.showViewport('mainBox');
//            } else if (response.sessionstatus == "maintenance") {
//                me.showViewport('pageMaintain');
//            } else {
//                me.showViewport();
//            }
//        });
    },
    
    showViewport: function (view) {
        alert('ok');
        //移除加载动画
        //Ext.fly('loading-mask').destroy();
        //console.log(config.session_id);
        //没有登录就跳转到登录界面
        //!config.session_id
        if (!view) {
            view = 'loginBox';
        }
        Ext.create({
            xtype: view
        });
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
