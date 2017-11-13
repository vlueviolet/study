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
            this.pageNav = this.paging.find(this.opts.pageNav);
            this.pageNavLi = this.paging.find(this.opts.pageNavLi);
            this.btnNav = this.paging.find(this.opts.btnNav);
            this.btnWholeArea = this.mapArea.find(this.opts.btnWholeArea);
            this.mapIMG = this.mapArea.find(this.opts.mapIMG);
            this.btnOnMap = this.mapArea.find(this.opts.btnOnMap);
            this.btnArea = this.mapArea.find(this.opts.btnArea);
        },
        setOpts : function () {
            this.winWidth = $(win).width();
            this.winHeight = $(win).height();
            this.mapWidth = this.map.width();
            this.mapHeight = this.map.height();
            this.currentIndex = 0;
            this.prevIndex = 0;
            this.areaPosition = [
                [1464,1430,1202], //x,y,2r
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
            this.appendChildNum = 0;
        },
        reSetOpts : function () {
            this.winWidth = $(win).width();
            this.winHeight = $(win).height();
            this.mapWidth = this.map.width();
            this.mapHeight = this.map.height();
        },
        initLayout : function () {
            this.areaInfo.eq(0).show();
            this.calculateMiddlePosition();
            this.pageNum();
            this.pageNav.css({
                width : this.pageNavLi.length * this.pageNavLi.width()
            })
            this.pageNavLi.eq(this.currentIndex).addClass(this.opts.activeClass);
            for(var i = 0, max = this.btnNav.length ; i < max ; i++){
                this.btnNav.eq(i).attr('data-nav-index', i);
            }
            this.btnOnMap.css({
                width : this.winHeight,
                height : this.winHeight,
                marginTop : -this.winHeight/2,
                marginLeft : -this.winHeight/2,
            });

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
            this.btnNav.on('click', $.proxy(this.pageNavigator, this));
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
        },
        pageNum : function () {
            this.curPaging.html(this.currentIndex+1);
            this.totalPaging.html(this.areaPosition.length);
        },
        pageNavigator : function (e) {
            var target = $(e.currentTarget);
            this.prevIndex = this.currentIndex;
            this.currentIndex = parseInt(target.attr('data-nav-index'));

            if (this.animateType) return;
            this.animateType = true;
            if(this.currentIndex > this.prevIndex) {
                this.direction = 'next';
            }else if(this.currentIndex <= this.prevIndex) {
                this.direction = 'prev';
            }

            this.moveArea();
        },
        pageNavMove : function () {
            var offsetVal = Math.abs(this.prevIndex - this.currentIndex);
            if(offsetVal >= this.areaLength - 1) {
                offsetVal = 1;
            }
            this.leftOffset = parseInt(this.pageNav.css('left'));

            if(this.direction === 'prev') {
                console.log('prev');
                this.pageNav.animate({
                    left : (this.leftOffset + offsetVal * this.pageNavLi.width())
                }, 800, $.proxy(function () {
                    for(var i = 0 ; i < offsetVal ; i++){
                        $('.nav').find('li').last().prependTo(this.pageNav);
                    }

                    this.pageNav.css({
                        left : 0
                    });

                }, this));
            }else if(this.direction === 'next') {
                console.log('next');
                this.pageNav.animate({
                    left : (this.leftOffset - offsetVal * this.pageNavLi.width())
                }, 800, $.proxy(function () {
                    this.pageNav.css({
                        left : 0
                    });
                    for(var i = 0 ; i < offsetVal ; i++){
                        $('.nav').find('li').first().appendTo(this.pageNav);
                    }
                }, this));
            }
            this.pageNavLi.eq(this.prevIndex).removeClass(this.opts.activeClass);
            this.pageNavLi.eq(this.currentIndex).addClass(this.opts.activeClass);


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
            this.moveArea();
        }
    };

    $(function () {
        win.mapView = new win.BlueHole.mapView();
    });
})(window, window.jQuery);