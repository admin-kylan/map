/**
 * Created by T012 on 2016/4/22.
 */
$.fn.createMapScript = function(){
    var values = arguments[0];
    var id =  this.selector.substring(1,this.selector.length)
    initMap.id = id;
    initMap.locationLng = values.locationLng;
    initMap.locationLat = values.locationLat;
    initMap.locationInput = values.locationInput;
    initMap.pointLocation = values.pointLocation;

    if(values.pointLocation == undefined || values.pointLocation == ""){
        initMap.pointLocation = "海沧"
    }
    //取配置
    //initMap.syncLoad = values.config;
    initMap.config = initMap.chackNullFunc(values.config) ? {} : values.config;
    //取值
    initMap.values = initMap.chackNullFunc(values.values) ? {} : values.values;
    initMap.createMapScript()
}
var initMap = {
    createMapScript : function(){
        var _that = this;
        $('<style>').html('.tangram-suggestion-main {overflow-y:scroll;overflow-x: hidden;height:200px;}').appendTo($('head'));
        $('#'+ initMap.id).css('style','style="width: 500px; height: 500px"')
        $('#suggestId').after('<div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:327px;  overflow: scroll; display: none;"></div>');
        //在外围添加一个div
        var father = $('<div style="position: relative"></div>');
        $('#'+_that.id).before(father);
        $('#'+_that.id).appendTo(father);
        $('#'+_that.id).after('<div style=" position: absolute; z-index: 10; bottom: auto; right: auto; top: 10px; left: 10px; ">搜索：<input style="width: 200px;height: 19px;" id="_search_location"/></div>');
        _that.searchInput = "_search_location";
        _that.config.asyncLoad = initMap.chackNullFunc(_that.config.asyncLoad) ? false : true;
        if(_that.config.asyncLoad == false){
            //同步
            _that.loadJScript();
        }else{
            //异步
             window.onload = _that.loadJScript;  //异步加载地图
        }

    },
    init : function(){
        var _that = this;
        var map = new BMap.Map(initMap.id,{enableMapClick:false});            // 创建Map实例

        if(_that.chackNullFunc(_that.values.lng) || _that.chackNullFunc(_that.values.lat)){
            map.centerAndZoom(initMap.pointLocation, 13);
        }else{
            var point = new BMap.Point(_that.values.lng, _that.values.lat); // 创建点坐标
            map.centerAndZoom(point,13);
            var marker = new BMap.Marker(point);
            map.addOverlay(marker);
            marker.addEventListener("click", initMap.showOpenInfoWindow);
        }
        //  initMap.addZoomControl(map);
        map.enableScrollWheelZoom();
        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {"input" : initMap.searchInput,"location" : map});
        map.disableDoubleClickZoom()
        initMap.searchLocation(ac,map);
        map.addEventListener('dblclick',initMap.clickPointFunc);
        //
        var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
        var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
        var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
        /*缩放控件type有四种类型:
         BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮*/
      //  new BMap.Size()

        //添加控件和比例尺
        function add_control(){
            map.addControl(top_left_control);
            map.addControl(top_left_navigation);
            map.addControl(top_right_navigation);
        }
       // add_control();
    },
    searchLocation : function (ac,map) {
        var _that = this;
        ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
            var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if (e.fromitem.index > -1) {
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            $("searchResultPanel").innerHTML = str;
        });

        var myValue;
        ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            $("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

            _that.setPlaceFunc(map,myValue);

        });
    },
    setPlaceFunc : function (map,myValue) {
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun(){
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 15);

            // 创建标注 //添加标注
            var marker = new BMap.Marker(new BMap.Marker(pp).point);
            map.addOverlay(marker);
            marker.addEventListener("click", initMap.showOpenInfoWindow);
            //填充经纬度
            initMap.inputPoint(new BMap.Marker(pp).point)
            //填充地址
            var geoc = new BMap.Geocoder();
            geoc.getLocation(new BMap.Marker(pp).point, function(rs) {
                $('#'+initMap.locationInput).val(rs.address)
            });
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    },
    clickPointFunc : function(e){
        var point = e.point;
        initMap.inputPoint(point);

        //点击坐标，红心跳转
        var map = e.currentTarget;
        //查询标记,删除上一个标注
        var allOverlay = map.getOverlays();
        for (var i = 0; i < allOverlay.length -1; i++){
            map.removeOverlay(allOverlay[i]);
        }
        map.clearOverlays();
        // 创建标注
        var marker = new BMap.Marker(point);
        map.addOverlay(marker);
        marker.addEventListener("click", initMap.showOpenInfoWindow);

        //给输入框添加位置信息
        var geoc = new BMap.Geocoder();
        geoc.getLocation(point, function(rs) {
            $('#'+initMap.locationInput).val(rs.address)
        });
    },
    showOpenInfoWindow : function(e){
        var that = this;
        var pt = e.point;
        pt.lng = e.currentTarget.HA.lng;
        pt.lat = e.currentTarget.HA.lat;
        var geoc = new BMap.Geocoder();
        geoc.getLocation(pt, function(rs){
            var addComp = rs.addressComponents;
            var content = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
            var contentTitle = addComp.province;
            var sContent =
                "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>"+ contentTitle+"</h4>" +
                "" +
                "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em;cursor: pointer;color: darkgreen;' onclick='initMap.inputLocation(\""+ rs.address +"\")'>"+ content+"</p>" +
                "</div>";
            var infoWindow = new BMap.InfoWindow(sContent);
            that.openInfoWindow(infoWindow); //开启信息窗口

            $('#'+initMap.locationInput).val(rs.address)
        });
    },

    inputPoint : function(point){
        $('#' + initMap.locationLng).val(point.lng);
        $('#' + initMap.locationLat).val(point.lat);
    },
    loadJScript : function(){

/*        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=ja5anlrgfusaZxiZQwFe45ElZurMzSbm&callback=initMap.init";
        document.body.appendChild(script);*/
        $('<script id="script_map" type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=ja5anlrgfusaZxiZQwFe45ElZurMzSbm&callback=initMap.init">').appendTo('body')
    },
    inputLocation : function (location) {
        $('#'+initMap.locationInput).val(location)
    },
    chackNullFunc : function (value) {
        if(value == undefined || value == ""){
            return true;
        }
        return false;
    }

}
