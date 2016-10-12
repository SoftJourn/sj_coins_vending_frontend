import { Component, OnInit, style, state, animate, transition, trigger } from "@angular/core";
import { MachineService } from "../../shared/services/machine.service";
import { Machine, Field } from "../shared/machine";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../../shared/services/product.service";
import { Product } from "../../shared/entity/product";
import { NotificationsService } from "angular2-notifications";
import { AppProperties } from "../../shared/app.properties";
import { FormValidationStyles } from "../../shared/form-validation-styles";

@Component({
  selector: 'fill-machine',
  templateUrl: './fill-machine.component.html',
  styleUrls: ['./fill-machine.component.scss'],
  animations: [
    trigger('showHideForm', [
      state('inactive', style({display: 'none', opacity: 0})),
      state('active',   style({display: 'block', opacity: 1})),
      transition('inactive => active', animate('300ms ease-in')),
      transition('active => inactive', animate('300ms ease-out')),
    ]),
    trigger('selectDeselectCard', [
      state('inactive', style({
        '-webkit-box-shadow': '0px 0px 0px 0px rgba(5,168,255,1)',
        '-moz-box-shadow': '0px 0px 0px 0px rgba(5,168,255,1)',
        'box-shadow': '0px 0px 0px 0px rgba(5,168,255,1)'
      })),
      state('active',   style({
        '-webkit-box-shadow': '0px 0px 25px 5px rgba(5,168,255,1)',
        '-moz-box-shadow': '0px 0px 25px 5px rgba(5,168,255,1)',
        'box-shadow': '0px 0px 25px 5px rgba(5,168,255,1)'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out')),
    ])
  ]
})
export class FillMachineComponent implements OnInit {
  private cellFormState = 'inactive';
  private selectedCardId = '';
  private selectedRowId = -1;
  machine: Machine;
  products: Product[];
  form: FormGroup;
  formStyles: FormValidationStyles;
  changedFields: Field[] = [];

  constructor(
    private machineService: MachineService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private notificationService: NotificationsService
  ) { }

  ngOnInit() {
    let id = parseInt(this.route.snapshot.params['id']);

    this.machineService.findOne(id).subscribe(
      machine => this.machine = machine,
      error => {}
    );

    this.productService.findAll().subscribe(
      products => {
        this.products = products;
      }
    );

    this.form = new FormGroup({
      field: new FormControl('', Validators.required),
      product: new FormControl('', Validators.required),
      count: new FormControl('', [
        Validators.required,
        Validators.pattern('^[1-9]$|^[1][0-9]{1}$')
      ])
    });

    this.form.get('field').valueChanges
      .subscribe((field: Field) => {
        if (field != null) {
          this.selectedCardId = field.internalId;

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
        } else {
          this.selectedCardId = '';
        }
      });
  }

  toggleState(field: Field, rowId: number): void {
    this.selectedCardId = field.internalId;
    this.selectedRowId = rowId;
    this.cellFormState = 'active';
    this.form.get('field').patchValue(field, {onlySelf: true});

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
  }

  applyCellFormState(rowId: number): string {
    if (this.selectedRowId == rowId) {
      return 'active';
    } else {
      return 'inactive';
    }
  }

  applyCardState(cardId: string): string {
    if (cardId === this.selectedCardId && this.cellFormState === 'active') {
      return 'active';
    } else {
      return 'inactive';
    }
  }

  submit(): void {
    let fieldControl = this.form.get('field');
    let field: Field = fieldControl.value;
    field.product = this.form.get('product').value;
    field.count = this.form.get('count').value;
    this.changedFields.push(field);

    this.cancel();
  }

  clearCell() {
    let fieldControl = this.form.get('field');
    let field: Field = fieldControl.value;
    field.product = null;
    field.count = 0;

    this.form.patchValue(
      {
        field: field,
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
    this.selectedCardId = '';
    this.cellFormState = 'inactive';
    this.form.reset();
  }

  createImageUrl(product: Product): string {
    return `${AppProperties.API_VENDING_ENDPOINT}/${product.imageUrl}`;
  }

  isClearCellDisabled() {
    return !!(this.form.get('field').value
      && this.form.get('field').value.product == null);
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
        }
      );
  }
}
