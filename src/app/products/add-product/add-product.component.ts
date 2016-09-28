import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {Category} from "../../shared/entity/category";
import {CategoryService} from "../../shared/services/category.service";
import {Product} from "../../shared/entity/product";
import {ProductService} from "../../shared/services/product.service";
import {ErrorDetail} from "../../shared/entity/error-detail";
import {NotificationsService} from "angular2-notifications/components";
import {FormValidationStyles} from "../../shared/form-validation-styles";

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
  private imageFile: File = null;
  private formData: FormData = new FormData();

  imageLoaded: boolean = false;
  loaded: boolean = false;
  private defaultImageSrc = '/assets/images/default-product-350x350.jpg';
  imageSrc: string;
  imageName: string = '';

  constructor(private categoryService: CategoryService,
              private productService: ProductService,
              private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.imageSrc = this.defaultImageSrc;
    this.buildForm();
    this.categoryService.findAll().subscribe(
      categories => {
        this.categories = categories;
        this.form.get('category').patchValue(categories[0]);
      });
  }

  private buildForm(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9\u0400-\u04FF]+[ a-zA-Z0-9\u0400-\u04FF]*[a-zA-Z0-9\u0400-\u04FF]+')
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
    if (this.imageFile != null) {
      this.productService.save(this.form.value)
        .flatMap((product: Product) => {
          this.notificationService.success('Create', 'Product was created successfully');
          return this.productService.updateImage(product.id, this.formData)
        })
        .subscribe(
          () => {
          },
          error => {
            var errorDetail: ErrorDetail = JSON.parse(error._body);
            if (errorDetail.code == 1062) {
              this.notificationService.error('Error', 'Such product name exists!');
            }
            else {
              this.notificationService.error('Error', errorDetail.detail);
            }
          },
          () => {
            this.imageFile = null;
            this.imageSrc = this.defaultImageSrc;
            this.imageName = '';
            this.form.reset({
              name: '',
              price: '',
              description: '',
              category: this.categories[0]
            })
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
    // check image pattern
    if (!this.imageFile.type.match(pattern)) {
      this.notificationService.error('Error', 'This file format not supported!');
    }
    // check image size
    else if (this.imageFile.size > 1024 * 256) {
      this.notificationService.error('Error', 'This image size is too big!');
    }
    // check image dimensions
    else if (this.validImageDimensions(this.imageFile)) {
      this.notificationService.error('Error', 'Image dimensions is too big, try to use 205*205px');
    }
    else {
      this.loaded = false;
      this.formData.append('file', this.imageFile, this.imageFile.name);
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(this.imageFile);
      this.imageName = this.imageFile.name;
    }
  }

  public handleImageLoad() {
    this.imageLoaded = true;
  }

  public reset(): void {
    this.imageFile = null;
    this.imageSrc = this.defaultImageSrc;
    this.imageName = '';
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

  private validImageDimensions(image: File): boolean {
    var img = new Image();
    img.src = window.URL.createObjectURL(image);
    return img.width >= 205 || img.height >= 205
  }

}
