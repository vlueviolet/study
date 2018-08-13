(function (win, $, doc) {
    'use strict';

    var UTIL = win.OPPY.Common.util;

    
    win.OPPY.Interact = function (args) {
        var defParams = {
            wrap : '.wrap',
            content : '#content',
            section : 'section',
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    };
    win.OPPY.Interact.prototype = {
        init : function () {
            this.setElements();
            this.initLayout();
        },
        setElements : function () {
            this.content = this.wrap.find(this.opts.content);
            this.section = this.wrap.find(this.opts.section);
        },
        initLayout : function () {
            this.winWidth = UTIL.winSize().w;
            this.winHeight = UTIL.winSize().h;
            $('.page_transition').slick({
                vertical : true
            });
            console.log($('.page_transition'))
        }
    };

    $(function () {
        win.Interact = new win.OPPY.Interact();
    });
})(window, window.jQuery, window.docoument);