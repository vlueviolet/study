(function (win, $) {
    'use strict';

    var slideBox = {
        init : function () {
            this.setElements();
            this.bindEvents();
            this.initLayout();
        },
        setElements : function () {
            this.tab = $('.slide_tab li');
            this.tab_cont = $('.slide_article');
            this.btn_prev = $('.slide_btn button').eq(0);
            this.btn_next = $('.slide_btn button').eq(1);
            this.currentNum = $('.slide_num .current');
            this.totalNum = $('.slide_num .total');
        },
        bindEvents : function () {
            this.tab.on('click', $.proxy(this.clickFunc, this));
            this.btn_prev.on('click', $.proxy(this.prevFunc, this));
            this.btn_next.on('click', $.proxy(this.nextFunc, this));
        },
        initLayout : function () {
            this.currentIndex = 0;
            this.prevIndex = this.currentIndex;
            this.tab.removeClass('active').eq(this.currentIndex).addClass('active');
            this.tab_cont.css('left','-100%').eq(this.currentIndex).css('left', 0);
        },
        clickFunc : function (e) {
            e.preventDefault()
            var target = this.tab.index($(e.currentTarget));
            if(this.currentIndex > target){
                this.direction = 'prev';
            }else if(this.currentIndex < target){
                this.direction = 'next';
            }else if(this.currentIndex === target) return;
            this.currentIndex = target;
            this.viewContent();
        },
        viewContent : function () {
            this.tab.eq(this.currentIndex).addClass('active');
            this.tab.eq(this.prevIndex).removeClass('active');
            if(this.direction == 'prev'){
                this.tab_cont.css('left', '-100%');
                this.tab_cont.eq(this.prevIndex).css('left','0').animate({'left' : '100%'});
                this.tab_cont.eq(this.currentIndex).animate({'left' : '0'});
                
            }else if(this.direction == 'next'){
                this.tab_cont.css({
                    'left' : '100%'
                });
                this.tab_cont.eq(this.prevIndex).css('left','0').animate({'left' : '-100%'});
                this.tab_cont.eq(this.currentIndex).animate({'left' : '0'});
            }
            this.prevIndex = this.currentIndex;
        },
        prevFunc : function () {
            this.direction = 'prev';
            if(this.currentIndex <= 0) {
                this.currentIndex = this.tab.length - 1;
            }else{
                this.currentIndex--;
            }
            this.viewContent();
        },
        nextFunc : function () {
            this.direction = 'next';
            console.log(this.currentIndex);
            if(this.currentIndex >= this.tab.length-1) {
                this.currentIndex = 0;
            }else{
                this.currentIndex++;
            }
            this.viewContent();
        }
    };
    $(function () {
        slideBox.init();
    });
})(window, window.jQuery);