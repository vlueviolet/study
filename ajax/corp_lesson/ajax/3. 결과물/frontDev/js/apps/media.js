(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Common = win.OVERWATCH.Common || {};
    win.OVERWATCH.Media = win.OVERWATCH.Media || {};

    var UTIL = win.OVERWATCH.Common.util,
        PAGE = win.OVERWATCH.page;
    win.minWidth = 720;

    win.OVERWATCH.Media.MediaView = function (args) {
        var defParams = {
            wrap : '.media_wrap',
            mediaCont : '.media_cont',
            layer : '#layer_media'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    };
    win.OVERWATCH.Media.MediaView.prototype = {
        init : function () {
            this.setElements();
            this.bindEvents();
        },
        setElements : function () {
            this.mediaCont = this.wrap.find(this.opts.mediaCont);
            this.layer = $(this.opts.layer);
        },
        initLayout : function () {
            this.layer.css({
                display : 'block',
                opacity : 0,
                zIndex : -1
            });
        },
        bindEvents : function () {
            this.mediaCont.on('click', $.proxy(this.clickFunc, this));
        },
        clickFunc : function (e) {
            e.preventDefault();
            this.layer.css({
                display : 'none',
                opacity : 1,
                zIndex : 110
            });
            window.commonLayer.layerView(this.layer);
            window.commonLayer.opts.viewAfter = $.proxy(function () {
                win.RelativeMediaSwiper = new win.OVERWATCH.Media.RelativeMediaSwiper();
                window.commonLayer.opts.viewAfter = null;
            }, this);
        }
    };

    win.OVERWATCH.Media.MediaSlick = win.OVERWATCH.Media.MediaSlick || {};
    win.OVERWATCH.Media.MediaSlick = function (args) {
        var defParams = {
            slickOpts : {
                 dots : true,
                  infinite : true,
                  speed : 400,
                  cssEase : 'linear',
                  autoplay : false,
                  autoplaySpeed : 3000,
                  responsive: [
                    {
                        breakpoint: win.minWidth,
                        settings: "unslick" // destroys slick
                    }
                ]
            },
            wrap : '.media_bx',
            slide : '.media_bx_in'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Media.MediaSlick.prototype = {
        init : function() {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.slide = this.wrap.find(this.opts.slide);
        },
        initLayout : function () {
            this.type = false;
            this.resizeFunc();
        },
        bindEvents : function () {
            $(win).on('resize', $.proxy(this.resizeFunc, this));
        },
        buildSlick : function () {
            this.slide.slick(this.opts.slickOpts);
            this.type = true;
        },
        resizeFunc : function () {
            if(UTIL.winSize().w > win.minWidth) {
                if(this.type) return;
                this.buildSlick();
            } else {
                this.type = false;
            }
        }
    };

    win.OVERWATCH.Media.MediaSwiper = win.OVERWATCH.Media.MediaSwiper || {};
    win.OVERWATCH.Media.MediaSwiper = function (args) {
        var defParams = {
            swiperOpts : {
                slidesPerView: 'auto',
                spaceBetween: 3
            },
            wrap : '.media_wrap',
            mediaArea : '.media_bx',
            mediaBox : '.media_bx_in'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Media.MediaSwiper.prototype = {
        init : function() {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.mediaArea = this.wrap.find(this.opts.mediaArea);
            this.mediaBox = this.wrap.find(this.opts.mediaBox);
            this.mediaBoxChlid = this.mediaBox.children();
        },
        setOpts : function () {
            this.mediaArea.addClass('swiper-container');
            this.mediaBox.addClass('swiper-wrapper');
            this.mediaBoxChlid.addClass('swiper-slide');
        },
        removeSetOpts : function () {
            this.mediaArea.removeClass('swiper-container');
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
            this.swiper = new Swiper(this.mediaArea, this.opts.swiperOpts);
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

    win.OVERWATCH.Media.MediaSubSwiper = win.OVERWATCH.Media.MediaSubSwiper || {};
    win.OVERWATCH.Media.MediaSubSwiper = function (args) {
        var defParams = {
            swiperOpts : {
                slidesPerView: 'auto',
                spaceBetween: 5,
                centeredSlides: true
            },
            wrap : '.media_wrap',
            mediaArea : '.sub_bx',
            mediaBox : '.sub_bx_in'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Media.MediaSubSwiper.prototype = {
        init : function() {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.mediaArea = this.wrap.find(this.opts.mediaArea);
            this.mediaBox = this.wrap.find(this.opts.mediaBox);
            this.mediaBoxChlid = this.mediaBox.children();
        },
        setOpts : function () {
            this.mediaArea.addClass('swiper-container');
            this.mediaBox.addClass('swiper-wrapper');
            this.mediaBoxChlid.addClass('swiper-slide');
        },
        removeSetOpts : function () {
            this.mediaArea.removeClass('swiper-container');
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
            this.swiper = new Swiper(this.mediaArea, this.opts.swiperOpts);
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

    // 관련영상
    win.OVERWATCH.Media.RelativeMediaSwiper = win.OVERWATCH.Media.RelativeMediaSwiper || {};
    win.OVERWATCH.Media.RelativeMediaSwiper = function (args) {
        var defParams = {
            swiperOpts : {
                slidesPerView: 4,
                spaceBetween: 5,
                pagination: {
                    el: '.swiper-pagination',
                    type: 'fraction'
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    720: {
                      slidesPerView: 2,
                      spaceBetween: 10,
                    }
                }
            },
            wrap : '#layer_media .video_area',
            mediaArea : '.video_slider',
            mediaBox : '.video_bx'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Media.RelativeMediaSwiper.prototype = {
        init : function() {
            this.setElements();
            this.initLayout();
            this.setOpts();
            this.buildSwiper();
            this.bindEvents();
        },
        setElements : function () {
            this.mediaArea = this.wrap.find(this.opts.mediaArea);
            this.mediaBox = this.wrap.find(this.opts.mediaBox);
            this.mediaBoxChlid = this.mediaBox.children();
        },
        setOpts : function () {
            this.mediaArea.addClass('swiper-container');
            this.mediaBox.addClass('swiper-wrapper');
            this.mediaBoxChlid.addClass('swiper-slide');
        },
        removeSetOpts : function () {
            this.mediaArea.removeClass('swiper-container');
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
            this.swiper = new Swiper(this.mediaArea, this.opts.swiperOpts);
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
        win.MediaView = new win.OVERWATCH.Media.MediaView();
        win.MediaSlick = new win.OVERWATCH.Media.MediaSlick();
        win.MediaSwiper = new win.OVERWATCH.Media.MediaSwiper();
        win.MediaSubSwiper = new win.OVERWATCH.Media.MediaSubSwiper();
    });
})(window, window.jQuery, window.document);