/**
 * A Picker field that contains a tree panel on its popup, enabling selection of tree nodes.
 * 动态绑定store，修复火狐点击穿透bug
 */
Ext.define('ux.form.field.TreePicker', {
    extend: 'Ext.form.field.Picker',
    xtype: 'uxTreepicker',
    mixins: ['Ext.util.StoreHolder'],
    uses: ['Ext.tree.Panel'],
    triggerCls: Ext.baseCSSPrefix + 'form-arrow-trigger',

    config: {
        /**
         * @cfg {Ext.data.TreeStore} store
         * A tree store that the tree picker will be bound to
         */
        store: null,

        /**
         * @cfg {String} displayField
         * The field inside the model that will be used as the node's text.
         * Defaults to the default value of {@link Ext.tree.Panel}'s `displayField` configuration.
         */
        displayField: null,

        /**
         * @cfg {Array} columns
         * An optional array of columns for multi-column trees
         */
        columns: null,

        /**
         * @cfg {Boolean} selectOnTab
         * Whether the Tab key should select the currently highlighted item. Defaults to `true`.
         */
        selectOnTab: true,

        /**
         * @cfg {Number} maxPickerHeight
         * The maximum height of the tree dropdown. Defaults to 300.
         */
        maxPickerHeight: 300,

        /**
         * @cfg {Number} minPickerHeight
         * The minimum height of the tree dropdown. Defaults to 100.
         */
        minPickerHeight: 100
    },
    rootVisible:false,
    editable: false,
    /**
     * @event select
     * Fires when a tree node is selected
     * @param {ux.TreePicker} picker        This tree picker
     * @param {Ext.data.Model} record           The selected record
     */

    initComponent: function () {
        var me = this,
        store = me.store;

        me.callParent(arguments);
        me.delayhide = Ext.create('Ext.util.DelayedTask',
        function () {
            //console.log('鼠标离开');
            me.collapse(true);
        });
        //如果store是string类型，寻找对应的store
        if (Ext.isString(store)) {
            store = me.store = Ext.data.StoreManager.lookup(store);
        }
        //绑定store
        if (store) {
            me.setStore(store);
        } else {
            //动态绑定store
            me.bindStore(me.store, true);
        }
    },

    /**
     * Creates and returns the tree panel to be used as this field's picker.
     */
    createPicker: function () {
        var me = this,
        picker = new Ext.tree.Panel({
            baseCls: Ext.baseCSSPrefix + 'boundlist',
            shrinkWrapDock: 2,
            store: me.store,
            floating: true,
            displayField: me.displayField,
            columns: me.columns,
            rootVisible:me.rootVisible,
            minHeight: me.minPickerHeight,
            //maxHeight: me.maxPickerHeight,
            //固定高度，防止展开树后滚动到顶部
            height: me.maxPickerHeight,
            manageHeight: false,
            shadow: false,
            cls: 'uxTreepicker',
            listeners: {
                scope: me,
                itemclick: me.onItemClick,
                itemkeydown: me.onPickerKeyDown,
                focusenter: function () {
                    me.delayhide.cancel();
                    //console.log('鼠标进入');
                }
            }
        }),
        view = picker.getView();

        if (Ext.isIE9 && Ext.isStrict) {
            // In IE9 strict mode, the tree view grows by the height of the horizontal scroll bar when the items are highlighted or unhighlighted.
            // Also when items are collapsed or expanded the height of the view is off. Forcing a repaint fixes the problem.
            view.on({
                scope: me,
                highlightitem: me.repaintPickerView,
                unhighlightitem: me.repaintPickerView,
                afteritemexpand: me.repaintPickerView,
                afteritemcollapse: me.repaintPickerView
            });
        }
        return picker;
    },

    /**
 * repaints the tree view
 */
    repaintPickerView: function () {
        var style = this.picker.getView().getEl().dom.style;

        // can't use Element.repaint because it contains a setTimeout, which results in a flicker effect
        style.display = style.display;
    },

    /**
 * Handles a click even on a tree node
 * @private
 * @param {Ext.tree.View} view
 * @param {Ext.data.Model} record
 * @param {HTMLElement} node
 * @param {Number} rowIndex
 * @param {Ext.event.Event} e
 */
    onItemClick: function (view, record, node, rowIndex, e) {
        this.selectItem(record);
    },

    /**
 * Handles a keypress event on the picker element
 * @private
 * @param {Ext.event.Event} e
 * @param {HTMLElement} el
 */
    onPickerKeyDown: function (treeView, record, item, index, e) {
        var key = e.getKey();

        if (key === e.ENTER || (key === e.TAB && this.selectOnTab)) {
            this.selectItem(record);
        }
    },

    /**
 * Changes the selection to a given record and closes the picker
 * @private
 * @param {Ext.data.Model} record
 */
    selectItem: function (record) {
        var me = this;
        me.setValue(record.getId());
        me.fireEvent('select', me, record);
        me.collapse(true);
    },

    /**
 * Runs when the picker is expanded.  Selects the appropriate tree node based on the value of the input element,
 * and focuses the picker so that keyboard navigation will work.
 * @private
 */
    onExpand: function () {
        var picker = this.picker,
        store = picker.store,
        value = this.value,
        node;

        if (value) {
            node = store.getNodeById(value);
        }

        if (!node) {
            //这里顶级节点被隐藏了不能选中它，否则会出错
            // node = store.getRoot();
        } else {
            picker.ensureVisible(node, {
                select: true,
                focus: true
            });
        }
    },

    /**
 * Sets the specified value into the field
 * @param {Mixed} value
 * @return {ux.TreePicker} this
 */
    setValue: function (value) {
        var me = this,
        record;
        me.value = value;
        //针对动态绑定的情况，这里判断store是否存在
        if (!me.store || me.store.loading) {
            // Called while the Store is loading. Ensure it is processed by the onLoad method.
            return me;
        }

        // try to find a record in the store that matches the value
        record = value ? me.store.getNodeById(value) : me.store.getRoot();
        if (value === undefined) {
            record = me.store.getRoot();
            me.value = record.getId();
        } else {
            record = me.store.getNodeById(value);
        }

        // set the raw value to the record's display field if a record was found
        me.setRawValue(record ? record.get(me.displayField) : '');

        return me;
    },

    getSubmitValue: function () {
        return this.value;
    },

    /**
 * Returns the current data value of the field (the idProperty of the record)
 * @return {Number}
 */
    getValue: function () {
        return this.value;
    },

    /**
 * 数据加载成功时
 * @private
 */
    onLoad: function () {
        var value = this.value;
        if (value||value==0) {
            this.setValue(value);
        }
    },

    onUpdate: function (store, rec, type, modifiedFieldNames) {
        var display = this.displayField;
        console.log(store);
        if (type === 'edit' && modifiedFieldNames && Ext.Array.contains(modifiedFieldNames, display) && this.value === rec.getId()) {
            this.setRawValue(rec.get(display));
        }
    },
    onFocusLeave: function (e) {
        this.collapse();
        this.delayhide.delay(100);
    },
    collapse: function (is) {
        var me = this;

        if (me.isExpanded && !me.destroyed && !me.destroying && is) {
            var openCls = me.openCls,
            picker = me.picker,
            aboveSfx = '-above';

            // hide the picker and set isExpanded flag
            picker.hide();
            me.isExpanded = false;

            // remove the openCls
            me.bodyEl.removeCls([openCls, openCls + aboveSfx]);
            picker.el.removeCls(picker.baseCls + aboveSfx);

            if (me.ariaRole) {
                me.ariaEl.dom.setAttribute('aria-expanded', false);
            }

            // remove event listeners
            me.touchListeners.destroy();
            me.scrollListeners.destroy();
            Ext.un('resize', me.alignPicker, me);
            me.fireEvent('collapse', me);
            me.onCollapse();
        }
    },
    setStore: function (store) {
        if (store) {
            this.store = store;
            this.onLoad();
        }
    },
    bindStore: function (store, initial) {
        this.mixins.storeholder.bindStore.apply(this, arguments);
    }
});