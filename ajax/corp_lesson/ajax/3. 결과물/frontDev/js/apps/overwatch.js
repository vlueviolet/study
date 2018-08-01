(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Common = win.OVERWATCH.Common || {};

    var UTIL = win.OVERWATCH.Common.util,
        PAGE = win.OVERWATCH.page;
    win.minWidth = 720;

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
        },
        bindEvents : function () {
            this.closeBtn.on('click', $.proxy(this.layerClickOutside, this));
            // this.layerObj.on('keydown', $.proxy(this.escapeFunc, this));
        },
        layerView : function (target) {
            this.layerWrap = $(target);
            this.outCallback('viewBefore');
            this.arr.push(this.layerWrap);
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
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows : false,
                responsive: [
                    {
                        breakpoint: 1800,
                        settings: {
                        slidesToShow: 3,
                        slidesToScroll: 2,
                        arrows : true
                        }
                    },{
                        breakpoint: win.minWidth,
                        settings: "unslick" // destroys slick
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
        },
        setElements : function () {
            this.slickWrap = this.wrap.find(this.opts.slickWrap);
            this.slickWrapChild = this.wrap.find(this.opts.slickWrapChild);
        },
        bindEvents : function () {
            $(win).on('resize', $.proxy(this.resizeFunc, this));
        },
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

    win.OVERWATCH.Common.GnbMenu = win.OVERWATCH.Common.GnbMenu || {};
    win.OVERWATCH.Common.GnbMenu = function (args) {
        var defParams = {
            header : '#header',
            headerTop : '.header_top',
            headerInner : '.inner',
            headerMini : '.header_mini',
            btnMenu : '.btn_menu',
            btnClose : '.btn_close',
            fixedClass : 'fixed',
            openClass : 'is_open',
            displayClass : 'is_display',
            type : 'default',
            viewBefore : null,
            viewAfter : null,
            closeBefore : null,
            closeAfter : null
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.header = $(this.opts.header)).length) return;
        this.init();
    }
    win.OVERWATCH.Common.GnbMenu.prototype = {
        init : function() {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.headerTop = this.header.find(this.opts.headerTop);
            this.headerInner = this.header.find(this.opts.headerInner);
            this.headerMini = this.header.find(this.opts.headerMini);
            this.btnMenu = this.header.find(this.opts.btnMenu);
            this.btnClose = this.header.find(this.opts.btnClose);
        },
        initLayout : function () {
            this.docHeight = $(document).height();
            this.createOpts();
            this.setWrapHeight();
            this.resizeFunc();
        },
        bindEvents : function () {
            $(win).on('scroll', $.proxy(this.scrollFunc,this));
            $(win).on('resize', $.proxy(this.resizeFunc,this));
            this.btnMenu.on('click', $.proxy(this.layerView,this));
            this.btnClose.on('click', $.proxy(this.layerClose, this));
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
            if(UTIL.winSize().w >= win.minWidth) {
                if(winTop >= this.headerTopOffset) {
                    this.headerTop.addClass(this.opts.fixedClass);
                } else {
                    this.headerTop.removeClass(this.opts.fixedClass);
                }
            } else {
                this.headerTop.removeClass(this.opts.fixedClass);
            }
        },
        resizeFunc : function () {
            this.docHeight = $(document).height();
            if(UTIL.winSize().w >= win.minWidth) {
                this.createOpts();
                this.setWrapHeight();
                this.scrollFunc();
            } else {
                this.header.css('height', 0);
            }
        },
        layerClose : function () {
           this.headerInner.triggerHandler('clickoutside');
        },
        outSideEvents : function () {
            this.headerInner.on('clickoutside touchendoutside', $.proxy(this.clickOutside, this));
        },
        escapeFunc : function (e) {
            var keyCode = e.which || e.keyCode;
            if (keyCode !== 27) return;
            this.layerClose();
        },
        layerView : function (e) {
            this.btnMenu = $(e.currentTarget);
            this.outCallback('viewBefore');
            if (this.opts.type === 'default') {
                this.headerTop.addClass(this.opts.openClass);
                this.headerTop.removeClass(this.opts.displayClass);
                this.showAfterBugFunc();
            }
        },
        showAfterBugFunc : function () {
            win.clearTimeout(this.showAfterTimeout);
            this.showAfterTimeout = win.setTimeout($.proxy(this.layerViewAfter, this), 30);
        },
        layerViewAfter : function () {
            this.outSideEvents();
            PAGE.scrollLock(true);
            this.outCallback('viewAfter');
        },
        clickOutside : function () {
            this.outCallback('closeBefore');
            win.clearTimeout(this.closeBeforeTimeout);
            this.closeBeforeTimeout = win.setTimeout($.proxy(this.hideBeforeBugFunc, this), 30);
            this.headerInner.off('clickoutside touchendoutside');
        },
        hideBeforeBugFunc : function () {
            this.hideAfterBugFunc();
        },
        hideAfterBugFunc : function () {
            win.clearTimeout(this.closeAfterTimeout);
            this.closeAfterTimeout = win.setTimeout($.proxy(this.layerCloseAfter, this), 30);
        },
        layerCloseAfter : function (e) {
            this.headerTop.removeClass(this.opts.openClass);
            win.clearTimeout(this.displayTimer);
            this.displayTimer = win.setTimeout($.proxy(function () {
                this.headerTop.addClass(this.opts.displayClass);
            }, this), 100);
            PAGE.scrollLock(false);
            this.outCallback('closeAfter');
        },
        outCallback : function (type) {
            var callbackObject = this.opts[type];
            if (callbackObject !== null) {
                callbackObject();
            }
        },
        unBindEvents : function () {
            this.btnMenu.off('click');
            this.btnClose.off('click');
            this.headerInner.off('clickoutside touchendoutside');
        },
        reInit : function () {
            this.unBindEvents();
            this.setElements();
            this.initLayout();
            this.bindEvents();
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
        if (!(this.topContent = $(this.opts.topContent)).length || !(this.header = $(this.opts.header)).length) return;
        this.init();
    }
    win.OVERWATCH.Common.SubMainSticky.prototype = {
        init : function() {
            this.setElements();
            this.createOpts();
            this.setWrapHeight();
            this.bindEvents();
        },
        setElements : function () {
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
        },
        setElements : function () {
            this.minObj = $(this.opts.minObj);
        },
        bindEvents : function () {
            $(win).on('scroll', $.proxy(this.scrollFunc, this));
            this.btnTop.on('click', $.proxy(this.clickFunc, this));
        },
        scrollFunc : function () {
            var winTop = $(win).scrollTop(),
            winHeight = $(win).height();
            this.minOffsetTop = this.minObj.offset().top;
            if (winTop >= this.minOffsetTop) {
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
            btnObj : '.close',
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Common.CommonBanner.prototype = {
        init : function() {
            this.setElements();
            this.bindEvents();
            this.initLayout();
        },
        initLayout : function () {
            this.setWidthFunc();
        },
        setElements : function () {
            this.btnObj = this.wrap.find(this.opts.btnObj);
        },
        bindEvents : function () {
            this.btnObj.on('click', $.proxy(this.clickFunc, this));
            $(win).on('resize', $.proxy(this.resizeFunc, this));
        },
        clickFunc : function (e) {
            e.preventDefault();
            if(this.type === 'pc') {
                this.wrap.stop(true, true).animate({
                    'height' : 0
                }, 400, $.proxy(function () {
                    this.wrap.hide();
                }, this));
            } else {
                this.wrap.stop(true, true).fadeOut();
                PAGE.scrollLock(false);
            }
        },
        setWidthFunc : function () {
            if(UTIL.winSize().w > win.minWidth) {
                this.type = 'pc';
                if($('.layer_wrap').css('zIndex') < 0) {
                    PAGE.scrollLock(false);
                }
            } else {
                this.type = 'mobile';
                if($('.layer_wrap').css('zIndex') < 0 && this.wrap.is(':visible')) {
                    PAGE.scrollLock(true);
                }
            }
        },
        resizeFunc : function () {
            this.setWidthFunc();
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
        reInit : function () {

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

    $(function () {
        win.commonLayer = new win.OVERWATCH.Common.commonLayer();
        win.GnbSlick = new win.OVERWATCH.Common.GnbSlick();
        win.GnbMenu = new win.OVERWATCH.Common.GnbMenu();
        win.SubMainSticky = new win.OVERWATCH.Common.SubMainSticky();
        win.TopBtn = new win.OVERWATCH.Common.TopBtn();
        win.CommonBanner = new win.OVERWATCH.Common.CommonBanner();
        win.SelectBox = new win.OVERWATCH.Common.SelectBox();
        win.OVERWATCH.Common.slickSlideCall.init();
    });

})(window, window.jQuery, window.document);