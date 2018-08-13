(function (win, $, doc) {
    'use strict';

    // 
    /**
     * 특정 팀이 들어간 경기 title, 경기 결과 뽑기
     * 팀 : Foxes
     */
    var score = function () {
        $.ajax({
            dataType : 'json',
            url : '../json/score_contenders.json',
            success : function (res) {
                $.map(res, function(value, key) {
                    $.map(value, function (value2, key2) {
                        if(value[key2].teamA_name === 'BlossoM' || value[key2].teamB_name === 'BlossoM') {
                            console.log(value[key2].no);
                        }
                    });
                });
            }
        });
    };

    $(function () {
        score();
    });
})(window, window.jQuery, window.document);