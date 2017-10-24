//扩展
//文本框扩展
//一个只显示按钮的文本框
//点击了会抛出事件供ux.camera.FileList来使用
Ext.define('ux.camera.File', {
    extend: 'Ext.form.field.Text',
    xtype: 'cameraFile',
    alias: ['widget.cameraFile'],
    requires: ['Ext.form.trigger.Component', 'Ext.button.Button'],
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
    buttonText: '拍摄头像',
    maxLengthText: '最多上传{0}张图片',
    blankText: '此项为必填项',
    //设置提示信息在文本框下方显示
    msgTarget: 'under',
    //默认最大长度限制
    maxLength: 6,
    //</locale>
    /**
     * @cfg {Boolean} buttonOnly
     * True to display the file upload field as a button with no visible text field. If true, all
     * inherited Text members will still be available.
     */
    buttonOnly: true,

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
        //增加拍摄按钮
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
                    click: me.onCameraClick
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
    onCameraClick: function (btn) {
        //抛出事件,供FileList使用
        this.fireEvent('onCameraClick', this, btn);
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
    //更改禁用状态
    setFileEnable: function (is) {
        var me = this;
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