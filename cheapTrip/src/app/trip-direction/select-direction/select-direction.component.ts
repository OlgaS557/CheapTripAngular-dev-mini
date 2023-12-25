import { trigger, style, transition, animate } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, startWith } from 'rxjs/operators';
import * as fromApp from '../../store/app.reducer';
import * as TripDirectionActions from '../store/trip-direction.actions';
import { Observable, Subject, Subscription } from 'rxjs';
import { IPathPoint, IPoint, Modes } from '../trip-direction.model';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorInterceptor } from '../../error-interceptor';
import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/service/http.service';
import { GlobalService } from '../../global/global.service';
import * as Locations from '../../../assets/new_json/locations.json';

@Component({
  selector: 'app-select-direction',
  templateUrl: './select-direction.component.html',
  styleUrls: ['./select-direction.component.scss'],
  animations: [
    trigger('insertRemoveTrigger1', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
    ]),
    trigger('insertRemoveTrigger2', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms 1300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class SelectDirectionComponent implements OnInit {
  @ViewChild('startPointInput', { static: false })
  startPointInputEl: ElementRef;
  @ViewChild('endPointInput', { static: false })
  endPointInputEl: ElementRef;

  stateSubscription: Subscription;
  directionForm: FormGroup;
  startPointAutoComplete: IPathPoint[];
  endPointAutoComplete: IPathPoint[];
  startPoint: IPathPoint;
  endPoint: IPathPoint;

  mode: Modes;
  modes = Modes;
  startSubj = new Subject();
  endSubj = new Subject();
  locations_data: any = Locations;
  searchedPoint: any = [];

  @ViewChild('nameText', { static: false })
  nameParagraph: ElementRef;

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private errorInterceptor: ErrorInterceptor,
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnDestroy(): void {}

  ngOnInit() {
    console.log('NG ON init start!');
    this.mode = Modes.SEARCH;
    this.startPointAutoComplete = [];
    this.endPointAutoComplete = [];

    this.setForm();
    this.startPoint = { id: 0, name: '' };
    this.endPoint = { id: 0, name: '' };
    this.defineRouterParams();
    this.stateSubscription = this.store
      .select('directions')
      .subscribe(state => {
        this.startPointAutoComplete = state.startPointAutoComplete;
        this.endPointAutoComplete = state.endPointAutoComplete;
        this.mode = state.mode;
      });

    this.pointsSubscription();
    this.router.events.subscribe(res => console.log('rout'));

    console.log('NG oninit end!');
  }

  // autocomplete is invoked
  onInput(str: string, type: 'from' | 'to'): void {
    const point: IPoint = { name: str, type: type };

    const resLoc = Object.keys(this.locations_data.default).map(key => ({
      name: key,
      ...this.locations_data.default[key],
    }));
    this.searchedPoint = [];
    let list = [];
    resLoc.forEach(r => {
      if (
        r.name.toLowerCase().indexOf(point.name.toLowerCase()) === 0 &&
        list.length <= 9
      ) {
        list.push({ id: r.id, name: r.name });
      }

      this.searchedPoint = list.sort((a, b) => a.name.localeCompare(b.name));
    });
    if (this.searchedPoint.length <= 9) {
      console.log('this.searchedPoint <= 9', 'yes');
      resLoc.forEach(r => {
        if (
          r.name.toLowerCase().indexOf(point.name.toLowerCase()) > 0 &&
          list.length <= 9
        ) {
          list.push({ id: r.id, name: r.name });
        }
      });
    }

    if (
      type === 'from' &&
      this.directionForm.get('startPointControl').valid &&
      str.length > 0
    ) {
      this.startPoint = { id: 0, name: '' };
      this.store.dispatch(new TripDirectionActions.GetAutocomplete(point));
      this.store.dispatch(
        new TripDirectionActions.SetStartPointAutocomplete(this.searchedPoint)
      );
    } else if (
      type === 'to' &&
      this.directionForm.get('endPointControl').valid &&
      str.length > 0
    ) {
      this.endPoint = { id: 0, name: '' };
      this.store.dispatch(
        new TripDirectionActions.SetEndPointAutocomplete(this.searchedPoint)
      );
      this.store.dispatch(new TripDirectionActions.GetAutocomplete(point));
    }
  }

  onSubmit(): void {
    console.log('SUBMITTED!');
    this.store.dispatch(new TripDirectionActions.GetRouts());
  }

  optionSelected(point: any, type: string) {
    if (type == 'from') {
      this.startSubj.next(point);
    } else if (type === 'to') {
      this.endSubj.next(point);
    }
  }

  cleanForm(): void {
    this.directionForm.reset();
    this.startPoint = { id: 0, name: '' };
    this.endPoint = { id: 0, name: '' };
    this.startPointAutoComplete = [];
    this.endPointAutoComplete = [];
    this.directionForm.markAsUntouched();
    this.directionForm.markAsPristine();

    this.store.dispatch(new TripDirectionActions.CleanData(false));
  }

  onCleanInput(point: 'end' | 'start') {
    if (point === 'start') {
      this.startPoint = { id: 0, name: '' };
      this.startPointAutoComplete = [];
      this.directionForm.patchValue({
        startPointControl: '',
      });
      this.directionForm.get('startPointControl').markAsUntouched();
      this.directionForm.get('startPointControl').markAsPristine();
      this.directionForm.get('startPointControl').valid;

      this.store.dispatch(
        new TripDirectionActions.SetStartPointAutocomplete([])
      );
      this.startPointInputEl.nativeElement.focus();
    } else {
      this.endPoint = { id: 0, name: '' };
      this.endPointAutoComplete = [];
      this.directionForm.patchValue({
        endPointControl: '',
      });
      this.directionForm.get('endPointControl').markAsUntouched();
      this.directionForm.get('endPointControl').markAsPristine();
      this.store.dispatch(new TripDirectionActions.SetEndPointAutocomplete([]));
      this.directionForm.get('endPointControl').valid;
      this.endPointInputEl.nativeElement.focus();
    }
  }
  /*  notInStartListValidator(control: FormControl): { [s: string]: boolean } {
   if (this.startPointAutoComplete.length > 0) {
      const arr = this.startPointAutoComplete.map((point) =>
        point.name.toLocaleLowerCase()
      );
      if (arr.indexOf(control.value.toLowerCase()) == -1) {
        return { notInList: true };
      }
    }

    return null;
  } */

  /*   notInStartListValidatorAsync(
    control: FormControl
  ): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reset) => {
      if (this.startPointAutoComplete.length > 0) {
        const arr = this.startPointAutoComplete.map((point) =>
          point.name.toLocaleLowerCase()
        );
        if (arr.indexOf(control.value.toLowerCase()) == -1) {
          resolve({ notInList: true });
        }
      } else {
        resolve(null);
      }
    });
    return promise;
  } */

  notInEndListValidator(control: FormControl): { [s: string]: boolean } {
    return null;
  }

  onFocusOut(event: any): void {
    if (event.target.attributes.formControlName.value === 'startPointControl') {
      if (this.startPoint.name === '') {
        if (this.startPointAutoComplete.length === 0) {
          this.directionForm.patchValue({
            startPointControl: '',
          });
          this.directionForm.get('startPointControl').markAsUntouched();
          return;
        }
        this.startSubj.next(this.startPointAutoComplete[0]);
      }
    } else if (
      event.target.attributes.formControlName.value === 'endPointControl'
    ) {
      if (this.endPoint.name === '') {
        if (this.endPointAutoComplete.length === 0) {
          this.directionForm.patchValue({
            endPointControl: '',
          });
          this.directionForm.get('endPointControl').markAsUntouched();
          return;
        }
        this.endSubj.next(this.endPointAutoComplete[0]);
      }
    }
  }

  private setForm() {
    this.directionForm = new FormGroup({
      startPointControl: new FormControl('', [
        this.patternValid({
          pattern: /[a-zA-Z0-9\-\s]/,
          msg: $localize`:@@onlyRusEng:Sorry,
          For now, we support only English input.`,
        }),
      ]),

      endPointControl: new FormControl('', [
        this.patternValid({
          pattern: /[a-zA-Z0-9\-\s]/,
          msg: $localize`:@@onlyRusEng:Sorry,
          For now, we support only English input.`,
        }),
      ]),
    });
  }

  public patternValid(config: any): ValidatorFn {
    return (control: FormControl) => {
      let urlRegEx: RegExp = config.pattern;
      if (control.value) {
      }

      if (control.value && !control.value.match(urlRegEx)) {
        this.errorInterceptor.showError(
          $localize`:@@oops:Oops`,
          $localize`:@@onlyRusEng:Sorry. We are currently working only with Latin characters. But we promise to fix it soon.`
        );
        return {
          invalidMsg: config.msg,
        };
      } else {
        return null;
      }
    };
  }

  private defineRouterParams() {
    this.route.queryParams.subscribe(
      (queryParams: {
        from: string;
        fromID: number;
        to: string;
        toID: number;
      }) => {
        if (
          Object.keys(queryParams).length === 0 &&
          queryParams.constructor === Object &&
          this.directionForm
        ) {
          this.cleanForm();
        } else {
          this.startPoint = {
            id: queryParams.fromID,
            name: queryParams.from,
          };
          this.store.dispatch(
            new TripDirectionActions.SetStartPoint({ ...this.startPoint })
          );
          this.endPoint = {
            id: queryParams.toID,
            name: queryParams.to,
          };
          this.store.dispatch(
            new TripDirectionActions.SetEndPoint({ ...this.endPoint })
          );

          this.setForm();
          this.directionForm.setValue({
            startPointControl: this.startPoint.name,
            endPointControl: this.endPoint.name,
          });
          this.store.dispatch(new TripDirectionActions.GetRouts());
        }
      }
    );
  }

  private pointsSubscription() {
    console.log('Points!');
    this.startSubj.subscribe(res => {
      if (typeof res == 'string') {
        this.startPoint = this.startPointAutoComplete.filter(
          p => p.name === res
        )[0];
      } else {
        this.startPoint = res as IPathPoint;

        this.directionForm.patchValue({
          startPointControl: this.startPoint.name,
        });
      }
      this.store.dispatch(
        new TripDirectionActions.SetStartPoint({ ...this.startPoint })
      );
    });

    this.endSubj.subscribe(res => {
      if (typeof res == 'string') {
        this.endPoint = this.endPointAutoComplete.filter(
          p => p.name === res
        )[0];
      } else {
        this.endPoint = res as IPathPoint;
        this.directionForm.patchValue({
          endPointControl: this.endPoint.name,
        });
      }
      this.store.dispatch(
        new TripDirectionActions.SetEndPoint({ ...this.endPoint })
      );
    });
  }
}
