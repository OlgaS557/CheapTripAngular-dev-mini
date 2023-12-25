import { Injectable } from '@angular/core';
import {
  IJsonTravelData,
  IJsonRoutData,
} from '../trip-direction/trip-direction.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FlyingRoutes {
  // pathData: IJsonTravelData[];

  constructor(private http: HttpClient) {}

  // getFilterJson({
  //   startPoint,
  //   endPoint,
  // }: {
  //   startPoint: string;
  //   endPoint: string;
  // }): Promise<any> {
  //   const pathData: IJsonTravelData[] = [];
  //   console.time('GetFilterJson Flying_Data');

  //   return caches
  //     .match(new Request('assets/new_json/flying_routes.json'))
  //     .then(response => {
  //       if (response) {
  //         return response.json();
  //       }
  //     })
  //     .then(flyingData => {
  //       const filterData = flyingData[`${startPoint}0${endPoint}`];

  //       if (!filterData) return [];
  //       const path: [] = filterData.direct_routes.split(',');
  //       return caches
  //         .match(new Request('assets/new_json/direct_routes.json'))
  //         .then(response => {
  //           if (response) {
  //             return response.json();
  //           }
  //         })
  //         .then(data => {
  //           // console.log(data);
  //           path.forEach((id: string): void => {
  //             pathData.push(data[id]);
  //           });
  //           filterData.travel_data = pathData;
  //           console.timeEnd('GetFilterJson Flying_Data');

  //           return filterData;
  //         });
  //     });
  // }

  getFilterJson({
    startPoint,
    endPoint,
  }: {
    startPoint: string;
    endPoint: string;
  }): Promise<any> {
    const pathData: IJsonTravelData[] = [];
    console.time('GetFilterJson Flying_Data');
    const a: any = `assets/new_json/partly/flying_routes/${startPoint}.json`;
    if (!a.onload) {
      console.log('not exists');
      return;
    }
    if (a.onload) {
      return this.http
        .get<any>(`assets/new_json/partly/flying_routes/${startPoint}.json`)
        .toPromise()
        .then(flyingData => {
          const filterData = flyingData[`${endPoint}`];
         
          if (!filterData) return [];
          const path: [] = filterData.direct_routes.split(',');
          return caches.match('direct_routes').then(response => {
            if (response) {
              return response.json().then(data => {
                path.forEach((id: string): void => {
                  pathData.push(data[id]);
                });
                filterData.travel_data = pathData;
                console.timeEnd('GetFilterJson Flying_Data');
                 console.log('filterData', filterData);
                return filterData;
                
              });
            }
          });
        })
        .catch(error => {
          console.error('Error Fly:', error);
        });
    }
  }

  async getTravelData(startPoint: string, endPoint: string): Promise<any> {
    // return [];
    console.time('GetTransportAndLocationFlying');
    const transportType: {} = JSON.parse(
      sessionStorage.getItem('transportationTypes')
    );
    const locations: {} = JSON.parse(sessionStorage.getItem('locations'));
    console.timeEnd('GetTransportAndLocationFlying');

    return this.getFilterJson({ startPoint, endPoint }).then(data => {
      console.log('data', data);
      if (data && data.length !== 0) {
        const result = [];

        const directPaths = data.travel_data.map(el => ({
          duration_minutes: el.duration,
          euro_price: el.price,
          from: locations[el.from].name,
          to: locations[el.to].name,
          transportation_type: transportType[el.transport].name,
        }));
        result.push({
          duration_minutes: data.duration,
          euro_price: data.price,
          route_type: 'flying_routes',
          direct_paths: directPaths,
        });

        return result;
      } else {
        return [];
      }
    });
  }
}
