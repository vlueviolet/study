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

+ setArray()
  arr 배열에는 이미지 개수만큼의 숫자가 for문으로 0부터 차례대로 들어간다.
  
  ```javascript
  this.curIndex = this.arr[this.randomNum];
  ```
  
  이 구문을 통해 기억할 것은,<br>
  이전, 다음 이미지가 겹치지 않기위해 현재 인덱스에 배열값이 들어가는데,<br>
  arr[0], arr[1]..arr[n]이 어떤 오브젝트를 갖고 있는 것이 아니라, 숫자값을 갖고 있다는 것이다.


+ while문 활용
  연속으로 같은 이미지가 나오지 않게 하기위해 while문을 사용했다.
  
  ```javascript
  while(this.prevIndex === this.curIndex){
    this.makeRandomNum();
  }
  ```
  
  while문은 조건을 만족하면 구문을 빠져나오기때문에, 이전 인덱스와 현재 인덱스가 다를때까지 랜덤 숫자를 만드는 함수가 실행되는 것이다.

<br>

## A11Y
없음
<br>

## Plugin
없음
<br>

## Better
없음
<br>

## Support Browsers
IE7+, CR/FF/SR Lately



<br><br>
##### [Github Markdown](https://guides.github.com/features/mastering-markdown/)
