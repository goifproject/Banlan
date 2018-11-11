function gd_reload_captcha() {
    $('#captchaImg').removeAttr('src');
    setTimeout(function () {
        var someDate = new Date();
        someDate = someDate.getTime();
        $('#captchaImg').attr('src', '../board/captcha.php?ch=' + someDate);
    }, 1);
}

function gd_add_upload() {
    var uploadBoxCount = $('#uploadBox').find('.file_upload_sec').length;
    if (uploadBoxCount >= 10) {
        alert(__("업로드는 최대 10개만 지원합니다"));
        return;
    }

    var ifrmObj = $(window.frameElement);
    var ifrmHeight = ifrmObj.height();
    ifrmObj.height(ifrmHeight + 42);

    var addUploadBox = _.template(
        $("script.template").html()
    );

    $('#uploadBox:last').append(addUploadBox({idx: uploadBoxCount + 1}));
}

function gd_remove_upload(obj) {
    var target = $(obj);
    index = target.prevAll('input:file').attr('index'); //$('.file_upload_sec button.uploadremove').index(target)+1;

    var ifrmObj = $(window.frameElement);
    var ifrmHeight = ifrmObj.height();
    ifrmObj.height(ifrmHeight - 42);

    $("input[name='uploadFileNm[" + index + "]']").remove();
    $("input[name='saveFileNm[" + index + "]']").remove();
    target.closest('.file_upload_sec').remove();
}

$(document).ready(function () {
    var uploadBoxCount = $('#uploadBox').find('.file_upload_sec').length;
    $('.file_upload_sec:last').find('label').attr('for', 'attach' + uploadBoxCount);
    $('.file_upload_sec:last').find('input[type="file"]').attr('id', 'attach' + uploadBoxCount);

    if (cfgUploadFl == 'y') {
        $('#addUploadBtn').bind('click', function () {
            gd_add_upload();
        });
    }

    if ($('.file_upload_sec').length > 10) {
        $('.file_upload_sec:last').remove();
    }

    $.validator.addMethod("checkCaptcha", function (value, element, fl) {
        var success = false;
        $.ajax({
            method: "POST",
            url: "../board/board_ps.php",
            data: {mode: 'captcha', 'captchaKey': value },
            dataType: 'text',
            cache: false,
            async: false,
        }).success(function (result) {
            if (result == 'true') {
                success = true;
            }
        }).error(function (e) {
            alert(e.responseText);
        });

        return success;
    }, __("자동등록방지 문자가 틀렸습니다."));

    $("#frmWrite").validate({
        submitHandler: function (form) {
            if($(form).find('[name="uploadType"]').val() == 'ajax') {
                $('input:file').prop('disabled', true);
            }
            if (cfgEditorFl == 'y') {
                oEditors.getById["editor"].exec("UPDATE_CONTENTS_FIELD", []);	// 에디터의 내용이 textarea에 적용됩니다.
            }

            form.submit();
        },
        rules: {
            private: 'required',
            contents: {
                required: function (textarea) {
                    if (cfgEditorFl == 'y') {
                        var editorcontent = oEditors.getById[textarea.id].getIR();	// 에디터의 내용 가져오기.
                        editorcontent = editorcontent.replace(/<(?!img).*?>/ig, '').replace('&nbsp;', '');  //이미지테그제외한 테그제거
                        return editorcontent.length === 0;
                    }
                    else {
                        return textarea.value.length === 0;
                    }
                }
            },
            writerNm: 'required',
            writerPw: 'required',
            subject: 'required',
            captchaKey: {
                required: true,
                checkCaptcha : true,
            },
            goodsPt: 'required',
        },
        messages: {
            writerNm: {
                required: __('작성자를 입력해주세요.')
            },
            writerPw: {
                required: __('비밀번호를 입력해주세요.')
            },
            subject: {
                required: __('제목을 입력해주세요.')
            },
            contents: {
                required: __('내용을 입력해주세요')
            },
            private: {
                required: __('개인정보 수집 및 이용동의를 체크해주세요.')
            },
            captchaKey: {
                required: __('자동등록방지 문자를 입력해주세요.'),
            },
            goodsPt: {
                required: __('평가를 체크해주세요.')
            },

        }
    });

    $('body').on('click','.js_select_remove',function(){
        $(this).closest('div.js_select_item').remove();
        $('.js_selected_info_text').show();
    });

    $('.btn_open_layer').bind('click', function (e) {
        var params = {};
        if(typeof bdId != 'undefined') {
            params = {
                bdId : bdId,
                bdSno : bdSno,
            };
        }
        if ($(this).attr('href') == '#addGoodsLayer') {
            $.ajax({
                method: "POST",
                data : params,
                cache: false,
                url: "../share/layer_goods_select.php",
                success: function (data) {
                    $('#addGoodsLayer').empty().append(data);
                    $('#addGoodsLayer').find('>div').currentCenter();
                },
                error: function (data) {
                    alert(data.message);
                    gd_close_layer();
                }
            });
        }
        else if ($(this).attr('href') == '#addOrderLayer') {
            var params = {
                bdId : bdId,
                bdSno : bdSno,
            };
            $.ajax({
                method: "POST",
                data : params,
                cache: false,
                url: "../share/layer_order_select.php",
                success: function (data) {
                    $('#addOrderLayer').empty().append(data);
                    $('#addOrderLayer').find('>div').currentCenter();
                },
                error: function (data) {
                    alert(data.message);
                    gd_close_layer();
                }
            });
        }
    });

    $(document).on("change", "input:file", function () {
        var thisObj = $(this);
        var name = this.name;
        var idx = $('input[name="' + name + '"]').index(this);
        //ajax업로드 처리
        var uploadImages = [];
        gdAjaxUpload.upload(
            {
                formObj: $("#frmWrite"),
                thisObj: $(this),
                actionUrl: '../board/board_ps.php',
                params: {bdId: $('[name="bdId"]').val(), 'mode': 'ajaxUpload'},
                onbeforeunload: function () {
                    if (uploadImages.length == 0) {
                        return false;
                    }
                    $.ajax({
                        method: "POST",
                        url: "../board/board_ps.php",
                        data: {mode: 'deleteGarbageImage', bdId: $('[name="bdId"]').val(), deleteImage: uploadImages.join('^|^')},
                        cache: false,
                    }).success(function (data) {
                    }).error(function (e) {
                    });
                },
                successAfter: function (data) {
                    thisObj.attr('index',data.index);
                    uploadImages.push(data.saveFileNm);
                },
                failAfter : function(data) {
                    if (data.result == 'fail' && name == 'upfiles[]') {
                        $('input[name="' + name + '"]').eq(idx).val('');
                    }
                }
            }
        )
    });
});

function gd_set_add_goods(frmData) {
    $.each(frmData.info, function (key, val) {
        var selectGoodsTblTr = _.template($('#selectGoodsTblTr').html());
        var param = {goodsNo: val.goodsNo, goodsImgageSrc: val.goodsImgageSrc, goodsName: val.goodsName, goodsPrice: val.goodsPrice};
        selectGoodstblTrHtml = selectGoodsTblTr(param);
    });
    $("#selectGoodsBox").empty();
    $("#selectGoodsBox").append(selectGoodstblTrHtml);
    $('.js_selected_info_text').hide();

    if(parent && parent!=this){
        parent.gd_resize_frame(parent.document.getElementsByName(window.name)[0]);
    }
}

function gd_set_add_order(frmData) {
    $.each(frmData.info, function (key, val) {
        var selectGoodsTblTr = _.template($('#selectOrderTblTr').html());
        var param = {orderNo: val.orderNo, orderGoodsNo: val.orderGoodsNo, goodsImgageSrc: val.goodsImgageSrc, goodsName: val.goodsName, optionName:val.optionName,goodsPrice:val.goodsPrice,goodsNo : val.goodsNo};
        selectGoodstblTrHtml = selectGoodsTblTr(param);
    });
    $("#selectOrderBox").empty();
    $("#selectOrderBox").append(selectGoodstblTrHtml);
    $('.js_selected_info_text').hide();
    if(parent && parent!=this){
        parent.gd_resize_frame(parent.document.getElementsByName(window.name)[0]);
    }
}
