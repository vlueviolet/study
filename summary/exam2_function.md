# 함수
<br>

### 함수선언과 함수표현

#### 1. 함수선언식(선언함수, function declaration)

선언함수에서는 함수 호이스팅시 에러가 발생하지 않는다.<br>
자바스크립트의 코드를 해석하면서 코드작성 순서에 상관없이 global 영역에 선언되어 있는 변수나 함수의 선언문들을 먼저 수집하여 전역객체의 속성으로 등록시켜 둔다는 것이다.<br>
그렇기 때문에 전역변수와 전역함수는 자바스크립트 코드의 어떠한 위치에서도 실행이 가능한 것이다.

```javascript
foo();	//호이스팅, 실행됨
function foo () {
	...
}
```
<br>

#### 2. 익명 함수표현식(익명함수, anonymous function expression)

우측만 보면 함수 이름이 없어 익명함수라고 한다. 익명함수는 함수를 변수에 넣어 사용한다.<br>
선언함수의 경우에는 script 태그를 실행하기 전에 가장 먼저 읽혀지지만,<br>
익명 함수의 경우는 한 줄, 한 줄 실행되면서 익명 함수가 정의된 부분을 만날 때 정의되는 것이므로<br>
위의 foo();를 호출하기 전에 익명함수를 정의해야 한다.

```javascript
foo();	// 실행되지않고, syntax error가 발생한다.
var foo = function () {
	...
};
foo(); // 함수호출이 선언 다음에 위치해야 에러없이 실행된다.
```	

익명함수를 사용하면, 함수 호이스팅을 방지할 수 있고 많은 사람들이 코드를 수정할때 등 유지관리에 용이하다.

**하이브랩 컨벤션에서는 익명함수로 함수를 표현한다. 함수 호이스팅을 지양한다.**

3.그외 함수표현식
```javascript
// 기명 함수표현식(named function expression) 
var company = function company() {  
    /* 실행코드 */
}; 

// 기명 즉시실행함수(named immediately-invoked function expression)
(function company() {
    /* 실행코드 */
}());

// 익명 즉시실행함수(immediately-invoked function expression)
// Javascript 대가이신 더글라스 클락포트의 권장 표기법
(function() {
    /* 실행코드 */
}());

// 익명 즉시실행함수(immediately-invoked function expression)
(function() {
    /* 실행코드 */
})();
```
<br>

#### 즉시 실행함수
```javascript
<script>
//다른 언어에서 $를 쓰는것을 방지하기 위함
(function (win, $){
	// 한번만 실행하고 버리는 함수
	// 예를들면, 이게 반응형 브라우저 인지 아닌지 체크하는건 1번만 하면 되니까 이럴때 사용함
	// 메모리랑 관련없고, 개발자끼리 명시적인 의미로 사용함
	// 즉시 실행함수는 다시 호출못함
	var isDevice = function(){

	}();	// 끝에 () 붙이는 형태
})(window, window.jQuery);
```

### 참고글
[Javascript : 함수(function) 다시 보기](http://www.nextree.co.kr/p4150/)
