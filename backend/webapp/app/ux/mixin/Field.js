//文件上传模块
//在类中mixins: ['ux.mixin.Field'],调用
//estateRoom estateDepartment systemStyle estateOwner estateLandlord控制层公用
Ext.define('ux.mixin.Field', {
    mixinId: 'uxMixinField',
    //用于编辑图片
    editPicRec: function (rec) {
        var pics = rec.get('pics'),
        list = [],
        source = [],
        length,
        url,
        i;
        if (pics) {
            //首次编辑后，第二次进去时pics变成了string字符串
            if (Ext.isString(pics)) {
                pics = pics.split(',');
            }
            length = pics.length;
            for (i = 0; i < length; i++) {
                url = pics[i];
                list.push(url);
                source.push({
                    url: url,
                    img: config.oosPath + url + '?x-oss-process=image/format,jpg',
                    name: url
                });
            }
            rec.set({
                source: source,
                pics: list.toString()
            });
            //console.log(rec);
        }
    },
    //选择文件
    onAddField: function (t, files) {
        this.onUpField(t, files[0], 'estate');
    },
    //上传文件
    onUpField: function (plupFile, file, value) {
        var me = this,
        name = file.name,
        //获取服务端图片名称
        upName = me.setFileName(file.name),
        img,
        url;
        me.getOssKey(value, plupFile).then(function (data) {
            //console.log(data);
            console.log('文件路径：', data.host + '/' + data.dir + '/' + upName);
            //获取本地预览图片
            plupFile.previewImage(file,
            function (f, src) {
                img = src;
            })
            //获取远程地址
            url = data.dir + '/' + upName;
            //上传图片到阿里云
            plupFile.submit({
                url: data.host,
                params: {
                    'key': url,
                    'policy': data.policy,
                    'OSSAccessKeyId': data.accessid,
                    'x-oss-security-token': data.security_token,
                    'success_action_status': '200',
                    //让服务端返回200,不然，默认会返回204
                    'signature': data.signature
                },
                success: function () {
                    //本地预览
                    plupFile.addData({
                        url: url,
                        //如果本地预览图还没有获取到，使用远程地址
                        img: img ? img : data.host + '/' + url,
                        //文件名称
                        name: name
                    });
                    me.setHiddenValue(plupFile);
                },
                failure: function () {
                    plupFile.reset();
                }
            });
        });
    },
    //删除文件
    onRemoveFile: function (t) {
        this.setHiddenValue(t);
    },
    //设置隐藏域的值
    setHiddenValue: function (plupFile) {
        var store = plupFile.getStore(),
        related = plupFile.related ? plupFile.related : 'pics',
        list = [];
        store.each(function (rec) {
            list.push(rec.get('url'));
        });
        //设置文件服务端路径
        this.lookup(related).setValue(list.toString());
    },
    //设置文件名称
    setFileName: function (name) {
        var pos = name.lastIndexOf('.'),
        //随机数字典
        chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
        maxPos = chars.length,
        len = 16,
        suffix = '';
        if (pos != -1) {
            //获取后缀
            suffix = name.substring(pos);
        }
        //名称首位为代理商id
        name = config.agent_id.toString();
        //追加16位随机名称
        for (i = 0; i < len; i++) {
            name += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        //追加时间戳
        name += Date.parse(new Date());
        return name + suffix;
        //console.log(name + suffix);
    },
    //获取oos密钥
    getOssKey: function (type, plupFile) {
        var deferred = new Ext.Deferred(),
        isExpire = true,
        key = config['oos' + type];
        if (key) {
            var now = Date.parse(new Date()) / 1000;
            //如果没有过期
            if (key.expire > now + 3) {
                isExpire = false;
                deferred.resolve(key);
            }
        }
        if (isExpire) {
            Ext.Ajax.request({
                url: config.oos,
                params: {
                    type: type
                },
                success: function (response) {
                    //处理返回值，转换为json对象
                    response = Ext.decode(response.responseText);
                    if (response.success) {
                        key = config['oos' + type] = response.data;
                        deferred.resolve(key);
                    } else {
                        Ext.toast(response.message);
                        plupFile.reset();
                    }
                },
                failure: function () {
                    plupFile.reset();
                }
            });
        }
        return deferred.promise;
    }
});