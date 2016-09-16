import { Component, OnInit } from "@angular/core";
import { CategoryService } from "../shared/services/category.service";
import { Category } from "../shared/entity/category";

@Component({
  selector: 'categories-list',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  public categories: Category[];

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(
      data => {
        this.categories = data;
      }
    );

    this.categories = [new Category('Drink', 1), new Category('Drink', 2)];
  }

  private deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe(
      next => {},
      error=> {},
      () => {
        this.categoryService.getCategories().subscribe(
          categories => {
            this.categories = categories;
          });
      });
  }

}
