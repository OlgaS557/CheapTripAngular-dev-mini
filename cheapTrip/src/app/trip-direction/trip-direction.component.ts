import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as TripDirectionActions from './store/trip-direction.actions';
import { IPathPoint, Modes } from './trip-direction.model';

@Component({
  selector: 'app-trip-direction',
  templateUrl: './trip-direction.component.html',
  styleUrls: ['./trip-direction.component.scss'],
})
export class TripDirectionComponent implements OnInit {
  startPoint: IPathPoint;
  startP: string;
  endP: IPathPoint;
  endPoint: IPathPoint;
  points: [IPathPoint, IPathPoint];
  toHome: boolean;

  startPointAutoComplete: IPathPoint[];
  endPointAutoComplete: IPathPoint[];
  selectDirectionSubscription: Subscription;
  mode: Modes;
  pointSubj$: Subject<{ from: IPathPoint; to: IPathPoint }>;

  constructor(private store: Store<fromApp.AppState>, private router: Router) {}

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.store.dispatch(new TripDirectionActions.SetMode(Modes.SEARCH));
  }

  ngOnInit(): void {}

  toHomePage() {
    this.router.navigate(['/search']);
  }
}
