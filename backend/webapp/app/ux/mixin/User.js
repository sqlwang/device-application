//用户模块
//在类中mixins: ['ux.mixin.User'],调用
//estateOwner avatarCapture alarmUser控制层公用
Ext.define('ux.mixin.User', {
    mixinId: 'uxMixinUser',
    //APP授权开门改变 无需优化
    onUserAppChange: function (t, value) {
        var isApp = !(value.user_app == '2'), item;
        if (!isApp) {
            //取消app授权时，授权时间不限制，避免验证错误
            this.lookup('isLimit').setValue(true);
            item = this.lookup('isMoreRoom');
            if (item) {
                item.setValue(false);
            }
        }
    },
    onUserAppChange1: function (t, value) {
        var isApp = value == '1', item;
        var mobile1 = this.lookup('tabform1').down('[name=user_mobile]').getValue();
        if (!isApp) {
            //取消app授权时，授权时间不限制，避免验证错误
            this.lookup('isLimit').setValue(true);
            this.lookup('appMobileCon').hide();
            item = this.lookup('isMoreRoom');
            if (item) {
                item.setValue(false);
            }
        } else {
            if (mobile1) {
                this.lookup('appMobileCon').hide();
            } else {
                this.lookup('appMobileCon').show();
            }
        }
    },

    //是否登记计划生育
    onFertilityChange: function (t, value) {
        var isHidden = !(value.jhsy == '1');
        if (isHidden) {
            //取消app登记计划生育，是否夫妻同行为否，避免验证错误
            this.lookup('isPeer').setValue(true);
        }
    },

    //重置拍照控件
    resetCameraFile: function () {
        this.resetFile('infoPlupFileList');
    },
    //重置指定控件
    resetFile: function (ref) {
        var item = this.lookup(ref);
        if (item) {
            item.reset();
        }
    },

    //重置身份证上传控件
    resetPlupFile: function () {
        this.resetFile('plupFileList');
    },
    //身份证录入方式发生改变时
    onCardChange: function (t, value) {
        //将默认值重置为当前值，避免信息录入方式被重置
        t.defaultValue = value;
        //重置证件数据
        this.resetCVR();
        //重置上传控件
        this.resetPlupFile();
    },
    //身份证录入方式发生改变时
    onCardChange1: function (t, value) {
        //将默认值重置为当前值，避免信息录入方式被重置
        t.defaultValue = value;
        t.up('ownerInfoCardNew').down('#crv_natione').setAllowBlank(value == 1);
        t.up('ownerInfoCardNew').down('#crv_address').setAllowBlank(value == 1);
        t.up('ownerInfoCardNew').down('#IDCardInfoCon2').setVisible(value == 2);
        if (value == 2)
            t.up('ownerInfoCardNew').down('#IDCardInfoCon').setVisible(false);
        //重置证件数据
        this.resetCVR();
        //重置上传控件
        this.resetPlupFile();
        this.resetCameraFile();
    },
    //通过浏览器接口，读身份证信息 复杂业务
    onReadCVR: function () {
        var me = this;
        //清空已读信息
        me.resetCVR();

        var crv100_reader = doordu.idr210_reader.read(); //测试身份证读卡器对象
        if (crv100_reader.status) {
            //console.log(crv100_reader.expire_end_date);
            var birthdayObj = crv100_reader.birthday,
            //出生日期
            birthday = birthdayObj.substring(0, 4) + '-' + birthdayObj.substring(4, 6) + '-' + birthdayObj.substring(6, 8),
            startObj = crv100_reader.expire_start_date,
            endObj = Ext.String.trim(crv100_reader.expire_end_date.replace(/' '/g, '')),
            //有效期
            expire_start = startObj.substring(0, 4) + '-' + startObj.substring(4, 6) + '-' + startObj.substring(6, 8),
            expire_end = endObj.substring(0, 4) + '-' + endObj.substring(4, 6) + '-' + endObj.substring(6, 8),
            //身份证图片
            photoFilePath = crv100_reader.image_path,
            // form = me.getView();
                form = me.lookup('tabform1') || me.getView();

            if (endObj == '长期') {
                expire_end = endObj;
            }
            //console.log(endObj == '长期', endObj,crv100_reader.expire_end_date);
            if (!form.isXType('form')) {
                form = form.down('form');
            }

            //如果身份证id存在才进行下一步
            if (crv100_reader.card_id) {
                form.down('#IDCardInfoCon') && form.down('#IDCardInfoCon').show();
                form.down('#IDCardTipCon') && form.down('#IDCardTipCon').hide();
                form.down('#crv_natione') && form.down('#crv_natione').setAllowBlank(true);
                form.down('#crv_address') && form.down('#crv_address').setAllowBlank(true);
                form.getForm().setValues({
                    //姓名
                    crv_name: crv100_reader.name,
                    //身份证cardId
                    crv_id: crv100_reader.card_id,
                    //性别
                    crv_sex: crv100_reader.sex,
                    //民族
                    crv_natione: crv100_reader.natione + '族',
                    //出生日期
                    crv_birthday: birthday,
                    //籍贯
                    crv_address: crv100_reader.address,
                    //身份证号码
                    crv_id_code: crv100_reader.id_code,
                    //发证机关
                    crv_government: crv100_reader.department,
                    crv_expire: expire_start + '至' + expire_end
                });
                var con2 = form.down('#IDCardInfoCon2');
                if (con2) {
                    con2.down('[name=crv_name]').setValue(crv100_reader.name);
                    con2.down('[name=crv_sex]').setValue(crv100_reader.sex);
                    con2.down('[name=crv_natione]').setValue(crv100_reader.natione + '族');
                    con2.down('[name=crv_birthday]').setValue(birthday);
                    con2.down('[name=crv_address]').setValue(crv100_reader.address);
                    con2.down('[name=crv_id_code]').setValue(crv100_reader.id_code);
                    con2.down('[name=crv_government]').setValue(crv100_reader.department);
                    con2.down('[name=crv_expire]').setValue(expire_start + '至' + expire_end);
                }
                //发身份证卡时检查是否是06年或者07年发的卡
                //这个时间段的卡门禁机可能无法识别
                //如果是进行提示
                if (expire_start.indexOf('2006') > -1 || expire_start.indexOf('2007') > -1) {
                    //待修改
                    Ext.Msg.alert('提示', '如果使用该身份证授权身份证卡可能会导致开门失败！');
                }

                //通过浏览器上传图片
                var obj_pic = doordu.idr210_reader.upload_photo(photoFilePath, config.photoPic, '', "flash_pic[]");
                if (!obj_pic.status) {
                    Ext.toast('身份证图片获取失败，请重新读取！');
                } else {
                    var message = Ext.decode(obj_pic.message);
                    if (message.success) {
                        form.down('[name=crv_image]').setSrc(config.photoPicSel + message.data.imgUrl + '?x-oss-process=image/format,jpg');
                        form.down('[name=crv_image_txt]').setValue(message.data.imgUrl);
                    }
                }
                me.getUserInfo(me.lookup('crv_id_code').getValue(), me.lookup('depID').getValue());
                //判断是否已登记
                // var roomId = form.down('[name=RoomId]').getValue();
                // var identify_num = form.down('[name=crv_id_code]').getValue();
                // if (roomId && identify_num) {
                //     Ext.Ajax.request({
                //         url: config.estate.checkin,
                //         method: 'post',
                //         params: {
                //             roomid: roomId,
                //             identify_num: identify_num
                //         },
                //         success: function (response) {
                //             var text = Ext.decode(response.responseText);
                //             if (text.success) {
                //                 me.lookup('checkinTip').hide();
                //                 me.lookup('nextBtn').enable();
                //             } else {
                //                 me.lookup('checkinTip').show();
                //                 me.lookup('nextBtn').disable();
                //             }
                //         }
                //     });
                // }
            }
        } else {
            Ext.toast(crv100_reader.message);
        }
    },
    //清空身份证信息
    resetCVR: function () {
        this.lookup('crv_image').setSrc('resources/images/identifyimg.png');
        util.reset(this.lookup('ownerInfoCardNew'), true);
    },
    //根据身份证号码自动填充身份信息
    onCodeChange: function (t) {
        //非自读状态，已经必须是身份证类型才自动填充
        if (!t.readOnly && t.vtype == 'isIdCard' && t.isValid()) {
            var me = this;
            if (!me.checkCardCode) {
                //延迟执行
                me.checkCardCode = Ext.create('Ext.util.DelayedTask',
                function () {
                    //因为是延迟执行所以不能从事件中直接取值
                    me.getUserInfo(me.lookup('crv_id_code').getValue(), me.lookup('depID').getValue(),true);
                });
            }
            me.checkCardCode.delay(100);
        }
    },
    //根据证件号码获取用户详细信息
    getUserInfo: function (card_no, dep_id,isInfo) {
        var me = this,
            imgs = [],
        data,
        form, url, list, file, plupFileList;
        util.ajaxP(config.estate.card, {
            card_no: card_no,
            dep_id: dep_id
        },
        true).then(function (response) {
            // form = me.getView();
            if (isInfo) {
                form = me.lookup('tabform1')||me.getView();
                if (!form.isXType('form')) {
                    form = form.down('form');
                }
                if (response.data.crv_address) {
                    form.down('textfield[name=crv_address]').setValue(response.data.crv_address);
                }
                if (response.data.crv_birthday) {
                    form.down('textfield[name=crv_birthday]').setValue(response.data.crv_birthday);
                }
                if (response.data.crv_government) {
                    form.down('textfield[name=crv_government]').setValue(response.data.crv_government);
                }
                if (response.data.crv_name) {
                    form.down('textfield[name=crv_name]').setValue(response.data.crv_name);
                }
                if (response.data.crv_natione) {
                    form.down('textfield[name=crv_natione]').setValue(response.data.crv_natione);
                }
                if (response.data.crv_sex) {
                    form.down('textfield[name=crv_sex]').setValue(response.data.crv_sex);
                }
                url = response.data.crv_image_txt;
                if (url) {
                    form.down('[name=crv_image_txt]').setValue(url);
                }
                plupFileList = me.lookup('plupFileList');
                plupFileList.reset();
                if (url) {
                    plupFileList.setData([{
                        url: url,
                        img: config.oosPath + url + '?x-oss-process=image/format,jpg',
                        name: url
                    }]);
                }
            }
            list = response.data.images_object;
            for (var i = 0; i < list.length; i++) {
                url = list[i];
                imgs.push({
                    url: url,
                    img: config.oosPath + url + '?x-oss-process=image/format,jpg',
                    name: url
                });
            }
            file = me.lookup('infoPlupFileList');
            if (file) {
                file.reset();
                file.setData(imgs);
            }
        });
    },
    //获取用户详细信息
    getUserData: function (rec) {
        var data = rec.getData(),
        //app授权状态
        app = data.app,
        //是否授权app，默认否
        user_app = 2,
        //是否限制app授权时间，默认否
        limit = '0',
        //基础数据
        baseinfo = data.baseinfo,
        //证件信息
        identify = data.identify,
        //扩展信息
        ext_info = data.ext_info,
        //是否登记计划生育信息，默认否
        jhsy = '0',
        //是否夫妻同行，默认否
        sy_tz = '2';

        //默认配置
        Ext.apply(data, {
            //app授权默认开始时间
            //设置默认数据，避免冲突
            begin_time: new Date(),
            //授权设置最小时间
            minTime: new Date(),
            //如果手机号不存在，默认国家码为中国
            nation_code: '86',
            //默认证件图片
            card_ico: 'resources/images/identifyimg.png',
            //是否中国人 默认是
            is_china: true
        });

        //手机号码
        if (baseinfo.nation_code) {
            //归属地
            data.nation_code = baseinfo.nation_code;
            //手机号码
            data.mobile_no = baseinfo.mobile_no;
        }

        //授权模块
        if (app) {
            //有数据表示app授权开门
            //开启app授权
            user_app = 1;
            if (app.time_valid) {
                //授权时间有限制
                limit = '1';
                //设置授权时间
                Ext.apply(data, {
                    minTime: app.begin_time,
                    begin_time: app.begin_time,
                    end_time: app.end_time
                });
            }
        }

        //证件模块
        if (identify) {
            //处理证件图片
            if (identify.card_ico) {
                data.card_ico = identify.card_ico + '?x-oss-process=image/format,jpg';
            }
            //证件有效期限
            var expire = identify.validity;
            if (expire) {
                identify.expire = expire
            }
            //预警类型
            data.identity_type_id = {
                identity_type_id: identify.identity_type_id
            };
        }

        //扩展信息
        if (ext_info) {
            //是否中国人
            if (!ext_info.is_china) {
                data.is_china = false;
            }
            //是否登记计划生育信息
            if (ext_info.jhsy) {
                jhsy = 1;

                //只有登记了用户信息才为是否夫妻同学赋值
                //是否夫妻同行
                if (ext_info.sy_tz) {
                    sy_tz = ext_info.sy_tz;
                }
            }

            //处理头像图片
            var pics = ext_info.image_object,
            source, length;
            if (pics) {
                source = [];
                data.image_object = pics.toString();

                length = pics.length;
                for (i = 0; i < length; i++) {
                    url = pics[i];
                    source.push({
                        url: url,
                        img: config.oosPath + url,
                        name: url
                    });
                }
                data.imageSource = source;
            }
        }

        Ext.apply(data, {
            //是否为公司类型
            isCompany: data.dep_type == 2,
            //是否授权app
            user_app: {
                user_app: user_app
            },
            //是否限制app授权时间
            limit: {
                limit: limit
            },
            //客户类型
            user_type: { user_type: baseinfo.owner_type },
            //计划生育信息
            jhsy: {
                jhsy: jhsy
            },
            //是否夫妻同行
            sy_tz: {
                sy_tz: sy_tz
            }
        });

        return data;
    }
});