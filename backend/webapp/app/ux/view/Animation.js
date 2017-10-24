/**
 * 带滚动动画效果的dataView
 */
Ext.define('ux.view.Animation', {
    extend: 'Ext.panel.Panel',
    requires: ['Ext.view.View'],
    mixins: ['Ext.util.StoreHolder'],
    alias: 'widget.uxAnimationView',
    xtype: 'uxAnimationView',
    cls: 'over-hidden',
    //向上滚动一行所需时间
    animateDuration: 2000,
    correctSum: 0,
    config: {
        dataView: {
            //多行并列时只支持float: left;布局 display: inline-block;布局会有卡顿现象
            itemSelector: 'div.thumb-wrap'
        },
        //是否启用动画效果
        animate: true
    },
    //初始化
    initComponent: function () {
        var me = this,
        store = me.store;
        //绑定store
        me.bindStore(store || 'ext-empty-store', true, true);
        me.callParent(arguments);
        me.add([me.getDataView()]);
    },
    applyDataView: function (config) {
        config.store = this.store;
        return Ext.factory(config, 'Ext.view.View', this.getDataView());
    },
    updateDataView: function (item) {
        if (item) {
            var me = this;
            item.on({
                scope: me,
                viewready: me.viewReady
            });
        }
    },
    //数据列表首次加载完成
    viewReady: function (t) {
        ////console.log('viewReady');
        //添加监听指定元素是否加载完毕，只监听一次
        //如果指定了delegate配置就监听delegate配置，如果没有指定则监听itemSelector配置
        var me = this,
        delegate = t.delegate ? t.delegate : t.itemSelector;
        t.el.on({
            load: 'moveUpInit',
            //监听对象
            delegate: delegate,
            scope: me,
            //监听一次就可以了
            single: true
        });
    },
    //首次上移整个版面
    moveUpInit: function () {
        var me = this,
        dataView = me.getDataView(),
        item = dataView.getNode(0),
        animate = me.getAnimate(),
        store,
        heigth,
        width;
        if (item) {
            //console.log('moveUpInit');
            //单个元素的高和宽
            heigth = item.offsetHeight;
            //注意如果使用了margin需要额外的计算
            width = item.offsetWidth;
            //最大行数
            me.maxRow = Math.floor(me.body.dom.clientHeight / heigth);
            //最大列数
            me.maxColumn = Math.floor(me.getWidth() / width);
            //每次滚动总数
            me.itemCount = me.maxRow * me.maxColumn;
            store = me.store;
            if (animate) {
                dataView.animate({
                    duration: me.animateDuration,
                    to: {
                        // me.correctSum修正padding影响
                        top: -heigth * me.maxRow - me.correctSum
                    },
                    listeners: {
                        afteranimate: function () {
                            //延迟执行，避免出错
                            setTimeout(function () {
                                ////console.log('removeAt');
                                //可以在凑齐一定数量的时候删除掉已滚动的元素
                                //停止布局
                                dataView.suspendLayouts();
                                //重置漂移量
                                dataView.setStyle('top', 0);
                                //删除已漂移数据
                                store.removeAt(0, me.itemCount);
                                //恢复布局
                                dataView.resumeLayouts();
                                //滚动完成
                                me.animateEnd();
                            },
                            300);
                        }
                    }
                });
            } else {
                setTimeout(function () {
                    //删除已漂移数据
                    store.removeAt(0, me.itemCount);
                    //滚动完成
                    me.animateEnd();
                }, me.animateDuration);
            }
        }
    },
    animateEnd:Ext.emptyFn,
    //将视图绑定到store中
    bindStore: function (store, preventFilter, initial) {
        var me = this;
        me.mixins.storeholder.bindStore.call(me, store, initial);
    },
    //移除store
    onUnbindStore: function () {
        var me = this,
        dataView = me.getDataView();
        if (dataView) {
            dataView.bindStore(null);
        }
    },
    //绑定store
    onBindStore: function (store, initial) {
        var me = this,
        dataView = me.getDataView();

        // 绑定store到弹窗中
        if (store && dataView && dataView.getStore() !== store) {
            dataView.bindStore(store);
        }
    }
});