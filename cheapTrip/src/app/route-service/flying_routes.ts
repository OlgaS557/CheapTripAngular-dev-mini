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
      console.log('startPoint:', startPoint);
      const flyingData = await this.http.get<any>(`assets/new_json/partly/flying_routes/${startPoint}.json`).toPromise();
      const filterData = flyingData[`${endPoint}`];
      
      if (!filterData) {
        return [];
      }

      const path: string[] = filterData.direct_routes.split(',');

      const response = await caches.match('direct_routes');
      if (response) {
        const data = await response.json();
        path.forEach((id: string): void => {
          const pathItem = data[id];
          if (!pathItem) {
            console.error(`Path item with ID ${id} not found.`);
            return;
          }
          pathData.push(data[id]);
        });

        filterData.travel_data = pathData;
        console.timeEnd('GetFilterJson Flying_Data');
        return filterData;
      }
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  }

  async getTravelData(startPoint: string, endPoint: string): Promise<any> {
    console.log('getTravelData - Start', { startPoint, endPoint });
    
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
          const fromLocation = locations[el.from]?.name || 'Unknown';
          const toLocation = locations[el.to]?.name || 'Unknown';

          if(!fromLocation) {
            console.error(`From location for ID ${el.from} not found.`);
          }

          if(!toLocation) {
            console.error(`To location for ID ${el.to} not found.`);
          }

          return {
            duration_minutes: el.duration,
            euro_price: el.price,
            from: fromLocation,
            to: toLocation,
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
        console.timeEnd('Get_Mixed_Routes');
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
 

 

