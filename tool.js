/**
 * Created with IntelliJ IDEA.
 * @author kevin
 * @since 2016/8/17
 */
define(function (require) {
    require("jquery");
    require('utils/jquery-fileupload');
    // 全局js
    var qxt = {
        init: function () {
            //初始化函数
            this.initFunc();
            this.resetFunc();
        },
        initFunc:function(){
        },
        resetFunc: function () {
            var that = this;
            //设置重置按钮
            $(document).find('#resetButton').on("click", function () {
                var url = $(this).closest('form').attr('action');
                var input = '<input name="pagerVo.courrentPage" value="1" style="display: none;"/>'
                that.submitForm(url, input);
            });
        },
        submitForm: function (url, obj) {
            var form = $("<form action='" + url + "' id='to_form' style='display:none;' method='post'>");
            if (Object.prototype.toString.apply(obj) === '[object Array]') {
                for (var i in obj) {
                    form.append(obj[i]);
                }
            } else if (Object.prototype.toString.apply(obj) === '[object String]') {
                form.append(obj);
            } else if (this.checkValueNull(obj)) {
                form.append("");
            }
            $('body').append(form.prop('outerHTML'));
            document.getElementById("to_form").submit();
            form.remove();
        },
        checkValueNull: function (value) {
            if(value === false){
                return false;
            }
            if (value == "" || value == "undefined" || value == null) {
                return true;
            }
            return false;
        },
        /**
         * 键盘按键事件，只能输入数字 拼接成电话号码。
         */
        KeyLandlineNum: function (document,cp) {
            var down_value = [8, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 37, 39, 189, 109, 17, 67, 86];
            this.baseNumFunc(document,cp,down_value);
        },
        //验证身份证号码
        baseCardFunc: function (document,cp) {
            var down_value = [8, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 88, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 37, 39, 17, 67, 86];
            this.baseNumFunc(document,cp,down_value);
        },

        //数字，小数点
        baseNumDotFunc: function (document,cp) {
            var down_value = [8, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 190, 37, 39, 17, 67, 86];
            this.baseNumFunc(document,cp,down_value);
        },
        //大于0 的整数
        baseGetZeroNumFunc: function (document,cp) {
            var down_value = [8, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 37, 39, 17, 67, 86];
            this.baseNumFunc(document,cp,down_value);
        },
        /**
         * 键盘按键事件，只能输入数字。
         */
        KeyBaseNum: function (document,cp) {
            var down_value = [8, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 37, 39, 17, 67, 86];
            this.baseNumFunc(document,cp,down_value);

        },
        baseNumFunc: function(document,cp,down_value){
            if(this.checkValueNull(cp)){
                cp = true;
            }
            $(document).keydown(function (event) {
                if(!cp){
                    down_value.splice($.inArray(17,down_value),1);
                    down_value.splice($.inArray(67,down_value),1);
                    down_value.splice($.inArray(86,down_value),1);
                }
                if ($.inArray(event.which, down_value) == -1) {
                    return false;
                }
            });
        },
        ajaxPostBase: function (url, data, successBack, errorBack) {
            $.ajax({url: url, data: data, type: 'post', success: successBack, error: errorBack});
        },
        ajaxGetBase: function (url, successBack, errorBack) {
            $.ajax({url: url, type: 'get', success: successBack, error: errorBack});
        },
        formatCurrency: function (num) {
            var sign;
            var cents;
            num = num.toString().replace(/\$|\,/g,'');
            if(isNaN(num))
                num = "0";
            sign = (num == (num = Math.abs(num)));
            num = Math.floor(num*100+0.50000000001);
            cents = num%100;
            num = Math.floor(num/100).toString();
            if(cents<10)
                cents = "0" + cents;
            for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
                num = num.substring(0,num.length-(4*i+3))+','+
                    num.substring(num.length-(4*i+3));
            return (((sign)?'':'-') + num + '.' + cents);

        },

        checkImg: function (file) {
            var array = new Array(".jpg", ".jpeg", ".bmp", ".png", ".JPG", ".BMP", ".JPEG", ".PNG");
            var allowSubmit = false;

            while (file.indexOf("\\") != -1) {
                file = file.slice(file.indexOf("\\") + 1);
            }
            var ext = file.slice(file.lastIndexOf(".")).toLowerCase();
            for (var i = 0; i < array.length; i++) {
                if (array[i] == ext) {
                    allowSubmit = true;
                    break;
                }
            }
            return allowSubmit;
        },
        dialogOperate: function (obj, okFun, cancelFun) {
            var width = obj.width;
            if (this.checkValueNull(width)) {
                width = 400;
            }
            var okValue = obj.okValue;
            if (this.checkValueNull(okValue)) {
                okValue = "确定";
            }
            var cancelValue = obj.cancelValue;
            if (this.checkValueNull(cancelValue)) {
                cancelValue = "取消";
            }
            var title = obj.title;
            if (this.checkValueNull(title)) {
                title = "";
            }
            var content = obj.content;
            if (this.checkValueNull(content)) {
                content = "";
            }
            var okCss = "";
            if(!this.checkValueNull(obj.okCss)){
                okCss = obj.okCss;
            }
            var cancelCss = "";
            if(!this.checkValueNull(obj.cancelCss)){
                cancelCss = obj.cancelCss;
            }
            var dialog = $.dialog({
                title: title,
                width: width,                 // 默认690
                content: content,
                padding: 20,                // 默认10
                cancelCheck : obj.cancelCheck,
                okCheck : obj.okCheck,
                okCss : okCss,
                cancelCss : cancelCss,
                ok: function () {
                    var back = okFun(obj);
                    if (back == false) {
                        return false;
                    }

                    this.close();           // 默认不关闭弹窗，需要手动关闭，不销毁弹窗使用hide
                },
                okValue: okValue,
                cancel: function () {
                    // 默认关闭弹窗,
                    cancelFun(obj);
                },
                cancelValue: cancelValue,
                close: function () {

                },
                domHandle : function () {
                   // doHandle(obj,this.domHandle())
                }
            });
        },
        ajaxFileUpload: function (obj, successBack, errorBack) {
            var url = obj.url;
            var elementId = obj.elementId;
            var array = [];
            var fileName = obj.fileName;
            var busiModel = obj.busiModel;
            var busiId = obj.busiId;
            if (toString.apply(elementId) === '[object Array]') {

            } else if (toString.apply(elementId) === '[object String]') {
                array.push(elementId)
            }
            $.ajaxFileUpload({
                url: url,
                secureuri: false,
                fileElementId: array,
                data: {"fileName": fileName, "businessModel": busiModel},   //要传递的数据
                dataType: 'json',
                success: successBack,
                error: errorBack
            });
        },

        /**
         * @param url 上传的url
         * @param imgUlId 装载图片的ul元素id
         * @param maxImageCount 允许上传的最大数目,传undefined可以填无数张图片
         * @param businessModel 图片相关的业务模型
         * @param msg 图片达到允许的最大数目时的提示
         * @param successBack 图片上传后的回调函数
         */
        uploadImage: function (url, imgUlId, maxImageCount, businessModel, msg, successBack, errorBack) {
            if (this.checkValueNull(imgUlId)) {
                throw "必须存在要存放的ulDom";
            }
            if ($('#base_btnUpload')) {
                $('#base_btnUpload').remove();
            }
            //判断图片的最大张数
            if (!qxt.checkValueNull(maxImageCount)) {
                if ($('#' + imgUlId).find('img').length >= maxImageCount) {
                    layer.msg(msg);
                    return;
                }
            }
            var clickBtn = $('<input type="file" id="base_btnUpload" name="binaryFile" style="display: none;">');
            $('body').append(clickBtn);
            clickBtn.click();
            clickBtn.on("change", function () {
                if (!qxt.checkImg(this.value)) {
                    layer.msg("请传图片格式！");
                    return;
                }
                var fileElement = new Array();
                fileElement.push("base_btnUpload");
                $.ajaxFileUpload({
                    url: url,
                    secureuri: false,
                    fileElementId: fileElement,
                    data: {"businessModel": businessModel},   //要传递的数据
                    dataType: 'json',
                    success: successBack,
                    error: errorBack
                });
            })
        },
        addPicAndClose: function (obj, ajaxBack) {
            //初始数据
            var that = this;
            var ul = obj.ul;
            var picLeng = obj.picSize;
            var url = obj.url;
            var id = obj.id;
            var model = obj.model;
            var clickBtn = $('<input type="file" id="base_btnUpload" name="binaryFile" style="display: none;">');
            if (this.checkValueNull(ul)) {
                throw "必须存在要存放的ulDom";
            }

            $('#base_btnUpload') ? $('#base_btnUpload').remove() : null;
            if (!this.checkValueNull(picLeng)) {
                //默认不填可以填无数张图片
                var length = ul.find('div').length;
                if (length >= picLeng) {
                    if(this.checkValueNull(obj.sizeMsg)){
                        layer.msg("限制上传图片张数");
                    }else{
                        layer.msg(obj.sizeMsg);
                    }
                    return false;
                };
            }
            if(this.checkValueNull(url)){
                url = IGI.baseUrl + "/file/image";
                obj.url = url;
            }
            id = this.checkValueNull(id) ? "" : id;
            if (this.checkValueNull(model)) {
                layer.msg("出错异常");
                return false;
            }
            $('body').append(clickBtn);
            clickBtn.click();
           // clickBtn.appendTo('body').click();
            clickBtn.on("change", function () {
                var fileName = this.value;
                if (!qxt.checkImg(fileName)) {
                    layer.msg("请传图片格式！");
                    return false;
                }
                var url = obj.url;
                var object = {};
                object.url = url;
                object.busiModel = model;
                object.busiId = id;
                object.elementId = "base_btnUpload";
                object.fileName = fileName;
                that.ajaxFileUpload(object, ajaxBack, function () {
                    layer.alert("上传异常");
                });
            })
        },
        initRemoveImg: function (html) {
            html.find('.cancel-ico').on('click', function () {
                var imgId = $(this).attr('fileid');
                var url = IGI.baseUrl + "/file/image/" + imgId;
                layer.confirm('确定删除', { title:'删除'}, function(index){
                    $.ajax({url: url, type: 'DELETE'});
                    html.children().remove();
                    layer.close(index);
                });
            })
        },
        appendImg : function (json,parentDom,backFunc,isShow) {
            var that = this;
            var imgId = json.content.imgId;
            var html = '<div class="cancel-group">'+
                '<img src="" class="pic-load" alt="">'+
                '<a href="#" class="cancel-ico"></a>'+
                '</div>';
            html = $(html);
            if(that.checkValueNull(isShow)){
                isShow = true;
            }
            parentDom.append(html);
            html.find('img').attr('src', json.content.imgUrl);
            html.find('.cancel-ico').attr('fileid',json.content.imgId);
            //绑定X事件
            html.find('.cancel-ico').on('click', function () {
                var url = IGI.baseUrl + "/file/image/" + imgId;
                if(isShow){
                    layer.confirm('确定删除', { title:'删除'}, function(index){
                        $.ajax({url: url, type: 'DELETE',success : backFunc});
                        html.remove();
                        layer.close(index);
                    });
                }else{
                    $.ajax({url: url, type: 'DELETE',success : backFunc});
                    html.remove();
                }

            });
        },
        keyUpSetFunc: function (dom, reg) {
            var firstValue = "";
            dom.on('keydown', function () {
                firstValue = dom.val()
            });
            dom.on('keyup', function () {
                var that = this;
                if (!qxt.checkValueNull($(that).val())) {
                    if (!reg.test($(that).val())) {
                        dom.val(firstValue)
                    }
                }

            });
        },
        selectOptionChange: function (that) {
            var index = that.index();
            var value = that.val();
            var obj = {};
            if ('0' == index) {
                obj.provinceId = value;
            } else if ('1' == index) {
                obj.cityId = value;
            }
            obj.that = that;
            qxt.selectCity(obj);
        },
        selectCity: function (data) {
            var url = IGI.baseUrl + '/ajaxBuss/system/SysGener/selectArea.do';
            var _that = data.that;
            delete data['that'];
            if (_that.index() == 2) {
                return false;
            }
            qxt.ajaxPostBase(url, data, function (json) {
                var check = null;
                var cityDom = null;
                var zoneDom = null;
                if (_that.index() == 2) {
                    return false;
                } else if (_that.index() == 0) {
                    cityDom = _that.next('select');
                    zoneDom = _that.next('select').next('select');
                } else if (_that.index() == 1) {
                    zoneDom = _that.next('select');
                }
                //填充option
                _that.next('select').empty();
                var option = "<option></option>";

                var result = json.resultMap.code;//操作结果编码
                if (IGI.ajaxSuccess == result) {//保存成功
                    var data = json.resultMap.cityList;
                    if (!qxt.checkValueNull(data)) {
                        $.each(data, function (i, item) {
                            cityDom.append($("<option></option>").val(item["key"]).text(item["name"]));
                        });
                    }
                    //市区填充
                    else if (!qxt.checkValueNull(cityDom)) {
                        cityDom.append($("<option></option>").val("").text("---市"));
                    }
                }
                //如果选择省
                //填充option
                zoneDom.empty();

                var option = "<option></option>";
                var result = json.resultMap.code;//操作结果编码
                if (IGI.ajaxSuccess == result) {//保存成功
                    var data = json.resultMap.zoneList;
                    if (!qxt.checkValueNull(data)) {
                        $.each(data, function (i, item) {
                            zoneDom.append($("<option></option>").val(item["key"]).text(item["name"]));
                        });
                    }
                    //县级填充
                    else if (!qxt.checkValueNull(zoneDom)) {
                        zoneDom.append($("<option></option>").val("").text("区/县"));
                    }
                }
            })
        }


    };
    return qxt;
   // qxt.init();
});



