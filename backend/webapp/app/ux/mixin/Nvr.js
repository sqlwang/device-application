//文件上传模块
//在类中mixins: ['ux.mixin.Nvr'],调用
//nvrVideo 控制层公用
Ext.define('ux.mixin.Nvr', {
    mixinId: 'uxMixinNvr',
    //获取nvr密钥
    getNvrKey: function(type, plupFile) {
        var deferred = new Ext.Deferred(),
        isExpire = true,
        key = config.nvrKey;
        if (key) {
            var now = Date.parse(new Date()) / 1000;
            //如果没有过期
            if (key.expireTime > now + 3) {
                isExpire = false;
                deferred.resolve(key);
            }
        }
        if (isExpire) {
            util.ajax(config.nvr.token, null, true).then(function(result) {
                key = config.nvrKey = result.data;
                deferred.resolve(key);
            });
        }
        return deferred.promise;
    }
});