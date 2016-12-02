import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppError } from "../shared/app-error";
import { AccountService } from "../shared/services/account.service";
import { NotificationsService } from "angular2-notifications";

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loginError: AppError;

  constructor(private router: Router,
              private accountService: AccountService,
              private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.accountService.logout();
    this.loginError = new AppError();
    this.form = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.pattern('[\\d\\w\\.]+')
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
  }

  isValidOrPristine(controlName: string): boolean {
    return this.form.controls[controlName].valid
      || this.form.controls[controlName].pristine;
  }

  inputDividerColor(controlName: string): string {
    return this.isValidOrPristine(controlName) ? 'primary' : 'warn'
  }

  errorMessage(controlName: string): string {
    let control = this.form.controls[controlName];

    if (control.hasError('pattern')) {
      return 'Please enter valid LDAP login';
    }

    return 'This field is required'
  }

  onSubmit(): void {
    this.accountService.login(this.form.value)
      .subscribe(
        () => {
        },
        (error: AppError) => this.notificationService.error('Error', error.message),
        () => {
          if (!!this.accountService.getRoutes()[0])
            this.router.navigate([this.accountService.getRoutes()[0]]);
          else
            this.notificationService.info('Info', 'User is not admin');
        })
  }
}
