//扩展
//弹窗扩展
//点击按钮弹出一个grid消息弹窗
//具有分页功能
Ext.define('ux.button.Grid', {
    extend: 'ux.button.Picker',
    xtype: 'buttonGrid',
    requires: ['Ext.util.DelayedTask', 'Ext.toolbar.Paging', 'Ext.data.StoreManager'],
    mixins: ['Ext.util.StoreHolder'],
    viewModel: {
    },
    //弹窗默认配置
    defaultListConfig: {
        width: 630,
        height: 300,
        shadow: 'sides'
    },
    //创建弹窗
    createPicker: function () {
        var me = this,
        picker, pickerCfg = Ext.apply({
            xtype: 'grid',
            id: me.id + '-picker',
            pickerField: me,
            floating: true,
            hidden: true,
            store: me.getPickerStore(),
            preserveScrollOnRefresh: true,
            viewModel:me.getViewModel()
        },
        me.listConfig, me.defaultListConfig);

        picker = me.picker = Ext.widget(pickerCfg);

        picker.getNavigationModel().navigateOnSpace = false;

        return picker;
    },
    //获取数据源
    getPickerStore: function () {
        return this.store;
    },
    //初始化
    initComponent: function () {
        var me = this,
        store = me.store;
        //绑定store
        me.bindStore(store || 'ext-empty-store', true, true);

        me.callParent();

    },
    //移除store
    onUnbindStore: function () {
        var me = this,
        picker = me.picker;
        if (picker) {
            picker.bindStore(null);
        }
    },
    //绑定store
    onBindStore: function (store, initial) {
        var me = this,
        picker = me.picker;

        // 绑定store到弹窗中
        if (store && picker && picker.getStore() !== store) {
            picker.bindStore(store);
        }
    },
    /**
     * Binds a store to this instance.
     * @param {Ext.data.AbstractStore/String} [store] The store to bind or ID of the store.
     * When no store given (or when `null` or `undefined` passed), unbinds the existing store.
     * @param {Boolean} [preventFilter] `true` to prevent any active filter from being activated
     * on the newly bound store. This is only valid when used with {@link #queryMode} `'local'`.
     * @param initial (private)
     */
    bindStore: function (store, preventFilter, initial) {
        var me = this;
        me.mixins.storeholder.bindStore.call(me, store, initial);
    },
    //获取store监听事件
    getStoreListeners: function (store) {

        // Don't bother with listeners on the dummy store that is provided for an unconfigured ComboBox
        // prior to a real store arriving from a ViewModel. Nothing is ever going to be fired.
        if (!store.isEmptyStore) {
            var me = this,
            result = {
                exception: me.onException,
                load:me.onLoadStore
            };

            return result;
        }
    },
    //设置默认的显示隐藏状态
    //这里是防止bind hidden配置与onLoadStore监听冲突
    setDefHidden: function (value) {
        this.defHidden = value;
        this.setHidden(value);
    },
    onLoadStore: function (t) {
        //本身没有隐藏才做处理
        if (!this.defHidden) {
            var ishidden = true,
                count = t.getTotalCount(),
                data;
            if (count) {
                ishidden = false;
                data = t.getAt(0).getData();
            }
            this.getViewModel().setData({
                uxData:data,
                uxStoreCount: count
            })
            //console.log();
            this.setHidden(ishidden);
        }
    },
    //加载失败
    onException: function () {
        this.collapse();
    }
});