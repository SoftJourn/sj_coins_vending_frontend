import {
  AfterContentInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from "@angular/core";
import {MachineService} from "../../shared/services/machine.service";
import {
  Field,
  Machine
} from "../shared/machine";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../shared/services/product.service";
import {Product} from "../../shared/entity/product";
import {NotificationsService} from "angular2-notifications";
import {AppProperties} from "../../shared/app.properties";
import {FormValidationStyles} from "../../shared/form-validation-styles";
import {ErrorDetail} from "../../shared/entity/error-detail";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import {MachineRowDirective} from "../../shared/directives/machine-row.directive";
import {MachineCellDirective} from "../../shared/directives/machine-cell.directive";

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
  private selectedRowId = -1;

  selectedField: Field = null;
  machine: Machine;
  oldMachineState: Machine;
  products: Product[];
  form: FormGroup;
  formStyles: FormValidationStyles;
  changedFields: Field[] = [];
  @ViewChild('cellForm') cellFormElement: ElementRef;
  @ViewChildren(MachineRowDirective) machineRows: QueryList<MachineRowDirective>;
  @ViewChildren(MachineCellDirective) machineCells: QueryList<MachineCellDirective>;

  constructor(private machineService: MachineService,
              private productService: ProductService,
              private route: ActivatedRoute,
              private notificationService: NotificationsService,
              private renderer: Renderer2) {
  }

  ngOnInit() {
    let id = parseInt(this.route.snapshot.params['id']);

    this.machineService.findOne(id).subscribe(
      machine => {
        this.machine = machine;
        this.oldMachineState = machine;
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
        this.products = products.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
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
      count: new FormControl('', [
        Validators.required,
        this.minValue(0),
        Validators.pattern('^[1-9]\\d*')
      ])
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
      this.updateFormValidator(field);
    } else {
      productControl.patchValue('');
      countControl.patchValue('');
    }

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();

    let rowElem: Element = this.machineRows.find(mr => mr.rowId == rowId).getElement();

    if (rowElem.ownerDocument.body.clientWidth < 768) {
      let cellElement: Element = this.machineCells.find(cell => cell.cellId == field.internalId).getElement();

      this.renderer.insertBefore(cellElement.parentNode, this.cellFormElement.nativeElement, cellElement.nextSibling);
    } else {
      this.renderer.appendChild(rowElem, this.cellFormElement.nativeElement);
    }
  }

  applyCellFormState(): string {
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
          this.oldMachineState = machine;
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

  updateFormValidator(field: Field): void {
    let oldFieldState = null;

    this.oldMachineState.rows.forEach(row => {
      row.fields.forEach(oldField => {
        if (oldField.id == field.id) {
          oldFieldState = oldField;
        }
      });
    });

    this.form.get('count').setValidators([
      Validators.required,
      this.minValue(oldFieldState.count),
      Validators.pattern('^[1-9]\\d*')
    ]);
  }

  setClassIfProductAbsent(field: Field): string {
    if (field && field.product == null) {
      return " card-icon-centered";
    } else {
      return "";
    }
  }

  minValue(min: Number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const input = control.value,
        isValid = input <= min;
      if(isValid)
        return { 'minValue': {min: min} }
      else
        return null;
    };
  }
}
