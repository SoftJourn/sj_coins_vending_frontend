import {Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges} from "@angular/core";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {DropdownQuestion} from "../../../shared/dynamic-form/question/question-dropdown";
import {TextboxQuestion} from "../../../shared/dynamic-form/question/question-textbox";
import {DynamicFormComponent} from "../../../shared/dynamic-form/dynamic-form.component";
import {NotificationsManager} from "../../../shared/notifications.manager";

@Component({
  selector: 'app-nutrition-facts-form',
  templateUrl: './nutrition-facts-form.component.html',
  styleUrls: ['./nutrition-facts-form.component.scss']
})
export class NutritionFactsFormComponent implements OnInit, OnChanges {

  @Input() nutritionFacts;
  @ViewChild("dynamicForm") dynamicForm: DynamicFormComponent;

  questions: any[];
  newFactName: string = "";
  newFactNameControl: FormControl = new FormControl("", [Validators.required, Validators.maxLength(20)]);

  constructor(public notify: NotificationsManager) {
  }

  ngOnInit() {
    this.buildDefaultForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let keys = Object.keys(this.nutritionFacts);
    keys.forEach(key => this.updateProperty(key))

  }

  addNutritionFact() {
    let question = NutritionFactsFormComponent.buildTextQuestion(this.newFactName);
    try {
      this.dynamicForm.addQuestion(question);
    } catch (error) {
      this.notify.errorFactNameDuplicate()
    }
    this.newFactName = "";
  }

  removeCustomAddFacts(){
    this.dynamicForm.removeAllRemovable();
  }

  private updateProperty(key: string) {
    let value = this.nutritionFacts[key];
    if (!value)
      return;
    let control = this.dynamicForm.form.get(key);
    if (control) {
      control.patchValue(value);
    } else {
      this.dynamicForm.addQuestion(NutritionFactsFormComponent.buildTextQuestion(key, value))
    }
  }

  private static buildTextQuestion(key: string, value = '', removable = true): TextboxQuestion {
    return new TextboxQuestion({
      key: key,
      label: key,
      type: 'text',
      value: value,
      removable: removable
    });
  }

  private buildDefaultForm() {
    // (Calories, Fat, Saturates, Protein, Carbohydrates, Sugars, Salt, Fibre (g and %))
    this.questions = [

      new TextboxQuestion({
        key: 'Calories',
        label: 'Calories',
        order: 1
      }),

      new TextboxQuestion({
        key: 'Fat',
        label: 'Fat',
        order: 2
      }),

      new TextboxQuestion({
        key: 'Saturates',
        label: 'Saturates',
        order: 3
      }),

      new TextboxQuestion({
        key: 'Protein',
        label: 'Protein',
        order: 4
      }),

      new TextboxQuestion({
        key: 'Carbohydrates',
        label: 'Carbohydrates',
        order: 5
      }),

      new TextboxQuestion({
        key: 'Sugars',
        label: 'Sugars',
        order: 6
      }),

      new TextboxQuestion({
        key: 'Salt',
        label: 'Salt',
        order: 7
      }),

      new TextboxQuestion({
        key: 'Fibre',
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
      for (let property in data) {
        if (data[property] && data[property].localeCompare("") != 0) {
          resultFormGroup.addControl(property, formGroup.get(property))
        }
      }
    }
    return resultFormGroup;
  }
}

