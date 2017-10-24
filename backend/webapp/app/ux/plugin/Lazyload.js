/*
*监听视图是否在可视区域
* 需要同一滚动条内其他元素高度固定
*/
Ext.define('ux.plugin.Lazyload', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.lazyload',
    xtype: 'lazyload',
    config: {
        //对应的容器，字符串
        //因为不一定是整个页面进行滚动，所以需要定位到具体的容器页面
        scrollView:null
    },
    scrollable: null,
    //初始化
    init: function (cmp) {
        var me = this;
        me.callParent(arguments);
        cmp.on({
            //只有创建完成后才能监听事件
            afterrender: 'onRender',
            lazyListener: 'lazyListener',
            scope: me
        });
    },
    //创建完成
    onRender: function () {
        var me = this,
            //视图本身
            cmp = me.getCmp(),
            //父容器视图
            scrollView = cmp.up(me.getScrollView());
        //获取父容器滚动条
        me.scrollable = scrollView.getScrollable();
        //获取元素距离滚动条顶部的位置
        me.yPosition = cmp.el.dom.offsetTop;
        //开始监听
        me.lazyListener();
    },
    //监听滚动，开启懒加载
    lazyListener: function () {
        var me = this, cmp;
        if (me.yPosition) {
            //如果视图已经在父容器可视区域内直接触发事件
            if (me.viewHeight && (me.yPosition - me.viewHeight - me.scrollable.getPosition().y - 100) <= 0) {
                var cmp = me.getCmp();
                cmp.fireEvent('lazyLoad', cmp);
                return;
            } else if (!me.scrollListeners) {
                //计算视图可视高度
                me.onRefresh();
                //监听滚动条滚动事件
                me.scrollListeners = me.scrollable.on({
                    scroll: me.onScroll,
                    scope: me,
                    destroyable: true
                });
            }
        }
    },
    //计算视图可视高度
    onRefresh: function () {
        this.viewHeight = this.getCmp().el.dom.clientHeight;
    },
    //滚动条开始滚动
    onScroll: function (scroller, x, y) {
        var me = this, cmp;
        //滚动距离加可视高度大于当前坐标
        //console.log('我的位置', y , me.viewHeight, me.yPosition);
        if (y + me.viewHeight + 100 >= me.yPosition) {
            cmp = me.getCmp();
            cmp.fireEvent('lazyLoad', cmp);
            //console.log('我显示了', y + me.viewHeight, me.yPosition);
            //加载完成，销毁监听事件
            me.scrollListeners.destroy();
            me.scrollListeners = null;
        }
    }
});