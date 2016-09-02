import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AccountService, AppError } from "../shared/";

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  directives: []
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loginError: AppError;

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.loginError = new AppError();

    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('[\\d\\w\\.]+@(chromeriver|softjourn)\\.com')
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
      return 'Please enter valid email address';
    }

    return 'This field is required'
  }

  onSubmit(): void {
    this.accountService.login(this.form.value)
      .subscribe(
        () => {},
        (error: AppError) => this.loginError = error,
        () => this.router.navigate(['/main'])
      )
  }
}
