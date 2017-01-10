import {
  Component,
  OnInit
} from "@angular/core";
import {
  CoinsAccount,
  REGULAR,
  MERCHANT
} from "./coins-account";
import {CoinService} from "../shared/services/coin.service";
import {NotificationsService} from "angular2-notifications";
import {
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import {FormValidationStyles} from "../shared/form-validation-styles";
import {AmountDto} from "./amount-dto";
import {Observable} from "rxjs";
import {ResultDTO} from "./result-dto";
import {CheckDTO} from "./check-dto";
import {ErrorDetail} from "../shared/entity/error-detail";
import {Transaction} from "./transaction";

@Component({
  selector: 'app-coin-management',
  templateUrl: './coin-management.component.html',
  styleUrls: ['./coin-management.component.scss']
})
export class CoinManagementComponent implements OnInit {
  treasuryAmount: number;
  productsPrice: number;
  merchantsAmount: number;
  accountsAmount: number;
  fileName: string = '';
  transferFile: File;
  transferFileButtonDisabled: boolean = true;
  transferFileFormStyle: string = 'card-outline-success';
  blockAttachFileIfInProcess: boolean = false;
  blockAttachFileIfInProcessClass: string = '';
  showResultsHide: boolean = true;
  showResultsButtonHide: boolean = true;
  transactions: Transaction[];
  progressValue: string;
  progressMax: number = 0;
  progressCurrent: number = 0;
  progressHide: boolean = true;

  regularAccounts: CoinsAccount[];
  merchantAccounts: CoinsAccount[];

  replenishForm: FormGroup;
  withdrawForm: FormGroup;
  transferForm: FormGroup;

  replenishFormStyles: FormValidationStyles;
  transferFormStyles: FormValidationStyles;

  constructor(private coinService: CoinService,
              private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.buildForms();
    this.loadData();
  }

  private buildForms(): void {
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
  }

  private loadData(): void {
    this.coinService.getAccountsByType(REGULAR)
      .flatMap(accounts => {
        this.regularAccounts = accounts;
        this.accountsAmount = this.regularAccounts.reduce((prev, curr) => prev + curr.amount, 0);
        this.transferForm.get('account').patchValue(this.regularAccounts[0], {onlySelf: true});

        return this.coinService.getAccountsByType(MERCHANT);
      })
      .flatMap(accounts => {
        this.merchantAccounts = accounts;
        this.merchantsAmount = this.merchantAccounts.reduce((prev, curr) => prev + curr.amount, 0);
        this.withdrawForm.get('merchant').patchValue(this.merchantAccounts[0]);

        return this.coinService.getTreasuryAmount();
      })
      .subscribe(
        (amountDto: AmountDto) => {
          this.treasuryAmount = amountDto.amount;
        },
        error => this.notificationService.error('Error', 'Error appeared during loading data from coins server')
      );

    this.coinService.getProductsPrice()
      .subscribe(
        amountDto => this.productsPrice = amountDto.amount,
        error => this.notificationService.error('Error', 'Error appeared during load products amount')
      );
  }

  public isFormValid(form: FormGroup): boolean {
    return !!(form.valid && !form.pristine);
  }

  replenishAccounts(): void {
    let replenishAmount = this.replenishForm.value['amount'];

    this.coinService.getTreasuryAmount()
      .flatMap(
        amountDto => {
          this.treasuryAmount = amountDto.amount;

          if (amountDto.amount < replenishAmount) {
            return Observable.throw({message: 'Not enough coins in treasury'});
          } else {
            return this.coinService.replenishAccounts(replenishAmount);
          }
        })
      .subscribe(
        () => null,
        error => {
          if (error && error.message) {
            this.notificationService.error('Error', error.message);
          } else {
            this.notificationService.error('Error', 'Error appeared during replenish accounts');
          }
        },
        () => {
          this.notificationService.success('Success', 'Accounts has been replenished successfully.');
          this.loadData();
        }
      );

    this.replenishForm.reset({amount: ''});
  }

  withdrawToTreasury() {
    let merchantAccount: CoinsAccount = this.withdrawForm.value['merchant'];

    if (merchantAccount.amount == 0) {
      this.notificationService.error('Error', `Not enough coins in ${merchantAccount.fullName}`)
    } else {
      this.coinService.withdrawToTreasury(merchantAccount)
        .subscribe(
          transaction => {
            if (transaction.status.toLowerCase() == 'success') {
              this.notificationService.success(
                'Success', `Money from ${merchantAccount.fullName} has been withdrawn successfully`
              );
              this.loadData();
            } else {
              let msg = 'Error happened in transaction';

              if (transaction && transaction.error && transaction.error.length > 0) {
                msg = transaction.error
              }

              this.notificationService.error('Error', msg);
            }
          },
          error => this.notificationService.error('Error', 'Error appeared during withdrawal')
        );
    }

    this.withdrawForm.reset({merchant: this.merchantAccounts[0]});
  }

  transferToAccount(): void {
    let transferAmount = this.transferForm.value['amount'];
    let transferDto = this.transferForm.value;

    this.coinService.getTreasuryAmount()
      .flatMap(
        amountDto => {
          this.treasuryAmount = amountDto.amount;

          if (this.treasuryAmount < transferAmount) {
            return Observable.throw({message: 'Not enough coins in treasury'});
          } else {
            return this.coinService.transferToAccount(transferDto);
          }
        })
      .subscribe(
        transaction => {
          if (transaction.status.toLowerCase() == 'success') {
            this.notificationService.success('Success', 'Money has been transferred successfully');
            this.loadData();
          } else {
            let msg = 'Error happened in transaction';

            if (transaction && transaction.error && transaction.error.length > 0) {
              msg = transaction.error
            }

            this.notificationService.error('Error', msg);
          }
        },
        error => {
          if (error && error.message && error.message.length > 0) {
            this.notificationService.error('Error', error.message);
          } else {
            this.notificationService.error('Error', 'Error appeared during money transferring');
          }
        }
      );

    this.transferForm.reset({
      account: this.regularAccounts[0],
      amount: ''
    });
  }

  transferToAccounts(): void {
    // Block Attach file button
    this.blockAttachFileIfInProcess = true;
    this.blockAttachFileIfInProcessClass = 'disabled';
    //create form to send file
    let uploadFormData = new FormData();
    uploadFormData.append('file', this.transferFile, this.transferFile.name);
    // send form with file inside the form
    this.coinService.transferToAccounts(uploadFormData).subscribe((response: ResultDTO) => {
        this.transferFileButtonDisabled = true;
        this.progressHide = false;
        this.transferFile = null;
        this.fileName = '';
        this.notificationService.success('Success', 'Accounts charging task is in progress!');
        // checking progress on server
        let subscription = this.coinService.checkProcessing(response.checkHash).subscribe((response: CheckDTO) => {
          this.progressMax = response.total;
          this.progressCurrent = response.isDone;
          this.progressValue = (this.progressCurrent / this.progressMax * 100).toFixed(2);
          // if all was done unsubscribe and show results
          if (response.isDone == response.total) {
            this.progressHide = true;
            this.transactions = response.transactions;
            this.showResultsButtonHide = false;
            // Unblock Attach file button
            this.blockAttachFileIfInProcess = false;
            this.blockAttachFileIfInProcessClass = '';
            this.notificationService.success('Success', 'Accounts charging task has finished successfully!');
            subscription.unsubscribe();
          }
        }, error => {
          try {
            let errorDetail = <ErrorDetail> error.json();
            if (!errorDetail.detail)
            //noinspection ExceptionCaughtLocallyJS
              throw errorDetail;
            this.progressHide = true;
            // Unblock Attach file button
            this.blockAttachFileIfInProcess = false;
            this.blockAttachFileIfInProcessClass = '';
            this.notificationService.error('Error', errorDetail.detail);
          } catch (err) {
            console.log(err);
            this.progressHide = true;
            // Unblock Attach file button
            this.blockAttachFileIfInProcess = false;
            this.blockAttachFileIfInProcessClass = '';
            this.notificationService.error('Error', 'Error appeared, watch logs!');
          }
        });
      },
      error => {
        try {
          // Unblock Attach file button
          this.blockAttachFileIfInProcess = false;
          let errorDetail = <ErrorDetail> error.json();
          if (!errorDetail.detail)
          //noinspection ExceptionCaughtLocallyJS
            throw errorDetail;
          this.notificationService.error('Error', errorDetail.detail);
        } catch (err) {
          console.log(err);
          // Unblock Attach file button
          this.blockAttachFileIfInProcess = false;
          this.blockAttachFileIfInProcessClass = '';
          this.notificationService.error('Error', 'Error appeared, watch logs!');
        }
        // Unblock Attach file button
        this.blockAttachFileIfInProcess = false;
        this.blockAttachFileIfInProcessClass = '';
        this.transferFile = null;
        this.fileName = '';
      });
  }

  public showResults() {
    this.showResultsHide = !this.showResultsHide;
  }

  // download template file from server
  public getTemplate(): void {
    let reader = new FileReader();
    this.coinService.getTemplate().subscribe(response => {
      reader.readAsDataURL(response);
      reader.onloadend = () => {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display: none");
        a.href = reader.result;
        a.target = '_blank';
        a.download = 'template.csv';
        a.click();
        document.body.removeChild(a);
      }
    });
  }

  // upload file
  public handleInputChange(e) {
    let file: File = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    let pattern = /(text\/csv)|(application\/vnd.ms-excel)/;
    let reader = new FileReader();
    // check pattern
    if (!file.type.match(pattern)) {
      this.notificationService.error('Error', 'This file format not supported!');
      this.transferFileFormStyle = 'card-outline-danger';
    } else {
      // do actions after file loading
      reader.onloadend = () => {
        this.transferFile = file;
        e.target.value = null;
        this.fileName = file.name;
        this.transferFileButtonDisabled = false;
        this.transferFileFormStyle = 'card-outline-success';
        this.notificationService.success('Success', 'File was loaded successfully!')
      };
      reader.onerror = () => {
        this.transferFileFormStyle = 'card-outline-danger';
        this.notificationService.error('Error', 'File was not loaded, file may contain mistakes!')
      };
      // read file
      reader.readAsDataURL(file);
    }
  }

}
