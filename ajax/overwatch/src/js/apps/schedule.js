(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};
    win.OVERWATCH.Common = win.OVERWATCH.Common || {};
    win.OVERWATCH.Admin = win.OVERWATCH.Admin || {};
    win.OVERWATCH.Schedule = win.OVERWATCH.Schedule || {};

    var UTIL = win.OVERWATCH.Common.util,
        PAGE = win.OVERWATCH.page;

    win.OVERWATCH.Schedule.clickSchedule = win.OVERWATCH.Schedule.clickSchedule || {};
    win.OVERWATCH.Schedule.clickSchedule = function (args) {
        var defParams = {
            wrap : '.schedule_wrap',
            scheduleArea : '.schedule_area',
            scheduleList : '.list_schedule',
            activeClass : 'on',
            toggleText : '.toggle_txt',
            initIndex : 0
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Schedule.clickSchedule.prototype = {
        init : function() {
            this.initLayout();
            this.setElements();
            this.bindEvents();
            this.getDate();
            this.setTodaySchedule();
        },
        initLayout : function () {
            this.past = false;
            this.current = false;
            this.future = false;
        },
        setElements : function () {
            this.scheduleList = this.wrap.find(this.opts.scheduleList);
            this.scheduleArea = this.wrap.find(this.opts.scheduleArea);
            this.scheduleChild = this.scheduleList.children();
            this.toggleText = this.scheduleList.find(this.opts.toggleText);
        },
        bindEvents : function () {
            this.scheduleChild.on('click', '.summary', $.proxy(this.clickFunc ,this));
        },
        clickFunc : function (e) {
            e.preventDefault();
            var parent = $(e.delegateTarget),
                    target = $(e.currentTarget);
            this.prevIndex = this.currentIndex;
            this.currentIndex = parent.index();
            if(parent.hasClass(this.opts.activeClass)) {
                this.scheduleChild.eq(this.prevIndex).removeClass(this.opts.activeClass);
                this.scheduleChild.eq(this.currentIndex).removeClass(this.opts.activeClass);
            } else {
                this.scheduleChild.eq(this.prevIndex).removeClass(this.opts.activeClass);
                this.scheduleChild.eq(this.currentIndex).addClass(this.opts.activeClass);
            }
        },
        setTodaySchedule : function () {
            var txtData = [],
                    val = 0;

            this.scheduleChild.each($.proxy(function (i) {
                txtData.push(String(this.scheduleChild.eq(i).data('week').replace(/-/g,"")));
            }, this));
            for(var i = 0, max = txtData.length ; i < max ; i++) {
                if(txtData[max-1] < this.thisWeek) {    // 과거
                    this.scheduleChild.eq(max-1).addClass(this.opts.activeClass);
                    this.currentIndex = max - 1;
                }
                if(txtData[max-1] === this.thisWeek) {  // 현재
                    this.scheduleChild.eq(max-1).addClass(this.opts.activeClass);
                    this.currentIndex = max-1;
                }
                if(txtData[max-1] > this.thisWeek) {
                    if(txtData[0] === this.thisWeek) {   // 과거~미래 중, 현재와 일치
                        this.scheduleChild.eq(0).addClass(this.opts.activeClass);
                        this.currentIndex = 0;
                        return;
                    }
                    if(txtData[0] < this.thisWeek) {   // 과거~미래 중, 현재와 일치
                        if(txtData[i] === this.thisWeek) {
                            this.scheduleChild.eq(i).addClass(this.opts.activeClass);
                            this.currentIndex = i;
                            return;
                        }
                        if (txtData[i] > this.thisWeek) { // 미래
                            this.scheduleChild.eq(i).addClass(this.opts.activeClass);
                            this.currentIndex = i;
                            return;
                        }
                    }
                    if (txtData[0] > this.thisWeek) { // 미래
                        this.scheduleChild.eq(0).addClass(this.opts.activeClass);
                        this.currentIndex = 0;
                    }
                }
            }
            this.scheduleChildHeight = this.scheduleChild.outerHeight();
            var topValue = this.prevLength * this.scheduleChildHeight + $('.top_content').outerHeight() - $('#sub_nav').outerHeight(true);

            // $('html, body').stop().animate({
            //     scrollTop : topValue
            // }, 300);
        },
        getDate : function  () {
            // var date = new Date();
            // var year = date.getFullYear().toString(),
            //       month = (date.getMonth() + 1).toString(),
            //       num = year+month,
            //       week = this.getWeek(year+month);
            // this.thisWeek = year+month+week;
            // console.log('이번주 : ', this.thisWeek)
            var date = new Date();
            var year = moment().year(),
                  month = moment().month(),
                  week = this.getWeek(year, month),
                  today = moment().format('YYYYMMDD');

             for (var i = 0, max = week.length ; i < max ; i++) {

                if(today >= week[i].weekStart && today <= week[i].weekEnd) {
                    this.thisWeek = year.toString()+(month+1).toString()+(i+1);
                }
             }
        },
        getWeek : function (year, month) {
            // var year  = Number(dateStr.substring(0, 4));
            // var month = Number(dateStr.substring(4, 6));
            // var nowDate = new Date(year, month-1, 1);
            // var lastDate = new Date(year, month, 1).getDate();
            // var monthSWeek = nowDate.getDay();
            // var weekSeq = parseInt((parseInt(lastDate) + monthSWeek - 1)/7) + 1;
            // console.log(lastDate)
            // return weekSeq;
            //
            var monthStart     = moment().year(year).month(month).date(1);

            var monthEnd       = moment().year(year).month(month).endOf('month');
            var numDaysInMonth = moment().year(year).month(month).endOf('month').date();

            //calculate weeks in given month
            var weeks      = Math.ceil((numDaysInMonth + monthStart.day()) / 7);
            var weekRange  = [];
            var weekStart = moment().year(year).month(month).date(1);
            var i=0;
            while( i < weeks ){
                var weekEnd   = moment(weekStart);


                if(weekEnd.endOf('week').date() <= numDaysInMonth && weekEnd.month() == month) {
                    weekEnd = weekEnd.endOf('week').format('YYYYMMDD');
                }else{
                    weekEnd = moment(monthEnd);
                    weekEnd = weekEnd.format('YYYYMMDD')
                }

                weekRange.push({
                    'weekStart': weekStart.format('YYYYMMDD'),
                    'weekEnd': weekEnd
                });


                weekStart = weekStart.weekday(7);
                i++;
            }
            return weekRange;
        }
    };

    // 필터
    win.OVERWATCH.Schedule.LayerControl = win.OVERWATCH.Schedule.LayerControl || {};
    win.OVERWATCH.Schedule.LayerControl = function (args) {
        var defParams = {
            wrap : '.schedule_wrap',
            btnScore : '.btn_score',
            btnPlay : '.btn_play'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Schedule.LayerControl.prototype = {
        init : function() {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        initLayout : function () {

        },
        setElements : function () {
            this.btnScore = this.wrap.find(this.opts.btnScore);
            this.btnPlay = this.wrap.find(this.opts.btnPlay);
        },
        bindEvents : function () {
            this.wrap.on('click', this.opts.btnScore, $.proxy(this.clickScoreFunc ,this));
        },
        clickScoreFunc : function (e) {
            e.preventDefault();
            window.ScoreLayer.clickFunc(e);
        },
        clickMediaFunc : function (e) {
            e.preventDefault();
            window.MediaLayer.init();
            window.MediaLayer.clickFunc(e);
        }
    };

    // 필터
    win.OVERWATCH.Schedule.Filter = win.OVERWATCH.Schedule.Filter || {};
    win.OVERWATCH.Schedule.Filter = function (args) {
        var defParams = {
            wrap : '.filter_area',
            btnObj : '.btn_filter',
            filterItemFull : '.item_full',
            btnView : '.btn_view',
            activeClass : 'on'
        };
        this.opts = $.extend({}, defParams, (args || {}));
        if (!(this.wrap = $(this.opts.wrap)).length) return;
        this.init();
    }
    win.OVERWATCH.Schedule.Filter.prototype = {
        init : function() {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        initLayout : function () {
            this.wrap.removeClass(this.opts.activeClass);
            this.filterItemFull.removeClass(this.opts.activeClass);
        },
        setElements : function () {
            this.btnObj = this.wrap.find(this.opts.btnObj);
            this.filterItemFull = this.wrap.find(this.opts.filterItemFull);
            this.btnView = this.wrap.find(this.opts.btnView);
        },
        bindEvents : function () {
            this.btnObj.on('click', $.proxy(this.clickFunc ,this));
            this.filterItemFull.on('click', '.btn_view', $.proxy(this.clickAllTeamFunc ,this));
        },
        clickFunc : function (e) {
            e.preventDefault();
            if(this.wrap.hasClass(this.opts.activeClass)) {
                this.wrap.removeClass(this.opts.activeClass);
            } else {
                this.wrap.addClass(this.opts.activeClass);
            }
        },
        clickAllTeamFunc : function (e) {
            e.preventDefault();
            var parent = $(e.delegateTarget),
                    target = $(e.currentTarget);
            if(parent.hasClass(this.opts.activeClass)) {
                parent.removeClass(this.opts.activeClass);
            } else {
                parent.addClass(this.opts.activeClass);
            }
        }
    };

    $(window).on('load', function () {
        win.clickSchedule = new win.OVERWATCH.Schedule.clickSchedule();
        win.LayerControl = new win.OVERWATCH.Schedule.LayerControl();
        win.Filter = new win.OVERWATCH.Schedule.Filter();
    });
})(window, window.jQuery, window.document);