import { Component, OnInit } from "@angular/core";
import { CategoryService } from "../shared/services/category.service";
import { Category } from "../shared/entity/category";
import { NotificationsService } from "angular2-notifications";
import { ErrorDetail } from "../shared/entity/error-detail";
import { AddMenu } from "../shared/entity/add-menu";

@Component({
  selector: 'categories-list',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  public categories: Category[];
  public addMenu: AddMenu = new AddMenu();

  constructor(private categoryService: CategoryService,
              private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.categoryService.findAll().subscribe(
      categories => this.categories = categories
    );
  }

  private deleteCategory(id: number) {
    this.categoryService.delete(id).subscribe(
      next => {
      },
      error => {
        var errorDetail: ErrorDetail = JSON.parse(error._body);
        if (errorDetail.code == 1451) {
          this.notificationService.error('Error', 'Can not delete, this category is being used!');
        }
        else {
          this.notificationService.error('Error', errorDetail.detail);
        }
      },
      () => {
        this.categoryService.findAll().subscribe(
          categories => {
            this.categories = categories;
            this.notificationService.success('Delete', 'Category has been deleted successfully.');
          }
        );
      }
    );
  }
}


