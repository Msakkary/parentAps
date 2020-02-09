import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersListingComponent } from './users-listing/users-listing.component';
import { AuthenticationGuard } from '@app/core';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full', canActivate: [AuthenticationGuard] },
  { path: 'users', component: UsersListingComponent, data: { title: 'Users' }, canActivate: [AuthenticationGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsersRoutingModule {}
