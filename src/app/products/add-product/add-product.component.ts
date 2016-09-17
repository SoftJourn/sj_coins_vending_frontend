import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {Category} from "../../shared/entity/category";
import {CategoryService} from "../../shared/services/category.service";
import {Product} from "../../shared/entity/product";
import { Response } from "@angular/http";
import { ProductService } from "../../shared/services/product.service";

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

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

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
      name: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.pattern('\\d+')]),
      description: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required)
    });
  }

  submit() {
    this.productService.save(this.form.value)
      .flatMap((product: Product) => this.productService.updateImage(product.id, this.formData))
      .subscribe(
        () => {},
        error => {},
        () => {
          this.formData = new FormData();
          this.imageSrc = this.defaultImageSrc;
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
