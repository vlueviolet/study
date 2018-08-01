(function($){
     $.fn.dataBind = function(options) {
 
        var settings = $.extend({
            id : '',
            target : '',
            target2 : '',
            target3 : '',
            type : '',
            keyName : '',
            slickTarget : '',
            slickOption : ''
        }, options);

        $.ajax({
            url: settings.url, dataType: 'json',
            success: function(res) {
                var idx = settings.idx; // Index Case
                var target = settings.target; // X-template(ID), Target(Class)
                var target2 = settings.target2; // X-template(ID)
                var target3 = settings.target3; // X-template(ID)
                var type = settings.type; // Type(2nd Depth or 2 Pair Content)
                var keyName = settings.keyName; // Custom Key Name
                var slickTarget = settings.slickTarget; // Slick Target
                var slickOption = settings.slickOption; // Slick Option

                visualLy(target); // 컴포넌트 영역 시각화 (Dev only)

                switch(idx){
                    // Single Content Case
                    case 'case1' :
                        dataBind(res, '#' + target, '.' + target);
                        break;
                    // 2 Nesting Content Case
                    case 'case2' :
                        dataBind(res, '#' + target, '.' + target);
                        dataBind(res, '#' + target2, '.' + target2);
                        break;
                    // 2nd Depth Case
                    case 'case2-2' : 
                        dataBind(res, '#' + target, '.' + target, '#' + target2);
                        break;
                    // 2 Pair Content Case
                    case 'case2-3' :
                        dataBind(res, '#' + target, '.' + target, '#' + target2, type, keyName);
                        break;
                    // 2 Pair && 3 Nesting Content Case
                    case 'case3-2' :
                        dataBind(res, '#' + target, '.' + target, '#' + target2, type, keyName);
                        dataBind(res, '#' + target3, '.' + target3);
                        break;
                }
                
                // Slick Init
                if(slickOption == 'default'){
                    stopSlick(slickTarget);
                    $('.' + slickTarget).slick();
                }else if(slickOption != '' && slickOption != 'default'){
                    slickTarget = slickTarget.replace(/\./g, '');
                    stopSlick(slickTarget);
                    $('.' + slickTarget).slick(slickOption);
                }
            }, error: function(err){console.log(err)}
        });
    };

    // Slick 해제
    function stopSlick(target){
		$('.' + target).slick('unslick');
    }

    // Key값 변환(Key, Value)
    function keyReplace(str, key, value) {
        var regx = new RegExp('{{' + key + '}}', 'g');
        str = str.replace(regx, value);
        return str;
    }

    // JSON Data Bind
    function dataBind(res, xtemplate, bindElem, xtemplate2, opt, defKey) {
        var cnt = 0;
        var result = [];
        var str = '';
            
        // JSON 2nd Depth
        function addCont(cnt){
            $.each(res, function(i, data) {
                $.each(data[cnt], function(i, data) {
                    if (Array.isArray(data)) {
                        $.each(data, function(val, d) {
                            var cont2 = $(xtemplate2).html();
                            for (var subKey in d) {
                                d.hasOwnProperty(subKey) ? cont2 = keyReplace(cont2, subKey, d[subKey]) : '';
                            }
                            result.push(cont2);
                        });
                    }
                });
            });
        }

        // JSON 1st Depth
        $.each(res, function(i, data) {
            for (var key in data) {
                var cont = $(xtemplate).html();
                var cont2 = $(xtemplate2).html();
                var keyArr = [];
                
                $.each(data, function(val, d){
                    keyArr = [];
                    for(var subkey in d){
                        d.hasOwnProperty(subkey) ? keyArr.push(subkey) : '';
                    }
                });
                
                for (i in keyArr) {
                    // Null 값 처리
                    data[key][keyArr[i]] === null ? data[key][keyArr[i]] = '' : '';

                    // 2nd Depth Case
                    if(Array.isArray(data[key][keyArr[i]])){
                        addCont(cnt);
                        for(var j in result){
                            cont = keyReplace(cont, keyArr[i], result);
                        }
                        cnt++;
                        result = [];
                    
                    // 2Pair 콘텐트 리스트 유형
                    }else if(opt == 'pair2'){
                        cont2 = keyReplace(cont2, keyArr[i], data[key][keyArr[i]]);
                    
                    // 디폴트 Case
                    }else{
                        cont = keyReplace(cont, keyArr[i], data[key][keyArr[i]]);
                    }
                }

                // 2Pair 콘텐트 리스트 유형
                if(opt == 'pair2'){
                    // 홀수 Case
                    if(key%2 !== 0){
                        str += cont2;
                        result.push(str);
                    }else{
                        str = cont2;
                    }
                    cnt++;
                    
                    // 콘텐트 Bind
                    if(result.length !== 0){
                        cont = keyReplace(cont, defKey, result);
                        $(bindElem).append(cont);
                    }
                    result = [];

                // 디폴트 콘텐트 Bind
                }else{
                    $(bindElem).append(cont);
                }
            }

            // 2Pair 콘텐트 리스트 유형, 홀수로 끝나는 Case (lastChild)
            if(opt == 'pair2'){
                if(cnt%2 == 1){
                    result.push(cont2);
                    cont = keyReplace(cont, defKey, result);
                    $(bindElem).append(cont);
                }
            }
            cnt = 0;
        });
    }

    // 컴포넌트 영역 시각화 (Dev only)
    var lyCnt = 0;
    function visualLy(target){
        const bgColor = ['#61bd6d', '#1abc9c', '#54acd2', '#2c82c9', '#9365b8', '#e14938', '#f37934', '#fba026', '#fac51c'];
        var rand = bgColor[Math.floor(Math.random() * bgColor.length)];
        $('.' + target).wrap('<div class="bindWrap'+ lyCnt + '"></div>');
        $('.bindWrap' + lyCnt).css('position', 'relative');
        $('.bindWrap' + lyCnt).append('<div class="bindLy'+ lyCnt + '""></div>');
        $('.bindWrap' + lyCnt).append('<span class="bindDesc'+ lyCnt + '"">.' + target + '</span>');
        $('.bindLy' + lyCnt).css('position', 'absolute').css('z-index', '1000').css('left', '0').css('top', '0').css('width', '100%').css('height', '100%').css('background', rand).css('opacity', '0.2');
        $('.bindDesc' + lyCnt).css('position', 'absolute').css('z-index', '1000').css('left', '0').css('top', '0').css('background', '#f00').css('font-size', '18px').css('color', '#fff');
        $('.bindLy' + lyCnt).click(function(){
            $(this).fadeOut();
            $(this).next().fadeOut();
            setTimeout(function(){
                $(this).remove();
                $(this).next().remove();
            }, 1000);
        });
        lyCnt++;
    }
}(jQuery));