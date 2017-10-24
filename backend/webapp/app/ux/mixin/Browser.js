//浏览器模块
//在类中mixins: ['ux.mixin.Browser'],调用
//estateOwner deviceCard 这两个控制层公用
//读卡等操作
Ext.define('ux.mixin.Browser', {
    mixinId: 'uxMixinBrowser',
    //读卡
    //通过this.readCard.then(function(){})调用
    //isChina 为true时表示读取国密卡
    //只有执行成功才执行then
    readCard: function (isChina) {
        var deferred = new Ext.Deferred(),
        //连接读卡器
        card_obj_status,
        //读卡成功返回对象
        card_obj;
        if (isChina) {
            //国密卡读卡对象
            card_obj_status = doordu.cpu_card.beep();
        } else {
            //ic卡读卡对象
            card_obj_status = doordu.ic_card.beep();
        }
        //连接成功
        if (card_obj_status.status) {
            if (isChina) {
                //国密卡读卡
                card_obj = doordu.cpu_card.card_no();
            } else {
                //ic卡读卡
                card_obj = doordu.ic_card.read();
            }
            //读卡成功
            if (card_obj.status) {
                deferred.resolve(card_obj);
            } else {
                Ext.toast('读卡失败，读卡器不存在或卡未放置！');
            }
        } else {
            Ext.toast(card_obj_status.message);
        }
        return deferred.promise;
    },
    //点击读卡按钮读卡并将卡信息填充到表单中
    //isChina 为true时表示读取国密卡
    onReadCrad: function (isChina) {
        var me = this,
        card_no,
        hex_card_no;
        var formpanel = me.lookup('tabform2') || me.getView().down('form');
        var form = formpanel.getForm();
        me.readCard(isChina).then(function (data) {
            //读到的10进制卡号
            card_no = data.dec_card_no;
            //读到的16进制卡号
            hex_card_no = data.hex_card_no;
            //通过接口检查该卡是否可用
            util.ajaxP(config.estate.owner.checkCard, {
                card_no: card_no,
                card_hex_no: hex_card_no,
                dep_id: me.dep_id
            }).then(function () {
                me.lookup('cardTipLabel') && me.lookup('cardTipLabel').hide();
                me.lookup('cardInfoCon') && me.lookup('cardInfoCon').show();
                me.lookup('cardNumber') && me.lookup('cardNumber').show();
                form.setValues({
                    //deviceCard 用到的
                    new_card_no: card_no,
                    //estateOwner 用到的
                    card_dec_no: card_no,
                    //显示
                    card_dec_no_display: card_no,
                    card_hex_no: hex_card_no
                });
            });
        });
    },
    //点击按钮ic卡读卡
    onReadICCrad: function () {
        this.onReadCrad();
    }
});