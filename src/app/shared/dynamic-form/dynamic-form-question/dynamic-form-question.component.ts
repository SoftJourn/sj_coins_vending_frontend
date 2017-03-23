import {Component, Input} from '@angular/core';
import {FormGroup}        from '@angular/forms';
import {QuestionBase} from "../question/question-base";


@Component({
  selector: 'df-question',
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;

  get isValid() {
    let control = this.form.controls[this.question.key];
    return control ? control.valid : false;
  }
}
