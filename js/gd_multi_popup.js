/**
 * 팝업 처리 스크립트
 * @author Shin Donggyu <artherot@godo.co.kr>
 */
$(function(){
    $.ajax({
        type: 'GET',
        url: '../popup/multi_popup_ps.php',
        data: {'mode':'popupOpen','currentUrl':location.href},
        dataType: 'json',
        async: true
    }).done(function(data) {
        if (_.isUndefined(data.error)) {
            $.each(data, function (key, value) {
                if (value.popupKindFl == 'window') {
                    main_multi_popup_window(value);
                } else {
                    main_multi_popup_layer(value, value.popupKindFl);
                }
            });
        }
    });
});

/**
 * 일반팝업창
 */
function main_multi_popup_window(v) {
    var property = new Array();
    property.push('scrollbars=no, toolbar=no');
    if (v.popupSizeW != '') {
        property.push('width='+(v.popupSizeW+60));
    }
    if (v.popupSizeH != '') {
        property.push('height='+(v.popupSizeH+192));
    }
    if (v.popupPositionT != '') {
        property.push('top='+v.popupPositionT);
    }
    if (v.popupPositionL != '') {
        property.push('left='+v.popupPositionL);
    }
    var property = property.join(',');
    var win = window.open('../popup/multi_popup.php?sno='+v.sno, v.popupCode, property);
    if (win) {
        win.focus();
    }
}

/**
 * 고정레이어 & 이동레이어
 */
function main_multi_popup_layer(v, type) {
    var cssAttr = {'position':'absolute','overflow':'hidden', 'z-index':'300'};

    if (v.popupSizeW != null && v.popupSizeW != '') {
        cssAttr.width = (v.popupSizeW+60)+'px';
    }

    popupCode.push(v.popupCode);

    v.popupSizeH = (v.todayUnSee == 'y') ? v.popupSizeH + 94 : v.popupSizeH + 44;

    if (v.popupSizeH != null && v.popupSizeH != '') {
        cssAttr.height = v.popupSizeH+'px';
    }
    if (v.popupPositionT != null && v.popupPositionT != '') {
        cssAttr.top = v.popupPositionT+'px';
    } else {
        cssAttr.top = '0px';
    }
    if (v.popupPositionL != null && v.popupPositionL != '') {
        cssAttr.left = v.popupPositionL+'px';
    } else {
        cssAttr.left = '0px';
    }

    cssAttr.paddingBottom = '10px';

    var ele = $('<div />').attr('id', v.popupCode).attr('class', 'main_popup_layer').css(cssAttr);
    $.ajax({
        type: 'GET'
        , url: '../popup/multi_popup.php?sno='+v.sno
        , async: false
        , success: function(data) {
            ele.append(data);
        }
    });
    ele.appendTo('body');

    gd_main_popup_layer_mousedown(v);

    if (type == 'move') {
        ele.drags();
    }
}

/**
 * 클릭된 팝업 맨 위로 노출 처리
 */
function gd_main_popup_layer_mousedown(v) {
    $('.main_popup_layer').on('mousedown', function(){
        for(var k in popupCode) {
            if (popupCode[k] != $(this).attr('id')) {
                $('#' + popupCode[k]).css('z-index', 200);
            }
        }
        if (v.popupCode == $(this).attr('id')) {
            $(this).css('z-index', 2000);
        }
    })
}

(function($) {
    $.fn.drags = function(opt) {

        opt = $.extend({handle:"",cursor:"move"}, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                $('.draggable').offset({
                    top:e.pageY + pos_y - drg_h,
                    left:e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);
