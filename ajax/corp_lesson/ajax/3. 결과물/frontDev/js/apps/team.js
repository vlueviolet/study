(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Team = win.OVERWATCH.Team || {};

    var UTIL = win.OVERWATCH.Common.util,
        PAGE = win.OVERWATCH.page;

    // 팀 정보 레이어팝업
    win.OVERWATCH.Team.TeamList = win.OVERWATCH.Team.TeamList || {};
    win.OVERWATCH.Team.TeamList = function(args) {
        var defParams = {
            wrap : '#wrap.team_ow',
            teamWrap : '.team_wrap',
            teamList : '.list_team'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Team.TeamList.prototype = {
        init : function () {
            this.setElements();
            this.initLayout();
        },
        initLayout : function () {
        },
        setElements : function () {
            this.teamWrap = this.wrap.find(this.opts.teamWrap);
            this.teamList = this.teamWrap.find(this.opts.teamList);
        }
    };

    $(function () {
        win.TeamList = new win.OVERWATCH.Team.TeamList();
    });

})(window, window.jQuery, window.document);