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
    this.categoryService.findAll().subscribe(
      categories => this.categories = categories
    );
  }

  private deleteCategory(id: number) {
    this.categoryService.delete(id).subscribe(
      next => {},
      error=> {},
      () => {
        this.categoryService.findAll().subscribe(
          categories => this.categories = categories
        );
      });
  }

}
