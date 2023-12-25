import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { SearchResultComponent } from './search-result.component';

const routes: Routes = [
  {
    path: '', component: SearchResultComponent,
    
  },
  {
    path:'logo',component: LogoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchResultRoutingModule {}

