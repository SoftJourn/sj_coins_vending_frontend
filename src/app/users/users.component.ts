import { Component, OnInit, trigger, state, style, transition, animate } from "@angular/core";
import { Account } from "../shared/entity/account";
import { AdminUsersService } from "../shared/services/admin.users.service";
import { NotificationsService } from "angular2-notifications/lib/notifications.service";
import { AddMenu } from "../shared/entity/add-menu";


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
    ]),
    trigger('editMenuState', [
      state('visible', style({
        display: 'table-row', 'max-height': '80px'
      })),
      state('hidden', style({display: 'none', 'max-height': '0px'})),
      transition('visible<=>hidden', [animate('0.8s ease-in-out')])
    ])
  ]
})
export class UsersComponent implements OnInit {

  public adminUsers: Account[];
  public superman: SuperUser = new SuperUser();
  public addMenu: AddMenu = new AddMenu();
  public editMenu: EditMenu = new EditMenu();

  public selected: Account;

  constructor(private adminUserService: AdminUsersService,
              private notificationService: NotificationsService) {
  }

  ngOnInit(): any {
    this.syncAdminUsers();
  }

  public syncAdminUsers() {
    this.adminUserService.findAll().subscribe(response => {
      this.adminUsers = response;
    });
  }

  public deleteUser(ldapName: string) {
    this.adminUserService.delete(ldapName)
      .subscribe(
        next => {
        },
        error=> {
          this.notificationService.error("Delete", error._body);
        },
        () => {
          this.notificationService.success('Delete', 'User ' + ldapName + ' has been removed successfully');
          this.editMenu.deselectRow();
          this.syncAdminUsers();
        });
  }
  public editUser(user:Account){
    this.selected=user;
    this.addMenu.changeVisibility(true);
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

class EditMenu {

  private _selectedRow:number;
  public selectedRow(row: number){
    if(this._selectedRow==row)
      this.deselectRow();
    else
      this._selectedRow=row;
  }

  public deselectRow() {
    this._selectedRow = undefined;
  }

  public getStateByRow(row: number): string {
      if(row==this._selectedRow){
          return 'visible';
      } else {
        return 'hidden';
      }
  }

  public getClassByRow(row: number): string {
    if (row == this._selectedRow) {
      return 'selected-row';
    }
  }
  public activeRowClass(row:number){
    if(row==this._selectedRow){
      return 'visible';
    }
  }
}
