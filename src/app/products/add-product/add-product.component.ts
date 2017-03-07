import {Component, OnInit, ViewChild} from "@angular/core";
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {Category} from "../../shared/entity/category";
import {CategoryService} from "../../shared/services/category.service";
import {Product} from "../../shared/entity/product";
import {ProductService} from "../../shared/services/product.service";
import {ErrorDetail} from "../../shared/entity/error-detail";
import {FormValidationStyles} from "../../shared/form-validation-styles";
import {Router} from "@angular/router";
import {ImageUploadService} from "../../shared/services/image-upload.service";
import {UNSUPPORTED_MEDIA_TYPE} from "http-status-codes";
import {NotificationsManager} from "../../shared/notifications.manager";
import {ImageLoaderComponent} from "../../shared/image-loader/image-loader.component";

@Component({
  selector: 'add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  @ViewChild("imageLoader") imageLoader: ImageLoaderComponent;

  categories: Category[];
  product: Product;
  form: FormGroup;
  formStyles: FormValidationStyles;

  private _mainProductURI = '/main/products';
  //Validators parameters
  private _digitsPattern = '\\d+';
  private _wordsWithNumbersPattern = '^[a-zA-Z0-9\u0400-\u04FF]+[ a-zA-Z0-9\u0400-\u04FF,-]*[a-zA-Z0-9\u0400-\u04FF,-]+';
  private _maxPriceInputLength = 5;
  private _maxNameInputLength = 50;


  private _productDuplicateCode = 1062;

  constructor(private categoryService: CategoryService,
              private productService: ProductService,
              private notify: NotificationsManager,
              private router: Router) {

  }

  ngOnInit() {
    this.buildForm();
    this.findAllCategories();
  }

  submitImage(productId: number) {
    let formData = this.imageLoader.getImageFormData('file');
    return this.productService.updateImage(productId, formData);
  }

  submitDescriptionImages(productId: number){
    let formData = this.imageLoader.getDescriptionImagesFormData("file[]")
  }

  submit() {
    if (!this.imageLoader.isEmpty()) {
      this.productService.save(this.form.value)
        .flatMap((product: Product) => this.submitImage(product.id))
        .subscribe(
          value => {
          },
          error => this.errorHandle(error),
          () => this.reset()
        );
    }
    else {
      this.notify.errorNoImageMsg();
    }
  }

  cancel(): void {
    this.router.navigate([this._mainProductURI]);
  }

  private errorHandle(error) {
    try {
      let errorDetail = <ErrorDetail> error.json();
      if (error.status == UNSUPPORTED_MEDIA_TYPE) {
        this.notify.errorWrongFormatMsg();
      }
      else {
        if (errorDetail.code == this._productDuplicateCode) {
          this.notify.errorProductDuplicateMsg();
        }
        else {
          this.notify.errorDetailedMsg(error.json());
        }
      }
    } catch (err) {
      this.notify.logError(err);
    }
  }

  private reset(): void {
    this.form.reset({
      name: '',
      price: '',
      description: '',
      category: this.categories[0]
    });
    this.notify.createSuccessfulMsg();
  }

  private buildForm(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required,
        Validators.maxLength(this._maxNameInputLength),
        Validators.pattern(this._wordsWithNumbersPattern)
      ]),
      price: new FormControl('', [Validators.required,
        Validators.maxLength(this._maxPriceInputLength),
        Validators.pattern(this._digitsPattern)]),
      description: new FormControl(''),
      category: new FormControl('', Validators.required)
    });

    this.formStyles = new FormValidationStyles(this.form);
  }

  private findAllCategories() {
    this.categoryService.findAll().subscribe(
      categories => {
        this.categories = categories;
        this.form.get('category').patchValue(categories[0]);
      },
      error => {
        try {
          this.notify.errorDetailedMsg(error.json());
        } catch (err) {
          this.notify.logError(err);
        }
      });
  }


}
