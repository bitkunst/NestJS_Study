## NestJS MVC

### hbs

-   template engine to render HTML views
-   SSR (Server Side Rendering)

```sh
$ npm i --save hbs
```

```ts
// main.ts
app.useStaticAssets(join(__dirname, '..', 'public')); // javascript, css
app.setBaseViewsDir(join(__dirname, '..', 'views')); // template engine views
app.setViewEngine('hbs');
```

<br>

## Model View Controller

<image width='500px' src='./public/image/mvc.png' />

-   MVC 패턴은 소프트웨어 디자인 패턴
-   모델(Model), 뷰(View), 컨트롤러(Controller) 이렇게 책임을 분리해서 나눈 패턴을 말한다.
-   MVC 패턴의 키워드는 "분리" -> "관심사의 분리"이다
    -   하나의 소프트웨어 프로그램을 각각의 영역으로 관심사를 분리시켜 놓은 것

### Model

-   모델(Model)은 앱이 포함해야할 데이터가 무엇인지를 정의한다.
-   데이터의 상태가 변경되면 모델은 일반적으로 뷰(View)에게 알리며(필요한대로 화면 변경) 가끔 컨트롤러(Controller)에게 알리기도 한다(업데이트된 뷰를 제거하기 위해 다른 로직이 필요한 경우)

### View

-   뷰(View)는 데이터를 보여주는 방식을 정의한다.
-   사용자에게 보여지는 방식을 정의하며, 표시할 데이터를 모델로부터 받는다.

### Controller

-   컨트롤러(Controller)는 앱의 사용자로부터의 입력에 대한 응답으로 모델 또는 뷰를 업데이트 하는 로직을 포함한다.

### Controller <-> View

-   MVC 패턴에서 View는 사용자가 보게될 영역
    -   사용자가 보게 될 것은 바로 HTML 파일
-   Controller의 데이터들이 View로 전송돼서 View가 사용할 수 있도록 되는 것

<br>

## WebSocket

```sh
$ npm i --save @nestjs/websockets @nestjs/platform-socket.io
```

```sh
$ nest g gateway chats
$ nest g module chats
```

-   socket.io 라이브러리 없이 webSocket을 있는 그대로 사용하게 되면 무조건 ws 프로토콜로 사용이 된다.
-   socket.io는 거의 모든 브라우저에서 소켓 프로그래밍이 가능하도록 도와주는 라이브러리라고도 할 수 있다.
    -   전통적인 polling 방식 지원 -> ws을 지원하지 않는 브라우저에서는 socket.io가 자동으로 polling 방식으로 처리

### Namespace

-   네임스페이스는 `공간`이라는 의미를 가진다.
-   http 연결 방식에서 endpoint를 가지고 API를 나눴다면, ws에서는 namespace가 존재
-   컨트롤러에서 공통된 엔드포인트가 있고 해당 엔드포인트 뒤에 붙는 추가적인 엔드포인트가 라우팅 된다면, 게이트웨이 또한 하나의 동일한 네임스페이스 안에 해당하는 이벤트들이 명시되는 것
-   네임스페이스를 사용해서 `공간을 분리한다`고 생각하면 된다

### Lifecycle hooks

-   `OnGatewayInit` 인터페이스
    -   afterInit() 메소드 강제 구현
        -   초기화가 되고 바로 실행되는 함수
-   `OnGatewayConnection` 인터페이스
    -   handleConnection() 메소드 강제 구현
        -   소켓이 처음에 연결이 될 때, handleConnection() 실행
-   `OnGatewayDisconnect` 인터페이스
    -   handleDisconnect() 메소드 강제 구현
        -   소켓 연결이 끊길 때, handleDisconnect() 실행

### Broadcasting

-   socket.emit() : 해당하는 소켓 id를 가진 그 소켓한테만 데이터 전송
-   socket.broadcast.emit() : 연결된 모든 소켓들한테 데이터 전송
