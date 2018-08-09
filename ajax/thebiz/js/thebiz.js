(function (win, $, doc) {
    'use strict';
    win.thebizProject = win.thebizProject || {};
    win.thebizProject.common = win.thebizProject.common || {};

    var UTIL = win.thebizProject.common.util;
    var scrollLast = 0;
    var innerWidth = $(win).innerWidth();

    /**
    * [common utill]
    **/
    win.thebizProject.commonJs = function(){
        this.init();
    }

    win.thebizProject.commonJs.prototype = {
        init : function () {
            this.setElements();
            this.bindEvents();
            this.initFunc();
        },
        initFunc : function () {
            // gnb
            this.menuBtn.removeClass('menu_close');
            this.menuBox.css('display','none');
            this.scrollFunc();
        },
        setElements : function() {
            this.header = $('.header');
            this.bizBody = $('body');

            // gnb
            this.mobileGnb = $('.m.gnb');
            this.menuBtn = this.mobileGnb.find('.btn_menu');
            this.menuText = this.menuBtn.find('.sp');
            this.menuBox = this.mobileGnb.find('.dimmed, .m.gnb_cate');
            this.menuCloseBtn = this.mobileGnb.find('.btn_close');

            // mobile bottom tab
            this.mobileTab = $('.m.lst_bottom_tab');

            // accordian
            this.accordionArea = $('.accordion');
            this.questionBtn = this.accordionArea.find('.question');
        },
        bindEvents : function () {
            // gnb
            this.menuBtn.on('click', $.proxy(this.gnbOpenFunc, this));
            this.menuCloseBtn.on('click', $.proxy(this.gnbCloseFunc, this));

            // scroll event
            $(win).on('scroll', $.proxy(this.scrollFunc, this));

            // resize event
            $(win).on('resize', $.proxy(this.resizeFunc, this));


            this.questionBtn.on('click', $.proxy(this.accoFunc, this));
        },
        gnbOpenFunc : function () {
            this.bizBody.addClass('no_scroll');
            this.menuBtn.addClass('menu_close');
            this.menuBox.css('display','block');
        },
        gnbCloseFunc : function () {
            this.bizBody.removeClass('no_scroll');
            this.menuBtn.addClass('menu_close');
            this.menuBox.css('display','none');
        },
        resizeFunc : function () {
            innerWidth = $(win).innerWidth();
        },
        scrollFunc : function () {
            this.scrollTop = $(win).scrollTop();
            
            // 모바일 하단 tab toggle
            if ( innerWidth < 768 ) {
                if ( this.scrollTop > scrollLast ) {                    
                    // scroll up
                    this.mobileTab.css('display','none');
                } else {
                    // scroll down
                    this.mobileTab.css('display','table');
                }
            } else {             
                this.mobileTab.css('display','none');
            }

            // header fixed
            if ( !this.header.hasClass('no_fix_page') ) {
                if ( this.scrollTop > 0 ) {
                    this.header.addClass('top_fixed');
                } else {
                    this.header.removeClass('top_fixed');
                }
            }

            scrollLast = this.scrollTop;
        },
        accoFunc : function (e) {
            e.preventDefault();
            var target = $(e.currentTarget),
                targetTxt = target.find('.blind');


            if ( target.hasClass('open') ) {
                target.removeClass('open');
                targetTxt.text('목록 열기');
            }else {
                target.addClass('open');
                targetTxt.text('목록 닫기');
            }
        }
    }

     /**
    * [anchor nav]
    **/
    win.thebizProject.anchorNav = function(args){
        var defParams = {
            anchorWrap : '.group_item_dsc'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.obj = $(this.opts.anchorWrap)).length) return;
        this.init();
    }

    win.thebizProject.anchorNav.prototype = {
        init : function () {
            this.setElements();
            this.createOffset();
            this.scrollFunc();
            this.bindEvents();
        },
        setElements : function () {
            this.anchorWrap = $(this.opts.anchorWrap);
            this.achorHeight = this.anchorWrap.innerHeight();
            this.anchorBox = this.anchorWrap.find('.lst_menu2');
            this.anchorList = this.anchorBox.children();
            this.anchorBtns = this.anchorList.find('a').filter(function () {
                var target = $(this),
                    targetHref = target.attr('href');
                if (!$(targetHref).length) return false;
                return true;
            });
            this.dropBox = this.anchorWrap.find('.bx_name');
            this.dropBtn = this.dropBox.find('.name');
            this.dropSelect = this.dropBox.find('.lst_item');
            this.dropList = this.dropSelect.find('li');
            this.dropApt = this.dropList.find('a');
            this.headerHeight = $('#header').innerHeight();
            this.totalHeight = this.achorHeight + this.headerHeight;
        },
        createOffset : function () {
            this.offsetArrays = [];
            for (var i = 0, max = this.anchorBtns.length; i < max; i++) {
                var target = $(this.anchorBtns.eq(i).attr('href'));
                this.offsetArrays.push(target.offset().top - this.totalHeight*2);
            }
            this.anchorOffsetTop = this.anchorWrap.offset().top - this.achorHeight;
        },
        bindEvents : function () {
            this.anchorBtns.on('click', $.proxy(this.onClickFunc, this));
            $(win).on('scroll', $.proxy(this.scrollFunc, this));
            this.dropBtn.on('click', $.proxy(this.dropFunc, this));
            this.dropApt.on('click', $.proxy(this.dropActiveFunc, this));
        },
        onClickFunc : function (e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            this.currentIndex = this.anchorBtns.index(target);
            $('html, body').stop().animate({
                scrollTop : this.offsetArrays[this.currentIndex]
            });
        },
        scrollFunc : function () {
            this.quickFixedFunc();
            win.clearTimeout(this.scrollEndTime);
            this.scrollEndTime = win.setTimeout($.proxy(this.scrollEndFunc, this));
        },
        quickFixedFunc : function () {
            var winTop = $(win).scrollTop();
            if (winTop >= this.anchorOffsetTop) {
                if (!this.anchorWrap.hasClass('top_fixed')) {
                    this.anchorWrap.addClass('top_fixed');
                }
            } else {
                if (this.anchorWrap.hasClass('top_fixed')) {
                    this.anchorWrap.removeClass('top_fixed');
                }
            }
        },
        scrollEndFunc : function () {
            var winTop = $(win).scrollTop();
            for (var i = 0, max = this.offsetArrays.length; i < max; i++) {
                if (winTop >= this.offsetArrays[i]) {
                    this.activeIndex = i;
                } else if (winTop < this.offsetArrays[0]) {
                    this.activeIndex = null;
                }
            }
            this.quickActiveFunc();
        },
        quickActiveFunc : function () {
            if (this.activeIndex === null) {
                this.anchorBtns.eq(0).removeClass('on');
            } else {
                this.anchorBtns.parent().removeClass('on');
                this.anchorBtns.eq(this.activeIndex).parent().addClass('on');
            }
            if (this.dropBox.hasClass('open')) {
                this.dropBox.removeClass('open');
            }
        },
        dropFunc : function (e) {
            e.preventDefault();
            this.dropBox.addClass('open');
        },
        dropActiveFunc : function (e) {
            var target = $(e.currentTarget);
            e.preventDefault();
            if (!target.parent().hasClass('on')) {
                target.parent().siblings().removeClass('on');
                target.parent('li').addClass('on');
            }
            this.dropBtn.text(target.text());
        }
    }

    /**
    * [layer popup]
    **/
    win.thebizProject.layerPopup = function(args){
        var defParams = {
            layerWrap : '.ly_pop_wrap',
            dimmed : '.dimmed.type2'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.obj = $(this.opts.layerWrap)).length) return;
        this.init();
    }

    win.thebizProject.layerPopup.prototype = {
        init : function () {
            this.setElements();
            this.bindEvents();
        },
        setElements : function () {
            // 공통
            this.bizBody = $('body');
            this.layerWrap = $(this.opts.layerWrap);
            this.dimmed = $(this.opts.dimmed);
            this.layerCloseBtn = this.layerWrap.find('.btn_close');

            // 전화문의
            this.callBtn = $('.btn_call');
            this.callLayer = $('.ly_calling');
            
            // URL 복사
            this.shareBtn = $('.btn_share');
            this.shareLayer = $('.ly_share');            
        },
        bindEvents : function () {
            this.callBtn.on('click', $.proxy(this.callLayerFunc, this));
            this.shareBtn.on('click', $.proxy(this.shareLayerFunc, this));
            this.layerCloseBtn.on('click', $.proxy(this.closeLayerFunc, this));
        },
        openLayerFunc : function () {
            this.bizBody.addClass('no_scroll');
            this.dimmed.css('display','block');
        },
        closeLayerFunc : function (e) {
            e.preventDefault();
            this.bizBody.removeClass('no_scroll');
            this.dimmed.css('display','none');
            this.layerWrap.css('display','none');
        },
        shareLayerFunc : function (e) {
            e.preventDefault();
            this.openLayerFunc();
            this.shareLayer.css('display','block');
        },
        callLayerFunc : function (e) {
            e.preventDefault();
            this.openLayerFunc();
            this.callLayer.css('display','block');
        }
    }

    /**
    * [단지정보]
    **/
    win.thebizProject.aptInfoMenu = function(args){
        var defParams = {
            artInfoWrap : '.apt_info'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.obj = $(this.opts.artInfoWrap)).length) return;
        this.init();
    }

    win.thebizProject.aptInfoMenu.prototype = {
        init : function () {
            this.setElements();
            // this.initLayout();
            this.bindEvents();
            this.resizeFunc();
        },
        setElements : function () {
            this.artInfoWrap = $(this.opts.artInfoWrap);
            this.openMenuArea = this.artInfoWrap.find('.bx_lst_menu.pc');
            this.openMenuBtn = this.openMenuArea.find('.btn_open');
            this.openMenuBox = this.openMenuArea.find('.bx_submenu');
            this.openMenuCloseBtn = this.openMenuBox.find('.btn_close');

            this.openMenuArea2 = this.artInfoWrap.find('.bx_lst_menu.m');
            this.openMenuBtnWrap = this.openMenuArea2.find('.lst_menu');
            this.openMenuBtn2 = this.openMenuBtnWrap.find('a');
            this.openMenuBox2 = this.openMenuArea2.find('.bx_submenu');

            this.mobileTabMenuWrap = this.artInfoWrap.find('.bx_tabmenu');
            this.mobileTabMenu = this.mobileTabMenuWrap.find('.lst_tabmenu');
            this.mobileTabMeneToggleList = this.mobileTabMenu.find('div:gt(3)');
            this.mobileTabMenuBtn = this.mobileTabMenuWrap.find('.btn_open');
            this.mobileTabState = false;

            // this.mobileListMenuBtn = this.artInfoWrap.find('.m_lst_menu');
        },
        bindEvents : function () {
            this.openMenuBtn.on('click', $.proxy(this.openMenuFunc, this));
            this.openMenuBtn2.on('click', $.proxy(this.openMenuFunc2, this));
            this.openMenuCloseBtn.on('click', $.proxy(this.closeMenuFunc, this));
            this.mobileTabMenuBtn.on('click', $.proxy(this.openMobileTabFunc, this));
            // this.mobileListMenuBtn.on('click', $.proxy(this.openMobileListFunc, this));
            $(win).on('resize', $.proxy(this.resizeFunc, this));
        },
        resizeFunc : function () {
            innerWidth = $(win).innerWidth();
            if ( innerWidth < 768 ) {
                this.mobileTabMenuWrap.addClass('add_btn');
                this.mobileTabMeneToggleList.css('display','none');
            }else {
                this.mobileTabMenuWrap.removeClass('add_btn');
                this.mobileTabMeneToggleList.css('display','table-cell');
            }
        },
        openMenuFunc : function () {
            this.openMenuBox.css('display','block');
        },
        closeMenuFunc : function () {
            this.openMenuBox.css('display','none');
        },
        openMenuFunc2 : function (e) {
            e.preventDefault();
            this.openMenuBox2.toggle();
            this.openMenuBtnWrap.toggleClass('sub_open');
        },
        openMobileTabFunc: function () {
            if ( this.mobileTabState == false ) {
                this.mobileTabMenu.addClass('more');
                this.mobileTabMeneToggleList.css('display','table-cell');
                this.mobileTabMenuBtn.find('.sp').text('메뉴 닫기');
                this.mobileTabState = true;
            }else if (this.mobileTabState == true) {
                this.mobileTabMenu.removeClass('more');
                this.mobileTabMeneToggleList.css('display','none');
                this.mobileTabMenuBtn.find('.sp').text('메뉴 열기');
                this.mobileTabState = false;
            }
        }
        // openMobileListFunc: function (e) {
        //     e.preventDefault();
        //     var target = $(e.currentTarget);
        //     target.toggleClass('on');
        // }
    }
    
    /**
    * [매물정보]
    **/
    win.thebizProject.estateInfo = function(args){
        var defParams = {
            estateInfo : '.estate_info'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.obj = $(this.opts.estateInfo)).length) return;
        this.init();
    }

    win.thebizProject.estateInfo.prototype = {
        init : function () {
            this.setElements();
            this.bindEvents();
        },
        setElements : function () {
            this.estateInfo = $(this.opts.estateInfo);
            this.recommendBanner = this.estateInfo.find('.bx_banner');
            this.recommendCloseBtn = this.recommendBanner.find('.btn_close');

            this.viewArea = this.estateInfo.find('.result_search').parent('.section');
            this.viewListBtn = this.estateInfo.find('.btn_list');
            this.viewMapBtn = this.estateInfo.find('.btn_map');
        },
        bindEvents : function () {
            this.recommendCloseBtn.on('click', $.proxy(this.recommondCloseFunc, this));
            this.viewListBtn.on('click', $.proxy(this.viewListFunc, this));
            this.viewMapBtn.on('click', $.proxy(this.viewMapFunc, this));
        },
        recommondCloseFunc : function () {
            this.recommendBanner.css('display','none');
        },
        viewListFunc : function () {
            this.viewArea.removeClass('view_map').addClass('view_list');
        },
        viewMapFunc : function () {
            this.viewArea.removeClass('view_list').addClass('view_map');
        }
    }
    
    /**
    * [이미지 갤러리(모바일)]
    **/
    win.thebizProject.imageGellery = function(args){
        var defParams = {
            imageGellery : '.bx_img_gallery'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.obj = $(this.opts.imageGellery)).length) return;
        this.init();
    }

    win.thebizProject.imageGellery.prototype = {
        init : function () {
            this.setElements();
            this.bindEvents();
        },
        setElements : function () {
            this.imageGellery = $(this.opts.imageGellery);
            this.imageList = this.imageGellery.find('.lst_img');
            this.imageLink = this.imageList.find('a');
        },
        bindEvents : function () {
        }
    }
    
    /**
    * [selectbox plugin]
    **/
    var selectCustom = function (obj) {
        this.obj = obj;
        this.init();
    }

    selectCustom.prototype = {
        init : function () {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.objBtn = this.obj.find('.option');
            this.objBtnDefault = this.obj.find('.option_tit').text();
            this.objCont = this.obj.find('.bx_option');
            this.objCloseBtn = this.obj.find('.btn_close');
        },
        initLayout : function () {
            this.obj.removeClass('open');
        },
        bindEvents : function () {
            this.objBtn.on('click', $.proxy(this.onClickFunc, this));
            this.objCloseBtn.on('click', $.proxy(this.closeFunc, this));
        },
        onClickFunc : function (e) {
            e.preventDefault();
            this.objBtn.addClass('open')
        },
        closeFunc : function (e) {
            e.preventDefault();
            this.objBtn.removeClass('open')
        }
    };
    $.fn.selectCustomPlugin = function () {
        for (var i = 0, max = this.length; i < max; i++) {
            new selectCustom(this.eq(i));
        }
    };
    $(function () {
        $('.bx_filter').selectCustomPlugin();
    });

    $(function () {
        win.thebizCommonJs = new win.thebizProject.commonJs();
        win.thebizAnchorNav = new win.thebizProject.anchorNav();
        win.thebizLayerPopup = new win.thebizProject.layerPopup();
        win.thebizAptInfoMenu = new win.thebizProject.aptInfoMenu();
        win.thebizEstateInfo = new win.thebizProject.estateInfo();
        win.thebizImageGellery = new win.thebizProject.imageGellery();
    });
})(window, window.jQuery, window.document);