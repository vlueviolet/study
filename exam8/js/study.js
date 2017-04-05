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
            this.arr=[];
            for(var i=0, max=this.obj.length ; i < max ; i++){
                this.arr.push(this.obj.eq(i));
            }
        },
        setOption : function () {
            this.curNum;
            this.prevNum;
        },
        bindEvents : function () {
            this.btn.on('click', $.proxy(this.randomView,this));
        },
        randomView : function () {
            this._length = this.arr.length;
            this.curNum = Math.floor(Math.random()*this._length);
            console.log(this._length);

            for(var i=0, max=this.arr.length ; i < max ; i++){
                this.arr[i].hide();
            }
            this.arr[this.curNum].show();
            this.arr.splice(this.curNum,1);
            this.prevNum=this.curNum;

            console.log(this.curNum);
            console.log(this.prevNum);
        },
    };
    $(function(){
        avatarObj.init();
    });
})(window, window.jQuery);