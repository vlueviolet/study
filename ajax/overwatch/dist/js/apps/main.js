(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Common = win.OVERWATCH.Common || {};
    win.OVERWATCH.Admin = win.OVERWATCH.Admin || {};
    win.OVERWATCH.Main = win.OVERWATCH.Main || {};

    var UTIL = win.OVERWATCH.Common.util,
        PAGE = win.OVERWATCH.page;

    win.OVERWATCH.Main.MainVisualSlide = win.OVERWATCH.Main.MainVisualSlide || {};
    win.OVERWATCH.Main.MainVisualSlide = function (args) {
        var defParams = {
            slideOpts : {
                speed : 600,
                loop : true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                effect: 'fade'
            },
            slideOpts2 : {
                loop : false,
                autoplay: false
            },
            wrap : '.main .visual_area',
            slideWrap : '.slide_container',
            slideContainer : '.slide_wrap',
            slideContent : '.slide',
            btnPlay : '.btn_play',
            btnPause : '.btn_pause'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    };
    win.OVERWATCH.Main.MainVisualSlide.prototype = {
        init : function() {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.slideWrap = this.wrap.find(this.opts.slideWrap);
            this.slideContainer = this.slideWrap.find(this.opts.slideContainer);
            this.slideContent = this.slideWrap.find(this.opts.slideContent);
            this.btnPlay = this.slideWrap.find(this.opts.btnPlay);
            this.btnPause = this.slideWrap.find(this.opts.btnPause);
        },
        initLayout : function () {
            this.btnPause.show();
            this.buildSlide();
            this.type = false;
        },
        bindEvents : function () {
            this.btnPlay.on('click', $.proxy(this.playFunc, this));
            this.btnPause.on('click', $.proxy(this.pauseFunc, this));
            this.wrap.on('mouseover', $.proxy(this.mouseOverFunc, this));
            this.wrap.on('mouseleave', $.proxy(this.mouseLeaveFunc, this));
        },
        buildSlide : function () {
            if(this.slideContent.length === 1) {
                $('.swiper-button-prev').hide();
                $('.swiper-button-next').hide();
                $('.top_control').hide();
                this.slide = new Swiper(this.slideWrap, this.opts.slideOpts2);
            } else {
                $('.swiper-button-prev').show();
                $('.swiper-button-next').show();
                $('.top_control').show();
                this.slide = new Swiper(this.slideWrap, this.opts.slideOpts);
            }
        },
        playFunc : function (e) {
            e.preventDefault();
            this.slide.autoplay.start();
            this.btnPlay.hide();
            this.btnPause.show();
            this.type = false;
        },
        pauseFunc : function (e) {
            e.preventDefault();
            this.slide.autoplay.stop();
            this.btnPlay.show();
            this.btnPause.hide();
            this.type = true;
        },
        mouseOverFunc : function () {
            this.slide.autoplay.stop();
        },
        mouseLeaveFunc : function () {
            if(this.type) return;
            this.slide.autoplay.start();
        },
        checkSlide : function () {
            if(this.slideContent.length === 1) {
                $('.swiper-button-prev').hide();
                $('.swiper-button-next').hide();
                $('.top_control').hide();
            } else {
                $('.swiper-button-prev').show();
                $('.swiper-button-next').show();
                $('.top_control').show();
            }
        }
    };

    win.OVERWATCH.Main.slickSlide = win.OVERWATCH.Main.slickSlide || {};
    win.OVERWATCH.Main.slickSlide = function (container) {
        var defParams = {
            slickOpts : {
                dots: true,
                infinite: true,
                speed: 300,
                fade: true,
                cssEase: 'linear',
                autoplay:false,
                zIndex : 100
            },
            slickWrap : '.slide_wrap'
        };
        this.opts = defParams;
        this.wrap = $(container);
        this.init();
    }
    win.OVERWATCH.Main.slickSlide.prototype = {
        init : function() {
            this.setElements();
            this.bindEvents();
            this.buildSlick();
            this.afterBindeEvents();
        },
        setElements : function () {
            this.slickWrap = this.wrap.find(this.opts.slickWrap);
        },
        bindEvents : function () {

        },
        buildSlick : function () {
            this.slickWrap.slick(this.opts.slickOpts);
        },
        afterBindeEvents : function () {}
    };
    win.OVERWATCH.Main.slickSlideCall = {
        init : function () {
            this.setElements();
            this.buildSlickCall();
        },
        setElements : function () {
            this.slideWrap = $('.recently_result');
        },
        buildSlickCall : function () {
            for (var i = 0, max = this.slideWrap.length; i < max; i++) {
                new win.OVERWATCH.Main.slickSlide(this.slideWrap.eq(i));
            }
        }
    };

    win.OVERWATCH.Main.MainNextScheduleSlick = win.OVERWATCH.Main.MainNextScheduleSlick || {};
    win.OVERWATCH.Main.MainNextScheduleSlick = function (args) {
        var defParams = {
            slickOpts : {
                 dots: false,
                  infinite: false,
                  speed: 500,
                  fade: false,
                  cssEase: 'linear',
                  autoplay:false,
                  vertical : true
            },
            wrap : '#wrap.main .next_schedule',
            slickWrap : '.slide_wrap'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Main.MainNextScheduleSlick.prototype = {
        init : function() {
            this.setElements();
            this.buildSlick();
        },
        setElements : function () {
            this.slickWrap = this.wrap.find(this.opts.slickWrap);
            this.slide = this.wrap.find('.slide');
            this.slickContChild = this.slide.find('.slide_cont');
        },
        buildSlick : function () {
            this.slickWrap.slick(this.opts.slickOpts);
        }
    };

    win.OVERWATCH.Main.MainStandingSlick = win.OVERWATCH.Main.MainStandingSlick || {};
    win.OVERWATCH.Main.MainStandingSlick = function (args) {
        var defParams = {
            slickOpts : {
                 dots: false,
                  infinite: true,
                  speed: 0,
                  fade: true,
                  cssEase: 'linear',
                  autoplay:false
            },
            wrap : '#wrap.main .standing_board',
            slickWrap : '.slide_wrap'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Main.MainStandingSlick.prototype = {
        init : function() {
            this.setElements();
            this.buildSlick();
        },
        setElements : function () {
            this.slickWrap = this.wrap.find(this.opts.slickWrap);
            this.slide = this.wrap.find('.slide');
            this.slickContChild = this.slide.find('.slide_cont');
        },
        buildSlick : function () {
            this.slickWrap.slick(this.opts.slickOpts);
        }
    };

    win.OVERWATCH.Main.MainMedia = win.OVERWATCH.Main.MainMedia || {};
    win.OVERWATCH.Main.MainMedia = function (args) {
        var defParams = {
            wrap : '.main_media',
            mediaList : '.media_lst',
            mediaCont : '.video',
            layer : '#layer_media',
            layerVideo : '.main_video',
            layerTitle : '.layer_tit',
            layeraTeam1 : '.team1',
            layeraTeam2 : '.team2',
            layerScore1 : '.score1',
            layerScore2 : '.score2',
            layerScoreArea : '.match_score',
            layerDate : '.match_date',
            btnMore : '.btn_highlight',
            visualSlide : '.main .visual_area .slide',
            btnPop : ' .btn_pop'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Main.MainMedia.prototype = {
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
            this.layeraTeam1 = this.layer.find(this.opts.team1);
            this.layeraTeam2 = this.layer.find(this.opts.team2);
            this.layerScore1 = this.layer.find(this.opts.score1);
            this.layerScore2 = this.layer.find(this.opts.score2);
            this.layerDate = this.layer.find(this.opts.date);
            this.btnMore = this.layer.find(this.opts.btnMore);

            // 메인 비주얼 영역 팝업 버튼
            this.visualSlide = $(this.opts.visualSlide);
            this.btnPop = this.visualSlide.find(this.opts.btnPop);
        },
        initLayout : function () {
            this.mediaList.children().remove();
            this.btnMore.css('display', 'block');
            this.resetData();
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
            this.layer.find($(this.opts.btnMore)).hide();
        },
        bindEvents : function () {
            this.wrap.on('click', this.opts.mediaCont, $.proxy(this.clickFunc, this));
            this.visualSlide.on('click', this.opts.btnPop, $.proxy(this.clickVisualFunc, this));
        },
        clickVisualFunc : function (e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            this.mediaList.find('a').eq(target.data('mediaNo')).trigger('click');
        },
        clickFunc : function (e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            this.mediaNo = target.parent().index();

            this.layer.css({
                display : 'none',
                opacity : 1,
                zIndex : 110
            });
            window.commonLayer.opts.viewBefore = $.proxy(function () {  //레이어 닫힌 후 실행구문
                this.setLayer();
                window.commonLayer.opts.viewBefore = null;
            }, this);
            window.commonLayer.layerView(this.layer);
             window.commonLayer.opts.closeAfter = $.proxy(function () {
                this.layerVideo.children().remove();
                this.resetData();
                window.commonLayer.opts.closeAfter = null;
            }, this);
        },
        setLayer : function () {
             $.each(this.data.medias, $.proxy(function (index, data) {
                if(this.mediaNo === index && data['season_no'] !== '99') {
                    if(this.btnMore.css('display', 'block')) {
                        this.layer.find($(this.opts.layerTitle)).css('paddingRight', '130px');
                    }
                    this.layer.find($(this.opts.layerTitle)).text(data['title']).show();
                    if(data['teamA_name'] !== undefined) {
                        this.layer.find($(this.opts.layerScoreArea)).show();
                        this.layer.find($(this.opts.layeraTeam1)).text(data['teamA_name']);
                        this.layer.find($(this.opts.layeraTeam2)).text(data['teamB_name']);
                        this.layer.find($(this.opts.layerScore1)).text(data['teamA_score']);
                        this.layer.find($(this.opts.layerScore2)).text(data['teamB_score']);
                    }
                    this.layer.find($(this.opts.layerDate)).text(data['date']).show();

                    // if(!this.btnGo.length) return;
                    this.btnMore.attr('href', '/media?seasonNo=' + data['season_no']);
                    this.btnMore.css('display', 'block');

                    if(data['video_type'] === 'twitch') {
                        this.setTwitch(data['url']);
                    } else if(data['video_type'] === 'youtube') {
                        this.setYoutube(data['url']);
                    }
                }
                if(this.mediaNo === index && data['season_no'] === '99') {
                    this.layer.find($(this.opts.layerTitle)).text(data['title']).show();
                    this.layer.find($(this.opts.layerDate)).text(data['date']).show();

                    this.setYoutube(data['url']);
                }
            },this));
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
        getDataFunc : function () {
            var _this = this;
            this.commonMediaJSON = win.OVERWATCH.Common.DataCall.getData('../json/media.json');
            this.commonMediaJSON.done(function (json) {
                _this.setDataFunc(json);
            });
        },
        setDataFunc : function (data) {
            if(data === undefined) return;
            this.data = data;
            var _this = this,
                html = '';
            $.each(this.data.medias, function (index, data) {
                if(data['media_type'] === 'video') {
                    if(data['season_no'] === '10' || data['season_no'] === '20' || data['season_no'] === '30'){
                    }
                    html = '<li class="media_item">' +
                            '<a href="#" class="video btn_play" data-video-type="'+ data['video_type'] + '" data-video-url="' + data['url'] + '" data-season-no="' + data['season_no'] + '">'+
                            '<span class="thumb">'+
                            '<img src="' + data['thumbnail'] + '" alt=""></span>';
                    html += '<div class="media_info">'+
                    '<span class="tit">' + data['title'] + '</span>';
                    html += '<ul class="list">'+
                    '<li class="sort">' + data['sort'] + '</li>' +
                    '<li class="time">' + data['date'] + '</li></ul></div></a></li>';
                    // if(data['season_no'] === '99') {    // 관련영상
                    //     html = '<li class="media_item">' +
                    //             '<a href="'+ data['url'] + '" class="video" target="_blank" data-video-type="'+ data['video_company_code'] + '" data-video-url="' + data['url'] + '" data-video-no="'+ data['video_no'] +'" data-season-no="' + data['season_no'] + '"">'+
                    //             '<span class="thumb">'+
                    //             '<img src="' + data['thumbnail_image_path'] + '" alt=""></span>';
                    //     html += '<div class="media_info">'+
                    //     '<span class="tit">' + data['title'] + '</span>';
                    //     html += '<ul class="list">'+
                    //     '<li class="sort">' + data['sort'] + '</li>' +
                    //     '<li class="time">' + data['date'] + '</li></ul></div></a></li>';
                    // }
                }
                if(data['media_type'] === 'news') {
                    html = '<li class="media_item">' +
                            '<a href="'+ data['url'] + '?seasonNo=' + data['season_no'] + '" class="news">'+
                            '<span class="thumb">'+
                            '<img src="' + data['thumbnail'] + '" alt=""></span>';
                    html += '<div class="media_info">'+
                    '<span class="tit">' + data['title'] + '</span>';
                    html += '<ul class="list">'+
                    '<li class="sort">' + data['sort'] + '</li>' +
                    '<li class="time">' + data['date'] + '</li></ul></div></a></li>';
                }
                    _this.mediaList.append(html);
                 if(parseInt(data['season_no']) === 10) {
                        _this.mediaList.find($('.video, .news').eq(index)).addClass('contenders');
                        _this.mediaList.find($('.video, .news').eq(index)).data('seasonNo', 10);
                    } else if(parseInt(data['season_no']) === 20) {
                        _this.mediaList.find($('.video, .news').eq(index)).addClass('trials');
                        _this.mediaList.find($('.video, .news').eq(index)).data('seasonNo', 20);
                    } else if(parseInt(data['season_no']) === 30) {
                        _this.mediaList.find($('.video, .news').eq(index)).addClass('division');
                        _this.mediaList.find($('.video, .news').eq(index)).data('seasonNo', 30);
                    }
            });
        },
        reInit : function () {
            if (!(this.wrap).length) return;
            this.setDataFunc();
        }
    };


    $(function () {
        win.OVERWATCH.Main.slickSlideCall.init();
        win.MainVisualSlide = new win.OVERWATCH.Main.MainVisualSlide();
        win.MainNextScheduleSlick = new win.OVERWATCH.Main.MainNextScheduleSlick();
        win.MainStandingSlick = new win.OVERWATCH.Main.MainStandingSlick();
        win.MainMedia = new win.OVERWATCH.Main.MainMedia();
    });

})(window, window.jQuery, window.document);