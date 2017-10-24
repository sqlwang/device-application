//自定义批量上传预览控件
//isUpload为true时每选择一个文件都会触发onAddField事件，需要自行处理上传，多用于修改场景
//isUpload为false时每选择一个文件都会在本地自增file控件，最后在表单中手动批量提交
Ext.define('ux.plup.FileList', {
    extend: 'Ext.container.Container',
    alias: ['widget.plupFileList'],
    requires: ['Ext.DataView', 'ux.plup.File'],
    //样式
    cls: 'uxFileList',
    config: {
        //数据
        data: null,
        //预览视图
        dataview: {
            itemTpl: new Ext.XTemplate(
                '<div class="thumb-wrap b bg-contain" style="background-image:url({img});">',
                    '<button type="button" class="x-fa fa-trash"></button>',
                '</div>')
        },
        //上传控件配置
        uploaderField: {
            onlyOne: false,
            buttonOnly: true,
            //提交后清除
            clearOnSubmit: false,
            fieldLabel: '上传文件',
            blankText: '请上传图片',
            msgTarget: 'under',
            name: 'file',
            pluploadConfig: {
                filters: {
                    mime_types: [{
                        title: "图片文件",
                        extensions: "jpg,gif,png,jpeg,bmp"
                    }]
                }
            }
        },
        //消息提示控件
        message: null,
        //uploader配置
        pluploadConfig:null
    },
    //是否立即上传
    isUpload: true,
    //是否只能查看
    isSee: false,
    //当前文件总数
    fieldCount:0,
    //上传文件数量限制,默认一个
    maxFileCount: 1,
    //默认预览图片路径，上传文件非图片时使用
    preview: {
        //文件
        file: 'resources/images/file.png',
        //视频
        video: 'resources/images/video.jpg'
    },
    //初始化
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        //新增上传控件、图片列表
        me.add([me.getUploaderField(), me.getMessage(), me.getDataview()]);
    },
    //设置isSee
    setIsSee: function (isSee) {
        this.isSee = isSee;
    },
    //设置isUpload
    setIsUpload: function (isUpload) {
        this.isUpload = isUpload;
    },
    /*创建上传控件*/
    applyUploaderField: function (option) {
        option.maxFileCount = this.maxFileCount;
        return Ext.factory(option, ux.plup.File, this.getUploaderField());
    },
    /*创建上传控件*/
    applyMessage: function (option) {
        //console.log(option);
        return Ext.factory(option, Ext.form.Label, this.getMessage());
    },
    /*更新上传控件*/
    updateUploaderField: function (newItem) {
        if (newItem) {
            //监听上传控件
            newItem.on({
                scope: this,
                addField: 'onAddField',
                loadedFailure: 'removeAll'
            });
        }
    },
    //更新上传控件配置
    updatePluploadConfig: function (option) {
        if (option) {
            var uploaderField = this.getUploaderField(),
                uploader = uploaderField.uploader;
            uploader.setOption(option);
            uploaderField.reset();
            this.removeAll();
        }
    },
    //选择文件完成
    onAddField: function (t,files) {
        var me = this,
           length = files.length,
           i;
        if (me.isUpload) {
            //抛出事件
            me.fireEvent('onAddField', me, files);
        } else {
            //添加预览图片
            for (i = 0; i < length; i++) {
                me.previewImage(files[i], function (file, src) {
                    me.addData({
                        //预览图片
                        img: src,
                        //文件名称
                        name: file.name,
                        file: file
                    });
                })
            }
        }
    },
    //获取上传文件预览图
    //plupload中为我们提供了mOxie对象
    //有关mOxie的介绍和说明请看：https://github.com/moxiecode/moxie/wiki/API
    previewImage: function (file, callback) {
        //如果不是图片,返回默认预览图
        if (!file || !/image\//.test(file.type)) {
            var url = this.preview.file;
            //如果是视频格式
            if (/video\//.test(file.type)) {
                url = this.preview.video;
            } 
            callback && callback(file, url);
        };
        //确保文件是图片
        if (file.type === 'image/gif') {
            //gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
            var fr = new mOxie.FileReader();
            fr.onload = function () {
                callback && callback(file, fr.result);
                fr.destroy();
                fr = null;
            }
            fr.readAsDataURL(file.getSource());
        } else {
            var preloader = new mOxie.Image();
            preloader.onload = function () {
                ////先压缩一下要预览的图片,宽300，高300
                //preloader.downsize(300, 300);
                var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                callback && callback(file, imgsrc); //callback传入的参数为预览图片的url
                preloader.destroy();
                preloader = null;
            };
            preloader.load(file.getSource());
        }
    },
    /*创建图片列表*/
    applyDataview: function (option) {
        return Ext.factory(option, Ext.DataView, this.getDataview());
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
            }, me);
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
        store = me.getStore(), //获取最大限制
        maxFileCount = me.maxFileCount;
        if (store && store.storeId !== 'ext-empty-store') {
            //已有数据，新增
            store.add(data);
            if (!data.file) {
                //检测数目
                me.fieldCount = me.fieldCount || 0;
                //总数加1
                me.fieldCount++;
                //如果达到最大限制禁用
                if (me.fieldCount >= maxFileCount) {
                    me.onDisable();
                }
                me.setValue(data.name);
            }
        } else {
            //没有数据，创建
            me.setData([data]);
        }
    },
    /*创建data*/
    applyData: function (data) {
        return data;
    },
    /*更新data*/
    updateData: function (data) {
        if (data && data.length > 0) {
            //有数据则创建store
            var me = this,
            dataview = me.getDataview(),
            //获取最大限制
            maxFileCount = me.maxFileCount;

            dataview.setStore(Ext.create('Ext.data.Store', {
                data: data,
                autoDestroy: true
            }));
            me.fieldCount = data.length;
            //如果达到最大限制禁用
            if (me.fieldCount >= maxFileCount) {
                me.onDisable();
            }
            me.setValue(data[0].name);
        }
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
        var file = record.get('file'),
            uploaderField = this.getUploaderField();
        if (file) {
            uploaderField.removeFile(record.get('file'));
        } else {
            me.onEnable();
        }
        me.fieldCount--;
        store.remove(record);
        if (me.fieldCount <= 0) {
            uploaderField.setValue(null);
        } else {
            uploaderField.setValue(store.getAt(0).get('name'));
        }
        me.fireEvent('onRemoveFile', me, store, record);
    },
    //上传附件
    submit: function (params) {
        this.getUploaderField().submit(params);
    },
    //禁用
    onDisable: function () {
        var file = this.getUploaderField();
        file.onDisable();
    },
    //取消禁用
    onEnable: function () {
        this.getUploaderField().onEnable();
    },
    //设置文本框的值
    setValue: function (value) {
        this.getUploaderField().setValue(value);
    },
    reset: function () {
        this.getUploaderField().reset(true);
        this.removeAll();
        this.fieldCount = 0;
    },
    //获取当前上传队列总数
    getFileCount: function () {
        return this.getUploaderField().uploader.files.length;
    }
});