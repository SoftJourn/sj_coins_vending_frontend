import { Component, OnInit ,trigger,
  state,
  style,
  transition,
  animate} from "@angular/core";
import { Account } from "../shared/entity/account";
import { AdminUsersService } from "../shared/services/admin.users.service";
import { LdapUsersService } from "../shared/services/ldap.users.service";


@Component({
  selector: 'users-list',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('heroState',[
      state('inactive',style({

      })),
      state('active',style({
        width: '227px',
        height: '372px',

        'margin-left': '-44px',
        'margin-top': '-80px'
      })),
      //transition('active => inactive', ),
      transition('inactive => active', [
        animate('100ms ease-out')

      ])
    ])
  ]
})
export class UsersMangerComponent implements OnInit {
  public ladpUsers: Account[];
  public adminUsers: Account[];
  public selectedModule: Account;
  public superUserState: string;
  public superUserSrc:string;

  constructor(
    private adminUserService: AdminUsersService,
    private ladpUserService: LdapUsersService
  ) {}

  ngOnInit(): any {
    this.getAdminUsers();
    this.getLdapUsers();
    this.superUserState="inactive";
    this.superUserSrc="../../assets/images/Super_Logo.png";
  }

  private getAdminUsers(){
    this.adminUserService.findAll().subscribe(response => {
      this.adminUsers=response;
    });
  }
  private getLdapUsers(){
    this.ladpUserService.findAll().subscribe(response =>{
      this.ladpUsers=response;
    });
  }
  public addAdminUser(){
    this.adminUserService.save(this.selectedModule)
      .subscribe(response => this.getAdminUsers());
  }

  public deleteUser(ldapName: string) {
    console.log(ldapName);
    this.adminUserService.delete(ldapName)
      .subscribe(
        next => {},
        error=> {},
        () => {
          this.getAdminUsers();
      });
  }

  public flySuperman(){
    console.log("HE IS THERE!!!");
    if(this.superUserState=="inactive"){
      this.superUserSrc="../../assets/images/SUPER_ADMIN.png";
      this.superUserState="active";

    }
    else{
      this.superUserSrc="../../assets/images/Super_Logo.png";
      this.superUserState="inactive";

    }

  }

  public getRole(authorities : string) : string {
    let regex =/.*ROLE_/;

    return authorities.replace(regex,'');
  }

}
