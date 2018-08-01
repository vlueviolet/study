(function (win, $, doc) {
    'use strict';

    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Common = win.OVERWATCH.Common || {};
    win.OVERWATCH.Test = win.OVERWATCH.Test || {};
    win.OVERWATCH.Test = (function () {
        return {
            init : function () {
                this.initLayout();
            },
            initLayout : function () {
                var comment = '<!-- Test -->';
                var style =
                    '<style>' +
                    '.test_area{position:fixed;bottom:0;right:0;z-index:100;}' +
                    '.test_area button{display:inline-block;padding:10px;background-color:rgba(51,49,52,0.7);font-size:13px;color:#fff;text-align:center}' +
                    '</style>';
                var html =
                    '<div class="test_area">'+
                    '<button type="button" class="btn_test">Color</button>' +
                    '</div>';
                var comment2 = '<!-- //Test -->';
                $('body').append(comment+style+html+comment2);
            }
        };
    }());

    $(function () {
        win.OVERWATCH.Test.init();

        // 컬러 변경
        $('html').attr('class', '');
        $('.btn_test').on('click', function () {
            this.current = $('html').attr('class');
            if(this.current === 'green') {
                this.prev = this.current;
                this.current = '';
                $('html').removeClass().addClass(this.current);
            } else if(this.current === '') {
                if(this.prev) {
                    $('html').removeClass().addClass(this.prev);
                } else {
                    this.prev = this.current;
                    this.current = 'green';
                    $('html').removeClass().addClass(this.current);
                }
            }
        });
    });

})(window, window.jQuery, window.document);