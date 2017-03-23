import {Component, OnInit, ViewChild} from "@angular/core";
import {CategoryService} from "../../shared/services/category.service";
import {Product} from "../../shared/entity/product";
import {ProductService} from "../../shared/services/product.service";
import {ErrorDetail} from "../../shared/entity/error-detail";
import {Subscription, Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ImageUploadService} from "../../shared/services/image-upload.service";
import {NotificationsManager} from "../../shared/notifications.manager";
import {UNSUPPORTED_MEDIA_TYPE} from "http-status-codes";
import {ProductFormComponent} from "../product-form/product-form.component";
import {Category} from "../../shared/entity/category";
import {ImageLoaderComponent} from "../../shared/image-loader/image-loader.component";
import {AppProperties} from "../../shared/app.properties";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  @ViewChild("productForm") formComponent: ProductFormComponent;
  @ViewChild("imageLoader") imageLoaderComponent: ImageLoaderComponent;

  product: Product;

  private subscription: Subscription;
  private productIndex: number;

  private _categories: Category[] = [];
  private _productUrl = '/main/products';
  private _originImages: Array<string>;
  private _originCover: string;


  constructor(private categoryService: CategoryService,
              private productService: ProductService,
              private notify: NotificationsManager,
              private route: ActivatedRoute,
              private router: Router,
              private imageUpload: ImageUploadService) {

    this.imageUpload.imageName = null;
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        this.productIndex = +params['id'];
        let finaleSource = this.formFinalSource(this.productIndex);
        finaleSource.subscribe((obj) => this.setData(obj));
      }
    );
  }

  reset(): void {
    this.router.navigate([this._productUrl]);
  }

  submit() {
    if (!this.imageLoaderComponent.isEmpty()) {
      let productEntity = this.formComponent.form.value;
      this.productService.update(this.productIndex, productEntity).subscribe(
        product => {
          this.submitImages(product)
            .subscribe(undefined, error => this.errorHandle(error), () => this.reset());
        },
        error => this.errorHandle(error)
      );
    }
    else {
      this.notify.errorNoImageMsg();
    }
  }

  private submitImages(product) {
    let coverImageOutcome = this.updateCoverImage(product.id);
    let loadImagesOutcome = this.loadImages(product.id);
    let deleteImagesOutcome = this.deleteImages();
    return coverImageOutcome
      .merge(loadImagesOutcome)
      .concat(deleteImagesOutcome);
  }

  updateCoverImage(productId: number): Observable<any> {
    let formData = this.imageLoaderComponent.getImageFormData('file');
    if (formData) {
      return this.productService.updateImage(productId, formData);
    } else {
      //TODO Update cover image by image id. Involved back-end changes. This is temporary solution
      return this.productService.getImageBlob(this.imageLoaderComponent.image.src)
        .flatMap(blob => {
          let form = new FormData();
          form.append('file', blob);
          return this.productService.updateImage(productId, form);
        }
      );
    }
  }

  loadImages(productId: number): Observable<any> {
    let formData = this.imageLoaderComponent.getDescriptionImagesFormData("files");
    if (formData)
      return this.productService.updateImages(productId, formData);
    else
      return Observable.empty();
  }

  deleteImages(): Observable<any> {
    let deletedUrls = this.imageLoaderComponent.getDeletedUrls(this._originImages);
    let deleteOutcome: Observable<any> = Observable.empty();
    deletedUrls
      .forEach(url => deleteOutcome = deleteOutcome.merge(this.productService.deleteImage(url)));
    return deleteOutcome;
  }

  //TODO is valid not working
  //Error: Expression has changed after it was checked. Previous value: 'true'. Current value: 'false'
  isValid(): boolean{
    return this.formComponent && this.imageLoaderComponent
      && this.formComponent.isValid() && !this.imageLoaderComponent.isEmpty();
  }


  private formFinalSource(productId: number) {
    let productSource = this.productService.findOne(productId).map(product => {
      this.product = product;
      this.fillImageComponent(product);
      return {product: product, categories: this._categories}
    });
    let categorySource = this.categoryService.findAll().map(categories => {
      this._categories = categories;
      return {product: this.product, categories: categories}
    });
    return productSource.merge(categorySource);
  }

  private fillImageComponent(product: Product) {
    let urls = product.imageUrls;
    let i = 0;
    this._originCover = EditProductComponent.getAbsolutePath(product.imageUrl);
    if (urls && urls.length) {
      this._originImages = urls.map(url => EditProductComponent.getAbsolutePath(url));
      for (i; i < urls.length; i++) {
        let image = this.formatImage(urls[i], i);
        if(image.src.localeCompare(this._originCover) != 0)
        this.imageLoaderComponent.addImageItem(image);
      }
    }
    this.imageLoaderComponent.addImageItem(this.formatImage(product.imageUrl,i));
  }

  private formatImage(url: string, i: number): HTMLImageElement {
    let image = new Image();
    image.src = EditProductComponent.getAbsolutePath(url);
    image.name = "image" + i;
    return image;
  }

  private static getAbsolutePath(relativePath: string): string {
    return AppProperties.API_VENDING_ENDPOINT + '/' + relativePath;
  }

  private setData(obj) {
    if (obj.product && obj.categories && obj.categories.length) {
      this.formComponent.setProduct(obj.product, obj.categories)
    }
  }

  private errorHandle(error) {
    let productDuplicateCode = 1062;
    try {
      let errorDetail = <ErrorDetail> error.json();
      if (error.status == UNSUPPORTED_MEDIA_TYPE) {
        this.notify.errorWrongFormatMsg();
      }
      else {
        if (errorDetail.code == productDuplicateCode) {
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

}
