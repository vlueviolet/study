# jquery
+ 별도의 라이브러리가 필요하다.
  + [jquery-1.12.4.min.js](https://vlueviolet.github.io/study/js/libs/jquery-1.12.4.min.js)
  + IE7 대응을 위한 버전
+ 모든 브라우저 대응이 가능하다.
+ 선택자 사용이 유리하다.

  + javascript의 선택자
  ```javascript
  document.getElementById('container');	//id가 있어야함
  document.getElementsByClass('box');	//IE8이상 지원 안됨
  ```
  + (javascript method 브라우저 지원](method.html)
  
  + jquery의 선택자
  ```javascript
  $('#container');
  $('.box');
  ```
<br>
## 이벤트와 이벤트에 의한 행동
+ 이벤트를 주는 방법 (선언함수, 익명함수)
1. 선언함수<br>
선언함수에서는 함수 호이스팅시 에러가 발생하지 않는다.<br>자바스크립트의 코드를 해석하면서 코드작성 순서에 상관없이 global 영역에 선언되어 있는 변수나 함수의 선언문들을 먼저 수집하여 전역객체의 속성으로 등록시켜 둔다는 것이다.<br>그렇기 때문에 전역변수와 전역함수는 자바스크립트 코드의 어떠한 위치에서도 실행이 가능한 것이다.

	```javascript
	foo();	//호이스팅, 실행됨
	function foo () {
		...
	}
	```

2. 익명함수<br>
우측만 보면 함수 이름이 없어 익명함수라고 한다. 익명함수는 함수를 변수에 넣어 사용한다.<br><br>
*하이브랩 컨벤션에서는 익명함수로 함수를 표현한다. 함수 호이스팅을 지양한다.*<br><br>
선언함수의 경우에는 script 태그를 실행하기 전에 가장 먼저 읽혀지지만, 익명 함수의 경우는 한 줄, 한 줄 실행되면서 익명 함수가 정의된 부분을 만날 때 정의되는 것이므로 위의 foo();를 호출하기 전에 익명함수를 정의해야 한다.
	```javascript
	foo();	// 실행되지않고, syntax error가 발생한다.
	var foo = function () {
		...
	};
	foo(); // 함수호출이 선언 다음에 위치해야 에러없이 실행된다.
	```

<br><br>
##### [Github Markdown](https://guides.github.com/features/mastering-markdown/)
