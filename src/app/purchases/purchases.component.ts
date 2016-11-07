import { Component, OnInit, HostListener } from "@angular/core";
import { Purchase } from "../shared/entity/purchase";
import { PurchaseService } from "../shared/services/purchase.service";
import { Machine } from "../machines/shared/machine";
import { MachineService } from "../shared/services/machine.service";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { FormControl, FormGroup } from "@angular/forms";
import { PurchaseFilter } from "../purchases/shared/purchase-filter";
import { PurchasePage } from "./shared/purchase-page";
import { ErrorDetail } from "../shared/entity/error-detail";
import { Response } from "@angular/http";
import { NotificationsService } from "angular2-notifications/lib/notifications.service";

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {

  // -------------------------------- functional variables --------------------------------
  public page: PurchasePage = new PurchasePage();
  public purchases: Purchase[];
  public machines: Machine[];

  form: FormGroup;
  pageForm: FormGroup;

  // -------------------------------- functional variables --------------------------------
  hideFilter: boolean = true;
  hideStartDue: boolean = true;

  pageSize: number = 10;
  pageItems: number = 5;
  pageDirectionLinks: boolean = true;
  pageItemsSize: string = '';

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  inlineBlock: string;

  contentDefaultSize: string = 'col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6';
  contentFullSize: string = 'col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3';
  changeContentSize: string;

  formDefaultSize: string = 'col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6';
  formFullSize: string = 'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12';
  changeFormSize: string;

  // -------------------------------- init methods --------------------------------

  constructor(private purchaseService: PurchaseService,
              private machineService: MachineService,
              private parser: NgbDateParserFormatter,
              private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.changeFormSize = this.formDefaultSize;
    this.changeContentSize = this.contentDefaultSize;
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
          this.changeFormSize = this.formFullSize;
          this.changeContentSize = this.contentFullSize;
          this.inlineBlock = 'd-inline-block';
          this.showStartDue();
        }
        else {
          this.changeFormSize = this.formDefaultSize;
          this.changeContentSize = this.contentDefaultSize;
          this.inlineBlock = '';
          this.toHideStartDue();
          this.form.get('start').patchValue('');
          this.form.get('due').patchValue('');
          this.minDate = {year: 1900, month: 0, day: 1};
          this.maxDate = {year: 2099, month: 11, day: 31};
        }
      }
    );

    this.pageForm.get('pageSize').valueChanges.subscribe(change => {
      this.pageSize = change;
      this.fetch(1, this.pageSize);
    });

  }

  // -------------------------------- ui methods --------------------------------
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
    if (window.innerWidth < 767) {
      this.pageItems = 3;
      this.pageItemsSize = 'sm';
      this.pageDirectionLinks = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth > 767) {
      this.pageItems = 5;
      this.pageItemsSize = '';
      this.pageDirectionLinks = true;
    }
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


  // -------------------------------- functional methods --------------------------------
  onSubmit(): void {
    if (this.form.get('type').value === 'Start-Due') {
      if (this.form.get('start').value == '' || this.form.get('due').value == '') {
        this.notificationService.error('Error', 'Please set start and due dates');
      } else {
        this.fetch(1, this.pageSize);
      }
    } else {
      this.fetch(1, this.pageSize);
    }
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
    filter.timeZoneOffSet = new Date().getTimezoneOffset();
    filter.start = this.parser.format(form.get('start').value);
    filter.due = this.parser.format(form.get('due').value);
    return filter;
  }

  changePage($event) {
    if (this.form.get('type').value === 'Start-Due') {
      if (this.form.get('start').value == '' || this.form.get('due').value == '') {
        this.notificationService.error('Error', 'Please set start and due dates');
      } else {
        this.fetch($event, this.pageSize);
      }
    } else {
      this.fetch($event, this.pageSize);
    }
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
