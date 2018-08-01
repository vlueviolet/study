(function (win, $, doc) {
    'use strict';
    win.OVERWATCH = win.OVERWATCH || {};

    win.OVERWATCH.Table = function (args) {
        var defParams = {
            wrap : '#container',
            tableArea : '#forInLoop',
            tableArea2 : '#handlebars',
            url : '../json/sampleData_count.json'
        };
        this.opts = defParams;
        if(!((this.wrap = $(this.opts.wrap)).length)) return;
        this.init();
    };
    win.OVERWATCH.Table.prototype = {
        init : function () {
            this.setElements();
            this.initLayout();
        },
        initLayout : function () {
            this.getData(this.opts.url);    // for in loop
            this.handleBars();  // handlebars
        },
        setElements : function () {
            this.tableArea = this.wrap.find(this.opts.tableArea);
            this.tableArea2 = this.wrap.find(this.opts.tableArea2);
        },
        getData : function (url) {
            var _this = this;
            $.ajax({
                dataType : 'json',
                url: url,
                success: function(response) {
                    _this.makeData(response);
                },
                complete: function () {
                    
                },
                error:function(e){
                    console.error(e);
                }
            });

            // getJSON 메서드
            // $.getJSON(url, function (json) {
            //     _this.makeData(json);
            // });
        },
        makeData : function (data) {
            this.data = data;
            this.forInLoop();
        },
        forInLoop : function () {
            var tag = '<table class="tbl"><caption><span>매물 정보</span></caption><thead><tr><th scope="col">지역</th><th scope="col">업데이트 날짜</th><th scope="col">전세/매매</th><th scope="col">가격</th><th scope="col">조회수</th></tr></thead><tbody>';

            for(var i in this.data) {
                tag += '<tr><td>' + this.data[i].area + '</td>' + 
                '<td>' + this.data[i].year + '</td>'+
                '<td>' + this.data[i].division + '</td>'+
                '<td>' + this.data[i].price + '</td>'+
                '<td>' + this.data[i].count + '</td></tr>';
            }
            tag += '</tbody></table>';
            this.tableArea.append(tag)
        },
        handleBars : function () {
            var _this = this;
            var source = $('#handlebars-template').html();
            var template = Handlebars.compile(source);

            var comma = function(str) {
                str = String(str);
                return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
            };

            $.ajax({
                dataType : 'json',
                url : '../json/sampleData_real.json',
                success : function (response) {
                    _this.handleBarsData(response);
                    // console.log(response.data[0].deposit)
                    Handlebars.registerHelper('bank', function (options) {
                        return comma(options);
                    });
                    var html = template(response);
                    _this.tableArea2.append(html);
                },
                error : function (e) {
                    console.error(e);
                }
            });
        },
        handleBarsData : function (data) {
            this.handleBarsData = data;
            
        }
    }

    $(function () {
        win.OVERWATCH.Table = new win.OVERWATCH.Table();
    });

})(window, window.jQuery, window.document);