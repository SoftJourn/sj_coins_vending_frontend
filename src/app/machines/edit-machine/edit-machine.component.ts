import {Component, OnInit, ViewContainerRef} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MachineService } from "../../shared/services/machine.service";
import { NotificationsService } from "angular2-notifications";
import { FormValidationStyles } from "../../shared/form-validation-styles";
import { Router, ActivatedRoute } from "@angular/router";
import { ErrorDetail } from "../../shared/entity/error-detail";
import { Subscription } from "rxjs";
import { Machine } from "../shared/machine";
import { Modal } from "angular2-modal/plugins/bootstrap";
import {Overlay} from "angular2-modal";

@Component({
  selector: 'app-edit-machine',
  templateUrl: './edit-machine.component.html',
  styleUrls: ['./edit-machine.component.scss']
})
export class EditMachineComponent implements OnInit {

  form: FormGroup;
  public formStyles: FormValidationStyles;
  private subscription: Subscription;
  private mashinesIndex: number;
  public machines: Machine;
  private typeColsRows: any;
  public rowsNumbering: any;
  public columnsNumbering: any;
  public isActive: boolean;

  constructor(private machineService: MachineService,
              private notificationService: NotificationsService,
              private route: ActivatedRoute,
              private router: Router,
              public modal: Modal, overlay: Overlay, vcRef: ViewContainerRef,) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        this.mashinesIndex = +params['id'];

                this.machineService.findOne(this.mashinesIndex).subscribe(
                    machines => {
                        this.machines = machines;
                        this.checkTypeColumRows();
                        this.buildForm();
                    },
                  error => {
                    try {
                      let errorDetail = <ErrorDetail> error.json();
                      if (!errorDetail.detail)
                      //noinspection ExceptionCaughtLocallyJS
                        throw errorDetail;
                      this.notificationService.error('Error', errorDetail.detail);
                    } catch (err) {
                      console.log(err);
                      this.notificationService.error('Error', 'Error appeared, watch logs!');
                    }
                  });
            }
        );
    }

  private buildForm(): void {
    this.form = new FormGroup({
      name: new FormControl(this.machines.name, [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9\u0400-\u04FF]+[ a-zA-Z0-9\u0400-\u04FF]*[a-zA-Z0-9\u0400-\u04FF]$')
      ]),
      url: new FormControl(this.machines.url, [
        Validators.required,
        Validators.pattern('https?:\\/\\/(www\\.)?([-a-zA-Z0-9@:%._+~#=]{2,256}\\.[a-z]{2,6}|[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3})\\b([-a-zA-Z0-9@:%_+.~#?&/=]*)')
      ]),
      rowsCount: new FormControl({value: this.machines.size.rows, disabled: true}, [
        Validators.required,
        Validators.pattern('^[1-9]$|^[1][0-9]{0,1}$')
      ]),
      rowsNumbering: new FormControl({value: this.rowsNumbering, disabled: true}, Validators.required),
      columnsCount: new FormControl({value: this.machines.size.columns, disabled: true}, [
        Validators.required,
        Validators.pattern('^[1-9]$|^[1][0-9]{0,1}$')
      ]),
      columnsNumbering: new FormControl({value: this.columnsNumbering, disabled: true}, Validators.required),
      cellLimit: new FormControl({value: this.machines.size.cellLimit, disabled: true}, [
        Validators.required,
        Validators.pattern('^[1-9]$|^[1][0-9]{0,1}$')
      ]),
      isActive: new FormControl(this.machines.isActive),
      isVirtual: new FormControl(this.machines.isVirtual)
    });

    this.formStyles = new FormValidationStyles(this.form);
  }

    submit() {
        this.form.value.id = this.mashinesIndex;
        this.machineService.updateMachine(this.form.value).subscribe(
            () => {},
            error => this.processError(error),
            () => {
                this.router.navigate(['/main/machines']);
                this.notificationService.success('Update', 'Machine has been updated successfully');
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
      columnsNumbering: 'NUMERICAL',
      isActive: false
    });
  }

  private checkTypeColumRows() {
    let reg1 = /\d{1}\d{1}/;
    let reg2 = /[A-Za-z]{1}[A-Za-z]{1}/;
    let reg3 = /[A-Z]{1}[0-9]{1}/;
    let reg4 = /[0-9]{1}[A-Z]{1}/;
    for (let i = 0; i < this.machines.rows.length; i++) {
      for (let j = 0; j < this.machines.rows[i].fields.length; j++) {
        this.typeColsRows = this.machines.rows[0].fields[0].internalId;
      }
    }

    if (reg1.test(this.typeColsRows)) {
      this.rowsNumbering = 'NUMERICAL';
      this.columnsNumbering = 'NUMERICAL';

    } else if (reg2.test(this.typeColsRows)) {
      this.rowsNumbering = 'ALPHABETICAL';
      this.columnsNumbering = 'ALPHABETICAL';
    }
    else if (reg3.test(this.typeColsRows)) {
      this.rowsNumbering = 'ALPHABETICAL';
      this.columnsNumbering = 'NUMERICAL';
    } else if (reg4.test(this.typeColsRows)) {
      this.rowsNumbering = 'NUMERICAL';
      this.columnsNumbering = 'ALPHABETICAL';
    }
  }

  cancel(): void {
    this.router.navigate(['/main/machines']);
  }

  resetMotorState() {
    this.modal.confirm()
      .size('lg')
      .isBlocking(true)
      .showClose(true)
      .keyboard(27)
      .title('Reset machine motors')
      .body('You have to switch machine to service mode before pressing this button!')
      .okBtn('OK')
      .okBtnClass('btn btn-success modal-footer-confirm-btn')
      .cancelBtn('Cancel')
      .cancelBtnClass('btn btn-secondary modal-footer-confirm-btn')
      .open()
      .then(
        (response) => {
          response.result.then(
            () => {
              this.form.value.id = this.mashinesIndex;
              this.machineService.resetMotorState(this.form.value).subscribe(
                  () => {},
                  error => this.processError(error),
                  () => {
                    this.notificationService.success('Update', 'Machine motors has been reset successfully');
                  }
              )},
            () => {}
          );
        });
  }

  private processError(error) {
    try {
      let errorDetail = <ErrorDetail> error.json();
      if (!errorDetail.detail)
      //noinspection ExceptionCaughtLocallyJS
        throw errorDetail;
      this.notificationService.error('Error', errorDetail.detail);
    } catch (err) {
      console.log(err);
      this.notificationService.error('Error', 'Error appeared, watch logs!');
    }
  }

}
