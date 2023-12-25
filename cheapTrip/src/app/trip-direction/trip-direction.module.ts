import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectDirectionComponent } from './select-direction/select-direction.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { TripDirectionComponent } from './trip-direction.component';
import { TripDirectionRoutingModule } from './trip-direction-routing.module';
// import { CurrencySelectorComponent } from '../currency-selector/currency-selector.component';



@NgModule({
  declarations: [SelectDirectionComponent, TripDirectionComponent],
  imports: [
    CommonModule, ReactiveFormsModule,
    MaterialModule,
    TripDirectionRoutingModule
  ]
})
export class TripDirectionModule { }
