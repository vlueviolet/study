(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Common = win.OVERWATCH.Common || {};

    var UTIL = win.OVERWATCH.Common.util;
    win.contentWidth = 1190;
    win.minWidth = 720;

    win.OVERWATCH.Bracket = function (args) {
        var defParams = {
            wrap : '.bracket_wrap',
            bracketArea : '.bracket_area',
            roundArea : '.round_area',
            round : '.round',
            tit : '.tit',
            teamBox : '.team_bx',
            team : '.team',
            activeClass : 'on',
            overClass : 'over',
            state : '.state',
            line : '.line',
        };
        this.opts = UTIL.def(defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    };
    win.OVERWATCH.Bracket.prototype = {
        init : function () {
            this.setElements();
            this.setRoundWdith();
            this.setRoundHeight();
            this.setRoundState();
            this.bindEvents();
            this.finalWinnerFunc();
        },
        setElements : function () {
            this.bracketArea = this.wrap.find(this.opts.bracketArea);
            this.roundArea = this.wrap.find(this.opts.roundArea);
            this.round = this.wrap.find(this.opts.round);
            this.tit = this.wrap.find(this.opts.tit);
            this.teamBox = this.wrap.find(this.opts.teamBox);
            this.team = this.wrap.find(this.opts.team);
        },
        setRoundHeight : function () {
            this.arr = [];
            this.round.css('height', 'auto');
            this.round.each($.proxy(function (index) {
                this.arr.push($(this.round[index]).outerHeight());
            }, this));
            this.roundMaxHeight = parseFloat(Math.max.apply(Math, this.arr));
            this.round.css('height', this.roundMaxHeight);
        },
        setRoundWdith : function () {
            if(UTIL.winSize().w >= win.contentWidth || UTIL.winSize().w > win.minWidth) {
                this.roundWidth = parseFloat(this.bracketArea.outerWidth() / this.round.length);
                this.round.css('width', this.roundWidth);
                this.round.parent().css('width', this.round.length*this.roundWidth);
            } else {
                this.round.css('width', 234);
                this.round.parent().css('width', this.round.length*parseFloat(this.round.css('width')));
            }
        },
        setRoundState : function () {
            var tag = '<span class="state"><span class="line"></span></span>';
            var roundLength = this.round.length - 1;

            this.round.each($.proxy(function (index) {
                if(this.round.eq(index).hasClass(this.opts.activeClass)) {
                    this.round.eq(index).find(this.tit).append(tag);
                    this.state = this.round.eq(index).find(this.opts.state);
                    this.line = this.state.children();

                    var lineWidth = this.round.outerWidth() * 0.5 + (roundLength - index) * this.round.outerWidth();
                    this.line.css('width', lineWidth);
                }
            }, this));
        },
        bindEvents : function () {
            this.wrap.on('click', this.opts.teamBox, $.proxy(this.clickFunc, this));
            $(win).on('resize', $.proxy(this.resizeFunc, this));
            this.teamBox.on('mouseover', $.proxy(this.mouseOverFunc, this));
            this.teamBox.on('mouseleave', $.proxy(this.mouseLeaveFunc, this));
        },
        clickFunc : function (e) {
            e.preventDefault();
            var parent = $(e.delegateTarget),
                  target = $(e.currentTarget);
            if(target.data('no') === null || target.data('no') === undefined) return;
            window.commonLayer.layerView('#layer_score');
        },
        finalWinnerFunc : function () {
            this.lastRoundChild = this.round.eq(this.round.length-1).find(this.opts.team);
            this.lastRoundChild.each($.proxy(function (index) {
                if(this.lastRoundChild.eq(index).hasClass('win')) {
                    this.finalWinner = this.lastRoundChild.eq(index);
                    this.finalTeamNo = this.finalWinner.data('teamNo');
                }
            }, this));

            this.team.each($.proxy(function (index) {
                if(this.team.eq(index).data('teamNo') === null || this.team.eq(index).data('teamNo') === undefined) return;
                if(this.team.eq(index).data('teamNo') === this.finalTeamNo) {
                    this.team.eq(index).addClass('finalwinner');
                }
            }, this));
        },
        mouseOverFunc : function (e) {
            var target = $(e.currentTarget);
            for(var i = 0, max = target.children().length ; i < max ; i++) {
                if(target.children().eq(i).hasClass('win') || target.children().eq(i).hasClass('lose')) {
                    target.addClass(this.opts.overClass);
                    target.css('cursor', 'pointer');
                }
            }
        },
        mouseLeaveFunc : function (e) {
            var target = $(e.currentTarget);
            target.removeClass(this.opts.overClass);
        },
        resizeFunc : function () {
            this.setRoundWdith();
            this.setRoundHeight();
        }
    };

    // 토스트 메시지
     win.OVERWATCH.Bracket.Toast = (function () {
        return {
            viewTooltip : function (target) {
                $(target).stop(true, true).fadeIn(1000).fadeOut(1000);
            }
        };
     }());

    $(function () {
        win.Bracket = new win.OVERWATCH.Bracket();
    });
})(window, window.jQuery, window.document);