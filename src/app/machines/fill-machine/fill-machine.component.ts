import {
  Component,
  OnInit,
  style,
  state,
  animate,
  transition,
  trigger } from "@angular/core";
import { MachineService } from "../../shared/services/machine.service";
import { Machine, Field } from "../shared/machine";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../../shared/services/product.service";
import { Product } from "../../shared/entity/product";
import { NotificationsService } from "angular2-notifications";
import { AppProperties } from "../../shared/app.properties";

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
      state('inactive', style({'background-color': 'white'})),
      state('active',   style({'background-color': 'grey'})),
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
        } else {
          this.selectedCardId = '';
        }
      });
  }

  toggleState(field: Field, rowId: number): void {
    this.selectedCardId = field.internalId;
    this.selectedRowId = rowId;
    this.cellFormState = 'active';
    this.form.controls['field'].patchValue(field, {onlySelf: true});
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
    this.machineService.updateField(this.machine.id, this.form.value)
      .subscribe(
        updatedField => {
          this.cancel();
          this.notificationService.success("Added", "Product added successfully");
          this.populateField(updatedField);
        }
      );
  }

  private populateField(field: Field): void {
    this.form.get('field').patchValue(field);
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
}
