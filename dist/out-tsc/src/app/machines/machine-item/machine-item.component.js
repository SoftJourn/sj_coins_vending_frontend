var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter, ViewContainerRef } from "@angular/core";
import { Machine } from "../shared/machine";
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { Overlay } from "angular2-modal";
import { Router } from "@angular/router";
export var MachineItemComponent = (function () {
    function MachineItemComponent(overlay, vcRef, modal, router) {
        this.modal = modal;
        this.router = router;
        this.onDelete = new EventEmitter();
        overlay.defaultViewContainer = vcRef;
    }
    MachineItemComponent.prototype.ngOnInit = function () {
    };
    MachineItemComponent.prototype.onEditMachine = function () {
        this.router.navigate(['/main/machines', this.machine.id, 'edit']);
    };
    MachineItemComponent.prototype.deleteMachine = function () {
        var _this = this;
        this.modal.confirm()
            .size('sm')
            .isBlocking(true)
            .showClose(true)
            .keyboard(27)
            .title('Delete machine')
            .body('Do you really want to delete this vending machine?')
            .okBtn('Yes')
            .okBtnClass('btn btn-success modal-footer-confirm-btn')
            .cancelBtn('Cancel')
            .cancelBtnClass('btn btn-secondary modal-footer-confirm-btn')
            .open()
            .then(function (response) {
            response.result.then(function () {
                _this.onDelete.emit(_this.machine.id);
            }, function () { });
        });
    };
    __decorate([
        Input(), 
        __metadata('design:type', Machine)
    ], MachineItemComponent.prototype, "machine", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], MachineItemComponent.prototype, "onDelete", void 0);
    MachineItemComponent = __decorate([
        Component({
            selector: 'machine-item',
            templateUrl: './machine-item.component.html',
            styleUrls: ['./machine-item.component.scss']
        }), 
        __metadata('design:paramtypes', [Overlay, ViewContainerRef, Modal, Router])
    ], MachineItemComponent);
    return MachineItemComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/machines/machine-item/machine-item.component.js.map