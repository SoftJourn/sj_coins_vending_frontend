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
        opacity:0,
        'z-index': 100
      })),
      state('active', style({
        opacity:1,
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
  private superUserState: string;
  private superUserSrc: string;
  private addIconState: boolean;
  private addFormIsVisible:boolean=false;


  constructor(private adminUserService: AdminUsersService,
              private notificationService: NotificationsService
              ) {
  }

  ngOnInit(): any {
    this.getAdminUsers();
    this.superUserState = "inactive";
    this.superUserSrc = "../../assets/images/superman-logo.png";
    this.addIconState = false;
  }

  public getAdminUsers() {
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
          this.getAdminUsers();
        });
  }

  public flySuperman(state:string) {
    if (window.innerWidth < mediaWindowSize)
      return;
    this.superUserState = state;
  }

  public spinPlusIcon() {
    this.addIconState = !this.addIconState;
  }

  public getRole(authorities: string): string {
    let regex = /.*ROLE_/;
    let withOutRole = authorities.replace(regex, '');
    return withOutRole.replace(/_/, ' ');
  }

  public  changeFormVisibility(visibility: boolean) {
    this.addFormIsVisible = visibility;
  }
}
