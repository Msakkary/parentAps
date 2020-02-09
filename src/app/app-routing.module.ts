import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundRouteComponent } from './not-found-route/not-found-route.component';

const routes: Routes = [
  // Fallback when no prior route is matched
  { path: '**', pathMatch: 'full', component: NotFoundRouteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
