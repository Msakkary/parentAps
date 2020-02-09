import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../user';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-crud-modal',
  templateUrl: './crud-modal.component.html',
  styleUrls: ['./crud-modal.component.scss']
})
export class CrudModalComponent implements OnInit {
  userID: number;
  isAddForm: boolean;
  isDeleteForm: boolean;
  editForm: FormGroup;

  public activeUser: User;

  @ViewChild('content', { static: true }) modalContent: ElementRef;

  constructor(private modalService: NgbModal, private usersService: UsersService, private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.checkModalType();
  }

  /**
   * check modal type based on Subject Subscribed Value
   * if equal 0, means this is a new user form
   * if +ve , means this is edit form and the value is the user ID
   * if -ve , means this is delete form and the value is the user ID
   */
  checkModalType() {
    this.usersService._crudOp.subscribe(val => {
      if (val === 0) {
        this.isAddForm = true;
        this.isDeleteForm = false;
        this.newUserInit();
      } else if (val > 0) {
        this.isAddForm = false;
        this.isDeleteForm = false;
        this.pushUserDataToForm(val);
      } else if (val < 0) {
        this.isDeleteForm = true;
        this.userID = Math.abs(val);
        this.activeUser = this.usersService.findUser(this.userID);
      }
      this.open(this.modalContent);
    });
  }

  /**
   * populate user data to form ( Edit Mode )
   */
  pushUserDataToForm(id: number) {
    this.activeUser = this.usersService.findUser(id);
    this.editForm.patchValue({
      username: this.activeUser.user_name,
      jobtitle: this.activeUser.job_title
    });
  }

  /**
   * Create a new user Model
   * reset the form fields
   * close modal
   */
  newUserInit() {
    this.activeUser = { id: 0, first_name: '', last_name: '', user_name: '', job_title: '', email: '', avatar: '' };
    this.editForm.reset();
    this.modalService.dismissAll();
  }

  /**
   * pass user data & ID to the services
   * reset the form fields
   * close modal
   */
  editUserSubmitted(key: number) {
    this.usersService.addEditUser(this.editForm.value, key);
    this.editForm.reset();
    this.modalService.dismissAll();
  }

  /**
   * pass deleted user ID to the service
   * reset the form fields
   * close modal
   */
  deleteUserSubmitted(key: number) {
    this.usersService.deleteUser(key);
    this.modalService.dismissAll();
  }

  /**
   * Open ng-bootstrap Form
   */
  open(content: any) {
    this.modalService.open(content, { size: 'md', windowClass: 'modal-spaces', centered: true });
  }

  /**
   * Bind Reactive Module Form
   */
  private createForm() {
    this.editForm = this.formBuilder.group({
      username: ['', Validators.required],
      jobtitle: ['']
    });
  }
}
