# Slide
* 현재 인덱스, 이전 인덱스만으로 슬라이드를 구현할 수 있다.

<br>

## Code
* [예제](https://vlueviolet.github.io/study/exam/exam9/index2.html)
* [코드보기](https://github.com/vlueviolet/study/blob/gh-pages/exam/exam9/js/study2.js)
* [코드보기2](https://github.com/vlueviolet/study/blob/gh-pages/exam/exam9/index_final2.html)
<br>

## Key Point
+ 2개의 인덱스로 슬라이드를 만들경우, 방향성을 정해주면된다.<br>
  클릭한 인디케이터를 예로들면,<br>
  + 현재 인덱스 > 인디케이터 : 왼-오른쪽<br>
    인디케이터의 콘텐츠 : -100-->0<br>
    이전 인덱스콘텐츠 : 0 ---> 100%<br>
    나머지 콘텐츠 : -100%<br>
  + 현재 인덱스 < 인디케이터 : 오-왼쪽<br>
    인디케이터의 콘텐츠 : 0 ---> -100%<br>
    이전 인덱스콘텐츠 : 100% ---> 0<br>
    나머지 콘텐츠 : 100%<br>
  + 현재 인덱스 = 인디케이터 : 아무것도 안함

  나머지 콘텐츠들의 위치도 방향에 따라 정해지기때문에 이전, 다음 버튼을 누를때도 자연스럽게 보여질 수 있다.
   

<br>

## A11Y
+ KWCAG 1.1.1, 1.1.2<br>
 tabindex를 활용하여 현재 콘텐츠에 키보드 초점이 이동할 수 있도록 한다.
<br>


## Support Browsers




<br><br>
##### [Github Markdown](https://guides.github.com/features/mastering-markdown/)
