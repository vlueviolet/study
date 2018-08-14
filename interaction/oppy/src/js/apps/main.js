(function (win, $, doc) {
    'use strict';

    var UTIL = win.OPPY.Common.util;

    
    win.OPPY.Interact = function (args) {
        var defParams = {
            wrap : '.wrap',
            content : '#content',
            section : 'section',
            slideWrap : '.page_transition',
            homeSlide : '.home_slide',
            storySlide : '.story_slide',
            sectionInner : '.section'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    };
    win.OPPY.Interact.prototype = {
        init : function () {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.content = this.wrap.find(this.opts.content);
            this.section = this.wrap.find(this.opts.section);
            this.slideWrap = this.wrap.find(this.opts.slideWrap);
            this.homeSlide = this.wrap.find(this.opts.homeSlide);
            this.storySlide = this.wrap.find(this.opts.storySlide);
            this.sectionInner = this.wrap.find(this.opts.sectionInner);
        },
        initLayout : function () {
            this.width = this.content.outerWidth(true) - this.slideWrap.outerWidth(true);
            this.height = this.content.outerHeight(true) - this.slideWrap.outerHeight(true);
            this.setSection();
            this.slideWrap.slick({
                vertical : true,
                speed : 700,
                easing : 'easeOutElastic'
            });

            this.homeSlideLength = this.homeSlide.children().length;
            this.setHomeSection();
            this.homeSlideFunc();

            
            this.currentIndex = this.slideWrap.slick('slickCurrentSlide');
            this.homeCurrentIndex = this.homeSlide.slick('slickCurrentSlide');
            
            if(this.currentIndex === 0 && this.isHomeSlide) {
                this.isScrollLock = true;
            } else {
                this.isScrollLock = false;
            }
        },
        bindEvents : function () {
            $(win).on('mousewheel DOMMouseScroll', $.proxy(this.scrollFunc, this));
            $(win).on('resize', $.proxy(this.resizeFunc, this), 150);
            this.slideWrap.on('beforeChange', $.proxy(this.beforeChange, this));
            this.slideWrap.on('afterChange', $.proxy(this.afterChange, this));

            this.homeSlide.on('beforeChange', $.proxy(this.homeBeforeChange, this));
            this.homeSlide.on('afterChange', $.proxy(this.homeAfterChange, this));
        },
        setSection : function () {
            this.winWidth = UTIL.winSize().w;
            this.winHeight = UTIL.winSize().h;
            this.section.css('height', this.winHeight - this.height);
        },
        setHomeSection : function () {
            this.sectionInner.css('height', this.winHeight - this.height);
        },
        scrollFunc : function (e) {
            console.log('scroll :', this.isScrollLock, 'home :', this.isHomeSlide)
            var E = e.originalEvent,
                delta = 0;

            if (E.detail) {
                delta = E.detail * -40;
            }else{
                delta = E.wheelDelta;
            };

            if(delta < 120) {
                this.direct = 'down';
            } else {
                this.direct = 'up';
            }
            
            if(this.isScrollLock) {
                if(this.direct === 'down') {
                    this.homeSlide.slick('slickNext');
                } else {
                    this.homeSlide.slick('slickPrev');
                }
            }
            if(!this.isScrollLock) {
                if(this.direct === 'down') {
                    this.slideWrap.slick('slickNext');
                } else {
                    this.slideWrap.slick('slickPrev');
                }
            }
        },
        beforeChange : function (event, slick, currentSlide, nextSlide) {
            event.stopPropagation();
            event.preventDefault();
            this.currentIndex = nextSlide;
            
            if(this.currentIndex === 0) {
                console.log('beforechange')
                this.isScrollLock = true;
            }


            if(this.currentIndex !== 0) {
                if(!this.isHomeSlide) return;
                // this.homeSlide.slick('unslick');
                this.isHomeSlide = false;
            }
            if(this.currentIndex !== 1) {
                if(!this.isStorySlide) return;
                // this.storySlide.slick('unslick');
                // this.isStorySlide = false;
                this.storySlide.slick('slickGoTo', 0);
            }
            if(this.currentIndex === 0) {
                this.isScrollLock = true;
            } else {
            }
        },
        afterChange : function (event, slick, currentSlide) {
            event.stopPropagation();
            event.preventDefault();
            
        },
        homeBeforeChange : function (event, slick, currentSlide, nextSlide) {
            event.stopPropagation();
            this.homeCurrentIndex = nextSlide;
            console.log(this.currentIndex)
            if(this.currentIndex === 0) {
                this.isScrollLock = true;
                if(this.direct === 'down') {
                    this.homeSlide.slick('slickNext');
                } else {
                    this.homeSlide.slick('slickPrev');
                }
            }
        },
        homeAfterChange : function (event, slick, currentSlide) {
            event.stopPropagation();
            this.homeCurrentIndex = currentSlide;
            console.log(this.homeCurrentIndex)
            if(this.homeCurrentIndex === this.homeSlideLength - 1 && this.direct === 'down') {
                console.log('여긴 언제오니')
                this.isScrollLock = false;
                this.isHomeSlide = false;
            } 
            if(this.homeCurrentIndex === 0 && this.direct === 'up') {
                console.log('여긴 언제오니??')
                this.isScrollLock = false;
                this.isHomeSlide = false;
            }
        },
        homeSlideFunc : function () {
            if(this.isHomeSlide) return;
            this.homeSlide.slick({
                arrows : true,
                dots : true
            });
            this.isHomeSlide = true;
        },
        storySlideFunc : function () {
            if(this.isStorySlide) return;
            // this.storySlide.slick();
            // this.isScrollLock = true;
        },
        resizeFunc : function () {
            this.setSection();
        }
    };

    $(function () {
        win.Interact = new win.OPPY.Interact();
    });
})(window, window.jQuery, window.docoument);