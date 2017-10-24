//扩展
//百度图表热点图扩展
//需要在app.json中引入对应的js，css
Ext.define('ux.echart.Map', {
    alternateClassName: 'echartMap',
    extend: 'Ext.Container',
    requires: 'Ext.Ajax',
    xtype: 'echartMap',
    config: {
        //默认铺满容器
        width: '100%',
        height: '100%',
        //私有变量，地图对象
        map: null,
        cityName: null
    },
    option: null,
    //地图资源文件地址{0}是动态设置的
    mapUrl: 'resources/data/echart/{0}.json',
    //地图对应关系
    //cityName就是地图对应的资源地址了
    //id是服务端数据库的id
    mapData: {
        '北京': {
            cityName: 'beijing',
            id: '1'
        },
        '天津': {
            cityName: 'tianjin',
            id: '2'
        },
        '河北': {
            cityName: 'hebei',
            id: '3'
        },
        '山西': {
            cityName: 'shanxi',
            id: '4'
        },
        '内蒙古': {
            cityName: 'neimenggu',
            id: '5'
        },
        '辽宁': {
            cityName: 'liaoning',
            id: '6'
        },
        '吉林': {
            cityName: 'jilin',
            id: '7'
        },
        '黑龙江': {
            cityName: 'heilongjiang',
            id: '8'
        },
        '上海': {
            cityName: 'shanghai',
            id: '9'
        },
        '江苏': {
            cityName: 'jiangsu',
            id: '10'
        },
        '浙江': {
            cityName: 'zhejiang',
            id: '11'
        },
        '安徽': {
            cityName: 'anhui',
            id: '12'
        },
        '福建': {
            cityName: 'fujian',
            id: '13'
        },
        '江西': {
            cityName: 'jiangxi',
            id: '14'
        },
        '山东': {
            cityName: 'shandong',
            id: '15'
        },
        '河南': {
            cityName: 'henan',
            id: '16'
        },
        '湖北': {
            cityName: 'hubei',
            id: '17'
        },
        '湖南': {
            cityName: 'hunan',
            id: '18'
        },
        '广东': {
            cityName: 'guangdong',
            id: '19'
        },
        '海南': {
            cityName: 'hainan',
            id: '20'
        },
        '广西': {
            cityName: 'guangxi',
            id: '21'
        },
        '甘肃': {
            cityName: 'gansu',
            id: '22'
        },
        '陕西': {
            cityName: 'shanxi1',
            id: '23'
        },
        '新疆': {
            cityName: 'xinjiang',
            id: '24'
        },
        '青海': {
            cityName: 'qinghai',
            id: '25'
        },
        '宁夏': {
            cityName: 'ningxia',
            id: '26'
        },
        '重庆': {
            cityName: 'chongqing',
            id: '27'
        },
        '四川': {
            cityName: 'sichuan',
            id: '28'
        },
        '贵州': {
            cityName: 'guizhou',
            id: '29'
        },
        '云南': {
            cityName: 'yunnan',
            id: '30'
        },
        '西藏': {
            cityName: 'xizang',
            id: '31'
        },
        '澳门': {
            cityName: 'aomen',
            id: '33'
        },
        '台湾': {
            cityName: 'taiwan',
            id: '32'
        },
        '香港': {
            cityName: 'xianggang',
            id: '34'
        }
    },
    //初始化
    initComponent: function () {
        var me = this;
        me.callParent();
        //视图绘制完成后再加载地图，以免地图加载出错
        me.on({
            resize: 'createMap',
            scope: me
        });
    },
    //加载地图数据
    //name值就是mapData中对应的cityName
    requestJson: function (name) {
        if (name) {
            var url = Ext.String.format(this.mapUrl, name);
            Ext.Ajax.request({
                url: url,
                disableCaching: false,
                success: function (response) {
                    this.initMap(name, Ext.decode(response.responseText));
                },
                failure: function () {
                    Ext.toast('请求失败，服务端无法连接或出错！');
                },
                scope: this
            });
        }
    },
    //创建地图
    createMap: function () {
        this.requestJson(this.cityName);
    },
    //初始化地图
    initMap: function (name, data) {
        echarts.registerMap(name, data);
        var me = this,
        map = me.getMap(),
        option = Ext.apply({
            series: [{
                type: 'map',
                mapType: name,
                map: name,
                //单选
                selectedMode: 'single',
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        borderColor: '#F6F7FB'
                    }
                }
            }]
        },
        me.option);
        if (!map) {
            map = echarts.init(me.el.dom);
            me.setMap(map);
        }
        map.setOption(option);
        me.fireEvent('mapShow', me);
        map.on('click',
        function (params) {
            var data = params.data;
            if (data) {
                data = Ext.apply(data, me.mapData[data.name]);
                me.fireEvent('mapClick', me, data);
            }
        });
    },
    //显示城市
    showCity: function (name) {
        var data = this.mapData[name];
        this.requestJson(data.cityName);
        return data;
    },
    //设置数据
    setData: function (data) {
        var map = this.getMap();
        if (map) {
            map.setOption({
                series: [data]
            });
        }
    },
    //设置地图参数
    setOption: function (data) {
        var map = this.getMap();
        if (map) {
            map.setOption(data);
        }
    }
});