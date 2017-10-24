//验证码控件
Ext.define('ux.form.field.Verify', {
    extend: 'Ext.container.Container',
    alias: ['widget.fieldVerify'],
    requires: ['Ext.Img', 'Ext.form.field.Text'],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    config: {
        //文本框内刷新按钮
        refresh: false,
        //文本框
        textfield: {
            hideLabel: true,
            emptyText: '请输入验证码'
        },
        //图片
        img: {
            flex: 1,
            height: 46,
            margin: '0 0 0 5',
            alt: '点击刷新'
        }
    },
    //初始化
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        //新增
        me.add([me.getTextfield(), me.getImg()]);
    },
    //创建文本框
    applyTextfield: function (config) {
        return Ext.factory(config, Ext.form.field.Text, this.getTextfield());
    },
    //创建图片
    applyImg: function (config) {
        return Ext.factory(config, Ext.Img, this.getImg());
    },
    //更新图片
    updateImg: function (newItem, oldItem) {
        if (newItem) {
            //隐藏就不显示验证码
            if (!this.isHidden()) {
                newItem.setSrc(this.codeImgUrl);
            }
            newItem.on({
                scope: this,
                click : {
                    element : 'el',
                    fn :'onRefreshImg'
                }
            });
        }
    },
    //更新文本框内置按钮
    updateRefresh: function (newItem, oldItem) {
        if (newItem) {
            var textfield = this.getTextfield();
            newItem.handler = 'onRefreshImg';
            newItem.scope = this;
            textfield.setTriggers({ refresh: newItem});
        }
    },
    setHidden: function (value) {
        var me = this,
            allowBlank = true,
            back;
        back = me.callParent(arguments);
        if (!value) {
            me.onRefreshImg();
            allowBlank = false;
        }
        me.getTextfield().setAllowBlank(allowBlank);
        return back;
    },
    //刷新验证码
    onRefreshImg: function () {
        if (!this.isHidden()) {
            var img = this.getImg();
            img.setSrc(this.codeImgUrl + '?time=' + new Date().getTime());
        }
    }
});