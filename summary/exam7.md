# Outside Event
* 딤드 레이어팝업에서 레이어 이외의 딤드영역을 클릭시 팝업이 닫히도록 한다.
* 레이어 팝업은 대부분 사용하기때문에 outside event 관련 파일은 기본적으로 셋팅해주는게 좋다.

<br>

## 코드보기
* [https://vlueviolet.github.io/study/exam/exam7/index_final2.html](https://vlueviolet.github.io/study/exam/exam7/index_final2.html)
<br>

## Key Point
레이어 앞뒤로 가상의 태그(.js-focusout)를 추가
```javascript
var focusOutTagClass = 'js-focusout';
var focusOutTag = '<span class="' + focusOutTagClass + '" tabindex="0" style="overflow:hidden;position:absolute;left:0;top:0;z-index:-1;width:1px;height:1px;font-size:0;line-height:0"></span>';
```
![](/img/summary/exam7/1.png)
<br>

## A11Y
* KWCAG 1.1.1, 1.1.2
  * 버튼 클릭시 레이어로 키보드 초점 이동
  * 키보드 초점이 레이어 내에 계속 머무르게 되고, 닫기버튼을 클릭해야만 닫힘
  * 레이어 닫기버튼 클릭시, 레이어를 호출했던 버튼으로 초점 이동함
<br>

## 필수 플러그인
* Outside Event<br>[http://benalman.com/code/projects/jquery-outside-events/docs/files/jquery-ba-outside-events-js.html](http://benalman.com/code/projects/jquery-outside-events/docs/files/jquery-ba-outside-events-js.html)
<br>

## 추가하면 좋은 플러그인
* Jquery Animate Enhanced : css3 사용성을 높여주는 플러그인<br>
  [https://github.com/benbarnett/jquery-animate-enhanced](https://github.com/benbarnett/jquery-animate-enhanced)
<br>

## 지원 브라우저
IE7+, CR/FF/SR Lately
<br>


##### [Github Markdown](https://guides.github.com/features/mastering-markdown/)
