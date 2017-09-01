(function (win, $) {
    'use strict';

    win.examProject = win.examProject || {};
    win.examProject.common = win.examProject.common || {};

    var UTIL = win.examProject.common.util;

    win.examProject.layerPop = function () {
        this.init();
    };

    win.examProject.layerPop.prototype = {
        init : function () {
            this.setElements();
            this.setLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.btnLive = $('.btn_live');
            this.objLiveLayerWrap = $('.ly_wrapper.ly_live');
            this.objLiveLayer = this.objLiveLayerWrap.find('.ly_box');
            this.closeBtn = this.objLiveLayerWrap.find('.ly_close');
        },
        setLayout : function () {
            var focusOutTag = '<span class="js-focusout" tabindex="0" style="overflow:hidden;position:absolute;top:0;left:0;z-index:-1;width:0;height:0;font-size:0;line-height:0"></span>';
            this.objLiveLayer.before(focusOutTag);
            this.objLiveLayer.after(focusOutTag);
            this.objLiveLayer.attr('tabindex', 0);
            this.prevFocus = this.objLiveLayer.prev();
            this.nextFocus = this.objLiveLayer.next();
            this.closeBtn.on('focusin', function(){
                console.log('btn focus');
            });
        },
        bindEvents : function () {
            this.btnLive.on('click', $.proxy(this.layerViewFunc,this));
            this.closeBtn.on('click', $.proxy(this.layerHideFunc,this));
            this.prevFocus.on('focusin', $.proxy(this.prevFocusFunc,this));
            this.nextFocus.on('focusin', $.proxy(this.nextFocusFunc,this));
        },
        bindOutsideEvents : function () {
            this.objLiveLayer.on('keydown keyup focusoutside', $.proxy(this.keyboardFunc, this));            
            this.objLiveLayer.on('clickoutside', $.proxy(this.layerHideFunc, this));
        },
        layerViewFunc : function () {
            this.objLiveLayerWrap.show();

            setTimeout($.proxy(function(){
                this.bindOutsideEvents();
            }, this),10);

            this.objLiveLayer.focus();
            this.objLiveLayer.css('border','10px solid red');
        },
        layerHideFunc : function () {
            var keyShift = false;
            this.objLiveLayer.off('keydown keyup focusoutside clickoutside');
            this.objLiveLayerWrap.hide();
            this.btnLive.focus();
        },
        prevFocusFunc : function () {
            console.log('pre');
            this.closeBtn.focus();
        },
        nextFocusFunc : function () {
            console.log('next');
            this.objLiveLayer.focus();   
        }
    }

    $(function () {
        win.examLayerPop = new win.examProject.layerPop();
    });
})(window, window.jQuery);