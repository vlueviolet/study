(function (win, $) {
    'use strict';

    var avatarObj = {
        init : function () {
            this.setElements();
            this.setArray();
            this.bindEvents();
        },
        setElements : function () {
            this.btn = $('.btn_random');
            this.obj = $('.swiper-wrapper .swiper-slide');
        },
        setArray : function () {
            this._length = this.obj.length;
            this.arr=[];
            for(var i=0, max=this.obj.length ; i < max ; i++){
                this.arr.push(this.obj.eq(i));
            }
        },
        bindEvents : function () {
            this.btn.on('click', $.proxy(this.randomView,this));
        },
        setOption : function () {
            
        },
        makeRandomNum : function () {
            var curNum = Math.floor(Math.random()*this._length);
            var prevNum=curNum;
            return curNum;
        },
    };
    $(function(){
        avatarObj.init();
    });
})(window, window.jQuery);