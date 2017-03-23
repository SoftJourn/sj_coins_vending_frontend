import {Component, OnInit, Input, ViewChild} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {DropdownQuestion} from "../../../shared/dynamic-form/question/question-dropdown";
import {TextboxQuestion} from "../../../shared/dynamic-form/question/question-textbox";
import {DynamicFormComponent} from "../../../shared/dynamic-form/dynamic-form.component";

@Component({
  selector: 'app-nutrition-facts-form',
  templateUrl: './nutrition-facts-form.component.html',
  styleUrls: ['./nutrition-facts-form.component.scss']
})
export class NutritionFactsFormComponent implements OnInit {

  @Input() nutritionFacts;
  @ViewChild("dynamicForm") dynamicForm: DynamicFormComponent;
  // @ViewChild("new-fact") newNutritionFactInput: HTMLInputElement;
  questions: any[];
  newFactName: string = "";

  constructor() {
  }

  ngOnInit() {
    this.buildDefaultForm();
  }

  addNutritionFact() {
    let question = new TextboxQuestion({
      key: this.newFactName,
      label: this.newFactName,
      type: 'text',
      removable: true
    });
    this.dynamicForm.addQuestion(question);
    this.newFactName = "";
  }

  private buildDefaultForm() {
    // (Calories, Fat, Saturates, Protein, Carbohydrates, Sugars, Salt, Fibre (g and %))
    this.questions = [

      new TextboxQuestion({
        key: 'calories',
        label: 'Calories',
        order: 1
      }),

      new TextboxQuestion({
        key: 'fat',
        label: 'Fat',
        order: 2
      }),

      new TextboxQuestion({
        key: 'saturates',
        label: 'Saturates',
        order: 3
      }),

      new TextboxQuestion({
        key: 'protein',
        label: 'Protein',
        order: 4
      }),

      new TextboxQuestion({
        key: 'carbohydrates',
        label: 'Carbohydrates',
        order: 5
      }),

      new TextboxQuestion({
        key: 'sugars',
        label: 'Sugars',
        order: 6
      }),

      new TextboxQuestion({
        key: 'salt',
        label: 'Salt',
        order: 7
      }),

      new TextboxQuestion({
        key: 'fibre',
        label: 'Fibre',
        order: 8
      })
    ];
  }

  get form(): FormGroup {
    let resultFormGroup = new FormGroup({});
    if (this.dynamicForm && this.dynamicForm.form) {
      let formGroup = this.dynamicForm.form;
      let data = formGroup.getRawValue();
      for(let property in data ){
        if(data[property].localeCompare("") !=0 ){
          resultFormGroup.addControl(property,formGroup.get(property))
        }
      }
    }
    return resultFormGroup;
  }
}

