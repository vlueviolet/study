# Outside Event
* 딤드 레이어팝업에서 레이어 이외의 딤드영역을 클릭시 팝업이 닫히도록 한다.
* 레이어 팝업은 대부분 사용하기때문에 outside event 관련 파일은 기본적으로 셋팅해주는게 좋다.

<br>

## 예제코드보기
* [https://vlueviolet.github.io/study/exam/exam7/index_final2.html](https://vlueviolet.github.io/study/exam/exam7/index_final2.html)
* [코드보기](https://github.com/vlueviolet/study/blob/gh-pages/exam/exam7/index_final2.html)
<br>

## Key Point
* 레이어 앞뒤로 가상의 태그(.js-focusout)를 추가
```javascript
var focusOutTagClass = 'js-focusout';
var focusOutTag = '<span class="' + focusOutTagClass + '" tabindex="0" style="overflow:hidden;position:absolute;left:0;top:0;z-index:-1;width:1px;height:1px;font-size:0;line-height:0"></span>';
```
![](/img/summary/exam7/1.png)
+ trigger와 triggerHandler
  + trigger : 기본 이벤트(click, focus등)와 관련함수모두실행
  + triggerHandler : 기본 이벤트만 실행하고 관련 함수는 실행하지않음
  + 여기에서 쓰인 이유는, 클릭해서 레이어팝업을 닫을때 clickoutside 이벤트가 발생함으로 다른곳에 영향을 주지않으면서 레이어를 닫는 함수를 실행할 수 있기때문
+ 레이어를 보여주는 함수에 setTimeout을 쓰는 이유?
  아래와 같이 코드가 작성되어 있다면
  ```javascript
  obj.show();
  alert("안녕");
  ```
  실제순서는 alert → show순으로 실행된다.
  이는 시스템적 오류이기 때문에 먼저 show()를 실행하고 시간차를 두고 이후 실행할 함수를 호출해주는게 좋다.
  코드상 시간차 함수는 showAfterBugFunc()를 확인해보길
   

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



<br><br>
##### [Github Markdown](https://guides.github.com/features/mastering-markdown/)
