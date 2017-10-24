//公用类
Ext.define('doordu.util', {
    //别名，为了方便调用，这样通过 util.方法名(参数) 就能直接使用
    //util.storeLoad(store,{a:,b:});
    alternateClassName: 'util',
    statics: {
        //主要用于列表到详细的公用加载方法
        //使用方式util.recordLoad(record, url, params, ckName).then(function(record){执行方法})
        //record数据模型
        //url详细数据请求地址
        //params参数，这是一个json对象，示例{userName:'test',passWord:'test'}
        //ckName检测字段，用于判断是否已经请求过了
        recordLoad: function (record, url, params, ckName) {
            var deferred = new Ext.Deferred();
            //如果record存在，并且ckName这个字段中有值
            //所以已经请求过了，直接设置值即可
            if (record && record.get(ckName)) {
                deferred.resolve(record);
            } else {
                util.ajax(url, params, true).then(function (result) {
                    //dirty:false 执行record.reject()不会重置已改动的数据
                    record.set(result.data, {
                        dirty: false
                    });
                    deferred.resolve(record);
                });
            }
            return deferred.promise;
        },
        //model.erase方式
        //使用方式util.erase(model).then(function(record, b){执行方法})
        //model model
        //只有执行成功才执行then
        erase: function (model) {
            var deferred = new Ext.Deferred();
            model.erase({
                success: function (record, b) {
                    deferred.resolve(record, b);
                    Ext.toast(b.getResultSet().message);
                },
                //表单提交失败
                failure: function (response, b) {
                    try {
                        Ext.toast(b.getResultSet().message);
                    } catch (e) { }
                }
            });
            return deferred.promise;
        },
        //model.save方式
        //使用方式util.save(model).then(function(record, b){执行方法})
        //model model
        //只有执行成功才执行then
        save: function (model) {
            var deferred = new Ext.Deferred(),
            phantom = model.phantom;
            //console.log(phantom, model.dirty);
            //修改状态并且未做修改
            if (!phantom && !model.dirty) {
                Ext.toast('保存成功！');
                //直接返回数据
                deferred.resolve({
                    rec: model,
                    phantom: phantom
                });
            } else {
                model.save({
                    success: function (record, b) {
                        Ext.toast(b.getResultSet().message);
                        deferred.resolve({
                            rec: record,
                            phantom: phantom
                        });
                    },
                    //表单提交失败
                    failure: function (response, b) {
                        //如果是修改
                        if (!phantom) {
                            //取消模型的更改
                            model.reject();
                        }
                        try {
                            Ext.toast(b.getResultSet().message);
                        } catch (e) { }
                    }
                });
            }
            return deferred.promise;
        },
        //ajax请求，post提交方式
        //使用方式util.ajaxP(url, params,isNoMes).then(function(response){执行方法})
        //url请求地址
        //params参数
        //isNoMes是否不显示消息提示
        //response返回的数据，已转换为json
        //只有执行成功才执行then
        ajaxP: function (url, params, isNoMes) {
            return this.ajax(url, params, isNoMes, 'POST');
        },
        //ajax请求，get提交方式
        //使用方式util.ajax(url, params,isNoMes).then(function(response){执行方法})
        //url请求地址
        //params参数
        //isNoMes是否不显示消息提示
        //response返回的数据，已转换为json
        //只有执行成功才执行then
        ajax: function (url, params, isNoMes, method) {
            var deferred = new Ext.Deferred();
            Ext.Ajax.request({
                url: url,
                method: method || 'GET',
                params: params,
                success: function (response) {
                    //处理返回值，转换为json对象
                    response = Ext.decode(response.responseText);
                    if (response.success) {
                        deferred.resolve(response);
                    }
                    if (!response.success || !isNoMes) {
                        Ext.toast(response.message);
                    }
                }
            });
            return deferred.promise;
        },
        //可以返回错误信息的ajax
        ajaxB: function (url, params, method) {
            var deferred = new Ext.Deferred();
            Ext.Ajax.request({
                url: url,
                method: method || 'GET',
                params: params,
                success: function (response) {
                    //处理返回值，转换为json对象
                    response = Ext.decode(response.responseText);
                    deferred.resolve(response);
                },
                failure: function () {
                    deferred.resolve({
                        success: false,
                        message: '请求失败，服务端无法连接或出错！'
                    });
                }
            });
            return deferred.promise;
        },
        //使用方式util.submit(form, url,isNoMes).then(function(response){执行方法})
        //form表单
        //url请求地址
        //isNoMes是否不显示消息提示
        //response返回的数据，已转换为json
        //只有执行成功才执行then
        submit: function (form, url, isNoMes) {
            var deferred = new Ext.Deferred();
            form.submit({
                url: url,
                submitEmptyText: false,
                success: function (a, action) {
                    var res = action.result;
                    if (res.success) {
                        deferred.resolve(res);
                    }
                    Ext.toast(res.message);
                },
                failure: function (a, action) {
                    try {
                        Ext.toast(action.result.message);
                    } catch (e) { }
                }
            });
            return deferred.promise;
        },
        //使用方式util.plupSubmit(form, url,isNoMes).then(function(response){执行方法})
        //plup上传控件
        //url请求地址
        //params参数
        //response返回的数据，已转换为json
        //只有执行成功才执行then
        plupSubmit: function (plup, url, params) {
            var deferred = new Ext.Deferred();
            plup.submit({
                url: url,
                params: params,
                submitEmptyText: false,
                success: function (response) {
                    deferred.resolve(response);
                    Ext.toast(response.message);
                },
                failure: function (response) {
                    try {
                        Ext.toast(response.message);
                    } catch (e) { }
                }
            });
            return deferred.promise;
        },
        //combo请求store数据的方法
        //用于级联菜单
        //combo combo对象
        //params参数，这是一个json对象，示例{userName:'test',passWord:'test'}
        //value value为空则不请求数据，并且清空所有数据
        comboLoad: function (combo, params, value) {
            //清除数据
            combo.setValue();
            var store = combo.getStore();
            //条件不存在，清除所有数据
            if (!value) {
                //重设参数，避免在级联菜单中出现参数相同却没有数据的情况
                store.getProxy().setExtraParams();
                store.removeAll();
                return;
            }
            this.storeLoad(store, params, true);
        },
        //视图请求store数据的方法
        //view视图对象
        //params参数，这是一个json对象，示例{userName:'test',passWord:'test'}
        //update是否强制重新请求数据
        listLoad: function (view, params, update) {
            var store = view.getStore(),
            storeId = store.storeId;
            if (storeId == 'ext-empty-store') {
                //在ext中，如果使用bind方式绑定store，在加载数据时可能出现store还未绑定到视图中就请求数据的情况
                //这种情况我们就获取到ViewModel，根据ViewModel来加载数据
                //console.log('列表还未绑定store，从ViewModel中加载');
                store = view.getViewModel().getStore(view.getBind().store.stub.name);
            }
            this.storeLoad(store, params, update);
        },
        //store请求数据的方法
        //store数据仓库对象
        //params参数，这是一个json对象，示例{userName:'test',passWord:'test'}
        //update是否强制重新请求数据
        storeLoad: function (store, params, update) {
            //console.log('store正在加载:', store.isLoading(), '参数：', params);
            //如果已经在请求数据，中断
            if (store.isLoading()) {
                return;
            } else if (update) {
                //如果强制刷新，重新设置参数，并且清空数据
                store.getProxy().setExtraParams(params);
                store.removeAll();
            }
                //如果有参数
            else if (params) {
                //获取旧的参数
                var oldParams = store.getProxy().getExtraParams();
                //如果没有数据直接重新请求
                //比较新旧两个参数是否相同，如果不同，重新设置参数，并且清空数据
                //如果相同中断执行
                if (store.getCount() < 1) {
                    store.getProxy().setExtraParams(params);
                } else if (!this.equals(oldParams, params)) {
                    store.getProxy().setExtraParams(params);
                    store.removeAll();
                } else {
                    return;
                }
            } else if (store.getCount() > 0) {
                //console.log('已有数据，中断执行');
                //如果没有参数，但是数据已经存在，中断执行
                return;
            }
            //请求数据
            store.loadPage(1);
        },
        //比较两个对象是否相等
        equals: function (x, y) {
            var me = this;
            //直接相等
            if (x === y) {
                return true;
            }
            //如果x或者y任意一个不是object类型
            if (!(x instanceof Object) || !(y instanceof Object)) {
                return false;
            }
            //如果constructor不相等
            if (x.constructor !== y.constructor) {
                return false;
            }
            //遍历比较
            for (var p in x) {
                //如果p是x的属性
                if (x.hasOwnProperty(p)) {
                    //如果y中没有p这个属性
                    if (!y.hasOwnProperty(p)) {
                        return false;
                    }
                    //原代码x[p] === y[p]
                    //这里不进行强制比较
                    if (x[p] == y[p]) {
                        continue;
                    }
                    if (typeof (x[p]) !== "object") {
                        return false;
                    }
                    if ((!x[p] && y[p]) || (x[p] && !y[p])) {
                        return false;
                    }
                    //自调用进行比较
                    if (!me.equals(x[p], y[p])) {
                        return false;
                    }
                }
            }
            for (p in y) {
                if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
                    return false;
                }
            }
            return true;
        },
        //验证模型
        //form,表单视图控件
        //modelName,一个新的模型对象类名例如ads.model.User
        valid: function (form, model) {
            //更新模型数据，讲表单中的数据赋给模型
            form.updateRecord(model);
            var errors = model.validate(),
            //验证结果
            valid = errors.isValid(),
            message;
            if (!valid) {
                //遍历错误信息，弹出提示框
                errors.each(function (err) {
                    //提示信息，注意这里依赖于Ext.Toast，需引入
                    //2秒后自动隐藏此信息，默认为1秒后隐藏
                    Ext.toast(err.getMessage());
                    return false;
                });
                return valid;
            }
            return model;
        },
        //验证表单
        //应对过长的表单，用户看不到错误提示
        validForm: function (form) {
            var valid = true,
            message, errors, file, fieldLabel;
            file = form.form.getFields().findBy(function (field) {
                return !field.validate();
            });
            if (file) {
                errors = file.getErrors();
                if (errors && errors.length > 0) {
                    message = errors[0];
                }
                if (message == '此项为必填项') {
                    fieldLabel = file.fieldLabel;
                    if (fieldLabel) {
                        message = fieldLabel.replace(/&..sp;/g, '').replace('<font color=red>*</font>', '') + message;
                    }
                }
                Ext.toast(message);
                return false;
            }
            return true;
        },
        //获取视图中所有输入对象
        getFields: function (view, byName) {
            var fields = {},
            itemName;

            var getFieldsFrom = function (item) {
                if (item.is('field')) {
                    itemName = item.getName();

                    if ((byName && itemName == byName) || typeof byName == 'undefined') {
                        if (fields.hasOwnProperty(itemName)) {
                            if (!Ext.isArray(fields[itemName])) {
                                fields[itemName] = [fields[itemName]];
                            }

                            fields[itemName].push(item);
                        } else {
                            fields[itemName] = item;
                        }
                    }

                }

                if (item.isContainer) {
                    item.items.each(getFieldsFrom);
                }
            };

            view.items.each(getFieldsFrom);

            return (byName) ? (fields[byName] || []) : fields;
        },
        //获取视图中所有值
        //view视图对象
        getValues: function (view, enabled, all) {
            //获取到视图中所有的输入对象
            var fields = this.getFields(view),
            values = {},
            isArray = Ext.isArray,
            //是否通过验证
            isValid = true,
            field,
            val,
            valid,
            addValue,
            bucket,
            name,
            data,
            ln,
            i;
            //取值方法
            addValue = function (field) {
                //获取提交data
                data = field.getSubmitData();
                //如果是obj数据
                if (Ext.isObject(data)) {
                    //循环遍历
                    for (name in data) {
                        //判断data中是否有name这个属性
                        if (data.hasOwnProperty(name)) {
                            //取的值
                            val = data[name];
                            if (!val || val === '') {
                                return;
                            }
                            //如果是按钮
                            if (!field.isRadio) {
                                //如果values中已经有这个值了
                                if (values.hasOwnProperty(name)) {
                                    //临时存储这个值
                                    bucket = values[name];
                                    //如果不是数组
                                    if (!isArray(bucket)) {
                                        bucket = values[name] = [bucket];
                                    }
                                    //如果是数组
                                    if (isArray(val)) {
                                        //合并值
                                        values[name] = bucket.concat(val);
                                    } else {
                                        //添加值
                                        bucket.push(val);
                                    }
                                } else {
                                    //没有则直接赋值
                                    values[name] = val;
                                }
                            } else {
                                values[name] = values[name] || val;
                            }
                        }
                    }
                }
            };
            //验证并取值
            valid = function (field) {
                if (!field.isValid()) {
                    isValid = false;
                } else {
                    addValue(field);
                }
            };

            // 遍历fields赋值
            for (name in fields) {
                if (fields.hasOwnProperty(name)) {
                    field = fields[name];
                    if (isArray(field)) {
                        ln = field.length;
                        for (i = 0; i < ln; i++) {
                            valid(field[i]);
                        }
                    } else {
                        valid(field);
                    }
                }
            }
            //通过验证
            if (isValid) {
                return values;
            }
            return false;
        },
        //重置所有值
        //isAll 是否重置所有内容
        reset: function (view, isAll) {
            if (!view) {
                return;
            }
            var fields = this.getFields(view),
            isArray = Ext.isArray,
            field,
            ln,
            i,
            name;
            //循环遍历，重置值
            for (name in fields) {
                if (fields.hasOwnProperty(name)) {
                    field = fields[name];

                    if (isArray(field)) {
                        ln = field.length;
                        for (i = 0; i < ln; i++) {
                            //隐藏域、多选框不重置
                            if (!field[i].isXType('hiddenfield') || isAll) {
                                field[i].reset();
                            }
                        }
                    } else {
                        //隐藏域、多选框不重置
                        if (!field.isXType('hiddenfield') || isAll) {
                            field.reset();
                        }
                    }
                }
            }

        },
        //格式化时间
        dateFormat: function (value) {
            if (value) {
                return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
            }
            return null;
        },
        //汉化日期
        overrideDate: function () {
            Ext.Date.monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
            Ext.Date.dayNames = ["日", "一", "二", "三", "四", "五", "六"]
        },
        /**
        ** 乘法函数，用来得到精确的乘法结果
        ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
        ** 调用：accMul(arg1,arg2)
        ** 返回值：arg1乘以 arg2的精确结果
        **/
        accMul: function (arg1, arg2) {
            var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length;
            } catch (e) { }
            try {
                m += s2.split(".")[1].length;
            } catch (e) { }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        },
        //plupload插件自定义过滤
        plupFilter: function () {
            //检查图片尺寸，只有指定尺寸才能通过验证
            //size_limits:{width:100,height:100}
            plupload.addFileFilter('size_limits',
            function (value, file, cb) {
                var self = this,
                img = new o.Image(),
                width = value.width,
                height = value.height;
                //返回结果
                function finalize(result) {
                    // 销毁资源
                    img.destroy();
                    img = null;
                    // 如果没有通过验证则返回错误信息
                    if (!result) {
                        self.trigger('Error', {
                            code: 703,
                            message: plupload.translate('File limits error.'),
                            file: file
                        });

                    }
                    cb(result);
                }
                if (file.type === 'image/gif') {
                    //gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                    img = new mOxie.FileReader();
                    img.onload = function () {
                        //创建图片对象
                        var imgFile = new Image();
                        // 改变图片的src
                        imgFile.src = img.result;
                        // 加载完成执行
                        imgFile.onload = function () {
                            // 检查图片尺寸
                            finalize(imgFile.width == width && imgFile.height == height);
                        };
                    }
                    //加载图片
                    img.readAsDataURL(file.getSource());
                } else {
                    img.onload = function () {
                        // 检查图片尺寸
                        finalize(img.width == width && img.height == height);
                    };
                    img.onerror = function () {
                        finalize(false);
                    };
                    //加载图片
                    img.load(file.getSource());
                }
            });
        },
        //获取到昨天最后一刻
        getYesterday: function () {
            return Ext.Date.format(new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), 'Y-m-d 23:59:59');
        },
        //因为调用浏览器硬件的方法不支持回调，所以只能写在这里了
        //拍照结束回调
        cameraFileUpCallback: function (success, fileList) {
            if (success) {
                var length = fileList.length, data, item, url;
                if (length > 0) {
                    data = [];
                    for (i = 0; i < length; i++) {
                        item = fileList[i];
                        if (item.success) {
                            item = Ext.decode(item.response);
                            url = item.data.imgUrl;
                            data.push({
                                url: url,
                                img: config.oosPath + url + '?x-oss-process=image/format,jpg',
                                name: url
                            });
                        }
                    }
                    config.tmpFileList.addData(data);
                }
            } else {
                Ext.toast('上传失败');
            }
        },
        //在store加载数据后为其增加一个选项
        //data单个数据
        //isCount 有数据时才添加
        storeAddOne: function (store, data, isCount) {
            if (!isCount) {
                //先设置一个默认值，避免无数据
                store.setData([data]);
            }
            store.on({
                load: function () {
                    if (isCount) {
                        if (store.getCount() > 0) {
                            store.insert(0, data);
                        }
                    } else {
                        store.insert(0, data);
                    }
                }
            });
        },
        init: function () {
            this.overrideDate();
            //this.plupFilter();
        },
        //禁用动画效果
        stopAnimate: function () {
            //console.log('stopAnimate');
            //重写类 AbstractChart
            Ext.define("override.chart.AbstractChart", {
                override: "Ext.chart.AbstractChart",
                //禁用动画
                config: {
                    animation: false
                }
            });
            //重写类 消息提示
            //禁用动画效果
            Ext.define("override.window.Toast", {
                override: "Ext.window.Toast",
                //禁用动画效果，防止在自定义浏览器中崩溃
                animate: false
            });
            //重写类 消息提示
            //禁用动画效果
            Ext.define("override.ux.window.Toast", {
                override: "ux.window.Toast",
                //禁用动画效果，防止在自定义浏览器中崩溃
                animate: false
            });

            //重写类 日期控件
            //汉化
            Ext.define("override.picker.Date", {
                override: "Ext.picker.Date",
                showMonthPicker: function (animate) {
                    var me = this,
                    el = me.el,
                    picker;
                    if (me.rendered && !me.disabled) {
                        picker = me.createMonthPicker();
                        if (!picker.isVisible()) {
                            picker.setValue(me.getActive());
                            picker.setSize(el.getSize());

                            //// Null out floatParent so that the [-1, -1] position is not made relative to this
                            picker.floatParent = null;
                            picker.setPosition(-el.getBorderWidth('l'), -el.getBorderWidth('t'));
                            //重写代码，去掉动画效果，避免导致自定义浏览器崩溃
                            picker.show();
                        }
                    }
                    return me;
                },
                hideMonthPicker: function (animate) {
                    var me = this,
                    picker = me.monthPicker;

                    if (picker && picker.isVisible()) {
                        //重写代码，去掉动画效果，避免导致自定义浏览器崩溃
                        picker.hide();
                    }
                    return me;
                }
            });
        }
    }
});