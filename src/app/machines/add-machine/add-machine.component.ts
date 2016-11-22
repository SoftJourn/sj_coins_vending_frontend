import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MachineService } from "../../shared/services/machine.service";
import { NotificationsService } from "angular2-notifications";
import { FormValidationStyles } from "../../shared/form-validation-styles";
import { Router } from "@angular/router";
import { Response } from "@angular/http";
import { ErrorDetail } from "../../shared/entity/error-detail";

@Component({
  selector: 'add-machine',
  templateUrl: './add-machine.component.html',
  styleUrls: ['./add-machine.component.scss']
})
export class AddMachineComponent implements OnInit {
  form: FormGroup;
  formStyles: FormValidationStyles;

  constructor(
    private machineService: MachineService,
    private notificationService: NotificationsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9\u0400-\u04FF]+[ a-zA-Z0-9\u0400-\u04FF]*[a-zA-Z0-9\u0400-\u04FF]$')
      ]),
      url: new FormControl('', [
        Validators.required,
        Validators.pattern('https?:\\/\\/(www\\.)?([-a-zA-Z0-9@:%._+~#=]{2,256}\\.[a-z]{2,6}|[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3})\\b([-a-zA-Z0-9@:%_+.~#?&/=]*)')
      ]),
      rowsCount: new FormControl('', [
        Validators.required,
        Validators.pattern('^[1-9]$|^[1][0-9]{0,1}$')
      ]),
      rowsNumbering: new FormControl('ALPHABETICAL', Validators.required),
      columnsCount: new FormControl('', [
        Validators.required,
        Validators.pattern('^[1-9]$|^[1][0-9]{0,1}$')
      ]),
      columnsNumbering: new FormControl('NUMERICAL', Validators.required),
      isActive: new FormControl(false)
    });

    this.formStyles = new FormValidationStyles(this.form);
  }

  submit() {
    this.machineService.save(this.form.value).subscribe(
      () => {},
      (error: Response) => {
        let errorDetail: ErrorDetail = error.json();
        if (errorDetail.code === 1062) {
          this.notificationService.error('Error', 'Machine with such name exists!');
        } else {
          this.notificationService.error('Error', errorDetail.detail);
        }
      },
      () => {
        this.notificationService.success('Create', 'Machine has been created successfully');
        this.resetForm()
      }
    );
  }

  private resetForm() {
    this.form.reset({
      name: '',
      rowsCount: '',
      rowsNumbering: 'ALPHABETICAL',
      columnsCount: '',
      columnsNumbering: 'NUMERICAL'
    });
  }

  cancel(): void {
    this.router.navigate(['/main/machines']);
  }
}
