// import { Injectable } from '@angular/core';
// import { map } from 'rxjs/operators';
// import { of, Observable, forkJoin } from 'rxjs';
// import {
//   IJsonTravelData,
//   IJsonRoutData,
//   IRecievedRouts,
// } from '../trip-direction/trip-direction.model';
// import { HttpClient } from '@angular/common/http';

// @Injectable({ providedIn: 'root' })
// export class DataServiceNew {
//   private transportType: {};
//   private locations: {};
//   private directRoutes: {};

//   constructor(private http: HttpClient) {
//     this.transportType = JSON.parse(
//       sessionStorage.getItem('transportationTypes')
//     );
//     this.locations = JSON.parse(sessionStorage.getItem('locations'));
//     this.directRoutes = {};

//     // вызываем инициализацию при создании экземпляра класса
//     this.initDirectRoutes();
//   }
//   initDirectRoutes() {
//     try {
//       console.time('CACHEEEEEEEEEEEEEEE');

// if (Object.keys(this.directRoutes).length === 0) {
// caches.open('fileCache').then(cache => {
//   cache.match('direct_routes').then(response => {
//     if (response) {
//       response.json().then(json => {
//         console.log(json);
//         this.directRoutes = json;
//       });
//     }
//   });
// });
//         console.timeEnd('CACHEEEEEEEEEEEEEEE');

//         console.log('Direct routes initialized', this.directRoutes);
//       }
//     } catch (err) {
//       console.error('Error initializing direct routes', err);
//     }
//   }

//   async getDirectFilterJson(
//     startPoint: string,
//     endPoint: string
//   ): Promise<IJsonTravelData[]> {
//     console.time('-------------------------- Travel_data');

//     const objArray: IJsonTravelData[] = Object.values(this.directRoutes);
//     const filterData: IJsonTravelData[] = objArray.filter(
//       (el: IJsonTravelData) => el.from === +startPoint && el.to === +endPoint
//     );
//     console.timeEnd('-------------------------- Travel_data');
//     console.log(filterData);
//     return filterData;
//   }

//   async getDirectData({
//     startPoint,
//     endPoint,
//   }: {
//     startPoint: string;
//     endPoint: string;
//   }): Promise<any> {
//     console.time('GetFilterJson Travel_data');

//     return this.getDirectFilterJson(startPoint, endPoint).then(data => {
//       if (data.length > 0) {
//         console.log(data);
//         let result = [];
//         for (let i = 0; i < data.length; i++) {
//           result.push({
//             duration_minutes: data[i].duration,
//             euro_price: data[i].price,
//             route_type: 'direct_routes',
//             direct_paths: [
//               {
//                 duration_minutes: data[i].duration,
//                 euro_price: +data[i].price,
//                 from: this.locations[data[i].from].name,
//                 to: this.locations[data[i].to].name,
//                 transportation_type: this.transportType[data[i].transport].name,
//               },
//             ],
//           });
//         }
//         console.timeEnd('GetFilterJson Travel_data');

//         return result;
//       } else {
//         return [];
//       }
//     });
//   }

//   getGroundFilterJson({
//     startPoint,
//     endPoint,
//   }: {
//     startPoint: string;
//     endPoint: string;
//   }): Promise<any> {
//     const pathData: IJsonTravelData[] = [];
//     console.time('Get_Ground_Routes');
//     return this.http
//       .get<any>(`assets/new_json/partly/fixed_routes/${startPoint}.json`)
//       .toPromise()
//       .then(fixedData => {
//         const filterData = fixedData[`${endPoint}`];
//         console.timeEnd('Get_Ground_Routes');

//         if (!filterData) return [];
//         const path = filterData.direct_routes.split(',');
//         path.forEach((id: string): void => {
//           pathData.push(this.directRoutes[id]);
//         });
//         filterData.travel_data = pathData;

//         return filterData;
//       });
//   }

//   async getGroundData(startPoint: string, endPoint: string): Promise<any> {
//     console.time('Ground-Routes');
//     return this.getGroundFilterJson({ startPoint, endPoint }).then(data => {
//       console.log(data);
//       if (data.length !== 0) {
//         const result = [];
//         const directPaths = data.travel_data.map(el => ({
//           duration_minutes: el.duration,
//           euro_price: el.price,
//           from: this.locations[el.from].name,
//           to: this.locations[el.to].name,
//           transportation_type: this.transportType[el.transport].name,
//         }));
//         result.push({
//           duration_minutes: data.duration,
//           euro_price: data.price,
//           route_type: 'ground_routes',
//           direct_paths: directPaths,
//         });
//         console.timeEnd('Ground-Routes');

//         return result;
//       } else {
//         return [];
//       }
//     });
//   }

//   getFlyingFilterJson({
//     startPoint,
//     endPoint,
//   }: {
//     startPoint: string;
//     endPoint: string;
//   }): Promise<any> {
//     const pathData: IJsonTravelData[] = [];
//     console.time('GetFilterJson Flying_Data');

//     return this.http
//       .get<any>(`assets/new_json/partly/flying_routes/${startPoint}.json`)
//       .toPromise()
//       .then(flyingData => {
//         const filterData = flyingData[`${endPoint}`];

//         if (!filterData) return [];
//         const path: [] = filterData.direct_routes.split(',');

//         path.forEach((id: string): void => {
//           pathData.push(this.directRoutes[id]);
//         });
//         filterData.travel_data = pathData;
//         console.timeEnd('GetFilterJson Flying_Data');

//         return filterData;
//       });
//   }

//   async getFlyingData(startPoint: string, endPoint: string): Promise<any> {
//     return this.getFlyingFilterJson({ startPoint, endPoint }).then(data => {
//       if (data.length !== 0) {
//         const result = [];

//         const directPaths = data.travel_data.map(el => ({
//           duration_minutes: el.duration,
//           euro_price: el.price,
//           from: this.locations[el.from].name,
//           to: this.locations[el.to].name,
//           transportation_type: this.transportType[el.transport].name,
//         }));
//         result.push({
//           duration_minutes: data.duration,
//           euro_price: data.price,
//           route_type: 'flying_routes',
//           direct_paths: directPaths,
//         });

//         return result;
//       } else {
//         return [];
//       }
//     });
//   }

//   getMixedFilterJson({
//     startPoint,
//     endPoint,
//   }: {
//     startPoint: string;
//     endPoint: string;
//   }): Promise<any> {
//     const pathData: IJsonTravelData[] = [];

//     return this.http
//       .get<any>(`assets/new_json/partly/routes/${startPoint}.json`)
//       .toPromise()
//       .then(mixedData => {
//         const filterData = mixedData[`${endPoint}`];
//         if (!filterData) return [];
//         const paths = filterData.direct_routes.split(',');

//         paths.forEach((id: string): void => {
//           pathData.push(this.directRoutes[id]);
//         });
//         filterData.travel_data = pathData;
//         return filterData;
//       });
//   }

//   async getMixedlData(startPoint: string, endPoint: string): Promise<any> {
//     console.time('Get_Mixed_Routes');

//     return this.getMixedFilterJson({ startPoint, endPoint }).then(data => {
//       if (data.length !== 0) {
//         const result = [];

//         const directPaths = data.travel_data.map(el => ({
//           duration_minutes: el.duration,
//           euro_price: el.price,
//           from: this.locations[el.from].name,
//           to: this.locations[el.to].name,
//           transportation_type: this.transportType[el.transport].name,
//         }));
//         result.push({
//           duration_minutes: data.duration,
//           euro_price: data.price,
//           route_type: 'mixed_routes',
//           direct_paths: directPaths,
//         });

//         console.timeEnd('Get_Mixed_Routes');

//         return result;
//       } else {
//         return [];
//       }
//     });
//   }

//   getPathMap(startPoint: string, endPoint: string): Observable<any> {
//     if (Object.keys(this.directRoutes).length === 0) {
//       setTimeout(() => {
//         this.getPathMap(startPoint, endPoint);
//       }, 100);
//       return;
//     }
//     return forkJoin([
//       this.getDirectData({ startPoint, endPoint }),
//       this.getFlyingData(startPoint, endPoint),
//       this.getGroundData(startPoint, endPoint),
//       this.getMixedlData(startPoint, endPoint),
//     ]).pipe(
//       map(([travelData, flyingData, groundData, mixedData]) => {
//         const pathMap = [
//           ...travelData,
//           ...flyingData,
//           ...groundData,
//           ...mixedData,
//         ];
//         console.log(pathMap);
//         return pathMap;
//       })
//     );
//   }
// }
