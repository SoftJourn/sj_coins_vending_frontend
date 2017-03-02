var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MachineService } from "../../shared/services/machine.service";
import { NotificationsService } from "angular2-notifications";
import { FormValidationStyles } from "../../shared/form-validation-styles";
import { Router } from "@angular/router";
export var AddMachineComponent = (function () {
    function AddMachineComponent(machineService, notificationService, router) {
        this.machineService = machineService;
        this.notificationService = notificationService;
        this.router = router;
    }
    AddMachineComponent.prototype.ngOnInit = function () {
        this.buildForm();
    };
    AddMachineComponent.prototype.buildForm = function () {
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
            cellLimit: new FormControl('', [
                Validators.required,
                Validators.pattern('^[1-9]$|^[1][0-9]{0,1}$')
            ]),
            isActive: new FormControl(false)
        });
        this.formStyles = new FormValidationStyles(this.form);
    };
    AddMachineComponent.prototype.submit = function () {
        var _this = this;
        this.machineService.save(this.form.value).subscribe(function () {
        }, function (error) {
            try {
                var errorDetail = error.json();
                if (errorDetail.code === 1062) {
                    _this.notificationService.error('Error', 'Machine with such name exists!');
                }
                else {
                    if (!errorDetail.detail)
                        //noinspection ExceptionCaughtLocallyJS
                        throw errorDetail;
                    _this.notificationService.error('Error', errorDetail.detail);
                }
            }
            catch (err) {
                console.log(err);
                _this.notificationService.error('Error', 'Details are not provided');
            }
        }, function () {
            _this.notificationService.success('Create', 'Machine has been created successfully');
            _this.router.navigateByUrl('main/machines');
        });
    };
    AddMachineComponent.prototype.resetForm = function () {
        this.form.reset({
            name: '',
            rowsCount: '',
            rowsNumbering: 'ALPHABETICAL',
            columnsCount: '',
            columnsNumbering: 'NUMERICAL'
        });
    };
    AddMachineComponent.prototype.cancel = function () {
        this.router.navigate(['/main/machines']);
    };
    AddMachineComponent = __decorate([
        Component({
            selector: 'add-machine',
            templateUrl: './add-machine.component.html',
            styleUrls: ['./add-machine.component.scss']
        }), 
        __metadata('design:paramtypes', [MachineService, NotificationsService, Router])
    ], AddMachineComponent);
    return AddMachineComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/machines/add-machine/add-machine.component.js.map