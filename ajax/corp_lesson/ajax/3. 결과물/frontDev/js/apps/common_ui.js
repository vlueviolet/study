(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Common = win.OVERWATCH.Common || {};

    var UTIL = win.OVERWATCH.Common.util,
        PAGE = win.OVERWATCH.page;
    win.minWidth = 720;

    win.OVERWATCH.Common.Responsive = (function () {
        return {
            init : function () {
                this.initLayout();
                this.bindEvents();
            },
            initLayout : function () {
                if(UTIL.winSize().w <= win.minWidth) {
                    this.type = false;  // 모바일
                } else {
                    this.type = true;   // pc
                }
            },
            bindEvents : function () {
                $(win).on('resize', $.proxy(this.reLoad, this));
            },
            reLoad : function () {
                if(UTIL.winSize().w <= win.minWidth) {
                    if(this.type) return;
                    this.type = true;
                    console.log('m', this.type)
                } else {
                    if(!this.type) return;
                    this.type = false;
                    console.log('pc', this.type)
                }
            }
        };
     }());

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
                slidesToShow: 5,
                slidesToScroll: 1,
                arrows : false,
                responsive: [
                    {
                        breakpoint: 1800,
                        settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        arrows : true
                        }
                    },
                    {
                        breakpoint: 1500,
                        settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        arrows : true
                        }
                    },
                    {
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
            this.initLayout();
            this.bindEvents();
            this.afterBindeEvents();
        },
        setElements : function () {
            this.slickWrap = this.wrap.find(this.opts.slickWrap);
            this.slickWrapChild = this.wrap.find(this.opts.slickWrapChild);
        },
        initLayout : function () {
            this.type = false;
            this.resizeFunc();
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
            this.type = true;
        },
        resizeFunc : function () {
            if(UTIL.winSize().w > win.minWidth) {
                if(this.type) return;
                this.buildSlick();
            } else {
                this.type = false;
            }
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
            this.scrollFunc();
            this.setWrapHeight();
            this.resizeFunc();
        },
        bindEvents : function () {
            $(win).on('scroll', $.proxy(this.scrollFunc,this));
            $(win).on('resize', $.proxy(this.resizeFunc,this));
            this.headerInner.on('touchmove', $.proxy(this.touchFunc,this));
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
            if(UTIL.winSize().w > win.minWidth) {
                this.headerMini.removeClass(this.opts.fixedClass);
                if(winTop >= this.headerTopOffset) {
                    this.headerTop.addClass(this.opts.fixedClass);
                } else {
                    this.headerTop.removeClass(this.opts.fixedClass);
                }
            } else {
                this.headerTop.removeClass(this.opts.fixedClass);
                if(winTop > this.headerTopOffset) {
                    this.headerMini.addClass(this.opts.fixedClass);
                } else {
                    this.headerMini.removeClass(this.opts.fixedClass);
                }
            }
        },
        resizeFunc : function () {
            this.docHeight = $(document).height();
            if(UTIL.winSize().w >= win.minWidth) {
                this.createOpts();
                this.setWrapHeight();

            } else {
                this.header.css('height', 0);
            }
            this.scrollFunc();
        },
        touchFunc : function (e) {
            this.prevY = this.currentY;
            this.currentY = event.changedTouches[event.changedTouches.length - 1].screenY;
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
        if (!(this.subNav = $(this.opts.subNav)).length || !(this.header = $(this.opts.header)).length) return;
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
            this.topContentOuterHeight = this.topContent.css('height');
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
            if(UTIL.winSize().w < win.minWidth) {
                this.topContentOuterHeight = 238;
            } else {
                this.topContentOuterHeight = 476;
            }
            this.setWrapHeight();
        }
    };

    // Sub LNB Mobile Scroll
    win.OVERWATCH.Common.SubMenuScroll = function (args) {
        var defParams = {
            tabWrap : '#sub_nav',
            tabWrapChild : '.sub_navbx',
            tabList : '.list_sub_nav',
            tabLi : 'li',
            tabCont : 'a',
            activeClass : 'on',
            idName : 'scroller'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.tabWrap = $(this.opts.tabWrap)).length) return;
        this.init();
    };
    win.OVERWATCH.Common.SubMenuScroll.prototype = {
        init : function () {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.tabWrapChild = this.tabWrap.find(this.opts.tabWrapChild);
            this.tabList = this.tabWrap.find(this.opts.tabList);
            this.tabLi = this.tabWrap.find(this.opts.tabLi);
            this.tabCont = this.tabWrap.find(this.opts.tabCont);
         },
         bindEvents : function () {
            this.tabCont.on('click', $.proxy(this.clickFunc,this));
            $(window).on('resize', $.proxy(this.moveFunc,this));
         },
        initLayout : function () {
            if(UTIL.winSize().w <= win.minWidth) {
                this.tabList.attr('id', this.opts.idName);
                this.iScrollBindEvents();
            }
            for(var i = 0, max = this.tabLi.length ; i < max ; i++) {
                if(this.tabLi.eq(i).hasClass(this.opts.activeClass)){
                    this.curIndex = i+1;
                }
            }
            this.moveFunc();
        },
        iScrollBindEvents : function () {
            this.scrollCont = new IScroll(this.opts.tabWrapChild, {
                scrollX: true,
                click: true,
                disablePointer: true,
                disableTouch: false,
                disableMouse: false,
                resize : true,
                resizePolling : true,
                resizeScrollbars : true
            });
        },
        clickFunc : function (e) {
            e.preventDefault();
            this.target = $(e.currentTarget);
            this.curIndex = this.target.parent("li").index() + 1;
            this.tabLi.removeClass("active");
            this.target.parent("li").addClass("active");
            this.moveFunc();
        },
        moveFunc : function () {
            if(UTIL.winSize().w > win.minWidth) {
                this.tabList.removeAttr('id');
                if(!this.scrollCont) return;
                this.scrollCont.destroy();
                this.scrollCont = null;
            } else {
                if((this.scrollCont === undefined) || (this.scrollCont=== null)) {
                    this.tabList.attr('id', this.opts.idName);
                    this.iScrollBindEvents();
                }
                this.scrollCont.scrollToElement(document.querySelector("#scroller li:nth-child(" + this.curIndex + ")"), null, null, true);
            }
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
            $(win).on('resize', $.proxy(this.resizeFunc, this));
        },
        clickFunc : function (e) {
            e.preventDefault();
            if(UTIL.winSize().w <= win.minWidth) {
                this.wrap.stop(true, true).fadeOut();
            } else {
                this.wrap.stop(true, true).animate({
                    'height' : 0
                }, 300, $.proxy(function () {
                    this.wrap.hide();
                }, this));
            }
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
            this.slideWrap = $('');
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
            teamBox1 : '.team_bx1',
            teamBox2 : '.team_bx2',
            team :'.name',
            teamLogo :'.team_logo',
            scoreBox : '.score_bx',
            detailBox : '.macth_detail',
            targetField : '#targetField',
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
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        initLayout : function () {
        },
        onLoadTwitchApi : function () {
            (function () {
                var tag = document.createElement('script');
                tag.src = 'https://player.twitch.tv/js/embed/v1.js';
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            })();
        },
        setElements : function () {
            this.title = this.wrap.find(this.opts.title);
            this.date = this.wrap.find(this.opts.date);
            this.teamBox1 = this.wrap.find(this.opts.teamBox1);
            this.team1 = this.teamBox1.find(this.opts.team);
            this.logo1 = this.teamBox1.find(this.opts.teamLogo);
            this.teamBox2 = this.wrap.find(this.opts.teamBox2);
            this.team2 = this.teamBox2.find(this.opts.team);
            this.logo2 = this.teamBox2.find(this.opts.teamLogo);
            this.scoreBox = this.wrap.find(this.opts.scoreBox);
            this.score1 = this.scoreBox.find('.score1');
            this.score2 = this.scoreBox.find('.score2');
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
            this.videoNo = parseInt(target.data('videoNo'));
            this.layer.css({
                display : 'none',
                opacity : 1,
                zIndex : 110
            });

            window.commonLayer.layerView(this.layer);
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
            this.matchNo = target.data('matchNo');
            if(this.matchNo === null || this.matchNo === undefined) return;

            // 결과가 안나온 경기는 전적 팝업 노출 없음
            if($('.bracket_wrap').length > 0) {
                for(var i = 0, max = target.children('.team').length ; i < max ; i++) {
                    this.result = target.children('.team').eq(i).hasClass('win') || target.children('.team').eq(i).hasClass('lose');
                }
                if(!this.result) return;
            }

            window.commonLayer.opts.viewBefore = $.proxy(function () {  //레이어 닫힌 후 실행구문

                window.commonLayer.opts.viewBefore = null;  //한번 쓰고 초기화
            }, this);
            window.commonLayer.layerView('#layer_score');
            window.commonLayer.opts.closeAfter = $.proxy(function () {
                this.type = true;
                window.commonLayer.opts.closeAfter = null;
            }, this);
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
            this.afterSetElements();
            this.bindEvents();
        },
        initLayout : function () {
            this.wrap.css({
                display : 'block',
                opacity : 0,
                zIndex : -1
            });
        },
        setElements : function () {
            this.btnObj = $(this.opts.btnObj);
            this.closeBtn = this.wrap.find(this.opts.closeBtn);
        },
        afterSetElements : function () {
        },
        bindEvents : function () {
            $('body').on('click', this.opts.btnObj, $.proxy(this.clickFunc, this));
        },
        clickFunc : function (e) {
            e.preventDefault();
            e.stopPropagation();
            var target = $(e.currentTarget);

            this.wrap.css({
                display : 'none',
                opacity : 1,
                zIndex : 110
            });
            window.commonLayer.opts.viewAfter = $.proxy(function () {  //레이어 닫힌 후 실행구문
                this.TeamLayerSticky = new win.OVERWATCH.Common.TeamLayerSticky();
                this.TeamLayerSticky.setWrapHeight();
                this.TeamLayerSticky.createOffset();
                window.commonLayer.opts.viewAfter = null;  //한번 쓰고 초기화
            }, this);
            window.commonLayer.layerView(this.wrap);
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
            $(win).on('resize', $.proxy(this.resizeFunc,this));
        },
        createOffset : function () {
            this.maxObjOffset = this.topObj.offset().top + this.topObj.outerHeight();
        },
        setWrapHeight : function () {
            this.topObjWrap.css('height', this.topObj.outerHeight(true));
        },
        resizeFunc : function () {
            this.setWrapHeight();
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
        win.OVERWATCH.Common.Responsive.init();
        win.commonLayer = new win.OVERWATCH.Common.commonLayer();
        win.GnbSlick = new win.OVERWATCH.Common.GnbSlick();
        win.GnbMenu = new win.OVERWATCH.Common.GnbMenu();
        win.SubMainSticky = new win.OVERWATCH.Common.SubMainSticky();
        win.SubMenuScroll = new win.OVERWATCH.Common.SubMenuScroll();
        win.TopBtn = new win.OVERWATCH.Common.TopBtn();
        win.CommonBanner = new win.OVERWATCH.Common.CommonBanner();
        win.SelectBox = new win.OVERWATCH.Common.SelectBox();
        win.OVERWATCH.Common.slickSlideCall.init();
        win.FooterFamily = new win.OVERWATCH.Common.FooterFamily();



        win.ScoreLayer = new win.OVERWATCH.Common.ScoreLayer();  //전적보기 레이어
        win.TeamLayer = new win.OVERWATCH.Common.TeamLayer();
    });

})(window, window.jQuery, window.document);