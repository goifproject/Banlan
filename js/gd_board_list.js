 /**
 * Created by LeeNamJu on 2015-11-03.
 */
$(document).ready(function () {
    if ($('.js_datepicker').length) {
        $('.js_datepicker').datetimepicker({
            locale: 'ko',
            format: 'YYYY-MM-DD',
            dayViewHeaderFormat: __('YYYY년 MM월'),
            viewMode: 'days',
            ignoreReadonly: true,
            debug: false
        });
        //$('.check-cal img').click(function (e) {
        //    $(this).prev('.js-datepicker').data('DateTimePicker').show();
        //});
        //날짜 체크 정규식 /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
    }
    if ($('.date_check_list').length) {
        $('.date_check_list button').click(function (e) {
            $startDate = $endDate = '';
            $period = $(this).data('value');
            $elements = $('input[name="' + $(this).closest('.date_check_list').data('target-name') + '"]');
            $format = $($elements[0]).data('DateTimePicker').format();
            if ($period >= 0) {
                $startDate = moment().hours(0).minutes(0).seconds(0).subtract($period, 'days').format($format);
                $endDate = moment().hours(0).minutes(0).seconds(0).format($format);
            }
            $($elements[0]).val($startDate);
            $($elements[1]).val($endDate);
            $('.date_check_list button').removeClass('on');
            $(this).addClass('on');
        });

        // 선택된 버튼에 따른 값 초기화
        $elements = $('input[name*=\'' + $('.date_check_list').data('target-name') + '\']');
        if ($elements.length && $elements.val() != '') {
            $interval = moment($($elements[1]).val()).diff(moment($($elements[0]).val()), 'days');
            $('.date_check_list').find('button[data-value="' + $interval + '"]').trigger('click');
        } else {
            $('.date_check_list').find('button[data-value="-1"]').trigger('click');
        }
    }
})
;

var passwordListLayer = {
    element: $('#lyPassword'),
    btnEl: $('#lyPassword').find('.js_submit'),
    inputEl: $('#lyPassword').find('input[name=writerPw]'),
    show: function () {
        this.element.removeClass('dn');
        this.element.currentCenter();
        $('#layerDim').removeClass('dn');
        $('#scroll-left, #scroll-right').addClass('dim');
        $('.password_layer .ly_cont .text').focus();
    },
    close: function () {
        $('.password_layer .ly_close').trigger('click');
    }
}
