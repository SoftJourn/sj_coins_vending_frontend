import {Component, OnInit, ViewChild} from "@angular/core";
import {Category} from "../../shared/entity/category";
import {CategoryService} from "../../shared/services/category.service";
import {Product} from "../../shared/entity/product";
import {ProductService} from "../../shared/services/product.service";
import {ErrorDetail} from "../../shared/entity/error-detail";
import {Router} from "@angular/router";
import {UNSUPPORTED_MEDIA_TYPE} from "http-status-codes";
import {NotificationsManager} from "../../shared/notifications.manager";
import {ImageLoaderComponent} from "../../shared/image-loader/image-loader.component";
import {ProductFormComponent} from "../product-form/product-form.component";

@Component({
  selector: 'add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  @ViewChild("imageLoader") imageLoaderComponent: ImageLoaderComponent;
  @ViewChild("productForm") formComponent: ProductFormComponent;

  categories: Category[] = [];
  product: Product;

  private _mainProductURI = '/main/products';

  constructor(private categoryService: CategoryService,
              private productService: ProductService,
              private notify: NotificationsManager,
              private router: Router) {

  }

  ngOnInit() {
    this.initFromComponent();
  }

  submitCoverImage(productId: number) {
    let formData = this.imageLoaderComponent.getImageFormData('file');
    return this.productService.updateImage(productId, formData);
  }

  submitDescriptionImages(productId: number) {
    let formData = this.imageLoaderComponent.getDescriptionImagesFormData("files");
    return this.productService.updateImages(productId, formData);
  }

  submit() {
    if (!this.imageLoaderComponent.isEmpty()) {
      let formData = this.formComponent.form.value;
      this.productService.save(formData).subscribe(
        product => {
          this.submitCoverImage(product.id)
            .merge(this.submitDescriptionImages(product.id))
            .subscribe(undefined, this.errorHandle, () => this.reset());
        },
        error => this.errorHandle(error)
      )
    }
    else {
      this.notify.errorNoImageMsg();
    }
  }

  cancel(): void {
    this.router.navigate([this._mainProductURI]);
  }

  getCardOutlineClass(){
    if(this.formComponent && this.formComponent.formStyles)
      return this.formComponent.formStyles.getCardOutlineClass();
  }

  isValid(): boolean{
    return this.formComponent && this.imageLoaderComponent
      && this.formComponent.isValid() && !this.imageLoaderComponent.isEmpty();
  }

  private errorHandle(error) {
    let _productDuplicateCode = 1052;
    try {
      let errorDetail = <ErrorDetail> error.json();
      if (error.status == UNSUPPORTED_MEDIA_TYPE) {
        this.notify.errorWrongFormatMsg();
      }
      else {
        if (errorDetail.code == _productDuplicateCode) {
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

  private initFromComponent() {
    this.categoryService.findAll().subscribe(
      categories => this.setCategoriesAndEmptyProduct(categories),
      error => this.notify.errorDetailedMsgOrConsoleLog(error)
    );
  }

  private setCategoriesAndEmptyProduct(categories) {
    this.categories = categories;
    this.product = new Product();
    if (this.categories.length > 0)
      this.product.category = this.categories[0];
  }

  private reset() {
    if(this.formComponent)
      this.formComponent.reset();
    if(this.imageLoaderComponent)
      this.imageLoaderComponent.reset()
  }
}
