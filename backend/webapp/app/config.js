//公用类

Ext.define('webApp.config', {
    alternateClassName: 'config',
    statics: {
        session_id: null,
        userId: null,
        agent_id: null,
        //定时器间隔时间
        interval: 300000,
        //是否支持摄像头
        isCamera: false,
        //选中的树模型
        roomRecord: null,
        //是否番偶代理商,显示界面不同
        isSign: false,
        nvrKey:null,
        //oos密钥
        oos: 'scr-GetYunToken',
        oosPath: 'http://doordustorage.oss-cn-shenzhen.aliyuncs.com/',
        //sdk地址
        sdk: 'eo-SDKList',
        //验证码地址
        codeImg: 'scr-Capture',
        //房产导入模版地址 自建房
        roomTemplate1: '../resourcesFile/room1.xls',
        //房产导入模版地址 非自建房
        roomTemplate2: '../resourcesFile/room2.xls',
        //上传文件地址
        fileUp: 'scr-PutYunFile',
        webSocket: function () {
            var host = window.location.hostname;
            if (host == '127.0.0.1') {
                host = '10.0.0.243';
            } else if (host.indexOf('doordu') > -1) {
                //公网统一用这个域名
                host = 'websocket.sv.doordu.com';
            }
            return 'ws://' + host + ':9600';
        },
        //身份证相片上传地址
        photoPic: 'http://config2.doordu.com/admin-flow-population/backend/web/index.php/Site/UploadPic',
        //身份证相片查询地址:
        photoPicSel: 'https://doordustorage.oss-cn-shenzhen.aliyuncs.com/',
        //指定页面相关基础数据
        //小写配置
        basisStore: {
            //小区管理
            //小区服务器,省列表,施工单位
            departmentgrid: ['deviceUUIDStore', 'areaProvincesStore', 'constructionStore'],
            entrancehome: ['educationalStore', 'partisanStore', 'reasonStore', 'nationStore', 'cardTypeStore', 'premisesStore', 'countryStore', 'livingWayStore', 'marriageStore'],
            //用户管理
            //学历,党派,入住事由,民族、证件类型,居住处所,国籍,居住方式,婚姻状况
            ownergrid: ['educationalStore', 'partisanStore', 'reasonStore', 'nationStore', 'cardTypeStore', 'premisesStore', 'countryStore', 'livingWayStore', 'marriageStore'],
            //责任区域
            //学历,党派,入住事由,民族、证件类型,居住处所,国籍,居住方式,婚姻状况
            alarmusergrid: ['educationalStore', 'partisanStore', 'reasonStore', 'nationStore', 'cardTypeStore', 'premisesStore', 'countryStore', 'livingWayStore', 'marriageStore'],
            //房号管理
            //文化程度
            roomgrid: ['educationalStore'],
            //房东列表
            //文化程度
            landlordgrid: ['educationalStore']
        },
        //字典
        dictionary: {
            //获取小区街道、社区、楼栋、巷配置
            street: 'ed-GetEstate',
            //房屋编码
            house: 'ocr-GetRoomAddressId',
            //施工单位
            construction: 'ocr-GetBuilderInfo',
            //国籍
            country: '../resourcesFile/panyu/gj.json',
            //婚姻状况
            marriage: '../resourcesFile/panyu/hyzk.json',
            //居住事由
            subject: '../resourcesFile/panyu/jzsy.json',
            //居住出所
            premises: '../resourcesFile/panyu/jzcs.json',
            //居住方式
            livingWay: '../resourcesFile/panyu/jzfs.json',
            //证件类型
            cardType: '../resourcesFile/panyu/zjlx.json',
            //暂住理由
            reason: 'ocr-GetStayResult',
            //学历
            educational: 'ocr-GetEduDegree',
            //党派
            partisan: 'ocr-GetPartyType',
            //民族
            nation: 'ocr-NationList'
        },
        nvr: {
            //注册nvr
            add: 'dn-NvrAdd',
            token: 'dn-nvrtoken',
            log: {
                list: 'dn-NvrWaysList'
            },
            //设备配置
            video: {
                info: 'dn-NvrDetail',
                del: 'dn-NvrWaysDelete',
                edit: 'dn-NvrWaysChange',
                //绑定
                bind: 'dn-NvrCreateBinding',
                list: 'dn-NvrList'
            }
        },
        //通行管理
        work: {
            //部门列表
            site: {
                dialsave: 'bs-SetDialStatus',
                //开关状态
                dialinfo: 'bs-GetDialStatus',
                add: 'bs-SectionAdd',
                edit: 'bs-SectionEdit',
                list: 'bs-SectionList',
                del: 'bs-SectionDel'
            },
            //企业考勤
            attendance: {
                list: 'bw-WorkerList',
                //导出报表
                report: 'bw-WorkerExport',
                //导出月报表
                reportMonth: 'bw-WorkerMonthExport'
            },
            //企业来访
            visitors: {
                list: 'bv-VisitorsList'
            }
        },
        //消息提示
        message: {
            list: 'ew-list',
            read: 'ew-view',
            //弹窗消息
            toast: 'ew-AlertList'
        },
        //首页
        entrance: 'ocr-YSData',
        //电子地图
        digital: {
            //小区坐标系
            map: 'lm-DepCounts',
            //小区统计信息
            depInfo: 'lm-DepinfoCounts',
            //门禁机列表
            door: 'lm-MapDevicelist'
        },
        //收费管理
        fee: {
            //小区收费设置
            parametric: {
                info: 'ed-GetCardPayRule',
                save: 'ed-SetCardPayRule'
            },
            //计算费用
            compute: 'scr-GetMoney',
            //办卡记录
            card: {
                list: 'lr-GetCardLog'
            },
            //收支统计
            count: {
                list: 'lr-GetCardPay',
                //导出url
                exportUrl: 'lr-GetCardPay?year={0}&month={1}&export=1&dep_id={2}'
            }
        },
        //预警管理
        alarm: {
            //人员迁入
            user: {
                list: 'ei-InList',
                edit: 'ei-SaveIdentityType'
            },
            //预警申报
            declare: {
                list: 'pd-Declarelist',
                info: 'pd-DeclareProcessList',
                edit: 'pd-AddDeclareProcess'
            },
            //任务委派
            task: {
                list: 'pd-Tasklist'
            }
        },
        community: {
            //人员关爱
            attention: {
                list: 'en-List',
                change: 'en-UnRemind'
            },
            //联系物业
            property: {
                list: 'ec-List',
                save: 'ec-Reply'
            },
            //便民服务
            service: {
                //服务类型
                type: 'cs-typeList',
                list: 'cs-list',
                add: 'cs-create',
                del: 'cs-delete'
            },
            //信息公告
            notice: {
                list: 'cn-List',
                add: 'cn-Create',
                info: 'cn-detail'
            }
        },
        //权限管理
        purview: {
            //分配权限
            competence: {
                //设置权限
                edit: 'pcr-AssignPrivilege',
                //权限树
                list: 'pcr-RolePermission'
            },
            //组织架构
            tissue: {
                del: 'ag-Delete',
                list: 'ag-TreeList',
                edit: 'ag-update',
                add: 'ag-Create'
            },
            //账号
            account: {
                list: 'ucr-List',
                edit: 'ucr-Update',
                add: 'ucr-Create',
                //修改密码
                pass: 'ucr-InitPassword',
                del: 'ucr-Delete'
            },
            //角色
            role: {
                //还未分配角色的用户
                user: 'ucr-GetUsers',
                list: 'pcr-RoleList',
                edit: 'pcr-RoleUpdate',
                add: 'pcr-CreateRole',
                info: 'pcr-RoleDetail',
                del: 'pcr-RoleDelete'
            }
        },
        //地区管理
        area: {
            //负责人
            principal: 'dr-GetUsers',
            //责任区域
            duty: {
                list: 'dr-list',
                add: 'dr-add',
                edit: 'dr-edit',
                del: 'dr-Delete'
            },
            //市
            city: 'acr-GetCitysWithProvinceId',
            //县、区
            district: 'acr-GetDistrictsWithCityId',
            //省
            provinces: 'acr-GetAllProvinces',
            //选中小区
            department: 'ed-GetDep',
            //选小区编码
            coding: 'ocr-GetAddressId'
        },
        estate: {
            //用户取消授权
            offApp: 'eo-OffApp',
            //楼栋单元排序
            sort: 'eb-sort',
            //根据证件号码获取信息
            card: 'ocr-GetIDCardInfo',
            //判断是否登记
            checkin: 'eo-isCheckin',
            //自助授权
            authorize: {
                home: 'ea-CardStatusCount',
                list: 'ea-GetAuthList',
                edit: 'ea-CheckAuth'
            },
            edit: {
                //编辑门禁机
                door: 'dc-ReBindDevice',
                //重新发卡
                replaceIC: 'de-ReSendCard',
                //重发卡时检查卡
                checkCard: 'de-CheckCard',
                //编辑用户时发门禁卡
                addIC: 'de-ShortcutCard',
                //发在线卡
                addId: 'de-ShortcutCard',
                //换房
                changeRoom: 'er-ReplaceRoom'
            },
            //门禁信息
            info: {
                //调房记录
                changeLog: 'lr-GetReplaceRoom',
                //开卡记录
                cardLog: 'lr-GetRoomCard',
                //开门记录
                openLog: 'lr-GetRoomVisitor',
                //app授权记录
                warrant: 'lr-GetRoomApp',
                //绑定主机
                bindHost: 'er-roomdoor'
            },
            //房东管理
            landlord: {
                //设置账号
                edit: 'el-SetAccount',
                del: 'el-DelAccount',
                list: 'el-List',
                //添加房东
                addLandlord: 'el-Create',
                //编辑房东
                editLandlord: 'el-Update',
                //删除房东
                delLandlord: 'el-Delete'
            },
            //责任区域
            agent: {
                list: 'ag-list',
                edit: 'ag-update',
                add: 'ag-CreateV3',
                del: 'ag-Delete'
            },
            //访客记录
            visitor: {
                list: 'ev-List',
                door: 'ev-DoorDeviceList',
                //门口机列表
                property: 'ev-propertyDeviceList'
            },
            //单元
            unit: {
                list: 'eu-List',
                add: 'eu-Create',
                edit: 'eu-Update',
                //修改名称
                editName: 'eu-UpdateUnitname'
            },
            //栋
            building: {
                add: 'eb-Create',
                edit: 'eb-Update',
                del: 'eb-Delete',
                info: 'el-GetBuildingDetail',
                list: 'eb-List',
                //修改名称
                editName: 'eb-UpdateBuildname'
            },
            //社区管理
            department: {
                list: 'ed-List',
                add: 'ed-Create',
                edit: 'ed-updateAll',
                del: 'ed-RemoveDep'
            },
            //用户管理
            owner: {
                exportUrl: 'rcr-ExportUser?agent_id={0}&dep_id={1}&rooms={2}',
                info: 'eo-GetUserDetail',
                addIdCard: 'eo-openIdCard',
                edit: 'eo-SaveUserDetail',
                list: 'eo-List',
                del: 'eo-DeleteBatch',
                add: 'eo-Create',
                //门禁管理卡
                addAdminCard: 'eo-addManageCard',
                getManageKey: 'eo-getManageKey',
                initManageCard: 'eo-FormatCard',
                //用户登记
                addCard: 'eo-WYAddCard',
                //检查卡号
                checkCard: 'dd-WYCheckCard',
                //检查身份证
                checkCvr: 'eo-IcIsOpen',
                //格式化卡号
                formatCard: 'eo-FormatCard'
            },
            //房号管理
            room: {
                //删除小区树节点
                delNode: 'eo-deleteNode',
                list: 'er-List',
                //开卡时选择房号
                treeList: 'er-GetRoomListFromUnitId',
                del: 'er-DeleteBatch',
                add: 'er-Create',
                info: 'er-GetInfo',
                edit: 'er-SaveInfo',
                //批量导入房号
                uploadExcel: 'er-AddRoomByExcel'
            }
        },
        device: {
            //室内机
            indoor: {
                list: 'dd-GetFamilyList',
                del: 'dd-UnBindDeviceByRoom'
            },
            //物业管理机
            property: {
                info: 'dd-DoorsByPropertyId',
                //添加物业管理机
                add: 'dd-CreateManage',
                list: 'dd-BindManageList?type=7',
                //解除绑定
                removeBind: 'dd-RemoveManageMachine',
                //分区绑定时门禁主机列表
                select: 'dd-alldoors'
            },
            //设备解绑
            del: 'dd-RemoveBindFromDeviceId',
            //设备替换
            replace: 'dd-DeviceReplace',
            //摄像头配置
            cameraSetting: 'dd-setrstp',
            //获取摄像头配置
            getCameraSetting: 'dd-getrstp',
            //门禁主机管理添加绑定
            add: 'dd-OpenDoorDevice',
            //添加绑定时监控
            checkHeart: 'dd-checkHeartBeat',
            //是否门磁
            changeIsdoor: 'dd-DoorLock',
            //改变主机监控状态
            changeStatus: 'dd-SetupStatus',
            //改变安装位置
            changeIsfoor: 'dd-SetFloor',
            //标识围墙机
            changeDeviceTypeStatus: 'dd-SetGuidType',
            //门禁主机列表
            list: 'dd-BindList',
            //小区服务器
            uuid: 'ed-GetUUIDInfo',
            //选择门禁主机
            selectGuid: 'eo-TreeList',
            //查询其他单元
            othertGuid: 'dd-GetDoorDeviceByDeptId',
            //初入门记录管理
            leaveRecord: '',
            //在线设备管理
            operation: {
                //保存摄像头配置
                saveCamera: 'dd-UpdateCamerConfig',
                //摄像头列表
                camera: 'dd-GetCameraBrandList',
                //获取设备详细信息
                info: 'dd-GetDevicInfoById',
                //wifi信息
                wifi: {
                    //开启
                    open: 'dd-CreateApPoint',
                    //添加
                    add: 'dd-AddApPoint',
                    //编辑
                    edit: 'dd-UpdateApPoint',
                    //关闭
                    del: 'dd-DelApPoint'
                },
                list: 'dd-BindList',
                //配置更新
                configUpdate: 'dd-SendPrompt',
                //重启
                reset: 'dd-SendResetCmd',
                //sip账号配置
                sendSipno: 'dd-SendSipno',
                //设备网络配置
                modeTypeUpdate: 'dd-UpdateModeType'
            },
            //门禁卡管理
            card: {
                //批量续卡列表
                batchList: 'dd-SelfCardlist',
                //批量续卡
                batchContinued: 'dc-SelfRenewCard',
                list: 'dd-BindCardList',
                //续卡
                continued: 'dd-CardRenew',
                //删卡
                deleted: 'dd-DeleteCard',
                //启用、禁用
                changeStatus: 'dd-ChangeCardStatus',
                //补卡
                make: 'dd-cardReplace',
                //获取普通卡密钥
                key: 'eo-getickey'
            },
            door: {
                list: 'dd-DoorDeviceList'
            }
        },
        //小区列表
        roomTree: 'eo-TreeList?del=1',
        //代理商列表
        //agentTree: 'ag-TreeList',
        //日志
        log: {
            //卡续期日志
            cardContinued: 'le-RenewCardList',
            //卡续期详情
            cardContinuedInfo: 'dc-SelfRenewCardLogList',
            //设备替换日志
            replace: {
                list: 'rcr-DeviceReplaceLog',
                //数据迁移详情
                migration: 'rcr-DeviceCardLog'
            },
            //卡注销日志
            cardOff: 'le-EregisterCardList',
            //黑白名单
            list: 'ev-GetSendCmdLog',
            //警报日志
            alert: {
                list: 'll-List'
            },
            system: {
                list: 'ev-GetActionLog'
            }
        },
        //用户
        user: {
            //用户权限树
            navList: 'pcr-NavList',
            //登录
            login: 'scr-Login',
            //Cookie验证
            isLogged: 'scr-IsLogged',
            //退出登录
            logout: 'scr-Logout',
            //权限
            account: 'pcr-navList',
            //修改密码
            changePwd: 'ucr-ChangePassword'
        },
        //统计
        report: {
            //热点地图
            map: 'ev-GetHjInfo',
            //人员流动
            mobility: 'ev-GetMigrationMap',
            //主页-人员流动占比图
            mobilityPie: 'ev-GetMigrationRate',
            //主页-小区业主租客占比图
            people: 'ev-GetAuthTypeRate',
            //特殊人员
            specialPie: 'ev-GetCareTypeRate',
            //国籍
            countryPie: 'ev-GetNationcodeRate',
            //首页开门趋势
            homeOpenDoor: 'ev-getVisitorReport',
            //民族
            nation: 'ev-getNationReport',
            //主页-预警
            warning: 'ev-GetDangerCount',
            //每日开门访问量
            openDoor: 'ev-GetVisitorReport',
            //总览
            pandect: 'ev-GetHomeCount',
            //开门统计-门禁访问占比图
            access: 'ev-GetOpendoorRateCount',
            //人员流动统计
            user: 'ev-GetMigrationMap',
            //动态访客记录
            dynamic: 'ev-DynamicList',
            //迁入迁出列表
            userList: 'ev-GetMigrationList',
            //人员年龄
            peopleAge: 'ev-GetPeopleInfo?type=2',
            //人员类型
            peopleType: 'ev-GetPeopleInfo?type=1',
            //人员流动导出报表
            exportExc: 'ev-DownPeopleInfo?dep_id={0}&agent_id={1}',
            //门禁使用导出报表
            openExportExc: 'rcr-DeviceDataDown?dep_id={0}&agent_id={1}&day={2}',
            //门禁授权人数统计
            card: 'rcr-CardAuthcounts',
            //人员流动统计
            door: {
                //总览
                pandect: 'rcr-DeviceBordCounts',
                //30天数据
                access: 'ev-GetOpenDoorGroup',
                //占比图
                open: 'ev-GetOpenDoorRate',
                //门禁开门时段统计
                openTime: 'rcr-OpendoorTimeseg'
            }
        },
        //系统设置
        system: {
            //样式设置
            style: 'ag-SetPlatformStyle',
            //参数设置
            parametric: {
                info: 'ed-GetParam',
                save: 'ed-setParam'
            },
            //通知消息
            maintenance: 'ed-maintenance'
        }
    }
});