# Express for NestJS

## Scripts

```json
"scripts": {
    "build": "tsc",
    "start:dev": "tsc-watch --onSuccess \"node dist/app.js\"",
    "prestart": "npm run build",
    "start": "node dist/app.js"
}
```

-   npm run start 입력시 prestart 스크립트 실행 후 start 스크립트 실행
-   tsc : 루트 경로에서 tsconfig.json을 읽어서 옵션에 맞게 compile 진행

<br>
<br>

## Dependencies

```json
"devDependencies": {
    "@types/express": "^4.17.15",
    "@types/node": "^15.3.0",
    "prettier": "^2.2.1",
    "tsc": "^2.0.3",
    "tsc-watch": "^4.2.9",
    "typescript": "^4.3.4"
}
```

-   @types/express
    -   type definitions for Express
-   @types/node
    -   TypeScript definitions for Node.js
-   prettier
    -   code formatter
-   tsc
    -   TypeScript compiler (!DEPRECATED, Use "typescript")
-   tsc-watch
    -   nodemon for TypeScript
