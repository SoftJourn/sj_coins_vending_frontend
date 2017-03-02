var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, trigger, state, style, transition, animate, ViewContainerRef } from "@angular/core";
import { AdminUsersService } from "../shared/services/admin.users.service";
import { NotificationsService } from "angular2-notifications/lib/notifications.service";
import { AddMenu } from "../shared/entity/add-menu";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormControl, FormGroup } from "@angular/forms";
import { LdapUsersService } from "../shared/services/ldap.users.service";
import { Overlay } from "angular2-modal";
import { Modal } from "angular2-modal/plugins/bootstrap";
var mediaWindowSize = 600;
export var UsersComponent = (function () {
    function UsersComponent(adminUserService, notificationService, ladpUserService, modalService, overlay, vcRef, modal) {
        this.adminUserService = adminUserService;
        this.notificationService = notificationService;
        this.ladpUserService = ladpUserService;
        this.modalService = modalService;
        this.modal = modal;
        this.superman = new SuperUser();
        this.addMenu = new AddMenu();
        this.edit = false;
        overlay.defaultViewContainer = vcRef;
    }
    UsersComponent.prototype.ngOnInit = function () {
        this.syncAdminUsers();
        this.getLdapUsers();
        this.buildForm();
    };
    UsersComponent.prototype.buildForm = function () {
        this.form = new FormGroup({
            'drop-down': new FormControl(this.selectedModule),
        });
    };
    UsersComponent.prototype.getLdapUsers = function () {
        var _this = this;
        this.ladpUserService.findAll().subscribe(function (response) {
            _this.ldapUsers = response;
            if (_this.ldapUsers.length > 0) {
                _this.selectedModule = _this.ldapUsers[0];
            }
        });
    };
    UsersComponent.prototype.syncAdminUsers = function () {
        var _this = this;
        this.adminUserService.findAll().subscribe(function (response) {
            _this.adminUsers = response;
        });
    };
    UsersComponent.prototype.deleteUser = function (ldapName) {
        var _this = this;
        this.modal.confirm()
            .size('sm')
            .isBlocking(true)
            .showClose(true)
            .keyboard(27)
            .title('Delete user')
            .body('Do you really want to delete this user?')
            .okBtn('Yes')
            .okBtnClass('btn btn-success modal-footer-confirm-btn')
            .cancelBtn('Cancel')
            .cancelBtnClass('btn btn-secondary modal-footer-confirm-btn')
            .open()
            .then(function (response) {
            response.result.then(function () {
                _this.adminUserService.delete(ldapName)
                    .subscribe(function () {
                }, function (error) {
                    _this.notificationService.error("Delete", error.body);
                }, function () {
                    _this.notificationService.success('Delete', 'User ' + ldapName + ' has been removed successfully');
                    _this.syncAdminUsers();
                });
            }, function () {
            });
        });
    };
    UsersComponent.isNotValid = function (user) {
        return !user.authorities || user.authorities.length < 1;
    };
    UsersComponent.prototype.addAdminUserSubmit = function () {
        var _this = this;
        if (UsersComponent.isNotValid(this.selectedModule)) {
            this.notificationService.info("Info", "Please select at least one role");
            return;
        }
        this.adminUserService.save(this.selectedModule)
            .subscribe(function (response) { return _this.notificationService.success('Add', 'User has been added successfully'); }, function (error) {
            if (error.status == 409)
                _this.notificationService.error('Error', 'Selected user already exists');
            else
                _this.notificationService.error('Error', error.text());
        }, function () {
            _this.syncAdminUsers();
            _this.activeModal.close('Submit');
        });
    };
    UsersComponent.prototype.editAdminUserSubmit = function () {
        var _this = this;
        if (UsersComponent.isNotValid(this.selectedModule)) {
            this.notificationService.info("Info", "Please select at least one role");
            return;
        }
        this.adminUserService.update(this.selectedModule.ldapId, this.selectedModule)
            .subscribe(function (response) { return _this.notificationService.success('Edit', 'User has been edited successfully'); }, function (error) {
            _this.notificationService.error('Error', error.text());
        }, function () {
            _this.syncAdminUsers();
            _this.activeModal.close('Submit');
        });
    };
    UsersComponent.prototype.editUser = function (user, content) {
        var ldap = this.ldapUsers.filter(function (luser) { return user.ldapId == luser.ldapId; })[0];
        ldap.authorities = user.authorities.slice();
        this.edit = true;
        this.open(content, ldap);
    };
    UsersComponent.prototype.open = function (content, selectedModule) {
        var _this = this;
        if (!selectedModule)
            this.selectedModule = this.ldapUsers[0];
        else
            this.selectedModule = selectedModule;
        this.activeModal = this.modalService.open(content);
        this.activeModal
            .result.then(function (result) {
            _this.edit = false;
            _this.ldapUsers.forEach(function (user) { return user.authorities = null; });
        }, function (reason) {
            _this.edit = false;
            _this.ldapUsers.forEach(function (user) { return user.authorities = null; });
        });
        return this.activeModal;
    };
    UsersComponent = __decorate([
        Component({
            selector: 'users-list',
            templateUrl: './users.component.html',
            styleUrls: ['./users.component.scss'],
            animations: [
                trigger('heroState', [
                    state('inactive', style({ opacity: 0, 'z-index': -100, display: 'none' })),
                    state('active', style({ opacity: 1, 'z-index': 1000, display: 'block' })),
                    transition('inactive => active', [animate('1000ms ease-out')])
                ])
            ]
        }), 
        __metadata('design:paramtypes', [AdminUsersService, NotificationsService, LdapUsersService, NgbModal, Overlay, ViewContainerRef, Modal])
    ], UsersComponent);
    return UsersComponent;
}());
var SuperUser = (function () {
    function SuperUser() {
        this.state = "inactive";
    }
    SuperUser.prototype.fly = function (state) {
        if (window.innerWidth < mediaWindowSize)
            return;
        this.state = state;
    };
    return SuperUser;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/users/users.component.js.map