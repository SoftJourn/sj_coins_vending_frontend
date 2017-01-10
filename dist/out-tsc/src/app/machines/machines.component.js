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
import { MachineService } from "../shared/services/machine.service";
import { NotificationsService } from "angular2-notifications/lib/notifications.service";
export var MachinesComponent = (function () {
    function MachinesComponent(machineService, notificationService) {
        this.machineService = machineService;
        this.notificationService = notificationService;
    }
    MachinesComponent.prototype.ngOnInit = function () {
        this.getMachines();
    };
    MachinesComponent.prototype.getMachines = function () {
        var _this = this;
        this.machineService.findAll().subscribe(function (machines) {
            return _this.machines = machines;
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
    };
    MachinesComponent.prototype.onDelete = function (id) {
        var _this = this;
        this.machineService.delete(id)
            .subscribe(function () { return null; }, function (error) {
            try {
                var errorDetail = error.json();
                if (errorDetail.code == 1451) {
                    _this.notificationService.error('Error', 'Can not delete, this machine is being used!');
                }
                else {
                    if (errorDetail) {
                        _this.notificationService.error('Error', errorDetail.detail);
                    }
                    else {
                        _this.notificationService.error('Error', 'Error appeared during deletion');
                    }
                }
            }
            catch (err) {
                console.log(err);
                _this.notificationService.error('Error', 'Error appeared, watch logs!');
            }
        }, function () {
            _this.notificationService.success('Success', 'Machine has been deleted successfully');
            _this.getMachines();
        });
    };
    MachinesComponent = __decorate([
        Component({
            selector: 'machines-list',
            templateUrl: './machines.component.html',
            styleUrls: ['./machines.component.scss']
        }), 
        __metadata('design:paramtypes', [MachineService, NotificationsService])
    ], MachinesComponent);
    return MachinesComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/machines/machines.component.js.map