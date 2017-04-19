(function (win, $) {
    'use strict';

    var layerObj = {
        init : function () {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.btn = $('.js-btn_pos button');
            this.objWrap = $('.js-layer_area');
            this.obj = $('.layer_pos');
            this.closeBtn = this.obj.find('.layer_close');
        },
        initLayout : function () {  //무한 포커스
            var focusOutTag = '<span class="js-focusout" tabindex="0" style="overflow:hidden;position:absolute;top:0;left:0;z-index:-1;width:0;height:0;font-size:0;line-height:0"></span>';
            this.obj.before(focusOutTag);   //obj앞에 엘리먼트 만들기
            this.obj.after(focusOutTag);    //obj뒤에 엘리먼트 만들기
            this.prevFocus = this.obj.prev();    //obj 바로 이전 엘리먼트
            this.nextFocus = this.obj.next();   //obj 바로 다음 엘리먼트
            this.obj.attr('tabindex', 0);       //포커스 가능 요소
        },
        bindEvents : function () {
            this.btn.on('click', $.proxy(this.layerView, this));
            this.closeBtn.on('click', $.proxy(this.layerClickOutside, this));
            // this.prevFocus.on('focusin', $.proxy(this.prevFocusFunc, this));
            this.prevFocus.on('focusin', $.proxy(this.prevFocusFunc, this));
            this.nextFocus.on('focusin', $.proxy(this.nextFocusFunc, this));
        },
        outSideEvents : function () {
            this.obj.on('clickoutside', $.proxy(this.layerClickOutside,this));
        },
        layerView : function () {
            this.objWrap.show();

            // 0.001초 간격으로 outSideEvents가 실행되게 함
            setTimeout($.proxy(function () {
                this.outSideEvents();
            }, this), 10);
            
            this.obj.focus();
        },
        layerClickOutside  : function () {
            console.log(1); //setTimeout 함수로 시간차로 outSideEvents가 실행되게 함
            this.objWrap.hide();
            this.btn.focus();
            this.obj.off('clickoutside');   //성능이슈로 사용하지 않을때 이벤트 실행안되게 off
        },
        prevFocusFunc : function () {
            console.log('pre');
            this.closeBtn.focus();
        },
        nextFocusFunc : function () {
            console.log('next');
            this.obj.focus();   //initLayout()에서 tabindex=0 처리해서 가능
        }
    };
    $(function(){
        layerObj.init();
    });
})(window, window.jQuery);