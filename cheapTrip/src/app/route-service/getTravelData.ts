import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, forkJoin } from 'rxjs';
import {
  IJsonTravelData,
  IJsonRoutData,
  IRecievedRouts,
} from '../trip-direction/trip-direction.model';
import { GroundRoutes } from './ground_routes';
import { FlyingRoutes } from './flying_routes';
import { MixedRoutes } from './mixed_routes';

@Injectable({ providedIn: 'root' })
export class DataService {
  // private mergedData: IJsonTravelData[];
  constructor(
    private flyingData: FlyingRoutes,
    private groundData: GroundRoutes,
    private mixedData: MixedRoutes
  ) {}

  private async getFilterJson(
    startPoint: string,
    endPoint: string
  ): Promise<IJsonTravelData[]> {
    try {
      console.time('-------------------------- Travel_data');
      const response = await caches.match(new Request('direct_routes'));
      if (response) {
        const data = await response.json();
        const objArray: IJsonTravelData[] = Object.values(data);
        const filterData: IJsonTravelData[] = objArray.filter(
          (el: IJsonTravelData) => el.from === +startPoint && el.to === +endPoint
        );
        console.timeEnd('-------------------------- Travel_data');
        return filterData;
      }
      return [];
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }

  private async getTravelData({
    startPoint,
    endPoint,
  }: {
    startPoint: string;
    endPoint: string;
  }): Promise<any> {
    try {
      console.time('GetTransportAndLocation');
      const transportType: {[key: string]: { name: string }} = JSON.parse(
        sessionStorage.getItem('transportationTypes')) || {};
      const locations: {[key: string]: { name: string }} = JSON.parse(
        sessionStorage.getItem('locations')) || {};
      console.timeEnd('GetTransportAndLocation');

      console.time('GetFilterJson Travel_data');
      const data = await this.getFilterJson(startPoint, endPoint);
      console.log('data getFilterJson', data);
      if (data.length > 0) {
        console.log(data);
        const result = data.map((item) => {
          const fromLocation = locations[item.from];
          const toLocation = locations[item.to];

          if (!fromLocation || !toLocation) {
            console.warn(`From location for ID ${item.from} not found.`);
            console.warn(`To location for ID ${item.to} not found.`);
          }

          const fromName = fromLocation ? fromLocation.name : 'Unknown';
          const toName = toLocation ? toLocation.name : 'Unknown';
          const transportTypeName = transportType[item.transport]?.name || 'Unknown';
      
          return {
            duration_minutes: item.duration,
            euro_price: item.price,
            route_type: 'direct_routes',
            direct_paths: [
              {
                duration_minutes: item.duration,
                euro_price: +item.price,
                from: fromName,
                to: toName,
                transportation_type: transportTypeName,
              },
            ],
          };
        });
        console.timeEnd('GetFilterJson Travel_data');
        return result;

      }
      return [];
    } catch (error) {
      console.error('Error fetching travel data:', error);
      return [];
    }
  }

  getPathMap(startPoint: string, endPoint: string): Observable<any> {
    return forkJoin([
      this.getTravelData({ startPoint, endPoint }),
      this.flyingData.getTravelData(startPoint, endPoint),
      this.groundData.getTravelData(startPoint, endPoint),
      this.mixedData.getTravelData(startPoint, endPoint),
    ]).pipe(
      map(([travelData, flyingData, groundData, mixedData]) => {
        const pathMap = [
          ...travelData,
          ...flyingData,
          ...groundData,
          ...mixedData,
        ];
        console.log("pathMap: ", pathMap);
        return pathMap;
      }),
      catchError((error) => {
        console.error('Error in getPathMap:', error);
        return of([]); 
      })
    );
  }
}
