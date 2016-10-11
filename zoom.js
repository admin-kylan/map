define(function (require) {
    require("jquery")
    var webapp = {
        imgPop : function(imgBox){
            //页面先添加父类div
            var imgBoxMod = $(imgBox)
            $('body').append('<div id="append_parent"></div>')
            //内容页图片点击放大效果
            imgPop(imgBoxMod);
            //内容页图片点击放大效果函数主体开始
            function imgPop(imgBoxMod){
                //显示图片html
                var html = '<div id="imgzoom">' +
                    '<div id="imgzoom_zoomlayer" class="zoominner">' +
                    '<div id="imgzoom_img" class="hm">' +
                    '<img src="" id="imgzoom_zoom" style="cursor:pointer">' +
                    '</div></div></div><div id="imgzoom_cover"></div>';

                //点击图片弹出层放大图片效果
                imgBoxMod.on('click', function () {
                    //超过最大尺寸时自动缩放内容页图片尺寸
                    var ctnImgWidth=$(this).width();
                    if(ctnImgWidth>618){
                        $(this).width(618);
                    }
                    $("#append_parent").html(html); //生成HTML代码
                    $('#imgzoom').show()
                    //设置遮罩层
                    $("#imgzoom_cover").css({"height":$(document).height()}).show();
                    //图片地址
                    var imgLink=$(this).attr("src");
                    $("#imgzoom_zoom").attr("src",imgLink).show();
                    //图片显示方式
                    imgboxPlace();
                    //关闭按钮
                    $("#imgzoom_cover").on('click',function(){
                        $("#imgzoom").hide()
                        $("#imgzoom_cover").hide()
                    })
                })


                //弹出窗口位置
                function imgboxPlace(){
                    var cwinwidth=$("#imgzoom").width();
                    var cwinheight=$("#imgzoom").height();
                    var browserwidth =$(window).width();//窗口可视区域宽度
                    var browserheight =$(window).height(); //窗口可视区域高度
                    var scrollLeft=$(window).scrollLeft(); //滚动条的当前左边界值
                    var scrollTop=$(window).scrollTop(); //滚动条的当前上边界值
                    var imgload_left=scrollLeft+(browserwidth-cwinwidth)/2;
                    var imgload_top=scrollTop+(browserheight-cwinheight)/2;
                    $("#imgzoom").css({"left":imgload_left,"top":imgload_top});
                }
            }

        }
    }
    return webapp;
})