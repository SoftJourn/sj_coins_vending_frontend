import { Component, OnInit, trigger, state, style, transition, animate } from "@angular/core";
import { Account } from "../shared/entity/account";
import { AdminUsersService } from "../shared/services/admin.users.service";
import { NotificationsService } from "angular2-notifications/lib/notifications.service";


const mediaWindowSize = 600;

@Component({
  selector: 'users-list',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('heroState', [
      state('inactive', style({
        opacity: 0,
        'z-index': -100
      })),
      state('active', style({
        opacity: 1,
        'z-index': 1000
      })),

      transition('inactive => active', [
        animate('1000ms ease-out')
      ])
    ])
  ]
})
export class UsersComponent implements OnInit {

  public adminUsers: Account[];
  public superman: SuperUser = new SuperUser();
  public addMenu: AddMenu = new AddMenu();

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
          this.notificationService.error("Delete", error._body)
        },
        () => {
          this.notificationService.success('Delete', 'User has been removed from ADMIN successfully');
          this.syncAdminUsers();
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

class AddMenu {
  iconState: boolean = false;
  visible: boolean = false;

  public spinPlusIcon() {
    this.iconState = !this.iconState;
  }

  public changeVisibility(visibility: boolean) {
    this.visible = visibility;
  }
}
