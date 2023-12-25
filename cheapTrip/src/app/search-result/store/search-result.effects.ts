import { Actions, ofType, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

import * as TripDirectionActions from './search-result.actions';
import { of } from 'rxjs';

@Injectable()
export class TripDirectionEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  sommeAction$ = this.actions$.pipe(
    ofType(TripDirectionActions.SOME_ACTION),
    switchMap((_) => of('some action')),

    catchError((error) => {
      const errorMessage = 'An unknown error occured!';
      return of('some observable');
    })
  );
}
