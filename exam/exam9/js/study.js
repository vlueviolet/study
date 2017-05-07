(function (win, $) {
    'use strict';

    var castBox = {
        init : function () {
            this.setElements();
            this.bindEvents();
            this.initLayout();
            // this.initObj();
        },
        setElements : function () {
            this.tab = $('.cast_tab li');
            this.tab_cont = $('.cast_article');
            this.btn_prev = $('.cast_btn button').eq(0);
            this.btn_next = $('.cast_btn button').eq(1);
            this.currentNum = $('.cast_num .current');
            this.totalNum = $('.cast_num .total');
        },
        bindEvents : function () {
            this.tab.on('click', $.proxy(this.clickFunc, this));
            this.btn_prev.on('click', $.proxy(this.prevFunc, this));
            this.btn_next.on('click', $.proxy(this.nextFunc, this));
            $(win).on('hashchange', $.proxy(this.changeHash, this));
        },
        initLayout : function () {
            var hashVal = location.hash;
            if(win.location.hash){
                this.currentIndex = $(hashVal).index();
            }else{
                this.currentIndex = 0;
            }
            this.totalNum.text(this.tab.length);
            this.currentNum.text(this.currentIndex+1);
            this.viewContent();
        },
        clickFunc : function (e) {
            e.preventDefault();
            if (this.currentIndex === this.tab.index($(e.currentTarget))) return;
            this.currentIndex = this.tab.index($(e.currentTarget));
            this.changeIndex();
            this.setHash();
        },
        viewContent : function () {
             this.tab_cont.removeClass('active').eq(this.currentIndex).addClass('active');
            this.tab.removeClass('active').eq(this.currentIndex).addClass('active');
            this.changeIndex();
        },
        changeIndex : function () {
            this.currentNum.text(this.currentIndex+1);
        },
        setHash : function () {
            location.hash = '#' + this.tab_cont.eq(this.currentIndex).attr('id');
        },
        changeHash : function () {
            var hashVal = location.hash;
             if(win.location.hash){
                this.currentIndex = $(hashVal).index();
            }else{
                this.currentIndex = 0;
            }
            this.viewContent();
        },
        prevFunc : function () {
            if(this.currentIndex < 0) {
                this.currentIndex = this.tab.length - 1;
            }else{
                this.currentIndex--;
            }
            this.setHash();
        },
        nextFunc : function () {
            if(this.currentIndex >= this.tab.length-1) {
                this.currentIndex = 0;
            }else{
                this.currentIndex++;
            }
            this.setHash();
        }
    };
    $(function () {
        castBox.init();
    });
})(window, window.jQuery);