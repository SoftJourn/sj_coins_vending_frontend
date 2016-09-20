import { Component, OnInit } from "@angular/core";
import { CategoryService } from "../shared/services/category.service";
import { Category } from "../shared/entity/category";
import { NotificationsService } from "angular2-notifications";

@Component({
  selector: 'categories-list',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  public categories: Category[];

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationsService
  ) {}

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
          categories => {
            this.categories = categories;
            this.notificationService.success('Delete', 'Category has been deleted successfully.');
          }
        );
      });
  }

}
