(function (win, $) {
    'use strict';

    var avatarObj = {
        init : function () {
            this.setElements();
            this.initArr();
            this.bindEvents();
        },
        setElements : function () {
            this.btn = $('.btn_random');
            this.obj = $('.swiper-wrapper .swiper-slide')
        },
        bindEvents : function () {
            this.btn.on('click', $.proxy(this.viewArray,this));
        },
        setArray : function () {
            this.arr = [];
            for(var i=0, max = this.obj.length ; i < max ; i++){
                this.obj.eq(i).hide();
                this.arr.push(i);
            }
        },
        makeRandomNum : function () {
            this._length = this.arr.length;
            this.randomNum = Math.floor(Math.random()*this._length);
            this.curIndex = this.arr[this.randomNum];
            // console.log('pre : ' + this.prevIndex+', cur : '+this.curIndex);
        },
        initArr : function () {
            this.setArray();
            this.checkRandomNum();
            this.obj.eq(this.randomNum).show();
        },
        spliceArray : function () {
            if(this._length === 1){
                this.initArr();
            }
            this.arr.splice(this.randomNum,1);
        },
        viewArray : function () {
            this.spliceArray();
            this.prevIndex = this.curIndex;
            this.obj.eq(this.prevIndex).hide();
            this.checkRandomNum();
            this.obj.eq(this.curIndex).show();
        },
        checkRandomNum : function () {
            console.log('pre : ' + this.prevIndex+', cur : '+this.curIndex);
            while(this.prevIndex === this.curIndex){
                this.makeRandomNum();
            }
            console.log('pre : ' + this.prevIndex+', cur : '+this.curIndex);
        }
    };
    $(function(){
        avatarObj.init();
    });
})(window, window.jQuery);