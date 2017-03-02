import {Component, OnInit} from "@angular/core";
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

@Component({
    selector: 'add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

    categories: Category[];
    product: Product;
    form: FormGroup;
    formStyles: FormValidationStyles;
    imageForCropper = null;
    showDialog = false;

    private _mainProductURI = '/main/products';
    private imgName: string = null;
    private _filesPropertyName = 'file[]';
    //Validators parameters
    private _digitsPattern = '\\d+';
    private _wordsWithNumbersPattern = '^[a-zA-Z0-9\u0400-\u04FF]+[ a-zA-Z0-9\u0400-\u04FF,-]*[a-zA-Z0-9\u0400-\u04FF,-]+';
    private _maxPriceInputLength = 5;
    private _maxNameInputLength = 50;


    private _productDuplicateCode = 1062;

    constructor(private categoryService: CategoryService,
                private productService: ProductService,
                private notify: NotificationsManager,
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
              this.notify.errorDetailedMsg(error.json());
            } catch (err) {
              this.notify.logError(err);
            }
          });
    }

  submit() {
        if (this.imageUpload.imageName) {
            this.productService.save(this.form.value)
                .flatMap((product: Product) => {
                    this.notify.createSuccessfulMsg();
                    let blob = this.imageUpload.dataURItoBlob(this.imageUpload.imageSrc);
                    this.imageUpload.formData = new FormData();
                    this.imageUpload.formData.append(this._filesPropertyName, blob, this.imageUpload.imageFile.name);
                    return this.productService.updateImage(product.id, this.imageUpload.formData);
                })
                .subscribe(
                    () => {
                    },
                  error => {
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
          this.notify.errorNoImage();
        }
    }


    reset(): void {
        this.router.navigate([this._mainProductURI]);
    }

    setDataForImage(value: string) {
        this.imageUpload.handleImageLoad();
        this.imageUpload.imageSrc = value;
        this.imageUpload.imageName = this.imgName;
    }

    handleInputChange($event) {
        this.imageUpload.fileChangeListener($event).subscribe(
            (img) => {
                this.imageForCropper = img.src;
                this.imgName = img.name;
                this.showDialog = !this.showDialog;
            },
          error => {
            try {
              this.notify.errorDetailedMsg(error.json());
            } catch (err) {
              this.notify.logError(err);
            }
          }
        );

    };

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


}
