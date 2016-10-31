import { Component, OnInit, EventEmitter, trigger, state, style, transition, animate } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {Category} from "../../shared/entity/category";
import {CategoryService} from "../../shared/services/category.service";
import {NotificationsService} from "angular2-notifications/components";
import {ErrorDetail} from "../../shared/entity/error-detail";
import { FormValidationStyles } from "../../shared/form-validation-styles";
import { Router } from "@angular/router";
import { Response } from "@angular/http";
import { Output, Input } from "@angular/core/src/metadata/directives";

@Component({
  selector: 'add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
  animations:[
    trigger('menuState',[
      state('shown',style({
        display:'block'
      })),
      state('hidden',style({
        display:'none',
      })),
      transition('shown <=> hidden',[animate('100ms ease-out')])
    ])
  ]
})
export class AddCategoryComponent implements OnInit {
  form: FormGroup;
  formStyles: FormValidationStyles;
  @Input() isVisible : boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() categoryChange = new EventEmitter<boolean>();
  visibility = 'hidden';

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(){
    this.visibility = this.isVisible ? 'shown' : 'hidden';
  }

  private buildForm(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z\u0400-\u04FF]+[a-zA-Z \u0400-\u04FF]*[a-zA-Z\u0400-\u04FF]+$')
      ])
    });

    this.formStyles = new FormValidationStyles(this.form);
  }

  submit() {
    let category = new Category(this.form.get('name').value);
    this.categoryService.save(category)
      .subscribe(
        category => {
          this.notificationService.success('Create', 'Category has been created successfully');
          this.form.reset({
            name: ''
          });
          this.categoryChange.emit(true);
        },
        (error: Response) => {
          let errorDetail: ErrorDetail = error.json();
          if (errorDetail.code == 1062) {
            this.notificationService.error('Error', 'Such category name exists!');
          }
          else {
            this.notificationService.error('Error', errorDetail.detail);
          }
        });
  }

  cancel(): void {
    this.isVisible=false;
    this.isVisibleChange.emit(this.isVisible);
  }

}
