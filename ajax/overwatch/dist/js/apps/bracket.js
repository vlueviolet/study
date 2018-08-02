(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Common = win.OVERWATCH.Common || {};
    win.OVERWATCH.Admin = win.OVERWATCH.Admin || {};
    win.OVERWATCH.Bracket = win.OVERWATCH.Bracket || {};

    var UTIL = win.OVERWATCH.Common.util;

    win.OVERWATCH.Bracket.BracketDraw = function (args) {
        var defParams = {
            wrap : '.bracket_wrap',
            bracketArea : '.bracket_area',
            round : '.round',
            tit : '.tit',
            teamBox : '.team_bx',
            team : '.team',
            activeClass : 'on',
            overClass : 'over',
            state : '.state',
            line : '.line'
        };
        this.opts = UTIL.def(defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    };
    win.OVERWATCH.Bracket.BracketDraw.prototype = {
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
            this.round = this.wrap.find(this.opts.round);
            this.tit = this.wrap.find(this.opts.tit);
            this.teamBox = this.wrap.find(this.opts.teamBox);
            this.team = this.wrap.find(this.opts.team);
        },
        setRoundHeight : function () {
            this.arr = [];
            this.round.each($.proxy(function (index) {
                this.arr.push($(this.round[index]).outerHeight());
            }, this));
            this.roundMaxHeight = parseFloat(Math.max.apply(Math, this.arr));
            this.round.css('height', this.roundMaxHeight);
        },
        setRoundWdith : function () {
            this.roundWidth = parseFloat(this.bracketArea.outerWidth() / this.round.length);
            this.round.css('width', this.roundWidth);
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
            this.teamBox.on('mouseover', $.proxy(this.mouseOverFunc, this));
            this.teamBox.on('mouseleave', $.proxy(this.mouseLeaveFunc, this));
            this.teamBox.on('click', $.proxy(this.clickFunc, this));
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
                if(target.children(this.team).eq(i).hasClass('win') || target.children(this.team).eq(i).hasClass('lose')) {
                    target.addClass(this.opts.overClass);
                    target.css('cursor', 'pointer');
                }
            }
        },
        mouseLeaveFunc : function (e) {
            var target = $(e.currentTarget);
            target.removeClass(this.opts.overClass);
        },
        clickFunc : function (e) {
            // window.OVERWATCH.Admin.ScoreLayer.clickFunc(e);
        }
    };



    $(function () {
        win.BracketDraw = new win.OVERWATCH.Bracket.BracketDraw();
    });
})(window, window.jQuery, window.document);