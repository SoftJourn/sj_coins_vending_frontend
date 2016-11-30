import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { Category } from "../../shared/entity/category";
import { CategoryService } from "../../shared/services/category.service";
import { Product } from "../../shared/entity/product";
import { ProductService } from "../../shared/services/product.service";
import { ErrorDetail } from "../../shared/entity/error-detail";
import { NotificationsService } from "angular2-notifications/components";
import { FormValidationStyles } from "../../shared/form-validation-styles";
import { Router } from "@angular/router";
import { ImageUploadService } from "../../shared/services/image-upload.service";

@Component({
    selector: 'add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

    public categories: Category[];
    public product: Product;
    form: FormGroup;
    formStyles: FormValidationStyles;
    public imagForCropper = null;
    private imgName: string = null;
    showDialog = false;

    constructor(private categoryService: CategoryService,
                private productService: ProductService,
                private notificationService: NotificationsService,
                private router: Router,
                private imageUpload: ImageUploadService) {

        this.imageUpload.imageName = null;
    }

    ngOnInit() {
        this.imageUpload.imageSrc = this.imageUpload.defaultImageSrc;
        this.buildForm();
        this.categoryService.findAll().subscribe(
            categories => {
                this.categories = categories;
                this.form.get('category').patchValue(categories[0]);
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
          });
    }

    private buildForm(): void {
        this.form = new FormGroup({
            name: new FormControl('', [Validators.required,
                Validators.maxLength(50),
                Validators.pattern('^[a-zA-Z0-9\u0400-\u04FF]+[ a-zA-Z0-9\u0400-\u04FF,-]*[a-zA-Z0-9\u0400-\u04FF,-]+')
            ]),
            price: new FormControl('', [Validators.required,
                Validators.maxLength(5),
                Validators.pattern('\\d+')]),
            description: new FormControl(''),
            category: new FormControl('', Validators.required)
        });

        this.formStyles = new FormValidationStyles(this.form);
    }

    submit() {
        if (this.imageUpload.imageName != null && this.imageUpload.imageName != '') {
            this.productService.save(this.form.value)
                .flatMap((product: Product) => {
                    this.notificationService.success('Create', 'Product has been created successfully');
                    var blob = this.imageUpload.dataURItoBlob(this.imageUpload.imageSrc);
                    this.imageUpload.formData = new FormData();
                    this.imageUpload.formData.append('file', blob, this.imageUpload.imageFile.name);
                    return this.productService.updateImage(product.id, this.imageUpload.formData);
                })
                .subscribe(
                    () => {
                    },
                  error => {
                    try {
                      let errorDetail = <ErrorDetail> error.json();
                      if (error.status == 415) {
                        this.notificationService.error('Error', 'This file format not supported!');
                      }
                      else {
                        if (errorDetail.code == 1062) {
                          this.notificationService.error('Error', 'Such product name exists!');
                        }
                        else {
                          if (!errorDetail.detail)
                          //noinspection ExceptionCaughtLocallyJS
                            throw errorDetail;
                          this.notificationService.error('Error', errorDetail.detail);
                        }
                      }
                    } catch (err) {
                      console.log(err);
                      this.notificationService.error('Error', 'Error appeared, watch logs!');
                    }
                  },
                    () => {
                        this.imageUpload.cleanImageData();
                        this.imageUpload.imageSrc = this.imageUpload.defaultImageSrc;
                        this.form.reset({
                            name: '',
                            price: '',
                            description: '',
                            category: this.categories[0]
                        });
                    }
                );
        }
        else {
            this.notificationService.error('Error', 'Please put product image!');
        }
    }


    public reset(): void {
        this.router.navigate(['/main/products']);
    }


    public setDataForImage(value: string) {
        this.imageUpload.handleImageLoad();
        this.imageUpload.imageSrc = value;
        this.imageUpload.imageName = this.imgName;
    }

    public handleInputChange($event) {
        this.imageUpload.fileChangeListener($event).subscribe(
            (img) => {
                this.imagForCropper = img.src;
                this.imgName = img.name;
                this.showDialog = !this.showDialog;
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

    };
}
