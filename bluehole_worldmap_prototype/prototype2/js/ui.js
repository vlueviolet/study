(function (win, $) {
'use strict';
    win.BlueHole = win.BlueHole || {};
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        PAGE = win.BlueHole.page;
        PAGE.init();

    win.BlueHole.mapView = function (args) {
        var defParams = {
            mapArea : '.map_area',
            map : '.map',
            map2 : '.map2',
            btnPrev : '.btn_prev',
            btnNext : '.btn_next',
            areaInfoWrap : '.area_info_wrap',
            areaInfo : '.area_info',
            activeClass : 'active',
            paging : '.paging',
            curPaging : '.cur',
            totalPaging : '.total',
            pageArea : '.nav_area',
            pageNav : '.nav',
            pageNavLi : 'li',
            btnNav : 'button',
            btnWholeArea : '.btn_whole_area',
            mapIMG : '.mapImg',
            btnOnMap : '.btnOnMap',
            btnArea : '.btn_inner'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.mapArea = $(this.opts.mapArea)).length) return;
        this.init();
    };
    win.BlueHole.mapView.prototype = {
        init : function () {
            this.setElements();
            this.setOpts();
            this.initLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.map = this.mapArea.find(this.opts.map);
            this.map2 = this.mapArea.find(this.opts.map2);
            this.btnPrev = this.mapArea.find(this.opts.btnPrev);
            this.btnNext = this.mapArea.find(this.opts.btnNext);
            this.areaInfoWrap = this.mapArea.find(this.opts.areaInfoWrap);
            this.areaInfo = this.mapArea.find(this.opts.areaInfo);
            this.paging = this.mapArea.find(this.opts.paging);
            this.curPaging = this.paging.find(this.opts.curPaging);
            this.totalPaging = this.paging.find(this.opts.totalPaging);
            this.pageArea = this.paging.find(this.opts.pageArea);
            this.pageNav = this.paging.find(this.opts.pageNav);
            this.pageNavLi = this.paging.find(this.opts.pageNavLi);
            this.btnNav = this.paging.find(this.opts.btnNav);
            this.btnWholeArea = this.mapArea.find(this.opts.btnWholeArea);
            this.mapIMG = this.mapArea.find(this.opts.mapIMG);
            this.btnOnMap = this.mapArea.find(this.opts.btnOnMap);
            this.btnArea = this.mapArea.find(this.opts.btnArea);
            this.startIndexPosition
        },
        setOpts : function () {
            this.winWidth = $(win).width();
            this.winHeight = $(win).height();
            this.mapWidth = this.map.width();
            this.mapHeight = this.map.height();
            this.currentIndex = 0;
            this.prevIndex = 0;
            this.areaPosition = [
                [1464,1430,1202],
                [922,2461,461],
                [1480,3007,503],
                [454,2899,616],
                [476,1384,411],
                [963,832,594],
                [382,234,368],
                [2934,410,716],
                [2739,2323,531]
            ];
            this.areaLength = this.areaPosition.length-1;
            this.animateType = false;
            this.startIndexPosition = 3
        },
        reSetOpts : function () {
            this.winWidth = $(win).width();
            this.winHeight = $(win).height();
            this.mapWidth = this.map.width();
            this.mapHeight = this.map.height();
            this.pageNavSize();
        },
        pageNavSize : function () {
            var _width = 0;
            for (var i = 0, max = this.pageNavLi.length; i < max; i++) {
                var target = this.pageNavLi.eq(i),
                    targetWidth = target.outerWidth();
                _width += targetWidth;
            }
            this.pageNavWidth = _width;
            this.pageNavLiWidth = this.pageNavLi.eq(0).outerWidth();
            this.pageAllNav.css('width', _width);
            this.pageWrap.css('width', _width * this.pageAllNav.length);
        },
        pageNavInitMove : function () {
            this.pageArea.scrollLeft(this.pageAllNav.eq(0).width());
        },
        initLayout : function () {
            this.areaInfo.eq(0).show();
            this.calculateMiddlePosition();
            this.pageNum();
            // for(var i = 0, max = this.btnNav.length ; i < max ; i++){
            //     this.btnNav.eq(i).attr('data-nav-index', i);
            // }
            this.btnOnMap.css({
                width : this.winHeight,
                height : this.winHeight,
                marginTop : -this.winHeight/2,
                marginLeft : -this.winHeight/2,
            });
            var clonePage = this.pageNav.clone();
            this.pageArea.prepend(this.pageNav.clone());
            this.pageArea.append(this.pageNav.clone());
            this.pageAllNav = this.pageArea.find(this.opts.pageNav);
            this.pageAllNavLi = this.pageAllNav.find(this.opts.pageNavLi);
            this.pageAllNav.wrapAll('<div class="js_nav_wrap"/>');
            this.pageWrap = this.pageArea.find('.js_nav_wrap');
            this.pageNavSize();
            this.pageNavInitMove();
            this.pageNavMove();
            // console.log(this.winHeight);

            // this.showBtnFunc();
        },
        calculateMiddlePosition : function () {
            // var topOffset = this.mapHeight - this.areaPosition[this.currentIndex][1] - this.areaPosition[this.currentIndex][2];
            // var leftOffset = this.mapWidth - this.areaPosition[this.currentIndex][0] - this.areaPosition[this.currentIndex][2];
            // var leftValue = this.mapWidth - this.winWidth/2  - this.areaPosition[this.currentIndex][2]/2 - leftOffset;
            // var topValue = this.mapHeight - this.winHeight/2  - this.areaPosition[this.currentIndex][2]/2 - topOffset;

            var topValue =  this.areaPosition[this.currentIndex][1] + this.areaPosition[this.currentIndex][2] - this.winHeight/2  - this.areaPosition[this.currentIndex][2]/2;
            var leftValue = this.areaPosition[this.currentIndex][0] + this.areaPosition[this.currentIndex][2] - this.winWidth/2  - this.areaPosition[this.currentIndex][2]/2;

            this.map.stop().animate({
                top : -topValue,
                left : -leftValue,
                margin : 0
            },1000, $.proxy(function () {
                this.animateType = false;
            }, this));
        },
        bindEvents : function () {
            this.btnNext.on('click', $.proxy(this.nextMoveFunc, this));
            this.btnPrev.on('click', $.proxy(this.prevMoveFunc, this));
            this.pageArea.on('click', this.opts.btnNav, $.proxy(this.pageNavigator, this));
            this.btnWholeArea.on('click', $.proxy(this.viewWholeArea, this));
            this.btnArea.on('click', $.proxy(this.wholeMapClickFunc, this));
            $(win).on('resize', $.proxy(this.resizeWindow, this));
        },
        nextMoveFunc : function () {
            if (this.animateType) return;
            this.animateType = true;

            this.prevIndex = this.currentIndex;
            this.direction = 'next';

            if(this.currentIndex >= this.areaLength){
                this.currentIndex = 0;
                this.navAllcurrentIndex = (this.pageNavLi.length * 2);
            }else{
                this.currentIndex++;
            }
            this.moveArea();
        },
        prevMoveFunc : function () {
            if (this.animateType) return;
            this.animateType = true;

            this.prevIndex = this.currentIndex;
            this.direction = 'prev';

            if(this.currentIndex <= 0) {
                this.currentIndex = this.areaLength;
                this.navAllcurrentIndex = this.pageNavLi.length - 1;
                // this.btnPrev.fadeOut();
            }else{
                this.currentIndex--;
            }
            this.moveArea();
        },
        moveArea : function () {
            // this.showBtnFunc();
            this.showAreaInfo();
            this.pageNum();
            this.calculateMiddlePosition();
            this.pageNavMove();
        },
        showBtnFunc : function () {
            if(this.currentIndex === this.areaLength){
                this.btnNext.stop(true,true).hide();
            }else{
                this.btnNext.stop(true,true).show();
            }
            if(this.currentIndex === 0){
                this.btnPrev.hide();
            }else{
                this.btnPrev.show();
            }
        },
        showAreaInfo : function () {
            if(this.prevIndex === this.currentIndex) return;
            this.areaInfo.stop(true, true).fadeOut('slow');
            this.areaInfo.eq(this.currentIndex).stop(true, true).fadeIn('slow');
        },
        resizeWindow : function () {
            this.reSetOpts();
            this.calculateMiddlePosition();
            win.clearTimeout(this.resizeEndTime);
            this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 150);
        },
        resizeEndFunc : function () {
            this.pageNavMove();
        },
        pageNum : function () {
            this.curPaging.html(this.currentIndex+1);
            this.totalPaging.html(this.areaPosition.length);
        },
        pageNavigator : function (e) {
            var target = $(e.currentTarget).parent();
            if (this.animateType) return;
            this.animateType = true;
            this.prevIndex = this.currentIndex;
            this.currentIndex = target.index();
            this.navAllcurrentIndex = this.pageAllNavLi.index(target);
            this.moveArea();
        },
        pageNavMove : function () {
            var allOfCurrentIndex = (this.navAllcurrentIndex) ? this.navAllcurrentIndex : this.pageNavLi.length + this.currentIndex,
                centerIndex = allOfCurrentIndex - this.startIndexPosition,
                moveWidth = (centerIndex * this.pageNavLiWidth);
            this.allOfCurrentIndex = allOfCurrentIndex;
            this.pageArea.stop().animate({
                'scrollLeft' : moveWidth
            }, $.proxy(this.pageNavMoveEnd, this));

            for (var i = 0, max = this.pageAllNav.length; i < max; i++) {
                this.pageAllNav.eq(i).children().eq(this.prevIndex).removeClass(this.opts.activeClass);
                this.pageAllNav.eq(i).children().eq(this.currentIndex).addClass(this.opts.activeClass);
            }
        },
        pageNavMoveEnd : function () {
            this.navAllcurrentIndex = null;
            var minLength = this.pageNavLi.length,
                maxLength = this.pageNavLi.length * 2,
                allOfCurrentIndex = this.allOfCurrentIndex;
            if (allOfCurrentIndex < minLength) {
                var moveWidth = (minLength + allOfCurrentIndex - 2) * this.pageNavLiWidth;
                this.pageArea.stop(true, true).scrollLeft(moveWidth);
            } else if (allOfCurrentIndex >= maxLength) {
                var moveWidth = (allOfCurrentIndex - minLength - 2) * this.pageNavLiWidth;
                this.pageArea.stop(true, true).scrollLeft(moveWidth);
            }
        },
        appendNavChild : function () {
            if(this.direction === 'prev'){
                // this.pageNavLi.last().prependTo(this.pageNav);
            }

        },
        viewWholeArea : function () {
            if(this.map2.is(':visible')){
                this.map2.stop(true,true).fadeOut();
            }else{
                this.map2.stop(true,true).fadeIn();
            }
        },
        wholeMapClickFunc : function (e) {
            var target = $(e.currentTarget);
            this.prevIndex = this.currentIndex;
            this.currentIndex = target.index();
            this.map2.hide();
            console.log(this.prevIndex);
            console.log(this.animateType);
            this.moveArea();
        }
    };

    $(function () {
        win.mapView = new win.BlueHole.mapView();
    });
})(window, window.jQuery);