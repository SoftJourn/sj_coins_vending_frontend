import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MachineService } from "../../shared/services/machine.service";
import { NotificationsService } from "angular2-notifications";
import { FormValidationStyles } from "../../shared/form-validation-styles";

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
    private notificationService: NotificationsService
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
      address: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9]+')
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
      columnsNumbering: new FormControl('NUMERICAL', Validators.required)
    });

    this.formStyles = new FormValidationStyles(this.form);
  }

  submit() {
    this.machineService.save(this.form.value).subscribe(
      () => {},
      error => {},
      () => {
        this.notificationService.success('Create', 'Machine has been created successfully');
        this.clear()
      }
    );
  }

  clear() {
    this.form.reset({
      name: '',
      erisAccount: '',
      rowsCount: '',
      rowsNumbering: 'ALPHABETICAL',
      columnsCount: '',
      columnsNumbering: 'NUMERICAL'
    });
  }
}
