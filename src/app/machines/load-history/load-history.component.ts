import {
  Component,
  OnInit,
  HostListener
} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MachineService} from "../../shared/services/machine.service";
import {LoadHistoryRequest} from "../../shared/dto/load-history-request";
import {Pageable} from "../../shared/entity/pageable";
import {LoadHistory} from "../../shared/entity/load-history";
import {Page} from "../../shared/entity/page";
import {Sort} from "../../shared/entity/sort";
import {
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import {NotificationsService} from "angular2-notifications";
import {ErrorDetail} from "../../shared/entity/error-detail";
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-load-history',
  templateUrl: 'load-history.component.html',
  styleUrls: ['load-history.component.scss']
})
export class LoadHistoryComponent implements OnInit {

  hideFilter: boolean = true;
  page: Page<LoadHistory>;
  pageForm: FormGroup;
  filterForm: FormGroup;
  sorts: Sort[];
  loadRequest: LoadHistoryRequest;

  isStartOpen: boolean;
  isDueOpen: boolean;
  start: string = '';
  due: string = '';

  pageSize: number = 10;
  pageItems: number = 5;
  pageDirectionLinks: boolean = true;
  pageItemsSize: string = '';

  constructor(private route: ActivatedRoute,
              private machineService: MachineService,
              private notificationService: NotificationsService) {

  }

  ngOnInit() {
    let id = parseInt(this.route.snapshot.params['id']);

    this.buildPageSizeForm();
    this.addFilter();

    this.loadRequest = new LoadHistoryRequest(id, null, null, new Pageable([]));
    this.sorts = new Array<Sort>();
    this.sorts.push(new Sort("DESC", "dateAdded"));
    this.loadRequest.pageable.sort = this.sorts;

    this.fetch(1, 10);
  }

  /**
   * Method submits current filter
   */
  onSubmit(): void {
    this.loadRequest.start = new Date(this.start).toISOString();
    this.loadRequest.due = new Date(this.due).toISOString();
    this.fetch(1, this.pageSize);
  }

  /**
   * Method cancels current filter and make request using default filter's data
   */
  onCancel(): void {
    this.start = '';
    this.due = '';
    this.loadRequest.start = null;
    this.loadRequest.due = null;
    this.addFilter();
    this.fetch(1, this.pageSize);
  }

  /**
   * Method prepares and create paging form
   */
  private buildPageSizeForm(): void {
    this.pageForm = new FormGroup({
      pageSize: new FormControl('10')
    });
    if (window.innerWidth <= 800) {
      this.pageItems = 3;
      this.pageItemsSize = 'sm';
      this.pageDirectionLinks = true;
    }
    this.pageForm.get('pageSize').valueChanges.subscribe(change => {
      this.pageSize = change;
      this.fetch(1, this.pageSize);
    });
  }

  /**
   * Method changes page number and makes request to get load history
   * @param number
   */
  changePage(number: number): void {
    this.fetch(number, this.pageSize);
  }

  /**
   * Method changes page form depends on window size
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth > 800) {
      this.pageItems = 5;
      this.pageItemsSize = '';
      this.pageDirectionLinks = true;
    }
  }

  /**
   * Method show and hides history filter
   */
  showFilter(): void {
    this.hideFilter = !this.hideFilter;
  }

  /**
   * Method adds new item to filter
   */
  addFilter(): void {
    this.filterForm = new FormGroup({
      start: new FormControl('', Validators.required),
      due: new FormControl('', Validators.required)
    });
  }

  openDatepicker(picker: string) {
    this[picker] = true;
    setTimeout(() => {
      this[picker] = false;
    }, 1000);
  }

  dateTimeSelected(field: string, result): void {
    this[field] = result["value"];
    this.filterForm.get(field).patchValue(result["value"]);
  }

  /**
   * Method makes request to get load history, using filter data
   *
   * @param page
   * @param size
   */
  fetch(page: number, size: number): void {
    this.loadRequest.pageable.page = page - 1;
    this.loadRequest.pageable.size = size;
    try {
      this.machineService.getLoads(this.loadRequest).subscribe(response => {
        this.page = response;
      });
    } catch (error) {
      this.notificationService.error("Error", "Something went wrong, watch logs!");
    }
  }

  /**
   * Method makes request to get excel file of load history, using filter's state
   */
  report(): void {
    try {
      this.loadRequest.pageable.page = 0;
      this.loadRequest.pageable.size = 2147483647;
      this.machineService.getLoadsReport(this.loadRequest).subscribe((response: Blob) => {
        fileSaver.saveAs(response, "Load history.xls");
      }, (error: ErrorDetail) => {
        this.notificationService.error("Error", error.detail);
      });
    } catch (error) {
      this.notificationService.error("Error", "Something went wrong, watch logs!");
    }
  }

}
