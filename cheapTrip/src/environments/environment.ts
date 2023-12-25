// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mainServer: 'tomcat', // "tomcat "or "spring"
  url68: 'http://3.18.167.68:8080/',
  url104: 'http://3.18.167.68:8080/',
  // urlTomCat: 'https://test2.lowcoststrip.com:8443/'
  // urlTomCat: 'http://3.64.201.17:8080/',
  // urlTomCat: 'https://test3.lowcoststrip.com:8443/',
  urlTomCat: 'https://cheaptrip.guru:8443/',
  urlGoogleFormEng:
    'https://docs.google.com/forms/d/11mnL9hPZHkbixglQNqlN-iChn4-dYidnNnQAPXakYvA/viewform',
  urlGoogleFormRus:
    'https://docs.google.com/forms/d/1ypZL2BFqHmlgPrzsbg3BbOK1Ns_FBYuMrsvYoUOskJM/viewForm',

  // urlTomCat: 'http://ec2-3-65-40-85.eu-central-1.compute.amazonaws.com:8080/'
  // urlTomCat: 'http://ec2-3-134-113-37.us-east-2.compute.amazonaws.com:8080/'
  //  url104:  'http://18.158.89.230:8080/'  //working server
  // url104: 'http://localhost:8080/',
  // url104: 'http://35.238.107.151:8080/',
  // url104: 'http://ec2-3-134-113-37.us-east-2.compute.amazonaws.com:8080/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

// как сделать это?  использовать AJAX-запрос для загрузки файла после загрузки страницы

// Кроме того, вы можете использовать метод fetch вместо jQuery для загрузки файла. Ниже приведен пример кода на чистом JavaScript:

// fetch("file.json") .then(response => response.json()) .then(data => console.log(data));

// Здесь мы используем метод fetch, чтобы загрузить файл JSON с именем "file.json". Затем мы вызываем функцию json() для обработки ответа, а затем выводим его содержимое в консоль.
// file.json - это путь к файлу?  это может быть локальный путь?

// <html>
//   <head>
//     <script src="data.json"></script>
//     <script>
//       // код для работы с данными из JSON файла
//     </script>
//   </head>
//   <body>
//     <!-- остальной HTML-код страницы -->
//   </body>
// </html>

// # Ответ эксперта

// Да, тег `<script>` с атрибутом `src` загружает файл.

// Файл загружается в браузер и хранится в оперативной памяти.

// Для работы с данными из JSON файла в Angular можно использовать специальный сервис `HttpClient`, который позволяет выполнять HTTP-запросы и получать данные в различных форматах, в том числе в формате JSON. Пример использования `HttpClient` для получения данных из JSON файла:

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::```

// import { HttpClient } from '@angular/common/http';
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   template: `
//     <ul>
//       <li *ngFor="let item of data">{{ item.name }}</li>
//     </ul>
//   `,
// })
// export class AppComponent {
//   data: any;

//   constructor(private http: HttpClient) {
//     this.http.get('data.json').subscribe(data => {
//       this.data = data;
//     });
//   }
// }
// ```

// В этом примере мы импортируем сервис`HttpClient`, используем его в конструкторе компонента и
// выполняем GET - запрос к файлу`data.json`.Результат запроса представляет собой объект,
//   который мы присваиваем переменной`data`.Затем мы используем
// директиву `*ngFor` для создания списка элементов, каждый из которых представляет собой объект
//  из массива`data`.Если вы хотите получить данные из JSON файла в сервисе или другом компоненте,
//   вы можете использовать тот же самый код.

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// Вы можете заменить `http.get` на вашу собственную функцию, которая будет возвращать данные. Например:

// ```typescript
// getData(): Observable<any> {
//   const data = { name: 'John', age: 30 };
//   return of(data);
// }
// ```

// И использовать его таким образом:

// ```typescript
// this.getData().subscribe(data => console.log(data));
// ```

// Это позволит вам получить данные из функции, а не из http-запроса.

// Код правильный, но проблема в том, что вы пытаетесь получить данные асинхронно. Метод http.get является асинхронным, поэтому результат будет возвращен в виде Observable, который нужно подписать. Вам нужно обновить метод travelData следующим образом:

// travelData(startPoint: string, endPoint: string) { return this.http.get('assets/new_json/fixed_routes.json') .pipe( map(data => { const filterData: any = data.filter((el: any) => el === startPoint); console.log(filterData); return filterData; }) ); }

// Этот метод будет возвращать Observable, который вы можете подписать, чтобы получить данные.

// Относительный путь до файла должен быть изменен, чтобы указывать на корректную директорию. Поместите файл в папку assets и обновите путь на 'assets/new_json/fixed_routes.json'.

// Скрипт <script src="./assets/new_json/fixed_routes.json"></script> загружает файл фиксированных маршрутов в HTML-страницу. Он не загружает файл в приложение Angular, который вы можете использовать для получения данных в вашем сервисе.
