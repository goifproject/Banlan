var maxShippingNo = 10;
var changeElement = ['name', 'id', 'for'];

$(function(){
    $('input[name="multiShippingFl"]').click(function(){
        var checked = this.checked;

        if (checked === true) {
            $('.shipping_info table:eq(0) th:eq(0)').html(__('메인 배송지'));
            $('#memberinfoApplyTr2').find('input[name="reflectApplyMember"]').prop('checked', false);
            $('#memberinfoApplyTr2').find('label').removeClass('on');
            $('.shipping_add_btn, .select_goods_tr').removeClass('dn');
            $('.shipping_add_btn').trigger('click');
        } else {
            $('.shipping_info table:eq(0) th:eq(0)').html(__('배송지 확인'));
            $('#memberinfoApplyTr').show();
            $('.select_goods').addClass('dn').find('table').empty();
            $('input[name^="selectGoods"]').val('');
            $('input[name^="multiDelivery"]').val(0);
            $('.shipping_add_btn, .select_goods_tr').addClass('dn');
            $('.shipping_info_table').not(':eq(0)').remove();
        }

        gd_display_memberinfo_apply();
        gd_set_real_settle_price();

        resetMileage();
    });

    $('.shipping_add_btn').click(function(){
        var shippingNo = $('.shipping_info_table').length;
        if (shippingNo >= maxShippingNo) {
            alert(__('복수 배송지는 최대 %s개까지 이용 가능합니다.', maxShippingNo));
            return;
        }
        var content = {'no': shippingNo};
        var compiled = _.template($('#multiShippingRow').html());
        compiled = compiled(content);

        $('.shipping_info').append(compiled);
    });

    $(document).on('click', '.shipping_remove_btn', function(){
        var index = $('.shipping_remove_btn').index(this) + 1;

        $(this).closest('.shipping_info_table').remove();

        if ($('.shipping_info_table').length <= 1) {
            $('input[name="multiShippingFl"]').trigger('click');
        } else {
            for (var i = $('.shipping_info_table').length; i > index; i--) {
                $('.shipping_info_table:eq(' + (i - 1) + ') th:eq(0) span.no').html(i - 1);
                $('.shipping_info_table:eq(' + (i - 1) + ')').find('input, select, label, button').each(function (index, element) {
                    changeElement.forEach(function (ele) {
                        if (typeof $(element).prop(ele) != 'undefined') {
                            if (ele == 'name') {
                                var replace = $(element).prop(ele).replace(/\[.*\]/gi, '[' + (i - 1) + ']');
                            } else {
                                var replace = $(element).prop(ele).replace(/Add\d/gi, 'Add' + (i - 1));
                            }
                            $(element).prop(ele, replace);
                        }
                    });
                    if (typeof $(element).data('no') != 'undefined') {
                        $(element).attr('data-no', (i - 1));
                    }
                });
            }
        }

        gd_set_real_settle_price();
    });

    $(document).on('click', '.postcode_search', function(){
        var no = $(this).attr('data-no');
        gd_postcode_search('receiverZonecodeAdd[' + no + ']', 'receiverAddressAdd[' + no + ']', 'receiverZipcodeAdd[' + no + ']');
    });

    $(document).on('click', 'div.del .delete_add_goods', function(){
        var $target = $(this);
        var type = $target.data('type');
        var cartSno = $target.data('cart-sno');
        var goodsNo = $target.data('goods-no');
        var selectGoods = $target.closest('.select_goods_tr').find('input[name^="selectGoods"]').val();

        switch (type) {
            case 'goods':
                var addgoodsCnt = $target.closest('table').find('.del .delete_add_goods[data-type="addGoods"][data-parent-goods-no="' + goodsNo + '"]').length;

                if (addgoodsCnt > 0) {
                    alert(__('추가상품만 단독으로 배송지 선택은 불가합니다.'));
                    return false;
                }
                break;
            case 'addGoods':
                if ($target.data('must-fl') == 'y') {
                    alert(__('추가상품이 필수 선택인 상품이 있습니다. 추가상품도 함께 선택하셔야 배송지 선택이 가능합니다.'));
                    return false;
                }
                break;
        }

        var totalGoodsCnt = 0;
        var setData = [];
        $.parseJSON(selectGoods).forEach(function(ele){
            if (ele.sno == cartSno) {
                if (type == 'goods') {
                    ele.goodsCnt = 0;
                } else {
                    ele.addGoodsNo.forEach(function(addGoodsNo, index){
                        if (addGoodsNo == goodsNo) {
                            ele.addGoodsCnt[index] = 0;
                        }
                    });
                }
            }
            totalGoodsCnt += parseInt(ele.goodsCnt);
            setData.push(ele);
        });
        var data = JSON.stringify(setData);

        if (totalGoodsCnt > 0) {
            $.ajax({
                method: "POST",
                url: "../order/cart_ps.php",
                data: {mode: 'multi_shipping_delivery', selectGoods: data}
            }).success(function (getData) {
                $target.closest('.select_goods_tr').find('input[name^="multiDelivery"]').val(getData.deliveryCharge);
                $target.closest('.select_goods_tr').find('input[name^="selectGoods"]').val(data);
                $target.closest('tr').remove();
            });
        } else {
            $target.closest('.select_goods').addClass('dn');
            $target.closest('.select_goods_tr').find('input[name^="selectGoods"]').val('');
            $target.closest('.select_goods_tr').find('input[name^="multiDelivery"]').val(0);
            $target.closest('table').empty();
        }

        gd_set_real_settle_price();
    });

    // 레이어 오픈 바인딩
    $(document).on('click', '.shipping_goods_select', function (e) {
        var shippingNo = $('.shipping_goods_select').index(this);
        var cartIdx = [];
        var selectGoods = [];
        var address = '';
        $(this).closest('form').find('input[name="cartSno[]"]').each(function(){
            cartIdx.push($(this).val());
        });
        $('input[name^="selectGoods"]').each(function(index){
            selectGoods.push(this.value);
        });
        if (shippingNo > 0) {
            address = $('input[name="receiverAddressAdd[' + shippingNo + ']"]').val() + $('input[name="receiverAddressSubAdd[' + shippingNo + ']"]').val();
        } else {
            address = $('input[name="receiverAddress"]').val() + $('input[name="receiverAddressSub"]').val();
        }

        $.ajax({
            method: "POST",
            url: "../order/shipping_goods_select.php",
            data: {shippingNo:shippingNo, cartIdx: cartIdx, selectGoods: selectGoods, multiDelivery: $('input[name="multiDelivery[' + shippingNo + ']"]').val(), address: address}
        }).success(function (data) {
            $('#cartSelectGoods').html('').empty().append(data);
            $('#cartSelectGoods').find('>div').center();
        }).error(function (e) {
            if(e.responseText) {
                alert(e.responseText);
            }
        });
    });
});
