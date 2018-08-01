(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Common = win.OVERWATCH.Common || {};
    win.OVERWATCH.Standing = win.OVERWATCH.Standing || {};

    var UTIL = win.OVERWATCH.Common.util;
    win.minWidth = 720;

    win.OVERWATCH.Standing.StandingScoreView = function (args) {
        var defParams = {
            wrap : '.standing_wrap',
            listWrap : '.standing_area',
            list : '.list_standing',
            listChild : '.standing_item',
            groupBox : '.group_box',
            btnTeam : '.team_logo',
            divisionTitle : '.tit',
            teamTitle : '.team_tit',
            btnDetail : '.btn_view',
            lineObj : '.line',
            lineMobileObj : '.line_m',
            activeClass : 'on',
            initialRank : '2',
            speed : 200,
            btnLive : '.btn_live',
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
            this.groupBox = this.listWrap.find(this.opts.groupBox).eq(0);
            this.groupBox2 = this.listWrap.find(this.opts.groupBox).eq(1);
            this.lineObj = this.wrap.find(this.opts.lineObj);
            this.lineMobileObj = this.groupBox.find(this.opts.lineMobileObj);
            this.lineMobileObj2 = this.groupBox2.find(this.opts.lineMobileObj);
            this.listChild = this.list.find(this.opts.listChild);
            this.btnTeam = this.listChild.find(this.opts.btnTeam);
            this.teamTitle = this.listChild.find(this.opts.teamTitle);
            this.btnLive = this.listChild.find(this.opts.btnLive);
            this.layerMedia = $(this.opts.layerMedia);
        },
        initLayout : function () {
            this.listChild.removeClass(this.opts.activeClass);
            this.resizeFunc();
        },
        bindEvents : function () {
            this.listChild.on('click', this.opts.btnDetail, $.proxy(this.clickFunc, this));
            this.btnLive.on('click', $.proxy(this.layerViewFunc, this));
            $(win).on('resize', $.proxy(this.resizeFunc, this));
        },
        setOpts : function () {
            this.listWrapHeight = this.listWrap.outerHeight();
            this.listHeight = this.list.outerHeight();
            this.listChildHeight = this.listChild.outerHeight();
            this.initialRank = Number(this.opts.initialRank);
        },
        resizeFunc : function () {
            if(UTIL.winSize().w > win.minWidth) {
                this.lineObj.stop().fadeIn();
                this.lineMobileObj.stop().fadeOut();
            } else {
                this.lineObj.stop().fadeOut();
                this.lineMobileObj.stop().fadeIn();
                this.lineMobileObj2.stop().fadeIn();
            }
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
        toggleLineFunc : function () {
            if(UTIL.winSize().w > win.minWidth) {  // pc
                if(this.listChild.hasClass(this.opts.activeClass)) {
                    this.lineObj.stop().fadeOut('fast');
                } else {
                    this.lineObj.stop().fadeIn('fast');
                }
            } else {    // mobile
                if(this.groupBox.find(this.list).children().hasClass(this.opts.activeClass)) {
                    this.lineMobileObj.stop().fadeOut('fast');
                } else {
                    this.lineMobileObj.stop().fadeIn('fast');
                }

                if(this.groupBox2.find(this.list).children().hasClass(this.opts.activeClass)) {
                    this.lineMobileObj2.stop().fadeOut('fast');
                } else {
                    this.lineMobileObj2.stop().fadeIn('fast');
                }
            }
        },
        setLineFunc : function () {
            if(UTIL.winSize().w > win.minWidth) {
                var top = this.listChildHeight * this.initialRank + (this.listWrapHeight - this.listHeight) - 3;
                this.lineObj.css('top', top);
                this.lineObj.stop().fadeIn();
            } else {
                var top = 0, top2 = 0, height = 0, height2 = 0;
                for(var i = 0 ; i < this.initialRank ; i++) {
                    height += this.groupBox.find(this.opts.listChild).eq(i).outerHeight(true);
                }
                top = (this.groupBox.outerHeight() - this.groupBox.find(this.opts.list).outerHeight(true)) + height;

                for(var i = 0 ; i < this.initialRank ; i++) {
                    height2 += this.groupBox2.find(this.opts.listChild).eq(i).outerHeight(true);
                }
                top2 = (this.groupBox2.outerHeight() - this.groupBox2.find(this.opts.list).outerHeight(true)) + height2;
                this.lineMobileObj.css('top', top);
                this.lineMobileObj2.css('top', top2);
                this.lineMobileObj.stop().fadeIn();
                this.lineMobileObj2.stop().fadeIn();
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
        win.StandingScoreView = new win.OVERWATCH.Standing.StandingScoreView();
    });
})(window, window.jQuery, window.document);