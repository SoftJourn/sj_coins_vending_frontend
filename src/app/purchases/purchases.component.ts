import {Component, OnInit} from "@angular/core";
import {Purchase} from "../shared/entity/purchase";
import {PurchaseService} from "../shared/services/purchase.service";
import {Machine} from "../machines/shared/machine";
import {MachineService} from "../shared/services/machine.service";
import {NgbDateParserFormatter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup} from "@angular/forms";
import {PurchaseFilter} from "../purchases/shared/purchase-filter";
import {PurchasePage} from "./shared/purchase-page";
import {ErrorDetail} from "../shared/entity/error-detail";
import {Response} from "@angular/http";
import {NotificationsService} from "angular2-notifications/lib/notifications.service";


@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {
  public page: PurchasePage = new PurchasePage();
  public purchases: Purchase[];
  public machines: Machine[];

  form: FormGroup;
  pageForm: FormGroup;
  hideFilter: boolean = true;
  hideStartDue: boolean = true;

  pageSize: number = 10;

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  constructor(private purchaseService: PurchaseService,
              private machineService: MachineService,
              private parser: NgbDateParserFormatter,
              private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.buildForm();
    this.buildPageSizeForm();
    let filter = this.toPurchaseFilter(this.form);
    this.purchaseService.findAllByFilter(filter, 1, this.pageSize)
      .subscribe(page => {
        this.page = page;
        this.purchases = this.page.content;
        this.machineService.findAll().subscribe(machines => {
          this.machines = machines;
        })
      }, (error: Response) => {
        var errorDetail: ErrorDetail = error.json();
        this.notificationService.error('Error', errorDetail.detail);
      });

    this.form.get('type').valueChanges.subscribe(change => {
        if (change === 'Start-Due') {
          this.showStartDue();
        }
        else {
          this.toHideStartDue();
          this.form.get('start').patchValue('');
          this.form.get('due').patchValue('');
        }
      }
    );

    this.pageForm.get('pageSize').valueChanges.subscribe(change => {
      this.pageSize = change;
      this.fetch(1, this.pageSize);
    });

  }

  private buildForm(): void {
    this.form = new FormGroup({
      machine: new FormControl('-1'),
      type: new FormControl('Any'),
      start: new FormControl(''),
      due: new FormControl('')
    });
  }

  private buildPageSizeForm(): void {
    this.pageForm = new FormGroup({
      pageSize: new FormControl('10')
    });
  }

  showFilter() {
    this.hideFilter = !this.hideFilter;
  }

  showStartDue() {
    this.hideStartDue = false;
  }

  toHideStartDue() {
    this.hideStartDue = true;
  }

  onSubmit(): void {
    this.fetch(1, this.pageSize);
  }

  onCancel(): void {
    this.form.get('machine').patchValue('-1');
    this.form.get('type').patchValue('Any');
    this.form.get('start').patchValue('');
    this.form.get('due').patchValue('');
    this.fetch(1, this.pageSize);
    this.showFilter();
  }

  toPurchaseFilter(form: FormGroup): PurchaseFilter {
    let filter = new PurchaseFilter();
    filter.machineId = form.get('machine').value;
    filter.type = form.get('type').value;
    filter.start = this.parser.format(form.get('start').value);
    filter.due = this.parser.format(form.get('due').value);
    return filter;
  }

  changePage($event) {
    this.fetch($event, this.pageSize);
  }

  changeStart($event) {
    this.minDate = $event;
  }

  changeDue($event) {
    this.maxDate = $event;
  }

  fetch(page: number, size: number): void {
    let filter = this.toPurchaseFilter(this.form);
    this.purchaseService.findAllByFilter(filter, page, size)
      .subscribe(page => {
        this.page = page;
        this.purchases = this.page.content;
      }, (error: Response) => {
        var errorDetail: ErrorDetail = error.json();
        this.notificationService.error('Error', errorDetail.detail);
      });
  }

}
