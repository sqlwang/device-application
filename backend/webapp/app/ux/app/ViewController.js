//扩展
//扩展ViewController
Ext.define('ux.app.ViewController', {
    extend: 'Ext.app.ViewController',
    //显示返回页面
    showBackView: function (view, tmpConfig) {
        config.tmpConfig = tmpConfig;
        this.redirectTo(view);
    },

    //返回
    //非弹窗类子页面通过浏览器按钮点击返回不会触发此方法
    //所以在这里只有一个回退方法
    //如果要处理一些额外的业务逻辑，比如模型数据重置
    //监听页面的beforedestroy事件来处理就行
    onBack: function () {
        //标识一下，现在是返回模式
        config.isBack = true;
        this.historyBack();
    },
    //返回上一页
    historyBack: function () {
        Ext.util.History.back();
    },
    //重置视图
    formReset: function () {
        var form = this.getView(),
        //上传控件
        plupFileList = form.down('plupFileList');
        //如果不是表单（弹窗页面），向下查找表单控件
        if (!form.isXType('form')) {
            form = form.down('form');
        }
        form.reset();
        //如果有上传控件，重置上传控件
        if (plupFileList) {
            plupFileList.reset();
        }
    },
    //重新加载store
    reloadStore: function () {
        //这个store是列表的store
        var store = this.getStore('store');
        if (store) {
            store.reload();
        }
    },
    //监听store数据总数的变化
    //并将总数写入到viewModel中的storeCount中
    monitorStoreCount: function (store,name) {
        var viewModel = this.getViewModel(), data = {}, name = name || 'storeCount';
        store.on({
            load: function () {
                //console.log('load', store.getCount());
                data[name]= store.getCount();
                viewModel.setData(data);
            },
            remove: function () {
                //console.log('remove', store.getCount());
                data[name] = store.getCount();
                viewModel.setData(data);
            },
            add: function () {
                //console.log('add', store.getCount());
                data[name] = store.getCount();
                viewModel.setData(data);
            }
        });
    },

    //win窗口提交成功执行
    //多用于非模型提交，提交后直接刷新列表数据
    winSuccess: function () {
        this.reloadStore();
        this.getView().close();
    },
    //view窗口提交成功执行
    viewSuccess: function () {
        this.reloadStore();
        this.onBack();
    },
    //弹出窗口取消
    //重置模型数据后关闭窗口
    //多用于修改场景
    onWindowChange: function () {
        this.modelReject();
        this.onClose();
    },
    //关闭弹窗
    onClose: function () {
        this.getView().close();
    },

    //form表单保存
    //默认post传值
    //isGet是否使用get方式传值
    formSave: function (url, isGet) {
        var form = this.getView(),
        deferred,
        values;
        //如果不是表单，向下查找表单控件
        if (!form.isXType('form')) {
            form = form.down('form');
        }
        if (form.isValid()) {
            values = form.getValues();
            return util.ajax(url, values, false, !isGet ? 'POST' : false);
        }
        deferred = new Ext.Deferred();
        return deferred.promise;
    },
    //返回页保存数据 链式
    viewSave: function (url) {
        var me = this;
        return me.formSave(url).then(function () {
            me.viewSuccess();
        });
    },
    //弹窗保存
    winSave: function (url) {
        var me = this;
        me.formSave(url).then(function () {
            me.winSuccess();
        });
    },
    //弹窗保存 带消息提示
    winSaveByMes: function (url, mes) {
        var me = this,
        win = me.getView(),
        form = win.down('form'),
        values;
        if (form.isValid()) {
            Ext.Msg.confirm('提示', mes,
            function (btn) {
                if (btn == 'yes') {
                    values = form.getValues();
                    util.ajaxP(url, values).then(function () {
                        me.winSuccess();
                    });
                }
            });
        }
    },

    //重置当前页模型
    modelReject: function () {
        var model = this.getViewModel().get('data');
        if (model && model.data) {
            //取消模型的更改
            model.reject();
        }
    },
    //模型保存
    modelSave: function () {
        var me = this,
        form = me.getView(),
        deferred,
        model;
        //如果不是表单，向下查找表单控件
        if (!form.isXType('form')) {
            form = form.down('form');
        }
        if (form.isValid()) {
            model = util.valid(form, me.getViewModel().get('data'));
            if (model) {
                return util.save(model);
            }
        }
        deferred = new Ext.Deferred();
        return deferred.promise;
    },
    //模型保存并更新数据仓库
    //isReload 是刷新数据还是动态添加
    //isEditReload 编辑时是否刷新
    modelSaveByStore: function (isReload, isEditReload) {
        var me = this;
        return me.modelSave().then(function (data) {
            var store = me.getStore('store');
            //如果是新增
            if (data.phantom) {
                if (isReload) {
                    store.reload();
                } else {
                    store.add(data.rec);
                }
            } else if (isEditReload) {
                store.reload();
            }
        });
    },
    //返回页保存模型数据 链式
    viewModelSave: function (isReload, isEditReload) {
        var me = this;
        return me.modelSaveByStore(isReload, isEditReload).then(function (data) {
            me.onBack();
        });
    },
    //保存弹窗表单的值
    //以model.save形式
    winModelSave: function (isReload, isEditReload) {
        var me = this;
        return me.modelSaveByStore(isReload, isEditReload).then(function (data) {
            me.getView().close();
        });
    },

    //表单提交
    formSubmit: function (url) {
        var deferred = new Ext.Deferred(),
        form = this.getView(),
        plup,
        count;
        //如果不是表单，向下查找表单控件
        if (!form.isXType('form')) {
            form = form.down('form');
        }
        if (form.isValid()) {
            //获取plup插件
            plup = form.down('plupFileList');
            //取到附件总数
            count = plup.getFileCount();
            //如果没有附件,则使用form表单提交
            if (count > 0) {
                return util.plupSubmit(plup, url, form.getValues());
            } else {
                return util.submit(form, url);
            }
        }
        return deferred.promise;
    },

    //列表删除单项
    //url 请求地址
    //param 参数名称（主键名称）
    //message 消息提示
    onDelete: function (url, param, message) {
        Ext.MessageBox.confirm('删除确认', message,
        function (btnText) {
            if (btnText == 'yes') {
                var grid = this.getView(),
                rec = grid.getSelectionModel().getSelection()[0],
                values = {};
                values[param] = rec.get(param);
                if (rec) {
                    util.ajax(url, values).then(function () {
                        grid.getStore().remove(rec);
                    });
                }
            }
        },
        this);
    },
    //将查询条件转换为url参数
    getQueryString: function (store) {
        var values = this.getStore(store).getProxy().getExtraParams();
        if (values) {
            return Ext.Object.toQueryString(values);
        }
        return '';
    },
    //Grid查询
    //用于grid中条件查询
    onGridSearch: function (btn) {
        var view = btn.up('grid'),
        values = util.getValues(btn.up('toolbar'));
        if (values) {
            util.listLoad(view, values);
        }
    },
    //重置搜索条件
    //重置grid的搜索条件
    resetToolbar: function (item) {
        //console.log(value);
        var toolbar = item.up('toolbar');
        util.reset(toolbar);
    },
    //刷新树
    refreshTree: function (t) {
        var tree = t.up('treepanel');
        tree.down('uxSearchfield').refreshStore();
    },

    //弹窗布局发生较大改变时，重置位置
    resizeCenter: function (t) {
        if (!t.resizeCount) {
            t.resizeCount = 1;
        } else {
            t.center();
        }
    },

    //预览图片
    //有可能是列表双击进来这样item就是一个数据模型
    //另外一种就是直接模版数据里面进来
    onShowImg: function (t, item,isRec) {
        var url;
        if (item.isModel) {
            url = item.get('img');
            if (isRec) {
                url += '?x-oss-process=image/format,jpg';
            }
        } else {
            url = item.getAttribute('img')
        }
        Ext.widget('showPic', {
            viewModel: {
                data: {
                    src: url
                }
            }
        });
    },
    //显示内容
    onShowInfo: function (view, record) {
        var data = record.getData(),
        view = 'showPic', src = data.link;
        if (data.type == '视频') {
            view = 'showVideo';
        } else {
            src += '?x-oss-process=image/format,jpg';
        }
        Ext.widget(view, {
            viewModel: {
                data: {
                    src: src
                }
            }
        });
    },

    //动态设置另一个控件的allowBlank属性
    onTimeChange: function (t, value) {
        //另一个时间控件
        var other = t.other,
        allowBlank = true;
        if (value) {
            allowBlank = false;
        }
        this.lookup(other).setAllowBlank(allowBlank);
    },
    //动态设置另一个控件的最大时间
    onTimeInterval: function (t, value) {
        //另一个时间控件
        var other = this.lookup(t.other),
        //最大时间间隔（天）
        interval = t.interval,
        //拷贝一个时间，避免影响原值
        date = Ext.clone(value),
        newDate;
        //如果是开始时间则需要设置结束时间的最大时间
        newDate = new Date(date.setDate(date.getDate() + interval));
        //最大时间不能超过今天
        if (newDate > new Date()) {
            newDate = new Date();
        }
        //设置最小值，不能小于当前控件
        other.setMinValue(value);
        //设置最大值
        other.setMaxValue(newDate);
        ////动态变化，默认为动态时间
        //other.setValue(newDate);
        //验证一下
        other.isValid();
    },
    onSetMaxTime: function (t, value) {
        //另一个时间控件
        var other = this.lookup(t.other),
        //拷贝一个时间，避免影响原值
        date = Ext.clone(value);
        //设置最大值
        other.setMaxValue(date);
        //验证一下
        other.isValid();
    },
    onSetMinTime: function (t, value) {
        //另一个时间控件
        var other = this.lookup(t.other),
        //拷贝一个时间，避免影响原值
        date = Ext.clone(value);
        //设置最大值
        other.setMinValue(date);
        //验证一下
        other.isValid();
    },

    loadNextComboStore: function (nextCombo, nextStore, params, value, oldValue, isCount) {
        //如果旧值存在，情况下一个下拉框的值
        if (oldValue) {
            nextCombo.setValue();
        }
        //根据新值加载下一个下拉框的数据
        if (value) {
            util.storeLoad(nextStore, params);
        }
        if (isCount) {
            nextStore.on({
                load: function () {
                    if (nextStore.getCount()) {
                        isCount = false;
                    }
                    //设置下一个下拉框的只读状态
                    nextCombo.setReadOnly(isCount);
                },
                //仅监听一次
                single: true
            });
        } else {
            //设置下一个下拉框的只读状态
            nextCombo.setReadOnly(!value);
        }

    },
    //级联菜单，加载下一个下拉框
    loadNextCombo: function (nextCombo, params, value, oldValue, isCount) {
        this.loadNextComboStore(nextCombo, nextCombo.getStore(), params, value, oldValue, isCount);
    },
});