import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { ToastService } from '@app/shared/toast/toast.service';
import { User } from '../user';
import { ApiServiceService } from './api-service.service';

export interface ModalInput {
  username: string;
  jobtitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public selectedUser: User;
  public _crudOp: Subject<any> = new Subject<any>();
  private fetchedData: User[];
  private _Users = new BehaviorSubject<User[]>([]);
  private totalPages: number;
  private currentPage: number;

  constructor(private apiService: ApiServiceService, public toastService: ToastService) {
    this.fetchUsers();
  }

  /**
   * fetch initial page Data
   */
  fetchUsers() {
    this.apiService.getUserbyPageNumber(1).subscribe(data => {
      this.totalPages = data.total_pages;
      this.currentPage = data.page;
      this.fetchedData = data.data;
      this.fetchedData.forEach(element => {
        element.user_name = element.first_name + ' ' + element.last_name;
      });
      this._Users.next(this.fetchedData);
    });
  }

  /**
   * Load more page of users, called when you scroll to the bottom and
   * stop being called as the server contains no more pages
   */
  loadPage() {
    if (this.totalPages - this.currentPage > 0) {
      this.apiService.getUserbyPageNumber(this.currentPage + 1).subscribe(data => {
        this.currentPage = data.page;
        this.fetchedData = data.data;
        this.fetchedData.forEach(element => {
          element.user_name = element.first_name + ' ' + element.last_name;
        });
        this._Users.next([...this._Users.getValue(), ...this.fetchedData]);
      });
    }
  }

  /**
   * Search for user object via ID
   * @return The desired user array.
   */
  findUser(selectedUserId: number) {
    return this._Users.getValue().find(o => o.id === selectedUserId);
  }

  /**
   * Return centeral data unit _Users
   * @return The users array.
   */
  public getUsers() {
    return this._Users;
  }

  /**
   * Trigger Function passed to the Modals Component to open new user modal
   */
  openModalNew() {
    this._crudOp.next(0);
  }
  /**
   * Trigger Function passed to the Modals Component to open edit user modal
   * @param currentActiveUserID The selected user to edit.
   */
  openModalEdit(currentActiveUserID: number) {
    this._crudOp.next(currentActiveUserID);
  }
  /**
   * Trigger Function passed to the Modals Component to open delete user modal
   * @param currentActiveUserID The selected user to delete.
   */
  openModalDelete(currentActiveUserID: number) {
    this._crudOp.next(-Math.abs(currentActiveUserID));
  }

  /**
   * Check whether the input is new user or edited user
   * prepare data to be pushed into the centeral data unit _Users
   * show toaster with suitable messages
   * @param editedUserData output of modal form
   * @param key user id, if equals 1; means this is a new user form
   */
  addEditUser(editedUserData: ModalInput, key: number) {
    if (key === 0) {
      this._Users.getValue().unshift({
        id: Math.floor(Math.random() * 1000),
        email: '',
        first_name: '',
        last_name: '',
        user_name: editedUserData.username,
        job_title: editedUserData.jobtitle,
        avatar: './assets/icons8-user@2x.png'
      });
      this.toastService.show(`New User Created: ${editedUserData.username}`, {
        classname: 'bg-success text-light',
        delay: 4000,
        autohide: true,
        headertext: 'Confirmation'
      });
    } else {
      const hashKey = this._Users.getValue().findIndex(element => element.id === key);
      this._Users.getValue()[hashKey].job_title = editedUserData.jobtitle;
      this._Users.getValue()[hashKey].user_name = editedUserData.username;

      this.toastService.show(`${this._Users.getValue()[hashKey].user_name} Updated!`, {
        classname: 'bg-success text-light',
        delay: 6000,
        autohide: true,
        headertext: 'Confirmation'
      });
    }
  }

  /**
   * prepare data to be removed from the centeral data unit _Users
   * show toaster with suitable messages
   * @param key user id of user to be deleted
   */
  deleteUser(key: number) {
    const hashKey = this._Users.getValue().findIndex(element => element.id === key);
    this.toastService.show(`${this._Users.getValue()[hashKey].user_name} Deleted!`, {
      classname: 'bg-danger text-light',
      delay: 6000,
      autohide: true,
      headertext: 'Confirmation'
    });
    this._Users.getValue().splice(hashKey, 1);
    this._crudOp.next('deleteSuccessed');
  }
}
