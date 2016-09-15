import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {Category} from "../../shared/entity/category";
import {CategoryService} from "../../shared/services/category.service";
import {Product} from "../../shared/entity/product";

@Component({
  selector: 'add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  public categories: Category[];
  public product: Product;
  form: FormGroup;

  imageLoaded: boolean = false;
  loaded: boolean = false;
  imageSrc: string = '/assets/images/default-product-350x350.jpg';

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.buildForm();
    this.categoryService.getCategories().subscribe(
      data => {
        this.categories = data;
        this.form.get('category').patchValue(data[0]);
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
    this.product = this.form.value;
    console.log(this.form.value);
  }

  public handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    /*
     TODO add image pattern
     */
    var pattern = /image-*/;
    var reader = new FileReader();

    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }

    this.loaded = false;

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
