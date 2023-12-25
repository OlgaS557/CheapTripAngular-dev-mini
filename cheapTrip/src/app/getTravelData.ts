import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { of, Observable, from } from 'rxjs';
import { IJsonTravelData, IRout } from './trip-direction/trip-direction.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  private mergedData: IJsonTravelData[];

  constructor() {}

  getFilterJson(
    startPoint: string,
    endPoint: string
  ): Observable<IJsonTravelData[]> {
    this.mergedData = [];
    return from(
      (() =>
        caches
          .match(new Request('assets/new_json/travel_data.json'))
          .then(function (response) {
            if (response) {
              return response.json();
            }
          })
          .then(data => {
            const objArray: IJsonTravelData[] = Object.values(data);
            const filterData: IJsonTravelData[] = objArray.filter(
              (el: IJsonTravelData) =>
                el.from === +startPoint && el.to === +endPoint
            );
            console.log(filterData, typeof objArray[7]);
            return (this.mergedData = this.mergedData.concat(filterData));
          }))()
    );
  }

  getTravelData(
    startPoint: string,
    startPointName: string,
    endPoint: string,
    endPointName: string
  ): Observable<any> {
    const transportType: {} = JSON.parse(
      sessionStorage.getItem('transportationTypes')
    );

    console.log(transportType['1']);

    return this.getFilterJson(startPoint, endPoint).pipe(
      map(data => {
        console.log(this.mergedData);
        if (this.mergedData.length > 0) {
          let result = [];
          for (let i = 0; i < this.mergedData.length; i++) {
            console.log(this.mergedData[i].transportation_type);
            result.push({
              duration_minutes: this.mergedData[i].time_in_minutes,
              euro_price: this.mergedData[i].euro_price,
              route_type: 'ground_routes',
              direct_paths: [
                {
                  duration_minutes: this.mergedData[i].time_in_minutes,
                  euro_price: +this.mergedData[i].euro_price,
                  from: startPointName,
                  to: endPointName,
                  transportation_type:
                    transportType[this.mergedData[i].transportation_type].name,
                },
              ],
            });
          }
          return result;
        } else {
          return [];
        }
      })
    );
  }
}

//  return this.http.get('assets/new_json/travel_data.json').subscribe(data => {
//     const objArray = Object.values(data);
//     const filterData = objArray.filter(
//       (el: any) => el.from === +startPoint && el.to === +endPoint
//     );
//     console.log(filterData, objArray[7]);
//     this.mergedData = this.mergedData.concat(filterData);
//   });

//   return this.mergedData;

// return this.http.get('assets/new_json/travel_data.json').subscribe(data => {
//   const objArray = Object.values(data);
//   this.filterData = objArray.filter(
//     (el: any) => el.from === +startPoint && el.to === +endPoint
//   );
//   console.log(this.filterData, objArray[7]);
//   this.mergedData = this.mergedData.concat(this.filterData);
// });
