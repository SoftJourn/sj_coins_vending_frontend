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
import { Router, ActivatedRoute } from "@angular/router";
export var EditMachineComponent = (function () {
    function EditMachineComponent(machineService, notificationService, route, router) {
        this.machineService = machineService;
        this.notificationService = notificationService;
        this.route = route;
        this.router = router;
    }
    EditMachineComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.route.params.subscribe(function (params) {
            _this.mashinesIndex = +params['id'];
            _this.machineService.findOne(_this.mashinesIndex).subscribe(function (machines) {
                _this.machines = machines;
                _this.checkTypeColumRows();
                _this.buildForm();
            }, function (error) {
                try {
                    var errorDetail = error.json();
                    if (!errorDetail.detail)
                        //noinspection ExceptionCaughtLocallyJS
                        throw errorDetail;
                    _this.notificationService.error('Error', errorDetail.detail);
                }
                catch (err) {
                    console.log(err);
                    _this.notificationService.error('Error', 'Error appeared, watch logs!');
                }
            });
        });
    };
    EditMachineComponent.prototype.buildForm = function () {
        this.form = new FormGroup({
            name: new FormControl(this.machines.name, [
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9\u0400-\u04FF]+[ a-zA-Z0-9\u0400-\u04FF]*[a-zA-Z0-9\u0400-\u04FF]$')
            ]),
            url: new FormControl(this.machines.url, [
                Validators.required,
                Validators.pattern('https?:\\/\\/(www\\.)?([-a-zA-Z0-9@:%._+~#=]{2,256}\\.[a-z]{2,6}|[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3})\\b([-a-zA-Z0-9@:%_+.~#?&/=]*)')
            ]),
            rowsCount: new FormControl({ value: this.machines.size.rows, disabled: true }, [
                Validators.required,
                Validators.pattern('^[1-9]$|^[1][0-9]{0,1}$')
            ]),
            rowsNumbering: new FormControl({ value: this.rowsNumbering, disabled: true }, Validators.required),
            columnsCount: new FormControl({ value: this.machines.size.columns, disabled: true }, [
                Validators.required,
                Validators.pattern('^[1-9]$|^[1][0-9]{0,1}$')
            ]),
            columnsNumbering: new FormControl({ value: this.columnsNumbering, disabled: true }, Validators.required),
            cellLimit: new FormControl({ value: this.machines.size.cellLimit, disabled: true }, [
                Validators.required,
                Validators.pattern('^[1-9]$|^[1][0-9]{0,1}$')
            ]),
            isActive: new FormControl(this.machines.isActive)
        });
        this.formStyles = new FormValidationStyles(this.form);
    };
    EditMachineComponent.prototype.submit = function () {
        var _this = this;
        this.form.value.id = this.mashinesIndex;
        this.machineService.updateMachine(this.form.value).subscribe(function () {
        }, function (error) {
            try {
                var errorDetail = error.json();
                if (!errorDetail.detail)
                    //noinspection ExceptionCaughtLocallyJS
                    throw errorDetail;
                _this.notificationService.error('Error', errorDetail.detail);
            }
            catch (err) {
                console.log(err);
                _this.notificationService.error('Error', 'Error appeared, watch logs!');
            }
        }, function () {
            _this.router.navigate(['/main/machines']);
            _this.notificationService.success('Update', 'Machine has been updated successfully');
            _this.resetForm();
        });
    };
    EditMachineComponent.prototype.resetForm = function () {
        this.form.reset({
            name: '',
            rowsCount: '',
            rowsNumbering: 'ALPHABETICAL',
            columnsCount: '',
            columnsNumbering: 'NUMERICAL',
            isActive: false
        });
    };
    EditMachineComponent.prototype.checkTypeColumRows = function () {
        var reg1 = /\d{1}\d{1}/;
        var reg2 = /[A-Za-z]{1}[A-Za-z]{1}/;
        var reg3 = /[A-Z]{1}[0-9]{1}/;
        var reg4 = /[0-9]{1}[A-Z]{1}/;
        for (var i = 0; i < this.machines.rows.length; i++) {
            for (var j = 0; j < this.machines.rows[i].fields.length; j++) {
                this.typeColsRows = this.machines.rows[0].fields[0].internalId;
            }
        }
        if (reg1.test(this.typeColsRows)) {
            this.rowsNumbering = 'NUMERICAL';
            this.columnsNumbering = 'NUMERICAL';
        }
        else if (reg2.test(this.typeColsRows)) {
            this.rowsNumbering = 'ALPHABETICAL';
            this.columnsNumbering = 'ALPHABETICAL';
        }
        else if (reg3.test(this.typeColsRows)) {
            this.rowsNumbering = 'ALPHABETICAL';
            this.columnsNumbering = 'NUMERICAL';
        }
        else if (reg4.test(this.typeColsRows)) {
            this.rowsNumbering = 'NUMERICAL';
            this.columnsNumbering = 'ALPHABETICAL';
        }
    };
    EditMachineComponent.prototype.cancel = function () {
        this.router.navigate(['/main/machines']);
    };
    EditMachineComponent = __decorate([
        Component({
            selector: 'app-edit-machine',
            templateUrl: './edit-machine.component.html',
            styleUrls: ['./edit-machine.component.scss']
        }), 
        __metadata('design:paramtypes', [MachineService, NotificationsService, ActivatedRoute, Router])
    ], EditMachineComponent);
    return EditMachineComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/machines/edit-machine/edit-machine.component.js.map