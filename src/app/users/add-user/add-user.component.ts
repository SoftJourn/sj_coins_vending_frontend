import { Component, OnInit, trigger, state, style, animate, transition, Output, EventEmitter } from "@angular/core";
import { Account } from "../../shared/entity/account";
import { LdapUsersService } from "../../shared/services/ldap.users.service";
import { AdminUsersService } from "../../shared/services/admin.users.service";
import { NotificationsService } from "angular2-notifications/components";
import { UsersComponent } from "../users.component";
import { Input } from "@angular/core/src/metadata/directives";

@Component({
  selector: 'add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  animations:[
    trigger('addUserState',[
      state('shown',style({
        display:'block'
      })),
      state('hidden',style({
        display:'none',
      })),
      transition('shown <=> hidden',[animate('100ms ease-out')])
    ])
  ]
})
export class AddUserComponent implements OnInit {
  public ldapUsers: Account[];
  public selectedModule: Account;

  @Input() isVisible : boolean = true;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  visibility = 'hidden';

  constructor(
    private adminUserService: AdminUsersService,
    private ladpUserService: LdapUsersService,
    private notificationService: NotificationsService,
    private userComponent: UsersComponent) {
  }

  ngOnInit() {
    this.getLdapUsers();
  }
  ngOnChanges(){
    this.visibility = this.isVisible ? 'shown' : 'hidden';
  }

  private getLdapUsers(){
    this.ladpUserService.findAll().subscribe(response =>{
      this.ldapUsers=response;
      if (this.ldapUsers.length > 0) {
        this.selectedModule = this.ldapUsers[0];
      }
    });
  }

  public addAdminUser(){
    this.adminUserService.save(this.selectedModule)
      .subscribe(response=>{
          this.notificationService.success('Add','User has been added successfully');
          this.userComponent.getAdminUsers();
      },
      error=>{
        this.notificationService.error('Error',error._body);
      });
  }

  public hideAddUserComponent(){
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

}
