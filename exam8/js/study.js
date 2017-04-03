(function (win, $) {
    'use strict';

    var avatarObj = {
        init : function () {
            this.setElements();
            this.bindEvents();
        },
        setElements : function () {
            this.btn = $('.btn_random');
            this.obj = $('.list_avatar li');
        },
        bindEvents : function () {
            this.btn.on('click', $.proxy(this.setArray,this));
        },
        setOption : function () {
            
        },
        setArray : function () {
            var _length = this.obj.length;
            var arr = [0,1,2,3,4,5];
            var randomNum = Math.floor(Math.random()*_length);  //배열 길이 이내 랜덤값
            
            console.log(arr);
            arr.splice(randomNum,1);
            var arr2 = arr;
            console.log(arr2);
            
        },
    };
    $(function(){
        avatarObj.init();
    });
})(window, window.jQuery);