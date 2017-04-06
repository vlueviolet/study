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
            this.makeRandomNum();
            this.checkRandomNum();
            this.obj.eq(this.randomNum).show();
        },
        spliceArray : function () {
            this.arr.splice(this.randomNum,1);
              if (this.arr.length) return;
            this.initArr();
        },
        viewArray : function () {
            this.spliceArray();
            console.log(this.arr)
            this.prevIndex = this.curIndex;
            this.obj.eq(this.prevIndex).hide();
            this.makeRandomNum();
            this.checkRandomNum();
            this.obj.eq(this.curIndex).show();
        },
        checkRandomNum : function () {
            console.log('현재 보이는 obj : ' + this.prevIndex+', 곧 보일 obj : '+this.curIndex);
            while(this.prevIndex === this.curIndex){
                this.makeRandomNum();
                console.log("돈다 무한히?");
            }
            console.log('이전 인덱스 : ' + this.prevIndex+', 현재 인덱스 : '+this.curIndex);
        }
    };
    $(function(){
        avatarObj.init();
    });
})(window, window.jQuery);