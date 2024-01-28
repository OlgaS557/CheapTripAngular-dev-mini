import { Injectable } from '@angular/core';
import { IJsonTravelData } from '../trip-direction/trip-direction.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FlyingRoutes {
  constructor(private http: HttpClient) {}

  async getFilterJson({ startPoint, endPoint }: { startPoint: string; endPoint: string }): Promise<any> {
    const pathData: IJsonTravelData[] = [];
    console.time('GetFilterJson Flying_Data');

    try {
      console.log('startPoint:', typeof startPoint );
      console.log('startPoint and endPoint:', startPoint, endPoint);

      if (!startPoint || !endPoint) {
        console.error('Invalid startPoint or endPoint');
        return [];
      }

      const flyingData = await this.http.get<any>(`assets/new_json/partly/flying_routes/${startPoint}.json`).toPromise();
      const filterData = flyingData[`${endPoint}`];
      console.log('filterData:', filterData);
      
      console.log("filterData.direct_routes: ", filterData.direct_routes);
      
      // Используем Object.values для преобразования direct_routes в массив строк
      const path: string[] = Array.isArray(filterData.direct_routes)
      ? filterData.direct_routes
      : typeof filterData.direct_routes === 'string'
        ? filterData.direct_routes.split(',')
        : [];

      if (!filterData) {
        return [];
      }

      // const path: string[] = filterData.direct_routes.split(',');//variant for all jsons with direct_routes string - "100048,2250385,2310370"
      // const path: string[] = filterData.direct_routes;
      // const path: string[] = Object.values(filterData.direct_routes || {});
      console.log('path: ', path);
      const response = await caches.match('direct_routes');
      console.log('Cached data:', response);
      if (response) {
        const data = await response.json();
        
        path.forEach((id: string): void => {
          const pathItem = data[id];
          console.log('pathItem id: ', id);
          console.log('pathItem data[id]: ', data[id]);
          if (!pathItem) {
            console.error(`Path item with ID ${id} not found.`);
            return;
          }
          pathData.push(data[id]);
        });

        filterData.travel_data = pathData;
        console.log('pathData:', pathData );
        console.timeEnd('GetFilterJson Flying_Data');
        console.log('filterData: ', filterData);
        return filterData;
        
      }
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  }

  async getTravelData(startPoint: string, endPoint: string): Promise<any> {
    console.log('getTravelData - Start:', startPoint, endPoint);
    
    if (!startPoint || !endPoint) {
      console.error('getTravelData - Invalid startPoint or endPoint');
      return [];
    }
    
    console.time('GetTransportAndLocationFlying');
    const transportType: {[key: string]: { name: string }} = JSON.parse(sessionStorage.getItem('transportationTypes')) || {};
    const locations: {[key: string]: { name: string }} = JSON.parse(sessionStorage.getItem('locations')) || {};
    console.timeEnd('GetTransportAndLocationFlying');
    
    try {
      const data = await this.getFilterJson({ startPoint, endPoint });
      console.log('getTravelData - FilterJson Data:', data);
  
      if (data && data.length !== 0) {
        const result = [];
        const directPaths = data.travel_data.map((el: any) => {
          const fromLocation = locations[el.from];
          const toLocation = locations[el.to];

          console.log('fromLocation-toLocation: ', fromLocation, toLocation);

          if (!fromLocation || !toLocation) {
            console.warn(`From location for ID ${el.from} not found.`);
            console.warn(`To location for ID ${el.to} not found.`);
            return null; // Add a check and return null if locations are not found
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
          route_type: 'flying_routes',
          direct_paths: directPaths,
        });
        
        console.log('getTravelData - Result:', result);
        
        return result;
      } else {
        console.log('getTravelData - Empty Data');
        return [];
      }
    } catch (error) {
      console.error('getTravelData - Error:', error);
      return [];
    }
  }
}



 

