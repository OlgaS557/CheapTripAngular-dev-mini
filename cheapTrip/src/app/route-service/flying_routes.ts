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
      console.log('startPoint and endPoint:', {startPoint}, {endPoint});

      if (!startPoint || !endPoint) {
        console.error('Invalid startPoint or endPoint');
        return [];
      }

      const flyingData = await this.http.get<any>(`assets/new_json/partly/flying_routes/${+startPoint}.json`).toPromise();
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
        console.log('pathData:', pathData );
        console.timeEnd('GetFilterJson Flying_Data');
        return filterData;
      }
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for the calling code to handle
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
    console.log('locations:', locations);
    console.log('transportType:', transportType);
    try {
      const data = await this.getFilterJson({ startPoint, endPoint });
      console.log('getTravelData - FilterJson Data:', data);
  
      if (data && data.length !== 0) {
        const result = [];
        const directPaths = data.travel_data.map((el: any) => {
          const fromLocation = locations[el.from];
          const toLocation = locations[el.to];

          console.log('fromLocation-toLocation: ', fromLocation, toLocation);

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
  //-----------------------------------------------------
  // Старый код
  // async getTravelData(startPoint: string, endPoint: string): Promise<any> {
  //   // return [];
  //   console.time('GetTransportAndLocationFlying');
  //   const transportType: {} = JSON.parse(
  //     sessionStorage.getItem('transportationTypes')
  //   );
  //   const locations: {} = JSON.parse(sessionStorage.getItem('locations'));
  //   console.timeEnd('GetTransportAndLocationFlying');

  //   return this.getFilterJson({ startPoint, endPoint }).then(data => {
  //     console.log('data', data);
  //     if (data && data.length !== 0) {
  //       const result = [];

  //       const directPaths = data.travel_data.map(el => ({
  //         duration_minutes: el.duration,
  //         euro_price: el.price,
  //         from: locations[el.from].name,
  //         to: locations[el.to].name,
  //         transportation_type: transportType[el.transport].name,
  //       }));
  //       result.push({
  //         duration_minutes: data.duration,
  //         euro_price: data.price,
  //         route_type: 'flying_routes',
  //         direct_paths: directPaths,
  //       });

  //       return result;
  //     } else {
  //       return [];
  //     }
  //   });

 

