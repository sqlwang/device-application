Ext.define('ux.map.BMap', {
    alternateClassName: 'bMap',
    extend: 'Ext.Container',
    xtype: 'bMap',
    config: {
        width: '100%',
        height: '100%',
        //私有变量，地图对象
        map: null,
        maeker: null,
        //初始配置
        //中心点，可以是城市名称，也可以是{lng:'',lat:''}格式的坐标数据
        mapCenter: '北京',
        //本地搜素关键词
        key: null
    },
    //初始化
    initComponent: function () {
        var me = this;
        me.callParent();
        //视图绘制完成后再加载百度地图，以免地图加载出错
        me.on({
            resize: 'initMap',
            scope: me
        });
    },
    //初始化地图
    initMap: function () {
        var me = this,
        map = me.getMap();
        //console.log(map);
        if (!map) {
            //创建地图
            map = new BMap.Map(me.el.dom, {
                //禁止鼠标单击事件
                enableMapClick: false,
                minZoom: 12,
                maxZoom: 19
            });
            //开启鼠标滚轮缩放
            map.enableScrollWheelZoom(true);

            //地图加载完成触发
            map.addEventListener("load",
            function () {
                //地图加载完毕触发事件
                me.fireEvent('showMap', me);
            });

            //地图加载完成触发
            map.removeEventListener("click");

            me.setMap(map);
        }
    },
    //添加小区位置覆盖物
    addMaeker: function (point) {
        var me = this,
        map = me.getMap(),
        // 创建标注
        marker = new BMap.Marker(new BMap.Point(point.lng, point.lat), {
            enableDragging: true
        });
        //清除旧的标注
        map.clearOverlays();
        //设置提示文本
        marker.setLabel(new BMap.Label("小区位置", {
            offset: new BMap.Size(20, -10)
        }));
        //设置中心点
        map.centerAndZoom(new BMap.Point(point.lng, point.lat), 18);
        //添加标注
        map.addOverlay(marker);

        me.setMaeker(marker);
    },
    //更新小区位置
    updateMapCenter: function (value) {
        var map = this.getMap();
        if (map && Ext.isObject(value)) {
            this.addMaeker(value);
        }
    },
    //更新搜索关键词
    updateKey: function (value) {
        var me = this,
        map = me.getMap();
        if (map && value && !Ext.isObject(me.getMapCenter())) {
            me.search(value);
        }
    },
    /// <summary>
    /// 搜索
    /// </summary>
    /// <param name="key">关键词：String|Array<String></param>
    search: function (key) {
        var me = this,
        map = this.getMap(),
        poi;
        var local = new BMap.LocalSearch(map, {
            onSearchComplete: function (bo) {
                poi = bo.getPoi(0);
                if (poi) {
                    me.addMaeker(poi.point);
                } else {
                    //如果搜索不到强制定位到市并标注中心点
                    map.centerAndZoom(me.getMapCenter(), 18);
                    me.addMaeker(map.getCenter());
                }
                //console.log(bo.getPoi(0).point);
            }
        });
        local.search(key);
    }
});