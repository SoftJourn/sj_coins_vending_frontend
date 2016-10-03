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
    imageLoaded: boolean = false;
    loaded: boolean = false;
    imageSrc: string;
    imageName: string = '';

    private img;
    private imageFile: File = null;
    private formData: FormData = null;
    private defaultImageSrc = '/assets/images/default-product-350x350.jpg';

    private subscription: Subscription;
    private productIndex: number;

    constructor(private categoryService: CategoryService,
                private productService: ProductService,
                private notificationService: NotificationsService,
                private route: ActivatedRoute,
                private router: Router) {
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
                            });
                    },
                    error => {
                        console.log(error);
                    });
            }
        );
    }

    private buildForm(): void {
        if (this.product.imageUrl) {
            this.imageSrc = `${AppProperties.API_VENDING_ENDPOINT}/${this.product.imageUrl}`
        } else {
            this.imageSrc = '/assets/images/default-product-350x350.jpg';
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
        if (this.imageFile != null) {
            this.productService.update(this.productIndex, this.form.value)
                .flatMap((product: Product) => {
                    this.router.navigate(['/main/products'])
                    this.notificationService.success('Update', 'Product was updated successfully');
                    return this.productService.updateImage(this.productIndex, this.formData)
                })
                .subscribe(
                    () => {
                    },
                    error => {
                        if (error.status == 415) {
                            this.notificationService.error('Error', 'This file format not supported!');
                        }
                        else {
                            var errorDetail: ErrorDetail = JSON.parse(error._body);
                            if (errorDetail.code == 1062) {
                                this.notificationService.error('Error', 'Such product name exists!');
                            }
                            else {
                                this.notificationService.error('Error', errorDetail.detail);
                            }
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
                        this.notificationService.success('Create', 'Product was updated successfully');
                    },
                    error => {
                        if (error.status == 415) {
                            this.notificationService.error('Error', 'This file format not supported!');
                        }
                        else {
                            var errorDetail: ErrorDetail = JSON.parse(error._body);
                            if (errorDetail.code == 1062) {
                                this.notificationService.error('Error', 'Such product name exists!');
                            }
                            else {
                                this.notificationService.error('Error', errorDetail.detail);
                            }
                        }
                    }
                );
        }
        else {
            this.notificationService.error('Error', 'Please put product image!');
        }
    }

    public handleInputChange(e) {
        this.imageFile = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        var pattern = /image\/(?:jpeg|png|jpg|apng|svg|bmp)/;
        var reader = new FileReader();
        this.validImageDimensions(this.imageFile).then(resolve => {
            // check image pattern
            if (!this.imageFile.type.match(pattern)) {
                this.notificationService.error('Error', 'This file format not supported!');
                this.cleanImageData();
                e.target.value = null;
            }
            // check image size
            else if (this.imageFile.size > 1024 * 256) {
                this.notificationService.error('Error', 'This image size is too big!');
                this.cleanImageData();
                e.target.value = null;
            }
            // check image dimensions
            else if (resolve) {
                this.notificationService.error('Error', 'Image dimensions is too big, try to use 205*205px');
                e.target.value = null;
                this.cleanImageData();
            } else {
                this.loaded = false;
                this.formData = new FormData();
                this.formData.append('file', this.imageFile, this.imageFile.name);
                reader.onload = this._handleReaderLoaded.bind(this);
                reader.readAsDataURL(this.imageFile);
                this.imageName = this.imageFile.name;
                e.target.value = null;
            }
        }, reject => {
            this.notificationService.error('Error', reject);
            this.cleanImageData();
            e.target.value = null;
        });
    }

    public handleImageLoad() {
        this.imageLoaded = true;
    }

    public reset(): void {
        this.cleanImageData();
        this.form.reset({
            name: '',
            price: '',
            description: '',
            category: this.categories[0]
        })
    }

    private _handleReaderLoaded(e) {
        var reader = e.target;
        this.imageSrc = reader.result;
        this.loaded = true;
    }

    private validImageDimensions(image: File): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.img = new Image();
            this.img.onload = ()=> {
                resolve(this.img.width >= 205 || this.img.height >= 205);
                reject('Image was not uploaded, try again!');
            };
            this.img.src = window.URL.createObjectURL(image);
        });
    }

    private cleanImageData(): void {
        this.imageFile = null;
        if (this.product.imageUrl) {
            this.imageSrc = `${AppProperties.API_VENDING_ENDPOINT}/${this.product.imageUrl}`
        } else {
            this.imageSrc = this.defaultImageSrc;
        }
        this.imageName = '';
        this.formData = null;
    }

}
