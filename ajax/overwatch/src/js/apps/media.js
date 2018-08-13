(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Common = win.OVERWATCH.Common || {};
    win.OVERWATCH.Admin = win.OVERWATCH.Admin || {};
    win.OVERWATCH.Media = win.OVERWATCH.Media || {};

    var UTIL = win.OVERWATCH.Common.util;

    win.OVERWATCH.Media.MediaView = function (args) {
        var defParams = {
            wrap : '.media_wrap',
            mediaList : '.media_lst',
            clickObj : '.btn_play',
            layer : '#layer_media',
            layerVideo : '.main_video',
            layerTitle : '.layer_tit',
            layerTeam1 : '.team1',
            layerTeam2 : '.team2',
            layerScore1 : '.score1',
            layerScore2 : '.score2',
            layerScoreArea : '.match_score',
            layerDate : '.match_date'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    };
    win.OVERWATCH.Media.MediaView.prototype = {
        init : function () {
            this.onLoadTwitchApi();
            this.onLoadYoutubeApi();
            this.setElements();
            this.initLayout();
            this.getDataFunc();
            this.bindEvents();
        },
        setElements : function () {
            this.mediaList = this.wrap.find(this.opts.mediaList);

            // 미디어 레이어
            this.layer = $(this.opts.layer);
            this.layerVideo = this.layer.find(this.opts.layerVideo);
            this.layerTitle = this.layer.find(this.opts.mainTitle);
            this.layerTeam1 = this.layer.find(this.opts.team1);
            this.layerTeam2 = this.layer.find(this.opts.team2);
            this.layerScore1 = this.layer.find(this.opts.score1);
            this.layerScore2 = this.layer.find(this.opts.score2);
            this.layerDate = this.layer.find(this.opts.date);
        },
        initLayout : function () {
            this.mediaList.children().remove();
             this.layer.css({
                display : 'block',
                opacity : 0,
                zIndex : -1
            });
            this.resetData();
        },
        bindEvents : function () {
            $('body').on('click', this.opts.clickObj, $.proxy(this.clickFunc, this));
        },
        onLoadTwitchApi : function () {
            (function () {
                var tag = document.createElement('script');
                tag.src = 'https://player.twitch.tv/js/embed/v1.js';
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            })();
        },
        onLoadYoutubeApi : function () {
            (function () {
                var tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            })();
        },
        resetData : function () {
            this.layer.find($(this.opts.layerTitle)).hide();
            this.layer.find($(this.opts.layerScoreArea)).hide();
            this.layer.find($(this.opts.layerDate)).hide();
        },
        clickFunc : function (e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            this.videoNum = parseInt(target.data('videoNo'));
            this.layer.css({
                display : 'none',
                opacity : 1,
                zIndex : 110
            });
            window.commonLayer.opts.viewBefore = $.proxy(function () {  //레이어 닫힌 후 실행구문
                this.setLayer();
                window.commonLayer.opts.viewBefore = null;  //한번 쓰고 초기화
            }, this);
            window.commonLayer.layerView(this.layer);
             window.commonLayer.opts.closeAfter = $.proxy(function () {
                this.layerVideo.children().remove();
                this.resetData();
                window.commonLayer.opts.closeAfter = null;
            }, this);
        },
        getDataFunc : function () {
            var _this = this;
            if($('html').hasClass('division')) {
                this.commonMediaJSON = win.OVERWATCH.Common.DataCall.getData('../json/media_division.json');
            } else if($('html').hasClass('trials')) {
                this.commonMediaJSON = win.OVERWATCH.Common.DataCall.getData('../json/media_trials.json');
            } else if($('html').hasClass('contenders')) {
                this.commonMediaJSON = win.OVERWATCH.Common.DataCall.getData('../json/media_contenders.json');
            }
            this.commonMediaJSON.done(function (json) {
                _this.setMediaPage(json);
            });
        },
        setMediaPage : function (data) {
            if(data === undefined) return;
            this.data = data;
            var _this = this,
                html = '';
            for(var i = 0, max = this.data.medias.length ; i < max ; i++) {
                $.each(this.data.medias, function (index, data) {
                    if(parseInt(data['no']) === (i+1)) {
                        html = '<li class="media_item">' +
                                '<a href="#" class="video btn_play" data-video-type="'+ data['video_type'] + '" data-season-no="'+ data['season_no'] +'" data-video-no="' + data['no']+ '">'+
                                '<span class="thumb">'+
                                '<img src="' + data['thumbnail'] + '" alt=""></span>';
                        html += '<div class="media_info">'+
                        '<span class="tit">' + data['title'] + '</span>';
                        html += '<ul class="list">'+
                        '<li class="sort">' + data['sort'] + '</li>' +
                        '<li class="time">' + data['date'] + '</li></ul></div></a></li>';
                    }
                });
                this.mediaList.append(html);
            }
        },
        setLayer : function () {
            $.each(this.data.medias, $.proxy(function (index, data) {
                if(this.videoNum === parseInt(data['no'])) {
                    this.layer.find($(this.opts.layerTitle)).text(data['title']).show();
                    if(data['teamA_name'] !== undefined) {
                        this.layer.find($(this.opts.layerScoreArea)).show();
                        this.layer.find($(this.opts.layerTeam1)).text(data['teamA_name']);
                        this.layer.find($(this.opts.layerTeam2)).text(data['teamB_name']);
                        this.layer.find($(this.opts.layerScore1)).text(data['teamA_score']);
                        this.layer.find($(this.opts.layerScore2)).text(data['teamB_score']);
                    }
                    this.layer.find($(this.opts.layerDate)).text(data['date']).show();

                    if(data['video_type'] === 'twitch') {
                        this.setTwitch(data['video_url']);
                    } else if(data['video_type'] === 'youtube') {
                        this.setYoutube(data['video_url']);
                    }
                }
            }, this));
        },
        setYoutube : function (url) {
            this.youtubeCode = url.split('https://www.youtube.com/watch?v=')[1];
            this.layerVideo.append('<div id="player"></div>');
            this.onYouTubeIframeAPIReady();
        },
        onYouTubeIframeAPIReady : function () {
            this.youtubePlayer = new win.YT.Player('player', {
                videoId : this.youtubeCode,
                playerVars : {
                    autoplay : 0,
                    controls : 1,
                    showinfo : 0,
                    rel : 0
                },
                events : {
                    onReady : $.proxy(this.onPlayerReady, this),
                    onStateChange : $.proxy(this.onPlayerStateChange, this)
                },
                fs : 1
            });

        },
        onPlayerReady : function (e) {
            this.youtubePlayer.playVideo();
        },
        onPlayerStateChange : function (e) {
            if ((e.data === YT.PlayerState.PLAYING) && !this.done) {
                this.done = !this.done;
                this.youtubePlayer.playVideo();
            }
            if (e.data === YT.PlayerState.ENDED) {
                this.youtubePlayer.pauseVideo();
            }
        },
        setTwitch : function (url) {
            this.twitchCode = url.split('https://www.twitch.tv/videos/')[1];
            var options = {
                width: '100%',
                height: '100%',
                video: this.twitchCode,
                playsinline : true,
                time : 0
            };
            this.layerVideo.append('<div id="player"></div>');
            this.media = new Twitch.Player("player", options);
        },
        reInit : function () {
            if (!(this.wrap).length) return;
            this.setDataFunc();
        }
    };

    win.OVERWATCH.Media.MediaJson = function (args) {
        var defParams = {
            wrap : '.media_lst'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if(!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    };
    win.OVERWATCH.Media.MediaJson.prototype = {
        init : function () {
            this.initLayout();
            this.buildJSON();
        },
        initLayout : function () {
            
        },
        buildJSON : function () {
            if($('html').attr('class') !== 'esports') {
                var url = $('html').attr('class');
            }
            var promise = $.ajax({
                dataType : 'json',
                url : '../json/media_' + url + '.json'
            });
            
            var whenSuccess = function(res) {
                $.map(res, function(value, key) {
                    $.map(value, function (value2, key2) {
                        //do something
                    });
                });
            }
            var whenError = function(e) {
                console.error(e);
            }
            var whenComplete = function () {
                console.log('complete');
            }

            promise.then(whenSuccess, whenError);
        }
    };

    $(function () {
        // win.MediaView = new win.OVERWATCH.Media.MediaView();
        win.MediaJson = new win.OVERWATCH.Media.MediaJson();

    });
})(window, window.jQuery, window.document);