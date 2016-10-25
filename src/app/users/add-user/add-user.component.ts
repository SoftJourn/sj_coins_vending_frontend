import { Component, OnInit, trigger, state, style, animate, transition, Output, EventEmitter } from "@angular/core";
import { Account } from "../../shared/entity/account";
import { LdapUsersService } from "../../shared/services/ldap.users.service";
import { AdminUsersService } from "../../shared/services/admin.users.service";
import { NotificationsService } from "angular2-notifications/components";
import { Input } from "@angular/core/src/metadata/directives";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: 'add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  animations: [
    trigger('addUserState', [state('shown', style({display: 'block'})),
      state('hidden', style({display: 'none',})),
      transition('shown <=> hidden', [animate('100ms ease-out')])
    ])
  ]
})
export class AddUserComponent implements OnInit {
  public ldapUsers: Account[];
  public selectedModule: Account =new Account('','','','');
  public form:FormGroup;

  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() adminListChange = new EventEmitter<boolean>();
  visibility = 'hidden';

  constructor(private adminUserService: AdminUsersService,
              private ladpUserService: LdapUsersService,
              private notificationService: NotificationsService) {
  }


  @Input()
  set selected(user:Account){
    if(user){
      let ldap=this.ldapUsers.filter(luser=>user.ldapName==luser.ldapName)[0];
      ldap.authorities=user.authorities;
      this.selectedModule=ldap;
    }
  }
  @Input()
  set adminUsers(admins: Account[]) {
    if (admins) {
      if (this.ldapUsers) {
          admins.forEach(adm=>this.ldapUsers.filter(ldap=>ldap.ldapName==adm.ldapName)[0].authorities=adm.authorities);
      }
    }
  }

  ngOnInit() {
    this.getLdapUsers();
    this.buildForm();
  }

  private buildForm(){
    this.form=new FormGroup({
      'drop-down': new FormControl(this.selectedModule),
      'inventory': new FormControl(this.selectedModule.authorities.includes('Inventory')),
      'billing': new FormControl(this.selectedModule.authorities.includes('Billing'))
    });
  }

  public isNotValid(user:Account){
    return !user.authorities;
  }

  ngOnChanges() {
    this.visibility = this.isVisible ? 'shown' : 'hidden';
  }

  private getLdapUsers() {
    this.ladpUserService.findAll().subscribe(response => {
      this.ldapUsers = response;
      if (this.ldapUsers.length > 0) {
        this.selectedModule = this.ldapUsers[0];
      }
    });
  }

  public  addAdminUser() {
    // console.log(this.selectedModule);
    if(this.isNotValid(this.selectedModule)) {
      this.notificationService.info("Info", "Please select at least one role");
      return;
    }
    this.adminUserService.save(this.selectedModule)
      .subscribe(response=> {
          this.notificationService.success('Add', 'User has been added successfully');
          this.adminListChange.emit(true);
        },
        error=> {
          this.notificationService.error('Error', error._body);
        });
  }

  public hideAddUserComponent() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

}
