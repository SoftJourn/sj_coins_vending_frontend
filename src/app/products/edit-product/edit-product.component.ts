import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {Category} from "../../shared/entity/category";
import {CategoryService} from "../../shared/services/category.service";
import {Product} from "../../shared/entity/product";
import {ProductService} from "../../shared/services/product.service";
import {ErrorDetail} from "../../shared/entity/error-detail";
import {NotificationsService} from "angular2-notifications/components";
import {FormValidationStyles} from "../../shared/form-validation-styles";
import {Subscription} from "rxjs";
import {AppProperties} from "../../shared/app.properties";
import {ActivatedRoute, Router} from "@angular/router";
import {ImageUploadService} from "../../shared/services/image-upload.service";

@Component({
    selector: 'app-edit-product',
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

    public categories: Category[];
    public product: Product;
    form: FormGroup;
    formStyles: FormValidationStyles;

    private subscription: Subscription;
    private productIndex: number;
    public imagForCropper = null;
    private imgName: string = null;
    showDialog = false;

    constructor(private categoryService: CategoryService,
                private productService: ProductService,
                private notificationService: NotificationsService,
                private route: ActivatedRoute,
                private router: Router,
                private imageUpload: ImageUploadService) {

        this.imageUpload.imageName = null;
    }

    ngOnInit() {

        this.subscription = this.route.params.subscribe(
            (params: any) => {
                this.productIndex = +params['id'];

                this.productService.findOne(this.productIndex).subscribe(
                    product => {
                        this.product = product;

                        this.buildForm();
                        // console.log(this.imageFile);
                        this.categoryService.findAll().subscribe(
                            categories => {
                                this.categories = categories;
                                for (let i = 0; i < this.categories.length; i++) {
                                    if (categories[i].name == this.product.category.name) {
                                        this.form.get('category').patchValue(categories[i]);
                                    }
                                }
                            },
                          error => {
                            try {
                              let errorDetail = <ErrorDetail> error.json();
                              this.notificationService.error('Error', errorDetail.detail);
                            } catch (err) {
                              console.log(err);
                              this.notificationService.error('Error', 'Error appeared, watch logs!');
                            }
                          });
                    },
                  error => {
                    try {
                      let errorDetail = <ErrorDetail> error.json();
                      this.notificationService.error('Error', errorDetail.detail);
                    } catch (err) {
                      console.log(err);
                      this.notificationService.error('Error', 'Error appeared, watch logs!');
                    }
                  });
            }
        );
    }

    private buildForm(): void {
        if (this.product.imageUrl) {
            this.imageUpload.imageSrc = `${AppProperties.API_VENDING_ENDPOINT}/${this.product.imageUrl}`
        } else {
            this.imageUpload.imageSrc = '/assets/images/default-product-350x350.jpg';
        }
        this.form = new FormGroup({
            name: new FormControl(this.product.name, [Validators.required,
                Validators.maxLength(50),
                Validators.pattern('^[a-zA-Z0-9\u0400-\u04FF]+[ a-zA-Z0-9\u0400-\u04FF,-]*[a-zA-Z0-9\u0400-\u04FF,-]+')
            ]),
            price: new FormControl(this.product.price, [Validators.required,
                Validators.maxLength(5),
                Validators.pattern('\\d+')]),
            description: new FormControl(this.product.description),
            category: new FormControl(this.product.category.name, Validators.required)
        });

        this.formStyles = new FormValidationStyles(this.form);
    }

    submit() {
        if (this.imageUpload.imageName != null && this.imageUpload.imageName != '') {
            this.productService.update(this.productIndex, this.form.value)
                .flatMap((product: Product) => {
                    this.router.navigate(['/main/products'])
                    this.notificationService.success('Update', 'Product has been updated successfully');
                    var blob = this.imageUpload.dataURItoBlob(this.imageUpload.imageSrc);
                    this.imageUpload.formData = new FormData();
                    this.imageUpload.formData.append('file', blob, this.imageUpload.imageFile.name);
                    return this.productService.updateImage(this.productIndex, this.imageUpload.formData)
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
                          this.notificationService.error('Error', errorDetail.detail);
                        }
                      }
                    } catch (err) {
                      console.log(err);
                      this.notificationService.error('Error', 'Error appeared, watch logs!');
                    }
                  }
                );
        }
        else if (this.product.imageUrl) {
            this.productService.update(this.productIndex, this.form.value)
                .do((product: Product) => {
                })
                .subscribe(
                    () => {
                        this.router.navigate(['/main/products'])
                        this.notificationService.success('Update', 'Product has been updated successfully');
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
                          this.notificationService.error('Error', errorDetail.detail);
                        }
                      }
                    } catch (err) {
                      console.log(err);
                      this.notificationService.error('Error', 'Error appeared, watch logs!');
                    }
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
            (err) => {
                console.log(err);
            }
        );
    }

}
