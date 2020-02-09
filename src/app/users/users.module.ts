import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { UsersRoutingModule } from './users-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UsersListingComponent } from './users-listing/users-listing.component';
import { CrudModalComponent } from './crud-modal/crud-modal.component';

import { UsersService } from './services/users.service';

@NgModule({
  imports: [CommonModule, CoreModule, SharedModule, UsersRoutingModule, NgbModule, ReactiveFormsModule],
  declarations: [UsersListingComponent, CrudModalComponent],
  exports: [CrudModalComponent],
  providers: [UsersService],
  bootstrap: [CrudModalComponent]
})
export class UsersModule {}
