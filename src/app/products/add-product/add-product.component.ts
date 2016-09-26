import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {Category} from "../../shared/entity/category";
import {CategoryService} from "../../shared/services/category.service";
import {Product} from "../../shared/entity/product";
import {ProductService} from "../../shared/services/product.service";
import {ErrorDetail} from "../../shared/entity/error-detail";
import {NotificationsService} from "angular2-notifications/components";

@Component({
  selector: 'add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  public categories: Category[];
  public product: Product;
  form: FormGroup;
  private formData = new FormData();

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
        Validators.pattern('^[a-zA-Z]+[ a-zA-Z]+')
      ]),
      price: new FormControl('', [Validators.required, Validators.pattern('\\d+')]),
      description: new FormControl(''),
      category: new FormControl('', Validators.required)
    });
  }


  getValidationClass(controlName: string): string {
    if (this.form.controls[controlName].pristine) {
      return "";
    } else if (this.form.controls[controlName].valid) {
      return "has-success";
    } else if (!this.form.controls[controlName].valid) {
      return "has-danger";
    }
  }

  getValidationIcon(controlName: string): string {
    if (this.form.controls[controlName].pristine) {
      return "";
    } else if (this.form.controls[controlName].valid) {
      return "form-control-success";
    } else if (!this.form.controls[controlName].valid) {
      return "form-control-danger";
    }
  }

  isValidOrPristine(controlName: string): boolean {
    return this.form.controls[controlName].valid
      || this.form.controls[controlName].pristine;
  }


  submit() {
    this.productService.save(this.form.value)
      .flatMap((product: Product) => this.productService.updateImage(product.id, this.formData))
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
          this.notificationService.success('Create', 'Product was created successfully');
          this.formData = new FormData();
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

  public handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    var pattern = /image\/.+/;
    var reader = new FileReader();

    if (!file.type.match(pattern)) {
      console.log('invalid format');
    }

    this.loaded = false;
    this.formData.append('file', file, file.name)

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
    this.imageName = file.name;
  }

  private _handleReaderLoaded(e) {
    var reader = e.target;
    this.imageSrc = reader.result;
    this.loaded = true;
  }

  public handleImageLoad() {
    this.imageLoaded = true;
  }

}
