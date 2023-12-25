import { Actions, ofType, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { switchMap, map, withLatestFrom, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { LocaleService } from '../../service/locale.service';

import * as TripDirectionActions from './trip-direction.actions';
import {
  IDetails,
  IPath,
  IPathPoint,
  IRecievedRouts,
  IRout,
} from '../trip-direction.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';

import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { SelectService } from '../select-direction/select.service';
import { LocalizedString } from '@angular/compiler';
import { HttpService } from 'src/app/service/http.service';
import { Observable, of } from 'rxjs';
import { DataService } from '../../route-service/getTravelData';

import { ErrorInterceptor } from '../../error-interceptor';

enum Icons {
  FLIGHT = `<span class="material-icons">
  flight
  </span>`,
  // FLIGHT = `<img src="assets/Icons/plane-h24.svg" height="24">`,
  BUS = `<span class="material-icons">
  directions_bus
  </span>`,
  // BUS =  `<img src="assets/Icons/Bus-h24.svg" height="24">`,
  TRAIN = `<span class="material-icons">
  directions_railway
  </span>`,
  // TRAIN =  `<img src="assets/Icons/train-h24.svg" height="24">`,
  SUBWAY = `<span class="material-icons">
  directions_subway
  </span>`,
  SHIP = `<span class="material-icons">
  directions_boat
  </span>`,
  ONFOOT = `<span class="material-icons">
  directions_walk
  </span>`,
  CAR = `<span class="material-icons">
  directions_car
  </span>`,
  TAXI = `<span class="material-icons">
  local_taxi
  </span>`,
  SHUTTLE = `<span class="material-icons">
  shuttle
  </span>`,
  FERRY = `<span class="material-icons">
  directions_boat
  </span>`,
  RIDESHARE = `<img src="assets/Icons/rideshare_h24_30.svg" width="18">`,

  // RIDESHARE = `<span class="material-icons">
  // directions_car
  // </span>`
  // FERRY =  `<img src="assets/old Icons/ferryboat.png" height="24">`,
  // RIDESHARE =  `<img src="assets/old Icons/auto_bla.png" height="24">`,
}

const PATHMAP = new Map<string, { type: string }>();
PATHMAP.set('mixed_routes', {
  type: 'Mixed Trip',
});
PATHMAP.set('flying_routes', {
  type: 'Air Trip',
});
PATHMAP.set('ground_routes', {
  type: 'Ground Trip',
});

PATHMAP.set('fixed_routes_without_ride_share', {
  type: 'Fixed trip without ride share',
});
PATHMAP.set('routes_without_ride_share', {
  type: 'Trip without ride share',
});

const PATHMAPDETAILED = new Map();
PATHMAPDETAILED.set('Bus', Icons.BUS);
PATHMAPDETAILED.set('Flight', Icons.FLIGHT);
PATHMAPDETAILED.set('Train', Icons.TRAIN);
PATHMAPDETAILED.set('Ride Share', Icons.RIDESHARE);
PATHMAPDETAILED.set('Car Drive', Icons.CAR);
PATHMAPDETAILED.set('Walk', Icons.ONFOOT);
PATHMAPDETAILED.set('Town Car', Icons.CAR);
PATHMAPDETAILED.set('Car Ferry', Icons.FERRY); // two variants for ferry
PATHMAPDETAILED.set('Ferry', Icons.FERRY); //
PATHMAPDETAILED.set('Shuttle', Icons.SHUTTLE);
PATHMAPDETAILED.set('Taxi', Icons.TAXI);

@Injectable()
export class TripDirectionEffects {
  private language: string;
  private checkPoints: number[];
  private checkPointsStrings: string[];
  private Locations: string[];
  private LocationsRU: Observable<any>;
  private LocationsEN: Observable<any>;
  private body: IRecievedRouts;
  constructor(
    private errorInterceptor: ErrorInterceptor,
    private localeService: LocaleService,
    private selectService: SelectService,
    private actions$: Actions,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private router: Router,
    private store$: Store<fromApp.AppState>,
    private httpService: HttpService,
    private dataService: DataService
  ) {
    //   this.server = 'tomcat'; //to be fixed
    // this.server = Server.SERVER104;
    console.log('constructor inoked');
    // this.LocationsEN = httpService.getAllEnLocationsTomcat();
    // this.LocationsRU = httpService.getAllRuLocationsTomcat();
    // console.log (this.LocationsRU);
    // console.log ("en loc "+this.LocationsEN);

    //console.log ("init country "+this.country)

    //"wake up" servlet
    // this.http.get(environment.urlTomCat+'CheapTrip/getRoute?from='+10+'&to='+20).subscribe(data => {
    //   console.log("received routes");
    //   console.log (this.LocationsRU);
    // })
  }

  /*  @Effect()
  newEffect = this.actions$.pipe(
    ofType(TripDirectionActions.GET_AUTOCOMPLETE),
     withLatestFrom(this.store$.select('directions')),
     tap(state => {console.log('new effect, ', state)}),
     mergeMap(req =>{
       console.log('new effect,', req);
       return of('1')
     })
  ) */

  // 'http://52.14.161.122:8080/locations?type=from&search_name=6',
  // http://3.23.159.104:3333/CheapTrip/getLocations?type=1

  //@Effect()
  // getAutocomplete$ = this.actions$.pipe(
  //   ofType(TripDirectionActions.GET_AUTOCOMPLETE),
  //   withLatestFrom(this.store$.select('directions')),
  //   switchMap((request: Array<any>) => {
  //     let url = '';

  //     //this is url for spring server
  //     if (request[1].currentServer === 'server68') {
  //       url =
  //         environment.url68 +
  //         'locations?type=' +
  //         'from' +
  //         // request[0].payload.type +
  //         '&search_name=' +
  //         encodeURIComponent(request[0].payload.name);
  //     } else {
  //       url =
  //         environment.url104 +
  //         'locations?type=' +
  //         'from' +
  //         // request[0].payload.type +
  //         '&search_name=' +
  //         encodeURIComponent(request[0].payload.name);
  //     }
  //     //here is url for a Tomcat server
  //     // url = this.selectService.getUrl('from',request[0].payload.name);

  //     // if (!this.checkLanguageValidity(request[0].payload.name[0])) {
  //     //   return;
  //     // }
  //     this.language = this.getLanguage(request[0].payload.name[0]);
  //     //actual query
  //     if (environment.mainServer == 'tomcat') {
  //       url =
  //         environment.urlTomCat +
  //         'CheapTrip/getLocations?type=' +
  //         '0' +
  //         '&search_name=' +
  //         encodeURIComponent(request[0].payload.name);
  //       ('');
  //       if (this.language == 'ru') {
  //         url += '&language_name=ru';
  //       }
  //     }

  //     let locations = this.LocationsEN;
  //     if (this.getLanguage(request[0].payload.name[0]) == 'ru') {
  //       locations = this.LocationsRU;
  //     }
  //     //local locations array
  //     // return locations.pipe(
  //     //   map((res) => {
  //     //     console.log(res.body);

  //     //     let resArray:IPathPoint[]= res.body;
  //     //     // let result = resArray.filter(s => s.includes(request[0].payload.name));
  //     //     let result = resArray.filter((element) => {
  //     //       return element.name.includes(request[0].payload.name);
  //     //     });
  //     //     const newAction =
  //     //       request[0].payload.type === 'from'
  //     //         // ? new TripDirectionActions.SetStartPointAutocomplete(res.body)
  //     //         // : new TripDirectionActions.SetEndPointAutocomplete(res.body);
  //     //            ? new TripDirectionActions.SetStartPointAutocomplete(result)
  //     //         : new TripDirectionActions.SetEndPointAutocomplete(result);
  //     //     return newAction;
  //     //   })

  //     //actual http

  //     return this.http.get<any>(url, { observe: 'response' }).pipe(
  //       map(res => {
  //         console.log(res);
  //         const newAction =
  //           request[0].payload.type === 'from'
  //             ? new TripDirectionActions.SetStartPointAutocomplete(res.body)
  //             : new TripDirectionActions.SetEndPointAutocomplete(res.body);
  //         return newAction;
  //       })
  //       /*  catchError((error) => {
  //         console.log('error', error);
  //         this.handleError(error);

  //         return of(new TripDirectionActions.AutoCompleteFail(error));
  //       }) */
  //     );
  //   })
  // );

  @Effect()
  // getRouts$ = this.actions$.pipe(
  //   ofType(TripDirectionActions.GET_ROUTS),
  //   withLatestFrom(this.store$.select('directions')),
  //   switchMap((request: Array<any>) => {
  //     this.checkPoints = new Array();
  //     this.checkPointsStrings = new Array();
  //     let url = '';
  //     // lower is url for a spring server
  //     // if (request[1].currentServer === 'server68') {
  //     //   url =
  //     //     environment.url68 +
  //     //     'routes?from=' +
  //     //     request[1].startPoint.id +
  //     //     '&to=' +
  //     //     request[1].endPoint.id;
  //     // } else {
  //     //   url =
  //     //     environment.url104 +
  //     //     'routes?from=' +
  //     //     request[1].startPoint.id +
  //     //     '&to=' +
  //     //     request[1].endPoint.id;
  //     // }

  //     //here is url for a Tomcat server to be fixed
  //     // url = this.selectService.getUrl('from','to')
  //     if (environment.mainServer == 'tomcat') {
  //       url =
  //         environment.urlTomCat +
  //         'CheapTrip/getRoute?from=' +
  //         request[1].startPoint.id +
  //         '&to=' +
  //         request[1].endPoint.id;
  //     }
  //     //  this.checkPoints.push(Date.now());
  //     //  this.checkPointsStrings.push("Before request");

  //     if (this.language == 'ru') {
  //       url += '&language_name=ru';
  //     }

  //
  //       console.log(
  //         'URL',
  //         typeof request[1].startPoint.id,
  //         request[1].endPoint.id
  //       );

  // return this.http.get(url, { observe: 'response' }).pipe(
  //       map((res: any) => {
  //         // next is for timing... obsolete
  //         // this.checkPoints.push(Date.now());
  //         // this.checkPointsStrings.push("received request");

  //         console.log(res);
  //         let resultPathArr = null;

  //         resultPathArr = this.transformObject(res.body as IRecievedRouts[]);

  //         resultPathArr.sort((a, b) =>
  //           a.details.euro_price > b.details.euro_price ? 1 : -1
  //         );

  //         console.log('RESULT', resultPathArr, request);

  //         const endPoints = {
  //           from: request[1].startPoint,
  //           to: request[1].endPoint,
  //         };
  //         const queryParams = {
  //           from: request[1].startPoint.name,
  //           fromID: request[1].startPoint.id,
  //           to: request[1].endPoint.name,
  //           toID: request[1].endPoint.id,
  //         };
  //         // next is for timing... obsolete
  //         // this.checkPoints.push(Date.now());
  //         // this.checkPointsStrings.push("Before navigation to mypath");
  //         this.router.navigate(['/search/myPath'], {
  //           queryParams,
  //         });
  //         // next is for timing... obsolete
  //         // this.checkPoints.push(Date.now());
  //         // this.checkPointsStrings.push("after nav, before return");
  //         //can be used to determine user locale
  //         // console.log('User locale -------'+this.localeService.getUsersLocale('en'));

  //         // next is for timing... obsolete
  //         // for (let index = 1; index < this.checkPoints.length; index++) {
  //         //   console.log (this.checkPointsStrings[index-1]+" -> "+this.checkPointsStrings[index]
  //         //   +" elapsed "+(this.checkPoints[index]-this.checkPoints[index-1])+" ms");

  //         // }

  //         return new TripDirectionActions.SetRouts({
  //           paths: resultPathArr,
  //           endPoints: endPoints,
  //         });
  //       })
  //       /* atchError((error) => {
  //           const errorMessage = 'An unknown error occured!';
  //           this.handleError(error);
  //           return of(new TripDirectionActions.AutoCompleteFail(error));

  //         }) )*/
  //     );
  //   })
  // );
  getRouts$ = this.actions$.pipe(
    ofType(TripDirectionActions.GET_ROUTS),
    withLatestFrom(this.store$.select('directions')),
    switchMap((request: Array<any>) => {
      this.checkPoints = new Array();
      this.checkPointsStrings = new Array();
      let url = '';
      if (environment.mainServer == 'tomcat') {
        url =
          environment.urlTomCat +
          'CheapTrip/getRoute?from=' +
          request[1].startPoint.id +
          '&to=' +
          request[1].endPoint.id;
      }
      if (this.language == 'ru') {
        url += '&language_name=ru';
      }

      console.time('Effects');

      // Вызываем getTravelData и устанавливаем значение this.body в ответ
      return this.dataService
        .getPathMap(request[1].startPoint.id, request[1].endPoint.id)
        .pipe(
          tap(path => {
            this.body = path;
            console.log('path', path);
          }),
          switchMap(() => {
            // Создаем новый HttpResponse с установленным значением this.body
            return of(
              new HttpResponse({
                status: 200,
                body: this.body,
              })
            );
          }),
          tap(data => console.log(data)),
          map((res: any) => {
            console.log(res);
            let resultPathArr = null;

            resultPathArr = this.transformObject(res.body as IRecievedRouts[]);

            resultPathArr.sort((a, b) =>
              a.details.euro_price > b.details.euro_price ? 1 : -1
            );

            console.log('RESULT', resultPathArr, request);
            console.timeEnd('Effects');

            const endPoints = {
              from: request[1].startPoint,
              to: request[1].endPoint,
            };
            const queryParams = {
              from: request[1].startPoint.name,
              fromID: request[1].startPoint.id,
              to: request[1].endPoint.name,
              toID: request[1].endPoint.id,
            };
            this.router.navigate(['/search/myPath'], {
              queryParams,
            });
            return new TripDirectionActions.SetRouts({
              paths: resultPathArr,
              endPoints: endPoints,
            });
          })
        );
    })
  );

  /*   private transformObjectTomCat(obj: object): IPath[] {
    const objArr: IPath[] = [];
    for (const i in obj) {
      const transformedDetails = this.transformDetails(obj[i]);
      const testObj: IPath = {
        pathType: PATHMAP.get(i).type,
        details: transformedDetails,
      };
      objArr.push(testObj);
    }
    return this.reducedPaths(objArr);
  } */
  private transformObject(routs: IRecievedRouts[]): IPath[] {
    const objArr: IPath[] = [];
    routs.forEach(rout => {
      const details = {
        euro_price: rout.euro_price,
        duration_minutes: rout.duration_minutes,
        direct_paths: rout.direct_paths,
      };
      const transformedRout: any = {
        pathType: rout.routeType,
        details: this.transformDetails(details),
      };
      if (transformedRout.details['duration_minutes'] != '  0min') {
        objArr.push(transformedRout);
      }
    });
    return this.reducedPaths(objArr);
  }

  private transformDetails(obj: any): IDetails {
    const transport = this.getTransport(obj.direct_paths);

    const points = this.getPoints(obj.direct_paths);

    const newPaths = obj.direct_paths.map(item => {
      return {
        ...item,
        duration_minutes: this.transformTime(+item.duration_minutes),
        euro_price: this.transformPrice(+item.euro_price),
      };
    });

    const newObj: IDetails = {
      direct_paths: newPaths,
      euro_price: this.transformPrice(+obj.euro_price),
      duration_minutes: this.transformTime(+obj.duration_minutes),
      points: points,
      transport: transport,
    };
    return newObj;
  }

  private transformTime(minutes: number): string {
    //to be translated or fixed
    const days = Math.floor(minutes / 60 / 24);
    const dayStr = days < 1 ? '' : days + $localize`:@@days_letter:d`;
    const hours = Math.floor(minutes / 60 - days * 24);
    const hourStr = hours < 1 ? '' : hours + $localize`:@@hours_letter:h`;
    const min = minutes - days * 24 * 60 - hours * 60;
    const minStr = min + $localize`:@@minutes_letters:min`;

    return dayStr + ' ' + hourStr + ' ' + minStr;
  }

  private transformPrice(price: number): number {
    const euro = Math.floor(+price);
    const cent = Math.floor(+price - euro) * 10;
    return price;
  }

  private mapSanitazingDetaled(): Map<string, SafeHtml> {
    const newSanitisedMap = new Map<string, SafeHtml>();
    PATHMAPDETAILED.forEach((value, key, _map) => {
      newSanitisedMap.set(key, this.sanitizer.bypassSecurityTrustHtml(value));
    });
    return newSanitisedMap;
  }

  private getTransport(paths: IRout[]): SafeHtml[] {
    const sanitisedMap = this.mapSanitazingDetaled();
    const result = [];
    paths.map(item => {
      const smth = sanitisedMap.get(item.transportation_type);
      result.push(smth);
    });

    return result;
  }

  private handleError(err: HttpErrorResponse): void {
    let errorMessage = '';

    if (err.error instanceof ErrorEvent) {
      // client-side error
      //  errorMessage = `Error: ${err.error.message}`;
    } else {
      // server-side error
      //   errorMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
    }
    //  window.alert(errorMessage);
  }

  private getPoints(paths: IRout[]): Set<string> {
    const transformedArr = paths.map(item => [item.from, item.to]);
    const result = new Set(transformedArr.reduce((a, b) => a.concat(b), []));
    return result;
  }

  private reducedPaths(paths: IPath[]): IPath[] {
    // console.log("-=Paths=- "+paths.length);
    this.checkPoints.push(Date.now());
    this.checkPointsStrings.push('Before filter');
    let stringifyArr;

    let duplicateIndex;
    do {
      stringifyArr = paths.map(p => JSON.stringify(p.details));
      duplicateIndex = -1; //means no duplicate
      for (let j = 0; j < paths.length; j++) {
        for (let i = 0; i < paths.length; i++) {
          if (stringifyArr[j] == stringifyArr[i] && i != j) {
            duplicateIndex = i;
          }
        }
      }
      paths = paths.filter((_path, index) => {
        return index != duplicateIndex;
      });
    } while (duplicateIndex != -1); //do... while there is duplicates
    this.checkPoints.push(Date.now());
    this.checkPointsStrings.push('after filter');
    return paths;
  }

  private checkLanguageValidity(char: string): boolean {
    if (/[а-яА-Я]/.test(char)) {
      return true;
    }
    if (/[a-zA-Z]/.test(char)) {
      return true;
    }
    //error only rus eng allowed
    this.errorInterceptor.showError(
      $localize`:@@oops:Oops`,
      $localize`:@@onlyRusEng:Sorry, only Latin and Russian characteres are allowed now.`
    );
    return false;
  }

  private getLanguage(char: string): string {
    // if ((/[a-zA-Z]/).test(char) ){
    //   return 'en';
    // }
    if (/[а-яА-Я]/.test(char)) {
      return 'ru';
    }
    if (/[a-zA-Z]/.test(char)) {
      return 'en';
    }
    return 'undefined';
  }
}
