# hash
* 탭을 클릭할 때마다 탭에 해당하는 id값이 URL 마지막에 붙게됨
* 브라우저 상 이전, 다음 페이지 이동시 클릭했던 탭을 차례로 보여줌

<br>

## Code
* [예제](https://vlueviolet.github.io/study/exam/exam9/index.html)
* [코드보기](https://github.com/vlueviolet/study/blob/gh-pages/exam/exam9/js/study.js)
* [코드보기2](https://github.com/vlueviolet/study/blob/gh-pages/exam/exam9/index_final2.html)
<br>

## Key Point
+ 해쉬값 가져오기
```javascript
var h = win.location.hash;
```

+ 해쉬값 주기
```javascript
win.location.hash = '#' + hashName;
```

+ 해쉬 관련 이벤트
```javascript
$(win).on('hashchange', function());
```

+ 탭 클릭시 페이지가 위로 튀지 않게하려면
클릭이벤트를 막는것과 유효성 검사를 넣어주면 된다.
```javascript
e.preventDefault();
if (this.currentIndex === this.tab.index($(e.currentTarget))) return;
```
+ 자식으로부터 인덱스 체크 방법
```javascript
var tabObj = $('.cast_tab ul li a');
tabObj.on('click', function(e){
  var target = $(e.currentTarget);
  tabObj.index(target);
});
```
<br>

## A11Y

<br>


## Support Browsers




<br><br>
##### [Github Markdown](https://guides.github.com/features/mastering-markdown/)
