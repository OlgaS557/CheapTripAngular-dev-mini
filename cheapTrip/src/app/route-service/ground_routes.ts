import { Injectable } from '@angular/core';
import { IJsonTravelData } from '../trip-direction/trip-direction.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GroundRoutes {
  constructor(private http: HttpClient) {}

  async getFilterJson({ startPoint, endPoint }: { startPoint: string; endPoint: string }): Promise<any> {
    const pathData: IJsonTravelData[] = [];
    console.time('GetFilterJson Ground_Data');

    try {
      console.log('startPoint:', startPoint)
      const fixedData = await this.http.get<any>(`assets/new_json/partly/fixed_routes/${+startPoint}.json`).toPromise();
      const filterData = fixedData[`${endPoint}`];

      if (!filterData) {
        return [];
      }

      const path: string[] = filterData.direct_routes.split(',');

      const response = await caches.match('direct_routes');
      if (response) {
        const data = await response.json();
        path.forEach((id: string): void => {
          pathData.push(data[id]);
        });

        filterData.travel_data = pathData;
        console.timeEnd('GetFilterJson Ground_Data');
        return filterData;
      }
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for the calling code to handle
    }
  }

  async getTravelData(startPoint: string, endPoint: string): Promise<any> {
    if (!startPoint || !endPoint) {
      console.error('Invalid startPoint or endPoint');
      return [];
    }
    
    console.time('GetTransportAndLocationGround');
    const transportType: {[key: string]: { name: string }} = JSON.parse(sessionStorage.getItem('transportationTypes')) || {};
    const locations: {[key: string]: { name: string }} = JSON.parse(sessionStorage.getItem('locations')) || {};
    console.timeEnd('GetTransportAndLocationGround');
  
    try {
      const data = await this.getFilterJson({ startPoint, endPoint });
      console.log('getTravelData - FilterJson Data', data);
  
      if (data && data.length !== 0) {
        const result = [];
        const directPaths = data.travel_data.map((el: any) => {
          const fromLocation = locations[el.from];
          const toLocation = locations[el.to];

          if(!fromLocation) {
            console.error(`From location for ID ${el.from} not found.`);
          }

          if(!toLocation) {
            console.error(`To location for ID ${el.to} not found.`);
          }

          return {
            duration_minutes: el.duration,
            euro_price: el.price,
            from: fromLocation ? fromLocation.name : 'Unknown',
            to: toLocation ? toLocation.name : 'Unknown',
            transportation_type: transportType[el.transport].name,
          };
        });
        
        result.push({
          duration_minutes: data.duration,
          euro_price: data.price,
          route_type: 'ground_routes',
          direct_paths: directPaths,
        });
  
        return result;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error in getTravelData:', error);
      return [];
    }
  
  }
}
