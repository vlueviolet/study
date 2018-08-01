(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Common = win.OVERWATCH.Common || {};
    win.OVERWATCH.Main = win.OVERWATCH.Main || {};

    var UTIL = win.OVERWATCH.Common.util,
        PAGE = win.OVERWATCH.page;
    win.minWidth = 720;

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
                responsive: [
                    {
                        breakpoint: win.minWidth,
                        settings: {
                        arrows: false,
                      }
                    }
                ]
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
            this.slideWrap = $('.visual_area');
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
                  vertical : true,
                  responsive: [
                    {
                        breakpoint: win.minWidth,
                        settings: {
                            arrows: false,
                            vertical: false,
                      }
                    }
                ]
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
                  autoplay:false,
                  adaptiveHeight: true
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

    win.OVERWATCH.Main.RecentlyResult = win.OVERWATCH.Main.RecentlyResult || {};
    win.OVERWATCH.Main.RecentlyResult = function (args) {
        var defParams = {
            slickOpts : {
                dots: true,
                infinite: true,
                speed: 300,
                fade: true,
                cssEase: 'linear',
                autoplay:false,
                responsive: [
                    {
                        breakpoint: win.minWidth,
                        settings: {
                        arrows: false,
                      }
                    }
                ]
            },
            wrap : '.recently_result',
            slickWrap : '.slide_wrap',
            slide : '.slide',
            btnObj : '.btn_view',
            viewObj : '.match_detail'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Main.RecentlyResult.prototype = {
        init : function() {
            this.setElements();
            this.buildSlick();
            this.bindEvents();
        },
        setElements : function () {
            this.slickWrap = this.wrap.find(this.opts.slickWrap);
            this.slide = this.wrap.find(this.opts.slide);
            this.btnObj = this.wrap.find(this.opts.btnObj);
            this.viewObj = this.wrap.find(this.opts.viewObj);
        },
        bindEvents : function () {
            this.slide.on('click', this.opts.btnObj, $.proxy(this.clickFunc, this));
            this.slickWrap.on('beforeChange', $.proxy(this.beforeChange, this));
        },
        buildSlick : function () {
            this.slickWrap.slick(this.opts.slickOpts);
            this.afterSetElements();
            this.setSlideHeightFunc();
        },
        afterSetElements : function () {
            this.slideTrack = this.wrap.find('.slick-track');
        },
        setSlideHeightFunc : function () {
            this.arr = [];
            $.each(this.slide, $.proxy(function (index) {
                this.arr.push(this.slide.eq(index).outerHeight(true));
            }, this));
        },
        clickFunc : function (e) {
            e.preventDefault();
            var parent = $(e.delegateTarget),
                    target = $(e.currentTarget);
            if(target.is(':visible')) {
                target.hide();
                parent.css('height', 'auto');
                parent.find(this.viewObj).show();
                this.slideTrack.parent().css('height', parent.outerHeight(true));
                this.arr[parent.index()] = this.slide.eq(parent.index()).outerHeight(true);
            }
        },
        beforeChange : function (event, slick, currentSlide, nextSlide) {
            this.slideTrack.parent().css('height', this.arr[nextSlide]);
            this.arr[currentSlide] = this.slide.eq(currentSlide).outerHeight(true);
        }
    };

    win.OVERWATCH.Main.MediaSwiper = win.OVERWATCH.Main.MediaSwiper || {};
    win.OVERWATCH.Main.MediaSwiper = function (args) {
        var defParams = {
            swiperOpts : {
                slidesPerView: 'auto',
                spaceBetween: 5,
                centeredSlides: true
            },
            wrap : '.main_media_box',
            mediaBox : '.media_lst'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Main.MediaSwiper.prototype = {
        init : function() {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.mediaBox = this.wrap.find(this.opts.mediaBox);
            this.mediaBoxChlid = this.mediaBox.children();
        },
        setOpts : function () {
            this.wrap.addClass('swiper-container');
            this.mediaBox.addClass('swiper-wrapper');
            this.mediaBoxChlid.addClass('swiper-slide');
        },
        removeSetOpts : function () {
            this.wrap.removeClass('swiper-container');
            this.mediaBox.removeClass('swiper-wrapper');
            this.mediaBoxChlid.removeClass('swiper-slide');
        },
        initLayout : function () {
            this.type = false;
            this.resizeFunc();
        },
        bindEvents : function () {
            $(win).on('resize', $.proxy(this.resizeFunc, this));
        },
        buildSwiper : function () {
            this.setOpts();
            this.swiper = new Swiper(this.wrap, this.opts.swiperOpts);
            this.type = true;
        },
        resizeFunc : function () {
            if(UTIL.winSize().w > win.minWidth) {
                if(!this.swiper) return;
                this.swiper.destroy(true, true);
                this.removeSetOpts();
                this.swiper = null;
            } else {
                if(this.type) return;
                this.buildSwiper();
            }
        }
    };


    $(function () {
        win.OVERWATCH.Main.slickSlideCall.init();
        win.MainNextScheduleSlick = new win.OVERWATCH.Main.MainNextScheduleSlick();
        win.MainStandingSlick = new win.OVERWATCH.Main.MainStandingSlick();
        win.RecentlyResult = new win.OVERWATCH.Main.RecentlyResult();
        win.MediaSwiper = new win.OVERWATCH.Main.MediaSwiper();
    });

})(window, window.jQuery, window.document);