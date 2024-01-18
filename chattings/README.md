## NestJS MVC

### hbs

-   template engine to render HTML views

```sh
$ npm i --save hbs
```

```ts
// main.ts
app.useStaticAssets(join(__dirname, '..', 'public')); // javascript, css
app.setBaseViewsDir(join(__dirname, '..', 'views')); // template engine views
app.setViewEngine('hbs');
```
