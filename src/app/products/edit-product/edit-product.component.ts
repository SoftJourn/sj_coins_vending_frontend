import {Component, OnInit, ViewChild} from "@angular/core";
import {CategoryService} from "../../shared/services/category.service";
import {Product} from "../../shared/entity/product";
import {ProductService} from "../../shared/services/product.service";
import {ErrorDetail} from "../../shared/entity/error-detail";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ImageUploadService} from "../../shared/services/image-upload.service";
import {NotificationsManager} from "../../shared/notifications.manager";
import {UNSUPPORTED_MEDIA_TYPE} from "http-status-codes";
import {ProductFormComponent} from "../product-form/product-form.component";
import {Category} from "../../shared/entity/category";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  @ViewChild("productForm") formComponent: ProductFormComponent;

  product: Product;


  private subscription: Subscription;
  private productIndex: number;
  private _productUrl = '/main/products';

  private categories:Category[] = [];


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

        let productSource = this.productService.findOne(this.productIndex).map( product =>{
          this.product = product;
          return {product:product, categories: this.categories }
        });
        let categorySource = this.categoryService.findAll().map( categories => {
          this.categories = categories;
          return {product:this.product, categories: categories }
        });

        let finaleSource = productSource.merge(categorySource);

        finaleSource.subscribe(obj => {
          if(obj.product && obj.categories &&  obj.categories.length)
            this.formComponent.setProduct(obj.product, obj.categories)
        });

        // .subscribe(
        //   product => {
        //     this.product = product;
        //     this.formComponent.setProduct(product);
        //     // console.log(this.imageFile);
        //   },
        //   this.notify.errorDetailedMsgOrConsoleLog);errorDetailedMsgOrConsoleLog
      }
    );
  }

  submit() {
    // if (this.imageUpload.imageName != null && this.imageUpload.imageName != '') {
    //   this.productService.update(this.productIndex, this.form.value)
    //     .flatMap((product: Product) => {
    //       this.router.navigate([this._productUrl]);
    //       this.notify.updateSuccessfulMsg();
    //       let blob = ImageUploadService.dataURItoBlob(this.imageUpload.imageSrc);
    //       this.imageUpload.formData = new FormData();
    //       this.imageUpload.formData.append('file', blob, this.imageUpload.imageFile.name);
    //       return this.productService.updateImage(this.productIndex, this.imageUpload.formData)
    //     })
    //     .subscribe(
    //       undefined,
    //       this.errorHandle
    //     );
    // }
    // else if (this.product.imageUrl) {
    //   this.productService.update(this.productIndex, this.form.value)
    //     .do((product: Product) => {
    //     })
    //     .subscribe(
    //       () => {
    //         this.router.navigate([this._productUrl]);
    //         this.notify.updateSuccessfulMsg();
    //       },
    //       this.errorHandle
    //     );
    // }
    // else {
    //   this.notify.errorNoImageMsg();
    // }
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

  public reset(): void {
    this.router.navigate([this._productUrl]);
  }

}
