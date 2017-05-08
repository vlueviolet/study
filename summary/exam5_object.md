# 객체(Object)를 이용한 함수선언

```javascript
<script>
var obj = {
    init : function () {  // 처음 실행되는 함수
        this.setElements(); // this는 obj. 즉 객체를 가리킨다.
        this.bindEvents();
        this.newObject.init();
    },
    setElements : function () { // 요소를 정의하는 함수
        ...
    },
    bindEvents : function () {  // click, focus등 이벤트 관련 함수 모음
        ...
    },
    reinit : function () {
        /* 스크립트는 DOM이 없으면 적용이 되지 않는다.
        setElement() 함수만 봐도 요소를 가져와 변수로 저장하고 이 변수를 활용하는데, DOM자체가 그려지지 않은 경우라면 소용이 없다.
        ajax가 적용된 경우, DOM이 삭제되고 다시 로드되는 경우 등이 있기때문에 DOM이 없는 경우를 대비해서 reinit함수를 만든다. 
        reinit()에 bindeEvents()를 추가해서 개발자들에게 이 함수를 실행시키라고 전달하는것이 좋다.*/
    },
    newObject : { // 객체 안에서 또 다른 함수 선언이 가능함
        init : function () {
            this.어쩌구 // 여기서 this는 obj가 아닌 newObject를 가리킴
        }
    }
}
$(function () {
  obj.init();
  obj.newObject.init(); //이렇게 obj밖에서 호출하진 않는다. 그럴려면 여기에 모아놓을 필요 없음
});
</script>
```

<br><br>
##### [Github Markdown](https://guides.github.com/features/mastering-markdown/)
