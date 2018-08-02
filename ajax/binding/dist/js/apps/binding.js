(function (win, $, doc, $h) {
    'use strict';
    win.BINDING = win.BINDING || {};

    win.BINDING.ForInLoop = function (args) {
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
    win.BINDING.ForInLoop.prototype = {
        init : function () {
            this.setElements();
            this.initLayout();
        },
        initLayout : function () {
            this.getData(this.opts.url);    // for in loop
        },
        setElements : function () {
            this.tableArea = this.wrap.find(this.opts.tableArea);
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
        }
    }

    win.BINDING.HandleBars = function (args) {
        var defParams = {
            wrap : '#container',
            tableArea : '#handlebars',
            tableArea2 : '#handlebars_withas',
            url : '../json/sampleData_real.json'
        };
        this.opts = defParams;
        if(!((this.wrap = $(this.opts.wrap)).length)) return;
        this.init();
    };
    win.BINDING.HandleBars.prototype = {
        init : function () {
            this.setElements();
            this.initLayout();
        },
        initLayout : function () {
            this.handleBarsFunc();  // handlebars
            this.handelBarWithAs();
        },
        setElements : function () {
            this.tableArea = this.wrap.find(this.opts.tableArea);
            this.tableArea2 = this.wrap.find(this.opts.tableArea2);
        },
        handleBarsFunc : function () {
            var _this = this;
            // 핸들바 템플릿을 가져온다.
            $h.source = $('#handlebars-template').html();
            $h.partial = $('#partial-template').html();
            
            // 핸들바 템플릿을 pre컴파일 한다.
            // var template = Handlebars.compile($("#handlebars-template").html());
            var template_temp = Handlebars.compile($h.source);

            var comma = function(str) {
                str = String(str);
                return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
            };
            // 바인딩 할 데이터를 가져온다.
            $.ajax({
                dataType : 'json',
                url : this.opts.url,
                success : function (response) {
                    // 데이터를 다른 함수에서 사용할 수 있도록 공용화 하기 위한 과정, 안해도 됨
                    _this.handleBarsData(response);
                    
                    // partial 템플릿을 'partialText'이라는 이름으로 등록
                    Handlebars.registerPartial('partialText', $h.partial);

                    // custome helper 등록 (deposit을 인자로 받아서 전체 bank를 반환한다.)
                    // bank는 내가 지정한 값, deposit은 json키
                    Handlebars.registerHelper('bank', function (deposit) {
                        return comma(deposit);
                    });
                    // 헬퍼는 기본적으로 options라는 인자값이 있다.
                    // Handlebars.registerHelper('bank', function (options) {
                    //     return comma(options);
                    // });

                    // 핸들바 템플릿에 데이터를 바인딩해서 html을 생성한다.
                    var html = template_temp(response);
                    // 생성된 html을 화면에 뿌려준다.
                    _this.tableArea.append(html);
                },
                error : function (e) {
                    console.error(e);
                }
            });
        },
        handleBarsData : function (data) {
            this.handleBarsData = data;
        },
        handelBarWithAs : function () {
            //핸들바 템플릿 가져오기
            var source = $("#with-as-template").html(); 

            //핸들바 템플릿 컴파일
            var template = Handlebars.compile(source);

            //핸들바 템플릿에 바인딩할 데이터
            var data = {
                users: [
                    { name: "홍길동", id: "aaa", hobbys: ['축구', '야구', '농구'] },
                    { name: "이순신", id: "bbb", hobbys: ['족구', '피구', '탁구'] },
                    { name: "이성계", id: "ccc", hobbys: ['수구', '배구', '농구'] },
                    { name: "장영실", id: "ddd", hobbys: ['축구', '피구', '농구'] },
                    { name: "장보고", id: "eee", hobbys: ['배구', '야구', '족구'] }
                ]
            };

            //핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
            var html = template(data); 

            //생성된 HTML을 DOM에 주입
            this.tableArea2.append(html);

        }
    }

    $(function () {
        win.BINDING.ForInLoop = new win.BINDING.ForInLoop();
        win.BINDING.HandleBars = new win.BINDING.HandleBars();
    });

})(window, window.jQuery, window.document, Handlebars);