/**
 * 一个dataview弹窗.
 */
Ext.define('ux.view.BoundList', {
    extend: 'Ext.view.View',
    alias: 'widget.uxBoundlist',
    alternateClassName: 'ux.BoundList',
    requires: ['Ext.layout.component.BoundList'],
    plugins: 'conTpl',
    mixins: ['Ext.mixin.Queryable'],
    cls: 'uxBoundlist',
    baseCls: Ext.baseCSSPrefix + 'boundlist',
    itemCls: Ext.baseCSSPrefix + 'boundlist-item',
    listItemCls: '',
    selectedItemCls: '',
    shadow: false,
    preserveScrollOnRefresh: true,
    enableInitialSelection: false,
    refreshSelmodelOnRefresh: true,
    deferEmptyText: false,
    emptyText: '<div class="tc" style="height: 99px;line-height: 99px;font-size: 16px;">当前暂无消息</div>',
    scrollable: true,
    //不设置会没有滚动条
    componentLayout: 'boundlist',
    ariaEl: 'listEl',
    tabIndex: -1,

    childEls: ['listWrap', 'listEl'],

    renderTpl: [
        '<div id="{id}-listWrap" data-ref="listWrap"',
                ' class="{baseCls}-list-ct ', Ext.dom.Element.unselectableCls, '">',
            '<ul id="{id}-listEl" data-ref="listEl" class="', Ext.baseCSSPrefix, 'list-plain"',
            '<tpl foreach="ariaAttributes"> {$}="{.}"</tpl>',
            '>',
            '</ul>',
         '</div>',
         {
             disableFormats: true
         }
    ],

    // Override because on non-touch devices, the bound field
    // retains focus so that typing may narrow the list.
    // Only when the show is triggered by a touch does the BoundList
    // get explicitly focused so that the keyboard does not appear.
    focusOnToFront: false,
    alignOnScroll: false,

    initComponent: function () {
        var me = this,
        baseCls = me.baseCls,
        itemCls = me.itemCls;
        me.selectedItemCls = baseCls + '-selected';

        if (me.trackOver) {
            me.overItemCls = baseCls + '-item-over';
        }
        me.itemSelector = '.' + itemCls;

        if (me.floating) {
            me.addCls(baseCls + '-floating');
        }
        if (!me.tpl) {
            Ext.raise('please site tpl.');

        } else if (!me.tpl.isTemplate) {
            me.tpl = new Ext.XTemplate('<tpl for=".">', '<li role="option" unselectable="on" class="' + itemCls + '">' + me.tpl + '</li>', '</tpl>');
        }

        me.callParent();
    },

    getRefOwner: function () {
        return this.pickerField || this.callParent();
    },

    refresh: function () {
        var me = this,
        tpl = me.tpl;

        // Allow access to the context for XTemplate scriptlets
        tpl.field = me.pickerField;
        tpl.store = me.store;
        me.callParent();
        tpl.field = tpl.store = null;

        // The view selectively removes item nodes, so the toolbar
        // will be preserved in the DOM
    },

    afterComponentLayout: function (width, height, oldWidth, oldHeight) {
        var field = this.pickerField;

        this.callParent([width, height, oldWidth, oldHeight]);

        // Bound list may change size, so realign on layout
        // **if the field is an Ext.form.field.Picker which has alignPicker!**
        if (field && field.alignPicker) {
            field.alignPicker();
        }
    },

    // 某项被点击时
    onItemClick: function (record) {
        var me = this,
        field = me.pickerField;
        if (!field) {
            return;
        }
        field.fireEvent('itemclick', me, field, record);
    },
    onContainerClick: function (e) {
        var clientRegion;
        // IE10 and IE11 will fire pointer events when user drags listWrap scrollbars,
        // which may result in selection being reset.
        if (Ext.isIE10 || Ext.isIE11) {
            clientRegion = this.listWrap.getClientRegion();

            if (!e.getPoint().isContainedBy(clientRegion)) {
                return false;
            }
        }
    },

    privates: {
        getNodeContainer: function () {
            return this.listEl;
        },

        getTargetEl: function () {
            return this.listEl;
        },

        getOverflowEl: function () {
            return this.listWrap;
        }
    }
});