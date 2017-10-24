//扩展
//弹窗扩展
//点击按钮弹出消息提示框
Ext.define('ux.button.DataView', {
    extend: 'ux.button.Picker',
    xtype: 'buttonDataView',
    requires: ['Ext.util.DelayedTask', 'ux.view.BoundList', 'Ext.data.StoreManager'],
    mixins: ['Ext.util.StoreHolder'],
    //弹窗默认配置
    defaultListConfig: {
        minWidth: 630,
        minHeight: 100,
        maxHeight: 300,
        shadow: 'sides'
    },
    //创建弹窗
    createPicker: function () {
        var me = this,
        picker, pickerCfg = Ext.apply({
            xtype: 'uxBoundlist',
            id: me.id + '-picker',
            pickerField: me,
            floating: true,
            hidden: true,
            store: me.getPickerStore(),
            preserveScrollOnRefresh: true,
            tpl: me.tpl,
            listeners: {
                dataclick: function (cmp, el) {
                    me.fireEvent(el.getAttribute('fireName'), me, cmp, el);
                }
            }
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
                exception: me.onException
            };

            return result;
        }
    },

    //加载失败
    onException: function () {
        this.collapse();
    }
});