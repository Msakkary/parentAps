import { Component, OnInit, HostListener } from '@angular/core';
import { User } from '../user';
import { UsersService } from '../services/users.service';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-users-listing',
  templateUrl: './users-listing.component.html',
  styleUrls: ['./users-listing.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('150ms ease-in-out', style({ transform: 'translateX(0%)', opacity: 0.5 }))
      ]),
      transition(':leave', [animate('150ms ease-in-out', style({ transform: 'translateX(100%)', opacity: 1 }))])
    ])
  ]
})
export class UsersListingComponent implements OnInit {
  usersList: User[];
  selectedUser: User;
  isLoading = false;
  isUserDetailsVisible = false;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersService.getUsers().subscribe(users => (this.usersList = users));

    this.usersService._crudOp.subscribe(val => {
      if (val === 'deleteSuccessed') {
        this.closeUserListing();
      }
    });
  }

  /**
   * Trigger the side div to show user details
   * @param currentActiveUserID The selected user ID.
   */
  showUserDetails(currentActiveUserID: number) {
    this.selectedUser = this.usersService.findUser(currentActiveUserID);
    this.isUserDetailsVisible = true;
  }
  closeUserListing() {
    this.isUserDetailsVisible = false;
  }

  /**
   * Trigger Function passed to the service to open new user modal
   */
  openAddUserModal() {
    this.usersService.openModalNew();
  }
  /**
   * Trigger Function passed to the service to open edit user modal
   * @param currentActiveUserID The selected user to edit.
   */
  openEditUserModal(currentActiveUserID: number) {
    this.usersService.openModalEdit(currentActiveUserID);
  }
  /**
   * Trigger Function passed to the service to open delete user modal
   * @param context The selected user to delete.
   */
  openDeleteUserModal(currentActiveUserID: number) {
    this.usersService.openModalDelete(currentActiveUserID);
  }

  @HostListener('window:scroll', [])
  /**
   * Fetching new data upon Scrolling
   */
  onScroll(): void {
    if (this.bottomReached()) {
      setTimeout(() => {
        this.usersService.loadPage();
        this.isLoading = true;
      }, 2000);
    }
  }
  bottomReached(): boolean {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
  }
}
