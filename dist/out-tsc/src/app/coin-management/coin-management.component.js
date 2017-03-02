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
import { REGULAR, MERCHANT } from "./coins-account";
import { CoinService } from "../shared/services/coin.service";
import { NotificationsService } from "angular2-notifications";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FormValidationStyles } from "../shared/form-validation-styles";
import { Observable } from "rxjs";
export var CoinManagementComponent = (function () {
    function CoinManagementComponent(coinService, notificationService) {
        this.coinService = coinService;
        this.notificationService = notificationService;
        this.fileName = '';
        this.transferFileButtonDisabled = true;
        this.transferFileFormStyle = 'card-outline-success';
        this.blockAttachFileIfInProcess = false;
        this.blockAttachFileIfInProcessClass = '';
        this.showResultsHide = true;
        this.showResultsButtonHide = true;
        this.progressMax = 0;
        this.progressCurrent = 0;
        this.progressHide = true;
    }
    CoinManagementComponent.prototype.ngOnInit = function () {
        this.buildForms();
        this.loadData();
    };
    CoinManagementComponent.prototype.buildForms = function () {
        this.replenishForm = new FormGroup({
            amount: new FormControl('', [
                Validators.required,
                Validators.pattern('\\d+')
            ])
        });
        this.replenishFormStyles = new FormValidationStyles(this.replenishForm);
        this.withdrawForm = new FormGroup({
            merchant: new FormControl('', Validators.required)
        });
        this.transferForm = new FormGroup({
            account: new FormControl('', Validators.required),
            amount: new FormControl('', [
                Validators.required,
                Validators.pattern('\\d+')
            ])
        });
        this.transferFormStyles = new FormValidationStyles(this.transferForm);
    };
    CoinManagementComponent.prototype.loadData = function () {
        var _this = this;
        this.coinService.getAccountsByType(REGULAR)
            .flatMap(function (accounts) {
            _this.regularAccounts = accounts;
            _this.accountsAmount = _this.regularAccounts.reduce(function (prev, curr) { return prev + curr.amount; }, 0);
            _this.transferForm.get('account').patchValue(_this.regularAccounts[0], { onlySelf: true });
            return _this.coinService.getAccountsByType(MERCHANT);
        })
            .flatMap(function (accounts) {
            _this.merchantAccounts = accounts;
            _this.merchantsAmount = _this.merchantAccounts.reduce(function (prev, curr) { return prev + curr.amount; }, 0);
            _this.withdrawForm.get('merchant').patchValue(_this.merchantAccounts[0]);
            return _this.coinService.getTreasuryAmount();
        })
            .subscribe(function (amountDto) {
            _this.treasuryAmount = amountDto.amount;
        }, function (error) { return _this.notificationService.error('Error', 'Error appeared during loading data from coins server'); });
        this.coinService.getProductsPrice()
            .subscribe(function (amountDto) { return _this.productsPrice = amountDto.amount; }, function (error) { return _this.notificationService.error('Error', 'Error appeared during load products amount'); });
    };
    CoinManagementComponent.prototype.isFormValid = function (form) {
        return !!(form.valid && !form.pristine);
    };
    CoinManagementComponent.prototype.replenishAccounts = function () {
        var _this = this;
        var replenishAmount = this.replenishForm.value['amount'];
        this.coinService.getTreasuryAmount()
            .flatMap(function (amountDto) {
            _this.treasuryAmount = amountDto.amount;
            if (amountDto.amount < replenishAmount) {
                return Observable.throw({ message: 'Not enough coins in treasury' });
            }
            else {
                return _this.coinService.replenishAccounts(replenishAmount);
            }
        })
            .subscribe(function () { return null; }, function (error) {
            if (error && error.message) {
                _this.notificationService.error('Error', error.message);
            }
            else {
                _this.notificationService.error('Error', 'Error appeared during replenish accounts');
            }
        }, function () {
            _this.notificationService.success('Success', 'Accounts has been replenished successfully.');
            _this.loadData();
        });
        this.replenishForm.reset({ amount: '' });
    };
    CoinManagementComponent.prototype.withdrawToTreasury = function () {
        var _this = this;
        var merchantAccount = this.withdrawForm.value['merchant'];
        if (merchantAccount.amount == 0) {
            this.notificationService.error('Error', "Not enough coins in " + merchantAccount.fullName);
        }
        else {
            this.coinService.withdrawToTreasury(merchantAccount)
                .subscribe(function (transaction) {
                if (transaction.status.toLowerCase() == 'success') {
                    _this.notificationService.success('Success', "Money from " + merchantAccount.fullName + " has been withdrawn successfully");
                    _this.loadData();
                }
                else {
                    var msg = 'Error happened in transaction';
                    if (transaction && transaction.error && transaction.error.length > 0) {
                        msg = transaction.error;
                    }
                    _this.notificationService.error('Error', msg);
                }
            }, function (error) { return _this.notificationService.error('Error', 'Error appeared during withdrawal'); });
        }
        this.withdrawForm.reset({ merchant: this.merchantAccounts[0] });
    };
    CoinManagementComponent.prototype.transferToAccount = function () {
        var _this = this;
        var transferAmount = this.transferForm.value['amount'];
        var transferDto = this.transferForm.value;
        this.coinService.getTreasuryAmount()
            .flatMap(function (amountDto) {
            _this.treasuryAmount = amountDto.amount;
            if (_this.treasuryAmount < transferAmount) {
                return Observable.throw({ message: 'Not enough coins in treasury' });
            }
            else {
                return _this.coinService.transferToAccount(transferDto);
            }
        })
            .subscribe(function (transaction) {
            if (transaction.status.toLowerCase() == 'success') {
                _this.notificationService.success('Success', 'Money has been transferred successfully');
                _this.loadData();
            }
            else {
                var msg = 'Error happened in transaction';
                if (transaction && transaction.error && transaction.error.length > 0) {
                    msg = transaction.error;
                }
                _this.notificationService.error('Error', msg);
            }
        }, function (error) {
            if (error && error.message && error.message.length > 0) {
                _this.notificationService.error('Error', error.message);
            }
            else {
                _this.notificationService.error('Error', 'Error appeared during money transferring');
            }
        });
        this.transferForm.reset({
            account: this.regularAccounts[0],
            amount: ''
        });
    };
    CoinManagementComponent.prototype.transferToAccounts = function () {
        var _this = this;
        // Block Attach file button
        this.blockAttachFileIfInProcess = true;
        this.blockAttachFileIfInProcessClass = 'disabled';
        //create form to send file
        var uploadFormData = new FormData();
        uploadFormData.append('file', this.transferFile, this.transferFile.name);
        // send form with file inside the form
        this.coinService.transferToAccounts(uploadFormData).subscribe(function (response) {
            _this.transferFileButtonDisabled = true;
            _this.progressHide = false;
            _this.transferFile = null;
            _this.fileName = '';
            _this.notificationService.success('Success', 'Accounts charging task is in progress!');
            // checking progress on server
            var subscription = _this.coinService.checkProcessing(response.checkHash).subscribe(function (response) {
                _this.progressMax = response.total;
                _this.progressCurrent = response.isDone;
                _this.progressValue = (_this.progressCurrent / _this.progressMax * 100).toFixed(2);
                // if all was done unsubscribe and show results
                if (response.isDone == response.total) {
                    _this.progressHide = true;
                    _this.transactions = response.transactions;
                    _this.showResultsButtonHide = false;
                    // Unblock Attach file button
                    _this.blockAttachFileIfInProcess = false;
                    _this.blockAttachFileIfInProcessClass = '';
                    _this.notificationService.success('Success', 'Accounts charging task has finished successfully!');
                    subscription.unsubscribe();
                }
            }, function (error) {
                try {
                    var errorDetail = error.json();
                    if (!errorDetail.detail)
                        //noinspection ExceptionCaughtLocallyJS
                        throw errorDetail;
                    _this.progressHide = true;
                    // Unblock Attach file button
                    _this.blockAttachFileIfInProcess = false;
                    _this.blockAttachFileIfInProcessClass = '';
                    _this.notificationService.error('Error', errorDetail.detail);
                }
                catch (err) {
                    console.log(err);
                    _this.progressHide = true;
                    // Unblock Attach file button
                    _this.blockAttachFileIfInProcess = false;
                    _this.blockAttachFileIfInProcessClass = '';
                    _this.notificationService.error('Error', 'Error appeared, watch logs!');
                }
            });
        }, function (error) {
            try {
                // Unblock Attach file button
                _this.blockAttachFileIfInProcess = false;
                var errorDetail = error.json();
                if (!errorDetail.detail)
                    //noinspection ExceptionCaughtLocallyJS
                    throw errorDetail;
                _this.notificationService.error('Error', errorDetail.detail);
            }
            catch (err) {
                console.log(err);
                // Unblock Attach file button
                _this.blockAttachFileIfInProcess = false;
                _this.blockAttachFileIfInProcessClass = '';
                _this.notificationService.error('Error', 'Error appeared, watch logs!');
            }
            // Unblock Attach file button
            _this.blockAttachFileIfInProcess = false;
            _this.blockAttachFileIfInProcessClass = '';
            _this.transferFile = null;
            _this.fileName = '';
        });
    };
    CoinManagementComponent.prototype.showResults = function () {
        this.showResultsHide = !this.showResultsHide;
    };
    // download template file from server
    CoinManagementComponent.prototype.getTemplate = function () {
        var reader = new FileReader();
        this.coinService.getTemplate().subscribe(function (response) {
            reader.readAsDataURL(response);
            reader.onloadend = function () {
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.setAttribute("style", "display: none");
                a.href = reader.result;
                a.target = '_blank';
                a.download = 'template.csv';
                a.click();
                document.body.removeChild(a);
            };
        });
    };
    // upload file
    CoinManagementComponent.prototype.handleInputChange = function (e) {
        var _this = this;
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        var pattern = /(text\/csv)|(application\/vnd.ms-excel)/;
        var reader = new FileReader();
        // check pattern
        if (!file.type.match(pattern)) {
            this.notificationService.error('Error', 'This file format not supported!');
            this.transferFileFormStyle = 'card-outline-danger';
        }
        else {
            // do actions after file loading
            reader.onloadend = function () {
                _this.transferFile = file;
                e.target.value = null;
                _this.fileName = file.name;
                _this.transferFileButtonDisabled = false;
                _this.transferFileFormStyle = 'card-outline-success';
                _this.notificationService.success('Success', 'File was loaded successfully!');
            };
            reader.onerror = function () {
                _this.transferFileFormStyle = 'card-outline-danger';
                _this.notificationService.error('Error', 'File was not loaded, file may contain mistakes!');
            };
            // read file
            reader.readAsDataURL(file);
        }
    };
    CoinManagementComponent = __decorate([
        Component({
            selector: 'app-coin-management',
            templateUrl: './coin-management.component.html',
            styleUrls: ['./coin-management.component.scss']
        }), 
        __metadata('design:paramtypes', [CoinService, NotificationsService])
    ], CoinManagementComponent);
    return CoinManagementComponent;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/coin-management/coin-management.component.js.map