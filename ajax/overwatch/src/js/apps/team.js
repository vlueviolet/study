(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Team = win.OVERWATCH.Team || {};

    var UTIL = win.OVERWATCH.Common.util,
        PAGE = win.OVERWATCH.page;

    // // 팀 정보 레이어팝업
    // win.OVERWATCH.Team.TeamList = win.OVERWATCH.Team.TeamList || {};
    // win.OVERWATCH.Team.TeamList = function(args) {
    //     var defParams = {
    //         wrap : '#wrap.team_ow',
    //         teamWrap : '.team_wrap',
    //         teamList : '.list_team'
    //     };
    //     this.opts = $.extend({}, defParams, (args || {}));
    //     if (!(this.wrap = $(this.opts.wrap)).length) return;
    //     this.init();
    // }
    // win.OVERWATCH.Team.TeamList.prototype = {
    //     init : function () {
    //         this.setElements();
    //         this.initLayout();
    //         this.afterSetElements();
    //         this.setURL();
    //         this.getDataObj();
    //     },
    //     initLayout : function () {
    //         this.teamWrap.children().remove();
    //     },
    //     setElements : function () {
    //         this.teamWrap = this.wrap.find(this.opts.teamWrap);
    //         this.teamList = this.teamWrap.find(this.opts.teamList);
    //     },
    //     afterSetElements : function () {
    //     },
    //     setURL : function () {
    //         this.defaultTeamLogoImgUrl = '../images/team/@team_logo_big_default.png';
    //     },
    //     resetData : function () {
    //         this.memberArea.hide();
    //         this.memberList.text('');
    //         this.roleTitle.hide();
    //     },
    //     getDataObj : function () {
    //         if (!win.commonTeamJSON) return;
    //         this.setDataFunc(win.commonTeamJSON);
    //     },
    //     setDataFunc : function (data) {
    //         var html='<ul class="list_team">';
    //         $.each(data.teams, $.proxy(function (index, teams) {
    //             if(teams['team_no']) {
    //                 html +=
    //                 '<li class="team_item">' +
    //                 '<a href="#" class="team_logo" data-team-no="' + teams['team_no'] + '">'+
    //                 '<span class="team_img">'+
    //                 '<img src="'+ this.teamLogoPictureFunc(teams['logo_img']) + '" alt=""'+'</span>'+
    //                 '<em class="team">'+ teams['team_name']+'</em>'+
    //                 '<span class="btn_view">상세 정보 보기</span>'+
    //                 '</a>'+
    //                 '</li>';
    //             }
    //         }, this));
    //         html += '<ul>';
    //         this.teamWrap.append(html);
    //     },
    //     teamLogoPictureFunc : function (url) {
    //         if(url) {
    //             return url;
    //         } else {
    //             return this.defaultTeamLogoImgUrl;
    //         }
    //     },
    //     reInit : function () {
    //         if(!(this.wrap).length) return;
    //         this.getDataObj();
    //     }
    // };

    win.OVERWATCH.Team.TeamList = function(args) {
        var defParams = {
            wrap : '.team_wrap',
            url : '../json/team_contenders.json',
            defaultTeamImg : '../images/team/@team_logo_big_default.png'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    };
    win.OVERWATCH.Team.TeamList.prototype = {
        init : function () {
            this.setElements();
            this.initLayout();
        },
        setElements : function () {
            
        },
        initLayout : function () {
            this.bindData();
        },
        bindData : function () {
            var source = $('#teamList-template').html(),
                template = Handlebars.compile(source),
                _this = this;

            $.ajax({
                dataType : 'json',
                url : this.opts.url,
                success : function (response) {
                    Handlebars.registerHelper('teamName', function (options) {
                        if(options === '') {
                            console.log(2)
                        }
                        return console.log(1);
                    });
                    var html = template(response);
                    _this.wrap.append(html);
                },
                error : function (e) {
                    console.error(e);
                }
            });
        },
        test : function () {
            console.log(1)
        }
    };

    $(function () {
        win.TeamList = new win.OVERWATCH.Team.TeamList();
        // win.OVERWATCH.Common.Pageobj.push(win.TeamList);
    });

})(window, window.jQuery, window.document);