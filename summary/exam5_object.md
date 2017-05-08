# 객체(Object)를 이용한 함수선언

```javascript
<script>
var obj = {
    init : function () {  // 처음 실행되는 함수
        this.setElements(); // this는 obj. 즉 객체를 가리킨다. this로 선언하면 obj 객체 안에서 다 사용할 수 있다.
        this.bindEvents();
        this.newObject.init();
    },
    setElements : function () { // 요소를 정의하는 함수
        ...
    },
    bindEvents : function () {  // click, focus등 이벤트 관련 함수 모음
        // obj내 선언된 함수를 사용하고 싶다면 $.proxy를 사용하면 된다.
        //$.proxy(this.함수명, this);
        this.obj.on(‘click’,$.proxy(this.viewFunc), this));
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
  obj.newObject.init(); //이렇게 obj밖에서 호출하진 않는다. 보통 obj.init()이나 obj 내부에서 함
});
</script>
```

## proxy를 사용하는 이유
객체 내에 this를 선언했을때 모두 obj로 인식하게 하기위해

## bind말고 on을 써야하는이유
+ dom 로드후, 요소가 바뀔경우,<br>
    + bind는 이벤트 핸들러를 처리하지 않는다.<br>
    + 반면 on은 이벤트 핸들러를 통한 처리를 계속한다. ajax로 로딩된 동적 엘리먼트에도 이벤트 핸들러 처리가 가능하다.    
+ 또한 bind() jquery 1.7 이후부터 on 매소드 사용을 권장하고 있으며,<br>on이 나오면서 새로운 기능적용이 안될 예정이며 사라질 수도 있기 때문이다.<br>핸들러 삭제시에는 off()를 사용한다.


<br><br>
##### [Github Markdown](https://guides.github.com/features/mastering-markdown/)
