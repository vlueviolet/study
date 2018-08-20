(function (win, $, doc) {
    'use strict';

    var UTIL = win.OPPY.Common.util || {};
    
    win.OPPY.CustomInteract = function (args) {
        var defParams = {
            wrap : '.custom',
            content : '#content',
            sectionWrap : '.page_wrap',
            sectionObj : '#custom_section',
            section : '.section'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if(!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    };
    win.OPPY.CustomInteract.prototype = {
        init : function () {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.content = this.wrap.find(this.opts.content);
            this.sectionWrap = this.wrap.find(this.opts.sectionWrap);
            this.sectionObj = this.sectionWrap.find(this.opts.sectionObj);
            this.section = this.wrap.find(this.opts.section);
        },
        initLayout : function () {
            this.windowWidth = UTIL.winSize().w;
            this.windowsHeight = UTIL.winSize().h;
            
            this.setInitSection();

            this.currentIndex = 0;

            this.prevTime = new Date().getTime();

            this.isScroll = true;

            this.scrollArr = [];
            this.previousDestTop = 0;
        },
        bindEvents : function () {
            $(win).on('mousewheel', $.proxy(this.mouseWheelHandler, this));
        },
        setInitSection : function () {
            this.sectionWrap.css({
                'overflow' : 'hidden'
            });

            if(parseInt(this.content.css('paddingTop')) > 0 || parseInt(this.content.css('paddingBottom')) > 0) {
                var height = this.windowsHeight - [parseInt(this.content.css('paddingTop')) + parseInt(this.content.css('paddingBottom'))];
                this.section.css('height', height);
            } else {
                this.section.css('height', this.windowsHeight - parseInt(this.content.css('paddingTop')));
            }

            this.sectionWrap.fadeIn(500);
        },
        mouseWheelHandler : function (e) {
            this.curTime = new Date().getTime();

            var e = window.event || e;
            var value = e.wheelDelta || -e.deltaY || -e.detail;
            var delta = Math.max(-1, Math.min(1, (value)));
            
            this.horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
            // this.isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX ) < Math.abs(e.deltaY) || !horizontalDetection);

            if(this.scrollArr.length > 149){
                this.scrollArr.shift();
            }
            this.scrollArr.push(Math.abs(value));

            if(this.isScroll) {
                if(this.isScrollingVertically) {
                }
            }

            var timeDiff = this.curTime - this.prevTime;
            this.prevTime = this.curTime;

            if(timeDiff > 200){
                this.scrollArr = [];
            }
            
            if(this.isScroll) {
                if (delta < 0) {
                    this.setDirectFunc('down');
                }else {
                    this.setDirectFunc('up');
                }
            }
        },
        setDirectFunc : function (direct) {
            console.log(this.isScroll)
            if(!this.isScroll) return;
            this.isScroll = false;
            switch (direct) {
                case 'down' : 
                    if(this.currentIndex >= this.section.length - 1) {
                        this.currentIndex = this.section.length - 1;
                    } else {
                        this.currentIndex++;
                    }
                    break;
                case 'up' :
                    if(this.currentIndex < 0) {
                        this.currentIndex = 0;
                    } else {
                        this.currentIndex--;
                    }
                    break;
            }
            this.moveSection(this.section.eq(this.currentIndex));
        },
        moveSection : function(element) {
            var elementHeight = element.outerHeight();
            var elementTop = element.offset().top - 80;
            // var translate3d = 'translate3d(0px, -' + Math.round(elementTop) + 'px, 0px)';
            var transition = 'all ' + 700 + 'ms ' + 'ease';
            var _this = this;
            var transition = {x : 0, y : (-1)*Math.round(elementTop), z : 0};
            console.log(elementTop)
            var fn = function () {
                _this.isScroll = true;
            }
            this.sectionObj.translate3d(transition, 500, 'linear', fn);
            // this.sectionObj.css({
            //     'transform' : translate3d,
            //     '-webkit-transition': transition,
            //     'transition': transition
            // });
            // var _this = this;
            // this.sectionObj.stop().animate({
            //     'opacity' : 1
            // },{
            //     step : function (now, fx) {
            //         $(this).css({
            //             'transform' : translate3d,
            //             '-webkit-transition': transition,
            //             'transition': transition
            //         });
            //     },
            //     complete : function () {
            //         win.clearTimeout(win.timer);
            //         win.timer = win.setTimeout(function () {
            //             console.log('end')
            //             _this.isScroll = true;
            //         }, 200);
            //     }
            // }, 500);
        }
    };
    $(function () {
        win.CustomInteract = new win.OPPY.CustomInteract();

        $('.fullpage #custom_section').fullpage({
            autoScrolling:true,
            scrollHorizontally: true
        });

        var delay = 200;
        $.fn.translate3d = function(translations, speed, easing, complete) {
            console.log('exe')
            var opt = $.speed(speed, easing, complete);
            opt.easing = opt.easing || 'ease';
            translations = $.extend({x: 0, y: 0, z: 0}, translations);

            return this.each(function() {
                var $this = $(this);

                $this.css({ 
                    transitionDuration: opt.duration + 'ms',
                    transitionTimingFunction: opt.easing,
                    transform: 'translate3d(' + translations.x + 'px, ' + translations.y + 'px, ' + translations.z + 'px)'
                });

                setTimeout(function() { 
                    $this.css({ 
                        transitionDuration: '0s', 
                        transitionTimingFunction: 'ease'
                    });

                    opt.complete();
                }, opt.duration + (delay || 0));
            });
        };
    });
}(window, window.jQuery, window.document));