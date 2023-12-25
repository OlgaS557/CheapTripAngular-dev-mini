import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header/header.component';
import { StoreModule } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TripDirectionModule } from './trip-direction/trip-direction.module';
import { TripDirectionEffects } from './trip-direction/store/trip-direction.effects';
import { EffectsModule } from '@ngrx/effects';
import { SearchResultModule } from './search-result/search-result.module';
import { NoPageComponent } from './no-page/no-page.component';
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from './error/error.component';
import { LandingComponent } from './landing/landing.component';
import { DataTableComponent } from './authors/data-table/data-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { LinksComponent } from './links/links.component';
import localeRu from '@angular/common/locales/ru';
import localeUa from '@angular/common/locales/uk';
import { registerLocaleData } from '@angular/common';
import { LogoComponent } from './logo/logo.component';
import { CurrencySelectorComponent } from './currency-selector/currency-selector.component';
// the second parameter 'fr-FR' is optional
registerLocaleData(localeRu, 'ru');
registerLocaleData(localeUa, 'ua');
@NgModule({
  
  declarations: [AppComponent, HeaderComponent,  
    CurrencySelectorComponent,
     NoPageComponent, ErrorComponent, LandingComponent, DataTableComponent, 
     LinksComponent, LogoComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TripDirectionModule,
    SearchResultModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([TripDirectionEffects]),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true
    }

  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}
