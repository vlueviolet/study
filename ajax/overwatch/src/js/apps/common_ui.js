(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Common = win.OVERWATCH.Common || {};

    var UTIL = win.OVERWATCH.Common.util,
        PAGE = win.OVERWATCH.page;

    // 공통 레이어 팝업
    win.OVERWATCH.Common.commonLayer = win.OVERWATCH.Common.commonLayer || {};
    win.OVERWATCH.Common.commonLayer = function(args) {
        var defParams = {
            btnElements : '.js-layer-btn button',
            layerWrapElement : '.layer_wrap',
            layerElement : '.layer_content',
            closeElements : '.btn_close',
            speed : 150,
            viewBefore : null,
            viewAfter : null,
            closeBefore : null,
            closeAfter : null
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.layerWrap = $(this.opts.layerWrapElement)).length) return;
        this.init();
    }
    win.OVERWATCH.Common.commonLayer.prototype = {
        init : function () {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.layerObj = this.layerWrap.find(this.opts.layerElement);
            this.closeBtn = this.layerWrap.find(this.opts.closeElements);
            this.btnObj = $(this.opts.btnElements);
        },
        initLayout : function () {
            this.arr = [];
            this.zindex = parseInt(this.layerWrap.css('zIndex'));
        },
        bindEvents : function () {
            this.closeBtn.on('click', $.proxy(this.layerClickOutside, this));
            // this.layerObj.on('keydown', $.proxy(this.escapeFunc, this));
        },
        layerView : function (target) {
            this.layerWrap = $(target);
            this.outCallback('viewBefore');
            this.arr.push(this.layerWrap);
            for(var i = 0, max = this.arr.length ; i < max ; i++) {
                this.arr[i].css('zIndex', this.zindex+i);
            }
            this.showAfterBugFunc();
            this.arr[this.arr.length-1].stop().fadeIn(this.opts.speed);
        },
        showAfterBugFunc : function () {
            win.clearTimeout(this.showAfterTimeout);
            this.showAfterTimeout = win.setTimeout($.proxy(this.layerViewAfter, this), 30);
        },
        layerViewAfter : function () {
            this.outSideEvents(true);
            PAGE.scrollLock(true);
            this.outCallback('viewAfter');
        },
        layerClickOutside : function () {
            if(this.arr.length === 0) return;
            this.outCallback('closeBefore');
            win.clearTimeout(this.closeBeforeTimeout);
            this.closeBeforeTimeout = win.setTimeout($.proxy(this.hideBeforeBugFunc, this), 30);
            this.outSideEvents(false);
        },
        hideBeforeBugFunc : function () {
            this.arr[this.arr.length-1].stop().fadeOut(this.opts.speed);
            this.hideAfterBugFunc();
        },
        hideAfterBugFunc : function () {
            win.clearTimeout(this.closeAfterTimeout);
            this.closeAfterTimeout = win.setTimeout($.proxy(this.layerCloseAfter, this), 30);
        },
        layerCloseAfter : function (e) {
            this.arr.pop();
            this.layerClose();

            if(this.arr.length <= 0) {
                PAGE.scrollLock(false);
            }
            this.outCallback('closeAfter');
        },
        layerClose : function () {
            if(this.arr.length === 0) return;
            this.arr[this.arr.length-1].triggerHandler('clickoutside');
            this.outSideEvents(true);
        },
        outSideEvents : function (type) {
            if(this.arr.length === 0) return;
            for(var i = 0, max = this.arr.length ; i < max ; i++) {
                this.arr[i].find(this.layerObj).off('clickoutside touchendoutside');
            }
            if(type) {
                this.arr[this.arr.length-1].find(this.layerObj).on('clickoutside touchendoutside', $.proxy(this.layerClickOutside, this));
            } else {
                this.arr[this.arr.length-1].children().off('clickoutside touchendoutside');
            }
        },
        escapeFunc : function (e) {
            var keyCode = e.which || e.keyCode;
            if (keyCode !== 27) return;
            this.layerClose();
        },
        outCallback : function (type) {
            var callbackObject = this.opts[type];
            if (callbackObject !== null) {
                callbackObject();
            }
        },
    }

    //GNB 슬라이드
    win.OVERWATCH.Common.GnbSlick = win.OVERWATCH.Common.GnbSlick || {};
    win.OVERWATCH.Common.GnbSlick = function (args) {
        var defParams = {
            slickOpts : {
                dots: false,
                infinite: false,
                speed: 0,
                fade: false,
                cssEase: 'linear',
                autoplay:false,
                slidesToShow: 4,
                slidesToScroll: 1,
                arrows : false,
                responsive: [
                    {
                    breakpoint: 1441,
                        settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        arrows : true
                        }
                    }
                ]
            },
            wrap : '.header_top',
            slickWrap : '.nav_area',
            slickWrapChild : '.nav_cont'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Common.GnbSlick.prototype = {
        init : function() {
            this.setElements();
            this.bindEvents();
            this.buildSlick();
            this.afterSetElements();
            this.afterBindeEvents();
        },
        setElements : function () {
            this.slickWrap = this.wrap.find(this.opts.slickWrap);
            this.slickWrapChild = this.wrap.find(this.opts.slickWrapChild);
        },
        afterSetElements : function () {
            this.btnPrev = $('.slick-prev');
            this.btnNext = $('.slick-next');
        },
        bindEvents : function () {
            $(win).on('resize', $.proxy(this.resizeFunc, this));
        },
        afterBindeEvents : function () {},
        setSlideViewNum : function () {
            this.opts.slickOpts.slidesToShow = parseInt(this.slickWrap.outerWidth(true) / this.slickWrapChild.outerWidth(true));
        },
        buildSlick : function () {
            this.slickWrap.slick(this.opts.slickOpts);
        },
        resizeFunc : function () {

        },
        reInit : function () {

        }
    };

    win.OVERWATCH.Common.MainGnbSticky = win.OVERWATCH.Common.MainGnbSticky || {};
    win.OVERWATCH.Common.MainGnbSticky = function (args) {
        var defParams = {
            header : '.header',
            headerTop : '.header_top',
            fixedClass : 'fixed'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.header = $(this.opts.header)).length) return;
        this.init();
    }
    win.OVERWATCH.Common.MainGnbSticky.prototype = {
        init : function() {
            this.setElements();
            this.initLayout();
            this.createOpts();
            this.scrollFunc();
            this.setWrapHeight();
            this.bindEvents();
        },
        setElements : function () {
            this.headerTop = this.header.find(this.opts.headerTop);
        },
        initLayout : function () {
            this.docHeight = $(document).height();
        },
        bindEvents : function () {
            $(win).on('scroll', $.proxy(this.scrollFunc,this));
            $(win).on('resize', $.proxy(this.resizeFunc,this));
        },
        createOpts : function () {
            this.headerTopOffset = this.headerTop.offset().top;
            this.headerOuterHeight = this.headerTop.outerHeight();
        },
        setWrapHeight : function () {
            this.header.css('height', this.headerOuterHeight);
        },
        scrollFunc : function () {
            var winTop = $(win).scrollTop();
            if(this.docHeight !== $(document).height()) {
                this.headerTopOffset = this.headerTop.offset().top;
                this.docHeight = $(document).height();
            }
            if(winTop > this.headerTopOffset) {
                this.headerTop.addClass(this.opts.fixedClass);
            } else {
                this.headerTop.removeClass(this.opts.fixedClass);
            }
        },
        resizeFunc : function () {
            this.headerOuterHeight = this.headerTop.height();
            this.setWrapHeight();
        }
    };

    win.OVERWATCH.Common.SubMainSticky = win.OVERWATCH.Common.SubMainSticky || {};
    win.OVERWATCH.Common.SubMainSticky = function (args) {
        var defParams = {
            header : '#header',
            topContent : '.top_content',
            topContentTop : '.top_inner',
            subNav : '#sub_nav',
            fixedClass : 'fixed'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.subNav = $(this.opts.subNav)).length || !(this.header = $(this.opts.header)).length) return;
        this.init();
    }
    win.OVERWATCH.Common.SubMainSticky.prototype = {
        init : function() {
            this.setElements();
            this.createOpts();
            this.scrollFunc();
            this.setWrapHeight();
            this.bindEvents();
        },
        setElements : function () {
            this.topContent = $(this.opts.topContent);
            this.topContentTop = this.topContent.find(this.opts.topContentTop);
            this.subNav = this.topContent.find(this.opts.subNav);
        },
        bindEvents : function () {
            $(win).on('scroll', $.proxy(this.scrollFunc,this));
            $(win).on('resize', $.proxy(this.resizeFunc,this));
        },
        createOpts : function () {
            this.subNavOffset = this.subNav.offset().top;
            this.topContentOuterHeight = this.topContent.outerHeight();
        },
        setWrapHeight : function () {
            this.topContent.css('height', this.topContentOuterHeight);
        },
        scrollFunc : function () {
            var winTop = $(win).scrollTop();
            if(winTop >= this.subNavOffset) {
                this.topContentTop.addClass(this.opts.fixedClass);
            } else {
                this.topContentTop.removeClass(this.opts.fixedClass);
            }
        },
        resizeFunc : function () {
            this.topContentOuterHeight = this.topContent.height();
            this.setWrapHeight();
        }
    };

    win.OVERWATCH.Common.TopBtn = function (args) {
        var defParams = {
            btnTop : '.btn_top',
            minObj : '#content',
            speed : 100
        };
         this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.btnTop = $(this.opts.btnTop)).length) return;
        this.init();
    };
    win.OVERWATCH.Common.TopBtn.prototype = {
        init : function () {
            this.setElements();
            this.bindEvents();
            this.initLayout();
        },
        setElements : function () {
            this.minObj = $(this.opts.minObj);
        },
        initLayout : function () {
            this.scrollFunc();
        },
        bindEvents : function () {
            $(win).on('scroll', $.proxy(this.scrollFunc, this));
            this.btnTop.on('click', $.proxy(this.clickFunc, this));
        },
        scrollFunc : function () {
            var winTop = $(win).scrollTop(),
            winHeight = $(win).height();
            this.minOffsetTop = this.minObj.offset().top;

            if (winTop > this.minOffsetTop) {
                if (!this.btnTop.is(':visible')) {
                    this.btnTop.stop().fadeIn(this.opts.speed);
                }
            } else {
                if (this.btnTop.is(':visible')) {
                    this.btnTop.stop().fadeOut(this.opts.speed);
                }
            }
        },
        clickFunc : function (e) {
            e.preventDefault();
            if ($('html, body').is(':animated')) return;
            $('html, body').stop().animate({ scrollTop : 0 }, 300);
        }
    };

    win.OVERWATCH.Common.CommonBanner = win.OVERWATCH.Common.CommonBanner || {};
    win.OVERWATCH.Common.CommonBanner = function (args) {
        var defParams = {
            wrap : '.common_banner',
            btnObj : '.close'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Common.CommonBanner.prototype = {
        init : function() {
            this.setElements();
            this.bindEvents();
        },
        setElements : function () {
            this.btnObj = this.wrap.find(this.opts.btnObj);
        },
        bindEvents : function () {
            this.btnObj.on('click', $.proxy(this.clickFunc, this));
        },
        clickFunc : function (e) {
            e.preventDefault();
            this.wrap.stop(true, true).animate({
                'height' : 0
            }, 300, $.proxy(function () {
                this.wrap.hide();
            }, this));
        }
    };

    win.OVERWATCH.Common.SelectBox = win.OVERWATCH.Common.SelectBox || {};
    win.OVERWATCH.Common.SelectBox = function (args) {
        var defParams = {
            selectWrap : '.sel_bx',
            selectBtn : '.sel_tit',
            selectItem : '.sel_item',
            activeClass :'on'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.selectWrap = $(this.opts.selectWrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Common.SelectBox.prototype = {
        init : function() {
            this.setElements();
            this.bindEvents();
        },
        setElements : function () {
            this.selectWrap = $(this.opts.selectWrap);
            this.selectItem = this.selectWrap.find(this.opts.selectItem);
            this.selectBtn = this.selectWrap.find(this.opts.selectBtn);
            this.selectBtnChild = this.selectBtn.children();
        },
        bindEvents : function () {
            this.selectWrap.on('click', '.sel_tit', $.proxy(this.clickOpenFunc, this));
            this.selectItem.on('click', 'a', $.proxy(this.clickListFunc, this));
        },
        clickOpenFunc : function (e) {
            e.preventDefault();
            var parent = $(e.delegateTarget),
                    target = $(e.currentTarget);
            if(parent.hasClass(this.opts.activeClass)) {
                parent.removeClass(this.opts.activeClass);
                parent.off('clickoutside touchendoutside');
            } else{
                parent.addClass(this.opts.activeClass);
                parent.on('clickoutside touchendoutside', $.proxy(function () {
                    this.outSideEvents(parent);
                }, this));
            }
        },
        clickListFunc : function (e) {
            e.preventDefault();
            var parent = $(e.delegateTarget),
                    target = $(e.currentTarget),
                    targetChild = target.children(),
                    selectWrap = target.closest(this.selectWrap),
                    selectBtn = selectWrap.find(this.selectBtn);
            selectBtn.children().text(targetChild.text());
            selectWrap.removeClass(this.opts.activeClass);
        },
        outSideEvents : function (target) {
            target.removeClass(this.opts.activeClass);
            target.off('clickoutside touchendoutside');
        },
        unBindeEvents : function () {
            this.selectWrap.off('click', '.sel_tit', $.proxy(this.clickOpenFunc, this));
            this.selectItem.off('click', 'a', $.proxy(this.clickListFunc, this));
        },
        reInit : function () {
            this.unBindeEvents();
            this.setElements();
            this.bindEvents();
        }
    };

    win.OVERWATCH.Common.slickSlide = win.OVERWATCH.Common.slickSlide || {};
    win.OVERWATCH.Common.slickSlide = function (container) {
        var defParams = {
            slickOpts : {
                 dots : true,
                  infinite : true,
                  speed : 400,
                  cssEase : 'linear',
                  autoplay : false,
                  autoplaySpeed : 3000
            },
            slickWrap : '.main_bx'
        };
        this.opts = defParams;
        this.wrap = $(container);
        this.init();
    }
    win.OVERWATCH.Common.slickSlide.prototype = {
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
    win.OVERWATCH.Common.slickSlideCall = {
        init : function () {
            this.setElements();
            this.buildSlickCall();
        },
        setElements : function () {
            this.slideWrap = $('.media_area');
        },
        buildSlickCall : function () {
            for (var i = 0, max = this.slideWrap.length; i < max; i++) {
                new win.OVERWATCH.Common.slickSlide(this.slideWrap.eq(i));
            }
        }
    };

    // footer
    win.OVERWATCH.Common.FooterFamily = win.OVERWATCH.Common.FooterFamily || {};
    win.OVERWATCH.Common.FooterFamily = function (args) {
        var defParams = {
            wrap : '#footer',
            familyCont : '.family',
            clickObj : '.menu_txt',
            familyList : '.family_lst',
            activeClass : 'on'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Common.FooterFamily.prototype = {
        init : function() {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        initLayout : function () {
            this.familyCont.removeClass(this.opts.activeClass);
        },
        setElements : function () {
            this.familyCont = this.wrap.find(this.opts.familyCont);
            this.clickObj = this.wrap.find(this.opts.clickObj);
            this.familyList = this.wrap.find(this.opts.familyList);
        },
        bindEvents : function () {
            this.familyCont.on('click', this.opts.clickObj, $.proxy(this.clickFunc, this));
        },
        clickFunc : function (e) {
            e.preventDefault();
            var parent = $(e.delegateTarget),
                target = $(e.currentTarget);
            if(parent.hasClass(this.opts.activeClass)) {
                parent.removeClass(this.opts.activeClass);
                parent.off('clickoutside touchendoutside');
            } else {
                parent.addClass(this.opts.activeClass);
                parent.on('clickoutside touchendoutside', $.proxy(function () {
                    this.outSideEvents(parent);
                }, this));
            }
        },
        outSideEvents : function (target) {
            target.removeClass(this.opts.activeClass);
            target.off('clickoutside touchendoutside');
        }
    };


    // 전적보기 레이어팝업
    win.OVERWATCH.Common.ScoreLayer = function (args) {
        var defParams = {
            wrap : '#layer_score',
            title : '.layer_tit',
            date : '.match_date',
            teamBox : '.team_bx',
            teamBox1 : '.team_bx1',
            teamBox2 : '.team_bx2',
            team :'.name',
            teamLogo :'.team_logo',
            detailBox : '.match_detail',
            targetField : '.score_list',
            clickObj : '.bracket_area .team_bx,.standing .detail_item',
            btnHighlight : '.btn_highlight',
            btnScheduleVideo : '.schedule_area .btn_vod',
            layer : '#layer_media',
            mainVideo : '.main_video',
            mediaTitle : '.layer_tit',
            mediaDate : '.match_date',
            mediaTeam1 : '.team1',
            mediaTeam2 : '.team2',
            mediaScore1 : '.score1',
            mediaScore2 : '.score2',
        };
        this.opts = UTIL.def(defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    };
    win.OVERWATCH.Common.ScoreLayer.prototype = {
        init : function () {
            this.onLoadTwitchApi();
            this.onLoadYoutubeApi();
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        initLayout : function () {
            this.resetData();
            this.type = true;
            this.isHightlight = false;
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
        setElements : function () {
            this.title = this.wrap.find(this.opts.title);
            this.date = this.wrap.find(this.opts.date);
            this.teamBox = this.wrap.find(this.opts.teamBox);
            this.teamBox1 = this.wrap.find(this.opts.teamBox1);
            this.team1 = this.teamBox1.find(this.opts.team);
            this.logo1 = this.teamBox1.find(this.opts.teamLogo);
            this.teamBox2 = this.wrap.find(this.opts.teamBox2);
            this.team2 = this.teamBox2.find(this.opts.team);
            this.logo2 = this.teamBox2.find(this.opts.teamLogo);
            this.scoreBox = this.wrap.find(this.opts.scoreBox);
            this.score1 = this.teamBox1.find('.score1');
            this.score2 = this.teamBox2.find('.score2');
            this.detailBox = this.wrap.find(this.opts.detailBox);
            this.targetField = this.detailBox.find(this.opts.targetField);
            this.clickObj = $(this.opts.clickObj);
            this.btnHighlight = this.wrap.find(this.opts.btnHighlight);
            this.btnScheduleVideo = $(this.opts.btnScheduleVideo);

            // 미디어 레이어
            this.layer = $(this.opts.layer);
            this.mainVideo = this.layer.find(this.opts.mainVideo);
            this.mediaTitle = this.layer.find(this.opts.mainTitle);
            this.mediaDate = this.layer.find(this.opts.mediaDate);
            this.mediaTeam1 = this.layer.find(this.opts.team1);
            this.mediaTeam2 = this.layer.find(this.opts.team2);
            this.mediaScore1 = this.layer.find(this.opts.score1);
            this.mediaScore2 = this.layer.find(this.opts.score2);
            this.mediaDate = this.layer.find(this.opts.date);
        },
        bindEvents : function () {
            $('body').on('click', this.opts.clickObj, $.proxy(this.clickFunc, this));   // 전장 팝업
            this.btnHighlight.on('click', $.proxy(this.clickHighlight, this));  // 전장 팝업 > 하이라이트 보기
            this.btnScheduleVideo.on('click', $.proxy(this.clickMedia, this));
        },
        clickMedia : function (e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            if(target.hasClass('.disabled')) return;
            this.clickHighlight(e);
        },
        clickHighlight : function (e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            this.videoNo = target.data('videoNo').toString();
            this.layer.css({
                display : 'none',
                opacity : 1,
                zIndex : 110
            });
            window.commonLayer.opts.viewBefore = $.proxy(function () {  //레이어 닫힌 후 실행구문
                if(!this.isHightlight) {
                    this.getDataFunc();
                }
                this.setLayer();
                window.commonLayer.opts.viewBefore = null;
            }, this);
            window.commonLayer.layerView(this.layer);
            window.commonLayer.opts.closeAfter = $.proxy(function () {
                this.mainVideo.children().remove();
                this.type = true;
                window.commonLayer.opts.closeAfter = null;
            }, this);
        },
        setLayer : function () {
             $.each(this.data.score, $.proxy(function (index, data) {
                if(this.videoNo === data['no'].toString()) {
                    this.layer.find($(this.opts.mediaTitle)).text(data['video_title']);
                    this.layer.find($(this.opts.mediaTeam1)).text(data['teamA_name']);
                    this.layer.find($(this.opts.mediaTeam2)).text(data['teamB_name']);
                    this.layer.find($(this.opts.mediaScore1)).text(data['teamA_score']);
                    this.layer.find($(this.opts.mediaScore2)).text(data['teamB_score']);
                    this.layer.find($(this.opts.mediaDate)).text(data['date']);

                    if(data['video_type'] === 'twitch') {
                        this.setTwitch(data['video_url']);
                    } else if(data['video_type'] === 'youtube') {
                        this.setYoutube(data['video_url']);
                    }
                }
            },this));
             this.isHightlight = true;
        },
        setYoutubeCode : function (url) {
            this.initCode = url.split('https://www.youtube.com/watch?v=')[1].split('&t=');
            this.youtubeCode = this.initCode[0];
            if(!(this.initCode[1] === undefined)) {
                this.startSeconds = parseInt(this.initCode[1].split('s')[0]);
            } else {
                this.startSeconds = 0;
            }
        },
        setYoutube : function (url) {
            this.setYoutubeCode(url);
            this.mainVideo.append('<div id="player"></div>');
            this.onYouTubeIframeAPIReady();
        },
        onYouTubeIframeAPIReady : function () {
            this.youtubePlayer = new win.YT.Player('player', {
                playerVars : {
                    autoplay : 0,
                    controls : 1,
                    showinfo : 0,
                    rel : 0,
                },
                events : {
                    onReady : $.proxy(this.onPlayerReady, this),
                    onStateChange : $.proxy(this.onPlayerStateChange, this)
                },
                fs : 1
            });
        },
        onPlayerReady : function (e) {
            this.youtubePlayer.loadVideoById({
                videoId : this.youtubeCode,
                startSeconds : this.startSeconds
            });
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
            this.mainVideo.append('<div id="player"></div>');
            this.media = new Twitch.Player("player", options);
        },
        clickFunc : function (e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            if(!target.data('matchNo')) return;
            this.matchNo = target.data('matchNo').toString();
            if(this.matchNo === null || this.matchNo === undefined) return;

            // 결과가 안나온 경기는 전적 팝업 노출 없음
            if($('.bracket_wrap').length > 0) {
                for(var i = 0, max = target.children('.team').length ; i < max ; i++) {
                    this.result = target.children('.team').eq(i).hasClass('win') || target.children('.team').eq(i).hasClass('lose');
                }
                if(!this.result) return;
            }

            window.commonLayer.opts.viewBefore = $.proxy(function () {  //레이어 닫힌 후 실행구문
                this.resetData();
                this.getDataFunc();
                window.commonLayer.opts.viewBefore = null;  //한번 쓰고 초기화
            }, this);
            window.commonLayer.layerView('#layer_score');
            window.commonLayer.opts.closeAfter = $.proxy(function () {
                this.type = true;
                window.commonLayer.opts.closeAfter = null;
            }, this);
        },
        getDataFunc : function () {
            if(!this.type) return;
            this.type = false;
            this.setDataFunc(window.commonScoreJSON);
        },
        setDataFunc : function (data) {
            if(data === undefined) return;
            this.data = data;
            $.each(this.data.score, $.proxy(function (index, score) {
                if(this.matchNo === score['no'].toString()) {
                    this.title.text(score['title']);
                    this.date.text(score['date']);

                    this.team1.find('em').text(score['teamA_name']);
                    this.team2.find('em').text(score['teamB_name']);
                    this.logo1.data('teamNo', score['teamA_no']);
                    this.logo1.children().attr('src', score['teamA_img']);
                    this.logo2.data('teamNo', score['teamB_no']);
                    this.logo2.children().attr('src', score['teamB_img']);

                    this.score1.text(score['teamA_score']);
                    this.score2.text(score['teamB_score']);

                    // 클래스 초기화
                    if(this.teamBox.hasClass('win') || this.teamBox.hasClass('lose') || this.teamBox.hasClass('bye') || this.teamBox.hasClass('out')) {
                        this.teamBox.removeClass('win');
                        this.teamBox.removeClass('lose');
                        this.teamBox.removeClass('bye');
                        this.teamBox.removeClass('out');
                    }

                    if(parseInt(score['teamA_score']) > parseInt(score['teamB_score'])) {
                        this.teamBox1.addClass('win');
                        this.teamBox2.addClass('lose');
                    } else {
                        this.teamBox1.addClass('lose');
                        this.teamBox2.addClass('win');
                    }

                    if(score['teamA_BYE'] || score['teamB_BYE']) {    // 키값이 있는 경우
                        if(score['teamA_BYE'] !== '' || score['teamB_BYE'] !== '') {
                            if(score['teamA_BYE'] === true) {
                                this.teamBox1.addClass('bye');
                                this.teamBox2.addClass('out');
                            } else if(score['teamB_BYE'] === true) {
                                this.teamBox1.addClass('out');
                                this.teamBox2.addClass('bye');
                            }
                        }
                    }

                    if(score['detail']) {
                        var _this = this;
                        this.dataTemplate = [
                            '<li class="score_item" id="{{id}}">',
                            '<a href="#" class="score_cont">',
                            '<div class="score score1">{{score1}}</div>',
                            '<div class="field">',
                            '<div class="field_in">{{field}}<span class="btn_go">PLAY</span></div>',
                            '</div>',
                            '<div class="score score2">{{score2}}</div>',
                            '</a>',
                            '</li>'
                        ].join('\n');
                        $.each(score['detail'], function (index, detail) {
                            var html = _this.dataTemplate;
                            html = html.replace(/{{score1}}/g, detail['scoreA']);
                            html = html.replace(/{{field}}/g, detail['field_name']);
                            html = html.replace(/{{score2}}/g, detail['scoreB']);
                            html = html.replace(/{{id}}/g, 'field'+detail['field_no']);

                            _this.targetField.append(html);

                            if(detail['video_url'] !== undefined) {
                                $('#field'+ detail['field_no']).find($('.score_cont')).attr({
                                    'href' : detail['video_url'],
                                    'target' : 'blank'
                                }).show();
                            } else {
                                $('#field'+ detail['field_no']).find($('.score_cont')).attr('href', 'javascript:void(0);').show();
                                $('#field'+ detail['field_no']).find($('.score_cont')).css('cursor', 'default');
                                $('#field'+ detail['field_no']).find($('.btn_go')).hide();
                            }

                            if(parseInt(detail['scoreA']) > parseInt(detail['scoreB'])) {
                                $('#field'+ detail['field_no']).find($('.score1')).addClass('win');
                            } else if(parseInt(detail['scoreA']) < parseInt(detail['scoreB'])) {
                                $('#field'+ detail['field_no']).find($('.score2')).addClass('win');
                            }

                            if(detail['field_type']) {  // 무승부 셋트
                                $('#field'+ detail['field_no']).find('.field').addClass('tie');
                            }
                        });
                    }
                    if(score['video_url']) {
                        this.btnHighlight.data({
                            'videoType' : score['video_type'],
                            'seasonNo' : score['season_no'],
                            'videoNo' : score['no']
                        });
                        this.btnHighlight.show();
                    } else {
                        this.btnHighlight.hide();
                    }
                }
            }, this));
        },
        resetData : function () {
            this.score1.removeClass('win');
            this.score2.removeClass('win');
            this.targetField.children().remove();
        }
    };

        // 팀 json 호출
    win.OVERWATCH.Common.DataCall = {
        getData : function (searchUrl) {
            return $.ajax({
                cache : false,
                type : 'GET',
                url : searchUrl,
                dataType : 'json',
                success : function () {

                }
            });
        }
    };

    // 팀 정보 레이어팝업
    win.OVERWATCH.Common.TeamLayer = win.OVERWATCH.Common.TeamLayer || {};
    win.OVERWATCH.Common.TeamLayer = function(args) {
        var defParams = {
            wrap : '#layer_team',
            closeBtn : '.btn_close',
            teamName : '.layer_tit span',
            area : '.area',
            txt : '.txt',
            logo : '.logo',
            btnObj : 'a.team_logo, button.team_logo',
            social : '.social',
            teamPicture : '.team_picture',
            memberArea : '.member_area',
            memberBox : '#memberBox',
            memberList : '.list_member'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Common.TeamLayer.prototype = {
        init : function () {
            this.setElements();
            this.initLayout();
            this.setURL();
            this.afterSetElements();
            this.bindEvents();
        },
        initLayout : function () {
            this.wrap.css({
                display : 'block',
                opacity : 0,
                zIndex : -1
            });
            this.area.hide();
        },
        setElements : function () {
            this.teamName = this.wrap.find(this.opts.teamName);
            this.area = this.wrap.find(this.opts.area);
            this.txt = this.wrap.find(this.opts.txt);
            this.logo = this.wrap.find(this.opts.logo);
            this.social = this.wrap.find(this.opts.social);
            this.teamPicture = this.wrap.find(this.opts.teamPicture);
            this.memberArea = this.wrap.find(this.opts.memberArea);
            this.memberBox = this.wrap.find(this.opts.memberBox);
            this.memberList = this.memberArea.find(this.opts.memberList);
            this.btnObj = $(this.opts.btnObj);
            this.closeBtn = this.wrap.find(this.opts.closeBtn);
        },
        setURL : function () {
            this.defaultTeamLogoImgUrl = '../images/team/@team_logo_big_default.png';
            this.defaultTeamImgUrl = '../images/team/@team_picture_default.jpg';
            this.defaultPlayerImgUrl = '../images/team/@team_member_default.png';
        },
        afterSetElements : function () {
        },
        bindEvents : function () {
            $('body').on('click', this.opts.btnObj, $.proxy(this.clickFunc, this));
        },
        clickFunc : function (e) {
            e.preventDefault();
            e.stopPropagation();
            var target = $(e.currentTarget),
                teamNo = parseInt(target.data('teamNo'));

            if(target.data('teamNo') === undefined) return;

            /* 디자인 수정시 주석 처리 영역 */
            this.resetData();
            this.setDataFunc(teamNo);
            /* 디자인 수정시 주석 처리 영역 */

            this.wrap.css({
                display : 'none',
                opacity : 1,
                zIndex : 110
            });
            window.commonLayer.opts.viewAfter = $.proxy(function () {  //레이어 닫힌 후 실행구문
                this.TeamLayerSticky.setWrapHeight();
                this.TeamLayerSticky.createOffset();
                window.commonLayer.opts.viewAfter = null;  //한번 쓰고 초기화
            }, this);
            window.commonLayer.layerView(this.wrap);
            window.commonLayer.opts.closeAfter = $.proxy(function () {  //레이어 닫힌 후 실행구문
                this.resetData();
                window.commonLayer.opts.closeAfter = null;  //한번 쓰고 초기화
            }, this);
        },
        resetData : function () {
            this.memberArea.hide();
            this.memberBox.children().remove();
            this.teamPicture.children().attr('src', '');
        },
        setDataFunc : function (teamNo) {
            $.each(window.commonTeamJSON.teams, $.proxy(function (index, data) {
                this.data = data;
                if(teamNo === parseInt(this.data.team_no)) {
                    this.teamName.text(data['team_name']);
                    // this.area.text(data['location']);
                    this.txt.text(data['team_introduction']);
                    // 팀 로고 유효성 검사
                    this.teamLogoPictureFunc(data['logo_img']);
                    // 팀 소셜 유효성 검사
                    this.teamSocialFunc(data['social']);
                    // 팀 단체사진 유효성 검사
                    this.teamPictureFunc(data['team_picture']);
                    // 선수 명단
                    if(data['players']) {
                        this.memberArea.show();
                        var html = '<ul class="list_member">';
                        $.each(data['players'], $.proxy(function (index2, player) {
                            html += '<li>';
                            // 선수 이미지 유효성 검사
                            html += this.playerPictureFunc(player['image_file_path']);
                            html +='<div class="info">';
                            html += this.playerRoleFunc(player['role_code'],player['candidate']);
                            html += '<span class="nickname">'+player['battle_tag']+'</span>'+'<span class="name">'+player['player_name']+'</span>'+'</div>'+'</li>';
                        }, this));
                        html += '</ul>';
                        this.memberBox.append(html);
                    } else {
                        this.memberArea.hide();
                    }
                }
            }, this));
        },
        teamLogoPictureFunc : function (url) {
            if(url) {
                this.logo.attr('src', url);
            }
            else {
                this.logo.attr('src', this.defaultTeamLogoImgUrl);
            }
        },
        teamSocialFunc : function (url) {
            var html = '';
            this.social.children().remove();
            for(var key in url){
                for(var key2 in url[key]){
                    if(key2 === 'homepage') {
                        if(url[key][key2] !== '') {
                            html += '<li><a href="' + url[key][key2] + '" target="_blank" class="homepage"><span class="blind">홈페이지</span></a></li>';
                        }
                        if(url[key][key2] === '') {
                            html += '<li><a href="javascript:void(0);" target="_blank" class="homepage disabled"><span class="blind">홈페이지</span></a></li>';
                        }
                    }

                    if(key2 === 'facebook') {
                        if(url[key][key2] !== '') {
                            html += '<li><a href="' + url[key][key2] + '" target="_blank" class="facebook"><span class="blind">페이스북</span></a></li>';
                        }
                        if(url[key][key2] === '') {
                            html += '<li><a href="javascript:void(0);" target="_blank" class="facebook disabled"><span class="blind">페이스북</span></a></li>';
                        }
                    }

                    if(key2 === 'twitter') {
                        if(url[key][key2] !== '') {
                            html += '<li><a href="' + url[key][key2] + '" target="_blank" class="twitter"><span class="blind">트위터</span></a></li>';
                        }
                        if(url[key][key2] === '') {
                            html += '<li><a href="javascript:void(0);" target="_blank" class="twitter disabled"><span class="blind">트위터</span></a></li>';
                        }
                    }

                    if(key2 === 'instagram') {
                        if(url[key][key2] !== '') {
                            html += '<li><a href="' + url[key][key2] + '" target="_blank" class="instagram"><span class="blind">인스타그램</span></a></li>';
                        }
                        if(url[key][key2] === '') {
                            html += '<li><a href="javascript:void(0);" target="_blank" class="instagram disabled"><span class="blind">인스타그램</span></a></li>';
                        }
                    }

                    if(key2 === 'youtube') {
                        if(url[key][key2] !== '') {
                            html += '<li><a href="' + url[key][key2] + '" target="_blank" class="youtube"><span class="blind">유투브</span></a></li>';
                        }
                        if(url[key][key2] === '') {
                            html += '<li><a href="javascript:void(0);" target="_blank" class="youtube disabled"><span class="blind">유투브</span></a></li>';
                        }
                    }

                    if(key2 === 'twitch') {
                        if(url[key][key2] !== '') {
                            html += '<li><a href="' + url[key][key2] + '" target="_blank" class="twitch"><span class="blind">트위치</span></a></li>';
                        }
                        if(url[key][key2] === '') {
                            html += '<li><a href="javascript:void(0);" target="_blank" class="twitch disabled"><span class="blind">트위치</span></a></li>';
                        }
                    }
                }
            }
            this.social.append(html);
        },
        teamPictureFunc : function (url) {
            if(url === null) {
                this.teamPicture.remove();
            }
            else {
                this.teamPicture.find('img').attr('src', url);
            }
        },
        playerPictureFunc : function (url) {
            var html = '';
            if(url) {
                html+='<span class="thumb"><img src="'+ url +'" alt=""></span>';
            } else {
                html+= '<span class="thumb"><img src="'+ this.defaultPlayerImgUrl + '" alt=""></span>';
            }
            return html;
        },
        playerRoleFunc : function (url, candidate) {
            var html = '';
            if(candidate || candidate === true) {
                html += '<span class="ico"><em>후보</em></span>';
            }
            if(url === 'CG0006010') {   // 공격
                html += '<span class="ico offense"><img src="../images/icon_offense.png" alt="공격"></span>';
            } else if(url === 'CG0006020') {   // 돌격
                html += '<span class="ico tank"><img src="../images/icon_tank.png" alt="돌격"></span>';
            } else if(url === 'CG0006030') {    // 플렉스
                html += '<span class="ico flex"><img src="../images/icon_flex.png" alt="플렉스"></span>';
            } else if(url === 'CG0006040') {   // 지원
                html += '<span class="ico support"><img src="../images/icon_support.png" alt="지원"></span>';
            }
            return html;
        },
        layerViewAfter : function () {
            this.wrap.children().on('clickoutside', $.proxy(this.closeFunc, this));
        },
        reInit : function () {
            if (!(this.wrap).length) return;
            this.TeamLayerSticky = new win.OVERWATCH.Common.TeamLayerSticky();
        }
    };

    // 팀 레이어 sticky
    win.OVERWATCH.Common.TeamLayerSticky = win.OVERWATCH.Common.TeamLayerSticky || {};
    win.OVERWATCH.Common.TeamLayerSticky = function (args) {
        var defParams = {
            wrap : '#layer_team',
            topArea : '.top_area',
            topObj : '.layer_tit',
            btnObj : '.btn_close',
            fixedClass : 'fixed'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.topArea = $(this.opts.topArea)).length) return;
        this.init();
    }
    win.OVERWATCH.Common.TeamLayerSticky.prototype = {
        init : function() {
            this.setElements();
            this.initLayout();
            this.createOffset();
            this.scrollFunc();
            this.bindEvents();
        },
        initLayout : function () {
            var stickyWrapClass = 'js-' + this.topObj.attr('class') + '-wrap';
            this.topObj.wrap('<div class="' + stickyWrapClass + '"/>');
            this.topObjWrap = this.topObj.parent();
        },
        setElements : function () {
            this.wrap = $(this.opts.wrap);
            this.topArea = this.wrap.find(this.opts.topArea);
            this.topObj = this.wrap.find(this.opts.topObj);
            this.btnObj = this.wrap.find(this.opts.btnObj);
        },
        bindEvents : function () {
            this.wrap.on('scroll', $.proxy(this.scrollFunc,this));
        },
        createOffset : function () {
            this.maxObjOffset = this.topObj.offset().top + this.topObj.outerHeight();
        },
        setWrapHeight : function () {
            this.topObjWrap.css('height', this.topObj.outerHeight(true));
        },
        scrollFunc : function () {
            this.quickFixedFunc();
        },
        quickFixedFunc  : function  () {
            var wrapTop = this.wrap.scrollTop();
            if(wrapTop >= this.maxObjOffset) {
                this.topObj.addClass(this.opts.fixedClass);
                this.btnObj.addClass('text_none');
            } else {
                this.topObj.removeClass(this.opts.fixedClass);
                this.btnObj.addClass('text_none');
            }
        }
    };


    $(function () {
        PAGE.init();
        win.commonLayer = new win.OVERWATCH.Common.commonLayer();
        win.GnbSlick = new win.OVERWATCH.Common.GnbSlick();
        win.MainGnbSticky = new win.OVERWATCH.Common.MainGnbSticky();
        win.SubMainSticky = new win.OVERWATCH.Common.SubMainSticky();
        win.TopBtn = new win.OVERWATCH.Common.TopBtn();
        win.CommonBanner = new win.OVERWATCH.Common.CommonBanner();
        win.SelectBox = new win.OVERWATCH.Common.SelectBox();
        win.OVERWATCH.Common.slickSlideCall.init();
        win.FooterFamily = new win.OVERWATCH.Common.FooterFamily();


        if($('html').hasClass('division')) {
            var commonTeamJSON = win.OVERWATCH.Common.DataCall.getData('../json/team_division.json');
            var commonScoreJSON = win.OVERWATCH.Common.DataCall.getData('../json/score_division.json');
        } else if($('html').hasClass('trials')) {
            var commonTeamJSON = win.OVERWATCH.Common.DataCall.getData('../json/team_trials.json');
            var commonScoreJSON = win.OVERWATCH.Common.DataCall.getData('../json/score_trials.json');
        } else if($('html').hasClass('contenders')) {
            var commonTeamJSON = win.OVERWATCH.Common.DataCall.getData('../json/team_contenders.json');
            var commonScoreJSON = win.OVERWATCH.Common.DataCall.getData('../json/score_contenders.json');
        } else {
            var commonTeamJSON = win.OVERWATCH.Common.DataCall.getData('../json/team.json');
        }
        commonTeamJSON.done(function (json) {
           win.commonTeamJSON = json;
           $('body').trigger('page.reposition');
        });

        if($('html').hasClass('division') || $('html').hasClass('trials') || $('html').hasClass('contenders')) {
            commonScoreJSON.done(function (json) {
               win.commonScoreJSON = json;
            });
        }
        win.ScoreLayer = new win.OVERWATCH.Common.ScoreLayer();  //전적보기 레이어
        // win.TeamLayer = new win.OVERWATCH.Common.TeamLayer();
        // win.OVERWATCH.Common.Pageobj.push(win.TeamLayer); //팀정보 레이어
    });

})(window, window.jQuery, window.document);