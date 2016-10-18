import {Component, OnInit, trigger, state, style, transition, animate} from "@angular/core";
import {Account} from "../shared/entity/account";
import {AdminUsersService} from "../shared/services/admin.users.service";
import {NotificationsService} from "angular2-notifications/lib/notifications.service";
import {AddMenu} from "../shared/entity/add-menu";


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
      state('visible',style({display:'table-row'})),
      state('hidden',style({display:'none'}))
    ])
  ]
})
export class UsersComponent implements OnInit {

  public adminUsers: Account[];
  public superman: SuperUser = new SuperUser();
  public addMenu: AddMenu = new AddMenu();
  public editMenu: EditMenu = new EditMenu();

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
          this.syncAdminUsers();
        });
  }

  public editUser(user: Account) {
    this.adminUserService.update(user.ldapName, user).subscribe(next=> {
    }, error=> {
    }, ()=> {
    });
  }

  public getRole(authorities: string): string {
    let regex = /.*ROLE_/;
    let withOutRole = authorities.replace(regex, '');
    return withOutRole.replace(/_/, ' ');
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
      this._selectedRow=undefined;
    else
      this._selectedRow=row;
  }
  public getStateByRow(row: number) {
      if(row==this._selectedRow){
          return 'visible';
      } else {
        return 'hidden';
      }
  }
  public activeRowClass(row:number){
    if(row==this._selectedRow){
      return 'visible';
    }
  }
}
