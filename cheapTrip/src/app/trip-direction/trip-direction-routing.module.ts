import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from '../landing/landing.component';
import { LogoComponent } from '../logo/logo.component';
import { NoPageComponent } from '../no-page/no-page.component';
import { SearchResultComponent } from '../search-result/search-result.component';
import { SearchResultGuard } from '../search-result/search-result.guard';
import { SelectDirectionComponent } from './select-direction/select-direction.component';
import { TripDirectionComponent } from './trip-direction.component';

const routes: Routes = [
 // {path: 'landing', component: LandingComponent},
  {
    path: '',
    component: TripDirectionComponent,
    children: [
      {
        path: 'myPath',

        loadChildren: () =>
          import('../search-result/search-result.module').then(
            (m) => m.SearchResultModule
          ),

      },

      {path: 'noPage', component: NoPageComponent}
      
     // {path: 'myPath1', component: SearchResultComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SearchResultGuard],
})
export class TripDirectionRoutingModule {}
