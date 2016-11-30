import {
  Component,
  OnInit,
  style,
  state,
  animate,
  transition,
  trigger,
  Renderer,
  AfterContentInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import { MachineService } from "../../shared/services/machine.service";
import { Machine, Field } from "../shared/machine";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../../shared/services/product.service";
import { Product } from "../../shared/entity/product";
import { NotificationsService } from "angular2-notifications";
import { AppProperties } from "../../shared/app.properties";
import { FormValidationStyles } from "../../shared/form-validation-styles";
import { BrowserDomAdapter } from "@angular/platform-browser/src/browser/browser_adapter";
import { ErrorDetail } from "../../shared/entity/error-detail";

@Component({
  selector: 'fill-machine',
  templateUrl: './fill-machine.component.html',
  styleUrls: ['./fill-machine.component.scss'],
  animations: [
    trigger('showHideForm', [
      state('inactive', style({display: 'none', opacity: 0})),
      state('active', style({display: 'block', opacity: 1})),
      transition('inactive => active', animate('300ms ease-in')),
      transition('active => inactive', animate('300ms ease-out')),
    ]),
    trigger('selectDeselectCard', [
      state('inactive', style({
        '-webkit-box-shadow': '0px 0px 0px 0px rgba(5,168,255,1)',
        '-moz-box-shadow': '0px 0px 0px 0px rgba(5,168,255,1)',
        'box-shadow': '0px 0px 0px 0px rgba(5,168,255,1)'
      })),
      state('active', style({
        '-webkit-box-shadow': '0px 0px 25px 5px rgba(5,168,255,1)',
        '-moz-box-shadow': '0px 0px 25px 5px rgba(5,168,255,1)',
        'box-shadow': '0px 0px 25px 5px rgba(5,168,255,1)'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out')),
    ])
  ]
})
export class FillMachineComponent implements OnInit, AfterContentInit {
  private cellFormState = 'inactive';
  private selectedField: Field = null;
  private selectedRowId = -1;
  machine: Machine;
  products: Product[];
  form: FormGroup;
  formStyles: FormValidationStyles;
  changedFields: Field[] = [];
  @ViewChild('cellForm') cellFormElement: ElementRef;
  domAdapter = new BrowserDomAdapter();

  constructor(private machineService: MachineService,
              private productService: ProductService,
              private route: ActivatedRoute,
              private notificationService: NotificationsService,
              private renderer: Renderer,
              private hostElement: ElementRef) {
  }

  ngOnInit() {
    let id = parseInt(this.route.snapshot.params['id']);

    this.machineService.findOne(id).subscribe(
      machine => {
        this.machine = machine;
        this.form.addControl('count', new FormControl(3, [
          Validators.required,
          Validators.pattern('^[1-9]$|^[1][0-9]{1}$')
        ]))
      },
      error => {
        try {
          let errorDetail = <ErrorDetail> error.json();
          if (!errorDetail.detail)
          //noinspection ExceptionCaughtLocallyJS
            throw errorDetail;
          this.notificationService.error('Error', errorDetail.detail);
        } catch (err) {
          console.log(err);
          this.notificationService.error('Error', 'Error appeared, watch logs!');
        }
      }
    );

    this.productService.findAll().subscribe(
      products => {
        this.products = products;
      },
      error => {
        try {
          let errorDetail = <ErrorDetail> error.json();
          if (!errorDetail.detail)
          //noinspection ExceptionCaughtLocallyJS
            throw errorDetail;
          this.notificationService.error('Error', errorDetail.detail);
        } catch (err) {
          console.log(err);
          this.notificationService.error('Error', 'Error appeared, watch logs!');
        }
      }
    );

    this.form = new FormGroup({
      fieldInternalId: new FormControl('', Validators.required),
      product: new FormControl('', Validators.required),
      count: new FormControl('3')
    });
  }

  ngAfterContentInit(): void {
  }

  toggleState(field: Field, rowId: number): void {
    this.selectedField = field;
    this.selectedRowId = rowId;
    this.cellFormState = 'active';
    this.form.get('fieldInternalId').patchValue(field.internalId, {onlySelf: true});

    let productControl = this.form.get('product');
    let countControl = this.form.get('count');

    if (field.product != null) {
      let product = this.products.find(product => product.id === field.product.id);
      productControl.patchValue(product);
      countControl.patchValue(field.count);
    } else {
      productControl.patchValue('');
      countControl.patchValue('');
    }

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();

    let rowElem: Element = this.renderer.selectRootElement('#row' + rowId);

    if (rowElem.ownerDocument.body.clientWidth < 768) {
      let cellElement = this.domAdapter.querySelector(this.hostElement.nativeElement, '#cell' + field.internalId);

      this.renderer.attachViewAfter(cellElement, [this.cellFormElement.nativeElement])
    } else {
      this.renderer.attachViewAfter(rowElem, [this.cellFormElement.nativeElement]);
    }
  }

  applyCellFormState(rowId: number): string {
    if (this.selectedField != null) {
      return 'active';
    } else {
      return 'inactive';
    }
  }

  applyCardState(cardId: string): string {
    if (this.selectedField && cardId === this.selectedField.internalId && this.cellFormState === 'active') {
      return 'active';
    } else {
      return 'inactive';
    }
  }

  submit(): void {
    let fieldInternalId = this.form.get('fieldInternalId').value;
    let field = this.selectedField;
    field.internalId = fieldInternalId;
    field.product = this.form.get('product').value;
    field.count = this.form.get('count').value;
    this.changedFields.push(field);

    this.cancel();
  }

  clearCell() {
    let fieldInternalId = this.form.get('fieldInternalId').value;
    let field = this.selectedField;
    field.internalId = fieldInternalId;
    field.product = null;
    field.count = 0;

    this.form.patchValue(
      {
        field: field.internalId,
        product: '',
        count: ''
      }
    );

    let changedField = this.changedFields.find(f => f.id === field.id);

    if (changedField) {
      changedField = field;
    } else {
      this.changedFields.push(field);
    }
  }

  cancel(): void {
    this.selectedRowId = -1;
    this.selectedField = null;
    this.cellFormState = 'inactive';
    this.form.reset();
  }

  createImageUrl(product: Product): string {
    return `${AppProperties.API_VENDING_ENDPOINT}/${product.imageUrl}`;
  }

  isClearCellDisabled() {
    return (this.selectedField && this.selectedField.product == null);
  }

  isFormValid() {
    return !!(this.form.valid && !this.form.pristine);
  }

  applyChanges(): void {
    this.machineService.fillMachine(this.machine)
      .subscribe(
        machine => {
          this.changedFields = [];
          this.machine = machine;
          this.notificationService.success('Success', 'Machine filled successfully');
        },
        error => {
          try {
            let errorDetail = <ErrorDetail> error.json();
            if (!errorDetail.detail)
            //noinspection ExceptionCaughtLocallyJS
              throw errorDetail;
            this.notificationService.error('Error', errorDetail.detail);
          } catch (err) {
            console.log(err);
            this.notificationService.error('Error', 'Error appeared, watch logs!');
          } finally {
            this.clearCell();
          }
        }
      );
  }

  setClassIfProductAbsent(field: Field): string {
    if (field && field.product == null) {
      return " card-icon-centered";
    } else {
      return "";
    }
  }
}
