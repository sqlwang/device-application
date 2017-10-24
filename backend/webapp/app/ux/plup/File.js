Ext.define('ux.plup.File', {
    extend: 'Ext.form.field.Text',
    xtype: 'plupFile',
    alias: ['widget.plupFile'],
    requires: ['Ext.form.trigger.Component', 'Ext.button.Button', 'Ext.window.Toast'],
    emptyText: '请选择文件',
    blankText: '请选择文件',
    //plup对象
    uploader: null,
    //上传文件最大数量限制,最小只能设置为1
    maxFileCount: 1,
    //是否单文件上传,结合FileList使用时必须设置为false,否则不会有预览效果
    onlyOne: true,
    //上传地址,必须
    url: 'upload.php',
    //上传控件配置
    pluploadConfig: {
        //url 服务器端的上传页面地址,必须指定
        //swf文件，当需要使用swf方式进行上传时需要配置该参数,必须指定
        //flash_swf_url: 'app/js/plupload/js/Moxie.swf',
        //用来指定上传方式，指定多个上传方式请使用逗号隔开。一般情况下，你不需要配置该参数，因为Plupload默认会根据你的其他的参数配置来选择最合适的上传方式。如果没有特殊要求的话，Plupload会首先选择html5上传方式，如果浏览器不支持html5，则会使用flash或silverlight，如果前面两者也都不支持，则会使用最传统的html4上传方式。如果你想指定使用某个上传方式，或改变上传方式的优先顺序，则你可以配置该参数。
        //html5,flash,silverlight,html4
        runtimes: 'html5,html4',
        // 可以使用该参数来限制上传文件的类型，大小等，该参数以对象的形式传入，它包括三个属性： 
        filters: {
            //mime_types：用来限定上传文件的类型，为一个数组，该数组的每个元素又是一个对象，该对象有title和extensions两个属性，title为该过滤器的名称，extensions为文件扩展名，有多个时用逗号隔开。该属性默认为一个空数组，即不做限制。
            //max_file_size:用来限定上传文件的大小，如果文件体积超过了该值，则不能被选取。值可以为一个数字，单位为b,也可以是一个字符串，由数字和单位组成，如'200kb'
            //prevent_duplicates:是否允许选取重复的文件，为true时表示不允许，为false时表示允许，默认为false。如果两个文件的文件名和大小都相同，则会被认为是重复的文件
            //prevent_duplicates: true
        }
        // multi_selection:是否可以在文件浏览对话框中选择多个文件，true为可以，false为不可以。默认true，即可以选择多个文件。需要注意的是，在某些不支持多选文件的环境中，默认值是false。比如在ios7的safari浏览器中，由于存在bug，造成不能多选文件。当然，在html4上传方式中，也是无法多选文件的。 
    },
    needArrowKeys: false,

    triggers: {
        //禁用时显示的按钮
        //因为上传按钮禁用效果无效，所以在禁用时显示另外一个按钮
        //这样就可以避免禁用按钮失效的bug
        disableButton: {
            type: 'component',
            hideOnReadOnly: false,
            hidden: true,
            // Most form fields prevent the default browser action on mousedown of the trigger.
            // This is intended to prevent the field's input element from losing focus when
            // the trigger is clicked.  File fields disable this behavior because:
            // 1. The input element does not receive focus when the field is focused. The button does.
            // 2. Preventing the default action of touchstart (translated from mousedown
            // on mobile browsers) prevents the browser's file dialog from opening.
            preventMouseDown: false
        },
        filebutton: {
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

    //<locale>
    /**
     * @cfg {String} buttonText
     * The button text to display on the upload button. Note that if you supply a value for
     * {@link #buttonConfig}, the buttonConfig.text value will be used instead if available.
     */
    buttonText: '选择图片',
    //</locale>
    /**
     * @cfg {Boolean} buttonOnly
     * True to display the file upload field as a button with no visible text field. If true, all
     * inherited Text members will still be available.
     */
    buttonOnly: false,

    /**
     * @cfg {Number} buttonMargin
     * The number of pixels of space reserved between the button and the text field. Note that this only
     * applies if {@link #buttonOnly} = false.
     */
    buttonMargin: 3,

    /**
     * @cfg {Boolean} clearOnSubmit
     * 提交后清除值
     */
    clearOnSubmit: true,

    /**
     * @private
     */
    extraFieldBodyCls: Ext.baseCSSPrefix + 'form-file-wrap',

    /**
     * @private
     */
    inputCls: Ext.baseCSSPrefix + 'form-text-file',

    /**
     * @cfg {Boolean} [readOnly=true]
     *只读，禁止修改
     */
    readOnly: true,

    /**
     * @cfg {Boolean} editable
     * @inheritdoc
     */
    editable: false,
    //form表单中不提交值
    submitValue: true,

    /**
     * Do not show hand pointer over text field since file choose dialog is only shown when clicking in the button
     * @private
     */
    triggerNoEditCls: '',

    /**
     * @private
     * Extract the file element, button outer element, and button active element.
     */
    childEls: ['browseButtonWrap'],

    /**
     * @private 创建上传按钮
     */
    applyTriggers: function (triggers) {
        var me = this,
        triggerCfg = (triggers || {}).filebutton,
        disableCfg = triggers.disableButton;
        //增加禁用按钮
        if (disableCfg) {
            disableCfg.component = Ext.apply({
                xtype: 'button',
                ownerCt: me,
                id: me.id + '-disableButton',
                ui: me.ui,
                disabled: true,
                text: me.buttonText
            })
        }
        //增加上传按钮
        if (triggerCfg) {
            triggerCfg.component = Ext.apply({
                xtype: 'button',
                ownerCt: me,
                id: me.id + '-button',
                ui: me.ui,
                disabled: me.disabled,
                text: me.buttonText,
                //设置margin-left
                style: me.buttonOnly ? '' : me.getButtonMarginProp() + me.buttonMargin + 'px',
                listeners: {
                    scope: me,
                    render: me.createPlup
                }
            },
            me.buttonConfig);

            return me.callParent([triggers]);
        }
            // <debug>
        else {
            Ext.raise(me.$className + ' requires a valid trigger config containing "button" specification');
        }
        // </debug>
    },

    /**
     * @private
     */
    onRender: function () {
        var me = this,
        inputEl, button, buttonEl, trigger;

        me.callParent(arguments);

        inputEl = me.inputEl;
        //它不应该有name
        inputEl.dom.name = '';

        //有些浏览器会显示在该领域的闪烁的光标，即使它是只读的。如果我们有这样的事情
        //获得焦点，就转发给我们focusEl。还注意到，在IE中，文件输入作为处理
        //2元素Tab键的目的（文本，然后按钮）。所以，当你通过TAB键，这将需要2
        //标签才能到下一个字段。据我知道有没有办法解决这个在任何一种合理的方式。
        inputEl.on('focus', me.onInputFocus, me);
        inputEl.on('mousedown', me.onInputMouseDown, me);
        //获取上传按钮
        trigger = me.getTrigger('filebutton');
        button = me.button = trigger.component;
        buttonEl = button.el;
        if (me.buttonOnly) {
            me.inputWrap.setDisplayed(false);
            me.shrinkWrap = 3;
        }

        // Ensure the trigger element is sized correctly upon render
        trigger.el.setWidth(buttonEl.getWidth() + buttonEl.getMargin('lr'));
        if (Ext.isIE) {
            me.button.getEl().repaint();
        }
    },
    /**
     * Gets the markup to be inserted into the subTplMarkup.
     */
    getTriggerMarkup: function () {
        //console.log('getTriggerMarkup');
        return '<td id="' + this.id + '-browseButtonWrap" data-ref="browseButtonWrap" role="presentation"></td>';
    },
    onShow: function () {
        this.callParent();
        //如果我们开始了隐藏，按钮可能有一个搞砸布局
        //因为我们不像个容器
        this.button.updateLayout();
    },
    //创建上传控件
    createPlup: function (btn) {
        var me = this,
        //上传配置
        option = me.pluploadConfig,
        //name值
        name = me.getName(),
        //设置上传地址
        url = me.url,
        uploader;
        //获取当前按钮id
        option.browse_button = btn.getId();
        //指定文件上传时文件域的名称，默认为file,例如在php中你可以使用$_FILES['file']来获取上传的文件信息
        if (name) {
            option.file_data_name = name;
        }
        if (url) {
            option.url = url;
        }
        //上传文件最大数量限制为1时，选择文件只能选择一个
        if (me.maxFileCount === 1) {
            option.multi_selection = false;
        }

        //创建上传对象
        uploader = me.uploader = new plupload.Uploader(option);
        //初始化
        uploader.init();
        //监听文件被添加到上传队列时
        uploader.bind('FilesAdded',
        function (uploader, files) {
            me.filesAdded(uploader, files);
        });
        //监听错误
        //-602 重复文件
        uploader.bind('Error',
        function (uploader, file) {
            var code = file.code;
            if (code === -200) {
                //上传失败
                me.loadedFailure(uploader, {
                    message: file.message
                });
            } else {
                //抛出内部错误
                me.markInvalid(file.message);
            }
        });
        //上传完成
        uploader.bind('FileUploaded',
        function (loader, file, response) {
            if (response.status = 200) {
                //上传成功
                me.loadedSuccess(response);
            } else {
                //上传失败
                me.loadedFailure(loader, response);
            }
        });
        //会在文件上传过程中不断触发，可以用此事件来显示上传进度 
        uploader.bind('UploadProgress',
        function (loader, file) {
            Ext.Msg.updateProgress(loader.total.percent / 100, loader.total.percent + '%', '正在上传：' + file.name);
            //console.log(loader.total.percent);
            if (loader.total.percent == 100) {
                Ext.Msg.wait('上传成功，正在处理数据...', '上传文件');
            }
        });
    },
    //文件被添加到上传队列
    //uploader 上传对象
    //files 当前选中文件组
    filesAdded: function (uploader, files) {
        var me = this,
        //上传文件最大数量限制
        maxFileCount = me.maxFileCount,
        //现有文件（包括新选择的文件）
        oldFiles = uploader.files,
        //现有文件总数
        length = oldFiles.length,
        i, count;

        //上传文件最大数量限制为1,并且onlyOne为true时
        if (maxFileCount === 1 && me.onlyOne) {
            length = length - 2;
            //移除除最新文件之外所有文件
            for (i = length; i >= 0; i--) {
                uploader.removeFile(oldFiles[i]);
            }
            //设置文本框显示值
            me.setValue(oldFiles[0].name);
        } else {
            //文件数量超过或等于最大限制，禁用文件选择
            if (length >= maxFileCount) {
                count = length - maxFileCount;
                //从files中移除多于最大数量限制的文件，从最新选择的文件开始移除
                for (i = 0; i < count; i++) {
                    files.pop();
                }
                me.onDisable();
            }
            length = length - 1;
            maxFileCount = maxFileCount - 1;
            //移除多于最大数量限制的文件，从最新选择的文件开始移除
            for (i = length; i > maxFileCount; i--) {
                uploader.removeFile(oldFiles[i]);
            }
            //设置文本框显示值
            me.setValue(files[0].name);
        }
        //抛出事件,供FileList使用
        me.fireEvent('addField', me, files);
    },
    //移除文件
    removeFile: function (file) {
        var me = this,
        uploader = me.uploader,
        files;
        //移除文件
        uploader.removeFile(file);
        files = uploader.files;
        //取消禁用
        me.onEnable();
        //设置文本框的值
        if (uploader.files.length <= 0) {
            me.setValue(null);
        } else {
            me.setValue(files[0].name);
        }
    },
    submit: function (params) {
        var me = this,
        url = params.url,
        waitMsg = params.waitMsg || '正在上传',
        optionParams = params.params,
        uploader = me.uploader;
        //设置上传地址
        if (url) {
            uploader.setOption('url', url);
        }
        //设置参数
        if (optionParams) {
            uploader.setOption('multipart_params', optionParams);
        }
        //上传成功执行方法
        me.success = params.success || Ext.emptyFn;
        //上传失败执行方法
        me.failure = params.failure || Ext.emptyFn;
        uploader.start();
        Ext.Msg.progress('上传文件', waitMsg);
    },
    //上传成功
    loadedSuccess: function (response) {
        Ext.MessageBox.hide();
        this.reset();
        //抛出事件
        this.fireEvent('loadedSuccess', this);
        //执行成功函数
        this.success(response);
    },
    //上传失败
    loadedFailure: function (loader, response) {
        //停止上传
        loader.stop();
        //隐藏进度条
        Ext.MessageBox.hide();
        //重置
        this.reset(true);
        //抛出事件
        this.fireEvent('loadedFailure', this);
        //执行失败函数
        this.failure(response);
    },
    //上传成功执行,submit方法回调
    success: Ext.emptyFn,
    //上传失败执行,submit方法回调
    failure: Ext.emptyFn,
    //重置上传控件
    reset: function (isReset) {
        var uploader = this.uploader,
        files = uploader.files,
        //现有文件总数
        length = files.length - 1,
        i;
        //移除所有文件
        for (i = length; i > -1; i--) {
            uploader.removeFile(files[i]);
        }
        this.onEnable();
        if (isReset) {
            this.callParent();
        }
    },
    //禁用控件tab键切换功能
    getSubTplData: function (fieldData) {
        var data = this.callParent([fieldData]);
        //因为它是上传控件不应该获取焦点;
        //然而input元素自然是可聚焦，所以我们必须
        //由它的tabIndex设置为-1停用。
        data.tabIdx = -1;

        return data;
    },
    //禁用
    onDisable: function () {
        this.callParent();
        this.setFileEnable(true);
    },
    //取消禁用
    onEnable: function () {
        this.callParent();
        this.setFileEnable(false);
    },
    //更改禁用状态
    setFileEnable: function (is) {
        var me = this;
        //设置上传控件是否禁用
        //某些情况下设置会失效，原因不明
        me.uploader.disableBrowse(is);
        //当上传按钮隐藏时显示一个假按钮
        //上传按启用时隐藏加按钮
        //这个解决方案是为了避免上面说的禁用失效问题
        me.getTrigger('disableButton').setHidden(!is);
        me.getTrigger('filebutton').setHidden(is);
        //重绘布局
        me.updateLayout();
    },
    //销毁
    onDestroy: function () {
        this.uploader && this.uploader.destroy();
        this.callParent();
    },
    restoreInput: function (el) {
        //如果我们不渲染，我们不需要做任何事情，它会创建
        //当我们刷新到DOM。
        if (this.rendered) {
            var button = this.button;
            button.restoreInput(el);
            this.fileInputEl = button.fileInputEl;
        }
    },
    getButtonMarginProp: function () {
        return 'margin-left:';
    },
    //输入框获得焦点
    onInputFocus: function () {
        this.focus();
        //从只读输入元素切换焦点文件输入
        //结果在文件输入的不正确的定位。
        //添加和删除位置：相对有助于解决这个问题。
        //见https://sencha.jira.com/browse/EXTJS-18933
        if (Ext.isIE9m) {
            this.fileInputEl.addCls(Ext.baseCSSPrefix + 'position-relative');
            this.fileInputEl.removeCls(Ext.baseCSSPrefix + 'position-relative');
        }
    },
    //点击输入框
    onInputMouseDown: function (e) {
        //console.log('onInputMouseDown');
        //有些浏览器将显示即使输入是只读的光标，
        //这将在inputEl之间聚焦随后的聚焦跳跃的短瞬间
        //和文件按钮是可见的。 
        //从闪烁的重点消除防止inputEl。
        e.preventDefault();

        this.focus();
    },
    privates: {
        getFocusEl: function () {
            return this.button;
        },

        getFocusClsEl: Ext.privateFn
    }
});