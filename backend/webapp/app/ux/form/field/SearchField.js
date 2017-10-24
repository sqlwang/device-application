//支持bind绑定store
Ext.define('ux.form.field.SearchField', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.uxSearchfield',
    defaultBindProperty: 'store',
    mixins: ['Ext.util.StoreHolder'],
    triggers: {
        clear: {
            weight: 0,
            cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            hidden: true,
            //清除搜索条件
            handler: 'clearValue',
            scope: 'this'
        },
        search: {
            weight: 1,
            cls: Ext.baseCSSPrefix + 'form-search-trigger',
            //查询
            handler: 'onSearchClick',
            scope: 'this'
        }
    },
    emptyText: '请输入关键词',
    msgTarget: 'title',
    //查询参数
    paramName: 'query',
    //是否本地查询
    isLocal: false,
    //树形数据是否全局过滤
    isDepth: false,
    initComponent: function () {
        var me = this,
        store = me.store;
        me.on({
            //添加监听，监听回车键
            specialkey: function (f, e) {
                if (e.getKey() == e.ENTER) {
                    me.onSearchClick();
                }
            },
            //监听内容改变
            //在这里监听是为了实现多个搜索控件绑定同一个store时
            //界面能够同步
            change: function (t, value) {
                var clear = t.getTrigger('clear');
                //根据查询条件是否存在，显示隐藏小按钮
                if (value.length > 0) {
                    if (clear.hidden) {
                        clear.show();
                        t.updateLayout();
                    }
                } else {
                    clear.hide();
                    t.updateLayout();
                    me.onClearClick();
                }
            }
        });
        //如果strong是string类型，寻找对应的store
        if (Ext.isString(store)) {
            store = me.store = Ext.data.StoreManager.lookup(store);
        }
        //动态绑定store
        me.bindStore(store || 'ext-empty-store', true);
        me.callParent(arguments);
    },
    bindStore: function (store) {
        var me = this;
        if (store && store != 'ext-empty-store') {
            me.store = store;
            store.on({
                refreshStore: function () { me.refreshStore();}
            });
            me.treepanel = me.up('treepanel');
        }
        return me;
    },
    //根据参数加载树形菜单
    loadTree: function (params) {
        this.store.getProxy().setExtraParams(params);
        this.refreshStore();
    },
    refreshStore: function () {
        var tree = this.treepanel,
        store = this.store,
        proxy = store.getProxy(),
        //获取旧参数
        params = proxy.getExtraParams(),
        //取父节点
        rec = store.getRoot();
        //清楚本地搜索框
        this.clearValue();
        //设置参数，服务端清空缓存
        proxy.setExtraParams( Ext.apply({
            node: 'dep:-1',
            del: 1
        }, params));
        //标识刷新store
        this.isRefreshStore = true;

        //重置状态刷新节点
        rec.set('loaded', false);
        //设置为未展开
        rec.set('expanded', false);
        //tree.setSelection(rec);
        //重新展开小区树
        tree.expandNode(rec);
        //无法再次刷新，禁用按钮
        //t.setDisabled(tree);
        //重置参数，避免数据紊乱
        proxy.setExtraParams(params);
        //触发一个自定义reload函数
        store.fireEvent('reload',store);
    },
    //清除value
    clearValue: function () {
        this.setValue('');
    },
    //清除过滤
    onClearClick: function () {
        //console.log('清除过滤');
        var me = this,
        activeFilter = me.activeFilter,
        store = me.store;
        if (activeFilter) {
            store.getFilters().remove(activeFilter);
            me.activeFilter = null;
        } else {
            //me.list = [];
            store.clearFilter(false);
            //如果是树形数据并且要求全局过滤
            //折叠菜单
            if (store.isTreeStore && me.isDepth) {
                me.treepanel.collapseAll();
            }
        }
    },
    //展开已知节点
    expandedNode: function (rec) {
        var nodes = rec.childNodes,
        length = nodes.length,
        i;
        if (length) {
            //如果存在子节点，展开子节点，并尝试展开子节点的子节点，递归
            rec.set('expanded', true);
            for (i = 0; i < length; i++) {
                this.expandedNode(nodes[i]);
            }
        }
    },
    //本地过滤
    localFilter: function (value) {
        var me = this,
        store = me.store,
        paramName = me.paramName,
        search = new RegExp(Ext.String.escapeRegex(value), 'i'),
        isTreeStore;
        //关键词改变时重置列表和搜索关键词
        me.value = value;
        me.list = [];
        if (!store) {
            return;
        }
        //是否是树形数据
        isTreeStore = store.isTreeStore;
        //清除原有的过滤器
        store.clearFilter(!!value);
        //如果是树形数据并且要求全局过滤
        //需要store增加配置filterer: 'bottomup'
        if (isTreeStore && me.isDepth) {
            //全局过滤
            store.getFilters().replaceAll({
                property: paramName,
                value: search
            });
            //遍历结果，展开所有已知子节点
            store.each(function (rec) {
                me.expandedNode(rec);
            });
        } else if (isTreeStore && me.isOnline) {
            //选中上级节点时过滤下级节点,只能是从上向下过滤模式
            var tree = me.treepanel,
                //获取当前选中项集合
                selection = tree.getSelection(),
                list = [], nextDepth, dataId,
                data, recDepth;
            if (selection.length > 0) {
                //获取当前选中项
                data = selection[0];
                //最后一级不过滤
                if (data.get('leaf')) {
                    return;
                }
                //获取当前选中节点要过滤的下一层级
                nextDepth = data.get('depth') + 1;
                //获取当前选中节点id
                dataId = data.getId();
                if (!data.get('expanded')) {
                    //如果菜单没有展开，自动展开
                    data.set('expanded', true)
                }
                //因为是从上向下过滤模式，需要将当前选中节点的父节点和当前选中节点加入到集合中
                me.getParentNode(data, list);
                //return false;
                //循环遍历store,开始过滤
                store.filter(function (rec) {
                    //节点层级
                    recDepth = rec.get('depth');
                    if (list.indexOf(rec.getId()) > -1) {
                        //当前选中节点的父节点和当前选中节点通过过滤
                        return true;
                    }else if (recDepth == nextDepth && rec.parentNode.getId() == dataId) {
                        //过滤节点位于当前选中节点所在层级的下一层级
                        //过滤节点的父节点就是当前选中节点
                        //根据关键词过滤
                        return search.test(rec.get(paramName));
                    } else if (recDepth > nextDepth) {
                        //过滤节点大于当前选中节点所在层级的下一层级通过过滤
                        //因为是至上而下过滤模式，所以不是选中的节点也会被过滤掉
                        return true;
                    }
                    return false;
                });
            }
        } else {
            //循环遍历store,开始过滤
            store.filter(function (rec) {
                //树形菜单只过滤第一层
                if (isTreeStore && rec.get('depth') != 1) {
                    return true;
                }
                return search.test(rec.get(paramName));;
            });
        }
    },
    getParentNode: function (node, list) {
        if (!node) {
            return;
        }
        list.push(node.getId());
        this.getParentNode(node.parentNode, list);
    },
    //过滤
    onSearchClick: function () {
        var me = this,
        value = me.getValue(),
        store,
        proxy;
        //通过验证才能过滤
        if (me.isValid() && value.length > 0) {
            //本地还是远程过滤
            if (!me.isLocal) {
                store = me.store;
                store.setRemoteFilter(true);
                // 设置代理，设置过滤参数
                proxy = store.getProxy();
                proxy.setFilterParam(me.paramName);
                proxy.encodeFilters = function (filters) {
                    return filters[0].getValue();
                }
                // Param name is ignored here since we use custom encoding in the proxy.
                // id is used by the Store to replace any previous filter
                me.activeFilter = new Ext.util.Filter({
                    property: me.paramName,
                    value: value
                });
                me.store.getFilters().add(me.activeFilter);
            } else {
                me.localFilter(value);
            }
        }
    },
    onDestroy: function () {
        //清除过滤条件
        var me = this,
        store = me.store;
        if (store) {
            me.onClearClick();
            me.store = null;
            //移除绑定
            me.bindStore(null);
        }
        me.callParent();
    }
});