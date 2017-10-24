//小区数据处理模块
//在类中mixins: ['ux.mixin.District'],调用
//reportUser report这两个控制层公用
Ext.define('ux.mixin.District', {
    mixinId: 'uxMixinDistrict',
    //包含小区下拉框的容器显示时
    onPanelShow: function (t) {
        var items = t.query('districtCombo');
        for (var i = 0; i < items.length; i++) {
            this.onComboRender(items[i], true);
        }
    },
    //下拉框初始化时
    onComboRender: function (t) {
        this.loadComboStore(t);
    },
    //从主数据源复制小区数据到其他数据源
    //主数据源roomTree
    //t 左侧树
    //isShow false标识视图还没有被创建 true标识视图已经创建，现在是再次显示
    //只在界面显示时才操作，这样可以避免子数据源太多时用户有卡顿感
    //注意这里的代码影响默认选中项，影响消息中心的消息提示
    loadComboStore: function (t, isShow) {
        var me = this,
        //目标数据源
        store = t.getStore(),
        //主数据源，所有的小区数据都从这里复制
        treeStore = Ext.getStore('roomTree'),
        //主数据源数据总数
        count = treeStore.getCount();
        //如果没有storeId说明是用bing方式绑定的store，需要在viewModel里面找到这个store
        if (store.storeId == 'ext-empty-store') {
            store = me.getStore(t.getBind().store.stub.name);
        }
        if (!isShow) {
            //视图首次创建时监听主数据源事件
            //用于主数据源更新小区数据时刷新子数据源
            //treeStore.on({
            //    //监听小区数据是否刷新过，reload是一个自定义时间
            //    //ux.form.field.SearchField控件触发此事件
            //    reload: function () {
            //        console.log('小区刷新');
            //        //标识小区数据发生了改变
            //        t.isChangeDistric = true;
            //    }
            //});
        }
        //如果数据正在加载中或者主数据源还没有数据
        //监听load事件
        //如果数据正在加载中，监听store的load事件是否触发还未被验证，毕竟这个是小概率事件
        //不过不触发也没什么关系，毕竟之前的代码小区信息更新时都没做处理
        //导航树上面也有刷新按钮可以备用
        //下次再进入对应的页面未执行事件仍然会执行
        if (treeStore.isLoading() || !count) {
            //监听主数据源加载事件
            treeStore.on({
                load: function () {
                    console.log('数据加载完成');
                    me.copyComboStore(treeStore, store);
                },
                //仅监听一次
                single: true
            });
            //主数据源还没有数据,加载数据
            if (!count) {
                //这种方式加载数据才能避免一系列的问题
                treeStore.getRoot().expand();
            }
        } else if (t.isChangeDistric || (count && !store.getCount())) {
            //如果小区数据发生了变化或者主数据源已经有数据，并且目标数据源没有数据，直接复制数据
            me.copyComboStore(treeStore, store);
        }
    },
    //复制树形数据源第一级数据到另一个数据源
    copyComboStore: function (store, newStore) {
        util.storeLoad(newStore, { node: 'dep:-1' });
        return;
        console.log('复制数据');
        var data = [], item;

        //复制一个数据源，避免影响原数据
        store = Ext.clone(store);
        //清除原有的过滤器
        store.clearFilter(true);

        //移除旧的数据
        newStore.removeAll();
        store.each(function (rec) {
            //只有小区这一级才复制
            if (rec.get('depth') == 1) {
                item = rec.getData();
                data.push(item);
            }
        });
        newStore.add(data);
    }
});