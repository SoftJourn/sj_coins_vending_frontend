import { Component, OnInit, trigger, state, style, transition, animate, ViewContainerRef } from "@angular/core";
import { Account } from "../shared/entity/account";
import { AdminUsersService } from "../shared/services/admin.users.service";
import { NotificationsService } from "angular2-notifications/lib/notifications.service";
import { AddMenu } from "../shared/entity/add-menu";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormControl, FormGroup } from "@angular/forms";
import { LdapUsersService } from "../shared/services/ldap.users.service";
import { Overlay } from "angular2-modal";
import { Modal } from "angular2-modal/plugins/bootstrap";


const mediaWindowSize = 600;

@Component({
  selector: 'users-list',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('heroState', [
      state('inactive', style({opacity: 0, 'z-index': -100})),
      state('active', style({opacity: 1, 'z-index': 1000})),
      transition('inactive => active', [animate('1000ms ease-out')])
    ])
  ]
})
export class UsersComponent implements OnInit {

  public adminUsers: Account[];
  public ldapUsers: Account[];
  public superman: SuperUser = new SuperUser();
  public addMenu: AddMenu = new AddMenu();
  public form: FormGroup;
  public selectedModule: Account;
  public activeModal: NgbModalRef;
  public edit: boolean = false;


  constructor(private adminUserService: AdminUsersService,
              private notificationService: NotificationsService,
              private ladpUserService: LdapUsersService,
              private modalService: NgbModal,
              overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit(): any {
    this.syncAdminUsers();
    this.getLdapUsers();
    this.buildForm();
  }

  private buildForm() {
    this.form = new FormGroup({
      'drop-down': new FormControl(this.selectedModule),
    });
  }

  private getLdapUsers() {
    this.ladpUserService.findAll().subscribe(response => {
      this.ldapUsers = response;
      if (this.ldapUsers.length > 0) {
        this.selectedModule = this.ldapUsers[0];
      }
    });
  }

  public syncAdminUsers() {
    this.adminUserService.findAll().subscribe(response => {
      this.adminUsers = response;
    });
  }

  public deleteUser(ldapName: string) {
    this.modal.confirm()
      .size('sm')
      .isBlocking(true)
      .showClose(true)
      .keyboard(27)
      .title('Delete user')
      .body('Do you really want to delete this user?')
      .okBtn('Yes')
      .okBtnClass('btn btn-success modal-footer-confirm-btn')
      .cancelBtn('Cancel')
      .cancelBtnClass('btn btn-secondary modal-footer-confirm-btn')
      .open()
      .then(
        (response)=> {
          response.result.then(
            () => {
              this.adminUserService.delete(ldapName)
                .subscribe(
                  ()=> {
                  },
                  error=> {
                    this.notificationService.error("Delete", error.body);
                  },
                  () => {
                    this.notificationService.success('Delete', 'User ' + ldapName + ' has been removed successfully');
                    this.syncAdminUsers();
                  });
            },
            () => {
            }
          );
        });
  }

  public static isNotValid(user: Account) {
    return !user.authorities || user.authorities.length < 1;
  }

  public  addAdminUser() {
    if (UsersComponent.isNotValid(this.selectedModule)) {
      this.notificationService.info("Info", "Please select at least one role");
      return;
    }
    this.adminUserService.save(this.selectedModule)
      .subscribe(response=> this.notificationService.success('Add', 'User has been added successfully'),
        error=> {
          this.notificationService.error('Error', error.body);
        },
        ()=> {
          this.syncAdminUsers();
          this.activeModal.close('Submit');
        });
  }

  public editUser(user: Account, content: any) {
    let ldap = this.ldapUsers.filter(luser=>user.ldapName == luser.ldapName)[0];
    ldap.authorities = user.authorities;
    this.selectedModule = ldap;
    this.edit = true;
    this.open(content);
  }

  public open(content: any): NgbModalRef {
    this.activeModal = this.modalService.open(content);
    this.activeModal
      .result.then(result => this.edit = false
      , reason => this.edit = false);
    return this.activeModal;
  }
}

class SuperUser {
  private state: string;

  public fly(state: string) {
    if (window.innerWidth < mediaWindowSize)
      return;
    this.state = state;
  }

  constructor() {
    this.state = "inactive";
  }
}
