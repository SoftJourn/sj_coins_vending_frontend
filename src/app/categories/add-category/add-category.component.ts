import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {Category} from "../../shared/entity/category";
import {CategoryService} from "../../shared/services/category.service";

@Component({
  selector: 'add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  public category: Category = new Category();
  form: FormGroup;

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = new FormGroup({
      category: new FormControl('', Validators.required)
    });
  }

  submit() {
    this.categoryService.createCategory(this.category)
      .subscribe(next => {
        console.log(next.toString());
      });
  }
}
