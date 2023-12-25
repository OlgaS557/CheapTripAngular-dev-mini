import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { SearchResultComponent } from './search-result.component';
import { PathDetailsComponent } from './path-details/path-details.component';
import { PathMapComponent } from './path-map/path-map.component';
import { CapitalFirstLetterPipe } from './path-details/capitalFirstLetter.pipe';
import { SearchResultRoutingModule } from './search-result-routing.module';
import { LogoComponent } from '../logo/logo.component';

@NgModule({
  declarations: [
    SearchResultComponent,
    PathDetailsComponent,
    CapitalFirstLetterPipe,
    PathMapComponent,
  ],
  imports: [CommonModule, MaterialModule, SearchResultRoutingModule],
})
export class SearchResultModule {}
