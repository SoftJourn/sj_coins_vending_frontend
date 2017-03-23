import {Component, OnInit, Input, ViewChild} from "@angular/core";
import {Category} from "../../shared/entity/category";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {FormValidationStyles} from "../../shared/form-validation-styles";
import {NotificationsManager} from "../../shared/notifications.manager";
import {Product} from "../../shared/entity/product";
import {NutritionFactsFormComponent} from "./nutrition-facts-form/nutrition-facts-form.component";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  @Input() categories: Category[];
  @Input() product: Product;

  nutritionFactsObj = {
    fat:"10"
  };

  @ViewChild("nutritionFacts") nutritionFacts: NutritionFactsFormComponent;

  form: FormGroup;
  formStyles: FormValidationStyles;


  //Validators parameters
  private _digitsPattern = '\\d+';
  private _wordsWithNumbersPattern = '^[a-zA-Z0-9\u0400-\u04FF]+[ a-zA-Z0-9\u0400-\u04FF,-]*[a-zA-Z0-9\u0400-\u04FF,-]+';
  private _maxPriceInputLength = 5;
  private _maxNameInputLength = 50;

  constructor(private notify: NotificationsManager,
              private fb: FormBuilder) {
  }



  ngOnInit() {
    this.product = new Product();
    this.form = this.buildForm();
    this.formStyles = new FormValidationStyles(this.form);
  }

  buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required,
        Validators.maxLength(this._maxNameInputLength),
        Validators.pattern(this._wordsWithNumbersPattern)
      ]],
      price: ['', [Validators.required,
        Validators.maxLength(this._maxPriceInputLength),
        Validators.pattern(this._digitsPattern)
      ]],
      description: '',
      category: ['', Validators.required]
      // nutritionFacts:this.nutritionFacts.form
      //   // factOne:'1',
      //   // factTwo:'2'
      // })
    });
  }

  isValid(): boolean {
    return this.form.valid;
  }

  reset(): void {
    let emptyProduct = new Product();
    if (this.categories.length > 0)
      emptyProduct.category = this.categories[0];
    this.form.reset(emptyProduct);
    //TODO check if need this message
    this.notify.createSuccessfulMsg();
  }

  setProduct(product: Product, categories: Category[]) {
    this.product = product;
    this.categories = categories;

    let selected = this.categories.filter(category => ProductFormComponent.isEquals(category, product.category));
    if (selected)
      this.product.category = selected[0];
  }

  private static isEquals(category1: Category, category2: Category): boolean {
    return category1.name == category2.name && category1.id == category2.id;
  }
}
