//扩展
//自定义批量拍照控件
//仅适用于自定义浏览器
Ext.define('ux.camera.FileList', {
    extend: 'Ext.container.Container',
    alias: ['widget.cameraFileList'],
    requires: ['Ext.DataView', 'ux.camera.File'],
    //样式
    cls: 'uxFileList uxCameraList',
    config: {
        //数据
        data: null,
        //预览视图
        dataview: {
            margin:'0 0 0 90',
            itemTpl: new Ext.XTemplate(
                '<div class="thumb-wrap b bg-cover" style="background-image:url({img});">',
                    '<button type="button" class="x-fa fa-trash"></button>',
                '</div>'
                )
        },
        //拍照按钮
        cameraButton: {
            labelWidth: 100,
            fieldLabel: '上传头像'
        },
        //是否只读
        readOnly: false
    },
    //当前文件总数
    fieldCount: 0,
    //上传文件数量限制,默认一个
    maxFileCount: 1,
    //初始化
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        //新增上传控件、图片列表
        me.add([me.getCameraButton(), me.getDataview()]);
    },
    //是否只读模式
    updateReadOnly: function (value) {
        if (value) {
            //隐藏拍照按钮
            this.getCameraButton().hide();
            //添加样式隐藏删除按钮
            this.addCls('readOnly');
        }
    },
    /*创建上传控件*/
    applyCameraButton: function (config) {
        return Ext.factory(config, ux.camera.File, this.getCameraButton());
    },
    /*创建上传控件*/
    applyMessage: function (config) {
        //console.log(config);
        return Ext.factory(config, Ext.form.Label, this.getMessage());
    },
    /*更新上传控件*/
    updateCameraButton: function (newItem) {
        if (newItem) {
            //监听上传控件
            newItem.on({
                scope: this,
                onCameraClick: 'onCameraClick'
            });
        }
    },
    //拍照上传
    onCameraClick: function (btn) {
        var me = this,
        //设置上传地址
        url = me.url,
        //拍照并上传
        //不能写匿名函数
        //所以只能在doordu.util.cameraFileUpCallback里面写回调方法
        camera = doordu.camera.take_photo('doordu.util.cameraFileUpCallback', url, '', '', 'flash_pic[]', 'people', '', 80);
        if (!camera.status) {
            Ext.toast(camera.message);
        }
        config.tmpFileList = me;
        return;
    },
    /*创建图片列表*/
    applyDataview: function (config) {
        return Ext.factory(config, Ext.DataView, this.getDataview());
    },
    /* 更新图片列表*/
    updateDataview: function (newItem) {
        if (newItem) {
            //监听预览列表
            newItem.on({
                itemclick: 'itemclick',
                itemdblclick: 'itemdblclick',
                scope: this
            });
        }
    },
    //单击删除
    itemclick: function (t, record, item, index, e) {
        var me = this,
        store = t.getStore();
        //点击删除按钮才执行
        if (!me.isSee && e.target.tagName === 'BUTTON') {
            Ext.MessageBox.confirm('删除确认', '确认删除?',
            function (btnText) {
                if (btnText === 'yes') {
                    me.removeFile(me, store, record);
                }
            },
            me);
        }
    },
    //双击触发事件
    itemdblclick: function (t, record, item, index, e) {
        var me = this;
        if (e.target.tagName !== 'BUTTON') {
            me.fireEvent('onItemDbClick', me, record,false);
        }
    },
    //新增图片
    addData: function (data) {
        var me = this,
        store = me.getStore(),
        //获取最大限制
        maxFileCount = me.maxFileCount;
        if (store && store.storeId !== 'ext-empty-store') {
            //已有数据，新增
            store.add(data);
            //检测数目
            me.fieldCount = me.fieldCount || 0;
            //总数加1
            me.fieldCount += data.length;
            me.setText(me.fieldCount);
            //如果达到最大限制禁用
            if (me.fieldCount >= maxFileCount) {
                me.onDisable();
            }
        } else {
            //没有数据，创建
            me.setData(data);
        }
    },
    /*创建data*/
    applyData: function (data) {
        return data;
    },
    /*更新data*/
    updateData: function (data) {
        var length = data.length,
        str = '';
        if (data && length > 0) {
            //有数据则创建store
            var me = this,
            dataview = me.getDataview(),
            //获取最大限制
            maxFileCount = me.maxFileCount;

            dataview.setStore(Ext.create('Ext.data.Store', {
                data: data,
                autoDestroy: true
            }));
            me.fieldCount = length;
            me.setText(me.fieldCount);
            //如果达到最大限制禁用
            if (me.fieldCount >= maxFileCount) {
                me.onDisable();
            }
        }
    },
    setText: function (length) {
        var str = '',
        i;
        for (i = 0; i < length; i++) {
            str += '1';
        }
        this.setValue(str);
        this.fireEvent('onUpdateImg', this);
    },
    //获取所有数据
    getStore: function () {
        return this.getDataview().getStore();
    },
    //清除所有数据
    removeAll: function () {
        var store = this.getStore();
        if (store) {
            store.removeAll();
        }
    },
    //移除单个文件
    removeFile: function (me, store, record) {
        me.fieldCount--;
        store.remove(record);
        me.setText(me.fieldCount);
        if (me.fieldCount < me.maxFileCount) {
            me.onEnable();
        }
    },
    //禁用
    onDisable: function () {
        this.getCameraButton().setFileEnable(true);
    },
    //取消禁用
    onEnable: function () {
        this.getCameraButton().setFileEnable();
    },
    //设置文本框的值
    setValue: function (value) {
        this.getCameraButton().setValue(value);
    },
    reset: function () {
        this.getCameraButton().reset(true);
        this.removeAll();
        this.fieldCount = 0;
    }
});