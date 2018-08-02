(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Common = win.OVERWATCH.Common || {};
    win.OVERWATCH.Standing = win.OVERWATCH.Standing || {};

    var UTIL = win.OVERWATCH.Common.util;

    win.OVERWATCH.Standing.StandingScoreView = function (args) {
        var defParams = {
            wrap : '.standing_wrap',
            listWrap : '.standing_area',
            list : '.list_standing',
            details : '.detail_item',
            btnTeam : '.team_logo',
            btnDetail : '.btn_view',
            lineObj : '.line',
            activeClass : 'on',
            initialRank : '4',
            speed : 200,
            btnLive : 'a.btn_live',
            layerMedia : '#layer_media'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    };
    win.OVERWATCH.Standing.StandingScoreView.prototype = {
        init : function () {
            this.setElements();
            this.setOpts();
            this.initLayout();
            this.bindEvents();
            this.setLineFunc();
        },
        setElements : function () {
            this.listWrap = this.wrap.find(this.opts.listWrap);
            this.list = this.listWrap.find(this.opts.list);
            this.details = this.listWrap.find(this.opts.details);
            this.lineObj = this.wrap.find(this.opts.lineObj);
            this.listChild = this.list.children();
            this.btnTeam = this.listChild.find(this.opts.btnTeam);
            this.btnLive = this.listChild.find(this.opts.btnLive);
            this.layerMedia = $(this.opts.layerMedia);
        },
        initLayout : function () {
            this.listChild.removeClass(this.opts.activeClass);
            $.each(this.details, $.proxy(function (index, details) {
                if($(details).data('matchNo')) {
                    $(details).css('cursor', 'pointer');
                }
            }));
        },
        bindEvents : function () {
            this.listChild.on('click', this.opts.btnDetail, $.proxy(this.clickFunc, this));
            $('body').on('click', this.opts.btnLive, $.proxy(this.clickLiveFunc, this));
        },
        setOpts : function () {
            this.listWrapHeight = this.listWrap.outerHeight();
            this.listHeight = this.list.outerHeight();
            this.listChildHeight = this.listChild.outerHeight();
            this.initialRank = Number(this.opts.initialRank);
        },
        clickFunc : function (e) {
            e.preventDefault();
            var parent = $(e.delegateTarget),
                    target = $(e.currentTarget);
            if(parent.hasClass(this.opts.activeClass)) {
                parent.removeClass(this.opts.activeClass);
            } else {
                this.listChild.removeClass(this.opts.activeClass);
                parent.addClass(this.opts.activeClass);
            }
            this.toggleLineFunc();
        },
        clickLiveFunc : function (e) {
            e.preventDefault();
            e.stopPropagation();

            var target = $(e.currentTarget),
                  url = target.attr('href');
            if(url === undefined) return;
            window.open(url, "_blank");
        },
        toggleLineFunc : function () {
            if(this.initialRank === 0) return;
            if(this.listChild.hasClass(this.opts.activeClass)) {
                this.lineObj.stop().fadeOut('fast');
            } else {
                this.lineObj.stop().fadeIn('fast');
            }
        },
        setLineFunc : function () {
            if(this.initialRank === 0) {
                this.lineObj.hide();
            } else {
                var top = this.listChildHeight * this.initialRank + (this.listWrapHeight - this.listHeight) - 3;
                this.lineObj.css('top', top);
                this.lineObj.stop().fadeIn();
            }
        },
        layerViewFunc : function (e) {
            e.preventDefault();
            e.preventDefault();
            var target = $(e.currentTarget);
            this.layerMedia.css({
                display : 'block',
                opacity : 1,
                zIndex : 110
            });
            win.MediaLayer.clickFunc(e);
        }
    };

     win.OVERWATCH.Standing.StandingLiveView = function (args) {
        var defParams = {
            wrap : '.standing_wrap',
            btnObj : '.btn_live'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    };
    win.OVERWATCH.Standing.StandingLiveView.prototype = {
        init : function () {
            this.setElements();
        },
        setElements : function () {

        }
    };

    $(function () {
        if($('html').hasClass('contenders')) {
            if($('#wrap').hasClass('standing')) {
                win.StandingScoreView = new win.OVERWATCH.Standing.StandingScoreView({
                    initialRank : 0
                });
            }
        } else {
            win.StandingScoreView = new win.OVERWATCH.Standing.StandingScoreView();
        }
    });
})(window, window.jQuery, window.document);