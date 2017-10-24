//改写Toast
//同时只会在右下角显示一个的提示弹窗
//该弹窗不会自动关闭
//消息以列表模式显示
Ext.define('ux.window.Toast', {
    extend: 'Ext.window.Window',

    xtype: 'uxToast',
    config: {
        message: {
            plugins: 'conTpl',
            tpl: new Ext.XTemplate('<div class="title"><div class="bg bg-contain"></div><div class="total tc">以下{totalCount}个门建议您查看</div></div>', '<tpl for="data"><div class="bh content">', '<div class="door"></div>', '<div class="b1">{message}</div>', '<div class="fire" fire="itemClick">查看详情</div>', '</div></tpl>')
        }
    },
    titleAlign: 'left',
    isToast: true,
    modal: false,
    width: 300,
    maxHeight: 350,
    scrollable: 'y',
    /**
     * @cfg cls
     * @inheritdoc
     */
    cls: Ext.baseCSSPrefix + 'uxToast b',

    /**
     * @cfg bodyPadding
     * @inheritdoc
     */
    //bodyPadding: 10,
    /**
     * @cfg {Boolean} autoClose 
     * This config ensures that the Toast is closed automatically after a certain amount of time. If this is set to
     * `false`, closing the Toast will have to be handled some other way (e.g., Setting `closable: true`).
     */
    autoClose: false,

    /**
     * @cfg plain
     * @inheritdoc
     */
    plain: false,

    /**
     * @cfg draggable
     * @inheritdoc
     */
    draggable: false,

    /**
     * @cfg resizable
     * @inheritdoc
     */
    resizable: false,

    /**
     * @cfg shadow
     * @inheritdoc
     */
    shadow: false,

    focus: Ext.emptyFn,

    /**
     * @cfg {String/Ext.Component} [anchor]
     * The component or the `id` of the component to which the `toast` will be anchored.
     * The default behavior is to anchor a `toast` to the document body (no component).
     */
    anchor: null,

    /**
     * @cfg {Boolean} [useXAxis]
     * Directs the toast message to animate on the x-axis (if `true`) or y-axis (if `false`).
     * This value defaults to a value based on the `align` config.
     */
    useXAxis: false,

    /**
     * @cfg {"br"/"bl"/"tr"/"tl"/"t"/"l"/"b"/"r"} [align]
     * Specifies the basic alignment of the toast message with its {@link #anchor}. This 
     * controls many aspects of the toast animation as well. For fine grain control of 
     * the final placement of the toast and its `anchor` you may set 
     * {@link #anchorAlign} as well.
     * 
     * Possible values:
     * 
     *  - br - bottom-right
     *  - bl - bottom-left
     *  - tr - top-right
     *  - tl - top-left
     *  - t  - top
     *  - l  - left
     *  - b  - bottom
     *  - r  - right
     */
    align: 'br',

    /**
     * @cfg alwaysOnTop 不能一直在最顶端，会影响自动遮罩效果
     * @inheritdoc
     */
    alwaysOnTop: false,

    /**
     * @cfg {String} [anchorAlign]
     * This string is a full specification of how to position the toast with respect to
     * its `anchor`. This is set to a reasonable value based on `align` but the `align`
     * also sets defaults for various other properties. This config controls only the
     * final position of the toast.
     */

    /**
     * @cfg {Boolean} [animate=true]
     * Set this to `false` to make toasts appear and disappear without animation.
     * This is helpful with applications' unit and integration testing.
     */

    // Pixels between each notification 
    /**
     * @cfg {Number} spacing 
     * The number of pixels between each Toast notification.
     */
    spacing: 6,

    //TODO There should be a way to control from and to positions for the introduction. 
    //TODO The align/anchorAlign configs don't actually work as expected. 
    // Pixels from the anchor's borders to start the first notification 
    paddingX: 30,
    paddingY: 10,

    /**
     * @cfg {String} slideInAnimation 
     * The animation used for the Toast to slide in.
     */
    slideInAnimation: 'easeIn',

    /**
     * @cfg {String} slideBackAnimation 
     * The animation used for the Toast to slide back.
     */
    slideBackAnimation: 'bounceOut',

    /**
     * @cfg {Number} slideInDuration 
     * The number of milliseconds it takes for a Toast to slide in.
     */
    slideInDuration: 500,

    /**
     * @cfg {Number} slideBackDuration 
     * The number of milliseconds it takes for a Toast to slide back.
     */
    slideBackDuration: 500,

    /**
     * @cfg {Number}
     * The number of milliseconds it takes for a Toast to hide.
     */
    hideDuration: 500,

    /**
     * @cfg {Number}
     * The number of milliseconds a Toast waits before automatically closing.
     */
    autoCloseDelay: 3000,

    /**
     * @cfg {Boolean} [stickOnClick]
     * This config will prevent the Toast from closing when you click on it. If this is set to `true`,
     * closing the Toast will have to be handled some other way (e.g., Setting `closable: true`).
     */
    stickOnClick: false,

    /**
     * @cfg {Boolean} [stickWhileHover]
     * This config will prevent the Toast from closing while you're hovered over it.
     */
    stickWhileHover: true,

    /**
     * @cfg {Boolean} [closeOnMouseDown]
     * This config will prevent the Toast from closing when a user produces a mousedown event.
     */
    closeOnMouseDown: false,

    /**
     * @cfg closable
     * @inheritdoc
     */
    closable: true,

    /**
     * @inheritdoc
     */
    focusable: false,

    // Private. Do not override! 
    isHiding: false,
    isFading: false,
    destroyAfterHide: false,
    closeOnMouseOut: false,

    // Caching coordinates to be able to align to final position of siblings being animated 
    xPos: 0,
    yPos: 0,

    constructor: function (config) {
        config = config || {};
        if (config.animate === undefined) {
            config.animate = Ext.isBoolean(this.animate) ? this.animate : Ext.enableFx;
        }
        this.enableAnimations = config.animate;
        delete config.animate;

        this.callParent([config]);
    },

    initComponent: function () {
        var me = this;

        // Close tool is not really helpful to sight impaired users 
        // when Toast window is set to auto-close on timeout; however 
        // if it's forced, respect that. 
        if (me.autoClose && me.closable == null) {
            me.closable = false;
        }

        me.updateAlignment(me.align);
        me.setAnchor(me.anchor);
        //添加监听 监听浏览器布局改变
        me.resizeListeners = Ext.on({
            resize: me.onGlobalResize,
            scope: me,
            destroyable: true
        });
        me.callParent();
        //新增自定义消息模版
        me.add([me.getMessage()]);
    },
    //消息模版
    applyMessage: function (config) {
        return Ext.factory(config, 'Ext.container.Container', this.getMessage());
    },
    updateMessage: function (item) {
        item.on({
            itemClick: function (cmp, el) {
                this.fireEvent('itemClick', this, cmp, el);
            },
            scope: this
        });
    },
    onRender: function () {
        var me = this;

        me.callParent(arguments);

        me.el.hover(me.onMouseEnter, me.onMouseLeave, me);

        // Mousedown outside of this, when visible, hides it immediately 
        if (me.closeOnMouseDown) {
            Ext.getDoc().on('mousedown', me.onDocumentMousedown, me);
        }
    },

    /*
     * These properties are keyed by "align" and set defaults for various configs.
     */
    alignmentProps: {
        br: {
            paddingFactorX: -1,
            paddingFactorY: -1,
            siblingAlignment: "br-br",
            anchorAlign: "tr-br"
        },
        bl: {
            paddingFactorX: 1,
            paddingFactorY: -1,
            siblingAlignment: "bl-bl",
            anchorAlign: "tl-bl"
        },

        tr: {
            paddingFactorX: -1,
            paddingFactorY: 1,
            siblingAlignment: "tr-tr",
            anchorAlign: "br-tr"
        },
        tl: {
            paddingFactorX: 1,
            paddingFactorY: 1,
            siblingAlignment: "tl-tl",
            anchorAlign: "bl-tl"
        },

        b: {
            paddingFactorX: 0,
            paddingFactorY: -1,
            siblingAlignment: "b-b",
            useXAxis: 0,
            anchorAlign: "t-b"
        },
        t: {
            paddingFactorX: 0,
            paddingFactorY: 1,
            siblingAlignment: "t-t",
            useXAxis: 0,
            anchorAlign: "b-t"
        },
        l: {
            paddingFactorX: 1,
            paddingFactorY: 0,
            siblingAlignment: "l-l",
            useXAxis: 1,
            anchorAlign: "r-l"
        },
        r: {
            paddingFactorX: -1,
            paddingFactorY: 0,
            siblingAlignment: "r-r",
            useXAxis: 1,
            anchorAlign: "l-r"
        },

        /*
         * These properties take priority over the above and applied only when useXAxis
         * is set to true. Again these are keyed by "align".
         */
        x: {
            br: {
                anchorAlign: "bl-br"
            },
            bl: {
                anchorAlign: "br-bl"
            },
            tr: {
                anchorAlign: "tl-tr"
            },
            tl: {
                anchorAlign: "tr-tl"
            }
        }
    },

    updateAlignment: function (align) {
        var me = this,
        alignmentProps = me.alignmentProps,
        props = alignmentProps[align],
        xprops = alignmentProps.x[align];

        if (xprops && me.useXAxis) {
            Ext.applyIf(me, xprops);
        }

        Ext.applyIf(me, props);
    },

    getXposAlignedToAnchor: function () {
        var me = this,
        align = me.align,
        anchor = me.anchor,
        anchorEl = anchor && anchor.el,
        el = me.el,
        xPos = 0;

        // Avoid error messages if the anchor does not have a dom element 
        if (anchorEl && anchorEl.dom) {
            if (!me.useXAxis) {
                // Element should already be aligned vertically 
                xPos = el.getLeft();
            }
                // Using getAnchorXY instead of getTop/getBottom should give a correct placement when document is used 
                // as the anchor but is still 0 px high. Before rendering the viewport. 
            else if (align === 'br' || align === 'tr' || align === 'r') {
                xPos += anchorEl.getAnchorXY('r')[0];
                xPos -= (el.getWidth() + me.paddingX);
            } else {
                xPos += anchorEl.getAnchorXY('l')[0];
                xPos += me.paddingX;
            }
        }

        return xPos;
    },

    getYposAlignedToAnchor: function () {
        var me = this,
        align = me.align,
        anchor = me.anchor,
        anchorEl = anchor && anchor.el,
        el = me.el,
        yPos = 0;

        // Avoid error messages if the anchor does not have a dom element 
        if (anchorEl && anchorEl.dom) {
            if (me.useXAxis) {
                // Element should already be aligned horizontally 
                yPos = el.getTop();
            }
                // Using getAnchorXY instead of getTop/getBottom should give a correct placement when document is used 
                // as the anchor but is still 0 px high. Before rendering the viewport. 
            else if (align === 'br' || align === 'bl' || align === 'b') {
                yPos += anchorEl.getAnchorXY('b')[1];
                yPos -= (el.getHeight() + me.paddingY);
            } else {
                yPos += anchorEl.getAnchorXY('t')[1];
                yPos += me.paddingY;
            }
        }

        return yPos;
    },

    getXposAlignedToSibling: function (sibling) {
        var me = this,
        align = me.align,
        el = me.el,
        xPos;

        if (!me.useXAxis) {
            xPos = el.getLeft();
        } else if (align === 'tl' || align === 'bl' || align === 'l') {
            // Using sibling's width when adding 
            xPos = (sibling.xPos + sibling.el.getWidth() + sibling.spacing);
        } else {
            // Using own width when subtracting 
            xPos = (sibling.xPos - el.getWidth() - me.spacing);
        }

        return xPos;
    },

    getYposAlignedToSibling: function (sibling) {
        var me = this,
        align = me.align,
        el = me.el,
        yPos;

        if (me.useXAxis) {
            yPos = el.getTop();
        } else if (align === 'tr' || align === 'tl' || align === 't') {
            // Using sibling's width when adding 
            yPos = (sibling.yPos + sibling.el.getHeight() + sibling.spacing);
        } else {
            // Using own width when subtracting 
            yPos = (sibling.yPos - el.getHeight() - sibling.spacing);
        }

        return yPos;
    },

    getToasts: function () {
        var anchor = this.anchor,
        alignment = this.anchorAlign,
        activeToasts = anchor.activeToasts || (anchor.activeToasts = {});

        return activeToasts[alignment] || (activeToasts[alignment] = []);
    },

    setAnchor: function (anchor) {
        var me = this,
        Toast;

        me.anchor = anchor = ((typeof anchor === 'string') ? Ext.getCmp(anchor) : anchor);

        // If no anchor is provided or found, then the static object is used and the el 
        // property pointed to the body document. 
        if (!anchor) {
            Toast = Ext.window.Toast;

            me.anchor = Toast.bodyAnchor || (Toast.bodyAnchor = {
                el: Ext.getBody()
            });
        }
    },

    beforeShow: function () {
        var me = this;

        if (me.stickOnClick) {
            me.body.on('click',
            function () {
                me.cancelAutoClose();
            });
        }

        if (me.autoClose) {
            if (!me.closeTask) {
                me.closeTask = new Ext.util.DelayedTask(me.doAutoClose, me);
            }
        }

        // Shunting offscreen to avoid flicker 
        me.el.setX(-10000);
        me.el.setOpacity(1);
    },

    afterShow: function () {
        var me = this,
        el = me.el,
        activeToasts, sibling, length, xy;

        me.callParent(arguments);

        activeToasts = me.getToasts();
        length = activeToasts.length;
        sibling = length && activeToasts[length - 1];

        if (sibling) {
            el.alignTo(sibling.el, me.siblingAlignment, [0, 0]);

            me.xPos = me.getXposAlignedToSibling(sibling);
            me.yPos = me.getYposAlignedToSibling(sibling);
        } else {
            el.alignTo(me.anchor.el, me.anchorAlign, [(me.paddingX * me.paddingFactorX), (me.paddingY * me.paddingFactorY)], false);

            me.xPos = me.getXposAlignedToAnchor();
            me.yPos = me.getYposAlignedToAnchor();
        }

        Ext.Array.include(activeToasts, me);

        if (me.enableAnimations) {
            // Repeating from coordinates makes sure the windows does not flicker 
            // into the center of the viewport during animation 
            xy = el.getXY();
            el.animate({
                from: {
                    x: xy[0],
                    y: xy[1]
                },
                to: {
                    x: me.xPos,
                    y: me.yPos,
                    opacity: 1
                },
                easing: me.slideInAnimation,
                duration: me.slideInDuration,
                dynamic: true,
                callback: me.afterPositioned,
                scope: me
            });
        } else {
            me.setLocalXY(me.xPos, me.yPos);
            me.afterPositioned();
        }
    },

    afterPositioned: function () {
        var me = this;

        // This method can be called from afteranimation event being fired 
        // during destruction sequence. 
        if (!me.destroying && !me.destroyed && me.autoClose) {
            me.closeTask.delay(me.autoCloseDelay);
        }
    },

    onDocumentMousedown: function (e) {
        if (this.isVisible() && !this.owns(e.getTarget())) {
            this.hide();
        }
    },

    slideBack: function () {
        var me = this,
        anchor = me.anchor,
        anchorEl = anchor && anchor.el,
        el = me.el,
        activeToasts = me.getToasts(),
        index = Ext.Array.indexOf(activeToasts, me);

        // Not animating the element if it already started to hide itself or if the anchor is not present in the dom 
        if (!me.isHiding && el && el.dom && anchorEl && anchorEl.isVisible()) {
            if (index) {
                me.xPos = me.getXposAlignedToSibling(activeToasts[index - 1]);
                me.yPos = me.getYposAlignedToSibling(activeToasts[index - 1]);
            } else {
                me.xPos = me.getXposAlignedToAnchor();
                me.yPos = me.getYposAlignedToAnchor();
            }

            me.stopAnimation();

            if (me.enableAnimations) {
                el.animate({
                    to: {
                        x: me.xPos,
                        y: me.yPos
                    },
                    easing: me.slideBackAnimation,
                    duration: me.slideBackDuration,
                    dynamic: true
                });
            }
        }
    },

    update: function () {
        var me = this;

        if (me.isVisible()) {
            me.isHiding = true;
            me.hide();
            //TODO offer a way to just update and reposition after layout 
        }

        me.callParent(arguments);

        me.show();
    },

    cancelAutoClose: function () {
        var closeTask = this.closeTask;

        if (closeTask) {
            closeTask.cancel();
        }
    },

    doAutoClose: function () {
        var me = this;

        if (!(me.stickWhileHover && me.mouseIsOver)) {
            // Close immediately 
            me.close();
        } else {
            // Delayed closing when mouse leaves the component. 
            me.closeOnMouseOut = true;
        }
    },

    doDestroy: function () {
        //销毁时清空Ext.MessageToast
        Ext.MessageToast = null;
        //销毁浏览器布局改变监听事件
        this.resizeListeners.destroy();
        this.removeFromAnchor();
        this.cancelAutoClose();
        this.callParent();
    },

    onMouseEnter: function () {
        this.mouseIsOver = true;
    },

    onMouseLeave: function () {
        var me = this;

        me.mouseIsOver = false;

        if (me.closeOnMouseOut) {
            me.closeOnMouseOut = false;
            me.close();
        }
    },

    removeFromAnchor: function () {
        var me = this,
        activeToasts, index;

        if (me.anchor) {
            activeToasts = me.getToasts();
            index = Ext.Array.indexOf(activeToasts, me);
            if (index !== -1) {
                Ext.Array.erase(activeToasts, index, 1);

                // Slide "down" all activeToasts "above" the hidden one 
                for (; index < activeToasts.length; index++) {
                    activeToasts[index].slideBack();
                }
            }
        }
    },

    getFocusEl: Ext.emptyFn,

    hide: function () {
        var me = this,
        el = me.el;

        me.cancelAutoClose();

        if (me.isHiding) {
            if (!me.isFading) {
                me.callParent(arguments);
                me.isHiding = false;
            }
        } else {
            // Must be set right away in case of double clicks on the close button 
            me.isHiding = true;
            me.isFading = true;

            me.cancelAutoClose();

            if (el) {
                if (me.enableAnimations && !me.destroying && !me.destroyed) {
                    el.fadeOut({
                        opacity: 0,
                        easing: 'easeIn',
                        duration: me.hideDuration,
                        listeners: {
                            scope: me,
                            afteranimate: function () {
                                var me = this;

                                me.isFading = false;

                                if (!me.destroying && !me.destroyed) {
                                    me.hide(me.animateTarget, me.doClose, me);
                                }
                            }
                        }
                    });
                } else {
                    me.isFading = false;
                    me.hide(me.animateTarget, me.doClose, me);
                }
            }
        }

        return me;
    },

    privates: {
        onGlobalResize: function () {
            //销毁原有弹窗，创建一个新弹窗，避免布局错误
            Ext.uxToast(this.backupConfig, null, null, true);
        }
    }
},
function (uxToast) {
    //data 消息列表数据
    //isRefresh 为true标识这个是onGlobalResize方法触发的，避免内容不显示
    Ext.uxToast = function (data, title, align, isRefresh) {
        var toast, config;
        if (isRefresh) {
            config = data;
        } else {
            config = {
                title: title,
                message: {
                    data: data
                }
            };
        }
        if (align) {
            config.align = align;
        } //通过Ext.MessageToast来判断是否已经显示
        toast = Ext.MessageToast;
        if (toast) {
            //销毁上一个提示消息
            toast.destroy();
        }
        Ext.MessageToast = toast = new uxToast(config);
        //保存配置，用于重新布局
        toast.backupConfig = config;
        toast.show();
        return toast;
    };
});