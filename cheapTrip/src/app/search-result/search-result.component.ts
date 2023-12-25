import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
  MediaMatcher,
} from '@angular/cdk/layout';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../store/app.reducer';
import { IPath } from '../trip-direction/trip-direction.model';

// reference information: available resolutions
enum VIEWPORTS {
  XSmall,
  Small,
  SmallPortrait,
  Medium,
  Large,
  XLarge,
  WebLandscape,
  WebPortrait,
  HandsetLandscape,
  HandsetPortrait,
  TabletLandscape,
  TabletPortrait,
  Phones,
  SmallPhones,
}

const ROW_HEIGHT = 250;

type IFrameSize = {
  width: number;
  height: number;
};

const iframeSizeMap = new Map<VIEWPORTS, IFrameSize>();
iframeSizeMap.set(VIEWPORTS.XSmall, { width: 500, height: 1800 }); //
iframeSizeMap.set(VIEWPORTS.Small, { width: 590, height: 1800 }); //
iframeSizeMap.set(VIEWPORTS.Medium, { width: 590, height: 1800 }); //
iframeSizeMap.set(VIEWPORTS.Large, { width: 650, height: 1800 }); //
iframeSizeMap.set(VIEWPORTS.XLarge, { width: 650, height: 1800 }); //
iframeSizeMap.set(VIEWPORTS.WebLandscape, { width: 650, height: 1800 }); //
iframeSizeMap.set(VIEWPORTS.WebPortrait, { width: 400, height: 2000 });
iframeSizeMap.set(VIEWPORTS.HandsetPortrait, { width: 400, height: 2000 });
iframeSizeMap.set(VIEWPORTS.HandsetLandscape, { width: 400, height: 2000 });
iframeSizeMap.set(VIEWPORTS.TabletLandscape, { width: 590, height: 1300 }); //
iframeSizeMap.set(VIEWPORTS.TabletPortrait, { width: 590, height: 1300 }); //
iframeSizeMap.set(VIEWPORTS.Phones, { width: 390, height: 2000 });
iframeSizeMap.set(VIEWPORTS.SmallPhones, { width: 360, height: 2000 });

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  paths: IPath[];
  isDesktop = false;
  getPathsSubscription: Subscription;
  isLoading: boolean;

  // for UIw
  iframeWidth: number;
  iframeHeight: number;
  iframeSize: IFrameSize;

  // matcher: MediaQueryList;

  constructor(
    breakpointObserver: BreakpointObserver,
    private store: Store<fromApp.AppState>,

    public mediaMatcher: MediaMatcher
  ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
        Breakpoints.WebLandscape,
        Breakpoints.WebPortrait,
        Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait,
        Breakpoints.TabletLandscape,
        Breakpoints.TabletPortrait,
      ])
      .subscribe((state: BreakpointState) => {
        this.getIFrameSize(breakpointObserver);
      });
  }

  ngOnInit(): void {
    this.getPathsSubscription = this.store
      .select('directions')
      .subscribe(state => {
        this.paths = state.paths;
        this.isLoading = state.isLoading;
      });
    console.log('SEARCH RESULT');
  }

  ngOnDestroy(): void {
    this.getPathsSubscription.unsubscribe();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // let el = document.getElementById('map').getBoundingClientRect();
  }

  private getIFrameSize(obs: BreakpointObserver) {
    if (obs.isMatched('(max-width: 361px)')) {
      const iframeSize: IFrameSize = iframeSizeMap.get(VIEWPORTS.SmallPhones);
      this.iframeWidth = iframeSize.width;
      this.iframeHeight = iframeSize.height;
    } else if (obs.isMatched('(max-width: 412px)')) {
      const iframeSize: IFrameSize = iframeSizeMap.get(VIEWPORTS.Phones);
      this.iframeWidth = iframeSize.width;
      this.iframeHeight = iframeSize.height;
    } else if (obs.isMatched(Breakpoints.XSmall)) {
      const iframeSize: IFrameSize = iframeSizeMap.get(VIEWPORTS.XSmall);
      this.iframeWidth = iframeSize.width;
      this.iframeHeight = iframeSize.height;
    } else if (obs.isMatched(Breakpoints.Small)) {
      const iframeSize: IFrameSize = iframeSizeMap.get(VIEWPORTS.Small);
      this.iframeWidth = iframeSize.width;
      this.iframeHeight = iframeSize.height;

      this.isDesktop = true;
    } else if (obs.isMatched(Breakpoints.Medium)) {
      const iframeSize: IFrameSize = iframeSizeMap.get(VIEWPORTS.Medium);
      this.iframeWidth = iframeSize.width;
      this.iframeHeight = iframeSize.height;

      this.isDesktop = true;
    } else if (obs.isMatched(Breakpoints.WebLandscape)) {
      const iframeSize: IFrameSize = iframeSizeMap.get(VIEWPORTS.WebLandscape);
      this.iframeWidth = iframeSize.width;
      this.iframeHeight = iframeSize.height;

      this.isDesktop = true;
    } else if (obs.isMatched(Breakpoints.WebPortrait)) {
      const iframeSize: IFrameSize = iframeSizeMap.get(VIEWPORTS.WebPortrait);
      this.iframeWidth = iframeSize.width;
      this.iframeHeight = iframeSize.height;

      this.isDesktop = true;
    } else if (obs.isMatched(Breakpoints.HandsetLandscape)) {
      const iframeSize: IFrameSize = iframeSizeMap.get(
        VIEWPORTS.HandsetLandscape
      );
      this.iframeWidth = iframeSize.width;
      this.iframeHeight = iframeSize.height;

      this.isDesktop = true;
    } else if (obs.isMatched(Breakpoints.HandsetPortrait)) {
      const iframeSize: IFrameSize = iframeSizeMap.get(
        VIEWPORTS.HandsetPortrait
      );
      this.iframeWidth = iframeSize.width;
      this.iframeHeight = iframeSize.height;

      this.isDesktop = true;
    } else if (obs.isMatched(Breakpoints.TabletLandscape)) {
      const iframeSize: IFrameSize = iframeSizeMap.get(
        VIEWPORTS.TabletLandscape
      );
      this.iframeWidth = iframeSize.width;
      this.iframeHeight = iframeSize.height;

      this.isDesktop = true;
    } else if (obs.isMatched(Breakpoints.TabletPortrait)) {
      const iframeSize: IFrameSize = iframeSizeMap.get(
        VIEWPORTS.TabletPortrait
      );

      this.iframeWidth = iframeSize.width;
      this.iframeHeight = iframeSize.height;

      this.isDesktop = true;
    }
  }
}
