# Random Object View
* 클릭할때마다 5개의 이미지를 랜덤하게 보여준다.
* 5개의 한 루프를 돌고, 다음 루프에서 이미지가 중복되면 안된다.

  1-3-5-2-**'4'** : 1루프
  
  **'4'**-3-1-5-2 : 2루프
  
  1루프 마지막 4와 2루프 4가 연이어 나오면 안된다.


<br>

## Code
* [예제](https://vlueviolet.github.io/study/exam/exam8/index.html)
* [코드보기](https://github.com/vlueviolet/study/blob/gh-pages/exam/exam8/js/study.js)
<br>

## Key Point
+ 정해진 범위 내 랜덤숫자 출력?
  ```javascript
    this.randomNum = Math.floor(Math.random()*this._length);
  ```
  this._length=6이라면, 6미만의 숫자 0,1,2,3,4,5가 랜덤하게 노출됨
   

<br>

## A11Y
+ KWCAG 1.1.1, 1.1.2
  + 버튼 클릭시 레이어로 키보드 초점 이동
  + 키보드 초점이 레이어 내에 계속 머무르게 되고, 닫기버튼을 클릭해야만 닫힘
  + 레이어 닫기버튼 클릭시, 레이어를 호출했던 버튼으로 초점 이동함
<br>

## Plugin
* Outside Event<br>[http://benalman.com/code/projects/jquery-outside-events/docs/files/jquery-ba-outside-events-js.html](http://benalman.com/code/projects/jquery-outside-events/docs/files/jquery-ba-outside-events-js.html)
<br>

## Better
* Jquery Animate Enhanced : css3 사용성을 높여주는 플러그인<br>
  [https://github.com/benbarnett/jquery-animate-enhanced](https://github.com/benbarnett/jquery-animate-enhanced)
<br>

## Support Browsers
IE7+, CR/FF/SR Lately



<br><br>
##### [Github Markdown](https://guides.github.com/features/mastering-markdown/)
