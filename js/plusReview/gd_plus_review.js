$(function () {
    var thisScript =  $('script[src*=gd_plus_review]');
    var isPopup = 'n';
    if (thisScript.length > 0) {
        isPopup = thisScript.attr('src').split("popup=")[1];
    }
    if (isPopup == 'y') {
        $.ajax({
            type: 'POST',
            url: '../board/plus_review_popup.php',
            data: {'mode': 'popupOpen', 'currentUrl': location.href},
            dataType: 'text',
            async: true
        }).done(function (data) {
            if (data == 'empty') {
                return;
            }
            var ele = $('<div />').attr('id', 'plusReviewPopup');
            ele.append(data);
            ele.appendTo('body');
            // ele.drags();
        });
    }
});


(function ($) {
    $.fn.drags = function (opt) {

        opt = $.extend({handle: "", cursor: "move"}, opt);

        if (opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function (e) {
            if (opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function (e) {
                $('.draggable').offset({
                    top: e.pageY + pos_y - drg_h,
                    left: e.pageX + pos_x - drg_w
                }).on("mouseup", function () {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function () {
            if (opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);

function gd_popup_plus_review_write(sno) {
    window.open('../board/plus_review_mypage.php?orderGoodsNo='+sno,'reviewPopup','width=405,height=640,left=100,top=100,scrollbar=no');
}
