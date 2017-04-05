(function (win, $) {
    'use strict';

    var avatarObj = {
        init : function () {
            this.setElements();
            this.setArray();
            // this.setOption();
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
        makeRandom : function () {
            this.prevNum=this.curNum;
            this.curNum = Math.floor(Math.random()*this._length);
            
        },
        randomView : function () {
            this._length = this.arr.length;
             this.makeRandom();
             console.log('after===prevNum : ' + this.prevNum + ' '+' / curNum : ' + this.curNum);

             if(this._length > 0){
               
                for(var i=0, max=this.arr.length ; i < max ; i++){
                    this.arr[i].hide();
                }

                this.arr[this.curNum].show();
                this.arr.splice(this.curNum,1);
            }else if(this._length === 0){
                this.setArray();
            }
        },
    };
    $(function(){
        avatarObj.init();
    });
})(window, window.jQuery);