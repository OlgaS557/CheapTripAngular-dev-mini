import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { IPathPoint } from '../trip-direction.model';

type SERVER = 'tomcat' | 'appachi';

@Injectable({
  providedIn: 'root',
})
export class SelectService {
  server: SERVER;

  constructor(public http: HttpClient) {
     this.server = 'tomcat'; //to be fixed
    // this.server = 'appachi'
  }

  public getUrl(name: string, type): string {
    if (this.server === 'tomcat') {
     // const t = type === 'start' ? '1' : '2';
      console.log('tomacat');
      return (
        environment.urlTomCat +
        'getLocations?type=' +
        name +
        '&search_name=' +
        encodeURIComponent(name)
      );
    }

    // console.log('appachi');
    // return (

    //   environment.urlAppachi +
    //   'locations?type=' +
    //   type +
    //   '&search_name=' +
    //   encodeURIComponent(name)
    // );
  }
  getStartPointAutoComplete$(name: string): Observable<IPathPoint[]> {
    if (name == null) {
      return from([]);
    }
    console.log('to server', this.getUrl(name, 'start'));
    return this.http
      .get<IPathPoint[]>(this.getUrl(name, 'start'))
      .pipe(tap((arr) => console.log('form server', arr)));
  }


  getEndPointAutoComplete$(name: string): Observable<IPathPoint[]> {
    if (name == null) {
      return from([]);
    }
    return this.http
      .get<IPathPoint[]>(this.getUrl(name, 'end'))
      .pipe(tap((arr) => {}));
  }
}
